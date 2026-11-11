# Especificar pedidos de componente para Fruti Squad

Propósito: cuando Kompa decide que hace falta un componente compartido nuevo o una variante que el proyecto no tiene, escribir el pedido para Fruti Squad describiendo la **necesidad** (qué debe lograr y cómo debe comportarse), no el **aspecto**. El aspecto lo decide quien diseña el componente.

## Contenido

1. Por qué describir la necesidad y no el aspecto
2. Plantilla de pedido
3. Cómo llenar los estados: disparador, reglas, retroalimentación
4. Criterios para dar el pedido por bueno
5. Ejemplo: variante de vista previa de documentos del gestor
6. Errores comunes
7. Límites del rol

## 1. Por qué describir la necesidad y no el aspecto

Si el pedido dice "un modal blanco con borde gris y botón azul a la derecha", quien lo diseña solo puede obedecer o contradecir; no puede resolver mejor el problema, y el resultado tal vez choque con el sistema visual. Si el pedido dice "ver el contenido de un documento sin salir de la lista, con acción principal de descargar si el nivel de acceso lo permite", quien diseña puede elegir la mejor forma dentro del sistema y el componente sirve para otros usos.

Prueba rápida: si una frase del pedido contiene un color, una medida, una tipografía o una posición en pantalla, reescríbela como intención ("debe distinguirse como acción principal", "debe caber en pantallas chicas sin desplazamiento horizontal").

## 2. Plantilla de pedido

Llena cada sección. Si algo no se sabe, escríbelo como pregunta; no lo inventes.

| Sección | Qué contiene | Pregunta guía |
|---|---|---|
| **Nombre de trabajo** | Nombre por propósito, provisional | ¿Qué hace, en dos o tres palabras? |
| **Tipo de pedido** | `nuevo`, `variante` (de cuál), `correccion` (de qué pieza de Fruti) o `desde-codigo` (convertir una sección hecha a mano) | ¿Cambia el propósito del existente? ¿La pieza incumple su contrato? |
| **Código actual** | Solo en `correccion` y `desde-codigo`: rutas con línea, ancho de pantalla donde falla y qué pasa contra lo que dice el contrato. Es evidencia de cómo funciona hoy, no de cómo debe verse | ¿Dónde se ve el problema o el comportamiento que hay que conservar? |
| **Propósito** | Una frase: qué logra la persona usuaria con él | ¿Qué tarea resuelve? |
| **Dónde se usa** | Módulos y pantallas, cada uno marcado hecho o supuesto; frecuencia inferida del propósito del módulo | ¿Dónde más se usaría? |
| **Partes (anatomía)** | Lista de partes con obligatoria/opcional y para qué sirve cada una | ¿Qué información y qué acciones contiene? |
| **Variantes** | Dimensiones que cambian sin cambiar el propósito (densidad, tono, con/sin una parte) | ¿Qué cambia entre usos? |
| **Estados** | Tabla de estados con disparador, reglas y retroalimentación (ver sección 3) | ¿En qué condiciones puede estar? |
| **Restricciones y casos límite** | Qué no se permite y qué pasa en los extremos | ¿Vacío, máximo, lento, sin permiso, repetido, interrumpido? |
| **Pantallas chicas** | Qué se conserva, qué se simplifica, qué pasa a un menú; sin desplazamiento horizontal | ¿Qué es imprescindible en un teléfono? |
| **Accesibilidad** | Operable con teclado, foco visible y en orden, nombre accesible, cambios de estado anunciados, objetivos táctiles suficientes, contraste, no depender solo del color | ¿Lo puede usar alguien sin ratón o sin ver la pantalla? |
| **Tokens disponibles** | Tokens del proyecto que debe usar; tokens propuestos si faltan | ¿Qué escala ya existe? |
| **Criterios de aceptación** | Comprobaciones Dado/Cuando/Entonces | ¿Cómo sabemos que quedó? |
| **Hechos, supuestos y preguntas** | Separados en tres listas | ¿Qué está verificado y qué no? |

