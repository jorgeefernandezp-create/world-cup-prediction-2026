WORLD CUP PREDICTION 2026 - VERSION 7 MOBILE APP

NUEVO:
- Diseño móvil tipo app.
- Encabezado más compacto.
- Pozo y participantes en una sola sección.
- Se elimina la tarjeta separada del pozo.
- Lista de participantes desplegable con scroll.
- Barra inferior fija para navegación.
- Fondo más limpio tipo estadio.
- Mantiene cuenta regresiva, confeti y ganador por partido.

Subir a GitHub:
1. Reemplaza index.html, style.css, app.js y README.txt.
2. Commit changes.
3. Espera Vercel Ready.
4. Abre desde celular.


VERSION 7.1 FIX:
- Corrige el problema donde el score se borraba mientras el usuario escribía.
- La cuenta regresiva ahora actualiza solo el texto del contador, no toda la tarjeta.


VERSION 7.2:
- Diseño más limpio para celular.
- Menos azul, fondo más claro y premium.
- Se eliminaron efectos pesados para que no se vea recargado.
- Mantiene la lógica de score corregida.


VERSION 7.3 FINAL:
- Fondo real de estadio usando la imagen enviada por Jorge.
- Diseño deportivo y limpio para celular.
- Arreglo para que al abrir siempre comience arriba, no en el pozo.
- Mantiene fix para que el score no se borre mientras escribes.


VERSION 7.4:
- Fondo del estadio ajustado para que se vea más la cancha verde.
- Menos capa oscura.
- Tarjetas un poco más transparentes.


VERSION 8.0 FIREBASE FINAL:
- Pronósticos se guardan en Firebase.
- Al actualizar la página, el score guardado se recupera y aparece otra vez.
- Se recuerda el partido y fecha seleccionados.
- Ranking y ganador se calculan por partido desde Firebase.
- Mantiene fondo de estadio verde y diseño móvil.


VERSION 8.1 JAPAN TIME FIX:
- Corrige conversión de horarios del Mundial a hora de Japón (JST).
- Interpreta ET/EDT como UTC-4 y UTC correctamente.
- Muestra fecha/hora en Asia/Tokyo.
- El bloqueo se activa solo cuando el inicio real del partido ya pasó.
