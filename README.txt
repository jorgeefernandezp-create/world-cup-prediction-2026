WORLD CUP PREDICTION 2026 - VERSION 11.1 LOADING FIX

CORRIGE:
- La página quedaba en "Cargando calendario automático".
- El error era una llamada incorrecta a setLang/syncOpenFootball dentro de un script module.
- Ahora carga todas las fechas:
  grupos finales, Ronda de 32, Octavos, Cuartos, Semifinal, tercer puesto y Final.
- Mantiene API, Firebase, jugadores y apuestas.

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
https://world-cup-prediction-2026-26ej.vercel.app/?v=111fix
https://world-cup-prediction-2026-26ej.vercel.app/?admin=jorge&v=111fix
