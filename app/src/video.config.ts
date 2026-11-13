// ─────────────────────────────────────────────────────────────────────────────
// CONFIGURACIÓN DEL VIDEO — lo único que cambias para un video nuevo (además de
// guion/voz.txt, el audio y las escenas en src/scenes/).
// ─────────────────────────────────────────────────────────────────────────────

// 👉 AQUÍ SE REEMPLAZA ESTE CONTENIDO → los números del aprendizaje y del insight, y el título.
/**
 * CARÁTULA de inicio y de cierre (salen solas en todos los videos).
 * Solo cambia los números: quedan como "Aprendizaje 3" e "Insight 2".
 * Para un escenario, usa `lineas` (p. ej. ['Escenario 1', 'Horizonte 2031']).
 */
export const CARATULA = {
  aprendizaje: '',
  insight: '',
  /** Opcional: reemplaza las dos tiras ("Aprendizaje X" / "Insight Z"), p. ej. para un escenario. */
  lineas: ['Escenario 1', 'Horizonte 2031'],
  /** Título del video (debajo de los números). */
  titulo: 'La red cooperativa convierte datos en acceso y confianza',
  /** Línea pequeña de arriba: cliente y trimestre, o el proyecto. */
  cliente: 'Radar de Tendencias Globales 2026',
};

// 👉 AQUÍ SE REEMPLAZA ESTE CONTENIDO → cliente, trimestre, tendencia/aprendizaje e insight.
/** Footer de identificación (pastilla abajo a la izquierda en todas las escenas). [] para ocultarlo. */
export const FOOTER: string[] = ['Foresight', 'Futuros Vivos', 'Escenario 1'];

/** Estilo: 'scrapbook' (papel, cinta, marcador) o 'limpio' (flat, colores exactos de la marca). */
export const STYLE: 'scrapbook' | 'limpio' = 'scrapbook';

// 👉 AQUÍ SE REEMPLAZA ESTE CONTENIDO → agrega el logo del cliente (en app/public/logos/).
/** Logos del cierre (archivos en app/public/logos/, blancos para fondo azul). Agrega aquí el del cliente. */
export const LOGOS: { file: string; height: number }[] = [
  { file: 'logos/innlab_logo.svg', height: 62 },
  { file: 'logos/icesi_logo.svg', height: 115 },
];

// 👉 AQUÍ SE REEMPLAZA ESTE CONTENIDO → tus escenas y la primera frase de cada una (las d1…d7 son del demo y quedan como ejemplo).
/**
 * Escenas en orden. `file` = archivo en src/scenes/ (sin .ts).
 * `from` = un pedazo de la primera frase de la escena tal como está en guion/voz.txt:
 * el corte se hace justo antes de que la voz la diga (la primera escena no lo necesita).
 */
export const SCENES: { file: string; from?: string }[] = [
  { file: 'e1_problema' },
  { file: 'e2_titulo', from: 'Este es el primer escenario' },
  { file: 'e3_encuentro', from: 'Las cooperativas se vuelven' },
  { file: 'e4_linea', from: 'Primero llegan los pilotos' },
  { file: 'e5_rosa', from: 'En 2031, Rosa' },
  { file: 'e6_historial', from: 'Si mañana cambia' },
  { file: 'e7_senales', from: 'Cómo saber si este futuro' },
  { file: 'e8_cierre', from: 'Si mañana se cayera' },
];
