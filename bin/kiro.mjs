// Versión para Kiro: agentes personalizados (.kiro/agents/<nombre>.md) y steering (.kiro/steering/<slug>.md).
// Sigue la guía "Kiro — Agents, Skills & Steering":
//   - un agente por responsabilidad, con solo las herramientas que su rol necesita (menor privilegio);
//   - un agente personalizado no recibe steering solo: se le declara en resources (file://) y su skill con skill://;
//   - el orquestador delega con la herramienta subagent, limitada por availableAgents / trustedAgents;
//   - el steering always es corto (~1 KB) y NO incluye la política: lo always se paga en cada turno de Kiro,
//     también cuando no se trabaja con el squad;
//   - cada agente carga en resources, una sola vez: el steering del squad, la política, el mapa del proyecto
//     (docs/contexto/proyecto.md) y, solo los roles que lo usan, docs/producto.md. No carga todo .kiro/steering/
//     (ahí vive también el steering de otros squads, como Fruti).

// Herramientas y permisos por rol. Escritura: libre en la carpeta del documento del rol y en docs/contexto/
// (mapa compartido del código, regla 12); el resto pide permiso.
const LEER = ['date*', 'ls *', 'cat *', 'head *', 'tail *', 'grep *', 'rg *', 'find *', 'wc *', 'git status', 'git log*', 'git diff*', 'git show*'];
const PRUEBAS = ['npm test*', 'npm run *', 'node *', 'npx *', 'php *', 'composer *', 'vendor/bin/*', 'python3 *', 'pytest*', 'curl *'];
const PROHIBIDO = ['rm -rf *', 'sudo *', 'git push*', 'git reset --hard*', 'git clean*', 'git checkout -- *', 'mysql *', 'psql *', 'mongo*', 'redis-cli *'];

export const KIRO_ROLES = {
  orka: { tools: ['read', 'write', 'shell', 'subagent'], escribe: ['docs/**'], shell: LEER },
  'inqa-agent': { tools: ['read', 'write', 'shell'], escribe: ['docs/registro.md', 'docs/requisitos/**', 'docs/producto.md', 'docs/contexto/**'], shell: LEER },
  'arko-agent': { tools: ['read', 'write', 'shell'], escribe: ['docs/registro.md', 'docs/arquitectura/**', 'docs/implementacion/**', 'docs/contexto/**'], shell: LEER },
  'fluxa-agent': { tools: ['read', 'write', 'shell'], escribe: ['docs/registro.md', 'docs/estructura/**', 'docs/contexto/**'], shell: LEER },
  'kompa-agent': { tools: ['read', 'write', 'shell'], escribe: ['docs/registro.md', 'docs/composicion/**', 'docs/contexto/**'], shell: LEER },
  'kura-agent': { tools: ['read', 'write', 'shell'], escribe: ['docs/registro.md', 'docs/componentes/**', 'docs/contexto/**'], shell: LEER },
  'forja-agent': { tools: ['read', 'write', 'shell'], escribe: ['**'], shell: [...LEER, ...PRUEBAS] },
  'vera-agent': { tools: ['read', 'write', 'shell'], escribe: ['docs/registro.md', 'docs/revision/**', 'docs/contexto/**'], shell: [...LEER, ...PRUEBAS] },
};
// Roles cuya skill usa docs/producto.md (perfiles, tareas y frecuencia). Kura y Forja no lo usan.
export const USAN_PRODUCTO = ['orka', 'inqa-agent', 'arko-agent', 'fluxa-agent', 'kompa-agent', 'vera-agent'];

// Pueden correr sin pedir aprobación: los que solo escriben su documento. Forja no, porque escribe código.
const CONFIABLES = ['inqa-agent', 'arko-agent', 'fluxa-agent', 'kompa-agent', 'kura-agent', 'vera-agent'];

const q = (s) => JSON.stringify(s);
const lista = (xs) => `[${xs.map(q).join(', ')}]`;

// Separa el encabezado YAML de un archivo de agente y devuelve { description, body }.
export function partirAgente(txt) {
  const m = txt.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) return { description: '', body: txt };
  const d = (m[1].match(/^description:\s*(.*)$/m) || [])[1] || '';
  return { description: d.trim(), body: m[2].replace(/^\s+/, '') };
}

