# Recorrido de punta a punta

Propósito: revisar cada tarea principal completa, como la haría el usuario, desde que entra hasta que confirma que terminó. Encuentra lo que la revisión vista por vista no ve: los huecos entre vistas. Úsala después de auditar las vistas por separado.

## Contenido

1. Por qué recorrer tareas y no pantallas
2. Antes del recorrido
3. El mapa de tareas
4. Cómo recorrer una tarea
5. Las uniones que hay que revisar
6. De lo visto al hallazgo con dueño
7. Ejemplo: gestor de archivos
8. El veredicto
9. Errores comunes
10. Límites del rol

## 1. Por qué recorrer tareas y no pantallas

Mecanismo: cada rol del squad decide su parte, y cada vista puede estar bien por separado. El usuario no vive vistas, vive tareas: "encontrar el certificado de la muestra y abrirlo". Lo que se rompe está en las uniones: el mensaje de éxito que lleva a una lista sin el archivo nuevo, el filtro que se pierde al regresar, la confirmación que no dice qué se retiró. Las uniones no tienen dueño por defecto, y lo que no tiene dueño se deteriora. Este recorrido le pone dueño y veredicto a cada unión.

Regla del eslabón más débil: una tarea se califica por su peor paso, no por el promedio. Una búsqueda excelente con una descarga que falla es una tarea que falla.

## 2. Antes del recorrido

- Escribe en una frase lo que el módulo promete, tomada de los requisitos. Todo el recorrido prueba esa frase; la distancia entre la promesa y lo que pasa es la revisión.
- Recorre sin guía: no leas notas del constructor ni pidas que te enseñen dónde está algo. Si necesitas una explicación para avanzar, eso ya es hallazgo: el usuario no tendrá a nadie al lado.
- Usa datos a escala real y recorre como cada perfil de `docs/usuarios.md` (y cada nivel de acceso que tenga). Recorre también las relaciones entre perfiles: lo que captura uno y revisa otro es una sola tarea con una unión en medio.
- Si la app no corre completa, no hay recorrido: el hallazgo es que no hay nada que revisar de punta a punta. Se anota en Pendientes.

## 3. El mapa de tareas

Lista las tareas principales a partir de los requisitos e infiere su frecuencia del propósito del módulo. Para cada una arma esta tabla antes de juzgar:

| Tarea | Usuario y nivel | Frecuencia inferida | Entrada | Vistas que cruza | Confirmación final | ¿Definida de punta a punta? |
|---|---|---|---|---|---|---|

La última columna se llena con los documentos: ¿la estructura define el flujo completo, incluido qué pasa al terminar y al fallar? Un "no" ya es hallazgo de hueco de especificación, antes de abrir la app.

## 4. Cómo recorrer una tarea

1. Entra por donde entraría el usuario: el menú, un enlace directo, la búsqueda. No por la vista que quieres revisar.
2. Haz el camino feliz completo. Cuenta los pasos hasta el resultado y anota cada duda.
3. Repite por el camino de error: dato inválido, archivo demasiado grande, sin conexión, sin permiso, búsqueda sin resultados.
4. Repite con otro nivel de acceso: ¿la tarea se ve y se comporta como dicen los requisitos para ese nivel?
5. Interrumpe a la mitad: cancela, usa el botón atrás del navegador, recarga. ¿El sistema queda en un estado coherente y el usuario sabe dónde está?
6. Repite la tarea como usuario frecuente (la décima vez): ¿algo molesta en cada uso, como una confirmación innecesaria o un filtro que no se recuerda?
7. Llega a la confirmación: el usuario debe poder saber, sin dudar, que la tarea terminó y cuál fue el resultado.

## 5. Las uniones que hay que revisar

- [ ] La acción de una vista lleva a la vista que la estructura definió, y el título de llegada coincide con lo que se pulsó.
- [ ] Al regresar se conserva el contexto: carpeta, filtros, búsqueda, página, posición.
- [ ] El resultado de una acción se ve en la vista siguiente (el archivo subido aparece; el retirado desaparece).
- [ ] Los mensajes de éxito y error usan los mismos términos que el resto del módulo.
- [ ] Un error en un paso conserva lo capturado y permite reintentar sin empezar de cero.
- [ ] Los estados vacíos de inicio (carpeta sin archivos, primer uso) ofrecen una acción clara.
- [ ] Entradas desde fuera del módulo (enlace compartido, notificación, otro módulo) llegan a un lugar con sentido y respetan permisos.
- [ ] Las salidas del módulo (descargar, imprimir, exportar) entregan lo prometido, con nombre y formato legibles.

