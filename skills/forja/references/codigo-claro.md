# Código claro

Propósito: criterios para que el código que escribe el constructor se lea en el lenguaje del dominio, haga una cosa por función, falle de forma explícita y útil, y no crezca más allá de lo aprobado. Agnóstico de lenguaje; los ejemplos son pseudocódigo.

## Contenido

1. Por qué importa
2. Nombres en el lenguaje del dominio
3. Funciones pequeñas con una responsabilidad
4. Manejo de errores explícito y mensajes útiles
5. DRY bien entendido
6. Marcar lo PROVISIONAL
7. No ampliar alcance
8. Checklist por fase
9. Errores comunes
10. Límites del constructor

## 1. Por qué importa

El código se lee muchas más veces de las que se escribe. Cada nombre y cada límite de función suma claridad o suma costo para el siguiente que lo toque (incluido el revisor). Si el código habla como el analista, el revisor puede comparar código contra requisito sin traducir.

## 2. Nombres en el lenguaje del dominio

- **Fuente de los nombres**: el glosario y los requisitos del analista, y los nombres de datos de Forja. Si el analista dice "retirar", el código dice `retirarArchivo`, no `borrar`, `eliminar` ni `softDelete`.
- **Una palabra por concepto** en todo el módulo. Si hay `obtener`, no mezclar con `traer` ni `buscar` para lo mismo. Palabras distintas solo si el significado es distinto (`retirar` oculta y conserva; `eliminar` quita de verdad).
- **El nombre dice para qué existe**, sin comentario: `NIVEL_ADMINISTRACION` y no `n`; `puedeDescargar` y no `chk`.
- Funciones con verbo + objeto (`subirArchivo`, `crearCarpeta`); datos y módulos con sustantivo (`Carpeta`, `RegistroDeRetiro`); preguntas sí/no como predicado (`estaRetirado`, `puedeAbrir`).
- Sin abreviaturas ni códigos de tipo (`usr`, `strNom`, `arr1`). Largo proporcional al alcance: corto en un ciclo de tres líneas, descriptivo en lo que se usa en todo el módulo.
- Números con significado tienen nombre: `TAMANO_MAXIMO_SUBIDA`, no un `10485760` suelto. El valor sale de lo que definió Forja o el proyecto, no se inventa.
- Respetar la convención de nombres que el proyecto ya usa (idioma, mayúsculas, prefijos). Si el código existente nombra en inglés, se sigue la convención y el término del dominio se traduce de forma consistente; la tabla de equivalencias se anota en el registro de fase.
- Si un término del dominio no existe en el glosario o tiene dos lecturas, no se elige uno: se pregunta al analista.

## 3. Funciones pequeñas con una responsabilidad

- **Una cosa**: si puedes extraer de una función otra con un nombre que no sea solo repetir lo que hace, hace más de una cosa.
- **Un solo nivel de abstracción**: `retirarArchivo` llama a `validarPermisoDeRetiro`, `marcarComoRetirado`, `registrarRetiro`; no mezcla esas llamadas con armar texto de consulta.
- **Lectura de arriba abajo**: la función de alto nivel primero, los detalles debajo, como un periódico.
- **Pocos argumentos**: cero o uno es lo ideal, dos aceptable, tres o más pide agruparlos en un objeto con nombre (`criteriosDeBusqueda`).
- **Sin argumentos bandera**: `listarArchivos(incluirRetirados)` son dos funciones: `listarArchivosVigentes` y `listarArchivosConRetirados`.
- **Mandar o preguntar, no ambas**: una función cambia estado o regresa un valor. `puedeAbrir(usuario, archivo)` no registra accesos.
- **Sin efectos ocultos**: el nombre dice toda la verdad. Si `verificarSesion` además renueva la sesión, se separa o se renombra.
- **Cláusulas de guarda al inicio**: los casos de error salen primero con un retorno o error temprano; queda un solo camino feliz sin anidar.

Ejemplo en pseudocódigo, en líneas:

- `retirarArchivo(usuario, archivoId)`
- `  si no puedeRetirar(usuario) → error SinPermisoParaRetirar`
- `  archivo = obtenerArchivo(archivoId)`
- `  si archivo.estaRetirado → error ArchivoYaRetirado(archivo.nombre)`
- `  marcarComoRetirado(archivo, usuario)`
- `  registrarRetiro(archivo, usuario)`

## 4. Manejo de errores explícito y mensajes útiles

- **Separado de la lógica**: el manejo de errores no ensucia el camino feliz; cada bloque de captura en su propia función si hay más de uno.
- **Nunca tragarse un error**: una captura vacía oculta fallas. Se maneja, se registra con contexto o se deja subir.
- **Capturar lo específico**: atrapar "cualquier error" también atrapa defectos del programa.
- **No regresar ni pasar nulos** para decir "no hay": lista vacía, objeto de caso especial o error con nombre. Un nulo olvidado truena lejos de su origen.
- **Errores nombrados según lo que necesita quien llama**: `ArchivoNoEncontrado`, `SinPermisoParaRetirar`, `ArchivoExcedeTamano`; no el nombre técnico de la librería.
- **Dos mensajes distintos para dos lectores**:

