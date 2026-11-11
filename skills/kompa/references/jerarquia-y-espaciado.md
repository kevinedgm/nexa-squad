# Jerarquía y espaciado

Propósito: decidir qué se ve primero en cada sección y cómo el espacio agrupa y separa, usando solo tokens del proyecto. Sirve para componer cualquier región que ya definió estructura (cabecera, barra, área de datos, pie, formulario).

## Contenido

1. Regla de valores: todo sale de tokens
2. Jerarquía con tres palancas
3. Pruebas de entrecerrar ojos y escala de grises
4. Proximidad: el espacio agrupa
5. ¿Divisor o basta el espacio?
6. Alineación
7. Anchos máximos de contenido
8. Checklist verificable
9. Ejemplo: vista "Archivos" del gestor
10. Errores comunes
11. Límites del rol

## 1. Regla de valores: todo sale de tokens

- Los números que da Refactoring UI (espaciado 4, 8, 16, 24, 32, 48, 64 px; texto de 12 a 36 px) vienen de la escala de Tailwind. Aquí solo ilustran el principio: **una escala cerrada donde cada paso se distingue a simple vista del anterior**.
- Los valores reales salen de los tokens del proyecto (espaciado, tipografía, color de texto, bordes, radios, sombras). Si la escala del proyecto se llama distinto, se usa tal cual.
- Mecanismo: con una escala cerrada, cada decisión es "¿paso chico o paso grande?", no "¿13 o 14 px?". Eso da consistencia sin depender del ojo de quien compone.
- Si falta un token para un caso, no se inventa un valor: se anota como **token faltante** para el pedido de componente.
- Comprobación: la propuesta no contiene valores literales (`13px`, `#777`, `margin: 22px`); cada medida y color nombra un token.

## 2. Jerarquía con tres palancas

Las palancas son **tamaño**, **peso** y **color** (contraste contra el fondo).

- Mecanismo: el ojo detecta diferencias, no valores absolutos. Si todo está enfatizado, nada destaca. Bajar lo secundario hace subir lo principal por contraste.
- **Combinar, no multiplicar**: entre dos niveles contiguos cambia una o dos palancas, nunca las tres. Las tres juntas se reservan para el único elemento más importante de la vista (normalmente su título).
- **Enfatizar atenuando**: antes de agrandar lo principal, prueba bajar lo secundario (color de texto secundario, un paso menos de tamaño). Agrandar todo lleva a una escalada sin fin.
- **Las etiquetas son secundarias**: etiquetas de campo, encabezados de columna y metadatos (fecha, tamaño, autor) apoyan al dato; se ven más débiles que él.
- **Color semántico no es peso visual**: rojo significa "peligro", no "importante". Una acción destructiva puede verse discreta en la barra y fuerte solo en su confirmación.
- Limitar los niveles de texto a tres, cada uno mapeado a tokens:

| Nivel | Para qué | Palancas típicas |
|---|---|---|
| Principal | Título de vista, nombre del archivo o carpeta, el dato | Tamaño o peso mayor, color de texto principal |
| Secundario | Etiquetas, metadatos, encabezados de columna | Mismo tamaño o un paso menor, color secundario |
| Terciario | Ayudas, contadores, marcas de tiempo | Un paso menor, color terciario sin bajar del contraste mínimo |

## 3. Pruebas de entrecerrar ojos y escala de grises

- **Entrecerrar ojos** (o desenfocar una captura): lo que debe verse primero se sigue viendo primero, y los grupos se leen como bloques separados. Mecanismo: el desenfoque quita el detalle y deja masa y contraste, que es justo lo que guía la primera mirada.
- **Escala de grises**: sin color, la jerarquía debe sobrevivir. Si desaparece, el color estaba haciendo el trabajo del tamaño, el peso o el espacio. Componer en grises primero; el color al final.
- Al reportar, decir sobre qué se hizo la prueba (pantalla renderizada, maqueta) o marcarla como "no comprobado". Nunca declararla hecha si no se hizo.

## 4. Proximidad: el espacio agrupa

- **Regla**: el espacio entre grupos es mayor que el espacio dentro del grupo; al menos un paso de la escala de diferencia, idealmente dos entre secciones.
- Mecanismo (proximidad de la Gestalt): el ojo junta lo que está cerca. Con espacios iguales en todos lados los grupos se disuelven y la vista "se siente amontonada" aunque tenga aire.
- Cuatro niveles de espacio, cada uno con su token:

| Nivel | Ejemplos |
|---|---|
| Pegado | Icono con su texto, etiqueta con su campo, mensaje de error con su campo |
| Relacionado | Campos del mismo grupo, botones del mismo grupo de acciones |
| Entre grupos | Grupo "Datos del archivo" contra grupo "Acceso" |
| Entre secciones | Cabecera de vista contra barra de herramientas contra área de datos |

- La etiqueta queda más cerca de su campo que del campo anterior. Un encabezado de sección lleva más espacio arriba que abajo, para pegarse a su contenido.
- Empezar con espacio de más y quitar; casi siempre falta espacio, no sobra.
- Densidad según uso: una vista de uso diario y repetitivo (como el gestor) admite filas más compactas, pero la diferencia entre "dentro" y "entre" grupos se conserva.

## 5. ¿Divisor o basta el espacio?

Orden de preferencia, de menos a más ruido: **espacio → cambio sutil de fondo → divisor → borde completo o tarjeta**. Cada línea añade algo que el ojo debe procesar.

