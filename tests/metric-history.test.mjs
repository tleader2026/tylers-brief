import test from 'node:test';
import assert from 'node:assert/strict';
import {tenYearComparison,metricColor} from '../lib/metric-history.ts';
test('ten-year comparisons align weekly dates and reject distant observations',()=>{
  const series=[{date:'2016-10-06',value:3.42},{date:'2016-10-13',value:3.47},{date:'2026-10-08',value:7.4}];
  const result=tenYearComparison({series});
  assert.equal(result.prior.date,'2016-10-06');
  assert.ok(Math.abs(result.change-3.98)<1e-9);
  assert.equal(tenYearComparison({series:[{date:'2015-01-01',value:2},{date:'2026-10-08',value:7.4}]}).prior,undefined);
});
test('level colors preserve zero readings and unavailable data',()=>{
  const series=[{date:'2000-01-01',value:0},{date:'2001-01-01',value:10}];
  assert.equal(metricColor({value:0,series}),'rgb(22,76,52)');
  assert.equal(metricColor({value:10,series}),'rgb(132,38,52)');
  assert.equal(metricColor({value:null,series}),undefined);
});
