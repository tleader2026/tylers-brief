import {NextRequest,NextResponse} from 'next/server';
import {getChatGPTUser} from '../../chatgpt-auth';
import {getDb} from '../../../db';
import {records,runs} from '../../../db/schema';
import {eq} from 'drizzle-orm';
import snapshot from '../../../lib/labor-snapshot.json';
import {refreshSources} from '../../../lib/ingest';
export async function GET(){if(!await getChatGPTUser())return NextResponse.json({error:'Sign in required'},{status:401});try{const db=getDb();const [rows,health]=await Promise.all([db.select().from(records).where(eq(records.provider,'labor-fred')),db.select().from(runs).where(eq(runs.provider,'labor-fred'))]);const live=rows.map(r=>JSON.parse(r.value).details.laborMetric);return NextResponse.json({metrics:snapshot.metrics.map(m=>live.find(x=>x.id===m.id)||m),health:health[0]?JSON.parse(health[0].value):null},{headers:{'Cache-Control':'no-store'}});}catch{return NextResponse.json({metrics:snapshot.metrics,error:'Live storage unavailable; dated bundled snapshot shown.'},{headers:{'Cache-Control':'no-store'}});}}
export async function POST(req:NextRequest){if(!await getChatGPTUser())return NextResponse.json({error:'Sign in required'},{status:401});if(req.headers.get('origin')!==new URL(req.url).origin)return NextResponse.json({error:'Origin rejected'},{status:403});return NextResponse.json({health:await refreshSources('labor',true)});}
