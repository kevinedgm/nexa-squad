#!/usr/bin/env node
// Radiografía de un archivo largo: un índice corto con la línea de cada parte, para que un rol lea
// el índice una vez y después solo el rango que necesita (regla común 12). Sin IA: solo lee el texto.
//
// Uso (en el proyecto, el instalador lo deja en .nexa-squad/radiografia.mjs):
//   node .nexa-squad/radiografia.mjs <archivo> [...]   escribe docs/contexto/archivos/<archivo>.md
//   node .nexa-squad/radiografia.mjs --cambiados       los archivos largos con cambios según git
//   node .nexa-squad/radiografia.mjs --hook            lee la ruta del JSON de un hook (stdin)
//   --stdout                                           imprime en lugar de escribir
// Solo indexa archivos de más de MIN líneas. Nunca falla con código distinto de 0: un hook no debe frenar a nadie.
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, extname, join, relative, resolve } from 'node:path';

export const MIN = 300;
const EXT = ['.vue', '.js', '.mjs', '.cjs', '.ts', '.jsx', '.tsx', '.php', '.css', '.scss'];
const OUT_DIR = join('docs', 'contexto', 'archivos');

const indent = (s) => s.match(/^\s*/)[0].replace(/\t/g, '  ').length;

// Fin de un bloque por llaves, desde la línea i.
function finLlaves(lines, i) {
  let d = 0;
  for (let j = i; j < lines.length; j++) {
    for (const ch of lines[j].replace(/(["'`]).*?\1/g, '')) { if (ch === '{') d++; else if (ch === '}') d--; }
    if (d <= 0 && j > i) return j;
    if (d <= 0 && lines[j].includes('}') && lines[j].includes('{')) return j;
  }
  return lines.length - 1;
}

// Fin de un elemento de plantilla por sangría: la siguiente línea con sangría menor o igual.
function finSangria(lines, i, hasta) {
  const n = indent(lines[i]);
  if (/\/>\s*$/.test(lines[i]) || /<\/[\w-]+>\s*$/.test(lines[i])) return i;
  for (let j = i + 1; j <= hasta; j++) {
    if (!lines[j].trim()) continue;
    const m = indent(lines[j]);
    if (m < n) return j - 1;
    if (m === n) return /^\s*<\//.test(lines[j]) ? j : j - 1;
  }
  return hasta;
}

const r = (a, b) => (a === b ? `${a + 1}` : `${a + 1}-${b + 1}`);
// Formato para agentes, no para personas: una línea por pieza, `nombre inicio-fin`, la sangría indica anidamiento.

function plantilla(lines, ini, fin, out) {
  const base = indent(lines[ini + 1] || '');
  for (let i = ini + 1; i < fin; i++) {
    const t = lines[i].trim();
    const m = t.match(/^<([A-Za-z][\w.-]*)/);
    if (!m) continue;
    const tag = m[1];
    const nivel = Math.round((indent(lines[i]) - base) / 2);
    const componente = /[A-Z]/.test(tag[0]) || tag.includes('-');
    const clase = (t.match(/\bclass="([^"]+)"/) || [])[1];
    const ref = (t.match(/\b(?:ref|id)="([^"]+)"/) || [])[1];
    const cond = (t.match(/\b(v-if|v-else-if|v-else|v-show|v-for)\b(?:="([^"]*)")?/) || []);
    if (nivel > 4 || (!componente && !clase && !ref && !cond[1])) continue;
    const nombre = [tag, clase && '.' + clase.split(/\s+/)[0], ref && '#' + ref].filter(Boolean).join('');
    out.push(`${' '.repeat(Math.max(0, nivel) + 1)}${nombre}${cond[1] ? ` ${cond[1]}${cond[2] ? `=${cond[2].slice(0, 40)}` : ''}` : ''} ${r(i, finSangria(lines, i, fin - 1))}`);
  }
}

function codigo(lines, ini, fin, out) {
  for (let i = ini; i < fin; i++) {
    const l = lines[i];
    let m;
    if ((m = l.match(/^\s{0,4}(props|data|computed|methods|watch|emits|components|setup|mounted|created|beforeDestroy|beforeUnmount|unmounted)\s*(?:\(\)\s*)?[:({]/))) {
      out.push(` ${m[1]} ${r(i, finLlaves(lines, i))}`);
    } else if ((m = l.match(/^\s{4,6}(?:async\s+)?([A-Za-z_$][\w$]*)\s*(?:\([^)]*\)\s*\{|:\s*(?:async\s+)?(?:function\b|\([^)]*\)\s*=>|\{))/)) && !/^(if|for|while|switch|catch|return)$/.test(m[1])) {
      out.push(`  ${m[1]}() ${r(i, finLlaves(lines, i))}`);
    } else if ((m = l.match(/^\s*(?:export\s+)?(?:default\s+)?(?:async\s+)?(?:function\s+([\w$]+)|class\s+([\w$]+)|(?:const|let)\s+([\w$]+)\s*=\s*(?:async\s*)?(?:\([^)]*\)|[\w$]+)\s*=>)/))) {
      out.push(` ${m[1] || m[2] || m[3]} ${r(i, finLlaves(lines, i))}`);
    } else if ((m = l.match(/^\s*(?:public|private|protected|static|\s)*function\s+([\w]+)\s*\(/))) {
      out.push(` ${m[1]}() ${r(i, finLlaves(lines, i))}`);
    }
    const emit = [...l.matchAll(/\$?emit\(\s*['"]([\w:-]+)['"]/g)].map((x) => x[1]);
    for (const e of emit) out.push(`   emit ${e} ${i + 1}`);
  }
}

function estilos(lines, ini, fin, out) {
  for (let i = ini; i < fin; i++) {
    const t = lines[i].trim();
    if (!t.endsWith('{') || t.startsWith('@') || indent(lines[i]) > indent(lines[ini + 1] || '') + 2) continue;
    out.push(` ${t.slice(0, -1).trim().slice(0, 80)} ${r(i, finLlaves(lines, i))}`);
  }
}

export function radiografia(rel, texto) {
  const lines = texto.split('\n');
  const out = [];
  const bloques = [];
  if (extname(rel) === '.vue') {
    lines.forEach((l, i) => { const m = l.match(/^<(template|script|style)\b[^>]*>/); if (m) bloques.push({ tipo: m[1], ini: i }); });
    for (const b of bloques) { const j = lines.findIndex((l, k) => k > b.ini && l.startsWith(`</${b.tipo}>`)); b.fin = j === -1 ? lines.length - 1 : j; }
  } else {
    bloques.push({ tipo: /\.s?css$/.test(rel) ? 'style' : 'script', ini: -1, fin: lines.length });
  }
  for (const b of bloques) {
    if (extname(rel) === '.vue') out.push(`${b.tipo} ${r(b.ini, b.fin)}`);
    if (b.tipo === 'template') plantilla(lines, b.ini, b.fin, out);
    else if (b.tipo === 'script') codigo(lines, b.ini + 1, b.fin, out);
    else estilos(lines, b.ini, b.fin, out);
  }
  const hash = createHash('sha1').update(texto).digest('hex').slice(0, 12);
  const n = lines.length - (lines.at(-1) === '' ? 1 : 0);
  return [`radiografia ${rel} lineas=${n} sha1=${hash}`,
    'formato: pieza inicio-fin; sangria=anidado. Lee solo el rango que necesitas. sha1 distinto: node .nexa-squad/radiografia.mjs <archivo>',
    ...out, ''].join('\n');
}

export function destino(rel) { return join(OUT_DIR, rel.replace(/[\\/]/g, '__') + '.md'); }

function procesar(archivo, { stdout, base }) {
  const abs = resolve(base, archivo);
  const rel = relative(base, abs).replace(/\\/g, '/');
  if (!existsSync(abs) || !EXT.includes(extname(abs)) || rel.startsWith('..') || /(^|\/)(node_modules|vendor|dist)\//.test(rel)) return null;
  const texto = readFileSync(abs, 'utf8');
  if (texto.split('\n').length <= MIN) return null;
  const md = radiografia(rel, texto);
  if (stdout) { process.stdout.write(md); return rel; }
  const out = join(base, destino(rel));
  const hash = (md.match(/ sha1=(\w+)/) || [])[1];
  if (existsSync(out) && readFileSync(out, 'utf8').includes(`sha1=${hash}`)) return rel;
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, md);
  return rel;
}

function cambiados(base) {
  try {
    const o = execSync('git status --porcelain --untracked-files=all', { cwd: base, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
    return o.split('\n').filter(Boolean).map((l) => l.slice(3).replace(/^.* -> /, '').replace(/^"|"$/g, ''));
  } catch { return []; }
}

function rutaDelHook() {
  try {
    if (process.stdin.isTTY) return null;
    const p = JSON.parse(readFileSync(0, 'utf8') || '{}');
    const i = p.tool_input || p.toolInput || p.input || p;
    return i.path || i.file_path || i.filePath || p.file_path || p.filePath || p.path || null;
  } catch { return null; }
}

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('radiografia.mjs')) {
  const args = process.argv.slice(2);
  const base = process.env.CLAUDE_PROJECT_DIR || process.cwd();
  const stdout = args.includes('--stdout');
  let archivos = args.filter((a) => !a.startsWith('--'));
  if (args.includes('--cambiados')) archivos = archivos.concat(cambiados(base));
  if (args.includes('--hook')) { const p = rutaDelHook(); if (p) archivos.push(p); }
  try {
    const hechos = archivos.map((a) => procesar(a, { stdout, base })).filter(Boolean);
    if (!stdout && hechos.length && !args.includes('--hook')) for (const h of hechos) console.log(`radiografía: ${destino(h)}`);
  } catch (e) { if (!args.includes('--hook')) console.error(`radiografía: ${e.message}`); }
  process.exit(0);
}
