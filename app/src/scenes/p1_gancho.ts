// 👉 AQUÍ SE REEMPLAZA ESTE CONTENIDO
// ESCENA 1 — Gancho (fondo papel)
// Voz: "Pagar desde el celular, sembrar con sensores, pedir un crédito en una app. El campo, el dinero y los
// negocios ya están cambiando, y cada vez más rápido."
// Tres polaroids llegan con cada acción (pago con check, mata con sensor, app de crédito). Arriba se escribe
// "El campo, el dinero y los negocios"; con "cambiando" cae el sello "Ya están cambiando" y con
// "cada vez más rápido" las fotos se mueven cada vez más rápido, con líneas de velocidad.
import type { Frame, PostOverrides } from '../engine/scene';
import { C, Plate, at, burst, clamp, decor, ease, hexA, icon, inn, kinetic, measureText, pop, rrect, spoken, stampShake, text, type KWordT } from './_kit';
import { phone, plantSensor, polaroid, strip } from './_futuros';

export default class P1 extends Plate {
  tCel = 0; tSem = 0; tCred = 0; tCamb = 0; tCada = 0; tRap = 0;
  l2: KWordT[] = [];
  override setup() {
    const S = this.S, L1 = 'Pagar desde el celular', L2 = 'El campo, el dinero';
    this.prevBg = C.azul;
    this.tCel = S.word(L1, 'Pagar').start;
    this.tSem = S.word(L1, 'sembrar').start;
    this.tCred = S.word(L1, 'pedir').start;
    this.l2 = spoken(S, L2, 'El', 'negocios');
    this.tCamb = S.word(L2, 'cambiando').start;
    this.tCada = S.word(L2, 'cada').start;
    this.tRap = S.word(L2, 'rápido').start;
  }

  draw(c: CanvasRenderingContext2D, t: number, _f: Frame): PostOverrides {
    decor(c, t, false, 11);
    const [sx, sy] = stampShake(t, this.tCamb + 0.2, 8);
    c.save(); c.translate(sx, sy);
    // "cada vez más rápido": la fase avanza más rápido (continua, sin saltos)
    const ph = t + Math.max(0, t - this.tCada) * 2.6 * inn(t, this.tCada, 0.8);

    kinetic(c, t, this.l2, 960, 165, { w: 800, size: 60, col: C.azul, align: 'center' });

    const cards: [number, number, number, string, (pw: number, ph: number) => void][] = [
      [this.tCel, 470, -0.06, 'Pagar', (pw, h) => {
        c.fillStyle = '#E3E3FB'; c.fillRect(0, 0, pw, h);
        at(c, pw / 2, h / 2, {}, () => phone(c, 120, 200, C.azul, () => {
          text(c, '$ 250.000', 0, -30, { w: 800, size: 22, col: C.azul, align: 'center' });
          const k = pop(t, this.tCel + 0.5, 0.4);
          at(c, 0, 30, { s: k }, () => icon.check(c, 30, C.verde));
        }));
      }],
      [this.tSem, 960, 0.035, 'Sembrar', (pw, h) => {
        c.fillStyle = '#DFF3E6'; c.fillRect(0, 0, pw, h);
        at(c, pw / 2, h / 2 + 6, {}, () => plantSensor(c, 200, t));
      }],
      [this.tCred, 1450, -0.04, 'Pedir un crédito', (pw, h) => {
        c.fillStyle = '#FCE3D8'; c.fillRect(0, 0, pw, h);
        at(c, pw / 2, h / 2, {}, () => phone(c, 120, 200, C.negro, () => {
          c.fillStyle = hexA(C.naranja, 0.25); rrect(c, -42, -70, 84, 40, 8); c.fill();
          const k = pop(t, this.tCred + 0.6, 0.4);
          at(c, 0, 30, { s: k }, () => { c.fillStyle = C.azul; rrect(c, -46, -20, 92, 40, 10); c.fill(); text(c, 'Crédito', 0, 8, { w: 800, size: 20, col: C.blanco, align: 'center' }); });
        }));
      }],
    ];
    cards.forEach(([t0, x, r, cap, photo], i) => {
      const k = ease.outBack(clamp((t - t0 + 0.1) / 0.45), 1.5);
      if (k <= 0) return;
      const fy = Math.sin(ph * 1.4 + i * 1.7) * 8, fr = Math.sin(ph * 1.1 + i) * 0.02;
      at(c, x, 530 + fy, { s: k, r: r + fr }, () => polaroid(c, 400, photo, cap, C.azul, i + 3));
      burst(c, x, 530, t, t0 + 0.3, C.amarillo, 230, 10);
    });

    // líneas de velocidad con "cada vez más rápido"
    const vk = inn(t, this.tCada, 0.4);
    if (vk > 0) {
      c.save(); c.strokeStyle = hexA(C.azul, 0.5 * vk); c.lineWidth = 6; c.lineCap = 'round';
      for (let i = 0; i < 6; i++) {
        const y = 380 + i * 60, off = ((ph * 380 + i * 170) % 260);
        c.beginPath(); c.moveTo(200 - off * 0.3, y); c.lineTo(200 - off * 0.3 - 90, y); c.stroke();
        c.beginPath(); c.moveTo(1720 + off * 0.3, y + 30); c.lineTo(1720 + off * 0.3 + 90, y + 30); c.stroke();
      }
      c.restore();
    }

    // sello "Ya están cambiando"
    const st = clamp((t - this.tCamb) / 0.22);
    if (st > 0) {
      at(c, 960, 860, { s: 2 - ease.inQuad(st), r: -0.025, a: clamp(st * 2) }, () =>
        strip(c, 'Ya están cambiando', 64, C.amarillo, C.azul, 7, (s, w, z) => measureText(c, s, w, z)));
      burst(c, 960, 860, t, this.tCamb + 0.22, C.naranja, 320, 14);
    }
    c.restore();
    return {};
  }
}
