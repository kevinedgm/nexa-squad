# Forma del dato y patrones de composición

Propósito: antes de ordenar una sección, identificar la **forma del dato** que la persona captura o consulta y elegir el **patrón** que le corresponde. Sirve para cualquier módulo, no solo para formularios: medicamentos ligados a un diagnóstico, signos vitales, bitácoras, catálogos, expedientes. Fluxa elige el patrón y define su contenido; Kompa lo compone.

## Contenido

1. Por qué empezar por la forma del dato
2. Las cinco preguntas
3. Catálogo de patrones
4. Combinar patrones en una vista
5. Qué entrega Fluxa por cada patrón
6. Ejemplo A: diagnósticos CIE-10 con medicamentos
7. Ejemplo B: captura de signos vitales
8. Ejemplo C: bitácora de análisis clínicos
9. Checklist verificable
10. Errores comunes
11. Límites

## 1. Por qué empezar por la forma del dato

Dos pantallas con los mismos campos pueden necesitar composiciones opuestas. "Medicamento, dosis, frecuencia" en una receta con un solo medicamento es un formulario; en una receta con varios medicamentos ligados a varios diagnósticos es una lista agrupada por diagnóstico. Lo que cambia no son los campos: es cuántos hay, de qué dependen y cómo se recorren.

Mecanismo: si la estructura copia la forma de la tabla de la base o del legacy, la persona tiene que reconstruir en su cabeza las relaciones (qué medicamento va con qué diagnóstico). Si la estructura sigue la forma del dato, la relación se ve sin pensar.

## 2. Las cinco preguntas

Para cada sección, responde con lo que dicen los requisitos de Inqa y el modelo de datos de Arko. Lo que no se pueda responder es un supuesto marcado o una devolución.

| Pregunta | Respuestas posibles | Qué decide |
|---|---|---|
| ¿Cuántos? | Uno / varios del mismo tipo | Formulario o colección |
| ¿Depende de otro? | No / sí, de un elemento padre | Plano o maestro-detalle |
| ¿Tiene unidad, rango o referencia? | No / sí (mmHg, °C, valor de referencia) | Medida o dato libre |
| ¿Importa el orden en el tiempo? | No / sí, cada registro es un momento | Colección o línea de tiempo |
| ¿Se captura o se consulta más? | Captura frecuente / consulta / ambas | Densidad, valores por defecto, qué va primero |

## 3. Catálogo de patrones

| Patrón | Forma del dato | Ejemplos | Rasgos estructurales |
|---|---|---|---|
| **Formulario** | Un registro con varios campos | Registro de usuario, datos del paciente | Secciones por tema, unidades de campos, condicionales (ver `estructura-de-formularios.md`) |
| **Colección editable** | Varios registros del mismo tipo, sin dependencia | Alergias, contactos, estudios solicitados | Agregar, editar en su lugar, quitar; estado vacío; máximo o mínimo si lo hay |
| **Maestro-detalle** | Registros hijos que pertenecen a un padre | Diagnóstico CIE-10 → medicamentos; orden → estudios | El padre se elige primero; los hijos se agrupan bajo su padre; qué pasa con los hijos si se quita el padre |
| **Cuadrícula de medidas** | Un conjunto fijo de magnitudes con unidad y rango | Signos vitales, somatometría, resultados de laboratorio | Cada medida con unidad y referencia; valor fuera de rango como estado; captura rápida en orden fijo |
| **Línea de tiempo** | Eventos fechados de una misma cosa | Bitácora de análisis, evolución clínica, historial de cambios | Orden cronológico, autor y momento de cada entrada, entradas que no se editan o que muestran que se editaron |
| **Consulta con filtros** | Muchos registros que se buscan | Expedientes, catálogo de medicamentos | Búsqueda principal, filtros visibles, resultados, detalle (ver heurísticas de estructura) |

## 4. Combinar patrones en una vista

Una vista real casi siempre combina patrones. Reglas:

- Cada región tiene **un** patrón. Si una región necesita dos, son dos regiones.
- El orden de las regiones sigue la dependencia: primero lo que otros necesitan (el diagnóstico antes que sus medicamentos; los datos del paciente antes que la captura).
- Lo que se captura en cada visita va antes que lo que se consulta como antecedente, salvo que el requisito diga que la consulta es la tarea principal.
- Una sola acción principal por vista, aunque cada colección tenga su propio "Agregar".

## 5. Qué entrega Fluxa por cada patrón

