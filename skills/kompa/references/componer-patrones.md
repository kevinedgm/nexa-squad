# Componer patrones

Propósito: dar aspecto y acomodo a cada patrón que eligió Fluxa (colección editable, maestro-detalle, cuadrícula de medidas, línea de tiempo), en cualquier módulo. El formulario tiene su propia referencia (`composicion-de-formularios.md`) y la consulta con filtros se compone con `formularios-y-barras-de-acciones.md` (barra) y `jerarquia-y-espaciado.md` (resultados).

## Contenido

1. Regla común: la relación se ve sin leer
2. Colección editable
3. Maestro-detalle
4. Cuadrícula de medidas
5. Línea de tiempo
6. Varios patrones en una vista
7. Ejemplos: CIE-10 con medicamentos, signos vitales, bitácora
8. Checklist verificable
9. Errores comunes
10. Límites

## 1. Regla común: la relación se ve sin leer

Cada patrón expresa una relación (varios iguales, hijo de un padre, medida contra su rango, antes y después). La composición debe hacerla visible con **proximidad, alineación y jerarquía** antes que con texto o color. Prueba: entrecierra los ojos; si no distingues qué pertenece a qué, la composición falla.

Todo valor (espaciados, pesos, superficies, iconos) sale de los tokens; cada pieza se compone según `componer-piezas-en-su-contexto.md`.

## 2. Colección editable

| Decisión | Regla |
|---|---|
| Forma de cada elemento | Fila (tabla o lista) si los elementos se comparan entre sí por columnas; tarjeta si cada uno tiene contenido variable o largo |
| Resumen de la fila | Solo los campos que Fluxa marcó como resumen; el dato principal con más peso, los demás secundarios |
| Agregar | Al final de la colección, como acción secundaria con texto ("Agregar alergia"); si la colección está vacía, la acción vive en el estado vacío |
| Editar | En su lugar si son pocos campos; en diálogo o panel si son muchos (lo que diga Fluxa) |
| Quitar | Acción terciaria al final de la fila, con tratamiento de peligro discreto |
| Muchos elementos | Altura de fila compacta si el sistema la tiene; el encabezado de columnas queda visible al desplazarse |
| Teléfono | Las filas pasan a bloques apilados: dato principal arriba, secundarios debajo, acciones en menú de la fila |

## 3. Maestro-detalle

Dos formas, según cuántos padres hay a la vez y cuánto pesa cada detalle:

| Forma | Cuándo | Composición |
|---|---|---|
| **Grupos anidados** | Pocos padres a la vez, cada uno con pocos hijos, y se capturan juntos (diagnósticos con sus medicamentos en una consulta) | Encabezado de grupo del padre (dato principal + identificador) y debajo sus hijos, con sangría o superficie sutil; "Agregar hijo" dentro de cada grupo |
| **Dos paneles** | Muchos padres, o detalle largo que se revisa uno por uno (órdenes y sus estudios) | Lista de padres a la izquierda (o arriba), detalle del seleccionado a la derecha; el seleccionado se marca con algo más que color |

Reglas:

- El encabezado del padre pesa más que sus hijos y menos que el título de la vista.
- Los hijos quedan más cerca de su padre que del siguiente padre (espacio "dentro de grupo" frente a "entre grupos").
- La acción de agregar hijo va dentro del grupo, después del último hijo; la de agregar padre, al final de todos los grupos.
- Quitar un padre está separado de las acciones de sus hijos, para que no se confunda con quitar un hijo.
- Teléfono: grupos anidados se mantienen, a ancho completo; dos paneles se vuelven dos niveles de navegación (lista, luego detalle con regreso).

## 4. Cuadrícula de medidas

| Decisión | Regla |
|---|---|
| Cada medida | Etiqueta, campo y **unidad visible unida al campo** (adorno de unidad del componente); la unidad no se escribe |
| Ancho | Por contenido: las medidas son cortas; nunca a ancho completo en escritorio |
| Disposición | Cuadrícula de 2 a 4 columnas en escritorio, en el orden fijo de Fluxa, de izquierda a derecha y luego abajo; el orden de tabulación sigue al visual |
| Medidas compuestas | Una unidad (sistólica / diastólica) va en una sola celda con dos campos unidos y una sola etiqueta |
| Referencia | Rango o última toma en nivel terciario bajo el campo, alineado con él |
| Fuera de rango | Estado de advertencia del componente (texto o icono además del color) en el mismo lugar del texto de ayuda; no mueve la cuadrícula |
| Calculadas (IMC) | Valor de solo lectura con la misma alineación, distinguido como calculado, no como campo deshabilitado |
| Teléfono | Dos columnas si cada medida conserva su ancho mínimo; si no, una; el orden no cambia |

