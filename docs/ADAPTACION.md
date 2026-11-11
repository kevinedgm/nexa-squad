# Adaptación de Nexa Squad a Kiro: más rápido, menos contexto

Fecha: 2026-11-11. Base: `main` @ `9bfe0ec` (con #7, #8 y #9). Cambios en el #10 (modo rápido) y el #11 (fases 2 a 5).

## Resumen

- **El plan es una tabla, no documentos.** Al corregir o extender (o con `/orka rápido`), Orka escribe una tabla de tareas de máximo 40 líneas y lanza a Forja. Fluxa, Kompa y Kura no escriben documentos y no hay aprobación entre pasos.
- **Forja en paralelo.** Corren hasta 3 Forja a la vez cuando las tareas tocan archivos distintos, y al final un solo Vera.
- **Menos steering.** El steering `always` baja de ~10 KB (más `producto.md`) a 0,4 KB. Cada agente carga la política una sola vez.
- **Topes por subagente.** Cada subagente tiene un tope de líneas y de referencias. Forja escribe su reporte en la misma corrida.
- **Solo lo irreversible espera a Kevin.** Nadie hace `git add` ni `git commit`.

## Diagnóstico de partida (Fase 1)

| Causa propuesta | Resultado | Evidencia |
|---|---|---|
| Puertas de aprobación del flujo spec de Kiro | No aplica | Nexa no usa specs de Kiro: no hay `.kiro/specs/` ni `requirements/design/tasks.md`. Las puertas eran las de Nexa: Orka aprobaba cada documento |
| Subagentes en cadena | Confirmada | `orka.md`: "uno a la vez y en el orden de la cadena" |
| Steering `always` grande | Confirmada | La política (9,5 KB) iba en cada turno. Con #9, cada agente la recibía dos veces, más `producto.md` y el steering de Fruti |
| Codebase Indexing | No aplica | Ninguna skill ni agente lo usa. Nexa usa `docs/contexto/` (regla 12) |
| Dato medido (ronda 2 del menú lateral, MedicalManikVue) | El costo estaba después del código | ~20–25 min hasta el código y ~55 min después: el reporte de Forja (15 KB) tardó 10 min, y la revisión de Vera (7 scripts + 19 KB) unos 34 min |

## Antes y después por archivo

### `.kiro/steering/nexa-squad.md` (generado por `bin/kiro.mjs` → `steeringKiro`)

Antes (`always`, ~9,8 KB efectivos):
```markdown
Roles instalados: … Para un módulo, usa el agente `orka`; para un solo rol, su skill.
Qué decir en cada caso: `.nexa-squad/comandos.md`.

#[[file:.nexa-squad/politica.md]]
```
Después (`always`, 0,4 KB):
```markdown
Roles instalados: … Para un módulo, usa el agente `orka`; para un solo rol, su skill.
Qué decir en cada caso: `.nexa-squad/comandos.md`. Las reglas comunes están en `.nexa-squad/politica.md`:
cada agente del squad ya las carga; en otra conversación, léelas solo si vas a trabajar con el squad.
```

### `.kiro/steering/nexa-squad-contexto.md`
- **Antes:** era `always` y cargaba `docs/producto.md` y `docs/contexto/proyecto.md`.
- **Después:** se elimina. El instalador lo marca como `obsoleto` y tú lo borras a mano.

### `resources` de cada agente (`bin/kiro.mjs` → `recursos`)

Antes:
```yaml
resources:
  - file://.kiro/steering/**/*.md        # política (incluida) + contexto + steering de Fruti
  - file://.nexa-squad/politica.md       # la política otra vez
  - skill://.kiro/skills/<rol>/SKILL.md
```
Después:
```yaml
resources:
  - file://.kiro/steering/nexa-squad.md
  - file://.nexa-squad/politica.md
  - file://docs/contexto/proyecto.md
  - file://docs/producto.md              # solo orka, inqa, arko, fluxa, kompa y vera
  - file://.nexa-squad/comandos.md       # solo orka
  - skill://.kiro/skills/<rol>/SKILL.md
```

Contexto fijo medido en una instalación de prueba (es lo que imprime `install`/`update`):

| Agente | KB |
|---|---|
| Subagentes | 15–19 cada uno |
| Orka | 31 |

Antes estimo unos 35 KB o más por subagente.

### `.kiro/agents/orka.md` (cuerpo, `bin/kiro.mjs` → `cuerpoOrka`)

| Antes | Después |
|---|---|
| "Lanza cada rol … uno a la vez y en el orden de la cadena" | Uno a la vez, salvo en modo rápido: varios `forja-agent` a la vez (máximo 3) cuando sus filas tocan archivos distintos |
| — | No pide aprobación entre pasos; solo espera ante algo irreversible o ante una regla de negocio sin confirmar |
| — | Al corregir o extender, usa el modo rápido: el plan es la tabla de tareas (máximo 40 líneas) y lanza a Forja sin esperar aprobación |
| `trustedAgents` sin Forja | Forja también entra en `trustedAgents` (decisión de Kevin), así que lanzarla no pide clic |
| Prohibido: `rm -rf`, `git push`, `mysql`… | Además: `git add` y `git commit` |

### `skills/orka/SKILL.md`

| Antes | Después |
|---|---|
| Al corregir, Fluxa, Kompa y Kura escriben una sección en su documento | Sección "Modo rápido": el diagnóstico y el cambio de cada fila van a la tabla de tareas, sin documentos de rol, con un tope de 40 líneas |
| Extender arrancaba en Inqa | Extender arranca en Orka. Inqa entra solo si hay una regla sin confirmar; Arko, solo si se tocan datos, permisos o API |
| Un rol a la vez | Forja en paralelo por grupos de archivos y un solo Vera al final |
| "Más de dos documentos sin Forja → revisa el alcance" | En modo rápido no hay ningún documento antes de Forja: si la tabla pasa de 40 líneas, Orka corta y lanza Forja |
| — | `/orka rápido <tarea>` fuerza el modo rápido (nunca al migrar legacy) |
| — | Un documento aprobado no se reescribe: los cambios entran como fila nueva o como sección de máximo 10 líneas |

### `skills/forja/SKILL.md` y `skills/vera/SKILL.md`
- **Forja, modo rápido:**
  - Su entrada son las filas de la tabla, no los documentos.
  - Registro de máximo 30 líneas, escrito en la misma corrida.
  - Deja la evidencia en `docs/construccion/evidencia/…` para que Vera la reuse.
  - Si va en grupo, usa el sufijo `-g1`, `-g2`… y no toca los archivos de otro grupo.
- **Vera, modo rápido:**
  - Revisa solo las filas `hecho`.
  - Reutiliza los scripts de Forja.
  - Su revisión tiene máximo 40 líneas.
- **`references/diagnostico-rapido.md`:** el diagnóstico ya no tiene documento aparte, salvo `/vera diagnostica`.

### `agents/<rol>-agent.md`
Cada subagente gana un "Contrato en cadena": qué recibe, qué entrega, cuándo termina y su presupuesto de lectura.

| Rol | Tope del documento | Referencias |
|---|---|---|
| inqa | 150 líneas (cambio 40) | 2 |
| arko | 120 + checklist | 2 |
| fluxa, kompa | 100 (cambio 40) | 2 |
| kura | 60 + pedidos | 1 |
| forja | 30 rápido / 60 completo | 1, solo legacy sin pruebas |
| vera | 40 rápido / 80 completo | 2 |

Si el alcance no cabe, el rol entrega lo que cabe y devuelve el resto como fase siguiente.

### `AGENTS.md` (política)
- Extender arranca en Orka en modo rápido.
- Regla 10: los documentos aprobados no se reescriben.
- Regla 14: la tabla de tareas gana la columna `cambio`.
- "Skill o subagente": se describen el modo rápido y Forja en paralelo.

### `comandos/comandos.json`
- Nuevo comando `/orka rápido <tarea>`.
- Se actualizó qué pasa al extender y al corregir.

### `bin/install.mjs` y `scripts/check.mjs`
- **Instalador:** imprime los KB fijos de cada agente y marca como obsoleto el steering de contexto viejo.
- **Tests:**
  - el steering `always` no incluye archivos y pesa ≤1,2 KB;
  - la política se carga una sola vez;
  - `producto.md` llega solo a quien lo usa.

## Lo que no se hizo, y por qué

| Propuesta | Decisión | Motivo |
|---|---|---|
| "Quick Spec" de Kiro | Se tradujo al modo rápido de Orka | Nexa no usa el flujo spec de Kiro |
| Límite de "N tokens de spec" | Se reemplazó por 40 líneas de plan y 0 documentos antes de Forja | El agente no puede contar sus tokens; las líneas sí se pueden comprobar |
| Hooks `PostTaskExecution` / `SpecUpdated` | No se instalan | Esos eventos dependen del flujo spec, que Nexa no usa, y no se verificaron sus nombres. La transición a código y lo destructivo ya se controlan con reglas de Orka y permisos `deny` deterministas |
| Hook `PreToolUse` contra lo destructivo | No se instala | Los permisos `deny` de cada agente ya lo bloquean |
| `fileMatch` | No se usa | Ninguna regla de Nexa depende de una ruta de archivos |
| Orka con solo `subagent` y `read` | Se rechaza | Orka escribe la bitácora y la tabla, que son el plan del modo rápido |
| Renombrar roles (requirements/design/implementer/validator) | Se rechaza | Borraría la composición en contexto (Kompa y Kura), que es el núcleo de Nexa |
| Steering `always` de Fruti | Fuera de alcance | Vive en el repo de Fruti |

## Para aplicarlo en un proyecto

1. Fusiona los PR y corre `npx github:kevinedgm/nexa-squad update --target kiro`. Antes puedes correrlo con `--dry-run` para ver qué cambia.
2. Borra `.kiro/steering/nexa-squad-contexto.md` si el instalador lo marca como `obsoleto`.
3. Si no existe, crea `docs/registro.md`. Lo crea el primer rol que termina, según la regla 14.

## Checklist de validación

Compara la misma clase de corrección (por ejemplo, otra ronda del menú lateral) antes y después.

| Métrica | Cómo medirla | Antes | Meta |
|---|---|---|---|
| Minutos hasta el primer edit de código | `docs/registro.md`: inicio de Orka → inicio de Forja (o la primera hora de modificación en `src/`) | ~20–25 | < 15 |
| Minutos después del código | `docs/registro.md`: fin de Forja → fin de Vera | ~55 | < 25 |
| Documentos de rol escritos antes de Forja | `ls -t docs/estructura docs/composicion docs/componentes` durante la ronda | 3 (se reescribieron) | 0 |
| Líneas del plan | Tabla de tareas en `docs/orquestacion/<modulo>.md` | — | ≤ 40 |
| Forja en paralelo | Filas de Forja con el mismo inicio en `docs/registro.md` | 1 | ≥ 2 cuando hay archivos independientes |
| Clics de aprobación en Kiro por ronda | Cuenta manual | 1 por cada Forja | 0, salvo lo irreversible |
| KB fijos por subagente | Línea "Contexto fijo por agente" de `update` | ~35 o más (estimado) | ≤ 20 |
| Tamaño de los reportes | `wc -l docs/construccion/*.md docs/revision/*.md` | 15–19 KB | ≤ 30 / 40 líneas |
| Créditos por fase | Panel de uso de Kiro | 79,6 | Bajar, sin meta fija hasta tener la primera medición |
