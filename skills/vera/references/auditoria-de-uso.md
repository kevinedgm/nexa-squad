# Auditoría de uso por vista

Propósito: revisar cada vista construida con las 10 heurísticas de Nielsen, convertir cada problema en un hallazgo con gravedad del squad (bloqueante, importante, menor) y evidencia que su dueño pueda reproducir sin preguntar.

## Contenido

1. Cómo correr la auditoría de una vista
2. Las 10 heurísticas aplicadas a una vista de gestión
3. Prueba de orientación
4. De la escala Nielsen 0-4 a la gravedad del squad
5. Error o sugerencia
6. Plantilla de hallazgo
7. Ejemplo: gestor de archivos
8. Resumen por vista
9. Errores comunes
10. Límites del rol

## 1. Cómo correr la auditoría de una vista

Mecanismo: la heurística sirve para **encontrar** problemas; el documento aprobado sirve para **juzgarlos**. Si juzgas con tu gusto, el hallazgo no tiene dueño ni criterio para cerrarse.

1. Antes de abrir la vista, lee lo que la define: requisitos (criterios Dado/Cuando/Entonces), estructura de la vista (regiones, acciones con prioridad, estados, flujos), composición y decisiones del curador.
2. Escribe en una línea la tarea principal de la vista y el usuario que la hace. Infiere frecuencia del propósito del módulo (un gestor de archivos de laboratorio se usa a diario para buscar, abrir y descargar; subir es raro y por tandas; crear o renombrar carpetas y retirar es ocasional y solo de nivel 1). No lo preguntes.
3. Usa datos realistas: carpetas con muchos archivos, nombres largos, acentos y ñ, una carpeta vacía, un usuario de cada nivel de acceso (1-4).
4. Recorre la vista sin leer explicaciones del constructor. Anota cada momento en que dudaste, buscaste algo o tuviste que adivinar: esas notas son la materia prima.
5. Pasa las 10 heurísticas (tabla de la sección 2) y la prueba de orientación (sección 3).
6. Por cada problema: busca qué documento contradice, asigna tipo, gravedad, dueño y marca de verificación.

## 2. Las 10 heurísticas aplicadas a una vista de gestión

| # | Heurística | Qué revisar en la vista | Ejemplo en el gestor |
|---|---|---|---|
| 1 | Visibilidad del estado del sistema | Toda acción responde de inmediato; hay estados de carga, éxito y error; operaciones largas muestran avance | Subir un archivo muestra progreso y al terminar el archivo aparece en la lista |
| 2 | Lenguaje del usuario | Términos del laboratorio, no del sistema; orden natural; íconos reconocibles | "Retirar" y "Carpeta", no "Soft delete" ni "Nodo" |
| 3 | Control y libertad | Cancelar o salir en todo flujo; diálogos con cierre claro; el botón atrás del navegador no rompe nada | Cancelar una subida a medias deja la carpeta como estaba |
| 4 | Consistencia | Un término por concepto; misma acción, mismo aspecto y mismo resultado en todo el módulo | "Retirar" no aparece como "Eliminar" en otra vista |
| 5 | Prevención de errores | Confirmación en acciones irreversibles; validación en línea; entradas restringidas; aviso de cambios sin guardar | Retirar pide confirmación que nombra el archivo; tipos no permitidos se rechazan antes de subir |
| 6 | Reconocer antes que recordar | Opciones visibles; ruta actual visible; valores decodificados | Se muestra "Nivel 3 · Consulta y descarga", no solo "3" |
| 7 | Flexibilidad y eficiencia | Lo frecuente es rápido; acciones masivas si la estructura las definió; lo avanzado no estorba | Buscar está en la barra de herramientas, no dentro de un menú |
| 8 | Diseño minimalista | Solo lo que sirve a la tarea; una acción principal por vista; jerarquía clara | "Subir archivo" es la única acción con tratamiento principal |
| 9 | Reconocer y recuperarse de errores | Mensaje dice qué pasó, por qué y qué hacer; conserva lo capturado; señala el campo | "El archivo pesa más del límite permitido" en vez de "Error 413" |
| 10 | Ayuda en contexto | Pistas junto a lo no obvio; ayuda orientada a tareas | La confirmación de retirar explica que el archivo deja de verse para todos y pasa a la carpeta "por eliminar" |

Mecanismo de fondo: cada vez que el usuario tiene que pensar en la interfaz deja de pensar en su trabajo. Los problemas que más cuestan son los silenciosos (heurísticas 1 y 9): el usuario cree que algo funcionó y no fue así, o repite la acción y duplica datos.

## 3. Prueba de orientación

Abre la vista desde un enlace directo, sin pasar por el menú. En dos segundos el usuario debe poder responder:

- [ ] ¿En qué sistema y módulo estoy?
- [ ] ¿Qué vista es esta? (el título coincide con el enlace o menú que la abrió)
- [ ] ¿Cuáles son las secciones principales del módulo?
- [ ] ¿Qué puedo hacer aquí? (la acción principal se distingue)
- [ ] ¿Dónde estoy dentro de la jerarquía? (ruta de carpetas o indicador de sección activa)
- [ ] ¿Dónde busco?

Cada "no" es un hallazgo; casi siempre su dueño es estructura (falta el elemento) o compositor (existe pero no se distingue).

## 4. De la escala Nielsen 0-4 a la gravedad del squad

Primero califica en 0-4 pesando tres factores; luego traduce.

