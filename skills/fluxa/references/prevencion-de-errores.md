# Prevención de errores

Propósito: decidir, desde el contenido y el orden de cada vista, qué errores se vuelven imposibles, cuáles se pueden deshacer y cuáles requieren confirmación, y cómo se presentan las acciones que la persona no tiene permitidas.

## Contenido

1. Principio base
2. Desliz vs equivocación
3. Restricciones
4. Deshacer vs confirmar: proporción al daño
5. Acciones destructivas separadas
6. Acciones sin permiso: ocultar o deshabilitar
7. Capas de defensa
8. Checklist verificable
9. Ejemplo: retirar una carpeta
10. Errores comunes
11. Límites

## 1. Principio base

Si alguien se equivoca, la causa casi siempre está en el diseño: faltó una restricción, una señal, un estado visible o un modelo claro. Por eso cada error repetido se trata como hallazgo de estructura, no como culpa del usuario. Orden de preferencia: hacer imposible el error, luego hacerlo reversible, y solo al final pedir confirmación.

## 2. Desliz vs equivocación

Se previenen distinto porque fallan en momentos distintos de la acción.

| | Desliz | Equivocación |
|---|---|---|
| Qué pasa | La intención es correcta, la ejecución falla | La intención es incorrecta, la ejecución es correcta |
| Causa | Distracción, hábito, acción vecina | Modelo mental incompleto o regla aplicada al caso equivocado |
| ¿Se da cuenta? | Casi siempre de inmediato | A veces hasta ver las consecuencias |
| Ejemplo | Elige Retirar queriendo Renombrar una carpeta | Retira una carpeta creyendo que solo la quita de su vista, pero deja de verse para todos |
| Respuesta de estructura | Separar acciones, deshacer, detectar omisiones | Mostrar el dato que cambia la decisión en el punto de decisión |

Subtipos que estructura sí puede atacar:

| Subtipo | Mecanismo | Decisión de estructura |
|---|---|---|
| Acción vecina | Dos acciones juntas y parecidas | Destructivas en otro grupo, con nombre distinto |
| Paso omitido | Olvida un paso de una secuencia | Detectar y avisar ("No adjuntaste archivo") |
| Error de modo | Actúa como si estuviera en otro modo | El modo actual es parte del contenido visible ("Editando") |
| Captura por hábito | La rutina frecuente le gana a la rara | En el flujo raro, un punto de decisión explícito |
| Equivocación por conocimiento | No sabe a quién afecta | Mostrar impacto: a quién afecta, cuántos documentos cambian |

## 3. Restricciones

Una restricción elimina un error en lugar de explicarlo después. Estructura decide qué restricción existe y qué mensaje la acompaña.

| Tipo | Cómo funciona | Ejemplo de decisión |
|---|---|---|
| De entrada | Solo admite valores válidos | Ejemplo hipotético: elegir de una lista en lugar de escribir un código |
| De rango o capacidad | Límite conocido antes de actuar | Ejemplo hipotético: un límite de tamaño de documento se muestra antes de elegirlo |
| Lógica (dependencia) | Un paso requiere otro | Ejemplo hipotético: Guardar no está disponible mientras falte un campo obligatorio |
| Lógica (exclusión) | Elegir A descarta B | Ejemplo hipotético: una fecha final no puede ser anterior a la inicial |
| Semántica (contexto) | Solo se ofrece lo que tiene sentido aquí | Regla real del gestor: la carpeta raíz no ofrece Retirar |
| Secuencia | Orden obligado solo cuando hay dependencia real | Ejemplo hipotético: elegir destino antes de confirmar un traslado |

Reglas:
- Prevenir antes que castigar: si el sistema conoce el límite, se dice antes de actuar, no en el error.
- Toda restricción que bloquea explica qué falta para desbloquear.
- Separar error (bloquea) de advertencia (deja seguir con aviso).
- No restringir por comodidad del sistema: si el dato no es necesario para la tarea, no se pide.
- No forzar secuencia cuando los pasos son independientes.

