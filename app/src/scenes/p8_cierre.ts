// 👉 AQUÍ SE REEMPLAZA ESTE CONTENIDO
// ESCENA 8 — Cierre (fondo azul)
// Voz: "Entra al mapa, elige un futuro y vive un día en él. ¿Cuál crees que está más cerca?"
// Un navegador muestra la página del mapa de Futuros Vivos con los 4 futuros. Con "elige" el cursor va al
// segundo y hace clic en "futuro"; con "vive" la foto llena la ventana. Con "¿Cuál…?" la ventana se achica y cae
// la tira amarilla "¿Cuál crees que está más cerca?". Al final suben y aparecen los logos.
import type { Frame, PostOverrides } from '../engine/scene';
import { C, Plate, at, burst, clamp, decor, drawLogos, ease, float, inn, lerp, loadImage, loadLogos, measureText, pop, ripple, rrect, text, tornPaper } from './_kit';
import { FUTUROS, cover, strip } from './_futuros';

export default class P8 extends Plate {
  logos: (HTMLImageElement | null)[] = [];
  imgs: (HTMLImageElement | null)[] = [];
  tMapa = 0; tElige = 0; tFut = 0; tVive = 0; tCual = 0; tOut = 0;
  override async load() {
    this.logos = await loadLogos();
    this.imgs = await Promise.all(FUTUROS.map((f) => loadImage(f.file)));
  }
  override setup() {
    const S = this.S, L1 = 'Entra al mapa', L2 = 'Cuál crees';
    this.prevBg = C.blanco;
    this.tMapa = S.word(L1, 'mapa').start;
    this.tElige = S.word(L1, 'elige').start;
    this.tFut = S.word(L1, 'futuro').start;
    this.tVive = S.word(L1, 'vive').start;
    this.tCual = S.line(L2).start;
    this.tOut = S.line(L2).end + 0.5;
  }

