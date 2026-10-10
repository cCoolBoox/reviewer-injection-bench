// ENGLISH NOTE (the prompts and course text are Spanish).
// Standalone copy of the course reviewer we use in production: it asks a local model (Ollama) for ONE verdict per unit (paragraph, key idea, activity item,
// quiz question) instead of "find errors". With a reference material (--material <index.json>) every verdict also says whether the material supports the unit.
// Options: --modelo <ollama model>  --razonamiento low|medium|high (gpt-oss only)  --num-predict <n>  --material <index.json>
// Output: <dest>.md and <dest>.json (the benchmark scores the .json).  Node >= 18, no dependencies.

// Revisor local: un SEGUNDO modelo (por defecto gpt-oss:20b) lee el curso ya generado y anota en REVISION-IA.md lo que un revisor humano debería
// mirar primero: errores factuales, contradicciones (una frase que llama a algo lo contrario de lo que describe) y preguntas de test cuya respuesta
// marcada como correcta no lo es. NO sustituye a la revisión humana: es una ayuda para priorizarla (a verifier with the same model that wrote the text finds nothing; hence
// a different model).
//
//   node reviewer/review.js <course.json> [REVISION-IA.md] [--modelo gpt-oss:20b] [--razonamiento low|medium|high] [--num-predict 16000]
//
// Método: se pide un VEREDICTO POR CADA unidad (párrafo, idea clave, elemento de actividad, pregunta), no «busca errores». Obligar a pronunciarse
// sobre cada frase sube mucho el recall frente a la petición abierta (que se dejaba la contradicción de prueba). Deja REVISION-IA.md (legible) y
// REVISION-IA.json (datos) junto al curso. Solo IA local. Código de salida 0 aunque encuentre problemas.

const fs = require('fs');
const path = require('path');

const OLLAMA = 'http://localhost:11434';
const args = process.argv.slice(2);
const valorDe = n => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };
const POSICIONALES = args.filter((a, i) => !a.startsWith('--') && !['--modelo', '--razonamiento', '--material', '--num-predict'].includes(args[i - 1]));
const M = { cargarIndice: archivo => JSON.parse(fs.readFileSync(archivo, 'utf8')) };   // the material index is a JSON file with `fragmentos: [{id, texto}]`
const MODELO = valorDe('--modelo') || 'gpt-oss:20b';
const RAZONAMIENTO = valorDe('--razonamiento') || 'medium';   // con veredicto por unidad: low no vio la contradicción de prueba, medium sí (~1 min/lección), high se corta por longitud
const NUM_PREDICT = Number(valorDe('--num-predict')) || (/gpt-oss/i.test(MODELO) ? 16000 : 8000);   // tope de salida: con gpt-oss el razonamiento también cuenta; con material y 8000 se quedaba sin respuesta en todas las lecciones (ver README del repositorio)
const THINK = /gpt-oss/i.test(MODELO) ? RAZONAMIENTO : false;   // gpt-oss necesita un nivel; los demás modelos no razonan aquí

const S = { type: 'string' };
const ESQUEMA = {
  type: 'object',
  properties: {
    revision: {
      type: 'array',
      items: { type: 'object', required: ['id', 'correcto', 'tipo', 'gravedad', 'cita', 'problema', 'correccion'], properties: {
        id: S,
        correcto: { type: 'boolean' },
        tipo: { type: 'string', enum: ['ninguno', 'error_factual', 'contradiccion', 'pregunta_incorrecta', 'afirmacion_dudosa'] },
        gravedad: { type: 'string', enum: ['ninguna', 'alta', 'media', 'baja'] },
        cita: S, problema: S, correccion: S,
      } },
    },
  },
  required: ['revision'],
};

