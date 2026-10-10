# Revisión por IA local — ADGG102PO Business Intelligence

> Revisor: `gpt-oss:20b` (razonamiento medium). **Es una ayuda para priorizar, no una garantía**: puede dejarse errores y puede señalar falsos positivos. La revisión humana sigue siendo obligatoria.

**Resumen:** 11 hallazgo(s) — alta 11, media 0, baja 0. Tiempo: 4.8 min.

### 1. [ALTA] afirmacion dudosa — Lección 1: Fundamentos del Data Warehouse (P1.3)

> «Los datos en un Data Warehouse se modifican y se borran constantemente una vez que han sido integrados en el repositorio central.»

**Problema:** Contradice la característica de persistencia y no volatilidad del Data Warehouse.

**Propuesta:** Los datos en un Data Warehouse no se modifican ni se borran después de ser integrados; se mantienen intactos para análisis histórico.

- [ ] Revisado / corregido

### 2. [ALTA] afirmacion dudosa — Lección 1: Fundamentos del Data Warehouse (P2.2)

> «El Data Warehouse es el sistema que gestiona las transacciones diarias.»

**Problema:** Factual error: el Data Warehouse no gestiona las transacciones diarias.

**Propuesta:** El Data Warehouse no gestiona las transacciones diarias; esa función corresponde a la base de datos operativa.

- [ ] Revisado / corregido

### 3. [ALTA] error factual — Lección 2: Sistemas OLTP e implementación del Data Warehouse (P1.1)

> «de Procesamiento Analítico en Línea»

**Problema:** El término "Procesamiento Analítico en Línea" es incorrecto; OLTP significa Online Transaction Processing, no procesamiento analítico.

**Propuesta:** de Procesamiento de Transacciones en Línea (OLTP)

- [ ] Revisado / corregido

### 4. [ALTA] error factual — Lección 2: Sistemas OLTP e implementación del Data Warehouse (P2.2)

> «Los datos se transforman y cargan desde el almacén de datos hacia los sistemas OLTP»

**Problema:** La dirección del proceso ETL está invertida; los datos se extraen de los sistemas OLTP y se cargan en el almacén de datos.

**Propuesta:** Los datos se transforman y cargan desde los sistemas OLTP hacia el almacén de datos

- [ ] Revisado / corregido

### 5. [ALTA] contradiccion — Lección 3: Análisis OLAP y arquitecturas de servidores (P1.1)

> «Drill Down, que permite pasar de una visión detallada a una más general.»

**Problema:** El Drill Down no pasa de una visión detallada a una más general; en realidad, permite profundizar de una visión general a una más detallada.

**Propuesta:** Drill Down permite pasar de una visión general a una más detallada.

- [ ] Revisado / corregido

### 6. [ALTA] error factual — Lección 3: Análisis OLAP y arquitecturas de servidores (P2.1)

> «El modelo ROLAP, o Relational OLAP, almacena los datos en estructuras multidimensionales precalculadas.»

**Problema:** El ROLAP no utiliza estructuras multidimensionales precalculadas; almacena los datos en una base de datos relacional tradicional.

**Propuesta:** El modelo ROLAP almacena los datos en una base de datos relacional tradicional, sin estructuras multidimensionales precalculadas.

- [ ] Revisado / corregido

### 7. [ALTA] error factual — Lección 3: Análisis OLAP y arquitecturas de servidores (P2.2)

> «permite una velocidad de respuesta extremadamente lenta, ya que los cálculos ya están hechos antes de que el usuario haga la consulta.»

**Problema:** El MOLAP no tiene una velocidad de respuesta lenta; al contrario, es muy rápido porque los cálculos se realizan previamente.

**Propuesta:** El MOLAP permite una velocidad de respuesta extremadamente rápida, ya que los cálculos se realizan previamente a la consulta.

- [ ] Revisado / corregido

### 8. [ALTA] error factual — Lección 3: Análisis OLAP y arquitecturas de servidores (P2.3)

> «El modelo HOLAP utiliza únicamente almacenamiento relacional y descarta las estructuras multidimensionales.»

**Problema:** El HOLAP combina almacenamiento relacional y estructuras multidimensionales; no descarta ninguna de ellas.

**Propuesta:** El modelo HOLAP combina almacenamiento relacional y estructuras multidimensionales.

- [ ] Revisado / corregido

### 9. [ALTA] error factual — Lección 5: Procesos ETL en la Arquitectura de BI (P1.1)

> «La sigla ETL significa Enviar, Transformar y Limpiar.»

**Problema:** La sigla ETL no significa 'Enviar, Transformar y Limpiar'; ETL corresponde a Extract, Transform, Load.

**Propuesta:** La sigla ETL significa Extract, Transform, Load (en español: Extraer, Transformar, Cargar).

- [ ] Revisado / corregido

### 10. [ALTA] error factual — Lección 6: Arquitectura de BI: Almacenes de Datos y Cubos (P2.2)

> «La tabla de hechos contiene los atributos descriptivos, como el importe total de una factura o la cantidad de unidades vendidas.»

**Problema:** La tabla de hechos no contiene atributos descriptivos; contiene métricas cuantitativas.

**Propuesta:** La tabla de hechos contiene métricas cuantitativas, como el importe total de una factura o la cantidad de unidades vendidas.

- [ ] Revisado / corregido

### 11. [ALTA] contradiccion — Lección 7: Visualización y análisis avanzado de datos (P2.2)

> «Igual que el OLAP, el Data Mining solo responde a preguntas que el analista ya ha formulado.»

**Problema:** El Data Mining no se limita a responder preguntas predefinidas; también genera nuevas preguntas y patrones inesperados.

**Propuesta:** El Data Mining puede descubrir patrones y generar nuevas preguntas de análisis, no solo responder a las ya formuladas.

- [ ] Revisado / corregido
