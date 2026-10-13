// Collect public source records outside the hosted Worker when publishers block
// its IP. No secrets needed for snapshots. --persist accepts hidden stdin access
// JSON {origin,token}; credentials are never written to disk or command arguments.
import {readFile,writeFile} from 'node:fs/promises';import readline from 'node:readline';import ts from 'typescript';
const helper=ts.transpileModule(await readFile(new URL('../lib/logistics.ts',import.meta.url),'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText;
const helperUrl='data:text/javascript;base64,'+Buffer.from(helper).toString('base64');
let source=await readFile(new URL('../lib/logistics-adapters.ts',import.meta.url),'utf8');source=source.replace("from './logistics'",'from '+JSON.stringify(helperUrl));const mod=await import('data:text/javascript;base64,'+Buffer.from(ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText).toString('base64'));
const adapters=[['logistics-bts',mod.logisticsBtsAdapter],['logistics-fred',mod.logisticsFredAdapter],['logistics-gscpi',mod.logisticsGscpiAdapter],['logistics-port',mod.logisticsPortAdapter],['logistics-marad',mod.logisticsMaradAdapter]];
async function collect(access){
 const records=[],health=[];
 for(const [provider,adapter] of adapters){try{const rows=await adapter();records.push(...rows);health.push({provider,status:rows.warnings?.length?'partial':'connected',count:rows.length,warnings:rows.warnings||[],success:new Date().toISOString(),message:'Public source records retrieved and validated.'});if(access)await persist(access,{action:'ingest',provider,records:rows,warnings:rows.warnings||[]});}catch(e){health.push({provider,status:'error',message:e.message});if(access)await persist(access,{action:'report',reports:[{key:provider,status:'error',message:e.message}]});}}
 if(access){const r=await fetch(access.origin+'/api/maintenance',{headers:{'OAI-Sites-Authorization':'Bearer '+access.token}});if(!r.ok)throw new Error('Readback failed');console.log(JSON.stringify((await r.json()).health.filter(r=>r.id.startsWith('logistics-'))));}
 else{await writeFile(new URL('../lib/logistics-snapshot.json',import.meta.url),JSON.stringify({retrieved:new Date().toISOString(),records,health},null,2));console.log(JSON.stringify(health));}
 if(health.some(r=>r.status==='error'))process.exitCode=1;
}
async function persist(access,body){const r=await fetch(access.origin+'/api/maintenance',{method:'POST',headers:{'OAI-Sites-Authorization':'Bearer '+access.token,'Content-Type':'application/json'},body:JSON.stringify(body),signal:AbortSignal.timeout(90000)});const d=await r.json();if(!r.ok)throw new Error(d.error||'Write failed');}
if(process.argv.includes('--persist')){const io=readline.createInterface({input:process.stdin,output:process.stdout,terminal:process.stdin.isTTY});if(process.stdin.isTTY){io._writeToOutput=()=>{};console.log('Ready for hidden updater access JSON.');}io.once('line',async line=>{io.close();await collect(JSON.parse(line));});}else await collect();
