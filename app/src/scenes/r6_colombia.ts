// 👉 AQUÍ SE REEMPLAZA ESTE CONTENIDO
// ESCENA 6 — En Colombia (fondo azul)
// Voz: "En Colombia, Bre-B, la adquirencia y los recaudos pueden convertirse en sensores continuos de la
// salud de un negocio."
// A la izquierda caen tres tarjetas: Bre-B, adquirencia y recaudos. Con "sensores" se conectan a un
// monitor de signos vitales; con "salud de un negocio" el monitor muestra la tienda y su pulso.
import type { Frame, PostOverrides } from '../engine/scene';
import { C, Plate, at, burst, clamp, decor, ease, float, hexA, icon, inn, kinetic, pop, quadPts, pt, polyAt, rrect, spoken, strokeTrim, tape, text, tornPaper, type KWordT } from './_kit';
import { store } from './_agente';
import { ecg } from './_datos';

const MX = 1210, MY = 610, MW = 880, MH = 470;

export default class R6 extends Plate {
  head: KWordT[] = []; sens: KWordT[] = [];
  tBre = 0; tAdq = 0; tRec = 0; tSen = 0; tSal = 0;
  override setup() {
    const S = this.S, L = 'En Colombia';
    this.prevBg = C.blanco;
    this.head = spoken(S, L, 'En', 'Colombia,');
    this.sens = spoken(S, L, 'sensores', 'continuos');
    this.tBre = S.word(L, 'Bre-B').start;
    this.tAdq = S.word(L, 'adquirencia').start;
    this.tRec = S.word(L, 'recaudos').start;
    this.tSen = S.word(L, 'sensores').start;
    this.tSal = S.word(L, 'salud').start;
  }

  draw(c: CanvasRenderingContext2D, t: number, _f: Frame): PostOverrides {
    const t0 = this.ctx.start;
    c.fillStyle = C.azul; c.fillRect(0, 0, 1920, 1080);
    decor(c, t, true, 151);
    kinetic(c, t, this.head, 330, 160, { w: 800, size: 60, col: C.blanco, align: 'center' });

    // ---- las tres fuentes
    const srcs: [string, number, number, () => void][] = [
      ['Bre-B', this.tBre, 360, () => { icon.phone(c, 64, C.azul); c.fillStyle = C.amarillo; c.beginPath(); c.moveTo(6, -22); c.lineTo(-10, 4); c.lineTo(2, 4); c.lineTo(-6, 26); c.lineTo(12, -4); c.lineTo(0, -4); c.closePath(); c.fill(); }],
      ['Adquirencia', this.tAdq, 590, () => icon.wallet(c, 64, C.azul)],
      ['Recaudos', this.tRec, 820, () => icon.bill(c, 64, C.verde)],
    ];
    srcs.forEach(([label, tw, y, ic], i) => {
      const k = pop(t, tw - 0.08, 0.45);
      // cable al monitor
      const lk = ease.inOutCubic(clamp((t - this.tSen - i * 0.08) / 0.45));
      const path = quadPts(pt(520, y), pt(640, (y + MY) / 2), pt(MX - MW / 2, MY - 120 + i * 120));
      if (lk > 0) {
        c.save(); c.strokeStyle = hexA(C.amarillo, 0.9); c.lineWidth = 5; c.setLineDash([12, 10]); c.lineDashOffset = -t * 40;
        strokeTrim(c, path, lk); c.restore();
        if (lk >= 1) { const q = polyAt(path, ((t - this.tSen) * 0.7 + i / 3) % 1); c.fillStyle = C.blanco; c.beginPath(); c.arc(q.x, q.y, 9, 0, Math.PI * 2); c.fill(); }
      }
      at(c, 330, y + float(t, i, 4, 1.2), { s: k, r: (i - 1) * 0.025 }, () => {
        tornPaper(c, 400, 150, C.blanco, 152 + i);
        at(c, -135, 0, {}, ic);
        text(c, label, 45, 14, { w: 800, size: 38, col: C.azul, align: 'center' });
      });
      burst(c, 330, y, t, tw + 0.25, C.amarillo, 160, 10);
    });

    // ---- el monitor de signos vitales
    const mk = ease.outBack(clamp((t - t0 - 0.2) / 0.55), 1.15);
    at(c, MX, MY + float(t, 5, 3, 1), { s: mk }, () => {
      c.fillStyle = C.negro; rrect(c, -MW / 2 - 24, -MH / 2 - 24, MW + 48, MH + 48, 30); c.fill();
      c.fillStyle = '#10123A'; rrect(c, -MW / 2, -MH / 2, MW, MH, 16); c.fill();
      // cuadrícula
      c.strokeStyle = hexA(C.verde, 0.12); c.lineWidth = 2;
      for (let x = -MW / 2 + 40; x < MW / 2; x += 40) { c.beginPath(); c.moveTo(x, -MH / 2); c.lineTo(x, MH / 2); c.stroke(); }
      for (let y = -MH / 2 + 40; y < MH / 2; y += 40) { c.beginPath(); c.moveTo(-MW / 2, y); c.lineTo(MW / 2, y); c.stroke(); }
      // pulso: plano hasta "sensores", luego late
      const beat = inn(t, this.tSen, 0.6);
      c.save(); c.beginPath(); rrect(c, -MW / 2, -MH / 2, MW, MH, 16); c.clip();
      if (beat < 1) { c.globalAlpha = 1 - beat; c.strokeStyle = C.verde; c.lineWidth = 5; c.beginPath(); c.moveTo(-MW / 2 + 260, 60); c.lineTo(MW / 2 - 30, 60); c.stroke(); }
      c.globalAlpha = beat; ecg(c, -MW / 2 + 260, MW / 2 - 30, 60, 130, t, C.verde, 6, 200);
      c.restore();
      // la tienda y su "salud"
      const sk = pop(t, this.tSal - 0.1, 0.45);
      at(c, -MW / 2 + 140, 30, { s: sk }, () => { c.fillStyle = C.blanco; c.beginPath(); c.arc(0, 0, 90, 0, Math.PI * 2); c.fill(); store(c, 110, C.azul); });
      if (sk > 0) text(c, 'Salud de un negocio', -MW / 2 + 40, -MH / 2 + 60, { w: 800, size: 38, col: hexA(C.blanco, clamp(sk)) });
      c.fillStyle = Math.sin(t * 6) > 0 ? C.verde : hexA(C.verde, 0.3); c.beginPath(); c.arc(MW / 2 - 50, -MH / 2 + 46, 12, 0, Math.PI * 2); c.fill();
      if (beat > 0) text(c, `${Math.round(72 + 4 * Math.sin(t * 1.3))} lpm`, MW / 2 - 80, -MH / 2 + 58, { w: 800, size: 32, col: hexA(C.verde, beat), align: 'right' });
    });

    // ---- "sensores continuos"
    const sk = ease.outBack(clamp((t - this.tSen + 0.1) / 0.4), 1.3);
    if (sk > 0) {
      at(c, MX, 230 + float(t, 8, 3, 1.3), { s: sk, r: 0.015 }, () => tornPaper(c, 640, 110, C.amarillo, 155, { tear: 8 }));
      if (sk >= 1) tape(c, MX + 300, 190, 110, 0.45, undefined, 156);
      kinetic(c, t, this.sens, MX, 250, { w: 800, size: 54, col: C.azul, align: 'center' });
    }
    return {};
  }
}
