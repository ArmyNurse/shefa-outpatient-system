let store: any = null;
let storeError: string | null = null;

try {
  const blob = require("@netlify/blobs");
  store = blob.getStore("doctors");
} catch (e: any) {
  storeError = e?.message || "Failed to init store";
}

let memoryCache: any[] | null = null;

exports.handler = async (event: any) => {
  const headers = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };

  try {
    if (event.httpMethod === "GET") {
      if (store) {
        try {
          const data = await store.get("schedule", { type: "json" });
          return { statusCode: 200, headers, body: JSON.stringify(Array.isArray(data) ? data : []) };
        } catch {}
      }
      return { statusCode: 200, headers, body: JSON.stringify(memoryCache || []) };
    }

    if (event.httpMethod === "POST") {
      const body = JSON.parse(event.body);
      if (!Array.isArray(body)) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid data" }) };
      }
      memoryCache = body;
      if (store) {
        try { await store.setJSON("schedule", body); } catch {}
      }
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    }

    return { statusCode: 404, headers, body: JSON.stringify({ error: "Not found" }) };
  } catch (err: any) {
    return { statusCode: 200, headers, body: JSON.stringify(memoryCache || []) };
  }
};