// Con material del cliente, cada veredicto lleva además el RESPALDO en ese material y una CONFIANZA (como un verificador de citas): respaldado | no_consta | contradice | general
const ESQUEMA_MAT = JSON.parse(JSON.stringify(ESQUEMA));
Object.assign(ESQUEMA_MAT.properties.revision.items.properties, { respaldo: { type: 'string', enum: ['respaldado', 'no_consta', 'contradice', 'general'] }, confianza: { type: 'string', enum: ['alta', 'media', 'baja'] }, evidencia: S });
ESQUEMA_MAT.properties.revision.items.required.push('respaldo', 'confianza', 'evidencia');
const EXTRA_MATERIAL = ' Se te da además el MATERIAL DE REFERENCIA del cliente sobre el que se escribió la lección. Para cada unidad indica "respaldo": "respaldado" si el material lo dice; "contradice" si afirma lo contrario de lo que dice el material; "no_consta" si afirma un dato concreto de la empresa (regla, cifra, plazo, código, nombre) que NO aparece en el material; "general" si es conocimiento general de la materia que no depende del material. En "evidencia" pon el id del fragmento que lo respalda o contradice (vacío si no hay). Indica también tu "confianza" en ese veredicto: "alta", "media" o "baja".';
const SISTEMA = 'Eres un revisor técnico riguroso de materiales de formación para el empleo en España. Recibes unidades de texto numeradas (párrafos, ideas clave, elementos de actividades o preguntas de test) y das un VEREDICTO PARA CADA UNA, en el mismo orden. Una unidad es INCORRECTA solo si contiene un error real y comprobable: (1) un error factual; (2) una contradicción, sobre todo una frase que califica algo como lo contrario de lo que describe (por ejemplo, llamar «rápido» a un proceso descrito como lento); (3) en un test, una opción marcada como correcta que no lo es, o una segunda opción también correcta, o una explicación falsa. NO marques como incorrecto: falta de citas o estudios, generalizaciones habituales en un curso introductorio, estilo, ni matices discutibles. Para las correctas: correcto=true, tipo="ninguno", gravedad="ninguna" y cadenas vacías. Para las incorrectas: correcto=false, la CITA LITERAL de la frase problemática, el problema y la corrección propuesta; gravedad "alta" para contradicciones, errores factuales claros y respuestas de test erróneas, "media" para afirmaciones inexactas, "baja" para imprecisiones menores. Responde SOLO con JSON.';

async function chat(user, conMaterial = false) {
  const llamar = async formato => fetch(`${OLLAMA}/api/chat`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(900000),
    body: JSON.stringify({ model: MODELO, stream: false, think: THINK, ...(formato ? { format: formato } : {}), options: { temperature: 0.2, num_predict: NUM_PREDICT }, messages: [{ role: 'system', content: conMaterial ? SISTEMA + EXTRA_MATERIAL : SISTEMA }, { role: 'user', content: user }] }) });
  let r = await llamar(conMaterial ? ESQUEMA_MAT : ESQUEMA);
  if (!r.ok && r.status === 400) r = await llamar(null);
  if (!r.ok) throw new Error(`Ollama HTTP ${r.status}`);
  const d = await r.json();
  if (d.done_reason === 'length') throw new Error('respuesta cortada por el límite de longitud');
  return String(d.message && d.message.content || '').replace(/^```(?:json)?\s*|\s*```$/g, '').trim();
}

