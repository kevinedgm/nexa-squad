# Caso 06: analista captura y supervisor revisa

## Contexto
`/orka init` hecho: la analista captura resultados en bitácoras; el supervisor revisa y aprueba bitácoras.

## Petición
`/orka quiero la captura de resultados de una corrida para la analista y la revisión del supervisor`

## Ruta esperada
Escenario nuevo · cadena completa.

## Debe
- [ ] Requisitos con estados (capturada, en revisión, aprobada, devuelta) y motivo al devolver.
- [ ] Cada vista con su perfil principal: captura densa y de teclado (analista); revisión por lote con filtros por estado (supervisor).
- [ ] El servidor impide que quien capturó apruebe lo mismo.
- [ ] Vera recorre la tarea completa: captura, envío, revisión, devolución y corrección.

## No debe
- [ ] Una sola vista que mezcle la captura y la revisión sin perfil principal.
- [ ] Permisos que solo se ocultan en pantalla.
