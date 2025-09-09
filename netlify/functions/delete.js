export async function handler(event, context) {
  try {
    const key = event.queryStringParameters.key;
    if (!key) return { statusCode: 400, body: "Paramètre 'key' manquant" };
    const resp = await fetch(`https://api.netlify.com/api/v1/blobs/delete/${encodeURIComponent(key)}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${process.env.NETLIFY_BLOB_TOKEN}` }
    });
    if (!resp.ok) {
      return { statusCode: resp.status, body: await resp.text() };
    }
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (e) {
    return { statusCode: 500, body: "Erreur delete: " + e.message };
  }
}
