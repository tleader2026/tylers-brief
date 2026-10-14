import type {RecordData} from './catalog';
export const inProgress=(r:RecordData)=>['RECRUITING','ACTIVE_NOT_RECRUITING','ENROLLING_BY_INVITATION'].includes(r.status);
export const completionDate=(r:RecordData)=>r.details?.completion?.date||r.details?.primaryCompletion?.date||'';
export const trialInstitution=(r:RecordData)=>r.details?.sponsor?.class==='INDIV'?(r.details?.sites?.find((s:any)=>s.facility)?.facility||r.details?.sponsor?.name||'Not listed'):(r.details?.sponsor?.name||r.details?.sites?.find((s:any)=>s.facility)?.facility||'Not listed');
export function byCompletion(rows:RecordData[],today=new Date().toISOString().slice(0,10)){
 const bucket=(r:RecordData)=>!completionDate(r)?2:completionDate(r)>=today?0:1;
 return [...rows].sort((a,b)=>bucket(a)-bucket(b)||(bucket(a)===1?completionDate(b).localeCompare(completionDate(a)):completionDate(a).localeCompare(completionDate(b)))||a.title.localeCompare(b.title));
}
export function topTrials(rows:RecordData[],today=new Date().toISOString().slice(0,10)){
 const active=byCompletion(rows.filter(r=>inProgress(r)&&r.details?.studyType==='INTERVENTIONAL'));
 return [...active.filter(r=>completionDate(r)>=today),...active.filter(r=>completionDate(r)&&completionDate(r)<today),...active.filter(r=>!completionDate(r))].slice(0,10);
}
export function trialSites(rows:RecordData[]){
 return rows.flatMap(record=>(record.details?.sites||[]).filter((s:any)=>typeof s.geoPoint?.lat==='number'&&typeof s.geoPoint?.lon==='number'&&Math.abs(s.geoPoint.lat)<=90&&Math.abs(s.geoPoint.lon)<=180).map((site:any)=>({record,site})));
}
