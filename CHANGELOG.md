# Cambios

## Sin publicar

- Regla común 14, estado por tarea y registro compartido. Cada hallazgo es una fila de la tabla de tareas de Orka (`pendiente`, `hecho`, `verificado`, `pulido`): Forja recibe solo las pendientes y Vera revisa solo las hechas, con `git diff`. `docs/registro.md` es un log compartido donde cada rol anota qué hizo, cuándo empezó, cuándo terminó y cuántos minutos le tomó; Orka suma desde ahí el tiempo por rol y el tiempo hasta el primer código. Sirve en Kiro y Codex, donde `npm run medir` no tiene transcripción.
- Al corregir, el diagnóstico de Vera corre en la conversación de Orka con una checklist corta (`references/diagnostico-rapido.md`) y, si impecable está instalado, con su detector (`impeccable detect`). Las otras referencias de Vera quedan para revisar contra documentos aprobados.
- Versión para Kiro, según la guía "Kiro — Agents, Skills & Steering": skills en `.kiro/skills/`, un agente por rol en `.kiro/agents/` con su skill (`skill://`), las reglas comunes (`file://`) y permisos de menor privilegio; `orka` delega con la herramienta de subagentes (`availableAgents`, `trustedAgents`; Forja no es de confianza porque escribe código). El steering es `always` y corto, e incluye la política con `#[[file:…]]`.
- `update`: renueva lo del squad sin tocar `docs/` ni `ejecucion.json`. Con `--dry-run` dice, archivo por archivo, qué es nuevo, qué cambia, qué queda igual y qué quedó obsoleto de una instalación anterior (no lo borra).
- `install` ya no reporta como "omitido" lo que está igual; solo lo que cambiaste.
- Kura y Kompa leen primero `.fruti/catalog.md` (catálogo corto que mantiene Mora en Fruti Squad) y abren el Design Hub solo para la pieza elegida cuando al catálogo le falta un dato. Si el catálogo no existe, el primer pedido de Kura a Fruti es generarlo.
- Modelo y esfuerzo por rol en cada subagente: Opus para Inqa, Arko (esfuerzo alto), Forja y Vera; Sonnet para Fluxa y Kompa (esfuerzo alto) y para Kura. Criterio y forma de revertir en `docs/arquitectura.md`, sección 11. `npm test` exige ambos campos.
- Al corregir, Fluxa, Kompa y Kura hacen un solo pase en la conversación de Orka, en vez de correr como 3 subagentes que releían el mismo código. Antes de Forja quedan 1 subagente (Vera) en lugar de 4.
- Regla común 13, "Decide y entrega": una decisión con fuente en lugar de un menú de alternativas, referencias solo cuando su disparador coincide, citar en lugar de copiar y no reabrir lo ya decidido sin evidencia nueva.
- Vera: si Kevin nombra una región, el diagnóstico audita solo esa región y no hace el recorrido de punta a punta.
- Subagentes: `disallowedTools: Agent` en lugar de pedirlo en el texto.
- El código se lee una vez y se comparte (regla común 12): el primer rol que inspecciona deja un mapa con rutas en `docs/contexto/proyecto.md` (stack, sistema visual, componentes, tokens) y `docs/contexto/<modulo>.md` (archivos del módulo). Los siguientes parten de ahí y releen solo lo que cambió desde el `commit` del mapa. Inqa, Arko, Fluxa, Kompa, Kura, Forja, Vera y Orka lo usan.
- Orka abre `references/escenarios.md` solo si la frase no cae en su tabla de escenarios o un rol necesita el detalle del escenario.
- `npm run medir -- <transcripcion.jsonl>`: mide una corrida de Claude Code (tiempo total, hasta que arranca Forja, hasta el primer código, y por rol: duración, lecturas de código y herramientas). `evals/resultados.md` registra tiempos además de calidad.
- Vera: `no-pasa` solo por un bloqueante o una regresión fuera del alcance; importantes y menores van a una lista de pulido que Kevin decide. Desde la segunda vuelta revisa solo lo cambiado y lo que seguía abierto. En el diagnóstico marca `corregir-ahora` lo que entra a la cadena.
- Orka: en corregir lanza a Fluxa, Kompa y Kura solo con los hallazgos `corregir-ahora`; los documentos intermedios no fijan píxeles salvo que la medida sea el hallazgo.
- Profundidad proporcional al cambio (regla común 11): cada rol analiza solo lo que el cambio toca; lo demás queda en una línea "fuera de alcance". Orka anota el alcance en la bitácora y devuelve los documentos que se salen de él.
- Corregir frente a migrar: corregir el diseño o el flujo de un módulo que sigue en el mismo stack y con los mismos datos es "corregir", aunque sea legacy o la frase diga "rediseña". "Migrar" queda solo para cambios de stack, framework o modelo de datos.
- Arko: sin fase de preparación de datos (respaldo, copia anonimizada, inventario) si el cambio no modifica ni borra datos; el checklist de implementación lista solo lo que el cambio toca.
- `.nexa-squad/ejecucion.json`: lista de roles que Orka ejecuta en su propia conversación en lugar de como subagentes; vacía por defecto. Sirve para juntar roles uno a uno midiendo con `evals/`.
- `evals/`: 6 tareas de prueba con rúbrica (registro, CIE-10, signos vitales, corregir cuentas, traer bitácora, captura y revisión) para medir cambios antes de hacerlos.
- `docs/arquitectura.md`: revisión frente al artículo de Anthropic sobre cuándo juntar subagentes en el agente principal.

