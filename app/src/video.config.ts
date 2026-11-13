// ─────────────────────────────────────────────────────────────────────────────
// CONFIGURACIÓN DEL VIDEO — lo único que cambias para un video nuevo (además de
// guion/voz.txt, el audio y las escenas en src/scenes/).
// ─────────────────────────────────────────────────────────────────────────────

// 👉 AQUÍ SE REEMPLAZA ESTE CONTENIDO → los números del aprendizaje y del insight, y el título.
/**
 * CARÁTULA de inicio y de cierre (salen solas en todos los videos).
 * Un número queda como "Aprendizaje 3"; un rango ("1 al 8") como "Aprendizajes 1 al 8".
 * Insight vacío ('') queda como "Panorama general" (para videos generales del informe).
 */
export const CARATULA = {
  aprendizaje: '1 al 8',
  insight: '',
  /** Título del video (debajo de los números). */
  titulo: 'Así exploramos el futuro del campo, el dinero y los negocios',
  /** Línea pequeña de arriba: cliente y trimestre, o el proyecto. */
  cliente: 'Fintech · Agrotech · Modelos de negocio',
};

// 👉 AQUÍ SE REEMPLAZA ESTE CONTENIDO → cliente, trimestre, tendencia/aprendizaje e insight.
/** Footer de identificación (pastilla abajo a la izquierda en todas las escenas). [] para ocultarlo. */
export const FOOTER: string[] = ['Foresight', 'Futuros Vivos', 'Panorama general'];

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
  { file: 'p1_gancho' },
  { file: 'p2_foresight', from: 'Por eso, en InnLab' },
  { file: 'p3_senales', from: 'Rastreamos señales' },
  { file: 'p4_aprendizajes', from: 'De esas señales salieron' },
  { file: 'p5_futuros', from: 'Con esos aprendizajes' },
  { file: 'p6_ensayos', from: 'No son predicciones' },
  { file: 'p7_acuerdos', from: 'Porque la tecnología' },
  { file: 'p8_cierre', from: 'Entra al mapa' },
];
