# Preguntas a Kevin

Propósito: formular como máximo 5 preguntas que devuelvan hechos y reglas de negocio verificables, no opiniones, y convertir cualquier respuesta vaga en una regla que alguien más pueda comprobar.

## Contenido

1. Antes de preguntar
2. Principios y por qué funcionan
3. Qué NO preguntar
4. Cómo redactar cada pregunta
5. Detectar respuestas vagas y convertirlas en regla
6. Checklist antes de enviar
7. Ejemplo: gestor de archivos
8. Errores comunes
9. Límites

## 1. Antes de preguntar

Una pregunta gasta atención de Kevin; una pregunta que el código, el propósito del módulo o los datos ya responden la desperdicia.

- Lee primero el comportamiento actual del legacy. Lo que ahí se ve es un hecho con fuente; no se pregunta, se confirma si es regla o defecto.
- Infiere uso, frecuencia, usuarios y contexto del propósito del módulo y anótalos como supuestos. No los preguntes.
- Haz la lista completa de dudas y quédate solo con las que bloquean la aprobación (alta importancia y poca evidencia). El resto se resuelve con un supuesto declarado.
- Si te quedan más de 5 bloqueantes, prioriza: primero lo irreversible (pérdida de datos, permisos), luego lo que cambia el alcance. Lo que no entre queda como requisito "pendiente de confirmar", no aprobado.

## 2. Principios y por qué funcionan

**Pregunta por hechos del pasado, no por preferencias futuras.**
Mecanismo: una opinión no cuesta nada, se dice para quedar bien y cambia mañana; un hecho ya ocurrió y trae detalles que se pueden revisar (quién, cuándo, qué se hizo). "¿Quieres que se pueda buscar por folio?" siempre recibe "sí". "La última vez que no encontraron un archivo, ¿qué dato tenían a la mano?" revela si el problema existe y qué tan grave es (ejemplo hipotético).

**Pregunta por la regla, no por la solución.**
Mecanismo: si preguntas "¿pongo un historial de versiones?", Kevin diseña sobre la marcha y tú pierdes la necesidad. Si preguntas por la regla ("cuando se corrige un archivo, ¿alguien necesita consultar el anterior?, ¿quién?"), la solución queda libre para los roles que la deciden (ejemplo hipotético).

**No metas tu propuesta en la pregunta.**
Mecanismo: "¿Está bien que un archivo corregido reemplace al anterior?" empuja a confirmar. "La última vez que se corrigió un archivo ya entregado, ¿qué pasó con el anterior?" deja espacio para que la respuesta te contradiga (ejemplo hipotético).

**Cada pregunta debe poder cambiar el requisito.**
Mecanismo: si cualquier respuesta deja el documento igual, la pregunta no aporta información. Las preguntas que más sirven son las incómodas: las que podrían tumbar un requisito que ya diste por bueno.

**Una pregunta, una decisión.**
Mecanismo: una pregunta doble ("¿cómo buscan un archivo y qué hacen cuando no aparece?") recibe media respuesta y no sabes a cuál mitad corresponde.

**Ofrece opciones solo si salen de lo observado.**
Mecanismo: opciones concretas bajan el esfuerzo de responder, pero opciones inventadas anclan la respuesta. Usa las que viste en el legacy o en reglas parecidas del sistema, máximo 3, siempre con "otra". Di qué cambia en el requisito con cada una.

## 3. Qué NO preguntar

| No preguntes | Por qué | Qué hacer en su lugar |
|---|---|---|
| Frecuencia de uso | Se infiere del propósito del módulo | Anótala como supuesto con su base: "consulta diaria (inferido: los análisis generan archivos a diario)" |
| Dispositivo o tamaño de pantalla | Se infiere del contexto de trabajo; la adaptación a pantallas es de Kompa | Supuesto marcado; si hay duda real, la resuelve otro rol |
| Quién lo usa | Se infiere del propósito y de los niveles de acceso del legacy | Describe a los usuarios por nivel y circunstancia, como supuesto |
| Entorno (servidor, configuración, navegador, Docker) | No es decisión de producto | Va al checklist de implementación |
| Cómo se debe ver, dónde va un botón, qué componente usar | Es de Kompa | No lo anotes como requisito |
| Tablas, columnas, endpoints, tipos de dato | Es dForja | Anota la regla de negocio; el cómo lo decide él |
| "¿Te gusta…?", "¿Sería útil…?", "¿Lo usarías?" | Respuesta siempre "sí" | Pregunta por la última vez que ocurrió la situación |
| Lo que el código ya responde | Gasta una de las 5 | Léelo y anótalo como hecho con fuente |

