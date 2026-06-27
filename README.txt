WORLD CUP PREDICTION 2026 - VERSION 13.0 API FINAL STABLE

BASE:
- Trabajado sobre la versión que subiste.

CORRIGE / AGREGA:
- sync-results.js consulta football-data.org.
- La web guarda los resultados devueltos en Firebase/results.
- Marcadores finales aparecen automáticamente cuando la API los entrega.
- Ganador y puntos se recalculan con Firebase.
- Participantes despliega correctamente.
- El teclado del celular no se cierra al escribir scores.
- Cuenta regresiva sin redibujar inputs.
- Bloqueo automático al inicio del partido.
- Mantiene jugadores, apuestas y Firebase.

IMPORTANTE EN VERCEL:
Debe existir Environment Variable:
FOOTBALL_DATA_API_KEY = tu token de football-data.org

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
https://world-cup-prediction-2026-26ej.vercel.app/?v=130final
https://world-cup-prediction-2026-26ej.vercel.app/?admin=jorge&v=130final
https://world-cup-prediction-2026-26ej.vercel.app/api/sync-results?v=130
