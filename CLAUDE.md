@AGENTS.md

# Notas para Claude Code (desarrollo de este repo)

- Este repo es el código fuente del squad, no un proyecto donde se use. Los roles viven en `skills/` y `agents/`; no se instalan aquí.
- Las reglas de cada rol están solo en `skills/<rol>/SKILL.md`; los `agents/<rol>-agent.md` son envoltorios. No dupliques reglas.
- Antes de terminar un cambio: `npm test` y `node bin/install.mjs install --target claude --dest "$(mktemp -d)" --dry-run`.
