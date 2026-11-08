# Decisiones y límites

Propósito: registrar cada decisión técnica de forma breve y revisable (ADR), separar capas en la medida que el proyecto lo justifica, exigir permisos en el servidor, hablar el mismo idioma que el analista y saber qué devolverle.

## Contenido

1. ADR breve: cuándo y cómo
2. Límites entre capas, proporcionales al proyecto
3. Permisos exigidos en servidor
4. Lenguaje del dominio consistente con el analista
5. Qué devolver al analista
6. Checklist verificable
7. Ejemplo aterrizado: ADR de "retirar carpeta"
8. Errores comunes
9. Límites de esta referencia

## 1. ADR breve: cuándo y cómo

Se escribe un ADR cuando la decisión es cara de revertir o la va a cuestionar alguien después: esquema de datos, borrar vs estado, dónde vive un permiso, mantener o sustituir una pieza legacy. No se escribe para nombres de variables ni detalles que el constructor resuelve sin riesgo.

Estructura fija (una página como máximo):

| Sección | Contenido | Comprobación |
|---------|-----------|--------------|
| Título | Verbo + objeto: "Retirar carpetas por estado, no por borrado" | Se entiende sin leer el resto |
| Contexto | Hechos (contados o vistos en código), supuestos marcados, restricción que obliga a decidir | Cada hecho dice de dónde salió |
| Opciones | Máximo 2, cada una con costo (trabajo, cambios a datos) y riesgo (qué puede salir mal) | Si hay una sola opción viable, se dice por qué la otra no |
| Decisión | La elegida y el motivo en 1-3 líneas | El motivo cita costo o riesgo, no gusto |
| Requisitos que atiende | IDs de los requisitos del analista | Ningún requisito inventado aquí |
| Consecuencias | Qué queda más difícil, deuda aceptada, qué se revisa después | Al menos una consecuencia negativa honesta |

Mecanismo: limitar a dos opciones obliga a descartar pronto lo irrelevante; exigir costo y riesgo evita decisiones por preferencia. Un ADR aceptado no se edita: si cambia la decisión, se escribe otro que lo sustituye y se enlaza por ID.

## 2. Límites entre capas, proporcionales al proyecto

La regla de dependencias: el código con las reglas del negocio no debe conocer detalles de entrega (HTTP, sesión, HTML) ni de almacenamiento (SQL, rutas de disco). Los detalles dependen de las reglas, no al revés. Mecanismo: lo que cambia seguido (la interfaz, la base) no arrastra a lo que cambia poco (la regla de quién puede retirar qué).

En un módulo PHP legacy no se impone una arquitectura completa. Dosis pragmática:

| Capa mínima | Responsabilidad | No hace |
|-------------|-----------------|---------|
| Entrada (endpoint/controlador) | Lee petición y sesión, valida forma, llama al caso de uso, arma respuesta | Reglas de negocio, SQL |
| Caso de uso (una función o clase por operación: subir, mover, retirar) | Verifica permiso, abre transacción, aplica reglas, devuelve datos simples | Leer `$_POST`/`$_SESSION`, imprimir HTML |
| Acceso a datos y archivos | Consultas SQL y operaciones de disco, sin decisiones | Decidir si algo está permitido |

Elegir la fuerza del límite según la necesidad real:

| Situación | Límite recomendado |
|-----------|--------------------|
| Operación con reglas, permisos o varias escrituras | Caso de uso separado que recibe valores simples |
| Lectura simple sin reglas | Puede ir directo de la entrada al acceso a datos |
| Se prevé cambiar la pieza (otro almacenamiento) | Funciones de acceso concentradas en un solo lugar |
| Necesidad incierta | Ninguno, pero se anota en el ADR |

- Datos que cruzan límites: arreglos o objetos simples, no la conexión, ni `$_FILES`, ni el resultado crudo de la consulta.
- "Objeto humilde": lo difícil de probar (disco, sesión, salida) queda tan delgado que no tiene lógica; la lógica va al caso de uso, que sí se prueba.
- Agrupar por capacidad del módulo (archivos, carpetas, permisos), no por tipo técnico, cuando el proyecto lo permita.
- Si el proyecto ya tiene una convención (p. ej. un framework propio en otros módulos), se respeta; esta referencia no impone uno.

