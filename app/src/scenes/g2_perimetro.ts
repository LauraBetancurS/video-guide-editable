// 👉 AQUÍ SE REEMPLAZA ESTE CONTENIDO
// ESCENA 2 — Los datos salen del perímetro (fondo azul)
// Voz: "Eso es parte de algo más grande: los datos financieros están saliendo del banco. Pagos, ingresos y
// hábitos de consumo ya sirven para verificar quién eres en vivienda, seguros, comercio y plataformas."
// El banco dentro de un borde punteado (el "perímetro"). Con "saliendo" el borde se rompe y los datos salen
// como puntos. Pagos, ingresos y hábitos de consumo aparecen como etiquetas; con "verificar quién eres" cae
// una tira amarilla, y los datos viajan a cuatro tarjetas: vivienda, seguros, comercio y plataformas.
import type { Frame, PostOverrides } from '../engine/scene';
import { C, Plate, at, burst, clamp, decor, ease, float, hexA, icon, inn, kinetic, labelPill, polyAt, pop, pt, quadPts, ripple, spoken, strokeTrim, tape, text, tornPaper, type KWordT, type P } from './_kit';
import { shield, store } from './_agente';
import { bank, house } from './_datos';

const BX = 960, BY = 600, R = 225;

export default class G2 extends Plate {
  head: KWordT[] = [];
  tSal = 0; tPag = 0; tIng = 0; tHab = 0; tVer = 0; tViv = 0; tSeg = 0; tCom = 0; tPla = 0; tL2 = 0;
  override setup() {
    const S = this.S, L1 = 'Eso es parte de algo', L2 = 'Pagos, ingresos';
    this.prevBg = C.blanco;
    this.revealFrom = pt(BX, BY);
    this.head = spoken(S, L1, 'los', 'banco.');
    this.tSal = S.word(L1, 'saliendo').start;
    this.tL2 = S.line(L2).start;
    this.tPag = S.word(L2, 'Pagos').start;
    this.tIng = S.word(L2, 'ingresos').start;
    this.tHab = S.word(L2, 'hábitos').start;
    this.tVer = S.word(L2, 'verificar').start;
    this.tViv = S.word(L2, 'vivienda').start;
    this.tSeg = S.word(L2, 'seguros').start;
    this.tCom = S.word(L2, 'comercio').start;
    this.tPla = S.word(L2, 'plataformas').start;
  }

