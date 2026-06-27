WORLD CUP PREDICTION 2026 - VERSION 15.0 KNOCKOUT CROSSING ENGINE

OBJETIVO ÚNICO:
- Agrega motor de cruces eliminatorios.
- No toca la API ni Firebase porque ya funcionan.
- Cuando un partido eliminatorio tiene resultado final, el ganador pasa automáticamente al siguiente partido.
- Semifinales también envían:
  ganador -> Final
  perdedor -> Tercer puesto.
- Si vuelves a sincronizar la API, los cruces se reconstruyen sin duplicar.
- Agrega botón admin: Reconstruir cruces.

MANTIENE:
- Marcador final.
- Ganador de la apuesta.
- Puntos.
- Participantes.
- Cuenta regresiva.
- Bloqueo de apuestas.
- Banderas.
- Firebase y API football-data.org.

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
https://world-cup-prediction-2026-26ej.vercel.app/?v=150cross
https://world-cup-prediction-2026-26ej.vercel.app/?admin=jorge&v=150cross

EN ADMIN:
1. Actualizar resultados API.
2. Reconstruir cruces.
