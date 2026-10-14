import test from 'node:test';
import assert from 'node:assert/strict';
import {activityRecords} from '../lib/wastewater-activity.ts';
const row=(site,value,date='2026-10-03',extra={})=>({site,site_wval:value,week_end:date,state_territory:'Texas',pathogen_target:'SARS-CoV-2',...extra});
test('State median gives each reporting site one vote and retains weekly coverage',()=>{
 const records=activityRecords([row('A',2),row('B',8),row('C',20),row('D',''),row('E',-1),row('A',4,'2026-09-26')],'now');
 const state=records.find(r=>r.id==='cdc-wval:state:Texas');
 assert.deepEqual(state.details.weeks,[{date:'2026-09-26',value:4,sites:1},{date:'2026-10-03',value:8,sites:3}]);
});
test('Duplicate site-week uses latest revision; even medians average middle pair',()=>{
 const records=activityRecords([row('A',2,undefined,{date_updated:'2026-10-01'}),row('A',6,undefined,{date_updated:'2026-10-09'}),row('B',10),row('X',200,undefined,{pathogen_target:'RSV'})],'now');
 assert.equal(records.find(r=>r.id==='cdc-wval:state:Texas').value,8);
});
test('DC retains its jurisdiction and generates separate site and summary records',()=>{
 const records=activityRecords([row('A',0,undefined,{state_territory:'District of Columbia'})],'now');
 assert.equal(records.find(r=>r.id==='cdc-wval:state:District of Columbia').value,0);
 assert.equal(records.filter(r=>!r.details.aggregate).length,1);
 assert.equal(records.some(r=>r.id==='cdc-wval:state:Texas'),false);
});
