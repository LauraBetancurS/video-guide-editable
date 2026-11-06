// 👉 AQUÍ SE REEMPLAZA ESTE CONTENIDO
// ESCENA 1 — Gancho (fondo papel)
// Voz: "Una tienda de barrio vende todos los días, pero no tiene historial en el buró. ¿Le prestarías?"
// La tienda de barrio con Valentina llegando a comprar. Con "vende" suben billetes y arriba se marcan los
// siete días de la semana. Con "historial" cae un sello vacío "Sin historial en el buró" y con
// "prestarías" el sello grande "¿Le prestarías?".
import type { Frame, PostOverrides } from '../engine/scene';
import { C, Plate, Puppet, type PupKey, at, burst, clamp, decor, ease, float, hexA, icon, inn, kinetic, pop, rrect, spoken, stampShake, tape, text, tornPaper, type KWordT } from './_kit';
import { shopFront } from './_datos';

const DAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

export default class R1 extends Plate {
  val = new Puppet('valentina');
  keys: PupKey[] = [];
  head: KWordT[] = [];
  tVen = 0; tDias = 0; tHist = 0; tPres = 0; tEnd = 0;
  override async load() { await this.val.load(); }

  override setup() {
    const S = this.S, L = 'Una tienda de barrio', Q = 'Le prestarías';
    this.prevBg = C.azul;
    this.head = spoken(S, L, 'Una', 'días,');
    this.tVen = S.word(L, 'vende').start;
    this.tDias = S.word(L, 'días').start;
    this.tHist = S.word(L, 'historial').start;
    this.tPres = S.word(Q, 'prestarías').start;
    this.tEnd = S.line(Q).end;
    this.keys = [
      { at: -1, pose: 'saluda', head: 'feliz' },
      { at: this.tVen + 0.3, pose: 'celebra', head: 'sonrisa' },
      { at: this.tHist, pose: 'encoge', head: 'duda' },
      { at: this.tPres, pose: 'piensa', head: 'duda' },
    ];
  }

  draw(c: CanvasRenderingContext2D, t: number, _f: Frame): PostOverrides {
    const t0 = this.ctx.start;
    decor(c, t, false, 101);
    const [sx, sy] = stampShake(t, this.tPres + 0.2, 9);
    c.save(); c.translate(sx, sy);

    // ---- "Una tienda de barrio vende todos los días,"
    kinetic(c, t, this.head, 700, 140, { w: 800, size: 54, col: C.azul, align: 'center' });

    // ---- los siete días que se marcan
    DAYS.forEach((d, i) => {
      const tk = this.tVen + (i * (this.tDias + 0.3 - this.tVen)) / 7;
      const k = pop(t, tk, 0.35);
      if (k <= 0) return;
      at(c, 400 + i * 100, 225, { s: k }, () => {
        c.fillStyle = C.azul; c.beginPath(); c.arc(0, 0, 34, 0, Math.PI * 2); c.fill();
        text(c, d, 0, 11, { w: 800, size: 30, col: C.blanco, align: 'center' });
        at(c, 24, -24, { s: pop(t, tk + 0.15, 0.3) }, () => { c.fillStyle = C.verde; c.beginPath(); c.arc(0, 0, 15, 0, Math.PI * 2); c.fill(); icon.check(c, 18, C.blanco); });
      });
    });

    // ---- la tienda
    at(c, 700, 640 + float(t, 0, 3, 0.8), { s: ease.outBack(clamp((t - t0 - 0.1) / 0.55), 1.2) }, () => shopFront(c, 560, 520, t, 'Tienda La Esquina'));
    // ventas: billetes que suben de la tienda (uno cada ~0,5 s desde "vende")
    if (t > this.tVen) for (let j = 0; j < 6; j++) {
      const u = ((t - this.tVen) * 0.6 + j / 6) % 1;
      const x = 520 + ((j * 97) % 360), y = 335 - u * 70;
      c.save(); c.globalAlpha = Math.sin(u * Math.PI) * inn(t, this.tVen, 0.4);
      at(c, x, y, { r: Math.sin(j + t) * 0.2 }, () => icon.bill(c, 64, C.verde));
      c.restore();
    }

    // ---- Valentina, la clienta
    at(c, 1120, 975, { s: pop(t, t0 + 0.25, 0.5) }, () => this.val.draw(c, 0, 0, 560, t, this.keys, { seed: 5 }));

    // ---- sello vacío "Sin historial en el buró"
    const hk = clamp((t - this.tHist) / 0.22);
    if (hk > 0) {
      at(c, 1560, 400 + float(t, 2, 3, 1.1), { s: 1.6 - 0.6 * ease.inQuad(hk), r: 0.06, a: clamp(hk * 2) }, () => {
        c.setLineDash([16, 12]); c.strokeStyle = C.naranja; c.lineWidth = 7; rrect(c, -230, -95, 460, 190, 16); c.stroke(); c.setLineDash([]);
        c.fillStyle = hexA(C.naranja, 0.08); rrect(c, -230, -95, 460, 190, 16); c.fill();
        text(c, 'Sin historial', 0, -8, { w: 800, size: 54, col: C.naranja, align: 'center' });
        text(c, 'en el buró', 0, 50, { w: 800, size: 38, col: C.naranja, align: 'center' });
      });
    }

    // ---- "¿Le prestarías?"
    const pk = clamp((t - this.tPres) / 0.22);
    if (pk > 0) {
      at(c, 1560, 700 + float(t, 3, 4, 1.2), { s: 1.8 - 0.8 * ease.inQuad(pk), r: -0.03, a: clamp(pk * 2) }, () => {
        tornPaper(c, 520, 150, C.azul, 102, { tear: 9 });
        text(c, '¿Le prestarías?', 0, 24, { w: 800, size: 66, col: C.blanco, align: 'center' });
      });
      if (pk >= 1) tape(c, 1330, 640, 120, -0.5, undefined, 103);
      burst(c, 1560, 700, t, this.tPres + 0.22, C.amarillo, 320, 14);
    }
    c.restore();
    return {};
  }
}
