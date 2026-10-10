# Test your own reviewer, or your own course

## A different reviewer (another model, a cloud API, a person)
Produce, for each set in `data/injected/`, a JSON like the one `reviewer/review.js` writes. The scorer reads only this:
```json
{ "hallazgos": [ { "ambito": "Lección 2: <title>", "unidad": "P1.3", "gravedad": "alta",
                   "cita": "...", "problema": "...", "correccion": "..." } ] }
```
- `ambito`: `Lección N: ...` (N = lesson number in the injected course) or a string containing `Cuestionario` for quiz questions.
- `unidad`: `P<section>.<paragraph>` for paragraphs (other ids, e.g. `K1`, `D2`, `T5`, are fine for ideas, activity items and quiz questions).
- `gravedad`: anything other than `ninguna` counts as a finding.
Put the files at `results/<label>/<set>/<config>.json` and run `node score.js results/<label> -v`. If a person reviews, ask them to fill the same fields.

## Your own course
1. Format: the course is a JSON with `titulo`, `lecciones[]` (each with `titulo`, `puntos_clave`, `secciones[].parrafos[]`, `interacciones`, and in `nova.json` also `fuentes`, `casoPractico`, `autoevaluacion`) and `cuestionario.preguntas[]`. See `data/courses/`.
2. Copy `inject/inject.js`, replace `SETS` with your own list `[lesson, section, paragraph, 'c' | 'a', before, after]`. Write the errors yourself, mix changed and added ones, and keep the list
   somewhere the reviewer cannot see. A dozen per set is enough to see big differences; it is not enough to rank close contenders.
3. If you have a reference material, cut it into fragments with the structure of `data/material/manual-nova.index.json` (`fragmentos: [{id, texto}]`), list the ids each lesson used in its `fuentes`, and pass the file with `--material`.
4. Score with `score.js` after adding your manifest as `data/injected/<set>.manifest.json`.

## Things to check before believing a result
- Did every lesson get a verdict? A run that finds nothing may have been cut by the output cap (`done_reason: length`; see `noRevisado` in the output).
- Read the extra flags (`-v`). Some will be real problems of your original text; some will be the model flagging everything as "not in the material".
- Repeat the run. If two runs of the same configuration disagree by more than one or two errors, the difference between configurations is noise.
