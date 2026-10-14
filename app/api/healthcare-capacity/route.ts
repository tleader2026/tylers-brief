import {NextResponse} from 'next/server';
import {getChatGPTUser} from '../../chatgpt-auth';
import {fetchCapacity} from '../../../lib/healthcare-capacity-adapter';
export async function GET(){if(!await getChatGPTUser())return NextResponse.json({error:'Sign in required'},{status:401});try{return NextResponse.json(await fetchCapacity(),{headers:{'Cache-Control':'no-store'}});}catch(e){return NextResponse.json({error:(e as Error).message},{status:502,headers:{'Cache-Control':'no-store'}});}}
