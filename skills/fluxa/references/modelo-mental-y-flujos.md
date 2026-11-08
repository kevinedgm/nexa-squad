# Modelo mental y flujos

Propósito: alinear la estructura con la idea que la persona ya tiene de cómo funciona el módulo, ordenar vistas y flujos según la frecuencia de cada tarea, revisar cada flujo paso a paso y definir los estados de cada vista por lo que dicen, no por cómo se ven.

## Contenido

1. Los tres modelos
2. Cómo construir un modelo correcto
3. Tareas frecuentes vs raras
4. Los siete pasos de la acción para revisar un flujo
5. Estados de cada vista definidos por su contenido
6. Ejemplo: subir un archivo
7. Errores comunes
8. Límites

## 1. Los tres modelos

| Modelo | Quién lo tiene | Qué es |
|---|---|---|
| Modelo de diseño | Quien diseña | Cómo funciona de verdad |
| Modelo del usuario | La persona | Cómo cree que funciona |
| Imagen del sistema | La interfaz | Lo único que la persona ve: nombres, estructura, respuestas |

Mecanismo: la persona no lee el diseño ni la documentación; arma su modelo con lo que la interfaz le muestra. Si la imagen del sistema es incompleta o engañosa, el modelo de la persona diverge y aparecen confusión, culpa propia y acciones repetidas. Estructura controla buena parte de esa imagen: qué conceptos existen, cómo se llaman y cómo se relacionan.

Síntomas de que los modelos no coinciden:

| Síntoma | Lo que suele significar |
|---|---|
| Busca una acción que no existe | Su modelo incluye algo que el sistema no ofrece |
| No encuentra algo que sí existe | Su modelo lo ubica en otra parte |
| Repite una acción (guarda dos veces, sube de nuevo) | No sabe que el sistema ya lo hizo |
| No se atreve a actuar | No sabe que hay forma de deshacer |
| Espera A y obtiene B | El nombre o la metáfora promete otra cosa |

## 2. Cómo construir un modelo correcto

- **Usa la metáfora que ya conoce y respeta sus reglas.** "Carpeta" implica contener y anidar; "Papelera" implica que se puede recuperar antes de vaciar. Si el sistema rompe la regla de la metáfora (un archivo en dos carpetas), dilo de forma explícita o cambia de concepto.
- **Haz visible la estructura.** Ruta de carpetas, conteo de elementos, a qué pertenece cada registro.
- **Haz visible el estado.** Guardado o pendiente, en proceso, quién lo está editando.
- **Explica comportamiento, no mecanismo.** "La carpeta dejará de verse para todos y sus archivos pasan a 'por eliminar'; recuperarlos es manual", no "se marca con baja lógica".
- **Responde confirmando el modelo.** El mensaje de resultado dice qué pasó y dónde quedó: "Subido a Bitácoras 2024".
- **Revela complejidad por capas.** Primero el modelo simple; lo avanzado aparece cuando la persona llega al caso que lo necesita.

Comprobación rápida: para cada concepto del módulo escribe una frase "El usuario cree que X funciona así…". Si la frase no coincide con el modelo de diseño, hay que cambiar el nombre, mostrar un estado o agregar un mensaje.

## 3. Tareas frecuentes vs raras

Estructura no pregunta frecuencia ni dispositivo: la infiere del propósito del módulo, del rol y del requisito del analista, y la registra como supuesto.

Cómo inferirla:
1. Lista las tareas de los requisitos del analista.
2. Para cada una, deduce frecuencia del propósito (consultar un documento en un laboratorio ocurre a diario; retirar una carpeta, casi nunca).
3. Marca cada inferencia como supuesto con su razón en una línea.
4. Si la inferencia cambia la estructura de forma importante y no hay base para deducirla, va como pregunta al analista, no al usuario final.

| Frecuencia | Cómo se trata en la estructura |
|---|---|
| Varias veces al día | Camino más corto, visible desde la vista de entrada, sin configuración, sin confirmaciones |
| Diaria o semanal | Visible en la vista donde ocurre, con valores por defecto sensatos |
| Ocasional | Segundo nivel (menú, sección plegada), con guía en el propio flujo |
| Una vez o casi nunca | Vista o flujo aparte; se aceptan más pasos y explicación |

Reglas:
- La tarea rara no estorba a la frecuente: no comparte paso obligatorio con ella.
- La complejidad de reglas crece con la rareza: lo frecuente casi sin opciones, lo raro con todas las que necesite.
- Cuidado con la captura por hábito: si una tarea rara se parece a una frecuente, ponle un punto de decisión explícito.

## 4. Los siete pasos de la acción para revisar un flujo

Toda interacción cruza dos brechas: la de ejecución (¿cómo hago lo que quiero?) y la de evaluación (¿qué pasó, funcionó?). Recorre cada flujo paso por paso y anota dónde se atora.

