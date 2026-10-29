// ─────────────────────────────────────────────────────────────────────────────
// CONFIGURACIÓN DEL VIDEO — lo único que cambias para un video nuevo (además de
// guion/voz.txt, el audio y las escenas en src/scenes/).
// ─────────────────────────────────────────────────────────────────────────────

/** Footer de identificación (pastilla abajo a la izquierda en todas las escenas). [] para ocultarlo. */
export const FOOTER: string[] = ['Foresight', 'Futuros Vivos', 'Video demo'];

/** Estilo: 'scrapbook' (papel, cinta, marcador) o 'limpio' (flat, colores exactos de la marca). */
export const STYLE: 'scrapbook' | 'limpio' = 'scrapbook';

/** Logos del cierre (archivos en app/public/logos/, blancos para fondo azul). Agrega aquí el del cliente. */
export const LOGOS: { file: string; height: number }[] = [
  { file: 'logos/innlab_logo.svg', height: 62 },
  { file: 'logos/icesi_logo.svg', height: 115 },
];

/**
 * Escenas en orden. `file` = archivo en src/scenes/ (sin .ts).
 * `from` = un pedazo de la primera frase de la escena tal como está en guion/voz.txt:
 * el corte se hace justo antes de que la voz la diga (la primera escena no lo necesita).
 */
export const SCENES: { file: string; from?: string }[] = [
  { file: 'd1_portada' },
  { file: 'd2_insight', from: 'Todo empieza con un insight' },
  { file: 'd3_guion', from: 'escribe el guion en una tabla' },
  { file: 'd4_voz', from: 'genera la voz en ElevenLabs' },
  { file: 'd5_escenas', from: 'describe cada escena' },
  { file: 'd6_exportar', from: 'Revisa el resultado' },
  { file: 'd7_cierre', from: 'Del informe a un video' },
];
