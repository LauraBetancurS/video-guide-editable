// 👉 AQUÍ SE REEMPLAZA ESTE CONTENIDO
// ESCENA 4 — Ocho aprendizajes (fondo azul)
// Voz: "De esas señales salieron ocho aprendizajes. Cada uno muestra un cambio: cómo funcionan las cosas hoy
// y cómo podrían funcionar mañana. Por ejemplo, sistemas que se conectan entre sí, decisiones tomadas con
// datos o dinero digital con garantías."
// Cae la tira "8 aprendizajes" y llegan 8 tarjetas de papel con sus íconos. Abajo, la barra "Hoy → Mañana"
// se llena entre "hoy" y "mañana". En cada ejemplo se levanta su tarjeta (1, 2 y 7) y las demás se apagan.
import type { Frame, PostOverrides } from '../engine/scene';
import { C, Plate, at, burst, clamp, decor, ease, fit, float, hexA, inn, measureText, pop, rrect, text, tornPaper } from './_kit';
import { APRENDIZAJES, aprIcon, strip } from './_futuros';

export default class P4 extends Plate {
  tOcho = 0; tApr = 0; tCambio = 0; tHoy = 0; tMan = 0; tEj = 0; tSis = 0; tDat = 0; tDin = 0;
  override setup() {
    const S = this.S;
    this.prevBg = C.blanco;
    this.tOcho = S.word('De esas señales salieron', 'ocho').start;
    this.tApr = S.word('De esas señales salieron', 'aprendizajes').start;
    this.tCambio = S.word('Cada uno muestra', 'cambio').start;
    this.tHoy = S.word('Cada uno muestra', 'hoy').start;
    this.tMan = S.word('Cada uno muestra', 'mañana').start;
    this.tEj = S.word('Por ejemplo, sistemas', 'ejemplo').start;
    this.tSis = S.word('Por ejemplo, sistemas', 'sistemas').start;
    this.tDat = S.word('Por ejemplo, sistemas', 'datos').start;
    this.tDin = S.word('Por ejemplo, sistemas', 'dinero').start;
  }

  draw(c: CanvasRenderingContext2D, t: number, _f: Frame): PostOverrides {
    c.fillStyle = C.azul; c.fillRect(0, 0, 1920, 1080);
    decor(c, t, true, 44);
    const m = (s: string, w: number, z: number) => measureText(c, s, w, z);

    at(c, 960, 150 + float(t, 0, 4, 1.1), { s: ease.outBack(clamp((t - this.tOcho + 0.05) / 0.45), 1.5), r: -0.02 }, () =>
      strip(c, '8 aprendizajes', 76, C.blanco, C.azul, 4, m));

    // destacadas: [índice, momento]
    const hi: [number, number][] = [[0, this.tSis], [1, this.tDat], [6, this.tDin]];
    const dimAll = inn(t, this.tSis - 0.2, 0.4);
    for (let i = 0; i < 8; i++) {
      const col = i % 4, row = Math.floor(i / 4);
      const x = 390 + col * 380, y = 400 + row * 220;
      const k = ease.outBack(clamp((t - this.tApr - i * 0.07) / 0.4), 1.5);
      if (k <= 0) continue;
      const h = hi.find(([j]) => j === i);
      const lift = h ? ease.outBack(clamp((t - h[1] + 0.05) / 0.4), 1.6) : 0;
      const a = h ? 1 : 1 - 0.5 * dimAll;
      at(c, x, y + float(t, i, 4, 1.3) - lift * 18, { s: k * (1 + lift * 0.12), r: ((i % 3) - 1) * 0.02, a }, () => {
        if (lift > 0) tornPaper(c, 352, 202, C.amarillo, 30 + i, { tear: 8 });
        tornPaper(c, 330, 180, C.blanco, 10 + i, { tear: 7, shadow: lift <= 0 });
        at(c, 0, -44, {}, () => aprIcon(c, i + 1, 48, C.azul));
        const [l1, l2] = APRENDIZAJES[i]!;
        const fz = Math.min(fit(c, l1, 800, 300, 23), fit(c, l2, 800, 300, 23));
        text(c, l1, 0, 26, { w: 800, size: fz, col: C.azul, align: 'center' });
        text(c, l2, 0, 26 + fz * 1.25, { w: 800, size: fz, col: C.azul, align: 'center' });
      });
      if (h) burst(c, x, y - 18, t, h[1] + 0.3, C.amarillo, 200, 10);
    }

    // barra Hoy → Mañana
    const bk = inn(t, this.tCambio, 0.45);
    if (bk > 0) {
      const x0 = 610, x1 = 1310, y = 870;
      const fill = ease.inOutCubic(clamp((t - this.tHoy) / Math.max(0.4, this.tMan - this.tHoy)));
      c.save(); c.globalAlpha = bk;
      c.fillStyle = 'rgba(255,255,255,0.22)'; rrect(c, x0, y - 10, x1 - x0, 20, 10); c.fill();
      c.fillStyle = C.amarillo; rrect(c, x0, y - 10, (x1 - x0) * fill + 0.01, 20, 10); c.fill();
      at(c, x0 + (x1 - x0) * fill, y, { s: 1 + 0.08 * Math.sin(t * 5) }, () => {
        c.beginPath(); c.arc(0, 0, 24, 0, Math.PI * 2); c.fillStyle = C.amarillo; c.fill(); c.lineWidth = 6; c.strokeStyle = C.blanco; c.stroke();
      });
      text(c, 'Hoy', x0 - 40, y + 14, { w: 800, size: 40, col: hexA(C.blanco, 0.6 + 0.4 * pop(t, this.tHoy, 0.3)), align: 'right' });
      text(c, 'Mañana', x1 + 40, y + 14, { w: 800, size: 40, col: hexA(C.blanco, 0.6 + 0.4 * pop(t, this.tMan, 0.3)) });
      c.restore();
    }
    return {};
  }
}
