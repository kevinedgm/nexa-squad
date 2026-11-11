@AGENTS.md

# Notas para Claude Code (desarrollo de este repo)

- Este repo es el código fuente del squad, no un proyecto donde se use. Las skills viven en `skills/`; no se instalan aquí.
- Las reglas de cada skill están solo en `skills/<skill>/SKILL.md` y sus `references/`. No las dupliques.
- Antes de terminar un cambio: `npm test` y `node bin/install.mjs install --target claude --dest "$(mktemp -d)" --dry-run`.
