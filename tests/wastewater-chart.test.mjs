import test from 'node:test';
import assert from 'node:assert/strict';
import {weeklyWastewater,wastewaterColor} from '../lib/wastewater-chart.ts';
test('Monday–Sunday mean groups irregular sample dates and crosses years',()=>{
 const weeks=weeklyWastewater([{date:'2025-12-29',value:10},{date:'2026-01-04T00:00:00.000',value:30},{date:'2026-01-05',value:50}]);
 assert.deepEqual(weeks,[{date:'2025-12-29',value:20,samples:2},{date:'2026-01-05',value:50,samples:1}]);
});
test('Missing weeks stay empty; zero is retained, null and invalid values excluded',()=>{
 assert.deepEqual(weeklyWastewater([{date:'2026-01-05',value:0},{date:'2026-01-06',value:null},{date:'2026-01-19',value:40},{date:'2026-01-20',value:-1}]),[{date:'2026-01-05',value:0,samples:1},{date:'2026-01-12',value:null,samples:0},{date:'2026-01-19',value:40,samples:1}]);
});
test('Low is green, high red, constant series neutral and extremes clamp',()=>{
 assert.equal(wastewaterColor(0,0,100),'rgb(66,196,130)');
 assert.equal(wastewaterColor(100,0,100),'rgb(242,91,100)');
 assert.equal(wastewaterColor(20,20,20),'rgb(235,187,67)');
 assert.equal(wastewaterColor(200,0,100),wastewaterColor(100,0,100));
});
