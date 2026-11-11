# Arquitectura

## Por qué tres skills y no ocho agentes

Hasta la 0.5, Nexa tenía un orquestador (Orka) y siete roles que corrían como subagentes, cada uno con su documento: requisitos, arquitectura, estructura, composición, componentes, construcción y revisión. Corregir un formulario podía tardar una hora aunque el cambio fuera agregar separadores.

La causa no era la falta de reglas de proporción (se agregaron varias y no bajó el tiempo). Era el costo fijo de cada rol: arrancar en frío, releer su skill, el catálogo y el mismo código, escribir un documento y esperar a que Orka lo aprobara. Una regla que dice "analiza solo lo que toca" pierde contra los pasos obligatorios de cada rol.

La 1.0 deja solo las decisiones que de verdad tienen dueños distintos:

| Skill | Absorbe a | Por qué |
|---|---|---|
| kompa | Fluxa (contenido y estructura de la pantalla), Kura (reutilizar y pedir a Fruti), el diagnóstico de Vera | Qué dice, cómo se agrupa y cómo se ve una pantalla es una sola decisión. Separadas, el contenido (ayudas, consecuencias) se perdía entre roles |
| forja | Arko (datos, permisos, migraciones) | Quien escribe el código decide cómo se guarda; las referencias de integridad y migración siguen ahí |
| inqa | — | Las reglas de negocio no se inventan; solo hace falta para lo nuevo |

Orka desaparece: no hay cadena que orquestar. El problema regresa al dueño de la decisión que falló, en una línea, dentro de la misma conversación.

## Principios

- **En la conversación.** Ninguna skill corre como subagente: comparten lo que ya se leyó y no esperan aprobaciones intermedias.
- **El alcance lo pone la petición.** Un cambio concreto se hace sin diagnóstico ni preguntas.
- **Estándares, no plantillas.** Kompa califica con 22 filas comprobables, cada una con su fuente del catálogo. Las referencias se abren solo si una fila falla y no se sabe cómo corregirla.
- **Sin documentos intermedios.** La entrega es el código y un resumen de 12 líneas. Solo Inqa escribe requisitos, y solo para lo nuevo.

## Qué instala

| Destino | Skills | Instrucciones |
|---|---|---|
| Claude Code | `.claude/skills/<skill>/` | Bloque en `CLAUDE.md` que importa `.nexa-squad/politica.md` |
| Codex | `.codex/skills/<skill>/` | Bloque en `AGENTS.md` |
| Kiro | `.kiro/skills/<skill>/` | `.kiro/steering/nexa-squad.md` (always, ~0,6 KB) |

Siempre: `.nexa-squad/politica.md`, `.nexa-squad/estandares.md` y `.nexa-squad/nexa-y-fruti.md`.