## 3. Permisos exigidos en servidor

Ocultar un botón no es un permiso. Cada operación verifica en el servidor, en el caso de uso, antes de tocar datos.

- **Matriz operación × nivel**: para cada operación (buscar, abrir, subir, crear carpeta, mover, retirar, restaurar) y cada nivel de acceso (1 a 4), quién puede. La matriz la dicta el analista; este rol define dónde y cómo se aplica.
- **Verificar sobre el recurso, no solo el rol**: además del nivel, ¿esa carpeta está al alcance de ese usuario? Un ID cambiado a mano en la petición no debe abrir un archivo ajeno.
- **Fallar rápido**: sin sesión → rechazo inmediato; sin permiso → rechazo antes de abrir transacción; parámetros incompletos → rechazo sin consultar.
- **Descargas**: el archivo se entrega a través de código que verifica permiso, no por una ruta pública directa al disco.
- **Registro**: operaciones sensibles (retirar, restaurar, cambiar permisos) guardan quién, qué y cuándo.
- **Comprobación**: por cada operación, una prueba o caso manual con un usuario sin permiso que llame directo al endpoint. Si no se ejecutó, se marca "no comprobado".

## 4. Lenguaje del dominio consistente con el analista

Los nombres de tablas, columnas, funciones y estados usan las palabras del analista. Si el analista dice "retirar", el código no dice `delete`, `eliminar` ni `archivar` para lo mismo.

- **Un término por concepto**: no alternar carpeta/directorio/folder ni archivo/documento/adjunto si son lo mismo.
- **Verbos de negocio**: `retirarCarpeta`, `restaurarArchivo`, no `procesar`, `actualizar` o `setStatus(3)`.
- **Estados con nombre**: `retirado`, no `3` ni `activo = 0`.
- **Evitar nombres de almacenamiento**: `Archivo`, no `FilaArchivo` ni `TablaArchivos`.
- **Términos legacy distintos**: si el esquema existente usa otra palabra (p. ej. `documentos` para lo que el analista llama "archivo"), se documenta la equivalencia en el ADR o en el modelo de datos. Renombrar la tabla es una migración con su costo; no se hace por estética.
- **Señal de alerta**: si cuesta nombrar algo, o hace falta un `tipo` que cambia el comportamiento, probablemente hay dos conceptos distintos. Se pregunta al analista.

## 5. Qué devolver al analista

Este rol no completa huecos de negocio. Devuelve, separado en hechos, supuestos y preguntas:

| Devolver cuando… | Ejemplo |
|------------------|---------|
| Una migración encuentra casos sin regla | 12 archivos sin carpeta: ¿se muestran o se retiran? |
| Una restricción técnica obliga a elegir conducta | La unicidad de nombres, ¿distingue mayúsculas? |
| Un requisito es imposible o muy costoso tal como está | "Restaurar siempre" choca con nombres ya ocupados |
| Un término del analista choca con el legacy | El sistema llama "expediente" a lo que el requisito llama "carpeta" |
| Falta un criterio Dado/Cuando/Entonces para un caso borde | ¿Retirar mientras otro usuario sube un archivo a esa carpeta? |

Formato: una pregunta por línea, con el dato que la origina y las opciones si las hay. Nunca se devuelven preferencias técnicas disfrazadas de pregunta.

## 6. Checklist verificable

- [ ] Cada decisión cara de revertir tiene ADR con máximo 2 opciones, costo y riesgo.
- [ ] Cada ADR cita los requisitos que atiende y no inventa nuevos.
- [ ] Operaciones con reglas viven en un caso de uso que no lee petición ni sesión.
- [ ] Nada de SQL ni disco en la capa de entrada; nada de HTML en el caso de uso.
- [ ] Matriz operación × nivel aplicada en servidor, sobre el recurso.
- [ ] Descargas pasan por verificación de permiso.
- [ ] Nombres técnicos coinciden con el glosario del analista; equivalencias legacy documentadas.
- [ ] Preguntas al analista separadas de hechos y supuestos.

