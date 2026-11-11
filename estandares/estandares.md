# Estándares de diseño de interfaces

Propósito: que ninguna decisión de estructura, composición o revisión salga del gusto. Cada regla que usen Kompa e Inqa se apoya en una fuente de este catálogo. Lo que no tiene fuente es **preferencia**, se marca como supuesto y nunca bloquea.

Lo usan: Kompa (composición, contenido e integración) e Inqa (reglas de negocio y dominio). Lo instala el instalador en `.nexa-squad/estandares.md`.

## Contenido

1. Orden de autoridad
2. Cómo citar
3. Catálogo de fuentes
4. Qué fuente respalda cada decisión frecuente
5. Dominio clínico y laboratorio
6. Cuando dos fuentes chocan
7. Límites

## 1. Orden de autoridad

De mayor a menor. La primera que defina la decisión manda.

| Nivel | Fuente | Ejemplo | ¿Se puede contradecir? |
|---|---|---|---|
| 1 | Norma obligatoria o regla aprobada del producto | WCAG 2.2 AA si el proyecto la adoptó, NOM aplicable, regla BR de Inqa | No |
| 2 | Sistema de diseño del proyecto | Contratos de componentes, tokens y guías de Fruti Squad (`.fruti/`, Design Hub) | Solo pidiendo el cambio a su dueño (Kompa → pedido a Fruti) |
| 3 | Sistema de diseño de referencia | GOV.UK Design System, Material Design 3, Apple HIG | Sí, si el nivel 2 decide otra cosa |
| 4 | Investigación y heurísticas | Nielsen, Baymard, Gestalt, Fitts, Hick | Sí, con motivo escrito |
| 5 | Preferencia | "Se ve mejor así" | Siempre; es supuesto, no regla |

## 2. Cómo citar

En los documentos del squad, cada decisión de estructura o composición lleva una columna **Fuente** con el identificador corto de la sección 3 y, si aplica, el criterio exacto.

- Bien: "Etiqueta visible arriba del campo · Fuente: WCAG 3.3.2; GOV.UK Text input".
- Bien: "Ancho máximo del formulario: token `form-max` · Fuente: Fruti (tokens)".
- Mal: "Etiqueta arriba porque es más limpio". Eso es preferencia.

Kompa, al calificar, solo clasifica como **error** lo que contradice una fuente de nivel 1 a 3 o un documento aprobado; lo de nivel 4 es error si el documento lo adoptó y sugerencia si no; lo de nivel 5 nunca es error.

## 3. Catálogo de fuentes

| Id | Fuente | Qué aporta | Nivel |
|---|---|---|---|
| WCAG | W3C, Web Content Accessibility Guidelines 2.2 | Criterios verificables de accesibilidad | 1 si el proyecto lo adopta; si no, 3 |
| WAI-ARIA APG | W3C, ARIA Authoring Practices Guide | Patrones de teclado y roles para combobox (autocomplete), diálogo, pestañas, tablas, disclosure | 3 |
| GOV.UK | GOV.UK Design System (componentes y patrones) | Patrones de formulario probados con usuarios: etiquetas, ayuda, errores, opcionales, "una cosa por página", fechas | 3 |
| M3 | Material Design 3 | Densidad, áreas táctiles, jerarquía de botones, campos de texto | 3 |
| HIG | Apple Human Interface Guidelines | Áreas táctiles, jerarquía, controles en móvil | 3 |
| NN | Nielsen Norman Group: 10 heurísticas de usabilidad y artículos de investigación | Heurísticas y hallazgos de estudios con usuarios | 4 |
| BAYMARD | Baymard Institute, investigación de usabilidad de formularios y checkout | Una columna, validación en línea, campos opcionales, etiquetas | 4 |
| WROB | Luke Wroblewski, *Web Form Design* | Etiquetas, agrupación, divulgación progresiva, acciones | 4 |
| GESTALT | Principios de Gestalt: proximidad, semejanza, región común, continuidad | Por qué el espacio y las superficies agrupan | 4 |
| FITTS | Ley de Fitts | Tamaño y distancia de objetivos | 4 |
| HICK | Ley de Hick-Hyman | Menos opciones visibles, decisiones más rápidas; base de la divulgación progresiva | 4 |
| ISO9241 | ISO 9241-110 (principios de interacción) e ISO 9241-11 (usabilidad) | Adecuación a la tarea, autodescripción, tolerancia a errores | 4 |
| RUI | Wathan y Schoger, *Refactoring UI* | Jerarquía por tamaño, peso y color; escalas de espacio; alineación a un borde | 4 |
| KRUG | Steve Krug, *Don't Make Me Think* | Escaneo, textos que dicen la consecuencia antes de hacer clic, verbo + objeto | 4 |
| NORMAN | Don Norman, *The Design of Everyday Things* | Mapeo entre control y efecto, modelos mentales, prevención de errores | 4 |

