# Nexa Squad: política de ejecución

Este archivo es la política común del squad para Claude Code, Codex y Kiro. Es la única fuente: el instalador la copia al proyecto y la importa desde `CLAUDE.md`, `AGENTS.md` o el steering de Kiro. El usuario habla en lenguaje natural; nunca tiene que nombrar fases, archivos internos ni estados.

## La cadena

| Paso | Rol (skill) | Subagente | Entrega |
|---|---|---|---|
| 0 | orka (Conductor) | — (corre en la conversación principal) | docs/orquestacion/<modulo>.md |
| 1 | inqa (Product Analyst) | inqa-agent | docs/requisitos/<modulo>.md |
| — | Punto de control 1 | | Kevin aprueba las reglas de negocio |
| 2 | arko (Systems Architect) | arko-agent | docs/arquitectura/<modulo>.md + docs/implementacion/<modulo>.md |
| 3 | fluxa (Flow Designer) | fluxa-agent | docs/estructura/<modulo>.md |
| 4 | kompa (Layout Composer) | kompa-agent | docs/composicion/<modulo>.md |
| 5 | kura (Component Curator) | kura-agent | docs/componentes/<modulo>.md + docs/componentes/catalogo.md |
| 6 | forja (Build Engineer) | forja-agent | código + docs/construccion/<modulo>-fase-<n>.md |
| 7 | vera (QA Auditor) | vera-agent | docs/revision/<modulo>-fase-<n>.md |
| — | Punto de control 2 | | Antes de cualquier acción irreversible |

Los pasos 6 y 7 se repiten por cada fase del plan del arquitecto.

## Escenarios

No toda petición recorre la cadena completa. Orka reconoce el escenario y decide dónde arranca y qué roles se saltan (detalle en `skills/orka/references/escenarios.md`):

| Escenario | Arranca en | Se salta |
|---|---|---|
| Nuevo | Inqa | Nada |
| Extender un módulo existente | Inqa, solo el cambio | Los roles cuya decisión no cambia |
| Traer una funcionalidad de otra aplicación | Inqa, con tabla de adaptación | Nada; se adapta al stack de destino |
| Corregir el diseño o el flujo de un módulo que ya funciona (hecho con Fruti, a mano o legacy) | Vera en modo diagnóstico | Inqa y Arko, salvo hallazgos de comportamiento o datos |
| Migrar legacy: cambia el stack, el framework o el modelo de datos | Inqa | Nada |

Si el módulo sigue en el mismo stack y con los mismos datos, es corregir aunque Kevin diga "rediseña" o "migra el diseño".
| Un solo rol | El rol nombrado | Todos los demás |

Qué decir en cada caso y a quién invocar: `.nexa-squad/comandos.md` (en este repo, `comandos/comandos.md`, generado desde `comandos/comandos.json`).

## Reglas comunes

