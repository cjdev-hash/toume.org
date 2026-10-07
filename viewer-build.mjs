import {readFileSync} from 'node:fs';
import {localizeViewer} from './viewer-locales.mjs';
export const viewerExamples={
 'technology-consulting':'toume_technology_consulting_conversation.html',
 'technology-audit':'toume_technology_audit_evidence_lens.html',
 'systems-process-mapping':'toume_systems_process_mapping_dependency_xray_v2.html',
 'workflows-pipelines':'toume_workflows_pipelines_editable_network_v2.html',
 'automation-ai':'toume_automation_ai_interactive_example.html',
 'implementation-support':'toume_quality_lift_interactive.html'
};
const escape=s=>s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
function element(html,className){
 const match=new RegExp(`<div[^>]*class="${className}"[^>]*>`).exec(html);if(!match)return '';
 const tags=/<div\b[^>]*>|<\/div>/g;tags.lastIndex=match.index;let depth=0,tag;
 while((tag=tags.exec(html))){depth+=tag[0].startsWith('</')?-1:1;if(depth===0)return html.slice(match.index,tags.lastIndex);}
 throw new Error(`Unclosed viewer element: ${className}`);
}
export function viewerDocument(slug,lang='en'){
 const file=viewerExamples[slug];if(!file)return '';
 const source=readFileSync(new URL(`./example/${file}`,import.meta.url),'utf8');
 const style=source.match(/<style>([\s\S]*?)<\/style>/)[1];
 let script=source.match(/<script>([\s\S]*?)<\/script>/)[1];
 let main=element(source,slug==='technology-audit'?'audit':'viewer');
 let controls='';
 if(slug==='technology-consulting'||slug==='technology-audit')controls=source.match(/<button[^>]*id="reset"[^>]*>[\s\S]*?<\/button>/)[0];


 if(controls)main=main.replace(/^(<div[^>]*>)/,`$1<div class="module-actions">${controls}</div>`);
 let extra=slug==='technology-consulting'?element(source,'diagnostic'):slug==='workflows-pipelines'?element(source,'metrics'):'';
 if(slug==='technology-consulting')extra=extra.replace(/(<div class="diagnosticHead">[\s\S]*?)<span>[\s\S]*?<\/span>/,'$1');
 if(slug==='technology-audit'){
  main=main.replace(/(<div class="auditHead">[\s\S]*?)<span>[\s\S]*?<\/span>/,'$1');
  main=main.replace(/<div class="footerNote">[\s\S]*?<\/div>/,'');
 }
 if(slug==='implementation-support')main=main.replace(element(main,'chartHead'),'');
 if(slug==='automation-ai'){
  main=main.replace(element(main,'modebar'),'').replace(/<div class="stage-label">[\s\S]*?<\/div>/,'');
  const side=main.match(/<aside class="side open"[\s\S]*?<\/aside>/);
  if(!side)throw new Error('Automation popup changed; review integration.');
  main=main.replace(side[0],'');extra=side[0];
  const start=script.indexOf('document.getElementById("reset")');
  if(start<0)throw new Error('Automation controls changed; review integration.');
  script=script.slice(0,start)+'document.addEventListener("keydown",event=>{if(event.key==="Escape")side.classList.remove("open");});';
 }
 if(slug==='workflows-pipelines'){
  main=main.replace(element(main,'panel'),'');
  script=script.replace(/^const (panelTitle|panelText|selectionBadge|modeBadge)=.*;\r?\n/gm,'');
  script=script.replace(/^\s*(panelTitle|panelText|selectionBadge|modeBadge)\.textContent=.*;\r?\n/gm,'');
  const start=script.indexOf('document.getElementById("editBtn")');
  const end=script.indexOf('window.addEventListener("resize",render);',start);
  if(start<0||end<0)throw new Error('Workflow controls changed; review integration.');
  script=script.slice(0,start)+script.slice(end);
  script=script.replace('v.height-n.offsetHeight-140','v.height-n.offsetHeight-8');
 }
 if(slug==='systems-process-mapping'){
  main=main.replace(element(main,'mode'),'').replace(/<text\b[^>]*>[\s\S]*?<\/text>/g,'');
  main=main.replace(/<div class="signals"[^>]*>[\s\S]*?<\/div>/,'');
  script=script.replace(/const lockBtn=[^;]+;/,'').replace(/let mode="all";/,'');
  const start=script.indexOf('document.getElementById("centerBtn")');
  const end=script.indexOf('window.addEventListener("resize",center);',start);
  if(start<0||end<0)throw new Error('Dependency lens controls changed; review integration.');
  script=script.slice(0,start)+script.slice(end);
  script=script.replace(/^.*lockBtn\.[^\n]*\n/gm,'');
 }
 const wiring=readFileSync(new URL('./viewer-wires.js',import.meta.url),'utf8');
 const override=`html,body{margin:0;padding:0;min-height:0}body{overflow-x:hidden}.viewer,.audit{width:100%;margin:0}.module-actions{position:relative;display:flex;justify-content:flex-end;gap:8px;z-index:30;margin-bottom:18px}.module-actions button{border:1px solid var(--line);border-radius:999px;padding:9px 14px;background:var(--bg);color:var(--ink);cursor:pointer;font:inherit;font-size:12px}.module-actions .actions,.module-actions .controls{display:flex;gap:8px;flex-wrap:wrap}.diagnostic,.metrics{margin:24px 0 0}.viewer:has(.thread){padding-top:20px;min-height:520px}.thread{max-height:340px;overflow-y:auto;padding-bottom:12px;margin-bottom:190px}.viewer:has(.thread) .module-actions{position:sticky;top:0}.viewer:has(.scene) .module-actions,.viewer:has(#wires) .module-actions,.viewer:has(.flow) .module-actions{position:absolute;right:18px;top:16px}.viewer:has(.scene) .mode{top:68px}.viewer:has(.flow) .stage-label{top:70px}.auditHead{padding-right:0}.audit .pipeline{padding-top:6px;margin-top:-6px}.info{grid-template-columns:1fr}.tooltip.show{pointer-events:auto}body:has(.flow)>.side{position:relative;left:auto;right:auto;top:auto;width:100%;max-height:none;margin:16px 0 0;transform:none;display:none}body:has(.flow)>.side.open{display:block}@media(max-width:640px){.viewer,.audit{border-radius:18px}.viewer{min-width:0}.module-actions{flex-wrap:wrap}.thread{max-height:400px}.viewer:has(.thread){min-height:540px}.viewer:has(.scene) .mode{top:70px}.viewer:has(.scene) .card{width:23%;padding:8px}.viewer:has(.scene) .card strong{font-size:11px}.viewer:has(.scene) .card small{font-size:9px}.viewer:has(#wires) .node{width:22%;padding:8px}.viewer:has(#wires) .node strong{font-size:12px}.viewer:has(.flow) .node{width:23%;height:auto;aspect-ratio:1}.viewer:has(.flow) .n-decision{width:28%}.viewer:has(.flow) .node strong{font-size:11px;padding:0 6px}.viewer:has(.flow) .node small{font-size:8px}.viewer:has(.flow) .modebar{left:12px;right:12px;gap:4px;flex-wrap:wrap}.viewer:has(.flow) .modebar button{padding:8px;font-size:10px}}`;
 return localizeViewer(`<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>${style}\n${override}</style></head><body>${main}${extra}<script>${script}\n${wiring}</script></body></html>`,slug,lang);
}
export function renderViewer(slug,lang){
 const html=viewerDocument(slug,lang);if(!html)return '';
 return `<section class="original-viewer" data-viewer><iframe class="original-viewer-frame" title="${slug.replaceAll('-',' ')}" srcdoc="${escape(html)}"></iframe></section>`;
}
