import { getStore } from "@netlify/blobs";

const LIFETIME_PASSWORDS = ["Mario1234%%%", "Treza@1234%%"];
const ONE_TIME_PASSWORDS = [
  "31gmj6", "ygk46o", "fz65u9", "x2p03s",
  "ygja5z", "3xloox", "x1uatt", "4glvf0",
  "awdeyx", "i1vppm", "mari12", "hs291n",
];

exports.handler = async (event: any) => {
  const headers = { "Content-Type": "application/json" };

  if (event.httpMethod !== "POST") {
    return { statusCode: 404, headers, body: JSON.stringify({ error: "Not found" }) };
  }

  try {
    const { password } = JSON.parse(event.body);

    if (LIFETIME_PASSWORDS.includes(password)) {
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true, type: "lifetime" }) };
    }

    if (ONE_TIME_PASSWORDS.includes(password)) {
      const store = getStore("passwords");
      const used: string[] = (await store.get("used", { type: "json" })) || [];
      if (used.includes(password)) {
        return { statusCode: 200, headers, body: JSON.stringify({ ok: false, error: "هذا الباسوورد مستخدم من قبل" }) };
      }
      used.push(password);
      await store.setJSON("used", used);
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true, type: "timed", expiresIn: 10 * 60 * 1000 }) };
    }

    return { statusCode: 200, headers, body: JSON.stringify({ ok: false, error: "باسوورد غير صحيح" }) };
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ ok: false, error: "Invalid request" }) };
  }
};