  draw(c: CanvasRenderingContext2D, t: number, _f: Frame): PostOverrides {
    c.fillStyle = C.azul; c.fillRect(0, 0, 1920, 1080);
    decor(c, t, true, 88);
    const m = (s: string, w: number, z: number) => measureText(c, s, w, z);
    const out = ease.inOutCubic(clamp((t - this.tOut) / 0.6));
    const shrink = ease.inOutCubic(clamp((t - this.tCual) / 0.5));

    // ---- el navegador
    const W = 1180, H = 640;
    const wk = ease.outBack(clamp((t - this.ctx.start - 0.1) / 0.5), 1.3);
    const wy = lerp(510, 400, shrink) - 240 * out;
    const ws = wk * lerp(1, 0.72, shrink) * (1 - 0.25 * out);
    at(c, 960, wy + float(t, 0, 4, 1.1), { s: ws, r: -0.012, a: 1 - out }, () => {
      c.save(); c.shadowColor = 'rgba(0,0,40,0.35)'; c.shadowBlur = 40; c.shadowOffsetY = 18;
      c.fillStyle = C.blanco; rrect(c, -W / 2, -H / 2, W, H, 22); c.fill(); c.restore();
      ['#E9683B', '#E4EB60', '#4CB979'].forEach((col, i) => { c.fillStyle = col; c.beginPath(); c.arc(-W / 2 + 34 + i * 30, -H / 2 + 30, 9, 0, Math.PI * 2); c.fill(); });
      c.fillStyle = '#ECECF4'; rrect(c, -W / 2 + 140, -H / 2 + 14, W - 280, 34, 17); c.fill();
      text(c, 'futuros-vivos  ·  mapa 2027–2031', 0, -H / 2 + 38, { w: 600, size: 20, col: C.gris1, align: 'center' });
      // página
      const PX = -W / 2 + 16, PY = -H / 2 + 62, PW = W - 32, PH = H - 78;
      c.save(); rrect(c, PX, PY, PW, PH, 12); c.clip();
      c.fillStyle = C.azul; c.fillRect(PX, PY, PW, PH);
      // titular de la página
      const tk = inn(t, this.tMapa - 0.2, 0.4);
      at(c, PX + 300, PY + 80, { a: tk, r: -0.02 }, () => { tornPaper(c, 470, 70, C.blanco, 4, { tear: 6, shadow: false }); text(c, 'Estamos mapeando', 0, 14, { w: 800, size: 40, col: C.azul, align: 'center' }); });
      at(c, PX + 330, PY + 160, { a: tk, r: 0.015 }, () => { tornPaper(c, 480, 70, C.blanco, 6, { tear: 6, shadow: false }); text(c, 'los futuros del campo', 0, 14, { w: 800, size: 36, col: C.azul, align: 'center' }); });
      at(c, PX + PW - 180, PY + 60, { a: tk, r: -0.04 }, () => { c.fillStyle = C.amarillo; c.fillRect(-100, -24, 200, 48); text(c, 'Futuros Vivos', 0, 9, { w: 800, size: 24, col: C.azul, align: 'center' }); });
      // los 4 futuros
      const zoom = ease.inOutCubic(clamp((t - this.tVive) / 0.6));
      FUTUROS.forEach((f, i) => {
        const cw = 240, ch = 200;
        const cx = PX + 150 + i * 280, cy = PY + 380;
        const sel = i === 1;
        const ck = pop(t, this.tMapa + i * 0.08, 0.4);
        const press = sel ? 1 - 0.06 * Math.sin(clamp((t - this.tFut) / 0.2) * Math.PI) : 1;
        const z = sel ? zoom : 0;
        const x = lerp(cx, 0, z), y = lerp(cy, PY + PH / 2, z), w = lerp(cw, PW, z), h = lerp(ch, PH, z);
        if (!sel && zoom > 0.98) return;
        at(c, x, y, { s: ck * press, r: sel ? (1 - z) * 0.02 : ((i % 2) - 0.5) * 0.04 }, () => {
          c.fillStyle = C.blanco; c.fillRect(-w / 2, -h / 2, w, h);
          c.save(); c.translate(-w / 2 + 10, -h / 2 + 10); c.beginPath(); c.rect(0, 0, w - 20, h - 50); c.clip();
          cover(c, this.imgs[i] ?? null, w - 20, h - 50); c.restore();
          text(c, z > 0.5 ? `Un día en: ${f.label}` : f.label, 0, h / 2 - 14, { w: 800, size: lerp(18, 34, z), col: f.col, align: 'center' });
        });
      });
      c.restore();
      // cursor
      const ck = ease.inOutCubic(clamp((t - this.tElige) / 0.55));
      const cxp = lerp(PX + PW - 60, PX + 150 + 280 + 30, ck), cyp = lerp(PY + PH - 40, PY + 380 + 20, ck);
      if (t > this.ctx.start + 0.4 && zoom < 1) {
        ripple(c, cxp, cyp, t, this.tFut, C.amarillo, 10, 60, 0.6);
        at(c, cxp, cyp, { s: 1 - 0.15 * Math.sin(clamp((t - this.tFut) / 0.2) * Math.PI) }, () => {
          c.beginPath(); c.moveTo(0, 0); c.lineTo(0, 44); c.lineTo(12, 33); c.lineTo(22, 54); c.lineTo(30, 50); c.lineTo(20, 30); c.lineTo(36, 30); c.closePath();
          c.fillStyle = C.negro; c.fill(); c.strokeStyle = C.blanco; c.lineWidth = 3; c.stroke();
        });
      }
    });

    // ---- la pregunta
    const qk = ease.outBack(clamp((t - this.tCual) / 0.45), 1.5);
    at(c, 960, lerp(860, 470, out) + float(t, 2, 4, 1.2), { s: qk, r: -0.02 }, () =>
      strip(c, '¿Cuál crees que está más cerca?', 66, C.amarillo, C.azul, 11, m));
    burst(c, 960, 860, t, this.tCual + 0.4, C.blanco, 400, 14);

    // ---- logos
    if (out > 0) drawLogos(c, this.logos, 960, 720, out);
    return {};
  }
}