## 3. Cómo llenar los estados: disparador, reglas, retroalimentación

Cada estado se describe con tres piezas:

- **Disparador**: qué lo provoca. Manual (la persona pulsa, escribe, arrastra) o del sistema (llega la respuesta, se agota el tiempo, falla la conexión, no hay permiso).
- **Reglas**: qué pasa y qué no se permite mientras dura. Ejemplo: "mientras carga, no se puede volver a disparar la acción".
- **Retroalimentación**: qué percibe la persona, descrito como intención ("se nota que está cargando sin que el contenido salte de lugar"), no como animación concreta.

Estados mínimos a considerar (elimina solo los que de verdad no aplican y di por qué):

| Estado | Pregunta clave |
|---|---|
| Inactivo / listo | ¿Cómo se ve que está disponible? |
| Hover y presionado | ¿Confirma que es interactivo y que registró la acción? |
| Foco | ¿Es visible con teclado? |
| Cargando / en proceso | ¿Se bloquea la repetición? ¿Se puede cancelar? ¿Se mantiene el tamaño? |
| Éxito | ¿Cómo se confirma y qué sigue? |
| Error | ¿Se conserva lo que hizo la persona? ¿Dice qué pasó y cómo seguir? ¿Ofrece reintentar? |
| Vacío | ¿Qué se muestra cuando no hay nada y qué acción se propone? |
| Deshabilitado / sin permiso | ¿Se explica por qué no está disponible? |
| Parcial | ¿Qué pasa si solo una parte terminó? |

Reglas de buena especificación tomadas del diseño de microinteracciones:

- Empieza por la meta en una frase y deriva las reglas de ahí.
- Prevenir antes que castigar: si algo no se permite, que no se pueda hacer (y que se entienda por qué), en vez de dejarlo hacer y mostrar error después.
- La complejidad de reglas va con la frecuencia: lo que se usa muchas veces al día debe tener mínimas opciones.
- Declara los casos donde "no debe pasar nada" (clic en algo deshabilitado, doble clic rápido) y qué retroalimentación tienen.

## 4. Criterios para dar el pedido por bueno

Antes de enviarlo:

- [ ] El propósito cabe en una frase y no menciona aspecto.
- [ ] Ninguna sección contiene colores, medidas, tipografías ni posiciones concretas.
- [ ] Cada uso está marcado hecho o supuesto, y se cumple la regla de 3 usos o la excepción de pieza básica.
- [ ] Todas las partes dicen si son obligatorias u opcionales.
- [ ] Cada estado tiene disparador, reglas y retroalimentación.
- [ ] Hay al menos un criterio de aceptación por estado relevante y uno de accesibilidad.
- [ ] Se dice qué cede en pantallas chicas.
- [ ] Si es variante: ningún uso existente cambia su comportamiento por defecto.
- [ ] Hechos, supuestos y preguntas están separados.

## 5. Ejemplo: variante de vista previa de documentos del gestor

**Nombre de trabajo**: vista previa de documento.

**Tipo de pedido**: variante del diálogo/panel existente del proyecto (si no existe un contenedor de ese tipo, componente nuevo).

**Propósito**: que la persona vea el contenido de un documento del gestor sin descargarlo ni salir de la lista donde lo encontró, y decida si lo descarga o lo abre completo.

**Dónde se usa**: gestor de archivos, al abrir desde la lista y desde resultados de búsqueda (hecho); adjuntos de otros módulos del laboratorio (supuesto, por el propósito de esos módulos). Frecuencia inferida: muchas veces al día, así que debe abrirse con un solo gesto y cerrarse sin pasos extra.

**Partes**:

| Parte | Obligatoria | Para qué |
|---|---|---|
| Nombre del documento | Sí | Confirmar que se abrió el correcto |
| Datos clave (tipo, tamaño, fecha, carpeta) | Sí | Decidir sin abrir otra vista |
| Área de contenido | Sí | Ver el documento |
| Acción principal: descargar | Sí, si el nivel lo permite | Siguiente paso más común |
| Acciones secundarias: abrir en pestaña nueva, ir a la carpeta | Opcional | Pasos menos frecuentes |
| Navegación anterior/siguiente | Opcional | Revisar varios documentos de la lista seguidos |
| Cerrar | Sí | Volver a la lista en el mismo punto |

**Variantes**: con o sin navegación anterior/siguiente; tipo de contenido (imagen, PDF, formato sin vista previa).

**Estados**:

| Estado | Disparador | Reglas | Retroalimentación |
|---|---|---|---|
| Cargando | La persona abre un documento | No se puede abrir otro encima; cerrar sigue disponible | Se nota que carga; el contenedor no cambia de tamaño al terminar |
| Listo | Llega el contenido | Acciones habilitadas según nivel | Contenido visible; foco en el contenedor |
| Formato sin vista previa | El sistema detecta tipo no soportado | No mostrar área vacía | Mensaje que dice que no hay vista previa y ofrece descargar |
| Sin permiso de descarga | Nivel de acceso insuficiente (1-4) | Descargar no disponible | Se explica por qué, sin ocultar que la acción existe |
| Error al cargar | Falla red o servidor | La lista no se pierde | Qué pasó, en lenguaje claro, con reintentar |
| Documento retirado | Otra persona lo retiró mientras se veía | No permitir descargar | Aviso de que ya no está disponible y opción de cerrar |
| Cerrado | Cerrar, tecla de escape o gesto equivalente | Regresa a la lista | Foco vuelve al elemento que la abrió |

**Pantallas chicas**: el contenido ocupa la pantalla; los datos clave se pueden plegar; acciones secundarias pasan a un menú; descargar y cerrar siempre visibles; sin desplazamiento horizontal.

**Accesibilidad**: operable completo con teclado; foco atrapado dentro mientras está abierta y devuelto al cerrar; nombre accesible con el nombre del documento; cambios de carga y error anunciados; objetivos táctiles suficientes; el estado de permiso no se comunica solo por color.

**Criterios de aceptación (muestra)**:

- Dado un documento PDF y nivel de acceso suficiente, cuando lo abro desde la lista, entonces veo su contenido y la acción de descargar sin salir de la lista.
- Dado un formato sin vista previa, cuando lo abro, entonces veo un mensaje que lo explica y la opción de descargar.
- Dado un nivel de acceso sin permiso de descarga, cuando abro la vista previa, entonces la descarga no está disponible y se explica por qué.
- Dado que abrí la vista previa con teclado, cuando la cierro, entonces el foco vuelve al documento que la abrió.

**Hechos / supuestos / preguntas**: hecho, el gestor abre documentos desde lista y búsqueda. Supuesto, otros módulos tienen adjuntos que se beneficiarían. Pregunta: ¿qué formatos debe previsualizar el servidor? (va a Forja).

## 6. Errores comunes

- Mandar una maqueta o una descripción visual en lugar de la necesidad.
- Omitir error, vacío o sin permiso porque "casi nunca pasa".
- Mezclar reglas de negocio nuevas en el pedido (eso es del analista de producto).
- Pedir un componente para un solo uso sin marcarlo como local.
- Criterios de aceptación que no se pueden comprobar ("que se vea bien").

## 7. Límites del rol

Kompa describe la necesidad y los criterios. No diseña el aspecto, no decide en qué parte de la pantalla va (Kompa), no cambia el flujo ni agrega acciones que estructura no definió y no decide formatos soportados ni permisos en servidor (Forja). Si al escribir el pedido falta información de otro rol, la deja como pregunta dirigida a ese rol.

Adaptado de wondelai/skills (microinteractions, basado en "Microinteractions: Designing with Details" de Dan Saffer; refactoring-ui, basado en "Refactoring UI" de Adam Wathan y Steve Schoger), licencia MIT.