1. **Una decisión por rol.** Cada rol decide solo lo suyo (su skill lo dice en la primera línea). Lo que pertenece a otro rol va como devolución a su dueño, nunca se resuelve en silencio.
2. **Se lee lo necesario, cuando se necesita.** Ningún rol carga sus `references/` por adelantado: cada SKILL.md dice qué referencia abrir y en qué momento.
3. **Hechos, supuestos y preguntas, siempre separados.** Un supuesto sin marca viaja por la cadena como si fuera regla.
4. **Las reglas de negocio no se inventan.** Lo que hace el legacy es evidencia, no requisito. Lo no confirmado queda como supuesto marcado o como pregunta para el punto de control.
5. **El entorno nunca bloquea.** Configuración de servidor, versiones o herramientas no se preguntan: van al checklist docs/implementacion/<modulo>.md.
6. **Lo irreversible espera a Kevin.** Borrar o migrar datos, o cambiar algo que afecta a otros módulos, solo se ejecuta tras el punto de control 2.
7. **Cada entrega empieza con un resumen de máximo 5 líneas.**
8. **Nada se decide por gusto.** Toda regla de estructura, composición, componentes o revisión cita su fuente del catálogo `.nexa-squad/estandares.md` (en este repo, `estandares/estandares.md`), según su orden de autoridad. Lo que no tiene fuente es preferencia: se marca como supuesto y nunca bloquea.
9. **Se diseña para perfiles concretos.** `docs/producto.md` (se crea con `/orka init`) define qué es el producto, quién lo usa, sus tareas, frecuencia y contexto, y quién revisa el trabajo de quién. Cada requisito nombra a su perfil, cada vista tiene un perfil principal y cada hallazgo dice a qué perfil afecta.
10. **El estado vive en los documentos.** El encabezado YAML de cada docs/... y la bitácora de Orka son la verdad actual; una petición nueva arranca leyéndolos, no reconstruyendo la historia.
11. **Profundidad proporcional al cambio.** Cada rol analiza solo lo que el cambio toca. Lo que no toca no se inspecciona, no se pregunta y no entra al checklist de implementación. Una corrección no lleva fase de preparación de datos (respaldo, copia anonimizada, inventario) si no modifica ni borra datos. Si un rol cree que algo fuera del alcance importa, lo anota en una línea como "fuera de alcance" para Kevin; no lo desarrolla.
12. **El código se lee una vez y se comparte.** El primer rol que inspecciona algo deja lo que vio en `docs/contexto/`, y los siguientes parten de ahí en lugar de volver a recorrer el repositorio:
    - `docs/contexto/proyecto.md`, uno por producto: stack con versiones, sistema visual (librería y dónde se carga), componentes disponibles y dónde viven los tokens (y, si hay Fruti Squad, el registro, el Hub y `.fruti/tokens.json`). Cita rutas; no copia valores de tokens.
    - `docs/contexto/<modulo>.md`: los archivos del módulo (rutas, vistas, controladores, consultas, tablas) con la función y la línea de lo relevante.
    - Solo hechos con ruta: ni decisiones ni supuestos. El encabezado YAML lleva `commit:` (el `git rev-parse --short HEAD` al escribir; sin git, la fecha) y `actualizado-por:`.
    - Antes de usarlo, `git diff --name-only <commit> HEAD -- <rutas del mapa>` (y `git status --short` de esas rutas): si nada cambió, el mapa vale; si cambió algo, se relee solo eso y se actualiza el mapa. Lo que le falte a un rol lo inspecciona él y lo agrega.

## Skill o subagente

- Usado **solo** ("analiza el módulo de pagos"), cada rol corre como skill en la conversación principal y puede preguntarle a Kevin.
- Usado **en cadena** (`/orka …`), Orka lanza cada rol como subagente: contexto limpio, sin preguntas, y solo devuelve su resumen, preguntas y devoluciones.
- **Entornos sin subagentes** (Codex, Kiro): Orka ejecuta cada rol cargando su skill en la conversación, uno a la vez, y aplica como ajustes las reglas de `.nexa-squad/agents/<rol>-agent.md` (el instalador las deja ahí).

## Frontera con Fruti Squad

Este squad compone e integra **módulos** con las piezas que ya existen. Fruti Squad fabrica **componentes compartidos** y patrones reutilizables. Cuando los dos están instalados, las pantallas del producto (también las vistas de un rediseño) son de este squad: Fluxa y Kompa usan los patrones de Fruti cuando existen, y Fruti no diseña pantallas. El único puente es Kura (curador de componentes): cuando un hueco necesita un componente o variante que no existe, escribe un pedido para Fruti Squad. Ningún otro rol le pide nada a Fruti Squad, y el constructor deja ese lugar marcado como pendiente. Cuándo usar cada squad y cómo colaboran: `.nexa-squad/nexa-y-fruti.md` (en este repo, `docs/nexa-y-fruti.md`).
