const LIFETIME_PASSWORDS = ["Mario1234%%%", "Treza@1234%%"];
const ONE_TIME_PASSWORDS = [
  "31gmj6", "ygk46o", "fz65u9", "x2p03s",
  "ygja5z", "3xloox", "x1uatt", "4glvf0",
  "awdeyx", "i1vppm", "mari12", "hs291n",
];

const usedPasswords = new Set<string>();

exports.handler = async (event: any) => {
  const headers = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };

  if (event.httpMethod !== "POST") {
    return { statusCode: 404, headers, body: JSON.stringify({ error: "Not found" }) };
  }

  try {
    const { password } = JSON.parse(event.body);

    if (LIFETIME_PASSWORDS.includes(password)) {
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true, type: "lifetime" }) };
    }

    if (ONE_TIME_PASSWORDS.includes(password)) {
      if (usedPasswords.has(password)) {
        return { statusCode: 200, headers, body: JSON.stringify({ ok: false, error: "هذا الباسوورد مستخدم من قبل" }) };
      }
      usedPasswords.add(password);
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true, type: "timed", expiresIn: 10 * 60 * 1000 }) };
    }

    return { statusCode: 200, headers, body: JSON.stringify({ ok: false, error: "باسوورد غير صحيح" }) };
  } catch {
    return { statusCode: 200, headers, body: JSON.stringify({ ok: false, error: "خطأ في التحقق" }) };
  }
};
