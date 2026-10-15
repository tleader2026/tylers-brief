import test from 'node:test';
import assert from 'node:assert/strict';
import {drugPrograms,drugSources} from '../lib/drug-discovery-data.ts';
import {uniquePrograms,stageSnapshot,phaseCohort,cohortRates,medianIntervals} from '../lib/drug-discovery-model.ts';
test('canonical assets retain aliases and failures without multiplying roles or trials',()=>{
 const rows=uniquePrograms(drugPrograms);assert.equal(rows.length,8);assert.equal(rows.filter(p=>p.status==='Discontinued').length,2);
 assert.throws(()=>uniquePrograms([...rows,rows[0]]));assert.throws(()=>uniquePrograms([{...rows[0],roles:[...rows[0].roles,rows[0].roles[0]]}]));
 assert.equal(uniquePrograms([{...rows[0],roles:['Trial operations only']}]).length,0);
 for(const p of rows){assert.ok(drugSources.some(s=>s.id===p.source));for(const e of p.events)assert.ok(drugSources.some(s=>s.id===e.source));}
});
test('historical snapshots conserve the selected panel and exclude future or forecast events',()=>{
 for(const d of ['2020-01-01','2022-12-31','2025-12-31','2026-10-15']){const r=stageSnapshot(drugPrograms,d);assert.equal(Object.entries(r).filter(([k])=>k!=='date').reduce((n,[,v])=>n+Number(v),0),8);}
 assert.equal(stageSnapshot(drugPrograms,'2020-01-01').Unknown,8);
 const p={...drugPrograms[0],events:[{date:'2020-01-01',stage:'Phase III',kind:'Forecast',source:'rent3',text:'Hypothetical future milestone',forecast:true}]};assert.equal(stageSnapshot([p],'2026-10-15').Unknown,1);
 assert.equal(stageSnapshot(drugPrograms,'2026-10-15').Discontinued,2);
});
test('phase cohorts retain unresolved entrants, censor at cutoff, and do not count multi-phase labels as advancement',()=>{
 const r=phaseCohort(drugPrograms,'Phase II','2022-01-01','2025-12-31','2026-10-15');assert.equal(r.length,4);
 assert.deepEqual(cohortRates(r).map(x=>x.count),[1,2,1]);
 assert.equal(phaseCohort(drugPrograms,'Phase II','2022-01-01','2025-12-31','2024-12-31').filter(r=>r.outcome==='Advanced').length,0);
 assert.equal(r.find(x=>x.id==='rec2282').outcome,'Discontinued');assert.equal(cohortRates([])[0].percent,null);
 const p={...drugPrograms[0],events:[{date:'2023-01-01',stage:'Phase II',kind:'Start',source:'rent3',text:'Observed'}, {date:'2024-01-01',stage:'Phase III',kind:'Forecast',source:'rent3',text:'Forecast',forecast:true}]};assert.equal(phaseCohort([p],'Phase II','2022-01-01','2025-12-31','2026-10-15')[0].outcome,'Unresolved');
});
test('paired duration calculations exclude missing, malformed and reversed intervals',()=>{
 assert.deepEqual(medianIntervals([{start:null,end:'2025-01-01'},{start:'bad',end:'2025-01-01'},{start:'2025-01-02',end:'2025-01-01'}]),{n:0,days:null});
 assert.deepEqual(medianIntervals([{start:'2025-01-01',end:'2025-01-11'},{start:'2025-01-01',end:'2025-01-21'}]),{n:2,days:15});
});
