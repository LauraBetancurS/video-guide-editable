// 👉 AQUÍ SE REEMPLAZA ESTE CONTENIDO
// Dibujos compartidos del video "Panorama general" (Futuros Vivos): polaroids, íconos de los 8 aprendizajes,
// los tres mundos (Fintech, Agrotech, modelos de negocio) y el navegador con la página del mapa.
import { C, hexA, rrect, tape, text, tornPaper } from './_kit';

/** Las ilustraciones de los 4 posibles futuros (app/public/ilustraciones/). */
export const FUTUROS = [
  { file: 'ilustraciones/esc-1.svg', label: 'Juntos negociamos', col: '#23804B' },
  { file: 'ilustraciones/esc-2.svg', label: 'Comodidad con precio', col: '#C24E22' },
  { file: 'ilustraciones/esc-3.svg', label: 'Dinero con reglas', col: '#3B3BC4' },
  { file: 'ilustraciones/esc-4.svg', label: 'Máquinas, no para todos', col: '#7348E0' },
];

/** Polaroid centrada en el origen: marco blanco, foto (imagen o dibujo) y pie de foto. */
export function polaroid(c: CanvasRenderingContext2D, w: number, photo: (pw: number, ph: number) => void, caption?: string, capCol: string = C.azul, seed = 1) {
  const pw = w - 28, ph = pw * (2 / 3), h = ph + 28 + (caption ? 70 : 28);
  c.save();
  c.shadowColor = 'rgba(40,30,20,0.28)'; c.shadowBlur = 20; c.shadowOffsetX = 6; c.shadowOffsetY = 10;
  c.fillStyle = C.blanco; c.fillRect(-w / 2, -h / 2, w, h);
  c.restore();
  c.save(); c.translate(-pw / 2, -h / 2 + 14);
  c.beginPath(); c.rect(0, 0, pw, ph); c.clip();
  photo(pw, ph);
  c.restore();
  if (caption) text(c, caption, 0, h / 2 - 26, { w: 800, size: Math.round(w * 0.065), col: capCol, align: 'center' });
  tape(c, 0, -h / 2 - 2, w * 0.36, -0.04 + (seed % 3) * 0.03, undefined, seed);
  return h;
}

/** Dibuja una imagen llenando (pw × ph). */
export function cover(c: CanvasRenderingContext2D, im: HTMLImageElement | null, pw: number, ph: number) {
  if (!im) { c.fillStyle = C.gris2; c.fillRect(0, 0, pw, ph); return; }
  const r = Math.max(pw / im.naturalWidth, ph / im.naturalHeight);
  const w = im.naturalWidth * r, h = im.naturalHeight * r;
  c.drawImage(im, (pw - w) / 2, (ph - h) / 2, w, h);
}

function ls(c: CanvasRenderingContext2D, col: string, lw: number) { c.strokeStyle = col; c.lineWidth = lw; c.lineCap = 'round'; c.lineJoin = 'round'; }

/** Íconos de línea de los 8 aprendizajes (mismos que la página web), centrados, tamaño ~s. */
export function aprIcon(c: CanvasRenderingContext2D, i: number, s: number, col: string) {
  const k = s / 24;
  c.save(); c.scale(k, k); c.translate(-12, -12); ls(c, col, 2.2);
  const P = (d: string) => c.stroke(new Path2D(d));
  switch (i) {
    case 1: P('M5 6m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0M19 6m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0M12 18m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0M7 6h10M6 8l5 8M18 8l-5 8'); break;
    case 2: P('M4 20V10M10 20V4M16 20v-7M22 20H2M14 6l3-3 3 3'); break;
    case 3: P('M12 3a9 9 0 1 0 0.01 0M8 12.5l2.5 2.5L16 9.5'); break;
    case 4: P('M4.5 3h4a1.5 1.5 0 0 1 1.5 1.5v4a1.5 1.5 0 0 1-1.5 1.5h-4A1.5 1.5 0 0 1 3 8.5v-4A1.5 1.5 0 0 1 4.5 3zM15.5 3h4a1.5 1.5 0 0 1 1.5 1.5v4a1.5 1.5 0 0 1-1.5 1.5h-4A1.5 1.5 0 0 1 14 8.5v-4A1.5 1.5 0 0 1 15.5 3zM4.5 14h4a1.5 1.5 0 0 1 1.5 1.5v4a1.5 1.5 0 0 1-1.5 1.5h-4A1.5 1.5 0 0 1 3 19.5v-4A1.5 1.5 0 0 1 4.5 14zM15.5 14h4a1.5 1.5 0 0 1 1.5 1.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a1.5 1.5 0 0 1-1.5-1.5v-4a1.5 1.5 0 0 1 1.5-1.5z'); break;
    case 5: P('M5 19c0-8 6-14 15-14 0 9-6 15-14 15M5 19c3-4 6-7 10-9'); break;
    case 6: P('M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 9a3 3 0 1 0 0.01 0'); break;
    case 7: P('M12 2l8.5 5v10L12 22l-8.5-5V7zM14.5 9.5c-.5-1-1.5-1.5-2.5-1.5-1.4 0-2.5.8-2.5 2s1.1 1.7 2.5 2 2.5.8 2.5 2-1.1 2-2.5 2c-1 0-2-.5-2.5-1.5M12 6.5v11'); break;
    default: P('M20 11a8 8 0 0 0-14.5-4.5L3 9M4 13a8 8 0 0 0 14.5 4.5L21 15M3 4v5h5M21 20v-5h-5');
  }
  c.restore();
}

