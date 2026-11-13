// 👉 AQUÍ SE REEMPLAZA ESTE CONTENIDO
// ESCENA 5 — Rosa en 2031 (3D, fondo papel)
// Voz: "En 2031, Rosa, caficultora y socia de una cooperativa, recibe una oferta de crédito: la cuota baja si cumple
// un indicador auditado. Antes de aceptar, decide qué datos compartir con el banco."
// Valentina (Rosa) a la izquierda. A la derecha flota un celular en 3D que gira suave; su pantalla muestra la oferta
// de crédito (la cuota baja con "baja", sello con "auditado") y luego la lista de datos: con "compartir" se apaga uno.
import { C, Puppet, type PupKey, at, clamp, ease, float, hexA, inn, labelPill, pop, text } from './_kit';
import { Plate3D, type Mundo } from './_mundo3d';
import { tira } from './_e1';

export default class E5 extends Plate3D {
  rosa = new Puppet('valentina');
  keys: PupKey[] = [];
  t2031 = 0; tRosa = 0; tOferta = 0; tBaja = 0; tAud = 0; tAntes = 0; tDecide = 0; tComp = 0;
  override async load() { await this.rosa.load(); }
  override setup() {
    const S = this.S, L1 = 'En 2031, Rosa', L2 = 'Antes de aceptar';
    this.bg = C.blanco; this.prevBg = C.azul;
    this.t2031 = S.word(L1, '2031').start; this.tRosa = S.word(L1, 'Rosa').start;
    this.tOferta = S.word(L1, 'oferta').start; this.tBaja = S.word(L1, 'baja').start; this.tAud = S.word(L1, 'auditado').start;
    this.tAntes = S.word(L2, 'Antes').start; this.tDecide = S.word(L2, 'decide').start; this.tComp = S.word(L2, 'compartir').start;
    this.keys = [
      { at: -1, pose: 'saluda', head: 'feliz' },
      { at: this.tOferta, pose: 'explica', head: 'habla' },
      { at: this.tAntes, pose: 'piensa', head: 'duda' },
      { at: this.tComp + 0.3, pose: 'idea', head: 'feliz' },
    ];
  }
  pintarPantalla(m: Mundo, t: number) {
    const cv = m.pantalla, c = cv.getContext('2d')!;
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.fillStyle = '#FFFFFF'; c.fillRect(0, 0, 540, 1080);
    c.fillStyle = C.verde; c.fillRect(0, 0, 540, 150);
    text(c, 'Mi cooperativa', 40, 92, { w: 800, size: 40, col: '#FFFFFF' });
    text(c, '2031', 500, 92, { w: 700, size: 30, col: '#FFFFFF', align: 'right' });
    const lista = clamp((t - this.tDecide + 0.1) / 0.4);
    c.save(); c.globalAlpha = 1 - lista;
    const ok = inn(t, this.tOferta - 0.1, 0.4);
    c.globalAlpha *= ok;
    c.fillStyle = '#F1F1FB'; c.beginPath(); c.roundRect(30, 190, 480, 520, 30); c.fill();
    text(c, 'Oferta de crédito', 60, 260, { w: 800, size: 40, col: C.azul });
    text(c, 'Renovar cafetales', 60, 310, { w: 500, size: 28, col: C.gris1 });
    text(c, 'Cuota mensual', 60, 400, { w: 600, size: 28, col: C.gris1 });
    const bk = ease.inOutCubic(clamp((t - this.tBaja) / 0.8));
    const val = Math.round(420 - 70 * bk);
    text(c, `$ ${val}.000`, 60, 480, { w: 800, size: 64, col: bk > 0 ? C.verde : C.negro });
    if (bk > 0) { c.fillStyle = C.verde; c.beginPath(); c.moveTo(440, 430 + bk * 10); c.lineTo(480, 430 + bk * 10); c.lineTo(460, 470 + bk * 10); c.closePath(); c.fill(); }
    const ak = pop(t, this.tAud, 0.4);
    if (ak > 0) { c.save(); c.translate(270, 600); c.scale(ak, ak); c.rotate(-0.05); c.fillStyle = C.amarillo; c.beginPath(); c.roundRect(-210, -40, 420, 80, 40); c.fill();
      text(c, '✓ Indicador auditado', 0, 12, { w: 800, size: 32, col: C.azul, align: 'center' }); c.restore(); }
    c.fillStyle = C.azul; c.beginPath(); c.roundRect(30, 760, 480, 100, 50); c.fill();
    text(c, 'Revisar antes de aceptar', 270, 822, { w: 800, size: 30, col: '#FFFFFF', align: 'center' });
    c.restore();
    if (lista > 0) {
      c.save(); c.globalAlpha = lista;
      text(c, '¿Qué datos compartes', 40, 250, { w: 800, size: 38, col: C.azul });
      text(c, 'con el banco?', 40, 300, { w: 800, size: 38, col: C.azul });
      const datos: [string, boolean][] = [['Humedad del suelo', true], ['Producción por lote', true], ['Pronóstico de lluvia', true], ['Ubicación exacta de la finca', false]];
      datos.forEach(([s, sigue], i) => {
        const y = 400 + i * 130;
        c.fillStyle = '#F1F1FB'; c.beginPath(); c.roundRect(30, y - 50, 480, 100, 24); c.fill();
        text(c, s, 60, y + 10, { w: 600, size: 27, col: C.negro });
        const off = sigue ? 0 : ease.inOutCubic(clamp((t - this.tComp) / 0.35));
        const on = 1 - off;
        c.fillStyle = on > 0.5 ? C.verde : '#CECFD4'; c.beginPath(); c.roundRect(410, y - 22, 76, 44, 22); c.fill();
        c.fillStyle = '#FFFFFF'; c.beginPath(); c.arc(410 + 22 + on * 32, y, 17, 0, Math.PI * 2); c.fill();
      });
      c.restore();
    }
    m.pantallaTex.needsUpdate = true;
  }
  mundo3d(t: number, m: Mundo) {
    m.isla.visible = false;
    m.telefono.visible = true;
    const k = ease.outBack(clamp((t - this.ctx.start - 0.2) / 0.7), 1.4);
    m.telefono.scale.setScalar(Math.max(0.01, k));
    m.telefono.position.set(2.6, 0.1 + Math.sin(t * 1.3) * 0.08, 0);
    m.telefono.rotation.set(0.05 + Math.sin(t * 0.9) * 0.03, -0.32 + Math.sin(t * 0.6) * 0.06, 0.03);
    // matas flotando detrás (profundidad)
    m.monedas.forEach((mo, i) => {
      const a = pop(t, this.tOferta + i * 0.1, 0.5); if (a <= 0) return;
      mo.visible = true; mo.position.set(4.6 + (i % 2) * 0.8, 1.6 - i * 0.9, -1.5 - i * 0.4); mo.rotation.set(0, t * 1.5 + i, 0); mo.scale.setScalar(a * 0.8);
    });
    this.pintarPantalla(m, t);
    m.camara([0, 0.3, 10.5], [0.4, 0.1, 0], 34);
  }
  draw(c: CanvasRenderingContext2D, t: number) {
    at(c, 250, 150, { s: pop(t, this.t2031 - 0.05, 0.45), r: -0.05 }, () => labelPill(c, '2031', 0, 0, { fill: C.amarillo, col: C.azul, size: 46, w: 800 }));
    at(c, 520, 990, { s: pop(t, this.tRosa - 0.2, 0.5) }, () => this.rosa.draw(c, 0, 0, 640, t, this.keys, { seed: 3 }));
    at(c, 560, 240, { a: inn(t, this.tRosa, 0.4), dy: (1 - inn(t, this.tRosa, 0.4)) * 12 }, () => labelPill(c, 'Rosa · caficultora, socia de una cooperativa', 0, 0, { fill: C.blanco, col: C.azul, size: 28, stroke: hexA(C.azul, 0.3) }));
    const dk = clamp((t - this.tDecide) / 0.22);
    if (dk > 0) at(c, 640, 360 + float(t, 2, 3, 1.2), { s: 1.6 - 0.6 * ease.inQuad(dk), r: -0.02, a: clamp(dk * 2) }, () => tira(c, 'Rosa decide qué datos compartir', 46, C.azul, C.blanco, 6));
  }
}
