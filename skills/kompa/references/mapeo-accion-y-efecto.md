# Mapeo entre acción y efecto

Propósito: decidir **dónde va cada acción respecto de lo que afecta**, para que la persona sepa sin leer qué cambia cuando la usa. Complementa a `componer-piezas-en-su-contexto.md` (vecinos de una pieza) y a `formularios-y-barras-de-acciones.md` (nivel de cada botón).

## Contenido

1. El mecanismo
2. Cuatro tipos de mapeo
3. Reglas de ubicación
4. Ejemplos
5. Prueba rápida
6. Errores comunes
7. Límites

## 1. El mecanismo

El mapeo es la relación entre un control y su efecto. Si la ubicación del control corresponde a la de lo que afecta, la relación se entiende sin instrucciones; si es arbitraria, la persona la memoriza o adivina, y adivinar mal es un error de diseño, no de la persona. Variable que lo produce: **distancia y orden** entre el control y su objeto. Cómo comprobarlo: tapa los textos de los botones y pregunta "¿a qué afecta este?"; si la respuesta no sale de su posición, el mapeo falla.

## 2. Cuatro tipos de mapeo

De más a menos fuerte. Usa el más fuerte que el componente permita.

| Tipo | Qué es | En interfaz |
|---|---|---|
| Directo | El control es el objeto | Editar en su lugar, arrastrar para reordenar |
| De proximidad | El control está junto a lo que afecta | Acciones al final de la fila; error bajo su campo; "Agregar medicamento" dentro de su diagnóstico |
| Secuencial | El orden de los controles sigue el orden de la tarea | Campos en el orden en que se dicta el dato; acción principal al final del recorrido de lectura |
| De convención | Aprendido y compartido | Cerrar arriba a la derecha en un diálogo; el peligro con texto y color de peligro |

## 3. Reglas de ubicación

| Acción | Va | Por qué |
|---|---|---|
| Afecta a un elemento de una colección | En la fila o bloque del elemento, al final | Proximidad: no hay duda de a cuál afecta |
| Afecta a una sección | En el encabezado de la sección o al final de ella | La sección es su objeto |
| Agrega a una colección | Al final de la colección, donde aparecerá lo nuevo | La persona ve dónde va a quedar |
| Afecta a la selección (varios elementos) | Barra que aparece sobre la colección al seleccionar, con el conteo | El objeto es la selección; el conteo lo hace visible |
| Afecta a toda la vista (guardar) | Al final del recorrido, una sola | Secuencial: se llega a ella después de todo |
| Explica un campo | Bajo el campo, en el lugar de la ayuda | Proximidad; el error ocupa el mismo lugar |
| Filtra un resultado | Sobre el resultado que filtra, no en otra región | La persona ve el efecto junto a la causa |

- Una barra global lejos del contenido solo se justifica si su efecto es global; si afecta a una parte, es un error de mapeo.
- Un activador (casilla "Requiero factura") va justo antes de lo que activa: el orden es la relación.
- Si dos acciones con efectos distintos quedan juntas (quitar diagnóstico y quitar medicamento), sepáralas por nivel o por región para que la proximidad no sugiera que afectan a lo mismo.

## 4. Ejemplos

**Diagnósticos con medicamentos.** "Quitar diagnóstico" en el encabezado del grupo; "Quitar" de cada medicamento al final de su fila; "Agregar medicamento" bajo el último medicamento del grupo. Cada acción está pegada a su objeto y en un nivel distinto.

**Tabla de cuentas con acciones masivas.** Sin selección, la barra muestra búsqueda y filtros sobre la tabla. Al seleccionar, aparece "3 seleccionadas · Desactivar · Exportar" en ese mismo lugar; las acciones de fila siguen al final de cada fila.

## 5. Prueba rápida

- [ ] Tapando el texto, la posición dice a qué afecta cada acción.
- [ ] Ninguna acción que afecta a una parte vive en una barra global.
- [ ] El orden de los controles sigue el orden de la tarea.
- [ ] Acciones vecinas con objetos distintos se distinguen por nivel o región.

## 6. Errores comunes

| Error | Por qué falla | Corrección |
|---|---|---|
| "Editar" y "Eliminar" en la barra superior para la fila seleccionada | Hay que recordar qué estaba seleccionado | Acciones en la fila, o barra de selección con conteo |
| "Agregar" arriba de una lista que crece hacia abajo | Lo nuevo aparece lejos de la acción | Agregar al final, donde aparece |
| Cancelar al final y Guardar antes | El recorrido de lectura termina en la acción equivocada | Principal al final, según la convención del proyecto |

## 7. Límites

Kompa decide qué acciones se muestran y dónde. Qué hacen, si cambia una regla de negocio, lo decide Inqa.

Adaptado de wondelai/skills (design-everyday-things, basado en "The Design of Everyday Things" de Don Norman), licencia MIT.
