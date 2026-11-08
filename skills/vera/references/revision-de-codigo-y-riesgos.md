# Revisión de código y riesgos

Propósito: revisar lo implementado por detrás de la pantalla: olores de código que sí cuestan, permisos probados contra el servidor, riesgos de estabilidad del tamaño de una app interna y consistencia de datos. El criterio para juzgar es el diseño técnico aprobado.

## Contenido

1. Qué revisar primero
2. Permisos probados contra el servidor
3. Consistencia de datos
4. Riesgos de estabilidad proporcionales
5. Olores de código que importan
6. Ejemplo: gestor de archivos
7. Error, sugerencia y dueño
8. Errores comunes
9. Límites del rol

## 1. Qué revisar primero

Orden por costo de equivocarse: un permiso brincado expone datos; un dato inconsistente se propaga; un riesgo de estabilidad tumba el módulo; un olor de código encarece el siguiente cambio. Revisa en ese orden y no gastes la revisión en estilo mientras quede un permiso sin probar.

## 2. Permisos probados contra el servidor

Mecanismo: ocultar un botón no impide la acción. Cualquier petición puede repetirse a mano con otro identificador, otro usuario o sin sesión. Solo cuenta lo que el servidor rechaza.

Los permisos del gestor son globales por nivel de usuario, no por carpeta: 1 · Administración (todo; único que crea y renombra carpetas y retira), 2 · Edición (sube, actualiza, corrige), 3 · Consulta y descarga, 4 · Consulta (sin descarga).

Por cada acción con permiso (consultar, descargar, subir, actualizar o corregir, crear o renombrar carpeta, retirar):

- [ ] Con un usuario de nivel insuficiente, la petición directa al servidor se rechaza, aunque la pantalla no muestre el botón (p. ej., nivel 2 retirando, nivel 3 subiendo, nivel 4 descargando).
- [ ] Sin sesión, se rechaza.
- [ ] Repitiendo la petición con el identificador de otro archivo o de uno retirado, el servidor aplica el mismo permiso global y no entrega lo retirado (acceso por identificador adivinado).
- [ ] La búsqueda y los listados no devuelven ni cuentan lo retirado.
- [ ] Descargas y vistas previas validan el permiso en cada petición, no solo al listar; nivel 4 no descarga ni con el enlace directo.
- [ ] El rechazo devuelve un error que la pantalla convierte en mensaje claro, sin revelar que el recurso existe si el diseño técnico así lo define.
- [ ] Cada regla coincide con la matriz de permisos del diseño técnico; si la matriz no cubre el caso, es hueco de especificación para arquitecto (Arko).

Marca de verificación: "comprobado en pantalla" no aplica a permisos. Vale "comprobado contra servidor" (petición hecha y respuesta anotada) o "comprobado en código" (archivo y línea donde se valida). Si solo viste que el botón no aparece, el permiso está **no comprobado**.

Gravedad: un permiso que el servidor no aplica es **bloqueante**, aunque la pantalla lo oculte bien.

## 3. Consistencia de datos

| Revisa | Pasa si… | Falla típica |
|---|---|---|
| Operaciones de varios pasos | Subir con metadatos, actualizar o retirar quedan completas o no quedan; no hay estados a medias | El registro en base de datos existe pero el archivo físico no, o al revés |
| Doble envío | Enviar dos veces (doble clic, recarga, reintento) no duplica | Dos registros del mismo archivo subido |
| Retirar | Lo retirado deja de verse para todos (listados, búsqueda, enlaces directos) y sus archivos pasan a la carpeta "por eliminar"; nada se borra en ese momento (recuperar y borrar son manuales) | Retirado pero sigue saliendo en búsqueda, o se borra físicamente al retirar |
| Bordes | Vacíos, un solo elemento, nombres con acentos, ñ y espacios, nombres repetidos, archivos de tamaño límite, carpetas profundas | Nombre con acento se guarda mal o rompe la descarga |
| Concurrencia previsible | Dos usuarios sobre la misma carpeta no se pisan sin aviso | El segundo guardado borra el cambio del primero en silencio |
| Migración | Los datos migrados del sistema anterior cumplen las mismas reglas que los nuevos | Archivos retirados en el sistema anterior vuelven a verse tras migrar |

## 4. Riesgos de estabilidad proporcionales

Una app interna de laboratorio no necesita la defensa de un sistema de millones de usuarios; necesita que nada de lo que construyó pueda colgarse, crecer sin límite o multiplicarse. Revisa solo estos:

