import { getStore } from "@netlify/blobs";

exports.handler = async (event: any) => {
  const headers = { "Content-Type": "application/json" };
  const store = getStore("notes");

  if (event.httpMethod === "GET") {
    const data = await store.get("data", { type: "json" });
    return { statusCode: 200, headers, body: JSON.stringify(data || []) };
  }

  if (event.httpMethod === "POST") {
    try {
      await store.setJSON("data", JSON.parse(event.body));
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    } catch {
      return { statusCode: 500, headers, body: JSON.stringify({ error: "Failed to save" }) };
    }
  }

  return { statusCode: 404, headers, body: JSON.stringify({ error: "Not found" }) };
};
