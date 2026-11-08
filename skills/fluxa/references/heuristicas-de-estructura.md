# Heurísticas de estructura

Propósito: decidir qué contiene cada vista y en qué orden usando Nielsen y Krug como criterios verificables, y revisar cada vista contra ellos antes de entregarla al compositor.

## Contenido

1. Cuándo aplicar esta referencia
2. Principios y su mecanismo
3. Cuando dos heurísticas chocan
4. Cómo revisar una vista
5. Severidad de los hallazgos
6. Ejemplo: vista de carpeta en el gestor de archivos
7. Errores comunes
8. Límites

## 1. Cuándo aplicar esta referencia

- Al definir el inventario de una vista (regiones, grupos, campos, acciones) y su orden.
- Al nombrar vistas, secciones, campos y acciones.
- Al revisar una vista terminada antes de pasarla al compositor.

Base de comportamiento (Krug), de la que se derivan todos los criterios:

| Cómo actúa la persona | Consecuencia para la estructura |
|---|---|
| No lee, escanea buscando lo que trae en mente | Cada región necesita un nombre que se entienda al pasar la vista; el contenido importante va primero en el orden |
| No elige la mejor opción, elige la primera razonable | La opción correcta para la tarea frecuente debe ser la primera razonable que encuentre |
| No entiende cómo funciona, se las arregla | Hay que esperar usos "equivocados" y dejar salida de cada uno |

## 2. Principios y su mecanismo

**2.1 Saber dónde estoy (visibilidad del estado, Nielsen 1).** Quien no sabe dónde está ni qué pasó, desconfía y repite acciones. Cada vista declara su ubicación y el estado de lo que muestra (cuántos registros, si hay filtro activo, si hay algo pendiente de guardar).

**2.2 Prueba del tronco (Krug).** Imagina que sueltan a alguien en esta vista sin contexto. Debe poder responder seis preguntas; estructura decide que exista el elemento que responde cada una, no dónde ni cómo se ve.

| Pregunta | Elemento que debe existir en el inventario |
|---|---|
| ¿Qué sistema es? | Identificación del sistema |
| ¿En qué vista estoy? | Título de la vista, igual al nombre del enlace que trajo aquí |
| ¿Cuáles son las secciones principales? | Navegación general |
| ¿Qué puedo hacer aquí? | Acciones de la vista, con una principal |
| ¿Dónde estoy en la jerarquía? | Ruta (migas) o indicador de sección actual |
| ¿Cómo busco? | Buscador, si la vista tiene más contenido del que cabe en un vistazo |

**2.3 Reconocer mejor que recordar (Nielsen 6).** Recordar cuesta memoria de trabajo; reconocer casi no. Criterios: opciones visibles o en lista, nunca códigos que haya que memorizar (mostrar el nombre del nivel de acceso, no solo "3"); valores previos precargados; filtros activos visibles; contexto del registro visible mientras se edita.

**2.4 Consistencia (Nielsen 4).** Si la misma palabra significa dos cosas, o dos palabras significan lo mismo, la persona duda en cada aparición. Criterios: un término por concepto en todo el módulo ("Retirar" o "Eliminar", nunca ambos para lo mismo); la misma acción produce el mismo resultado en todas las vistas; vistas del mismo tipo tienen las mismas regiones en el mismo orden (cabecera, herramientas, datos, pie).

**2.5 No me hagas pensar (Krug).** Cada "¿y esto qué es?" consume atención que era de la tarea. Criterios: nombres de acción con verbo + objeto ("Subir archivo", no "Procesar"); palabras del usuario, no del sistema ("Carpeta", no "Repositorio"; "Buscar", no "Consultar"); si una etiqueta necesita explicación, cambia la etiqueta antes de añadir ayuda.

**2.6 Reducir pasos, contando decisiones y no clics (Krug).** Tres clics obvios son mejores que uno dudoso: se abandona por perder la confianza, no por hacer clic. Criterios: cada paso responde una sola pregunta; ningún paso pide un dato que el sistema ya tiene; la tarea frecuente no pasa por pantallas de la tarea rara.

**2.7 Lo que sobra compite (Nielsen 8).** Cada elemento extra le resta atención al importante. Criterios: una acción principal por vista; lo raro va en un segundo nivel (menú, sección plegada); quita texto que nadie leerá (bienvenidas, instrucciones obvias).

**2.8 Atajos para quien repite (Nielsen 7).** El usuario frecuente necesita velocidad sin que el novato vea complejidad. Criterios: acciones masivas cuando la tarea se repite sobre varios registros; búsquedas o filtros recientes cuando se consultan seguido.

**2.9 Siempre hay salida (Nielsen 3).** Quien entra por error necesita salir sin consecuencias. Criterios: todo flujo tiene Cancelar o regreso; regresar no destruye lo capturado sin avisar.

## 3. Cuando dos heurísticas chocan

Decide por el contexto, regístralo como decisión y di cómo mitigas lo que cedes.

