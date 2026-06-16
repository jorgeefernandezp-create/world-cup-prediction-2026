WORLD CUP PREDICTION 2026 - VERSION 8.6 RESULTS REFRESH FIX

CORRIGE:
- Resultado manual ahora actualiza la memoria local inmediatamente.
- API ahora actualiza la memoria local inmediatamente.
- Ranking y puntos se recalculan sin esperar al listener de Firebase.
- Se limpia resultsCache al leer Firestore para evitar datos viejos.
- API revisa más fechas: 2 días antes, ayer, hoy, mañana y 2 días después.
- Mensajes del panel admin muestran cuántos resultados guardó la API/manual.

SUBIR A GITHUB:
- assets
- api
- app.js
- index.html
- README.txt
- style.css

DESPUÉS:
1. Commit changes.
2. Espera Vercel Ready.
3. Abre:
   https://world-cup-prediction-2026-26ej.vercel.app/?v=86fix
4. Admin:
   https://world-cup-prediction-2026-26ej.vercel.app/?admin=jorge&v=86fix
5. Pulsa "Actualizar resultados API".
6. Si quieres guardar manual, cambia el score y pulsa "Guardar resultados".