  draw(c: CanvasRenderingContext2D, t: number, _f: Frame): PostOverrides {
    const t0 = this.ctx.start;
    c.fillStyle = C.azul; c.fillRect(0, 0, 1920, 1080);
    decor(c, t, true, 51);

    // ---- la frase arriba ("los datos financieros están saliendo del banco.")
    c.save(); c.globalAlpha = 1 - 0.5 * inn(t, this.tL2, 0.5);
    kinetic(c, t, this.head, 960, 150, { w: 800, size: 60, col: C.blanco, align: 'center' });
    c.restore();

    // ---- el perímetro punteado: se abre cuando dice "saliendo"
    const open = ease.inOutCubic(clamp((t - this.tSal) / 0.6));
    const pk = inn(t, t0 + 0.2, 0.5);
    if (pk > 0) {
      c.save(); c.strokeStyle = hexA(C.blanco, 0.85 * pk); c.lineWidth = 6; c.setLineDash([22, 18]); c.lineDashOffset = -t * 30;
      const gap = open * 0.9; // radianes abiertos a cada lado
      for (const a0 of [-Math.PI / 2, Math.PI / 2]) { c.beginPath(); c.arc(BX, BY, R, a0 + gap, a0 + Math.PI - gap); c.stroke(); }
      c.restore();
    }
    // ---- el banco
    at(c, BX, BY - 20 + float(t, 0, 4, 1.1), { s: pop(t, t0 + 0.25, 0.5) }, () => {
      c.fillStyle = C.blanco; c.beginPath(); c.arc(0, 0, 150, 0, Math.PI * 2); c.fill();
      bank(c, 190, C.azul);
    });
    ripple(c, BX, BY - 20, t, this.tSal, C.amarillo, 150, 330, 1);

    // ---- los datos: etiquetas que salen del banco
    const tags: [string, number, P, string, string][] = [
      ['Pagos', this.tPag, pt(960, 360), C.amarillo, C.azul],
      ['Ingresos', this.tIng, pt(735, 820), C.verde, C.blanco],
      ['Hábitos de consumo', this.tHab, pt(1200, 820), C.blanco, C.azul],
    ];
    tags.forEach(([s, tw, p, fill, col], i) => {
      const k = ease.outCubic(clamp((t - tw + 0.05) / 0.5));
      if (k <= 0) return;
      const x = BX + (p.x - BX) * k, y = BY + (p.y - BY) * k + float(t, i + 2, 5, 1.4);
      at(c, x, y, { s: 0.5 + 0.5 * k, r: (i - 1) * 0.03 }, () => labelPill(c, s, 0, 0, { fill, col, size: 36, w: 800 }));
    });

    // ---- "verificar quién eres"
    const vk = clamp((t - this.tVer) / 0.22);
    if (vk > 0) {
      at(c, 960, 255 + float(t, 6, 3, 1.2), { s: 2 - ease.inQuad(vk), r: -0.02, a: clamp(vk * 2) }, () => {
        tornPaper(c, 620, 100, C.amarillo, 52, { tear: 8 });
        text(c, 'Verificar quién eres', 0, 18, { w: 800, size: 50, col: C.azul, align: 'center' });
      });
    }

    // ---- las cuatro tarjetas destino, con los datos viajando hacia ellas
    const dests: [string, number, P, (s: number) => void][] = [
      ['Vivienda', this.tViv, pt(330, 420), (s) => house(c, s, C.azul)],
      ['Seguros', this.tSeg, pt(330, 760), (s) => shield(c, s, C.verde, 1)],
      ['Comercio', this.tCom, pt(1590, 420), (s) => store(c, s, C.azul)],
      ['Plataformas', this.tPla, pt(1590, 760), (s) => icon.phone(c, s, C.morado)],
    ];
    dests.forEach(([label, tw, p, ic], i) => {
      const lk = ease.inOutCubic(clamp((t - tw + 0.1) / 0.45));
      const dir = p.x < BX ? 1 : -1;
      const path = quadPts(pt(BX - dir * 150, BY - 20), pt((BX + p.x) / 2, BY - 20 + (p.y - BY) * 0.4 - 60), pt(p.x + dir * 150, p.y));
      if (lk > 0) {
        c.save(); c.strokeStyle = hexA(C.blanco, 0.7); c.lineWidth = 4; c.setLineDash([10, 12]); c.lineDashOffset = -t * 40;
        strokeTrim(c, path, lk); c.restore();
        // puntitos de datos que viajan por la línea
        if (lk >= 1) for (let j = 0; j < 3; j++) {
          const u = ((t - tw) * 0.55 + j / 3) % 1;
          const q = polyAt(path, u);
          c.fillStyle = [C.amarillo, C.verde, C.blanco][j]!; c.beginPath(); c.arc(q.x, q.y, 9, 0, Math.PI * 2); c.fill();
        }
      }
      const k = pop(t, tw - 0.05, 0.45);
      at(c, p.x, p.y + float(t, i + 7, 5, 1.2), { s: k, r: (i % 2 ? 1 : -1) * 0.03 }, () => {
        tornPaper(c, 280, 220, C.blanco, 53 + i);
        at(c, 0, -28, {}, () => ic(100));
        text(c, label, 0, 78, { w: 800, size: 36, col: C.azul, align: 'center' });
      });
      if (k >= 1) tape(c, p.x, p.y - 112, 100, (i % 2 ? 1 : -1) * 0.12, undefined, 57 + i);
      burst(c, p.x, p.y, t, tw + 0.3, C.amarillo, 170, 10);
    });
    return {};
  }
}
