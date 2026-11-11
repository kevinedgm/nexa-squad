# Nexa Squad y Fruti Squad: cuál usar y cómo trabajan juntos

**Resumen.** Fruti Squad fabrica las **piezas** del sistema de diseño: componentes, variantes, patrones y tokens, documentados en el Design Hub. Nexa Squad construye los **módulos** del producto: pantallas que usa un rol concreto, con sus datos, reglas de negocio y servidor, armadas con esas piezas. Cuando a Nexa le falta una pieza, la pide a Fruti; cuando Fruti la termina, Nexa la usa. Cada uno funciona solo; juntos se reparten el trabajo sin pisarse.

## 1. La pregunta que decide

> ¿El resultado es algo que se **reutiliza en muchas pantallas** y vive en el Design Hub, o es una **funcionalidad del producto** que usa una persona con un rol?

- Se reutiliza y vive en el Design Hub → **Fruti Squad**.
- Es una funcionalidad del producto, con datos, reglas y un rol que la usa → **Nexa Squad**.

**Las pantallas del producto son de Nexa.** Cuando los dos squads están instalados (existe `.nexa-squad/`), Fruti no diseña pantallas ni módulos del producto, ni siquiera como prototipo. Kiwi responde en una línea con la frase para Nexa. Fruti sí diseña **patrones** reutilizables de pantalla, por ejemplo "el formulario de alta estándar": cómo se agrupan los campos, dónde van las acciones y cómo se adapta a pantallas chicas. Nexa usa ese patrón al armar "el alta de muestra de la recepcionista".

Si Nexa no está instalado, Fruti sigue diseñando pantallas completas.

Ejemplo con la misma palabra, "autocomplete":
- "Necesito un autocomplete que busque mientras escribo y se pueda usar con teclado" → Fruti. Es una pieza.
- "En Cuentas, la recepcionista busca la muestra pendiente con un autocomplete y la paga" → Nexa. Es un módulo que usa la pieza.

## 2. Qué pedirle a cada uno

| Lo que quieres | Squad | Cómo se pide |
|---|---|---|
| Un componente nuevo (selector, tabla, tarjeta, diálogo) | Fruti | "Diseña un selector de fecha con rango" |
| Una variante de un componente existente | Fruti | "Al campo de texto agrégale un adorno de unidad" |
| Cambiar la fuente, el color de acción o los radios en todo el sistema | Fruti | "Cambia el color de acción" |
| Crear los fundamentos de un sistema nuevo | Fruti | `fruti foundations --marca '#0B6E4F' --fuente Inter` |
| Auditar o promover un componente | Fruti | "Audítalo", "promuévelo a estable" |
| Documentar el Design Hub | Fruti | "Documenta el selector en el Hub" |
| Un módulo nuevo del producto | Nexa | `/orka quiero registrar signos vitales en la consulta` |
| Agregar un comportamiento a un módulo existente | Nexa | `/orka en pagos, avisa al cliente cuando se rechace un pago` |
| Traer una funcionalidad de otra aplicación | Nexa | `/orka trae la bitácora del laboratorio, pero para radiología` |
| Corregir cómo se acomoda un módulo ya construido | Nexa | `/orka corrige el diseño de cuentas; lo usa la recepcionista para…` |
| Corregir el diseño o el flujo de un módulo que ya funciona | Nexa | `/orka corrige el diseño de <módulo>; lo usa <rol> para <tareas>` |
| Migrar un módulo legacy a otro stack o a otra base de datos | Nexa | `/orka migra el módulo gestor a la base nueva` |
| Definir los roles del producto | Nexa | `/orka init` |

Para Nexa, empieza siempre con `/orka`. Si una frase como "rediseña el formulario de cuentas" le llega a Fruti y Nexa está instalado, Kiwi no la diseña: te responde con la frase para Nexa. Si lo que querías era el patrón reutilizable, pídelo así: "diseña el patrón de formulario de alta".

## 3. De qué se encarga cada uno

| | Fruti Squad | Nexa Squad |
|---|---|---|
| Pregunta que responde | ¿Cómo es y cómo funciona esta pieza en cualquier pantalla? | ¿Qué necesita esta persona para hacer su tarea, y cómo se arma? |
| Unidad de trabajo | Componente, variante, patrón, token | Módulo del producto (pantallas, datos, servidor) |
| Agentes | Kiwi (estructura), Lima (gobierno), Coco (capa visual y auditoría), Bruno (comportamiento), Mora (documentación) | Orka (conductor), Inqa (requisitos), Arko (servidor), Fluxa (pantallas), Kompa (acomodo), Kura (componentes), Forja (código), Vera (revisión) |
| Decide | Anatomía, variantes, estados y transiciones, API, tokens, ciclo de vida | Reglas de negocio, roles y permisos, datos y API del servidor, qué pantallas hay, cómo se acomodan las piezas en cada una |
| Entrega | Componente en el código, contrato, registro, página del Design Hub | Módulo funcionando, documentos en `docs/` y revisión por rol |
| Dónde guarda su estado | `.fruti/` (perfil, tokens, registro, handoffs) | `docs/` (producto, requisitos, estructura, composición, componentes, revisión) |
| No hace | No decide reglas de negocio, roles ni el servidor de un módulo. Con Nexa instalado, no diseña pantallas del producto | No crea ni modifica componentes, variantes, patrones ni tokens |

