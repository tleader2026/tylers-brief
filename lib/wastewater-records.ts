import snapshot from './wastewater-multi-snapshot.json';
import type {RecordData} from './catalog';
export function wastewaterWithSnapshot(records:RecordData[]){
 const byId=new Map<string,RecordData>();
 for(const r of [...snapshot.records.map(r=>({...r,status:'VERIFIED SNAPSHOT'})),...records]){const prior=byId.get(r.id);if(!prior||r.retrieved>prior.retrieved)byId.set(r.id,r as RecordData);}
 return [...byId.values()];
}
