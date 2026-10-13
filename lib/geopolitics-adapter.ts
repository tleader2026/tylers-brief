import type {RecordData} from './catalog';
import {env} from 'cloudflare:workers';
import {eventRecords,fetchPublicEvents} from './geopolitics';
import snapshot from './geopolitics-snapshot.json';
export async function geopoliticsAdapter():Promise<RecordData[]>{
 const key=(env as any).WORLDMONITOR_API_KEY;const warnings:string[]=[];
 if(key)try{const response=await fetch('https://api.worldmonitor.app/api/news/v1/list-feed-digest?variant=full&lang=en',{headers:{'X-WorldMonitor-Key':key,Accept:'application/json'},signal:AbortSignal.timeout(15000)});if(!response.ok)throw new Error('World Monitor HTTP '+response.status);const data:any=await response.json();if(!data.categories||typeof data.categories!=='object')throw new Error('World Monitor digest schema changed');const items=Object.values(data.categories).flatMap((bucket:any)=>bucket.items||[]);const rows=eventRecords(items,'World Monitor API digest');return Object.assign(rows,{apiConnected:true,message:'World Monitor API digest connected; headlines require verification.'});}catch(e:any){warnings.push(e.message);}
 const rows=await fetchPublicEvents();warnings.push(...rows.warnings);
 if(rows.length)return Object.assign(rows,{apiConnected:false,warnings,message:key?'World Monitor request unavailable; public news feeds used.':'World Monitor API key not configured; public news feeds used.'});
 const fallback=snapshot.filter(r=>Date.parse(r.date)>Date.now()-30*86400000).map(r=>({...r,status:'VERIFIED SNAPSHOT'}));
 if(!fallback.length)throw new Error('No current public feeds available. Last valid records retained.');
 return Object.assign(fallback,{apiConnected:false,warnings,message:'Dated public-feed snapshot captured '+fallback[0].retrieved.slice(0,10)+'. Live feeds unavailable; World Monitor API is not connected.'});
}
