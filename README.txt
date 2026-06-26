WORLD CUP PREDICTION 2026 - VERSION 9.1 SATURDAY FORWARD

OBJETIVO:
- Limpiar la web para que ya no muestre partidos anteriores.
- Mostrar solo partidos desde sábado 27/06/2026 en Japón en adelante.
- Mantener API football-data.org.
- Mantener Firebase.
- Mantener jugadores, apuestas y resultados anteriores guardados.
- NO borra nada de Firebase; solo oculta partidos antiguos de la pantalla pública.

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

VERCEL:
Ya tienes FOOTBALL_DATA_API_KEY. Solo sube y espera Ready.

PROBAR:
https://world-cup-prediction-2026-26ej.vercel.app/?v=91sat
https://world-cup-prediction-2026-26ej.vercel.app/?admin=jorge&v=91sat
https://world-cup-prediction-2026-26ej.vercel.app/api/sync-results

EN ADMIN:
1. Actualizar resultados API.
2. Recalcular ganador.
3. Refrescar Firebase si hace falta.

NOTA:
Los partidos anteriores quedan guardados en Firebase, pero ya no se muestran en la vista principal.
