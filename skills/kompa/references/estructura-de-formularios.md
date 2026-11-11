# Estructura de formularios

Propósito: decidir qué contiene un formulario y en qué orden: qué secciones tiene, qué campos van juntos, cuáles son opcionales o aparecen solo bajo una condición, si va en una página o en pasos, y qué indicadores de estado necesita. El acomodo visual (columnas, espaciados, pesos, superficies) lo decide Kompa con lo que entregas aquí.

## Contenido

1. Qué decide Kompa y qué no
2. Del requisito a la lista de campos
3. Secciones: agrupar por lo que la persona piensa
4. Orden dentro de cada sección
5. Campos relacionados: la unidad que Kompa puede poner en una fila
6. Obligatorios, opcionales y condicionales
7. Una página o pasos
8. Indicadores y estados del formulario
9. Ejemplo: registro de usuarios
10. Checklist verificable
11. Errores comunes
12. Límites

## 1. Qué decide Kompa y qué no

| Pregunta | Dueño |
|---|---|
| ¿Qué campos existen y para qué? | Kompa (a partir de los REQ de Inqa) |
| ¿En qué secciones se agrupan y en qué orden? | Kompa |
| ¿Qué campos forman una unidad (nombre + apellido)? | Kompa |
| ¿Cuáles son opcionales y cuáles aparecen solo si se activa algo? | Kompa |
| ¿Página única o pasos? | Kompa |
| ¿Qué dicen los indicadores, ayudas y errores? | Kompa (contenido) |
| ¿Van en una fila o en dos, cuánto espacio, qué peso, qué superficie? | Kompa |
| ¿Qué componente se usa para cada campo? | Kompa |

Mecanismo: si no se declara qué campos forman una unidad, hay que adivinar qué poner lado a lado, y el resultado depende del ancho de pantalla en lugar de la lógica del dato.

## 2. Del requisito a la lista de campos

- Cada campo se liga a un REQ o BR de Inqa. Un campo sin requisito no entra; si crees que falta, es devolución a Inqa.
- No se pide un dato que el sistema ya tiene (de la sesión, de un registro previo, de otro campo).
- Cada campo declara: nombre visible, qué dato espera, si es obligatorio, valor por defecto (si lo hay) y de qué depende.
- Lo que el legacy pedía no es motivo para pedirlo: es evidencia para preguntar si alguien lo usa.

## 3. Secciones: agrupar por lo que la persona piensa

- Se agrupa por **tema de la persona**, no por tabla de la base: "Datos personales", "Acceso a la cuenta", "Facturación", no "usuarios" y "usuarios_detalle".
- Cada sección tiene un título que se entiende solo y, si hace falta, una línea que dice para qué se piden esos datos ("Solo si necesitas factura").
- Una sección con un solo campo casi nunca se justifica: se une a la vecina. Una sección con más de unos 7 campos probablemente son dos temas.
- Orden de secciones: lo que la persona tiene en la cabeza primero (quién es) antes de lo que tiene que buscar (datos fiscales, documentos).

## 4. Orden dentro de cada sección

1. Los campos que **cambian a otros** (tipo de persona, país, "¿requiere factura?") van primero, porque definen qué sigue.
2. Luego los **obligatorios**, en el orden natural del dato (nombre antes que apellido; calle, número, colonia, ciudad).
3. Los **opcionales** al final de la sección, o en su propia sección si son un tema aparte.
4. Las **confirmaciones** (repetir correo o contraseña) solo si un requisito lo pide; si no, se resuelve con "mostrar contraseña".

## 5. Campos relacionados: la unidad que Kompa puede poner en una fila

Declara como **unidad** los campos que se leen y se llenan como un solo dato. Kompa solo pone en la misma fila campos que tú marcaste como unidad.

| Unidad | Por qué |
|---|---|
| Nombre + apellidos | Juntos forman "el nombre" |
| Fecha de inicio + fecha de fin | Juntos forman un periodo |
| Ciudad + estado + código postal | Juntos forman la ubicación |
| Lada + teléfono | Juntos forman un número |

No es unidad: dos campos que solo "caben juntos" (correo y fecha de nacimiento). Para cada unidad, di si es una unidad fuerte (siempre juntos, en la misma fila cuando hay espacio) o débil (relacionados, pero cada uno puede ir en su fila).

## 6. Obligatorios, opcionales y condicionales

| Tipo | Qué declara Kompa | Ejemplo |
|---|---|---|
| Obligatorio | Que bloquea el envío y qué mensaje recibe si falta | Correo |
| Opcional | Qué gana la persona si lo llena | Teléfono: "para avisos urgentes" |
| Condicional | Qué lo activa, qué pasa con lo capturado si se desactiva, y si se vuelve obligatorio al activarse | Datos de facturación al marcar "Requiero factura" |

Reglas para condicionales (divulgación progresiva):

