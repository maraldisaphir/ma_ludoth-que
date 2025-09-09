# 🎲 Mes Jeux — Gestion & Consultation (Netlify + Blobs)

Une application **mono-fichier** (frontend) avec **fonctions Netlify** pour stocker la BDD des jeux dans **Netlify Blobs**.

## 🚀 Démarrage rapide

```bash
npm i
npm run dev
# Ouvrez l'URL affichée par Netlify CLI
```

## 🗂️ Structure
```
public/
  index.html        # UI (responsive, clair/sombre, 2 onglets, consult par défaut)
functions/
  games-list.js     # GET  /api/games/list        -> { keys: [] }
  games-get.js      # GET  /api/games/get?key=... -> { key, data }
  games-put.js      # PUT  /api/games/put         -> body { key, data }
  games-delete.js   # DELETE /api/games/delete?key=...
netlify.toml        # Routes + config
package.json        # ESM + @netlify/blobs
```

## 🔐 Sécurité (optionnelle)
Les fonctions vérifient un jeton **Bearer** si la variable d’environnement `JEUX_API_TOKEN` est définie.

- Sur Netlify : **Site → Settings → Environment variables** → `JEUX_API_TOKEN=...`
- En local : créez un fichier `.env` à la racine et lancez `netlify dev` (le CLI charge les variables).

Côté frontend (`index.html`), vous pouvez définir `CONFIG.cloud.token = "..."` pour envoyer l’en-tête `Authorization: Bearer ...`.

## ☁️ Stockage (Netlify Blobs)
Les fonctions utilisent un **store** nommé `jeux` :
- `setJSON(key, data)` pour écrire
- `get(key, { type: "json" })` pour lire
- `list()` pour lister
- `delete(key)` pour supprimer

## 🖨️ Impression
Depuis l’onglet **Consulter**, utilisez le bouton **Imprimer** (CSS d’impression incluse).

## 🧪 Test rapide API (curl)
```bash
# Créer / mettre à jour
curl -X PUT http://localhost:8888/api/games/put   -H "Content-Type: application/json"   -d '{"key":"mes-jeux","data":{"params":{"types":"Cartes"},"items":[]}}'

# Récupérer
curl "http://localhost:8888/api/games/get?key=mes-jeux"

# Lister
curl "http://localhost:8888/api/games/list"

# Supprimer
curl -X DELETE "http://localhost:8888/api/games/delete?key=mes-jeux"
```

## 📝 Licence
MIT
