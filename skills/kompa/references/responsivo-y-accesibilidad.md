# Responsivo y accesibilidad

Propósito: decidir cómo se comporta cada sección por ancho de pantalla y comprobar los mínimos de accesibilidad que dependen de la composición: tamaño táctil, contraste, tamaño de texto, interlineado, medida de línea y señales que no dependen del color.

## Contenido

1. Puntos de quiebre: los del proyecto, ajustados al contenido
2. Comportamiento por ancho
3. Puntos intermedios: dónde se rompe de verdad
4. Objetivos táctiles
5. Contraste
6. Tamaño mínimo de texto y zoom
7. Tipografía responsiva: interlineado y medida
8. No depender solo del color
9. Checklist verificable
10. Ejemplo: lista del gestor en tres anchos
11. Errores comunes
12. Límites del rol

## 1. Puntos de quiebre: los del proyecto, ajustados al contenido

- Los anchos de quiebre salen de los tokens o del sistema de rejilla del proyecto. Los valores que circulan (640, 768, 1024, 1280 px) son de Tailwind y solo son ejemplo.
- Mecanismo: un punto de quiebre sirve cuando coincide con el ancho donde **el contenido** deja de caber, no con un modelo de dispositivo. Por eso, además de los puntos del proyecto, se revisa el recorrido completo de anchos (punto 3).
- Diseñar desde el ancho chico hacia el grande: empezar apilado y agregar columnas cuando hay espacio obliga a decidir qué es esencial.
- Si una región cambia según su contenedor y no según la pantalla (un panel lateral que se abre), preferir el comportamiento por contenedor si el proyecto lo soporta; si no, anotarlo como necesidad como pedido de componente.

## 2. Comportamiento por ancho

Para cada sección, Kompa deja escrito qué pasa en cada rango. Plantilla:

| Rango | Patrón general |
|---|---|
| Escritorio | Regiones lado a lado (navegación, lista, detalle). Tablas con todas sus columnas. Barras con grupos completos y texto en botones. Anchos máximos activos en texto y formularios. |
| Tablet | Una región lateral pasa a superpuesta o colapsable. Columnas de baja prioridad de la tabla se ocultan o se integran en la fila. Ajustes de vista pasan a menú. |
| Teléfono | Una sola columna y navegación en pila (lista → detalle). Tablas se convierten en filas tipo tarjeta con el dato principal arriba. Campos a ancho completo. Barras en dos filas o con menú "Nuevo". Márgenes laterales con token de margen de pantalla. |

- Qué columnas se ocultan primero lo dicta la prioridad que entregó estructura; si no la entregó, se pregunta.
- Lo que nunca cede en ningún ancho: la acción principal, el dato principal de cada registro, los mensajes de error y la confirmación de acciones destructivas.
- Sin desplazamiento horizontal de página en ningún ancho. Una tabla puede desplazarse dentro de su contenedor solo si estructura definió que todas las columnas son necesarias, y con la primera columna fija.
- Se recuerda la selección y la posición al rotar o cambiar de ancho.

## 3. Puntos intermedios: dónde se rompe de verdad

- Revisar arrastrando el ancho de forma continua, no solo en los puntos de quiebre. Los fallos típicos aparecen justo antes de un quiebre: botones que se parten en dos líneas, búsqueda que se encoge hasta ser inútil, encabezados de columna montados.
- Criterio: si un elemento cambia de forma (se parte, se superpone, se encoge debajo de su ancho útil) antes del siguiente punto de quiebre, ese es un punto intermedio que necesita su propia regla de cesión.
- Anchos mínimos a probar como ejemplo: 320 px (exigido por WCAG para reflujo), un teléfono grande, tablet vertical, tablet horizontal, laptop chica y escritorio ancho.
- Registrar para cada sección el ancho más angosto en que se probó y si se probó en pantalla o solo se revisó el código.

## 4. Objetivos táctiles

- **Mínimo 44 × 44 px** de área activa para todo elemento interactivo en pantallas táctiles (criterio de Apple HIG y regla del squad; WCAG 2.2 AA pide 24 px, por eso 44 es el piso aquí).
- El área táctil puede ser mayor que el dibujo: un icono chico con relleno invisible cumple. Se mide el área activa, no el icono.
- Separación entre objetivos adyacentes para no tocar el vecino: usar el token de separación entre controles; las acciones destructivas no quedan pegadas a otras.
- Filas de lista tocables: la fila completa es el objetivo de "abrir"; las acciones de fila son objetivos aparte, cada uno de 44 px.
- Nada interactivo bajo zonas reservadas del dispositivo (muesca, barra de gestos) ni pegado al borde de la pantalla.

## 5. Contraste

Mínimos WCAG 2.1 AA:

| Contenido | Contraste mínimo |
|---|---|
| Texto normal | 4.5:1 |
| Texto grande (24 px normal o 18.7 px en negrita, aprox.) | 3:1 |
| Componentes de interfaz y gráficos (borde de campo, icono que es la única señal, anillo de foco) | 3:1 contra lo adyacente |

- El texto secundario y terciario también cumple 4.5:1. Mecanismo: "secundario" se logra con un paso de color o tamaño dentro del rango permitido, no con gris casi invisible.
- El borde de un campo de texto debe cumplir 3:1 contra el fondo, o el campo no se distingue como campo.
- Verificar con herramienta sobre los tokens reales, en tema claro y oscuro si el proyecto tiene ambos. Si los tokens del proyecto no cumplen, se reporta como token a corregir; no se inventa un color nuevo.

## 6. Tamaño mínimo de texto y zoom

