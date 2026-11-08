# Componer piezas en su contexto

Propósito: acomodar un componente que ya existe (casi siempre fabricado por Fruti Squad) dentro de una sección real, decidiendo cuánto ancho ocupa, qué piezas lleva al lado y cómo se une a ellas, de qué tamaño van sus iconos, y si cada dato va como etiqueta, ayuda, leyenda o icono. Úsala cada vez que una sección combine un control con otros controles o acciones.

## Contenido

1. Por qué falla componer "a ojo"
2. Leer la pieza antes de acomodarla
3. Ancho en su contexto: llena, por contenido o fijo
4. Piezas vecinas: grupo unido o separado
5. Escala de iconos
6. Etiqueta, ayuda, leyenda, icono o descripción emergente
7. Densidad de la sección
8. Ejemplo: autocomplete de cliente con acciones
9. Checklist verificable
10. Errores comunes
11. Límites

## 1. Por qué falla componer "a ojo"

Un componente se diseña aislado, en el Design Hub, con espacio de sobra. En la pantalla real compite con vecinos, tiene un ancho limitado y forma parte de una tarea. Si se coloca sin decidir esas tres cosas, aparecen fallas típicas: un autocomplete estirado al ancho de todo el formulario para un dato corto, un botón suelto que nadie relaciona con su campo, iconos de dos tamaños en la misma fila, o una regla importante escondida en una descripción emergente.

Mecanismo: el componente define **qué puede hacer** (sus variantes, tamaños y estados). La composición define **qué hace aquí**. Kompa decide lo segundo usando lo primero, sin cambiar la pieza.

## 2. Leer la pieza antes de acomodarla

Antes de acomodar un componente, junta su contrato. Orden de fuentes (la primera que exista manda):

| Fuente | Dónde está (si el proyecto usa Fruti Squad) | Qué sacar |
|---|---|---|
| Registro | `registry_path` del perfil de Lima (p. ej. `design-hub/system/registry.json`) | Si existe, su estado (`draft`, `candidate`, `stable`, `deprecated`) y dónde está su documentación y su código |
| Página del Design Hub | Campo `documentation` del registro | Variantes, tamaños, densidades, partes opcionales, estados y ejemplos de uso |
| Tokens | `.fruti/tokens.json` | Alturas de control, escala de iconos, espaciados, radios |
| Código del componente | Campo `source` del registro, o la carpeta de componentes del proyecto | Lo que de verdad acepta hoy (props, clases, modificadores) |

Sin Fruti Squad, la fuente es el código de componentes del proyecto y el sistema visual detectado (paso 1 del SKILL.md).

De cada pieza anota, en una línea por punto:

- **Comportamiento de ancho**: ¿se estira al contenedor, tiene ancho propio o acepta ancho mínimo y máximo?
- **Tamaños y densidades** disponibles (p. ej. pequeño, normal, grande; compacto, normal).
- **Partes opcionales**: icono inicial, botón de limpiar, contador, texto de ayuda, adorno de unidad.
- **Estados** que resuelve por dentro: carga, vacío, sin resultados, error, deshabilitado.
- **Si admite ir unida** a otra pieza (grupo de campo con botón).

Reglas:

- Solo usas variantes, tamaños y partes que el contrato ya tiene. Si la sección necesita algo que la pieza no ofrece (otro tamaño, otra parte), **no lo inventas ni lo simulas con estilos**: es un hueco para Kura.
- Una pieza `draft` o `deprecated` no se compone como definitiva: márcala y avísale a Kura.
- Si no encuentras el contrato, escríbelo como supuesto ("se asume que el autocomplete se estira al contenedor; sin documentación en el Hub") y como hueco.

## 3. Ancho en su contexto: llena, por contenido o fijo

Cada control de una fila toma uno de tres comportamientos:

| Comportamiento | Cuándo | Ejemplo |
|---|---|---|
| **Llena** el espacio disponible | Es el control principal de la fila, o su contenido es variable y puede ser largo | Buscador de la barra de herramientas; autocomplete de cliente o de producto |
| **Por contenido** esperado | El dato tiene un largo acotado y conocido | Folio, código postal, fecha, cantidad (ver `formularios-y-barras-de-acciones.md`, sección 3) |
| **Fijo**, el que da su tamaño | Botones, selectores cortos, interruptores | "Nuevo cliente", "Limpiar", selector de unidad |

Reglas:

- **Uno solo crece por fila.** Si dos controles llenan a la vez, se reparten el espacio sin criterio y ninguno anticipa su contenido. El que crece es el de mayor prioridad según Fluxa; los demás conservan su ancho.
- **Todo lo que crece tiene mínimo y máximo.** El mínimo es el ancho en que la pieza sigue siendo usable (en un autocomplete: que se lea la sugerencia más común sin cortarse). El máximo evita líneas eternas en pantallas anchas; sale del ancho máximo del formulario o de la sección.
- **Lo fijo nunca se aplasta.** Cuando falta espacio, primero cede lo que crece, hasta su mínimo; después se aplica el orden de cesión de la barra.
- **En teléfono**, el control que crece pasa a ocupar la fila completa y sus acciones bajan o pasan a menú, según `responsivo-y-accesibilidad.md`.

