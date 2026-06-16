WORLD CUP PREDICTION 2026 - VERSION 8.7 CLEAN FINAL FIX

NO BORRA FIREBASE:
- Mantiene players.
- Mantiene predictions.
- Mantiene results.
- Solo reemplaza archivos de la web.

CORRIGE:
- 404 en Vercel con vercel.json.
- Caché viejo con ?v=87clean.
- Lectura limpia de Firestore.
- Botón extra: Refrescar Firebase.
- Manual/API actualizan pantalla, ranking y ganador.

SUBIR TODO A GITHUB:
api
assets
app.js
index.html
style.css
README.txt
vercel.json
package.json

PROBAR:
https://world-cup-prediction-2026-26ej.vercel.app/?v=87clean
https://world-cup-prediction-2026-26ej.vercel.app/?admin=jorge&v=87clean
https://world-cup-prediction-2026-26ej.vercel.app/api/sync-results