- Lo que la mayoría no necesita no se muestra hasta que lo activa. Mecanismo: cada campo visible es una pregunta que la persona cree que debe contestar.
- El activador va **justo antes** de lo que activa y dice el resultado ("Requiero factura"), no un nombre técnico.
- Al activarse, los campos aparecen debajo del activador, en el mismo lugar del flujo. No llevan a otra vista.
- Declara qué pasa al desactivar: se conservan los datos capturados (por si se reactiva) o se descartan. Si se descartan, es una acción con aviso.
- Si un campo condicional pasa a obligatorio al activarse, dilo; el indicador cambia con él.

## 7. Una página o pasos

| Situación | Forma |
|---|---|
| Hasta unas 3 secciones cortas, un solo tema | Una página |
| Secciones independientes, o un paso que depende del anterior (validar correo antes de seguir) | Pasos |
| La persona necesita reunir documentos o datos que no tiene a la mano | Pasos, con guardado del avance |
| Captura repetida y frecuente por personal interno | Una página, densa, sin pasos |

Si hay pasos: cada paso tiene un nombre, se puede regresar sin perder lo capturado, y el último muestra un resumen antes de enviar.

## 8. Indicadores y estados del formulario

Primero se decide qué dicen; después, cómo se ven.

- **Obligatorio/opcional**: se marca el caso minoritario, de forma consistente en el módulo.
- **Progreso** (solo con pasos): "Paso 2 de 3: Acceso a la cuenta".
- **Validación por campo**: cuándo se valida (al salir del campo, no mientras se escribe) y qué dice el error (qué está mal y cómo corregirlo).
- **Requisitos visibles antes de equivocarse**: reglas de contraseña, formato de RFC, tamaño de archivo.
- **Envío**: estado en proceso (no se puede enviar dos veces), éxito (qué pasó y qué sigue) y error (qué falló; lo capturado se conserva).
- **Cambios sin guardar**: si se puede salir a mitad, qué se avisa.

## 9. Ejemplo: registro de usuarios

Ejemplo hipotético para enseñar la forma; los REQ son de ejemplo.

Requisitos de Inqa: crear una cuenta con nombre, correo y contraseña (REQ-01); el teléfono es opcional para avisos (REQ-02); si la persona requiere factura, se capturan sus datos fiscales (REQ-03); se aceptan los términos antes de crear la cuenta (BR-01).

| Sección | Campos, en orden | Unidades | Notas |
|---|---|---|---|
| Datos personales | Nombre(s), Apellidos, Teléfono (opcional) | Nombre + Apellidos (fuerte) | El teléfono dice para qué se usa |
| Acceso a la cuenta | Correo, Contraseña | — | Reglas de contraseña visibles antes de escribir; "mostrar contraseña" en lugar de repetirla |
| Facturación (condicional) | Activador "Requiero factura"; al activarse: RFC, Razón social, Régimen fiscal, Código postal fiscal | RFC + Razón social (débil) | Al activarse, los cuatro son obligatorios; al desactivar se conservan por si se reactiva |
| Cierre | Aceptación de términos, acción principal "Crear cuenta" | — | "Crear cuenta" no está disponible sin aceptar; dice por qué |

Forma: una página (tres secciones cortas, un tema). Indicadores: se marcan los opcionales (minoría); error por campo al salir de él; envío en proceso bloquea un segundo envío; éxito: "Cuenta creada. Te enviamos un correo para confirmarla."

Lo que pasa a Kompa: secciones y su orden, unidades fuertes y débiles, el activador y lo que activa, la acción principal, y el contenido de ayudas, errores e indicadores.

## 10. Checklist verificable

- [ ] Cada campo se liga a un requisito; ninguno pide un dato que el sistema ya tiene.
- [ ] Las secciones se nombran por el tema de la persona, no por la base de datos.
- [ ] Los campos que cambian a otros van primero en su sección.
- [ ] Las unidades están declaradas (fuertes o débiles); nada más se pondrá lado a lado.
- [ ] Cada condicional dice qué lo activa, qué pasa al desactivar y si se vuelve obligatorio.
- [ ] La decisión de página o pasos tiene su motivo.
- [ ] Ayudas, errores, progreso y mensajes de envío tienen su contenido definido.
- [ ] Hay exactamente una acción principal.

## 11. Errores comunes

| Error | Por qué falla | Corrección |
|---|---|---|
| Secciones que copian las tablas | La persona no piensa en tablas | Agrupar por tema |
| Mostrar facturación a todos | Parece obligatorio y alarga el registro | Condicional con activador |
| Pedir repetir el correo "por si acaso" | Duplica trabajo sin requisito | Solo si un REQ lo pide |
| No decir qué campos son unidad | Kompa acomoda por espacio, no por lógica | Declarar unidades |
| Errores que solo dicen "inválido" | No dicen cómo corregir | Qué está mal y cómo arreglarlo |

## 12. Límites

Kompa decide contenido, orden, unidades, condiciones y el texto de indicadores; ni qué componente se usa (Kompa), ni cómo se valida en el servidor (Forja).

Adaptado de las demás referencias de Kompa (Krug, Nielsen, Norman) y de "Web Form Design" de Luke Wroblewski.
