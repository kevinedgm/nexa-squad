# Composición de formularios completos

Propósito: componer un formulario entero, no solo campo por campo: ancho del formulario, encabezado (título y subtítulo), secciones y cómo se separan, cuándo usar una superficie de contraste, filas a partir de las unidades de Kompa, cómo aparece una sección condicional y cómo se ven los indicadores. Complementa a `formularios-y-barras-de-acciones.md` (etiquetas, ancho por campo, botones) y a `componer-piezas-en-su-contexto.md` (cada pieza junto a sus vecinas).

## Contenido

1. Lo que recibes de Kompa
2. Ancho del formulario
3. Encabezado: título y subtítulo
4. Secciones: título, separación y superficie
5. Filas: de las unidades de Kompa a columnas
6. Secciones condicionales
7. Indicadores
8. Acciones y cierre
9. Ejemplo: registro de usuarios
10. Checklist verificable
11. Errores comunes
12. Límites

## 1. Lo que recibes de Kompa

Antes de componer, confirma que el documento de estructura trae: secciones en orden, campos por sección, **unidades** (fuertes o débiles), campos condicionales con su activador, página o pasos, acción principal y el contenido de ayudas, errores e indicadores (ver `estructura-de-formularios.md` de Kompa). Si falta algo, no lo decides tú: es devolución a Kompa.

## 2. Ancho del formulario

- Un formulario de captura no ocupa todo el ancho de una pantalla de escritorio. Mecanismo: con líneas muy largas el ojo pierde la columna de regreso y las etiquetas quedan lejos de las acciones.
- Usa el ancho máximo de contenedor de formulario del proyecto (token o clase del sistema). Si no existe, es hueco de token para Kompa; no inventes un valor.
- Alineado a la izquierda del área de contenido, como el resto de la vista, salvo que el sistema del proyecto centre los formularios de forma consistente (por ejemplo, pantallas de acceso).
- En teléfono ocupa el ancho del contenedor, con el margen lateral del sistema.

## 3. Encabezado: título y subtítulo

| Elemento | Nivel | Palancas | Regla |
|---|---|---|---|
| Título del formulario | Principal de la vista | Tamaño + peso + color principal (el único con las tres) | Dice la tarea: "Crear cuenta", no "Formulario de usuario" |
| Subtítulo | Secundario | Un paso menos de tamaño, peso normal, color secundario | Una línea: para qué sirve o qué se necesita ("Tarda 2 minutos") |
| Título de sección | Intermedio | Peso mayor que las etiquetas, tamaño menor que el título | Nunca compite con el título del formulario |

- Entre título y subtítulo: espacio "pegado". Entre el encabezado y la primera sección: espacio "entre grupos".
- Todos los tamaños y pesos salen de la escala tipográfica del proyecto (`.fruti/contracts/typography.yaml` o el sistema visual). Ver `jerarquia-y-espaciado.md`.

## 4. Secciones: título, separación y superficie

Orden de preferencia para separar secciones, de menos a más ruido: **espacio → título de sección → divisor → superficie (fondo o tarjeta)**.

| Situación | Separación |
|---|---|
| Formulario corto, 2 o 3 secciones de un solo tema | Espacio "entre grupos" + título de sección |
| Secciones largas o de temas muy distintos | Título de sección + divisor |
| Una sección opcional o condicional que debe leerse como aparte | Superficie de contraste sutil (fondo) |
| Una sección que se puede contraer, mover o que se repite (direcciones, contactos) | Tarjeta con borde |
| El formulario completo flota sobre un fondo de página con contenido | El formulario en una superficie; dentro, solo espacio y títulos |

Reglas:

- **Una sola capa de superficie.** Tarjeta dentro de tarjeta, dentro de fondo de contraste, se lee como ruido. Si el formulario ya va en una superficie, sus secciones se separan con espacio y títulos.
- La superficie de contraste usa el token de fondo secundario del sistema y respeta el contraste de los campos que contiene (sus bordes siguen distinguiéndose).
- Un título de sección lleva más espacio arriba que abajo, para pegarse a su contenido.

## 5. Filas: de las unidades de Kompa a columnas

- **Una columna por defecto.** Solo van en la misma fila los campos que Kompa declaró como unidad.
- **Unidad fuerte** (nombre + apellidos, fecha inicio + fin): en la misma fila en escritorio y tablet, si cada campo conserva su ancho mínimo usable. En teléfono se apilan en el mismo orden.
- **Unidad débil** (RFC + razón social): en la misma fila solo si los dos tienen ancho por contenido parecido y caben sin bajar de su mínimo; si no, cada uno en su fila.
- Dentro de la fila, cada campo toma su ancho por contenido (`formularios-y-barras-de-acciones.md`, sección 3). Si la unidad mezcla un dato corto y uno largo (lada + teléfono), el corto va por contenido y el largo crece.
- El espacio entre campos de una fila es el de "dentro de grupo"; el espacio entre filas, el de "relacionado". Ver `jerarquia-y-espaciado.md`.
- Las columnas de la fila se alinean con el borde izquierdo de los campos de una sola columna; nada se descuadra.

## 6. Secciones condicionales

