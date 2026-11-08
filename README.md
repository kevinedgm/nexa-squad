<div align="center">

# Nexa Squad

**Ocho agentes que diseñan y construyen módulos completos acomodando bien los componentes que ya tienes.**

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

3. Abre Claude Code en ese proyecto y escribe `/orka`.

Para actualizar a una versión nueva, repite el paso 2 agregando `--force`.

## Cómo se usa

Regla única: **empieza con `/orka` y di lo que quieres con tus palabras.** Orka es el coordinador. Él decide qué agentes trabajan y en qué orden, así que no necesitas saber cuál es cada uno.

| Lo que quieres | Escribe |
|---|---|
| Decir para quién es el sistema (una vez por producto) | `/orka el sistema es para un laboratorio: la analista captura la bitácora y el supervisor la revisa` |
| Construir algo nuevo | `/orka quiero una funcionalidad para registrar signos vitales en la consulta` |
| Agregar un comportamiento a un módulo que ya existe | `/orka en pagos, cuando se rechace un pago, ahora hay que avisar al cliente` |
| Traer una funcionalidad de otra aplicación | `/orka lee la bitácora de la app del laboratorio y tráela aquí, pero para radiología` |
| Arreglar un módulo que se ve o se acomoda mal | `/orka corrige la composición del módulo de cuentas; no cambies lo que hace` |
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

### Para quién se diseña

Lo primero que necesita el squad es saber **quién usa el sistema y qué hace cada persona**. Dilo con tus palabras, una vez por producto. Inqa lo convierte en `docs/usuarios.md`: cada perfil con sus tareas, qué tan seguido las hace, en qué contexto trabaja y quién revisa el trabajo de quién.

A partir de ahí cada decisión se toma para un perfil:
- la captura diaria de la analista se diseña densa y para usarse con teclado;
- la vista del supervisor se diseña para revisar y liberar por lote;
- el servidor impide que alguien libere lo que él mismo capturó;
- Vera revisa el recorrido de cada perfil.

Si no lo dices, Orka te lo pregunta antes del primer módulo.

### Llamar a un solo agente

Si ya sabes qué decisión necesitas, puedes llamar al agente directo. Por ejemplo, `/kompa compón el formulario de registro` o `/vera diagnostica el módulo de cuentas`. Así trabaja solo ese agente y te puede hacer preguntas.

## Qué pasa después de pedirlo

Ejemplo: `/orka corrige la composición del módulo de cuentas`.

1. **Orka reconoce el caso.** Es una corrección de aspecto, no de comportamiento. Por eso se salta las etapas de requisitos y servidor.
2. **Vera revisa el módulo** contra los estándares y anota cada problema con su fuente. Por ejemplo: "el autocomplete ocupa todo el ancho y empuja el botón a otra línea · Fuente: GOV.UK (anchos de campo)".
3. **Orka reparte los problemas.** Los de orden y agrupación van a Fluxa, los de acomodo a Kompa, y si falta un componente, Kura se lo pide a Fruti Squad.
4. **Forja corrige el código** solo en las partes con problemas, y **Vera vuelve a revisar**.
5. **Orka te entrega un resumen** de 5 líneas como máximo.

Orka solo te interrumpe en dos momentos:

- cuando hay **reglas de negocio** que aprobar (por ejemplo, quién puede borrar una cuenta);
- antes de algo que **no se puede deshacer**, como borrar o migrar datos.

Todo lo demás lo resuelve él, y lo que tuvo que suponer queda anotado.

### Dónde queda el trabajo

Cada agente escribe su documento en la carpeta `docs/` de tu proyecto. Así puedes revisarlo, y una sesión nueva sigue donde se quedó la anterior.

