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
//   kiro    skills -> .kiro/skills/<skill>/     agentes -> .kiro/agents/<rol>.md (con permisos)
//           + .kiro/steering/<slug>.md (inclusión always, ~1 KB; la política llega a cada agente por resources)
//
// Opciones:
//   --target <env>  claude | codex | kiro   (por defecto: autodetecta, si no claude)
//   --global        instala en el home del usuario en lugar del proyecto
//   --dest <dir>    raíz del proyecto destino (por defecto: directorio actual)
//   --only <roles>  lista separada por comas (skill o subagente); Orka (orka)
//                   se instala siempre que haya más de un rol
//   --force         sobrescribe lo que ya exista
//   --dry-run       muestra lo que haría sin cambiar nada
//
//   update          como install, pero renueva lo que es del squad (skills, agentes, política) y
//                   respeta lo tuyo (ejecucion.json, docs/). Con --dry-run dice qué es nuevo, qué
//                   cambia, qué queda igual y qué quedó obsoleto de una instalación anterior.

import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve, relative } from 'node:path';
import { homedir } from 'node:os';
import { agenteKiro, cuerpoOrka, partirAgente, recursos, steeringKiro } from './kiro.mjs';

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
${C.bold}${SQUAD.name}${C.reset} — ${SQUAD.roles.map((r) => r.skill).join(' → ')}

${C.bold}Comandos${C.reset}
  install        Copia el squad en un proyecto (o --global)
  update         Renueva lo del squad sin tocar lo tuyo; con --dry-run muestra qué cambiaría
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
  npx github:${SQUAD.repo} update --target kiro --dry-run
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
  const existe = existsSync(dest);
  const kind = estado(existe, existe && sameTree(src, dest));
  if (kind === 'igual') { report('igual', label, rel, args.dryRun); return; }
  if (kind === 'cambia' && !args.force && !args.update) { report('omitido', `${label} — ya existe (usa update o --force)`, rel, args.dryRun); return; }
  if (!args.dryRun) { mkdirSync(dirname(dest), { recursive: true }); cpSync(src, dest, { recursive: true, force: true }); }
  report(kind, label, rel, args.dryRun);
}

// Igual que copy, pero con contenido generado (agentes y steering de Kiro).
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
    [join('comandos', 'comandos.md'), 'comandos.md'], [join('docs', 'nexa-y-fruti.md'), 'nexa-y-fruti.md']];
  // La política, los estándares y la guía son del squad: siempre se renuevan.
  for (const [src, name] of files) copy(join(PKG_ROOT, src), join(dir, name), { ...args, ...own }, name);
  return join(dir, 'politica.md');
}

// Restos de una instalación anterior que el squad ya no usa. No se borran: se avisan.
function reportObsolete(args, target, roles) {
  if (target !== 'kiro') return;
  const ctx = join(args.base, '.kiro', 'steering', `${SQUAD.slug}-contexto.md`);
  if (existsSync(ctx)) report('obsoleto', 'steering de contexto (producto y mapa ahora van en resources de cada agente; bórralo a mano)', relative(args.base, ctx), args.dryRun);
  for (const r of roles) {
    const old = join(args.base, '.agents', 'skills', r.skill);
    if (existsSync(join(old, 'SKILL.md')) && readFileSync(join(old, 'SKILL.md'), 'utf8').includes(`name: ${r.skill}`))
      report('obsoleto', `skill ${r.skill} (ahora vive en .kiro/skills; bórralo a mano)`, relative(args.base, old), args.dryRun);
    if (r.agent) {
      const adj = join(args.base, `.${SQUAD.slug}`, 'agents', `${r.agent}.md`);
      if (existsSync(adj)) report('obsoleto', `ajustes ${r.agent} (ahora es un agente de Kiro; bórralo a mano)`, relative(args.base, adj), args.dryRun);
    }
  }
}

function writeKiro(args, roles) {
  const skillsRel = '.kiro/skills';
  const agentes = roles.filter((r) => r.agent).map((r) => r.agent);
  for (const r of roles) {
    if (r.agent) {
      const { description, body } = partirAgente(readFileSync(join(PKG_ROOT, 'agents', `${r.agent}.md`), 'utf8'));
      writeGenerated(join(args.base, '.kiro', 'agents', `${r.agent}.md`),
        agenteKiro({ name: r.agent, skill: r.skill, description, body, slug: SQUAD.slug, skillsRel, agentes }), args, `agente ${r.agent}`);
    } else if (r.order === 0 && agentes.length) {
      writeGenerated(join(args.base, '.kiro', 'agents', 'orka.md'),
        agenteKiro({ name: 'orka', skill: r.skill, description: r.title + ': dirige la cadena de Nexa Squad para un módulo y lanza a cada rol como subagente.', body: cuerpoOrka(agentes), slug: SQUAD.slug, skillsRel, agentes }), args, 'agente orka');
    }
  }
  writeGenerated(join(args.base, '.kiro', 'steering', `${SQUAD.slug}.md`), steeringKiro(SQUAD, roles.map((r) => r.skill)), args, 'steering');
  contextoFijo(args, roles, skillsRel);
}

