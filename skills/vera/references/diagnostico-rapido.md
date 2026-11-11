# Diagnóstico rápido

Propósito: diagnosticar una región de un módulo que ya funciona en un solo pase, dentro de la conversación de Orka, y dejar cada hallazgo como una tarea. Úsala en el escenario corregir. Las otras referencias de Vera son para revisar un módulo contra sus documentos aprobados; aquí no se abren salvo que un hallazgo lo necesite.

## Contenido

1. Antes de mirar
2. Detector automático
3. Cinco revisiones
4. Gravedad y corregir-ahora
5. Tabla de tareas

## 1. Antes de mirar

- Lee `docs/contexto/<modulo>.md` y la tabla de tareas de la bitácora. Si la tabla ya tiene filas de esta región, parte de ellas: no repitas el diagnóstico.
- Abre solo los archivos de la región nombrada. Lo demás es fuera de alcance.
- Ten a mano el perfil principal y su tarea frecuente (`docs/producto.md`).

## 2. Detector automático

Si impecable está instalado (`.kiro/skills/impeccable/`, `.claude/skills/impeccable/` o `.agents/skills/impeccable/`), corre primero su detector sobre los archivos de la región:

`<carpeta de impeccable>/scripts/impeccable detect --json <archivo o carpeta>`

Lo que encuentra (contraste, valores fijos en lugar de tokens, áreas táctiles, desbordes) se verifica en contexto y entra como hallazgo con su regla. No razones a mano lo que el detector ya midió. Si no está instalado o falla, dilo en una línea y sigue con la sección 3.

## 3. Cinco revisiones

Una pasada por cada una, solo sobre la región. Cada hallazgo cita su fuente de `.nexa-squad/estandares.md`.

| Revisión | Qué buscas |
|---|---|
| Tarea | ¿El perfil principal completa su tarea frecuente sin pasos de más, sin buscar el botón y sin perder datos? |
| Estructura | Orden, agrupación, condicionales y patrón de la vista (cabecera, herramientas, datos, pie). |
| Composición | Anchos, jerarquía, espacio, alineación, botones que se parten, cómo queda en teléfono, tablet y escritorio. |
| Estados | Carga, vacío, error, deshabilitado y foco visible. |
| Accesibilidad mínima | Etiquetas de campos, contraste, teclado, áreas táctiles. |

## 4. Gravedad y corregir-ahora

- Bloqueante: impide la tarea o rompe una regla de negocio o de permisos.
- Importante: funciona, pero estorba una tarea.
- Menor: detalle sin impacto en el uso.

`corregir-ahora` = bloqueantes + importantes que estorban la tarea frecuente del perfil principal. El resto va a la lista de pulido. Mejor 5 hallazgos con evidencia que 17 con detalles de píxeles.

## 5. Tabla de tareas

Cada hallazgo `corregir-ahora` es una fila de la tabla de tareas de la bitácora (sección 8):

| id | hallazgo | dónde (archivo:línea) | dueño | estado | evidencia |
|---|---|---|---|---|---|
| T-01 | El botón Guardar se parte en dos líneas a 390 px | `Clientes.vue:142` | Kompa | pendiente | detector: overflow; vista a 390 px |

No escribas además un documento largo: `docs/revision/<modulo>-diagnostico.md` lleva el resumen, la tabla y la lista de pulido.
