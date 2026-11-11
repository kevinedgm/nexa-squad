# Estados visuales y retroalimentación

Propósito: dar tratamiento visual a cada estado que estructura definió (carga, vacío, error, deshabilitado, hover, foco, selección) y hacer que la respuesta del sistema sea proporcional a lo que pasó. Solo con tokens y componentes del proyecto.

## Contenido

1. Principio: toda acción responde, en proporción
2. Estados de interacción: hover, presionado, foco
3. Selección
4. Deshabilitado
5. Carga
6. Vacío
7. Error
8. Éxito y confirmación
9. Acciones destructivas
10. Checklist verificable
11. Ejemplo: retirar un archivo y subir varios
12. Errores comunes
13. Límites del rol

## 1. Principio: toda acción responde, en proporción

- La retroalimentación contesta "¿qué acaba de pasar?". Sin ella el usuario repite clics o abandona.
- **Regla de la mínima retroalimentación**: usar la menor señal que comunique el mensaje. Mecanismo: si todo avisa, el usuario aprende a ignorar los avisos y se pierde el que importa.

| Importancia del evento | Señal | Duración |
|---|---|---|
| Micro (hover, foco) | Cambio visual sutil | Mientras dura |
| Menor (marcar, alternar) | Cambio visual claro en el mismo control | Inmediato |
| Media (guardar, subir un archivo) | Cambio visual + texto de estado | Breve, sin bloquear |
| Mayor (retirar, acción en lote) | Confirmación previa y aviso posterior, con deshacer si existe | Hasta que el usuario lo vea o lo cierre |
| Crítica (fallo, error de permisos) | Mensaje visible y persistente con salida | Hasta que se atienda |

- Las duraciones de animación salen de los tokens de movimiento del proyecto; si existe preferencia de movimiento reducido, los cambios pasan a ser instantáneos.

## 2. Estados de interacción: hover, presionado, foco

- **Hover**: cambio sutil de fondo o de tono (token de hover). Solo en elementos que se pueden activar; en teléfono no existe, así que nada importante puede depender de él (por ejemplo, acciones de fila que solo aparecen al pasar el puntero).
- **Presionado**: más marcado que el hover; confirma que el clic o toque registró.
- **Foco visible**: obligatorio en todo elemento interactivo. Anillo o contorno con token de foco, con contraste de al menos 3:1 contra lo que lo rodea, y que no dependa solo de un cambio de color del fondo.
  - Nunca quitar el contorno de foco sin reemplazo.
  - Mostrar el foco de teclado aunque el diseño oculte el del clic (comportamiento tipo `focus-visible`).
  - El foco no se recorta por contenedores con desbordamiento oculto ni queda tapado por barras fijas.
- El orden de foco sigue el orden visual que dejó la composición.

## 3. Selección

- La fila o tarjeta seleccionada cambia de fondo (token de selección) **y** muestra una marca no cromática: casilla marcada, icono o borde lateral.
- La selección se distingue del hover y del foco; los tres pueden coincidir en el mismo elemento y deben seguir leyéndose.
- Con selección múltiple, el conteo se muestra en la barra de acciones masivas ("3 seleccionados") y hay una forma visible de quitar la selección.

## 4. Deshabilitado

- Se ve claramente inactivo (token de deshabilitado) pero el texto sigue siendo legible. WCAG exime de contraste a los controles inactivos, pero un botón ilegible no explica nada.
- Preferir **ocultar** lo que el usuario nunca podrá usar (por su nivel de acceso) y **deshabilitar** lo que podrá usar al cumplir una condición. Cuál aplica lo decide estructura; Kompa solo da el tratamiento.
- Un deshabilitado temporal dice por qué, cerca del control (texto de ayuda), no solo en una descripción emergente que no existe en teléfono.

## 5. Carga

Elegir indicador por duración esperada:

| Duración | Indicador |
|---|---|
| Menos de 0.3 s | Ninguno (un indicador parpadearía) |
| 0.3 a 1 s | Indicador en línea dentro del control que la disparó |
| 1 a 5 s | Esqueleto con la forma de la lista o indicador de la región |
| 5 a 30 s | Barra de progreso con avance real |
| Más de 30 s | Barra con porcentaje y tiempo estimado; permitir seguir trabajando |

- La carga ocupa el mismo espacio que el contenido final: el esqueleto replica filas y columnas para que nada salte al llegar los datos.
- El botón que inició la acción se deshabilita mientras carga y conserva su ancho (el texto no cambia el tamaño del botón).
- La carga se limita a la región afectada: buscar recarga la lista, no la cabecera ni la barra.
- Tiene un nombre accesible ("Cargando archivos").

## 6. Vacío

- Distinguir tres vacíos, porque piden cosas distintas:

| Vacío | Qué mostrar |
|---|---|
| Primera vez (carpeta sin archivos) | Qué va aquí y la acción para llenarlo ("Subir archivo"), si el nivel de acceso lo permite |
| Sin resultados (búsqueda o filtro) | Qué se buscó y cómo ampliar (limpiar filtros, revisar el término) |
| Sin permiso | Que el contenido existe pero no es visible para su nivel, sin parecer error |