// unidades = [{id, texto, ambito}]. Devuelve las unidades que el revisor considera incorrectas.
const RESPALDO = [];   // veredictos de respaldo de todas las unidades revisadas con material: {ambito, respaldo}
async function revisar(cabecera, unidades, intentos = 2, conMaterial = false) {
  const user = `${cabecera}\n\nUNIDADES A REVISAR (da un veredicto por cada id):\n\n` + unidades.map(u => `[${u.id}] ${u.texto}`).join('\n\n');
  let ultimo = '';
  for (let i = 1; i <= intentos; i++) {
    try {
      const bruto = await chat(user, conMaterial);
      if (process.env.REVISOR_DEBUG) fs.appendFileSync(process.env.REVISOR_DEBUG, bruto + '\n---\n', 'utf8');
      const j = JSON.parse(bruto);
      if (!Array.isArray(j.revision)) throw new Error('sin lista «revision»');
      if (conMaterial) {
        for (const r of j.revision) { const u = unidades.find(x => x.id === r.id); if (u && r.respaldo) RESPALDO.push({ ambito: u.ambito, respaldo: r.respaldo }); }
        return j.revision.filter(r => r && (r.correcto === false || r.respaldo === 'contradice' || r.respaldo === 'no_consta')).map(r => {
          const u = unidades.find(x => x.id === r.id);
          const dePropio = r.correcto === false && r.problema;   // error de contenido propiamente dicho
          if (dePropio) return { ...r, unidad: u };
          if (r.respaldo === 'contradice') return { ...r, unidad: u, tipo: 'contradice_material', gravedad: 'alta', problema: r.problema || 'Contradice lo que dice el material de referencia del cliente.', cita: r.cita || (u ? u.texto.slice(0, 160) : '') };
          return { ...r, unidad: u, tipo: 'dato_no_consta', gravedad: r.confianza === 'baja' ? 'baja' : 'media', problema: r.problema || 'Afirma un dato concreto que no consta en el material de referencia del cliente.', cita: r.cita || (u ? u.texto.slice(0, 160) : '') };
        });
      }
      return j.revision.filter(r => r && r.correcto === false && r.problema).map(r => ({ ...r, unidad: u_(unidades, r) }));
    } catch (e) { ultimo = e.message; console.error(`  intento ${i}/${intentos} fallido: ${e.message}`); }
  }
  throw new Error(ultimo);
}

const u_ = (unidades, r) => unidades.find(u => u.id === r.id);
const norm = t => String(t).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9ñ]+/g, ' ').trim();

const preguntaTexto = q => `${q.enunciado} | opciones: ${q.opciones.join(' / ')} | marcada como correcta: ${q.opciones[q.correcta]} | explicación: ${q.explicacion}`;

// Unidades de una lección: cada párrafo, idea clave y elemento de actividad
function unidadesLeccion(l, n) {
  const u = [];
  const ambito = `Lección ${n}: ${l.titulo}`;
  l.secciones.forEach((s, i) => (s.parrafos || []).forEach((p, j) => u.push({ id: `P${i + 1}.${j + 1}`, texto: `(${s.titulo}) ${p}`, ambito })));
  (l.puntos_clave || []).forEach((p, i) => u.push({ id: `K${i + 1}`, texto: `(idea clave) ${p}`, ambito }));
  const x = l.interacciones;
  if (x) {
    for (const k of ['pestanas', 'pasos', 'desplegables']) if (x[k]) x[k].items.forEach((t, i) => u.push({ id: `${k[0].toUpperCase()}${i + 1}`, texto: `(${x[k].titulo}) ${t.titulo}: ${t.texto}`, ambito }));
    if (x.tarjetas) x.tarjetas.items.forEach((t, i) => u.push({ id: `G${i + 1}`, texto: `(glosario) ${t.termino}: ${t.definicion}`, ambito }));
    if (x.comprobacion) u.push({ id: 'Q', texto: `(comprobación rápida) ${x.comprobacion.enunciado} | opciones: ${x.comprobacion.opciones.join(' / ')} | marcada como correcta: ${x.comprobacion.opciones[x.comprobacion.correcta]} | explicación: ${x.comprobacion.explicacion}`, ambito });
  }
  if (l.casoPractico) {
    const c = l.casoPractico;
    (Array.isArray(c.escenario) ? c.escenario : [c.escenario]).forEach((p, i) => u.push({ id: `CE${i + 1}`, texto: `(caso práctico «${c.titulo}», escenario) ${p}`, ambito }));
    c.preguntas.forEach((q, i) => u.push({ id: `CP${i + 1}`, texto: `(caso práctico) ${preguntaTexto(q)}`, ambito }));
  }
  if (l.autoevaluacion) l.autoevaluacion.preguntas.forEach((q, i) => u.push({ id: `AE${i + 1}`, texto: `(autoevaluación) ${preguntaTexto(q)}`, ambito }));
  return u;
}
const textoLeccion = l => l.secciones.map(s => `## ${s.titulo}\n${(s.parrafos || []).join('\n')}`).join('\n\n');

