export async function handler(event, context) {
  try {
    const resp = await fetch("https://api.netlify.com/api/v1/blobs/list", {
      headers: { Authorization: `Bearer ${process.env.NETLIFY_BLOB_TOKEN}` }
    });
    if (!resp.ok) {
      return { statusCode: resp.status, body: await resp.text() };
    }
    const data = await resp.json();
    return { statusCode: 200, body: JSON.stringify({ keys: data.map(x => x.key) }) };
  } catch (e) {
    return { statusCode: 500, body: "Erreur list: " + e.message };
  }
}