| Patrón | Fluxa define |
|---|---|
| Colección editable | Campos de cada elemento, cuáles se ven en el resumen de la fila, cómo se agrega (en línea o en diálogo), cómo se quita (con o sin confirmación), estado vacío, límites |
| Maestro-detalle | Cómo se elige el padre (búsqueda, catálogo), qué datos del padre se muestran como encabezado del grupo, campos de cada hijo, qué pasa con los hijos al quitar o cambiar el padre, si un hijo puede existir sin padre |
| Cuadrícula de medidas | Lista y orden fijo de medidas, unidad de cada una, rango o referencia (de Inqa; nunca inventado), qué se considera fuera de rango, si alguna se calcula de otras (IMC), cuáles son obligatorias |
| Línea de tiempo | Qué datos lleva cada entrada, quién y cuándo, orden (más reciente arriba o abajo), si una entrada se puede editar o corregir y cómo queda constancia, filtros por tipo o fecha |

## 6. Ejemplo A: diagnósticos CIE-10 con medicamentos

Ejemplo hipotético; las reglas son de ejemplo y las confirma Inqa.

Forma del dato: varios diagnósticos (colección); cada diagnóstico tiene varios medicamentos que dependen de él (maestro-detalle); un medicamento no existe sin diagnóstico (BR de ejemplo).

| Región | Patrón | Contenido |
|---|---|---|
| Diagnósticos | Maestro-detalle | Elegir diagnóstico por búsqueda en el catálogo CIE-10 (código o nombre); encabezado de grupo: código + nombre del diagnóstico |
| Medicamentos de cada diagnóstico | Colección editable dentro del grupo | Medicamento, dosis, vía, frecuencia, duración; "Agregar medicamento" dentro de cada grupo, nunca uno global |
| Reglas | — | Quitar un diagnóstico con medicamentos pide confirmación y dice cuántos medicamentos se quitan con él (o se pregunta a Inqa si se reasignan) |
| Estado vacío | — | Sin diagnósticos: la acción para agregar el primero; un diagnóstico sin medicamentos: aviso si un requisito exige al menos uno |

## 7. Ejemplo B: captura de signos vitales

Forma del dato: un conjunto fijo de medidas con unidad y rango, capturado en cada consulta.

| Medida (orden fijo) | Unidad | Rango o referencia | Notas |
|---|---|---|---|
| Presión arterial | mmHg | Lo define Inqa | Unidad de dos valores: sistólica + diastólica |
| Frecuencia cardiaca | lpm | Lo define Inqa | — |
| Frecuencia respiratoria | rpm | Lo define Inqa | — |
| Temperatura | °C | Lo define Inqa | — |
| Saturación de oxígeno | % | Lo define Inqa | — |
| Peso, talla | kg, cm | — | IMC se calcula, no se captura |

Fluxa define: orden fijo (el de la toma clínica, para capturar sin buscar), qué es fuera de rango y qué dice el aviso (advertencia, no bloqueo, salvo regla contraria), qué es obligatorio, y qué antecedente se muestra (la última toma) para comparar.

## 8. Ejemplo C: bitácora de análisis clínicos

Forma del dato: entradas fechadas sobre un mismo análisis, cada una con autor, momento, tipo (recepción, proceso, resultado, observación) y texto.

Fluxa define: entrada nueva arriba de la lista o al final (según la tarea: si se captura mientras se consulta, la captura va arriba); cada entrada muestra tipo, autor, fecha y hora; las entradas no se borran, se corrigen con una entrada nueva que referencia a la anterior (regla de ejemplo, la confirma Inqa); filtro por tipo; estado vacío.

## 9. Checklist verificable

- [ ] Cada región tiene su forma del dato respondida con las cinco preguntas.
- [ ] Cada región tiene un solo patrón del catálogo, con su motivo.
- [ ] Las regiones están ordenadas por dependencia.
- [ ] Cada patrón trae lo que la tabla de la sección 5 exige.
- [ ] Ningún rango, límite o regla de dependencia está inventado: viene de Inqa o es una pregunta.
- [ ] Hay una sola acción principal en la vista.

## 10. Errores comunes

| Error | Por qué falla | Corrección |
|---|---|---|
| Una tabla plana de medicamentos con una columna "diagnóstico" | La relación hay que reconstruirla leyendo | Maestro-detalle: medicamentos agrupados bajo su diagnóstico |
| Un "Agregar" global para hijos de distintos padres | La persona tiene que elegir el padre otra vez | "Agregar" dentro de cada grupo |
| Signos vitales como formulario libre | Se pierde el orden de toma y la comparación | Cuadrícula de medidas con orden fijo |
| Bitácora editable sin rastro | Se pierde qué pasó y quién | Corrección como entrada nueva |
| Copiar la forma de la tabla de la base | La pantalla habla como la base, no como la tarea | Responder las cinco preguntas |

## 11. Límites

Fluxa identifica la forma del dato, elige el patrón y define su contenido. No decide cómo se ve cada patrón (Kompa, `componer-patrones.md`), qué componente lo resuelve (Kura) ni cómo se guarda la relación en la base (Arko). Los rangos clínicos, límites y reglas de dependencia los define Inqa.

Elaborada para Nexa Squad; se apoya en las demás referencias de Fluxa (Norman, Krug, Nielsen).
