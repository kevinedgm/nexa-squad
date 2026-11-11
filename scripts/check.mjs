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
// Kiro: cada subagente genera un agente con encabezado, su skill y permisos; Orka puede lanzarlos a todos.
{
  const { agenteKiro, partirAgente, KIRO_ROLES } = await import('../bin/kiro.mjs');
  const agentes = SQUAD.roles.filter((r) => r.agent).map((r) => r.agent);
  for (const r of SQUAD.roles.filter((x) => x.agent)) {
    if (!KIRO_ROLES[r.agent]) { errors.push(`kiro: falta ${r.agent} en KIRO_ROLES`); continue; }
    const { description, body } = partirAgente(readFileSync(join(ROOT, 'agents', `${r.agent}.md`), 'utf8'));
    const out = agenteKiro({ name: r.agent, skill: r.skill, description, body, slug: SQUAD.slug, skillsRel: '.kiro/skills', agentes });
    if (!out.startsWith(`---\nname: ${r.agent}\n`) || !out.includes(`skill://.kiro/skills/${r.skill}/SKILL.md`) || !out.includes('permissions:')) errors.push(`kiro: agente ${r.agent} mal formado`);
    if (/^model:|^skills:|disallowedTools/m.test(out)) errors.push(`kiro: ${r.agent} arrastra campos de Claude Code`);
  }
  // Contexto fijo: la política una sola vez, sin cargar todo .kiro/steering/ ni steering always con la política dentro.
  const { steeringKiro, USAN_PRODUCTO } = await import('../bin/kiro.mjs');
  const st = steeringKiro(SQUAD, SQUAD.roles.map((r) => r.skill));
  if (st.includes('#[[file:')) errors.push('kiro: el steering always no debe incluir archivos');
  if (st.length > 1200) errors.push(`kiro: el steering always pasa de 1,2 KB (${st.length} B)`);
  for (const name of ['orka', ...agentes]) {
    const r = SQUAD.roles.find((x) => x.agent === name) || SQUAD.roles.find((x) => x.order === 0);
    const out = agenteKiro({ name, skill: r.skill, description: 'x', body: '', slug: SQUAD.slug, skillsRel: '.kiro/skills', agentes });
    if (out.includes('steering/**')) errors.push(`kiro: ${name} carga todo .kiro/steering/`);
    if ((out.match(/politica\.md/g) || []).length !== 1) errors.push(`kiro: ${name} debe cargar la política una sola vez`);
    if (out.includes('docs/producto.md') !== USAN_PRODUCTO.includes(name)) errors.push(`kiro: ${name} carga producto.md sin usarlo, o lo usa sin cargarlo`);
  }
  const orka = agenteKiro({ name: 'orka', skill: 'orka', description: 'x', body: '', slug: SQUAD.slug, skillsRel: '.kiro/skills', agentes });
  if (!agentes.every((a) => orka.includes(`"${a}"`)) || !orka.includes('subagent')) errors.push('kiro: orka no puede lanzar a todos los subagentes');
}
// Radiografía: índice de un .vue largo con bloques, métodos, emits y estilos en sus líneas; hooks de Kiro válidos.
{
  const { radiografia, destino, MIN } = await import('../bin/radiografia.mjs');
  const relleno = Array.from({ length: MIN }, (_, i) => `        <i>${i}</i>`);
  const vue = ['<template>', '  <v-card class="demo">', '    <MiBoton v-if="ok" />', ...relleno, '  </v-card>', '</template>', '<script>', 'export default {',
    '  methods: {', '    go() {', "      this.$emit('cambio')", '    },', '  },', '}', '</script>', '<style>', '.demo {', '  margin: 0;', '}', '</style>'].join('\n');
  const md = radiografia('src/Demo.vue', vue);
  const linea = (t) => vue.split('\n').findIndex((l) => l.includes(t)) + 1;
  for (const esperado of ['`v-card.demo` → 2-', `\`MiBoton\` (v-if="ok") → 3`, `**methods** → ${linea('methods')}-`, `\`go\` → ${linea('go()')}-`, `emite \`cambio\` → ${linea('$emit')}`, `\`.demo\` → ${linea('.demo {')}-`])
    if (!md.includes(esperado)) errors.push(`radiografía: falta "${esperado}"`);
  if (destino('src/Demo.vue') !== join('docs', 'contexto', 'archivos', 'src__Demo.vue.md')) errors.push('radiografía: destino inesperado');
  const { validarCasos } = await import('../bin/verificar.mjs');
  const bueno = { anchos: [390], casos: [{ id: 'T1', url: '/', pasos: [{ clic: '#a' }, { escribe: ['#b', 'x'] }], espera: [{ selector: '#c', texto: 'ok' }] }] };
  if (validarCasos(bueno).length) errors.push('verificar: rechaza un casos.json válido: ' + validarCasos(bueno).join('; '));
  const malo = { casos: [{ id: 'T1', url: '/', pasos: [{ toca: '#a' }], espera: [{ selector: '#c' }] }, { id: 'T1' }] };
  if (validarCasos(malo).length < 4) errors.push('verificar: acepta un casos.json inválido');
  const { hooksKiro } = await import('../bin/kiro.mjs');
  const h = JSON.parse(hooksKiro(SQUAD.slug));
  if (h.version !== 'v1' || !h.hooks.every((x) => x.action?.command?.startsWith(`node .${SQUAD.slug}/radiografia.mjs`))) errors.push('kiro: hooks de radiografía mal formados');
}
if (errors.length) { console.error(errors.map((e) => '✗ ' + e).join('\n')); process.exit(1); }
console.log(`✓ ${SQUAD.roles.length} roles, ${SQUAD.roles.filter((r) => r.agent).length} subagentes: todo coherente`);
