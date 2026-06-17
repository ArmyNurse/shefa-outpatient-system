import { getStore } from "@netlify/blobs";

exports.handler = async (event: any) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  try {
    const store = getStore("notes");

    if (event.httpMethod === "GET") {
      const data = await store.get("data", { type: "json" });
      return { statusCode: 200, headers, body: JSON.stringify(data || []) };
    }

    if (event.httpMethod === "POST") {
      const body = JSON.parse(event.body);
      await store.setJSON("data", body);
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    }

    return { statusCode: 404, headers, body: JSON.stringify({ error: "Not found" }) };
  } catch (err: any) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message || "Internal error" }) };
  }
};
