WORLD CUP PREDICTION 2026 - VERSION 18.2 API SCORE + WINNER FIX

CORRIGE EXACTAMENTE:
- Botón Admin "Sincronizar API ahora" consulta football-data.org.
- /api/sync-results devuelve marcadores con matchId local.
- La web guarda esos marcadores en Firebase collection: results.
- La web muestra el score final del partido.
- La web muestra ganador del partido.
- La web calcula y muestra ganador de la polla.
- Mantiene Ronda de 32 visible hasta terminar toda la ronda.
- Mantiene ¥300 para 16avos.
- No borra apuestas existentes.

IMPORTANTE EN VERCEL:
Debe existir Environment Variable:
FOOTBALL_DATA_API_KEY = tu token de football-data.org

SUBIR:
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
https://world-cup-prediction-2026-26ej.vercel.app/?v=182apiwinner

ADMIN:
https://world-cup-prediction-2026-26ej.vercel.app/?admin=jorge&v=182apiwinner

EN ADMIN:
1. Presiona "Sincronizar API ahora".
2. Debe guardar resultados en Firebase.
3. Luego se verá score final y ganador de la polla.
