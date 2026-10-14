import {NextRequest,NextResponse} from 'next/server';
import {getDb} from '../../../db';
import {runs,records} from '../../../db/schema';
import {refreshSources} from '../../../lib/ingest';
import {refreshGroups} from '../../../lib/refresh-health';
// Shared source maintenance only. Sites dispatch enforces the owner-private
// audience for browser and service callers. No personal workspace writes here.
// Do not make the Site public without adding endpoint-specific authorization.
export async function GET(){try{return NextResponse.json({health:(await getDb().select().from(runs)).map(r=>({id:r.provider,...JSON.parse(r.value)})),groups:refreshGroups},{headers:{'Cache-Control':'no-store'}});}catch{return NextResponse.json({error:'Refresh storage unavailable'},{status:503});}}
export async function POST(request:NextRequest){
 const origin=request.headers.get('origin');if(origin&&origin!==new URL(request.url).origin)return NextResponse.json({error:'Origin rejected'},{status:403});
 try{
  const raw=await request.text();if(raw.length>3000000)return NextResponse.json({error:'Report too large'},{status:413});const body=JSON.parse(raw||'{}');
  if(body.action==='ingest'){
   const allowed=['space-weather','space-launches','space-missions','space-infrastructure','space-environment','space-milestones','space-context','agriculture-prices','agriculture-drought','agriculture-progress','agriculture-wasde','agriculture-water','agriculture-income','agriculture-biosecurity','market-volatility','market-etfs','market-options','news','fred','trials','pubmed','cdc','cdc-wval','worldmonitor','logistics-bts','logistics-fred','logistics-gscpi','logistics-port','logistics-marad','logistics-reports','logistics-exposure'];
   if(!allowed.includes(body.provider)||!Array.isArray(body.records)||!body.records.length||body.records.length>5000||body.records.some((r:any)=>r.provider!==body.provider||typeof r.id!=='string'||r.id.length>500||typeof r.title!=='string'||!r.title||typeof r.domain!=='string'||typeof r.date!=='string'||typeof r.url!=='string'||!r.url.startsWith('https://')||typeof r.retrieved!=='string'||!Number.isFinite(Date.parse(r.retrieved))||Date.parse(r.retrieved)>Date.now()+300000||typeof r.status!=='string'||/SNAPSHOT/i.test(r.status)))return NextResponse.json({error:'Invalid source records; dated fallback snapshots cannot become healthy live data'},{status:400});
   const db=getDb(),prior=await db.select().from(records),owners=new Map(prior.map(r=>[r.id,r.provider]));
   if(body.records.some((r:any)=>owners.has(r.id)&&owners.get(r.id)!==body.provider))return NextResponse.json({error:'Source record ownership mismatch'},{status:400});
   for(const r of body.records)await db.insert(records).values({id:r.id,domain:r.domain,provider:r.provider,value:JSON.stringify(r),retrieved:r.retrieved}).onConflictDoUpdate({target:records.id,set:{value:JSON.stringify(r),retrieved:r.retrieved}});
   const at=new Date().toISOString(),warnings=Array.isArray(body.warnings)?body.warnings.filter((w:any)=>typeof w==='string').slice(0,30):[];
   const run={status:warnings.length?'partial':'connected',success:at,attempt:at,count:body.records.length,warnings,message:'Source data retrieved and validated by the cloud updater; persisted to the dashboard.'};
   await db.insert(runs).values({provider:body.provider,value:JSON.stringify(run)}).onConflictDoUpdate({target:runs.provider,set:{value:JSON.stringify(run)}});
   return NextResponse.json({saved:true,health:{id:body.provider,...run}});
  }
  if(body.action==='begin'){
   const db=getDb(),old=await db.select().from(runs),at=new Date().toISOString();
   for(const key of body.scope==='news'?['news']:body.scope==='market'?['market-volatility','market-etfs','market-options']:Object.keys(refreshGroups)){
    const prior=old.find(x=>x.provider===key);const value={...(prior?JSON.parse(prior.value):{}),status:'error',attempt:at,message:'Scheduled verification has started but has not completed. Last good data retained.'};
    await db.insert(runs).values({provider:key,value:JSON.stringify(value)}).onConflictDoUpdate({target:runs.provider,set:{value:JSON.stringify(value)}});
   }
   return NextResponse.json({started:at});
  }
  if(body.action==='refresh')return NextResponse.json({health:await refreshSources(body.scope==='news'?'news':body.scope==='market'?'market':body.scope==='agriculture'?'agriculture':body.scope==='space'?'space':body.scope==='space-weather'?'space-weather':undefined,true)});
  if(body.action!=='report'||!Array.isArray(body.reports)||body.reports.length>30)return NextResponse.json({error:'Invalid maintenance report'},{status:400});
  const reports=body.reports;
  if(reports.some((r:any)=>!Object.hasOwn(refreshGroups,r.key)||!['connected','error','partial'].includes(r.status)||typeof r.message!=='string'||r.message.length>2000||r.status==='connected'&&(!Array.isArray(r.evidence)||!r.evidence.length||r.evidence.some((u:any)=>typeof u!=='string'||!u.startsWith('https://')))))return NextResponse.json({error:'Successful checks require source evidence URLs'},{status:400});
  const db=getDb(),old=await db.select().from(runs),at=new Date().toISOString();
  for(const r of reports){const prior=old.find(x=>x.provider===r.key);const value={...(prior?JSON.parse(prior.value):{}),status:r.status,attempt:at,...(r.status==='connected'?{success:at}:{}),message:r.message,evidence:r.evidence||[],observationDate:r.observationDate||null};await db.insert(runs).values({provider:r.key,value:JSON.stringify(value)}).onConflictDoUpdate({target:runs.provider,set:{value:JSON.stringify(value)}});}
  return NextResponse.json({saved:true,attempt:at,keys:reports.map((r:any)=>r.key)});
 }catch(e){return NextResponse.json({error:String(e instanceof Error?e.message:e)},{status:503});}
}