## 7. Ejemplo hipotético: ADR de "retirar carpeta"

Ejemplo hipotético para enseñar la forma: `tabla_padre`, `tabla_hija`, las rutas y los IDs son genéricos. No describe el esquema de ningún proyecto. Lo que sí sale del analista es la regla del gestor de archivos que se cita como requisito.

Cómo se escribe un hecho en el contexto:

| Forma | ¿Válida? | Por qué |
|-------|----------|---------|
| "La tabla de carpetas borra en cascada sus archivos." | No | Afirma algo sin evidencia; otro agente lo tomaría como verdad |
| "Hecho: `tabla_hija` declara una llave foránea hacia `tabla_padre` con regla de borrado. Evidencia: `ruta/al/esquema.sql`, línea N." | Sí | Dice qué se vio y dónde, para que cualquiera lo verifique |
| "Supuesto: la regla de borrado es en cascada. Sin verificar: falta leer `ruta/al/esquema.sql`." | Sí | Marca lo no comprobado como supuesto |

Si no se leyó el archivo, no hay hecho, solo un supuesto o una pregunta.

ADR de ejemplo:

- **Título**: Retirar carpetas por estado, no por borrado.
- **Requisito recibido del analista**: solo el nivel 1 puede retirar, y se le pide confirmación. Lo retirado deja de verse para todos. Sus archivos pasan a una carpeta "por eliminar". La recuperación y el borrado final son manuales.
- **Contexto**: Hecho: [qué se vio]. Evidencia: `ruta/archivo`, línea N. Supuesto: [lo no verificado, con qué falta para verificarlo]. Pregunta: "carpeta 'por eliminar'", ¿es una ubicación visible para alguien o solo un estado interno?
- **Opción A, estado + referencia al origen del retiro**: costo, columnas nuevas y un filtro en todas las consultas de listado y búsqueda. Riesgo, que a alguna consulta le falte el filtro y muestre lo retirado.
- **Opción B, mover filas a una tabla aparte**: costo, copiar filas y relaciones. Riesgo, que las dos tablas queden inconsistentes y la recuperación manual sea compleja.
- **Decisión**: A. Mueve menos datos y deja la recuperación manual en una sola transacción.
- **Requisitos que atiende**: RF-xx retirar, RF-yy recuperación manual (IDs de ejemplo).
- **Consecuencias**: hay que revisar cada consulta existente para agregarle el filtro. Si se confirma que existe un borrado en cascada (con su evidencia), se retira al final de la migración.

## 8. Errores comunes

| Error | Por qué falla | Corrección |
|-------|---------------|------------|
| ADR con cinco opciones y sin riesgos | Nadie lo lee ni sirve para revisar | Máximo 2, con costo y riesgo |
| Imponer capas completas a todo el módulo | Ceremonia sin beneficio en código legacy | Separar solo donde hay reglas o escrituras |
| Permiso solo en la interfaz | Una petición directa lo salta | Verificar en el caso de uso, sobre el recurso |
| Sinónimos en el código | Confunde al revisor y esconde conceptos | Un término por concepto, del glosario del analista |
| Resolver un hueco de negocio "por sentido común" | El rol decide algo que no es suyo | Devolver la pregunta con su dato |

## 9. Límites de esta referencia

- No define requisitos, matriz de permisos ni glosario: los recibe del analista.
- No decide pantallas, acciones visibles ni estilos.
- No pide configuración de entorno ni instalación de herramientas; lo necesario se anota como checklist en `docs/implementacion`.

Adaptado de wondelai/skills (clean-architecture, basado en "Clean Architecture" de Robert C. Martin; domain-driven-design, basado en "Domain-Driven Design" de Eric Evans; release-it, basado en "Release It!" de Michael T. Nygard), licencia MIT.
