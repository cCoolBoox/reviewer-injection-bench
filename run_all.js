// Runs the reviewer over the four injected sets and stores the outputs where score.js expects them.
//   node run_all.js --modelo gpt-oss:20b [--razonamiento medium] [--num-predict 16000] [--label mine] [--sets material-A,nomaterial-A]
// Output: results/<label>/<set>/<config>.json and .md   (config = model + options, e.g. gpt-oss-20b-medium-np16000)
// Then: node score.js results/<label> -v
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const a = process.argv.slice(2), v = n => (a.includes(n) ? a[a.indexOf(n) + 1] : null);
const modelo = v('--modelo') || 'gpt-oss:20b', razon = v('--razonamiento'), np = v('--num-predict'), label = v('--label') || 'mine';
const sets = (v('--sets') || 'material-A,material-B,nomaterial-A,nomaterial-B').split(',');
const config = [modelo.replace(/[:/]/g, '-'), /gpt-oss/.test(modelo) ? (razon || 'medium') : null, np ? `np${np}` : null].filter(Boolean).join('-');
for (const set of sets) {
  const dir = path.join(__dirname, 'results', label, set); fs.mkdirSync(dir, { recursive: true });
  const dest = path.join(dir, `${config}.md`);
  const extra = [].concat(set.startsWith('material') ? ['--material', path.join(__dirname, 'data', 'material', 'manual-nova.index.json')] : [],
    ['--modelo', modelo], razon ? ['--razonamiento', razon] : [], np ? ['--num-predict', np] : []);
  console.log(`\n== ${set} / ${config}`);
  const r = spawnSync(process.execPath, [path.join(__dirname, 'reviewer', 'review.js'), path.join(__dirname, 'data', 'injected', `${set}.json`), dest, ...extra], { stdio: 'inherit' });
  if (r.status) { console.error(`reviewer exited with ${r.status}`); process.exit(r.status); }
}
console.log(`\nDone. Score with: node score.js results/${label} -v`);
