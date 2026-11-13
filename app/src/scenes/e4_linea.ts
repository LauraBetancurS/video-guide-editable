// 👉 AQUÍ SE REEMPLAZA ESTE CONTENIDO
// ESCENA 4 — Línea de tiempo (3D, fondo azul)
// Voz: "Primero llegan los pilotos de sensores y crédito por uso. Después, las disputas por quién es dueño de los
// datos. Y en 2030, el pacto: contratos portables y seguros por si algo falla."
// Sobre el diorama: con "sensores" brotan los sensores con ondas; con "crédito" giran monedas sobre las fincas;
// con "disputas" dos líneas se vuelven naranja y tiemblan; con "pacto" un anillo amarillo rodea la cooperativa y
// con "seguros" un domo morado cubre la isla. Abajo, tres pasos: Pilotos → Disputas → Pacto 2030.
import { C, at, clamp, ease, hexA, inn, measureText, pop, text } from './_kit';
import { Plate3D, orbita, type Mundo } from './_mundo3d';

export default class E4 extends Plate3D {
  tPil = 0; tSen = 0; tCre = 0; tDis = 0; tPac = 0; t2030 = 0; tCon = 0; tSeg = 0;
  override setup() {
    const S = this.S;
    this.bg = C.azul; this.prevBg = C.blanco;
    this.tPil = S.word('Primero llegan', 'pilotos').start; this.tSen = S.word('Primero llegan', 'sensores').start; this.tCre = S.word('Primero llegan', 'crédito').start;
    this.tDis = S.word('Después, las disputas', 'disputas').start;
    this.t2030 = S.word('Y en 2030', '2030').start; this.tPac = S.word('Y en 2030', 'pacto').start;
    this.tCon = S.word('Y en 2030', 'contratos').start; this.tSeg = S.word('Y en 2030', 'seguros').start;
  }
  mundo3d(t: number, m: Mundo) {
    (['productor', 'banco', 'comprador', 'supervisor'] as const).forEach((id) => m.nodo(id, 1, t, 1));
    const dis = clamp((t - this.tDis) / 0.3) * (1 - clamp((t - this.tPac) / 0.5));
    m.red([0, 1, 2, 3, 4, 5, 6], 1, t, true);
    if (dis > 0) [0, 3].forEach((i) => { const r = m.redes[i]!; r.mat.color.set(C.naranja); r.tubo.position.set(Math.sin(t * 40 + i) * 0.06 * dis, 0, 0); r.paquete.visible = false; });
    else m.redes.forEach((r) => r.tubo.position.set(0, 0, 0));
    m.sensoresOn(clamp((t - this.tSen) / 0.9), t);
    m.monedas.forEach((mo, i) => {
      const k = clamp((t - this.tCre - i * 0.12) / 0.4); if (k <= 0) return;
      const f = m.fincas[i]!; mo.visible = true; mo.position.set(f.position.x, 2.2 + Math.sin(t * 2 + i) * 0.15, f.position.z);
      mo.rotation.y = t * 2.4 + i; mo.scale.setScalar(ease.outBack(k, 2) * 1.2);
    });
    const pk = clamp((t - this.tPac) / 0.7);
    if (pk > 0) { m.anilloPacto.visible = true; m.anilloPacto.position.set(0, 0.25 + Math.sin(t * 2) * 0.05, 0); m.anilloPacto.scale.setScalar(ease.outBack(pk, 1.8)); }
    const dk = clamp((t - this.tSeg) / 0.8);
    if (dk > 0) { m.domo.visible = true; m.domo.scale.setScalar(Math.max(0.01, ease.outCubic(dk))); }
    const u = (t - this.ctx.start) / (this.ctx.end - this.ctx.start);
    const [p, q] = orbita(0, 0, 0.5 + u * 1.1, 21 - u * 2, 12, 0.5);
    m.camara(p, [q[0], q[1] + 1.4, q[2]]);
  }
  draw(c: CanvasRenderingContext2D, t: number) {
    const pasos: [string, number, string][] = [['Pilotos', this.tPil, C.blanco], ['Disputas', this.tDis, C.naranja], ['Pacto · 2030', this.t2030, C.amarillo]];
    const y = 925, w = 300, gap = 70, x0 = 960 - (w * 3 + gap * 2) / 2 + w / 2;
    const bk = inn(t, this.ctx.start + 0.2, 0.4);
    c.save(); c.globalAlpha = bk;
    c.strokeStyle = hexA(C.blanco, 0.5); c.lineWidth = 4; c.setLineDash([2, 12]);
    c.beginPath(); c.moveTo(x0, y); c.lineTo(x0 + 2 * (w + gap), y); c.stroke(); c.setLineDash([]);
    c.restore();
    pasos.forEach(([s, t0, col], i) => {
      const act = t >= t0 - 0.05; const next = pasos[i + 1]; const actual = act && (!next || t < next[1] - 0.05);
      at(c, x0 + i * (w + gap), y, { s: (0.6 + 0.4 * pop(t, t0 - 0.05, 0.45)) * (actual ? 1.08 : 1), r: (i - 1) * 0.02, a: bk }, () => {
        c.save(); c.shadowColor = 'rgba(0,0,40,0.3)'; c.shadowBlur = 14; c.shadowOffsetY = 6;
        c.fillStyle = act ? col : hexA(C.blanco, 0.18); c.beginPath(); c.roundRect(-w / 2, -34, w, 68, 34); c.fill(); c.restore();
        text(c, s, 0, 12, { w: 800, size: Math.min(34, (w - 30) / measureText(c, s, 800, 34) * 34), col: act ? (col === C.naranja ? C.blanco : C.azul) : C.blanco, align: 'center' });
      });
    });
  }
}