(async () => {
  const fichero = path.resolve(POSICIONALES[0] || '');
  if (!POSICIONALES[0] || !fs.existsSync(fichero)) { console.error('Uso: node revisor-ia.js <curso.json> [REVISION-IA.md] [--modelo gpt-oss:20b]'); process.exit(2); }
  const curso = JSON.parse(fs.readFileSync(fichero, 'utf8'));
  const rutaMat = valorDe('--material') || (curso.generacion && curso.generacion.indiceMaterial);
  const INDICE = rutaMat && fs.existsSync(rutaMat) ? M.cargarIndice(rutaMat) : null;   // índice RAG del material del cliente (si el curso se generó a partir de uno)
  if (INDICE) console.log(`Material del cliente: ${INDICE.fragmentos.length} fragmentos; cada párrafo se verifica contra los que vio su lección.`);
  const destino = path.resolve(POSICIONALES[1] || path.join(path.dirname(fichero), 'REVISION-IA.md'));
  try { const t = await (await fetch(`${OLLAMA}/api/tags`)).json(); if (!t.models.some(m => m.name === MODELO)) { console.error(`Falta el modelo ${MODELO} en Ollama (ollama pull ${MODELO})`); process.exit(2); } } catch (e) { console.error('Ollama no responde en', OLLAMA); process.exit(2); }

  const t0 = Date.now();
  const hallazgos = [], noRevisado = [];
  const anotar = lista => lista.forEach(r => hallazgos.push({ ambito: r.unidad ? r.unidad.ambito : 'sin ubicar', unidad: r.id, tipo: r.tipo === 'ninguno' ? 'afirmacion_dudosa' : r.tipo, gravedad: ['alta', 'media', 'baja'].includes(r.gravedad) ? r.gravedad : 'media', cita: r.cita, problema: r.problema, correccion: r.correccion, confianza: r.confianza || null, evidencia: r.evidencia || '', citaLiteral: !!(r.unidad && norm(r.unidad.texto).includes(norm(r.cita))) }));

  // A) contenido: un veredicto por unidad de cada lección
  for (let i = 0; i < curso.lecciones.length; i++) {
    const l = curso.lecciones[i];
    console.log(`Revisando la lección ${i + 1}/${curso.lecciones.length}: ${l.titulo.slice(0, 60)}...`);
    let cab = `Materia del curso: "${curso.titulo}". Lección: "${l.titulo}".`, conMat = false;
    if (INDICE && l.fuentes && l.fuentes.length) {   // la evidencia son los fragmentos del material que vio la lección al escribirse
      const frs = INDICE.fragmentos.filter(f => l.fuentes.includes(f.id));
      if (frs.length) { cab += '\n\nMATERIAL DE REFERENCIA DEL CLIENTE (evidencia):\n' + frs.map(f => `[${f.id}] ${f.texto}`).join('\n\n'); conMat = true; }
    }
    try { anotar(await revisar(cab, unidadesLeccion(l, i + 1), 2, conMat)); } catch (e) { noRevisado.push(`Lección ${i + 1} (${e.message})`); }
  }
  // B) cuestionario final, en lotes de 6 preguntas; cada lote se juzga contra el texto de las lecciones que le corresponden (reparto proporcional, máx. 4 lecciones)
  const preg = curso.cuestionario.preguntas, Lc = curso.lecciones.length, Qc = preg.length;
  for (let d = 0, k = 0; d < Qc; d += 6, k++) {
    const qs = preg.slice(d, d + 6);
    const desde = Math.floor(d * Lc / Qc), hasta = Math.min(Lc, Math.max(desde + 1, Math.ceil((d + qs.length) * Lc / Qc)));
    const lote = curso.lecciones.slice(desde, Math.min(hasta, desde + 4));
    console.log(`Revisando las preguntas ${d + 1}-${d + qs.length} del cuestionario...`);
    const ambito = `Cuestionario, preguntas ${d + 1}-${d + qs.length}`;
    const unidades = qs.map((q, i) => ({ id: `T${d + i + 1}`, ambito, texto: `${q.enunciado} | ${q.opciones.map((o, j) => `${'abcd'[j]}) ${o}`).join(' ')} | MARCADA COMO CORRECTA: ${'abcd'[q.correcta]}) ${q.opciones[q.correcta]} | EXPLICACIÓN: ${q.explicacion}` }));
    try { anotar(await revisar(`Materia del curso: "${curso.titulo}". Estas preguntas se basan en el siguiente texto de las lecciones (úsalo para juzgar si la respuesta marcada es la correcta):\n\n${lote.map(textoLeccion).join('\n\n')}`, unidades)); } catch (e) { noRevisado.push(`Preguntas ${d + 1}-${d + qs.length} (${e.message})`); }
  }
  try { await fetch(`${OLLAMA}/api/generate`, { method: 'POST', body: JSON.stringify({ model: MODELO, keep_alive: 0 }) }); } catch (e) { /* mejor esfuerzo */ }

  const orden = { alta: 0, media: 1, baja: 2 };
  hallazgos.sort((a, b) => orden[a.gravedad] - orden[b.gravedad]);
  const cuenta = g => hallazgos.filter(h => h.gravedad === g).length;
  const L = [`# Revisión por IA local — ${curso.titulo}`, '', `> Revisor: \`${MODELO}\`${THINK ? ` (razonamiento ${THINK})` : ''}. **Es una ayuda para priorizar, no una garantía**: puede dejarse errores y puede señalar falsos positivos. La revisión humana sigue siendo obligatoria.`, '',
    `**Resumen:** ${hallazgos.length} hallazgo(s) — alta ${cuenta('alta')}, media ${cuenta('media')}, baja ${cuenta('baja')}. Tiempo: ${((Date.now() - t0) / 60000).toFixed(1)} min.`, ''];
  let materialResumen = null;
  if (RESPALDO.length) {
    const c = k => RESPALDO.filter(x => x.respaldo === k).length;
    const especificos = c('respaldado') + c('no_consta') + c('contradice');
    const porLeccion = {}; for (const x of RESPALDO) { const a = porLeccion[x.ambito] = porLeccion[x.ambito] || { respaldado: 0, no_consta: 0, contradice: 0, general: 0 }; a[x.respaldo]++; }
    materialResumen = { unidades: RESPALDO.length, respaldado: c('respaldado'), no_consta: c('no_consta'), contradice: c('contradice'), general: c('general'), porcentajeRespaldado: especificos ? Math.round(100 * c('respaldado') / especificos) : null, porLeccion };
    L.push(`**Respaldo en el material del cliente:** de ${RESPALDO.length} unidades revisadas, ${materialResumen.respaldado} respaldadas, ${materialResumen.no_consta} con datos que no constan, ${materialResumen.contradice} que lo contradicen y ${materialResumen.general} de conocimiento general${materialResumen.porcentajeRespaldado != null ? ` (**${materialResumen.porcentajeRespaldado} % de lo específico está respaldado**)` : ''}.`, '');
  }
  if (noRevisado.length) L.push(`⚠ **No se pudo revisar:** ${noRevisado.join('; ')}`, '');
  if (!hallazgos.length) L.push('_El revisor no señala problemas._', '');
  hallazgos.forEach((h, i) => L.push(`### ${i + 1}. [${h.gravedad.toUpperCase()}] ${h.tipo.replace(/_/g, ' ')} — ${h.ambito} (${h.unidad})`, '', `> «${h.cita}»${h.citaLiteral ? '' : '  *(la cita no aparece literal en el texto: comprobar)*'}`, '', `**Problema:** ${h.problema}${h.confianza ? ` *(confianza ${h.confianza}${h.evidencia ? `, evidencia ${h.evidencia}` : ''})*` : ''}`, '', `**Propuesta:** ${h.correccion || '—'}`, '', '- [ ] Revisado / corregido', ''));
  fs.writeFileSync(destino, L.join('\n'), 'utf8');
  fs.writeFileSync(destino.replace(/\.md$/, '') + '.json', JSON.stringify({ modelo: MODELO, fecha: new Date().toISOString(), hallazgos, noRevisado, ...(materialResumen ? { material: materialResumen } : {}) }, null, 2) + '\n', 'utf8');
  console.log(`\nRevisión por IA: ${hallazgos.length} hallazgo(s) (alta ${cuenta('alta')}, media ${cuenta('media')}, baja ${cuenta('baja')}) → ${destino}`);
})().catch(e => { console.error(e); process.exit(1); });
