export async function handler(event, context) {
  try {
    const key = event.queryStringParameters.key;
    if (!key) return { statusCode: 400, body: "Paramètre 'key' manquant" };
    const resp = await fetch(`https://api.netlify.com/api/v1/blobs/get/${encodeURIComponent(key)}`, {
      headers: { Authorization: `Bearer ${process.env.NETLIFY_BLOB_TOKEN}` }
    });
    if (!resp.ok) {
      return { statusCode: resp.status, body: await resp.text() };
    }
    const data = await resp.json();
    return { statusCode: 200, body: JSON.stringify({ key, data }) };
  } catch (e) {
    return { statusCode: 500, body: "Erreur get: " + e.message };
  }
}
