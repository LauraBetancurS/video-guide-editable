// 👉 AQUÍ SE REEMPLAZA ESTE CONTENIDO
// ESCENA 2 — Título del escenario (3D, fondo azul)
// Voz: "Este es el primer escenario de nuestro radar: la red cooperativa convierte datos en acceso y confianza."
// La cámara baja desde arriba hacia el diorama; la isla aparece con "escenario", la cooperativa crece con
// "red cooperativa" y con "datos" empiezan a viajar los paquetes. El título sale en dos tiras de papel.
import { C, at, clamp, ease, float, hexA, inn, labelPill } from './_kit';
import { Plate3D, orbita, type Mundo } from './_mundo3d';
import { tira } from './_e1';

export default class E2 extends Plate3D {
  tEsc = 0; tRed = 0; tConv = 0; tDat = 0; tAcc = 0;
  override setup() {
    const S = this.S, L = 'Este es el primer escenario';
    this.bg = C.azul; this.prevBg = C.blanco;
    this.tEsc = S.word(L, 'escenario').start; this.tRed = S.word(L, 'red').start;
    this.tConv = S.word(L, 'convierte').start; this.tDat = S.word(L, 'datos').start; this.tAcc = S.word(L, 'acceso').start;
  }
  mundo3d(t: number, m: Mundo) {
    const k = ease.outBack(clamp((t - this.tEsc + 0.4) / 0.9), 1.3);
    m.isla.scale.setScalar(Math.max(0.001, k));
    m.coop.scale.setScalar(Math.max(0.001, ease.outBack(clamp((t - this.tRed) / 0.6), 2)));
    m.red([3, 4, 5, 6], clamp((t - this.tConv) / 1.2), t, t > this.tDat);
    const u = ease.inOutCubic(clamp((t - this.ctx.start) / 6.5));
    const [p, q] = orbita(0, 0, 0.9 - u * 0.9, 16 + (1 - u) * 6, 22 - u * 12, 0);
    m.camara(p, [q[0], q[1] + 3.2, q[2] + 1.2]);
  }
  draw(c: CanvasRenderingContext2D, t: number) {
    at(c, 960, 120, { a: inn(t, this.ctx.start + 0.2, 0.4) }, () =>
      labelPill(c, 'Escenario 1  ·  Horizonte 2031', 0, 0, { fill: hexA(C.blanco, 0.16), col: C.blanco, size: 30, stroke: hexA(C.blanco, 0.6) }));
    at(c, 930, 245 + float(t, 0, 3, 1.1), { s: ease.outBack(clamp((t - this.tRed + 0.25) / 0.45), 1.4), r: -0.018 }, () => tira(c, 'La red cooperativa convierte', 66, C.blanco, C.azul, 3));
    at(c, 1000, 370 + float(t, 1, 3, 1.2), { s: ease.outBack(clamp((t - this.tDat + 0.05) / 0.45), 1.4), r: 0.014 }, () => tira(c, 'datos en acceso y confianza', 66, C.amarillo, C.azul, 5));
  }
}
