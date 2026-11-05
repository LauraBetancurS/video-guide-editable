// 👉 AQUÍ SE REEMPLAZA ESTE CONTENIDO
// ESCENA 7 — Implicación (fondo papel)
// Voz: "Para bancos y comercios hay dos extremos que evitar: bloquear toda la automatización o permitirla
// sin control. Lo que se necesita son permisos granulares según el nivel de riesgo, y no listas binarias
// de 'humano o bot'."
// Dos tarjetas naranjas llegan desde los bordes con una X: "Bloquear todo" (barrera) y "Permitir todo"
// (candado roto). Con "Lo que se necesita" se apagan y en el centro aparece la tarjeta verde "Permisos por
// riesgo" con un medidor de tres niveles que se enciende. Al final, un interruptor "Humano | Bot" se tacha.
import type { Frame, PostOverrides } from '../engine/scene';
import { C, Plate, at, burst, clamp, decor, ease, float, hexA, icon, inn, kinetic, outk, pop, rrect, scratchOut, spoken, text, tornPaper, tape, type KWordT } from './_kit';
import { toggle } from './_agente';

export default class A7 extends Plate {
  h1: KWordT[] = []; h2: KWordT[] = [];
  tBancos = 0; tBloq = 0; tPerm = 0; tCtrl = 0; tLo = 0; tPermisos = 0; tGran = 0; tNivel = 0; tRiesgo = 0; tBin = 0; tBot = 0;

  override setup() {
    const S = this.S, L1 = 'Para bancos y comercios', L2 = 'Lo que se necesita';
    this.prevBg = C.azul;
    this.h1 = spoken(S, L1, 'dos', 'evitar:');
    this.h2 = spoken(S, L2, 'permisos', 'riesgo,');
    this.tBancos = S.word(L1, 'bancos').start;
    this.tBloq = S.word(L1, 'bloquear').start;
    this.tPerm = S.word(L1, 'permitirla').start;
    this.tCtrl = S.word(L1, 'control').start;
    this.tLo = S.line(L2).start;
    this.tPermisos = S.word(L2, 'permisos').start;
    this.tGran = S.word(L2, 'granulares').start;
    this.tNivel = S.word(L2, 'nivel').start;
    this.tRiesgo = S.word(L2, 'riesgo').start;
    this.tBin = S.word(L2, 'binarias').start;
    this.tBot = S.word(L2, 'bot').start;
  }

