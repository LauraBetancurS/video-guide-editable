// Qué escena se ve cuándo. Las escenas y sus frases de entrada están en video.config.ts; cada corte cae
// en la pausa antes de su primera frase, buscada por contenido en data/lyrics.json (así, si cambia la
// voz, los cortes se mueven solos).
import type { TimelineEntry } from './engine/engine';
import type { SceneClass } from './engine/scene';
import type { Lyrics } from './engine/lyrics';
import type { AudioData } from './engine/audio';
import { SCENES } from './video.config';

const modules = import.meta.glob<{ default: SceneClass }>('./scenes/*.ts');
const scene = (name: string) => () => {
  const m = modules[`./scenes/${name}.ts`];
  return m ? m() : Promise.reject(new Error(`no existe la escena: src/scenes/${name}.ts`));
};

export function makeTimeline(ly: Lyrics, au: AudioData): TimelineEntry[] {
  /** Corte en la pausa antes de la línea que contiene q: 0.18 s antes de su primera palabra (menos si la pausa es corta). */
  const cut = (q: string) => {
    const l = ly.get(q);
    const prev = ly.lines[l.i - 1];
    const gap = prev ? l.start - prev.end : 1;
    return l.start - Math.min(0.18, Math.max(0.04, gap * 0.45));
  };
  const starts = SCENES.map((s, i) => (i === 0 || !s.from ? 0 : cut(s.from)));
  return SCENES.map((s, i) => ({ id: s.file, load: scene(s.file), start: starts[i]!, end: i + 1 < SCENES.length ? starts[i + 1]! : au.duration }));
}
