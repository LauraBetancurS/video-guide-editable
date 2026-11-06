// 👉 AQUÍ SE REEMPLAZA ESTE CONTENIDO
// ESCENA 2 — Pasado y presente (fondo azul)
// Voz: "El buró mira el pasado: si alguien ha querido pagar. Los pagos muestran el presente: ventas,
// frecuencia, crecimiento y temporadas. Es decir, si hoy puede pagar."
// Pantalla dividida. Izquierda: "Buró · el pasado", una foto vieja con una gráfica quieta y la frase
// "si alguien ha querido pagar." Derecha: "Pagos · el presente", una gráfica en vivo que se mueve, las
// etiquetas ventas / frecuencia / crecimiento / temporadas y la frase "si hoy puede pagar."
import type { Frame, PostOverrides } from '../engine/scene';
import { C, Plate, at, clamp, decor, ease, float, hexA, icon, kinetic, labelPill, pop, rrect, spoken, tape, text, tornPaper, type KWordT } from './_kit';

const SEPIA = '#E9DDC4', SEPIA_INK = '#9C8460';

export default class R2 extends Plate {
  left: KWordT[] = []; right: KWordT[] = [];
  tL1 = 0; tL2 = 0; tL3 = 0; tVen = 0; tFre = 0; tCre = 0; tTem = 0; tEnd = 0;
  override setup() {
    const S = this.S, L1 = 'El buró mira', L2 = 'Los pagos muestran', L3 = 'Es decir';
    this.prevBg = C.blanco;
    this.tL1 = S.line(L1).start; this.tL2 = S.line(L2).start; this.tL3 = S.line(L3).start; this.tEnd = S.line(L3).end;
    this.left = spoken(S, L1, 'si', 'pagar.');
    this.right = spoken(S, L3, 'si', 'pagar.');
    this.tVen = S.word(L2, 'ventas').start;
    this.tFre = S.word(L2, 'frecuencia').start;
    this.tCre = S.word(L2, 'crecimiento').start;
    this.tTem = S.word(L2, 'temporadas').start;
  }

  draw(c: CanvasRenderingContext2D, t: number, _f: Frame): PostOverrides {
    c.fillStyle = C.azul; c.fillRect(0, 0, 1920, 1080);
    decor(c, t, true, 111);

    const card = (cx: number, tIn: number, col: string, title: string, seed: number, hot: boolean, fn: () => void) => {
      const k = ease.outBack(clamp((t - tIn + 0.15) / 0.5), 1.2);
      if (k <= 0) return;
      const hk = hot ? 1 : 0;
      at(c, cx, 560 + (1 - k) * 200 + float(t, seed, 4, 1), { a: clamp(k * 1.5), r: (seed % 2 ? 1 : -1) * 0.012, s: 1 + 0.03 * hk }, () => {
        tornPaper(c, 800, 720, C.blanco, seed);
        c.fillStyle = col; rrect(c, -400, -360, 800, 100, [8, 8, 0, 0]); c.fill();
        text(c, title, 0, -292, { w: 800, size: 50, col: C.blanco, align: 'center' });
        fn();
      });
      if (k >= 1) tape(c, cx, 190, 130, (seed % 2 ? 1 : -1) * 0.15, undefined, seed + 5);
    };

    // ---- izquierda: el buró mira el pasado
    const hotL = t < this.tL2;
    card(500, this.tL1, C.gris1, 'Buró · el pasado', 112, hotL, () => {
      at(c, 0, -60, { r: -0.03 }, () => {
        c.fillStyle = C.blanco; rrect(c, -290, -160, 580, 320, 6); c.fill();
        c.fillStyle = SEPIA; c.fillRect(-270, -140, 540, 250);
        c.strokeStyle = SEPIA_INK; c.lineWidth = 6; c.lineJoin = 'round'; c.beginPath();
        [[-240, 60], [-160, 20], [-80, 40], [0, -10], [80, 10], [160, -40], [240, -20]].forEach(([x, y], i) => (i ? c.lineTo(x!, y!) : c.moveTo(x!, y!)));
        c.stroke();
        text(c, '2019 · 2020 · 2021', 0, 145, { w: 800, size: 22, col: SEPIA_INK, align: 'center' });
      });
      kinetic(c, t, this.left, 0, 210, { w: 700, size: 42, col: C.negro, align: 'center' });
      if (t > this.tL2) at(c, 0, 290, { s: pop(t, this.tL2 - 0.2, 0.4) }, () => labelPill(c, 'El pasado', 0, 0, { fill: C.gris2, col: C.negro, size: 30, w: 800 }));
    });

    // ---- derecha: los pagos muestran el presente
    const hotR = t >= this.tL2;
    card(1420, this.tL2, C.verde, 'Pagos · el presente', 113, hotR, () => {
      // gráfica en vivo
      c.fillStyle = hexA(C.verde, 0.1); rrect(c, -290, -200, 580, 240, 10); c.fill();
      c.save(); c.beginPath(); rrect(c, -290, -200, 580, 240, 10); c.clip();
      c.strokeStyle = C.verde; c.lineWidth = 6; c.lineJoin = 'round'; c.beginPath();
      for (let x = -290; x <= 290; x += 10) {
        const u = (x + t * 120) / 60;
        const y = -40 - (x + 290) * 0.18 + Math.sin(u) * 22 + Math.sin(u * 0.37) * 18;
        if (x === -290) c.moveTo(x, y); else c.lineTo(x, y);
      }
      c.stroke(); c.restore();
      // punto "en vivo"
      c.fillStyle = Math.sin(t * 6) > 0 ? C.naranja : hexA(C.naranja, 0.35); c.beginPath(); c.arc(-250, -170, 10, 0, Math.PI * 2); c.fill();
      text(c, 'EN VIVO', -230, -161, { w: 800, size: 22, col: C.naranja });
      const chips: [string, number, number, number][] = [
        ['ventas', this.tVen, -150, 100], ['frecuencia', this.tFre, 150, 100],
        ['crecimiento', this.tCre, -150, 165], ['temporadas', this.tTem, 150, 165],
      ];
      chips.forEach(([s, tw, x, y], i) => {
        const k = pop(t, tw - 0.05, 0.4);
        if (k > 0) at(c, x, y + float(t, i + 3, 3, 1.4), { s: k }, () => labelPill(c, s, 0, 0, { fill: i % 2 ? C.azul : C.amarillo, col: i % 2 ? C.blanco : C.azul, size: 30, w: 800 }));
      });
      kinetic(c, t, this.right, 0, 260, { w: 700, size: 46, col: C.azul, align: 'center' });
      if (t > this.tEnd - 0.4) at(c, 215, 245, { s: pop(t, this.tEnd - 0.4, 0.4) }, () => { c.fillStyle = C.verde; c.beginPath(); c.arc(0, 0, 28, 0, Math.PI * 2); c.fill(); icon.check(c, 32, C.blanco); });
    });
    return {};
  }
}