- Texto de lectura y datos: el token base del proyecto, que no debería ser menor a 16 px de equivalente. En teléfono no se reduce: la gente sostiene el teléfono más lejos de lo que se cree.
- Texto auxiliar (metadatos, ayudas): un paso menor como máximo y siempre con contraste completo. HIG fija 11 pt como piso absoluto solo para leyendas.
- Tamaños en unidades relativas (las del sistema de tokens) para que el zoom del navegador y la preferencia de tamaño del usuario funcionen.
- La vista debe ser usable al 200 % de zoom: sin texto cortado, sin superposiciones, sin pérdida de acciones.
- Truncar con puntos suspensivos solo en celdas de ancho fijo y títulos de tarjeta, con el texto completo disponible (descripción emergente o en el detalle). Nunca truncar mensajes de error ni información necesaria para decidir.

## 7. Tipografía responsiva: interlineado y medida

- **Interlineado por contexto** (valores de referencia; usar los tokens del proyecto):

| Contexto | Interlineado de referencia |
|---|---|
| Títulos | 1.1 a 1.25 |
| Texto de interfaz, celdas, etiquetas | 1.3 a 1.4 |
| Texto corrido, descripciones largas | 1.5 a 1.7 |

- Mecanismo: con líneas más largas el ojo necesita más interlineado para no saltar a la línea equivocada al regresar; títulos cortos y grandes se ven sueltos con interlineado amplio.
- **Medida**: 45 a 75 caracteres por línea en texto corrido; en teléfono suele quedar entre 35 y 50, y está bien.
- Los títulos pueden escalar con el ancho (tamaño fluido acotado con mínimo y máximo) si el sistema del proyecto lo ofrece; si no, se usan los pasos de la escala en cada punto de quiebre. En teléfono la diferencia entre niveles de título se comprime; el texto base no baja.
- Margen interior de la vista con token: en teléfono, el texto nunca toca el borde de la pantalla.

## 8. No depender solo del color

Toda información que da el color se repite con otra señal: texto, icono, forma, posición o patrón.

| Caso | Color + señal adicional |
|---|---|
| Error de campo | Borde de error + icono + mensaje |
| Tipo de documento | Insignia con color + texto ("PDF", "Excel") |
| Estado de archivo (vigente, retirado) | Color + etiqueta de texto |
| Fila seleccionada | Fondo + casilla marcada |
| Enlace dentro de texto | Color + subrayado |
| Acción destructiva | Token de peligro + verbo explícito |

- Prueba: ver la sección en escala de grises o con un simulador de daltonismo; toda distinción debe seguir siendo legible.
- Iconos que son la única señal llevan nombre accesible; iconos decorativos junto a texto se ocultan para lectores de pantalla.

## 9. Checklist verificable

- [ ] Cada sección tiene escrito su comportamiento en escritorio, tablet y teléfono.
- [ ] Se recorrió el ancho de forma continua y se anotaron los puntos intermedios.
- [ ] Sin desplazamiento horizontal de página a 320 px.
- [ ] Todo objetivo táctil mide al menos 44 × 44 px de área activa.
- [ ] Texto 4.5:1, texto grande y componentes 3:1, medido sobre los tokens reales.
- [ ] Texto base no menor al token base en ningún ancho; usable al 200 % de zoom.
- [ ] Interlineado y medida corresponden al contexto.
- [ ] Ninguna información depende solo del color.
- [ ] Cada comprobación indica cómo se verificó (pantalla, código o no comprobado).

## 10. Ejemplo: lista del gestor en tres anchos

Hechos: la lista muestra carpetas y archivos; el dato principal es el nombre; abrir es la acción por defecto de la fila; retirar requiere confirmación. Supuesto: estructura priorizó columnas así: nombre, fecha, tamaño, nivel de acceso, quién subió.

| Ancho | Composición |
|---|---|
| Escritorio | Tabla con las cinco columnas; tamaño alineado a la derecha; acciones de fila al final, visibles sin hover. |
| Tablet | Se oculta "quién subió" (pasa al detalle); nivel de acceso queda como insignia junto al nombre. |
| Teléfono | Cada registro es una fila tipo tarjeta: nombre arriba (principal), debajo fecha y tamaño en secundario, insignia del tipo ("PDF") con texto. Fila completa de 44 px o más para abrir; menú de más opciones de 44 px con "Descargar" y "Retirar" al final, separado por divisor. |

## 11. Errores comunes

| Error | Por qué falla | Corrección |
|---|---|---|
| Probar solo en tres anchos fijos | Se rompe entre quiebres | Recorrer el ancho continuo |
| Acciones visibles solo con hover | No existen en táctil | Visibles o en menú tocable |
| Iconos de 24 px sin área extra | Toques fallidos | Área activa de 44 px |
| Reducir el texto en teléfono | Ilegible a distancia real | Mantener el token base |
| Gris claro "elegante" para secundarios | Falla 4.5:1 | Token secundario que cumpla |
| Nivel de acceso solo por color | Daltónicos no lo distinguen | Color + número o texto |
| Tabla completa con desplazamiento horizontal en teléfono | Se pierde el dato principal | Fila tipo tarjeta por prioridad |

## 12. Límites del rol

- No decide qué columnas o datos son prioritarios: usa la prioridad de estructura.
- No crea puntos de quiebre ni tokens nuevos; los faltantes se anotan como pedido de componente.
- No define la navegación entre vistas (lista → detalle); solo compone cada vista en cada ancho.
- No escribe el código responsivo; deja la regla verificable para el constructor.

Adaptado de wondelai/skills (refactoring-ui, basado en "Refactoring UI" de Adam Wathan y Steve Schoger; web-typography, basado en "On Web Typography" de Jason Santa Maria; ios-hig-design, basado en las "Human Interface Guidelines" de Apple), licencia MIT.
