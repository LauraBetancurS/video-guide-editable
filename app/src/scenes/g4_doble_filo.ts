// 👉 AQUÍ SE REEMPLAZA ESTE CONTENIDO
// ESCENA 4 — Doble filo (fondo azul)
// Voz: "El dato transaccional se convierte en reputación, en infraestructura y en poder económico.
// Si se usa bien, amplía el acceso para quien no tiene historial en el buró.
// Si se usa mal, la portabilidad se vuelve vigilancia o exclusión automática."
// Primero caen tres papeles: reputación, infraestructura, poder económico. Luego suben y la pantalla se
// divide: a la izquierda (verde) "Si se usa bien": una puerta que se abre y el sello "Acceso"; a la derecha
// (naranja) "Si se usa mal": una cámara que vigila y una puerta que se cierra, con los sellos
// "Vigilancia" y "Exclusión".
import type { Frame, PostOverrides } from '../engine/scene';
import { C, Plate, at, burst, clamp, decor, ease, float, hexA, icon, inn, kinetic, lerp, pop, rrect, spoken, stampShake, tape, text, tornPaper, type KWordT } from './_kit';
import { camera } from './_datos';

export default class G4 extends Plate {
  head: KWordT[] = []; good: KWordT[] = []; bad: KWordT[] = [];
  tRep = 0; tInf = 0; tPod = 0; tL2 = 0; tBien = 0; tAcc = 0; tBuro = 0; tL3 = 0; tMal = 0; tVig = 0; tExc = 0;
  override setup() {
    const S = this.S, L1 = 'El dato transaccional', L2 = 'Si se usa bien', L3 = 'Si se usa mal';
    this.prevBg = C.blanco;
    this.head = spoken(S, L1, 'El', 'en');
    this.tRep = S.word(L1, 'reputación').start;
    this.tInf = S.word(L1, 'infraestructura').start;
    this.tPod = S.word(L1, 'poder').start;
    this.tL2 = S.line(L2).start;
    this.tBien = S.word(L2, 'bien').start;
    this.tAcc = S.word(L2, 'acceso').start;
    this.tBuro = S.word(L2, 'buró').start;
    this.good = spoken(S, L2, 'para', 'buró.');
    this.tL3 = S.line(L3).start;
    this.tMal = S.word(L3, 'mal').start;
    this.tVig = S.word(L3, 'vigilancia').start;
    this.tExc = S.word(L3, 'exclusión').start;
    this.bad = spoken(S, L3, 'la', 'vuelve');
  }

