import {NextRequest,NextResponse} from 'next/server';
import {getDb} from '../../../db';
import {runs} from '../../../db/schema';
import {refreshSources} from '../../../lib/ingest';
import {refreshGroups} from '../../../lib/refresh-health';
// Shared source maintenance only. Sites dispatch enforces the owner-private
// audience for browser and service callers. No personal workspace writes here.
// Do not make the Site public without adding endpoint-specific authorization.
export async function GET(){try{return NextResponse.json({health:(await getDb().select().from(runs)).map(r=>({id:r.provider,...JSON.parse(r.value)})),groups:refreshGroups},{headers:{'Cache-Control':'no-store'}});}catch{return NextResponse.json({error:'Refresh storage unavailable'},{status:503});}}
export async function POST(request:NextRequest){
 const origin=request.headers.get('origin');if(origin&&origin!==new URL(request.url).origin)return NextResponse.json({error:'Origin rejected'},{status:403});
 try{
  const raw=await request.text();if(raw.length>30000)return NextResponse.json({error:'Report too large'},{status:413});const body=JSON.parse(raw||'{}');
  if(body.action==='begin'){
   const db=getDb(),old=await db.select().from(runs),at=new Date().toISOString();
   for(const key of body.scope==='news'?['news']:Object.keys(refreshGroups)){
    const prior=old.find(x=>x.provider===key);const value={...(prior?JSON.parse(prior.value):{}),status:'error',attempt:at,message:'Scheduled verification has started but has not completed. Last good data retained.'};
    await db.insert(runs).values({provider:key,value:JSON.stringify(value)}).onConflictDoUpdate({target:runs.provider,set:{value:JSON.stringify(value)}});
   }
   return NextResponse.json({started:at});
  }
  if(body.action==='refresh')return NextResponse.json({health:await refreshSources(body.scope==='news'?'news':undefined,true)});
  if(body.action!=='report'||!Array.isArray(body.reports)||body.reports.length>30)return NextResponse.json({error:'Invalid maintenance report'},{status:400});
  const reports=body.reports;
  if(reports.some((r:any)=>!Object.hasOwn(refreshGroups,r.key)||!['connected','error','partial'].includes(r.status)||typeof r.message!=='string'||r.message.length>2000||r.status==='connected'&&(!Array.isArray(r.evidence)||!r.evidence.length||r.evidence.some((u:any)=>typeof u!=='string'||!u.startsWith('https://')))))return NextResponse.json({error:'Successful checks require source evidence URLs'},{status:400});
  const db=getDb(),old=await db.select().from(runs),at=new Date().toISOString();
  for(const r of reports){const prior=old.find(x=>x.provider===r.key);const value={...(prior?JSON.parse(prior.value):{}),status:r.status,attempt:at,...(r.status==='connected'?{success:at}:{}),message:r.message,evidence:r.evidence||[],observationDate:r.observationDate||null};await db.insert(runs).values({provider:r.key,value:JSON.stringify(value)}).onConflictDoUpdate({target:runs.provider,set:{value:JSON.stringify(value)}});}
  return NextResponse.json({saved:true,attempt:at,keys:reports.map((r:any)=>r.key)});
 }catch(e){return NextResponse.json({error:String(e instanceof Error?e.message:e)},{status:503});}
}
