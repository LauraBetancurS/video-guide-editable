// 👉 AQUÍ SE REEMPLAZA ESTE CONTENIDO
// ESCENA 8 — Cierre (fondo azul)
// Voz: "El agente confiable no será el que demuestre su identidad una sola vez. Será el que pueda probar,
// en cada acción, que actúa con un mandato vigente, limitado y revocable."
// "El agente confiable" en una tira de papel; la primera idea se escribe y "una sola vez" se tacha.
// Luego "Será el que pueda probar, en cada acción" y las tres palabras del mandato caen como sellos:
// vigente (verde), limitado (amarillo), revocable (naranja). Al final suben y aparecen las fuentes y los logos.
import type { Frame, PostOverrides } from '../engine/scene';
import { C, Plate, at, burst, clamp, decor, doodle, drawLogos, ease, float, hexA, inn, kinetic, loadLogos, measureText, pop, scratchOut, spoken, tape, text, tornPaper, type KWordT } from './_kit';
import { robot } from './_agente';

export default class A8 extends Plate {
  logos: (HTMLImageElement | null)[] = [];
  a: KWordT[] = []; b: KWordT[] = []; d: KWordT[] = [];
  tUna = 0; tVez = 0; tL2 = 0; tMand = 0; tVig = 0; tLim = 0; tRev = 0; tOut = 0;
  override async load() { this.logos = await loadLogos(); }

  override setup() {
    const S = this.S, L1 = 'El agente confiable', L2 = 'Será el que pueda probar';
    this.prevBg = C.blanco;
    this.a = spoken(S, L1, 'El', 'confiable');
    this.b = spoken(S, L1, 'no', 'vez.');
    this.d = spoken(S, L2, 'Será', 'acción,');
    this.tUna = S.word(L1, 'una').start;
    this.tVez = S.word(L1, 'vez').start;
    this.tL2 = S.line(L2).start;
    this.tMand = S.word(L2, 'mandato').start;
    this.tVig = S.word(L2, 'vigente').start;
    this.tLim = S.word(L2, 'limitado').start;
    this.tRev = S.word(L2, 'revocable').start;
    this.tOut = S.line(L2).end + 0.35;
  }

  draw(c: CanvasRenderingContext2D, t: number, _f: Frame): PostOverrides {
    c.fillStyle = C.azul; c.fillRect(0, 0, 1920, 1080);
    decor(c, t, true, 91);
    // al final todo sube para dejar sitio a los logos
    const up = ease.inOutCubic(clamp((t - this.tOut) / 0.6));
    c.save(); c.translate(0, -70 * up);

    // "El agente confiable" en una tira de papel, con el agente
    const ak = ease.outBack(clamp((t - this.a[0]!.at + 0.2) / 0.4), 1.4);
    if (ak > 0) {
      const tw = this.a.reduce((s, w) => s + measureText(c, w.s, 800, 90), 0) + measureText(c, ' ', 800, 90) * (this.a.length - 1);
      at(c, 1010, 200 - 30, { s: ak, r: -0.012 }, () => tornPaper(c, tw + 100, 140, C.blanco, 92));
      if (ak >= 1) tape(c, 1010 - tw / 2 - 40, 120, 110, -0.5, undefined, 93);
      kinetic(c, t, this.a, 1010, 200, { w: 800, size: 90, col: C.azul, align: 'center' });
      at(c, 1010 - tw / 2 - 150, 170 + float(t, 0, 6, 1.5), { s: pop(t, this.a[1]!.at, 0.4) }, () => robot(c, 120, t, { body: C.blanco, face: C.azul, eye: C.blanco }));
    }

    // "no será el que demuestre su identidad una sola vez." — se apaga cuando llega la segunda idea
    const bDim = 1 - 0.55 * inn(t, this.tL2, 0.4);
    c.save(); c.globalAlpha = bDim;
    const bw = kinetic(c, t, this.b, 960, 345, { w: 600, size: 50, col: C.blanco, align: 'center' });
    c.restore();
    const unaX = 960 + bw / 2 - measureText(c, 'una sola vez.', 600, 50);
    scratchOut(c, unaX - 6, 312, measureText(c, 'una sola vez', 600, 50) + 12, 44, ease.inOutCubic(clamp((t - this.tVez - 0.05) / 0.35)), C.amarillo, 8);

    // "Será el que pueda probar, en cada acción,"
    kinetic(c, t, this.d, 960, 490, { w: 800, size: 64, col: C.blanco, align: 'center' });

    // "un mandato" + las tres cualidades
    const mk = inn(t, this.tMand - 0.05, 0.35);
    if (mk > 0) text(c, 'un mandato', 960, 600 + (1 - mk) * 24, { w: 700, size: 46, col: hexA(C.blanco, 0.9 * mk), align: 'center' });
    const q: [string, number, string, string][] = [['vigente', this.tVig, C.verde, C.blanco], ['limitado', this.tLim, C.amarillo, C.azul], ['revocable', this.tRev, C.naranja, C.blanco]];
    q.forEach(([w, tw, bg, ink], i) => {
      const st = clamp((t - tw + 0.02) / 0.22);
      if (st <= 0) return;
      const x = 960 + (i - 1) * 470;
      at(c, x, 745 + float(t, i + 3, 5, 1.4), { s: 2 - ease.inQuad(st), r: (i - 1) * 0.04, a: clamp(st * 2) }, () => {
        tornPaper(c, 420, 130, bg, 94 + i, { tear: 9 });
        text(c, w, 0, 26, { w: 800, size: 72, col: ink, align: 'center' });
      });
      burst(c, x, 745, t, tw + 0.22, bg === C.amarillo ? C.blanco : C.amarillo, 230, 12);
    });
    doodle(c, 'star', 1800, 600, 34, C.amarillo, ease.inOutCubic(clamp((t - this.tRev - 0.2) / 0.5)));
    doodle(c, 'spark', 120, 640, 26, C.blanco, ease.inOutCubic(clamp((t - this.tRev - 0.35) / 0.5)));
    c.restore();

    // fuentes y logos
    const lk = inn(t, this.tOut + 0.3, 0.5);
    drawLogos(c, this.logos, 960, 880, lk);
    if (lk > 0) text(c, 'Fuentes: REC-20319 · REC-20275', 1880, 1030, { w: 500, size: 24, col: hexA(C.blanco, 0.8 * lk), align: 'right' });
    return {};
  }
}