## 4. Piezas vecinas: grupo unido o separado

Una acción junto a un campo puede ir **unida** al campo (forman una sola pieza visual) o **separada** (otra pieza de la sección). La pregunta que decide: **¿la acción trabaja solo sobre el valor de ese campo, en ese momento?**

| La acción… | Forma | Ejemplos |
|---|---|---|
| Opera solo sobre el valor del campo y es inmediata | **Unida**, dentro o pegada al campo | Limpiar, buscar, mostrar contraseña, abrir calendario, unidad "kg" |
| Crea o abre algo relacionado con el campo | **Separada pero contigua**, en la misma fila, al final | "Nuevo cliente" junto al autocomplete de cliente |
| Afecta a toda la sección o al formulario | **Separada**, en la barra de acciones de la sección o del formulario | Guardar, Agregar fila, Importar |

Reglas:

- Las piezas unidas comparten altura de control (el mismo token) y se leen como una sola.
- Lo que va dentro del campo (limpiar, adorno de unidad) no compite con el texto: va al final y aparece solo cuando sirve (limpiar, solo si hay valor).
- Una acción contigua va separada por el espacio *dentro de grupo*, no por el espacio *entre grupos* (ver `jerarquia-y-espaciado.md`). Si queda igual de lejos que la siguiente sección, nadie la relaciona con su campo.
- Máximo una acción contigua por campo. Si hay más, van a un menú de la fila o a la barra de la sección.
- Unir o separar no cambia qué acciones existen: eso lo decidió Fluxa.

## 5. Escala de iconos

El tamaño de un icono no se elige por gusto: sigue al texto que acompaña y a la densidad de la sección.

| Situación | Tamaño | Por qué |
|---|---|---|
| Icono dentro de un control (inicial, limpiar, desplegar) | El que corresponde al tamaño del control según el contrato de la pieza | Se lee como parte del control, no como un botón aparte |
| Icono junto a un texto (botón con texto e icono) | Alineado a la altura del texto del botón | Texto e icono pesan lo mismo; el texto manda |
| Botón solo con icono | El mismo tamaño de icono de su fila; lo que crece es el **área táctil** (mínimo 44 px en táctil), no el dibujo | Un icono más grande pesa más y compite con la acción principal |
| Icono de estado (error, aviso, correcto) | El del texto de ayuda o del mensaje que acompaña | Va con el mensaje, no sobre él |
| Icono ilustrativo de un estado vacío | Mayor, del token de ilustración si existe | Es el único caso en que el icono es protagonista |

Reglas:

- **Un tamaño de icono por fila o barra.** Dos tamaños en la misma fila se leen como dos jerarquías.
- Los tamaños salen de la escala de iconos del proyecto (`.fruti/tokens.json` o el sistema visual). Si no hay escala de iconos, no inventes píxeles: es un hueco de token para Kura.
- Un icono funcional siempre tiene nombre accesible; uno decorativo junto a un texto se oculta a lectores de pantalla.
- Cuándo un botón puede ir solo con icono lo decide `formularios-y-barras-de-acciones.md`, sección 7. Esta sección solo decide su tamaño.

## 6. Etiqueta, ayuda, leyenda, icono o descripción emergente

Cada dato que acompaña a un control tiene un único lugar correcto:

| Tipo de información | Va como | Ejemplo |
|---|---|---|
| Qué es el campo | **Etiqueta** visible, siempre | "Cliente" |
| Un ejemplo del formato | **Marcador** (placeholder), nunca en lugar de la etiqueta | "Nombre o RFC" |
| Una regla que hay que cumplir | **Texto de ayuda** bajo el campo, visible antes de equivocarse | "Escribe al menos 3 letras para buscar" |
| Un estado que cambia | **Leyenda o contador** junto al campo o en el pie de la sección | "3 de 20 seleccionados", "Sin resultados para «Acme»" |
| Una acción reconocible | **Icono** con nombre accesible | Limpiar, abrir calendario |
| Un detalle prescindible | **Descripción emergente**, solo si nada esencial depende de ella | Significado de una abreviatura en una columna |

Reglas:

- Nada que la persona necesite para completar la tarea vive solo en una descripción emergente: en teléfono y con teclado no se ve.
- El error ocupa el lugar del texto de ayuda, para que el campo no salte.
- Si el contenido de la ayuda, la leyenda o el mensaje no está definido, no lo redactas: es una devolución a Fluxa, que define el contenido de los estados.

## 7. Densidad de la sección

