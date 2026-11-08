# Checklist visual y de accesibilidad

Propósito: comprobar que lo construido respeta la composición aprobada y un piso de accesibilidad, y dejar escrito cómo se verificó cada punto. Úsala después de la auditoría de uso, vista por vista.

## Contenido

1. Tres marcas de verificación
2. Diagnóstico visual rápido
3. Revisión por anchos
4. Accesibilidad esencial
5. Ejemplo: vista de carpeta en el gestor
6. A quién regresa cada falla
7. Errores comunes
8. Límites del rol

## 1. Tres marcas de verificación

Cada punto del checklist termina con una de estas marcas. Sin marca, el punto no cuenta.

| Marca | Significa | Ejemplo válido |
|---|---|---|
| Comprobado en pantalla | Lo viste o lo operaste en la app corriendo, con el ancho, nivel de usuario y datos anotados | "Tab recorre la barra de herramientas en orden; foco visible en cada control (1280 px, nivel 2)" |
| Comprobado en código | Lo leíste en el código o en los estilos, con archivo y línea | "El botón de retirar usa el token de color de peligro, `vista-carpeta` línea 88" |
| No comprobado | No pudiste verificarlo; se dice por qué | "Lector de pantalla: no disponible en esta revisión" |

Reglas:

- Lo que solo depende del comportamiento (foco, orden de tabulación, anuncios, desbordes) se comprueba en pantalla; leerlo en código no basta, porque estilos externos o scripts pueden anularlo.
- Lo que solo depende de valores (uso de tokens, etiquetas asociadas, atributos de texto alternativo) puede comprobarse en código.
- Los permisos no se dan por buenos con ninguna de estas marcas visuales: piden "comprobado contra servidor" (petición hecha y respuesta anotada) o código con archivo y línea.
- "No comprobado" va a Pendientes, nunca a Cumplimientos. Declarar cumplido algo que no verificaste es el error más caro del revisor: cierra un problema que sigue abierto.

## 2. Diagnóstico visual rápido

Mecanismo: el ojo jerarquiza por contraste de tamaño, peso, color y espacio. Si todo pesa igual, el usuario lee en orden en vez de ir a lo importante. Estas pruebas aíslan cada señal.

| Prueba | Cómo se hace | Pasa si… | Si falla, revisa contra… |
|---|---|---|---|
| Entrecerrar los ojos | Desenfoca la vista (o aplica desenfoque a una captura) | Se distinguen la acción principal, el título y el área de datos, en ese orden de peso | La jerarquía definida por composición |
| Escala de grises | Quita el color a una captura | La jerarquía y los estados siguen leyéndose sin color | Composición; si un estado solo se distingue por color, también accesibilidad |
| Espaciado de tokens | Inspecciona márgenes y separaciones | Todos los valores salen de la escala de espaciado del proyecto; no hay valores sueltos | Tokens del proyecto y composición |
| Agrupación | Mira las distancias | Lo relacionado está más cerca entre sí que de lo no relacionado; los grupos se separan más que sus elementos | Composición |
| Etiquetas vs. valores | Lee una ficha o fila | El valor (nombre del archivo, fecha) domina; la etiqueta ("Modificado") cede en tamaño, peso o color | Composición |
| Ancho de texto | Lee párrafos largos | Las líneas no se estiran a todo el ancho de pantalla | Composición |
| Elevación | Revisa sombras y bordes | Cada nivel de elevación corresponde a su propósito (tarjeta, menú, diálogo) y usa los tokens de sombra | Tokens del proyecto |
| Una acción principal | Cuenta los botones con tratamiento principal | Hay uno por vista, el que la estructura marcó | Estructura y composición |

Un valor que no está en los tokens es hallazgo de implementación si el token existe, y de componente (curador) si el token falta.

## 3. Revisión por anchos

Revisa cada vista al menos en tres anchos: el de escritorio de trabajo, uno intermedio (tableta) y el más angosto que el proyecto soporte. Los valores exactos salen de los puntos de quiebre del proyecto.

- [ ] No hay desplazamiento horizontal de la página (solo dentro de tablas que la composición permitió desplazar).
- [ ] Lo que cede en pantalla chica es lo que la composición dijo que cede, en ese orden.
- [ ] La acción principal sigue visible y alcanzable sin buscarla.
- [ ] Nombres largos de archivo se recortan o parten como se definió; no rompen la fila ni tapan acciones.
- [ ] Menús, diálogos y avisos caben y se pueden cerrar.
- [ ] Con el texto ampliado al doble (zoom del navegador) no se pierde contenido ni funciones.

## 4. Accesibilidad esencial

Los valores de esta sección vienen de WCAG 2.1 nivel AA, que es un estándar, no un sistema visual. Si el proyecto adoptó otro nivel, manda el del proyecto.

