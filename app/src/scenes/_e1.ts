// 👉 AQUÍ SE REEMPLAZA ESTE CONTENIDO
// Ayudas 2D del video "Escenario 1 · La red cooperativa" (encima del mundo 3D).
import { C, at, measureText, text, tornPaper, pop } from './_kit';
import type { Mundo } from './_mundo3d';

/** Tira de papel rasgado con texto centrado. Devuelve el ancho. */
export function tira(c: CanvasRenderingContext2D, s: string, size: number, fill: string, col: string, seed = 1) {
  const w = measureText(c, s, 800, size) + size * 1.2;
  tornPaper(c, w, size * 1.7, fill, seed, { tear: 8 });
  text(c, s, 0, size * 0.36, { w: 800, size, col, align: 'center' });
  return w;
}
/** Etiqueta que sigue a un punto 3D (pastilla blanca con un palito hacia el objeto). */
export function etiqueta3d(c: CanvasRenderingContext2D, m: Mundo, p: [number, number, number], s: string, t: number, t0: number, fill: string = C.blanco, col: string = C.azul) {
  const k = pop(t, t0, 0.4);
  if (k <= 0) return;
  const q = m.pantallaDe(...p);
  if (!q.visible) return;
  const w = measureText(c, s, 800, 26) + 36;
  at(c, q.x, q.y - 70, { s: k }, () => {
    c.strokeStyle = fill; c.lineWidth = 3; c.beginPath(); c.moveTo(0, 22); c.lineTo(0, 64); c.stroke();
    c.save(); c.shadowColor = 'rgba(20,20,60,0.25)'; c.shadowBlur = 10; c.shadowOffsetY = 4;
    c.fillStyle = fill; c.beginPath(); c.roundRect(-w / 2, -22, w, 44, 22); c.fill(); c.restore();
    text(c, s, 0, 9, { w: 800, size: 26, col, align: 'center' });
  });
}
