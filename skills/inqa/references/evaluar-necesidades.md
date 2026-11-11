# Evaluar necesidades

Propósito: pasar de "qué hace hoy el legacy" a "qué necesita el usuario", separando el comportamiento observado del requisito y expresando cada problema como una necesidad sin solución visual.

## Contenido

1. El legacy es el spec de facto, no el requisito
2. El trabajo a realizar (JTBD)
3. Problemas como necesidades sin solución visual
4. Evaluación de oportunidad
5. Clasificar cada comportamiento observado
6. Checklist verificable
7. Ejemplo: gestor de archivos
8. Errores comunes
9. Límites

## 1. El legacy es el spec de facto, no el requisito

Lo que el sistema viejo hace hoy es lo que la gente usa y de lo que otros procesos pueden depender, con todo y sus defectos. Por eso se documenta tal cual, como hecho observado, antes de decidir nada.

Mecanismo: si escribes requisitos desde lo que "debería" hacer, pierdes comportamientos de los que alguien depende sin saberlo (un reporte que lee el nombre del archivo, una persona que usa la sobrescritura como "actualizar versión"). Si copias el legacy tal cual, migras también sus defectos y sus rodeos.

Regla de trabajo:

- Primero describe el comportamiento actual, con fuente (archivo, consulta, pantalla), sin calificarlo.
- Luego decide, uno por uno, si se conserva, se cambia o se elimina, y por qué.
- Si encuentras algo que parece error, no lo "arregles" en silencio en el requisito: anótalo como comportamiento observado, márcalo como posible defecto y haz explícito el cambio. Alguien puede depender de él.

## 2. El trabajo a realizar (JTBD)

Un trabajo es el progreso que una persona quiere lograr en una circunstancia concreta. No es una función ni una pantalla.

Formato: **Cuando** [circunstancia], **quiero** [progreso], **para** [resultado].

Reglas para que el enunciado sirva:

- No menciona el sistema, botones, pantallas ni tecnología. Si lo cambias por "un cuaderno" o "una carpeta de red" y sigue teniendo sentido, está bien escrito.
- La circunstancia pesa más que el perfil: la misma persona de nivel 2 tiene un trabajo distinto cuando prepara un informe que cuando atiende una auditoría.
- Es estable: el trabajo existía antes del legacy y seguirá después. Las funciones cambian, el trabajo no.
- Considera tres dimensiones. Funcional: qué necesita lograr. Emocional: con qué tranquilidad (p. ej., que nivel 1 no tema retirar algo que otro necesita). Social: cómo queda frente a otros (p. ej., ante un auditor o un cliente). Para un módulo interno la funcional manda, pero la emocional explica reglas como "confirmar antes de retirar".

Señales de un trabajo mal atendido hoy: rodeos (hojas de cálculo paralelas, carpetas en el escritorio, nombres de archivo con fecha manual), pedir a otro que lo haga, o no hacerlo. Cada rodeo es evidencia de una necesidad, y vale más que una petición explícita.

La competencia del módulo no es otro software: es el rodeo actual (correo, memoria USB, preguntar en persona). El requisito debe ganarle a ese rodeo en el trabajo concreto.

## 3. Problemas como necesidades sin solución visual

Una necesidad describe lo que la persona no logra hoy, desde su lado. Una solución describe lo que vamos a construir. El analista escribe necesidades; Kompa y Forja deciden la solución.

| Escrito como solución (no) | Escrito como necesidad (sí) |
|---|---|
| "Agregar filtros a la tabla" | "No se localiza un archivo cuando solo se conoce el folio de la muestra" |
| "Poner un modal de confirmación" | "Nivel 1 puede retirar un archivo sin darse cuenta, y deja de verse para todos" |
| "Botón de subir más visible" | "Personas de nivel 2, que sí pueden subir, le piden a nivel 1 que suba por ellas" (ejemplo hipotético) |
| "Hacer un dashboard" | "Nadie sabe qué carpetas no se han actualizado en el último periodo" |
| "Árbol de carpetas" | "Se pierde la ubicación al moverse entre carpetas anidadas" |

Prueba: si la frase contiene un componente de interfaz (botón, modal, tabla, menú, ícono, color), reescríbela. Si te llega una solución (de Kevin o del legacy), pregunta "¿qué no se logra hoy sin esto?" y escribe eso.

Las necesidades grandes se parten en sub-necesidades más concretas hasta que cada una se pueda verificar con un criterio. "Encontrar archivos es difícil" se parte en: no se encuentra con datos parciales, no se distingue entre versiones, no se sabe en qué carpeta quedó.

## 4. Evaluación de oportunidad

Antes de aprobar un requisito nuevo o un cambio al comportamiento actual, respóndelo en una línea cada punto. Si no puedes, no está listo.

| Pregunta | Respuesta buena | Respuesta que no sirve |
|---|---|---|
| ¿Qué objetivo del laboratorio atiende? | "Reducir archivos perdidos en auditoría" | "El sistema nuevo lo tiene" |
| ¿Para quién, en qué circunstancia? | "Nivel 2 al cerrar un análisis" | "Para todos" |
| ¿Qué problema, con qué evidencia? | "Archivos no encontrados en una auditoría: caso reportado o visto en datos" (ejemplo hipotético) | "Sería bueno" |
| ¿Qué hacen hoy en su lugar? | "Piden la copia al responsable por correo" | "Nada, no existe" (casi nunca es cierto) |
| ¿Cómo sabremos que se resolvió? | "Un archivo se localiza conociendo solo el folio de la muestra" (ejemplo hipotético) | "Que les guste" |
| ¿Qué riesgo tiene? | Valor (¿lo necesitan?) y viabilidad (¿choca con reglas del laboratorio o normativas?) | — |