## 4. Cómo redactar cada pregunta

Cada pregunta lleva cuatro partes, en este orden:

1. **Hecho de contexto** (una línea, con fuente): qué hace hoy el legacy o qué se sabe.
2. **La pregunta** (una sola): sobre un caso pasado concreto o sobre la regla.
3. **Opciones** (si aplica): máximo 3 más "otra", cada una con su efecto en el requisito.
4. **Supuesto por defecto**: qué vas a asumir si Kevin no responde o no sabe, para que no quede bloqueado.

Frases ancla que fuerzan hechos: "la última vez que…", "¿qué se hizo cuando…?", "¿quién lo hizo y con qué nivel?", "¿hay algún caso en que no se cumpla?", "¿qué pasa si…?" (solo para reglas, no para gustos).

## 5. Detectar respuestas vagas y convertirlas en regla

Prueba rápida: si la respuesta no se puede asociar a un caso, una cantidad, un nivel de acceso o un resultado observable, todavía no es regla.

| Señal | Ejemplo | Qué falta | Repregunta o conversión |
|---|---|---|---|
| Generalización ("normalmente", "casi siempre", "a veces") | "Normalmente se sube el archivo al terminar el análisis" (ejemplo hipotético) | Qué pasa en la excepción | "¿Cuándo fue la última vez que se subió antes o después? ¿Qué pasó?" → regla con la condición explícita, o "sin regla de momento" |
| "Depende" | "Depende del archivo" | La condición escondida | "¿De qué depende? Dame el último caso de cada lado" → regla con condición en el Dado |
| Adjetivo de calidad ("rápido", "fácil", "seguro") | "Que encontrar sea fácil" | Algo observable | "¿Con qué dato buscaron la última vez que no lo encontraron?" → "Se puede localizar un archivo conociendo solo el folio de la muestra" |
| "Como está ahora" | "Que suba igual que el viejo" | Qué parte del actual es regla y cuál defecto | Describe el comportamiento observado y pregunta si se conserva: "Hoy, al subir con un nombre repetido, se reemplaza el archivo (ejemplo hipotético). ¿Se conserva?" |
| Solución en lugar de regla | "Pon una papelera" | La necesidad detrás, y si ya hay regla | Revisa las reglas aprobadas: la recuperación es manual, a petición y fuera del módulo. La petición no genera requisito; se anota como idea ya resuelta por regla |
| Futuro hipotético | "Luego vamos a querer versiones" | Si entra en este alcance | Anótalo como fuera de alcance o como pregunta abierta, no como requisito |
| Absolutos ("todos", "nadie", "nunca") | "Nunca se suben dos archivos con el mismo nombre" (ejemplo hipotético) | Contraejemplo | "¿Ha pasado alguna vez? ¿Qué se hizo?" |
| "No sé" | — | Dueño de la respuesta | Aplica el supuesto por defecto, márcalo como supuesto y anota quién lo puede confirmar |

Receta para convertir una respuesta en regla, con cinco piezas:

- **Quién**: nivel de acceso o rol (no nombre de persona).
- **Acción**: qué intenta hacer (buscar, abrir, subir, crear carpeta, retirar).
- **Condición**: estado previo que la habilita o la impide.
- **Resultado observable**: qué cambia y quién lo nota.
- **Excepción**: el caso que no cumple, o "ninguna" dicho explícitamente.

La regla está lista cuando alguien que no estuvo en la conversación puede decir "se cumple" o "no se cumple" sin preguntarte nada.

## 6. Checklist antes de enviar

