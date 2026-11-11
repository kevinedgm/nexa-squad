# Migrar código legacy con seguridad

Propósito: decidir CÓMO cambiar un módulo sin pruebas y migrar sus datos existentes sin perder información ni comportamiento del que otros dependen. Úsala para escribir el plan técnico de migración que luego sigue el constructor.

## Contenido

1. Por qué falla "editar y rezar"
2. El algoritmo de cambio en cinco pasos
3. Costuras: dónde separar sin reescribir
4. Pruebas de caracterización como red
5. Migración de datos existentes
6. Operaciones irreversibles al final
7. Checklist verificable
8. Ejemplo aterrizado: rutas del gestor de archivos
9. Errores comunes
10. Límites de esta referencia

## 1. Por qué falla "editar y rezar"

- **Legacy = código sin pruebas**, no código viejo. Sin pruebas no hay forma de saber si un cambio conservó el comportamiento; el cuidado sin retroalimentación es solo apostar más despacio.
- **Cubrir y modificar**: primero se fija el comportamiento actual con pruebas (una "prensa"), luego se cambia. Si algo se mueve sin querer, una prueba falla en local, no en producción.
- **Dos tipos de cambio, nunca juntos**:

| Tipo | Qué puede cambiar | Qué debe conservarse |
|------|-------------------|----------------------|
| De comportamiento (requisito nuevo, corrección) | Una conducta nombrada | Todo lo demás |
| De estructura (reorganizar, separar capas) | La forma del código | Todo el comportamiento |

Mecanismo: si un paso mezcla ambos y algo se rompe, no se sabe cuál lo rompió. Si van separados, la prueba que falla más el último paso es todo el diagnóstico.

## 2. El algoritmo de cambio en cinco pasos

| Paso | Pregunta que responde | Salida en el plan |
|------|----------------------|-------------------|
| 1. Puntos de cambio | ¿En qué líneas/archivos vive el cambio? | Lista concreta, no "el módulo" |
| 2. Puntos de prueba | ¿Dónde se puede observar el efecto? | Funciones, endpoints o consultas a vigilar |
| 3. Romper dependencias | ¿Qué impide ejecutar eso aislado? | Costura mínima por cada bloqueo |
| 4. Escribir caracterización | ¿Qué hace HOY ese código? | Casos fijados con su resultado observado |
| 5. Cambiar y reestructurar | ¿Qué se modifica, en qué orden? | Pasos separados: estructura / comportamiento |

- El punto de prueba casi nunca es el punto de cambio: se prueba donde el efecto sale (lo que devuelve un endpoint, la fila que queda en la tabla).
- **Punto de estrangulamiento**: un lugar por donde pasan muchos caminos (p. ej. la función que arma el listado de una carpeta). Pocas pruebas ahí cubren mucho.
- Las ediciones previas a tener pruebas son conservadoras y mecánicas: copiar firmas exactas, no reescribirlas; buscar todos los usos (búsqueda en el código) antes de mover algo.
- Sin tiempo para cubrir el área: **brotar** (escribir la lógica nueva en una función nueva, probada, llamada desde una sola línea del código viejo) o **envolver** (renombrar la función vieja y crear una nueva con el nombre original que agrega algo antes/después y la llama). Registra cada brote como deuda: la segunda vez que se toque ese lugar, se cubre.

## 3. Costuras: dónde separar sin reescribir

Una **costura** es un lugar donde se puede cambiar lo que hace el programa sin editar en ese lugar. Su **punto de habilitación** es donde se decide qué versión corre; debe ser alcanzable desde la prueba.

Dónde suelen morir las costuras en PHP legacy (principio, no receta de framework):

- Conexión a base abierta dentro de la función → recibirla como parámetro con valor por defecto que conserve la de producción.
- Lectura directa de `$_SESSION`, `$_POST`, `$_FILES` en medio de la lógica → leerlas en la entrada y pasar valores simples hacia adentro.
- Acceso directo al sistema de archivos (`move_uploaded_file`, `unlink`, `file_exists`) → concentrarlo en pocas funciones propias que una prueba pueda sustituir.
- Fecha y hora del sistema → una función propia que devuelva "ahora", sustituible.

