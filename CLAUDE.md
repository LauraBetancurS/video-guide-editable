# CLAUDE.md — Video Guide · Foresight (Futuros Vivos, InnLab)

Plantilla para convertir insights del informe de Foresight en videos cortos animados por código (TypeScript + three.js + Canvas2D, bun + Vite), sincronizados con una voz en off. La usuaria habla español; responde en español, sin jerga, y explica los comandos de terminal paso a paso.

## Flujo de un video
1. **Guion** → `guion/<video>.md` (tabla) y `guion/voz.txt`: una frase por línea, exactamente como la dice la voz; `## nombre` separa escenas.
2. **Sin voz aún** → `python3 analysis/placeholder_vo.py` (tiempos provisionales + audio en silencio).
3. **Con voz** → guarda el original en `audio/voiceover_original.mp3`, crea `audio/voiceover.mp3` con `apad=pad_dur=3.5`, corre `analysis/align_vo.py` y luego `analysis/audio_vo.py`. Revisa la salida: tiempos en orden y palabras con sentido. Las siglas, números y palabras en inglés van en `SPOKEN`.
4. **Configuración** → `app/src/video.config.ts`: `SCENES` (archivo + frase `from`), `FOOTER`, `LOGOS`, `STYLE`.
5. **Escenas** → `app/src/scenes/<archivo>.ts`. Cada una extiende `Plate`, resuelve sus tiempos en `setup()` con `this.S.word(...)` / `spoken(...)` y dibuja en `draw(c, t)`. Toda la API está en `_kit.ts` (referencia en `docs/03-escenas.md`). Las escenas `d1`…`d7` son el demo y sirven de ejemplo.
6. **Exportar** → `cd app && bun run render` → `out/video.mp4`.

## Reglas
- **Sincronía:** ancla todo a palabras de la voz, nunca a segundos fijos. El texto en pantalla debe usar palabras que la voz dice.
- **Identidad Icesi:** azul `#5454E9` presente en cada escena; texto blanco sobre azul, o azul o negro sobre blanco; Plus Jakarta Sans. Las reglas completas están en `docs/01-guion.md`.
- **Movimiento:** nada queda quieto (`float`, personajes que respiran). Entradas de 0,3–0,5 s con ease-out; nada de temblor de cámara salvo un impacto puntual (`stampShake`).
- **Footer:** deja libre la esquina inferior izquierda (y ≈ 990–1040).
- **Determinismo:** las escenas deben ser funciones puras del tiempo, sin `Math.random()` ni `Date.now()`. Usa semillas (`vnoise`, `seed`).
- No toques `app/src/engine/` salvo que sea necesario. Ahí está el motor de pdoom-video (licencia MIT).

## Verificar antes de entregar
- Tipos: `cd app && npx tsc --noEmit -p tsconfig.json`.
- **Revisión visual:** levanta `bunx vite --port 5199` y captura cuadros con Playwright (`window.__pdoom.still(t)` y luego `window.__pdoom.png()` en `/?export=1`). Revisa que nada se salga del cuadro, choque con el footer o se tape. Con Chromium headless usa `--use-angle=swiftshader`.
- Al terminar, dile a la usuaria cómo verlo: `cd app && bunx vite`, luego Cmd + R en `http://localhost:5173`.

## Mapa del repo
- `guion/`: guiones y `voz.txt`.
- `audio/`, `data/`: la voz y los tiempos generados.
- `analysis/`: alineación (modelo wav2vec2 cuantizado en `analysis/models/`).
- `app/src/video.config.ts`: la configuración del video.
- `app/src/scenes/_kit.ts`: el kit (paleta, tipografía, `Plate`, `Script`, `kinetic`, íconos, `person`, `Cutout`, scrapbook, efectos, footer, logos).
- `app/public/`: fuentes, `logos/` (blancos, para fondo azul) y `personaje/` (poses y cabezas del kit ilustrado).
- `docs/`: guías para personas.
