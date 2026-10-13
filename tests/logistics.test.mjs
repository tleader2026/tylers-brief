import test from 'node:test';import assert from 'node:assert/strict';import {readFile} from 'node:fs/promises';
import {parseBts,parseFreightCsv,parseGscpi,parsePort,metricComparison,metricFreshness,observedSeries} from '../lib/logistics.ts';
const at='2026-10-13T12:00:00Z';
test('BTS missing latest modal release retains earlier observation and its own date',()=>{
 const rows=[{obs_date:'2026-06-01T00:00:00',tsi_freight:'136.6',truck_d11:'114.4',rail_frt_carloads_d11:'990656',rail_frt_intermodal_d11:'1240117',air_rtmfm_d11:'4317634'},{obs_date:'2026-07-01T00:00:00',tsi_freight:'135.7',truck_d11:'113.5',rail_frt_carloads_d11:'992923',rail_frt_intermodal_d11:'1259001'}];
 const records=parseBts(rows,at),air=records.find(r=>r.id.endsWith('air_rtmfm_d11'));assert.equal(air.date,'2026-06-01');assert.equal(air.series.at(-1).value,null);assert.equal(records[0].date,'2026-07-01');assert.throws(()=>parseBts([{obs_date:'2026-07-01'}],at),/schema/);
});
test('GSCPI selects latest vintage including revisions and compares sigma points, not percentages',()=>{
 const r=parseGscpi('Date,Sep-26,Oct-26\n31-Aug-2026,1.06,1.20\n30-Sep-2026,#N/A,1.28\n',at);assert.equal(r.value,1.28);assert.equal(r.series[0].value,1.2);assert.equal(metricComparison(r).percent,null);assert.ok(Math.abs(metricComparison(r).delta-.08)<1e-9);
});
test('comparisons reject missing year pairs and zero denominators, preserving zero values',()=>{
 const r=parseFreightCsv('observation_date,GASDESW\n2025-01-06,0\n2026-01-05,2\n2026-01-12,.\n','GASDESW',at);const c=metricComparison(r,'year');assert.equal(c.value,0);assert.equal(c.percent,null);assert.equal(c.delta,2);assert.equal(metricComparison({...r,series:[{date:'2026-01-05',value:2}]},'year'),null);assert.deepEqual(observedSeries([{date:'2026-01-01',value:0},{date:'2099-01-01',value:3}]).map(p=>p.value),[0]);
});
test('port parser respects monthly units, current versus prior year and loaded versus total',()=>{
 const main='<table><tr><th>September</th><th>2026</th><th>2025</th></tr><tr><td>Total</td><td>1,000.25</td><td>800.25</td></tr><tr><td>Loaded Imports</td><td>500</td><td>400</td></tr></table>';
 const rows=parsePort(main,[],at);assert.equal(rows[0].value,1000.25);assert.equal(rows[1].value,500);assert.equal(rows[0].date,'2026-09-01');assert.equal(metricComparison(rows[0],'year').value,800.25);assert.throws(()=>parsePort('<html>Login</html>',[],at),/header/);
});
test('fresh verification cannot hide overdue observations; snapshot provenance stays visible',()=>{
 const r=parseFreightCsv('DATE,GASDESW\n2026-10-05,6.199\n','GASDESW',at);assert.equal(metricFreshness({...r,status:'VERIFIED SNAPSHOT'},Date.parse(at)),'Dated verified snapshot');assert.match(metricFreshness({...r,date:'2020-01-01'},Date.parse(at)),/lag/);assert.match(metricFreshness({...r,retrieved:'2026-09-01'},Date.parse(at)),/overdue/);
});
test('real Logistics snapshot carries valid source provenance and no invented missing values',async()=>{
 const data=JSON.parse(await readFile(new URL('../lib/logistics-snapshot.json',import.meta.url),'utf8'));assert.equal(data.health.filter(h=>h.status==='connected').length,5);for(const r of data.records){assert.ok(r.url.startsWith('https://'));assert.ok(r.retrieved&&r.date&&r.provider.startsWith('logistics-'));if(r.series){assert.ok(r.series.every(p=>p.value===null||Number.isFinite(p.value)));assert.equal(r.value,r.series.filter(p=>p.value!==null).at(-1).value);}if(r.kind==='official advisory'){assert.equal(r.details.incident.startDate,null);assert.ok(r.details.incident.expires>=r.date);}}
});