/** Los 8 aprendizajes, con nombre corto. */
export const APRENDIZAJES = [
  'Todo conectado', 'Decidir con datos', 'Pagar por resultados', 'Una sola plataforma',
  'Demostrar lo sostenible', 'Reglas en tiempo real', 'Dinero digital', 'Negocios que se reinventan',
];

/** Moneda con "$" (Fintech). */
export function coin(c: CanvasRenderingContext2D, s: number, fill: string = C.amarillo) {
  c.beginPath(); c.arc(0, 0, s / 2, 0, Math.PI * 2); c.fillStyle = fill; c.fill();
  ls(c, C.azul, s * 0.06); c.stroke();
  text(c, '$', 0, s * 0.19, { w: 800, size: s * 0.55, col: C.azul, align: 'center' });
}
/** Hoja (Agrotech). */
export function leaf(c: CanvasRenderingContext2D, s: number, col: string = C.verde) {
  c.save(); c.rotate(-0.6);
  c.beginPath(); c.moveTo(0, -s / 2); c.quadraticCurveTo(s * 0.45, 0, 0, s / 2); c.quadraticCurveTo(-s * 0.45, 0, 0, -s / 2);
  c.fillStyle = col; c.fill();
  ls(c, C.blanco, s * 0.05); c.beginPath(); c.moveTo(0, -s * 0.4); c.lineTo(0, s * 0.42); c.stroke();
  c.restore();
}
/** Engranaje (modelos de negocio). */
export function gear(c: CanvasRenderingContext2D, s: number, col: string, t = 0) {
  c.save(); c.rotate(t * 0.6);
  const n = 8, r1 = s * 0.5, r2 = s * 0.38;
  c.beginPath();
  for (let i = 0; i < n * 2; i++) {
    const a0 = (i / (n * 2)) * Math.PI * 2, a1 = ((i + 1) / (n * 2)) * Math.PI * 2, r = i % 2 ? r2 : r1;
    c.lineTo(Math.cos(a0) * r, Math.sin(a0) * r); c.lineTo(Math.cos(a1) * r, Math.sin(a1) * r);
  }
  c.closePath(); c.fillStyle = col; c.fill();
  c.beginPath(); c.arc(0, 0, s * 0.16, 0, Math.PI * 2); c.fillStyle = C.blanco; c.fill();
  c.restore();
}

/** Mata con un sensor clavado en la tierra (ondas de señal). */
export function plantSensor(c: CanvasRenderingContext2D, s: number, t: number) {
  c.fillStyle = '#8A5A3B'; rrect(c, -s * 0.5, s * 0.28, s, s * 0.22, s * 0.05); c.fill();
  ls(c, C.verde, s * 0.05); c.beginPath(); c.moveTo(-s * 0.15, s * 0.3); c.lineTo(-s * 0.15, -s * 0.15); c.stroke();
  c.save(); c.translate(-s * 0.15, -s * 0.05); leaf(c, s * 0.35); c.restore();
  c.save(); c.translate(-s * 0.15, -s * 0.22); c.scale(-1, 1); leaf(c, s * 0.3); c.restore();
  c.fillStyle = C.gris1; c.fillRect(s * 0.2, -s * 0.02, s * 0.04, s * 0.32);
  c.fillStyle = C.naranja; rrect(c, s * 0.12, -s * 0.16, s * 0.2, s * 0.16, s * 0.03); c.fill();
  for (let i = 0; i < 3; i++) {
    const k = ((t * 0.9 + i / 3) % 1);
    ls(c, hexA(C.azul, 1 - k), s * 0.03);
    c.beginPath(); c.arc(s * 0.22, -s * 0.16, s * (0.08 + k * 0.26), -Math.PI * 0.85, -Math.PI * 0.15); c.stroke();
  }
}

/** Celular con contenido dibujado dentro. */
export function phone(c: CanvasRenderingContext2D, w: number, h: number, body: string, inner: (iw: number, ih: number) => void) {
  c.fillStyle = body; rrect(c, -w / 2, -h / 2, w, h, w * 0.14); c.fill();
  c.fillStyle = C.blanco; rrect(c, -w / 2 + w * 0.07, -h / 2 + h * 0.08, w * 0.86, h * 0.84, w * 0.06); c.fill();
  c.save(); c.translate(0, 0); inner(w * 0.86, h * 0.84); c.restore();
}

/** Tira de papel rasgado con texto centrado. Devuelve el ancho. */
export function strip(c: CanvasRenderingContext2D, s: string, size: number, fill: string, col: string, seed = 1, measure: (s: string, w: number, size: number) => number) {
  const w = measure(s, 800, size) + size * 1.2;
  tornPaper(c, w, size * 1.7, fill, seed, { tear: 8 });
  text(c, s, 0, size * 0.36, { w: 800, size, col, align: 'center' });
  return w;
}
