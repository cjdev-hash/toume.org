import {readFile,access} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {services} from './seo-content.mjs';
import {viewerExamples,viewerDocument} from './viewer-build.mjs';
import vm from 'node:vm';
for(const service of services){
 const original=await readFile(new URL(`example/${viewerExamples[service.slug]}`,import.meta.url),'utf8');
 for(const lang of ['en','pl']){
  const html=await readFile(new URL(`dist/${lang}/${service.slug}/index.html`,import.meta.url),'utf8');
  assert(html.includes('data-viewer')&&html.includes('/viewers.js')&&html.includes('/viewers.css'));
  const embedded=html.match(/srcdoc="([\s\S]*?)"/)[1].replaceAll('&quot;','"').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&');
  assert.equal(embedded,viewerDocument(service.slug,lang));
  assert(embedded.includes(`<html lang="${lang}">`));
  assert(!embedded.includes('<h1')&&!embedded.includes('class="brand"')&&!embedded.includes('class="copy"'),'Embed only the viewer and dependent panels');
  const script=embedded.match(/<script>([\s\S]*?)<\/script>/)[1];
  new vm.Script(script,{filename:service.slug+'-'+lang});
  for(const match of script.matchAll(/getElementById\("([^"]+)"\)/g))assert(embedded.includes(`id="${match[1]}"`),`${service.slug}: missing interaction dependency ${match[1]}`);
  if(lang==='en'){
   const content=embedded.replace(/<style>[\s\S]*?<\/style>/g,'');
   assert(!/[\u0105\u0107\u0119\u0142\u0144\u00f3\u015b\u017a\u017c\u0104\u0106\u0118\u0141\u0143\u00d3\u015a\u0179\u017b]/.test(content),service.slug+': untranslated Polish text');
  }
  if(service.slug==='workflows-pipelines'){assert(!embedded.includes('id="editBtn"')&&!embedded.includes('id="resetBtn"'));assert(!embedded.includes('class="panel"')&&!embedded.includes('id="modeBadge"'));}
  if(service.slug==='automation-ai'){
   assert(!embedded.includes('class="modebar"')&&!embedded.includes('class="stage-label"')&&!embedded.includes('id="reset"'));
   const body=embedded.match(/<body>([\s\S]*?)<script>/)[1];
   assert(body.includes('</div><aside class="side open"'),'Automation popup must be outside the bubble canvas');
  }
  if(service.slug==='technology-consulting'){
   assert(embedded.indexOf('class="module-actions"')<embedded.indexOf('class="thread"'));
   assert(script.includes(lang==='en'?'Hi. What brings you here today?':'Cze\u015b\u0107. Z czym dzi\u015b przychodzisz?'));
   assert(embedded.includes('class="diagnostic"'));
  }
 }
}
const wiring=await readFile(new URL('./viewer-wires.js',import.meta.url),'utf8');
const boundarySource=wiring.slice(wiring.indexOf(' function boundary('),wiring.indexOf(' const root='));
const boundary=vm.runInNewContext(boundarySource+';boundary');
const circle=boundary({left:0,top:0,width:100,height:100},{x:150,y:50},true);
assert(Math.abs(circle.x-100)<1e-6&&Math.abs(circle.y-50)<1e-6,'Connection must end at circle perimeter');
const rectangle=boundary({left:10,top:20,width:120,height:80},{x:300,y:60},false,18);
assert(Math.abs(rectangle.x-130)<1e-6,'Connection must end at frame perimeter');
const corner=boundary({left:0,top:0,width:100,height:100},{x:150,y:150},false,20);
assert(Math.abs(Math.hypot(corner.x-80,corner.y-80)-20)<1e-6,'Diagonal connection must end at rounded corner');
const root=new URL('./dist/',import.meta.url);
const sitemap=await readFile(new URL('sitemap.xml',root),'utf8');
const urls=[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);
assert.equal(urls.length,2*(services.length+3));
for(const url of urls){
 const path=new URL(url).pathname;const lang=path.split('/')[1];const html=await readFile(new URL(path.slice(1)+'index.html',root),'utf8');
 assert(html.includes(`<html lang="${lang}">`),url);
 assert.equal((html.match(/<h1(?:\s|>)/g)||[]).length,1,url+' needs one H1');
 assert(html.includes(`<link rel="canonical" href="${url}">`),url);
 assert(html.includes('hreflang="en"')&&html.includes('hreflang="pl"')&&html.includes('hreflang="x-default"'),url);
 assert(!html.includes('undefined'),url);
 assert.equal((html.match(/class="services-menu"/g)||[]).length,1,url+' needs one header services menu');
 assert(!html.includes('class="service-navigation"'),url+' should not repeat services at the bottom');
 if(path===`/${lang}/`){assert(!html.includes('<figcaption>'),url+' should not show diagram captions');assert(html.includes('<strong>UADIR</strong>:'),url+' keeps the UADIR caption');}
 for(const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g))JSON.parse(match[1]);
 for(const match of html.matchAll(/(?:href|src)="([^"<>]+)"/g)){
  const ref=match[1];if(!ref.startsWith('/'))continue;
  let target=new URL(ref,'https://toume.org').pathname.slice(1);if(!target||target.endsWith('/'))target+='index.html';
  await access(new URL(target,root));
 }
}
assert.equal((await readFile(new URL('google4ac4dc9bc8f1ae26.html',root),'utf8')).trim(),'google-site-verification: google4ac4dc9bc8f1ae26.html');
assert((await readFile(new URL('robots.txt',root),'utf8')).includes('Sitemap: https://toume.org/sitemap.xml'));
console.log(`SEO verified: ${urls.length} localized pages, H1, canonical, hreflang, JSON-LD, internal links, sitemap and Google verification file.`);

