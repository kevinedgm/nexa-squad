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

## 6. Comparación con Fruti Squad

| Fruti Squad | Nexa Squad |
|---|---|
| Kiwi, Coco y Mora son `AGENT.md`; en Claude Code se instalan como skills | Cada rol es skill y además tiene subagente |
| `.fruti/runtime/<agente>.yaml` indica qué leer | Cada SKILL.md indica qué referencia leer y cuándo |
| `.fruti/state` y `handoffs/current.json` | Encabezados YAML de `docs/` y bitácora de Orka |
| Lima rechaza y devuelve a Kiwi, sin redibujar | Cada devolución va al dueño de la decisión, con máximo 2 vueltas |
| Fabrica componentes compartidos | Compone módulos. Kura es el único que le hace pedidos a Fruti |

## 7. Pendientes conocidos

- Forja y Vera todavía no tienen una prueba real; la primera evidencia útil es correr la fase 1 del gestor.
- Para verificar el campo `skills:` de los subagentes: corre `/agents` y pídele a `inqa-agent` que diga qué skill tiene cargada.