## 4. Cuándo trabajan juntos

### A. A Nexa le falta una pieza

El caso más común.

1. Nexa arma un módulo. **Kura** y **Kompa** buscan cada pieza en `.fruti/catalog.md`, un catálogo que mantiene Mora: qué piezas existen, para qué sirven, cómo se importan, sus variantes, tamaños y estados, y en qué estado están (el estado lo toman del registro). Abren la página del Design Hub solo de la pieza elegida y solo si al catálogo le falta un dato.
2. Si no existe, o le falta una variante, Kura escribe un pedido en `docs/componentes/pedidos/<id>.md`. El pedido describe la necesidad, no el aspecto: propósito, dónde se usa, partes, estados con su disparador, regla y feedback, accesibilidad y criterios de aceptación.
3. **Forja** construye el módulo y deja ese lugar marcado como pendiente. El resto del módulo avanza.
4. Le das el pedido a Fruti: "Diseña el componente de `docs/componentes/pedidos/<id>.md`".
5. Fruti lo recorre completo: Kiwi → Lima → Coco → Bruno → Coco (auditoría) → Lima → Mora. La tabla de estados del pedido alimenta la tabla de transiciones del contrato de Lima.
6. Cuando el componente queda en el registro, le dices a Nexa `/orka continúa <módulo>`. Kura lo reutiliza y Forja reemplaza el pendiente.

Solo Kura pide cosas a Fruti. Ningún otro agente de Nexa lo hace.

### B. Un módulo hecho con piezas de Fruti se ve mal

Ejemplo: Cuentas tiene buenos componentes, pero el autocomplete ocupa todo el ancho y empuja el botón a otra línea.

1. `/orka corrige el diseño de cuentas; lo usa la recepcionista para…`
2. **Vera** revisa el módulo con las tareas de ese rol y separa los problemas por dueño:
   - de acomodo (anchos, filas, jerarquía) → los corrige Nexa (Kompa y Forja);
   - de la pieza misma (no tiene la variante que hace falta, o su comportamiento está mal) → Kura escribe un pedido y vuelve al caso A.

### C. Rediseñar una aplicación existente

1. Fruti (Kiwi) entiende la dirección visual, hace el inventario y tú apruebas el alcance.
2. El plan de Fruti cubre fundamentos, primitivas, patrones y componentes. Las vistas quedan con `owner: nexa`.
3. Cada vista se rediseña con Nexa: `/orka corrige el diseño de <módulo>; lo usa <rol> para <tareas>`. Nexa la arma con las piezas y los patrones nuevos.

### D. Cambia la marca o un token

1. Fruti cambia el token en `.fruti/tokens.json` (Lima) y regenera lo que depende de él.
2. Los módulos de Nexa usan tokens, no valores sueltos, así que el cambio les llega solo.
3. Si quieres comprobar que ningún módulo se rompió, pídele a Nexa `/vera diagnostica el módulo de <módulo>`.

### E. Un producto que empieza desde cero

1. Con Nexa, `/orka init` define el producto y sus roles.
2. Con Fruti, `fruti foundations` propone los fundamentos visuales y Lima los aprueba. Si no se hace antes, el primer pedido de Kura inicia el Design Hub.
3. Desde ahí, cada módulo sigue el caso A.

## 5. Quién gana cuando no coinciden

| Tema | Manda | Por qué |
|---|---|---|
| Cómo es, se comporta y se llama un componente | Fruti (contrato de Lima y registro) | Es la fuente compartida por todos los módulos |
| Valores visuales (color, tipografía, espacios, radios) | Fruti (`.fruti/tokens.json`) | Un solo lugar para cambiar la marca |
| Reglas de negocio, roles y permisos | Nexa (requisitos de Inqa, aprobados por ti) | Dependen del producto, no de la pieza |
| Cómo se acomodan las piezas en una pantalla | Nexa (Kompa) | Depende del contexto y del rol |
| Una norma obligatoria (por ejemplo, WCAG) contra una regla del sistema | La norma | Nexa lo reporta como hallazgo y Kura se lo pide a Fruti; ninguno compone en contra de la norma |

Si Nexa necesita que un componente cambie, no lo modifica: lo pide. Si Fruti necesita saber cómo se usa una pieza en el producto, lo toma del pedido, no lo inventa.
