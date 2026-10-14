import test from 'node:test';
import assert from 'node:assert/strict';
import {byCompletion,topTrials,trialSites} from '../lib/trials-view.ts';
const row=(id,date,status='RECRUITING',studyType='INTERVENTIONAL')=>({id,title:id,status,details:{completion:{date},studyType}});
test('Registry soonest first with unknown completion last',()=>assert.deepEqual(byCompletion([row('later','2027-01'),row('unknown',''),row('soon','2026-11')]).map(r=>r.id),['soon','later','unknown']));
test('Upcoming completions precede past dates and unknown dates',()=>assert.deepEqual(byCompletion([row('past','2024-01'),row('soon','2026-11'),row('unknown','')],'2026-10-12').map(r=>r.id),['soon','past','unknown']));
test('Top tiles show only ongoing interventions and prioritize upcoming dates',()=>{const rows=[row('completed','2026-10','COMPLETED'),row('observational','2026-11','RECRUITING','OBSERVATIONAL'),row('overdue','2026-01'),row('next','2026-11'),...Array.from({length:12},(_,i)=>row('other'+i,'2027-01'))];const top=topTrials(rows,'2026-10-12');assert.equal(top.length,10);assert.equal(top[0].id,'next');assert.ok(!top.some(r=>['completed','observational','overdue'].includes(r.id)));});
test('Map accepts valid registry coordinates and excludes missing or impossible positions',()=>{const r={...row('one','2027'),details:{sites:[{geoPoint:{lat:30,lon:-97}},{geoPoint:{lat:200,lon:0}},{}]}};assert.equal(trialSites([r]).length,1);});