## 4. Deshacer vs confirmar: proporción al daño

Las confirmaciones rutinarias entrenan a aceptar sin leer; el día que la confirmación importa, también se acepta sin leer. Por eso se confirma poco y se deshace mucho.

| Daño si sale mal | ¿Reversible? | Respuesta |
|---|---|---|
| Bajo (buscar, filtrar, consultar) | Sí | Ni confirmar ni avisar; basta el resultado visible |
| Medio y la propia persona lo revierte al instante | Sí | Hacer y ofrecer Deshacer en el aviso de resultado |
| Alto, afecta a otros, y revertir requiere trabajo manual de alguien más | Solo a mano | Confirmar con consecuencia concreta y el objeto nombrado |
| Alto e irreversible | No | Confirmar con consecuencia concreta y el objeto nombrado |
| Inusual (acción rara que pudo dispararse por accidente) | Depende | Confirmar aunque sea reversible |

En el gestor (regla real): Retirar cae en la tercera fila. Deja de verse para todos, sus archivos pasan a la carpeta "por eliminar" y recuperarlos o borrarlos es manual; por eso pide confirmación y no basta con Deshacer.

Contenido mínimo de una confirmación (estructura lo define, el texto final lo pule quien escriba el contenido):
- Qué se va a hacer y sobre qué, con nombre o cantidad ("Retirar la carpeta Bitácoras 2024, con 12 archivos").
- Qué consecuencia tiene y si se puede revertir ("Dejará de verse para todos; sus archivos pasan a 'por eliminar'").
- Acción de confirmar nombrada con el verbo ("Retirar carpeta"), nunca "Aceptar" o "Sí".
- Salida para cancelar sin efectos.

Si una confirmación aparece en una acción frecuente y reversible, es un hallazgo: cámbiala por Deshacer.

## 5. Acciones destructivas separadas

El desliz por acción vecina se previene con distancia de grupo, no con advertencias.

- Las acciones destructivas van en un grupo propio, distinto del de acciones constructivas o neutras.
- Dentro de un menú por registro, la destructiva va al final y separada del resto.
- Nunca es la acción principal de una vista cuyo propósito no sea eliminar.
- Su nombre es inequívoco y distinto de cualquier otra acción del módulo.
- En acciones masivas, la cantidad seleccionada es parte del contenido visible antes de ejecutar.

Estructura entrega el agrupamiento y la prioridad; cómo se separa visualmente lo decide el compositor.

## 6. Acciones sin permiso: ocultar o deshabilitar

Mostrar una acción que nunca se podrá usar genera ruido y falsas expectativas; ocultar una que se podrá usar pronto deja a la persona sin saber qué falta.

| Situación | Decisión | Contenido obligatorio |
|---|---|---|
| Falta de permiso permanente para su rol | Ocultar la acción | Ninguno; no debe aparecer en el inventario de ese rol |
| Condición temporal (falta un dato, archivo en proceso, registro bloqueado por otro usuario) | Mostrar deshabilitada | Razón concreta y qué hacer para habilitarla |
| La persona puede pedir el permiso | Mostrar deshabilitada | Razón y a quién o cómo solicitarlo |
| Vista completa sin permiso | Estado "sin permiso" de la vista | Qué no puede ver, por qué en términos del usuario y salida |

Reglas:
- Ningún deshabilitado sin razón. Un botón inactivo sin explicación parece descompuesto.
- La razón vive en el contenido, no solo al pasar el puntero, para que funcione con teclado y en pantallas táctiles.
- Ocultar en la interfaz no sustituye la validación en servidor; eso es del arquitecto técnico.

## 7. Capas de defensa

Un error grave pasa solo si fallan todas las capas a la vez. Para cada acción crítica, define al menos tres.

