#!/usr/bin/env node
// Instalador del squad. Sin dependencias. Node >= 16.
//
//   npx github:<repo> install --target claude
//   npx github:<repo> list
//
// Destinos (solo skills; corren en la conversación, sin subagentes):
//   claude  skills -> .claude/skills/<skill>/   + bloque en CLAUDE.md que importa .<slug>/politica.md
//   codex   skills -> .codex/skills/<skill>/    + bloque en AGENTS.md
//   kiro    skills -> .kiro/skills/<skill>/     + .kiro/steering/<slug>.md (inclusión always, ~1 KB)
//
// Opciones:
//   --target <env>  claude | codex | kiro   (por defecto: autodetecta, si no claude)
//   --global        instala en el home del usuario en lugar del proyecto
//   --dest <dir>    raíz del proyecto destino (por defecto: directorio actual)
//   --only <roles>  lista separada por comas, p. ej. kompa
//   --force         sobrescribe lo que ya exista
//   --dry-run       muestra lo que haría sin cambiar nada
//
//   update          como install, pero renueva lo que es del squad (skills, política) y respeta lo
//                   tuyo (docs/). Con --dry-run dice qué es nuevo, qué cambia, qué queda igual y qué
//                   quedó obsoleto de una instalación anterior (agentes y hooks de la versión 0.x).

import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve, relative } from 'node:path';
import { homedir } from 'node:os';
import { OBSOLETOS_KIRO, steeringKiro } from './kiro.mjs';

const PKG_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SQUAD = JSON.parse(readFileSync(join(PKG_ROOT, 'squad.json'), 'utf8'));
const TARGETS = ['claude', 'codex', 'kiro'];

const C = { reset: '\x1b[0m', bold: '\x1b[1m', dim: '\x1b[2m', green: '\x1b[32m', yellow: '\x1b[33m', red: '\x1b[31m', cyan: '\x1b[36m' };
const log = (...a) => console.log(...a);
const ok = (s) => `${C.green}${s}${C.reset}`;
const warn = (s) => `${C.yellow}${s}${C.reset}`;
const err = (s) => `${C.red}${s}${C.reset}`;

function parseArgs(argv) {
  const args = { _: [], target: null, global: false, force: false, dryRun: false, update: false, dest: null, only: null };
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
${C.bold}${SQUAD.name}${C.reset} — ${SQUAD.roles.map((r) => r.skill).join(' · ')}

${C.bold}Comandos${C.reset}
  install        Copia el squad en un proyecto (o --global)
  update         Renueva lo del squad sin tocar lo tuyo; con --dry-run muestra qué cambiaría
  list           Muestra los roles y dónde se instala cada uno
  init           Crea docs/producto.md para describir el producto y sus roles (opcional)
  help           Muestra esta ayuda

${C.bold}Opciones${C.reset}
  --target <env>   claude | codex | kiro   (por defecto: autodetecta, si no claude)
  --global         Instala en el home del usuario
  --dest <dir>     Raíz del proyecto destino (por defecto: directorio actual)
  --only <roles>   Lista separada por comas, p. ej. kompa,forja
  --force          Sobrescribe lo que ya exista
  --dry-run        Muestra lo que haría sin cambiar nada

${C.bold}Ejemplos${C.reset}
  npx github:${SQUAD.repo} install --target claude
  npx github:${SQUAD.repo} install --target kiro --only kompa
  npx github:${SQUAD.repo} update --target kiro --dry-run
  npx github:${SQUAD.repo} list
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
  return join(base, '.kiro', 'skills');
}

