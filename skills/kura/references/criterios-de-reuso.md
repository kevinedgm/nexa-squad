# Criterios de reuso: reutilizar, variante, compartido nuevo o resolver en el módulo

Propósito: decidir, para cada hueco que deja el compositor, cuál de cuatro salidas toma y justificarla con una regla verificable. Úsala antes de proponer cualquier componente o variante.

## Contenido

1. El orden de decisión
2. Variante o componente nuevo: ¿cambia el propósito?
3. Regla de 3 usos y su excepción
4. Duplicación real vs coincidencia accidental
5. Proteger los usos existentes
6. Componentes profundos con interfaz simple
7. Checklist por hueco
8. Ejemplo: gestor de archivos
9. Errores comunes
10. Límites del rol

## 1. El orden de decisión

Recorre las salidas en este orden y detente en la primera que se cumpla. El orden va de menor a mayor costo para el resto del sistema.

| Paso | Salida | Se elige cuando | Costo que impone |
|---|---|---|---|
| 1 | Reutilizar tal cual | Un componente existente cumple el propósito, las partes y los estados que pide el hueco | Ninguno nuevo |
| 2 | Variante de uno existente | Mismo propósito, cambia una dimensión acotada (tamaño, densidad, tono, una parte opcional) | Una opción más en una interfaz que ya existe |
| 3 | Componente compartido nuevo | Propósito que no cubre ninguno existente y pasa la regla de 3 usos (o su excepción) | Un componente más que aprender, documentar y mantener |
| 4 | Resolver en el módulo | Necesidad real pero local: un solo lugar, o menos de 3 usos previsibles | Código local; no toca a nadie más |

Mecanismo: cada componente compartido es una interfaz que todos los demás tienen que conocer. Si reutilizas, el costo ya está pagado; si creas uno nuevo sin necesidad, cobras ese costo a todo el proyecto para siempre.

## 2. Variante o componente nuevo: ¿cambia el propósito?

La pregunta que decide es una: **¿el elemento sigue sirviendo para lo mismo?**

- **Variante**: el propósito no cambia; cambia cómo se presenta o una parte opcional. Ejemplo: una tarjeta de archivo en versión compacta para listas largas sigue siendo "mostrar un archivo y permitir abrirlo".
- **Componente nuevo**: el propósito cambia aunque se parezca. Ejemplo: un selector de nivel de acceso (1-4) no es una variante del menú de acciones aunque ambos sean listas desplegables; uno elige un valor, el otro dispara acciones.

Señales de que una "variante" en realidad es otro componente:

- Necesita estados que el original no tiene (p. ej., "seleccionado" en algo que antes solo se pulsaba).
- Su contenido obligatorio es distinto (otras partes de la anatomía, no solo opcionales).
- Para describirla hay que usar "y además…" más de una vez.
- La opción nueva obliga a condicionales que el resto de los usos nunca activa.

Regla verificable: si al agregar la variante, más de la mitad de las opciones de la interfaz solo aplican a ella o solo aplican a los usos anteriores, son dos componentes.

## 3. Regla de 3 usos y su excepción

**Regla**: un componente compartido nuevo se justifica cuando hay al menos 3 usos con el mismo propósito, reales o previsibles a partir del propósito de los módulos (no inventados). Con 1 o 2 usos, se resuelve en el módulo y se anota como candidato.

Mecanismo: con uno o dos casos todavía no sabes qué es común y qué es coincidencia; si extraes antes, fijas una interfaz que adivina. Al tercer uso ya se ve qué partes se repiten de verdad.

**Excepción, piezas básicas**: los elementos que casi cualquier pantalla del proyecto va a usar (botón, campo de texto, casilla, etiqueta de estado, aviso, diálogo de confirmación, indicador de carga) se tratan como compartidos desde el primer uso si el sistema no los tiene. No esperan a 3 porque su repetición es segura y porque un básico resuelto localmente se copia en cada módulo nuevo.

Cómo contar usos sin preguntar: infiere de lo que hace cada módulo. Si el gestor de archivos lista documentos, y otros módulos del laboratorio manejan adjuntos o resultados, el patrón "lista de documentos con acción de abrir" tiene usos previsibles fuera del gestor. Marca cada uso como **hecho** (ya existe en pantalla) o **supuesto** (previsible por el propósito).

## 4. Duplicación real vs coincidencia accidental

DRY habla de **conocimiento**, no de apariencia. Dos piezas que hoy se ven iguales no son duplicación si responden a reglas distintas.

Prueba: **si una cambia, ¿la otra tiene que cambiar?**

- Sí → duplicación real: una sola fuente (componente compartido o token).
- No, podrían separarse por razones distintas → coincidencia: déjalas separadas aunque se parezcan.

| Caso | ¿Duplicación? | Por qué |
|---|---|---|
| Confirmación de "retirar archivo" en el gestor y confirmación de "eliminar usuario" en administración | Sí, de patrón | La regla es la misma: acción irreversible pide confirmación explícita |
| Tarjeta de carpeta y tarjeta de resultado de análisis con el mismo borde y radio | Coincidencia de aspecto | Comparten tokens, no propósito; unirlas acoplaría dos dominios |
| Mismo texto de error "No tienes permiso" escrito a mano en tres vistas | Sí | Es una sola regla (nivel de acceso insuficiente) repetida |

