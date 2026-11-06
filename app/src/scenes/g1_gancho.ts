// 👉 AQUÍ SE REEMPLAZA ESTE CONTENIDO
// ESCENA 1 — Gancho (fondo papel)
// Voz: "¿Alguna vez, para arrendar un apartamento, te pidieron tus extractos bancarios?"
// Andrés quiere arrendar: aparece el edificio con el letrero "Se arrienda". Con "pidieron" cae el sello
// "¿Te pidieron tus extractos?" y con "extractos" entra la hoja del extracto bancario, fila por fila.
import type { Frame, PostOverrides } from '../engine/scene';
import { C, Plate, Puppet, type PupKey, at, burst, clamp, decor, doodle, doodleArrow, ease, float, pop, pt, stampShake, tape, text, tornPaper } from './_kit';
import { building, statement } from './_datos';

export default class G1 extends Plate {
  andres = new Puppet('andres');
  keys: PupKey[] = [];
  tArr = 0; tApto = 0; tPid = 0; tExt = 0; tBanc = 0; tEnd = 0;
  override async load() { await this.andres.load(); }

  override setup() {
    const S = this.S, L = 'Alguna vez, para arrendar';
    this.prevBg = C.azul;
    this.tArr = S.word(L, 'arrendar').start;
    this.tApto = S.word(L, 'apartamento').start;
    this.tPid = S.word(L, 'pidieron').start;
    this.tExt = S.word(L, 'extractos').start;
    this.tBanc = S.word(L, 'bancarios').start;
    this.tEnd = S.line(L).end;
    this.keys = [
      { at: -1, pose: 'saluda', head: 'feliz' },
      { at: this.tArr, pose: 'senala', head: 'sonrisa' },
      { at: this.tPid, pose: 'encoge', head: 'sorpresa' },
      { at: this.tEnd, pose: 'piensa', head: 'duda' },
    ];
  }

  draw(c: CanvasRenderingContext2D, t: number, _f: Frame): PostOverrides {
    const t0 = this.ctx.start;
    decor(c, t, false, 41);
    const [sx, sy] = stampShake(t, this.tPid + 0.2, 9);
    c.save(); c.translate(sx, sy);

    // ---- Andrés, que quiere arrendar
    at(c, 300, 975, { s: pop(t, t0 + 0.1, 0.5) }, () => this.andres.draw(c, 0, 0, 600, t, this.keys, { seed: 3 }));

    // ---- el edificio con el letrero "Se arrienda"
    const bk = ease.outBack(clamp((t - this.tArr + 0.1) / 0.5), 1.2);
    at(c, 790, 600 + float(t, 1, 4, 0.9), { s: bk }, () => {
      building(c, 340, 560, t);
      at(c, 0, 40 + Math.sin(t * 2) * 4, { r: Math.sin(t * 1.8) * 0.05, s: pop(t, this.tApto, 0.45) }, () => {
        tornPaper(c, 280, 96, C.amarillo, 42);
        text(c, 'Se arrienda', 0, 14, { w: 800, size: 40, col: C.azul, align: 'center' });
      });
    });
    doodleArrow(c, pt(520, 380), pt(560, 300), pt(640, 330), ease.inOutCubic(clamp((t - this.tArr) / 0.4)), C.azul, 6);

    // ---- sello: "¿Te pidieron tus extractos?"
    const st = clamp((t - this.tPid) / 0.22);
    if (st > 0) {
      at(c, 1360, 170 + float(t, 2, 4, 1.2), { s: 2.2 - 1.2 * ease.inQuad(st), r: -0.03, a: clamp(st * 2) }, () => {
        tornPaper(c, 900, 140, C.azul, 43, { tear: 9 });
        text(c, '¿Te pidieron tus extractos?', 0, 24, { w: 800, size: 62, col: C.blanco, align: 'center' });
      });
      burst(c, 1360, 170, t, this.tPid + 0.22, C.amarillo, 320, 14);
    }

    // ---- la hoja del extracto bancario
    const ek = ease.outCubic(clamp((t - this.tExt + 0.05) / 0.5));
    if (ek > 0) {
      at(c, 1380 + (1 - ek) * 600, 640 + float(t, 3, 5, 1.1), { r: 0.04 - 0.06 * (1 - ek) }, () => {
        tornPaper(c, 520, 600, C.blanco, 44);
        statement(c, 520, 600, clamp((t - this.tExt - 0.1) / 1.4));
      });
      if (ek >= 1) { tape(c, 1200, 350, 130, -0.5, undefined, 45); tape(c, 1570, 360, 130, 0.45, undefined, 46); }
    }
    doodle(c, 'spark', 1720, 900, 26, C.naranja, ease.inOutCubic(clamp((t - this.tBanc) / 0.4)));
    c.restore();
    return {};
  }
}
