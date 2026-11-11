# Perfiles de usuario del producto

Propósito: definir **qué es el producto y para quién se diseña** una sola vez, en `docs/producto.md` (se crea con `/inqa init`), para que todos los roles tomen sus decisiones pensando en las mismas personas y sus tareas. Ejemplo: en un sistema de laboratorio, la analista captura resultados en la bitácora y el supervisor los revisa y libera.

## Contenido

1. Por qué un documento de perfiles
2. Qué es un perfil (y qué no)
3. De dónde salen los perfiles
4. El documento `docs/producto.md`
5. Relaciones entre perfiles
6. Cómo lo usa cada rol
7. Cuando dos perfiles chocan
8. Ejemplo: laboratorio
9. Checklist verificable
10. Errores comunes

## 1. Por qué un documento de perfiles

Sin perfiles, cada rol supone por su cuenta quién usa la pantalla: Kompa imagina a alguien que consulta de vez en cuando, o compone para un principiante y Kompa revisa con un administrador. Cada decisión es razonable y el conjunto no sirve a nadie. Mecanismo: la usabilidad solo existe **para usuarios concretos, con objetivos concretos, en un contexto concreto** (ISO 9241-11). Si eso no está escrito, no se puede comprobar.

## 2. Qué es un perfil (y qué no)

| Es | No es |
|---|---|
| Un rol de trabajo con tareas, frecuencia y contexto ("analista de laboratorio") | Una persona inventada con nombre, edad y foto |
| Lo que necesita lograr y qué le estorba hoy | Una lista de pantallas |
| Sus permisos como consecuencia de sus tareas | Solo un nivel de permisos ("nivel 3") |

## 3. De dónde salen los perfiles

1. **De Kevin**, que describe los roles en sus palabras ("la analista captura la bitácora; el supervisor revisa"). Es la fuente principal: quién usa el sistema es decisión de negocio.
2. **Del código**, como evidencia: roles y permisos existentes, quién crea qué registros, qué pantallas usa cada nivel.
3. **De los datos**, si los hay: volumen por día, horarios, quién captura más.

Lo que no venga de Kevin queda como supuesto marcado. Los perfiles se aprueban en el la aprobación de Kevin, junto con las reglas de negocio, y valen para todos los módulos del producto: el segundo módulo los reutiliza y solo agrega lo que cambie.

## 4. El documento `docs/producto.md`

```text
---
producto: <nombre>
estado: borrador | con-preguntas | aprobado
perfiles: [P-01, P-02]
---
0. Resumen (máximo 5 líneas)
1. El producto
   - Qué es: tipo de sistema y qué produce (p. ej. SaaS que emite informes de análisis de muestras industriales)
   - A quién se dirige: el negocio que lo usa y sus clientes
   - Dominio: vocabulario propio (muestra, corrida, bitácora, voucher) y normas que Kevin diga que aplican
2. Perfiles
   P-01 <nombre del rol>
   - Objetivo: qué tiene que lograr en su trabajo
   - Tareas: tarea · frecuencia (veces por día o semana) · volumen · presión de tiempo
   - Contexto: dónde y con qué trabaja (escritorio, tablet, guantes, de pie, interrupciones)
   - Experiencia: con el sistema y con el dominio
   - Qué le estorba hoy: evidencia o lo que dijo Kevin
   - Éxito: cómo se ve que el sistema le ayuda (verificable)
   - Permisos: qué ve, qué crea, qué cambia, qué no puede tocar
3. Relaciones entre perfiles (sección 5)
4. Módulos y quién los usa
   | Módulo | Perfil principal | Perfiles secundarios | Qué hace ahí (tareas, frecuencia) |
5. Supuestos y preguntas
```

"Éxito" se escribe verificable: "captura los resultados de una corrida de 40 muestras sin usar el ratón" en lugar de "captura rápido".

### Módulos y quién los usa

Cada módulo nuevo agrega su fila en la sección 4 cuando Kevin dice quién lo usa ("el módulo de cuentas lo ocupa la recepcionista: paga muestras pendientes, adjunta vouchers, marca como pagadas o cancela"). Esa fila es la entrada de Kompa (perfil principal de cada vista) y de Kompa (qué tareas recorrer). Si Kevin no lo dice, Inqa lo infiere del código (quién entra hoy al módulo) y lo marca como supuesto.

## 5. Relaciones entre perfiles

Cuando un perfil entrega trabajo a otro (captura → revisión), la relación genera requisitos que ningún perfil por separado revela:

