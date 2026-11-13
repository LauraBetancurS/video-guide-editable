// 👉 AQUÍ SE REEMPLAZA ESTE CONTENIDO
// ESCENA 7 — Señales tempranas y alerta (3D, fondo papel)
// Voz: "¿Cómo saber si este futuro se acerca? Más sensores y crédito por uso en las cooperativas, disputas por los
// datos y contratos portables. Y una alerta: que crezcan los usuarios, pero sea más difícil irse con tus datos."
// Vista alta del diorama. Cada señal se enciende en 3D cuando la voz la dice (sensores, monedas, líneas naranja,
// carpetas) y aparece su pastilla arriba. Con "alerta" crecen columnas de usuarios y cae la nota naranja.
import { C, at, burst, clamp, ease, float, kinetic, labelPill, pop, spoken, text, tornPaper, type KWordT } from './_kit';
import { Plate3D, orbita, type Mundo } from './_mundo3d';

export default class E7 extends Plate3D {
  q: KWordT[] = [];
  tSen = 0; tCre = 0; tDis = 0; tCon = 0; tAle = 0; tCrez = 0; tDif = 0;
  override setup() {
    const S = this.S, L2 = 'Más sensores', L3 = 'Y una alerta';
    this.bg = C.blanco; this.prevBg = C.azul;
    this.q = spoken(S, 'Cómo saber si este futuro', '¿Cómo', 'acerca?');
    this.tSen = S.word(L2, 'sensores').start; this.tCre = S.word(L2, 'crédito').start;
    this.tDis = S.word(L2, 'disputas').start; this.tCon = S.word(L2, 'contratos').start;
    this.tAle = S.word(L3, 'alerta').start; this.tCrez = S.word(L3, 'crezcan').start; this.tDif = S.word(L3, 'difícil').start;
  }
  mundo3d(t: number, m: Mundo) {
    (['productor', 'banco', 'comprador', 'supervisor'] as const).forEach((id) => m.nodo(id, 1, t, 1));
    const dis = clamp((t - this.tDis) / 0.3) * (1 - clamp((t - this.tCon) / 0.4));
    m.red([0, 1, 2, 3, 4, 5, 6], 1, t, true, dis > 0 ? C.naranja : undefined);
    m.sensoresOn(clamp((t - this.tSen) / 0.8), t);
    m.monedas.forEach((mo, i) => {
      const k = clamp((t - this.tCre - i * 0.1) / 0.4); if (k <= 0) return;
      const f = m.fincas[i]!; mo.visible = true; mo.position.set(f.position.x, 2.2 + Math.sin(t * 2 + i) * 0.15, f.position.z); mo.rotation.y = t * 2.4 + i; mo.scale.setScalar(ease.outBack(k, 2) * 1.1);
    });
    const ck = clamp((t - this.tCon) / 0.5);
    if (ck > 0) { m.carpeta.visible = true; m.carpeta.position.set(-1.6, 2.4 + Math.abs(Math.sin(t * 3)) * 0.4, 2.6); m.carpeta.rotation.y = t; m.carpeta.scale.setScalar(ease.outBack(ck, 2) * 1.3); }
    // usuarios que crecen (columnas) detrás de la isla
    m.barras.forEach((b, i) => {
      const k = clamp((t - this.tCrez - i * 0.12) / 0.8); if (k <= 0) return;
      const h = (0.6 + i * 0.55) * ease.outCubic(k);
      b.visible = true; b.scale.set(1, h, 1); b.position.set(-6 + i * 1.1, h / 2 + 0.1, -6.8);
    });
    const u = (t - this.ctx.start) / (this.ctx.end - this.ctx.start);
    const [p, q] = orbita(0, -1, -0.3 + u * 0.5, 16, 15, 0);
    m.camara(p, q);
  }
  draw(c: CanvasRenderingContext2D, t: number) {
    const fuera = clamp((t - this.tSen + 0.3) / 0.3);
    if (fuera < 1) { c.save(); c.globalAlpha = 1 - fuera; kinetic(c, t, this.q, 960, 140, { w: 800, size: 60, col: C.azul, align: 'center' }); c.restore(); }
    const pills: [string, number, string][] = [['Sensores y crédito por uso', this.tSen, C.azul], ['Disputas por los datos', this.tDis, C.naranja], ['Contratos portables', this.tCon, C.verde]];
    pills.forEach(([s, t0, col], i) => at(c, 420 + i * 540, 130 + float(t, i, 3, 1.3), { s: pop(t, t0 - 0.05, 0.45), r: (i - 1) * 0.02 }, () => labelPill(c, s, 0, 0, { fill: col, col: C.blanco, size: 32, w: 800 })));
    const ak = clamp((t - this.tAle) / 0.22);
    if (ak > 0) {
      at(c, 1530, 520 + float(t, 4, 4, 1.2), { s: 1.7 - 0.7 * ease.inQuad(ak), r: 0.035, a: clamp(ak * 2) }, () => {
        tornPaper(c, 520, 300, C.naranja, 12, { tear: 8 });
        text(c, 'Alerta', 0, -78, { w: 800, size: 40, col: C.amarillo, align: 'center' });
        text(c, 'Crecen los usuarios…', 0, -10, { w: 800, size: 38, col: C.blanco, align: 'center' });
        const dk = pop(t, this.tDif - 0.1, 0.4);
        c.save(); c.globalAlpha = dk; text(c, '…y es más difícil', 0, 50, { w: 800, size: 38, col: C.blanco, align: 'center' });
        text(c, 'irse con tus datos', 0, 98, { w: 800, size: 38, col: C.blanco, align: 'center' }); c.restore();
      });
      burst(c, 1530, 520, t, this.tAle + 0.22, C.naranja, 330, 12);
    }
  }
}
