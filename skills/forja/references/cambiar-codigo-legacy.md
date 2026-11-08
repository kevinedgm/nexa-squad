# Cambiar código legacy sin romperlo

Propósito: dar al constructor un procedimiento fijo para tocar código que no tiene pruebas (o tiene pocas), fase por fase y en local, de modo que cada paso se pueda verificar y deshacer por separado.

## Contenido

1. Principio: cubrir y modificar, no editar y rezar
2. Dos tipos de cambio que nunca se mezclan
3. El algoritmo de cambio en cinco pasos
4. Brote y envoltura: agregar sin meterse en el código viejo
5. Pasos pequeños dentro de cada fase
6. Respaldo local antes de tocar datos
7. Checklist por fase
8. Ejemplo: retirar archivos en el gestor del laboratorio
9. Errores comunes
10. Límites del constructor

## 1. Principio: cubrir y modificar, no editar y rezar

- **Código legacy es código sin pruebas**, no código viejo ni feo. Sin pruebas no hay forma de saber si un cambio conservó lo que ya funcionaba.
- **Editar y rezar**: leer, cambiar con cuidado, dar clics, esperar que nada se rompa. El cuidado sin retroalimentación es apostar más despacio; cada sesión deja el código igual de riesgoso.
- **Cubrir y modificar**: primero fijar el comportamiento actual con pruebas (un "tornillo de banco"), luego cambiar. Si algo se mueve sin querer, una prueba falla en tu máquina y señala qué se movió. Cada sesión deja pruebas atrás, así que el siguiente cambio en esa zona sale más barato.
- **Mecanismo del dilema**: para probar hay que cambiar el código, y para cambiarlo con seguridad hay que probarlo. Se sale con asimetría: antes de tener pruebas solo se permiten ediciones mecánicas y conservadoras; después de tenerlas, las ambiciosas.

## 2. Dos tipos de cambio que nunca se mezclan

| Tipo | Qué puede cambiar | Qué debe conservarse | Cómo se verifica |
|------|-------------------|----------------------|------------------|
| Cambio de comportamiento (requisito nuevo, corrección) | Una conducta con nombre, la que pide el requisito | Todas las demás | Solo cambian o se agregan las pruebas de esa conducta |
| Cambio de estructura (reorganizar, renombrar, extraer) | La forma del código | Todo el comportamiento | Empieza en verde, termina en verde, sin editar ninguna aserción |

- Regla verificable: cada punto de retorno (commit o copia fechada) dice en su mensaje cuál de los dos es. Ejemplo: `estructura: extraer consulta de archivos (sin cambio de comportamiento)` y después `comportamiento: excluir archivos retirados del listado y la búsqueda (REQ-07)`.
- Mecanismo: si un paso mixto rompe algo, no sabes si fue el reacomodo o la conducta nueva. Separados, la prueba que falla más el último paso son todo el diagnóstico.

## 3. El algoritmo de cambio en cinco pasos

1. **Identificar puntos de cambio.** Leer hasta poder señalar líneas, no archivos. Si el cambio parece estar "en todos lados", trazar qué afecta a qué (variable → función → salida) antes de seguir. El punto de cambio define qué comportamiento hay que fijar.
2. **Encontrar puntos de prueba.** Un punto de prueba es donde se puede observar el efecto del cambio. Rara vez coincide con el punto de cambio: una función interna se observa en la función pública o en la respuesta del servidor que la usa. Preferir **puntos de estrechamiento**: lugares por donde pasan muchos caminos, donde pocas pruebas cubren mucho.
3. **Romper dependencias, lo mínimo.** Solo lo que impida ejecutar el código en una prueba (conexión a base de datos creada adentro, sesión global, fecha del sistema) u observar su resultado. Conservar firmas exactas (copiar y pegar, no reescribir) y dar valores por omisión que mantengan el comportamiento de producción.
4. **Escribir pruebas** que fijen lo que el código hace hoy en las ramas que el cambio va a tocar. Parar cuando cada rama a tocar tenga su prueba.
5. **Cambiar y luego ordenar.** Primero la conducta nueva con su prueba. Después, en un paso aparte, el reacomodo que haga falta, con todas las pruebas en verde.

