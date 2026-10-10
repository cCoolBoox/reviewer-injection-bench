# Share your numbers

We would like to see this with other models (bigger, smaller, cloud), other GPUs, other languages and your own courses (if you cannot share the course, share only the numbers).

1. Run a reviewer over the four sets in `data/injected/` (the material sets need `--material data/material/manual-nova.index.json`). Put each output `.json` at
   `results/<your-label>/<set>/<config>.json`, or use `node run_all.js --modelo <ollama model> --label <your-label>`.
2. `node score.js results/<your-label> --json > mine.json`
3. Open an issue titled `Results: <model>, <GPU / CPU>, <OS>` with:
   - `mine.json` (pasted),
   - the model and how it was served (Ollama version, quantization, `num_predict`, reasoning level),
   - the GPU (`nvidia-smi --query-gpu=name,driver_version,memory.total --format=csv`) or CPU,
   - anything that did not work, especially runs cut by `done_reason: length`.

Please do **not** include private data in an issue. If you change the prompt in `reviewer/review.js`, say what you changed: results with a different prompt are not comparable.
