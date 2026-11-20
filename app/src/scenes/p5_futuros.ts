// 👉 AQUÍ SE REEMPLAZA ESTE CONTENIDO
// ESCENA 5 — Cuatro posibles futuros (fondo papel)
// Voz: "Con esos aprendizajes construimos cuatro posibles futuros hacia 2031: una red de cooperativas que
// convierte los datos en acceso y confianza, el peaje invisible de las plataformas que controlan el campo,
// el dinero digital con reglas claras, y una automatización desigual que obliga a un nuevo acuerdo."
// Arriba: "4 posibles futuros" y la pastilla "2031". Cada futuro llega como polaroid con su ilustración,
// pegada con cinta, cuando la voz lo nombra (verde, naranja, azul, morado: los colores de la página).
import type { Frame, PostOverrides } from '../engine/scene';
import { C, Plate, at, burst, clamp, decor, ease, float, labelPill, loadImage, measureText, pop } from './_kit';
import { FUTUROS, cover, polaroid, strip } from './_futuros';

export default class P5 extends Plate {
  imgs: (HTMLImageElement | null)[] = [];
  tCuatro = 0; t2031 = 0; ts: number[] = [];
  override async load() { this.imgs = await Promise.all(FUTUROS.map((f) => loadImage(f.file))); }
  override setup() {
    const S = this.S, L = 'Con esos aprendizajes';
    this.prevBg = C.azul;
    this.tCuatro = S.word(L, 'cuatro').start;
    this.t2031 = S.word(L, 'hacia').start;
    this.ts = [S.word(L, 'red').start, S.word(L, 'peaje').start, S.word(L, 'dinero').start, S.word(L, 'automatización').start];
  }

  draw(c: CanvasRenderingContext2D, t: number, _f: Frame): PostOverrides {
    decor(c, t, false, 55);
    const m = (s: string, w: number, z: number) => measureText(c, s, w, z);
    at(c, 900, 160 + float(t, 0, 4, 1.1), { s: ease.outBack(clamp((t - this.tCuatro + 0.05) / 0.45), 1.5), r: -0.02 }, () =>
      strip(c, '4 posibles futuros', 72, C.azul, C.blanco, 6, m));
    at(c, 1420, 150, { s: pop(t, this.t2031, 0.45), r: 0.06 }, () => labelPill(c, '2031', 0, 0, { fill: C.amarillo, col: C.azul, size: 46, w: 800 }));

    FUTUROS.forEach((f, i) => {
      const t0 = this.ts[i]!;
      const k = ease.outBack(clamp((t - t0 + 0.12) / 0.5), 1.4);
      if (k <= 0) return;
      const x = 330 + i * 420, y = 580 + (i % 2 ? 26 : -16);
      const r = [-0.06, 0.045, -0.03, 0.05][i]!;
      at(c, x, y + float(t, i, 6, 1.2) + (1 - k) * 60, { s: k, r: r + Math.sin(t * 1.1 + i) * 0.012 }, () =>
        polaroid(c, 380, (pw, ph) => cover(c, this.imgs[i] ?? null, pw, ph), f.label, f.col, i + 2));
      burst(c, x, y, t, t0 + 0.35, f.col, 250, 10);
      at(c, x - 150, y - 200, { s: pop(t, t0 + 0.15, 0.35), r: -0.1 }, () =>
        labelPill(c, `${i + 1}`, 0, 0, { fill: f.col, col: C.blanco, size: 30, w: 800, padX: 18 }));
    });
    return {};
  }
}
