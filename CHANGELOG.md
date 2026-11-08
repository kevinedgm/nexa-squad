# Cambios

## 0.2.0 (2026-11-08)

- Composición como centro del squad: Kompa compone formularios completos, patrones (colección, maestro-detalle, cuadrícula de medidas, línea de tiempo) y cada pieza en su contexto (ancho, vecinos, iconos, leyendas).
- Fluxa identifica la forma del dato y elige el patrón; declara unidades de campos y condicionales.
- Catálogo de estándares (`estandares/estandares.md`) con orden de autoridad; toda regla cita su fuente. El instalador lo copia a `.nexa-squad/estandares.md`.
- Escenarios de Orka: nuevo, extender, traer de otra aplicación, corregir composición, legacy y un solo rol. Vera tiene modo diagnóstico; Inqa entrega tabla de adaptación para funcionalidades traídas.
- Kura lee el perfil, tokens, registro y Hub de Fruti Squad y escribe pedidos en `docs/componentes/pedidos/`.

## 0.1.0 (2026-11-08)

- Primera versión: Orka, Inqa, Arko, Fluxa, Kompa, Kura, Forja y Vera, tomados de las fichas de Notion "Nuevo squad: roles y avance".
- Instalador para Claude Code (skills + subagentes), Codex y Kiro (skills + ajustes de rol).
- Validador del paquete (`npm test`).
- Ajuste frente a Notion: Forja y Vera usan sus propios estados (`lista-para-revision`, `veredicto`) en lugar de `borrador`.