| Punto | Criterio verificable | Cómo comprobarlo | Marca preferida |
|---|---|---|---|
| Contraste de texto | 4.5:1 en texto normal; 3:1 en texto grande | Medidor de contraste sobre los colores reales renderizados, incluido texto gris secundario y texto sobre botones | Pantalla |
| Contraste de controles | 3:1 entre bordes de inputs, íconos de acción y su fondo | Medidor sobre el borde del campo y el ícono | Pantalla |
| Foco visible | Todo control que recibe foco muestra un indicador claro, que no depende solo del color | Recorre la vista con Tab sin ratón | Pantalla |
| Orden y alcance por teclado | Todo se opera con teclado; el orden sigue el orden visual; ningún control atrapa el foco; los diálogos devuelven el foco al cerrar | Tab, Shift+Tab, Enter, Espacio, Esc | Pantalla |
| Objetivos táctiles | Áreas de toque suficientes y separadas en anchos táctiles (WCAG 2.2 pide al menos 24×24 px; 44×44 px es la referencia cómoda; ambos valores de ejemplo, manda el token del proyecto) | Inspecciona el área real del control, no solo el ícono | Pantalla o código |
| Etiquetas accesibles | Todo campo tiene etiqueta asociada visible; botones solo-ícono tienen nombre accesible que incluye el texto visible si lo hay | Inspección del código; lector de pantalla si está disponible | Código |
| No solo color | Estados (error, nivel de acceso, seleccionado) llevan texto o ícono además del color | Prueba de escala de grises | Pantalla |
| Errores de formulario | El error se describe en texto, junto al campo, y dice cómo corregirlo | Envía el formulario con datos inválidos | Pantalla |
| Mensajes de estado | Avisos de "Archivo subido" o "Sin resultados" se anuncian sin mover el foco | Lector de pantalla; si no hay, revisa en código que usen región de anuncio | Pantalla o código |
| Estructura | Un título principal por vista; encabezados en orden; tablas con encabezados marcados | Inspección del código | Código |
| Contenido al pasar el cursor | Nada esencial vive solo en hover; los tooltips se pueden cerrar y no tapan lo que describen | Prueba sin ratón y en ancho táctil | Pantalla |

Las herramientas automáticas detectan una fracción de los problemas (contraste, etiquetas faltantes). Teclado y foco siempre se prueban a mano.

## 5. Ejemplo: vista de carpeta en el gestor

| Punto | Resultado | Marca | Hallazgo |
|---|---|---|---|
| Entrecerrar ojos | "Retirar" (solo visible para nivel 1) pesa igual que la acción principal que marcó la estructura | Pantalla, nivel 1 | Composición, importante: dos acciones compiten por el primer lugar |
| Escala de grises | El error de un archivo rechazado en la subida solo se distingue por el borde rojo | Pantalla | Implementación si la composición pedía etiqueta; si no lo definió, hueco para composición |
| Espaciado | Separación de filas con un valor fuera de la escala | Código, archivo y línea | Implementación, menor |
| Foco visible | El menú de acciones por fila no muestra foco | Pantalla, 1280 px | Implementación, importante (bloquea uso por teclado) |
| Botón "Más acciones" | Solo ícono, sin nombre accesible | Código | Implementación, importante |
| Lector de pantalla | No disponible | No comprobado | Va a Pendientes |

## 6. A quién regresa cada falla

| La falla viene de… | Dueño |
|---|---|
| Lo construido no sigue la composición o usa valores fuera de tokens existentes | constructor |
| La composición aprobada produce la falla (p. ej., contraste insuficiente con tokens elegidos) | compositor |
| Falta un token o un componente no resuelve sus estados de foco o error | curador (Kura) |
| Falta el elemento (etiqueta, título, estado) en la definición de la vista | estructura |
| Nadie definió el nivel de accesibilidad exigido | analista (Inqa) (requisito) |

## 7. Errores comunes

- Medir contraste en el diseño y no en lo renderizado.
- Marcar "foco visible" leyendo los estilos, sin tabular.
- Reportar "el espaciado se ve raro" sin decir qué token se esperaba.
- Mandar al constructor una falla que la composición aprobada provoca.
- Revisar solo en el ancho de escritorio.

## 8. Límites del rol

El revisor comprueba y reporta. No elige colores, no ajusta espacios, no propone otro acomodo ni otro componente. Si algo se ve mejorable pero ningún documento lo contradice, es sugerencia.

Adaptado de wondelai/skills (refactoring-ui, basado en "Refactoring UI" de Adam Wathan y Steve Schoger; ux-heuristics, basado en "Don't Make Me Think" de Steve Krug y la guía WCAG 2.1), licencia MIT.