// ---- Comparación para update: nuevo, cambia o igual ----
function listFiles(p) {
  if (!existsSync(p)) return [];
  if (!statSync(p).isDirectory()) return [''];
  const out = [];
  for (const e of readdirSync(p)) for (const f of listFiles(join(p, e))) out.push(f ? join(e, f) : e);
  return out;
}
function sameTree(src, dest) {
  const a = listFiles(src).sort(), b = listFiles(dest).sort();
  if (a.length !== b.length || a.some((f, i) => f !== b[i])) return false;
  return a.every((f) => readFileSync(join(src, f)).equals(readFileSync(join(dest, f))));
}
function estado(existe, igual) { return !existe ? 'nuevo' : igual ? 'igual' : 'cambia'; }
const tally = { nuevo: 0, cambia: 0, igual: 0, omitido: 0, obsoleto: 0 };
function report(kind, label, rel, dryRun) {
  tally[kind]++;
  const verb = { nuevo: dryRun ? 'nuevo' : 'ok', cambia: dryRun ? 'cambia' : 'renovado', igual: 'igual', omitido: 'omitido', obsoleto: 'obsoleto' }[kind];
  const color = kind === 'igual' ? C.dim : kind === 'omitido' || kind === 'obsoleto' ? C.yellow : kind === 'cambia' ? C.cyan : C.green;
  log(`  ${color}${verb.padEnd(8)}${C.reset} ${label} ${C.dim}${rel}${C.reset}`);
}

function selectedRoles(args) {
  if (!args.only) return SQUAD.roles.slice();
  const names = args.only.split(',').map((s) => s.trim()).filter(Boolean);
  const pick = names.map((n) => SQUAD.roles.find((r) => r.skill === n));
  const unknown = names.filter((_, i) => !pick[i]);
  if (unknown.length) {
    log(err(`Rol desconocido: ${unknown.join(', ')}`));
    log(`Roles: ${SQUAD.roles.map((r) => r.skill).join(', ')}`);
    process.exit(2);
  }
  return [...new Set(pick)];
}

function copy(src, dest, args, label) {
  const rel = relative(args.base, dest) || dest;
  const existe = existsSync(dest);
  const kind = estado(existe, existe && sameTree(src, dest));
  if (kind === 'igual') { report('igual', label, rel, args.dryRun); return; }
  if (kind === 'cambia' && !args.force && !args.update) { report('omitido', `${label} — ya existe (usa update o --force)`, rel, args.dryRun); return; }
  if (!args.dryRun) { mkdirSync(dirname(dest), { recursive: true }); cpSync(src, dest, { recursive: true, force: true }); }
  report(kind, label, rel, args.dryRun);
}

// Igual que copy, pero con contenido generado (steering de Kiro).
function writeGenerated(dest, content, args, label) {
  const rel = relative(args.base, dest);
  const existe = existsSync(dest);
  const kind = estado(existe, existe && readFileSync(dest, 'utf8') === content);
  if (kind === 'igual') { report('igual', label, rel, args.dryRun); return; }
  if (kind === 'cambia' && !args.force && !args.update) { report('omitido', `${label} — ya existe (usa update o --force)`, rel, args.dryRun); return; }
  if (!args.dryRun) { mkdirSync(dirname(dest), { recursive: true }); writeFileSync(dest, content); }
  report(kind, label, rel, args.dryRun);
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
  const dir = join(args.base, `.${SQUAD.slug}`);
  const own = { force: true };
  const files = [['AGENTS.md', 'politica.md'], [join('estandares', 'estandares.md'), 'estandares.md'],
    [join('docs', 'nexa-y-fruti.md'), 'nexa-y-fruti.md']];
  // La política, los estándares y la guía son del squad: siempre se renuevan.
  for (const [src, name] of files) copy(join(PKG_ROOT, src), join(dir, name), { ...args, ...own }, name);
  return join(dir, 'politica.md');
}

// Restos de la versión 0.x (orquestador, subagentes, hooks, scripts). No se borran: se avisan.
const OBSOLETOS_PROYECTO = ['.nexa-squad/comandos.md', '.nexa-squad/radiografia.mjs', '.nexa-squad/verificar.mjs', '.nexa-squad/ejecucion.json', '.nexa-squad/agents'];
const OBSOLETOS_CLAUDE = ['orka', 'arko', 'fluxa', 'kura', 'vera'].map((r) => `.claude/skills/${r}`)
  .concat(['inqa', 'arko', 'fluxa', 'kompa', 'kura', 'forja', 'vera'].map((r) => `.claude/agents/${r}-agent.md`));
