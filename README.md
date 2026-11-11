<div align="center">

<picture><source media="(prefers-color-scheme: dark)" srcset="assets/marca/nexa-squad-oscuro.svg"><img src="assets/marca/nexa-squad.svg" alt="Nexa Squad" width="96"></picture>

# Nexa Squad

**Ocho agentes que diseñan y construyen módulos completos acomodando bien los componentes que ya tienes.**

<picture><source media="(prefers-color-scheme: dark)" srcset="assets/marca/orka-oscuro.svg"><img src="assets/marca/orka.svg" alt="Orka" width="32"></picture>&nbsp;<picture><source media="(prefers-color-scheme: dark)" srcset="assets/marca/inqa-oscuro.svg"><img src="assets/marca/inqa.svg" alt="Inqa" width="32"></picture>&nbsp;<picture><source media="(prefers-color-scheme: dark)" srcset="assets/marca/arko-oscuro.svg"><img src="assets/marca/arko.svg" alt="Arko" width="32"></picture>&nbsp;<picture><source media="(prefers-color-scheme: dark)" srcset="assets/marca/fluxa-oscuro.svg"><img src="assets/marca/fluxa.svg" alt="Fluxa" width="32"></picture>&nbsp;<picture><source media="(prefers-color-scheme: dark)" srcset="assets/marca/kompa-oscuro.svg"><img src="assets/marca/kompa.svg" alt="Kompa" width="32"></picture>&nbsp;<picture><source media="(prefers-color-scheme: dark)" srcset="assets/marca/kura-oscuro.svg"><img src="assets/marca/kura.svg" alt="Kura" width="32"></picture>&nbsp;<picture><source media="(prefers-color-scheme: dark)" srcset="assets/marca/forja-oscuro.svg"><img src="assets/marca/forja.svg" alt="Forja" width="32"></picture>&nbsp;<picture><source media="(prefers-color-scheme: dark)" srcset="assets/marca/vera-oscuro.svg"><img src="assets/marca/vera.svg" alt="Vera" width="32"></picture>

Orka · Inqa · Arko · Fluxa · Kompa · Kura · Forja · Vera

</div>

---

## Qué problema resuelve

Fruti Squad fabrica buenos componentes: un campo, un autocomplete, un botón, una tabla. Pero una pantalla no es una lista de componentes. Alguien tiene que decidir cosas como estas:

- qué campos van en la misma fila y cuáles van solos;
- si el autocomplete ocupa todo el ancho o solo lo que necesita, y qué pasa con el botón que tiene al lado;
- qué tamaño lleva el título, el subtítulo y cada icono;
- dónde aparece una sección opcional, como los datos de facturación, y cómo se activa.

Esas decisiones son la **composición**, y es lo que hace Nexa Squad.

Nexa no decide por gusto. Cada regla cita su fuente: WCAG, GOV.UK, Material Design, Nielsen, Baymard, Gestalt y las demás del [catálogo de estándares](estandares/estandares.md). Funciona igual para un formulario de registro, para diagnósticos CIE-10 con sus medicamentos, para una captura de signos vitales o para una bitácora de análisis.

Además de componer, el squad cubre el trabajo completo de un módulo: entender qué debe hacer, cómo se guarda en el servidor, programarlo y revisarlo.

## Instalación

Necesitas Node.js 16 o superior y Claude Code (también funciona con Codex y Kiro).

1. Abre una terminal en la raíz de tu proyecto.
2. Ejecuta:

   ```bash
   npx github:kevinedgm/nexa-squad install --target claude
   ```

