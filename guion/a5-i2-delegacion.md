> 👉 AQUÍ SE REEMPLAZA ESTE CONTENIDO — guion del video **Aprendizaje 5 · Insight 2**.

# La confianza evoluciona desde autenticar hacia gobernar la delegación

**Insight:** Aprendizaje 5 · Insight 2 · **Tendencia:** agentes de IA y confianza digital · **Cliente / informe:** Futuros Vivos, InnLab
**Duración objetivo:** ~88 s de voz (+ 3,2 s de carátula de inicio y 7,1 s de cierre) · **Formato:** 16:9, 1920×1080, 30 fps
**Fuentes:** REC-20319, REC-20275

**Mensaje clave (1 frase):** el agente confiable no es el que se identifica una vez, sino el que prueba en cada acción que actúa con un mandato vigente, limitado y revocable.

## Guía de estilo
- Identidad Icesi (azul `#5454E9` en cada escena, Plus Jakarta Sans). Reglas completas en `docs/01-guion.md`.
- Verde `#4CB979` para lo correcto (✅), naranja `#E9683B` para el riesgo y lo que se evita (❌).
- *Deepfakes* va en itálica (palabra en inglés).

## Texto para ElevenLabs (copiar tal cual)

```
Imagina que le pides a un asistente de IA que te compre unos tiquetes. Sabes que es tu agente. Pero, ¿sabes hasta dónde puede gastar, con qué tarjeta y si debía preguntarte antes?
<break time="0.7s" />
Identificar a un agente ya no es suficiente. Según Experian, en 2026 el fraude a través de agentes de IA es el riesgo número uno. Los deepfakes son el número dos. Y grandes comercios como Amazon ya están bloqueando a los agentes de terceros.
<break time="0.7s" />
El reto pasa de autenticar a gobernar la delegación. Eso quiere decir definir qué puede hacer el agente: hasta qué monto, en qué comercios, en qué horarios y cuándo debe escalarle la decisión a la persona. Y cada acción tiene que quedar registrada: qué pidió el usuario, qué interpretó el agente y qué ejecutó al final.
<break time="0.7s" />
Para bancos y comercios hay dos extremos que evitar: bloquear toda la automatización o permitirla sin control. Lo que se necesita son permisos granulares según el nivel de riesgo, y no listas binarias de "humano o bot".
<break time="0.8s" />
El agente confiable no será el que demuestre su identidad una sola vez. Será el que pueda probar, en cada acción, que actúa con un mandato vigente, limitado y revocable.
```

## Escenas

| # | Escena | Tiempo aprox. | Voz en off | Texto en pantalla | Sugerencia visual |
|---|---|---|---|---|---|
| 1 | Gancho | 0:00–0:12 | Imagina que le pides a un asistente de IA que te compre unos tiquetes. Sabes que es tu agente. Pero, ¿sabes hasta dónde puede gastar, con qué tarjeta y si debía preguntarte antes? | ¿Quién es? → ¿Qué puede hacer? | Una persona (puppet) le habla a un asistente de IA en el celular; aparecen un tiquete y una tarjeta. "¿Quién es?" se tacha y se cambia por "¿Qué puede hacer?" en la palabra "gastar". |
| 2 | El problema | 0:12–0:35 | Identificar a un agente ya no es suficiente. Según Experian, en 2026 el fraude a través de agentes de IA es el riesgo número uno. Los deepfakes son el número dos. Y grandes comercios como Amazon ya están bloqueando a los agentes de terceros. | Riesgo #1 Agentes IA · #2 *Deepfakes* · Amazon bloquea agentes | Ranking que se arma: tarjeta naranja "#1 Agentes IA" cae en "uno", "#2 Deepfakes" en "dos". Al final, una barrera o candado frente a un carrito de compras con el texto "Amazon bloquea agentes". |
| 3 | El cambio | 0:35–1:00 | El reto pasa de autenticar a gobernar la delegación. Eso quiere decir definir qué puede hacer el agente: hasta qué monto, en qué comercios, en qué horarios y cuándo debe escalarle la decisión a la persona. Y cada acción tiene que quedar registrada: qué pidió el usuario, qué interpretó el agente y qué ejecutó al final. | Límites · Comercios · Tiempo · Escalamiento · Trazabilidad | "Autenticar" se transforma en "Gobernar la delegación". Cinco íconos entran uno a uno cuando la voz los nombra (monto, comercios, horarios, escalarle, registrada). Al final, una línea de registro en 3 pasos: pidió → interpretó → ejecutó. |
| 4 | Implicación | 1:00–1:18 | Para bancos y comercios hay dos extremos que evitar: bloquear toda la automatización o permitirla sin control. Lo que se necesita son permisos granulares según el nivel de riesgo, y no listas binarias de "humano o bot". | ❌ Bloquear todo · ❌ Permitir todo · ✅ Permisos por riesgo | Dos tarjetas naranjas en los extremos con ❌; en el centro, una tarjeta verde con ✅ y un control deslizante de niveles de riesgo. Un interruptor "humano / bot" se tacha. |
| 5 | Cierre | 1:18–1:28 | El agente confiable no será el que demuestre su identidad una sola vez. Será el que pueda probar, en cada acción, que actúa con un mandato vigente, limitado y revocable. | Mandato vigente, limitado y revocable · Fuentes: REC-20319, REC-20275 | Fondo azul; la frase final entra palabra por palabra y "vigente", "limitado" y "revocable" se resaltan en amarillo. Fuentes en pequeño. Luego, logos InnLab e Icesi y la carátula de cierre (automáticos). |

## Notas para la voz
- Los tiempos de la tabla son de la voz; el video suma 3,2 s de carátula al inicio y 7,1 s al final (los pone `preparar_voz.py`).
- Si ElevenLabs lee "IA" como "ía" (una sola sílaba), cámbialo por "I A" en el texto de ElevenLabs y avísale a Claude para ajustar `SPOKEN`.