| Riesgo | Mecanismo | Comprobación |
|---|---|---|
| Resultados sin límite | Con 30 archivos de prueba todo es rápido; con años de documentos, una consulta sin límite agota memoria o tiempo | Toda lista y búsqueda tiene paginación o tope en el servidor, aunque la pantalla no lo pida |
| Respuestas lentas sin aviso | Lento es peor que caído: el usuario recarga y multiplica la carga | Operaciones largas (subida grande, búsqueda en contenido) muestran avance y tienen límite de tiempo definido |
| Puntos de integración | Cada llamada a otro servicio (almacenamiento, correo, otro módulo) puede no responder | Hay límite de espera explícito y un error manejado; si falla, el resto del módulo sigue funcionando |
| Reintentos que multiplican | Reintentos o recargas repiten una escritura | Las escrituras toleran repetirse o se bloquean mientras están en curso |
| Tareas programadas | Una tarea lenta se encima con la siguiente ejecución | No pueden correr dos a la vez sobre los mismos datos |

Si el diseño técnico no fija un límite (tamaño de página, tiempo de espera, tamaño máximo de archivo), el hallazgo es hueco de especificación para arquitecto (Arko), no para el constructor. La configuración del servidor no se revisa aquí: va al checklist de implementación.

## 5. Olores de código que importan

Un olor no es un error: el código funciona. Se reporta cuando encarece cambios previsibles o esconde un error. En código que casi no cambiará, casi siempre es sugerencia.

| Olor | Por qué importa aquí | Gravedad típica |
|---|---|---|
| Validación duplicada en varias vistas | Al cambiar una regla de permiso, una copia se queda vieja y abre un hueco | Importante si es de permisos; si no, menor |
| Seguridades apagadas | Errores silenciados, avisos suprimidos, pruebas desactivadas esconden fallas reales | Importante |
| Bordes sin manejar | Vacío, un elemento, máximo, caracteres especiales: ahí se juntan los errores | Según el impacto observado |
| Niveles de abstracción mezclados | Consulta SQL, reglas de negocio y HTML en la misma función: imposible probar el permiso aislado | Menor, importante si impide verificar permisos |
| Números mágicos | `if ($nivel <= 2)` repetido sin nombre (¿es "puede subir"?): nadie sabe qué regla es | Menor |
| Código muerto o comentado | Confunde sobre qué está activo | Menor |
| Comportamiento sorpresa | Una función que hace más (o menos) de lo que dice su nombre | Según el impacto |
| Nombres ambiguos | `procesar()`, `datos2` obligan a leer todo para entender | Menor |
| Comentarios obsoletos | Mienten sobre lo que hace el código | Menor |

## 6. Ejemplo: gestor de archivos

| ID | Hallazgo | Tipo | Gravedad | Dueño | Verificación |
|---|---|---|---|---|---|
| R-12 | Un usuario nivel 4 · Consulta descarga un archivo pegando la URL de descarga directa | implementación | bloqueante | constructor | contra servidor |
| R-13 | La búsqueda cuenta en el total archivos retirados | implementación | importante | constructor | contra servidor |
| R-14 | El listado de carpeta no tiene tope; el diseño técnico no define tamaño de página | hueco de especificación | importante | arquitecto (Arko) | código |
| R-15 | Doble clic en "Subir" crea dos registros del mismo archivo | implementación | importante | constructor | pantalla |
| R-16 | La regla "nivel 1 o 2 puede subir" está escrita en cuatro archivos | técnico | menor | constructor | código |
| R-17 | Archivos retirados en el sistema anterior vuelven a verse tras migrar; el plan de migración no lo cubre | hueco de especificación | bloqueante | arquitecto (Arko) | contra servidor |

## 7. Error, sugerencia y dueño

- Contradice el diseño técnico o un requisito → error de implementación, dueño constructor.
- El diseño técnico no cubre el caso → hueco de especificación, dueño arquitecto (Arko).
- El diseño técnico aprobado provoca el riesgo → técnico, dueño arquitecto (Arko).
- La regla de negocio es ambigua (si "actualizar" conserva la versión anterior o la reemplaza) → requisito, dueño analista (Inqa).
- Un olor que no contradice nada → sugerencia para el constructor.

## 8. Errores comunes

- Dar por bueno un permiso porque el botón no aparece.
- Probar solo con el usuario administrador.
- Revisar con pocos datos y no ver resultados sin límite.
- Pedir circuitos, colas y balanceo para una app interna: desproporcionado.
- Reportar estilo de código como bloqueante.

## 9. Límites del rol

El revisor no corrige el código, no reescribe consultas ni propone otra arquitectura. Describe la falla, cita lo que exige el documento y la regresa a su dueño.

Adaptado de wondelai/skills (clean-code, basado en "Clean Code" de Robert C. Martin; release-it, basado en "Release It!" de Michael T. Nygard), licencia MIT.
