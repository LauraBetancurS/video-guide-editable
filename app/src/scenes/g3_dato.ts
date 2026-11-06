// 👉 AQUÍ SE REEMPLAZA ESTE CONTENIDO
// ESCENA 3 — El dato (fondo papel)
// Voz: "Y no pasa solo en Colombia. Según el BIS, para 2024 ya había noventa y cinco jurisdicciones con
// algún marco de Open Banking u Open Finance."
// Un globo que gira con un pin en Colombia. Con "BIS" entra la etiqueta "BIS · 2024"; con "noventa y cinco"
// el contador sube hasta 95 mientras el globo se llena de puntos (uno por jurisdicción). Al final,
// "Open Banking · Open Finance" y la fuente REC-0250.
import type { Frame, PostOverrides } from '../engine/scene';
import { C, Plate, at, burst, clamp, decor, doodle, ease, float, hexA, icon, inn, kinetic, labelPill, pop, spoken, stampShake, tape, text, tornPaper, type KWordT } from './_kit';

const GX = 600, GY = 590, GR = 270;
/** Posición fija (lat, lon) de cada punto del globo, a partir de una semilla. */
const seed = (i: number, k: number) => { const v = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return v - Math.floor(v); };

export default class G3 extends Plate {
  head: KWordT[] = [];
  tCol = 0; tBis = 0; t2024 = 0; tNov = 0; tJur = 0; tOpen = 0; tFin = 0;
  override setup() {
    const S = this.S, L1 = 'Y no pasa solo', L2 = 'Según el BIS';
    this.prevBg = C.azul;
    this.revealFrom = { x: GX, y: GY };
    this.head = spoken(S, L1);
    this.tCol = S.word(L1, 'Colombia').start;
    this.tBis = S.word(L2, 'BIS').start;
    this.t2024 = S.word(L2, '2024').start;
    this.tNov = S.word(L2, 'noventa').start;
    this.tJur = S.word(L2, 'jurisdicciones').start;
    this.tOpen = S.word(L2, 'Open').start;
    this.tFin = S.word(L2, 'Finance').start;
  }

