import test from 'node:test';import assert from 'node:assert/strict';
const url='http://127.0.0.1:5173/api/maintenance';
test('maintenance rejects unregistered groups and false healthy snapshot writes',async()=>{
 const post=body=>fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
 assert.equal((await post({action:'report',reports:[{key:'not-a-source',status:'connected',message:'OK',evidence:['https://example.com']}]})).status,400);
 assert.equal((await post({action:'report',reports:[{key:'news',status:'connected',message:'OK',evidence:[]}]})).status,400);
 assert.equal((await post({action:'ingest',provider:'news',records:[{id:'test',title:'Snapshot',domain:'news',provider:'news',date:'2026-10-12',url:'https://example.com',retrieved:new Date().toISOString(),status:'VERIFIED SNAPSHOT'}]})).status,400);
 assert.equal((await post({action:'ingest',provider:'user-entered',records:[]})).status,400);
 const denied=await fetch(url,{method:'POST',headers:{Origin:'https://different.example','Content-Type':'application/json'},body:JSON.stringify({action:'begin',scope:'weekly'})});assert.equal(denied.status,403);
});