| Factor | Pregunta | Sube la gravedad cuando… |
|---|---|---|
| Frecuencia | ¿Cuántos usuarios y cuántas veces lo encuentran? | Ocurre en la tarea diaria (buscar, abrir, descargar) |
| Impacto | ¿Qué pasa cuando ocurre? | Impide terminar, pierde datos, expone datos o induce un error sin aviso |
| Persistencia | ¿Se supera una vez aprendido o molesta siempre? | Molesta en cada uso; el usuario no puede aprender a evitarlo |

| Nielsen | Significado | Gravedad del squad |
|---|---|---|
| 4 | Impide completar la tarea | Bloqueante |
| 3 | Falla importante de la tarea, con rodeo costoso | Importante |
| 2 | Retrasa o frustra | Importante si es en tarea diaria y persistente; si no, menor |
| 1 | Cosmético | Menor |
| 0 | No es problema de uso | No es hallazgo (cuando mucho, sugerencia) |

Reglas que mandan sobre la calificación:

- Brincar un permiso (p. ej., que nivel 4 · Consulta descargue o que nivel 2 · Edición retire), mostrar lo retirado o perder datos del usuario es **bloqueante** siempre, aunque ocurra rara vez.
- Incumplir un criterio Dado/Cuando/Entonces de una tarea principal es, como mínimo, **importante**; si la tarea no se puede terminar, bloqueante.
- No subas la gravedad por acumulación: diez menores siguen siendo diez menores. Si juntos impiden la tarea, el hallazgo real es otro (la tarea) y se registra aparte.

## 5. Error o sugerencia

- **Error**: contradice un documento aprobado (requisito, estructura, composición, decisión del curador, diseño técnico) o impide cumplirlo. Lleva tipo, gravedad, dueño y la cita del documento.
- **Sugerencia**: no contradice ningún documento, aunque creas que mejora la vista. Va sin gravedad, se dirige al dueño que podría adoptarla y no afecta el veredicto.
- Si la heurística detecta un problema real pero ningún documento lo cubre, es un **hueco de especificación**: error para el dueño de la capa que debió decidirlo, no para el constructor.

## 6. Plantilla de hallazgo

| Campo | Qué poner |
|---|---|
| ID | Consecutivo por revisión, p. ej. `R-07` |
| Vista y región | Vista, región y, si aplica, ancho de pantalla y nivel de usuario |
| Tipo | implementación, hueco de especificación, estructura, composición, componente, técnico o requisito |
| Gravedad | bloqueante, importante, menor (o "sugerencia") |
| Dueño | Rol dueño de la decisión que falló |
| Documento que contradice | Documento y criterio citado textual |
| Pasos para reproducir | Numerados, desde la entrada a la vista |
| Esperado | Lo que dice el documento |
| Observado | Lo que pasó, con captura o archivo y línea |
| Heurística | Número y nombre, si aplica |
| Verificación | comprobado en pantalla, comprobado en código o no comprobado (en permisos, además, comprobado contra servidor) |

Prueba de calidad: el dueño puede empezar a trabajar sin hacer una sola pregunta. "La subida es confusa" no pasa; "Al terminar la subida no aparece el archivo en la lista hasta recargar; la estructura dice que la lista se actualiza" sí pasa. El hallazgo describe qué falla y qué exige el documento, no cómo arreglarlo.

## 7. Ejemplo: gestor de archivos

| ID | Hallazgo | Tipo | Gravedad | Dueño | Verificación |
|---|---|---|---|---|---|
| R-01 | Retirar archivo no pide confirmación; el requisito dice "Dado un archivo, cuando el usuario elige retirar, entonces se pide confirmación nombrando el archivo" | implementación | bloqueante (deja de verse para todos sin aviso) | constructor | pantalla |
| R-02 | El error al subir dice "Error 500" y vacía el formulario; la estructura define estado de error con mensaje y conserva lo capturado | implementación | importante | constructor | pantalla |
| R-03 | Nadie definió qué ve el usuario cuando busca y no hay resultados | hueco de especificación | importante | estructura | pantalla |
| R-04 | El nivel del usuario se muestra solo como "3"; la composición pide la etiqueta "Nivel 3 · Consulta y descarga" | implementación | menor | constructor | código |
| R-05 | Agregar "recientes" en la barra lateral aceleraría abrir documentos | sugerencia | — | analista (Inqa) | — |

## 8. Resumen por vista

Cierra cada vista con tres apartados:

- **Cumplimientos**: criterios que verificaste y pasan, con su marca de verificación.
- **Correcciones**: hallazgos (error) ordenados por gravedad, cada uno con dueño.
- **Pendientes**: todo lo no comprobado y las preguntas abiertas. Nada no comprobado aparece como cumplido.

## 9. Errores comunes

- Calificar por gusto en vez de citar el documento que se contradice.
- Mandar al constructor un problema que ningún documento definió (es hueco de especificación).
- Escribir la solución dentro del hallazgo: el revisor no rediseña.
- Revisar con tres registros de prueba: los problemas de densidad, paginación y nombres largos no aparecen.
- Bajar la gravedad de un permiso brincado porque "es poco probable".

## 10. Límites del rol

Con esta referencia el revisor decide si la vista cumple y a quién regresa cada hallazgo. No corrige, no propone otro acomodo ni otro flujo, no agrega requisitos y no cambia la prioridad de las acciones. Una sugerencia nunca se presenta como error.

Adaptado de wondelai/skills (ux-heuristics, basado en "Don't Make Me Think" de Steve Krug y "10 Usability Heuristics for User Interface Design" de Jakob Nielsen), licencia MIT.