| Choque | Inclínate hacia lo primero si… | Solución que suele cumplir ambas |
|---|---|---|
| Simplicidad vs flexibilidad | Uso ocasional, persona novata | Mostrar lo básico, el poder en un segundo nivel |
| Descubrible vs limpio | Es función central de la tarea | Principal visible, secundarias en menú |
| Prevención de errores vs eficiencia | La acción es irreversible, cara o afecta a otros | Deshacer en lugar de confirmar, cuando la propia persona puede revertir |
| Consistencia vs contexto | Muchos tipos de usuario | Mismo patrón, distinta prioridad según la vista |

## 4. Cómo revisar una vista

1. Escribe en una línea la tarea principal de la vista y quién la hace.
2. Aplica la prueba del tronco: marca qué pregunta no tiene elemento que la responda.
3. Recorre el inventario en orden: ¿lo primero es lo que más se usa?
4. Busca recuerdos obligados: códigos, datos de otra vista, filtros invisibles.
5. Compara términos y orden de regiones con las demás vistas del módulo.
6. Cuenta las acciones con prioridad principal: debe ser exactamente una.
7. Para cada acción: ¿el nombre dice qué hace sin contexto adicional?
8. Clasifica cada hallazgo con la escala de severidad y separa hechos, supuestos y preguntas.

Checklist verificable:

- [ ] El título de la vista coincide con el nombre del enlace o acción que lleva a ella.
- [ ] Existe ruta o indicador de ubicación cuando la vista está a más de un nivel.
- [ ] Hay exactamente una acción principal.
- [ ] Ningún campo muestra un código sin su nombre.
- [ ] Ningún concepto tiene dos nombres en el módulo.
- [ ] Todo flujo tiene salida sin pérdida silenciosa de datos.
- [ ] Ninguna información necesaria para decidir depende de pasar el puntero encima.
- [ ] El orden del inventario sigue la frecuencia de uso, no el orden de las columnas de la base de datos.

## 5. Severidad de los hallazgos

| Nivel | Significado | Qué hacer |
|---|---|---|
| 0 | Desacuerdo, no problema | Ignorar |
| 1 | Cosmético | Si hay tiempo |
| 2 | Menor: retrasa o frustra | Programar |
| 3 | Mayor: la tarea falla con frecuencia | Corregir antes de entregar |
| 4 | Catastrófico: impide terminar la tarea | Bloquea la entrega |

Pondera tres factores: qué tan seguido ocurre, qué tan grave es cuando ocurre y si se repite cada vez.

## 6. Ejemplo: vista de carpeta en el gestor de archivos

Hechos (reglas aprobadas): la acción principal de la vista del repositorio es Buscar. Nivel 1 Administración consulta, descarga, sube/actualiza/corrige documentos, crea y renombra carpetas y retira; nivel 2 Edición consulta, descarga y sube/actualiza/corrige; nivel 3 consulta y descarga; nivel 4 solo consulta. La carpeta raíz no se retira. Supuesto: consultar es la tarea más frecuente para todos los niveles.

| Región | Contenido en orden | Heurística que lo justifica |
|---|---|---|
| Cabecera | Título = nombre de la carpeta; ruta desde la raíz; conteo de documentos | Prueba del tronco, saber dónde estoy |
| Herramientas | Buscar (principal); filtros activos visibles; Subir documento (niveles 1 y 2); Crear carpeta (nivel 1) | Reconocer, una acción principal |
| Datos | Lista de documentos y carpetas; Consultar por registro; Descargar por registro (niveles 1 a 3) | Escaneo, la tarea frecuente primero |
| Acciones de segundo nivel | Actualizar o corregir documento (niveles 1 y 2); Renombrar y Retirar carpeta (nivel 1, Retirar separado y al final; nunca en la raíz) | Lo que sobra compite |
| Pie | Paginación y total | Estado visible |

Un nivel 4 que aplica la prueba del tronco en esta vista ve cabecera, Buscar y la lista con Consultar; nada más, porque lo que nunca podrá hacer no aparece.

Hallazgos típicos, ejemplo hipotético (no verificado en el legado): "Nivel 3" sin nombre del nivel (recuerdo obligado, severidad 2); "Borrar" en una vista y "Retirar" en otra (consistencia, severidad 2); título "Explorador" al entrar desde un enlace "Archivos del laboratorio" (prueba del tronco, severidad 2).

## 7. Errores comunes

- Ordenar campos como vienen en la tabla de la base de datos.
- Dos o tres acciones "principales" porque todas parecen importantes.
- Resolver con un texto de ayuda lo que una mejor etiqueta haría innecesario.
- Iconos sin nombre en el inventario de acciones.
- Declarar la vista revisada sin decir qué se comprobó y qué quedó como supuesto.

## 8. Límites

Esta referencia decide presencia, nombre, orden y prioridad. No decide posición en pantalla, tamaños, colores, iconos, tipografía ni qué cede en pantallas chicas (compositor); tampoco decide qué componente se reutiliza (curador) ni cómo se aplica el permiso en el servidor (arquitecto técnico).

Adaptado de wondelai/skills (ux-heuristics, basado en "Don't Make Me Think" de Steve Krug y "10 Usability Heuristics" de Jakob Nielsen), licencia MIT.
