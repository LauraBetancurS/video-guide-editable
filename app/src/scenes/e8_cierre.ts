// 👉 AQUÍ SE REEMPLAZA ESTE CONTENIDO
// ESCENA 8 — Ponlo a prueba (3D, fondo azul) + logos
// Voz: "Si mañana se cayera la conexión o se retirara el financiador, ¿qué acuerdos sobrevivirían?"
// Con "conexión" se apaga la luz de la antena y se cortan tres líneas; con "financiador" el banco se eleva y se va.
// Las líneas que quedan siguen latiendo. Cae la tira "¿Qué acuerdos sobrevivirían?" y al final, los logos.
import { C, at, burst, clamp, drawLogos, ease, float, loadLogos } from './_kit';
import { Plate3D, orbita, type Mundo } from './_mundo3d';
import { tira } from './_e1';

export default class E8 extends Plate3D {
  logos: (HTMLImageElement | null)[] = [];
  tCon = 0; tFin = 0; tQue = 0; tOut = 0;
  override async load() { this.logos = await loadLogos(); }
  override setup() {
    const S = this.S, L = 'Si mañana se cayera';
    this.bg = C.azul; this.prevBg = C.blanco;
    this.tCon = S.word(L, 'conexión').start; this.tFin = S.word(L, 'financiador').start; this.tQue = S.word(L, 'qué').start;
    this.tOut = S.line(L).end + 0.6;
  }
  mundo3d(t: number, m: Mundo) {
    (['productor', 'comprador', 'supervisor'] as const).forEach((id) => m.nodo(id, 1, t, 1));
    const fk = ease.inCubic(clamp((t - this.tFin) / 1.4));
    m.nodo('banco', 1, t, 1);
    if (fk > 0) { const g = m.nodos.banco.g; g.position.y += fk * 9; g.rotation.y = fk * 2; g.scale.setScalar(Math.max(0.01, 1 - fk * 0.7)); }
    const corte = t > this.tCon + 0.2;
    const vivas = [1, 2, 3, ...(corte ? [] : [4, 5, 6]), ...(fk > 0.1 ? [] : [0])];
    m.red(vivas, 1, t, true);
    if (corte) (m.antena.getObjectByName('luz') as { visible: boolean }).visible = Math.floor((t - this.tCon) * 8) % 2 === 0 && t < this.tCon + 0.8;
    const out = ease.inOutCubic(clamp((t - this.tOut) / 0.8));
    const u = (t - this.ctx.start) / 8;
    const [p, q] = orbita(0, 0, -0.6 + u * 0.4, 18 + out * 8, 10 + out * 4, 0.6 - out * 3);
    m.camara(p, q);
  }
  draw(c: CanvasRenderingContext2D, t: number) {
    const out = ease.inOutCubic(clamp((t - this.tOut) / 0.8));
    const qk = ease.outBack(clamp((t - this.tQue) / 0.45), 1.5);
    at(c, 960, 140 + out * 250 + float(t, 0, 3, 1.2), { s: qk, r: -0.02 }, () => tira(c, '¿Qué acuerdos sobrevivirían?', 64, C.amarillo, C.azul, 11));
    burst(c, 960, 140, t, this.tQue + 0.4, C.blanco, 380, 12);
    if (out > 0) {
      c.save(); c.globalAlpha = out * 0.75; c.fillStyle = C.azul; c.fillRect(0, 0, 1920, 1080); c.restore();
      at(c, 960, 140 + out * 250, { s: qk, r: -0.02 }, () => tira(c, '¿Qué acuerdos sobrevivirían?', 64, C.amarillo, C.azul, 11));
      drawLogos(c, this.logos, 960, 720, out);
    }
  }
}