- El **activador** (casilla o interruptor, según el sistema) va justo antes de lo que activa y con el mismo peso que un campo, no como texto de ayuda.
- Al activarse, los campos aparecen **debajo del activador, en su lugar**, sin mover lo que está arriba. Si la sección es larga o de otro tema, va en una superficie de contraste sutil para leerse como un bloque que pertenece al activador.
- La aparición no debe empujar al usuario fuera de su posición de lectura: el foco se queda en el activador y el primer campo nuevo queda visible.
- Al desactivar, la sección se oculta; lo que Kompa definió (conservar o descartar los datos) no cambia por la composición.
- En teléfono, igual: el bloque aparece debajo del activador, a ancho completo.

## 7. Indicadores

| Indicador | Composición |
|---|---|
| Obligatorio u opcional | Junto a la etiqueta, en la misma línea, en color secundario; texto ("opcional") o marca con leyenda al inicio del formulario. Nunca solo color |
| Progreso (pasos) | Encima del formulario, bajo el encabezado; dice el paso actual y el total; el paso actual destaca por peso, no solo por color |
| Ayuda del campo | Debajo del campo, nivel terciario; el error ocupa ese lugar para que nada salte |
| Requisitos visibles (contraseña) | Debajo del campo como lista corta; cada requisito cambia de estado con texto o icono además del color |
| Error de envío | Al inicio del formulario, con un resumen que lleva a los campos con error; cada campo muestra el suyo |
| En proceso | En la acción principal (estado de carga del botón); el resto del formulario no se mueve |

## 8. Acciones y cierre

- La acción principal va al final, alineada con el borde de los campos según la convención del proyecto, con tratamiento relleno. Cancelar o Regresar como secundaria o terciaria, en orden constante en el módulo.
- Lo que condiciona el envío (aceptar términos) va justo antes de las acciones, no lejos de ellas.
- En pasos: Regresar a la izquierda, Continuar a la derecha (o la convención del proyecto); el último paso cambia Continuar por la acción final con su verbo ("Crear cuenta").
- En teléfono, la acción principal a ancho completo; nunca cede.

## 9. Ejemplo: registro de usuarios

Ejemplo hipotético. Entrada de Kompa: tres secciones (Datos personales, Acceso a la cuenta, Facturación condicional), cierre con términos y "Crear cuenta"; unidades: Nombre + Apellidos (fuerte), RFC + Razón social (débil); opcionales marcados (minoría).

| Decisión | Resultado | Regla |
|---|---|---|
| Ancho | Contenedor de formulario del sistema, alineado a la izquierda | Sección 2 |
| Encabezado | "Crear cuenta" (principal: tamaño, peso y color); subtítulo "Tarda 2 minutos" (secundario) | Sección 3 |
| Separación de secciones | Espacio entre grupos + título de sección; sin divisores (formulario corto, un tema) | Sección 4 |
| Datos personales | Fila 1: Nombre(s) y Apellidos (unidad fuerte). Fila 2: Teléfono por contenido, con "opcional" junto a la etiqueta | Secciones 5 y 7 |
| Acceso | Correo por contenido (largo); Contraseña con "mostrar contraseña" unido al campo y requisitos debajo | Sección 7; `componer-piezas-en-su-contexto.md` |
| Facturación | Activador "Requiero factura" como campo; al activarse, bloque en superficie sutil debajo: RFC y Razón social en una fila si caben (unidad débil), Régimen fiscal y C. P. fiscal debajo | Secciones 4, 5 y 6 |
| Cierre | Términos justo antes de "Crear cuenta" (relleno, principal) | Sección 8 |

| Ancho | Cambios |
|---|---|
| Escritorio | Como la tabla anterior |
| Tablet | Igual; si RFC y Razón social bajan de su mínimo, cada uno en su fila |
| Teléfono | Una columna: Nombre(s), luego Apellidos; bloque de facturación a ancho completo; "Crear cuenta" a ancho completo |

## 10. Checklist verificable

- [ ] El formulario usa el ancho máximo del sistema (o hay hueco de token anotado).
- [ ] Solo el título tiene tamaño, peso y color principal; el subtítulo y los títulos de sección ceden.
- [ ] Las secciones se separan con lo mínimo necesario; no hay superficies anidadas.
- [ ] Solo van en fila los campos que Kompa declaró como unidad, y cada uno conserva su mínimo.
- [ ] Lo condicional aparece debajo de su activador sin mover lo de arriba.
- [ ] Ningún indicador depende solo del color.
- [ ] Lo que condiciona el envío está junto a la acción principal.

## 11. Errores comunes

| Error | Por qué falla | Corrección |
|---|---|---|
| Dos columnas para "llenar" el ancho | Orden de llenado ambiguo | Ancho máximo de formulario y una columna |
| Cada sección en su tarjeta, dentro de otra tarjeta | Ruido; nada destaca | Una capa de superficie |
| Subtítulo con el mismo peso que el título | Dos elementos compiten | Cambiar una o dos palancas |
| Facturación visible siempre, solo atenuada | Parece obligatoria | Condicional con activador |
| Asterisco rojo como única marca | Depende del color y no se explica | Texto "opcional" o marca con leyenda |

## 12. Límites

Kompa compone y redacta. No qué componente se usa para cada campo (Kompa) y no redacta ayudas ni errores (Kompa).

Se apoya en las demás referencias de Kompa ("Refactoring UI" de Adam Wathan y Steve Schoger) y en "Web Form Design" de Luke Wroblewski.
