// 👉 AQUÍ SE REEMPLAZA ESTE CONTENIDO
// ESCENA 4 — Monitoreo (fondo azul)
// Voz: "Y el valor sigue después del desembolso: los datos de pago permiten monitorear el crédito casi en
// tiempo real."
// Una línea de tiempo. Con "desembolso" aparece el punto del desembolso (billetes) y la línea sigue
// después de él. Con "monitorear" la línea se vuelve un pulso que late; al final cae la tira
// "Monitorear el crédito casi en tiempo real".
import type { Frame, PostOverrides } from '../engine/scene';
import { C, Plate, at, burst, clamp, decor, ease, float, hexA, icon, inn, kinetic, pop, spoken, tape, text, tornPaper, type KWordT } from './_kit';
import { ecg } from './_datos';

const Y = 560, X0 = 140, XD = 560, X1 = 1780;

export default class R4 extends Plate {
  head: KWordT[] = []; foot1: KWordT[] = []; foot2: KWordT[] = [];
  tSig = 0; tDes = 0; tMon = 0; tReal = 0;
  override setup() {
    const S = this.S, L = 'Y el valor sigue';
    this.prevBg = C.blanco;
    this.revealFrom = { x: XD, y: Y };
    this.head = spoken(S, L, 'Y', 'desembolso:');
    this.foot1 = spoken(S, L, 'monitorear', 'crédito');
    this.foot2 = spoken(S, L, 'casi', 'real.');
    this.tSig = S.word(L, 'sigue').start;
    this.tDes = S.word(L, 'desembolso').start;
    this.tMon = S.word(L, 'monitorear').start;
    this.tReal = S.word(L, 'tiempo').start;
  }

  draw(c: CanvasRenderingContext2D, t: number, _f: Frame): PostOverrides {
    const t0 = this.ctx.start;
    c.fillStyle = C.azul; c.fillRect(0, 0, 1920, 1080);
    decor(c, t, true, 131);
    kinetic(c, t, this.head, 960, 150, { w: 800, size: 58, col: C.blanco, align: 'center' });

    // ---- la línea de tiempo antes del desembolso
    const a = ease.inOutCubic(clamp((t - t0 - 0.1) / 0.6));
    c.strokeStyle = hexA(C.blanco, 0.5); c.lineWidth = 6; c.lineCap = 'round';
    c.beginPath(); c.moveTo(X0, Y); c.lineTo(X0 + (XD - X0) * a, Y); c.stroke();
    text(c, 'Antes', X0 + 120, Y + 70, { w: 800, size: 30, col: hexA(C.blanco, 0.7 * a), align: 'center' });

    // ---- después del desembolso: la línea sigue y luego late
    const d = ease.inOutCubic(clamp((t - this.tSig) / (this.tMon - this.tSig + 0.2)));
    const head = XD + (X1 - XD) * d;
    if (d > 0) {
      const beat = inn(t, this.tMon, 0.5);
      c.save(); c.beginPath(); c.rect(XD, 0, head - XD, 1080); c.clip();
      if (beat < 1) { c.globalAlpha = 1 - beat; c.strokeStyle = C.blanco; c.lineWidth = 6; c.beginPath(); c.moveTo(XD, Y); c.lineTo(X1, Y); c.stroke(); c.globalAlpha = 1; }
      if (beat > 0) { c.globalAlpha = beat; ecg(c, XD, X1, Y, 150, t, C.amarillo, 7); }
      c.restore();
      // la punta que avanza (o el punto en vivo)
      c.fillStyle = C.amarillo; c.beginPath(); c.arc(head, Y, 14 + 4 * Math.sin(t * 6), 0, Math.PI * 2); c.fill();
      text(c, 'Después', (XD + X1) / 2, Y + 200, { w: 800, size: 30, col: hexA(C.blanco, 0.7 * inn(t, this.tSig, 0.4)), align: 'center' });
    }

    // ---- el punto del desembolso
    const dk = pop(t, this.tDes - 0.1, 0.45);
    at(c, XD, Y + float(t, 1, 3, 1.2), { s: dk }, () => {
      c.fillStyle = C.blanco; c.beginPath(); c.arc(0, 0, 70, 0, Math.PI * 2); c.fill();
      icon.bill(c, 80, C.verde);
    });
    if (dk > 0) at(c, XD, Y - 150, { s: dk, r: -0.03 }, () => {
      tornPaper(c, 340, 80, C.blanco, 132);
      text(c, 'Desembolso', 0, 14, { w: 800, size: 40, col: C.azul, align: 'center' });
    });
    burst(c, XD, Y, t, this.tDes + 0.2, C.amarillo, 200, 12);

    // ---- la tira de abajo
    const fk = ease.outBack(clamp((t - this.tMon + 0.1) / 0.45), 1.3);
    if (fk > 0) {
      at(c, 960, 860 + float(t, 4, 3, 1.3), { s: fk, r: -0.012 }, () => tornPaper(c, 1100, 170, C.amarillo, 133, { tear: 9 }));
      if (fk >= 1) tape(c, 440, 790, 120, -0.4, undefined, 134);
      kinetic(c, t, this.foot1, 960, 845, { w: 800, size: 54, col: C.azul, align: 'center' });
      kinetic(c, t, this.foot2, 960, 910, { w: 800, size: 54, col: C.azul, align: 'center' });
    }
    burst(c, 1480, 860, t, this.tReal + 0.3, C.blanco, 200, 10);
    return {};
  }
}
