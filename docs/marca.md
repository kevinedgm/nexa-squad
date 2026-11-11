# Marca de Nexa Squad

Resumen: Nexa no fabrica piezas, acomoda las que ya existen. Por eso todos los símbolos son el mismo bloque y lo que cambia es el **hueco**: el lugar exacto donde algo encaja. Cada hueco representa lo que hace su agente, y el cian vive solo ahí. Los archivos están en `assets/marca/`.

## Símbolos

| Agente | Rol | Lema | Hueco |
|---|---|---|---|
| Nexa Squad | Composición de módulos | Tres skills que componen y construyen pantallas con los componentes que ya tienes. | Dos canales que parten el bloque en cuatro y se cruzan en un nexo redondo: cada decisión tiene un dueño y todas se encuentran en el módulo. |
| Inqa | Product Analyst | Qué debe hacer la funcionalidad, para quién y cómo se comprueba. | Un renglón entero (hecho), uno partido (supuesto) y un punto (pregunta). |
| Kompa | Layout Composer | Cómo se compone una pantalla: qué se ve primero, qué dice y qué nunca se mueve. | La misma fila en tres anchos: el tramo final nunca cede. |
| Forja | Build Engineer | Construye datos, API, permisos y lógica. | La base completa y la capa de arriba a medias: se construye de abajo hacia arriba. |

Cada símbolo tiene dos archivos: `<agente>.svg` para fondo claro y `<agente>-oscuro.svg` para fondo oscuro. En GitHub se usan juntos con `<picture>` para que cambien solos con el tema.

## Color

Tinta y un solo acento.

| Nombre | Valor | Uso |
|---|---|---|
| Tinta | `#16161B` | Bloque sobre fondo claro |
| Claro | `#F3F3EE` | Bloque sobre fondo oscuro |
| Cian | `#22C3E6` | Hueco sobre fondo claro (8.6:1 contra tinta) |
| Cian oscuro | `#00728A` | Hueco sobre fondo oscuro (5.0:1 contra claro) |
| Oscuro | `#101014` | Fondo oscuro |

1. El bloque siempre es neutro: tinta en claro, claro en oscuro. El cian vive solo dentro del hueco.
2. Un solo acento para toda la familia: lo que hace cada agente es lo que brilla.
3. Sobre claro va el cian `#22C3E6`; sobre oscuro, el cian oscuro `#00728A`. Nunca al revés.
4. Cada agente se reconoce por su hueco; el color nunca es la única señal.
5. Las plataformas (Claude Code, Codex, Kiro) se nombran en texto, nunca con sus logotipos dentro de la marca.

Usos incorrectos: pintar el bloque de cian, usar cian claro sobre un bloque claro, deformar o girar el símbolo, y darle un color distinto a cada agente.

## Construcción

- Lienzo de 48; bloque de 40 × 40 en (4, 4), con radio 7.
- Retícula de 4: los cortes caen en ella o en su mitad.
- Canales de 4, huecos de 8 y círculos de radio 4 como mínimo, para que sigan visibles a 16 px.
- Tres cortes como máximo. La excepción es Kompa: cinco cortes en tres anchos.
- Margen de respeto: la mitad del símbolo alrededor.

## Tipografía

**Bricolage Grotesque**: 700 para el nombre y 400 para el producto y el texto. Es la misma familia de Fruti Squad, así que los dos squads se leen como hermanos; el símbolo y el color los separan. Licencia SIL Open Font (Google Fonts). En las firmas va convertida a trazos.

## Relación con Fruti Squad

| | Fruti Squad | Nexa Squad |
|---|---|---|
| Idea | Marco redondeado (la pieza) y punto (la evidencia) | Bloque (lo que ya existe) y hueco (donde algo encaja) |
| Color | Un color por agente, solo en el punto | Un solo cian para todos, solo en el hueco |
| Tipografía | Bricolage Grotesque | Bricolage Grotesque |

## Portada para redes

`assets/marca/nexa-squad-og-1200x630.png` es la portada Open Graph del squad. Para usarla como vista previa del repositorio: GitHub → Settings → General → Social preview.
