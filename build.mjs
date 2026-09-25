import { mkdir, readFile, writeFile, copyFile, readdir } from 'node:fs/promises';
import assert from 'node:assert/strict';

// Only these files are published. Briefs, tooling, and the classic design stay out.
const assets = ['alternative.css', 'alternative.js', 'app.js', 'ja.png', 'CNAME', 'thanks.html', 'thanks.js'];
const output = new URL('./dist/', import.meta.url);
await mkdir(output, { recursive: true });
const expected = new Set([...assets, 'index.html', 'contact.html', 'alternative.html', '.nojekyll']);
for (const file of await readdir(output)) {
  assert.ok(expected.has(file), `Unexpected file in dist: ${file}. Review it before deploying.`);
}
for (const file of assets) await copyFile(new URL(file, import.meta.url), new URL(file, output));
for (const [source, target] of [['alternative.html', 'index.html'], ['contact.html', 'contact.html']]) {
  let html = await readFile(new URL(source, import.meta.url), 'utf8');
  html = html.replaceAll('href="alternative.html', 'href="index.html');
  html = html.replace('</head>', `  <link rel="canonical" href="https://toume.org/${target === 'index.html' ? '' : target}">\n</head>`);
  if (target === 'index.html') html = html.replace(/<noscript>[\s\S]*?<\/noscript>/, '<noscript><p class="no-script">toumé — Doradztwo technologiczne / Technology consulting.<br>Włącz JavaScript, aby poznać ofertę i przygotować zapytanie.<br>Enable JavaScript to explore the website and prepare an enquiry.</p></noscript>');
  await writeFile(new URL(target, output), html);
}
// Preserve old preview bookmarks without publishing a second homepage.
await writeFile(new URL('alternative.html', output), '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="robots" content="noindex"><title>toumé</title><script>location.replace("./"+location.search+location.hash)</script><a href="./">toumé</a></html>');
await writeFile(new URL('.nojekyll', output), '');
const homepage = await readFile(new URL('index.html', output), 'utf8');
assert.ok(homepage.includes('id="story"'), 'The guided design must be the homepage.');
assert.equal((await readFile(new URL('CNAME', output), 'utf8')).trim(), 'toume.org');
console.log('Built dist/: guided homepage, contact page, assets, and toume.org configuration.');
