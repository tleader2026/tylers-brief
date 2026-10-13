import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const data=JSON.parse(fs.readFileSync(new URL('../lib/infrastructure-snapshot.json',import.meta.url),'utf8'));
test('Infrastructure state coverage and unit relationships remain coherent',()=>{assert.equal(data.water.length,51);assert.equal(data.electricity.length,51);assert.equal(new Set(data.water.map(s=>s.code)).size,51);for(const s of data.water){assert.ok(s['TO-WFrTo']<=s['TO-Wtotl']+.1);assert.ok(s['TO-CUTotPartial']<=s['TO-Wtotl']+.1);}for(const r of data.reservoirs){assert.ok(r.capacity>0);assert.ok(r.stored>=0);assert.ok(r.stored<=r.capacity);}});
test('Construction map groups unique plants and excludes battery capacity',()=>{assert.equal(new Set(data.plants.map(p=>p.id)).size,data.plants.length);for(const p of data.plants){assert.ok(Math.abs(p.mw-p.generators.reduce((a,g)=>a+g.mw,0))<.02);for(const g of p.generators){assert.match(g.status,/^\([UV]\)/);assert.doesNotMatch(g.technology,/Batter/);}if(p.lat!=null)assert.ok(p.lat>=-90&&p.lat<=90);if(p.lon!=null)assert.ok(p.lon>=-180&&p.lon<=180);}});
