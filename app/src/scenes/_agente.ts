// 👉 AQUÍ SE REEMPLAZA ESTE CONTENIDO
// Íconos propios del video "Aprendizaje 5 · Insight 2" (agentes de IA): el agente (robot), un tiquete, una
// tarjeta, un comercio, un escudo de identidad y un interruptor. Se dibujan en el origen, de tamaño ~s.
import { C, clamp, hexA, rrect, text } from './_kit';

function ln(c: CanvasRenderingContext2D, col: string, lw: number) { c.strokeStyle = col; c.lineWidth = lw; c.lineCap = 'round'; c.lineJoin = 'round'; }

/** El agente de IA: cabeza de robot con antena, ojos que parpadean y una sonrisa. `t` para el parpadeo. */
export function robot(c: CanvasRenderingContext2D, s: number, t: number, o: { body?: string; face?: string; eye?: string; mood?: 'ok' | 'ouch' } = {}) {
  const body = o.body ?? C.azul, face = o.face ?? C.blanco, eye = o.eye ?? C.azul;
  // antena
  ln(c, body, s * 0.06);
  c.beginPath(); c.moveTo(0, -s * 0.42); c.lineTo(0, -s * 0.58); c.stroke();
  c.fillStyle = C.amarillo; c.beginPath(); c.arc(0, -s * 0.62, s * 0.07 * (1 + 0.15 * Math.sin(t * 6)), 0, Math.PI * 2); c.fill();
  // orejas
  c.fillStyle = body;
  rrect(c, -s * 0.56, -s * 0.12, s * 0.1, s * 0.26, s * 0.04); c.fill();
  rrect(c, s * 0.46, -s * 0.12, s * 0.1, s * 0.26, s * 0.04); c.fill();
  // cabeza y pantalla
  rrect(c, -s * 0.48, -s * 0.42, s * 0.96, s * 0.8, s * 0.22); c.fill();
  c.fillStyle = face; rrect(c, -s * 0.36, -s * 0.3, s * 0.72, s * 0.56, s * 0.16); c.fill();
  // ojos (parpadean cada ~3 s)
  const blink = (t * 0.33) % 1 > 0.96 ? 0.15 : 1;
  c.fillStyle = eye;
  if (o.mood === 'ouch') {
    ln(c, eye, s * 0.05);
    for (const sx of [-1, 1]) { c.beginPath(); c.moveTo(sx * s * 0.2 - s * 0.06, -s * 0.12); c.lineTo(sx * s * 0.2 + s * 0.06, -s * 0.02); c.moveTo(sx * s * 0.2 + s * 0.06, -s * 0.12); c.lineTo(sx * s * 0.2 - s * 0.06, -s * 0.02); c.stroke(); }
  } else {
    for (const sx of [-1, 1]) { c.beginPath(); c.ellipse(sx * s * 0.17, -s * 0.07, s * 0.065, s * 0.075 * blink, 0, 0, Math.PI * 2); c.fill(); }
  }
  // boca
  ln(c, eye, s * 0.045);
  c.beginPath();
  if (o.mood === 'ouch') { c.moveTo(-s * 0.1, s * 0.15); c.lineTo(s * 0.1, s * 0.15); }
  else c.arc(0, s * 0.06, s * 0.12, 0.2 * Math.PI, 0.8 * Math.PI);
  c.stroke();
}

/** Un tiquete de avión (rectángulo con muescas y un avioncito). */
export function ticket(c: CanvasRenderingContext2D, s: number, col: string = C.amarillo, ink: string = C.azul) {
  const w = s, h = s * 0.5, n = s * 0.07;
  c.beginPath();
  c.moveTo(-w / 2, -h / 2); c.lineTo(w / 2, -h / 2); c.lineTo(w / 2, -n);
  c.arc(w / 2, 0, n, -Math.PI / 2, Math.PI / 2, true);
  c.lineTo(w / 2, h / 2); c.lineTo(-w / 2, h / 2); c.lineTo(-w / 2, n);
  c.arc(-w / 2, 0, n, Math.PI / 2, -Math.PI / 2, true);
  c.closePath(); c.fillStyle = col; c.fill();
  ln(c, ink, s * 0.025); c.setLineDash([s * 0.04, s * 0.035]);
  c.beginPath(); c.moveTo(w * 0.18, -h / 2 + s * 0.05); c.lineTo(w * 0.18, h / 2 - s * 0.05); c.stroke(); c.setLineDash([]);
  // avioncito
  c.save(); c.translate(-w * 0.16, 0); c.rotate(-0.5); c.fillStyle = ink;
  c.beginPath(); c.ellipse(0, 0, s * 0.16, s * 0.035, 0, 0, Math.PI * 2); c.fill();
  c.beginPath(); c.moveTo(-s * 0.02, 0); c.lineTo(-s * 0.08, -s * 0.13); c.lineTo(s * 0.03, 0); c.lineTo(-s * 0.08, s * 0.13); c.closePath(); c.fill();
  c.restore();
  ln(c, ink, s * 0.03);
  c.beginPath(); c.moveTo(w * 0.27, -h * 0.15); c.lineTo(w * 0.42, -h * 0.15); c.moveTo(w * 0.27, h * 0.12); c.lineTo(w * 0.38, h * 0.12); c.stroke();
}

