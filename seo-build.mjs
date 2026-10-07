import {renderViewer} from './viewer-build.mjs';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import vm from 'node:vm';
import {services} from './seo-content.mjs';
const origin='https://toume.org';
const escape=s=>s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
export async function buildSeo(output){
 const source=await readFile(new URL('./alternative.js',import.meta.url),'utf8');
 const story=JSON.parse(source.slice(source.indexOf('{'),source.indexOf('\nconst svg')).trim().replace(/;$/,''));
 const shell=await readFile(new URL('./alternative.html',import.meta.url),'utf8');
 const app=await readFile(new URL('./app.js',import.meta.url),'utf8');
 const formCopy=JSON.parse(app.slice(app.indexOf('{'),app.indexOf("\nlet language='en'")).trim().replace(/;$/,''));
 const urls=[];
 function servicesMenu(lang){return `<details class="services-menu"><summary>${lang==='pl'?'Co robię':'What I do'}<span aria-hidden="true">⌄</span></summary><nav class="services-popup" aria-label="${lang==='pl'?'Usługi':'Services'}">${services.map(service=>`<a href="/${lang}/${service.slug}/">${service[lang].name}</a>`).join('')}</nav></details>`;}
 function languageLinks(html,lang,slug=''){
  return html.replace(/<button type="button" data-lang="(en|pl)" aria-pressed="(?:true|false)">(EN|PL)<\/button>/g,(_all,code,label)=>`<a href="/${code}/${slug}" lang="${code}" ${code===lang?'aria-current="page"':''}>${label}</a>`);
 }
 function links(lang,slug=''){
  return `<link rel="canonical" href="${origin}/${lang}/${slug}"><link rel="alternate" hreflang="en" href="${origin}/en/${slug}"><link rel="alternate" hreflang="pl" href="${origin}/pl/${slug}"><link rel="alternate" hreflang="x-default" href="${origin}/en/${slug}">`;
 }
 function schema(lang,name,url,service=false){
  return JSON.stringify({'@context':'https://schema.org','@graph':[
   {'@type':'Person','@id':origin+'/#person',name:'Krzysztof Dębski',url:origin+`/${lang}/about/`,jobTitle:lang==='pl'?'Doradca technologiczny':'Technology consultant',email:'hello@toume.org'},
   {'@type':'WebSite','@id':origin+'/#website',name:'toumé',url:origin+'/',inLanguage:['en','pl']},
   {'@type':service?'Service':'WebPage',name,url,...(service?{provider:{'@id':origin+'/#person'}}:{inLanguage:lang,isPartOf:{'@id':origin+'/#website'}})}
  ]}).replaceAll('<','\\u003c');
 }
 function header(lang,slug){return `<header class="story-header"><a class="logo" href="/${lang}/"><img src="/logo/logo_transp_small.png" width="512" height="121" alt="toumé"></a><div class="header-right"><nav aria-label="${lang==='pl'?'Język':'Language'}"><a href="/en/${slug}" lang="en" ${lang==='en'?'aria-current="page"':''}>EN</a> / <a href="/pl/${slug}" lang="pl" ${lang==='pl'?'aria-current="page"':''}>PL</a></nav>${servicesMenu(lang)}<a href="/${lang}/contact/">${lang==='pl'?'Porozmawiajmy':'Let’s talk'} ↗</a></div></header>`;}
 async function save(lang,slug,html){const path=`${lang}/${slug}`;await mkdir(new URL(path,output),{recursive:true});await writeFile(new URL(path+'index.html',output),html);urls.push(origin+'/'+path);}
 function page(lang,slug,data,body,service=false){return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#201e1b"><title>${escape(data.title)}</title><meta name="description" content="${escape(data.intro)}">${links(lang,slug)}<meta property="og:title" content="${escape(data.title)}"><meta property="og:description" content="${escape(data.intro)}"><meta property="og:url" content="${origin}/${lang}/${slug}"><meta property="og:type" content="website"><link rel="stylesheet" href="/alternative.css"><link rel="stylesheet" href="/brand.css"><link rel="stylesheet" href="/seo.css">${service?'<link rel="stylesheet" href="/viewers.css"><script type="module" src="/viewers.js"></script>':''}<script src="/brand.js" defer></script><script src="/seo.js" defer></script><script src="/navigation.js" defer></script><script type="application/ld+json">${schema(lang,data.h1,origin+'/'+lang+'/'+slug,service)}</script></head><body class="seo-page"><a class="skip" href="#content">${lang==='pl'?'Przejdź do treści':'Skip to content'}</a>${header(lang,slug)}<main id="content" class="service-page"><p class="scene-kicker">${escape(data.name||(lang==='pl'?'O mnie':'About me'))}</p><h1>${data.h1}</h1><p class="service-lead">${data.intro}</p>${service?renderViewer(slug.replace(/\/$/,''),lang):''}${body}<section class="service-section"><h2>${lang==='pl'?'Zacznijmy od rozmowy':'Start with a conversation'}</h2><p>${lang==='pl'?'Opowiedz o celu, obecnym sposobie pracy i decyzji, przed którą stoisz. Zakres i rezultat ustalimy przed rozpoczęciem pracy.':'Tell me about your goal, current way of working and the decision you are facing. We agree on scope and deliverables before work begins.'}</p><a class="scene-link" href="/${lang}/contact/">${lang==='pl'?'Porozmawiajmy':'Let’s talk'} ↗</a></section></main><footer class="contact-footer"><span>toumé</span><a href="/${lang}/">${lang==='pl'?'Strona główna':'Home'}</a></footer></body></html>`;}
 for(const lang of ['en','pl']){
  const elements=new Map();const el=key=>{if(!elements.has(key))elements.set(key,{style:{},setAttribute(){},getAttribute(){},addEventListener(){},querySelector:selector=>el(key+selector),classList:{toggle(){}}});return elements.get(key);};
  const context={document:{documentElement:{},querySelector:el,querySelectorAll:()=>[]},localStorage:{getItem:()=>lang},location:{pathname:`/${lang}/`,hash:''},window:{addEventListener(){}},IntersectionObserver:class{observe(){}disconnect(){}},matchMedia:()=>({matches:false})};
  vm.runInNewContext(source,context,{timeout:2000});
  let home=shell.replace('<html lang="en">',`<html lang="${lang}">`).replace('<main id="story" tabindex="-1"></main>',`<main id="story" tabindex="-1">${el('#story').innerHTML}</main>`);
  home=home.replace(/<title>.*?<\/title>/,`<title>${story[lang].title}</title>`).replace(/(<meta name="description" content=")[^"]*/,`$1${escape(story[lang].scenes[0].description)}`);
  home=home.replace('<head>','<head>\n'+links(lang)+'<link rel="stylesheet" href="/seo.css">').replace('</head>',`<script type="application/ld+json">${schema(lang,story[lang].title,origin+'/'+lang+'/')}</script></head>`);
  home=home.replace(/<noscript>[\s\S]*?<\/noscript>/,'').replace('id="story"','id="story" data-prerendered="true"');
  home=home.replaceAll('href="alternative.html',`href="/${lang}/`).replaceAll('href="index.html',`href="/${lang}/`).replaceAll('href="contact.html',`href="/${lang}/contact/`);
  home=home.replace(/(src|href)="(alternative\.(?:js|css)|brand\.(?:js|css)|ja\.png|logo\/[^" ]+)"/g,'$1="/$2"').replaceAll('srcset="logo/','srcset="/logo/').replaceAll(', logo/',', /logo/');
  home=home.replace('<a class="contact-link"',servicesMenu(lang)+'<a class="contact-link"');
  home=home.replace('</head>','<script src="/navigation.js" defer></script></head>');
  home=home.replace('</head>',`<noscript><style>.scene-info{display:block!important}.info-toggle,.person-toggle{display:none!important}.scene-copy,.diagram{animation:none!important}</style></noscript></head>`);
  if(lang==='pl')home=home.replace('>Let’s talk<','>Porozmawiajmy<').replace('>Skip to content<','>Przejdź do treści<').replace('>Back<','>Wstecz<').replace('>Next<','>Dalej<');
  home=languageLinks(home,lang);
  await save(lang,'',home);
  for(const service of services){const t=service[lang];await save(lang,service.slug+'/',page(lang,service.slug+'/',t,t.sections.map(([h,p])=>`<section class="service-section"><h2>${h}</h2><p>${p}</p></section>`).join(''),true));}
  const t=story[lang];await save(lang,'about/',page(lang,'about/',{title:lang==='pl'?'Krzysztof Dębski: doradca technologiczny | toumé':'Krzysztof Dębski: Technology Consultant | toumé',h1:'Krzysztof Dębski',intro:t.person.description},`<img class="about-photo" src="/ja.png" width="1254" height="1254" alt="Krzysztof Dębski"><section class="service-section"><h2>${t.personLabel}</h2><p>${t.person.supporting}</p><p>${t.person.aside}</p></section>${t.experience.map(e=>`<section class="service-section"><h2>${e.title}</h2><p>${e.description}</p></section>`).join('')}`));
  const contactFunction=app.slice(app.indexOf('function contact(t)'),app.indexOf('\nfunction render',app.indexOf('function contact(t)')));
  const form=vm.runInNewContext(`const sentReference=null;const language=${JSON.stringify(lang)};${contactFunction}\ncontact(${JSON.stringify(formCopy[lang])})`,{}, {timeout:2000});
  let contact=await readFile(new URL('./contact.html',import.meta.url),'utf8');contact=contact.replace('<html lang="en">',`<html lang="${lang}">`).replace('<main id="main"></main>',`<main id="main">${form}</main>`).replace('<head>','<head>'+links(lang,'contact/')).replaceAll('href="alternative.html#services',`href="/${lang}/#services`).replaceAll('href="alternative.html',`href="/${lang}/`).replace(/(src|href)="(app\.js|alternative\.css|brand\.(?:css|js)|logo\/[^" ]+)"/g,'$1="/$2"').replaceAll('srcset="logo/','srcset="/logo/').replaceAll(', logo/',', /logo/');
  contact=contact.replace(/<title>.*?<\/title>/,`<title>${formCopy[lang].navContact} | toumé</title>`).replace(/(<meta name="description" content=")[^"]*/,`$1${escape(formCopy[lang].contactIntro)}`);
  contact=languageLinks(contact,lang,'contact/');
  contact=contact.replace('<a class="contact-link"',servicesMenu(lang)+'<a aria-label="'+formCopy[lang].backStory+'" class="contact-link"').replace('</head>','<link rel="stylesheet" href="/seo.css"><script src="/navigation.js" defer></script></head>');
  for(const key of ['skip','backStory','footerLine'])contact=contact.replace(new RegExp(`(data-i18n="${key}"[^>]*>)[^<]*`),`$1${formCopy[lang][key]}`);
  await save(lang,'contact/',contact);
 }
 let root=await readFile(new URL('en/index.html',output),'utf8');await writeFile(new URL('index.html',output),root);
 await writeFile(new URL('sitemap.xml',output),'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+urls.map(url=>`<url><loc>${url}</loc></url>`).join('')+'</urlset>');
 await writeFile(new URL('robots.txt',output),'User-agent: *\nAllow: /\nSitemap: https://toume.org/sitemap.xml\n');
 return urls;
}
