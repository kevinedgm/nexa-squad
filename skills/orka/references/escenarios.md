# Escenarios de entrada

Propósito: decidir, antes del primer paso, **qué tipo de trabajo es**, en qué rol arranca la cadena, qué roles se saltan y qué documentos se escriben completos o solo como cambio. No toda petición necesita a los ocho roles.

## Contenido

1. Cómo reconocer el escenario
2. Tabla de escenarios
3. Nuevo
4. Extender un módulo existente
5. Traer una funcionalidad de otra aplicación
6. Corregir la composición de un módulo ya construido
7. Un solo rol o un tramo
8. Documentos de cambio
9. Checklist verificable
10. Errores comunes

## 1. Cómo reconocer el escenario

Tres datos, en este orden. Los dos primeros se inspeccionan; el tercero sale de la frase de Kevin.

| Dato | Cómo se obtiene | Qué decide |
|---|---|---|
| ¿El módulo existe en el código? | Buscar rutas, vistas o controladores con ese nombre | Nuevo frente a existente |
| ¿Hay documentos de Nexa para ese módulo? | `docs/requisitos/<modulo>.md`, `docs/estructura/<modulo>.md`, bitácora | Si se parte de documentos o de código |
| ¿Qué pide Kevin? | Verbo y objeto de la petición | El escenario (tabla de la sección 2) |

Si la frase admite dos escenarios con caminos distintos (por ejemplo, "arregla el módulo de cuentas" puede ser composición o comportamiento), haz **una** pregunta a Kevin con tu recomendación primero. Si la diferencia es reversible, elige el más probable, anótalo en la bitácora y sigue.

## 2. Tabla de escenarios

| Escenario | Frases típicas | Arranca en | Se salta | Documentos |
|---|---|---|---|---|
| **Nuevo** | "quiero construir…", "necesito una funcionalidad para…" | Inqa (`origen: nuevo`) | Nada | Completos |
| **Extender** | "en este módulo, cuando pase X, ahora tiene que pasar Y" | Inqa (`origen: existente`), solo el cambio | Arko si no toca datos, API ni permisos; Fluxa, Kompa y Kura si no cambia ninguna vista | De cambio (sección 8) |
| **Traer de otra app** | "lee esta funcionalidad de tal aplicación y tráela aquí, pero para…" | Inqa (`origen: externo`), leyendo la app de origen como evidencia | Nada; Arko adapta al stack de destino | Completos, con tabla de adaptación |
| **Corregir diseño o flujo** | "este módulo se ve o se acomoda mal", "corrige el diseño y el flujo de clientes", "rediseña la pantalla de pagos" (el módulo ya funciona: hecho con Fruti, a mano o legacy) | Vera en modo diagnóstico | Inqa y Arko, salvo que un hallazgo toque comportamiento o datos | Diagnóstico + de cambio por región |
| **Migrar legacy** | "migra el gestor a Laravel", "pasa pagos a la base nueva" (cambia el stack, el framework o el modelo de datos) | Inqa (`origen: legacy`) | Nada | Completos |

**Corregir o migrar.** Si el módulo sigue en el mismo stack y con los mismos datos, es corregir, aunque la frase diga "rediseña" o el código sea legacy. Que el código sea viejo no convierte una corrección en migración: la cadena completa, el inventario y la preparación de datos solo se justifican cuando cambian el stack o los datos.
| **Un solo rol o tramo** | "solo analiza", "solo revisa la fase 2", "compón esta pantalla" | El rol nombrado | Todos los demás | Solo el de ese rol |
| **Continuar** | "continúa el gestor" | El primer documento pendiente según la bitácora | Lo ya aprobado | Los que falten |

Mecanismo: cada rol se salta porque **su decisión no cambia**. Si Arko no se lanza en un escenario de extender, es porque el cambio no toca datos ni contratos; si durante la cadena aparece un dato nuevo, Fluxa o Kura lo devuelven y Arko entra en ese momento.

## 3. Nuevo

Cadena completa. Inqa no tiene código que inspeccionar: trabaja con la descripción de Kevin, el módulo donde vivirá y lo que ya existe alrededor (permisos, catálogos). Sus preguntas pesan más, porque no hay legacy que revele reglas.

## 4. Extender un módulo existente

La forma de la petición es un disparador y un resultado: "cuando hago X, ahora tiene que suceder Y".

| Rol | Qué hace en este escenario |
|---|---|
| Inqa | Escribe el requisito del cambio con Dado/Cuando/Entonces, y **qué reglas actuales toca** (cita archivo y función del comportamiento de hoy). No reescribe los requisitos del módulo |
| Arko | Solo si Y necesita guardar, consultar, notificar o validar en servidor algo nuevo |
| Fluxa | Solo las vistas donde X ocurre o Y se ve: dónde aparece el resultado, qué estado nuevo hay |
| Kompa | Solo las regiones que Fluxa cambió; respeta la composición vigente del resto de la vista |
| Kura | Solo si aparece una pieza o variante que no está en el catálogo |
| Forja, Vera | La fase del cambio; Vera agrega una prueba de que lo que ya funcionaba sigue igual |

Punto de control 1: solo las reglas nuevas o cambiadas.

## 5. Traer una funcionalidad de otra aplicación

La app de origen es **evidencia de comportamiento**, nunca fuente de reglas ni de aspecto en el destino.

1. **Inqa** lee la app de origen (repositorio, carpeta o pantallas que dé Kevin) y documenta qué hace, citando archivo y función. Después escribe la **tabla de adaptación**:

   | Comportamiento en origen | En destino | Motivo |
   |---|---|---|
   | Lo que hace hoy | Igual / adaptado (cómo) / no se trae | Lo que dijo Kevin con "pero para esto" |

