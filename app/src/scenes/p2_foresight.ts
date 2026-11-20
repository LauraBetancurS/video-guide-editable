// 👉 AQUÍ SE REEMPLAZA ESTE CONTENIDO
// ESCENA 2 — Foresight (fondo azul)
// Voz: "Por eso, en INNLAB, exploramos el futuro antes de que llegue. Eso es FORESIGHT."
// En pantalla INNLAB y FORESIGHT van siempre en mayúsculas.
// "En INNLAB" en una pastilla; "Exploramos el futuro" y "antes de que llegue" en tiras de papel rasgado.
// Valentina explica y, con "foresight", levanta el dedo: cae la tira amarilla "Eso es FORESIGHT" con una lupa.
import type { Frame, PostOverrides } from '../engine/scene';
import { C, Plate, Puppet, type PupKey, at, burst, decor, doodle, ease, clamp, float, icon, inn, labelPill, measureText, pop } from './_kit';
import { strip } from './_futuros';

export default class P2 extends Plate {
  vale = new Puppet('valentina');
  keys: PupKey[] = [];
  tInn = 0; tExp = 0; tAntes = 0; tFor = 0; tEso = 0;
  override async load() { await this.vale.load(); }
  override setup() {
    const S = this.S, L1 = 'Por eso, en InnLab', L2 = 'Eso es foresight';
    this.prevBg = C.blanco;
    this.tInn = S.word(L1, 'InnLab').start;
    this.tExp = S.word(L1, 'exploramos').start;
    this.tAntes = S.word(L1, 'antes').start;
    this.tEso = S.word(L2, 'Eso').start;
    this.tFor = S.word(L2, 'foresight').start;
    this.keys = [
      { at: -1, pose: 'saluda', head: 'feliz', flip: true },
      { at: this.tExp, pose: 'explica', head: 'habla', flip: true },
      { at: this.tFor, pose: 'idea', head: 'feliz', flip: true },
    ];
  }

  draw(c: CanvasRenderingContext2D, t: number, _f: Frame): PostOverrides {
    c.fillStyle = C.azul; c.fillRect(0, 0, 1920, 1080);
    decor(c, t, true, 22);
    const m = (s: string, w: number, z: number) => measureText(c, s, w, z);
    const X = 800;

    at(c, X, 250, { a: inn(t, this.tInn - 0.1, 0.4), dy: (1 - inn(t, this.tInn - 0.1, 0.4)) * -16 }, () =>
      labelPill(c, 'En INNLAB', 0, 0, { fill: 'rgba(255,255,255,0.14)', col: C.blanco, size: 34, stroke: 'rgba(255,255,255,0.6)' }));
    at(c, X - 20, 400 + float(t, 0, 4, 1.1), { s: ease.outBack(clamp((t - this.tExp + 0.05) / 0.45), 1.4), r: -0.02 }, () =>
      strip(c, 'Exploramos el futuro', 82, C.blanco, C.azul, 3, m));
    at(c, X + 40, 560 + float(t, 1, 4, 1.2), { s: ease.outBack(clamp((t - this.tAntes + 0.05) / 0.45), 1.4), r: 0.015 }, () =>
      strip(c, 'antes de que llegue', 82, C.blanco, C.azul, 5, m));

    const fk = clamp((t - this.tFor) / 0.22);
    if (fk > 0) {
      at(c, X, 760 + float(t, 2, 4, 1.3), { s: 1.9 - 0.9 * ease.inQuad(fk), r: -0.03, a: clamp(fk * 2) }, () => {
        strip(c, 'Eso es FORESIGHT', 76, C.amarillo, C.azul, 9, m);
      });
      burst(c, X, 760, t, this.tFor + 0.22, C.amarillo, 330, 12);
    }
    at(c, X - 380, 760 + float(t, 3, 6, 1.6), { s: pop(t, this.tEso, 0.4), r: -0.2 + Math.sin(t * 1.4) * 0.12 }, () => icon.magnifier(c, 110, C.blanco));
    doodle(c, 'spark', X + 360, 690, 30, C.amarillo, inn(t, this.tFor + 0.3, 0.4));

    at(c, 1560, 985, { s: pop(t, this.ctx.start + 0.15, 0.5) }, () => this.vale.draw(c, 0, 0, 640, t, this.keys, { seed: 4 }));
    return {};
  }
}
