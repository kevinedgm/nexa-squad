# Formularios y barras de acciones

Propósito: componer formularios (alinear campos, agrupar, dar ancho a cada campo) y barras de acciones (qué botón lleva texto, cuál va como icono, qué cede al faltar espacio y qué nunca cede). Parte de lo que entregó estructura: campos, grupos, acciones y su prioridad.

## Contenido

1. Etiquetas y valores
2. Agrupación y orden visual de un formulario
3. Ancho de cada campo según su contenido
4. Columnas: cuándo sí y cuándo no
5. Acciones del formulario
6. Niveles de botón
7. Icono sin texto: cuándo sí
8. Barras de herramientas y grupos de acciones
9. Qué cede al faltar espacio y qué nunca cede
10. Ejemplo: barra del gestor de archivos
11. Checklist verificable
12. Errores comunes
13. Límites del rol

## 1. Etiquetas y valores

- **Etiqueta siempre visible**. El texto de ejemplo dentro del campo (placeholder) no es etiqueta: desaparece al escribir y el usuario pierde qué estaba llenando. El placeholder solo sirve para formato o ejemplo ("AAAA-MM-DD").
- **Etiqueta arriba del campo** por defecto. Mecanismo: el ojo baja en una sola línea vertical (etiqueta, campo, etiqueta, campo) y funciona igual en teléfono. Etiqueta a la izquierda solo en escritorio y en formularios densos de captura repetida, si el sistema del proyecto ya lo usa.
- Etiqueta pegada a su campo (espacio "pegado"); el siguiente par, a distancia "relacionado". Si la etiqueta queda equidistante de dos campos, la agrupación falla.
- En vistas de solo lectura (detalle de un archivo): **etiqueta en nivel secundario, valor en principal**. El usuario viene por el valor.
- Obligatorio u opcional: marcar el caso minoritario (si casi todo es obligatorio, marcar "opcional") de forma consistente en todo el módulo. La marca no depende solo del color.
- Texto de ayuda debajo del campo, en nivel terciario; el mensaje de error ocupa ese mismo lugar para que el campo no salte.

## 2. Agrupación y orden visual de un formulario

- Los grupos los define estructura; el compositor los hace visibles: encabezado de grupo en nivel secundario o principal chico, más espacio arriba del encabezado que abajo, y espacio "entre grupos" mayor que el de "relacionado".
- Delimitar con borde o tarjeta solo si el grupo se comporta como unidad (se colapsa, se repite, se habilita junto). Si no, basta el espacio.
- Un grupo de casillas o radios va con su propia etiqueta de grupo y opciones alineadas a la izquierda, una por línea si son más de tres o si su texto es largo.
- Todos los campos comparten el mismo borde izquierdo. Campos sueltos que "flotan" a otra alineación se leen como otro formulario.

## 3. Ancho de cada campo según su contenido

- Mecanismo: el ancho del campo anticipa cuánto se espera escribir. Un campo para 5 caracteres a todo lo ancho sugiere que falta algo; uno corto para un texto largo obliga a desplazar dentro del campo.
- Usar los tokens o clases de ancho del proyecto (por ejemplo, corto, medio, largo, completo). Los valores de Refactoring UI son solo orientación: código postal unos 100 px, teléfono o ciudad unos 200 px, correo unos 400 px o completo, dirección completa.

| Contenido esperado | Ancho relativo |
|---|---|
| Códigos, números cortos, nivel de acceso (1-4) | Corto |
| Fechas, teléfono, selector de pocas opciones | Medio |
| Nombre de archivo o carpeta, correo | Largo |
| Descripción, notas, ruta | Completo dentro del ancho máximo del formulario |

- En teléfono todos los campos pasan a ancho completo del contenedor; el ancho relativo es una decisión de pantallas medianas y grandes.

## 4. Columnas: cuándo sí y cuándo no

- **Una columna por defecto.** Mecanismo: una sola línea de lectura no deja dudas sobre el orden de llenado; con dos columnas el ojo duda entre ir abajo o al lado.
- **Dos campos en la misma fila solo si están relacionados** y se leen como unidad: fecha inicio y fecha fin, nombre y apellido, ciudad y estado.
- Nunca columnas para "aprovechar espacio" con campos no relacionados.
- El orden de tabulación sigue el orden visual: izquierda a derecha y luego abajo.
- En teléfono, los pares se apilan en el mismo orden.

