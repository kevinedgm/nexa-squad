# Evaluaciones del squad

Propósito: saber con evidencia si un cambio al squad (una regla nueva, juntar dos roles, cambiar un subagente por una skill) lo mejora o lo empeora. Sin esto, cada cambio es una opinión.

Idea tomada de "Building agents: when to fold subagents into your main agent loop" (Anthropic): primero un conjunto pequeño de tareas de punta a punta con rúbrica; luego se cambia **una cosa a la vez** y se conserva solo lo que no baja la calificación.

## Cómo está armado

- `casos/NN-<nombre>.md`: una tarea dorada. Cada caso trae la petición exacta, el contexto que se da, qué ruta debe tomar Orka y una lista de **debe** y **no debe** verificables.
- Cada caso se califica con su propia lista. Una casilla de **no debe** marcada hace fallar el caso completo (regla del eslabón más débil).

## Cómo se corre (a mano, por ahora)

1. Crea un proyecto de prueba e instala el squad: `npx github:kevinedgm/nexa-squad install --target claude --dest <prueba>`.
2. En ese proyecto, pega la sección **Contexto** del caso (por ejemplo, `docs/producto.md`) y escribe la **Petición** tal cual.
3. Cuando termine, pide a un agente nuevo (contexto limpio) que califique: "Califica este resultado con `evals/casos/NN-….md`; para cada casilla di cumple / no cumple con la evidencia (archivo y línea)".
4. **Corre cada caso dos veces.** Un mismo cambio puede pasar una vez y fallar la siguiente; solo cuenta lo que pasa en las dos.
5. Anota el resultado en `evals/resultados.md`: fecha, versión del squad, qué cambió, caso, corrida 1, corrida 2.

## Cómo se compara un cambio

- Corre todos los casos antes y después del cambio.
- No mires solo el total: revisa **qué casos cambiaron** de pasa a falla. Un total igual puede esconder un caso que se rompió y otro que se arregló.
- Si el cambio empeora cualquier caso, se deshace o se ajusta antes de seguir con otro.

## Qué mide cada parte

| Parte | Qué comprueba |
|---|---|
| Ruta | Orka eligió el escenario correcto y lanzó solo los roles necesarios |
| Debe | Las decisiones que el caso exige, con su fuente |
| No debe | Las reglas que el squad nunca rompe: inventar reglas de negocio, cambiar comportamiento al corregir diseño, copiar aspecto de otra app, valores fuera de tokens |
