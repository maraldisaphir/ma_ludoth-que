import { getStore } from "@netlify/blobs";

function cors(json, status = 200) {
  return new Response(JSON.stringify(json), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
    },
  });
}

export default async (req, context) => {
  if (req.method === "OPTIONS") return cors({ ok: true });
  const token = process.env.JEUX_API_TOKEN || "";
  const auth = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  if (token && auth !== token) return cors({ error: "Unauthorized" }, 401);

  const url = new URL(req.url);
  const key = url.searchParams.get("key");
  if (!key) return cors({ error: "key required" }, 400);

  const store = getStore("jeux");
  const data = await store.get(key, { type: "json" });
  if (data == null) return cors({ error: "not found" }, 404);
  return cors({ key, data });
};
