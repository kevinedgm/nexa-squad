# Cambiar o agregar un rol

## Cambiar un rol existente

1. Edita `skills/<rol>/SKILL.md` o sus `references/`. Las reglas viven ahí, no en el subagente.
2. Si agregas una referencia, enlázala desde el SKILL.md con el momento exacto en que debe leerse.
3. Toca `agents/<rol>-agent.md` solo si cambia algo de la ejecución en cadena (estados, qué devuelve).
4. Corre `npm test`.

## Agregar un rol

1. Crea `skills/<rol>/SKILL.md`. El `name:` debe ser igual al nombre de la carpeta, y la primera línea debe decir la única decisión del rol.
2. Crea `agents/<rol>-agent.md` copiando uno existente y cambiando `name`, `description`, `skills:` y el nombre de la skill en "Sigue tu skill".
3. Agrega el rol a `squad.json`, a la tabla de la cadena en `AGENTS.md` y a la tabla de Orka en `skills/orka/SKILL.md`.
4. Corre `npm test`. El validador falla si algo no coincide.

## Si el cambio es para acelerar

Mide antes y después con las tareas de [evals/](../evals/README.md) y `npm run medir -- <transcripcion.jsonl>`. Anota calidad y tiempo en `evals/resultados.md`; el cambio se queda solo si baja el tiempo y ningún caso pasa de pasa a falla.

## Antes de publicar

```bash
npm test
node bin/install.mjs install --target claude --dest "$(mktemp -d)" --dry-run
```
