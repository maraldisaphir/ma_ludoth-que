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
  // optional bearer check
  const token = process.env.JEUX_API_TOKEN || "";
  const auth = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  if (token && auth !== token) return cors({ error: "Unauthorized" }, 401);

  const store = getStore("jeux");
  const { blobs } = await store.list();
  // return only keys
  const keys = blobs.map(b => b.key);
  return cors({ keys });
};
