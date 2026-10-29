# 2. La voz y la sincronización

## Generar la voz en ElevenLabs

1. Pega el texto de tu guion (la sección "Texto para ElevenLabs"). Entre escenas pon pausas como `<break time="0.7s" />`.
2. **Voz usada en el demo:** *Lina – Colombian, Warm & Confident*. Ajustes: velocidad 1.0, estabilidad 50, similitud 75.
3. Descarga el MP3.

## Ponerla en el proyecto

Desde la raíz del repo:

```sh
# guarda el original y crea la versión con 3,5 s de silencio al final (para el cierre y los logos)
cp ~/Downloads/TU_ARCHIVO.mp3 audio/voiceover_original.mp3
ffmpeg -y -i audio/voiceover_original.mp3 -af "apad=pad_dur=3.5" -b:a 192k audio/voiceover.mp3
```

## Sincronizar (encontrar el momento de cada palabra)

```sh
python -m uv run --no-project --with onnxruntime --with numpy python analysis/align_vo.py
python -m uv run --no-project --with numpy python analysis/audio_vo.py
```

- `align_vo.py` lee `guion/voz.txt`, escucha el audio y escribe `data/lyrics.json`, con el inicio y el fin de cada palabra. Imprime cada línea con sus tiempos: revisa que vayan en orden y tengan sentido.
- `audio_vo.py` escribe `data/audio.json`, con el volumen de la voz y la duración total.
- Recarga el navegador: las escenas se re-sincronizan solas, porque buscan sus palabras por contenido y no por segundos fijos.

**Si una palabra queda mal sincronizada**, normalmente es una sigla, un número o una palabra en inglés. Agrégala a `SPOKEN` en `analysis/align_vo.py`, escrita como suena:

```python
SPOKEN = {
    "GPS": ["JE", "PE", "ESE"],
    "REC-0246": ["REC", "CERO", "DOS", "CUATRO", "SEIS"],
}
```

> El modelo de alineación (`analysis/models/`) está entrenado en inglés, pero funciona bien con voces en español.

## Sin voz todavía

Puedes trabajar las escenas antes de tener la voz:

```sh
python3 analysis/placeholder_vo.py
```

Calcula tiempos provisionales a partir de `guion/voz.txt` (unas 2,7 palabras por segundo) y crea un audio en silencio de la misma duración. Cuando llegue la voz real, sincroniza y todo se re-acomoda.