| Paso | Pregunta de revisión | Lo que estructura debe garantizar |
|---|---|---|
| 1. Meta | ¿La vista deja claro para qué sirve? | Título y propósito de la vista |
| 2. Plan | ¿Ve que esta vista sirve para su meta? | La acción aparece donde la persona la buscaría |
| 3. Especificar | ¿Sabe qué acción elegir? | Nombre verbo + objeto, una principal |
| 4. Ejecutar | ¿Puede hacerla sin datos que no tiene a la mano? | Campos mínimos, valores conocidos precargados |
| 5. Percibir | ¿Hay respuesta visible? | Estado de proceso y de resultado definidos |
| 6. Interpretar | ¿Entiende qué cambió? | Mensaje con qué pasó y dónde quedó |
| 7. Comparar | ¿Puede comprobar que es lo que quería? | El resultado es visible en su contexto; si no, salida o Deshacer |

Pasos 1 a 4 fallan: problema de ejecución (nombres, ubicación, restricciones). Pasos 5 a 7 fallan: problema de evaluación (estados, mensajes, resultado visible).

## 5. Estados de cada vista definidos por su contenido

Cada vista y cada región de datos declara sus estados. Estructura define qué dice y qué acción ofrece cada uno; el aspecto lo decide el compositor.

| Estado | Cuándo ocurre | Contenido obligatorio | Acción |
|---|---|---|---|
| Carga | Se piden datos y aún no llegan | Qué se está cargando; si tarda mucho, avance o aviso de que sigue | Cancelar si es larga |
| Vacío | No hay registros todavía | Qué irá aquí y cómo se llena | La acción que crea el primero (si el rol puede) |
| Sin resultados | Hay registros, pero la búsqueda o filtro no encontró | Qué se buscó y qué filtros están activos | Limpiar filtros o cambiar búsqueda |
| Error | Falló la carga o la acción | Qué pasó, por qué si ayuda, qué hacer; lo capturado se conserva | Reintentar u otra vía |
| Sin permiso | El rol no puede ver la vista o la región | Qué no puede ver y por qué, en términos del usuario | Salida o a quién pedir acceso |
| Con datos | Caso normal | Inventario de la vista | Las definidas |
| Parcial | Parte terminó y parte no | Cuántos sí, cuántos no y cuáles | Reintentar lo faltante |

Reglas:
- Vacío y sin resultados son estados distintos: confundirlos hace creer que no hay datos cuando solo hay un filtro.
- Ningún estado se queda sin salida.
- Para cada acción, define las transiciones: inicio, en proceso, éxito, error, cancelado. Mientras está en proceso, la acción no se puede disparar de nuevo.
- Define también qué no debe pasar ("los niveles 3 y 4 no suben documentos"; "la carpeta raíz no se retira") y qué responde el sistema cuando se intenta.

## 6. Ejemplo: subir un archivo

Hechos: solo los niveles 1 y 2 suben. Supuesto: subir es raro y por tandas, y la persona ya está dentro de la carpeta destino. Modelo del usuario: "lo meto en la carpeta donde estoy".

| Paso | Decisión de estructura |
|---|---|
| Meta y plan | Subir es secundaria en el grupo de gestión (la principal de la vista es buscar); la carpeta destino es la actual, ya conocida |
| Especificar y ejecutar | Elegir archivo; ejemplo hipotético: si existiera límite de tamaño o tipos permitidos, se muestran antes de elegir |
| Percibir | Estado en proceso con avance por archivo |
| Interpretar | "3 archivos subidos a Bitácoras 2024" |
| Comparar | Los nuevos aparecen en la lista con su nombre resaltado |
| Parcial (ejemplo hipotético) | "2 de 3 subidos. Muestra_07.pdf no se pudo subir." Dice cuál falló y por qué; Reintentar o quitar |
| Sin permiso | Niveles 3 y 4: Subir no aparece (permanente) |

## 7. Errores comunes

- Nombrar conceptos como en la base de datos ("registro", "baja lógica").
- Mezclar vacío y sin resultados en un solo mensaje.
- Definir estados como "spinner gris" en lugar de lo que dicen y permiten.
- Poner la tarea rara al mismo nivel que la frecuente "para que se vea".
- Preguntar al usuario la frecuencia en lugar de inferirla y marcarla como supuesto.

## 8. Límites

Esta referencia decide conceptos, nombres, orden de tareas, pasos de cada flujo y el contenido de cada estado. No decide el aspecto de los estados (esqueleto, indicador, color), su ubicación ni qué cede en pantallas chicas (compositor), ni tiempos, reintentos o persistencia en servidor (arquitecto técnico).

Adaptado de wondelai/skills (design-everyday-things, basado en "The Design of Everyday Things" de Don Norman; microinteractions, basado en "Microinteractions" de Dan Saffer), licencia MIT.