## 0.5.0 (2026-11-08)

- `/orka init` y `npx … init`: se describe una vez qué es el producto, a quién se dirige, sus roles y quién revisa a quién. El documento pasa de `docs/usuarios.md` a `docs/producto.md`.
- `docs/producto.md` tiene la tabla "Módulos y quién los usa"; cada petición de módulo dice qué rol lo usa y qué hace ahí, y Vera recorre esas tareas al diagnosticar.
- Corregir el diseño: si una tarea mencionada no existe hoy en el módulo, se propone como cambio aparte (extender).

## 0.4.0 (2026-11-08)

- Perfiles de usuario: `docs/usuarios.md` (uno por producto) define quién usa el sistema, sus tareas, frecuencia, contexto y quién revisa el trabajo de quién. Lo escribe Inqa con lo que diga Kevin y se aprueba en el punto de control 1.
- Todos los roles lo usan: requisitos por perfil (Inqa), permisos y rastro por perfil (Arko), perfil principal por vista (Fluxa), densidad según el perfil (Kompa), recorridos por perfil (Vera). Orka pregunta por los perfiles si faltan.

## 0.3.0 (2026-11-08)

- Guía de comandos (`comandos/comandos.json` → `comandos/comandos.md`): qué decir según lo que quieres y a quién invoca. Se instala en `.nexa-squad/comandos.md`.
- CLI: `comandos` muestra la guía y `quien "<frase>"` sugiere el comando para lo que describes.
- Cada skill tiene su sección "Cómo se invoca"; Orka responde "¿a quién invoco?" y ya no pregunta el escenario cuando la frase lo dice.

## 0.2.0 (2026-11-08)

- Composición como centro del squad: Kompa compone formularios completos, patrones (colección, maestro-detalle, cuadrícula de medidas, línea de tiempo) y cada pieza en su contexto (ancho, vecinos, iconos, leyendas).
- Fluxa identifica la forma del dato y elige el patrón; declara unidades de campos y condicionales.
- Catálogo de estándares (`estandares/estandares.md`) con orden de autoridad; toda regla cita su fuente. El instalador lo copia a `.nexa-squad/estandares.md`.
- Escenarios de Orka: nuevo, extender, traer de otra aplicación, corregir composición, legacy y un solo rol. Vera tiene modo diagnóstico; Inqa entrega tabla de adaptación para funcionalidades traídas.
- Kompa: mapeo entre acción y efecto. Arko: adaptar una funcionalidad de otra aplicación (glosario y capa de traducción). Estándares: tensiones entre heurísticas. Todo adaptado de wondelai/skills (MIT).
- Kura lee el perfil, tokens, registro y Hub de Fruti Squad y escribe pedidos en `docs/componentes/pedidos/`.

## 0.1.0 (2026-11-08)

- Primera versión: Orka, Inqa, Arko, Fluxa, Kompa, Kura, Forja y Vera, tomados de las fichas de Notion "Nuevo squad: roles y avance".
- Instalador para Claude Code (skills + subagentes), Codex y Kiro (skills + ajustes de rol).
- Validador del paquete (`npm test`).
- Ajuste frente a Notion: Forja y Vera usan sus propios estados (`lista-para-revision`, `veredicto`) en lugar de `borrador`.
