// 👉 AQUÍ SE REEMPLAZA ESTE CONTENIDO
// ESCENA 6 — El historial viaja con ella (3D, fondo azul)
// Voz: "Si mañana cambia de cooperativa, se lleva su historial. Nada de esto es espectacular: lo importante es que
// cada paso se explica y se puede reclamar."
// Aparece una segunda cooperativa; con "lleva" la carpeta amarilla del historial vuela en arco desde la finca de Rosa
// hasta la nueva cooperativa y se tiende una línea nueva. Luego la cámara se aleja y cae la nota amarilla.
import { C, at, burst, clamp, ease, float, stampShake } from './_kit';
import { Plate3D, orbita, type Mundo } from './_mundo3d';
import { etiqueta3d, tira } from './_e1';

export default class E6 extends Plate3D {
  tCambia = 0; tLleva = 0; tHist = 0; tNada = 0; tCada = 0;
  override setup() {
    const S = this.S, L1 = 'Si mañana cambia', L2 = 'Nada de esto';
    this.bg = C.azul; this.prevBg = C.blanco;
    this.tCambia = S.word(L1, 'cambia').start; this.tLleva = S.word(L1, 'lleva').start; this.tHist = S.word(L1, 'historial').start;
    this.tNada = S.line(L2).start; this.tCada = S.word(L2, 'cada').start;
  }
  vuelo(t: number) { return ease.inOutCubic(clamp((t - this.tLleva + 0.1) / 1.5)); }
  mundo3d(t: number, m: Mundo) {
    (['productor', 'banco', 'comprador', 'supervisor'] as const).forEach((id) => m.nodo(id, 1, t, 1));
    m.red([0, 1, 2, 3, 4, 5, 6], 1, t, true);
    m.coopB.visible = true; m.coopB.scale.setScalar(Math.max(0.01, ease.outBack(clamp((t - this.tCambia + 0.2) / 0.6), 1.8)));
    const v = this.vuelo(t);
    m.carpeta.visible = true;
    const a = { x: -1.6, y: 1.9, z: 2.6 }, b = { x: 5.6, y: 1.8, z: 1.4 };
    m.carpeta.position.set(a.x + (b.x - a.x) * v, a.y + (b.y - a.y) * v + Math.sin(v * Math.PI) * 2.0, a.z + (b.z - a.z) * v);
    m.carpeta.rotation.set(0, Math.sin(t * 1.4) * 0.3 + v * Math.PI * 2, Math.sin(v * Math.PI) * 0.3);
    m.carpeta.scale.setScalar(1.5 * (1 - 0.25 * clamp((t - this.tLleva - 1.4) / 0.4)));
    if (v >= 1) m.red([7], clamp((t - this.tLleva - 1.4) / 0.8), t, true, C.amarillo);
    const out = ease.inOutCubic(clamp((t - this.tNada) / 2.5));
    const [p, q] = orbita(1.5, 1.2, 0.35 + out * 0.5, 16 + out * 6, 8 + out * 5, 1.4);
    m.camara(p, q);
  }
  draw(c: CanvasRenderingContext2D, t: number) {
    const m = this.M;
    etiqueta3d(c, m, [m.carpeta.position.x, m.carpeta.position.y + 0.7, m.carpeta.position.z], 'Su historial', t, this.tHist - 0.1, C.amarillo, C.azul);
    if (t < this.tLleva + 1.3) etiqueta3d(c, m, [5.6, 2.9, 1.4], 'Otra cooperativa', t, this.tCambia + 0.3);
    const st = clamp((t - this.tCada) / 0.22);
    if (st > 0) {
      const [sx, sy] = stampShake(t, this.tCada + 0.2, 7);
      at(c, 960 + sx, 150 + sy + float(t, 0, 3, 1.1), { s: 1.8 - 0.8 * ease.inQuad(st), r: -0.02, a: clamp(st * 2) }, () => tira(c, 'Cada paso se explica y se puede reclamar', 52, C.amarillo, C.azul, 9));
      burst(c, 960, 150, t, this.tCada + 0.22, C.blanco, 380, 12);
    }
  }
}