Orden de preferencia: (1) usar una costura que ya existe, (2) agregar un parámetro con valor por defecto, (3) extraer una función envoltorio. Si para "probar" hubo que reescribir la lógica, ya no se está caracterizando el sistema real: retrocede y elige una costura más lejana.

## 4. Pruebas de caracterización como red

Documentan lo que el código **hace**, no lo que debería hacer. La conducta actual es la especificación de facto: reportes y usuarios pueden depender de ella.

Receta: (1) ejecutar el código con una entrada, (2) afirmar un valor absurdo, (3) leer el resultado real, (4) fijar ese valor, (5) repetir por cada rama que tocará el cambio. Detenerse cuando cada rama a modificar tiene su alarma.

- **Sin instalar nada**: si el proyecto no tiene herramienta de pruebas, basta un script que ejecute el caso e imprima el resultado, o una consulta SQL guardada con su salida esperada. La red vale por lo que fija, no por la herramienta.
- **Maestra dorada**: para salidas grandes (listado de carpeta en JSON, HTML de una tabla) se captura la salida completa una vez, se revisa línea por línea y se compara después. Normaliza lo volátil (fechas, IDs generados) o fallará por ruido.
- **Entradas que conviene probar**: carpeta vacía, nombre con acentos o espacios, archivo de 0 bytes, usuario de cada nivel de acceso (1 a 4), registro con columna nula, datos reales anonimizados.
- **Si encuentras un error**: fíjalo tal cual con un comentario, no lo corrijas en silencio. Si la corrección cambia una regla de negocio, va como pregunta al analista; si no, se corrige después como cambio de comportamiento separado.

## 5. Migración de datos existentes

Principio: ningún cambio de esquema o de datos se aplica sin saber **cuántos registros afecta, por caso**, y sin forma de comprobar que el resultado cuadra.

1. **Inventario por caso** (solo lectura): contar cuántas filas caen en cada situación con `COUNT(*) ... GROUP BY`. Incluye siempre los casos raros: nulos, duplicados, huérfanos, valores fuera de catálogo.
2. **Decidir qué pasa con cada caso**. Los casos que implican una regla de negocio (¿qué hacer con archivos sin carpeta?) se devuelven al analista; no se inventan.
3. **Respaldo verificable**: confirmar que existe un respaldo reciente de la base (y de archivos si se tocan) y que se sabe restaurar. Este rol lo exige como precondición; no lo configura (eso va al checklist de `docs/implementacion`).
4. **Expandir → migrar → contraer**: agregar la columna/tabla nueva junto a la vieja; copiar datos; cambiar el código para leer de la nueva; solo al final retirar la vieja. Cada paso se puede revertir por separado.
5. **Script idempotente**: correrlo dos veces deja el mismo resultado (p. ej. `WHERE nueva IS NULL`). Los volúmenes grandes, por lotes.
6. **Verificación**: conteo antes = conteo después por caso; muestra manual de registros; las pruebas de caracterización siguen en verde salvo los cambios declarados.
7. **Ensayo**: primero contra una copia de la base; registrar conteos reales en el plan.

Compatibilidad durante la transición: el código viejo debe seguir funcionando con el esquema expandido, y el nuevo debe tolerar datos aún no migrados.

## 6. Operaciones irreversibles al final

Son irreversibles: borrar columnas o tablas, borrar archivos físicos, sobrescribir valores sin copia, `NOT NULL` sobre datos sin limpiar. Reglas:

- Van en el último paso del plan, separadas, con su propio conteo y verificación previa.
- Solo después de un periodo de convivencia en que nada leyó lo viejo.
- Cada una indica en el plan: qué se pierde, qué respaldo lo cubre, quién confirma.

## 7. Checklist verificable

