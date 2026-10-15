import {activityRecords} from './wastewater-activity';
import {detectionRecords} from './wastewater-detection';
import {threats} from './wastewater-threats';
import type {RecordData} from './catalog';
export async function collectWastewater(get:(url:string)=>Promise<any>,now=new Date()){
 const retrieved=now.toISOString(),cutoff=new Date(now.getTime()-26*7*86400000).toISOString().slice(0,10),detectionCutoff=new Date(now.getTime()-8*7*86400000).toISOString().slice(0,10);
 const feeds=[{id:'activity',dataset:'atcp-73re',date:'week_end',cutoff},...threats.filter(t=>t.mode==='detection').map(t=>({id:t.id,dataset:t.dataset!,date:'sample_collect_date',cutoff:detectionCutoff}))];
 const records:RecordData[]=[],warnings:string[]=[];
 for(const feed of feeds){try{
  const rows:any[]=[];for(let offset=0;;offset+=10000){const batch=await get('https://data.cdc.gov/resource/'+feed.dataset+'.json?$where='+encodeURIComponent(feed.date+">='"+feed.cutoff+"'")+'&$order='+feed.date+'%20DESC,record_id%20ASC'.replace(',record_id%20ASC',feed.id==='activity'?',site%20ASC,pathogen_target%20ASC':',record_id%20ASC')+'&$limit=10000&$offset='+offset);if(!Array.isArray(batch))throw Error('Unexpected CDC schema');rows.push(...batch);if(batch.length<10000)break;if(offset>=190000)throw Error('CDC result exceeds safe paging limit');}
  const parsed=feed.id==='activity'?activityRecords(rows,retrieved):detectionRecords(rows,threats.find(t=>t.id===feed.id)!.target,feed.id,'https://data.cdc.gov/d/'+feed.dataset,retrieved);
  if(!parsed.length)throw Error('No valid observations in source window');records.push(...parsed);
  if(feed.id==='activity')for(const p of ['SARS-CoV-2','Influenza A','RSV'])if(!parsed.some(r=>r.details?.pathogen===p))warnings.push(p+': no valid activity observations');
 }catch(e:any){warnings.push(feed.id+': '+e.message);}}
 if(!records.length)throw Error(warnings.join('; '));
 return Object.assign(records,{warnings});
}
