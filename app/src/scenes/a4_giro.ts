// 👉 AQUÍ SE REEMPLAZA ESTE CONTENIDO
// ESCENA 4 — El cambio (fondo azul)
// Voz: "El reto pasa de autenticar a gobernar la delegación."
// "El reto" en una etiqueta; "AUTENTICAR" aparece con su escudo, se tacha y se encoge; una flecha baja y
// "GOBERNAR LA DELEGACIÓN" cae sobre papel amarillo con un destello. Anillos que giran al fondo.
import type { Frame, PostOverrides } from '../engine/scene';
import { C, Plate, at, burst, clamp, decor, doodleArrow, ease, float, hexA, kinetic, pop, pt, scratchOut, spoken, stampShake, tape, text, tornPaper, type KWordT } from './_kit';
import { shield } from './_agente';

export default class A4 extends Plate {
  tReto = 0; tAut = 0; tGob = 0; tDel = 0; gob: KWordT[] = [];

  override setup() {
    const S = this.S, L = 'El reto pasa';
    this.prevBg = C.blanco;
    this.tReto = S.word(L, 'reto').start;
    this.tAut = S.word(L, 'autenticar').start;
    this.tGob = S.word(L, 'gobernar').start;
    this.tDel = S.word(L, 'delegación').start;
    this.gob = spoken(S, L, 'gobernar', 'delegación.').map((w) => ({ ...w, s: w.s.replace('.', '').toUpperCase() }));
  }

  draw(c: CanvasRenderingContext2D, t: number, _f: Frame): PostOverrides {
    c.fillStyle = C.azul; c.fillRect(0, 0, 1920, 1080);
    decor(c, t, true, 51);
    // anillos concéntricos que giran despacio
    c.save(); c.translate(960, 560);
    for (let i = 0; i < 3; i++) {
      c.rotate(t * (0.15 + i * 0.07) * (i % 2 ? -1 : 1));
      c.strokeStyle = hexA(C.blanco, 0.08); c.lineWidth = 3; c.setLineDash([30, 24]);
      c.beginPath(); c.arc(0, 0, 330 + i * 120, 0, Math.PI * 2); c.stroke();
    }
    c.setLineDash([]); c.restore();
    const [sx, sy] = stampShake(t, this.tGob + 0.2, 10);
    c.save(); c.translate(sx, sy);

    // "El reto"
    at(c, 960, 170, { s: pop(t, this.tReto - 0.1, 0.4), r: -0.02 }, () => {
      c.fillStyle = C.blanco; c.beginPath(); c.roundRect(-150, -42, 300, 84, 42); c.fill();
      text(c, 'EL RETO', 0, 14, { w: 800, size: 40, col: C.azul, align: 'center', ls: 4 });
    });

    // "AUTENTICAR": entra, se tacha y se hace pequeño
    const ak = ease.outBack(clamp((t - this.tAut + 0.05) / 0.4), 1.5);
    const shrink = ease.inOutCubic(clamp((t - this.tGob + 0.05) / 0.45));
    at(c, 960, 370 - 40 * shrink + float(t, 1, 4, 1.2), { s: ak * (1 - 0.35 * shrink), a: 1 - 0.4 * shrink }, () => {
      text(c, 'AUTENTICAR', 50, 38, { w: 800, size: 118, col: C.blanco, align: 'center', ls: 2 });
      at(c, -420, 0, {}, () => shield(c, 110, C.verde, 1));
      scratchOut(c, -340, -40, 780, 80, ease.inOutCubic(clamp((t - this.tGob + 0.1) / 0.35)), C.amarillo, 11);
    });

    // flecha
    doodleArrow(c, pt(960, 440), pt(1010, 500), pt(960, 560), ease.inOutCubic(clamp((t - this.tGob) / 0.35)), C.amarillo, 9);

    // "GOBERNAR LA DELEGACIÓN"
    const gk = ease.outBack(clamp((t - this.tGob + 0.05) / 0.45), 1.5);
    if (gk > 0) {
      at(c, 960, 715, { s: gk, r: -0.015 }, () => tornPaper(c, 1520, 210, C.amarillo, 52, { tear: 10 }));
      kinetic(c, t, this.gob, 960, 752, { w: 800, size: 104, col: C.azul, align: 'center' });
      if (gk >= 1) { tape(c, 230, 620, 140, -0.5, undefined, 53); tape(c, 1690, 810, 140, -0.4, undefined, 54); }
    }
    burst(c, 1700, 640, t, this.tDel + 0.3, C.blanco, 120, 10);
    burst(c, 220, 790, t, this.tDel + 0.4, C.amarillo, 100, 9);
    c.restore();
    return {};
  }
}
