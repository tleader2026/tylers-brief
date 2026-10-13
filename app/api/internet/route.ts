import {NextResponse} from 'next/server';
import {getChatGPTUser} from '../../chatgpt-auth';
import {parseInternetFeed} from '../../../lib/internet-feed';
export async function GET(){if(!await getChatGPTUser())return NextResponse.json({error:'Sign in required'},{status:401});try{const r=await fetch('https://www.internetsociety.org/feed/',{signal:AbortSignal.timeout(10000)});if(!r.ok)throw new Error();const xml=await r.text();if(xml.length>1500000)throw new Error();const articles=parseInternetFeed(xml);if(!articles.length)throw new Error();return NextResponse.json({articles,retrieved:new Date().toISOString()},{headers:{'Cache-Control':'private, max-age=3600'}});}catch{return NextResponse.json({error:'Internet Society feed unavailable. Dated snapshot retained.'},{status:503});}}