  draw(c: CanvasRenderingContext2D, t: number, _f: Frame): PostOverrides {
    c.fillStyle = C.azul; c.fillRect(0, 0, 1920, 1080);
    decor(c, t, true, 71);
    const s1 = stampShake(t, this.tRep + 0.2, 6), s2 = stampShake(t, this.tAcc + 0.2, 7), s3 = stampShake(t, this.tExc + 0.2, 9);
    c.save(); c.translate(s1[0] + s2[0] + s3[0], s1[1] + s2[1] + s3[1]);

    // ---- parte 1: la frase y los tres papeles (luego suben y se encogen)
    const up = ease.inOutCubic(clamp((t - this.tL2 + 0.3) / 0.6));
    c.save(); c.globalAlpha = 1 - up;
    kinetic(c, t, this.head, 960, 230, { w: 800, size: 64, col: C.blanco, align: 'center' });
    c.restore();
    const words: [string, number, string, string][] = [
      ['reputación', this.tRep, C.blanco, C.azul],
      ['infraestructura', this.tInf, C.amarillo, C.azul],
      ['poder económico', this.tPod, C.morado, C.blanco],
    ];
    words.forEach(([w, tw, bg, ink], i) => {
      const st = clamp((t - tw + 0.02) / 0.22);
      if (st <= 0) return;
      const x = lerp(960 + (i - 1) * 580, 960 + (i - 1) * 380, up), y = lerp(500, 150, up), sc = lerp(1, 0.62, up);
      at(c, x, y + float(t, i, 5, 1.3), { s: sc * (1.4 - 0.4 * ease.inQuad(st)), r: (i - 1) * 0.035, a: clamp(st * 2) }, () => {
        tornPaper(c, 500, 140, bg, 72 + i, { tear: 9 });
        text(c, w, 0, 20, { w: 800, size: 54, col: ink, align: 'center' });
      });
      burst(c, x, y, t, tw + 0.22, C.amarillo, 260, 12);
    });

    // ---- parte 2: pantalla dividida
    const panel = (cx: number, tIn: number, col: string, title: string, seed: number, fn: () => void) => {
      const k = ease.outBack(clamp((t - tIn + 0.15) / 0.5), 1.2);
      if (k <= 0) return;
      at(c, cx, 640 + (1 - k) * 200 + float(t, seed, 4, 1), { a: clamp(k * 1.5), r: (seed % 2 ? 1 : -1) * 0.01 }, () => {
        tornPaper(c, 820, 560, C.blanco, seed);
        c.fillStyle = col; rrect(c, -410, -280, 820, 96, [8, 8, 0, 0]); c.fill();
        text(c, title, 0, -215, { w: 800, size: 50, col: C.blanco, align: 'center' });
        fn();
      });
      if (k >= 1) tape(c, cx - 360, 380, 120, -0.5, undefined, seed + 5);
    };

    // izquierda: "Si se usa bien" → la puerta se abre, "Acceso"
    panel(500, this.tL2, C.verde, 'Si se usa bien', 75, () => {
      const dk = ease.inOutCubic(clamp((t - this.tAcc) / 0.6));
      // marco y puerta (se abre: se encoge en x)
      c.fillStyle = C.amarillo; rrect(c, -330, -140, 200, 330, 10); c.fill();
      c.fillStyle = C.verde; rrect(c, -330, -140, 200 * (1 - 0.8 * dk), 330, 10); c.fill();
      c.fillStyle = C.blanco; c.beginPath(); c.arc(-330 + 200 * (1 - 0.8 * dk) - 24, 30, 10, 0, Math.PI * 2); c.fill();
      at(c, -230 + 40 * dk, 60, { s: inn(t, this.tAcc + 0.2, 0.4) }, () => icon.person(c, 120, C.azul));
      // sello "Acceso"
      const st = clamp((t - this.tAcc) / 0.22);
      if (st > 0) at(c, 140, -50, { s: 2 - ease.inQuad(st), r: -0.06, a: clamp(st * 2) }, () => {
        c.strokeStyle = C.verde; c.lineWidth = 9; rrect(c, -170, -58, 340, 116, 14); c.stroke();
        text(c, 'Acceso', 0, 24, { w: 800, size: 72, col: C.verde, align: 'center' });
      });
      // "para quien no tiene historial en el buró."
      c.save(); c.translate(140, 0);
      kinetic(c, t, this.good.slice(0, 3), 0, 80, { w: 600, size: 34, col: C.negro, align: 'center' });
      kinetic(c, t, this.good.slice(3), 0, 130, { w: 600, size: 34, col: C.negro, align: 'center' });
      c.restore();
      if (t > this.tBuro) at(c, 140, 200, { s: pop(t, this.tBuro + 0.1, 0.4) }, () => icon.check(c, 34, C.verde));
    });

    // derecha: "Si se usa mal" → vigilancia y exclusión
    panel(1420, this.tL3, C.naranja, 'Si se usa mal', 76, () => {
      c.save(); c.translate(0, -120);
      kinetic(c, t, this.bad, 0, 0, { w: 600, size: 34, col: C.negro, align: 'center' });
      c.restore();
      const stamp = (x: number, tw: number, word: string, ic: () => void) => {
        at(c, x, 30, { s: pop(t, tw - 0.15, 0.45) }, ic);
        const st = clamp((t - tw) / 0.22);
        if (st > 0) at(c, x, 175, { s: 2 - ease.inQuad(st), r: (x < 0 ? -1 : 1) * 0.05, a: clamp(st * 2) }, () => {
          c.fillStyle = hexA(C.naranja, 0.12); rrect(c, -170, -48, 340, 96, 12); c.fill();
          c.strokeStyle = C.naranja; c.lineWidth = 7; rrect(c, -170, -48, 340, 96, 12); c.stroke();
          text(c, word, 0, 18, { w: 800, size: 50, col: C.naranja, align: 'center' });
        });
      };
      stamp(-190, this.tVig, 'Vigilancia', () => camera(c, 190, t));
      stamp(190, this.tExc, 'Exclusión', () => {
        // puerta que se cierra con candado
        const ck = ease.outBack(clamp((t - this.tExc) / 0.4), 1.6);
        c.fillStyle = C.gris2; rrect(c, -80, -110, 160, 220, 10); c.fill();
        c.fillStyle = C.naranja; rrect(c, -80, -110, 160 * (0.2 + 0.8 * ck), 220, 10); c.fill();
        if (ck > 0.9) at(c, 0, 0, { s: pop(t, this.tExc + 0.35, 0.35) }, () => icon.roadClosed(c, 90));
      });
    });
    burst(c, 1610, 815, t, this.tExc + 0.22, C.amarillo, 200, 12);
    c.restore();
    return {};
  }
}