## 4. Brote y envoltura: agregar sin meterse en el código viejo

Cuando no se puede poner bajo prueba el código anfitrión hoy, no se teje lógica nueva dentro de él. Se escribe aparte, probada, y el anfitrión cambia en una sola línea.

| Técnica | Cuándo | Cómo | Ejemplo en el gestor de archivos |
|---------|--------|------|----------------------------------|
| Brote de función | La lógica nueva se conecta en un punto | Función nueva probada; el anfitrión la llama en una línea | `archivos = excluirRetirados(archivos)` dentro del listado viejo |
| Brote de clase o módulo | El anfitrión ni siquiera se puede ejecutar en una prueba | Unidad nueva, completa y probada; el anfitrión la instancia | `ValidadorDeSubida` nuevo, llamado desde el formulario viejo |
| Envoltura de función | La conducta va antes o después de la existente (registrar, notificar) | Renombrar la original a un nombre interno y crear con el nombre original una función que la llama y agrega lo nuevo | `retirarArchivo` llama a `retirarArchivoSinRegistro` y luego registra el evento |
| Envoltura de clase | Varios lugares necesitan lo agregado | Un objeto que expone la misma interfaz y delega en el original | Envoltorio del repositorio de archivos que agrega el registro a todas sus operaciones |

- Honestidad del intercambio: el anfitrión sigue sin pruebas. Es código bueno en un barrio malo.
- **La deuda se marca**: comentario buscable en el anfitrión, por ejemplo `// BROTE: anfitrión sin pruebas — ver docs/construccion/<modulo>-fase-2.md`, y una entrada en la sección provisionales y pendientes de ese registro, con su rol dueño. Una marca sin entrada no cuenta.
- **La segunda visita paga**: si el mismo anfitrión vuelve a cambiar en otra fase, esa vez se pone bajo prueba.

## 5. Pasos pequeños dentro de cada fase

- Ciclo: pruebas en verde → **un** cambio → pruebas en verde → punto de retorno. Repetir.
- Si algo falla tras un paso: **revertir, no depurar**. El paso era grande o equivocado; se intenta uno más chico.
- Un paso cabe en una frase: "extraer la consulta", "agregar el filtro por nivel", "conectar el filtro en el listado". Si la frase lleva "y", son dos pasos.
- Para cambiar algo que otros usan (nombre de función, formato de un dato) sin romperlos: **cambio paralelo**. Expandir (lo nuevo junto a lo viejo, lo viejo delega en lo nuevo) → migrar a los que llaman, uno por uno → contraer (quitar lo viejo cuando nadie lo usa). El cuándo y el qué de una migración de datos los decide el arquitecto; el constructor ejecuta sus fases así.
- **No dejar ventanas rotas**: lo feo que encuentres en la zona que tocas se arregla en un paso de estructura aparte; lo que esté fuera de tu fase se anota en sugerencias del registro de fase, no se arregla de pasada.
- **Registro de fase**: `docs/construccion/<modulo>-fase-<n>.md` con las secciones alcance, archivos, criterios probados, provisionales y pendientes (con su rol dueño), devoluciones y sugerencias. Todo lo que esta referencia manda "anotar" va a una de esas secciones.

## 6. Respaldo local antes de tocar datos

Antes de ejecutar cualquier cosa que escriba en la base de datos o en el almacenamiento de archivos (migración, script de corrección, carga de prueba):

1. Trabajar solo contra la copia local. Nunca contra producción.
2. Respaldar las tablas y carpetas afectadas con las herramientas que el proyecto ya tiene; anotar en la sección archivos del registro de fase qué se respaldó, dónde y cuándo.
3. Comprobar que el respaldo se puede restaurar (restaurarlo una vez en un lugar aparte o, como mínimo, contar registros y archivos y compararlos).
4. Ejecutar el cambio. Comparar conteos y una muestra de registros antes y después contra lo que el arquitecto definió.
5. Si no hay herramienta de respaldo disponible, no instalar ninguna ni pedir configuración: detener ese paso y anotarlo como pendiente del checklist de implementación.

Mecanismo: un error en datos no se revierte con el control de versiones. El respaldo verificado es el único punto de retorno real.