| Capa | Ejemplo en el gestor |
|---|---|
| Restricción | Solo el nivel 1 ve Retirar; la carpeta raíz no ofrece Retirar |
| Confirmación que nombra objeto, cantidad y consecuencia | "Retirar la carpeta Bitácoras 2024 (12 archivos). Dejará de verse para todos y sus archivos pasan a 'por eliminar'." / Cancelar |
| Resultado visible | La carpeta desaparece de la lista y el conteo baja |
| Recuperación | Manual, desde la carpeta "por eliminar"; el módulo no borra por plazo |

Ejemplo hipotético (no es regla aprobada): si la carpeta tuviera subcarpetas, la confirmación diría cuántas y qué pasa con ellas.

## 8. Checklist verificable

- [ ] Cada campo con valores cerrados ofrece opciones en lugar de texto libre.
- [ ] Los límites conocidos se muestran antes de actuar.
- [ ] Toda acción bloqueada dice qué falta para habilitarla.
- [ ] Las confirmaciones solo existen en acciones irreversibles, caras o inusuales.
- [ ] Toda confirmación nombra el objeto, la cantidad y la consecuencia.
- [ ] Las acciones reversibles ofrecen Deshacer.
- [ ] Las destructivas están en grupo propio y nunca son la principal.
- [ ] Lo que un rol nunca podrá hacer no aparece; lo temporal aparece deshabilitado con razón.
- [ ] Un error nunca borra lo que la persona capturó.

## 9. Ejemplo: retirar una carpeta

Hechos (reglas aprobadas): solo el nivel 1 retira; retirar pide confirmación; lo retirado deja de verse para todos; sus archivos pasan a la carpeta "por eliminar"; recuperar y borrar en definitiva son manuales, sin plazo automático en el módulo; la carpeta raíz no se retira. Supuesto: retirar es raro y buscar y consultar son lo frecuente.

| Nivel | Qué ve en las acciones de una carpeta y sus documentos |
|---|---|
| 4 Consulta | Consultar. Nada más aparece (permanente) |
| 3 Consulta y descarga | Consultar, Descargar |
| 2 Edición | Consultar, Descargar, Subir/actualizar/corregir documentos. Crear carpeta, Renombrar y Retirar no aparecen |
| 1 Administración | Lo anterior más Crear carpeta y Renombrar carpeta; separado y al final: Retirar |
| 1 en la carpeta raíz | Retirar no aparece (regla permanente para ese objeto) |

Flujo: Retirar → confirmación que nombra la carpeta, cuántos archivos tiene y la consecuencia → Retirar carpeta / Cancelar → aviso de resultado que dice que los archivos quedaron en "por eliminar". Aquí se confirma en lugar de ofrecer Deshacer porque la persona no puede revertirlo por sí misma: la recuperación es manual.

Ejemplo hipotético de deshabilitado temporal (no es regla aprobada): si una carpeta estuviera bloqueada por otra operación, Retirar aparecería deshabilitado con la razón y cuándo se habilita.

## 10. Errores comunes

- Pedir "¿Está seguro?" en todo; la gente deja de leer.
- Confirmación con "Aceptar" y "Cancelar" sin nombrar qué se acepta.
- Deshabilitar sin razón, o mostrar la razón solo al pasar el puntero.
- Mostrar al nivel 4 acciones que nunca podrá usar, como Descargar o Retirar.
- Borrar el formulario cuando falla el guardado.

## 11. Límites

Esta referencia decide qué restricciones, avisos, confirmaciones y estados existen, y su contenido y agrupación. No decide colores, iconos, distancias ni el aspecto de lo deshabilitado (compositor), ni cómo se valida el permiso en servidor o cómo se recupera desde "por eliminar" (arquitecto técnico y analista).

Adaptado de wondelai/skills (design-everyday-things, basado en "The Design of Everyday Things" de Don Norman; ux-heuristics, basado en "10 Usability Heuristics" de Jakob Nielsen; microinteractions, basado en "Microinteractions" de Dan Saffer), licencia MIT.
