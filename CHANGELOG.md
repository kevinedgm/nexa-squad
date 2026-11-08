# Cambios

## Sin publicar

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
