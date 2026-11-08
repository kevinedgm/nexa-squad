# Caso 01: registro de usuarios (formulario nuevo)

## Contexto
`docs/producto.md` aprobado con un perfil "Cliente" que se registra una vez desde teléfono o escritorio. Proyecto con Fruti Squad: tokens y componentes de campo, casilla y botón.

## Petición
`/orka quiero una funcionalidad de registro de usuarios: nombre, apellidos, teléfono opcional, correo, contraseña y, si requiere factura, RFC, razón social, régimen fiscal y código postal fiscal; acepta términos antes de crear la cuenta`

## Ruta esperada
Escenario nuevo · Inqa → punto de control 1 → Arko → Fluxa → Kompa → Kura → Forja → Vera.

## Debe
- [ ] Nombre y apellidos declarados como unidad fuerte y en la misma fila en escritorio; apilados en teléfono.
- [ ] Facturación es condicional, con activador justo antes y campos que aparecen debajo sin mover lo de arriba.
- [ ] Se marca el caso minoritario (opcional) con texto, no solo con color.
- [ ] Una sola acción principal ("Crear cuenta") y los términos justo antes de ella.
- [ ] El formulario usa el ancho máximo del sistema o registra el hueco de token.
- [ ] Cada regla de estructura y composición tiene columna Fuente.

## No debe
- [ ] Pedir confirmar el correo sin un requisito que lo pida.
- [ ] Poner en la misma fila campos que no son unidad.
- [ ] Usar valores de espacio o tamaño fuera de los tokens.
