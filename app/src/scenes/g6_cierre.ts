// 👉 AQUÍ SE REEMPLAZA ESTE CONTENIDO
// ESCENA 6 — Cierre (fondo azul)
// Voz: "La pregunta para ACH es: ¿quién va a orquestar esa confianza entre industrias?"
// "La pregunta para ACH es:" arriba y la pregunta en una tira amarilla. Abajo, una red: banco, comercio,
// aseguradoras y vivienda se conectan a un centro vacío con un signo de pregunta (el que
// orquesta la confianza). Al final todo sube y aparecen la fuente y los logos.
import type { Frame, PostOverrides } from '../engine/scene';
import { C, Plate, at, burst, clamp, decor, doodle, drawLogos, ease, float, hexA, inn, kinetic, loadLogos, measureText, pop, ripple, spoken, strokeTrim, tape, text, tornPaper, pt, type KWordT } from './_kit';
import { shield, store } from './_agente';
import { bank, house } from './_datos';

const NX = 960, NY = 610;

export default class G6 extends Plate {
  logos: (HTMLImageElement | null)[] = [];
  a: KWordT[] = []; q1: KWordT[] = []; q2: KWordT[] = [];
  tOrq = 0; tConf = 0; tInd = 0; tOut = 0;
  override async load() { this.logos = await loadLogos(); }

  override setup() {
    const S = this.S, L = 'La pregunta para ACH';
    this.prevBg = C.blanco;
    this.a = spoken(S, L, 'La', 'es');
    this.q1 = spoken(S, L, 'quién', 'orquestar');
    this.q2 = spoken(S, L, 'esa', 'industrias');
    this.tOrq = S.word(L, 'orquestar').start;
    this.tConf = S.word(L, 'confianza').start;
    this.tInd = S.word(L, 'industrias').start;
    this.tOut = S.line(L).end + 0.6;
  }

  draw(c: CanvasRenderingContext2D, t: number, _f: Frame): PostOverrides {
    c.fillStyle = C.azul; c.fillRect(0, 0, 1920, 1080);
    decor(c, t, true, 91);
    const up = ease.inOutCubic(clamp((t - this.tOut) / 0.6));
    c.save(); c.translate(0, -90 * up);

    // ---- "La pregunta para ACH es:"
    kinetic(c, t, this.a, 960, 130, { w: 700, size: 52, col: C.blanco, align: 'center' });

    // ---- la pregunta en una tira amarilla
    const qk = ease.outBack(clamp((t - this.q1[0]!.at + 0.15) / 0.45), 1.3);
    if (qk > 0) {
      const w1 = this.q1.reduce((s, w) => s + measureText(c, w.s, 800, 64), 0) + measureText(c, ' ', 800, 64) * (this.q1.length - 1);
      const w2 = this.q2.reduce((s, w) => s + measureText(c, w.s, 800, 64), 0) + measureText(c, ' ', 800, 64) * (this.q2.length - 1);
      const pw = Math.max(w1, w2) + 120;
      at(c, 960, 275, { s: qk, r: -0.012 }, () => tornPaper(c, pw, 190, C.amarillo, 92, { tear: 9 }));
      if (qk >= 1) tape(c, 960 - pw / 2 + 20, 190, 120, -0.5, undefined, 93);
      kinetic(c, t, this.q1, 960, 258, { w: 800, size: 64, col: C.azul, align: 'center' });
      kinetic(c, t, this.q2, 960, 334, { w: 800, size: 64, col: C.azul, align: 'center' });
    }

    // ---- la red de industrias alrededor de un centro vacío
    const nodes: [string, (s: number) => void, number, number][] = [
      ['Bancos', (s) => bank(c, s, C.azul), -600, -40],
      ['Comercio', (s) => store(c, s, C.azul), -330, 140],
      ['Aseguradoras', (s) => shield(c, s, C.verde, 1), 330, 140],
      ['Vivienda', (s) => house(c, s, C.azul), 600, -40],
    ];
    const ck = pop(t, this.tOrq - 0.1, 0.5);
    nodes.forEach(([label, ic, dx, dy], i) => {
      const tn = this.tOrq + i * 0.12;
      const lk = ease.inOutCubic(clamp((t - this.tInd - i * 0.06) / 0.45));
      if (lk > 0) {
        c.save(); c.strokeStyle = hexA(C.amarillo, 0.9); c.lineWidth = 5; c.setLineDash([12, 12]); c.lineDashOffset = -t * 40;
        strokeTrim(c, [pt(NX + dx, NY + dy), pt(NX, NY)], lk); c.restore();
      }
      const k = pop(t, tn, 0.45);
      at(c, NX + dx, NY + dy + float(t, i, 5, 1.2), { s: k }, () => {
        c.fillStyle = C.blanco; c.beginPath(); c.arc(0, 0, 70, 0, Math.PI * 2); c.fill();
        ic(80);
        text(c, label, 0, 112, { w: 700, size: 30, col: C.blanco, align: 'center' });
      });
    });
    // el centro: ¿quién orquesta?
    const pulse = t > this.tConf && t < this.tConf + 0.5 ? 0.12 * Math.sin(((t - this.tConf) / 0.5) * Math.PI) : 0;
    at(c, NX, NY + float(t, 9, 4, 1.4), { s: ck * (1 + pulse) }, () => {
      c.fillStyle = C.amarillo; c.beginPath(); c.arc(0, 0, 95, 0, Math.PI * 2); c.fill();
      c.save(); c.strokeStyle = C.blanco; c.lineWidth = 5; c.setLineDash([14, 12]); c.lineDashOffset = t * 20;
      c.beginPath(); c.arc(0, 0, 115, 0, Math.PI * 2); c.stroke(); c.restore();
      text(c, '?', 0, 50, { w: 800, size: 140, col: C.azul, align: 'center' });
    });
    ripple(c, NX, NY, t, this.tConf, C.amarillo, 100, 260, 1);
    burst(c, NX, NY, t, this.tInd + 0.5, C.blanco, 200, 12);
    doodle(c, 'star', 1790, 470, 32, C.amarillo, ease.inOutCubic(clamp((t - this.tInd) / 0.5)));
    doodle(c, 'spark', 130, 480, 26, C.blanco, ease.inOutCubic(clamp((t - this.tInd - 0.2) / 0.5)));
    c.restore();

    // ---- fuente y logos
    const lk = inn(t, this.tOut + 0.3, 0.5);
    if (lk > 0) {
      c.save(); c.globalAlpha = lk;
      c.fillStyle = hexA(C.azul, 0.85); c.fillRect(0, 850, 1920, 230); // fondo bajo los logos para que no choquen con la red
      c.restore();
    }
    drawLogos(c, this.logos, 960, 930, lk);
    if (lk > 0) text(c, 'Fuente: Radar Trimestral ACH Q2 2026 · InnLab', 1880, 1030, { w: 500, size: 24, col: hexA(C.blanco, 0.8 * lk), align: 'right' });
    return {};
  }
}
