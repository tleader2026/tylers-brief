import counties from './texas-county-centroids.json' with {type:'json'};
import type {RecordData} from './catalog';
const origin=counties.find(c=>c.name==='Bastrop')!;
function km(a:number,b:number){const rad=Math.PI/180,dy=(a-origin.lat)*rad,dx=(b-origin.lon)*rad,v=Math.sin(dy/2)**2+Math.cos(a*rad)*Math.cos(origin.lat*rad)*Math.sin(dx/2)**2;return 6371*2*Math.atan2(Math.sqrt(v),Math.sqrt(1-v));}
export function approximateDistance(r:RecordData){const d=r.details||{},raw=d.latestSourceRow||{};if(r.provider==='cdc-wval'&&r.scope!=='Texas')return Infinity;const text=String(d.counties||raw.counties_served||r.scope);const found=counties.filter(c=>new RegExp('\\b'+c.name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\b','i').test(text));return found.length?Math.min(...found.map(c=>km(c.lat,c.lon))):Infinity;}
export function nearBastrop(rows:RecordData[]){return rows.slice().sort((a,b)=>approximateDistance(a)-approximateDistance(b)||a.title.localeCompare(b.title));}
export function siteProximity(r:RecordData){const v=approximateDistance(r);return !Number.isFinite(v)?'Location distance unavailable':v<.01?'Serves Bastrop County':`≈${Math.round(v*.621371)} miles from Bastrop County reference point · county-level estimate`;}
