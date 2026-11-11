# Integridad de datos

Propósito: decidir cómo se protegen los datos del módulo cuando una operación toca varias filas, varias tablas o un archivo físico más su registro. Úsala al diseñar escrituras, retiros, cascadas y restricciones en una base relacional pequeña.

## Contenido

1. Transacciones: todo o nada
2. Concurrencia que sí importa en una app interna
3. Estados en lugar de borrar
4. Operaciones en cascada
5. Unicidad y restricciones en la base
6. Archivos físicos vs filas
7. Límites de crecimiento
8. Checklist verificable
9. Ejemplo aterrizado: retirar una carpeta con su contenido
10. Errores comunes
11. Límites de esta referencia

## 1. Transacciones: todo o nada

- **Atomicidad**: si una operación hace cinco escrituras y falla en la tercera, se deshacen las dos primeras. Nunca queda a medias.
- **Consistencia**: es responsabilidad de la aplicación. La base ayuda con llaves foráneas, `UNIQUE` y `CHECK`, pero las reglas de negocio las sostiene el código.
- **Durabilidad**: lo confirmado sobrevive a un reinicio; no sobrevive a un borrado accidental sin respaldo.

Regla: toda operación de negocio que escribe en más de una fila o tabla va en **una transacción**, abierta y cerrada en el mismo punto del código (el caso de uso), no repartida entre funciones que no se conocen. Verifica que las tablas usen un motor transaccional (en MariaDB, InnoDB; MyISAM ignora transacciones en silencio): es un hecho que se comprueba consultando el esquema, no un supuesto.

Transacciones cortas: no abrir una transacción y luego esperar una subida de archivo, una llamada externa o una confirmación del usuario. Se prepara todo fuera y se escribe dentro.

## 2. Concurrencia que sí importa en una app interna

Con pocos usuarios simultáneos, la mayoría de anomalías teóricas no aparecen. Las que sí:

| Riesgo | Cómo aparece | Defensa proporcional |
|--------|--------------|----------------------|
| Doble envío | Clic doble en "Subir" o reenvío del formulario | Llave única + la operación tolera repetirse (idempotente) |
| Leer, decidir, escribir | Dos personas crean "Resultados 2026" a la vez; ambas vieron que no existía | `UNIQUE` en la base, no solo verificación previa en PHP |
| Mover mientras otro retira | Uno mueve un archivo a una carpeta que otro está retirando | Bloquear filas afectadas (`SELECT ... FOR UPDATE`) dentro de la transacción |

Mecanismo: una verificación en código ("¿ya existe?") y la escritura posterior dejan una ventana entre ambas. Una restricción en la base cierra esa ventana porque la verifica en el mismo acto de escribir.

## 3. Estados en lugar de borrar

Por defecto, retirar **no es borrar**: se cambia un estado y se registra quién y cuándo.

- Columna de estado con valores de un catálogo cerrado (p. ej. `activo`, `retirado`), no números mágicos ni dos banderas que se contradicen.
- Se guarda `retirado_por` y `retirado_en`. Es la evidencia mínima para auditar y para restaurar.
- Todas las consultas de listado y búsqueda filtran por estado. Comprobación: buscar en el código cada consulta a la tabla y confirmar el filtro.
- La restauración es la operación inversa y respeta la misma unicidad (¿qué pasa si ya existe otra carpeta con ese nombre?). Ese caso se plantea al analista.
- El borrado definitivo, si existe, es una operación aparte, explícita y con permiso propio. El periodo de retención es regla de negocio: lo define el analista.

## 4. Operaciones en cascada

Una cascada es una operación sobre un padre que alcanza a sus descendientes. Reglas:

1. **Definir el alcance antes de escribir**: listar y contar qué filas alcanza (subcarpetas a cualquier profundidad, archivos dentro). Ese conteo se muestra o registra; no es un detalle interno.
2. **Una sola transacción** para todo el alcance. Si falla una fila, no queda la mitad retirada.
3. **Marcar el origen**: los descendientes retirados por la cascada guardan una referencia a la operación que los retiró (p. ej. `retirado_con` = id de la carpeta raíz o de la operación). Así, restaurar la carpeta restaura solo lo que ella retiró, no lo que ya estaba retirado antes.
4. **No usar `ON DELETE CASCADE` como mecanismo de retiro**: borra físicamente, en silencio y sin rastro. Si existe en el esquema legacy, se documenta como hecho y se evalúa en el ADR.
5. **Árboles**: si las carpetas se relacionan con `padre_id`, recorrer descendientes requiere una consulta recursiva o un recorrido en código con límite de profundidad. Verificar que no haya ciclos (una carpeta que es su propio ancestro) con una consulta de inventario.

## 5. Unicidad y restricciones en la base

- Cada regla de unicidad que dicte el analista ("no puede haber dos carpetas con el mismo nombre dentro de la misma carpeta") se traduce en un índice `UNIQUE` sobre las columnas exactas (`padre_id`, `nombre`).
- Atención a la intercalación (collation): define si "Resultados" y "resultados" son iguales. Es una decisión técnica que debe coincidir con la regla de negocio; si no está clara, pregunta.
- Unicidad con estados: si una carpeta retirada no debe bloquear el nombre, la restricción debe contemplar el estado (p. ej. columna generada que vale nulo cuando está retirada). Se decide en el ADR.
- Llaves foráneas en las relaciones (archivo → carpeta, archivo → usuario que lo subió) para que no existan huérfanos nuevos.
- Antes de agregar una restricción a datos existentes, contar cuántas filas la violan hoy. Si hay violaciones, se limpian primero (es una migración, con su conteo).

