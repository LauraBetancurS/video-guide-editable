// 👉 AQUÍ SE REEMPLAZA ESTE CONTENIDO
// ESCENA 5 — Los tres insights (fondo papel)
// Voz: "Los tres insights de este aprendizaje lo muestran: los pagos ya generan retorno crediticio, la
// aversión al riesgo frena a la gente a compartir sus datos y los nuevos actores le están ganando terreno
// a los bancos."
// Tres tarjetas tipo índice (adelanto de los videos de cada insight). Cada una cae cuando la voz la nombra
// y se resalta mientras se habla de ella: 1 ROI crediticio (barras que crecen), 2 Aversión al riesgo
// (candado roto), 3 Nuevos entrantes (el celular sube y el banco baja).
import type { Frame, PostOverrides } from '../engine/scene';
import { C, Plate, at, burst, clamp, decor, doodle, doodleArrow, ease, float, hexA, icon, inn, kinetic, pop, pt, rrect, spoken, tape, text, tornPaper, wrap, type KWordT } from './_kit';
import { bank, bars } from './_datos';

export default class G5 extends Plate {
  head: KWordT[] = [];
  tPag = 0; tRet = 0; tAve = 0; tCompa = 0; tNue = 0; tTer = 0; tBan = 0; tEnd = 0;
  override setup() {
    const S = this.S, L = 'Los tres insights';
    this.prevBg = C.azul;
    this.head = spoken(S, L, 'Los', 'muestran');
    this.tPag = S.word(L, 'pagos').start;
    this.tRet = S.word(L, 'retorno').start;
    this.tAve = S.word(L, 'aversión').start;
    this.tCompa = S.word(L, 'compartir').start;
    this.tNue = S.word(L, 'nuevos').start;
    this.tTer = S.word(L, 'terreno').start;
    this.tBan = S.word(L, 'bancos').start;
    this.tEnd = S.line(L).end;
  }

  draw(c: CanvasRenderingContext2D, t: number, _f: Frame): PostOverrides {
    decor(c, t, false, 81);
    kinetic(c, t, this.head, 960, 150, { w: 800, size: 60, col: C.azul, align: 'center' });

    const cards: { n: string; title: string; cap: string; tIn: number; tOff: number; col: string; ic: () => void }[] = [
      { n: '1', title: 'ROI crediticio', cap: 'Los pagos ya generan retorno crediticio', tIn: this.tPag, tOff: this.tAve, col: C.verde,
        ic: () => bars(c, 170, clamp((t - this.tRet) / 0.9), C.verde) },
      { n: '2', title: 'Aversión al riesgo', cap: 'Frena a la gente a compartir sus datos', tIn: this.tAve, tOff: this.tNue, col: C.naranja,
        ic: () => { at(c, 0, Math.sin(t * 14) * 3 * inn(t, this.tCompa, 0.2), {}, () => icon.brokenLock(c, 160, C.naranja)); } },
      { n: '3', title: 'Nuevos entrantes', cap: 'Les están ganando terreno a los bancos', tIn: this.tNue, tOff: this.tEnd + 0.4, col: C.morado,
        ic: () => {
          const k = ease.inOutCubic(clamp((t - this.tTer) / 0.7));
          at(c, -60, 10 - 40 * k, { s: 1 + 0.15 * k }, () => icon.phone(c, 130, C.morado));
          at(c, 70, 20 + 30 * ease.inOutCubic(clamp((t - this.tBan) / 0.6)), { s: 1 - 0.25 * ease.inOutCubic(clamp((t - this.tBan) / 0.6)), a: 1 - 0.4 * inn(t, this.tBan, 0.6) }, () => bank(c, 110, C.gris1));
          doodleArrow(c, pt(-120, 70), pt(-140, 0), pt(-110, -60), k, C.verde, 6);
        } },
    ];
    cards.forEach((cd, i) => {
      const x = 960 + (i - 1) * 580, y = 610;
      const k = ease.outBack(clamp((t - cd.tIn + 0.1) / 0.5), 1.3);
      if (k <= 0) return;
      // resaltado: la tarjeta de la que se habla crece un poco; las demás se apagan apenas
      const on = t >= cd.tIn && t < cd.tOff;
      const anyOn = cards.some((o) => t >= o.tIn && t < o.tOff);
      const hk = on ? inn(t, cd.tIn, 0.3) : 0;
      const dim = anyOn && !on ? 0.55 : 1;
      at(c, x, y + float(t, i, 5, 1.2) - (1 - k) * 120, { s: (0.6 + 0.4 * k) * (1 + 0.05 * hk), r: (i - 1) * 0.03, a: clamp(k * 1.5) * dim }, () => {
        tornPaper(c, 500, 520, C.blanco, 82 + i);
        c.fillStyle = cd.col; rrect(c, -250, -260, 500, 90, [8, 8, 0, 0]); c.fill();
        // número
        c.fillStyle = C.blanco; c.beginPath(); c.arc(-190, -215, 32, 0, Math.PI * 2); c.fill();
        text(c, cd.n, -190, -201, { w: 800, size: 40, col: cd.col, align: 'center' });
        text(c, cd.title, -140, -202, { w: 800, size: 36, col: C.blanco });
        at(c, 0, -40, {}, cd.ic);
        wrap(c, cd.cap, 600, 32, 420).forEach((l, j) => text(c, l, 0, 120 + j * 44, { w: 600, size: 32, col: C.negro, align: 'center' }));
      });
      if (k >= 1) tape(c, x, y - 270, 110, (i - 1) * 0.15, undefined, 85 + i);
      burst(c, x, y, t, cd.tIn + 0.3, C.amarillo, 230, 10);
    });
    doodle(c, 'spark', 1830, 300, 26, C.morado, ease.inOutCubic(clamp((t - this.tBan) / 0.4)));
    doodle(c, 'star', 110, 300, 28, hexA(C.azul, 1), ease.inOutCubic(clamp((t - this.tPag) / 0.4)));
    return {};
  }
}