| De | A | Qué pasa | Requisitos que genera |
|---|---|---|---|
| Quién entrega | Quién recibe | Revisa, aprueba, devuelve, libera | Estados del registro, qué ve cada uno, cómo se entera el que recibe, qué pasa al devolver, rastro de quién hizo qué |

Inqa convierte cada relación en reglas (BR) y requisitos (REQ) con Dado/Cuando/Entonces. Ejemplo: "Dado un resultado devuelto, cuando la analista abre su bandeja, entonces lo ve primero con el motivo de devolución".

## 6. Cómo lo usa cada rol

| Rol | Qué toma de los perfiles |
|---|---|
| Inqa | El actor de cada requisito es un perfil (P-01), no "el usuario" |
| Forja | Permisos en servidor por perfil; rastro de auditoría que piden las relaciones |
| Kompa | Cada vista declara su perfil principal; las tareas frecuentes de ese perfil van primero y con menos pasos |
| Kompa | Densidad, valores por defecto y atajos según tarea y contexto del perfil principal (captura diaria → densa y de teclado) |
| Kompa | Si un perfil necesita una variante (p. ej. densidad compacta), la pide con ese motivo |
| Kompa | Recorre las tareas de cada perfil de punta a punta y cada hallazgo dice a qué perfil afecta |

## 7. Cuando dos perfiles chocan

Una misma vista puede servir a dos perfiles con necesidades opuestas (la analista quiere capturar rápido; el supervisor quiere ver todo el contexto para revisar).

1. Cada vista tiene **un perfil principal**: el de la tarea más frecuente en esa vista. Sus decisiones mandan.
2. Lo que el perfil secundario necesita se resuelve sin estorbar al principal: divulgación progresiva, un panel de detalle o una vista propia.
3. Si la tensión no se resuelve así, son dos vistas. Lo decide Kompa con su motivo.

Fuentes: ISO 9241-11 (usuarios, objetivos y contexto de uso); NN (tensiones entre simplicidad y potencia, ver catálogo de estándares, sección 6).

## 8. Ejemplo: laboratorio

Ejemplo hipotético; lo confirma Kevin.

| Perfil | Tareas (frecuencia) | Contexto | Éxito |
|---|---|---|---|
| P-01 Analista | Capturar resultados de una corrida (decenas al día); registrar incidencias en la bitácora | Escritorio junto al equipo, interrupciones, prisa al final del turno | Captura una corrida completa con teclado, sin perder lo capturado si la interrumpen |
| P-02 Supervisor | Revisar y liberar resultados (varias veces al día); devolver con motivo | Escritorio o tablet, revisa lotes | Ve qué falta revisar, compara contra la referencia y libera un lote sin abrir registro por registro |

| De | A | Qué pasa | Requisitos que genera |
|---|---|---|---|
| P-01 | P-02 | Envía resultados a revisión | Estados capturado → en revisión → liberado / devuelto; bandeja de pendientes del supervisor; motivo obligatorio al devolver; la analista ve lo devuelto primero; rastro de quién capturó y quién liberó |

Consecuencias en el diseño: la captura de la analista es una cuadrícula densa de teclado (Kompa); la vista del supervisor es una consulta con filtros por estado con revisión por lote (Kompa); la analista no puede liberar lo que ella capturó (Forja, en servidor).

## 9. Checklist verificable

- [ ] Cada perfil tiene tareas con frecuencia, contexto y un éxito verificable.
- [ ] Cada relación entre perfiles se convirtió en reglas y requisitos.
- [ ] Cada requisito nombra a su perfil.
- [ ] Lo que no dijo Kevin está marcado como supuesto.

## 10. Errores comunes

| Error | Por qué falla | Corrección |
|---|---|---|
| "El usuario" como actor de todo | Nadie sabe para quién optimizar | Un perfil por requisito |
| Perfiles por nivel de permisos ("nivel 1…4") | Dice qué puede hacer, no qué necesita hacer | Tareas y contexto primero; permisos como consecuencia |
| Diseñar la vista para el que revisa cuando el que la usa más es el que captura | Se optimiza la tarea rara | Perfil principal por frecuencia |
| Personas inventadas con biografía | Detalles que nadie verificó guían decisiones | Solo lo que dijo Kevin o muestra la evidencia |

Elaborada para Nexa Squad; se apoya en ISO 9241-11 y en las demás referencias de Inqa (Christensen, *Competing Against Luck*: el trabajo que se quiere lograr).