| Situación | Tratamiento |
|---|---|
| Grupos distintos con espacio disponible | Basta el espacio |
| Filas densas que se parecen entre sí (tablas, listas largas) | Divisor sutil (token de borde) |
| Regiones fijas contiguas (barra fija sobre lista que se desplaza) | Divisor o cambio de fondo |
| Acción destructiva dentro de un menú | Divisor que la aísla del resto |
| Unidad que se selecciona o mueve junta, o superficie que debe delimitarse (tabla, tarjeta, campo) | Contenedor con borde o fondo propio |

- No sumar señales para la misma separación (espacio grande + divisor + tarjeta). Una basta.
- Delimitar sí es obligatorio en tarjetas, tablas e inputs: su borde o fondo debe distinguirse del fondo de la página.

## 6. Alineación

- **Izquierda por defecto** para texto, etiquetas, campos y encabezados. Mecanismo: un borde izquierdo fijo es el punto de regreso del ojo en cada línea; centrar mueve ese punto y hace más lento el escaneo.
- Centrar solo: estados vacíos, mensajes cortos aislados y diálogos de confirmación breves. Nunca formularios ni tablas.
- Números comparables (tamaño de archivo, cantidades) a la derecha, con cifras tabulares si el proyecto las tiene; el encabezado se alinea igual que su columna.
- Pocos ejes verticales: las regiones de una vista comparten borde izquierdo. Contar las líneas de alineación; menos es mejor.
- Iconos centrados verticalmente con la línea de texto y con el mismo hueco icono-texto en toda la vista.

## 7. Anchos máximos de contenido

- El ancho completo casi nunca es correcto para texto o formularios.
- Texto corrido: medida de 45 a 75 caracteres (unos 66 es lo ideal), expresada con el token de ancho de lectura o en unidades de carácter.
- Formularios: ancho máximo con token propio (Refactoring UI sugiere, como ejemplo, entre 300 y 500 px para formularios simples).
- Tablas y listas de datos pueden ocupar el ancho del área de datos porque se leen por columnas; la columna de texto largo (nombre de archivo) lleva su límite o truncado.
- Si el contenedor es más ancho que el contenido, el contenido se alinea a la izquierda dentro de su región; no se estira.

## 8. Checklist verificable

- [ ] Toda medida, color y peso nombra un token; los faltantes están anotados.
- [ ] Solo un elemento de la vista usa las tres palancas a la vez.
- [ ] Etiquetas, encabezados y metadatos se ven más débiles que los datos.
- [ ] Entrecerrando ojos: lo principal se ve primero y los grupos se separan (indicar sobre qué se probó).
- [ ] En escala de grises la jerarquía se mantiene.
- [ ] El espacio entre grupos es al menos un paso mayor que dentro del grupo.
- [ ] Los encabezados de sección están más cerca de su contenido que de lo anterior.
- [ ] Cada divisor responde a una situación de la tabla del punto 5.
- [ ] Las regiones comparten borde izquierdo; nada se centra fuera de los casos permitidos.
- [ ] Texto corrido y formularios tienen ancho máximo.

## 9. Ejemplo: vista "Archivos" del gestor

Hecho: el gestor permite buscar, abrir, subir, crear carpetas y retirar archivos con confirmación, con niveles de acceso 1 a 4. Supuesto para el ejemplo: estructura entregó cabecera (título y ruta de carpetas), barra de herramientas, lista de carpetas y archivos, y pie con paginación.

- Título de la vista: el único con tamaño + peso + color principal.
- Ruta de carpetas: tamaño y color secundarios; la carpeta actual sube a color principal (una sola palanca).
- Fila de archivo: el nombre es el dato principal; tipo, tamaño, fecha y quién lo subió van en color secundario. El tamaño se alinea a la derecha.
- Tipo de documento en la fila: es metadato, no compite con el nombre; si usa color, va acompañado de texto ("PDF").
- Espacios: cabecera a barra con espacio entre grupos; barra a lista con espacio entre secciones; filas separadas con divisor sutil (son densas y parecidas); icono pegado al nombre.
- Prueba: al entrecerrar ojos se distinguen tres bloques (cabecera, barra, lista) y el título domina.

## 10. Errores comunes

| Error | Por qué falla | Corrección |
|---|---|---|
| Todo en negrita o todo grande | Nada destaca si todo destaca | Atenuar lo secundario, reservar las tres palancas |
| Mismo espacio en todos lados | Los grupos se disuelven | Escalonar: pegado, relacionado, grupo, sección |
| Etiquetas tan fuertes como los datos | Compiten con lo que importa | Etiqueta en nivel secundario |
| Gris muy claro para "secundario" | Falla el contraste mínimo | Usar el token de texto secundario que pase contraste |
| Divisores y tarjetas en todo | Ruido que tapa el contenido | Probar primero solo con espacio |
| Formulario o tabla centrados | Borde izquierdo inestable | Alinear a la izquierda |
| Valores literales "porque se ven bien" | Rompen la escala y la consistencia | Usar token o reportarlo como faltante |

## 11. Límites del rol

- No cambia qué contenido hay ni su orden; eso lo entregó estructura.
- No decide cuál es la acción principal de la vista; solo le da el tratamiento visual que le corresponde.
- No crea tokens ni componentes compartidos: los huecos se anotan como pedido de componente.
- No define paleta ni identidad visual.

Adaptado de wondelai/skills (refactoring-ui, basado en "Refactoring UI" de Adam Wathan y Steve Schoger; web-typography, basado en "On Web Typography" de Jason Santa Maria), licencia MIT.
