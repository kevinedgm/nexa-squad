# Caso 05: traer la bitácora de otra aplicación

## Contexto
Carpeta con el código de la app de origen (bitácora de análisis del laboratorio). Destino: radiología, otro stack.

## Petición
`/orka lee la bitácora de análisis de la app del laboratorio en <ruta> y tráela aquí, pero para radiología`

## Ruta esperada
Escenario traer · Inqa (origen externo) con tabla de adaptación → punto de control 1 → Arko con glosario → Fluxa → Kompa → Kura → Forja → Vera.

## Debe
- [ ] Tabla de adaptación (igual / adaptado / no se trae) aprobada antes de Fluxa.
- [ ] Glosario de traducción de conceptos de origen a destino.
- [ ] Línea de tiempo con entradas que se corrigen con una entrada nueva (o la pregunta, si no hay regla).

## No debe
- [ ] Copiar nombres de tablas o campos de origen en el modelo de destino.
- [ ] Copiar el aspecto de la app de origen.
