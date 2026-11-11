#!/usr/bin/env node
// Validación del paquete: skills coherentes con squad.json, referencias que existen, Kiro sin agentes ni hooks.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SQUAD = JSON.parse(readFileSync(join(ROOT, 'squad.json'), 'utf8'));
const errors = [];
const fm = (txt) => (txt.match(/^---\n([\s\S]*?)\n---\n/) || [])[1] || '';
const field = (front, k) => ((front.match(new RegExp(`^${k}:\\s*(.*)$`, 'm')) || [])[1] || '').trim();
const VIEJOS = /\b(Orka|Arko|Fluxa|Kura|Vera|orka|subagente)\b/;

const skills = SQUAD.roles.map((r) => r.skill);
for (const r of SQUAD.roles) {
  const sp = join(ROOT, 'skills', r.skill, 'SKILL.md');
  if (!existsSync(sp)) { errors.push(`falta ${sp}`); continue; }
  const txt = readFileSync(sp, 'utf8');
  const front = fm(txt);
  if (field(front, 'name') !== r.skill) errors.push(`${r.skill}: name: "${field(front, 'name')}" no coincide con la carpeta`);
  if (!field(front, 'description')) errors.push(`${r.skill}: falta description`);
  if (txt.split('\n').length > 150) errors.push(`${r.skill}: SKILL.md pasa de 150 líneas`);
  const refs = new Set(txt.match(/references\/[a-z0-9-]+\.md/g) || []);
  for (const ref of refs) if (!existsSync(join(ROOT, 'skills', r.skill, ref))) errors.push(`${r.skill}: enlaza ${ref} y no existe`);
  // Toda referencia de la carpeta está enlazada desde su SKILL.md (si no, nadie la abre).
  const dir = join(ROOT, 'skills', r.skill, 'references');
  if (existsSync(dir)) for (const f of readdirSync(dir)) if (!refs.has(`references/${f}`)) errors.push(`${r.skill}: references/${f} no está enlazada en SKILL.md`);
  for (const f of [sp, ...(existsSync(dir) ? readdirSync(dir).map((f) => join(dir, f)) : [])])
    if (VIEJOS.test(readFileSync(f, 'utf8'))) errors.push(`${f.replace(ROOT + '/', '')}: nombra un rol o mecanismo que ya no existe`);
}
for (const d of readdirSync(join(ROOT, 'skills'))) if (!skills.includes(d)) errors.push(`skills/${d} no está en squad.json`);
if (existsSync(join(ROOT, 'agents'))) errors.push('agents/ ya no se usa: los roles corren en la conversación');
if (!existsSync(join(ROOT, 'estandares', 'estandares.md'))) errors.push('falta estandares/estandares.md');
if (VIEJOS.test(readFileSync(join(ROOT, 'AGENTS.md'), 'utf8'))) errors.push('AGENTS.md nombra un rol o mecanismo que ya no existe');

// Kompa: cada fila del diagnóstico cita una fuente del catálogo de estándares.
{
  const kompa = readFileSync(join(ROOT, 'skills', 'kompa', 'SKILL.md'), 'utf8');
  const filas = kompa.match(/^\| [CASI]\d+ \|.*$/gm) || [];
  if (filas.length < 15) errors.push(`kompa: el diagnóstico tiene ${filas.length} filas (se esperan al menos 15)`);
  for (const f of filas) if (!f.trim().split('|').at(-2).trim()) errors.push(`kompa: fila sin fuente: ${f.slice(0, 40)}`);
}

// Kiro: steering always corto y sin archivos incluidos.
{
  const { steeringKiro } = await import('../bin/kiro.mjs');
  const st = steeringKiro(SQUAD, skills);
  if (st.includes('#[[file:')) errors.push('kiro: el steering always no debe incluir archivos');
  if (st.length > 1200) errors.push(`kiro: el steering always pasa de 1,2 KB (${st.length} B)`);
  for (const s of skills) if (!st.includes('`' + s + '`')) errors.push(`kiro: el steering no nombra ${s}`);
}

if (errors.length) { console.error(errors.map((e) => '✗ ' + e).join('\n')); process.exit(1); }
console.log(`✓ ${SQUAD.roles.length} skills, sin subagentes: todo coherente`);
