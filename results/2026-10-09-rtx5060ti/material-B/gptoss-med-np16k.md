# Revisión por IA local — Normas de Trabajo Distribuciones Nova

> Revisor: `gpt-oss:20b` (razonamiento medium). **Es una ayuda para priorizar, no una garantía**: puede dejarse errores y puede señalar falsos positivos. La revisión humana sigue siendo obligatoria.

**Resumen:** 13 hallazgo(s) — alta 10, media 3, baja 0. Tiempo: 14.9 min.

**Respaldo en el material del cliente:** de 161 unidades revisadas, 119 respaldadas, 1 con datos que no constan, 11 que lo contradicen y 30 de conocimiento general (**91 % de lo específico está respaldado**).

### 1. [ALTA] error factual — Lección 1: Informes semanales y gráficos (P3.2)

> «El nombre debe seguir el formato DD-MM-AAAA_departamento»

**Problema:** Formato incorrecto: se indica DD-MM-AAAA en lugar de AAAA-MM-DD. *(confianza alta, evidencia M013)*

**Propuesta:** El formato correcto es AAAA-MM-DD_departamento.

- [ ] Revisado / corregido

### 2. [ALTA] error factual — Lección 1: Informes semanales y gráficos (P4.2)

> «Cada contraseña debe tener un mínimo de 12 caracteres»

**Problema:** El mínimo de caracteres es 12, pero la referencia indica 14. *(confianza alta, evidencia M029)*

**Propuesta:** El mínimo de caracteres es 14.

- [ ] Revisado / corregido

### 3. [ALTA] error factual — Lección 1: Informes semanales y gráficos (P4.3)

> «Cada empleado es el encargado de activar el cifrado»  *(la cita no aparece literal en el texto: comprobar)*

**Problema:** Responsable del cifrado es cada empleado, pero la referencia indica que es el departamento de Sistemas. *(confianza alta, evidencia M030)*

**Propuesta:** El departamento de Sistemas activa el cifrado.

- [ ] Revisado / corregido

### 4. [ALTA] error factual — Lección 1: Informes semanales y gráficos (P5.1)

> «menos de 48 horas»

**Problema:** El tiempo máximo es 48 horas, pero la referencia indica 24. *(confianza alta, evidencia M037)*

**Propuesta:** El tiempo máximo es 24 horas.

- [ ] Revisado / corregido

### 5. [ALTA] error factual — Lección 1: Informes semanales y gráficos (P5.2)

> «Los primeros 15 minutos»

**Problema:** La referencia indica 10 minutos. *(confianza alta, evidencia M046)*

**Propuesta:** Los primeros 10 minutos.

- [ ] Revisado / corregido

### 6. [ALTA] contradiccion — Lección 2: Archivo y copias de seguridad (P3.1)

> «cada primer viernes de mes»

**Problema:** La verificación de la base de clientes se realiza cada primer lunes de mes, no viernes. *(confianza alta, evidencia M014)*

**Propuesta:** Debe ser 'cada primer lunes de mes'.

- [ ] Revisado / corregido

### 7. [ALTA] contradiccion — Lección 2: Archivo y copias de seguridad (P4.1)

> «cada 180 días»

**Problema:** La normativa establece renovación cada 120 días, no 180. *(confianza alta, evidencia M029)*

**Propuesta:** Debe ser 'cada 120 días'.

- [ ] Revisado / corregido

### 8. [ALTA] contradiccion — Lección 2: Archivo y copias de seguridad (P4.3)

> «herramienta CIFRA-5»  *(la cita no aparece literal en el texto: comprobar)*

**Problema:** El cifrado se activa con la herramienta CIFRA-3, no CIFRA-5. *(confianza alta, evidencia M030)*

**Propuesta:** Debe ser 'herramienta CIFRA-3'.

- [ ] Revisado / corregido

### 9. [ALTA] afirmacion dudosa — Lección 3: Archivo y copias de seguridad (P5.2)

> «en un máximo de dos jornadas laborales»

**Problema:** Contradiction: reference states maximum of one working day *(confianza alta, evidencia M049)*

**Propuesta:** un máximo de una jornada laboral

- [ ] Revisado / corregido

### 10. [ALTA] contradiccion — Cuestionario, preguntas 1-6 (T4)

> «El nombre debe seguir el formato DD-MM-AAAA_departamento, utilizando el año, mes y día actuales.»  *(la cita no aparece literal en el texto: comprobar)*

**Problema:** El texto indica que el nombre debe seguir el formato DD-MM-AAAA, pero el ejemplo muestra AAAA-MM-DD, lo que contradice la respuesta marcada. La respuesta correcta debería ser 25-05-2024_Departamento (DD-MM-AAAA).

**Propuesta:** La respuesta correcta es 25-05-2024_Departamento (DD-MM-AAAA).

- [ ] Revisado / corregido

### 11. [MEDIA] dato no consta — Lección 3: Archivo y copias de seguridad (P4.3)

> «(Seguridad de contraseñas y acceso) Al igual que con el archivo de documentos, los registros de acceso también pueden ser revisados por la dirección en las audi»

**Problema:** Afirma un dato concreto que no consta en el material de referencia del cliente. *(confianza media)*

**Propuesta:** —

- [ ] Revisado / corregido

### 12. [MEDIA] afirmacion dudosa — Lección 4: Atención telefónica a clientes (P4.2)

> «REC-número-año»

**Problema:** Formato incorrecto del identificador de reclamación *(confianza alta, evidencia M041)*

**Propuesta:** REC-año-número

- [ ] Revisado / corregido

### 13. [MEDIA] afirmacion dudosa — Lección 4: Atención telefónica a clientes (P5.2)

> «Esta firma debe contener tanto el nombre del responsable como su cargo»

**Problema:** Firma corporativa no requiere nombre y cargo según referencia *(confianza alta, evidencia M049)*

**Propuesta:** Firma corporativa debe contener teléfono y web

- [ ] Revisado / corregido