2. **Punto de control 1**: Kevin aprueba la tabla de adaptación junto con las reglas de negocio. Sin esta aprobación no se diseña nada.
3. **Arko** diseña para el stack del **destino** con un glosario de traducción (`adaptar-funcionalidad-externa.md` de Arko) (lo lee del proyecto y, si existe, del perfil de Fruti Squad: framework, estilos, `registry_path`, `hub_root`). Lo que en origen dependía de otra tecnología se traduce, no se copia.
4. **Fluxa y Kompa** estructuran y componen con el sistema del destino. El acomodo de la app de origen puede citarse como ejemplo, pero no es fuente (nivel 5 del catálogo de estándares).
5. **Kura** busca las piezas en el catálogo del destino; lo que solo existía en origen se reutiliza con una pieza del destino o se pide a Fruti Squad.

## 6. Corregir el diseño o el flujo de un módulo que ya funciona

Caso típico: un módulo que ya funciona (hecho con Fruti Squad, a mano o legacy) tiene un flujo confuso o componentes mal acomodados. El stack y los datos se quedan como están.

**Proporción.** Este escenario es para avanzar rápido: diagnóstico, estructura y composición solo de las regiones con hallazgo, y después código. No hay inventario del módulo, ni fase de preparación de datos, ni checklist de servidor, salvo que un hallazgo los necesite.

1. **Vera, modo diagnóstico.** Audita la pantalla funcionando y su código contra el catálogo de estándares y el sistema de diseño del proyecto (no hay documentos de Nexa contra los cuales comparar), recorriendo las tareas del perfil que usa el módulo (fila del módulo en `docs/producto.md` o lo que dijo Kevin). Cada hallazgo cita su fuente y se clasifica por dueño. Si Kevin nombra una tarea que el módulo hoy no permite (p. ej. adjuntar un voucher), no es corrección de composición: se anota para Inqa como escenario extender.
2. **Orka agrupa los hallazgos por dueño** y lanza solo a quien le toca:

   | Hallazgo | Dueño | Ejemplo |
   |---|---|---|
   | Orden, agrupación, condicionales, patrón | Fluxa | Facturación visible siempre en lugar de condicional |
   | Anchos, filas, jerarquía, espacio, superficies, iconos | Kompa | Autocomplete a ancho completo junto a un botón que se parte |
   | Falta una variante o la pieza no sirve | Kura (pedido a Fruti Squad) | El campo no tiene adorno de unidad |
   | Cambia lo que hace el módulo | Inqa | Quitar un paso que hoy es obligatorio |
   | Toca datos o permisos | Arko | — |

   Orden: primero estructura (Fluxa), después composición (Kompa), después piezas (Kura). Pulir el acomodo de un flujo confuso no lo arregla, y un cambio de estructura invalida la composición de esa región.
3. Fluxa escribe la estructura **de las regiones con hallazgos** describiendo primero cómo está y luego cómo debe quedar; Kompa compone esas mismas regiones. No se rediseña lo que no tiene hallazgo.
4. **Forja** corrige solo esas regiones; **Vera** revisa contra el diagnóstico y los documentos nuevos.
5. Un hallazgo que cambia comportamiento no se corrige en este escenario: va a Inqa y, si Kevin lo aprueba, se vuelve un escenario de extender.

## 7. Un solo rol o un tramo

Lanza el rol nombrado como skill (puede preguntar a Kevin) y detente. Si le falta un documento de entrada, dilo en una línea y ofrece el rol que lo produce; no lo lances sin que Kevin lo pida.

## 8. Documentos de cambio

En extender y corregir, los documentos del módulo no se reescriben. Cada rol agrega una sección al final de su documento (o crea uno si no existía):

```text
## Cambio <id>: <título corto>
escenario: extender | corregir
afecta: <vistas, regiones o reglas>
estado: borrador | aprobado
Antes: …
Después: …
Fuente: …
```

El encabezado YAML del documento conserva su estado general; cada cambio lleva el suyo.

## 9. Checklist verificable

- [ ] La bitácora dice el escenario y por qué (evidencia de los tres datos de la sección 1).
- [ ] La bitácora dice el alcance: qué entra y qué no entra.
- [ ] Cada rol que se saltó tiene el motivo escrito.
- [ ] En traer de otra app, la tabla de adaptación está aprobada por Kevin antes de Fluxa.
- [ ] En corregir, cada región tocada tiene un hallazgo con fuente.
- [ ] En extender y corregir, hay una verificación de que lo que no cambió sigue igual.

## 10. Errores comunes

| Error | Por qué falla | Corrección |
|---|---|---|
| Correr la cadena completa para un cambio pequeño | Se reescriben documentos aprobados y se reabren decisiones | Escenario extender, documentos de cambio |
| Copiar el aspecto de la app de origen | Rompe el sistema del destino | La app de origen es evidencia de comportamiento |
| Corregir composición rediseñando todo el módulo | Cambia lo que funcionaba y no tiene hallazgo | Solo las regiones con hallazgo |
| Arreglar un comportamiento "de paso" al corregir composición | Cambia una regla sin aprobación | Devolver a Inqa |
| Tratar como migración una corrección de un módulo legacy | Corre la cadena completa, planea respaldos y analiza configuración que el cambio no toca; horas antes de la primera línea de código | Mismo stack y mismos datos = corregir |
| Analizar fuera del alcance (límites de subida, permisos del servidor, módulos vecinos) | Cada punto agrega preguntas, decisiones y revisiones | Una línea "fuera de alcance" para Kevin, sin desarrollarlo |

Adaptado en parte de wondelai/skills (improve-app: arreglar la fricción antes que el pulido y ningún cambio sin hallazgo), licencia MIT.
