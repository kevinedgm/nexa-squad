// Versión para Kiro: las skills van en .kiro/skills/ y se usan desde el agente por defecto, en la conversación.
// No hay agentes personalizados ni subagentes. El steering always es corto (~1 KB): lo always se paga en cada turno.

export function steeringKiro(squad, roles) {
  return [
    '---',
    'inclusion: always',
    '---',
    '',
    `# ${squad.name}`,
    '',
    `Skills: ${roles.map((r) => '`' + r + '`').join(', ')}. Corren en esta conversación y editan el código directamente.`,
    '- `kompa`: componer o corregir una pantalla (alineación, separadores, ayudas, contraste, semántica, integración).',
    '- `forja`: construir o cambiar comportamiento (datos, API, permisos, lógica).',
    '- `inqa`: reglas de un módulo nuevo, antes de programar.',
    `El alcance lo pone la petición: un cambio concreto se hace sin diagnóstico ni preguntas. Reglas comunes: \`.${squad.slug}/politica.md\` (léelas solo si dudas).`,
    '',
  ].join('\n');
}

// Restos de la versión con orquestador y subagentes (0.x). No se borran solos: el instalador los avisa.
export const OBSOLETOS_KIRO = [
  '.kiro/agents/orka.md', '.kiro/agents/inqa-agent.md', '.kiro/agents/arko-agent.md', '.kiro/agents/fluxa-agent.md',
  '.kiro/agents/kompa-agent.md', '.kiro/agents/kura-agent.md', '.kiro/agents/forja-agent.md', '.kiro/agents/vera-agent.md',
  '.kiro/hooks/nexa-squad-radiografia.json', '.kiro/steering/nexa-squad-contexto.md',
  '.kiro/skills/orka', '.kiro/skills/arko', '.kiro/skills/fluxa', '.kiro/skills/kura', '.kiro/skills/vera',
];
