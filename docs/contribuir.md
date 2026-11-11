# Cambiar una skill

1. Edita `skills/<skill>/SKILL.md` o sus `references/`. Las reglas viven solo ahí.
2. Si agregas una referencia, enlázala desde el SKILL.md con la fila o el momento exacto en que se abre. El validador falla si queda una sin enlazar.
3. Una fila nueva del diagnóstico de Kompa debe poder comprobarse mirando el código o la pantalla, y citar su fuente de `estandares/estandares.md`.
4. Antes de agregar un paso, pregúntate si cuesta tiempo en cada petición. Si sí, necesita un disparador concreto.

## Antes de publicar

```bash
npm test
node bin/install.mjs install --target claude --dest "$(mktemp -d)" --dry-run
```
