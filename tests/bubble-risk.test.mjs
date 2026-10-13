import test from 'node:test';
import assert from 'node:assert/strict';
import {bubbleGauges,riskZone,riskSummary,olderReading} from '../lib/bubble-risk.ts';
test('risk thresholds preserve inclusive boundaries and missing inputs',()=>{const g=bubbleGauges[0];assert.equal(riskZone({...g,value:1}),'amber');assert.equal(riskZone({...g,value:2}),'amber');assert.equal(riskZone({...g,value:2.01}),'red');assert.equal(riskZone({...bubbleGauges[4],value:2}),'red');assert.equal(riskZone({...bubbleGauges[2],value:2}),'green');assert.equal(riskZone({...g,value:null}),'unknown');assert.equal(riskZone({...g,value:NaN}),'unknown');});
test('missing observations cannot silently produce a boom verdict',()=>{assert.equal(riskSummary([{...bubbleGauges[0],value:null}]).reading,'Incomplete');assert.equal(riskSummary(bubbleGauges.map((g,i)=>({...g,value:i<3?g.red+.1:g.value}))).reading,'Bubble');assert.equal(olderReading('2026-06-29'),true);assert.equal(olderReading('2026-09-04'),false);});