## 4. Qué fuente respalda cada decisión frecuente

Antes de decidir, busca la decisión aquí. Si aparece, cita la fuente; si el sistema del proyecto (nivel 2) dice otra cosa, manda el sistema.

| Decisión | Regla de base | Fuentes |
|---|---|---|
| Definir usuarios, tareas y contexto de uso antes de diseñar; cada vista optimiza para su perfil principal | La usabilidad se mide para usuarios, objetivos y contextos concretos | ISO9241 (9241-11); NN |
| Etiqueta siempre visible; el marcador no sustituye a la etiqueta | Las etiquetas o instrucciones están presentes cuando se pide un dato | WCAG 3.3.2; GOV.UK Text input; NN |
| Etiqueta arriba del campo | Lectura en una sola línea vertical; funciona igual en móvil | GOV.UK; WROB; BAYMARD |
| Una columna por defecto; en fila solo campos que son una unidad | Con varias columnas el orden de llenado se vuelve ambiguo | BAYMARD; GOV.UK; NN |
| Ancho del campo según el dato esperado | El ancho comunica cuánto se espera escribir | GOV.UK (anchos de campo); RUI; BAYMARD |
| Marcar el caso minoritario (opcional u obligatorio) y no solo con color | Evita adivinar qué es obligatorio | GOV.UK (marcar opcionales); BAYMARD; WCAG 1.4.1 |
| Ayuda antes de equivocarse; error junto al campo, con cómo corregirlo | Identificar el error y sugerir corrección | WCAG 3.3.1 y 3.3.3; GOV.UK Error message; NN |
| Resumen de errores al enviar | Llevar al campo con error | GOV.UK Error summary; WCAG 3.3.1 |
| Validar al salir del campo, no mientras se escribe | Evita errores prematuros | BAYMARD; NN |
| Divulgación progresiva (mostrar campos solo al activarlos) | Menos opciones visibles, menos carga | HICK; NN; GOV.UK Conditional reveal; WAI-ARIA APG Disclosure |
| Página única o pasos | Una cosa por página cuando las preguntas son independientes o dependen de la anterior | GOV.UK "One thing per page"; NN |
| Agrupar con espacio antes que con líneas o tarjetas | La proximidad agrupa; la región común delimita | GESTALT (proximidad, región común); RUI |
| Jerarquía por tamaño, peso y color, cambiando una o dos palancas | Contraste suficiente entre niveles | RUI; NN |
| Una acción principal por vista | Evita competencia entre acciones | M3 (jerarquía de botones); HIG; NN |
| Área táctil mínima | Objetivos fáciles de alcanzar | WCAG 2.5.8 (mínimo 24 × 24 px); M3 (48 dp); HIG (44 pt); FITTS |
| Contraste de texto y de controles | Legibilidad y percepción de límites | WCAG 1.4.3 (texto) y 1.4.11 (controles) |
| Nada esencial solo en una descripción emergente | Contenido al pasar el puntero debe ser accesible y descartable | WCAG 1.4.13; NN |
| Sin desplazamiento horizontal al angostar | El contenido se adapta | WCAG 1.4.10 (reflujo) |
| Autocomplete: teclado, anuncio de resultados | Patrón combobox | WAI-ARIA APG Combobox; WCAG 4.1.2 y 4.1.3 |
| Relaciones visibles también para lectores de pantalla (grupos, encabezados, tablas) | Información y relaciones | WCAG 1.3.1 |
| Confirmar lo irreversible; deshacer lo reversible | Prevención y tolerancia a errores | NN (heurísticas 3 y 5); ISO9241; NORMAN |
| Estados de carga, vacío, error y sin resultados con contenido propio | Visibilidad del estado del sistema | NN (heurística 1); ISO9241 |

