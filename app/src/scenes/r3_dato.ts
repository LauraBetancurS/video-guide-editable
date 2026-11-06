// 👉 AQUÍ SE REEMPLAZA ESTE CONTENIDO
// ESCENA 3 — El dato (fondo papel)
// Voz: "Un estudio del BIS sobre préstamos a pequeñas empresas en India encontró que sumar el historial
// de pagos al buró dio un retorno cinco por ciento mayor."
// Arriba, "Estudio del BIS" y tres etiquetas: préstamos, pequeñas empresas, India. Luego dos capas, el
// historial de pagos y el buró, se juntan en el centro. Con "retorno" aparece la palabra y con "cinco"
// el gran "+5%". Al final, la fuente REC-0248.
import type { Frame, PostOverrides } from '../engine/scene';
import { C, Plate, at, burst, clamp, decor, doodle, ease, float, hexA, icon, inn, labelPill, lerp, pop, rrect, stampShake, tape, text, tornPaper } from './_kit';
import { store } from './_agente';

export default class R3 extends Plate {
  tBis = 0; tPre = 0; tPeq = 0; tInd = 0; tSum = 0; tPag = 0; tBur = 0; tRet = 0; tCin = 0; tEnd = 0;
  override setup() {
    const S = this.S, L = 'Un estudio del BIS';
    this.prevBg = C.azul;
    this.tBis = S.word(L, 'BIS').start;
    this.tPre = S.word(L, 'préstamos').start;
    this.tPeq = S.word(L, 'pequeñas').start;
    this.tInd = S.word(L, 'India').start;
    this.tSum = S.word(L, 'sumar').start;
    this.tPag = S.word(L, 'pagos').start;
    this.tBur = S.word(L, 'buró').start;
    this.tRet = S.word(L, 'retorno').start;
    this.tCin = S.word(L, 'cinco').start;
    this.tEnd = S.line(L).end;
  }

  draw(c: CanvasRenderingContext2D, t: number, _f: Frame): PostOverrides {
    decor(c, t, false, 121);
    const [sx, sy] = stampShake(t, this.tCin + 0.2, 10);
    c.save(); c.translate(sx, sy);

    // ---- "Estudio del BIS"
    const bk = clamp((t - this.tBis + 0.05) / 0.22);
    if (bk > 0) at(c, 960, 150 + float(t, 0, 3, 1.2), { s: 1.6 - 0.6 * ease.inQuad(bk), r: -0.02, a: clamp(bk * 2) }, () => {
      tornPaper(c, 560, 110, C.azul, 122, { tear: 8 });
      text(c, 'Estudio del BIS', 0, 20, { w: 800, size: 56, col: C.blanco, align: 'center' });
    });
    // ---- préstamos · pequeñas empresas · India
    const tags: [string, number, number, () => void][] = [
      ['Préstamos', this.tPre, 560, () => icon.bill(c, 46, C.verde)],
      ['Pequeñas empresas', this.tPeq, 960, () => store(c, 50, C.azul)],
      ['India', this.tInd, 1360, () => icon.pin(c, 46, C.naranja, true)],
    ];
    tags.forEach(([s, tw, x, ic], i) => {
      const k = pop(t, tw - 0.05, 0.4);
      if (k <= 0) return;
      at(c, x, 290 + float(t, i + 1, 3, 1.3), { s: k }, () => {
        labelPill(c, s, 20, 0, { fill: C.azul, col: C.blanco, size: 34, w: 800 });
      });
      at(c, x - 20 - (s.length * 9.5) - 30, 290 + float(t, i + 1, 3, 1.3), { s: k }, ic);
    });

    // ---- las dos capas que se juntan
    const mk = ease.inOutCubic(clamp((t - this.tBur - 0.1) / 0.5));
    const layer = (label: string, col: string, ink: string, tIn: number, from: number, to: number, y0: number, y1: number, seed: number) => {
      const k = ease.outCubic(clamp((t - tIn + 0.1) / 0.45));
      if (k <= 0) return;
      const x = lerp(from, to, mk) + (1 - k) * (from < 960 ? -500 : 500);
      at(c, x, lerp(y0, y1, mk) + float(t, seed, 4, 1.1), { r: lerp(seed % 2 ? 0.05 : -0.05, seed % 2 ? 0.02 : -0.02, mk), a: clamp(k * 1.5) }, () => {
        tornPaper(c, 520, 150, col, seed);
        text(c, label, 0, 20, { w: 800, size: 52, col: ink, align: 'center' });
      });
    };
    layer('Historial de pagos', C.verde, C.blanco, this.tPag, 420, 620, 610, 640, 123);
    layer('Buró', C.blanco, C.azul, this.tBur, 1500, 620, 610, 780, 124);
    if (mk > 0.9) {
      c.save(); c.globalAlpha = inn(t, this.tBur + 0.5, 0.3);
      c.fillStyle = C.amarillo; c.beginPath(); c.arc(620, 710, 40, 0, Math.PI * 2); c.fill();
      c.strokeStyle = C.azul; c.lineWidth = 8; c.beginPath(); c.moveTo(600, 710); c.lineTo(640, 710); c.moveTo(620, 690); c.lineTo(620, 730); c.stroke();
      c.restore();
    }

    // ---- "retorno" y el gran +5%
    const ck = clamp((t - this.tCin) / 0.22);
    if (ck > 0) {
      at(c, 1330, 620 + float(t, 6, 4, 1.1), { s: 1.9 - 0.9 * ease.inQuad(ck), r: 0.025, a: clamp(ck * 2) }, () => {
        tornPaper(c, 560, 300, C.amarillo, 125, { tear: 10 });
        text(c, '+5%', 0, 80, { w: 800, size: 220, col: C.azul, align: 'center' });
      });
      if (ck >= 1) tape(c, 1570, 480, 130, 0.5, undefined, 126);
      burst(c, 1330, 620, t, this.tCin + 0.22, C.naranja, 340, 14);
    }
    const rk = inn(t, this.tRet - 0.05, 0.4);
    if (rk > 0) at(c, 1330, 850 + (1 - rk) * 24, { a: rk }, () => {
      c.fillStyle = C.azul; rrect(c, -200, -50, 400, 90, 45); c.fill();
      text(c, 'retorno', 0, 14, { w: 800, size: 50, col: C.blanco, align: 'center' });
    });
    const fk = inn(t, this.tEnd + 0.1, 0.5);
    if (fk > 0) text(c, 'Fuente: Kumar Rishabh (BIS), 2024 · REC-0248', 1880, 1030, { w: 500, size: 24, col: hexA(C.azul, 0.8 * fk), align: 'right' });
    doodle(c, 'star', 1720, 400, 30, C.morado, ease.inOutCubic(clamp((t - this.tCin - 0.2) / 0.5)));
    c.restore();
    return {};
  }
}