## 7. Checklist por fase

- [ ] Puedo decir en una frase qué conducta cambia en esta fase; todo lo demás debe seguir igual.
- [ ] Señalé los puntos de cambio por línea y los puntos de prueba donde se observa el efecto.
- [ ] Las ramas que voy a tocar tienen prueba (automática o manual reproducible) antes de editarlas.
- [ ] Cada ruptura de dependencia conservó firmas y el comportamiento de producción.
- [ ] Cada punto de retorno es de un solo tipo (estructura o comportamiento) y lo dice.
- [ ] Brotes y envolturas marcados en el código y anotados en provisionales y pendientes del registro de fase.
- [ ] Respaldo local verificado antes de cualquier escritura en datos.
- [ ] Nada fuera del alcance de la fase; lo encontrado quedó en sugerencias o devoluciones, no arreglado.

## 8. Ejemplo: retirar archivos en el gestor del laboratorio

Reglas del gestor: nivel 1 Administración es el único que retira; nivel 2 Edición sube, actualiza y corrige; nivel 3 consulta y descarga; nivel 4 solo consulta. Lo retirado deja de verse para todos los niveles y su recuperación es manual, fuera del módulo. Los números REQ y BR de este ejemplo son hipotéticos.

Requisito del analista (REQ-07, según BR-04): Dado un archivo retirado por Administración, Cuando un usuario de cualquier nivel (1 a 4) abre su carpeta o busca por su nombre, Entonces el archivo no aparece.

1. Punto de cambio: la consulta que arma el listado de la carpeta y la de búsqueda (dos lugares, no "el módulo").
2. Punto de prueba: la respuesta del servidor al listar y al buscar, que es por donde pasan ambos caminos.
3. Dependencia: la consulta abre su propia conexión adentro. Se agrega un parámetro de conexión con la conexión actual por omisión; nada más.
4. Pruebas de caracterización: listado de una carpeta con archivos vigentes para cada nivel, búsqueda por nombre, carpeta vacía. Se fijan los valores observados hoy.
5. Cambio: brote `excluirRetirados` con sus pruebas (el retirado no aparece para ninguno de los cuatro niveles; el vigente sí), conectado en una línea en cada consulta. Punto de retorno de comportamiento. No se construye ninguna forma de recuperar: está fuera del módulo.
6. Ordenar: las dos consultas repiten el mismo filtro; se extrae en un paso de estructura aparte, con todo en verde.

## 9. Errores comunes

| Error | Por qué falla | Corrección |
|-------|---------------|------------|
| Reacomodar y cambiar conducta en el mismo paso | Si algo se rompe no se sabe qué lo rompió | Dos pasos, pruebas en verde entre ambos |
| Corregir en silencio un error encontrado al fijar comportamiento | Otra parte del sistema o un reporte puede depender de él | Fijarlo, anotarlo y devolverlo al dueño; corregirlo como cambio aparte si se aprueba |
| Proponer reescribir todo | Lo viejo sigue cambiando y se pierden años de casos raros | Cubrir y modificar por partes |
| Brotes sin marca ni registro | El atajo parece estilo aprobado | Marca buscable y entrada en provisionales y pendientes del registro de fase |
| Probar la migración contra datos reales sin respaldo | El control de versiones no regresa datos | Respaldo local verificado primero |

## 10. Límites del constructor

- No decide reglas de negocio, permisos, modelo de datos, contenido de pantalla, aspecto ni componentes; los ejecuta tal como están aprobados.
- Si el código actual contradice un documento aprobado o un requisito no alcanza para elegir entre dos conductas, lo devuelve al dueño (analista: reglas y criterios; arquitecto: datos, permisos, migración; estructura: contenido y flujos) con hechos, supuestos y la pregunta concreta.
- No pide configuración de entorno ni instala herramientas; lo que falte se anota para el checklist de implementación.

Adaptado de wondelai/skills (working-with-legacy-code, basado en "Working Effectively with Legacy Code" de Michael C. Feathers; refactoring-patterns, basado en "Refactoring" de Martin Fowler; pragmatic-programmer, basado en "The Pragmatic Programmer" de David Thomas y Andrew Hunt), licencia MIT.
