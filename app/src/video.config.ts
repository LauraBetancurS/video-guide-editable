// ─────────────────────────────────────────────────────────────────────────────
// CONFIGURACIÓN DEL VIDEO — lo único que cambias para un video nuevo (además de
// guion/voz.txt, el audio y las escenas en src/scenes/).
// ─────────────────────────────────────────────────────────────────────────────

// 👉 AQUÍ SE REEMPLAZA ESTE CONTENIDO → los números del aprendizaje y del insight, y el título.
/**
 * CARÁTULA de inicio y de cierre (salen solas en todos los videos).
 * Solo cambia los números: quedan como "Aprendizaje 3" e "Insight 2".
 */
export const CARATULA = {
  aprendizaje: '6',
  /** Número del insight. Déjalo vacío ('') en el video general del aprendizaje: la tira amarilla dice "General". */
  insight: '',
  /** Título del video (debajo de los números). */
  titulo: 'Los datos financieros salen del perímetro financiero',
  /** Línea pequeña de arriba: cliente y trimestre, o el proyecto. */
  cliente: 'ACH Colombia · Q2 2026',
};

// 👉 AQUÍ SE REEMPLAZA ESTE CONTENIDO → cliente, trimestre, tendencia/aprendizaje e insight.
/** Footer de identificación (pastilla abajo a la izquierda en todas las escenas). [] para ocultarlo. */
export const FOOTER: string[] = ['Foresight', 'ACH Colombia · Q2 2026', 'Aprendizaje 6 · General'];

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
  { file: 'g1_gancho' },
  { file: 'g2_perimetro', from: 'Eso es parte de algo' },
  { file: 'g3_dato', from: 'Y no pasa solo' },
  { file: 'g4_doble_filo', from: 'El dato transaccional' },
  { file: 'g5_insights', from: 'Los tres insights' },
  { file: 'g6_cierre', from: 'La pregunta para ACH' },
];