## 5. Acciones del formulario

- Al final del formulario, alineadas con el borde de los campos según la convención del proyecto (no se inventa otra).
- Una sola acción principal (Guardar, Subir) con tratamiento relleno; Cancelar como secundaria o terciaria. Orden constante en todo el módulo.
- En diálogos cortos (confirmar retiro de un archivo) la acción que confirma va al final de la lectura; la que cancela, antes.
- Botón deshabilitado sin explicación no basta: si falta algo para poder guardar, el formulario lo dice junto al campo.

## 6. Niveles de botón

| Nivel | Tratamiento | Cuántos | Uso |
|---|---|---|---|
| Principal | Relleno, mayor contraste (token de acción principal) | Uno por vista o por región independiente (diálogo, panel) | La acción que estructura marcó como principal |
| Secundario | Contorno o relleno atenuado | Pocos | Acciones frecuentes que no son la principal |
| Terciario | Solo texto o solo icono | Los demás | Cancelar, acciones de baja frecuencia, acciones por fila |
| Destructivo | Discreto en el disparador (texto o icono con token de peligro); relleno de peligro solo en la confirmación | Según estructura | Retirar, eliminar |

- Mecanismo: el nivel visual comunica prioridad. Dos botones rellenos en la misma región obligan al usuario a decidir cuál importa.
- El nivel lo dicta la prioridad que asignó estructura, no el gusto. Si no hay prioridad asignada, se devuelve la pregunta; no se adivina.

## 7. Icono sin texto: cuándo sí

Un botón va solo con icono únicamente si se cumplen **todas**:

1. El icono es reconocible sin aprendizaje (lupa, cerrar, más opciones con tres puntos, descargar, lápiz de editar) o el contexto lo aclara (columna de acciones de una tabla).
2. No es la acción principal de la vista.
3. Tiene nombre accesible y, en dispositivos con puntero, una descripción emergente con el mismo texto.
4. Su área táctil cumple el mínimo del proyecto (44 px como mínimo de referencia), aunque el dibujo sea más chico.

- Si dos iconos de la misma barra se parecen (subir y nueva carpeta suelen dibujarse con flecha y carpeta con "+"), el texto se queda o ambos pasan a un menú con texto.
- En teléfono no hay descripción emergente: un icono ambiguo no puede depender de ella.
- No agregar icono a botones con texto claro solo por decorar.

## 8. Barras de herramientas y grupos de acciones

- Orden interno de la barra: **búsqueda y filtros** (cómo encuentro), luego **acciones de gestión** (qué creo o cambio), luego **ajustes de vista** (orden, cuadrícula o lista). Si estructura definió otro orden, manda estructura.
- Cada grupo se separa con espacio "entre grupos"; los botones dentro del grupo, con espacio "relacionado". Un divisor vertical solo si el espacio no alcanza a separar.
- Las acciones masivas aparecen en la barra cuando hay selección, con el conteo visible ("3 seleccionados") y sustituyen o empujan a las de gestión; no se mezclan con ellas.
- Las acciones por registro van en la fila, en la misma posición en todas las filas; si son más de dos, las de baja frecuencia van a un menú de más opciones.
- Altura uniforme: campo de búsqueda, botones y selectores de la barra comparten el token de altura de control.

## 9. Qué cede al faltar espacio y qué nunca cede

Orden en que ceden los elementos, del primero al último:

| Paso | Qué cede | Cómo |
|---|---|---|
| 1 | Texto auxiliar (contadores, "Mostrando 1-20 de 340") | Se mueve al pie o se oculta si ya está en otro lugar |
| 2 | Ajustes de vista y acciones de baja frecuencia | Pasan a un menú de más opciones, con texto |
| 3 | Texto de botones secundarios con icono inequívoco | Quedan como icono, con nombre accesible |
| 4 | Agrupación horizontal | La barra se parte en dos filas: búsqueda a ancho completo arriba, acciones abajo |
| 5 | Grupo de gestión completo | Un solo botón "+" o "Nuevo" que abre menú con texto (Subir archivo, Nueva carpeta) |

