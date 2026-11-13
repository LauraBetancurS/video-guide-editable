// 👉 AQUÍ SE REEMPLAZA ESTE CONTENIDO
// ESCENA 6 — No son predicciones, son ensayos (fondo azul)
// Voz: "No son predicciones. Son ensayos: historias con personas, fechas y decisiones, para practicar hoy lo que
// podría pasar mañana."
// "Predicciones" en papel blanco; con "Son" se tacha en naranja y cae el sello amarillo "Son ensayos".
// Con "personas", "fechas" y "decisiones" llegan tres pastillas y entran Valentina, Andrés y Camila.
// Con "practicar" celebran.
import type { Frame, PostOverrides } from '../engine/scene';
import { C, Plate, Puppet, type PupKey, at, burst, clamp, decor, ease, float, icon, inn, measureText, pop, rrect, scratchOut, stampShake, text } from './_kit';
import { strip } from './_futuros';

export default class P6 extends Plate {
  vale = new Puppet('valentina'); andres = new Puppet('andres'); cami = new Puppet('camila');
  kv: PupKey[] = []; ka: PupKey[] = []; kc: PupKey[] = [];
  tPred = 0; tSon = 0; tEns = 0; tPer = 0; tFec = 0; tDec = 0; tPrac = 0;
  override async load() { await Promise.all([this.vale.load(), this.andres.load(), this.cami.load()]); }
  override setup() {
    const S = this.S, L2 = 'Son ensayos';
    this.prevBg = C.blanco;
    this.tPred = S.word('No son predicciones', 'predicciones').start;
    this.tSon = S.word(L2, 'Son').start;
    this.tEns = S.word(L2, 'ensayos').start;
    this.tPer = S.word(L2, 'personas').start;
    this.tFec = S.word(L2, 'fechas').start;
    this.tDec = S.word(L2, 'decisiones').start;
    this.tPrac = S.word(L2, 'practicar').start;
    this.kv = [{ at: -1, pose: 'neutral', head: 'sonrisa' }, { at: this.tPer, pose: 'saluda', head: 'feliz' }, { at: this.tPrac, pose: 'celebra', head: 'feliz' }];
    this.ka = [{ at: -1, pose: 'neutral', head: 'sonrisa', flip: true }, { at: this.tDec, pose: 'piensa', head: 'duda', flip: true }, { at: this.tPrac + 0.15, pose: 'celebra', head: 'feliz', flip: true }];
    this.kc = [{ at: -1, head: 'sonrisa' }, { at: this.tFec, head: 'sorpresa' }, { at: this.tPrac + 0.1, head: 'feliz' }];
  }

  draw(c: CanvasRenderingContext2D, t: number, _f: Frame): PostOverrides {
    c.fillStyle = C.azul; c.fillRect(0, 0, 1920, 1080);
    decor(c, t, true, 66);
    const m = (s: string, w: number, z: number) => measureText(c, s, w, z);
    const [sx, sy] = stampShake(t, this.tEns + 0.2, 9);
    c.save(); c.translate(sx, sy);

    // "Predicciones" tachado
    const pk = ease.outBack(clamp((t - this.tPred + 0.1) / 0.45), 1.4);
    let pw = 0;
    at(c, 560, 190 + float(t, 0, 3, 1.1), { s: pk, r: -0.02, a: 1 - 0.35 * inn(t, this.tEns, 0.4) }, () => { pw = strip(c, 'Predicciones', 70, C.blanco, C.azul, 2, m); });
    if (pk > 0) scratchOut(c, 560 - pw / 2 + 20, 158, pw - 40, 60, ease.inOutCubic(clamp((t - this.tSon) / 0.3)), C.naranja, 10);
    // sello "Son ensayos"
    const st = clamp((t - this.tEns) / 0.22);
    if (st > 0) {
      at(c, 1320, 230 + float(t, 1, 4, 1.2), { s: 1.9 - 0.9 * ease.inQuad(st), r: 0.035, a: clamp(st * 2) }, () => strip(c, 'Son ensayos', 82, C.amarillo, C.azul, 8, m));
      burst(c, 1320, 230, t, this.tEns + 0.22, C.amarillo, 300, 12);
    }

    // pastillas con ícono
    const pills: [number, string, (s: number) => void][] = [
      [this.tPer, 'Personas', (s) => icon.person(c, s, C.azul)],
      [this.tFec, 'Fechas', (s) => icon.clock(c, s, C.azul)],
      [this.tDec, 'Decisiones', (s) => icon.check(c, s * 0.42, C.verde)],
    ];
    pills.forEach(([t0, label, ic], i) => {
      at(c, 560 + i * 400, 420 + float(t, i + 2, 4, 1.4), { s: pop(t, t0 - 0.05, 0.42), r: (i - 1) * 0.02 }, () => {
        c.save(); c.shadowColor = 'rgba(0,0,40,0.25)'; c.shadowBlur = 12; c.shadowOffsetY = 6;
        c.fillStyle = C.blanco; rrect(c, -160, -44, 320, 88, 44); c.fill(); c.restore();
        at(c, -100, 0, {}, () => ic(52));
        text(c, label, -60, 14, { w: 800, size: 38, col: C.azul });
      });
    });

    // las personas
    const ek = pop(t, this.tPer - 0.1, 0.5);
    at(c, 640, 1000, { s: ek }, () => this.vale.draw(c, 0, 0, 470, t, this.kv, { seed: 2 }));
    at(c, 980, 1000, { s: pop(t, this.tPer + 0.1, 0.5) }, () => this.andres.draw(c, 0, 0, 470, t, this.ka, { seed: 5 }));
    at(c, 1410, 1000, { s: pop(t, this.tPer + 0.25, 0.5) }, () => this.cami.draw(c, 0, 0, 400, t, this.kc, { seed: 8 }));
    c.restore();
    return {};
  }
}
