// 👉 AQUÍ SE REEMPLAZA ESTE CONTENIDO
// ESCENA 1 — Gancho (fondo papel)
// Voz: "Imagina que le pides a un asistente de IA que te compre unos tiquetes. Sabes que es tu agente.
// Pero, ¿sabes hasta dónde puede gastar, con qué tarjeta y si debía preguntarte antes?"
// Valentina le escribe al agente en el celular; el pedido se escribe solo y sale un tiquete volando.
// "¿Quién es?" aparece con un escudo verde; con "Pero" se tacha y cae el sello "¿Qué puede hacer?".
// Debajo llegan las tres dudas: cuánto gastar, qué tarjeta, si debía preguntar.
import type { Frame, PostOverrides } from '../engine/scene';
import { C, Plate, Puppet, type PupKey, at, burst, clamp, decor, doodle, doodleArrow, ease, float, hexA, icon, inn, pop, pt, rrect, scratchOut, stampShake, tape, text, tornPaper, wrap } from './_kit';
import { card, robot, shield, ticket } from './_agente';

const PH = { x: 860, y: 520, w: 400, h: 680 };

export default class A1 extends Plate {
  vale = new Puppet('valentina');
  keys: PupKey[] = [];
  tPides = 0; tIA = 0; tTiq = 0; tSabes = 0; tAgente = 0; tPero = 0; tPuede = 0; tGastar = 0; tTarjeta = 0; tPreg = 0;
  talk: [number, number][] = [];
  override async load() { await this.vale.load(); }

  override setup() {
    const S = this.S, L1 = 'Imagina que le pides', L2 = 'Sabes que es tu agente', L3 = 'hasta dónde puede gastar';
    this.prevBg = C.azul;
    this.tPides = S.word(L1, 'pides').start;
    this.tIA = S.word(L1, 'IA').start;
    this.tTiq = S.word(L1, 'tiquetes').start;
    this.tSabes = S.word(L2, 'Sabes').start;
    this.tAgente = S.word(L2, 'agente').start;
    this.tPero = S.word(L3, 'Pero').start;
    this.tPuede = S.word(L3, 'puede').start;
    this.tGastar = S.word(L3, 'gastar').start;
    this.tTarjeta = S.word(L3, 'tarjeta').start;
    this.tPreg = S.word(L3, 'preguntarte').start;
    this.keys = [
      { at: -1, pose: 'saluda', head: 'feliz' },
      { at: this.tPides, pose: 'explica', head: 'sonrisa' },
      { at: this.tAgente, pose: 'celebra', head: 'feliz' },
      { at: this.tPero, pose: 'piensa', head: 'duda' },
      { at: this.tPreg, pose: 'encoge', head: 'sorpresa' },
    ];
  }

