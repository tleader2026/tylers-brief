'use client';
import {useState} from 'react';
import {ArrowUpRight,Bookmark,RefreshCw,Newspaper} from 'lucide-react';
import type {RecordData} from '../lib/catalog';
import {newsTopics} from '../lib/news';
export default function NewsTile({records,health,busy,onRefresh,saved,onSave}:{records:RecordData[];health:any;busy:boolean;onRefresh:()=>void;saved:string[];onSave:(id:string)=>void}){
 const [topic,setTopic]=useState('all'),[limit,setLimit]=useState(8);
 const recent=records.filter(r=>r.provider==='news'&&Date.parse(r.date)>Date.now()-30*86400000).sort((a,b)=>b.date.localeCompare(a.date));
 const articles=recent.filter(r=>topic==='all'||r.details?.topics?.includes(topic));
 const stamp=health?.success?new Date(health.success).toLocaleString('en-US',{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'}):'Not refreshed yet';
 return <section className="panel news-tile" aria-label="News for your interests">
  <div className="panel-head"><div className="inline"><Newspaper size={18}/><h3>News for your interests</h3><span className="badge">{recent.length}</span></div><button className="quiet" onClick={onRefresh} disabled={busy}><RefreshCw size={14} className={busy?'spin':''}/>{busy?'Refreshing':'Refresh news'}</button></div>
  <div className="news-topics" aria-label="Filter news by interest">{[{id:'all',label:'All interests'},...newsTopics].map(t=><button key={t.id} aria-pressed={topic===t.id} className={topic===t.id?'selected':''} onClick={()=>{setTopic(t.id);setLimit(8);}}>{t.label}</button>)}</div>
  {health?.status==='error'||health?.warnings?.length?<p className="news-notice" role="status">{health.status==='error'?'News refresh unavailable. Showing previously retrieved articles.':health.warnings.join(' · ')}</p>:null}
  <div className="news-list">{articles.slice(0,limit).map(r=><article className="news-article" key={r.id}><div><div className="news-meta"><span>{r.details.publisher}</span><time dateTime={r.date}>{new Date(r.date).toLocaleDateString('en-US',{month:'short',day:'numeric'})}</time><span className="news-topic-label">{newsTopics.find(t=>t.id===r.details.topics[0])?.label}</span></div><a className="news-headline" href={r.url} target="_blank" rel="noopener noreferrer">{r.title}<ArrowUpRight size={15}/></a></div><button className={'icon '+(saved.includes(r.id)?'saved':'')} onClick={()=>onSave(r.id)} aria-label={(saved.includes(r.id)?'Unsave':'Save')+' article: '+r.title}><Bookmark size={16} fill={saved.includes(r.id)?'currentColor':'none'}/></button></article>)}
  {!articles.length&&<div className="news-empty"><Newspaper size={25}/><h3>{busy?'Finding relevant articles…':'No recent articles in this topic'}</h3><p>{busy?'Checking web headlines across your interests.':'Refresh news or choose another interest.'}</p></div>}</div>
  <div className="news-footer"><span>Via Google News · Updated {stamp}<small>Publisher reports · Feed refreshes hourly when you visit</small></span>{articles.length>limit&&<button className="quiet" onClick={()=>setLimit(limit+8)}>More articles <ArrowUpRight size={14}/></button>}</div>
 </section>;
}
