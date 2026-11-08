# Pruebas que sirven

Propósito: que cada prueba que escriba el constructor detecte un cambio real de comportamiento: fijar lo que el código hace hoy, comprobar los criterios del requisito y comprobar los permisos donde de verdad se aplican (el servidor).

## Contenido

1. Qué hace útil a una prueba
2. Pruebas de caracterización: fijar lo observado
3. Pruebas de criterios Dado/Cuando/Entonces
4. Pruebas de permisos contra el servidor
5. Pruebas tautológicas: cómo reconocerlas
6. Sin infraestructura de pruebas: pruebas manuales reproducibles
7. Checklist antes de dar una fase por probada
8. Errores comunes
9. Límites del constructor

## 1. Qué hace útil a una prueba

Una prueba sirve si **falla cuando cambia la conducta que importa y solo entonces**, y si al fallar dice qué conducta se movió.

- Prueba contra comportamiento observable: lo que regresa una función, la respuesta del servidor, lo que queda en la base de datos, lo que ve el usuario.
- Valor esperado calculado a mano o tomado de lo observado, nunca recalculado con la misma lógica que se prueba.
- Un concepto por prueba (puede tener varias aserciones si todas verifican lo mismo).
- Rápida, independiente de las demás, repetible en cualquier momento, con resultado sí/no sin que alguien tenga que interpretar una salida.
- Nombre que dice escenario y resultado: `nivel 4 no puede descargar por petición directa`, no `prueba3`.
- Estructura en tres tiempos: preparar → ejecutar → comprobar, separados a la vista.

## 2. Pruebas de caracterización: fijar lo observado

Una prueba de caracterización dice "esto es lo que el código **hace**", no "lo que debería hacer". En legacy, la conducta actual es la especificación de facto: reportes, otros módulos y usuarios pueden depender de ella, rarezas incluidas.

Receta:

1. Llamar al código en el punto de prueba (función pública o petición al servidor).
2. Escribir una aserción que sabes que es falsa (por ejemplo, esperar `-1` archivos).
3. Ejecutar y leer el valor real en el mensaje de falla.
4. Cambiar la aserción al valor observado. El nombre de la prueba registra lo aprendido.
5. Repetir hasta cubrir cada rama que el cambio va a tocar. No más.

Elegir entradas:

- Empezar por el camino que se va a modificar: una prueba por rama.
- Probar fronteras: carpeta vacía, nombre con acentos o espacios, archivo de tamaño cero, el tamaño máximo permitido, nivel 1 y nivel 4.
- Usar datos reales anonimizados de la copia local cuando existan; encuentran ramas que el código no deja ver a simple vista.
- Para salidas grandes (un listado completo, un reporte): guardar la salida una vez como **referencia maestra**, revisarla línea por línea antes de aceptarla y comparar contra ella. Limpiar antes lo que cambia solo (fechas, identificadores generados).

Si lo observado parece un error: **fijarlo igual**, con un comentario `¿ERROR?`, y anotarlo en la sección devoluciones del registro de fase con el rol dueño de la regla. Corregirlo en silencio es meter un cambio de comportamiento sin revisión dentro de un paso que dice "sin cambio".

## 3. Pruebas de criterios Dado/Cuando/Entonces

El analista entrega cada requisito con criterios Dado/Cuando/Entonces. Cada criterio se vuelve, como mínimo, una prueba:

| Parte del criterio | En la prueba |
|--------------------|--------------|
| Dado | Preparación: datos, usuario y nivel, estado inicial |
| Cuando | Ejecución: la acción, una sola |
| Entonces | Comprobación: el resultado observable que dice el criterio, con sus palabras |

- Nombrar la prueba con el identificador del requisito o la regla: `REQ-07 ningún nivel ve el archivo retirado al buscar` (número de ejemplo).
- Agregar la contraparte que el criterio implica: si "el retirado no aparece para ningún nivel", probar también que un archivo vigente de la misma carpeta sí aparece; si "solo Administración retira", probar que Edición es rechazada.
- Probar el camino de error que el criterio nombre (por ejemplo, subir un archivo mayor al límite → mensaje y nada guardado).
- Si un criterio no se puede convertir en prueba porque falta un dato (qué pasa en la frontera exacta, qué mensaje se muestra), no se inventa: se devuelve al analista con la pregunta concreta.

## 4. Pruebas de permisos contra el servidor

Ocultar un botón no es un permiso. El permiso existe solo si el servidor rechaza la operación.

- Para cada acción con restricción de nivel (subir, actualizar, descargar, retirar), probar la **petición directa al servidor** con un usuario sin permiso, sin pasar por la interfaz.
- Comprobar las tres cosas: la respuesta es de rechazo, el dato no cambió y el rechazo no revela información (por ejemplo, que un archivo retirado existe).
- Probar ambos lados de cada frontera de nivel que defina el arquitecto: el último nivel que sí tiene permiso y el primero que ya no. En el gestor, nivel 1 es el más alto: retirar → nivel 1 permitido, nivel 2 rechazado; descargar → nivel 3 permitido, nivel 4 rechazado.
- Probar sin sesión y con sesión vencida.
- La matriz de quién puede qué la define el arquitecto; si la matriz no cubre una acción, se devuelve, no se supone.

