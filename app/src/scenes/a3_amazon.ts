// 👉 AQUÍ SE REEMPLAZA ESTE CONTENIDO
// ESCENA 3 — Los comercios bloquean (fondo papel)
// Voz: "Y grandes comercios como Amazon ya están bloqueando a los agentes de terceros."
// Un agente rueda hacia un comercio grande; en "bloqueando" baja una barrera naranja, el agente rebota y
// pone cara de "ay". Arriba, el titular "Amazon bloquea agentes" entra palabra por palabra.
import type { Frame, PostOverrides } from '../engine/scene';
import { C, Plate, at, burst, clamp, decor, doodle, ease, float, hexA, inn, lerp, pop, rrect, ripple, stampShake, text, tornPaper, tape } from './_kit';
import { robot, store } from './_agente';

export default class A3 extends Plate {
  tGrandes = 0; tCom = 0; tAmazon = 0; tBloq = 0; tAgentes = 0; tTerc = 0;

  override setup() {
    const S = this.S, L = 'grandes comercios como Amazon';
    this.prevBg = C.azul;
    this.revealFrom = { x: 1500, y: 600 };
    this.tGrandes = S.word(L, 'grandes').start;
    this.tCom = S.word(L, 'comercios').start;
    this.tAmazon = S.word(L, 'Amazon').start;
    this.tBloq = S.word(L, 'bloqueando').start;
    this.tAgentes = S.word(L, 'agentes').start;
    this.tTerc = S.word(L, 'terceros').start;
  }

  draw(c: CanvasRenderingContext2D, t: number, _f: Frame): PostOverrides {
    const t0 = this.ctx.start;
    decor(c, t, false, 41);
    const [sx, sy] = stampShake(t, this.tBloq + 0.15, 12);
    c.save(); c.translate(sx, sy);

    // ---- piso
    c.strokeStyle = hexA(C.azul, 0.25); c.lineWidth = 5; c.setLineDash([26, 18]);
    c.beginPath(); c.moveTo(120, 860); c.lineTo(1800, 860); c.stroke(); c.setLineDash([]);

    // ---- el comercio, grande
    const sk = ease.outBack(clamp((t - this.tGrandes + 0.2) / 0.5), 1.3);
    at(c, 1460, 860, { s: sk }, () => {
      at(c, 0, -280, {}, () => store(c, 560, C.azul));
      // letrero con el nombre
      const nk = pop(t, this.tAmazon - 0.05, 0.4);
      at(c, 0, -560 + float(t, 1, 4, 1.2), { s: nk, r: -0.02 }, () => {
        tornPaper(c, 380, 90, C.amarillo, 42);
        text(c, 'Amazon', 0, 20, { w: 800, size: 58, col: C.azul, align: 'center' });
      });
    });
    if (sk >= 1) tape(c, 1310, 290, 110, -0.4, undefined, 43);

    // ---- el agente que llega rodando y rebota contra la barrera
    const go = ease.inOutQuad(clamp((t - t0 - 0.2) / Math.max(0.5, this.tBloq + 0.15 - t0 - 0.2)));
    const hit = this.tBloq + 0.15;
    const back = t > hit ? ease.outBack(clamp((t - hit) / 0.6), 2) : 0;
    const x = lerp(260, 920, go) - 200 * back;
    const hop = t > hit ? Math.abs(Math.sin(clamp((t - hit) / 0.6) * Math.PI)) * 60 : Math.abs(Math.sin(t * 9)) * 8 * (go < 1 ? 1 : 0);
    at(c, x, 760 - hop, { r: t > hit ? -0.25 * (1 - clamp((t - hit) / 0.8)) : Math.sin(t * 9) * 0.04 }, () => {
      robot(c, 170, t, { mood: t > hit ? 'ouch' : 'ok' });
      // ruedas
      c.fillStyle = C.negro;
      for (const wx of [-50, 50]) { c.beginPath(); c.arc(wx, 95, 22, 0, Math.PI * 2); c.fill(); c.fillStyle = C.gris2; c.beginPath(); c.arc(wx, 95, 8, 0, Math.PI * 2); c.fill(); c.fillStyle = C.negro; }
    });
    // etiqueta "de terceros" sobre el agente
    const tk = pop(t, this.tTerc - 0.05, 0.4);
    at(c, x, 555 - hop, { s: tk, r: 0.04 }, () => {
      c.fillStyle = C.morado; rrect(c, -130, -32, 260, 64, 32); c.fill();
      text(c, 'de terceros', 0, 12, { w: 700, size: 32, col: C.blanco, align: 'center' });
    });

    // ---- la barrera baja en "bloqueando"
    const bk = ease.outElastic(clamp((t - this.tBloq) / 0.45));
    c.fillStyle = C.gris1; rrect(c, 1080, 620, 24, 240, 8); c.fill();
    at(c, 1092, 645, { r: lerp(1.45, 0, bk), s: inn(t, this.tCom, 0.3) }, () => {
      for (let i = 0; i < 6; i++) { c.fillStyle = i % 2 ? C.blanco : C.naranja; c.fillRect(-300 + i * 50, -18, 50, 36); }
      c.strokeStyle = C.naranja; c.lineWidth = 4; c.strokeRect(-300, -18, 300, 36);
    });
    ripple(c, 1000, 700, t, hit, C.naranja, 30, 200, 0.8);
    burst(c, 1000, 700, t, hit, C.naranja, 120, 10);

    // ---- titular arriba
    const words: [string, number][] = [['Amazon', this.tAmazon], ['bloquea', this.tBloq], ['agentes', this.tAgentes]];
    let hx = 960 - 520;
    words.forEach(([w, tw], i) => {
      const k = ease.outBack(clamp((t - tw + 0.05) / 0.4), 1.6);
      if (k > 0) at(c, hx + 150, 160, { s: k, r: (i - 1) * 0.03 }, () => {
        tornPaper(c, 320, 110, i === 1 ? C.naranja : C.azul, 44 + i);
        text(c, w, 0, 24, { w: 800, size: 62, col: C.blanco, align: 'center' });
      });
      hx += 350;
    });
    doodle(c, 'spark', 1830, 120, 22, C.naranja, ease.inOutCubic(clamp((t - this.tAgentes) / 0.4)));
    c.restore();
    return {};
  }
}
