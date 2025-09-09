import { getStore } from "@netlify/blobs";

function cors(json, status = 200) {
  return new Response(JSON.stringify(json), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Methods": "PUT, OPTIONS",
    },
  });
}

export default async (req, context) => {
  if (req.method === "OPTIONS") return cors({ ok: true });
  if (req.method !== "PUT") return cors({ error: "Method not allowed" }, 405);

  const token = process.env.JEUX_API_TOKEN || "";
  const auth = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  if (token && auth !== token) return cors({ error: "Unauthorized" }, 401);

  let body;
  try {
    body = await req.json();
  } catch {
    return cors({ error: "Invalid JSON" }, 400);
  }
  const { key, data } = body || {};
  if (!key || data == null) return cors({ error: "key and data required" }, 400);

  const store = getStore("jeux");
  await store.setJSON(key, data);
  return cors({ ok: true, key });
};
