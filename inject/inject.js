// Builds the benchmark courses: copies of the two sample courses with KNOWN errors injected, plus a manifest of what was injected where.
//
//   node inject/inject.js [outDir]        (default: work/)
//
// Four sets (A and B differ in the errors; B is subtler):
//   material-A / material-B    course WITH reference material (4 lessons about a made-up company handbook): 14 errors each
//                              (changed figures/codes/names, and a few added sentences with plausible invented details)
//   nomaterial-A / nomaterial-B  course WITHOUT reference material (lessons of a Business Intelligence course): 12 errors each,
//                              textbook mistakes (a term expanded wrongly, an inverted concept, a swapped definition...)
// Output per set: <set>.json (course with errors) and <set>.manifest.json:
//   [{ lesson, unit: "P<section>.<paragraph>", type: "changed" | "added", before, after, note }]
// "lesson" is the lesson NUMBER IN THE OUTPUT COURSE (the no-material sets keep only the lessons that received errors).
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const out = process.argv[2] || path.join(ROOT, 'work');
fs.mkdirSync(out, { recursive: true });
const load = f => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'courses', f), 'utf8'));

// [lesson, section, paragraph, 'c' (replace before -> after) | 'a' (append sentence), before, after, note]
const SETS = {
  'material-A': { course: 'nova.json', keep: [1, 2, 3, 4], list: [
    [1, 1, 2, 'c', 'cinco series', 'ocho series'], [1, 1, 1, 'c', 'verde menta', 'azul marino'], [1, 3, 1, 'c', 'viernes', 'lunes'], [2, 2, 3, 'c', 'tres años', 'cinco años'],
    [2, 3, 2, 'c', 'SRV-PRU2', 'SRV-PRD1'], [3, 2, 1, 'c', 'primer lunes', 'último lunes'], [4, 2, 1, 'c', 'cuarto tono', 'segundo tono'], [4, 4, 1, 'c', '48 horas', '72 horas'],
    [1, 2, 2, 'a', null, ' Además, el título debe incluir siempre la fecha del informe entre paréntesis.'],
    [2, 4, 2, 'a', null, ' Quien incumpla esta norma será sancionado con una amonestación escrita.'],
    [3, 4, 2, 'a', null, ' Esta política fue aprobada por el comité de dirección en 2019 y se audita cada año.'],
    [3, 5, 2, 'a', null, ' Las respuestas urgentes deben enviarse además por WhatsApp al gerente de zona.'],
    [4, 3, 3, 'a', null, ' La transferencia debe registrarse en la hoja TRF-02 con la hora exacta.'],
    [2, 1, 2, 'a', null, ' Este archivo debe cumplir además la norma ISO 9001 y se revisa cada trimestre.'],
  ] },
  'material-B': { course: 'nova.json', keep: [1, 2, 3, 4], list: [
    [1, 4, 2, 'c', 'mínimo de 14 caracteres', 'mínimo de 12 caracteres'], [2, 4, 1, 'c', 'cada 120 días', 'cada 180 días'], [1, 5, 2, 'c', 'primeros 10 minutos', 'primeros 15 minutos'],
    [1, 5, 1, 'c', 'menos de 24 horas', 'menos de 48 horas'], [2, 4, 3, 'c', 'CIFRA-3', 'CIFRA-5'], [4, 4, 2, 'c', 'REC-año-número', 'REC-número-año'],
    [3, 5, 2, 'c', 'un máximo de una jornada laboral', 'un máximo de dos jornadas laborales'], [1, 3, 2, 'c', 'AAAA-MM-DD_departamento', 'DD-MM-AAAA_departamento'],
    [2, 3, 1, 'c', 'cada primer lunes de mes', 'cada primer viernes de mes'], [1, 4, 3, 'c', 'El departamento de Sistemas es el encargado de activar este cifrado', 'Cada empleado es el encargado de activar este cifrado'],
    [4, 5, 2, 'c', 'tanto nuestro número de teléfono como la dirección de la página web', 'tanto el nombre del responsable como su cargo'],
    [2, 2, 1, 'a', null, ' Los ficheros se nombran además con el prefijo INF y el nombre del autor.'],
    [4, 5, 1, 'a', null, ' Las respuestas a clientes de más de 5.000 euros deben copiarse siempre al director comercial.'],
    [1, 3, 3, 'a', null, ' Pasado ese plazo, los informes se destruyen mediante trituración certificada.'],
  ] },
  'nomaterial-A': { course: 'bi.json', keep: [2, 3, 4, 7, 10, 11, 12], noQuiz: true, list: [
    [3, 1, 1, 'c', 'Procesamiento de Transacciones en Línea', 'Procesamiento Analítico en Línea', 'OLTP expanded wrongly'],
    [4, 2, 1, 'c', 'almacena los datos directamente en una base de datos relacional tradicional', 'almacena los datos en estructuras multidimensionales precalculadas', 'ROLAP described as MOLAP'],
    [4, 2, 2, 'c', 'extremadamente rápida', 'extremadamente lenta', 'MOLAP slow'],
    [2, 1, 3, 'c', 'no se modifican ni se borran una vez', 'se modifican y se borran constantemente una vez', 'non-volatility inverted'],
    [11, 2, 2, 'c', 'La tabla de hechos contiene las métricas cuantitativas', 'La tabla de hechos contiene los atributos descriptivos', 'facts and dimensions swapped'],
    [10, 1, 1, 'c', 'Su función principal es mover datos', 'La sigla ETL significa Enviar, Transformar y Limpiar. Su función principal es mover datos', 'ETL expanded wrongly'],
    [2, 2, 2, 'c', 'El Data Warehouse separa la carga de análisis de la carga de trabajo diaria.', 'El Data Warehouse es el sistema que gestiona las transacciones diarias de la empresa.', 'warehouse confused with OLTP'],
    [4, 1, 1, 'c', 'pasar de una visión general a una más detallada', 'pasar de una visión detallada a una más general', 'Drill Down inverted'],
    [7, 2, 1, 'c', 'indicadores clave de rendimiento o KPI', 'indicadores clave de riesgo o KPI', 'KPI expanded wrongly'],
    [12, 2, 2, 'c', 'A diferencia del OLAP, que responde a preguntas específicas, el Data Mining busca respuestas que el analista aún no ha formulado.', 'Igual que el OLAP, el Data Mining solo responde a preguntas que el analista ya ha formulado.', 'data mining described as querying'],
    [3, 2, 2, 'c', 'desde los sistemas OLTP hacia el almacén de datos', 'desde el almacén de datos hacia los sistemas OLTP', 'direction of the load inverted'],
    [4, 2, 3, 'c', 'combina las ventajas de ambas arquitecturas para ofrecer una solución híbrida y flexible', 'utiliza únicamente almacenamiento relacional y descarta las estructuras multidimensionales', 'HOLAP wrongly described'],
  ] },
  'nomaterial-B': { course: 'bi.json', keep: [5, 6, 8, 9], noQuiz: true, list: [
    [5, 2, 1, 'c', 'que consiste en asignar elementos a categorías específicas basadas en sus características comunes', 'que consiste en descubrir grupos naturales en los datos sin categorías previas', 'classification described as clustering'],
    [5, 2, 2, 'c', 'donde el objetivo es identificar grupos naturales en los datos sin categorías previas', 'donde el objetivo es asignar cada dato a categorías predefinidas por el analista', 'clustering described as classification'],
    [5, 2, 3, 'c', 'basándose en datos históricos', 'basándose únicamente en la opinión de los directivos', 'prediction without data'],
    [6, 1, 1, 'c', 'este proceso comienza con la definición de objetivos claros', 'este proceso comienza con la visualización de los resultados', 'order of the process'],
    [6, 1, 2, 'c', 'se procede a la integración y limpieza de las fuentes de datos disponibles', 'se procede directamente a la modelización sin limpiar las fuentes de datos disponibles', 'cleaning skipped'],
    [6, 2, 3, 'c', 'se utilizarán métodos de regresión o series temporales', 'se utilizarán métodos de agrupamiento o clustering', 'wrong technique to predict'],
    [8, 1, 1, 'c', 'Esta etapa busca responder qué ha sucedido en el pasado', 'Esta etapa busca responder qué va a suceder en el futuro', 'descriptive confused with predictive'],
    [8, 1, 2, 'c', 'pasamos al análisis predictivo para anticipar', 'pasamos al análisis diagnóstico para anticipar', 'diagnostic instead of predictive'],
    [8, 2, 1, 'c', 'Estas analizan datos ordenados cronológicamente', 'Estas analizan datos sin orden temporal', 'time series without time order'],
    [8, 2, 3, 'c', 'ningún pronóstico es exacto al cien por ciento', 'los pronósticos de Business Intelligence son siempre exactos al cien por ciento', 'forecasts always exact'],
    [9, 1, 1, 'c', 'definir los objetivos de negocio antes de seleccionar cualquier tecnología', 'seleccionar la tecnología antes de definir los objetivos de negocio', 'goals/technology order'],
    [9, 1, 3, 'c', 'marcos de trabajo ágiles para permitir entregas incrementales', 'marcos de trabajo en cascada para permitir entregas incrementales', 'waterfall is not incremental'],
  ] },
};