```text
docs/usuarios.md                quién usa el sistema y qué hace cada perfil (uno por producto)
docs/orquestacion/cuentas.md    bitácora de Orka: en qué va, qué supuso, qué te pregunta
docs/requisitos/cuentas.md      qué debe hacer (Inqa)
docs/estructura/cuentas.md      pantallas y su contenido (Fluxa)
docs/composicion/cuentas.md     cómo se acomoda cada parte, con su fuente (Kompa)
docs/componentes/cuentas.md     qué componentes se usan y qué se pidió a Fruti (Kura)
docs/revision/cuentas-…md       hallazgos y veredicto (Vera)
```

## El equipo

| Agente | Qué decide | Llámalo solo cuando… |
|---|---|---|
| **Orka** · Conductor | Quién trabaja y en qué orden | Siempre puedes empezar por él |
| **Inqa** · Product Analyst | Qué debe hacer la funcionalidad y con qué reglas | Quieres entender un módulo o escribir sus requisitos |
| **Arko** · Systems Architect | Cómo se guarda y se protege en el servidor | Necesitas definir datos, API o permisos |
| **Fluxa** · Flow Designer | Qué pantallas hay, qué contienen y en qué orden | Necesitas definir campos, secciones o pasos |
| **Kompa** · Layout Composer | Cómo se acomoda cada parte: anchos, filas, jerarquía, superficies | Una vista ya tiene su contenido y falta acomodarla |
| **Kura** · Component Curator | Qué componente se usa y qué se pide a Fruti Squad | Quieres saber si algo ya existe o hay que pedirlo |
| **Forja** · Build Engineer | Cómo se escribe el código | Los documentos están aprobados y toca programar |
| **Vera** · QA Auditor | Si pasa y a quién regresa cada problema | Quieres revisar o auditar sin corregir |

Cada decisión tiene un solo dueño. Si un agente encuentra algo que no le toca, se lo regresa a su dueño en lugar de resolverlo él.

## Con Fruti Squad

Los dos squads pueden estar instalados en el mismo proyecto.

- **Fruti Squad** fabrica los componentes, los tokens (colores, tipografía, espacios) y el Design Hub.
- **Nexa Squad** los usa para armar las pantallas. Lee el stack del proyecto (Vue, React, Tailwind o CSS) y los componentes que ya existen.
- Si falta un componente o una variante, **Kura** escribe un pedido para Fruti Squad en `docs/componentes/pedidos/`. Ningún otro agente de Nexa lo hace. Si el proyecto aún no tiene Design Hub, ese primer pedido lo inicia.

Para que una frase como "rediseña este formulario" no active a los dos squads, empieza con `/orka` cuando quieras a Nexa.

## Opciones de instalación

```bash
npx github:kevinedgm/nexa-squad install --target claude             # Claude Code (recomendado)
npx github:kevinedgm/nexa-squad install --target codex              # Codex
npx github:kevinedgm/nexa-squad install --target kiro               # Kiro
npx github:kevinedgm/nexa-squad install --target claude --global    # para todos tus proyectos
npx github:kevinedgm/nexa-squad install --only kompa,vera           # solo algunos agentes
npx github:kevinedgm/nexa-squad install --dry-run                   # ver qué haría, sin cambiar nada
npx github:kevinedgm/nexa-squad list                                # lista de agentes
```

Qué agrega a tu proyecto con `--target claude`:

| Ruta | Para qué |
|---|---|
| `.claude/skills/<agente>/` | Las instrucciones de cada agente |
| `.claude/agents/<agente>-agent.md` | La versión que Orka usa al trabajar en cadena |
| `.nexa-squad/` | Reglas comunes, catálogo de estándares y guía de comandos |
| Un bloque en `CLAUDE.md` | Para que Claude Code cargue las reglas comunes |

El instalador no sobrescribe nada sin `--force`, y al reinstalar solo cambia su propio bloque en `CLAUDE.md`. En Codex y Kiro las rutas son otras; las muestra `list`.

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
```

```bash
npm test           # valida nombres, referencias, guía de comandos y cadena
npm run comandos   # regenera comandos/comandos.md después de editar comandos.json
```

Para cambiar o agregar un agente, sigue [docs/contribuir.md](docs/contribuir.md).

## Licencia

MIT