/** Una tarjeta de pago. */
export function card(c: CanvasRenderingContext2D, s: number, col: string = C.morado) {
  const w = s, h = s * 0.63;
  c.fillStyle = col; rrect(c, -w / 2, -h / 2, w, h, s * 0.08); c.fill();
  c.fillStyle = hexA(C.negro, 0.35); c.fillRect(-w / 2, -h * 0.22, w, h * 0.16);
  c.fillStyle = C.amarillo; rrect(c, -w * 0.38, h * 0.04, w * 0.18, h * 0.22, s * 0.025); c.fill();
  c.fillStyle = hexA(C.blanco, 0.85);
  for (let i = 0; i < 4; i++) { rrect(c, -w * 0.12 + i * w * 0.13, h * 0.26, w * 0.1, h * 0.06, 3); c.fill(); }
}

/** Un comercio (fachada con toldo de rayas). */
export function store(c: CanvasRenderingContext2D, s: number, col: string = C.azul) {
  const w = s, h = s * 0.8;
  c.fillStyle = col; rrect(c, -w / 2, -h * 0.25, w, h * 0.75, s * 0.03); c.fill();
  // toldo
  const n = 6;
  for (let i = 0; i < n; i++) {
    c.fillStyle = i % 2 ? C.blanco : C.naranja;
    const x0 = -w * 0.56 + (i * w * 1.12) / n;
    c.beginPath(); c.moveTo(x0, -h * 0.5); c.lineTo(x0 + (w * 1.12) / n, -h * 0.5); c.lineTo(x0 + (w * 1.12) / n, -h * 0.22);
    c.arc(x0 + (w * 1.12) / n / 2, -h * 0.22, (w * 1.12) / n / 2, 0, Math.PI); c.closePath(); c.fill();
  }
  // puerta y vitrina
  c.fillStyle = C.blanco; rrect(c, -w * 0.12, h * 0.02, w * 0.24, h * 0.48, s * 0.02); c.fill();
  c.fillStyle = hexA(C.blanco, 0.75); rrect(c, -w * 0.42, h * 0.02, w * 0.22, h * 0.22, s * 0.02); c.fill(); rrect(c, w * 0.2, h * 0.02, w * 0.22, h * 0.22, s * 0.02); c.fill();
}

/** Escudo de identidad con un chulo. */
export function shield(c: CanvasRenderingContext2D, s: number, col: string = C.verde, k = 1) {
  c.fillStyle = col;
  c.beginPath();
  c.moveTo(0, -s * 0.5); c.lineTo(s * 0.4, -s * 0.34); c.quadraticCurveTo(s * 0.42, s * 0.22, 0, s * 0.5);
  c.quadraticCurveTo(-s * 0.42, s * 0.22, -s * 0.4, -s * 0.34); c.closePath(); c.fill();
  if (k > 0) {
    ln(c, C.blanco, s * 0.09);
    const e = clamp(k);
    c.beginPath(); c.moveTo(-s * 0.17, 0);
    if (e < 0.4) c.lineTo(-s * 0.17 + (s * 0.12 * e) / 0.4, (s * 0.14 * e) / 0.4);
    else { c.lineTo(-s * 0.05, s * 0.14); c.lineTo(-s * 0.05 + s * 0.24 * ((e - 0.4) / 0.6), s * 0.14 - s * 0.3 * ((e - 0.4) / 0.6)); }
    c.stroke();
  }
}

/** Interruptor "humano | bot" (dos opciones, una sola elección). */
export function toggle(c: CanvasRenderingContext2D, t: number, w = 380, h = 84) {
  c.fillStyle = C.blanco; rrect(c, -w / 2, -h / 2, w, h, h / 2); c.fill();
  c.strokeStyle = C.gris1; c.lineWidth = 4; c.stroke();
  const side = Math.sin(t * 3) > 0 ? 1 : -1; // salta de un lado al otro: solo dos opciones
  c.fillStyle = C.gris2; rrect(c, side > 0 ? 6 : -w / 2 + 6, -h / 2 + 6, w / 2 - 12, h - 12, (h - 12) / 2); c.fill();
  text(c, 'Humano', -w / 4, 12, { w: 700, size: 32, col: C.negro, align: 'center' });
  text(c, 'Bot', w / 4, 12, { w: 700, size: 32, col: C.negro, align: 'center' });
}