Gravedad del problema, para ordenar:

| Nivel | Señal | Decisión |
|---|---|---|
| Urgente | Ya gastan tiempo o arriesgan datos en un rodeo | Entra al alcance |
| Molestia real | Lo reconocen sin que se lo sugieras | Entra si no infla el alcance |
| Deseable | Solo lo reconocen cuando se lo planteas | Fuera de alcance, anotado |
| No es problema | Nadie lo nota | No se escribe |

La factibilidad técnica no la evalúa el analista: si dudas, se marca como pregunta para Forja.

## 5. Clasificar cada comportamiento observado

Para cada comportamiento del legacy, una fila:

| Comportamiento observado (con fuente) | Trabajo que atiende | Decisión | Motivo |
|---|---|---|---|
| Lo que hace hoy, sin juicio | Enunciado Cuando/quiero/para | Conservar / Cambiar / Eliminar / Pendiente | Evidencia o pregunta |

- **Conservar**: atiende un trabajo real y no tiene defecto conocido. Pasa a requisito tal cual.
- **Cambiar**: atiende un trabajo real pero lo hace mal o con riesgo. El requisito describe el nuevo resultado, no el viejo.
- **Eliminar**: no atiende ningún trabajo identificable y nadie depende de él (confírmalo; si no puedes, es Pendiente).
- **Pendiente**: no sabes si alguien depende de él. Va a supuestos o a las preguntas para Kevin.

## 6. Checklist verificable

- [ ] Cada comportamiento del legacy está descrito con su fuente antes de decidir sobre él.
- [ ] Cada requisito apunta a un trabajo escrito sin nombrar el sistema.
- [ ] Ninguna necesidad contiene un componente de interfaz ni una decisión técnica.
- [ ] Cada cambio frente al legacy dice qué comportamiento reemplaza y por qué.
- [ ] Los posibles defectos están marcados, no corregidos en silencio.
- [ ] Cada requisito nuevo pasó la evaluación de oportunidad.
- [ ] Lo "deseable" quedó fuera de alcance, anotado.

## 7. Ejemplo: gestor de archivos

Reglas aprobadas (hechos): permisos globales para todo el repositorio. Nivel 1 Administración hace todo, incluido crear y renombrar carpetas y retirar. Nivel 2 Edición consulta, descarga y sube/actualiza/corrige. Nivel 3 consulta y descarga. Nivel 4 solo consulta. Retirar es solo de nivel 1, pide confirmación y lo retirado deja de verse para todos. La recuperación y el borrado final son manuales, a petición y fuera del módulo. La raíz no se retira.

Trabajos principales:

- Cuando cierro un análisis (nivel 1 o 2), quiero dejar sus archivos donde el equipo los encuentre, para no tener que enviarlos uno por uno.
- Cuando un cliente o un auditor pide un resultado, quiero localizar el archivo con el dato que tengo, para responder sin depender de quien lo subió.
- Cuando limpio el repositorio (nivel 1), quiero retirar lo que sobra con certeza de qué estoy retirando, para no dejar a otros sin un archivo que necesitan.

Clasificación. Los comportamientos "observados" son ejemplos hipotéticos: verifícalos en el código real.

| Observado (hipotético) | Decisión | Motivo |
|---|---|---|
| Subir con nombre repetido reemplaza el archivo | Pendiente | No se sabe si alguien usa el reemplazo como "actualizar"; pregunta a Kevin |
| Retirar borra sin confirmar | Cambiar | Regla aprobada: retirar pide confirmación; lo retirado deja de verse y la recuperación es manual fuera del módulo |
| Nivel 2 puede crear carpetas | Cambiar | Regla aprobada: crear y renombrar carpetas es solo de nivel 1 |
| Permisos asignados por carpeta | Cambiar | Regla aprobada: los permisos son globales |
| Se puede retirar la carpeta raíz | Cambiar | Regla aprobada: la raíz no se retira |
| Búsqueda solo por nombre exacto | Pendiente | Posible necesidad de localizar con datos parciales (folio, fecha); confirmar con un caso real |
| Carpetas anidadas sin límite | Conservar | Atiende la organización por cliente y análisis; sin defecto conocido |

## 8. Errores comunes

| Error | Por qué falla | Corrección |
|---|---|---|
| Copiar el legacy como requisito | Migra defectos y rodeos | Clasifica cada comportamiento |
| Requisitos desde cero ignorando el legacy | Rompes dependencias ocultas | Documenta lo observado primero |
| Corregir un defecto sin decirlo | Alguien dependía de él | Márcalo y haz explícito el cambio |
| Necesidades con botones y pantallas | Invades a Kompa | Reescribe desde lo que no se logra |
| "Los usuarios quieren X" sin evidencia | Es una solución disfrazada | Pregunta por qué y busca el rodeo |

## 9. Límites

El analista decide qué necesita el usuario y qué reglas aplican. No decide cómo se ve ni cómo se acomoda (Kompa), ni cómo se construye ni si es factible técnicamente (Forja).

Adaptado de wondelai/skills (jobs-to-be-done, basado en "Competing Against Luck" de Clayton M. Christensen; inspired-product, basado en "Inspired" de Marty Cagan; continuous-discovery, basado en "Continuous Discovery Habits" de Teresa Torres; working-with-legacy-code, basado en "Working Effectively with Legacy Code" de Michael C. Feathers), licencia MIT.
