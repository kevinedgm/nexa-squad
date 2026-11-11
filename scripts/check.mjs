#!/usr/bin/env node
// Validación del paquete: nombres, referencias y cadena coherentes con squad.json.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SQUAD = JSON.parse(readFileSync(join(ROOT, 'squad.json'), 'utf8'));
const errors = [];
const fm = (txt) => (txt.match(/^---\n([\s\S]*?)\n---\n/) || [])[1] || '';
const field = (front, k) => ((front.match(new RegExp(`^${k}:\\s*(.*)$`, 'm')) || [])[1] || '').trim();

const skills = SQUAD.roles.map((r) => r.skill);
for (const r of SQUAD.roles) {
  const sp = join(ROOT, 'skills', r.skill, 'SKILL.md');
  if (!existsSync(sp)) { errors.push(`falta ${sp}`); continue; }
  const txt = readFileSync(sp, 'utf8');
  const front = fm(txt);
  if (field(front, 'name') !== r.skill) errors.push(`${r.skill}: name: "${field(front, 'name')}" no coincide con la carpeta`);
  if (!field(front, 'description')) errors.push(`${r.skill}: falta description`);
  for (const ref of new Set(txt.match(/references\/[a-z0-9-]+\.md/g) || [])) {
    if (!existsSync(join(ROOT, 'skills', r.skill, ref))) errors.push(`${r.skill}: enlaza ${ref} y no existe`);
  }
  if (r.agent) {
    const ap = join(ROOT, 'agents', `${r.agent}.md`);
    if (!existsSync(ap)) { errors.push(`falta ${ap}`); continue; }
    const af = fm(readFileSync(ap, 'utf8'));
    if (field(af, 'name') !== r.agent) errors.push(`${r.agent}: name no coincide con el archivo`);
    if (!af.includes(`- ${r.skill}`)) errors.push(`${r.agent}: no carga la skill ${r.skill} en skills:`);
    // Cada subagente fija su modelo y esfuerzo (docs/arquitectura.md, sección 11).
    if (!['haiku', 'sonnet', 'opus', 'inherit'].includes(field(af, 'model'))) errors.push(`${r.agent}: model debe ser haiku, sonnet, opus o inherit`);
    if (!['low', 'medium', 'high', 'xhigh', 'max'].includes(field(af, 'effort'))) errors.push(`${r.agent}: falta effort (low a max)`);
  }
}
// El orquestador debe nombrar a cada subagente de la cadena.
const orq = readFileSync(join(ROOT, 'skills', SQUAD.roles[0].skill, 'SKILL.md'), 'utf8');
for (const r of SQUAD.roles.filter((x) => x.agent)) if (!orq.includes(r.agent)) errors.push(`el orquestador no menciona ${r.agent}`);
// Nada sobra fuera de squad.json.
for (const d of readdirSync(join(ROOT, 'skills'))) if (!skills.includes(d)) errors.push(`skills/${d} no está en squad.json`);
for (const f of readdirSync(join(ROOT, 'agents'))) if (!SQUAD.roles.some((r) => `${r.agent}.md` === f)) errors.push(`agents/${f} no está en squad.json`);

if (!existsSync(join(ROOT, 'estandares', 'estandares.md'))) errors.push('falta estandares/estandares.md');
// Guía de comandos: cada comando invoca un rol real y el .md está al día con el .json.
const { DATA, renderMd, MD_PATH } = await import('../bin/comandos.mjs');
for (const c of DATA.comandos) if (!skills.includes(c.invoca)) errors.push(`comando ${c.id}: invoca "${c.invoca}", que no es un rol`);
if (!existsSync(MD_PATH) || readFileSync(MD_PATH, 'utf8') !== renderMd()) errors.push('comandos/comandos.md desactualizado: corre npm run comandos');
if (errors.length) { console.error(errors.map((e) => '✗ ' + e).join('\n')); process.exit(1); }
console.log(`✓ ${SQUAD.roles.length} roles, ${SQUAD.roles.filter((r) => r.agent).length} subagentes: todo coherente`);
