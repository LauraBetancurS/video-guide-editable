// 👉 AQUÍ SE REEMPLAZA ESTE CONTENIDO
// Íconos propios del video "Aprendizaje 6 · General" (datos financieros fuera del banco): un banco, una
// casa, un edificio de apartamentos, una cámara de vigilancia, un extracto bancario y una barra de gráfica.
// Se dibujan en el origen, de tamaño ~s.
import { C, clamp, ease, hexA, rrect, text } from './_kit';

function ln(c: CanvasRenderingContext2D, col: string, lw: number) { c.strokeStyle = col; c.lineWidth = lw; c.lineCap = 'round'; c.lineJoin = 'round'; }

/** Un banco: frontón triangular, cuatro columnas y escalones. */
export function bank(c: CanvasRenderingContext2D, s: number, col: string = C.azul) {
  c.fillStyle = col;
  c.beginPath(); c.moveTo(-s * 0.55, -s * 0.22); c.lineTo(0, -s * 0.5); c.lineTo(s * 0.55, -s * 0.22); c.closePath(); c.fill();
  rrect(c, -s * 0.5, -s * 0.2, s, s * 0.08, s * 0.02); c.fill();
  for (let i = 0; i < 4; i++) { rrect(c, -s * 0.4 + i * s * 0.25 - s * 0.045, -s * 0.08, s * 0.09, s * 0.42, s * 0.02); c.fill(); }
  rrect(c, -s * 0.52, s * 0.36, s * 1.04, s * 0.07, s * 0.02); c.fill();
  rrect(c, -s * 0.58, s * 0.44, s * 1.16, s * 0.07, s * 0.02); c.fill();
}

/** Una casa (vivienda). */
export function house(c: CanvasRenderingContext2D, s: number, col: string = C.azul) {
  ln(c, col, s * 0.08);
  c.beginPath(); c.moveTo(-s * 0.5, -s * 0.02); c.lineTo(0, -s * 0.45); c.lineTo(s * 0.5, -s * 0.02); c.stroke();
  c.beginPath(); c.moveTo(-s * 0.36, -s * 0.12); c.lineTo(-s * 0.36, s * 0.42); c.lineTo(s * 0.36, s * 0.42); c.lineTo(s * 0.36, -s * 0.12); c.stroke();
  rrect(c, -s * 0.1, s * 0.12, s * 0.2, s * 0.3, s * 0.03); c.stroke();
}

/** Edificio de apartamentos con ventanas (algunas encendidas, según t). */
export function building(c: CanvasRenderingContext2D, w: number, h: number, t: number, col: string = C.azul) {
  c.fillStyle = col; rrect(c, -w / 2, -h / 2, w, h, 14); c.fill();
  c.fillStyle = hexA(C.negro, 0.18); c.fillRect(-w / 2 - 14, -h / 2 - 10, w + 28, 22);
  const cols = 4, rows = 5, gw = (w - 60) / cols, gh = (h - 150) / rows;
  for (let r = 0; r < rows; r++) for (let k = 0; k < cols; k++) {
    const on = Math.sin(r * 3.1 + k * 1.7 + Math.floor(t * 0.8)) > 0.3;
    c.fillStyle = on ? C.amarillo : hexA(C.blanco, 0.85);
    rrect(c, -w / 2 + 30 + k * gw + 8, -h / 2 + 40 + r * gh + 6, gw - 16, gh - 14, 6); c.fill();
  }
  c.fillStyle = C.blanco; rrect(c, -36, h / 2 - 96, 72, 96, [10, 10, 0, 0]); c.fill();
}

/** Cámara de vigilancia sobre un soporte; la lente "vigila" con un punto rojo que titila. */
export function camera(c: CanvasRenderingContext2D, s: number, t: number, col: string = C.negro) {
  c.fillStyle = col;
  rrect(c, -s * 0.06, -s * 0.5, s * 0.12, s * 0.3, s * 0.03); c.fill();
  c.save(); c.translate(0, -s * 0.2); c.rotate(0.25 + Math.sin(t * 1.2) * 0.18);
  rrect(c, -s * 0.5, -s * 0.16, s * 0.8, s * 0.32, s * 0.08); c.fill();
  c.fillStyle = hexA(C.blanco, 0.9); c.beginPath(); c.arc(s * 0.3, 0, s * 0.11, 0, Math.PI * 2); c.fill();
  c.fillStyle = col; c.beginPath(); c.arc(s * 0.3, 0, s * 0.06, 0, Math.PI * 2); c.fill();
  c.fillStyle = Math.sin(t * 5) > 0 ? C.naranja : hexA(C.naranja, 0.3);
  c.beginPath(); c.arc(-s * 0.36, -s * 0.05, s * 0.04, 0, Math.PI * 2); c.fill();
  c.restore();
}

/** Extracto bancario: hoja con cabecera y filas de movimientos que aparecen según k (0→1). */
export function statement(c: CanvasRenderingContext2D, w: number, h: number, k: number) {
  c.fillStyle = C.azul; rrect(c, -w / 2, -h / 2, w, 92, [10, 10, 0, 0]); c.fill();
  text(c, 'Extracto bancario', -w / 2 + 30, -h / 2 + 58, { w: 800, size: 34, col: C.blanco });
  const rows: [string, string, string][] = [
    ['Nómina', '+ $ 2.400.000', C.verde], ['Supermercado', '− $ 186.500', C.naranja], ['Arriendo', '− $ 950.000', C.naranja],
    ['Transferencia', '+ $ 120.000', C.verde], ['Servicios', '− $ 143.200', C.naranja], ['Saldo', '$ 1.240.300', C.azul],
  ];
  const n = rows.length;
  rows.forEach(([a, b, col], i) => {
    const e = ease.outCubic(clamp(k * n - i));
    if (e <= 0) return;
    const y = -h / 2 + 150 + i * ((h - 190) / n);
    c.save(); c.globalAlpha *= e;
    text(c, a, -w / 2 + 30 + (1 - e) * 20, y, { w: i === n - 1 ? 800 : 500, size: 28, col: C.negro });
    text(c, b, w / 2 - 30, y, { w: 700, size: 28, col, align: 'right' });
    c.fillStyle = C.gris2; c.fillRect(-w / 2 + 30, y + 18, w - 60, 2);
    c.restore();
  });
}

/** Mini gráfica de barras que crece (k 0→1) con una flecha hacia arriba. */
export function bars(c: CanvasRenderingContext2D, s: number, k: number, col: string = C.verde) {
  const hs = [0.35, 0.55, 0.75, 1];
  hs.forEach((v, i) => {
    const e = ease.outBack(clamp(k * 1.6 - i * 0.2), 1.4);
    c.fillStyle = i === hs.length - 1 ? col : hexA(col, 0.55);
    const bh = s * 0.8 * v * e;
    rrect(c, -s * 0.5 + i * s * 0.27, s * 0.4 - bh, s * 0.2, bh, 6); c.fill();
  });
  ln(c, C.azul, s * 0.07);
  c.fillStyle = C.gris1; c.fillRect(-s * 0.56, s * 0.42, s * 1.12, s * 0.04);
}