- **Una densidad por sección.** Mezclar controles compactos y normales en la misma sección rompe la alineación y la jerarquía.
- Como guía: barras de filtros y tablas usan la densidad compacta si el sistema la tiene; formularios de captura, la normal.
- La densidad se expresa con la variante del componente (su contrato), nunca reduciendo rellenos a mano.

## 8. Ejemplo: autocomplete de cliente con acciones

Ejemplo hipotético para enseñar la forma; los nombres de variantes y tokens son genéricos.

Entrada de Fluxa: sección "Datos de la muestra" con el campo Cliente (obligatorio, principal de la sección), la acción "Nuevo cliente" (secundaria, crea un cliente si no existe) y "Limpiar" (sobre el valor del campo). Debajo, Fecha de recepción y Folio.

Lectura de la pieza (registro y Hub): autocomplete `stable`; se estira al contenedor; tamaños normal y compacto; partes opcionales: icono inicial de búsqueda y botón de limpiar; resuelve carga, sin resultados y error por dentro.

Decisiones:

| Decisión | Resultado | Regla |
|---|---|---|
| Ancho de Cliente | Llena la fila, con mínimo para leer un nombre de cliente típico y máximo al ancho del formulario | Sección 3: control principal con contenido variable |
| Limpiar | Unida, dentro del campo, al final; aparece solo si hay valor | Sección 4: opera sobre el valor |
| Nuevo cliente | Separada y contigua, misma fila, botón secundario con texto | Sección 4: crea algo relacionado |
| Iconos | Búsqueda y limpiar con el tamaño del control normal; "Nuevo cliente" con texto e icono "+" del mismo tamaño | Sección 5: un tamaño por fila |
| Ayuda | "Escribe al menos 3 letras para buscar" bajo el campo (texto definido por Fluxa) | Sección 6 |
| Fecha y Folio | Por contenido, en la fila siguiente, lado a lado en escritorio | Sección 3 |
| Densidad | Normal en toda la sección | Sección 7 |

Por ancho:

| Ancho | Composición |
|---|---|
| Escritorio | Fila 1: Cliente (crece) + "Nuevo cliente". Fila 2: Fecha y Folio por contenido. |
| Tablet | Igual que escritorio; si "Nuevo cliente" deja a Cliente por debajo de su mínimo, el botón pasa a solo icono "+" con nombre accesible (cumple las condiciones de icono solo). |
| Teléfono | Cliente a ancho completo; "Nuevo cliente" baja a la fila siguiente con texto; Fecha y Folio a ancho completo, uno debajo del otro. |

Hueco para Kura (si aplicara): si el diseño pidiera mostrar el RFC bajo cada sugerencia y el contrato no tiene esa parte, se registra como hueco ("variante de autocomplete con línea secundaria por sugerencia; 1 uso"), no se simula.

## 9. Checklist verificable

- [ ] Cada pieza tiene su contrato leído (registro, Hub o código) o un supuesto marcado.
- [ ] Solo se usan variantes, tamaños y partes que el contrato ofrece.
- [ ] En cada fila, un solo control crece, con mínimo y máximo definidos.
- [ ] Cada acción vecina está clasificada como unida, contigua o de sección, con su motivo.
- [ ] Un solo tamaño de icono por fila, tomado de la escala del proyecto.
- [ ] Ninguna información esencial vive solo en una descripción emergente.
- [ ] Una densidad por sección, expresada con la variante del componente.
- [ ] Todo lo que la pieza no ofrece quedó como hueco para Kura.

## 10. Errores comunes

| Error | Por qué falla | Corrección |
|---|---|---|
| Estirar todos los campos al ancho del formulario | No anticipa el contenido; la fila pierde jerarquía | Solo el principal crece; los demás, por contenido o fijos |
| Botón de acción a la misma distancia que otra sección | Nadie lo relaciona con su campo | Espacio de dentro de grupo, misma fila |
| Iconos de distinto tamaño en una barra | Parecen dos niveles de importancia | Un tamaño por fila |
| Agrandar un botón solo icono para que "se vea" | Compite con la acción principal | Mismo icono, área táctil mayor |
| Simular una variante con estilos locales | Rompe el sistema y nadie la mantiene | Hueco para Kura |
| Poner la regla en el marcador | Desaparece al escribir | Texto de ayuda visible |

## 11. Límites

Kompa decide cómo se acomoda la pieza en su contexto. No cambia la pieza ni crea variantes (eso es de Fruti Squad, vía Kura), no decide si algo se vuelve componente compartido (Kura), no cambia qué acciones existen ni su orden (Fluxa) y no redacta el contenido de ayudas o mensajes (Fluxa).

Elaborada para Nexa Squad a partir de las demás referencias de Kompa; se apoya en "Refactoring UI" (Adam Wathan y Steve Schoger) y en las heurísticas de Nielsen ya citadas en el squad.
