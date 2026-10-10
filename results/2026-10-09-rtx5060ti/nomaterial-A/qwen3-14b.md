# Revisión por IA local — ADGG102PO Business Intelligence

> Revisor: `qwen3:14b`. **Es una ayuda para priorizar, no una garantía**: puede dejarse errores y puede señalar falsos positivos. La revisión humana sigue siendo obligatoria.

**Resumen:** 9 hallazgo(s) — alta 9, media 0, baja 0. Tiempo: 4.0 min.

### 1. [ALTA] contradiccion — Lección 1: Fundamentos del Data Warehouse (P1.3)

> «Los datos en un Data Warehouse se modifican y se borran constantemente una vez que han sido integrados en el repositorio central.»

**Problema:** La no volatilidad de los datos en un Data Warehouse implica que no se modifican ni se borran una vez integrados. La frase contradice este principio fundamental.

**Propuesta:** Los datos en un Data Warehouse no se modifican ni se borran una vez integrados en el repositorio central.

- [ ] Revisado / corregido

### 2. [ALTA] contradiccion — Lección 1: Fundamentos del Data Warehouse (P2.2)

> «El Data Warehouse es el sistema que gestiona las transacciones diarias de la empresa.»

**Problema:** Esta afirmación es incorrecta. El Data Warehouse no gestiona transacciones diarias; es el sistema operativo el que lo hace. El Data Warehouse se enfoca en el análisis de datos históricos.

**Propuesta:** El Data Warehouse no gestiona las transacciones diarias de la empresa; es el sistema operativo el que lo hace.

- [ ] Revisado / corregido

### 3. [ALTA] contradiccion — Lección 2: Sistemas OLTP e implementación del Data Warehouse (P2.2)

> «Los datos se transforman y cargan desde el almacén de datos hacia los sistemas OLTP mediante procesos programados.»

**Problema:** La frase afirma que los datos se cargan desde el almacén de datos hacia los sistemas OLTP, lo cual es incorrecto. En la implementación de un Data Warehouse, los datos se extraen de los sistemas OLTP y se cargan hacia el Data Warehouse, no al revés.

**Propuesta:** Los datos se transforman y cargan desde los sistemas OLTP hacia el almacén de datos mediante procesos programados.

- [ ] Revisado / corregido

### 4. [ALTA] error factual — Lección 3: Análisis OLAP y arquitecturas de servidores (P2.1)

> «El modelo ROLAP, o Relational OLAP, almacena los datos en estructuras multidimensionales precalculadas.»

**Problema:** ROLAP no almacena datos en estructuras multidimensionales precalculadas, sino que utiliza bases de datos relacionales para almacenar los datos, y realiza los cálculos en tiempo real.

**Propuesta:** El modelo ROLAP, o Relational OLAP, almacena los datos en estructuras relacionales y realiza los cálculos en tiempo real, en lugar de usar estructuras multidimensionales precalculadas.

- [ ] Revisado / corregido

### 5. [ALTA] error factual — Lección 3: Análisis OLAP y arquitecturas de servidores (P2.2)

> «Esto permite una velocidad de respuesta extremadamente lenta, ya que los cálculos ya están hechos antes de que el usuario haga la consulta.»

**Problema:** La frase afirma que MOLAP tiene una velocidad de respuesta extremadamente lenta, lo cual es incorrecto. MOLAP es conocido por su alta velocidad de respuesta debido a los cálculos precalculados.

**Propuesta:** Esto permite una velocidad de respuesta extremadamente rápida, ya que los cálculos ya están hechos antes de que el usuario haga la consulta.

- [ ] Revisado / corregido

### 6. [ALTA] error factual — Lección 3: Análisis OLAP y arquitecturas de servidores (P2.3)

> «Finalmente, el modelo HOLAP utiliza únicamente almacenamiento relacional y descarta las estructuras multidimensionales.»

**Problema:** HOLAP no utiliza únicamente almacenamiento relacional, sino que combina almacenamiento relacional y multidimensional, como se menciona más adelante en el párrafo.

**Propuesta:** Finalmente, el modelo HOLAP combina almacenamiento relacional y estructuras multidimensionales, en lugar de utilizar únicamente almacenamiento relacional.

- [ ] Revisado / corregido

### 7. [ALTA] error factual — Lección 5: Procesos ETL en la Arquitectura de BI (P1.1)

> «La sigla ETL significa Enviar, Transformar y Limpiar.»

**Problema:** La sigla ETL no significa 'Enviar', sino 'Extracción, Transformación y Carga'.

**Propuesta:** La sigla ETL significa Extracción, Transformación y Carga.

- [ ] Revisado / corregido

### 8. [ALTA] contradiccion — Lección 6: Arquitectura de BI: Almacenes de Datos y Cubos (P2.2)

> «La tabla de hechos contiene los atributos descriptivos, como el importe total de una factura o la cantidad de unidades vendidas. Las dimensiones, por el contrario, aportan el contexto necesario, como el nombre del vendedor o la sucursal.»

**Problema:** La descripción de las tablas de hechos y dimensiones está invertida. Las tablas de hechos contienen métricas cuantitativas, mientras que las tablas de dimensiones aportan el contexto descriptivo.

**Propuesta:** La tabla de hechos contiene las métricas cuantitativas, como el importe total de una factura o la cantidad de unidades vendidas. Las dimensiones, por el contrario, aportan el contexto necesario, como el nombre del vendedor o la sucursal.

- [ ] Revisado / corregido

### 9. [ALTA] error factual — Lección 7: Visualización y análisis avanzado de datos (P2.2)

> «Igual que el OLAP, el Data Mining solo responde a preguntas que el analista ya ha formulado.»

**Problema:** El Data Mining no solo responde a preguntas formuladas previamente, sino que también puede descubrir patrones y relaciones que el analista no había considerado antes.

**Propuesta:** El Data Mining no solo responde a preguntas que el analista ya ha formulado, sino que también puede descubrir patrones y relaciones ocultas que no eran evidentes previamente.

- [ ] Revisado / corregido
