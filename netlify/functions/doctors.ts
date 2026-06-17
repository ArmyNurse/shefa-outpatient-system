const { getStore } = require("@netlify/blobs");

let initialData: any[] = [];
try {
  initialData = require("./initial-data.json");
} catch {
  initialData = [];
}
if (!Array.isArray(initialData)) initialData = [];

let memoryCache: any[] | null = null;
let store: any = null;

try {
  store = getStore("doctors");
} catch {}

exports.handler = async (event: any) => {
  const headers = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };

  try {
    if (event.httpMethod === "GET") {
      if (store) {
        try {
          const data = await store.get("schedule", { type: "json" });
          if (Array.isArray(data) && data.length > 0) {
            memoryCache = data;
            return { statusCode: 200, headers, body: JSON.stringify(data) };
          }
        } catch {}
      }
      return { statusCode: 200, headers, body: JSON.stringify(memoryCache || initialData) };
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
  } catch {
    return { statusCode: 200, headers, body: JSON.stringify(memoryCache || initialData) };
  }
};