## 6. De lo visto al hallazgo con dueño

Cada problema del recorrido pasa por tres preguntas, en orden:

1. **¿Qué documento debía cubrirlo?** Si alguno lo cubre y lo construido no cumple, es implementación (constructor). Si lo construido cumple pero el resultado falla, es del documento.
2. **¿De qué capa es la decisión?** Regla de negocio o qué debe pasar → analista (Inqa). Qué vista sigue, qué contiene o qué estado existe → estructura. Cómo se acomoda o se distingue → compositor. Qué pieza resuelve el hueco → curador (Kura). Datos, permisos, procesos → arquitecto (Arko).
3. **¿Ningún documento lo cubre?** Es hueco de especificación para el dueño de la capa de la pregunta 2.

Si dos roles están involucrados, el hallazgo va al primero de la cadena cuya decisión falló; los demás se anotan como afectados. Un hallazgo con dos dueños no lo cierra nadie.

Cada hallazgo de recorrido incluye: la tarea, el paso exacto, la unión entre qué vistas, lo esperado según el documento, lo observado y la marca de verificación.

## 7. Ejemplo: gestor de archivos

Tarea: "subir una tanda de certificados a la carpeta de un cliente y confirmar que quedaron", usuario nivel 2 · Edición (también la hace nivel 1), poco frecuente y por tandas.

| Paso | Esperado | Observado | Hallazgo |
|---|---|---|---|
| Entrar desde el menú y buscar la carpeta | Búsqueda encuentra la carpeta por nombre del cliente | Funciona | — |
| Abrir carpeta, pulsar "Subir archivos" | Diálogo de subida | Funciona | — |
| Subir la tanda; uno tiene nombre acentuado | Progreso por archivo y éxito | Éxito, pero ese nombre se guarda sin acentos | Implementación, importante, constructor |
| Cerrar el diálogo | Los archivos aparecen en la lista | No aparecen hasta recargar; la estructura no dice qué pasa al cerrar | Hueco de especificación, importante, estructura |
| Regresar a resultados de búsqueda | Se conserva la búsqueda | La búsqueda se borra | Estructura no definió el regreso: hueco, menor, estructura |
| Intentar lo mismo con nivel 3 · Consulta y descarga y con nivel 4 · Consulta | Requisito: solo niveles 1 y 2 suben | El botón no aparece y el servidor rechaza la petición directa | Cumplimiento (pantalla y contra servidor) |

Tarea: "retirar un archivo equivocado", ocasional, solo nivel 1 · Administración. La confirmación nombra el archivo y, al confirmar, deja de verse para todos y sus archivos pasan a "por eliminar" (cumple; comprobado en pantalla y contra servidor). Pero el mensaje final no dice adónde fue ni que recuperarlo es manual, y la estructura no definió ese mensaje → hueco de especificación, menor, estructura. Con nivel 2 la petición directa de retirar se rechaza (cumplimiento).

## 8. El veredicto

Cada tarea termina con uno de dos veredictos, sin intermedios:

- **Pasa**: el camino feliz, los errores y los niveles de acceso cumplen lo aprobado, y lo no comprobado está declarado en Pendientes.
- **No pasa**: con la lista de hallazgos ordenada por gravedad, cada uno con dueño.

"Está casi", "solo le falta pulir" o "se arregla después" no son veredictos: nombran defectos sin decir cuáles. El veredicto del módulo es el de su peor tarea principal. Reporta siempre la unión más débil, su gravedad y su dueño.

## 9. Errores comunes

- Revisar cada vista por separado y declarar el módulo terminado.
- Recorrer solo el camino feliz con el usuario administrador.
- Aceptar una explicación del constructor como si fuera parte del producto.
- Asignar el hallazgo a "todos" o a dos roles.
- Promediar: "casi todo funciona" cuando la tarea principal falla en un paso.

## 10. Límites del rol

El revisor recorre, juzga contra lo aprobado y asigna dueño. No rediseña el flujo, no decide qué vista debería seguir, no recorta funciones ni agrega pasos. Lo que mejoraría la tarea sin contradecir ningún documento se entrega como sugerencia a quien podría adoptarla.

Adaptado de wondelai/skills (steve-jobs-design-review, basado en "Steve Jobs" de Walter Isaacson, "Insanely Simple" de Ken Segall y "Creative Selection" de Ken Kocienda; ux-heuristics, basado en "Don't Make Me Think" de Steve Krug), licencia MIT.
