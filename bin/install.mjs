#!/usr/bin/env node
// Instalador del squad. Sin dependencias. Node >= 16.
//
//   npx github:<repo> install --target claude
//   npx github:<repo> list
//
// Destinos:
//   claude  skills -> .claude/skills/<skill>/   subagentes -> .claude/agents/<rol>.md
//           + bloque en CLAUDE.md que importa .<slug>/politica.md
//   codex   skills -> .codex/skills/<skill>/    + ajustes de rol en .<slug>/agents/ + bloque en AGENTS.md
//   kiro    skills -> .agents/skills/<skill>/   + ajustes de rol en .<slug>/agents/ + .kiro/steering/<slug>.md
//
// Opciones:
//   --target <env>  claude | codex | kiro   (por defecto: autodetecta, si no claude)
//   --global        instala en el home del usuario en lugar del proyecto
//   --dest <dir>    raíz del proyecto destino (por defecto: directorio actual)
//   --only <roles>  lista separada por comas (skill o subagente); Orka (orka)
//                   se instala siempre que haya más de un rol
//   --force         sobrescribe lo que ya exista
//   --dry-run       muestra lo que haría sin cambiar nada

import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve, relative } from 'node:path';
import { homedir } from 'node:os';

const PKG_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SQUAD = JSON.parse(readFileSync(join(PKG_ROOT, 'squad.json'), 'utf8'));
const TARGETS = ['claude', 'codex', 'kiro'];

const C = { reset: '\x1b[0m', bold: '\x1b[1m', dim: '\x1b[2m', green: '\x1b[32m', yellow: '\x1b[33m', red: '\x1b[31m', cyan: '\x1b[36m' };
const log = (...a) => console.log(...a);
const ok = (s) => `${C.green}${s}${C.reset}`;
const warn = (s) => `${C.yellow}${s}${C.reset}`;
const err = (s) => `${C.red}${s}${C.reset}`;

function parseArgs(argv) {
  const args = { _: [], target: null, global: false, force: false, dryRun: false, dest: null, only: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--global') args.global = true;
    else if (a === '--force') args.force = true;
    else if (a === '--dry-run') args.dryRun = true;
    else if (a === '--target') args.target = argv[++i];
    else if (a === '--dest') args.dest = argv[++i];
    else if (a === '--only') args.only = argv[++i];
    else if (a === '-h' || a === '--help') args._.push('help');
    else args._.push(a);
  }
  return args;
}

function helpText() {
  return `
${C.bold}${SQUAD.name}${C.reset} — ${SQUAD.roles.map((r) => r.skill).join(' → ')}

${C.bold}Comandos${C.reset}
  install        Copia el squad en un proyecto (o --global)
  list           Muestra los roles y dónde se instala cada uno
  init           Crea docs/producto.md para describir el producto y sus roles
  comandos       Guía: qué decir y a quién invocar según lo que quieras
  quien "<frase>" Sugiere el comando para lo que describes
  help           Muestra esta ayuda

${C.bold}Opciones${C.reset}
  --target <env>   claude | codex | kiro   (por defecto: autodetecta, si no claude)
  --global         Instala en el home del usuario
  --dest <dir>     Raíz del proyecto destino (por defecto: directorio actual)
  --only <roles>   Lista separada por comas, p. ej. inqa,vera
  --force          Sobrescribe lo que ya exista
  --dry-run        Muestra lo que haría sin cambiar nada

${C.bold}Ejemplos${C.reset}
  npx github:${SQUAD.repo} install --target claude
  npx github:${SQUAD.repo} install --target claude --only inqa
  npx github:${SQUAD.repo} list
  npx github:${SQUAD.repo} quien "el formulario de cuentas se ve mal"
`;
}

function autodetectTarget(base) {
  const has = (p) => existsSync(join(base, p));
  if (has('.claude')) return 'claude';
  if (has('.codex')) return 'codex';
  if (has('.kiro') || has('.agents')) return 'kiro';
  return 'claude';
}

function skillsRoot(target, base) {
  if (target === 'claude') return join(base, '.claude', 'skills');
  if (target === 'codex') return join(base, '.codex', 'skills');
  return join(base, '.agents', 'skills');
}

function selectedRoles(args) {
  if (!args.only) return SQUAD.roles.slice();
  const names = args.only.split(',').map((s) => s.trim()).filter(Boolean);
  const pick = names.map((n) => SQUAD.roles.find((r) => r.skill === n || r.agent === n));
  const unknown = names.filter((_, i) => !pick[i]);
  if (unknown.length) {
    log(err(`Rol desconocido: ${unknown.join(', ')}`));
    log(`Roles: ${SQUAD.roles.map((r) => r.skill).join(', ')}`);
    process.exit(2);
  }
  // Una cadena de varios roles necesita a Orka.
  if (pick.length > 1 && !pick.some((r) => r.order === 0)) pick.unshift(SQUAD.roles[0]);
  return [...new Set(pick)].sort((a, b) => a.order - b.order);
}

