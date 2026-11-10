#!/usr/bin/env node
// Mide una corrida del squad a partir de la transcripción de Claude Code (.jsonl).
// Uso: npm run medir -- <transcripcion.jsonl> [--json]
// Las transcripciones están en ~/.claude/projects/<proyecto>/<sesion>.jsonl; los
// subagentes, en <sesion>/subagents/agent-<id>.jsonl (si la versión los separa).
//
// Qué reporta y por qué:
// - Tiempo total y tiempo hasta el primer código: la medida de éxito del squad es
//   cuánto tarda en escribirse la primera línea de código, no cuántos documentos salen.
// - Tiempo por rol (subagente o skill): dónde se va el tiempo.
// - Lecturas de código (Read, Grep, Glob y Bash de solo lectura): si dos roles
//   leen lo mismo, el contador lo delata.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';

const args = process.argv.slice(2);
const file = args.find((a) => !a.startsWith('--'));
if (!file || !existsSync(file)) {
  console.error('Uso: npm run medir -- <transcripcion.jsonl> [--json]');
  process.exit(1);
}

const READ_TOOLS = new Set(['Read', 'Grep', 'Glob', 'LS']);
const READ_BASH = /^\s*(cat|head|tail|sed -n|grep|rg|find|ls|tree|wc)\b/;
const isRead = (name, input = {}) =>
  READ_TOOLS.has(name) || (name === 'Bash' && READ_BASH.test(input.command || ''));
const isCodeWrite = (name, input = {}) => {
  if (!['Write', 'Edit', 'MultiEdit', 'NotebookEdit'].includes(name)) return false;
  const p = input.file_path || input.notebook_path || '';
  return !/(^|\/)docs\//.test(p) && !/\.md$/i.test(p);
};
const ms = (t) => Date.parse(t);
const fmt = (m) => {
  if (m == null || Number.isNaN(m)) return '—';
  const s = Math.round(m / 1000);
  return s < 60 ? `${s} s` : `${Math.floor(s / 60)} min ${String(s % 60).padStart(2, '0')} s`;
};

function load(path) {
  return readFileSync(path, 'utf8').split('\n').filter(Boolean).flatMap((l) => {
    try { return [JSON.parse(l)]; } catch { return []; }
  });
}
function toolUses(entries) {
  const out = [];
  for (const e of entries) {
    const c = e.message?.content;
    if (e.type !== 'assistant' || !Array.isArray(c)) continue;
    for (const x of c) if (x.type === 'tool_use') out.push({ ...x, t: ms(e.timestamp), side: !!e.isSidechain });
  }
  return out;
}
function tokens(entries) {
  let input = 0, output = 0;
  const seen = new Set();
  for (const e of entries) {
    const u = e.message?.usage;
    const id = e.message?.id;
    if (e.type !== 'assistant' || !u || seen.has(id)) continue;
    seen.add(id);
    input += (u.input_tokens || 0) + (u.cache_read_input_tokens || 0) + (u.cache_creation_input_tokens || 0);
    output += u.output_tokens || 0;
  }
  return { input, output };
}

const entries = load(file);
const times = entries.map((e) => ms(e.timestamp)).filter((t) => !Number.isNaN(t));
const start = Math.min(...times);
const end = Math.max(...times);
const uses = toolUses(entries);
const results = new Map();
for (const e of entries) {
  const c = e.message?.content;
  if (e.type !== 'user' || !Array.isArray(c)) continue;
  for (const x of c) if (x.type === 'tool_result') results.set(x.tool_use_id, { t: ms(e.timestamp), meta: e.toolUseResult });
}
const subDir = join(dirname(file), basename(file, '.jsonl'), 'subagents');

const roles = [];
let firstCode = null;
let mainReads = 0;
for (const u of uses) {
  if (!u.side && isRead(u.name, u.input)) mainReads++;
  if (isCodeWrite(u.name, u.input) && (firstCode == null || u.t < firstCode)) firstCode = u.t;
  if (u.name === 'Agent' || u.name === 'Task') {
    const r = results.get(u.id) || {};
    const meta = r.meta && typeof r.meta === 'object' ? r.meta : {};
    const row = {
      rol: u.input?.subagent_type || 'subagente',
      modo: 'subagente',
      inicio: u.t - start,
      duracion: meta.totalDurationMs ?? (r.t ? r.t - u.t : null),
      lecturas: null,
      herramientas: meta.totalToolUseCount ?? null,
    };
    const sub = meta.agentId && join(subDir, `agent-${meta.agentId}.jsonl`);
    if (sub && existsSync(sub)) {
      const su = toolUses(load(sub));
      row.lecturas = su.filter((x) => isRead(x.name, x.input)).length;
      row.herramientas = su.length;
      const w = su.find((x) => isCodeWrite(x.name, x.input));
      if (w && (firstCode == null || w.t < firstCode)) firstCode = w.t;
    }
    roles.push(row);
  } else if (u.name === 'Skill') {
    roles.push({ rol: u.input?.skill || 'skill', modo: 'en conversación', inicio: u.t - start, duracion: null, lecturas: null, herramientas: null });
  }
}
// Una skill dura hasta que empieza el siguiente rol o termina la sesión.
roles.forEach((r, i) => {
  if (r.modo !== 'en conversación') return;
  const fin = roles[i + 1]?.inicio ?? end - start;
  r.duracion = fin - r.inicio;
  r.lecturas = uses.filter((u) => !u.side && isRead(u.name, u.input) && u.t - start >= r.inicio && u.t - start < fin).length;
});
// Subagentes del formato antiguo: van en el mismo archivo, marcados isSidechain.
const sideReads = uses.filter((u) => u.side && isRead(u.name, u.input)).length;
if (!existsSync(subDir) && sideReads) roles.push({ rol: '(subagentes, sin separar)', modo: 'subagente', inicio: null, duracion: null, lecturas: sideReads, herramientas: null });

const forja = roles.find((r) => /forja/.test(r.rol));
const resumen = {
  archivo: file,
  total: end - start,
  hastaForja: forja ? forja.inicio : null,
  hastaCodigo: firstCode != null ? firstCode - start : null,
  lecturasOrka: mainReads,
  tokens: tokens(entries),
  roles,
};

if (args.includes('--json')) { console.log(JSON.stringify(resumen, null, 2)); process.exit(0); }
console.log(`Corrida: ${basename(file)}`);
console.log(`Tiempo total ............ ${fmt(resumen.total)}`);
console.log(`Hasta que arranca Forja . ${fmt(resumen.hastaForja)}`);
console.log(`Hasta el primer código .. ${fmt(resumen.hastaCodigo)}`);
console.log(`Lecturas en conversación ${mainReads}`);
console.log(`Tokens (conversación) ... entrada ${resumen.tokens.input}, salida ${resumen.tokens.output}\n`);
if (roles.length) {
  console.log('| Rol | Modo | Empieza en | Duración | Lecturas de código | Herramientas |');
  console.log('|---|---|---|---|---|---|');
  for (const r of roles) console.log(`| ${r.rol} | ${r.modo} | ${fmt(r.inicio)} | ${fmt(r.duracion)} | ${r.lecturas ?? '—'} | ${r.herramientas ?? '—'} |`);
} else {
  console.log('No hubo subagentes ni skills en esta corrida.');
}
