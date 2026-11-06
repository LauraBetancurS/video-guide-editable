// 👉 AQUÍ SE REEMPLAZA ESTE CONTENIDO
// ESCENA 7 — Cierre (fondo azul)
// Voz: "La pregunta es: ¿cómo usamos esa señal sin que la baja digitalización se convierta en un nuevo
// riesgo?"
// "La pregunta es:" arriba y la pregunta en una tira amarilla. Abajo vuelve la tienda del inicio, ahora
// con una señal verde tenue (ondas) y un signo de pregunta naranja. Al final todo sube y aparecen la
// fuente y los logos.
import type { Frame, PostOverrides } from '../engine/scene';
import { C, Plate, at, burst, clamp, decor, doodle, drawLogos, ease, float, hexA, inn, kinetic, loadLogos, measureText, pop, spoken, tape, text, tornPaper, type KWordT } from './_kit';
import { shopFront } from './_datos';

export default class R7 extends Plate {
  logos: (HTMLImageElement | null)[] = [];
  a: KWordT[] = []; q: KWordT[][] = [];
  tSen = 0; tRies = 0; tOut = 0;
  override async load() { this.logos = await loadLogos(); }

  override setup() {
    const S = this.S, L = 'La pregunta es';
    this.prevBg = C.azul;
    this.a = spoken(S, L, 'La', 'es:');
    this.q = [spoken(S, L, 'cómo', 'señal'), spoken(S, L, 'sin', 'digitalización'), spoken(S, L, 'se', 'riesgo?')];
    this.tSen = S.word(L, 'señal').start;
    this.tRies = S.word(L, 'riesgo').start;
    this.tOut = S.line(L).end + 0.6;
  }

  draw(c: CanvasRenderingContext2D, t: number, _f: Frame): PostOverrides {
    const t0 = this.ctx.start;
    c.fillStyle = C.azul; c.fillRect(0, 0, 1920, 1080);
    decor(c, t, true, 161);
    const up = ease.inOutCubic(clamp((t - this.tOut) / 0.6));
    c.save(); c.translate(0, -90 * up);

    kinetic(c, t, this.a, 960, 120, { w: 700, size: 52, col: C.blanco, align: 'center' });

    // ---- la pregunta en tres renglones sobre una tira amarilla
    const qk = ease.outBack(clamp((t - this.q[0]![0]!.at + 0.15) / 0.45), 1.3);
    if (qk > 0) {
      const sp = measureText(c, ' ', 800, 58);
      const pw = Math.max(...this.q.map((ws) => ws.reduce((s, w) => s + measureText(c, w.s, 800, 58), 0) + sp * (ws.length - 1))) + 120;
      at(c, 960, 300, { s: qk, r: -0.01 }, () => tornPaper(c, pw, 250, C.amarillo, 162, { tear: 9 }));
      if (qk >= 1) tape(c, 960 - pw / 2 + 20, 185, 120, -0.5, undefined, 163);
      this.q.forEach((ws, i) => kinetic(c, t, ws, 960, 240 + i * 72, { w: 800, size: 58, col: C.azul, align: 'center' }));
    }

    // ---- la tienda con una señal verde tenue y un signo de pregunta
    const sk = ease.outBack(clamp((t - t0 - 0.1) / 0.55), 1.2);
    at(c, 900, 680 + float(t, 1, 3, 0.9), { s: 0.62 * sk }, () => shopFront(c, 560, 520, t, 'Tienda La Esquina'));
    const wk = inn(t, this.tSen, 0.5);
    for (let i = 0; i < 3; i++) {
      const ph = ((t * 0.8 + i / 3) % 1);
      c.strokeStyle = hexA(C.verde, wk * (0.35 + 0.4 * (1 - ph))); c.lineWidth = 8; c.lineCap = 'round';
      c.beginPath(); c.arc(1110, 560, 40 + i * 34, -Math.PI * 0.75, -Math.PI * 0.25); c.stroke();
    }
    const rk = pop(t, this.tRies - 0.05, 0.45);
    at(c, 1190, 690 + float(t, 3, 5, 1.3), { s: rk, r: 0.06 }, () => {
      c.fillStyle = C.naranja; c.beginPath(); c.arc(0, 0, 66, 0, Math.PI * 2); c.fill();
      text(c, '?', 0, 34, { w: 800, size: 100, col: C.blanco, align: 'center' });
    });
    burst(c, 1190, 690, t, this.tRies + 0.3, C.amarillo, 200, 12);
    doodle(c, 'star', 1700, 600, 32, C.amarillo, ease.inOutCubic(clamp((t - this.tRies) / 0.5)));
    doodle(c, 'spark', 230, 620, 26, C.blanco, ease.inOutCubic(clamp((t - this.tSen) / 0.5)));
    c.restore();

    // ---- fuente y logos
    const lk = inn(t, this.tOut + 0.3, 0.5);
    drawLogos(c, this.logos, 960, 930, lk);
    if (lk > 0) text(c, 'Fuente: Radar Trimestral ACH Q2 2026 · InnLab', 1880, 1030, { w: 500, size: 24, col: hexA(C.blanco, 0.8 * lk), align: 'right' });
    return {};
  }
}
