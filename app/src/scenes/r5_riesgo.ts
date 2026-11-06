// 👉 AQUÍ SE REEMPLAZA ESTE CONTENIDO
// ESCENA 5 — El riesgo (fondo papel)
// Voz: "Pero hay un riesgo. Quien tiene poca actividad digital podría quedar todavía más penalizado."
// Tres personas: Valentina y Camila (en su escritorio) brillan rodeadas de puntitos de datos; Andrés, en
// el centro, tiene apenas dos. Con "poca actividad digital" él se pone gris y le cae la etiqueta; con
// "penalizado" el sello "Más penalizado".
import type { Frame, PostOverrides } from '../engine/scene';
import { C, Plate, Puppet, type PupKey, at, burst, clamp, decor, ease, float, inn, kinetic, labelPill, rrect, spoken, stampShake, text, type KWordT } from './_kit';

export default class R5 extends Plate {
  val = new Puppet('valentina'); and = new Puppet('andres'); cam = new Puppet('camila');
  kv: PupKey[] = []; ka: PupKey[] = []; kc: PupKey[] = [];
  head: KWordT[] = [];
  tPoca = 0; tPen = 0; tL2 = 0;
  override async load() { await Promise.all([this.val.load(), this.and.load(), this.cam.load()]); }

  override setup() {
    const S = this.S, L1 = 'Pero hay un riesgo', L2 = 'Quien tiene poca';
    this.prevBg = C.azul;
    this.head = spoken(S, L1);
    this.tL2 = S.line(L2).start;
    this.tPoca = S.word(L2, 'poca').start;
    this.tPen = S.word(L2, 'penalizado').start;
    this.kv = [{ at: -1, pose: 'neutral', head: 'sonrisa' }, { at: this.tL2 + 0.4, pose: 'jarras', head: 'feliz' }];
    this.ka = [{ at: -1, pose: 'neutral', head: 'sonrisa' }, { at: this.tPoca, pose: 'encoge', head: 'duda' }, { at: this.tPen, pose: 'piensa', head: 'enojada' }];
    this.kc = [{ at: -1, pose: 'neutral', head: 'feliz' }];
  }

  draw(c: CanvasRenderingContext2D, t: number, _f: Frame): PostOverrides {
    const t0 = this.ctx.start;
    decor(c, t, false, 141);
    const [sx, sy] = stampShake(t, this.tPen + 0.2, 9);
    c.save(); c.translate(sx, sy);
    kinetic(c, t, this.head, 960, 150, { w: 800, size: 68, col: C.naranja, align: 'center' });

    const gray = inn(t, this.tPoca, 0.6);
    // puntitos de datos alrededor de cada persona
    const orbit = (x: number, y: number, n: number, seed: number, alpha: number) => {
      for (let i = 0; i < n; i++) {
        const a = t * (0.6 + (i % 3) * 0.2) + i * 2.4 + seed;
        const r = 170 + (i % 4) * 22;
        c.fillStyle = [C.azul, C.verde, C.amarillo, C.morado][i % 4]!;
        c.globalAlpha = alpha; c.beginPath(); c.arc(x + Math.cos(a) * r, y + Math.sin(a) * r * 0.55, 9, 0, Math.PI * 2); c.fill();
      }
      c.globalAlpha = 1;
    };
    const lit = inn(t, this.tL2, 0.5);
    orbit(420, 640, 14, 1, 0.4 + 0.6 * lit);
    orbit(1500, 640, 14, 2, 0.4 + 0.6 * lit);
    orbit(960, 640, 2, 3, 1);

    at(c, 420, 960, { s: ease.outBack(clamp((t - t0 - 0.1) / 0.5), 1.2) }, () => this.val.draw(c, 0, 0, 540, t, this.kv, { seed: 2 }));
    at(c, 1500, 960, { s: ease.outBack(clamp((t - t0 - 0.2) / 0.5), 1.2) }, () => this.cam.draw(c, 0, 0, 470, t, this.kc, { seed: 4 }));
    at(c, 960, 960, { s: ease.outBack(clamp((t - t0 - 0.15) / 0.5), 1.2) }, () => {
      c.save(); c.filter = gray > 0 ? `grayscale(${gray.toFixed(2)}) opacity(${(1 - 0.35 * gray).toFixed(2)})` : 'none';
      this.and.draw(c, 0, 0, 540, t, this.ka, { seed: 6 });
      c.restore();
    });

    // ---- "poca actividad digital"
    const pk = ease.outBack(clamp((t - this.tPoca + 0.05) / 0.4), 1.4);
    if (pk > 0) at(c, 960, 300 + float(t, 2, 3, 1.2), { s: pk }, () => labelPill(c, 'Poca actividad digital', 0, 0, { fill: C.gris1, col: C.blanco, size: 38, w: 800 }));

    // ---- sello "Más penalizado"
    const st = clamp((t - this.tPen) / 0.22);
    if (st > 0) {
      at(c, 960, 640, { s: 1.8 - 0.8 * ease.inQuad(st), r: -0.08, a: clamp(st * 2) }, () => {
        c.fillStyle = 'rgba(255,255,255,0.85)'; rrect(c, -250, -62, 500, 124, 16); c.fill();
        c.strokeStyle = C.naranja; c.lineWidth = 9; rrect(c, -250, -62, 500, 124, 16); c.stroke();
        text(c, 'Más penalizado', 0, 22, { w: 800, size: 60, col: C.naranja, align: 'center' });
      });
      burst(c, 960, 640, t, this.tPen + 0.22, C.naranja, 300, 14);
    }
    c.restore();
    return {};
  }
}
