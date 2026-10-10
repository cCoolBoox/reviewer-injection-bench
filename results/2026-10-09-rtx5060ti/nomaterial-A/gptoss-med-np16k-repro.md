# Revisión por IA local — ADGG102PO Business Intelligence

> Revisor: `gpt-oss:20b` (razonamiento medium). **Es una ayuda para priorizar, no una garantía**: puede dejarse errores y puede señalar falsos positivos. La revisión humana sigue siendo obligatoria.

**Resumen:** 10 hallazgo(s) — alta 10, media 0, baja 0. Tiempo: 4.3 min.

### 1. [ALTA] contradiccion — Lección 1: Fundamentos del Data Warehouse (P1.3)

> «Los datos en un Data Warehouse se modifican y se borran constantemente una vez que han sido integrados en el repositorio central.»

**Problema:** El Data Warehouse es un sistema de almacenamiento histórico que no permite la modificación ni eliminación de datos una vez integrados; la información debe permanecer inalterada para garantizar la consistencia y la trazabilidad.

**Propuesta:** Los datos en un Data Warehouse no se modifican ni se borran una vez integrados; se mantienen inalterados para garantizar la consistencia histórica.

- [ ] Revisado / corregido

### 2. [ALTA] contradiccion — Lección 1: Fundamentos del Data Warehouse (P2.2)

> «El Data Warehouse es el sistema que gestiona las transacciones diarias de la empresa.»

**Problema:** El Data Warehouse no gestiona las transacciones diarias; esa función corresponde a la base de datos operativa.

**Propuesta:** El Data Warehouse no gestiona las transacciones diarias; esa función corresponde a la base de datos operativa.

- [ ] Revisado / corregido

### 3. [ALTA] error factual — Lección 2: Sistemas OLTP e implementación del Data Warehouse (P1.1)

> «o de Procesamiento Analítico en Línea»

**Problema:** El término correcto es "Procesamiento de Transacciones en Línea" (OLTP).

**Propuesta:** Reemplazar por "Procesamiento de Transacciones en Línea".

- [ ] Revisado / corregido

### 4. [ALTA] error factual — Lección 2: Sistemas OLTP e implementación del Data Warehouse (P2.2)

> «transforman y cargan desde el almacén de datos hacia los sistemas OLTP»

**Problema:** La dirección de flujo de datos está invertida; los datos se extraen de los sistemas OLTP y se cargan en el Data Warehouse.

**Propuesta:** Reemplazar por "transforman y cargan desde los sistemas OLTP hacia el almacén de datos".

- [ ] Revisado / corregido

### 5. [ALTA] contradiccion — Lección 3: Análisis OLAP y arquitecturas de servidores (P1.1)

> «pasar de una visión detallada a una más general»

**Problema:** Drill Down se describe incorrectamente como pasar de una visión detallada a una más general, cuando en realidad permite pasar de una visión general a una más detallada.

**Propuesta:** Drill Down permite pasar de una visión general a una más detallada.

- [ ] Revisado / corregido

### 6. [ALTA] error factual — Lección 3: Análisis OLAP y arquitecturas de servidores (P2.1)

> «almacena los datos en estructuras multidimensionales precalculadas»

**Problema:** ROLAP no almacena datos en estructuras multidimensionales precalculadas; utiliza una base de datos relacional y realiza cálculos en tiempo real.

**Propuesta:** ROLAP almacena los datos en una base de datos relacional y realiza cálculos en tiempo real.

- [ ] Revisado / corregido

### 7. [ALTA] error factual — Lección 3: Análisis OLAP y arquitecturas de servidores (P2.2)

> «velocidad de respuesta extremadamente lenta»

**Problema:** MOLAP se describe como lento, cuando en realidad es rápido.

**Propuesta:** MOLAP ofrece velocidad de respuesta rápida.

- [ ] Revisado / corregido

### 8. [ALTA] contradiccion — Lección 3: Análisis OLAP y arquitecturas de servidores (P2.3)

> «utiliza únicamente almacenamiento relacional y descarta las estructuras multidimensionales»

**Problema:** HOLAP combina almacenamiento relacional y multidimensional; no descarta ninguno.

**Propuesta:** HOLAP combina ambos tipos de almacenamiento.

- [ ] Revisado / corregido

### 9. [ALTA] error factual — Lección 5: Procesos ETL en la Arquitectura de BI (P1.1)

> «Enviar, Transformar y Limpiar»

**Problema:** La sigla ETL no significa "Enviar, Transformar y Limpiar"; la definición correcta es "Extract, Transform, Load".

**Propuesta:** ETL significa Extract, Transform, Load.

- [ ] Revisado / corregido

### 10. [ALTA] afirmacion dudosa — Lección 6: Arquitectura de BI: Almacenes de Datos y Cubos (P2.2)

> «La tabla de hechos contiene los atributos descriptivos, como el importe total de una factura o la cantidad de unidades vendidas.»

**Problema:** La tabla de hechos no contiene atributos descriptivos; contiene métricas cuantitativas.

**Propuesta:** La tabla de hechos contiene métricas cuantitativas, como el importe total de una factura o la cantidad de unidades vendidas.

- [ ] Revisado / corregido
