# Comandos: a quién invocar

Archivo generado desde `comandos/comandos.json` (`npm run comandos`). No lo edites a mano.

Regla corta: **si el trabajo toca más de un rol, empieza con `/orka`**; si sabes exactamente qué decisión necesitas, llama al rol directo. Si no sabes, pregunta `/orka ¿a quién invoco para …?` o, en la terminal, `npx github:kevinedgm/nexa-squad quien "lo que quiero"`.

En Claude Code cada rol se invoca con `/<rol>`. En Codex y Kiro, di "usa <rol> para …" (por ejemplo, "usa orka para migrar el gestor").

## Trabajo de varios roles (Orka decide la cadena)

| Quiero… | Di | Invoca | Arranca en | Qué pasa |
|---|---|---|---|---|
| Describir el producto y quién lo usa (una vez, al empezar) | `/orka init` | orka | inqa | Inqa escribe docs/producto.md: qué es el producto, a quién se dirige, cada rol con sus tareas y quién revisa a quién. Tú lo apruebas y todos los agentes diseñan para esos roles. |
| Construir una funcionalidad nueva desde una descripción | `/orka quiero una funcionalidad para <qué> en <módulo>` | orka | inqa | Cadena completa. Inqa te pregunta las reglas y tú las apruebas antes de diseñar. |
| Agregar un comportamiento a un módulo que ya existe | `/orka en <módulo>, cuando <pasa X>, ahora tiene que <pasar Y>` | orka | inqa | Inqa documenta solo el cambio; los roles cuya decisión no cambia se saltan. |
| Traer una funcionalidad de otra aplicación y adaptarla | `/orka lee <funcionalidad> de <app o ruta> y tráela aquí, pero para <qué>` | orka | inqa | Inqa lee la app de origen y arma una tabla igual / adaptado / no se trae que tú apruebas; Arko la traduce a tu stack. |
| Corregir el diseño o el flujo de un módulo que ya funciona (hecho con Fruti Squad, a mano o legacy), sin cambiar stack ni datos | `/orka corrige el diseño de <módulo>; lo usa <rol> para <tareas>` | orka | vera | Vera hace un diagnóstico contra los estándares; solo se corrigen las regiones con hallazgos, sin inventario ni preparación de datos. Si un hallazgo cambia lo que hace el módulo, va a Inqa. |
| Migrar un módulo legacy: cambia el stack, el framework o el modelo de datos | `/orka migra <módulo> a <stack o base nueva>` | orka | inqa | Cadena completa; lo que hace el legacy es evidencia, no requisito. Si el stack y los datos se quedan igual, es corregir. |
| Seguir un módulo que quedó a medias o saber cómo va | `/orka continúa <módulo>  ·  /orka ¿cómo va <módulo>?` | orka | el primer documento pendiente | Orka lee la bitácora y sigue donde se quedó; no repite lo aprobado. |

## Un solo rol

Usado solo, el rol corre en la conversación y puede preguntarte. Si le falta el documento de entrada, te lo dice y te propone qué rol lo produce.

| Quiero… | Di | Invoca | Arranca en | Qué pasa |
|---|---|---|---|---|
| Solo entender qué hace un módulo y escribir sus requisitos | `/inqa analiza <módulo>` | inqa | inqa | Documento de requisitos con hechos, supuestos y hasta 5 preguntas para ti. |
| Definir cómo se construye por detrás: datos, API, permisos | `/arko define la arquitectura de <módulo>` | arko | arko | Arquitectura y checklist de implementación; necesita requisitos aprobados. |
| Definir qué pantallas hay, qué contienen y en qué orden | `/fluxa define las pantallas de <módulo>` | fluxa | fluxa | Vistas, secciones, campos, unidades, condicionales y el patrón de cada región. |
| Definir cómo se acomoda una vista: anchos, filas, jerarquía, superficies | `/kompa compón <vista o formulario>` | kompa | kompa | Composición con fuente de cada regla; necesita la estructura de Fluxa. |
| Saber qué componentes se reutilizan y qué hay que pedir a Fruti Squad | `/kura revisa los componentes de <módulo>` | kura | kura | Reutilizar, variante o pedido a Fruti Squad en docs/componentes/pedidos/. |
| Escribir el código de una fase ya aprobada | `/forja construye la fase <n> de <módulo>` | forja | forja | Código y reporte de la fase; necesita los documentos aprobados. |
| Revisar lo construido, o solo auditar un módulo sin corregir nada | `/vera revisa la fase <n> de <módulo>  ·  /vera diagnostica <módulo>` | vera | vera | Hallazgos con evidencia, fuente y dueño; no corrige. |

## Si no sabes

| Quiero… | Di | Invoca | Arranca en | Qué pasa |
|---|---|---|---|---|
| No sé a quién invocar | `/orka ¿a quién invoco para <lo que quiero>?` | orka | orka | Orka te responde con el comando de esta guía y, si quieres, lo ejecuta. |

## Cómo distinguir los casos que se parecen

| Si dices… | Es | Porque |
|---|---|---|
| "corrige la composición", "se ve mal", "está mal acomodado" | corregir | Cambia cómo se ve, no lo que hace |
| "cuando pase X, ahora tiene que pasar Y" | extender | Cambia lo que hace |
| "corrige" sin más | Orka pregunta una vez | Puede ser cualquiera de los dos |
| "tráela de tal app" | traer | El origen es otra aplicación |
| "rediseña" un módulo legacy | migrar | Se revisa también qué debe hacer |
| "solo audita", "diagnostica" | revisar (Vera sola) | Nadie corrige después |

## Desde la terminal

```bash
npx github:kevinedgm/nexa-squad comandos                         # esta guía
npx github:kevinedgm/nexa-squad quien "el formulario de cuentas se ve mal"
```
