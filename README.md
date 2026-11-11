<div align="center">

<picture><source media="(prefers-color-scheme: dark)" srcset="assets/marca/nexa-squad-oscuro.svg"><img src="assets/marca/nexa-squad.svg" alt="Nexa Squad" width="96"></picture>

# Nexa Squad

**Tres skills que componen y construyen pantallas con los componentes que ya tienes.**

<picture><source media="(prefers-color-scheme: dark)" srcset="assets/marca/kompa-oscuro.svg"><img src="assets/marca/kompa.svg" alt="Kompa" width="32"></picture>&nbsp;<picture><source media="(prefers-color-scheme: dark)" srcset="assets/marca/forja-oscuro.svg"><img src="assets/marca/forja.svg" alt="Forja" width="32"></picture>&nbsp;<picture><source media="(prefers-color-scheme: dark)" srcset="assets/marca/inqa-oscuro.svg"><img src="assets/marca/inqa.svg" alt="Inqa" width="32"></picture>

Kompa · Forja · Inqa

</div>

---

## Qué problema resuelve

Fruti Squad fabrica buenos componentes. Pero un formulario no es una lista de campos: alguien tiene que decidir qué se alinea con qué, dónde va un separador, qué dice la ayuda bajo cada campo, qué explica cada opción, qué avisa el pie antes de confirmar y cómo se usa el componente que ya existe en el proyecto. Eso es la **composición**, y es lo que hace Kompa.

Cada regla cita un estándar (Refactoring UI, GOV.UK, Nielsen, Krug, WCAG y los demás del [catálogo](estandares/estandares.md)). Nada sale del gusto.

## Las tres skills

| Skill | Es dueña de | Pídele, por ejemplo |
|---|---|---|
| **kompa** | Cómo se compone una pantalla: jerarquía, alineación, separadores, textos de ayuda, contraste, semántica e integración con lo existente | "Usa kompa: agrega separadores al formulario de alta de paciente" · "usa kompa: corrige el diseño del modal de pausa" · "usa kompa: audita la tarjeta de consulta" |
| **forja** | Cómo se construye: datos, API, permisos y lógica | "Usa forja: en pagos, avisa al cliente cuando se rechace un pago" |
| **inqa** | Qué debe hacer un módulo nuevo y con qué reglas | "Usa inqa: quiero registrar signos vitales en la consulta" |

Las tres corren en tu conversación y editan el código directamente. No hay orquestador, subagentes ni documentos intermedios. Si al trabajar aparece algo que es de otra skill, te lo dicen en una línea.

**El alcance lo pone tu petición.** "Agrega separadores" es agregar separadores: Kompa abre el archivo de la pantalla, edita y al final te dice en una línea qué más falla. "Corrige el diseño" es diagnóstico completo con calificación antes y después.

## Cómo califica Kompa

Kompa revisa cada pantalla con 22 filas comprobables, en cuatro grupos:

- **Contenido:** el título dice la tarea; una línea dice la consecuencia; la ayuda dice formato o dónde aparece lo guardado; cada opción explica su efecto; el pie avisa el efecto secundario; el botón repite el verbo del título.
- **Apariencia:** una columna, un borde izquierdo, tres niveles de texto, más espacio entre grupos que dentro, divisor solo cuando cambia el tipo de decisión, contraste.
- **Semántica:** etiquetas, `fieldset`, `aria-describedby`, diálogo accesible, foco.
- **Integración:** usa los componentes y la convención del proyecto, y no rompe otros usos.

Calificación = filas que pasan ÷ filas que aplican × 10. La tabla completa está en [skills/kompa/SKILL.md](skills/kompa/SKILL.md).

## Instalación

Necesitas Node.js 16 o superior. Funciona en Claude Code, Codex y Kiro.

```bash
npx github:kevinedgm/nexa-squad install --target kiro      # o claude, o codex
```

Para actualizar desde una versión anterior, mira primero qué cambia:

```bash
npx github:kevinedgm/nexa-squad update --target kiro --dry-run
npx github:kevinedgm/nexa-squad update --target kiro
```

La versión 1.0 quita el orquestador y los subagentes. `update` marca como `obsoleto` lo que quedó de la 0.x (agentes de Kiro, hooks, `verificar.mjs`, skills de Orka, Arko, Fluxa, Kura y Vera). No lo borra: bórralo a mano cuando quieras.

## Con Fruti Squad

Fruti fabrica las piezas y Nexa compone las pantallas con ellas. Cuando falta una pieza que se usará en 3 o más lugares, Kompa resuelve con lo que hay, marca el lugar `PENDIENTE` y escribe el pedido para Fruti. Detalle en [docs/nexa-y-fruti.md](docs/nexa-y-fruti.md).

## Licencia

MIT