function copy(src, dest, args, label) {
  const rel = relative(args.base, dest) || dest;
  if (existsSync(dest) && !args.force) { log(`  ${warn('omitido')} ${label} — ya existe (usa --force) ${C.dim}${rel}${C.reset}`); return false; }
  if (args.dryRun) { log(`  ${C.cyan}copiaría${C.reset} ${label} → ${C.dim}${rel}${C.reset}`); return true; }
  mkdirSync(dirname(dest), { recursive: true });
  cpSync(src, dest, { recursive: true, force: true });
  log(`  ${ok('ok')}       ${label} → ${C.dim}${rel}${C.reset}`);
  return true;
}

// Escribe o renueva un bloque delimitado en un archivo de instrucciones, sin tocar lo demás.
function writeBlock(file, lines, args) {
  const start = `<!-- ${SQUAD.slug}:start -->`;
  const end = `<!-- ${SQUAD.slug}:end -->`;
  const block = [start, ...lines, end].join('\n');
  const rel = relative(args.base, file);
  if (args.dryRun) { log(`  ${C.cyan}actualizaría${C.reset} ${rel} ${C.dim}(bloque ${SQUAD.slug})${C.reset}`); return; }
  let content = existsSync(file) ? readFileSync(file, 'utf8') : '';
  const re = new RegExp(`${start}[\\s\\S]*?${end}`);
  content = re.test(content) ? content.replace(re, block) : (content ? content.replace(/\s*$/, '\n\n') : '') + block + '\n';
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content);
  log(`  ${ok('ok')}       ${rel} ${C.dim}(bloque ${SQUAD.slug})${C.reset}`);
}

function writePolicy(args) {
  const dest = join(args.base, `.${SQUAD.slug}`, 'politica.md');
  if (args.dryRun) { log(`  ${C.cyan}copiaría${C.reset} política, estándares y comandos → ${C.dim}${relative(args.base, dirname(dest))}/${C.reset}`); return dest; }
  mkdirSync(dirname(dest), { recursive: true });
  cpSync(join(PKG_ROOT, 'AGENTS.md'), dest, { force: true });
  cpSync(join(PKG_ROOT, 'estandares', 'estandares.md'), join(dirname(dest), 'estandares.md'), { force: true });
  cpSync(join(PKG_ROOT, 'comandos', 'comandos.md'), join(dirname(dest), 'comandos.md'), { force: true });
  log(`  ${ok('ok')}       política, estándares y comandos → ${C.dim}${relative(args.base, dirname(dest))}/${C.reset}`);
  return dest;
}

function instructionLines(roles, target) {
  const withAgents = target === 'claude';
  return [
    `## ${SQUAD.name}`,
    '',
    `@.${SQUAD.slug}/politica.md`,
    '',
    `Roles instalados: ${roles.map((r) => '`' + r.skill + '`').join(', ')}.`,
    withAgents
      ? 'En cadena, Orka lanza cada rol como subagente (`.claude/agents/<rol>-agent.md`). Solos, se usan como skills.'
      : 'Este entorno no tiene subagentes: Orka ejecuta cada rol en la conversación, uno a la vez (ver la política).',
  ];
}

function doInstall(args) {
  args.base = args.global ? homedir() : resolve(args.dest || process.cwd());
  const target = args.target || autodetectTarget(args.base);
  if (!TARGETS.includes(target)) { log(err(`Destino desconocido: ${target}`)); process.exit(2); }
  const roles = selectedRoles(args);
  log(`\n${C.bold}${SQUAD.name}${C.reset} → ${target}${args.global ? ' (global)' : ''}  ${C.dim}${args.base}${C.reset}${args.dryRun ? warn('   (dry-run)') : ''}\n`);

  const sroot = skillsRoot(target, args.base);
  for (const r of roles) {
    copy(join(PKG_ROOT, 'skills', r.skill), join(sroot, r.skill), args, `skill ${r.skill}`);
    if (r.agent) {
      // Claude Code los usa como subagentes; en Codex y Kiro quedan como ajustes que Orka aplica en la conversación.
      const agentDir = target === 'claude' ? join(args.base, '.claude', 'agents') : join(args.base, `.${SQUAD.slug}`, 'agents');
      copy(join(PKG_ROOT, 'agents', `${r.agent}.md`), join(agentDir, `${r.agent}.md`), args, target === 'claude' ? `subagente ${r.agent}` : `ajustes ${r.agent}`);
    }
  }

  writePolicy(args);
  const lines = instructionLines(roles, target);
  if (target === 'claude') writeBlock(join(args.base, args.global ? join('.claude', 'CLAUDE.md') : 'CLAUDE.md'), lines, args);
  else if (target === 'codex') writeBlock(join(args.base, 'AGENTS.md'), lines, args);
  else writeBlock(join(args.base, '.kiro', 'steering', `${SQUAD.slug}.md`), lines, args);

  log(`\n${ok('Listo.')} ${target === 'claude' ? 'Empieza con: /orka init  (describe el producto y sus roles)  ·  o un rol suelto: "usa inqa para analizar…"' : 'Pide: "usa orka para migrar el módulo <nombre>".'}\n`);
}

