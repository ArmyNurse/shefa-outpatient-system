exports.handler = async (event: any) => {
  const headers = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };

  try {
    const { getStore } = require("@netlify/blobs");

    let blobOk = false;
    let blobError: string | null = null;
    let readOk = false;
    let writeOk = false;

    try {
      const store = getStore("doctors");
      blobOk = true;

      try {
        const data = await store.get("schedule", { type: "json" });
        readOk = true;
      } catch (e: any) {
        blobError = "read: " + (e?.message || String(e));
      }

      try {
        await store.setJSON("test-key", { test: true });
        writeOk = true;
        await store.delete("test-key");
      } catch (e: any) {
        blobError = (blobError ? blobError + "; " : "") + "write: " + (e?.message || String(e));
      }
    } catch (e: any) {
      blobError = "getStore: " + (e?.message || String(e));
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        node: process.version,
        siteId: process.env.SITE_ID || "not set",
        blobOk,
        readOk,
        writeOk,
        error: blobError,
      }),
    };
  } catch (e: any) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: e?.message || String(e) }),
    };
  }
};