const OBSOLETOS_CODEX = ['orka', 'arko', 'fluxa', 'kura', 'vera'].map((r) => `.codex/skills/${r}`);
function reportObsolete(args, target) {
  const lista = [...OBSOLETOS_PROYECTO, ...({ claude: OBSOLETOS_CLAUDE, codex: OBSOLETOS_CODEX, kiro: OBSOLETOS_KIRO }[target])];
  for (const rel of lista) if (existsSync(join(args.base, rel))) report('obsoleto', 'de la versión 0.x (ya no se usa; bórralo a mano)', rel, args.dryRun);
}

function instructionLines(roles) {
  return [
    `## ${SQUAD.name}`,
    '',
    `@.${SQUAD.slug}/politica.md`,
    '',
    `Skills instaladas: ${roles.map((r) => '`' + r.skill + '`').join(', ')}. Corren en la conversación y editan el código directamente.`,
  ];
}

function doInstall(args) {
  args.base = args.global ? homedir() : resolve(args.dest || process.cwd());
  const target = args.target || autodetectTarget(args.base);
  if (!TARGETS.includes(target)) { log(err(`Destino desconocido: ${target}`)); process.exit(2); }
  const roles = selectedRoles(args);
  if (target === 'kiro' && args.global) { log(err('Kiro: instala por proyecto.')); process.exit(2); }
  const modo = args.update ? 'update' : 'install';
  log(`\n${C.bold}${SQUAD.name}${C.reset} ${modo} → ${target}${args.global ? ' (global)' : ''}  ${C.dim}${args.base}${C.reset}${args.dryRun ? warn('   (dry-run: no se cambia nada)') : ''}\n`);

  const sroot = skillsRoot(target, args.base);
  for (const r of roles) copy(join(PKG_ROOT, 'skills', r.skill), join(sroot, r.skill), args, `skill ${r.skill}`);

  writePolicy(args);
  const lines = instructionLines(roles);
  if (target === 'claude') writeBlock(join(args.base, args.global ? join('.claude', 'CLAUDE.md') : 'CLAUDE.md'), lines, args);
  else if (target === 'codex') writeBlock(join(args.base, 'AGENTS.md'), lines, args);
  else writeGenerated(join(args.base, '.kiro', 'steering', `${SQUAD.slug}.md`), steeringKiro(SQUAD, roles.map((r) => r.skill)), args, 'steering');
  reportObsolete(args, target);

  log(`\n  ${tally.nuevo} nuevo · ${tally.cambia} ${args.dryRun ? 'cambiaría' : 'renovado'} · ${tally.igual} igual · ${tally.omitido} omitido · ${tally.obsoleto} obsoleto`);
  if (args.dryRun) { log(`\n${warn('Dry-run:')} no se cambió nada. Quita --dry-run para aplicarlo.\n`); return; }
  if (tally.omitido) log(`  ${C.dim}Lo omitido ya existía con otro contenido: usa ${C.bold}update${C.reset}${C.dim} para renovarlo.${C.reset}`);
  log(`\n${ok('Listo.')} Pide, por ejemplo: "usa kompa: agrega separadores al formulario de alta de paciente".\n`);
}

function doList() {
  log(`\n${C.bold}${SQUAD.name}${C.reset}\n`);
  for (const r of SQUAD.roles) log(`  ${C.bold}${r.skill.padEnd(8)}${C.reset}${C.dim}${r.decides}${C.reset}`);
  log(`\n  claude  .claude/skills/<skill>/   codex  .codex/skills/<skill>/   kiro  .kiro/skills/<skill>/\n`);
}

function doInit(args) {
  const base = resolve(args.dest || process.cwd());
  const dest = join(base, 'docs', 'producto.md');
  if (existsSync(dest) && !args.force) { log(warn(`  Ya existe ${relative(base, dest)}.`)); return; }
  const tpl = `---
producto: <nombre>
estado: borrador
perfiles: []
---
<!-- Opcional. Llénalo a mano o pide "usa inqa para describir el producto". -->

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
  log(`  ${ok('ok')}       ${relative(base, dest)}  ${C.dim}(opcional: llénalo a mano o con inqa)${C.reset}`);
}

const args = parseArgs(process.argv.slice(2));
const cmd = args._[0] || 'help';
if (cmd === 'install') doInstall(args);
else if (cmd === 'update') { args.update = true; doInstall(args); }
else if (cmd === 'list') doList();
else if (cmd === 'init') doInit(args);
else log(helpText());
