// 👉 AQUÍ SE REEMPLAZA ESTE CONTENIDO
// ESCENA 2 — El problema: los riesgos (fondo azul)
// Voz: "Identificar a un agente ya no es suficiente. Según Experian, en 2026 el fraude a través de agentes
// de IA es el riesgo número uno. Los deepfakes son el número dos."
// La frase entra palabra por palabra. A la izquierda, la credencial del agente con su escudo verde: con
// "suficiente" cae el sello naranja "NO BASTA". A la derecha se arma el ranking de Experian 2026: el #1
// (Agentes IA) cae con golpe en "uno" y el #2 (Deepfakes) en "dos".
import type { Frame, PostOverrides } from '../engine/scene';
import { C, Plate, at, burst, clamp, decor, ease, float, hexA, inn, kinetic, pop, rrect, spoken, stampShake, tape, text, tornPaper, type KWordT } from './_kit';
import { robot, shield } from './_agente';

export default class A2 extends Plate {
  head: KWordT[] = [];
  tId = 0; tSuf = 0; tExp = 0; t2026 = 0; tFraude = 0; tRiesgo = 0; tUno = 0; tDeep = 0; tDos = 0;

  override setup() {
    const S = this.S, L1 = 'Identificar a un agente', L2 = 'Según Experian', L3 = 'Los deepfakes';
    this.prevBg = C.blanco;
    this.revealFrom = { x: 960, y: 540 };
    this.head = spoken(S, L1);
    this.tId = S.word(L1, 'Identificar').start;
    this.tSuf = S.word(L1, 'suficiente').start;
    this.tExp = S.word(L2, 'Experian').start;
    this.t2026 = S.word(L2, '2026').start;
    this.tFraude = S.word(L2, 'fraude').start;
    this.tRiesgo = S.word(L2, 'riesgo').start;
    this.tUno = S.word(L2, 'uno').start;
    this.tDeep = S.word(L3, 'deepfakes').start;
    this.tDos = S.word(L3, 'dos').start;
  }

  draw(c: CanvasRenderingContext2D, t: number, _f: Frame): PostOverrides {
    c.fillStyle = C.azul; c.fillRect(0, 0, 1920, 1080);
    decor(c, t, true, 31);
    const s1 = stampShake(t, this.tSuf + 0.2, 8), s2 = stampShake(t, this.tUno + 0.2, 12), s3 = stampShake(t, this.tDos + 0.2, 7);
    c.save(); c.translate(s1[0] + s2[0] + s3[0], s1[1] + s2[1] + s3[1]);

    // ---- la frase, arriba (se apaga un poco cuando empieza el ranking)
    c.save(); c.globalAlpha = 1 - 0.45 * inn(t, this.tExp, 0.5);
    kinetic(c, t, this.head, 960, 165, { w: 800, size: 66, col: C.blanco, align: 'center' });
    c.restore();

    // ---- la credencial del agente
    const ck = ease.outBack(clamp((t - this.tId + 0.1) / 0.5), 1.3);
    at(c, 470, 590 + float(t, 0, 6, 1.1), { s: ck, r: -0.05 }, () => {
      tornPaper(c, 520, 380, C.blanco, 32);
      c.fillStyle = hexA(C.azul, 0.1); rrect(c, -230, -160, 180, 200, 20); c.fill();
      at(c, -140, -60, {}, () => robot(c, 130, t));
      text(c, 'AGENTE IA', 0, -110, { w: 800, size: 34, col: C.azul, ls: 2 });
      c.fillStyle = C.gris2; for (let i = 0; i < 3; i++) { rrect(c, 0, -80 + i * 34, 200 - i * 40, 14, 7); c.fill(); }
      text(c, 'Identidad verificada', -220, 120, { w: 700, size: 30, col: C.verde });
      at(c, 180, 110, { s: pop(t, this.tId + 0.5, 0.4) }, () => shield(c, 80, C.verde, clamp((t - this.tId - 0.7) / 0.35)));
    });
    if (ck >= 1) tape(c, 470, 400, 130, -0.08, undefined, 33);
    // sello NO BASTA
    const st = clamp((t - this.tSuf) / 0.22);
    if (st > 0) {
      at(c, 480, 610, { s: 2.3 - 1.3 * ease.inQuad(st), r: -0.18, a: clamp(st * 2) }, () => {
        c.fillStyle = hexA(C.blanco, 0.85); rrect(c, -205, -60, 410, 120, 16); c.fill();
        c.strokeStyle = C.naranja; c.lineWidth = 10; c.beginPath(); c.roundRect(-205, -60, 410, 120, 16); c.stroke();
        c.lineWidth = 3; c.beginPath(); c.roundRect(-192, -47, 384, 94, 10); c.stroke();
        text(c, 'NO BASTA', 0, 24, { w: 800, size: 68, col: C.naranja, align: 'center', ls: 3 });
      });
      burst(c, 480, 610, t, this.tSuf + 0.22, C.amarillo, 250, 12);
    }

    // ---- el ranking de Experian
    const ek = pop(t, this.tExp - 0.05, 0.45);
    const pulse = t > this.t2026 && t < this.t2026 + 0.5 ? 0.1 * Math.sin(((t - this.t2026) / 0.5) * Math.PI) : 0; // "2026" late
    at(c, 1330, 350, { s: ek * (1 + pulse), r: 0.02 }, () => {
      tornPaper(c, 470, 84, C.amarillo, 34);
      text(c, 'Experian · 2026', 0, 15, { w: 800, size: 44, col: C.azul, align: 'center' });
    });
    const fk = inn(t, this.tFraude, 0.4);
    if (fk > 0) text(c, 'Riesgos de fraude', 1330, 445 + (1 - fk) * 20, { w: 600, size: 34, col: hexA(C.blanco, 0.9 * fk), align: 'center' });

    const rankCard = (y: number, tIn: number, tNum: number, num: string, label: string, col: string, w: number, h: number, size: number, italic: boolean, seed: number) => {
      const k = ease.outBack(clamp((t - tIn) / 0.45), 1.4);
      if (k <= 0) return;
      const slide = (1 - ease.outCubic(clamp((t - tIn) / 0.45))) * 500;
      at(c, 1330 + slide, y + float(t, seed, 4, 1.3), { s: 0.6 + 0.4 * k, r: (seed % 2 ? 1 : -1) * 0.015 }, () => {
        tornPaper(c, w, h, col, seed);
        // el número cae como sello en su palabra
        const nk = clamp((t - tNum) / 0.2);
        if (nk > 0) at(c, -w / 2 + 110, 0, { s: 2 - ease.inQuad(nk), a: clamp(nk * 2) }, () => {
          c.fillStyle = C.blanco; c.beginPath(); c.arc(0, 0, h * 0.36, 0, Math.PI * 2); c.fill();
          text(c, num, 0, size * 0.36, { w: 800, size, col, align: 'center' });
        });
        text(c, label, -w / 2 + 210, size * 0.36, { w: 800, size, col: C.blanco, italic });
      });
      burst(c, 1330 - w / 2 + 110, y, t, tNum + 0.2, C.amarillo, h * 0.6, 10);
    };
    rankCard(590, this.tRiesgo - 0.1, this.tUno, '#1', 'Agentes IA', C.naranja, 820, 170, 70, false, 35);
    rankCard(800, this.tDeep - 0.15, this.tDos, '#2', 'Deepfakes', C.morado, 700, 140, 58, true, 36);
    c.restore();
    return {};
  }
}
