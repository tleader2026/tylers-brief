import test from 'node:test';
import assert from 'node:assert/strict';
import {parseInternetFeed} from '../lib/internet-feed.ts';
const now=Date.parse('2026-10-13T21:00:00Z');
const item=(url,date='Mon, 12 Oct 2026 12:00:00 GMT')=>`<item><title><![CDATA[Open &amp; trusted]]></title><link>${url}</link><pubDate>${date}</pubDate><category>Security</category></item>`;
test('Internet Society feed preserves metadata and rejects untrusted or future links',()=>{const rows=parseInternetFeed('<rss>'+item('https://www.internetsociety.org/blog/a')+item('https://internetsociety.org.attacker.example/a')+item('javascript:alert(1)')+item('https://www.internetsociety.org/future','Wed, 14 Oct 2026 12:00:00 GMT')+'</rss>',now);assert.equal(rows.length,1);assert.equal(rows[0].title,'Open & trusted');assert.deepEqual(rows[0].categories,['Security']);assert.equal(rows[0].date,'2026-10-12T12:00:00.000Z');});
test('Malformed or empty feeds produce no fabricated articles',()=>{assert.deepEqual(parseInternetFeed('<rss><item><title>Incomplete</title></item></rss>',now),[]);assert.deepEqual(parseInternetFeed('<html>Unavailable</html>',now),[]);});
