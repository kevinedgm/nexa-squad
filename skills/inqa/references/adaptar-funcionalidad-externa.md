# Adaptar una funcionalidad de otra aplicación

Propósito: traer al sistema de destino una funcionalidad que existe en otra aplicación (escenario "traer" de Inqa) sin que el modelo, los nombres ni la tecnología de origen se filtren al destino.

## Contenido

1. El riesgo
2. Glosario de traducción
3. Capa de traducción
4. Qué se traduce, qué se reescribe
5. Ejemplo
6. Checklist verificable
7. Límites

## 1. El riesgo

La app de origen tiene su propio modelo: otros nombres, otras tablas, otras reglas implícitas. Si se copia tal cual, el destino termina con dos lenguajes para lo mismo (`paciente` y `cliente_med`), reglas que nadie aprobó y dependencias de una tecnología que el destino no usa. Mecanismo: cada nombre o campo de origen que entra sin traducir obliga a todos los roles siguientes a saber cómo pensaba la otra aplicación.

## 2. Glosario de traducción

Antes de diseñar, escribe la tabla de conceptos, partiendo de la tabla de adaptación que Kevin aprobó con Inqa:

| Concepto en origen | Concepto en destino | Diferencia | Fuente |
|---|---|---|---|
| Nombre, tabla o campo de origen | Nombre del destino (el que ya usa el módulo o el que fija Inqa) | Qué cambia: cardinalidad, unidad, obligatoriedad, estados | Archivo y función de origen; requisito de destino |

Un concepto sin equivalente en el destino no se inventa: es devolución a Inqa.

## 3. Capa de traducción

- Si el destino **consume datos** de la app de origen (la funcionalidad sigue viviendo allá), define una capa de traducción: un adaptador que habla el protocolo de origen y un traductor que entrega objetos del destino. Nada fuera de esa capa conoce los nombres de origen.
- Si la funcionalidad **se reconstruye** en el destino (lo más común), no hay capa en tiempo de ejecución: el glosario es la traducción y el código se escribe con el modelo del destino.
- Si hay migración de datos de origen al destino, es irreversible: plan en `migrar-legacy-con-seguridad.md` y punto de control 2.

## 4. Qué se traduce, qué se reescribe

| Del origen | En el destino |
|---|---|
| Comportamiento aprobado en la tabla de adaptación | Se reproduce con el modelo del destino |
| Nombres de tablas, campos y rutas | Se traducen con el glosario |
| Tecnología (framework, librerías, formato de API) | Se reescribe con el stack del destino (perfil del proyecto) |
| Reglas implícitas en el código | Evidencia: se listan para Inqa, no se copian |
| Aspecto y acomodo | No pasa: lo deciden Kompa con el sistema del destino |

## 5. Ejemplo

Ejemplo hipotético. Origen: la bitácora de análisis del sistema de laboratorio (`lab_bitacora`, tipos fijos en código). Destino: radiología.

| Origen | Destino | Diferencia |
|---|---|---|
| `lab_bitacora.id_muestra` | Estudio de imagen | Una entrada pertenece a un estudio, no a una muestra |
| Tipo "proceso" | Tipo "adquisición" | Nombre del dominio de destino (lo confirma Inqa) |
| Tipos en una constante del código | Catálogo en base | Regla nueva de destino: se agregan tipos sin desplegar |

## 6. Checklist verificable

- [ ] El glosario cubre cada concepto de origen que se usa.
- [ ] Ningún nombre de origen aparece fuera de la capa de traducción (o del glosario, si se reconstruye).
- [ ] Las reglas implícitas de origen están listadas para Inqa, no copiadas.
- [ ] El stack del destino sale del perfil del proyecto, no del origen.

## 7. Límites

Forja traduce el modelo y la tecnología. Qué comportamiento se trae lo decide Kevin con Inqa (tabla de adaptación); cómo se ve, Kompa.

Adaptado de wondelai/skills (domain-driven-design, basado en "Domain-Driven Design" de Eric Evans: contextos delimitados y capa anticorrupción), licencia MIT.
