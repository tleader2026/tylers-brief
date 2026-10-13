import { getDb } from '../db';
import {records,history,runs} from '../db/schema';
import {eq} from 'drizzle-orm';
import {RecordData,seriesConfig} from './catalog';
import fredSnapshot from './fred-snapshot.json';
import {sourceChanges} from './changes';
import {newsAdapter} from './news';
import {activityRecords} from './wastewater-activity';
import activitySnapshot from './wastewater-activity-snapshot.json';
import {geopoliticsAdapter} from './geopolitics-adapter';
export async function activityAdapter():Promise<RecordData[]>{
 try{const cutoff=new Date(Date.now()-26*7*86400000).toISOString().slice(0,10);const where=encodeURIComponent("pathogen_target='SARS-CoV-2' AND week_end>='"+cutoff+"'");const rows=await retrieve('https://data.cdc.gov/resource/atcp-73re.json?$where='+where+'&$order=week_end%20DESC&$limit=50000');if(!Array.isArray(rows)||rows.length>=50000)throw new Error('Unexpected or truncated CDC activity response');const records=activityRecords(rows,timestamp());if(!records.length)throw new Error('No valid activity rows');return records;}
 catch{return (activitySnapshot as RecordData[]).map(r=>({...r,status:'VERIFIED SNAPSHOT',summary:'Dated CDC snapshot; runtime refresh unavailable. '+r.summary}));}
}
async function retrieve(url:string,json=true):Promise<any>{
 let failure:any;
 for(let attempt=0;attempt<2;attempt++){
  try{const response=await fetch(url,{headers:{Accept:json?'application/json':'text/csv','User-Agent':'SignalCommandCenter/1.0'},signal:AbortSignal.timeout(18000)});if(!response.ok)throw new Error(`Source returned HTTP ${response.status}`);return json?await response.json():await response.text();}catch(e){failure=e;}
 }
 throw failure;
}
const timestamp=()=>new Date().toISOString();
export async function trialsAdapter():Promise<RecordData[]>{
 const queries=['query.cond=Long%20COVID','query.term=ensitrelvir'];
 const datasets=await Promise.all(queries.map(q=>retrieve(`https://clinicaltrials.gov/api/v2/studies?${q}&pageSize=100&format=json&sort=LastUpdatePostDate:desc`)));
 const found=new Map<string,RecordData>();
 for(const data of datasets)for(const study of data.studies||[]){
  const p=study.protocolSection,id=p.identificationModule?.nctId;if(!id)continue;
  const status=p.statusModule||{},design=p.designModule||{},contacts=p.contactsLocationsModule||{};
  found.set(id,{id,domain:'trials',kind:'registry',title:p.identificationModule.briefTitle,provider:'trials',url:`https://clinicaltrials.gov/study/${id}`,scope:'Global registry; location coverage as listed',date:status.lastUpdatePostDateStruct?.date||'',retrieved:timestamp(),status:status.overallStatus||'UNKNOWN',summary:p.descriptionModule?.briefSummary||'No registry summary available.',details:{officialTitle:p.identificationModule.officialTitle,interventions:p.armsInterventionsModule?.interventions||[],conditions:p.conditionsModule?.conditions||[],phase:design.phases||[],studyType:design.studyType,enrollment:design.enrollmentInfo,design:design.designInfo,sponsor:p.sponsorCollaboratorsModule?.leadSponsor,eligibility:p.eligibilityModule,sites:contacts.locations||[],contacts:contacts.centralContacts||[],primaryCompletion:status.primaryCompletionDateStruct,completion:status.completionDateStruct,endpoints:p.outcomesModule,hasResults:study.hasResults,results:study.resultsSection||null,references:p.referencesModule}});
 }
 return [...found.values()];
}
export async function pubmedAdapter():Promise<RecordData[]>{
 const search=await retrieve('https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=%22long%20covid%22%20AND%20(treatment%20OR%20trial%20OR%20biomarker)&sort=pub_date&retmax=30&retmode=json');
 const ids=search.esearchresult?.idlist||[];if(!ids.length)return [];
 const result=await retrieve(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${ids.join(',')}&retmode=json`);
 return ids.map((id:string)=>{const p=result.result[id];return {id:`pubmed:${id}`,domain:'research',kind:'publication metadata',title:p.title,provider:'pubmed',url:`https://pubmed.ncbi.nlm.nih.gov/${id}/`,scope:'Population must be verified in full study',date:p.pubdate||'',published:p.pubdate,retrieved:timestamp(),status:'METADATA ONLY',summary:`${p.fulljournalname||p.source}. Indexed publication; study design, effect size, adverse events and limitations require full-text review.`,details:{authors:p.authors,journal:p.fulljournalname,publicationTypes:p.pubtype,identifiers:p.articleids,reviewStatus:'Unreviewed; indexing does not establish clinical benefit'}};});
}
export async function fredAdapter():Promise<RecordData[]>{
 const data=await Promise.allSettled(seriesConfig.map(async([id,title,domain,units,scope])=>{
  const raw=await retrieve(`https://fred.stlouisfed.org/graph/fredgraph.csv?id=${id}&cosd=1996-01-01`,false) as string;
  if(!raw.startsWith('observation_date,')&&!raw.startsWith('DATE,'))throw new Error('Unexpected FRED CSV schema');
  const points=raw.trim().split('\n').slice(1).map(row=>{const [date,text]=row.trim().split(',');return {date,value:text&&text!=='.'&&Number.isFinite(Number(text))?Number(text):null};}).filter(x=>/^\d{4}-\d{2}-\d{2}$/.test(x.date));
  const latest=points.filter(x=>x.value!==null).at(-1);if(!latest)throw new Error('No valid observations');
  return {id:`fred:${id}`,title,domain,kind:'observed series',provider:'fred',url:`https://fred.stlouisfed.org/series/${id}`,scope,units,date:latest.date,retrieved:timestamp(),status:'OBSERVED',value:latest.value,series:points.filter(x=>x.date>='1996-01-01'),summary:'Published source series. Latest observation date differs from refresh time. Revisions are possible; use source definitions before comparison.',details:{seriesId:id,transformation:'CSV parsed; missing observations preserved as null; series displayed from 1996.',definition:scope,license:'Source attribution retained; review source-specific redistribution terms.'}} as RecordData;
 }));
 const successful=data.flatMap((x,i)=>x.status==='fulfilled'?[x.value]:[(fredSnapshot as RecordData[]).find(r=>r.id==='fred:'+seriesConfig[i][0])!]).filter(Boolean);
 // Preserve per-series failures in the provider run without deleting last valid data.
 (successful as any).warnings=data.flatMap((x,i)=>x.status==='rejected'?[`${seriesConfig[i][0]}: ${String(x.reason?.message||x.reason)}`]:[]);
 return successful;
}
export async function cdcAdapter():Promise<RecordData[]>{
 const rows=await retrieve('https://data.cdc.gov/resource/j9g8-acpt.json?$where=state_territory%3D%27tx%27&$order=sample_collect_date%20DESC&$limit=1000');
 if(!Array.isArray(rows))throw new Error('Unexpected CDC response');
 const groups=new Map<string,any[]>();
 for(const r of rows){if(!r.sample_collect_date||!r.site||!r.pcr_target_units)throw new Error('CDC schema changed; adapter requires review');const group=[r.site,r.pcr_target,r.pcr_target_units,r.sample_matrix,r.major_lab_method].join(':');groups.set(group,[...(groups.get(group)||[]),r]);}
 return [...groups.entries()].map(([id,group])=>{const latest=group[0];const points=new Map<string,number|null>();for(const r of group.slice().reverse()){const raw=r.pcr_target_avg_conc;points.set(r.sample_collect_date,raw!==undefined&&Number.isFinite(Number(raw))?Number(raw):null);}const series=[...points].map(([date,value])=>({date,value})).sort((a,b)=>a.date.localeCompare(b.date));
  return {id:`cdc:${id}`,domain:'wastewater',kind:'raw concentration',title:`${latest.counties_served||'Texas'} · site ${latest.site}`,provider:'cdc',url:'https://data.cdc.gov/Public-Health-Surveillance/CDC-Wastewater-Data-for-SARS-CoV-2/j9g8-acpt',scope:`Texas site ${latest.site}; counties served: ${latest.counties_served||'not provided'}; source-listed service area, not county-wide`,date:latest.sample_collect_date,retrieved:timestamp(),status:'OBSERVED · LIMITED WINDOW',units:latest.pcr_target_units,value:series.at(-1)?.value,series,summary:'Raw SARS-CoV-2 concentration; not an activity category or individual infection probability. Only the latest 1,000 Texas source rows are retrieved. Sampling matrices and laboratory methods are grouped separately; duplicate same-day values use the last returned row. No cross-site aggregation or normalization is performed.',details:{latestSourceRow:latest,returnedObservations:group.length,transformation:'Grouped by site, PCR target, units, matrix and major lab method; missing concentration remains null.',limitations:'Partial source window; source revisions and reporting lag; geographic representativeness must be verified.'}} as RecordData;});
}
export async function refreshSources(only?:'news'|'cdc-wval'|'worldmonitor',force=false){
 const db=getDb(); const adapters=[['trials',trialsAdapter],['pubmed',pubmedAdapter],['fred',fredAdapter],['cdc',cdcAdapter],['cdc-wval',activityAdapter],['news',newsAdapter],['worldmonitor',geopoliticsAdapter]] as const;
 return Promise.all(adapters.filter(([provider])=>!only||provider===only).map(async([provider,adapter])=>{
  const previous=await db.select().from(runs).where(eq(runs.provider,provider));const oldRun=previous[0]?JSON.parse(previous[0].value):{};
  const hours=provider==='news'||provider==='worldmonitor'?1:(provider==='cdc'||provider==='cdc-wval')?168:24;
  if(!force&&oldRun.success&&Date.now()-Date.parse(oldRun.success)<hours*3600000)return {provider,...oldRun,cached:true};
  try{
   const rows=await adapter();const old=await db.select().from(records).where(eq(records.provider,provider));const byId=new Map(old.map(r=>[r.id,JSON.parse(r.value)]));
   for(const record of rows){
    const prior=byId.get(record.id);const diff=sourceChanges(prior,record);
    if(prior&&record.status==='VERIFIED SNAPSHOT'&&prior.retrieved>record.retrieved)continue;
    if(provider==='news'){delete record.change;}
    else if(!prior&&oldRun.success){record.change={at:timestamp(),fields:['new source record'],before:null,after:{title:record.title,date:record.date,status:record.status}};}
    else if(prior&&diff){
      record.change={at:timestamp(),...diff};
      await db.insert(history).values({id:crypto.randomUUID(),recordId:record.id,value:JSON.stringify(prior),observed:timestamp()});
    }else if(prior?.change)record.change=prior.change;
    await db.insert(records).values({id:record.id,domain:record.domain,provider,value:JSON.stringify(record),retrieved:record.retrieved}).onConflictDoUpdate({target:records.id,set:{value:JSON.stringify(record),retrieved:record.retrieved}});
   }
   const snapshotOnly=rows.length>0&&rows.every(r=>r.status==='VERIFIED SNAPSHOT');
   const run={status:snapshotOnly?'snapshot':(rows as any).warnings?.length?'partial':'connected',success:snapshotOnly?rows[0].retrieved:timestamp(),attempt:timestamp(),count:rows.length,warnings:(rows as any).warnings||[],apiConnected:(rows as any).apiConnected,message:(rows as any).message||(snapshotOnly?'Runtime refresh unavailable. Dated verified source snapshots retained.':rows.length?'Source records persisted.':'Source returned no matching records.')};
   await db.insert(runs).values({provider,value:JSON.stringify(run)}).onConflictDoUpdate({target:runs.provider,set:{value:JSON.stringify(run)}});return {provider,...run};
  }catch(e:any){const run={...oldRun,status:'error',attempt:timestamp(),message:String(e.message||e)};await db.insert(runs).values({provider,value:JSON.stringify(run)}).onConflictDoUpdate({target:runs.provider,set:{value:JSON.stringify(run)}});return {provider,...run};}
 }));
}
