// 👉 AQUÍ SE REEMPLAZA ESTE CONTENIDO
// ESCENA 6 — Trazabilidad (fondo azul)
// Voz: "Y cada acción tiene que quedar registrada: qué pidió el usuario, qué interpretó el agente y qué
// ejecutó al final."
// La frase entra palabra por palabra; en "registrada" cae el sello TRAZABILIDAD. Un registro de papel se
// imprime de arriba abajo con tres pasos unidos por una línea: pidió → interpretó → ejecutó (con chulo).
import type { Frame, PostOverrides } from '../engine/scene';
import { C, Plate, at, burst, clamp, decor, ease, float, hexA, icon, inn, kinetic, pop, pt, rrect, spoken, stampShake, strokeTrim, text, tornPaper, tape, type KWordT } from './_kit';
import { robot } from './_agente';

const R = { x: 960, y: 640, w: 1180, h: 560 };

export default class A6 extends Plate {
  head: KWordT[] = [];
  tReg = 0; tPidio = 0; tInterp = 0; tEjec = 0; tFinal = 0;

  override setup() {
    const S = this.S, L = 'cada acción tiene que quedar';
    this.prevBg = C.blanco;
    this.head = spoken(S, L, 'cada', 'registrada:');
    this.tReg = S.word(L, 'registrada').start;
    this.tPidio = S.word(L, 'pidió').start;
    this.tInterp = S.word(L, 'interpretó').start;
    this.tEjec = S.word(L, 'ejecutó').start;
    this.tFinal = S.word(L, 'final').start;
  }

  draw(c: CanvasRenderingContext2D, t: number, _f: Frame): PostOverrides {
    const t0 = this.ctx.start;
    c.fillStyle = C.azul; c.fillRect(0, 0, 1920, 1080);
    decor(c, t, true, 71);
    const [sx, sy] = stampShake(t, this.tReg + 0.2, 9);
    c.save(); c.translate(sx, sy);

    kinetic(c, t, this.head, 960, 140, { w: 800, size: 62, col: C.blanco, align: 'center', cap: true });

    // sello TRAZABILIDAD
    const st = clamp((t - this.tReg) / 0.22);
    if (st > 0) {
      at(c, 960, 250, { s: 2.2 - 1.2 * ease.inQuad(st), r: -0.03, a: clamp(st * 2) }, () => {
        c.fillStyle = C.amarillo; rrect(c, -250, -40, 500, 80, 40); c.fill();
        text(c, 'TRAZABILIDAD', 0, 15, { w: 800, size: 42, col: C.azul, align: 'center', ls: 5 });
      });
      burst(c, 960, 250, t, this.tReg + 0.22, C.amarillo, 280, 12);
    }

    // el registro se imprime de arriba abajo
    const pk = ease.outCubic(clamp((t - t0 - 0.2) / 0.7));
    if (pk > 0) {
      c.save();
      c.beginPath(); c.rect(R.x - R.w / 2 - 40, R.y - R.h / 2 - 40, R.w + 80, (R.h + 80) * pk); c.clip();
      at(c, R.x, R.y + float(t, 0, 4, 1), { r: 0.008 }, () => {
        tornPaper(c, R.w, R.h, C.blanco, 72);
        text(c, 'Registro de la acción', -R.w / 2 + 50, -R.h / 2 + 64, { w: 800, size: 34, col: C.azul });
        c.fillStyle = C.gris2; c.fillRect(-R.w / 2 + 50, -R.h / 2 + 88, R.w - 100, 3);
      });
      c.restore();
    }
    if (pk >= 1) { tape(c, R.x - R.w / 2 + 40, R.y - R.h / 2, 120, -0.5, undefined, 73); tape(c, R.x + R.w / 2 - 40, R.y - R.h / 2, 120, 0.5, undefined, 74); }

    // tres pasos
    const steps: { tw: number; n: string; title: string; sub: string; col: string; ic: () => void }[] = [
      { tw: this.tPidio, n: '1', title: 'Qué pidió el usuario', sub: '"Cómprame unos tiquetes para el viernes"', col: C.morado, ic: () => icon.person(c, 50, C.blanco) },
      { tw: this.tInterp, n: '2', title: 'Qué interpretó el agente', sub: 'Vuelo del viernes · tarjeta autorizada', col: C.azul, ic: () => robot(c, 56, t, { body: C.blanco, face: C.azul, eye: C.blanco }) },
      { tw: this.tEjec, n: '3', title: 'Qué ejecutó al final', sub: 'Compra hecha y registrada', col: C.verde, ic: () => icon.check(c, 26, C.verde, C.blanco) },
    ];
    const top = R.y - R.h / 2 + 175, gap = 135, lx = R.x - R.w / 2 + 110;
    // la línea que une los pasos
    const lineK = clamp((t - this.tPidio) / Math.max(0.5, this.tEjec - this.tPidio));
    c.save(); c.strokeStyle = hexA(C.azul, 0.35); c.lineWidth = 6; strokeTrim(c, [pt(lx, top), pt(lx, top + gap * 2)], ease.inOutQuad(lineK)); c.restore();
    steps.forEach((s, i) => {
      const y = top + i * gap;
      const k = pop(t, s.tw - 0.08, 0.42);
      at(c, lx, y, { s: k }, () => {
        c.fillStyle = s.col; c.beginPath(); c.arc(0, 0, 46, 0, Math.PI * 2); c.fill();
        s.ic();
      });
      const tk = inn(t, s.tw, 0.4);
      if (tk > 0) {
        c.save(); c.globalAlpha = tk;
        text(c, `${s.n}. ${s.title}`, lx + 80 + (1 - tk) * 30, y - 6, { w: 800, size: 40, col: C.azul });
        text(c, s.sub, lx + 80 + (1 - tk) * 30, y + 38, { w: 500, size: 28, col: C.gris1, italic: i === 0 });
        c.restore();
      }
    });
    // chulo final grande
    const fk = pop(t, this.tFinal, 0.45);
    at(c, R.x + R.w / 2 - 120, top + gap * 2, { s: fk, r: -0.1 }, () => icon.check(c, 56, C.verde));
    burst(c, R.x + R.w / 2 - 120, top + gap * 2, t, this.tFinal + 0.3, C.verde, 110, 10);
    c.restore();
    return {};
  }
}
