import { getStore } from "@netlify/blobs";

exports.handler = async (event: any) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  try {
    const store = getStore("doctors");

    if (event.httpMethod === "GET") {
      const data = await store.get("schedule", { type: "json" });
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(Array.isArray(data) ? data : []),
      };
    }

    if (event.httpMethod === "POST") {
      const body = JSON.parse(event.body);
      if (!Array.isArray(body)) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid data: expected array" }) };
      }
      await store.setJSON("schedule", body);
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    }

    return { statusCode: 404, headers, body: JSON.stringify({ error: "Not found" }) };
  } catch (err: any) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message || "Internal error" }) };
  }
};