## 5. Pruebas tautológicas: cómo reconocerlas

Una prueba tautológica repite la implementación en vez de fijar comportamiento: pasa con cualquier código que corra, falla solo cuando se edita la implementación y vuelve cada reacomodo una reescritura de pruebas. No aporta cobertura.

| Forma | Ejemplo | Qué hacer |
|-------|---------|-----------|
| El doble regresa lo que la prueba le ordenó | Simular el repositorio para que regrese 3 archivos y comprobar que hay 3 | Comprobar lo que el código hace con esos 3 (filtra, ordena, marca) |
| Recalcular el esperado con la misma expresión | `esperado = tamano / 1024` igual que en el código | Escribir el número calculado a mano: `2048` bytes → `2` |
| Comparar una constante consigo misma | `LIMITE_SUBIDA == LIMITE_SUBIDA` | Probar que un archivo de `LIMITE_SUBIDA + 1` se rechaza |
| Referencia maestra aceptada sin leer | Guardar la salida y aprobarla automáticamente | Revisarla antes de aceptarla; si nadie la leyó, no fija nada |
| Comprobar que se llamó a una función interna | "Se llamó a `armarConsulta`" | Comprobar el resultado que esa llamada produce |

Regla: una prueba tautológica se borra, no se arregla. Fijar un valor **observado** no es tautológico; fijar lo que el código recalcula al momento de comprobar, sí.

Simular (dobles) solo lo que impide ejecutar o observar: correo, red, reloj, almacenamiento externo. Simular todo amarra las pruebas a la implementación.

## 6. Sin infraestructura de pruebas: pruebas manuales reproducibles

Si el proyecto no tiene ejecutor de pruebas, el constructor no lo instala ni pide configurarlo: lo anota para el checklist de implementación y documenta pruebas manuales en la sección criterios probados del registro de fase `docs/construccion/<modulo>-fase-<n>.md` con este formato:

| Campo | Contenido |
|-------|-----------|
| Identificador | Requisito o regla que cubre (`REQ-07`, `BR-04`) y número consecutivo dentro de criterios probados de esa fase |
| Datos de partida | Qué registros y archivos existen en la copia local, con nombres exactos |
| Usuario | Nivel y cómo se obtiene la sesión |
| Pasos | Numerados, una acción por paso, incluida la petición directa al servidor si aplica |
| Resultado esperado | Observable y concreto: "el listado muestra 4 archivos; `informe-anual.pdf` no aparece" |
| Resultado obtenido y fecha | Lo que pasó, quién lo ejecutó, cuándo |
| Cómo se verificó | En pantalla, en respuesta del servidor o en base de datos |

- Otra persona debe poder repetirla sin preguntar nada. Si necesita preguntar, falta un dato.
- Se vuelven a ejecutar todas las de la zona tocada antes de cerrar cada fase, no solo las nuevas.
- Lo que no se pudo comprobar se escribe como **no comprobado**, nunca como aprobado.

## 7. Checklist antes de dar una fase por probada

- [ ] Las ramas tocadas tienen prueba de caracterización con valores observados.
- [ ] Cada criterio Dado/Cuando/Entonces de la fase tiene su prueba y su contraparte.
- [ ] Cada acción restringida se probó por petición directa al servidor, en ambos lados de la frontera de nivel.
- [ ] Ninguna prueba recalcula su esperado ni comprueba lo que un doble devolvió.
- [ ] Los errores observados quedaron fijados, comentados y en devoluciones con su rol dueño.
- [ ] Las pruebas manuales están en criterios probados del registro de fase con resultado, fecha y forma de verificación.

## 8. Errores comunes

| Error | Por qué falla | Corrección |
|-------|---------------|------------|
| Escribir pruebas de "debería" sobre código legacy | Fallan por diferencias con lo imaginado y tientan a "arreglar" conducta de la que algo depende | Caracterizar primero; devolver discrepancias |
| Probar permisos solo en la interfaz | El servidor acepta la petición directa | Petición directa con usuario sin permiso |
| Escribir las pruebas después del cambio, copiando lo que el código nuevo da | Fija cualquier cosa, incluido el error nuevo | Esperados del criterio o de lo observado antes del cambio |
| Probar solo el camino feliz | Los errores aparecen en fronteras y fallas | Una prueba por cada camino de error del criterio |

## 9. Límites del constructor

- No define criterios de aceptación ni la matriz de permisos; los prueba tal como están aprobados.
- No decide si una conducta observada es error: la fija y la devuelve al dueño.
- No instala herramientas de pruebas ni pide configuración de entorno.
- El veredicto final de si la fase pasa lo da el revisor; el constructor entrega la evidencia.

Adaptado de wondelai/skills (working-with-legacy-code, basado en "Working Effectively with Legacy Code" de Michael C. Feathers; clean-code, basado en "Clean Code" de Robert C. Martin), licencia MIT.