  draw(c: CanvasRenderingContext2D, t: number, _f: Frame): PostOverrides {
    decor(c, t, false, 81);

    // ---- "Bancos · Comercios" y los titulares (el segundo reemplaza al primero)
    const ck = pop(t, this.tBancos - 0.05, 0.4);
    at(c, 960, 110, { s: ck * outk(t, this.tLo - 0.3) }, () => {
      text(c, 'BANCOS  ·  COMERCIOS', 0, 0, { w: 800, size: 30, col: C.gris1, align: 'center', ls: 5 });
    });
    c.save(); c.globalAlpha = outk(t, this.tLo - 0.25);
    kinetic(c, t, this.h1, 960, 195, { w: 800, size: 68, col: C.azul, align: 'center', cap: true });
    c.restore();
    kinetic(c, t, this.h2, 960, 180, { w: 800, size: 64, col: C.azul, align: 'center', cap: true });

    // ---- los dos extremos
    const dimK = inn(t, this.tLo, 0.5);
    const extreme = (side: -1 | 1, tw: number, label: string, sub: string, ic: () => void, seed: number) => {
      const k = ease.outBack(clamp((t - tw + 0.05) / 0.5), 1.3);
      if (k <= 0) return;
      const x = 960 + side * (520 + (1 - k) * 600) + side * dimK * 110;
      at(c, x, 470 + float(t, seed, 5, 1.2) - dimK * 40, { s: 1 - 0.25 * dimK, r: side * (0.04 + dimK * 0.04), a: 1 - 0.45 * dimK }, () => {
        tornPaper(c, 500, 260, C.naranja, seed);
        at(c, -180, -20, {}, ic);
        text(c, label, 60, -10, { w: 800, size: 44, col: C.blanco, align: 'center' });
        text(c, sub, 60, 40, { w: 500, size: 28, col: hexA(C.blanco, 0.9), align: 'center' });
        // la X
        const xk = ease.inOutCubic(clamp((t - tw - 0.45) / 0.3));
        if (xk > 0) {
          c.strokeStyle = C.blanco; c.lineWidth = 12; c.lineCap = 'round';
          c.beginPath(); c.moveTo(200, -112); c.lineTo(200 + 45 * Math.min(1, xk * 2), -112 + 45 * Math.min(1, xk * 2)); c.stroke();
          if (xk > 0.5) { const e = (xk - 0.5) * 2; c.beginPath(); c.moveTo(245, -112); c.lineTo(245 - 45 * e, -112 + 45 * e); c.stroke(); }
        }
      });
    };
    extreme(-1, this.tBloq, 'Bloquear todo', 'toda la automatización', () => icon.roadClosed(c, 120), 82);
    extreme(1, this.tPerm, 'Permitir todo', 'sin control', () => icon.brokenLock(c, 110, C.blanco), 83);

    // ---- el centro: permisos por riesgo
    const gk = ease.outBack(clamp((t - this.tPermisos + 0.1) / 0.5), 1.4);
    if (gk > 0) {
      at(c, 960, 650, { s: gk, r: -0.01 }, () => {
        tornPaper(c, 820, 380, C.blanco, 84);
        at(c, -330, -110, {}, () => icon.check(c, 40, C.verde));
        text(c, 'Permisos por riesgo', -260, -95, { w: 800, size: 54, col: C.azul });
        // medidor de tres niveles
        const lv: [string, string, string, number][] = [['Bajo', 'aprueba', C.verde, this.tGran], ['Medio', 'confirma', C.amarillo, this.tNivel], ['Alto', 'escala', C.naranja, this.tRiesgo]];
        lv.forEach(([n, a, col, tw], i) => {
          const x = -260 + i * 260, k = inn(t, tw, 0.35);
          c.fillStyle = hexA(C.gris2, 0.6); rrect(c, x - 120, -10, 240, 34, 17); c.fill();
          c.fillStyle = col; rrect(c, x - 120, -10, 240 * k + 0.01, 34, 17); c.fill();
          if (k > 0) {
            text(c, n, x, 80, { w: 800, size: 38, col: C.azul, align: 'center', alpha: k });
            text(c, a, x, 122, { w: 500, size: 30, col: C.gris1, align: 'center', alpha: k });
          }
        });
        // la aguja recorre los niveles
        const nk = clamp((t - this.tGran) / Math.max(0.4, this.tRiesgo - this.tGran + 0.4));
        if (nk > 0) {
          const nx = -380 + 760 * ease.inOutQuad(nk) + Math.sin(t * 3) * 6;
          c.fillStyle = C.azul; c.beginPath(); c.moveTo(nx, -18); c.lineTo(nx - 16, -44); c.lineTo(nx + 16, -44); c.closePath(); c.fill();
        }
      });
      if (gk >= 1) tape(c, 960, 470, 130, -0.05, undefined, 85);
      burst(c, 630, 540, t, this.tPermisos + 0.35, C.verde, 110, 10);
    }

    // ---- "humano o bot": un interruptor de dos posiciones, tachado
    const tk = pop(t, this.tBin - 0.05, 0.4);
    at(c, 1560, 920 + float(t, 9, 3, 2), { s: tk, r: 0.03 }, () => {
      toggle(c, t, 380, 84);
      text(c, 'listas binarias', 0, -64, { w: 700, size: 28, col: C.gris1, align: 'center' });
    });
    scratchOut(c, 1375, 885, 370, 70, ease.inOutCubic(clamp((t - this.tBot) / 0.3)), C.naranja, 9);
    return {};
  }
}