Unir coincidencias es tan dañino como duplicar conocimiento: crea un componente con condicionales para casos que no tienen nada que ver.

## 5. Proteger los usos existentes

Toda modificación a un componente compartido se evalúa contra **todos** sus usos, no solo el que la pide.

- Antes de proponer una variante o un cambio, lista dónde se usa hoy el componente (hecho, verificado en código o pantalla; si no lo verificaste, márcalo "no comprobado").
- Una variante se **agrega**; el comportamiento por defecto no cambia. Ningún uso existente debe tener que modificarse para seguir viéndose y funcionando igual.
- Si el cambio sí altera el comportamiento por defecto, deja de ser variante: es un cambio de componente y se reporta como impacto en otros módulos, con la lista de pantallas afectadas.

## 6. Componentes profundos con interfaz simple

Un buen componente oculta mucho detrás de pocas opciones. Profundidad = lo que resuelve / lo que hay que saber para usarlo.

- **Pocas opciones, con valores por defecto sensatos.** Cada opción es una decisión que trasladas a quien lo usa. Si casi todos los usos ponen el mismo valor, ese valor es el defecto, no una opción.
- **El componente resuelve sus estados por dentro.** Carga, vacío, error, deshabilitado y foco no deben armarse fuera en cada pantalla.
- **No filtres detalles internos.** Quien lo usa pide "tono: peligro", no "color rojo 600"; pide "denso", no "padding 4".
- **Nada de componentes de paso.** Un envoltorio que solo reenvía opciones a otro componente agrega una interfaz sin agregar función: úsalo directo o fusiónalos.
- **Ni muy específico ni genérico de más.** Busca la interfaz más simple que cubra todos los usos actuales y previsibles; no agregues opciones para casos que nadie pidió.

## 7. Checklist por hueco

- [ ] Hueco descrito por su propósito en una frase, sin aspecto.
- [ ] Revisé componentes existentes y anoté por qué no sirven tal cual (si es el caso).
- [ ] Si propongo variante: el propósito no cambia y ningún uso existente se modifica.
- [ ] Si propongo compartido nuevo: 3 usos (marcados hecho/supuesto) o es pieza básica.
- [ ] Si resuelvo en el módulo: anoté si queda como candidato a compartido.
- [ ] Apliqué la prueba "si uno cambia, ¿el otro también?" a cada parecido.
- [ ] La interfaz propuesta tiene la menor cantidad de opciones posible y defectos claros.
- [ ] Separé hechos, supuestos y preguntas.

## 8. Ejemplo: gestor de archivos

| Hueco | Decisión | Justificación |
|---|---|---|
| Buscador de archivos en la barra de herramientas | Reutilizar | El proyecto ya tiene campo de búsqueda; mismo propósito y estados |
| Lista de archivos en modo compacto para carpetas con muchos documentos | Variante de la tabla/lista existente | Mismo propósito (mostrar y abrir documentos); cambia la densidad |
| Vista previa de documentos al abrir sin descargar | Variante del visor/diálogo existente, o pedido a Fruti Squad si no hay visor | Propósito "ver contenido sin salir de la vista"; previsible en adjuntos de otros módulos (supuesto) |
| Confirmación al retirar un archivo | Reutilizar diálogo de confirmación; si no existe, compartido nuevo por excepción de pieza básica | Toda acción irreversible del sistema lo necesita |
| Insignia de nivel de acceso 1-4 junto a cada carpeta | Resolver en el módulo, candidato | Hoy solo el gestor muestra niveles (hecho); si otro módulo los muestra, se promueve |
| Zona para arrastrar y subir archivos | Compartido nuevo si hay 3 usos | Subir adjuntos aparece en otros módulos del laboratorio (supuesto, confirmar) |

## 9. Errores comunes

- Crear un componente compartido "por si acaso" con un solo uso.
- Llamar variante a algo con otro propósito y llenarlo de condicionales.
- Unir dos piezas porque se ven iguales, sin aplicar la prueba de cambio conjunto.
- Cambiar el comportamiento por defecto de un compartido para servir a una pantalla nueva.
- Exponer opciones de aspecto (color, medida) en vez de opciones de intención (tono, densidad).
- Declarar "no se usa en otro lado" sin haberlo verificado.

## 10. Límites del rol

Con esta referencia el curador decide **qué salida toma cada hueco**. No decide el aspecto del componente, no acomoda secciones (eso es del compositor), no cambia contenido ni flujos (eso es de estructura) y no migra el proyecto a otro sistema visual. Si un hueco revela que falta contenido o una acción, lo devuelve a estructura.

Adaptado de wondelai/skills (software-design-philosophy, basado en "A Philosophy of Software Design" de John Ousterhout; pragmatic-programmer, basado en "The Pragmatic Programmer" de Andrew Hunt y David Thomas), licencia MIT.
