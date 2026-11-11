#!/usr/bin/env node
// Verificador único del squad: Forja escribe QUÉ comprobar (casos.json) y este script lo comprueba en un navegador real,
// siempre igual. Vera corre el mismo archivo. Nadie escribe scripts de prueba sueltos ni en /tmp.
// Basado en el recolector de navegador de fruti-squad-experimient (.codex/qa/collect-browser.cjs), sin lo propio de Fruti.
//
// Uso (en el proyecto, el instalador lo deja en .nexa-squad/verificar.mjs):
//   node .nexa-squad/verificar.mjs docs/construccion/evidencia/<modulo>-fase-<n>/casos.json [--solo T3,T5]
// Escribe resultados.json y capturas junto a casos.json. Sale con 0 si todo pasa, 1 si algo falla, 2 si no pudo correr.
//
// casos.json:
// {
//   "base": "http://localhost:8080",                    // opcional; las url que empiezan con / se le pegan
//   "anchos": [390, 1024, 1440],                        // por defecto para cada caso
//   "antes": { "url": "/login", "pasos": [ ... ] },    // opcional: se corre al inicio de cada caso (p. ej. iniciar sesión)
//   "casos": [{
//     "id": "T3",                                        // el id de la fila de la tabla de tareas
//     "que": "el switch de embarazo guarda y muestra la etiqueta",
//     "url": "/consulta/1",
//     "anchos": [390],                                   // opcional, reemplaza los de arriba
//     "pasos":  [{ "clic": "#guardar" }, { "escribe": ["#nota", "texto"] }, { "tecla": "Tab" }, { "elige": ["#tipo", "B"] }, { "espera": "#ok" }],
//     "espera": [{ "selector": "#ok", "visible": true }, { "selector": "h1", "texto": "Hola" }, { "selector": "h1", "contiene": "Ho" },
//                { "selector": "#nota", "foco": true }, { "selector": "#a", "atributo": ["aria-expanded", "true"] }, { "url": "/fin" }],
//     "visibles": ["#guardar", ".v-card h2"]             // deben verse, sin recorte ni quedar tapados
//   }]
// }
// Además, en cada caso y ancho: sin desborde horizontal y sin errores de consola.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';

const PASOS = ['clic', 'escribe', 'tecla', 'elige', 'espera', 'ir'];
const ESPERA = ['visible', 'texto', 'contiene', 'foco', 'atributo'];

// Revisa la forma de casos.json antes de abrir el navegador; devuelve la lista de errores.
export function validarCasos(plan) {
  const e = [];
  if (!plan || !Array.isArray(plan.casos) || !plan.casos.length) return ['casos.json necesita "casos" con al menos un caso'];
  const ids = new Set();
  const pasos = (lista, donde) => (lista || []).forEach((p, i) => {
    const k = Object.keys(p || {});
    if (k.length !== 1 || !PASOS.includes(k[0])) e.push(`${donde}: paso ${i + 1} debe ser uno de ${PASOS.join(', ')}`);
    else if (['escribe', 'elige'].includes(k[0]) && !(Array.isArray(p[k[0]]) && p[k[0]].length === 2)) e.push(`${donde}: "${k[0]}" va como [selector, valor]`);
  });
  if (plan.antes) pasos(plan.antes.pasos, 'antes');
  for (const c of plan.casos) {
    if (!c.id) { e.push('cada caso necesita "id" (el de la fila de la tabla)'); continue; }
    if (ids.has(c.id)) e.push(`${c.id}: id repetido`);
    ids.add(c.id);
    if (!c.url) e.push(`${c.id}: falta "url"`);
    const anchos = c.anchos || plan.anchos;
    if (!Array.isArray(anchos) || !anchos.length || !anchos.every((a) => Number.isInteger(a) && a > 0)) e.push(`${c.id}: faltan "anchos" (en el caso o arriba)`);
    pasos(c.pasos, c.id);
    for (const x of c.espera || []) {
      if (x.url === undefined && !x.selector) e.push(`${c.id}: cada "espera" necesita "selector" o "url"`);
      else if (x.selector && !ESPERA.some((k) => x[k] !== undefined)) e.push(`${c.id}: "espera" de ${x.selector} no dice qué comprobar (${ESPERA.join(', ')})`);
    }
    if (!(c.espera || []).length && !(c.visibles || []).length) e.push(`${c.id}: un caso sin "espera" ni "visibles" no comprueba nada`);
  }
  return e;
}