- El vacío ocupa el área de datos, centrado en ella (uno de los pocos casos de centrado), con el tono de la vista: profesional en un sistema de laboratorio.
- La barra de herramientas sigue visible en el vacío: el usuario necesita la búsqueda o la acción para salir de él.

## 7. Error

- Tres capas, en este orden: **qué pasó** (una línea), **por qué**, **cómo resolverlo**. El detalle técnico, si existe, va desplegable.
- **Error de campo**: borde con token de error + icono + mensaje debajo del campo, en el lugar del texto de ayuda. Nunca solo el color del borde.
- **Error de envío**: resumen arriba del formulario y el foco va al primer campo con error.
- **Error de región** (no cargó la lista): mensaje dentro de la región con acción de reintentar; el resto de la vista sigue usable.
- Los errores críticos persisten hasta que se atienden; no desaparecen solos.
- Se anuncian a lectores de pantalla (región viva con prioridad alta); los éxitos, con prioridad normal.

## 8. Éxito y confirmación

- Éxito rutinario (guardar, crear carpeta): la señal más ligera que baste. Muchas veces el propio resultado basta: la carpeta nueva aparece en la lista, resaltada brevemente.
- Avisos temporales solo para acciones que el usuario podría querer deshacer o que ocurren fuera de su vista.
- Consolidar: subir 4 archivos produce un aviso ("4 archivos subidos"), no cuatro.
- No usar interfaz optimista (mostrar éxito antes de que el servidor confirme) en acciones irreversibles como retirar.

## 9. Acciones destructivas

- **Disparador discreto**: en la fila o menú, nivel terciario con token de peligro; dentro de un menú, al final y separado por divisor.
- **Confirmación con tratamiento propio**: diálogo que nombra el objeto ("¿Retirar 'informe-lote-224.pdf'?"), explica la consecuencia y usa el verbo exacto en el botón de confirmar, relleno de peligro. Cancelar va antes y en nivel secundario.
- El foco inicial del diálogo va a Cancelar o al diálogo, no al botón destructivo, para que un Enter accidental no confirme.
- Si existe deshacer, el aviso posterior lo ofrece; esto puede sustituir a la confirmación solo si estructura lo definió así.
- Retirar varios a la vez: la confirmación dice cuántos y, si son pocos, cuáles.

## 10. Checklist verificable

- [ ] Cada estado que definió estructura tiene tratamiento con token (no valores literales).
- [ ] El foco es visible en todos los elementos interactivos y no se recorta.
- [ ] Selección, error y estados de acceso no dependen solo del color.
- [ ] Nada esencial depende del hover.
- [ ] El indicador de carga corresponde a la duración y no provoca saltos de diseño.
- [ ] Los tres tipos de vacío están diferenciados.
- [ ] Cada error dice qué pasó, por qué y cómo resolverlo, junto a donde ocurrió.
- [ ] Las acciones destructivas son discretas al disparar y explícitas al confirmar.
- [ ] La intensidad de cada aviso es proporcional al evento.
- [ ] Indicar en el reporte cómo se verificó cada estado (pantalla, código o no comprobado).

## 11. Ejemplo: retirar un archivo y subir varios

- **Retirar**: icono terciario con token de peligro en la fila → diálogo con nombre del archivo, consecuencia y "Retirar archivo" relleno de peligro; Cancelar primero y con el foco → al confirmar, la fila desaparece y un aviso confirma; si falla, la fila sigue y aparece un error persistente con la razón (por ejemplo, la carpeta ya fue retirada por otra persona).
- **Subir varios**: el botón "Subir archivo" pasa a deshabilitado con indicador en línea; cada archivo muestra barra de progreso en la lista; al terminar, un solo aviso consolidado; los que fallaron quedan marcados con icono, texto de error y acción de reintentar.

## 12. Errores comunes

| Error | Por qué falla | Corrección |
|---|---|---|
| Quitar el contorno de foco | Usuarios de teclado se pierden | Foco visible con token |
| Error indicado solo con borde rojo | Invisible para daltónicos | Borde + icono + texto |
| Aviso para cada clic | El usuario deja de leer avisos | Retroalimentación proporcional |
| Indicador global para una carga local | Bloquea lo que sí funciona | Indicador en la región afectada |
| "No hay elementos" para todo vacío | No dice qué hacer | Diferenciar los tres vacíos |
| Confirmación genérica "¿Está seguro?" | No dice qué se pierde | Nombrar objeto y consecuencia |
| Botón destructivo con el foco inicial | Un Enter borra | Foco en Cancelar |

## 13. Límites del rol

- No inventa estados que estructura no definió; si falta uno evidente (por ejemplo, error de carga), lo señala como pregunta para estructura.
- No redacta el texto final de mensajes; marca qué partes faltan (qué, por qué, cómo).
- No decide si una acción lleva confirmación o deshacer: eso es de estructura o de producto.
- No crea componentes compartidos de aviso, esqueleto o diálogo: los pide como pedido de componente.

Adaptado de wondelai/skills (microinteractions, basado en "Microinteractions" de Dan Saffer; refactoring-ui, basado en "Refactoring UI" de Adam Wathan y Steve Schoger), licencia MIT.