3. Abre Claude Code en ese proyecto y describe tu producto con `/orka init` (ver [Primer paso](#primer-paso-describe-tu-producto)).

Para actualizar a una versión nueva, primero mira qué cambiaría y después aplícalo:

```bash
npx github:kevinedgm/nexa-squad update --target claude --dry-run   # nuevo, cambia, igual u obsoleto, archivo por archivo
npx github:kevinedgm/nexa-squad update --target claude             # renueva skills, agentes y política
```

`update` renueva lo que es del squad y no toca lo tuyo: `docs/` y `.nexa-squad/ejecucion.json` se quedan como están. Lo que quedó de una instalación anterior y ya no se usa aparece como `obsoleto`; no se borra solo.

## Primer paso: describe tu producto

Antes del primer módulo, dile al squad **qué es tu sistema y quién lo usa**. Se hace una sola vez:

```text
/orka init
Es un SaaS para un laboratorio que emite informes de análisis de muestras industriales.
- La recepcionista recibe las muestras y cobra las que quedan pendientes.
- La analista captura los resultados en las bitácoras de cada muestra.
- El supervisor revisa lo que captura la analista y aprueba las bitácoras.
```

Inqa lo ordena en `docs/producto.md`: qué es el producto, cada rol con sus tareas y qué tan seguido las hace, y quién revisa el trabajo de quién. Tú lo apruebas. Si prefieres llenarlo a mano, `npx github:kevinedgm/nexa-squad init` crea el archivo vacío.

Desde ese momento cada decisión se toma para un rol:
- la captura diaria de la analista se diseña densa y para usarse con teclado;
- la vista del supervisor se diseña para revisar y aprobar por lote;
- el servidor impide que alguien apruebe lo que él mismo capturó;
- Vera revisa el recorrido completo de cada rol.

Además, "el supervisor revisa lo de la analista" genera requisitos por sí solo: estados (capturada, en revisión, aprobada o devuelta), una bandeja de pendientes y un registro de quién hizo qué.

**En cada módulo, di quién lo usa y qué hace ahí.** Por ejemplo: "el módulo de cuentas lo usa la recepcionista para pagar muestras pendientes, adjuntar vouchers y marcarlas como pagadas o canceladas". Con eso el squad sabe qué tareas van primero. Si no lo dices, Orka te lo pregunta una vez.

## Cómo se usa

Regla única: **empieza con `/orka` y di lo que quieres con tus palabras.** Orka es el coordinador. Él decide qué agentes trabajan y en qué orden, así que no necesitas saber cuál es cada uno.

| Lo que quieres | Escribe |
|---|---|
| Construir algo nuevo | `/orka quiero una funcionalidad para registrar signos vitales en la consulta` |
| Agregar un comportamiento a un módulo que ya existe | `/orka en pagos, cuando se rechace un pago, ahora hay que avisar al cliente` |
| Traer una funcionalidad de otra aplicación | `/orka lee la bitácora de la app del laboratorio y tráela aquí, pero para radiología` |
| Arreglar un módulo que se ve o se acomoda mal | `/orka corrige el diseño del módulo de cuentas; lo usa la recepcionista para pagar muestras pendientes y adjuntar vouchers` |
| Migrar un módulo viejo | `/orka migra el módulo gestor` |
| Seguir donde te quedaste | `/orka continúa el gestor` |

Si no sabes cómo pedirlo, pregunta:

```text
/orka ¿a quién invoco para que el autocomplete no ocupe todo el ancho?
```

O desde la terminal, sin abrir Claude Code:

```bash
npx github:kevinedgm/nexa-squad quien "el formulario de cuentas se ve mal"
```

La lista completa de frases está en la [guía de comandos](comandos/comandos.md).

### Llamar a un solo agente

Si ya sabes qué decisión necesitas, puedes llamar al agente directo. Por ejemplo, `/kompa compón el formulario de registro` o `/vera diagnostica el módulo de cuentas`. Así trabaja solo ese agente y te puede hacer preguntas.

## Qué pasa después de pedirlo

Ejemplo: `/orka corrige el diseño del módulo de cuentas; lo usa la recepcionista para pagar muestras pendientes, adjuntar vouchers y marcarlas como pagadas o canceladas`.

1. **Orka reconoce el caso.** Es una corrección de aspecto, no de comportamiento. Por eso se salta las etapas de requisitos y servidor.
2. **Vera revisa el módulo recorriendo las tareas de la recepcionista** (pagar, adjuntar el voucher, marcar como pagada o cancelar) contra los estándares, y anota cada problema con su fuente. Por ejemplo: "el autocomplete ocupa todo el ancho y empuja el botón a otra línea · Fuente: GOV.UK (anchos de campo)".
3. **Orka reparte los problemas.** Los de orden y agrupación van a Fluxa, los de acomodo a Kompa, y si falta un componente, Kura se lo pide a Fruti Squad.
   Si una tarea que mencionaste no se puede hacer hoy (por ejemplo, no hay dónde adjuntar el voucher), eso no es diseño sino una función nueva: Orka te lo propone como un cambio aparte.
4. **Forja corrige el código** solo en las partes con problemas, y **Vera vuelve a revisar**.
5. **Orka te entrega un resumen** de 5 líneas como máximo.

Orka solo te interrumpe en dos momentos:

- cuando hay **reglas de negocio** que aprobar (por ejemplo, quién puede borrar una cuenta);
- antes de algo que **no se puede deshacer**, como borrar o migrar datos.

Todo lo demás lo resuelve él, y lo que tuvo que suponer queda anotado.

### Dónde queda el trabajo

Cada agente escribe su documento en la carpeta `docs/` de tu proyecto. Así puedes revisarlo, y una sesión nueva sigue donde se quedó la anterior.

```text
docs/producto.md                qué es el producto, sus roles y qué módulos usa cada uno (uno por producto)
docs/orquestacion/cuentas.md    bitácora de Orka: en qué va, qué supuso, qué te pregunta
docs/requisitos/cuentas.md      qué debe hacer (Inqa)
docs/estructura/cuentas.md      pantallas y su contenido (Fluxa)
docs/composicion/cuentas.md     cómo se acomoda cada parte, con su fuente (Kompa)
docs/componentes/cuentas.md     qué componentes se usan y qué se pidió a Fruti (Kura)
docs/revision/cuentas-…md       hallazgos y veredicto (Vera)
docs/contexto/proyecto.md       mapa del stack, sistema visual, componentes y tokens (uno por producto)
docs/contexto/cuentas.md        mapa de los archivos del módulo, con ruta y línea
```

Los dos mapas de `docs/contexto/` los escribe el primer agente que lee el código, y los demás parten de ahí en lugar de recorrer otra vez el repositorio. Cada mapa guarda el `commit` en que se hizo; si los archivos cambiaron desde entonces, se relee solo lo que cambió.

## El equipo

| | Agente | Lema | Qué decide | Llámalo solo cuando… |
|---|---|---|---|---|
| <picture><source media="(prefers-color-scheme: dark)" srcset="assets/marca/orka-oscuro.svg"><img src="assets/marca/orka.svg" alt="Orka" width="32"></picture> | **Orka** · Conductor | Dirige el squad: quién trabaja ahora y qué se aprueba solo. | Quién trabaja y en qué orden | Siempre puedes empezar por él |
| <picture><source media="(prefers-color-scheme: dark)" srcset="assets/marca/inqa-oscuro.svg"><img src="assets/marca/inqa.svg" alt="Inqa" width="32"></picture> | **Inqa** · Product Analyst | Qué debe hacer la funcionalidad, para quién y cómo se comprueba. | Qué debe hacer la funcionalidad y con qué reglas | Quieres entender un módulo o escribir sus requisitos |
| <picture><source media="(prefers-color-scheme: dark)" srcset="assets/marca/arko-oscuro.svg"><img src="assets/marca/arko.svg" alt="Arko" width="32"></picture> | **Arko** · Systems Architect | Cómo se construye por detrás: datos, API y permisos. | Cómo se guarda y se protege en el servidor | Necesitas definir datos, API o permisos |
| <picture><source media="(prefers-color-scheme: dark)" srcset="assets/marca/fluxa-oscuro.svg"><img src="assets/marca/fluxa.svg" alt="Fluxa" width="32"></picture> | **Fluxa** · Flow Designer | Qué pantallas hay, qué contienen y en qué orden. | Qué pantallas hay, qué contienen y en qué orden | Necesitas definir campos, secciones o pasos |
| <picture><source media="(prefers-color-scheme: dark)" srcset="assets/marca/kompa-oscuro.svg"><img src="assets/marca/kompa.svg" alt="Kompa" width="32"></picture> | **Kompa** · Layout Composer | Cómo se acomoda cada sección: qué crece, qué cede y qué nunca se mueve. | Cómo se acomoda cada parte: anchos, filas, jerarquía, superficies | Una vista ya tiene su contenido y falta acomodarla |
| <picture><source media="(prefers-color-scheme: dark)" srcset="assets/marca/kura-oscuro.svg"><img src="assets/marca/kura.svg" alt="Kura" width="32"></picture> | **Kura** · Component Curator | Reutilizar antes que crear. | Qué componente se usa y qué se pide a Fruti Squad | Quieres saber si algo ya existe o hay que pedirlo |
| <picture><source media="(prefers-color-scheme: dark)" srcset="assets/marca/forja-oscuro.svg"><img src="assets/marca/forja.svg" alt="Forja" width="32"></picture> | **Forja** · Build Engineer | Escribe el código que cumple lo aprobado, fase por fase. | Cómo se escribe el código | Los documentos están aprobados y toca programar |
| <picture><source media="(prefers-color-scheme: dark)" srcset="assets/marca/vera-oscuro.svg"><img src="assets/marca/vera.svg" alt="Vera" width="32"></picture> | **Vera** · QA Auditor | Si pasa, o a quién regresa cada hallazgo. | Si pasa y a quién regresa cada problema | Quieres revisar o auditar sin corregir |

Cada decisión tiene un solo dueño. Si un agente encuentra algo que no le toca, se lo regresa a su dueño en lugar de resolverlo él.

## Con Fruti Squad

**Fruti Squad fabrica las piezas; Nexa Squad arma los módulos con ellas.** Usa Fruti cuando el resultado es algo que se reutiliza en muchas pantallas (un componente, una variante, un token) y vive en el Design Hub. Usa Nexa cuando el resultado es una funcionalidad del producto que usa un rol, con sus datos, reglas y servidor.

Los dos pueden estar instalados en el mismo proyecto:

- Nexa lee los componentes, el registro y los tokens de Fruti (`.fruti/`) y nunca los modifica.
- Si falta un componente o una variante, **Kura** escribe un pedido en `docs/componentes/pedidos/`. Ningún otro agente de Nexa lo hace. Forja deja ese lugar como pendiente hasta que Fruti entrega la pieza.
- **Las pantallas del producto son de Nexa.** Con los dos squads instalados, Fruti diseña piezas y patrones reutilizables, y si le pides una pantalla del producto te responde con la frase para Nexa. Empieza con `/orka` cuando quieras a Nexa.

La guía completa, con qué pedirle a cada uno, los cinco casos en que trabajan juntos y quién manda cuando no coinciden, está en [docs/nexa-y-fruti.md](docs/nexa-y-fruti.md).

## Opciones de instalación

```bash
npx github:kevinedgm/nexa-squad install --target claude             # Claude Code (recomendado)
npx github:kevinedgm/nexa-squad install --target codex              # Codex
npx github:kevinedgm/nexa-squad install --target kiro               # Kiro
npx github:kevinedgm/nexa-squad install --target claude --global    # para todos tus proyectos
npx github:kevinedgm/nexa-squad install --only kompa,vera           # solo algunos agentes
npx github:kevinedgm/nexa-squad install --dry-run                   # ver qué haría, sin cambiar nada
npx github:kevinedgm/nexa-squad update --target kiro --dry-run      # ver qué cambiaría al actualizar
npx github:kevinedgm/nexa-squad list                                # lista de agentes
```

Qué agrega a tu proyecto con `--target claude`:

| Ruta | Para qué |
|---|---|
| `.claude/skills/<agente>/` | Las instrucciones de cada agente |
| `.claude/agents/<agente>-agent.md` | La versión que Orka usa al trabajar en cadena |
| `.nexa-squad/` | Reglas comunes, catálogo de estándares, guía de comandos y guía de trabajo con Fruti Squad |
| Un bloque en `CLAUDE.md` | Para que Claude Code cargue las reglas comunes |

Qué agrega con `--target kiro`:

| Ruta | Para qué |
|---|---|
| `.kiro/skills/<agente>/` | Las instrucciones de cada agente |
| `.kiro/agents/<agente>-agent.md` | Un agente de Kiro por rol, con su skill, las reglas comunes y solo los permisos de su rol (por ejemplo, Fluxa solo escribe en `docs/estructura/`) |
| `.kiro/agents/orka.md` | El agente con el que empiezas: lanza a los demás con la herramienta de subagentes |
| `.kiro/steering/nexa-squad.md` | Steering `always` de pocas líneas que incluye las reglas comunes |
| `.kiro/steering/nexa-squad-contexto.md` | Steering `always` que carga `docs/producto.md` y `docs/contexto/proyecto.md`, para que ningún rol los vuelva a buscar. Cada agente recibe todo `.kiro/steering/`, también tu `product.md`, `tech.md` y `structure.md` |
| `.nexa-squad/` | Igual que en Claude Code |

En Kiro eliges el agente `orka` y le pides el trabajo con tus palabras. Si instalaste una versión anterior, `update --dry-run` te marca como `obsoleto` lo que quedó en `.agents/skills/` y `.nexa-squad/agents/`.

`install` no sobrescribe nada que hayas cambiado (lo marca `omitido`); `update` o `--force` lo renuevan. En Codex las rutas son otras; las muestra `list`.

## Para quien mantiene este repositorio

Cada agente existe de dos formas. Como **skill**, trabaja en tu conversación y te puede preguntar. Como **subagente**, Orka lo lanza en cadena: trabaja aislado, no pregunta y devuelve un resumen. La fuente de cada agente es su `skills/<agente>/SKILL.md`; el subagente solo la carga. El razonamiento completo está en [docs/arquitectura.md](docs/arquitectura.md).

```text
squad.json             nombres y orden de los agentes (lo lee el instalador)
AGENTS.md              reglas comunes (se instalan como .nexa-squad/politica.md)
estandares/            catálogo de estándares
comandos/              guía de comandos: comandos.json (fuente) y comandos.md (generado)
skills/<agente>/       SKILL.md y sus referencias
agents/                versión de subagente de cada agente
bin/                   instalador y ayuda de comandos
scripts/check.mjs      validación del paquete
evals/                 tareas de prueba con rúbrica para medir cambios al squad
```

```bash
npm test           # valida nombres, referencias, guía de comandos y cadena
npm run comandos   # regenera comandos/comandos.md después de editar comandos.json
npm run medir -- <transcripcion.jsonl>   # tiempos de una corrida: total, hasta Forja, hasta el primer código y por agente
```

Antes de cambiar cómo trabaja un agente, corre las tareas de prueba de [evals/](evals/README.md) antes y después del cambio, y conserva el cambio solo si ningún caso empeora. Si el cambio es para acelerar, mide además cada corrida con `npm run medir`: se queda solo si baja el tiempo sin que ningún caso pase de pasa a falla.

Para cambiar o agregar un agente, sigue [docs/contribuir.md](docs/contribuir.md). La identidad visual (símbolos, color, tipografía y reglas de uso) está en [docs/marca.md](docs/marca.md); los archivos, en `assets/marca/`.

## Licencia

MIT
