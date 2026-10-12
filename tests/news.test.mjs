import test from 'node:test';
import assert from 'node:assert/strict';
import {parseNews,mergeNews} from '../lib/news.ts';
const now=new Date('2026-10-12T12:00:00Z');
const item=(title='Research &amp; recovery - Publisher',date='Mon, 12 Oct 2026 07:00:00 GMT',url='https://news.google.com/rss/articles/test')=>'<item><title><![CDATA['+title+']]></title><link>'+url+'</link><pubDate>'+date+'</pubDate><source url="https://publisher.example">Publisher</source></item>';
test('RSS preserves provenance, decodes titles and removes publisher suffix',()=>{const [r]=parseNews('<rss>'+item()+'</rss>','health',now);assert.equal(r.title,'Research & recovery');assert.equal(r.scope,'Publisher');assert.equal(r.date,'2026-10-12T07:00:00.000Z');assert.equal(r.change,undefined);assert.equal(r.details.discovery,'Google News RSS');});
test('Rejects invalid, future, old and unsafe entries',()=>{assert.equal(parseNews(item('Future','Tue, 13 Oct 2026 07:00:00 GMT')+item('Old','Mon, 01 Jan 2024 07:00:00 GMT')+item('Unsafe',undefined,'javascript:alert(1)'),'health',now).length,0);});
test('Same headline across topics is displayed once with merged interests',()=>{const a=parseNews(item(),'health',now),b=parseNews(item(),'pharma',now);const rows=mergeNews([a,b]);assert.equal(rows.length,1);assert.deepEqual(rows[0].details.topics,['health','pharma']);});