| Lector | Debe incluir | Ejemplo |
|--------|--------------|---------|
| Registro técnico | Operación, dato de entrada, regla violada, causa original | `retirarArchivo: archivo 4812 "informe-anual.pdf", usuario 77 nivel 2 (Edición); BR-04: solo nivel 1 (Administración) retira` (números de ejemplo) |
| Usuario | Qué pasó, por qué, qué puede hacer; sin detalles internos | El texto que haya definido el proyecto; si no está definido, se devuelve |

- Al usuario nunca se le muestra un rastro técnico, una consulta ni un identificador interno, y el mensaje de rechazo no confirma que existe algo que no puede ver.
- El texto exacto de los mensajes al usuario no lo inventa el constructor: sale de los criterios del analista o de la estructura de la vista. Si falta, se usa un texto marcado PROVISIONAL y se devuelve.
- Afirmar suposiciones donde "no puede pasar": si una carpeta debe tener dueño, comprobarlo y fallar fuerte si no. Un programa detenido hace menos daño que uno que sigue con datos corruptos.

## 5. DRY bien entendido

- DRY es sobre **conocimiento**, no sobre texto parecido. Una regla de negocio (quién puede retirar) vive en un solo lugar y todos la consultan.
- Dos bloques iguales que obedecen a reglas distintas **no** son duplicación; unirlos amarra dos reglas que pueden cambiar por separado.
- Regla de tres: la primera vez se escribe, la segunda se anota, la tercera se extrae. Dentro del módulo; lo que se comparta entre módulos lo decide Kompa.

## 6. Marcar lo PROVISIONAL

Cuando el constructor tiene que avanzar con algo que no está definido (un texto, un valor, un caso no cubierto), no lo esconde:

- Marca buscable en el código: `// PROVISIONAL: texto de error al exceder tamaño — ver docs/construccion/<modulo>-fase-<n>.md`.
- Entrada en la sección provisionales y pendientes de `docs/construccion/<modulo>-fase-<n>.md`: qué se supuso, por qué y su rol dueño (aquí, analista); la pregunta va en devoluciones.
- El valor provisional es el más conservador (rechazar antes que permitir, ocultar antes que mostrar).
- Una fase no se entrega como terminada con PROVISIONALES sin listar; el revisor debe poder encontrarlos todos con una búsqueda.

## 7. No ampliar alcance

- Se construye lo aprobado para la fase, ni más ni menos. Una mejora que se te ocurra se anota en la sección sugerencias del registro de fase, no se programa.
- No se agrega flexibilidad "por si acaso" (opciones, parámetros, generalizaciones que ningún requisito pide).
- Se mejora el código que se toca para el cambio (regla del boy scout), en un paso de estructura aparte; el resto del sistema no se reacomoda por gusto.
- Si arreglar algo exige cambiar una decisión de otro rol, se devuelve; no se resuelve en código.

## 8. Checklist por fase

- [ ] Cada nombre nuevo de dominio existe en el glosario del analista o en el modelo de Forja.
- [ ] Una palabra por concepto en todo el módulo.
- [ ] Ninguna función nueva lleva argumentos bandera ni efectos que su nombre no diga.
- [ ] Sin capturas vacías, sin nulos como "no hay", errores con nombre.
- [ ] Mensajes técnicos con contexto; mensajes al usuario sin detalles internos y de la fuente aprobada.
- [ ] Todo PROVISIONAL tiene marca buscable y entrada en provisionales y pendientes, con su rol dueño.
- [ ] Nada construido fuera del alcance de la fase.

## 9. Errores comunes

| Error | Por qué falla | Corrección |
|-------|---------------|------------|
| Nombrar con jerga técnica lo que el analista nombra en el dominio | El revisor no puede comparar código contra requisito | Usar el término del glosario |
| Comentario que explica qué hace un bloque | Los comentarios se desactualizan | Extraer una función con ese nombre; comentar solo el porqué |
| Dejar código comentado "por si acaso" | Confunde; el control de versiones ya lo guarda | Borrarlo |
| Mensaje genérico "Ocurrió un error" | Ni el usuario ni el soporte saben qué hacer | Error con nombre, contexto en registro, texto aprobado al usuario |
| Inventar el texto o el valor que faltaba sin marcarlo | Parece decisión aprobada | PROVISIONAL marcado y devuelto |

## 10. Límites del constructor

- No define términos del dominio, textos de interfaz, reglas, permisos, datos ni componentes compartidos.
- No elige estilo de código distinto al que ya usa el proyecto ni introduce herramientas nuevas.
- Lo ambiguo se devuelve al dueño con hechos, supuestos y la pregunta concreta.

Adaptado de wondelai/skills (clean-code, basado en "Clean Code" de Robert C. Martin; pragmatic-programmer, basado en "The Pragmatic Programmer" de David Thomas y Andrew Hunt), licencia MIT.
