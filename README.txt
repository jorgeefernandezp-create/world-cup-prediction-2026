WORLD CUP PREDICTION 2026 - VERSION 8.8 VERCEL PUBLIC FIX

CORRIGE:
- Error Vercel: No Output Directory named "public" found.
- Se elimina package.json para que Vercel NO ejecute npm build.
- El proyecto vuelve a publicarse como HTML/CSS/JS estático desde la raíz.
- Mantiene Firebase, API Football, apuestas, participantes y resultados.

SUBIR A GITHUB:
Sube/reemplaza:
api
assets
app.js
index.html
style.css
README.txt
vercel.json

IMPORTANTE:
Si en GitHub existe package.json, ELIMÍNALO.
No debe quedar package.json en el repositorio.

VERCEL:
Project Settings > Build and Deployment:
- Framework Preset: Other
- Build Command: vacío / sin override
- Output Directory: vacío / sin override
- Install Command: vacío / sin override
- Root Directory: vacío

PROBAR:
https://world-cup-prediction-2026-26ej.vercel.app/?v=88fix
https://world-cup-prediction-2026-26ej.vercel.app/?admin=jorge&v=88fix
https://world-cup-prediction-2026-26ej.vercel.app/api/sync-results
