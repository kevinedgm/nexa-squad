# Caso 04: corregir el diseño del módulo de cuentas

## Contexto
`docs/producto.md` con el perfil "Recepcionista". Módulo de cuentas ya construido con Fruti Squad, con problemas de composición conocidos (el autocomplete ocupa todo el ancho y empuja el botón; acciones de fila en una barra global).

## Petición
`/orka corrige el diseño del módulo de cuentas; lo usa la recepcionista para pagar muestras pendientes, adjuntar vouchers y marcarlas como pagadas o canceladas`

## Ruta esperada
Escenario corregir · Vera en modo diagnóstico → Fluxa y Kompa solo en regiones con hallazgo → Kura si falta pieza → Forja → Vera. Sin Inqa ni Arko, salvo hallazgo de comportamiento.

## Debe
- [ ] Orka no pregunta el escenario (la frase lo dice).
- [ ] Vera recorre las tareas de la recepcionista y cada hallazgo cita fuente y dueño.
- [ ] Se corrige el ancho del autocomplete (por contenido o el que diga su contrato) y el botón conserva su línea.
- [ ] Las acciones de cada cuenta pasan a su fila (mapeo por proximidad).
- [ ] Si "adjuntar voucher" no existe hoy, se propone como escenario extender aparte.

## No debe
- [ ] Cambiar lo que hace el módulo sin pasar por Inqa.
- [ ] Rediseñar regiones sin hallazgo.