- [ ] Son 5 preguntas o menos y cada una bloquea la aprobación.
- [ ] Ninguna pregunta por frecuencia, dispositivo, quién usa ni entorno.
- [ ] Ninguna se responde leyendo el legacy.
- [ ] Ninguna menciona interfaz, componentes ni tecnología.
- [ ] Cada una pide un caso pasado o una regla, no un gusto.
- [ ] Ninguna es doble ni sugiere la respuesta.
- [ ] Cada una trae hecho de contexto y supuesto por defecto.

## 7. Ejemplo: gestor de archivos

Hechos (reglas aprobadas): permisos globales para todo el repositorio, no por carpeta. Nivel 1 Administración hace todo (consultar, descargar, subir/actualizar/corregir, crear y renombrar carpetas, retirar). Nivel 2 Edición consulta, descarga y sube/actualiza/corrige; no crea carpetas ni retira. Nivel 3 consulta y descarga. Nivel 4 solo consulta. Retirar es solo de nivel 1, pide confirmación y lo retirado deja de verse para todos. La recuperación y el borrado final son manuales, a petición y fuera del módulo. La carpeta raíz no se retira.

Preguntas que NO se envían:

- "¿Con qué frecuencia suben archivos?": se infiere.
- "¿Lo usan en tablet?": se infiere o lo decide otro rol.
- "¿Te gustaría arrastrar archivos para subir?": es una solución y es hipotética.
- "¿Cómo quieres que se vea la confirmación?": la decide Kompa.
- "¿Quién puede retirar?" y "¿retirar pide confirmación?": ya son reglas aprobadas.
- "¿Ponemos una papelera para recuperar?": la recuperación es manual y queda fuera del módulo.
- "¿Cada carpeta tiene sus propios permisos?": los permisos son globales.

Preguntas que sí se envían. Todas son ejemplos hipotéticos: enseñan la forma, sus respuestas no se conocen y los "hechos del legacy" que citan deben verificarse en el código.

1. **Subir con nombre repetido.** Contexto: nivel 1 y 2 suben, actualizan y corrigen. Pregunta: la última vez que alguien subió un archivo con un nombre que ya existía en la carpeta, ¿qué se hizo? Supuesto por defecto: un archivo existente no se reemplaza a menos que quien sube lo indique como actualización.
2. **Corregir.** Contexto: corregir es permiso de nivel 1 y 2. Pregunta: la última vez que se corrigió un archivo ya entregado, ¿alguien pidió el anterior? Supuesto: solo queda consultable la versión vigente.
3. **Buscar.** Pregunta: la última vez que alguien no encontró un archivo, ¿qué dato tenía a la mano? Supuesto: nombre parcial y folio de muestra.
4. **Retirar una carpeta con contenido.** Contexto: solo nivel 1 retira y la raíz no se retira. Pregunta: la última vez que se retiró una carpeta, ¿tenía archivos? ¿Qué pasó con ellos? Supuesto: lo retirado incluye su contenido y deja de verse para todos.
5. **Registro del retiro.** Contexto: la recuperación es manual y se hace a petición. Pregunta: la última vez que alguien pidió recuperar algo, ¿con qué dato se identificó qué recuperar? Supuesto: queda constancia de qué se retiró, quién lo retiró y cuándo.

## 8. Errores comunes

| Error | Por qué falla | Corrección |
|---|---|---|
| Mandar 12 preguntas "por si acaso" | Kevin responde las fáciles; las críticas se pierden | Solo bloqueantes; el resto como supuestos |
| Preguntar "¿está bien así?" | Confirma lo que ya pensabas | Pregunta por el último caso real |
| Aceptar "sí, eso" como regla | No dice excepción ni condición | Aplica la receta de cinco piezas |
| Anotar la solución que dio Kevin como requisito | Ata a Kompa | Regístrala como idea y extrae la necesidad |
| Dejar un "no sé" sin supuesto | El requisito queda bloqueado | Supuesto por defecto, marcado y con dueño |

## 9. Límites

Esta referencia decide qué preguntar y cómo convertir respuestas en reglas. No decide pantallas, acomodo, componentes, datos ni APIs; si la respuesta de Kevin trae una de esas decisiones, se anota como insumo para el rol dueño, no como requisito.

Adaptado de wondelai/skills (mom-test, basado en "The Mom Test" de Rob Fitzpatrick), licencia MIT.
