import {env} from 'cloudflare:workers';
import {NextResponse} from 'next/server';
import {getChatGPTUser} from '../../chatgpt-auth';
export async function GET(){const user=await getChatGPTUser();const headers={'Cache-Control':'private, no-store'};if(!user)return NextResponse.json({error:'Sign in required'},{status:401,headers});try{const raw=(env as unknown as Record<string,string>).LABOR_ASSERTION_JSON;if(!raw)return NextResponse.json({data:{assertion:null}},{headers});const seed=JSON.parse(raw);return NextResponse.json({data:{assertion:typeof seed.ownerEmail==='string'&&seed.ownerEmail.toLowerCase()===user.email.toLowerCase()?seed.assertion:null}},{headers});}catch{return NextResponse.json({error:'Private assertion unavailable'},{status:503,headers});}}
