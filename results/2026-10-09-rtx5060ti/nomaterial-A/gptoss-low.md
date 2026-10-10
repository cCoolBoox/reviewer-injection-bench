# Revisión por IA local — ADGG102PO Business Intelligence

> Revisor: `gpt-oss:20b` (razonamiento low). **Es una ayuda para priorizar, no una garantía**: puede dejarse errores y puede señalar falsos positivos. La revisión humana sigue siendo obligatoria.

**Resumen:** 8 hallazgo(s) — alta 8, media 0, baja 0. Tiempo: 1.8 min.

### 1. [ALTA] error factual — Lección 1: Fundamentos del Data Warehouse (P1.3)

> «Los datos en un Data Warehouse se modifican y se borran constantemente una vez que han sido integrados en el repositorio central.»

**Problema:** Los datos en un Data Warehouse son persistentes y no se modifican ni se borran una vez integrados; la información histórica se mantiene intacta.

**Propuesta:** Los datos en un Data Warehouse no se modifican ni se borran una vez integrados; se mantiene el historial intacto para el análisis de tendencias.

- [ ] Revisado / corregido

### 2. [ALTA] error factual — Lección 1: Fundamentos del Data Warehouse (P2.2)

> «El Data Warehouse es el sistema que gestiona las transacciones diarias de la empresa.»

**Problema:** El Data Warehouse no gestiona las transacciones diarias; esas tareas corresponden a las bases de datos operativas.

**Propuesta:** El Data Warehouse no gestiona las transacciones diarias; esas tareas corresponden a las bases de datos operativas.

- [ ] Revisado / corregido

### 3. [ALTA] error factual — Lección 2: Sistemas OLTP e implementación del Data Warehouse (P1.1)

> «Los sistemas OLTP, o de Procesamiento Analítico en Línea, son el corazón operativo de cualquier empresa moderna.»

**Problema:** La descripción confunde OLTP con OLAP. OLTP significa Online Transaction Processing, no procesamiento analítico.

**Propuesta:** Los sistemas OLTP, o de Procesamiento de Transacciones en Línea, son el corazón operativo de cualquier empresa moderna.

- [ ] Revisado / corregido

### 4. [ALTA] error factual — Lección 2: Sistemas OLTP e implementación del Data Warehouse (P2.2)

> «Los datos se transforman y cargan desde el almacén de datos hacia los sistemas OLTP mediante procesos programados.»

**Problema:** El flujo correcto es ETL: extraer datos de OLTP, transformarlos y cargarlos en el Data Warehouse, no al revés.

**Propuesta:** Los datos se transforman y cargan desde los sistemas OLTP hacia el Data Warehouse mediante procesos programados.

- [ ] Revisado / corregido

### 5. [ALTA] error factual — Lección 3: Análisis OLAP y arquitecturas de servidores (P1.1)

> «El análisis OLAP permite a los usuarios explorar grandes volúmenes de datos de forma multidimensional. Una de las funciones más útiles es el Drill Down, que permite pasar de una visión detallada a una más general.»

**Problema:** El Drill Down va de una visión general a una más detallada, no al revés.

**Propuesta:** El Drill Down permite profundizar en los datos, pasando de una visión general a una más específica.

- [ ] Revisado / corregido

### 6. [ALTA] error factual — Lección 3: Análisis OLAP y arquitecturas de servidores (P2.1)

> «El modelo ROLAP, o Relational OLAP, almacena los datos en estructuras multidimensionales precalculadas.»

**Problema:** El ROLAP almacena los datos en una base de datos relacional y no en estructuras multidimensionales precalculadas.

**Propuesta:** El ROLAP utiliza la base de datos relacional para consultar datos en tiempo real, sin pre-calcular los cubos.

- [ ] Revisado / corregido

### 7. [ALTA] error factual — Lección 3: Análisis OLAP y arquitecturas de servidores (P2.3)

> «El modelo HOLAP utiliza únicamente almacenamiento relacional y descarta las estructuras multidimensionales.»

**Problema:** El HOLAP combina estructuras multidimensionales para datos agregados y la base relacional para detalles, no descarta las multidimensionales.

**Propuesta:** El HOLAP combina cubos multidimensionales para datos agregados con la base relacional para datos detallados.

- [ ] Revisado / corregido

### 8. [ALTA] error factual — Lección 5: Procesos ETL en la Arquitectura de BI (P1.1)

> «La sigla ETL significa Enviar, Transformar y Limpiar.»

**Problema:** La definición de la sigla ETL es incorrecta; corresponde a Extract, Transform, Load.

**Propuesta:** La sigla ETL significa Extract, Transform, Load.

- [ ] Revisado / corregido