Lo que **nunca cede**:

- La acción principal: visible, en su nivel y sin esconderse en un menú.
- El estado de selección y el conteo en acciones masivas.
- Etiquetas de campos, mensajes de error y la confirmación de acciones destructivas con su texto completo.
- El área táctil mínima y el foco visible.
- Una acción que el usuario necesita en ese momento del flujo no queda detrás de dos niveles de menú.

## 10. Ejemplo: barra del gestor de archivos

Hechos de estructura: acción principal de la vista = buscar; grupo de gestión = subir archivo y nueva carpeta; retirar es acción por registro con confirmación. Supuesto: el grupo de gestión solo existe para niveles de acceso con permiso de escritura (lo decide quien define permisos, no el compositor).

| Ancho | Composición |
|---|---|
| Escritorio | Búsqueda a la izquierda, el control más ancho de la barra. Grupo de gestión a la derecha: "Subir archivo" y "Nueva carpeta" como secundarios con texto e icono. Ajustes de vista al final, solo icono. Ningún botón relleno compite con la búsqueda. |
| Tablet | Igual, pero ajustes de vista pasan al menú de más opciones (paso 2). |
| Teléfono | Fila 1: búsqueda a ancho completo. Fila 2: botón "Nuevo" que abre menú con "Subir archivo" y "Nueva carpeta" (paso 5), más el menú de más opciones. |

- Si el usuario no tiene permiso de escritura, el grupo de gestión desaparece y la búsqueda no cambia de lugar ni deja hueco.
- Retirar: en la fila, terciario con icono y token de peligro; en la confirmación, botón relleno de peligro con el verbo exacto ("Retirar archivo") y Cancelar antes de él.

## 11. Checklist verificable

- [ ] Cada campo tiene etiqueta visible; ningún placeholder hace de etiqueta.
- [ ] Cada etiqueta está más cerca de su campo que del campo anterior.
- [ ] El ancho de cada campo corresponde a su contenido esperado (token del proyecto).
- [ ] Solo hay pares en fila cuando los campos están relacionados.
- [ ] Hay un solo botón principal por vista o región independiente.
- [ ] Cada botón solo icono cumple las cuatro condiciones del punto 7.
- [ ] Está escrito el orden de cesión para esta barra y qué nunca cede.
- [ ] Controles de la barra comparten altura (token).
- [ ] La acción destructiva tiene tratamiento discreto en el disparador y fuerte en la confirmación.

## 12. Errores comunes

| Error | Por qué falla | Corrección |
|---|---|---|
| Placeholder como etiqueta | Al escribir se pierde el contexto | Etiqueta visible arriba |
| Dos columnas de campos no relacionados | Orden de llenado ambiguo | Una columna |
| Todos los campos a ancho completo en escritorio | No anticipa el contenido | Ancho por contenido esperado |
| Varios botones rellenos | Nadie sabe cuál importa | Uno principal, demás secundarios o terciarios |
| Todo a iconos para "ahorrar espacio" | Se adivina la función | Aplicar las cuatro condiciones |
| Esconder la acción principal en un menú en teléfono | Se rompe el flujo principal | La principal nunca cede |
| Botón de retirar en rojo relleno en cada fila | Ruido y alarma constante | Discreto en fila, fuerte en confirmación |

## 13. Límites del rol

- No agrega, quita ni reordena campos o acciones, ni cambia cuál es la principal: eso es de estructura.
- No decide permisos ni qué niveles de acceso ven cada acción.
- No crea componentes compartidos (barra de herramientas genérica, menú "Nuevo"): si hace falta, lo anota para el curador de componentes.
- No redacta textos de botones o errores más allá de señalar que faltan o son ambiguos.

Adaptado de wondelai/skills (refactoring-ui, basado en "Refactoring UI" de Adam Wathan y Steve Schoger; ios-hig-design, basado en las "Human Interface Guidelines" de Apple), licencia MIT.
