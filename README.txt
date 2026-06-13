WORLD CUP PREDICTION 2026 - VERSION 8.5 DAILY API FINAL

NUEVO:
- API automática usando fixtures por fecha.
- Ya NO necesita API_FOOTBALL_LEAGUE_ID.
- Usa solo API_FOOTBALL_KEY en Vercel.
- Consulta ayer, hoy y mañana para detectar partidos finalizados.
- Cruza equipos por nombres/alias contra el calendario interno.
- Guarda resultados oficiales en Firebase.
- Calcula ranking y ganador por partido automáticamente.
- Sincroniza cada 15 minutos y también con botón admin.

Variables Vercel necesarias:
API_FOOTBALL_KEY = tu API key
API_FOOTBALL_MODE = daily-fixtures
API_FOOTBALL_TIMEZONE = UTC

Subir:
- assets
- api
- app.js
- index.html
- README.txt
- style.css

Luego:
1. Commit changes.
2. Esperar Vercel Ready.
3. Abrir:
   https://world-cup-prediction-2026-26ej.vercel.app/?admin=jorge
4. Presionar "Actualizar resultados API".
5. Probar también:
   https://world-cup-prediction-2026-26ej.vercel.app/api/sync-results
