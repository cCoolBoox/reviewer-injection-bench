# reviewer-injection-bench

How good is a **local LLM as a first-pass reviewer of generated course text**? We took two sample courses written by a model, **injected known errors**
(changed figures and codes, inverted concepts, invented sentences) and counted how many each reviewer configuration finds and how many extra things it flags.
Everything is open: the injector, the courses, the scorer, the reviewer we use and the raw outputs. **It is a test you can repeat with your own reviewer
or your own course, not a verdict.** Spanish text; one machine.

> Español: [README.es.md](README.es.md)

## What it tests

The reviewer (`reviewer/review.js`, standalone, Node >= 18, no dependencies, talks to [Ollama](https://ollama.com)) asks the model for **one verdict per unit**
(paragraph, key idea, activity item, quiz question) instead of "find the errors in this text". With a reference material (`--material`) every verdict also says
whether the material supports the unit.

| set | course | reference material | injected errors |
|---|---|---|---|
| `material-A` | 4 lessons about a made-up company handbook ("Distribuciones Nova") | yes (52 fragments) | 14: 8 changed figures/codes/names + 6 added invented sentences |
| `material-B` | same, other errors (subtler) | yes | 14: 11 changed + 3 added |
| `nomaterial-A` | 7 lessons of a Business Intelligence course | no | 12 textbook mistakes (term expanded wrongly, inverted concept, swapped definitions) |
| `nomaterial-B` | 4 other lessons of the same course | no | 12 more |

Reviewer configurations compared (all with the same prompt): `gpt-oss:20b` with reasoning `medium` (our default) and `low`, and `qwen3:14b` (no reasoning),
all through Ollama on one consumer GPU.

## Results (RTX 5060 Ti 16 GB, Ryzen 7 5800X, Windows 11, October 2026)

Detected = injected errors found (strict: the reviewer flags the same unit; fact-aware: or a finding in the same lesson/quiz that mentions the altered fact, see
[docs/METHOD.md](docs/METHOD.md)). Extra = flags not explained by any injection.

| reviewer | with material, 28 errors (strict / fact-aware) | extra flags (strict / fact-aware) | no material, 24 errors | extra flags | time per set |
|---|---|---|---|---|---|
| `gpt-oss:20b` medium, `num_predict` 16000 | **21 / 21** | 5 / **2** | **22 / 22** | 0 | 11-15 min (material) · 3-5 min |
| `qwen3:14b` | **22 / 22** | 21 / 6 | 19 / **20** | 0 | 8 min (material) · 2.5-4 min |
| `gpt-oss:20b` low | 16 / 16 | **51 / 48** | 19 / 19 | 1 / 0 | 2 min · 1-2 min |
| `gpt-oss:20b` medium, `num_predict` 8000 | **0** / 2 (truncated) | 2 / 0 | 22 / 22 | 0 | - |

(Per-set numbers: `node score.js results/2026-10-09-rtx5060ti`. Repeats of three configurations gave the same detection counts; the number of extra flags varied slightly, e.g. 3 vs 1 for `qwen3:14b` on `material-A`. A final run of the packaged `reviewer/review.js` (`gptoss-med-np16k-repro`, `nomaterial-A`) found 10/12 where the two earlier `gpt-oss` medium runs found 11/12: expect differences of one error between runs.)

File names in `results/`: `gptoss-med-np16k` = `gpt-oss:20b`, reasoning medium, `--num-predict 16000`; `gptoss-med-np8k` = same with 8000 (enough without material; the reviewer's default is now 16000 for gpt-oss);
`gptoss-low` = reasoning low; `qwen3-14b`; `-r2` = repeat.

What we saw:

- **`gpt-oss:20b` with medium reasoning is the best balance**: 43/52 injected errors found in total and almost nothing extra. `qwen3:14b` finds about as many with material but
  flags many more things (mostly neighbouring paragraphs and quiz questions that repeat the altered figure; a few, 6 in the first run and 4 in the repeat, remain unexplained after fact-aware counting).
- **Without reference material**, textbook mistakes are easy: `gpt-oss` medium finds 22/24 with no extra flag, `qwen3:14b` 19-20/24.
- **`low` reasoning is not enough with material**: it finds fewer and, on one set, flagged *every* unit of a whole lesson as "not in the material" (41 extra flags) - a rate of
  noise that makes the report useless.
- **A hidden limit can zero a reviewer.** `gpt-oss` counts its reasoning tokens inside `num_predict`. With a reference material and `num_predict` 8000 the answer was cut
  (`done_reason: length`) in **every** lesson and the run found 0 errors without any error message. At 16000 it worked. If your reviewer "finds nothing", check this first.
- **What is never found** (all configurations): invented sentences that sound plausible and are not contradicted by the material (for example a new sanction, an approval year,
  a form number). The reviewer says "not in the material" only sometimes. A human reviewer is still needed.
- Medium reasoning is the slowest (about 11-15 min for 4 lessons with material). Fine for a review run overnight or before delivery; not interactive.

## Reproduce

```bash
git clone https://github.com/cCoolBoox/reviewer-injection-bench && cd reviewer-injection-bench
ollama pull gpt-oss:20b && ollama pull qwen3:14b
# review a course with injected errors (material sets need --material)
node reviewer/review.js data/injected/material-A.json out.md --material data/material/manual-nova.index.json --modelo gpt-oss:20b
node reviewer/review.js data/injected/nomaterial-A.json out2.md --modelo qwen3:14b
# score: put each output .json under <dir>/<set>/<config>.json and run
node score.js results/mine -v
```

`node inject/inject.js work/` regenerates `data/injected/` from the clean sample courses in `data/courses/` (the output is identical to what is committed).
`run_all.js` runs the whole matrix on your machine. Our raw outputs are in `results/2026-10-09-rtx5060ti/`.

## Test your own reviewer or your own course

[docs/TEST-YOUR-REVIEWER.md](docs/TEST-YOUR-REVIEWER.md) explains how to inject errors into a course of yours and score any reviewer (a different model, a cloud API,
a human). [CONTRIBUTING-RESULTS.md](CONTRIBUTING-RESULTS.md) says how to send numbers from other GPUs or models.

## Limits (read before quoting any number)

- **The original courses were written by a language model and not proof-read by an expert.** Some "extra" flags can be real problems of the original text. We do not call
  them false alarms; use `-v` to read them.
- Errors were written by one person, 52 in total (13 per set on average), in Spanish. The counts are small: a difference of one or two errors is noise.
- One prompt per model (the reviewer's). A different wording could change the ranking.
- One machine; `gpt-oss:20b` and `qwen3:14b` as served by Ollama in October 2026. Results can differ by version.
- The injected errors are an easy proxy: figures, codes, textbook definitions. They say little about subtle reasoning errors in a real course.
- Repeats mostly gave identical detection counts (temperature 0.2), differences of one error in one case, and slightly different extra-flag counts; we did not measure variance systematically.

## License

Code MIT, data and results CC0. The company, people and codes in the sample course are invented.