function permisos(spec) {
  const out = ['permissions:', '  rules:',
    '    - capability: fs_read', '      match: ["**"]', '      effect: allow',
    '    - capability: fs_write', `      match: ${lista(spec.escribe)}`, '      effect: allow',
    '    - capability: fs_write', `      match: ${lista(['.env*', '**/.env*', '.git/**'])}`, '      effect: deny'];
  if (spec.tools.includes('shell')) {
    out.push('    - capability: shell', `      match: ${lista(spec.shell)}`, '      effect: allow');
    out.push('    - capability: shell', `      match: ${lista(PROHIBIDO)}`, '      effect: deny');
  }
  return out;
}

// Contexto fijo de cada agente: lo que carga al arrancar, sin repetir nada.
export function recursos({ name, skill, slug, skillsRel }) {
  const r = [`file://.kiro/steering/${slug}.md`, `file://.${slug}/politica.md`, 'file://docs/contexto/proyecto.md'];
  if (USAN_PRODUCTO.includes(name)) r.push('file://docs/producto.md');
  if (name === 'orka') r.push(`file://.${slug}/comandos.md`);
  r.push(`skill://${skillsRel}/${skill}/SKILL.md`);
  return r;
}

// Definición de un agente de Kiro. `skillsRel` es la carpeta de skills relativa al proyecto.
export function agenteKiro({ name, skill, description, body, slug, skillsRel, agentes }) {
  const spec = KIRO_ROLES[name];
  const fm = ['---', `name: ${name}`, `description: ${q(description)}`, `tools: ${lista(spec.tools)}`,
    'resources:', ...recursos({ name, skill, slug, skillsRel }).map((r) => `  - ${r}`)];
  if (name === 'orka') {
    fm.push('toolsSettings:', '  subagent:', `    availableAgents: ${lista(agentes)}`, `    trustedAgents: ${lista(CONFIABLES.filter((a) => agentes.includes(a)))}`);
  }
  fm.push(...permisos(spec), '---', '');
  return fm.join('\n') + body.replace(/\s*$/, '\n');
}

// Cuerpo de Orka como agente de Kiro: el procedimiento vive en su skill; aquí van solo los límites.
export function cuerpoOrka(roles) {
  return [
    'Eres Orka, el orquestador de Nexa Squad. Sigue tu skill `orka` y la política (`.nexa-squad/politica.md`).',
    '',
    `- Lanza cada rol con la herramienta de subagentes, en el orden de la cadena: ${roles.join(', ')}. Uno a la vez, salvo en modo rápido: varios \`forja-agent\` al mismo tiempo (máximo 3) cuando sus filas tocan archivos distintos.`,
    '- No pidas aprobación entre pasos: solo esperas a Kevin ante algo irreversible (borrar o migrar datos, producción, otros módulos) o una regla de negocio sin confirmar.',
    '- Al corregir o extender usa el modo rápido de tu skill: el plan es la tabla de tareas de la bitácora (máximo 40 líneas), sin documentos de rol, y lanzas `forja-agent` sin esperar aprobación.',
    '- Si un rol está en `en-conversacion` de `.nexa-squad/ejecucion.json`, haz su trabajo aquí con su skill en lugar de lanzarlo.',
    '- Tú solo escribes en `docs/` (bitácora y estado de los documentos). El código lo escribe `forja-agent`.',
    '- Lo irreversible espera al punto de control 2, aunque un subagente lo proponga.',
    '',
  ].join('\n');
}

// Steering always y corto: solo cómo invocar el squad. La política llega a cada agente por resources.
export function steeringKiro(squad, roles) {
  return [
    '---',
    'inclusion: always',
    '---',
    '',
    `# ${squad.name}`,
    '',
    `Roles instalados: ${roles.map((r) => '`' + r + '`').join(', ')}. Para un módulo, usa el agente \`orka\`; para un solo rol, su skill.`,
    `Qué decir en cada caso: \`.${squad.slug}/comandos.md\`. Las reglas comunes están en \`.${squad.slug}/politica.md\`: cada agente del squad ya las carga; en otra conversación, léelas solo si vas a trabajar con el squad.`,
    '',
  ].join('\n');
}
