<div align="center">

# Nexa Squad

**Un squad de agentes que convierte una petición en un módulo terminado: requisitos, arquitectura, pantallas, componentes, código y revisión, cada parte con un solo dueño.**

Orka → Inqa → Arko → Fluxa → Kompa → Kura → Forja → Vera

</div>

---

## Qué es

Nexa Squad es un conjunto portable de skills y subagentes para **migrar, rediseñar o construir módulos completos** (front y back) en una aplicación existente, sobre todo en código legacy.

Tú describes el trabajo, no el protocolo:

```text
/orka migra el módulo gestor
/orka continúa el gestor
"usa inqa para analizar el módulo de pagos"
"vera, revisa la fase 2 del gestor"
```

Orka decide qué rol trabaja, resuelve lo que se puede inferir y solo te consulta en dos momentos: cuando hay reglas de negocio que aprobar y antes de cualquier acción irreversible.

## El equipo

| Orden | Rol | Decide | Entrega |
|---|---|---|---|
| 0 | **Orka** · Conductor | Qué rol trabaja ahora y qué se aprueba solo o se escala | `docs/orquestacion/<modulo>.md` |
| 1 | **Inqa** · Product Analyst | Qué debe hacer, para quién, con qué reglas y cómo se comprueba | `docs/requisitos/<modulo>.md` |
| 2 | **Arko** · Systems Architect | Cómo se construye por detrás: datos, APIs, permisos en servidor | `docs/arquitectura/<modulo>.md` |
| 3 | **Fluxa** · Flow Designer | Qué vistas hay, qué contienen, en qué orden y con qué prioridad | `docs/estructura/<modulo>.md` |
| 4 | **Kompa** · Layout Composer | Cómo se acomoda cada sección: jerarquía, tokens y qué cede en pantallas chicas | `docs/composicion/<modulo>.md` |
| 5 | **Kura** · Component Curator | Si algo se reutiliza, se vuelve variante o se pide como componente nuevo | `docs/componentes/<modulo>.md` |
| 6 | **Forja** · Build Engineer | Cómo se escribe el código que cumple lo aprobado, fase por fase | código + `docs/construccion/` |
| 7 | **Vera** · QA Auditor | Si pasa o a quién regresa cada hallazgo | `docs/revision/<modulo>-fase-<n>.md` |

Regla principal: **cada decisión tiene un solo dueño.** Si un rol encuentra algo que no le toca, lo devuelve al dueño en lugar de resolverlo.

```text
Petición ─▶ Inqa ─▶ [Punto de control 1: reglas de negocio] ─▶ Arko ─▶ Fluxa ─▶ Kompa ─▶ Kura
                                                                                            │
           [Punto de control 2: lo irreversible] ◀─ Vera ◀─ Forja ◀───── (por cada fase) ─────┘
```

## Instalación

Requisitos: Node.js 16 o superior, y Claude Code, Codex o Kiro.

Desde la raíz del proyecto donde vas a usar el squad:

```bash
npx github:kevinedgm/nexa-squad install --target claude
```

Otras formas:

```bash
npx github:kevinedgm/nexa-squad list                          # roles y destinos
npx github:kevinedgm/nexa-squad install --target claude --only inqa,vera
npx github:kevinedgm/nexa-squad install --target codex
npx github:kevinedgm/nexa-squad install --target claude --global   # para todos tus proyectos
npx github:kevinedgm/nexa-squad install --dry-run              # ver sin cambiar nada
```

Desde un clon: `./install.sh install --target claude`.

### Qué instala

| Destino | Skills | Subagentes | Política |
|---|---|---|---|
| `claude` | `.claude/skills/<rol>/` | `.claude/agents/<rol>-agent.md` | bloque en `CLAUDE.md` que importa `.nexa-squad/politica.md` |
| `codex` | `.codex/skills/<rol>/` | no aplica; los ajustes quedan en `.nexa-squad/agents/` | bloque en `AGENTS.md` |
| `kiro` | `.agents/skills/<rol>/` | no aplica; los ajustes quedan en `.nexa-squad/agents/` | `.kiro/steering/nexa-squad.md` |

El instalador no sobrescribe nada sin `--force`, y reinstalar solo renueva su propio bloque en `CLAUDE.md`/`AGENTS.md`.

## Por qué cada rol es skill y subagente

| | Skill | Subagente |
|---|---|---|
| Dónde corre | Conversación principal | Contexto limpio y aislado |
| ¿Te puede preguntar? | Sí | No, solo devuelve un resultado |
| ¿Puede lanzar a otros roles? | Sí | No |

- **Orka es solo skill**, porque es el único que te pregunta y el único que lanza a los demás.
- **Los otros 7 son ambas cosas.** Usados solos, te preguntan (skill). En cadena, trabajan sin interrumpirte y devuelven un resumen corto (subagente).
- La fuente de verdad de cada rol es su `SKILL.md`. El subagente es un envoltorio delgado que la carga con `skills:` y solo agrega una regla: "no puedes preguntar; anota el supuesto y sigue".

El razonamiento completo está en [docs/arquitectura.md](docs/arquitectura.md).

## Relación con Fruti Squad

| | Fruti Squad | Nexa Squad |
|---|---|---|
| Produce | Componentes compartidos y su Design Hub | Módulos completos (front y back) |
| Puente | — | Kura es el único que le hace pedidos a Fruti Squad |

Pueden convivir en el mismo proyecto. Para evitar que una frase como "rediseña este formulario" active a los dos, invoca a Nexa Squad por su nombre (`/orka`, "usa inqa…").

## Estructura del repositorio

```text
squad.json            nombres, orden y decisión de cada rol (fuente para el instalador)
AGENTS.md             política común (la que se instala como .nexa-squad/politica.md)
skills/<rol>/         SKILL.md + references/ (se leen solo cuando el SKILL.md lo indica)
agents/<rol>-agent.md envoltorio de subagente de cada rol
bin/install.mjs       instalador sin dependencias
scripts/check.mjs     valida que nombres, referencias y cadena sean coherentes
docs/                 arquitectura y guía de cambios
```

## Desarrollo

```bash
npm test     # valida el paquete (scripts/check.mjs)
```

Para cambiar o agregar un rol, sigue [docs/contribuir.md](docs/contribuir.md).

## Licencia

MIT
