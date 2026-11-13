// 👉 AQUÍ SE REEMPLAZA ESTE CONTENIDO
// ESCENA 3 — Punto de encuentro (3D, fondo papel)
// Voz: "Las cooperativas se vuelven el punto de encuentro. Junto con la banca de desarrollo, los compradores y los
// supervisores, pactan reglas comunes: los datos se gobiernan en conjunto y cada productor puede llevarse su historial."
// La cooperativa late en el centro; el banco, la bodega y el escudo del supervisor vuelan desde sus islas hasta la
// isla principal cuando la voz los nombra. Con "pactan" crece la red; con "datos" viajan los paquetes; con
// "historial" una carpeta amarilla sale de la finca y vuelve.
import { C, at, clamp, ease, float, inn } from './_kit';
import { Plate3D, orbita, type Mundo } from './_mundo3d';
import { etiqueta3d, tira } from './_e1';

export default class E3 extends Plate3D {
  tCoop = 0; tPunto = 0; tBan = 0; tCom = 0; tSup = 0; tPac = 0; tReg = 0; tDat = 0; tProd = 0; tHist = 0;
  override setup() {
    const S = this.S, L1 = 'Las cooperativas se vuelven', L2 = 'Junto con la banca';
    this.bg = C.blanco; this.prevBg = C.azul;
    this.tCoop = S.word(L1, 'cooperativas').start; this.tPunto = S.word(L1, 'punto').start;
    this.tBan = S.word(L2, 'banca').start; this.tCom = S.word(L2, 'compradores').start; this.tSup = S.word(L2, 'supervisores').start;
    this.tPac = S.word(L2, 'pactan').start; this.tReg = S.word(L2, 'reglas').start; this.tDat = S.word(L2, 'datos').start;
    this.tProd = S.word(L2, 'productor').start; this.tHist = S.word(L2, 'llevarse').start;
  }
  mundo3d(t: number, m: Mundo) {
    const pulso = 1 + 0.08 * Math.sin(clamp((t - this.tCoop) / 0.8) * Math.PI);
    m.coop.scale.setScalar(pulso);
    m.nodo('productor', 1, t, 1);
    m.nodo('banco', clamp((t - this.tBan) / 1.2), t, 1);
    m.nodo('comprador', clamp((t - this.tCom) / 1.2), t, 1);
    m.nodo('supervisor', clamp((t - this.tSup) / 1.2), t, 1);
    m.red([0, 1, 2, 3, 4, 5, 6], clamp((t - this.tPac) / 1.6), t, t > this.tDat);
    // carpeta del historial: sale de la finca del productor y vuelve
    const hk = clamp((t - this.tHist) / 1.6);
    if (hk > 0) {
      m.carpeta.visible = true;
      const s = Math.sin(hk * Math.PI);
      m.carpeta.position.set(-1.6 + s * 1.2, 1.9 + s * 2.6, 2.6 + s * 1.0);
      m.carpeta.rotation.y = hk * Math.PI * 2; m.carpeta.scale.setScalar(1.4);
    }
    const u = (t - this.ctx.start) / (this.ctx.end - this.ctx.start);
    const [p, q] = orbita(0, 0, -0.55 + u * 0.8, 19, 10.5, 2.4);
    m.camara(p, q);
  }
  draw(c: CanvasRenderingContext2D, t: number) {
    const m = this.M;
    const a = inn(t, this.tPunto - 0.1, 0.4), b = inn(t, this.tReg - 0.1, 0.4);
    if (b < 1) at(c, 960, 110 + float(t, 0, 3, 1.1), { s: ease.outBack(a, 1.4) * (1 - b), r: -0.02 }, () => tira(c, 'Punto de encuentro', 64, C.azul, C.blanco, 2));
    if (b > 0) at(c, 960, 110 + float(t, 1, 3, 1.1), { s: ease.outBack(b, 1.4), r: 0.015 }, () => tira(c, 'Reglas comunes', 64, C.amarillo, C.azul, 4));
    etiqueta3d(c, m, [0, 3.2, 0], 'Cooperativa', t, this.tCoop, C.verde, C.blanco);
    etiqueta3d(c, m, [-3.6, 3.2, -1.6], 'Banca de desarrollo', t, this.tBan + 1.2);
    etiqueta3d(c, m, [3.2, 2.4, 1.6], 'Compradores', t, this.tCom + 1.2);
    etiqueta3d(c, m, [0.6, 3.6, -3.4], 'Supervisores', t, this.tSup + 1.2);
    if (t > this.tHist + 0.2) etiqueta3d(c, m, [m.carpeta.position.x, m.carpeta.position.y + 0.6, m.carpeta.position.z], 'Su historial', t, this.tHist + 0.2, C.amarillo, C.azul);
  }
}
