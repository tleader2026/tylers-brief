import {NextRequest,NextResponse} from 'next/server';
import {getChatGPTUser} from '../../chatgpt-auth';
import {refreshSources} from '../../../lib/ingest';
export async function POST(request:NextRequest){
 if(!await getChatGPTUser())return NextResponse.json({error:'Sign in required'},{status:401});
 if(request.headers.get('origin')!==new URL(request.url).origin)return NextResponse.json({error:'Origin rejected'},{status:403});
 try{return NextResponse.json({health:await refreshSources('news',true)});}catch{return NextResponse.json({error:'News refresh unavailable.'},{status:503});}
}
