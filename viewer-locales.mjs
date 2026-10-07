import {readFileSync} from 'node:fs';
const dictionaries=JSON.parse(readFileSync(new URL('./viewer-translations.json',import.meta.url),'utf8'));
export function localizeViewer(html,slug,lang){
 const dictionary=dictionaries[lang]||dictionaries.en;
 const translate=text=>dictionary[text]??dictionary[text.replace(/\s+/g,' ').trim()]??text;
 return html.split(/(<script>[\s\S]*?<\/script>|<style>[\s\S]*?<\/style>)/g).map(part=>{
  if(part.startsWith('<style>'))return part;
  if(part.startsWith('<script>'))return part.replace(/"([^"\n]*)"/g,(literal,value)=>dictionary[value]===undefined?literal:JSON.stringify(dictionary[value]));
  return part.replace(/>([^<>]+)</g,(_,text)=>'>'+translate(text)+'<');
 }).join('');
}