- [ ] Puntos de cambio listados a nivel de archivo/función.
- [ ] Puntos de prueba y de estrangulamiento identificados.
- [ ] Cada rama a modificar tiene una caracterización con valor observado.
- [ ] Ningún paso mezcla estructura y comportamiento.
- [ ] Inventario de datos con conteo por caso, incluidos nulos y huérfanos.
- [ ] Casos que son regla de negocio enviados al analista, no resueltos aquí.
- [ ] Respaldo confirmado como precondición (sin configurar entorno).
- [ ] Script idempotente, ensayado en copia, con conteos antes/después.
- [ ] Operaciones irreversibles al final, cada una con su verificación.
- [ ] El plan separa hechos (contados), supuestos y preguntas.

## 8. Ejemplo hipotético: cambiar rutas absolutas por relativas

Ejemplo hipotético: los nombres (`tabla_x`, `columna_ruta`) y las cifras (A, B, C, D) son inventados para enseñar la forma. No describen el esquema ni los datos de ningún proyecto. En un plan real, cada cifra sale de una consulta ejecutada y cada nombre, del esquema leído.

Situación: `tabla_x.columna_ruta` guarda rutas absolutas de un servidor anterior y se quiere guardar rutas relativas a un directorio base.

- **Cómo se escribe un hecho**: "A filas con ruta absoluta. Evidencia: consulta de inventario guardada en `docs/…/inventario.sql`, ejecutada el día D sobre una copia de la base". Sin evidencia, no es hecho.
- **Inventario por caso** (forma, no cifras): A absolutas; B ya relativas; C con ruta nula; D rutas repetidas en más de una fila.
- **Supuesto**: todas las absolutas comparten el mismo prefijo. Para verificarlo, antes de migrar se cuenta cuántas filas hay por prefijo.
- **Preguntas al analista**: ¿las C filas sin ruta se muestran como "no disponible" o se retiran? ¿Las D filas repetidas son el mismo documento?
- **Plan**: (1) caracterizar el listado de una carpeta y la descarga para cada nivel de acceso; (2) agregar `columna_ruta_relativa`; (3) llenarla solo donde está nula y el prefijo coincide; (4) verificar que A + B queden convertidas y que C + D no se toquen; (5) leer `columna_ruta_relativa` y, si falta, usar la vieja; (6) al final, tras un periodo de convivencia, retirar la columna vieja.
- **No comprobado**: si los archivos físicos existen en disco. Si se trabaja en local solo con la base, no se puede afirmar, y así se marca en el plan.

## 9. Errores comunes

| Error | Por qué falla | Corrección |
|-------|---------------|------------|
| Reescribir el módulo completo | Se pierden años de casos borde | Cubrir y cambiar por partes |
| Escribir pruebas de "lo que debería hacer" | Fallan por todo y empujan a "arreglar" conductas de las que otros dependen | Caracterizar lo observado |
| `UPDATE` masivo sin conteo previo | No se sabe qué cambió ni si cuadra | Inventario por caso y conteo antes/después |
| Borrar la columna vieja en el mismo paso | No hay vuelta atrás si algo falla | Expandir, migrar, contraer |
| Afirmar "migración verificada" sin ensayo | Se declara comprobado lo que no lo está | Registrar conteos reales o marcar "no comprobado" |

## 10. Límites de esta referencia

- No decide qué debe pasar con los casos de negocio (lo decide el analista).
- No configura respaldos, servidores ni entorno: los exige como precondición y los anota en `docs/implementacion`.
- No exige instalar herramientas de pruebas; usa lo que el proyecto ya tiene.
- No define pantallas ni estilos de los mensajes de error o de avance.

Adaptado de wondelai/skills (working-with-legacy-code, basado en "Working Effectively with Legacy Code" de Michael C. Feathers; release-it, basado en "Release It!" de Michael T. Nygard; ddia-systems, basado en "Designing Data-Intensive Applications" de Martin Kleppmann), licencia MIT.
