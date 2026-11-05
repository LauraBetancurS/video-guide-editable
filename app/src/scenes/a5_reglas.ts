// 👉 AQUÍ SE REEMPLAZA ESTE CONTENIDO
// ESCENA 5 — Qué puede hacer el agente (fondo papel)
// Voz: "Eso quiere decir definir qué puede hacer el agente: hasta qué monto, en qué comercios, en qué
// horarios y cuándo debe escalarle la decisión a la persona."
// El agente en el centro, dentro de un círculo que se va cerrando como un "mandato". Cada regla sale del
// agente con una línea de marcador y una tarjeta: Límites (monto), Comercios, Tiempo (horarios) y
// Escalamiento. En "persona" entra Andrés y señala la tarjeta de escalamiento.
import type { Frame, PostOverrides } from '../engine/scene';
import { C, Plate, Puppet, type PupKey, at, burst, circlePts, clamp, decor, ease, float, hexA, icon, kinetic, pop, pt, ripple, spoken, strokeTrim, text, tornPaper, tape, type KWordT } from './_kit';
import { robot, store } from './_agente';

const CX = 900, CY = 580;

export default class A5 extends Plate {
  andres = new Puppet('andres');
  keys: PupKey[] = [];
  head: KWordT[] = [];
  tDef = 0; tMonto = 0; tCom = 0; tHor = 0; tEsc = 0; tPers = 0;
  override async load() { await this.andres.load(); }

  override setup() {
    const S = this.S, L = 'Eso quiere decir';
    this.prevBg = C.azul;
    this.revealFrom = { x: CX, y: CY };
    this.head = spoken(S, L, 'qué', 'agente:');
    this.tDef = S.word(L, 'definir').start;
    this.tMonto = S.word(L, 'monto').start;
    this.tCom = S.word(L, 'comercios').start;
    this.tHor = S.word(L, 'horarios').start;
    this.tEsc = S.word(L, 'escalarle').start;
    this.tPers = S.word(L, 'persona').start;
    this.keys = [
      { at: -1, pose: 'neutral', head: 'sonrisa', flip: true },
      { at: this.tPers - 0.1, pose: 'senala', head: 'feliz', flip: true },
    ];
  }

  draw(c: CanvasRenderingContext2D, t: number, _f: Frame): PostOverrides {
    const t0 = this.ctx.start;
    decor(c, t, false, 61);

    // ---- titular
    kinetic(c, t, this.head, 960, 140, { w: 800, size: 62, col: C.azul, align: 'center', cap: true });

    // ---- el agente en el centro, con su "mandato" (círculo que se cierra regla a regla)
    const ak = pop(t, t0 + 0.15, 0.5);
    at(c, CX, CY + float(t, 0, 6, 1.2), { s: ak }, () => {
      c.fillStyle = hexA(C.azul, 0.08); c.beginPath(); c.arc(0, 0, 150, 0, Math.PI * 2); c.fill();
      robot(c, 170, t);
    });
    const ring = [this.tMonto, this.tCom, this.tHor, this.tEsc].filter((x) => t > x).length / 4;
    const rk = ring > 0 ? ease.outCubic(clamp(ring)) : 0;
    c.save(); c.strokeStyle = C.azul; c.lineWidth = 8; strokeTrim(c, circlePts(CX, CY, 175, 175, -Math.PI / 2, 1, 120), rk); c.restore();
    ripple(c, CX, CY, t, this.tDef, C.azul, 120, 260, 0.9);

    // ---- las cuatro reglas
    const rules: { x: number; y: number; tw: number; title: string; sub: string; col: string; ic: () => void }[] = [
      { x: 430, y: 380, tw: this.tMonto, title: 'Límites', sub: 'hasta qué monto', col: C.azul, ic: () => icon.wallet(c, 58, C.blanco) },
      { x: 430, y: 780, tw: this.tCom, title: 'Comercios', sub: 'en qué comercios', col: C.morado, ic: () => store(c, 62, C.blanco) },
      { x: 1350, y: 380, tw: this.tHor, title: 'Tiempo', sub: 'en qué horarios', col: C.verde, ic: () => icon.clock(c, 62, C.blanco) },
      { x: 1350, y: 780, tw: this.tEsc, title: 'Escalamiento', sub: 'a la persona', col: C.naranja, ic: () => icon.person(c, 58, C.blanco) },
    ];
    rules.forEach((r, i) => {
      // línea de marcador del agente a la tarjeta
      const lk = ease.inOutCubic(clamp((t - r.tw + 0.1) / 0.35));
      if (lk > 0) {
        const a = Math.atan2(r.y - CY, r.x - CX);
        c.save(); c.strokeStyle = hexA(r.col, 0.7); c.lineWidth = 6; c.setLineDash([16, 14]);
        strokeTrim(c, [pt(CX + Math.cos(a) * 185, CY + Math.sin(a) * 185), pt(r.x + (r.x < CX ? 235 : -235), r.y)], lk);
        c.setLineDash([]); c.restore();
      }
      const k = ease.outBack(clamp((t - r.tw - 0.05) / 0.45), 1.5);
      at(c, r.x, r.y + float(t, i + 2, 5, 1.3), { s: k, r: (i % 2 ? 1 : -1) * 0.025 }, () => {
        tornPaper(c, 470, 170, C.blanco, 62 + i);
        c.fillStyle = r.col; c.beginPath(); c.arc(-165, 0, 52, 0, Math.PI * 2); c.fill();
        at(c, -165, 0, {}, r.ic);
        text(c, r.title, -95, -8, { w: 800, size: 42, col: C.azul });
        text(c, r.sub, -95, 38, { w: 500, size: 28, col: C.gris1 });
      });
      if (k >= 1) tape(c, r.x + (i < 2 ? -150 : 150), r.y - 82, 100, i < 2 ? -0.4 : 0.4, undefined, 66 + i);
      burst(c, r.x - 165, r.y, t, r.tw + 0.35, r.col === C.verde ? C.amarillo : r.col, 80, 8);
    });

    // ---- Andrés, la persona que decide
    const pk = pop(t, this.tPers - 0.25, 0.45);
    at(c, 1820, 1000, { s: pk }, () => this.andres.draw(c, 0, 0, 460, t, this.keys, { seed: 4 }));
    return {};
  }
}
