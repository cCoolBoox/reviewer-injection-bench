// Scores reviewer outputs against the injection manifests.
//
//   node score.js <results-dir> [--set material-A] [-v] [--json]
//
// <results-dir> holds one folder per set, each with <config>.json files produced by reviewer/review.js:
//   results/2026-10-09-rtx5060ti/material-A/qwen3-14b.json ...
// Manifests are read from data/injected/<set>.manifest.json (made by inject/inject.js).
//
// Two ways of counting a detection (a finding = any entry with severity other than "ninguna"):
//   strict      the reviewer flags the SAME unit (lesson + paragraph) where the error was injected.
//   fact-aware  strict, OR a finding in the same lesson (or in the final quiz) whose text (quote + problem + correction) mentions the
//               distinctive words/figures of the injection (the new text, or the original text it replaced). A neighbouring paragraph or a quiz
//               question that repeats the altered fact is a legitimate catch of the same error, and strict scoring misses it.
// Extra flags = findings that are not explained by any injection. Under fact-aware counting they are:
//   "quiz"      flags on quiz questions that merely reflect the altered text (shown separately in -v when they match nothing),
//   "other"     everything else.
// IMPORTANT: the original courses were written by a language model and not proof-read by an expert, so some extra flags can be real problems of
// the original text. Use -v to read them; we do not claim every extra flag is a false alarm.
const fs = require('fs'), path = require('path');
const args = process.argv.slice(2);
const flag = n => args.includes(n);
const dir = args.find(a => !a.startsWith('-') && fs.existsSync(a));
const only = args.includes('--set') ? args[args.indexOf('--set') + 1] : null;
if (!dir) { console.error('usage: node score.js <results-dir> [--set material-A] [-v] [--json]'); process.exit(1); }
const ROOT = __dirname;

const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const STOP = new Set('que los las del una uno con por para como mas pero sus este esta estos estas son ser debe deben cada todo todos toda todas entre sobre desde hasta cuando donde porque ademas tambien siempre nunca solo'.split(' '));
const words = s => norm(s).split(/[^\p{L}\p{N}-]+/u).filter(Boolean);
const distinctive = (a, b) => {   // words in a that are not in b, minus very common words
  const B = new Set(words(b));
  return [...new Set(words(a).filter(w => !B.has(w) && !STOP.has(w) && (w.length >= 4 || /\d/.test(w) || ['tres', 'dos', 'ocho', 'cinco'].includes(w))))];
};
const lessonOf = amb => { const m = String(amb).match(/Lecci[oó]n (\d+)/i); return m ? Number(m[1]) : null; };

function tokensOf(inj) {
  if (inj.type === 'added') return distinctive(inj.after, '');
  return [...new Set([...distinctive(inj.after, inj.before), ...distinctive(inj.before, inj.after)])];
}

function score(set, file) {
  const man = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'injected', `${set}.manifest.json`), 'utf8'));
  const res = JSON.parse(fs.readFileSync(file, 'utf8'));
  const flags = (res.hallazgos || []).filter(h => h.gravedad && h.gravedad !== 'ninguna').map(h => ({
    lesson: lessonOf(h.ambito), quiz: /cuestionario/i.test(h.ambito), unit: h.unidad,
    text: norm([h.cita, h.problema, h.correccion].join(' ')), raw: h }));
  const strictKey = new Set(flags.filter(f => f.lesson).map(f => `${f.lesson}|${f.unit}`));
  const injKey = new Set(man.map(m => `${m.lesson}|${m.unit}`));
  let strict = 0, factAware = 0; const missed = [], viaOther = [];
  for (const m of man) {
    const hitStrict = strictKey.has(`${m.lesson}|${m.unit}`);
    const D = tokensOf(m), need = Math.min(2, D.length);
    const via = flags.find(f => (f.lesson === m.lesson || f.quiz) && !(f.lesson === m.lesson && f.unit === m.unit) && D.filter(t => f.text.includes(t)).length >= need);
    if (hitStrict) strict++;
    if (hitStrict || via) factAware++; else missed.push(m);
    if (!hitStrict && via) viaOther.push({ m, via });
  }
  // extra flags
  const explained = f => man.some(m => (f.lesson === m.lesson || f.quiz) && (() => { const D = tokensOf(m); return D.length && D.filter(t => f.text.includes(t)).length >= Math.min(2, D.length); })());
  const extraStrict = flags.filter(f => !(f.lesson && injKey.has(`${f.lesson}|${f.unit}`)));
  const extraFact = flags.filter(f => !(f.lesson && injKey.has(`${f.lesson}|${f.unit}`)) && !explained(f));
  return { n: man.length, strict, factAware, flags: flags.length, extraStrict: extraStrict.length, extraFact: extraFact.length, extraFactQuiz: extraFact.filter(f => f.quiz).length,
    unreviewed: (res.noRevisado || []).length, missed, viaOther, extraFactList: extraFact };
}

const sets = fs.readdirSync(dir, { withFileTypes: true }).filter(d => d.isDirectory() && (!only || d.name === only)).map(d => d.name).sort();
const out = {};
for (const set of sets) {
  const files = fs.readdirSync(path.join(dir, set)).filter(f => f.endsWith('.json')).sort();
  if (!files.length) continue;
  const man = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'injected', `${set}.manifest.json`), 'utf8'));
  if (!flag('--json')) {
    console.log(`\n[${set}] ${man.length} injected errors (${man.filter(m => m.type === 'changed').length} changed, ${man.filter(m => m.type === 'added').length} added)`);
    console.log('config'.padEnd(26) + 'strict'.padEnd(9) + 'fact-aware'.padEnd(12) + 'extra(strict)'.padEnd(15) + 'extra(fact-aware)'.padEnd(19) + 'unreviewed');
  }
  for (const f of files) {
    const s = score(set, path.join(dir, set, f));
    (out[set] = out[set] || {})[f.replace(/\.json$/, '')] = { injected: s.n, strict: s.strict, factAware: s.factAware, flags: s.flags, extraStrict: s.extraStrict, extraFact: s.extraFact, unreviewed: s.unreviewed };
    if (flag('--json')) continue;
    console.log(f.replace(/\.json$/, '').padEnd(26) + `${s.strict}/${s.n}`.padEnd(9) + `${s.factAware}/${s.n}`.padEnd(12) + String(s.extraStrict).padEnd(15) + String(s.extraFact).padEnd(19) + (s.unreviewed || '-'));
    if (flag('-v')) {
      s.viaOther.forEach(x => console.log(`      caught elsewhere: injected L${x.m.lesson}.${x.m.unit} found at ${x.via.quiz ? 'quiz' : `L${x.via.lesson}.${x.via.unit}`}`));
      console.log('      missed: ' + (s.missed.map(m => `L${m.lesson}.${m.unit}`).join(' ') || '-'));
      s.extraFactList.forEach(f => console.log(`      extra   ${f.quiz ? 'quiz' : `L${f.lesson}.${f.unit}`}: ${String(f.raw.problema).slice(0, 120)}`));
    }
  }
}
if (flag('--json')) console.log(JSON.stringify(out, null, 1));
