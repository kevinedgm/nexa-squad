# Escalas y tokens: proponer lo que falta sin inventar valores

Propósito: cuando un hueco necesita un valor que el proyecto no tiene (un tamaño de texto, un espacio, una altura de control, un radio, una sombra, un color de estado), proponerlo derivado del sistema existente, con nombre semántico y con su impacto declarado.

## Contenido

1. Por qué escalas y no valores
2. Primero: leer el sistema que ya existe
3. Derivar un token faltante
4. Nombres semánticos vs primitivos
5. Definir un token vs adoptarlo
6. Checklist de propuesta de token
7. Ejemplo: gestor de archivos
8. Errores comunes
9. Límites del rol

## 1. Por qué escalas y no valores

Una escala es un conjunto cerrado de valores permitidos. Funciona porque convierte cada decisión de "¿cuánto?" en "¿cuál de estos?", y eso hace que pantallas hechas por personas distintas se vean del mismo sistema.

- Un valor suelto (un espacio de 13, un texto de 15) no es un error visual por sí mismo; es un error de sistema: nadie más lo va a reutilizar, y la siguiente persona inventará otro parecido.
- Los pasos de una escala deben ser lo bastante distintos para notarse. Si dos pasos se confunden a simple vista, sobra uno.
- Las relaciones importan más que los números: el espacio entre grupos debe ser mayor que el espacio dentro de un grupo; los niveles de texto deben distinguirse sin tener que mover los tres controles (tamaño, peso, color) a la vez.

**Regla del squad: nada de valores sueltos.** Todo valor en una propuesta es un token existente o un token propuesto con su derivación.

## 2. Primero: leer el sistema que ya existe

Antes de proponer, inventaría lo que hay. Fuentes típicas: variables de la hoja de estilos, archivo de tokens, tema del sistema visual en uso, componentes ya construidos.

Para cada familia anota: valores existentes, cómo se llaman, qué regla parece generarlos y dónde se usan.

| Familia | Qué buscar | Regla que suele generarla |
|---|---|---|
| Espaciado | Rellenos, separaciones, márgenes | Múltiplos de una unidad base |
| Tipografía | Tamaños de texto y alturas de línea | Una razón constante entre pasos (escala modular), ajustada a mano |
| Alturas de control | Botones, campos, selectores, filas de tabla | Altura de línea del texto del control + relleno vertical de la escala de espaciado |
| Radios | Esquinas de controles, tarjetas, diálogos | Pocos pasos; los elementos chicos usan radios chicos; anidado: radio interior = exterior − relleno |
| Sombras / elevación | Tarjetas, menús, diálogos | Más altura percibida = sombra más grande; pocos niveles |
| Color | Neutros, marca, estados (éxito, aviso, peligro, información) | Gamas de varios tonos por color; contraste mínimo de texto 4.5:1 (3:1 en texto grande) |

Si el proyecto mezcla sistemas (p. ej., un tema comercial más una hoja propia), anota cuál manda en el módulo y cuáles valores coinciden o chocan. Ese choque es un **hecho** a reportar, no algo que el curador resuelva migrando.

## 3. Derivar un token faltante

Un token propuesto se justifica por cómo sale del sistema, no por cómo se ve.

1. **Ubica el hueco en la escala**: ¿cae entre dos pasos existentes, o fuera de los extremos?
2. **Intenta usar un paso existente.** Casi siempre uno sirve; prueba el inmediato superior e inferior antes de proponer.
3. **Si de verdad falta, aplica la regla de la familia:**
   - Espaciado: siguiente múltiplo de la unidad base que respete el salto entre pasos vecinos.
   - Tipografía: aplica la misma razón entre pasos que usa la escala; redondea a un valor que el sistema pueda expresar. Asigna altura de línea por contexto (títulos más apretados, texto de interfaz intermedio, texto corrido más holgado), tomada de las alturas de línea existentes.
   - Altura de control: altura de línea del texto del control + 2 × un paso de espaciado. Si el control nuevo convive en una fila con otros (campo junto a botón), debe dar la misma altura que ellos.
   - Radio y sombra: elige el nivel por tamaño y elevación del elemento, no crees uno intermedio.
   - Color de estado: un tono de una gama existente que cumpla contraste; nunca un color nuevo fuera de las gamas.
4. **Escribe la derivación en una línea**, verificable por otra persona. Ejemplo (valores de ejemplo): "unidad base 4; existen 8 y 16; propongo 12 porque las filas compactas necesitan un paso entre ambos y 12 es múltiplo de la base".
5. **Marca el valor como propuesto**, no como definido, hasta que lo apruebe el dueño del sistema visual.

## 4. Nombres semánticos vs primitivos

Hay dos capas y no se mezclan:

