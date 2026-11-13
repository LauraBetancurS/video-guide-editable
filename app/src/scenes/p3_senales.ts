// 👉 AQUÍ SE REEMPLAZA ESTE CONTENIDO
// ESCENA 3 — Señales (fondo papel)
// Voz: "Rastreamos señales de cambio en tres mundos que se están cruzando: Fintech, Agrotech y los modelos de negocio."
// Se escribe "Rastreamos señales de cambio"; titilan puntos (las señales). Entran tres círculos —Fintech (moneda),
// Agrotech (hoja) y Modelos de negocio (engranaje)— cada uno cuando se nombra, y se cruzan en el centro.
import type { Frame, PostOverrides } from '../engine/scene';
import { C, Plate, at, burst, clamp, decor, doodle, ease, hexA, inn, kinetic, labelPill, lerp, spoken, vnoise, type KWordT } from './_kit';
import { coin, gear, leaf } from './_futuros';

export default class P3 extends Plate {
  l1: KWordT[] = [];
  tSen = 0; tCruz = 0; tFin = 0; tAgro = 0; tMod = 0;
  override setup() {
    const S = this.S, L = 'Rastreamos señales';
    this.prevBg = C.azul;
    this.l1 = spoken(S, L, 'Rastreamos', 'cambio');
    this.tSen = S.word(L, 'señales').start;
    this.tCruz = S.word(L, 'cruzando').start;
    this.tFin = S.word(L, 'Fintech').start;
    this.tAgro = S.word(L, 'Agrotech').start;
    this.tMod = S.word(L, 'modelos').start;
  }

  draw(c: CanvasRenderingContext2D, t: number, _f: Frame): PostOverrides {
    decor(c, t, false, 33);
    kinetic(c, t, this.l1, 960, 160, { w: 800, size: 64, col: C.azul, align: 'center' });

    // señales que titilan
    for (let i = 0; i < 46; i++) {
      const x = 960 + vnoise(i * 3.1, 1) * 820, y = 560 + vnoise(i * 2.3, 2) * 340;
      const k = inn(t, this.tSen + (i % 12) * 0.05, 0.3);
      if (k <= 0) continue;
      const tw = 0.45 + 0.55 * Math.max(0, Math.sin(t * 3 + i * 1.3));
      c.fillStyle = hexA([C.azul, C.verde, C.morado, C.naranja][i % 4]!, 0.55 * k * tw);
      c.beginPath(); c.arc(x, y, 7 + (i % 3) * 3, 0, Math.PI * 2); c.fill();
    }

    const R = 205;
    const mundos: [number, number, number, number, number, string, string, (s: number) => void, number, number][] = [
      // t0, desde x, desde y, a x, a y, color, nombre, ícono, label x, label y
      [this.tFin, -300, 520, 845, 480, C.azul, 'Fintech', (s) => coin(c, s), 560, 330],
      [this.tAgro, 2220, 520, 1075, 480, C.verde, 'Agrotech', (s) => leaf(c, s), 1360, 330],
      [this.tMod, 960, 1400, 960, 680, C.morado, 'Modelos de negocio', (s) => gear(c, s, C.morado, t), 960, 935],
    ];
    mundos.forEach(([t0, x0, y0, x1, y1, col, name, ic, lx, ly], i) => {
      const k = ease.outCubic(clamp((t - t0 + 0.15) / 0.55));
      if (k <= 0) return;
      const x = lerp(x0, x1, k) + Math.sin(t * 1.1 + i * 2) * 5, y = lerp(y0, y1, k) + Math.cos(t * 1.2 + i) * 5;
      c.save();
      c.globalCompositeOperation = 'multiply';
      c.fillStyle = hexA(col, 0.22); c.beginPath(); c.arc(x, y, R, 0, Math.PI * 2); c.fill();
      c.restore();
      c.strokeStyle = col; c.lineWidth = 6; c.beginPath(); c.arc(x, y, R, 0, Math.PI * 2); c.stroke();
      const ox = (x1 - 960) * 1.0, oy = (y1 - 560) * 1.0;
      at(c, x + ox * 0.55, y + oy * 0.55, { s: k }, () => ic(96));
      at(c, lx, ly, { s: ease.outBack(clamp((t - t0) / 0.4), 1.6), r: (i - 1) * 0.03 }, () =>
        labelPill(c, name, 0, 0, { fill: col, col: C.blanco, size: 38, w: 800 }));
    });
    // el cruce
    const ck = inn(t, this.tMod + 0.6, 0.4);
    doodle(c, 'star', 960, 548, 34, C.amarillo, ck);
    burst(c, 960, 548, t, this.tMod + 0.6, C.amarillo, 140, 10);
    doodle(c, 'spiral', 1710, 210, 28, C.azul, inn(t, this.tCruz, 0.4));
    return {};
  }
}