## 5. Dominio clínico y laboratorio

Cuando el módulo maneja datos clínicos, la estructura sigue también los estándares del dominio. Estos definen **qué dato y en qué unidad**; no definen el aspecto.

| Id | Fuente | Para qué | Quién lo aplica |
|---|---|---|---|
| CIE-10 | Clasificación Internacional de Enfermedades, 10.ª revisión (OMS) | Catálogo de diagnósticos: código y nombre | Inqa (regla), Kompa (el diagnóstico se elige del catálogo, no se escribe libre) |
| UCUM | Unified Code for Units of Measure | Unidades de medida (mmHg, /min, Cel, %, kg, cm) | Inqa y Forja (dato), Kompa (la unidad visible junto al campo) |
| LOINC | Códigos de observaciones y estudios de laboratorio | Identificar cada signo vital o estudio | Forja (dato) |
| FHIR | HL7 FHIR, perfil de signos vitales | Qué observaciones forman los signos vitales y con qué unidad | Inqa y Forja |
| NOM | Normas Oficiales Mexicanas aplicables al expediente clínico y a los sistemas de registro electrónico para la salud (p. ej. NOM-004-SSA3 y NOM-024-SSA3) | Obligaciones del expediente y del registro electrónico | Inqa (son nivel 1 si aplican al proyecto) |

Reglas:

- Los rangos de referencia clínicos **no** salen de este catálogo ni de la memoria del modelo: los define Inqa con la fuente que confirme Kevin (laboratorio, guía clínica). Mientras no estén confirmados, son pregunta.
- Si una NOM aplica, Inqa la cita como regla (nivel 1) en los requisitos; la confirma Kevin, porque decidir si una norma aplica al proyecto es decisión de negocio.

## 6. Cuando dos fuentes chocan

1. Manda el nivel más alto (sección 1).
2. En el mismo nivel, manda la más específica para el caso (un patrón de GOV.UK para formularios gana a una guía general de M3 para formularios).
3. Si siguen empatadas, se elige una, se escribe el motivo y se sigue igual en todo el módulo (consistencia, NN heurística 4).

Tensiones frecuentes entre heurísticas (nivel 4) y hacia dónde inclinarse. Los factores salen de Inqa (quién usa, cuánto, qué cuesta un error); si no están, son pregunta.

| Tensión | Inclinarse a lo primero si… | Inclinarse a lo segundo si… | Patrón que concilia |
|---|---|---|---|
| Simplicidad / potencia | Uso ocasional, personas nuevas, presión de tiempo | Uso diario por personal experto (captura clínica frecuente) | Divulgación progresiva; valores por defecto |
| Consistencia / optimizar para el contexto | Muchos tipos de usuario, acción común | Acción rara y un solo perfil de usuario | Mismo patrón, distinto énfasis |
| Prevención de errores / eficiencia | Irreversible o costoso (datos clínicos, dinero) | Reversible y muy frecuente | Deshacer en lugar de confirmar; fricción solo en lo riesgoso |
| Descubrir / interfaz limpia | Funciones centrales, principiantes | Casos raros, expertos, poco espacio | Lo principal visible, lo secundario en menú |

4. Si la regla del sistema del proyecto (nivel 2) contradice una norma obligatoria (nivel 1), no se compone en contra de la norma: Kompa lo reporta y escribe el pedido a Fruti Squad.

## 7. Límites

Este catálogo dice **qué fuente respalda una decisión**. No sustituye a las referencias de Kompa, que explican cómo aplicarla, y no autoriza a reconstruir de memoria el texto de una norma: si se necesita el criterio exacto y no está aquí, se cita la fuente y se marca "por verificar".
