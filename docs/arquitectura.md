# Arquitectura de Nexa Squad

## 1. La pieza que decide: skill o subagente

| | Skill | Subagente |
|---|---|---|
| Dónde corre | En la conversación principal | En un contexto nuevo y aislado |
| ¿Puede preguntarle al usuario? | Sí | No, solo devuelve un resultado |
| ¿Puede lanzar a otros roles? | Sí (herramienta Agent) | No. Un subagente no lanza a otro |
| Qué tiene en contexto | Toda la conversación | Su encargo y las skills que carga |
| Qué recibe el principal | Todo lo que hizo | Solo el resumen final |

Dos reglas salen de esa tabla:

1. **Si un rol debe preguntarte o dirigir a otros, va como skill.** Ese es Orka.
2. **Si un rol hace trabajo pesado y solo debe pasar un resultado, va como subagente.** Esa es la cadena: cada rol lee mucho código y devuelve 5 líneas.

## 2. Decisión por rol

| Rol | Forma | Por qué |
|---|---|---|
| Orka · Conductor | Solo skill | Pregunta en los puntos de control 1 y 2, y lanza a los demás. Como subagente no podría hacer ninguna de las dos cosas. |
| Inqa · Product Analyst | Skill + subagente | Su valor está en preguntar reglas de negocio. En la cadena, sus preguntas se juntan para el punto de control 1. |
| Arko · Systems Architect | Skill + subagente | Lee código y esquemas; aislarlo protege el contexto de Orka. |
| Fluxa · Flow Designer | Skill + subagente | Trabaja sobre documentos, y su entrada ya viene aprobada. |
| Kompa · Layout Composer | Skill + subagente | Inspecciona estilos y tokens del proyecto. |
| Kura · Component Curator | Skill + subagente | Cuenta los usos de cada pieza en todo el repo, una búsqueda amplia. |
| Forja · Build Engineer | Skill + subagente | Es el que más contexto consume, porque escribe código. Corre una fase por vuelta. |
| Vera · QA Auditor | Skill + subagente | Un contexto limpio no carga el razonamiento de Forja, y eso le da independencia real. |

## 3. Una sola fuente por rol

- `skills/<rol>/SKILL.md` contiene todas las reglas del rol.
- `agents/<rol>-agent.md` no repite reglas: carga la skill (`skills: [<rol>]`) y agrega los ajustes de cadena. Esos ajustes son no preguntar, resolver por inspección lo que se pueda, clasificar lo que quede, no autoaprobarse y no lanzar otros roles.
- `AGENTS.md` es la política común; el instalador la copia a `.nexa-squad/politica.md`.
- `squad.json` es la fuente del instalador y del validador.

## 4. El estado vive en los documentos

Cada rol entrega un documento en `docs/` con encabezado YAML (`estado`, o `veredicto` en el caso de Vera). Orka lleva la bitácora en `docs/orquestacion/<modulo>.md`. Una petición nueva ("continúa el gestor") arranca leyendo esos encabezados, no reconstruyendo la conversación.

## 5. Lectura progresiva

Ningún rol carga sus `references/` por adelantado. Cada SKILL.md dice qué referencia abrir y en qué momento. Es el mismo principio que Fruti Squad aplica con sus contratos `.fruti/runtime/*.yaml`: **primero enrutar, después leer**.

Lo mismo vale para el código del proyecto (regla común 12): el primer rol que lo inspecciona deja un mapa con rutas en `docs/contexto/proyecto.md` (stack, sistema visual, componentes, tokens) y `docs/contexto/<modulo>.md` (archivos del módulo). Los subagentes no comparten contexto entre sí, así que sin ese mapa cada uno volvía a recorrer el repositorio. El mapa guarda el `commit` en que se escribió; con `git diff` se sabe qué archivos cambiaron y solo esos se releen.

## 6. Comparación con Fruti Squad

