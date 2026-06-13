WORLD CUP PREDICTION 2026 - VERSION 8.4 AUTO API SYNC

NUEVO:
- Agrega /api/sync-results como Vercel Function.
- Consulta API-FOOTBALL / API-SPORTS desde servidor.
- No expone la API key en app.js.
- Guarda resultados finales automáticamente en Firebase.
- Cruza resultado final vs pronósticos.
- Calcula puntos, ranking y ganador por partido.
- Mantiene el panel admin como respaldo.

NECESARIO EN VERCEL:
Project Settings > Environment Variables

API_FOOTBALL_KEY = tu clave de API-FOOTBALL
API_FOOTBALL_LEAGUE_ID = ID de la competición World Cup en API-FOOTBALL
API_FOOTBALL_SEASON = 2026

Luego:
1. Save variables.
2. Redeploy.
3. Abrir /?admin=jorge.
4. Presionar "Actualizar resultados API".
5. Si funciona, la web también sincroniza sola cada 10 minutos.

Subir:
- index.html
- style.css
- app.js
- README.txt
- assets
- carpeta api con sync-results.js
