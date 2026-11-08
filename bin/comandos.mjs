#!/usr/bin/env node
// Guía de comandos: genera comandos/comandos.md y busca a quién invocar según una frase.
import { readFileSync, writeFileSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const DATA = JSON.parse(readFileSync(join(ROOT, 'comandos', 'comandos.json'), 'utf8'));
export const MD_PATH = join(ROOT, 'comandos', 'comandos.md');

const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[¿?¡!.,;:]/g, ' ').replace(/\s+/g, ' ').trim();

// Puntúa cada comando por las frases clave que aparecen en la petición; las claves largas pesan más.
export function quien(frase) {
  const f = ` ${norm(frase)} `;
  return DATA.comandos
    .map((c) => {
      const hits = c.claves.filter((k) => f.includes(` ${norm(k)} `) || f.includes(` ${norm(k)}`));
      return { c, hits, score: hits.reduce((a, k) => a + norm(k).split(' ').length, 0) };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);
}

export function renderMd() {
  const row = (c) => `| ${c.quiero} | \`${c.decir}\` | ${c.invoca} | ${c.arranca} | ${c.que_pasa} |`;
  const head = '| Quiero… | Di | Invoca | Arranca en | Qué pasa |\n|---|---|---|---|---|';
  const g = (k) => DATA.comandos.filter((c) => c.grupo === k).map(row).join('\n');
  return `# Comandos: a quién invocar

Archivo generado desde \`comandos/comandos.json\` (\`npm run comandos\`). No lo edites a mano.

Regla corta: **si el trabajo toca más de un rol, empieza con \`/orka\`**; si sabes exactamente qué decisión necesitas, llama al rol directo. Si no sabes, pregunta \`/orka ¿a quién invoco para …?\` o, en la terminal, \`npx github:kevinedgm/nexa-squad quien "lo que quiero"\`.

En Claude Code cada rol se invoca con \`/<rol>\`. En Codex y Kiro, di "usa <rol> para …" (por ejemplo, "usa orka para migrar el gestor").

## Trabajo de varios roles (Orka decide la cadena)

${head}
${g('cadena')}

## Un solo rol

Usado solo, el rol corre en la conversación y puede preguntarte. Si le falta el documento de entrada, te lo dice y te propone qué rol lo produce.

${head}
${g('rol')}

## Si no sabes

${head}
${g('ayuda')}

## Cómo distinguir los casos que se parecen

| Si dices… | Es | Porque |
|---|---|---|
| "corrige la composición", "se ve mal", "está mal acomodado" | corregir | Cambia cómo se ve, no lo que hace |
| "cuando pase X, ahora tiene que pasar Y" | extender | Cambia lo que hace |
| "corrige" sin más | Orka pregunta una vez | Puede ser cualquiera de los dos |
| "tráela de tal app" | traer | El origen es otra aplicación |
| "rediseña" un módulo legacy | migrar | Se revisa también qué debe hacer |
| "solo audita", "diagnostica" | revisar (Vera sola) | Nadie corrige después |

## Desde la terminal

\`\`\`bash
npx github:kevinedgm/nexa-squad comandos                         # esta guía
npx github:kevinedgm/nexa-squad quien "el formulario de cuentas se ve mal"
\`\`\`
`;
}

const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) { writeFileSync(MD_PATH, renderMd()); console.log('✓ comandos/comandos.md generado'); }
