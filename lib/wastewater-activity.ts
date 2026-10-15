import type {RecordData} from './catalog';
export const focusStates=['California','Texas','Nevada','North Carolina','Tennessee','District of Columbia','Hawaii'];
export const activityUrl='https://data.cdc.gov/Public-Health-Surveillance/CDC-Wastewater-Viral-Activity-Level-for-SARS-CoV-2/atcp-73re';
export function activityRecords(rows:any[],retrieved:string):RecordData[]{
 const unique=new Map<string,any>();
 for(const input of rows){const r={...input,pathogen_target:input.pathogen_target==='Influenza A virus'?'Influenza A':input.pathogen_target};if(!['SARS-CoV-2','Influenza A','RSV'].includes(r.pathogen_target)||!r.site||!r.state_territory||!/^\d{4}-\d{2}-\d{2}$/.test(r.week_end))continue;const v=r.site_wval;if(v===undefined||v===null||v===''||!Number.isFinite(Number(v))||Number(v)<0)continue;const id=[r.pathogen_target,r.state_territory,r.site,r.week_end].join('|');const prior=unique.get(id);if(!prior||String(r.date_updated||'')>String(prior.date_updated||''))unique.set(id,r);}
 const result:RecordData[]=[];
 for(const pathogen of ['SARS-CoV-2','Influenza A','RSV']){
 const valid=[...unique.values()].filter(r=>r.pathogen_target===pathogen);
 const prefix=pathogen==='SARS-CoV-2'?'':pathogen==='RSV'?'rsv:':'flu-a:';
 const make=(id:string,title:string,scope:string,group:any[],aggregate:boolean)=>{
  const buckets=new Map<string,any[]>();for(const r of group)buckets.set(r.week_end,[...(buckets.get(r.week_end)||[]),r]);
  const weeks=[...buckets].sort(([a],[b])=>a.localeCompare(b)).map(([date,list])=>{const values=list.map(r=>Number(r.site_wval)).sort((a,b)=>a-b),i=Math.floor(values.length/2);return {date,value:values.length%2?values[i]:(values[i-1]+values[i])/2,sites:values.length};});
  if(!weeks.length)return;
  result.push({id:'cdc-wval:'+prefix+id,domain:'wastewater',provider:'cdc-wval',kind:aggregate?'monitored-site median':'site viral activity',title:pathogen+' · '+title,scope,url:activityUrl,units:'Wastewater viral activity level',date:weeks.at(-1)!.date,retrieved,status:'OBSERVED · MONITORED SITES',value:weeks.at(-1)!.value,series:weeks.map(({date,value})=>({date,value})),summary:aggregate?'Dashboard-calculated unweighted median of reporting sites per CDC week. Each site contributes once. This is not an official CDC statewide estimate or a population-weighted measure.':'CDC normalized weekly '+pathogen+' wastewater viral activity. Values are relative to the site baseline, not raw concentration.',details:{pathogen,metric:'activity',aggregate,weeks,geography:scope,site:group[0]?.site,counties:group[0]?.counties_served,transformation:'Uses CDC week_end; excludes missing/non-numeric activity values; deduplicates state/site/week using latest source update. Missing weeks remain gaps.',limitations:'Monitored sites may not represent all residents. Site participation and reporting vary by week; comparisons are affected by coverage. Not an infection probability.',latestSourceRow:group.at(-1)}});
 };
 for(const state of [...new Set(valid.map(r=>r.state_territory))])make('state:'+state,state+' · monitored-site aggregate',state,valid.filter(r=>r.state_territory===state),true);
 make('national','United States · monitored-site aggregate','United States',valid,true);
 make('local','Central Texas · monitored-site aggregate','Central Texas service areas',valid.filter(r=>r.state_territory==='Texas'&&/Travis|Hays|Bastrop/i.test(r.counties_served||'')),true);
 const sites=new Map<string,any[]>();for(const r of valid.filter(r=>focusStates.includes(r.state_territory))){const id=r.state_territory+':'+r.site;sites.set(id,[...(sites.get(id)||[]),r]);}
 for(const [id,group] of sites)make('site:'+id,(group[0].counties_served||group[0].state_territory)+' · '+group[0].site,group[0].state_territory,group,false);
 }
 return result;
}