const absoluta = (base, url) => (/^https?:\/\//.test(url) || !base ? url : base.replace(/\/$/, '') + (url.startsWith('/') ? url : '/' + url));

// Corre en la página: un elemento que debe verse no está oculto, recortado por un ancestro ni tapado.
function inspeccionar(el) {
  const r = el.getBoundingClientRect(), s = getComputedStyle(el), f = [];
  if (!r.width || !r.height || s.visibility === 'hidden' || s.display === 'none' || s.opacity === '0') return ['no se ve'];
  let q = { left: r.left, right: r.right, top: r.top, bottom: r.bottom };
  for (let p = el.parentElement; p; p = p.parentElement) {
    const ps = getComputedStyle(p), b = p.getBoundingClientRect();
    const cx = ['hidden', 'clip'].includes(ps.overflowX), cy = ['hidden', 'clip'].includes(ps.overflowY);
    if (cx && (q.left < b.left - 1 || q.right > b.right + 1)) f.push('recortado a lo ancho por ' + p.tagName.toLowerCase());
    if (cy && (q.top < b.top - 1 || q.bottom > b.bottom + 1)) f.push('recortado a lo alto por ' + p.tagName.toLowerCase());
    // Dentro de una zona con scroll lo que queda fuera es alcanzable: se recorta el rectángulo antes de seguir subiendo.
    const sx = ['auto', 'scroll'].includes(ps.overflowX), sy = ['auto', 'scroll'].includes(ps.overflowY);
    if (sx) q = { ...q, left: Math.max(q.left, b.left), right: Math.min(q.right, b.right) };
    if (sy) q = { ...q, top: Math.max(q.top, b.top), bottom: Math.min(q.bottom, b.bottom) };
  }
  const x = Math.max(0, Math.min(innerWidth - 1, r.left + r.width / 2)), y = Math.max(0, Math.min(innerHeight - 1, r.top + r.height / 2));
  const arriba = document.elementFromPoint(x, y);
  if (!arriba || !(el.contains(arriba) || arriba.contains(el))) f.push('tapado por otro elemento o fuera de pantalla');
  return [...new Set(f)];
}

async function paso(page, p, base) {
  const [k, v] = Object.entries(p)[0];
  if (k === 'ir') return page.goto(absoluta(base, v), { waitUntil: 'networkidle' });
  if (k === 'tecla') return page.keyboard.press(v);
  if (k === 'espera') return page.locator(v).first().waitFor({ state: 'visible' });
  const sel = Array.isArray(v) ? v[0] : v;
  const loc = page.locator(sel).first();
  if (!(await page.locator(sel).count())) throw Error(`no existe ${sel} para "${k}"`);
  if (k === 'clic') return loc.click();
  if (k === 'escribe') return loc.fill(String(v[1]));
  if (k === 'elige') return loc.selectOption(String(v[1]));
}

async function comprobar(page, x) {
  const deadline = Date.now() + 5000;
  let fallas;
  do {
    fallas = [];
    if (x.url !== undefined && !page.url().includes(x.url)) fallas.push(`la url no contiene ${x.url}`);
    if (x.selector) {
      const loc = page.locator(x.selector).first();
      const hay = (await page.locator(x.selector).count()) > 0;
      if (!hay) { if (x.visible !== false) fallas.push(`${x.selector}: no existe`); }
      else {
        if (x.visible !== undefined && (await loc.isVisible()) !== x.visible) fallas.push(`${x.selector}: ${x.visible ? 'no se ve' : 'se ve y no debería'}`);
        const t = x.texto !== undefined || x.contiene !== undefined ? ((await loc.textContent()) || '').trim() : '';
        if (x.texto !== undefined && t !== x.texto) fallas.push(`${x.selector}: texto "${t.slice(0, 60)}", se esperaba "${x.texto}"`);
        if (x.contiene !== undefined && !t.includes(x.contiene)) fallas.push(`${x.selector}: no contiene "${x.contiene}"`);
        if (x.foco !== undefined && (await loc.evaluate((el) => el === document.activeElement || el.contains(document.activeElement))) !== x.foco) fallas.push(`${x.selector}: ${x.foco ? 'sin foco' : 'tiene el foco'}`);
        if (x.atributo && (await loc.getAttribute(x.atributo[0])) !== String(x.atributo[1])) fallas.push(`${x.selector}: ${x.atributo[0]} no es "${x.atributo[1]}"`);
      }
    }
    if (!fallas.length) return [];
    await page.waitForTimeout(100);
  } while (Date.now() < deadline);
  return fallas;
}

async function cargarPlaywright() {
  try { return createRequire(join(process.cwd(), 'package.json'))('playwright'); } catch {}
  try { return await import('playwright'); } catch { return null; }
}

export async function verificar(casosPath, { solo } = {}) {
  const plan = JSON.parse(readFileSync(casosPath, 'utf8'));
  const errores = validarCasos(plan);
  if (errores.length) return { estado: 'casos-invalidos', errores };
  const pw = await cargarPlaywright();
  if (!pw) return { estado: 'sin-navegador', errores: ['Playwright no está disponible en el proyecto. No lo instales: anótalo en el checklist de implementación (regla 5) y declara la prueba como no hecha.'] };
  const dir = dirname(resolve(casosPath));
  mkdirSync(join(dir, 'capturas'), { recursive: true });
  const browser = await pw.chromium.launch({ headless: true });
  const resultados = [];
  try {
    for (const c of plan.casos.filter((x) => !solo || solo.includes(x.id))) {
      for (const ancho of c.anchos || plan.anchos) {
        const ctx = await browser.newContext({ viewport: { width: ancho, height: 900 } });
        const page = await ctx.newPage();
        page.setDefaultTimeout(5000);
        const consola = [];
        page.on('pageerror', (e) => consola.push(e.message));
        page.on('console', (m) => { if (m.type() === 'error') consola.push(m.text()); });
        const hallazgos = [];
        try {
          if (plan.antes) {
            if (plan.antes.url) await page.goto(absoluta(plan.base, plan.antes.url), { waitUntil: 'networkidle' });
            for (const p of plan.antes.pasos || []) await paso(page, p, plan.base);
          }
          await page.goto(absoluta(plan.base, c.url), { waitUntil: 'networkidle' });
          for (const p of c.pasos || []) await paso(page, p, plan.base);
          for (const x of c.espera || []) hallazgos.push(...(await comprobar(page, x)));
          for (const sel of c.visibles || []) {
            const loc = page.locator(sel).first();
            if (!(await page.locator(sel).count())) { hallazgos.push(`${sel}: no existe`); continue; }
            await loc.scrollIntoViewIfNeeded().catch(() => {});
            hallazgos.push(...(await loc.evaluate(inspeccionar)).map((h) => `${sel}: ${h}`));
          }
          if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)) hallazgos.push('desborde horizontal');
        } catch (e) { hallazgos.push('no se pudo correr: ' + e.message.split('\n')[0]); }
        const captura = join('capturas', `${c.id}-${ancho}.png`);
        await page.screenshot({ path: join(dir, captura), fullPage: true }).catch(() => {});
        hallazgos.push(...consola.map((m) => 'error de consola: ' + m.slice(0, 200)));
        resultados.push({ id: c.id, ancho, estado: hallazgos.length ? 'falla' : 'pasa', hallazgos, captura });
        await ctx.close();
      }
    }
  } finally { await browser.close(); }
  const salida = { fecha: new Date().toISOString(), casos: casosPath, estado: resultados.every((r) => r.estado === 'pasa') ? 'pasa' : 'falla', resultados };
  writeFileSync(join(dir, 'resultados.json'), JSON.stringify(salida, null, 2) + '\n');
  return salida;
}

if (process.argv[1]?.endsWith('verificar.mjs')) {
  const args = process.argv.slice(2);
  const casos = args.find((a) => !a.startsWith('--'));
  const i = args.indexOf('--solo');
  const solo = i >= 0 ? (args[i + 1] || '').split(',').filter(Boolean) : null;
  if (!casos || !existsSync(casos)) { console.error('Uso: node .nexa-squad/verificar.mjs <ruta>/casos.json [--solo T3,T5]'); process.exit(2); }
  verificar(casos, { solo }).then((r) => {
    if (!r.resultados) { console.error(r.errores.map((e) => '✗ ' + e).join('\n')); process.exit(2); }
    for (const x of r.resultados) console.log(`${x.estado === 'pasa' ? '✓' : '✗'} ${x.id} @${x.ancho}${x.hallazgos.length ? ': ' + x.hallazgos.join('; ') : ''}`);
    console.log(`${r.estado} · resultados.json junto a ${casos}`);
    process.exit(r.estado === 'pasa' ? 0 : 1);
  }).catch((e) => { console.error('verificar: ' + e.message); process.exit(2); });
}
