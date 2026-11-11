# Mapear supuestos

Propósito: separar hechos, supuestos y preguntas; priorizar los supuestos por riesgo para decidir cuáles se confirman antes de aprobar, y escribir criterios Dado/Cuando/Entonces que se puedan comprobar.

## Contenido

1. Hechos, supuestos y preguntas
2. Qué supuestos importan al analista
3. Priorizar por riesgo
4. Decidir qué se confirma antes de aprobar
5. Criterios Dado/Cuando/Entonces
6. Requisitos INVEST
7. Ejemplo: gestor de archivos
8. Errores comunes
9. Límites

## 1. Hechos, supuestos y preguntas

Cada afirmación del documento lleva una marca. Sin marca, el siguiente rol la trata como hecho.

| Marca | Qué es | Requisito para usarla |
|---|---|---|
| Hecho | Observado o dicho por Kevin con un caso concreto | Fuente: archivo/consulta del legacy, dato, o respuesta de Kevin con fecha |
| Supuesto | Inferido; razonable pero no comprobado | Base de la inferencia y quién puede confirmarlo |
| Pregunta | No se sabe y bloquea | Pregunta concreta y supuesto por defecto mientras tanto |

Mecanismo: un supuesto sin marca viaja por la cadena y llega al constructor como si fuera regla; si era falso, el revisor lo encuentra cuando ya está construido. Marcarlo cuesta una palabra y lo deja visible para quien puede confirmarlo.

Cómo escribir un supuesto para que sirva:

- Como afirmación que puede resultar falsa: "Nivel 2 corrige archivos que subió otra persona" (ejemplo hipotético).
- Concreta: "los usuarios necesitan buscar" no se puede refutar; "se busca por folio de muestra al menos tan seguido como por nombre" sí.
- Incluye los supuestos que das por obvios (quién usa, frecuencia, contexto): suelen ser los más peligrosos precisamente porque nadie los revisa.

## 2. Qué supuestos importan al analista

Hay cuatro tipos de riesgo. El analista evalúa dos y canaliza los otros dos.

| Tipo | Pregunta | Dueño |
|---|---|---|
| Valor | ¿Existe la necesidad y es suficiente para cambiar lo que hacen hoy? | Analista |
| Viabilidad | ¿Encaja con las reglas del laboratorio, normas, permisos y la operación? | Analista |
| Factibilidad | ¿Se puede construir con lo que hay? | Arquitecto técnico (se anota como pregunta para él) |
| Usabilidad | ¿Lo entenderán y lo completarán? | Kompa (se anota como riesgo) |

Patrones de supuesto de valor más peligrosos: "tienen este problema", "van a cambiar su forma de trabajar", "nadie depende del comportamiento viejo".

Patrones de viabilidad: "esta regla de acceso cumple con lo que exige el laboratorio", "retirar no choca con la retención de registros", "un nivel puede hacer esto sin autorización de otro". Una regla ya aprobada (p. ej., quién retira) no es supuesto: es un hecho y no se vuelve a evaluar.

## 3. Priorizar por riesgo

Ubica cada supuesto en dos ejes:

- **Importancia**: si es falso, ¿se cae el requisito o se pierden datos (alta), o es un ajuste menor (baja)?
- **Evidencia**: ¿hay hecho que lo respalde (alta) o es inferencia pura (baja)?

| | Evidencia baja | Evidencia alta |
|---|---|---|
| **Importancia alta** | Crítico: confirmar antes de aprobar | Vigilar: se acepta, se revisa si cambia el contexto |
| **Importancia baja** | Confirmar si es barato; si no, aceptar marcado | Seguro: se acepta |

Para decidir la importancia, pregunta: "si esto es falso, ¿qué tengo que deshacer?". Si la respuesta incluye datos perdidos, permisos mal dados o un flujo entero, es alta.

Desempate entre críticos: primero lo irreversible (borrado, exposición de datos), luego lo que cambia el alcance, luego lo que cambia un criterio.

## 4. Decidir qué se confirma antes de aprobar

Regla: ningún requisito se aprueba si depende de un supuesto crítico sin confirmar.

Para cada supuesto crítico:

1. Define antes qué lo confirma y qué lo refuta: "Se confirma si Kevin describe un caso en que se retiró una carpeta y su contenido dejó de verse con ella; se refuta si el contenido quedó visible o se movió a otro lado" (ejemplo hipotético).
2. Elige la forma más barata de confirmarlo: leer el código o los datos del legacy, luego una de las 5 preguntas a Kevin.
3. Registra el resultado: confirmado, refutado o sin resolver, con la fuente.
4. Si queda sin resolver: el requisito sale como "pendiente de confirmar", con el supuesto por defecto visible. No se presenta como aprobado.

Mecanismo del criterio previo: si decides después qué cuenta como confirmación, cualquier respuesta parece confirmar lo que ya pensabas.

## 5. Criterios Dado/Cuando/Entonces

Cada criterio describe un comportamiento observable desde afuera, sin decir cómo se ve ni cómo se construye.

- **Dado**: estado previo concreto: quién (nivel), qué existe, en qué condición.
- **Cuando**: una sola acción del usuario o un evento.
- **Entonces**: resultado observable y comprobable; qué cambia, qué no cambia, quién lo puede ver.

Reglas de redacción:

