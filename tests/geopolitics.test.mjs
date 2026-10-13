import test from 'node:test';
import assert from 'node:assert/strict';
import {classifyEvent,eventRecords} from '../lib/geopolitics.ts';
test('Event screening requires both relevant subject and action',()=>{
 assert.deepEqual(classifyEvent('Port strike disrupts shipping').categories,['supply']);
 assert.deepEqual(classifyEvent('President threatens military action').categories,['rhetoric']);
 assert.deepEqual(classifyEvent('Navy unveils new missile').categories,['military']);
 assert.deepEqual(classifyEvent('President warns of heavy rain').categories,[]);
 assert.deepEqual(classifyEvent('Company announces new phone').categories,[]);
});
test('Dated reports retain publisher, screening terms and discovery; reject unsafe or stale entries',()=>{
 const now=new Date('2026-10-12T12:00:00Z'),item={title:'Navy unveils new missile',source:'Publisher',link:'https://example.com/report',publishedAt:Date.parse('2026-10-10')};
 const rows=eventRecords([item,item,{...item,link:'javascript:alert(1)'},{...item,link:'https://example.com/old',publishedAt:Date.parse('2020-01-01')},{...item,source:''}],'World Monitor API digest',now);
 assert.equal(rows.length,1);assert.equal(rows[0].details.publisher,'Publisher');assert.deepEqual(rows[0].details.categories,['military']);assert.equal(rows[0].details.discovery,'World Monitor API digest');assert.equal(rows[0].date,'2026-10-10T00:00:00.000Z');
});