function doList() {
  log(`\n${C.bold}${SQUAD.name}${C.reset}\n`);
  for (const r of SQUAD.roles) {
    log(`  ${String(r.order).padStart(2)}  ${C.bold}${r.skill.padEnd(24)}${C.reset}${(r.agent || '(solo skill)').padEnd(18)}${C.dim}${r.decides}${C.reset}`);
  }
  log(`\n  claude  skills → .claude/skills/<skill>/   subagentes → .claude/agents/<rol>.md`);
  log(`  codex   skills → .codex/skills/<skill>/    (sin subagentes)`);
  log(`  kiro    skills → .agents/skills/<skill>/   (sin subagentes)\n`);
}

async function doQuien(frase) {
  const { quien, DATA } = await import('./comandos.mjs');
  if (!frase) { log(err('Escribe lo que quieres, p. ej.: quien "el formulario de cuentas se ve mal"')); process.exit(2); }
  const r = quien(frase);
  if (!r.length) {
    log(`\n  No lo reconocí. Empieza con ${C.bold}/orka${C.reset} y descríbelo con tus palabras: Orka elige el escenario.`);
    log(`  Guía completa: ${C.bold}npx github:${SQUAD.repo} comandos${C.reset}\n`);
    return;
  }
  const [best, ...rest] = r;
  const c = best.c;
  log(`\n  ${C.bold}${c.quiero}${C.reset}`);
  log(`  Di:        ${C.cyan}${c.decir}${C.reset}`);
  log(`  Ejemplo:   ${C.dim}${c.ejemplo}${C.reset}`);
  log(`  Invoca:    ${c.invoca}  ·  arranca en ${c.arranca}`);
  log(`  Qué pasa:  ${c.que_pasa}`);
  const alt = rest.filter((x) => x.score >= best.score - 1).slice(0, 2);
  if (alt.length) log(`\n  ${C.dim}También podría ser: ${alt.map((x) => `${x.c.id} (${x.c.decir})`).join('  ·  ')}${C.reset}`);
  if (DATA.comandos.length) log('');
}

function doInit(args) {
  const base = resolve(args.dest || process.cwd());
  const dest = join(base, 'docs', 'producto.md');
  if (existsSync(dest) && !args.force) { log(warn(`  Ya existe ${relative(base, dest)}. Ábrelo o di /orka init para actualizarlo.`)); return; }
  const tpl = `---
producto: <nombre>
estado: borrador
perfiles: []
---
<!-- Llénalo con /orka init o a mano, con tus palabras. Inqa lo ordena y tú lo apruebas. -->

## 1. El producto
- Qué es y qué produce:
- A quién se dirige:
- Vocabulario del negocio:

## 2. Roles (quién usa el sistema)
- <Rol>: qué hace y qué tan seguido.

## 3. Quién revisa a quién
- <Rol> revisa / aprueba lo que hace <otro rol>.

## 4. Módulos y quién los usa
| Módulo | Lo usa | Qué hace ahí |
|---|---|---|
`;
  if (args.dryRun) { log(`  ${C.cyan}crearía${C.reset} ${relative(base, dest)}`); return; }
  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, tpl);
  log(`  ${ok('ok')}       ${relative(base, dest)}  ${C.dim}(llénalo, o abre Claude Code y di /orka init)${C.reset}`);
}

async function doComandos() {
  const { renderMd } = await import('./comandos.mjs');
  log(renderMd());
}

const args = parseArgs(process.argv.slice(2));
const cmd = args._[0] || 'help';
if (cmd === 'install') doInstall(args);
else if (cmd === 'list') doList();
else if (cmd === 'init') doInit(args);
else if (cmd === 'comandos') await doComandos();
else if (cmd === 'quien' || cmd === 'quién') await doQuien(args._.slice(1).join(' '));
else log(helpText());