- Un criterio, un comportamiento. Si necesitas "y además" en el Cuando, son dos criterios.
- El Entonces se comprueba con sí/no. "Es fácil", "es rápido", "se muestra claramente" no se comprueban.
- Sin componentes de interfaz: no "aparece un modal", sí "se pide confirmación antes de retirar". Sin tecnología: no "se ejecuta un DELETE", sí "el archivo deja de aparecer para todos los niveles".
- Cubre el camino feliz, el negado (sin permiso), el límite (carpeta vacía, nombre repetido) y el error (la acción no se completa).
- Si el criterio usa un valor (plazo, tamaño), su origen es un hecho o un supuesto marcado.

Prueba de verificabilidad: dale el criterio a alguien que no conoce el proyecto. Si puede decir "pasa" o "no pasa" sin preguntarte, está bien escrito.

## 6. Requisitos INVEST

Cada requisito, con sus criterios, cumple:

| Letra | Significa | Cómo se comprueba |
|---|---|---|
| I | Independiente | Se puede aprobar y construir sin esperar a otro requisito; si no, la dependencia está escrita |
| N | Negociable | Dice qué se logra, no cómo; deja libre la solución |
| V | Valioso | Apunta a un trabajo del usuario o a una regla del laboratorio |
| E | Estimable | No tiene preguntas críticas abiertas |
| S | Pequeño (small) | Cabe en una fase; si tiene más de unos 6 criterios, probablemente son dos requisitos |
| T | Comprobable (testable) | Todos sus criterios pasan la prueba de verificabilidad |

## 7. Ejemplo: gestor de archivos

Reglas aprobadas (hechos): permisos globales para todo el repositorio. Nivel 1 Administración hace todo. Nivel 2 Edición consulta, descarga y sube/actualiza/corrige; no crea carpetas ni retira. Nivel 3 consulta y descarga. Nivel 4 solo consulta. Retirar es solo de nivel 1, pide confirmación y lo retirado deja de verse para todos. La recuperación y el borrado final son manuales, a petición y fuera del módulo. La carpeta raíz no se retira.

Mapa. Las filas marcadas "hipotético" enseñan el método; su respuesta no se conoce.

| Afirmación | Marca | Importancia | Evidencia | Acción |
|---|---|---|---|---|
| Solo nivel 1 retira, con confirmación; lo retirado deja de verse para todos | Hecho (regla aprobada) | — | — | Base del requisito |
| Recuperación y borrado final son manuales y fuera del módulo | Hecho (regla aprobada) | — | — | Fuera de alcance; no lleva criterio |
| Retirar una carpeta retira también su contenido | Supuesto (hipotético) | Alta | Baja | Confirmar antes de aprobar |
| Queda constancia de qué se retiró, quién y cuándo, para atender la recuperación manual | Supuesto (hipotético; base: la recuperación a petición necesita identificar qué recuperar) | Alta | Baja | Pregunta a Kevin |
| Hay normas de retención de registros que limitan retirar | Pregunta de viabilidad (hipotético) | Alta | Baja | Pregunta a Kevin |
| Se busca más por folio que por nombre | Supuesto (hipotético) | Baja | Baja | Aceptar marcado |
| Lo retirado se conserva de forma que la recuperación manual sea posible | Pregunta para Forja | — | — | Se canaliza |

Requisito: Retirar un archivo (solo nivel 1).

- Dado un usuario de nivel 1 en una carpeta con un archivo, cuando elige retirarlo, entonces se le pide confirmar antes de que el archivo cambie de estado.
- Dado que nivel 1 confirmó el retiro, cuando cualquier usuario de nivel 1 a 4 abre esa carpeta o busca el archivo, entonces el archivo no aparece.
- Dado que nivel 1 no confirma el retiro, cuando la acción termina, entonces el archivo sigue visible para todos sin cambios.
- Dado un usuario de nivel 2, 3 o 4, cuando intenta retirar un archivo, entonces la acción no se completa y el archivo sigue igual.
- Dado un usuario de nivel 1, cuando intenta retirar la carpeta raíz, entonces la acción no se completa y la raíz sigue igual.
- Dado que el retiro no se puede completar, cuando ocurre el fallo, entonces el archivo sigue visible y el usuario sabe que no se retiró.

Estado: los criterios anteriores descansan en reglas aprobadas. El requisito "retirar una carpeta" queda pendiente de confirmar porque depende de los dos supuestos críticos hipotéticos del mapa.

## 8. Errores comunes

| Error | Por qué falla | Corrección |
|---|---|---|
| Supuestos sin marcar | Llegan al constructor como reglas | Toda afirmación lleva Hecho/Supuesto/Pregunta |
| Aprobar con supuestos críticos abiertos | Retrabajo en cadena | Estado "pendiente de confirmar" |
| Criterio que menciona modal, botón o tabla | Decide por otros roles | Describe el resultado observable |
| Entonces subjetivo | No se puede verificar | Resultado de sí/no |
| Solo el camino feliz | Los permisos y errores quedan sin regla | Agrega negado, límite y error |
| Evaluar factibilidad o usabilidad | No es tu decisión | Anótalo como pregunta para el rol dueño |

## 9. Límites

El analista marca, prioriza y confirma supuestos de valor y viabilidad, y escribe criterios de comportamiento. No resuelve factibilidad técnica ni usabilidad; las anota y las pasa al rol que las decide.

Adaptado de wondelai/skills (continuous-discovery, basado en "Continuous Discovery Habits" de Teresa Torres), licencia MIT.