  draw(c: CanvasRenderingContext2D, t: number, _f: Frame): PostOverrides {
    const t0 = this.ctx.start;
    decor(c, t, false, 61);
    const [sx, sy] = stampShake(t, this.tJur + 0.1, 8);
    c.save(); c.translate(sx, sy);

    // ---- "Y no pasa solo en Colombia."
    kinetic(c, t, this.head, 960, 140, { w: 800, size: 64, col: C.azul, align: 'center' });

    // ---- el globo que gira
    const gk = ease.outBack(clamp((t - t0 - 0.15) / 0.55), 1.2);
    const rot = t * 0.35;
    // cuántas jurisdicciones van (sube con el contador)
    const ck = ease.outCubic(clamp((t - this.tNov) / (this.tJur + 0.4 - this.tNov)));
    const n = Math.round(95 * ck);
    at(c, GX, GY + float(t, 0, 5, 0.9), { s: gk }, () => {
      c.fillStyle = C.azul; c.beginPath(); c.arc(0, 0, GR, 0, Math.PI * 2); c.fill();
      c.save(); c.beginPath(); c.arc(0, 0, GR, 0, Math.PI * 2); c.clip();
      c.strokeStyle = hexA(C.blanco, 0.28); c.lineWidth = 3;
      for (let i = 0; i < 6; i++) { // meridianos
        const a = ((rot + (i * Math.PI) / 6) % Math.PI);
        c.beginPath(); c.ellipse(0, 0, Math.abs(Math.cos(a)) * GR, GR, 0, 0, Math.PI * 2); c.stroke();
      }
      for (const lat of [-0.5, 0, 0.5]) { c.beginPath(); c.ellipse(0, Math.sin(lat) * GR, Math.cos(lat) * GR, Math.cos(lat) * GR * 0.18, 0, 0, Math.PI * 2); c.stroke(); }
      // un punto por jurisdicción (solo los que miran hacia el frente)
      for (let i = 0; i < n; i++) {
        const lat = (seed(i, 1) - 0.5) * 2.2, lon = seed(i, 2) * Math.PI * 2 + rot;
        const z = Math.cos(lon) * Math.cos(lat);
        if (z < 0) continue;
        const x = Math.sin(lon) * Math.cos(lat) * GR, y = -Math.sin(lat) * GR;
        const born = clamp((ck * 95 - i) / 3);
        c.fillStyle = [C.amarillo, C.verde, C.blanco, C.naranja][i % 4]!;
        c.globalAlpha = 0.5 + 0.5 * z;
        c.beginPath(); c.arc(x, y, (6 + 4 * z) * ease.outBack(born, 2), 0, Math.PI * 2); c.fill();
        c.globalAlpha = 1;
      }
      c.restore();
      c.strokeStyle = C.blanco; c.lineWidth = 6; c.beginPath(); c.arc(0, 0, GR, 0, Math.PI * 2); c.stroke();
    });
    // pin en Colombia
    const pk = pop(t, this.tCol, 0.45);
    at(c, GX - 60, GY - 30 - 20 * Math.abs(Math.sin(t * 2.4)) * pk, { s: pk }, () => icon.pin(c, 90, C.amarillo, true));
    if (pk > 0) labelPill(c, 'Colombia', GX - 60, GY + 60, { fill: C.blanco, col: C.azul, size: 30, w: 800, alpha: clamp(pk) });

    // ---- columna derecha: BIS · 2024 → 95 → jurisdicciones → Open Banking · Open Finance
    const RX = 1390;
    const bk = pop(t, this.tBis - 0.05, 0.45);
    const pulse = t > this.t2024 && t < this.t2024 + 0.5 ? 0.12 * Math.sin(((t - this.t2024) / 0.5) * Math.PI) : 0;
    at(c, RX, 300 + float(t, 2, 4, 1.2), { s: bk * (1 + pulse), r: -0.02 }, () => {
      tornPaper(c, 420, 96, C.azul, 62);
      text(c, 'BIS · 2024', 0, 18, { w: 800, size: 52, col: C.blanco, align: 'center' });
    });
    const nk = ease.outBack(clamp((t - this.tNov + 0.05) / 0.45), 1.4);
    if (nk > 0) {
      at(c, RX, 540 + float(t, 3, 5, 1.1), { s: nk, r: 0.02 }, () => {
        tornPaper(c, 520, 290, C.amarillo, 63, { tear: 10 });
        text(c, String(n), 0, 85, { w: 800, size: 250, col: C.azul, align: 'center' });
      });
      if (nk >= 1) tape(c, RX + 230, 410, 120, 0.5, undefined, 64);
    }
    burst(c, RX, 540, t, this.tJur + 0.1, C.naranja, 300, 14);
    const jk = inn(t, this.tJur - 0.05, 0.4);
    if (jk > 0) text(c, 'jurisdicciones', RX, 760 + (1 - jk) * 24, { w: 800, size: 58, col: C.azul, align: 'center', alpha: jk });
    const ok = pop(t, this.tOpen - 0.05, 0.45);
    at(c, RX, 860 + float(t, 4, 4, 1.3), { s: ok }, () => labelPill(c, 'Open Banking · Open Finance', 0, 0, { fill: C.azul, col: C.blanco, size: 34, w: 700 }));
    const fk = inn(t, this.tFin + 0.3, 0.5);
    if (fk > 0) text(c, 'Fuente: BIS Papers 168 · REC-0250', 1880, 1030, { w: 500, size: 24, col: hexA(C.azul, 0.8 * fk), align: 'right' });
    doodle(c, 'star', 1760, 220, 30, C.morado, ease.inOutCubic(clamp((t - this.tJur) / 0.5)));
    c.restore();
    return {};
  }
}