| Fruti Squad | Nexa Squad |
|---|---|
| Kiwi, Coco y Mora son `AGENT.md`; en Claude Code se instalan como skills | Cada rol es skill y además tiene subagente |
| `.fruti/runtime/<agente>.yaml` indica qué leer | Cada SKILL.md indica qué referencia leer y cuándo |
| `.fruti/state` y `handoffs/current.json` | Encabezados YAML de `docs/` y bitácora de Orka |
| Lima rechaza y devuelve a Kiwi, sin redibujar | Cada devolución va al dueño de la decisión, con máximo 2 vueltas |
| Fabrica componentes compartidos | Compone módulos. Kura es el único que le hace pedidos a Fruti |

## 7. Pendientes conocidos

- La línea base de `evals/` (calidad y tiempo con `npm run medir`) todavía no se ha corrido. Sin ella no se decide ninguno de los cambios pendientes de la sección 9.
- Forja y Vera todavía no tienen una prueba real; la primera evidencia útil es correr la fase 1 del gestor.
- Para verificar el campo `skills:` de los subagentes: corre `/agents` y pídele a `inqa-agent` que diga qué skill tiene cargada.

## 8. Revisión frente a "cuándo juntar subagentes en el agente principal"

Fuente: Anthropic, *Building agents: when to fold subagents into your main agent loop*. Su tesis: un solo agente con skills que se cargan cuando hacen falta suele dar mejor calidad, menos costo y menos latencia que una cadena de subagentes; un subagente se conserva solo cuando la evaluación muestra que el agente único empeora.

| Lo que dice el artículo | Cómo está Nexa | Lectura |
|---|---|---|
| Separar por contexto, no por tipo de problema; separar por tipo de problema crea un "teléfono descompuesto" | La cadena separa por tipo de problema: requisitos, estructura, composición, componentes | Riesgo real, mitigado en parte porque cada rol escribe un documento completo en `docs/` y el siguiente lo lee entero, no un resumen |
| Juntar primero a los especialistas que encadenan su salida y tocan los mismos datos | Fluxa → Kompa → Kura trabajan sobre la misma vista, uno tras otro | Primer candidato a correr como skills en la conversación de Orka |
| Un subagente que necesita hablar con el usuario no debería ser subagente | Inqa en cadena no puede preguntar; sus preguntas esperan al punto de control | Candidato a correr como skill |
| Subagente útil cuando hay contexto que crece mucho o trabajo en paralelo que se descarta | Forja lee y escribe mucho código; Vera necesita independencia del razonamiento de Forja | Se quedan como subagentes |
| Medir antes de cambiar: ~10 tareas doradas, correr dos veces, cambiar una cosa a la vez | No había evaluaciones | Se agregó `evals/` con 6 casos |

Plan (aprobado por Kevin): correr `evals/` con la forma actual; después agregar uno a uno `fluxa`, `kompa`, `kura` e `inqa` a `.nexa-squad/ejecucion.json` (`en-conversacion`) y conservar cada cambio solo si ningún caso empeora.

## 9. Rendimiento: auditoría del 2026-11-10

Una auditoría externa propuso acelerar el squad. Cada punto se comprobó contra el repositorio antes de decidir.

