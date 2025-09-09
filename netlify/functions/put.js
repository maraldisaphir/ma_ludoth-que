export async function handler(event, context) {
  try {
    if (event.httpMethod !== "PUT") {
      return { statusCode: 405, body: "Méthode non autorisée" };
    }
    const { key, data } = JSON.parse(event.body);
    if (!key) return { statusCode: 400, body: "Paramètre 'key' manquant" };
    const resp = await fetch(`https://api.netlify.com/api/v1/blobs/set/${encodeURIComponent(key)}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NETLIFY_BLOB_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    if (!resp.ok) {
      return { statusCode: resp.status, body: await resp.text() };
    }
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (e) {
    return { statusCode: 500, body: "Erreur put: " + e.message };
  }
}
