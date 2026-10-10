# reviewer-injection-bench

¿Sirve un **LLM local como primer revisor de textos de cursos generados por IA**? Cogimos dos cursos de ejemplo escritos por un modelo, les **inyectamos errores conocidos**
(cifras y códigos cambiados, conceptos invertidos, frases inventadas) y contamos cuántos encuentra cada configuración del revisor y cuántas cosas de más señala.
Todo es abierto: el inyector, los cursos, el puntuador, el revisor que usamos y las salidas en bruto. **Es una prueba que puedes repetir con tu revisor o con tu curso, no un veredicto.**
Texto en español; una sola máquina.

> English: [README.md](README.md)

## Qué prueba

El revisor (`reviewer/review.js`, independiente, Node >= 18, sin dependencias, habla con [Ollama](https://ollama.com)) pide al modelo **un veredicto por unidad**
(párrafo, idea clave, elemento de actividad, pregunta del test) en vez de «busca los errores de este texto». Con un material de referencia (`--material`) cada veredicto dice
además si el material respalda la unidad.

| juego | curso | material de referencia | errores inyectados |
|---|---|---|---|
| `material-A` | 4 lecciones sobre un manual de empresa inventado («Distribuciones Nova») | sí (52 fragmentos) | 14: 8 cifras/códigos/nombres cambiados + 6 frases inventadas añadidas |
| `material-B` | el mismo, otros errores (más sutiles) | sí | 14: 11 cambiados + 3 añadidos |
| `nomaterial-A` | 7 lecciones de un curso de Business Intelligence | no | 12 errores de manual (término mal expandido, concepto invertido, definiciones cruzadas) |
| `nomaterial-B` | otras 4 lecciones del mismo curso | no | 12 más |

Configuraciones comparadas (mismo prompt): `gpt-oss:20b` con razonamiento `medium` (nuestro valor por defecto) y `low`, y `qwen3:14b` (sin razonamiento), todas con Ollama en una GPU de consumo.

## Resultados (RTX 5060 Ti 16 GB, Ryzen 7 5800X, Windows 11, octubre de 2026)

Detectado = error inyectado encontrado (estricto: el revisor marca la misma unidad; «consciente del dato»: o un hallazgo de la misma lección o del test que menciona el dato alterado, ver
[docs/METHOD.md](docs/METHOD.md)). Extra = marcas que no explica ninguna inyección.

| revisor | con material, 28 errores (estricto / dato) | marcas extra (estricto / dato) | sin material, 24 errores | marcas extra | tiempo por juego |
|---|---|---|---|---|---|
| `gpt-oss:20b` medium, `num_predict` 16000 | **21 / 21** | 5 / **2** | **22 / 22** | 0 | 11-15 min (material) · 3-5 min |
| `qwen3:14b` | **22 / 22** | 21 / 6 | 19 / **20** | 0 | 8 min (material) · 2,5-4 min |
| `gpt-oss:20b` low | 16 / 16 | **51 / 48** | 19 / 19 | 1 / 0 | 2 min · 1-2 min |
| `gpt-oss:20b` medium, `num_predict` 8000 | **0** / 2 (cortado) | 2 / 0 | 22 / 22 | 0 | - |

(Números por juego: `node score.js results/2026-10-09-rtx5060ti`. Tres repeticiones dieron los mismos recuentos de detección; las marcas extra variaron algo, p. ej. 3 frente a 1 con `qwen3:14b` en `material-A`. Una última ejecución del `reviewer/review.js` empaquetado (`gptoss-med-np16k-repro`, `nomaterial-A`) encontró 10/12 donde las dos anteriores de `gpt-oss` medium encontraron 11/12: cuenta con diferencias de un error entre ejecuciones.)

Nombres de fichero en `results/`: `gptoss-med-np16k` = `gpt-oss:20b`, razonamiento medium, `--num-predict 16000`; `gptoss-med-np8k` = igual con 8000 (basta sin material; el valor por defecto del revisor es ahora 16000 para gpt-oss);
`gptoss-low` = razonamiento low; `qwen3-14b`; `-r2` = repetición.

Lo que vimos:

- **`gpt-oss:20b` con razonamiento medio es el mejor equilibrio**: 43 de 52 errores inyectados y casi nada de más. `qwen3:14b` encuentra casi los mismos con material pero marca muchas más cosas
  (sobre todo párrafos vecinos y preguntas del test que repiten la cifra alterada; quedan unas pocas, 6 en la primera ejecución y 4 en la repetición, sin explicar tras el recuento por dato).
- **Sin material de referencia** los errores de manual son fáciles: `gpt-oss` medium encuentra 22/24 sin ninguna marca de más, `qwen3:14b` 19-20/24.
- **El razonamiento `low` no basta con material**: encuentra menos y, en un juego, marcó *todas* las unidades de una lección entera como «no consta en el material» (41 marcas extra): un ruido que inutiliza el informe.
- **Un límite escondido puede dejar a un revisor en cero.** `gpt-oss` cuenta sus tokens de razonamiento dentro de `num_predict`. Con material y `num_predict` 8000 la respuesta se cortó
  (`done_reason: length`) en **todas** las lecciones y la ejecución no encontró ningún error, sin mensaje de error. Con 16000 funcionó. Si tu revisor «no encuentra nada», mira esto primero.
- **Lo que nunca se encuentra** (en ninguna configuración): frases inventadas que suenan bien y que el material no contradice (una sanción nueva, un año de aprobación, un número de formulario).
  El revisor solo a veces dice «no consta en el material». Sigue haciendo falta una persona.
- El razonamiento medio es lo más lento (11-15 min para 4 lecciones con material). Vale para una pasada antes de entregar; no es interactivo.

## Reproducir

```bash
git clone https://github.com/cCoolBoox/reviewer-injection-bench && cd reviewer-injection-bench
ollama pull gpt-oss:20b && ollama pull qwen3:14b
node reviewer/review.js data/injected/material-A.json salida.md --material data/material/manual-nova.index.json --modelo gpt-oss:20b
node reviewer/review.js data/injected/nomaterial-A.json salida2.md --modelo qwen3:14b
# puntuar: deja cada .json de salida en <dir>/<juego>/<config>.json y ejecuta
node score.js results/mio -v
```

`node inject/inject.js work/` regenera `data/injected/` a partir de los cursos limpios de `data/courses/` (la salida es idéntica a la publicada). `run_all.js` ejecuta toda la matriz en tu máquina.
Nuestras salidas en bruto están en `results/2026-10-09-rtx5060ti/`.

## Prueba tu revisor o tu curso

[docs/TEST-YOUR-REVIEWER.md](docs/TEST-YOUR-REVIEWER.md) (en inglés) explica cómo inyectar errores en un curso tuyo y puntuar cualquier revisor (otro modelo, una API en la nube, una persona).
[CONTRIBUTING-RESULTS.md](CONTRIBUTING-RESULTS.md) explica cómo enviar números de otras GPU o modelos.

## Límites (léelos antes de citar ningún número)

- **Los cursos originales los escribió un modelo de lenguaje y no los ha corregido un experto.** Algunas marcas «extra» pueden ser problemas reales del texto original. No las llamamos falsas alarmas; usa `-v` para leerlas.
- Los errores los escribió una persona, 52 en total, en español. Las cifras son pequeñas: una diferencia de uno o dos errores es ruido.
- Un solo prompt por modelo (el del revisor). Otra redacción podría cambiar la clasificación.
- Una sola máquina; `gpt-oss:20b` y `qwen3:14b` servidos por Ollama en octubre de 2026. Con otras versiones puede cambiar.
- Los errores inyectados son un sustituto fácil: cifras, códigos, definiciones de manual. Dicen poco de los errores sutiles de razonamiento de un curso real.
- Las repeticiones dieron casi siempre los mismos recuentos de detección (temperatura 0,2), con un error de diferencia en un caso, y marcas extra algo distintas; no medimos la varianza de forma sistemática.

## Licencia

Código MIT, datos y resultados CC0. La empresa, las personas y los códigos del curso de ejemplo son inventados.