| Capa | Qué nombra | Ejemplo de nombre | Quién lo usa |
|---|---|---|---|
| Primitivo | Un valor de la escala | `espacio-3`, `gris-700`, `texto-sm` | Solo la capa semántica |
| Semántico | Una intención | `espacio-entre-campos`, `texto-secundario`, `borde-peligro`, `altura-control-compacto` | Componentes y pantallas |

Mecanismo: el nombre semántico oculta el valor. Si mañana el texto secundario debe oscurecerse por contraste, cambia una línea (a qué primitivo apunta) y todas las pantallas se corrigen solas. Si las pantallas usan el primitivo directo, el cambio hay que hacerlo pantalla por pantalla.

Reglas:

- Un componente nunca pide un primitivo directo; pide un semántico.
- Un semántico nuevo solo se crea si expresa una intención que no tiene nombre. Si "espacio entre campos" ya existe, "separación de inputs" es duplicado.
- El nombre describe para qué sirve, no cómo se ve: `fondo-fila-seleccionada`, no `azul-clarito`.
- Respeta la convención de nombres del proyecto; no impongas una nueva.

## 5. Definir un token vs adoptarlo

Son dos decisiones distintas con impactos distintos:

| Acción | Qué significa | Impacto | Cómo se reporta |
|---|---|---|---|
| **Definir** | El token pasa a existir en el sistema | Ninguno visible: nadie lo usa aún | "Token propuesto" con derivación |
| **Adoptar en el módulo** | Este módulo lo usa | Solo el módulo actual | Lista de componentes/pantallas del módulo que lo usan |
| **Adoptar en un compartido** | Un componente compartido lo usa | Todos los módulos que usan ese componente | Lista de módulos afectados (verificada o "no comprobado") |
| **Cambiar el valor de uno existente** | Un token ya usado cambia | Todo lo que lo usa | Cambio de sistema; va al dueño del sistema visual, no lo decide el curador |

Regla: si una propuesta cambia la apariencia de otra pantalla, no es una adopción local. Declárala como impacto y no la des por aprobada.

## 6. Checklist de propuesta de token

- [ ] Inventarié la familia en el sistema existente (hecho, con dónde lo vi).
- [ ] Probé los pasos vecinos existentes y expliqué por qué no sirven.
- [ ] La derivación cabe en una línea y sigue la regla de la familia.
- [ ] Tiene nombre semántico; apunta a un primitivo existente o a uno propuesto.
- [ ] No duplica la intención de otro semántico.
- [ ] Separé "definir" de "adoptar" e indiqué el alcance del impacto.
- [ ] Si involucra color: contraste comprobado o marcado "no comprobado".
- [ ] Cualquier número citado de otro sistema está marcado como ejemplo.

## 7. Ejemplo: gestor de archivos

Valores de ejemplo; los reales salen del proyecto.

| Necesidad | Hallazgo | Propuesta |
|---|---|---|
| Filas de la lista compacta de archivos | Existen altura de control normal y grande; no hay compacta | Definir `altura-control-compacto` = altura de línea del texto de interfaz + 2 × paso de espaciado menor. Adoptar solo en la variante compacta de la lista |
| Texto del nombre de archivo vs ruta de carpeta | Existen `texto-base` y `texto-sm` | Reutilizar: nombre en `texto-base`, ruta en `texto-sm` con `texto-secundario`. Sin token nuevo |
| Fondo de la acción "Retirar" en confirmación | Existe gama de peligro | Usar semántico `fondo-accion-peligro`; si no existe, definirlo apuntando a un tono de la gama de peligro que cumpla contraste |
| Insignia de nivel de acceso 1-4 | No hay colores por nivel | No crear 4 colores nuevos. Reutilizar neutros y tono informativo; el nivel se lee por el texto, no solo por color |
| Separación entre la barra de herramientas y la lista | Hay un valor suelto en el código heredado | Reemplazar por el semántico de separación entre grupos; reportar el valor suelto como hallazgo |

## 8. Errores comunes

- Proponer un valor "porque se ve mejor" sin derivación.
- Crear un paso intermedio cuando el vecino existente servía.
- Usar primitivos directamente en componentes.
- Nombrar por aspecto (`rojo-suave`) en vez de por intención.
- Cambiar el valor de un token existente para arreglar una sola pantalla.
- Copiar números de otro sistema (p. ej., una escala de un framework de utilidades) como si fueran del proyecto.
- Dar por cumplido el contraste sin medirlo.

## 9. Límites del rol

El curador propone tokens faltantes y declara su impacto. No elige la paleta ni la tipografía del producto, no decide cómo se acomoda cada sección (compositor), no cambia el valor de tokens existentes por su cuenta y no migra el proyecto a otro sistema visual. Si las escalas existentes están rotas o se contradicen, lo reporta como hallazgo con evidencia.

Adaptado de wondelai/skills (refactoring-ui, basado en "Refactoring UI" de Adam Wathan y Steve Schoger; web-typography, basado en "On Web Typography" de Jason Santa Maria), licencia MIT.