| Propuesta | Qué se encontró | Decisión |
|---|---|---|
| Caché compartido del código | Cierto: Inqa, Arko, Kompa, Kura y Vera recorrían el repositorio por separado; Kompa y Kura repetían el mismo inventario | Aplicado: regla común 12 y `docs/contexto/` |
| Orka razona el escenario en cada petición | En parte: no hay llamada extra al modelo (Orka corre en la conversación principal), pero abría `escenarios.md` (142 líneas) siempre | Aplicado: lo abre solo si su tabla no resuelve la frase |
| Script de detección de escenario | Agregaría un paso; la tabla de Orka ya enruta por palabras de la frase | No se aplica |
| Activar prompt caching | Claude Code ya lo hace | No se aplica |
| Medir antes y después | No había medida de tiempo | Aplicado: `npm run medir` y columnas de tiempo en `evals/resultados.md` |
| Modelo ligero para algunos subagentes | Kura y Fluxa toman decisiones, no solo cuentan; puede bajar la calidad | Pendiente: decidir con `evals/` |
| Recortar los SKILL.md | Ganancia probable pequeña: el tiempo se va sobre todo en llamadas a herramientas y en lo que el modelo escribe (inferencia, sin medir) | Pendiente: decidir con `evals/` |
| Paralelizar Arko y Fluxa, o Forja y Vera | Fluxa usa los permisos de Arko; Vera puede devolver la fase que Forja ya está extendiendo | Pendiente: decisión de Kevin |
| Fusionar roles | Es el plan de la sección 8, medido uno a uno con `en-conversacion` | Sigue el plan de la sección 8 |

## 10. Corregir sin sobreanalizar (2026-11-11)

Síntoma: corregir el diseño de un formulario o de una sección tardaba de 1 a 1.5 horas solo en armar el plan. Revisión contra la documentación de Claude Code (skills, subagentes, buenas prácticas de skills) y el *Manual de Construcción y Auditoría de Skills* de Notion. Kevin delegó la decisión.

| Hallazgo | Evidencia | Decisión |
|---|---|---|
| El formato está bien | Frontmatter válido, SKILL.md de menos de 500 líneas, una sola capa de referencias, cada referencia con índice y `skills:` en los subagentes | Sin cambios |
| El costo fijo por rol domina en una corrección | Antes de Forja corrían 4 subagentes: Vera, Fluxa, Kompa y Kura. Cada uno empezaba de cero, leía su skill, el catálogo, de 2 a 5 referencias y el mismo código, y escribía un documento. La documentación de Claude Code recomienda la conversación principal cuando "varias fases comparten mucho contexto" o "importa la latencia" | Aplicado: al corregir, Fluxa, Kompa y Kura hacen un solo pase en la conversación de Orka (regla en la política, en Orka y en `escenarios.md`). Es el plan de la sección 8, adelantado solo para corregir |
| Las reglas de proporción no bastaron | Las reglas 11 y "solo `corregir-ahora`" acotan qué se analiza, pero no reducen el número de arranques | Por eso se quitan arranques en lugar de agregar reglas |
| Los roles podían abrir referencias "por si acaso" y presentar alternativas | Buenas prácticas de Anthropic: "Claude is already very smart", "Don't present multiple approaches unless necessary" | Aplicado: regla común 13 (decide y entrega) |
| El diagnóstico de Vera recorría todo el módulo | El modo diagnóstico no distinguía entre revisar una región y revisar un módulo | Aplicado: si Kevin nombra una región, Vera audita solo esa región, sin recorrido de punta a punta |
| Los subagentes podían lanzar otros | La regla estaba solo en texto. El manual pide quitar la herramienta | Aplicado: `disallowedTools: Agent` en los 7 subagentes |

Cómo comprobarlo: corre `npm run medir` sobre la transcripción de una corrección hecha antes de este cambio y sobre una hecha después, con el mismo módulo. La cifra que importa es el tiempo hasta el primer código. Si la calidad de la composición baja (caso 04 de `evals/`), se revierte quitando el párrafo "Al corregir" del paso 4 de Orka.

Se revisaron también los prototipos (`kiwi-art-director`, `lima-governance`, `coco-visual`, `fruti-squad-kiro`) y `taller-agentes`. Se adoptó la idea de limitar las herramientas en el frontmatter en vez de pedirlo en texto. No se adoptó lo que suma análisis, como la regla del prototipo de Kiwi de presentar siempre tres alternativas A, B y C. De `taller-agentes`, el método (un ejercicio fijo con clave y un solo cambio a la vez) ya está en `evals/`.
