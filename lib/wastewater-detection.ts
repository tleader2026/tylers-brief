import type {RecordData} from './catalog';
const statePairs='AL:Alabama|AK:Alaska|AZ:Arizona|AR:Arkansas|CA:California|CO:Colorado|CT:Connecticut|DE:Delaware|DC:District of Columbia|FL:Florida|GA:Georgia|HI:Hawaii|ID:Idaho|IL:Illinois|IN:Indiana|IA:Iowa|KS:Kansas|KY:Kentucky|LA:Louisiana|ME:Maine|MD:Maryland|MA:Massachusetts|MI:Michigan|MN:Minnesota|MS:Mississippi|MO:Missouri|MT:Montana|NE:Nebraska|NV:Nevada|NH:New Hampshire|NJ:New Jersey|NM:New Mexico|NY:New York|NC:North Carolina|ND:North Dakota|OH:Ohio|OK:Oklahoma|OR:Oregon|PA:Pennsylvania|RI:Rhode Island|SC:South Carolina|SD:South Dakota|TN:Tennessee|TX:Texas|UT:Utah|VT:Vermont|VA:Virginia|WA:Washington|WV:West Virginia|WI:Wisconsin|WY:Wyoming|PR:Puerto Rico|VI:Virgin Islands|GU:Guam';
export const stateName=(code:string)=>Object.fromEntries(statePairs.split('|').map(s=>s.split(':')))[code.toUpperCase()]||code;
export function detectionRecords(rows:any[],pathogen:string,id:string,url:string,retrieved:string):RecordData[]{
 const unique=new Map<string,any>();
 for(const r of rows){if(!r.site||!r.state_territory||!r.sample_id||!/^\d{4}-\d{2}-\d{2}$/.test(r.sample_collect_date)||!['yes','no'].includes(r.pcr_target_detect))continue;
 const key=[r.state_territory,r.site,r.sample_id,r.pcr_target].join('|');const prior=unique.get(key);if(!prior||String(r.date_updated)>String(prior.date_updated))unique.set(key,r);}
 const grouped=new Map<string,any[]>();
 for(const r of unique.values()){const state=stateName(r.state_territory);grouped.set(state,[...(grouped.get(state)||[]),r]);}
 const result:RecordData[]=[];
 const make=(scope:string,group:any[],suffix:string,aggregate:boolean)=>{
 const buckets=new Map<string,Map<string,boolean>>();
 for(const r of group){const d=new Date(r.sample_collect_date+'T00:00:00Z');d.setUTCDate(d.getUTCDate()+(6-d.getUTCDay()));const week=d.toISOString().slice(0,10);if(!buckets.has(week))buckets.set(week,new Map());const k=r.state_territory+':'+r.site;const b=buckets.get(week)!;b.set(k,(b.get(k)||false)||r.pcr_target_detect==='yes');}
 const sourceUpdated=group.map(r=>r.date_updated).sort().at(-1);
 const weeks=[...buckets].sort(([a],[b])=>a.localeCompare(b)).map(([date,b])=>{const detected=[...b.values()].filter(Boolean).length;return {date,value:100*detected/b.size,sites:b.size,detected,partial:date>String(sourceUpdated||'').slice(0,10)};});if(!weeks.length)return;
 const latest=weeks.at(-1)!;
 result.push({id:'cdc-wval:'+id+':'+suffix,domain:'wastewater',provider:'cdc-wval',kind:'weekly site detection share',title:pathogen+' · '+scope,scope,url,date:latest.date,retrieved,status:'OBSERVED · TESTED SITES',units:'% tested sites with ≥1 detection',value:latest.value,series:weeks.map(p=>({date:p.date,value:p.value})),summary:'Dashboard calculation: sites with at least one positive target/sample divided by sites with a yes/no result in that week. Not an official CDC category or percent of people infected.',details:{pathogen,geography:scope,metric:'detection',aggregate,weeks,sourceUpdated:group.map(r=>r.date_updated).sort().at(-1),assays:[...new Set(group.map(r=>r.pcr_target))],transformation:'Deduplicate sample/target by latest update. Sunday–Saturday sample weeks; any positive makes a site positive. Unknown detection flags excluded. Clade, assay and site coverage can vary.',limitations:'No detection means no positive in the connected tests, not absence of disease. Different sampling frequency changes detection opportunity. H5 may originate from animals. Not population weighted.'}});
 };
 for(const [state,group] of grouped){make(state,group,'state:'+state,true);const sites=new Map<string,any[]>();for(const r of group)sites.set(r.site,[...(sites.get(r.site)||[]),r]);for(const [site,rs] of sites)make(state,rs,'site:'+state+':'+site,false);}
 make('United States',[...unique.values()],'national',true);
 return result;
}
