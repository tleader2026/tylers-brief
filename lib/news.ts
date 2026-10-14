import type {RecordData} from './catalog';
import snapshot from './news-snapshot.json' with {type:'json'};
export const newsTopics=[
 {id:'health',label:'Long COVID',query:'"long covid" (treatment OR trial OR research OR ensitrelvir)'},
 {id:'wastewater',label:'Wastewater',query:'COVID wastewater surveillance'},
 {id:'local',label:'Central Texas',query:'(Bastrop OR Smithville OR "Cedar Creek" OR Austin) (housing OR infrastructure OR "data center")'},
 {id:'housing',label:'Housing',query:'US housing mortgage affordability'},
 {id:'ai',label:'AI & tech',query:'(OpenAI OR Anthropic OR Nvidia OR Google OR Microsoft OR xAI OR Meta) (AI OR "artificial intelligence" OR governance)'},
 {id:'economy',label:'Economy',query:'US economy inflation purchasing power'},
 {id:'world',label:'Geopolitics',query:'geopolitics conflict strategic competition'},
 {id:'pharma',label:'Drug discovery',query:'AI drug discovery pharmaceutical'}
] as const;
function decode(s:string){return s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g,'$1').replace(/&(?:amp|lt|gt|quot|apos|#\d+|#x[0-9a-f]+);/gi,e=>{const names:any={'&amp;':'&','&lt;':'<','&gt;':'>','&quot;':'"','&apos;':"'"};if(names[e])return names[e];const n=e.startsWith('&#x')?parseInt(e.slice(3),16):parseInt(e.slice(2),10);return n>0&&n<=0x10ffff?String.fromCodePoint(n):'';}).replace(/<[^>]*>/g,'').trim();}
function tag(xml:string,name:string){return decode(xml.match(new RegExp('<'+name+'(?:\\s[^>]*)?>([\\s\\S]*?)</'+name+'>','i'))?.[1]||'');}
export function parseNews(xml:string,topic:string,now=new Date()):RecordData[]{
 const out:RecordData[]=[];
 for(const item of xml.match(/<item(?:\s[^>]*)?>[\s\S]*?<\/item>/gi)||[]){
  const publisher=tag(item,'source'),rawTitle=tag(item,'title'),url=tag(item,'link'),published=Date.parse(tag(item,'pubDate'));
  if(!rawTitle||!publisher||!Number.isFinite(published)||published>now.getTime()+300000||published<now.getTime()-30*86400000)continue;
  try{if(new URL(url).protocol!=='https:')continue;}catch{continue;}
  const title=rawTitle.endsWith(' - '+publisher)?rawTitle.slice(0,-publisher.length-3):rawTitle;
  let hash=2166136261;for(const c of url){hash=Math.imul(hash^c.charCodeAt(0),16777619);}
  const date=new Date(published).toISOString();
  out.push({id:'news:'+ (hash>>>0).toString(16),domain:'news',provider:'news',kind:'News article',title,url,scope:publisher,date,published:date,retrieved:now.toISOString(),status:'PUBLISHER REPORT',summary:'Publisher headline discovered through Google News RSS. Open the article for its reporting and context.',details:{publisher,topics:[topic],discovery:'Google News RSS',limitations:'Feed metadata only; reporting has not been independently verified.'}});
 }
 return out.sort((a,b)=>b.date.localeCompare(a.date)).slice(0,12);
}
export function mergeNews(groups:RecordData[][]){
 const unique=new Map<string,RecordData>();
 for(const r of groups.flat()){const key=r.title.toLowerCase().replace(/[^a-z0-9]/g,'');const prior=unique.get(key);if(prior)prior.details.topics=[...new Set([...prior.details.topics,...r.details.topics])];else unique.set(key,r);}
 return [...unique.values()].sort((a,b)=>b.date.localeCompare(a.date));
}
export async function newsAdapter(){
 const warnings:string[]=[];
 const groups=await Promise.all(newsTopics.map(async topic=>{
  try{const url='https://news.google.com/rss/search?'+new URLSearchParams({q:topic.query+' when:14d',hl:'en-US',gl:'US',ceid:'US:en'});const response=await fetch(url,{signal:AbortSignal.timeout(15000),headers:{Accept:'application/rss+xml, application/xml'}});if(!response.ok)throw new Error('HTTP '+response.status);const xml=await response.text();if(!xml.includes('<rss'))throw new Error('Invalid RSS response');return parseNews(xml,topic.id);}
  catch{warnings.push(topic.label+' feed unavailable');return [];}
 }));
 const rows=mergeNews(groups);if(!rows.length&&warnings.length){
  const fallback=snapshot.filter(r=>Date.parse(r.date)>Date.now()-30*86400000).map(r=>({...r,status:'VERIFIED SNAPSHOT',details:{...r.details,limitations:'Dated publisher headline snapshot. Live RSS refresh unavailable; reporting has not been independently verified.'}})) as RecordData[];
  if(!fallback.length)throw new Error('News feeds unavailable. Previously retrieved articles retained.');
  return Object.assign(fallback,{warnings});
 }
 return Object.assign(rows,{warnings});
}
