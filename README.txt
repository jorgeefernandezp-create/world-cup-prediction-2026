WORLD CUP PREDICTION 2026 - VERSION 10.2 API CRASH FIX

CORRIGE:
- Error 500 INTERNAL_SERVER_ERROR en /api/sync-results.
- Faltaba una coma en api/sync-results.js antes de los partidos eliminatorios.
- Mantiene calendario completo de eliminatorias visible.
- Mantiene football-data.org.
- No borra Firebase ni apuestas.

SUBIR A GITHUB:
api
assets
app.js
index.html
style.css
README.txt
vercel.json

NO SUBIR:
package.json

PROBAR:
https://world-cup-prediction-2026-26ej.vercel.app/api/sync-results
https://world-cup-prediction-2026-26ej.vercel.app/?v=102fix
https://world-cup-prediction-2026-26ej.vercel.app/?admin=jorge&v=102fix