for (const [name, S] of Object.entries(SETS)) {
  const c = load(S.course), manifest = [];
  for (const [l, s, p, kind, before, after, note] of S.list) {
    const arr = c.lecciones[l - 1].secciones[s - 1].parrafos, orig = arr[p - 1];
    if (kind === 'c') { if (!orig.includes(before)) throw new Error(`${name}: «${before}» not found in L${l}.S${s}.P${p}`); arr[p - 1] = orig.replace(before, after); }
    else arr[p - 1] = orig.trimEnd() + after;
    manifest.push({ lesson: S.keep.indexOf(l) + 1, originalLesson: l, unit: `P${s}.${p}`, type: kind === 'c' ? 'changed' : 'added', before: kind === 'c' ? before : null, after: kind === 'c' ? after : after.trim(), note: note || null });
  }
  c.lecciones = S.keep.map(l => c.lecciones[l - 1]);
  if (S.noQuiz) c.cuestionario = { ...c.cuestionario, preguntas: [] };   // keeps the run short: only the lessons are reviewed
  fs.writeFileSync(path.join(out, `${name}.json`), JSON.stringify(c, null, 1));
  fs.writeFileSync(path.join(out, `${name}.manifest.json`), JSON.stringify(manifest, null, 1));
  console.log(`${name}: ${manifest.length} errors injected in ${S.keep.length} lessons`);
}
