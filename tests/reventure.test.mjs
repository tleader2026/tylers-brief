import test from 'node:test';
import assert from 'node:assert/strict';
import {reventureSeries,reventureUrl} from '../lib/reventure.ts';
test('CSV dates sort and month periods normalize explicitly',()=>assert.deepEqual(reventureSeries('Date,Value\n2026-09,123\n2026-08-01,100'),[{date:'2026-08-01',value:100},{date:'2026-09-01',value:123}]));
test('Excel tab-separated values retain currency and negative percentage numbers',()=>assert.deepEqual(reventureSeries('Month\tValue\n2026-09\t$123,456\n2026-10\t-4.5%'),[{date:'2026-09-01',value:123456},{date:'2026-10-01',value:-4.5}]));
test('Reject duplicate dates, impossible dates, blank values and unsafe source links',()=>{assert.throws(()=>reventureSeries('2026-09,1\n2026-09,2'));assert.throws(()=>reventureSeries('2026-02-30,1'));assert.throws(()=>reventureSeries('2026-09,'));assert.throws(()=>reventureUrl('https://reventure.app.evil.example/'));assert.throws(()=>reventureUrl('javascript:alert(1)'));assert.equal(reventureUrl('https://www.reventure.app/graph'),'https://www.reventure.app/graph');});