## 6. Archivos físicos vs filas

El archivo en disco y su fila en la base son dos fuentes que **no comparten transacción**. La base puede deshacer; el disco no.

Orden que minimiza daños:

| Operación | Orden seguro | Por qué |
|-----------|--------------|---------|
| Subir | Guardar archivo con nombre temporal o único → insertar fila en transacción → si la fila falla, borrar el archivo | Un archivo sin fila es basura recuperable; una fila sin archivo es un enlace roto visible |
| Retirar | Solo cambiar estado en la fila; el archivo no se toca | Restaurar es posible |
| Borrar definitivo | Borrar la fila (o marcarla) → borrar archivo después | Si falla el borrado del archivo, queda huérfano detectable, no un registro que apunta a nada |
| Reemplazar | Guardar el nuevo con otro nombre → actualizar fila → retirar el viejo | Nunca sobrescribir en el mismo nombre |

- El nombre en disco no es el nombre que ve el usuario: se genera único (no depende de acentos, espacios ni del nombre original) y el nombre original se guarda en la fila.
- La fila guarda lo necesario para verificar: tamaño y, si es proporcional, un hash. Permite detectar archivos alterados o truncados.
- **Conciliación**: una consulta/rutina de solo lectura que lista filas sin archivo y archivos sin fila. Se ejecuta antes y después de cualquier migración. Mientras se trabaje en local solo con la base, el resultado del lado de disco se marca "no comprobado".

## 7. Límites de crecimiento

- Todo listado tiene tope y paginación: una carpeta con 20,000 archivos no se carga completa. El tamaño de página es dato del proyecto, no de esta referencia.
- Todo lo que crece (registros de bitácora, temporales de subida) necesita un mecanismo para limpiarse. La política de retención la define el analista; el mecanismo, este rol.

## 8. Checklist verificable

- [ ] Cada operación multi-fila está en una sola transacción, abierta y cerrada en el caso de uso.
- [ ] Motor transaccional confirmado en cada tabla tocada.
- [ ] Retirar cambia estado con quién y cuándo; ninguna consulta de listado olvida el filtro.
- [ ] Cascadas: alcance contado, una transacción, origen marcado para restaurar.
- [ ] Cada regla de unicidad del analista tiene su `UNIQUE`; violaciones actuales contadas.
- [ ] Llaves foráneas en las relaciones nuevas.
- [ ] Orden archivo/fila definido por operación; nunca se sobrescribe un archivo en el mismo nombre.
- [ ] Rutina de conciliación archivo↔fila definida.
- [ ] Listados con tope y paginación.

## 9. Ejemplo hipotético: retirar una carpeta con su contenido

Ejemplo hipotético: los nombres de columnas y las cifras (S, F, R) son genéricos; no describen el esquema ni los datos de ningún proyecto. La regla sí es la del analista del gestor de archivos: solo el nivel 1 puede retirar, y se le pide confirmación. Lo retirado deja de verse para todos. Sus archivos pasan a una carpeta "por eliminar". La recuperación y el borrado final son manuales.

Diseño técnico:

1. El servidor verifica que el usuario sea de nivel 1 y que la carpeta esté a su alcance. Nunca se confía en que el botón estaba oculto.
2. Consulta de alcance: S subcarpetas, F archivos activos y R que ya se habían retirado antes. El conteo se devuelve para la confirmación.
3. Transacción: bloquear la carpeta raíz y marcar como `retirado` la raíz, las subcarpetas y los archivos activos, con el origen del retiro (id de la raíz), el usuario y la fecha. Los R retirados antes no se tocan.
4. Verificación: filas afectadas = 1 + S + F. Si no cuadra, se deshace la transacción.
5. Envío a "por eliminar": si es una ubicación física, se aplica el orden de la sección 6 (copiar o mover, comprobar y actualizar la fila). Si es solo un estado, el disco no cambia. Esto se pregunta al analista; no se supone.
6. Recuperación manual: solo las filas cuyo origen sea esa raíz. Antes, se revisa si su nombre choca con otro en la carpeta padre.

Preguntas abiertas al analista: ¿"por eliminar" es una ubicación que alguien ve o solo un estado? ¿Se puede retirar mientras otra persona sube un archivo a esa carpeta?

## 10. Errores comunes

| Error | Por qué falla | Corrección |
|-------|---------------|------------|
| Validar unicidad solo en PHP | Dos peticiones simultáneas pasan la validación | `UNIQUE` en la base y capturar el error |
| Borrar filas para "retirar" | Sin rastro ni restauración | Estado + quién + cuándo |
| Restaurar todo lo retirado bajo la carpeta | Revive lo que se retiró antes por otra razón | Marcar origen de la cascada |
| Sobrescribir el archivo al reemplazar | Si falla a la mitad, se pierde el original | Nombre nuevo, luego actualizar fila |
| Transacción abierta durante la subida | Bloqueos largos y transacciones colgadas | Preparar fuera, escribir dentro |

## 11. Límites de esta referencia

- No decide reglas de negocio (quién puede retirar, retención, si los nombres distinguen mayúsculas): las recibe del analista o le pregunta.
- No define cómo se ve la confirmación ni el mensaje de conteo (Kompa).
- No configura almacenamiento, permisos de carpetas del sistema operativo ni respaldos: van al checklist de `docs/implementacion`.

Adaptado de wondelai/skills (ddia-systems, basado en "Designing Data-Intensive Applications" de Martin Kleppmann; release-it, basado en "Release It!" de Michael T. Nygard; clean-architecture, basado en "Clean Architecture" de Robert C. Martin), licencia MIT.
