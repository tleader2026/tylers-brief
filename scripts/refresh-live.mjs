// Cloud fallback when upstream publishers reject the hosted Worker's IP.
// Run from the linked checkout after installing dependencies. Supply one JSON
// line on stdin: {origin,token,scope:'news'|'fred'}. Never save the token to disk.
import readline from 'node:readline';
import {readFile} from 'node:fs/promises';
import ts from 'typescript';
const io=readline.createInterface({input:process.stdin,output:process.stdout,terminal:process.stdin.isTTY});
if(process.stdin.isTTY){io._writeToOutput=()=>{};console.log('Ready for hidden updater access JSON.');}
async function moduleSource(path,stripSnapshot=false){let source=await readFile(new URL(path,import.meta.url),'utf8');if(stripSnapshot)source=source.replace(/import snapshot[^;]+;/,'const snapshot=[];');return import('data:text/javascript;base64,'+Buffer.from(ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText).toString('base64'));}
io.once('line',async input=>{
 io.close();const {origin,token,scope}=JSON.parse(input);
 if(!['news','fred'].includes(scope)||new URL(origin).protocol!=='https:')throw new Error('Invalid refresh scope/origin');
 const headers={'OAI-Sites-Authorization':'Bearer '+token,'Content-Type':'application/json'};
 async function write(body){const response=await fetch(origin+'/api/maintenance',{method:'POST',headers,body:JSON.stringify(body),signal:AbortSignal.timeout(90000)});const data=await response.json();if(!response.ok)throw new Error(data.error||'Persistence failed');return data;}
 try{
  let records=[],warnings=[];
  if(scope==='news'){const news=await moduleSource('../lib/news.ts',true);records=await news.newsAdapter();warnings=records.warnings||[];}
  else{
   const {seriesConfig}=await moduleSource('../lib/catalog.ts');
   const results=await Promise.allSettled(seriesConfig.map(async([id,title,domain,units,definition])=>{
    const url='https://fred.stlouisfed.org/graph/fredgraph.csv?id='+id+'&cosd=1996-01-01';const response=await fetch(url,{signal:AbortSignal.timeout(25000)});if(!response.ok)throw new Error('HTTP '+response.status);const csv=await response.text();if(!/^(observation_date|DATE),/.test(csv))throw new Error('CSV schema changed');
    const series=csv.trim().split('\n').slice(1).map(row=>{const [date,raw]=row.trim().split(',');return {date,value:raw&&raw!=='.'&&Number.isFinite(Number(raw))?Number(raw):null};}).filter(p=>/^\d{4}-\d{2}-\d{2}$/.test(p.date));const latest=series.filter(p=>p.value!==null).at(-1);if(!latest)throw new Error('No observations');
    return {id:'fred:'+id,title,domain,provider:'fred',kind:'observed series',url:'https://fred.stlouisfed.org/series/'+id,scope:definition,units,date:latest.date,retrieved:new Date().toISOString(),status:'OBSERVED',value:latest.value,series,summary:'Latest published FRED observations; retrieved by the cloud updater. Revisions and publication lags apply.',details:{seriesId:id,definition,transformation:'CSV parsed; missing values retained as null; history from 1996.'}};
   }));
   results.forEach((r,i)=>{if(r.status==='fulfilled')records.push(r.value);else warnings.push(seriesConfig[i][0]+': '+r.reason.message);});
  }
  if(!records.length)throw new Error('No valid live records returned');
  console.log(JSON.stringify(await write({action:'ingest',provider:scope,records,warnings})));
  const readback=await fetch(origin+'/api/maintenance',{headers,signal:AbortSignal.timeout(20000)});if(!readback.ok)throw new Error('Readback failed');console.log(JSON.stringify((await readback.json()).health.find(r=>r.id===scope)));
 }catch(error){console.log(JSON.stringify(await write({action:'report',reports:[{key:scope,status:'error',message:'Cloud source refresh failed: '+error.message}]})));process.exitCode=1;}
});
