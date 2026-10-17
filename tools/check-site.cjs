// Dependency-free checks for the static portfolio before GitHub Pages publishing.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '../public');
const failures = [];
const pages = [path.join(root, 'index.html'), ...fs.readdirSync(path.join(root, 'projects')).map(dir => path.join(root, 'projects', dir, 'index.html')).filter(p => fs.existsSync(p))];
function localLink(from, value) {
  if (!value || /^(?:[a-z][a-z\d+.-]*:|#|\/\/)/i.test(value)) return;
  const clean = decodeURIComponent(value.split(/[?#]/)[0]);
  const file = path.resolve(path.dirname(from), clean);
  if (!file.startsWith(root + path.sep) || !fs.existsSync(file)) failures.push(`Enlace local inválido: ${path.relative(root, from)} -> ${clean}`);
}
for (const file of pages) {
  const html = fs.readFileSync(file, 'utf8');
  const csp = html.match(/http-equiv="Content-Security-Policy" content="([^"]+)"/)?.[1];
  if (!csp || !csp.includes("object-src 'none'") || !csp.includes("base-uri 'none'")) failures.push(`Falta CSP: ${file}`);
  if (/\son(?:click|load|error|submit|change)\s*=/i.test(html)) failures.push(`Evento inline incompatible con CSP: ${file}`);
  for (const match of html.matchAll(/\b(?:src|href|poster)="([^"]+)"/g)) localLink(file, match[1]);
  for (const match of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)) {
    if (match[1].includes('src=') || !match[2].trim()) continue;
    const hash = crypto.createHash('sha256').update(match[2]).digest('base64');
    if (!csp?.includes(`'sha256-${hash}'`)) failures.push(`Script inline sin hash autorizado: ${file}`);
  }
}
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'assets/projects.js'), 'utf8'), context);
const projects = context.window.PORTFOLIO_PROJECTS;
if (new Set(projects.map(p => p.id)).size !== projects.length) failures.push('Hay IDs de proyecto duplicados');
for (const p of projects) {
  if (p.lifecycle && !context.window.PORTFOLIO_LIFECYCLES[p.lifecycle]) failures.push(`Estado desconocido: ${p.id}`);
  for (const link of [p.cover, p.demo, p.caseStudy, ...(p.demos || []).map(d => d.url), ...(p.media || []).flatMap(m => [m.src, m.poster])]) localLink(pages[0], link);
}
let filesChecked = 0;
const secretPatterns = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /\bgh[pousr]_[A-Za-z0-9]{30,}\b/,
  /\bgithub_pat_[A-Za-z0-9_]{60,}\b/,
  /\bAKIA[A-Z0-9]{16}\b/,
  /\bsk-(?:proj-|svcacct-)?[A-Za-z0-9_-]{40,}\b/,
  /\bsk_live_[A-Za-z0-9]{20,}\b/
];
function scan(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) { scan(file); continue; }
    if (/^(?:\.env(?:\..*)?|id_rsa|id_ed25519)$/i.test(entry.name) || /\.(?:pem|key|p12|pfx|blend|zip|sqlite|db)$/i.test(entry.name)) failures.push(`Archivo privado en public/: ${path.relative(root, file)}`);
    if (!/\.(?:html?|js|mjs|cjs|json|txt|css|xml)$/i.test(entry.name)) continue;
    const source = fs.readFileSync(file, 'utf8');
    filesChecked++;
    if (secretPatterns.some(pattern => pattern.test(source))) failures.push(`Posible credencial en: ${path.relative(root, file)}`);
    for (const token of source.matchAll(/eyJ[A-Za-z0-9_-]+\.([A-Za-z0-9_-]+)\.[A-Za-z0-9_-]+/g)) {
      try {
        const payload = JSON.parse(Buffer.from(token[1], 'base64url').toString());
        if (payload.role === 'service_role') failures.push(`Token de servicio en: ${path.relative(root, file)}`);
      } catch {}
    }
  }
}
scan(root);
if (failures.length) {
  console.error([...new Set(failures)].join('\n'));
  process.exitCode = 1;
} else console.log(`OK: ${pages.length} páginas, ${projects.length} proyectos; enlaces, CSP y ${filesChecked} archivos de texto revisados. No se detectaron patrones de credenciales privadas.`);
