import test from 'node:test';
import assert from 'node:assert/strict';
import {refreshProblem} from '../lib/refresh-health.ts';
const now=Date.parse('2026-10-16T23:00:00Z');
test('failed refresh stays red even with a recent retained success',()=>{
 assert.match(refreshProblem({status:'error',success:new Date(now).toISOString(),message:'HTTP 503'},'fred',now),/503/);
 assert.match(refreshProblem({status:'snapshot',success:new Date(now).toISOString()},'cdc-wval',now),/failed/);
});
test('unchanged annual data can be healthy after current verification; overdue or unknown is red',()=>{
 assert.equal(refreshProblem({status:'connected',success:new Date(now-3600000).toISOString()},'property',now),null);
 assert.match(refreshProblem({status:'connected',success:new Date(now-9*86400000).toISOString()},'property',now),/overdue/);
 assert.match(refreshProblem(undefined,'property',now),/Not yet verified/);
});
test('partial errors explain missing feeds and news has a shorter deadline',()=>{
 assert.match(refreshProblem({status:'partial',warnings:['Housing feed unavailable']},'news',now),/Housing/);
 assert.match(refreshProblem({status:'connected',success:new Date(now-27*3600000).toISOString()},'news',now),/overdue/);
 assert.equal(refreshProblem({status:'connected',success:new Date(now-17*3600000).toISOString()},'news',now),null);
});
