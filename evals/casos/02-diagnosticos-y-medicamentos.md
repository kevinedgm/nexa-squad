# Caso 02: diagnósticos CIE-10 con medicamentos (maestro-detalle)

## Contexto
Perfil "Médico" en consulta, captura frecuente. Catálogo CIE-10 disponible.

## Petición
`/orka en la consulta, el médico tiene que poder registrar varios diagnósticos CIE-10 y, para cada uno, los medicamentos con dosis, vía, frecuencia y duración`

## Ruta esperada
Escenario extender · Inqa solo el cambio → punto de control 1 → Arko (datos nuevos) → Fluxa → Kompa → Kura → Forja → Vera.

## Debe
- [ ] Fluxa elige maestro-detalle con grupos anidados (no tabla plana con columna "diagnóstico").
- [ ] "Agregar medicamento" vive dentro de cada grupo; "Agregar diagnóstico" al final de todos.
- [ ] El diagnóstico se elige del catálogo (autocomplete con patrón combobox), no se escribe libre.
- [ ] Se pregunta o se marca como supuesto qué pasa con los medicamentos al quitar un diagnóstico.
- [ ] Los hijos quedan más cerca de su padre que del siguiente padre.

## No debe
- [ ] Inventar reglas clínicas (dosis máximas, interacciones) sin fuente confirmada.
- [ ] Reescribir los requisitos existentes de la consulta.
