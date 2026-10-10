# Revisión por IA local — ADGG102PO Business Intelligence

> Revisor: `gpt-oss:20b` (razonamiento medium). **Es una ayuda para priorizar, no una garantía**: puede dejarse errores y puede señalar falsos positivos. La revisión humana sigue siendo obligatoria.

**Resumen:** 11 hallazgo(s) — alta 10, media 1, baja 0. Tiempo: 5.8 min.

### 1. [ALTA] error factual — Lección 1: Fundamentos del Data Warehouse (P1.3)

> «Los datos en un Data Warehouse se modifican y se borran constantemente una vez que han sido integrados en el repositorio central.»

**Problema:** Factual error: un Data Warehouse es no volátil; los datos no se modifican ni se borran una vez integrados.

**Propuesta:** Los datos en un Data Warehouse no se modifican ni se borran una vez que han sido integrados en el repositorio central.

- [ ] Revisado / corregido

### 2. [ALTA] error factual — Lección 1: Fundamentos del Data Warehouse (P2.2)

> «El Data Warehouse es el sistema que gestiona las transacciones diarias de la empresa.»

**Problema:** Factual error: un Data Warehouse no gestiona las transacciones diarias; esa función corresponde al sistema operativo.

**Propuesta:** El Data Warehouse no gestiona las transacciones diarias; esas son gestionadas por el sistema operativo.

- [ ] Revisado / corregido

### 3. [ALTA] error factual — Lección 2: Sistemas OLTP e implementación del Data Warehouse (P1.1)

> «Sistemas OLTP, o de Procesamiento Analítico en Línea»

**Problema:** OLTP significa Online Transaction Processing, no Procesamiento Analítico en Línea.

**Propuesta:** Sistemas OLTP, o de Procesamiento de Transacciones en Línea

- [ ] Revisado / corregido

### 4. [ALTA] error factual — Lección 2: Sistemas OLTP e implementación del Data Warehouse (P2.2)

> «Los datos se transforman y cargan desde el almacén de datos hacia los sistemas OLTP»

**Problema:** El proceso ETL va de los sistemas operativos (OLTP) hacia el Data Warehouse, no al revés.

**Propuesta:** Los datos se transforman y cargan desde los sistemas operativos (OLTP) hacia el Data Warehouse mediante procesos ETL

- [ ] Revisado / corregido

### 5. [ALTA] contradiccion — Lección 3: Análisis OLAP y arquitecturas de servidores (P1.1)

> «pasar de una visión detallada a una más general»

**Problema:** El Drill Down va de una visión general a una más detallada, no al revés.

**Propuesta:** pasar de una visión general a una más detallada

- [ ] Revisado / corregido

### 6. [ALTA] contradiccion — Lección 3: Análisis OLAP y arquitecturas de servidores (P2.1)

> «almacena los datos en estructuras multidimensionales precalculadas»

**Problema:** El ROLAP almacena los datos en una base de datos relacional, no en estructuras multidimensionales.

**Propuesta:** almacena los datos en una base de datos relacional

- [ ] Revisado / corregido

### 7. [ALTA] contradiccion — Lección 3: Análisis OLAP y arquitecturas de servidores (P2.2)

> «extremadamente lenta»

**Problema:** El MOLAP ofrece una velocidad de respuesta extremadamente rápida, no lenta.

**Propuesta:** extremadamente rápida

- [ ] Revisado / corregido

### 8. [ALTA] contradiccion — Lección 3: Análisis OLAP y arquitecturas de servidores (P2.3)

> «utiliza únicamente almacenamiento relacional y descarta las estructuras multidimensionales»

**Problema:** El HOLAP combina almacenamiento relacional y estructuras multidimensionales; no descarta ninguna.

**Propuesta:** utiliza una combinación de almacenamiento relacional para datos de detalle y estructuras multidimensionales para datos agregados

- [ ] Revisado / corregido

### 9. [ALTA] error factual — Lección 5: Procesos ETL en la Arquitectura de BI (P1.1)

> «La sigla ETL significa Enviar, Transformar y Limpiar.»

**Problema:** La sigla ETL no significa Enviar, Transformar y Limpiar; su significado correcto es Extract, Transform, Load.

**Propuesta:** ETL significa Extract, Transform, Load.

- [ ] Revisado / corregido

### 10. [ALTA] error factual — Lección 7: Visualización y análisis avanzado de datos (P2.2)

> «Igual que el OLAP, el Data Mining solo responde a preguntas que el analista ya ha formulado.»

**Problema:** El Data Mining puede descubrir patrones y relaciones sin necesidad de que el analista haya formulado previamente una pregunta específica.

**Propuesta:** El Data Mining puede descubrir patrones y relaciones sin necesidad de que el analista haya formulado previamente una pregunta específica.

- [ ] Revisado / corregido

### 11. [MEDIA] error factual — Lección 6: Arquitectura de BI: Almacenes de Datos y Cubos (P2.2)

> «La tabla de hechos contiene los atributos descriptivos»

**Problema:** La tabla de hechos contiene los atributos descriptivos, cuando en realidad contiene métricas cuantitativas; los atributos descriptivos pertenecen a las tablas de dimensiones.

**Propuesta:** La tabla de hechos contiene métricas cuantitativas (medidas), mientras que los atributos descriptivos se encuentran en las tablas de dimensiones.

- [ ] Revisado / corregido
