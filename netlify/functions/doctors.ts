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
let storeInitError: string | null = null;

try {
  store = getStore("doctors");
} catch (e: any) {
  storeInitError = e?.message || String(e);
}

function addBlobHeaders(h: Record<string, string>) {
  h["X-Blob-Available"] = String(!!store);
  if (storeInitError) h["X-Blob-Error"] = storeInitError;
  return h;
}

exports.handler = async (event: any) => {
  const headers = addBlobHeaders({ "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });

  try {
    if (event.httpMethod === "GET") {
      if (store) {
        try {
          const data = await store.get("schedule", { type: "json" });
          if (Array.isArray(data) && data.length > 0) {
            memoryCache = data;
            return { statusCode: 200, headers, body: JSON.stringify(data) };
          }
        } catch (e: any) {
          headers["X-Blob-Read-Error"] = e?.message || String(e);
        }
      }
      return { statusCode: 200, headers, body: JSON.stringify(memoryCache || initialData) };
    }

    if (event.httpMethod === "POST") {
      const body = JSON.parse(event.body);
      if (!Array.isArray(body)) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid data" }) };
      }
      memoryCache = body;
      let blobSaved = false;
      if (store) {
        try {
          await store.setJSON("schedule", body);
          blobSaved = true;
        } catch (e: any) {
          headers["X-Blob-Write-Error"] = e?.message || String(e);
        }
      }
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true, blob: blobSaved }) };
    }

    return { statusCode: 404, headers, body: JSON.stringify({ error: "Not found" }) };
  } catch (e: any) {
    headers["X-Fatal-Error"] = e?.message || String(e);
    return { statusCode: 200, headers, body: JSON.stringify(memoryCache || initialData) };
  }
};