// Cuánto contexto fijo carga cada agente al arrancar (resources que existen en el proyecto), para medir el cambio.
function contextoFijo(args, roles, skillsRel) {
  const kb = (rel) => { const f = join(args.base, rel); return existsSync(f) ? statSync(f).size / 1024 : 0; };
  const filas = roles.filter((r) => r.agent || r.order === 0).map((r) => {
    const name = r.agent || 'orka';
    const total = recursos({ name, skill: r.skill, slug: SQUAD.slug, skillsRel })
      .map((x) => x.replace(/^(file|skill):\/\//, '')).reduce((t, rel) => t + kb(rel), 0);
    return `${name} ${total.toFixed(1)} KB`;
  });
  log(`\n  ${C.dim}Contexto fijo por agente (resources que ya existen): ${filas.join(' · ')}${C.reset}`);
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
  if (target === 'kiro' && args.global) { log(err('Kiro: instala por proyecto (los agentes leen .nexa-squad/ del proyecto).')); process.exit(2); }
  const modo = args.update ? 'update' : 'install';
  log(`\n${C.bold}${SQUAD.name}${C.reset} ${modo} → ${target}${args.global ? ' (global)' : ''}  ${C.dim}${args.base}${C.reset}${args.dryRun ? warn('   (dry-run: no se cambia nada)') : ''}\n`);

  const sroot = skillsRoot(target, args.base);
  for (const r of roles) {
    copy(join(PKG_ROOT, 'skills', r.skill), join(sroot, r.skill), args, `skill ${r.skill}`);
    if (r.agent && target !== 'kiro') {
      // Claude Code los usa como subagentes; en Codex quedan como ajustes que Orka aplica en la conversación. Kiro: writeKiro.
      const agentDir = target === 'claude' ? join(args.base, '.claude', 'agents') : join(args.base, `.${SQUAD.slug}`, 'agents');
      copy(join(PKG_ROOT, 'agents', `${r.agent}.md`), join(agentDir, `${r.agent}.md`), { ...args, force: args.force || args.update }, target === 'claude' ? `subagente ${r.agent}` : `ajustes ${r.agent}`);
    }
  }

  writePolicy(args);
  // Qué roles corren en la conversación de Orka en vez de como subagente (se prueba uno a uno con evals/).
  const ejec = join(args.base, `.${SQUAD.slug}`, 'ejecucion.json');
  if (!existsSync(ejec)) {
    if (args.dryRun) log(`  ${C.cyan}crearía${C.reset} ${relative(args.base, ejec)}`);
    else { writeFileSync(ejec, JSON.stringify({ 'en-conversacion': [], nota: 'Roles que Orka ejecuta en su propia conversación en lugar de lanzarlos como subagentes. Vacío = todos como subagentes. Cambia uno a la vez y mide con evals/.' }, null, 2) + '\n'); log(`  ${ok('ok')}       ${relative(args.base, ejec)}`); }
  }
  const lines = instructionLines(roles, target);
  if (target === 'claude') writeBlock(join(args.base, args.global ? join('.claude', 'CLAUDE.md') : 'CLAUDE.md'), lines, args);
  else if (target === 'codex') writeBlock(join(args.base, 'AGENTS.md'), lines, args);
  else writeKiro(args, roles);
  reportObsolete(args, target, roles);

  log(`\n  ${tally.nuevo} nuevo · ${tally.cambia} ${args.dryRun ? 'cambiaría' : 'renovado'} · ${tally.igual} igual · ${tally.omitido} omitido · ${tally.obsoleto} obsoleto`);
  if (args.dryRun) { log(`\n${warn('Dry-run:')} no se cambió nada. Quita --dry-run para aplicarlo.\n`); return; }
  if (tally.omitido) log(`  ${C.dim}Lo omitido ya existía con otro contenido: usa ${C.bold}update${C.reset}${C.dim} para renovarlo.${C.reset}`);
  const inicio = { claude: 'Empieza con: /orka init  (describe el producto y sus roles)  ·  o un rol suelto: "usa inqa para analizar…"',
    kiro: 'En Kiro, elige el agente orka y pide: "corrige el diseño de <módulo>; lo usa <rol> para <tareas>".',
    codex: 'Pide: "usa orka para corregir el diseño del módulo <nombre>".' }[target];
  log(`\n${ok('Listo.')} ${inicio}\n`);
}

function doList() {
  log(`\n${C.bold}${SQUAD.name}${C.reset}\n`);
  for (const r of SQUAD.roles) {
    log(`  ${String(r.order).padStart(2)}  ${C.bold}${r.skill.padEnd(24)}${C.reset}${(r.agent || '(solo skill)').padEnd(18)}${C.dim}${r.decides}${C.reset}`);
  }
  log(`\n  claude  skills → .claude/skills/<skill>/   subagentes → .claude/agents/<rol>.md`);
  log(`  codex   skills → .codex/skills/<skill>/    (sin subagentes)`);
  log(`  kiro    skills → .kiro/skills/<skill>/     agentes → .kiro/agents/<rol>.md (orka delega con subagentes)\n`);
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
else if (cmd === 'update') { args.update = true; doInstall(args); }
else if (cmd === 'list') doList();
else if (cmd === 'init') doInit(args);
else if (cmd === 'comandos') await doComandos();
else if (cmd === 'quien' || cmd === 'quién') await doQuien(args._.slice(1).join(' '));
else log(helpText());