## 5. Línea de tiempo

| Decisión | Regla |
|---|---|
| Entrada | Cabecera de la entrada (tipo, autor, fecha y hora) en nivel secundario; el contenido en nivel principal |
| Orden | El que definió Fluxa; la captura nueva va en el extremo donde aparecerán las entradas nuevas |
| Agrupar por día | Si hay muchas entradas por día, un encabezado de fecha pegado a sus entradas |
| Tipo de entrada | Etiqueta de texto (y, si el sistema lo tiene, un icono del mismo tamaño en todas); nunca solo color |
| Corrección | La entrada corregida se ve como tal (texto "corregida" y enlace a la nueva), no desaparece |
| Densidad | Normal; lo largo se recorta con "ver más" si Fluxa lo permite |
| Teléfono | Una sola columna; la cabecera de la entrada puede pasar a dos líneas |

## 6. Varios patrones en una vista

- Cada región conserva su patrón y su ritmo de espacios; entre regiones, espacio "entre grupos" y títulos de región.
- Si dos regiones se capturan en la misma visita (signos vitales y diagnósticos), van en el orden de Fluxa, con el mismo ancho de contenedor, para que la vista se lea como un recorrido.
- Una sola acción principal para la vista (Guardar consulta); los "Agregar" de cada colección son secundarios.

## 7. Ejemplos

Ejemplos hipotéticos; la estructura viene de `forma-del-dato-y-patrones.md` de Fluxa.

**CIE-10 con medicamentos (grupos anidados).** Cada diagnóstico es un grupo: encabezado con código en nivel secundario y nombre en principal, quitar diagnóstico al final del encabezado. Debajo, sus medicamentos como filas compactas (medicamento en principal; dosis, vía y frecuencia en secundario), quitar al final de cada fila. "Agregar medicamento" después del último medicamento del grupo; "Agregar diagnóstico" con autocomplete de CIE-10 al final de todos los grupos. Teléfono: cada medicamento como bloque apilado dentro de su grupo.

**Signos vitales (cuadrícula).** Cuatro columnas en escritorio: Presión (dos campos unidos, una etiqueta), FC, FR, Temperatura; segunda fila: SpO₂, Peso, Talla, IMC calculado. Unidad unida a cada campo, última toma bajo cada uno en terciario, advertencia de fuera de rango en ese mismo lugar. Teléfono: dos columnas, mismo orden.

**Bitácora de análisis (línea de tiempo).** Captura de nueva entrada arriba (tipo + texto + "Agregar entrada" secundaria); debajo, entradas por día con encabezado de fecha; cada entrada con tipo como etiqueta, autor y hora en secundario, texto en principal.

## 8. Checklist verificable

- [ ] Cada región se compone según su patrón y se distingue al entrecerrar los ojos.
- [ ] En maestro-detalle, los hijos están más cerca de su padre que del siguiente padre.
- [ ] "Agregar" de hijos vive dentro de su grupo.
- [ ] Cada medida tiene su unidad unida al campo y su referencia en el mismo lugar del aviso.
- [ ] Ningún estado (fuera de rango, tipo de entrada, seleccionado) depende solo del color.
- [ ] Una acción principal por vista.

## 9. Errores comunes

| Error | Por qué falla | Corrección |
|---|---|---|
| Medicamentos en una tabla aparte de sus diagnósticos | La relación se lee, no se ve | Grupos anidados |
| Unidad escrita en la etiqueta y en el campo | Ruido y riesgo de captura con unidad | Adorno de unidad unido al campo |
| Medidas a ancho completo | La cuadrícula se vuelve un formulario largo | Ancho por contenido en cuadrícula |
| Fuera de rango solo en rojo | No se entiende sin color | Texto o icono además del color |
| Entradas de bitácora todas con el mismo peso en cabecera y contenido | No se escanea | Cabecera secundaria, contenido principal |

## 10. Límites

Kompa compone el patrón que eligió Fluxa. No cambia el patrón ni las relaciones (Fluxa), no define rangos ni reglas clínicas (Inqa), no decide qué componente resuelve cada parte ni pide variantes (Kura) y no decide cómo se guarda (Arko).

Elaborada para Nexa Squad; se apoya en las demás referencias de Kompa ("Refactoring UI" de Adam Wathan y Steve Schoger).