  draw(c: CanvasRenderingContext2D, t: number, _f: Frame): PostOverrides {
    const t0 = this.ctx.start;
    decor(c, t, false, 21);
    const [sx, sy] = stampShake(t, this.tPuede + 0.18, 9);
    c.save(); c.translate(sx, sy);

    // ---- Valentina
    at(c, 310, 975, { s: pop(t, t0 + 0.1, 0.5) }, () => this.vale.draw(c, 0, 0, 600, t, this.keys, { seed: 2 }));

    // ---- el celular con el chat al agente
    const pk = ease.outBack(clamp((t - t0 - 0.2) / 0.5), 1.3);
    at(c, PH.x, PH.y + float(t, 1, 5, 1.1), { s: pk, r: -0.04 }, () => {
      c.save(); c.shadowColor = 'rgba(0,0,0,0.25)'; c.shadowBlur = 30; c.shadowOffsetY = 14;
      c.fillStyle = C.azul; rrect(c, -PH.w / 2, -PH.h / 2, PH.w, PH.h, 54); c.fill(); c.restore();
      c.fillStyle = C.blanco; rrect(c, -PH.w / 2 + 18, -PH.h / 2 + 60, PH.w - 36, PH.h - 110, 26); c.fill();
      c.fillStyle = hexA(C.blanco, 0.5); rrect(c, -40, -PH.h / 2 + 24, 80, 12, 6); c.fill();
      // cabecera: el agente
      const ak = pop(t, this.tIA - 0.1, 0.45);
      at(c, -PH.w / 2 + 80, -PH.h / 2 + 125, { s: ak }, () => robot(c, 76, t));
      if (ak > 0) text(c, 'Tu agente IA', -PH.w / 2 + 132, -PH.h / 2 + 136, { w: 800, size: 28, col: C.azul, alpha: clamp(ak) });
      c.fillStyle = C.gris2; c.fillRect(-PH.w / 2 + 40, -PH.h / 2 + 178, PH.w - 80, 3);
      // el pedido, escribiéndose
      const ask = 'Cómprame unos tiquetes para el viernes';
      const n = Math.floor(clamp((t - this.tPides) * 30, 0, ask.length));
      if (n > 0) {
        const lines = wrap(c, ask, 600, 28, PH.w - 150);
        const bh = lines.length * 38 + 34;
        c.fillStyle = C.azul; rrect(c, -PH.w / 2 + 80, -PH.h / 2 + 215, PH.w - 120, bh, [22, 22, 6, 22]); c.fill();
        let left = n;
        lines.forEach((l, i) => { const s2 = l.slice(0, Math.max(0, left)); left -= l.length + 1; if (s2) text(c, s2, -PH.w / 2 + 102, -PH.h / 2 + 258 + i * 38, { w: 600, size: 28, col: C.blanco }); });
      }
      // la respuesta del agente
      const rk = pop(t, this.tTiq + 0.15, 0.4);
      at(c, -20, 130, { s: rk }, () => {
        c.fillStyle = hexA(C.amarillo, 0.95); rrect(c, -150, -45, 300, 90, [22, 22, 22, 6]); c.fill();
        text(c, '¡Listo, ya los busco!', 0, 10, { w: 700, size: 25, col: C.negro, align: 'center' });
      });
      // tres puntitos: el agente "pensando"
      for (let i = 0; i < 3; i++) {
        const k = inn(t, this.tTiq + 0.6, 0.3);
        c.fillStyle = hexA(C.azul, k * (0.4 + 0.6 * Math.max(0, Math.sin(t * 6 - i * 0.9))));
        c.beginPath(); c.arc(-130 + i * 34, 225, 11, 0, Math.PI * 2); c.fill();
      }
    });
    if (pk >= 1) tape(c, PH.x + 150, PH.y - PH.h / 2 + 10, 120, 0.5, undefined, 22);

    // ---- el tiquete sale volando del celular
    const tk = ease.outCubic(clamp((t - this.tTiq) / 0.7));
    if (tk > 0) {
      const x = 860 + 340 * tk, y = 330 - 230 * tk + float(t, 2, 6, 1.4);
      at(c, x, y, { s: 0.4 + 0.45 * tk, r: lerpR(tk) }, () => ticket(c, 200));
      burst(c, 1200, 100, t, this.tTiq + 0.6, C.amarillo, 90, 9);
    }

    // ---- "¿Quién es?" con el escudo de identidad
    const qk = ease.outBack(clamp((t - this.tSabes) / 0.45), 1.6);
    const dim = 1 - 0.55 * inn(t, this.tPero + 0.3, 0.4);
    at(c, 1500, 310, { s: qk, r: 0.02, a: dim }, () => {
      text(c, '¿Quién es?', 40, 32, { w: 800, size: 88, col: C.azul, align: 'center' });
      at(c, -250, 0, { s: pop(t, this.tAgente, 0.4) }, () => shield(c, 110, C.verde, clamp((t - this.tAgente - 0.2) / 0.35)));
    });
    scratchOut(c, 1310, 272, 480, 70, ease.inOutCubic(clamp((t - this.tPero) / 0.35)), C.naranja, 10);

    // ---- flecha y sello "¿Qué puede hacer?"
    doodleArrow(c, pt(1480, 370), pt(1560, 410), pt(1480, 455), ease.inOutCubic(clamp((t - this.tPero - 0.15) / 0.4)), C.azul, 7);
    const st = clamp((t - this.tPuede) / 0.22);
    if (st > 0) {
      at(c, 1480, 545 + float(t, 3, 4, 1.2), { s: 2.2 - 1.2 * ease.inQuad(st), r: -0.035, a: clamp(st * 2) }, () => {
        tornPaper(c, 700, 140, C.amarillo, 23, { tear: 9 });
        text(c, '¿Qué puede hacer?', 0, 28, { w: 800, size: 74, col: C.azul, align: 'center' });
      });
      burst(c, 1480, 545, t, this.tPuede + 0.22, C.naranja, 300, 14);
    }

    // ---- las tres dudas
    const doubts: [number, string, (s: number) => void][] = [
      [this.tGastar, '¿Hasta cuánto?', (s) => icon.wallet(c, s, C.azul)],
      [this.tTarjeta, '¿Con qué tarjeta?', (s) => card(c, s, C.morado)],
      [this.tPreg, '¿Debía preguntar?', (s) => icon.bubble(c, s, C.azul, undefined, C.azul)],
    ];
    doubts.forEach(([tw, label, ic], i) => {
      const k = pop(t, tw - 0.05, 0.42);
      at(c, 1480, 720 + i * 98 + float(t, i + 4, 3, 1.6), { s: k, r: (i % 2 ? 1 : -1) * 0.015 }, () => {
        c.fillStyle = C.blanco; c.save(); c.shadowColor = 'rgba(40,30,20,0.22)'; c.shadowBlur = 12; c.shadowOffsetY = 6;
        rrect(c, -300, -40, 600, 80, 40); c.fill(); c.restore();
        c.strokeStyle = C.azul; c.lineWidth = 3; c.stroke();
        at(c, -240, 0, {}, () => ic(52));
        text(c, label, -190, 14, { w: 700, size: 38, col: C.azul });
      });
    });
    doodle(c, 'spark', 1830, 160, 24, C.naranja, ease.inOutCubic(clamp((t - this.tPuede - 0.3) / 0.4)));
    c.restore();
    return {};
  }
}

const lerpR = (k: number) => -0.4 + 0.5 * k;
