// 👉 AQUÍ SE REEMPLAZA ESTE CONTENIDO
// ESCENA 7 — Tecnología y acuerdos (fondo papel)
// Voz: "Porque la tecnología cambia lo que se puede hacer, pero son los acuerdos los que deciden cómo se reparte."
// Una balanza: con "tecnología" llega el celular al platillo izquierdo y la balanza baja hacia ese lado;
// con "acuerdos" llega el grupo de personas al derecho y la balanza se inclina hacia los acuerdos.
// Arriba se escriben las dos frases.
import type { Frame, PostOverrides } from '../engine/scene';
import { C, Plate, at, burst, clamp, decor, ease, icon, inn, kinetic, pop, rrect, spoken, text, tornPaper, type KWordT } from './_kit';

export default class P7 extends Plate {
  a: KWordT[] = []; b: KWordT[] = [];
  tTec = 0; tAc = 0;
  override setup() {
    const S = this.S, L = 'Porque la tecnología';
    this.prevBg = C.azul;
    this.a = spoken(S, L, 'la', 'hacer,');
    this.b = spoken(S, L, 'son', 'reparte.');
    this.tTec = S.word(L, 'tecnología').start;
    this.tAc = S.word(L, 'acuerdos').start;
  }

  draw(c: CanvasRenderingContext2D, t: number, _f: Frame): PostOverrides {
    decor(c, t, false, 77);
    kinetic(c, t, this.a, 960, 150, { w: 800, size: 54, col: C.azul, align: 'center', cap: true });
    kinetic(c, t, this.b, 960, 235, { w: 800, size: 54, col: C.azul, align: 'center', cap: true });

    // inclinación: hacia la tecnología, luego hacia los acuerdos
    const k1 = ease.outBack(clamp((t - this.tTec - 0.2) / 0.6), 1.3);
    const k2 = ease.outBack(clamp((t - this.tAc - 0.1) / 0.7), 1.6);
    const ang = -0.12 * k1 * (1 - k2) + 0.16 * k2 + Math.sin(t * 1.6) * 0.008;
    const px = 960, py = 450, L = 420;
    const ap = inn(t, this.ctx.start + 0.1, 0.5);

    c.save(); c.globalAlpha = ap;
    // poste y base
    c.fillStyle = C.azul; rrect(c, px - 12, py, 24, 450, 12); c.fill();
    rrect(c, px - 170, py + 440, 340, 28, 14); c.fill();
    c.beginPath(); c.arc(px, py, 22, 0, Math.PI * 2); c.fill();
    // brazo
    c.save(); c.translate(px, py); c.rotate(ang);
    c.fillStyle = C.azul; rrect(c, -L - 10, -9, 2 * L + 20, 18, 9); c.fill();
    c.restore();
    c.restore();

    const pan = (side: -1 | 1, t0: number, label: string, draw: () => void, col: string) => {
      const ex = px + Math.cos(ang) * L * side, ey = py + Math.sin(ang) * L * side;
      c.save(); c.globalAlpha = ap; c.strokeStyle = C.azul; c.lineWidth = 4;
      c.beginPath(); c.moveTo(ex, ey); c.lineTo(ex - 120, ey + 200); c.moveTo(ex, ey); c.lineTo(ex + 120, ey + 200); c.stroke();
      c.fillStyle = C.azul; c.beginPath(); c.ellipse(ex, ey + 200, 150, 24, 0, 0, Math.PI); c.fill();
      c.restore();
      at(c, ex, ey + 100, { s: pop(t, t0, 0.45), r: side * 0.03 }, () => {
        tornPaper(c, 230, 170, col, side === -1 ? 3 : 9, { tear: 7 });
        at(c, 0, -22, {}, draw);
        text(c, label, 0, 60, { w: 800, size: 32, col: col === C.blanco ? C.azul : C.blanco, align: 'center' });
      });
    };
    pan(-1, this.tTec, 'Tecnología', () => icon.phone(c, 90, C.azul), C.blanco);
    pan(1, this.tAc, 'Acuerdos', () => icon.group(c, 96, C.blanco), C.verde);
    burst(c, px + Math.cos(ang) * L, py + Math.sin(ang) * L + 100, t, this.tAc + 0.3, C.amarillo, 220, 12);
    return {};
  }
}
