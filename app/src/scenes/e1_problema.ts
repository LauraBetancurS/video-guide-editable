// 👉 AQUÍ SE REEMPLAZA ESTE CONTENIDO
// ESCENA 1 — El problema (3D, fondo papel)
// Voz: "Producir deja cada vez menos. El productor no tiene capital, el banco no tiene datos y el comprador
// no tiene cómo verificar lo que compra. Nadie puede resolverlo solo."
// Tres islas flotantes, separadas: la finca, el banco y la bodega del comprador. Una flecha naranja baja sobre
// la finca con "menos". Cada isla recibe su etiqueta cuando la voz la nombra y abajo cae "Nadie puede resolverlo solo".
import { C, at, burst, clamp, ease, float, kinetic, spoken, stampShake, type KWordT } from './_kit';
import { Plate3D, type Mundo } from './_mundo3d';
import { etiqueta3d, tira } from './_e1';

export default class E1 extends Plate3D {
  l1: KWordT[] = [];
  tMenos = 0; tProd = 0; tCap = 0; tBan = 0; tDat = 0; tCom = 0; tVer = 0; tNadie = 0;
  override setup() {
    const S = this.S, L2 = 'El productor no tiene';
    this.bg = C.blanco; this.prevBg = C.azul;
    this.l1 = spoken(S, 'Producir deja', 'Producir', 'menos.');
    this.tMenos = S.word('Producir deja', 'menos').start;
    this.tProd = S.word(L2, 'productor').start; this.tCap = S.word(L2, 'capital').start;
    this.tBan = S.word(L2, 'banco').start; this.tDat = S.word(L2, 'datos').start;
    this.tCom = S.word(L2, 'comprador').start; this.tVer = S.word(L2, 'verificar').start;
    this.tNadie = S.line('Nadie puede').start;
  }
  mundo3d(t: number, m: Mundo) {
    m.isla.visible = false;
    m.nodo('productor', 0, t, clamp((t - this.ctx.start - 0.2) / 0.6));
    m.nodo('banco', 0, t, clamp((t - this.tBan + 0.3) / 0.6));
    m.nodo('comprador', 0, t, clamp((t - this.tCom + 0.3) / 0.6));
    // separarse un poco más con "Nadie"
    const sep = ease.inOutCubic(clamp((t - this.tNadie) / 1.2));
    m.nodos.productor.g.position.x -= sep * 0.8; m.nodos.comprador.g.position.x += sep * 0.8; m.nodos.banco.g.position.z -= sep * 1.2;
    // flecha que baja sobre la finca
    const fk = clamp((t - this.tMenos + 0.2) / 0.9);
    if (fk > 0) { m.flecha.visible = true; m.flecha.position.set(-7.5, 6.2 - ease.outCubic(fk) * 2.2, 1); m.flecha.rotation.y = t * 0.8; m.flecha.scale.setScalar(ease.outBack(clamp(fk * 2), 1.6)); }
    const a = -0.12 + (t - this.ctx.start) * 0.012;
    m.camara([Math.sin(a) * 20, 6.0 + Math.sin(t * 0.3) * 0.2, Math.cos(a) * 20], [0, 2.4, -1]);
  }
  draw(c: CanvasRenderingContext2D, t: number) {
    const m = this.M;
    kinetic(c, t, this.l1, 960, 140, { w: 800, size: 62, col: C.azul, align: 'center' });
    etiqueta3d(c, m, [-7.5, 3.0, 1], 'No tiene capital', t, this.tCap);
    etiqueta3d(c, m, [0, 3.4, -6], 'No tiene datos', t, this.tDat);
    etiqueta3d(c, m, [7.5, 3.0, 0.5], 'No tiene cómo verificar', t, this.tVer);
    const st = clamp((t - this.tNadie) / 0.22);
    if (st > 0) {
      const [sx, sy] = stampShake(t, this.tNadie + 0.2, 7);
      at(c, 960 + sx, 900 + sy + float(t, 1, 3, 1.2), { s: 1.9 - 0.9 * ease.inQuad(st), r: -0.02, a: clamp(st * 2) }, () => tira(c, 'Nadie puede resolverlo solo', 60, C.amarillo, C.azul, 7));
      burst(c, 960, 900, t, this.tNadie + 0.22, C.naranja, 320, 12);
    }
  }
}
