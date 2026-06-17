WORLD CUP PREDICTION 2026 - VERSION 9.0 FOOTBALL-DATA FINAL

CAMBIO PRINCIPAL:
- Se reemplaza API-Football por football-data.org.
- Usa variable Vercel: FOOTBALL_DATA_API_KEY.
- Header usado: X-Auth-Token.
- Mantiene Firebase y todas las apuestas ya hechas.

IMPORTANTE:
- NO borra players.
- NO borra predictions.
- NO borra results.
- package.json NO debe existir en GitHub.

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

EN VERCEL:
Settings > Environment Variables:
FOOTBALL_DATA_API_KEY = tu token de football-data.org

Luego Redeploy.

PROBAR:
https://world-cup-prediction-2026-26ej.vercel.app/api/sync-results
https://world-cup-prediction-2026-26ej.vercel.app/?admin=jorge&v=90fd

EN ADMIN:
1. Pulsa Actualizar resultados API.
2. Pulsa Recalcular ganador.
3. Pulsa Refrescar Firebase si hace falta.

NOTA:
Si football-data todavía no entrega Mundial 2026 para el plan gratuito,
la función incluye fallback temporal para partidos ya finalizados de prueba,
para que la web muestre scores y calcule ganadores.
