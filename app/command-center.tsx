'use client';
import {InternetOverview} from './internet-monitor';
import LaborDashboard from './labor-dashboard';
import TrustSafety from './trust-safety-dashboard';
import CapabilityDashboard from './capability-dashboard';
import SmartUpgrades from './smart-upgrades';
import PopulationHealth from './population-health-dashboard';

import MarketPulse from './market-pulse';
import EnergyPrices from './energy-prices';

import BubbleRisk from './bubble-risk';

import SpaceSystems,{SpaceBriefings} from './space-systems-dashboard';

import AgricultureDashboard,{AgricultureBriefings} from './agriculture-dashboard';

import LogisticsDashboard,{EconomyLogisticsSummary,EconomyLogisticsDetails} from './logistics-dashboard';

import RefreshIndicators from './refresh-indicators';

import CompanyDashboard from './company-dashboard';

import AIGrowth from './ai-growth';

import ResearchTheories from './research-theories';

import InfrastructureDashboard from './infrastructure-dashboard';

import InternetDashboard from './internet-dashboard';

import SpaceInfrastructure from './space-infrastructure';

import ReventurePanel from './reventure-panel';

import TrialsOverview from './trials-overview';

import TrialMap from './trial-map';

import {byCompletion} from '../lib/trials-view';

import WastewaterChart from './wastewater-chart';

import HousingMap from './housing-map';

import StateHomeValues from './state-home-values';

import {metricColor} from '../lib/metric-history';

function HomeHistory({record,chart}:{record:RecordData;chart:(r:RecordData)=>React.ReactNode}){return chart(record);}

import WastewaterMap from './wastewater-map';

import GeopoliticsEvents from './geopolitics-events';

import ActivityBars from './wastewater-activity';

import {focusStates} from '../lib/wastewater-activity';

import NewsTile from './news-tile';

import {nearBastrop,siteProximity} from '../lib/exposure-proximity';

import {workspaceSchema} from '../lib/workspace-schema';

import React,{useEffect,useRef,useState,useMemo} from 'react';

import {Briefcase,Bot,Satellite,ChessKnight,Biohazard,Truck,Calculator,Microscope,Cross,Zap,DollarSign,Activity,ArrowUpRight,Bookmark,BookOpen,Building2,ChevronDown,ChevronRight,Command,Database,Download,FileText,Globe2,HeartPulse,Home,Layers3,Menu,Network,Plus,Search,Settings2,ShieldCheck,SlidersHorizontal,Sun,Trash2,TrendingUp,X,Bell,RefreshCw,ExternalLink,Check,Clock,MapPin,PanelLeftClose} from 'lucide-react';

import {pages,tabs,sources,RecordData,sidebarGroups,unpopulatedPages} from '../lib/catalog';

import {ownership,inflationChange,alertPreview,distanceKm} from '../lib/calculations';

// Use browser history for this persistent workspace. Server routes still enforce

// authentication and support direct URLs; navigation avoids framework prefetch bugs.

function navigate(href:string,replace=false){if(replace)window.history.replaceState(null,'',href);else window.history.pushState(null,'',href);window.dispatchEvent(new Event('popstate'));}

function useRoute(){const [route,setRoute]=useState({pathname:'/',search:''});useEffect(()=>{const read=()=>setRoute({pathname:window.location.pathname,search:window.location.search});read();window.addEventListener('popstate',read);return()=>window.removeEventListener('popstate',read);},[]);const params=useMemo(()=>new URLSearchParams(route.search),[route.search]);return {pathname:route.pathname,params,router:{push:(href:string)=>{navigate(href);window.scrollTo(0,0);},replace:(href:string)=>navigate(href,true)}};}

function Link({prefetch,href,onClick,children,...props}:React.AnchorHTMLAttributes<HTMLAnchorElement>&{prefetch?:boolean;href:string}){return <a {...props} href={href} onClick={e=>{onClick?.(e);if(e.defaultPrevented||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||e.button!==0)return;e.preventDefault();navigate(href);window.scrollTo(0,0);}}>{children}</a>;}

function EvidenceFields({record}:{record:RecordData}){const d=record.details||{};

 if(record.provider==='company-reports')return <><p>{d.limitations}</p><h3>Report and public claim sources</h3>{(d.reportSources||[]).map((s:any)=><p key={s.url}><a href={s.url} target="_blank" rel="noreferrer">{s.title} ↗</a><br/><small>Published {s.date}</small></p>)}</>;

 if(record.domain==='trials')return <><dl>{[['Phase',(d.phase||[]).join(', ')||'Not applicable / not provided'],['Design',d.studyType||'Unknown'],['Enrollment',d.enrollment?.count?`${d.enrollment.count} (${d.enrollment.type})`:'Not provided'],['Sponsor',d.sponsor?.name||'Not provided'],['Age range',`${d.eligibility?.minimumAge||'Not provided'} – ${d.eligibility?.maximumAge||'Not provided'}`],['Completion',`${d.primaryCompletion?.date||'Not provided'} (${d.primaryCompletion?.type||'unknown'})`],['Results',d.hasResults?'Registry results posted; interpretation requires review':'No posted results indicated']].map(([k,v])=><div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl><h3>Conditions & interventions</h3><p>{(d.conditions||[]).join('; ')}</p>{(d.interventions||[]).map((i:any,index:number)=><div className="note" key={index}><strong>{i.name}</strong><p>{i.type} · {i.description||'No description provided'}</p></div>)}<h3>Primary endpoints</h3>{(d.endpoints?.primaryOutcomes||[]).map((o:any,index:number)=><div className="note" key={index}><strong>{o.measure}</strong><p>{o.timeFrame}</p><p>{o.description}</p></div>)}<details><summary>Eligibility criteria</summary><p className="preserve">{d.eligibility?.eligibilityCriteria||'Not supplied'}</p></details><details><summary>Registry-listed sites & contacts</summary>{(d.sites||[]).map((s:any,i:number)=><div className="note" key={i}><strong>{s.facility}</strong><p>{s.city}, {s.state}, {s.country} · {s.status||'Site recruitment not confirmed'}</p></div>)}{(d.contacts||[]).map((c:any,i:number)=><div className="note" key={'c'+i}>{c.name}<p>{c.email} · {c.phone}</p></div>)}</details><p>Registry status does not establish eligibility or site-confirmed recruitment. Review the official record and discuss relevance with a clinician.</p></>;

 if(record.domain==='research')return <><dl>{[['Journal',d.journal||'Not provided'],['Type',(d.publicationTypes||[]).join('; ')||record.kind],['Assessment',d.reviewStatus||record.status],['Authors',(d.authors||[]).map((a:any)=>a.name).join('; ')||'Not supplied']].map(([k,v])=><div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl><p>Publication metadata is not a completed evidence assessment. Review population, comparator, effect sizes, adverse events, follow-up, conflicts and negative findings in the full study.</p></>;

 if(record.provider==='worldmonitor')return <><dl>{[['Publisher',d.publisher],['Discovery',d.discovery],['Matched terms',d.matchedTerms?.join(', ')],['Review',d.reviewStatus]].map(([k,v])=><div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl><p>{d.limitations}</p></>; if(record.provider==='cdc-wval')return <><dl>{[['Geography',d.geography],['Measure',record.kind],['Units',record.units],['Latest reporting sites',String(d.weeks?.at(-1)?.sites||0)]].map(([k,v])=><div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl><p>{d.transformation}</p><p>{d.limitations}</p></>; if(record.domain==='wastewater')return <><dl>{[['Source service area',d.latestSourceRow?.counties_served||'Not provided'],['Sample matrix',d.latestSourceRow?.sample_matrix||'Not provided'],['Lab method',d.latestSourceRow?.major_lab_method||'Not provided'],['Source rows',String(d.returnedObservations||'Unknown')],['Units',record.units||'Not provided']].map(([k,v])=><div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl><p>{d.limitations}</p></>;

 return <><p>{d.limitations||d.transformation||'No additional assessment entered.'}</p>{d.counterevidence&&<p>Counterevidence: {d.counterevidence}</p>}</>;

}

function CostCalculator({saved,onSave}:{saved:any;onSave:(v:any)=>void}){

 const [v,setV]=useState(saved||{price:300000,down:20,rate:6.5,years:30,tax:2,insurance:2400,hoa:0,maintenance:1,closing:3});

 const result=ownership(v.price,v.down,v.rate,v.years,v.tax,v.insurance,v.hoa,v.maintenance);

 const labels:any={price:'Purchase price ($)',down:'Down payment (%)',rate:'Mortgage rate (%)',years:'Loan term (years)',tax:'Annual property tax (%)',insurance:'Annual insurance ($)',hoa:'Monthly HOA ($)',maintenance:'Annual maintenance (%)',closing:'Closing costs (%)'};

 return <section className="panel form-pad"><div className="panel-head"><h3>What would ownership cost each month?</h3><span className="badge">Editable scenario</span></div><div className="calculator"><div className="form-grid">{Object.keys(v).map(k=><label key={k}>{labels[k]}<input type="number" value={(v as any)[k]} min={k==='years'?1:0} max={k==='down'?100:undefined} step={k==='price'?1000:.1} onChange={e=>setV({...v,[k]:Math.max(k==='years'?1:0,Math.min(k==='down'?100:1e9,Number(e.target.value)))})}/></label>)}</div><div className="calc-result"><span className="eyebrow">ESTIMATED MONTHLY TOTAL</span><strong>{money(result.total)}</strong>{Object.entries(result).filter(([k])=>k!=='total').map(([k,n])=><div key={k}><span>{k==='principal'?'Principal & interest':k}</span><b>{money(n)}</b></div>)}<div><span>Estimated initial cash</span><b>{money(v.price*(v.down+v.closing)/100)}</b></div><p>Fixed-rate, amortizing loan. Tax, insurance, HOA and maintenance are entered assumptions. Excludes PMI, utility costs, renovations and tax effects. No income or personal finances are assumed.</p><div className="inline"><button className="primary" onClick={()=>onSave(v)}>Save scenario</button><button className="button" onClick={()=>exportFile('ownership-scenario.json',{assumptions:v,result})}>Export scenario</button></div></div></div></section>;

}

function PurchasingPower({records}:{records:RecordData[]}){

 const cpi=records.find(r=>r.id==='fred:CPIAUCSL'),points=cpi?.series?.filter(x=>x.value!==null)||[];const [year,setYear]=useState('2020'),[basket,setBasket]=useState({Housing:1500,Groceries:400,Utilities:200,Transport:250,Healthcare:200,Insurance:150,Discretionary:250});

 const base=points.find(x=>x.date.startsWith(year+'-01')),latest=points.at(-1),ratio=base?.value&&latest?.value?latest.value/base.value:null,total=Object.values(basket).reduce((a,b)=>a+b,0);

 return <section className="panel form-pad"><h3>What does a dollar buy relative to your base year?</h3><p>This scenario applies the U.S. headline CPI change uniformly to an entered basket. It does not model category-specific inflation or your actual spending.</p><label>Base year (January observation)<select value={year} onChange={e=>setYear(e.target.value)}>{[...new Set(points.map(x=>x.date.slice(0,4)))].map(y=><option key={y}>{y}</option>)}</select></label><div className="calculator"><div className="form-grid">{Object.entries(basket).map(([k,v])=><label key={k}>{k} · base monthly dollars<input type="number" min="0" value={v} onChange={e=>setBasket({...basket,[k]:Math.max(0,Number(e.target.value))})}/></label>)}</div><div className="calc-result"><span className="eyebrow">EQUIVALENT BASKET AT LATEST PRICE LEVEL</span><strong>{ratio?money(total*ratio):'Unavailable'}</strong><p>Base basket {money(total)} · latest observation {latest?.date||'Missing'}</p><p>{ratio?`${((ratio-1)*100).toFixed(1)}% price-level change; $1 buys ${(1/ratio*100).toFixed(1)}¢ of base-year purchasing power.`:'A matching January observation and latest CPI are required.'}</p><p>Falling inflation means slower price increases, not necessarily falling prices.</p></div></div></section>;

}

function ResearchLandscape({tab,records,open}:{tab:string;records:RecordData[];open:(r:RecordData)=>void}){

 const categories=['Antivirals','Immune modulation','B-cell / antibody approaches','JAK inhibitors','Autonomic interventions','Mitochondrial / metabolic approaches','Combination strategies'];

 const topics=tab==='Mechanisms'?['Viral persistence','EBV / herpesvirus hypotheses','Neuroinflammation / CNS','Blood–brain barrier','Dysautonomia / POTS','Histamine / mast-cell pathways','Mitochondrial function']:tab==='Biomarkers'?['Immune signatures','Viral persistence markers','Autonomic measures','Metabolic signatures']:categories;

 return <section className="panel"><div className="panel-head"><h3>{tab==='Treatment landscape'?'Evidence matrix':tab}</h3><span className="badge">Review workspace</span></div><p className="form-pad">Research interests are hypotheses to investigate. Registry metadata and publication titles cannot establish effectiveness, safety or responder subgroups. Prevention, symptom relief and treatment of established Long COVID must be evaluated separately.</p><div className="landscape">{topics.map(t=><div key={t}><span className="landscape-dot"/><strong>{t}</strong><span className="badge">Evidence assessment pending</span></div>)}</div><div className="form-pad"><h3>Ensitrelvir watch</h3><p>Registry IDs are retrieved from ClinicalTrials.gov by intervention search. Programs may concern acute COVID rather than established Long COVID; inspect each condition and endpoint.</p>{records.filter(r=>/ensitrelvir/i.test(r.title+JSON.stringify(r.details))).map(r=><button key={r.id} className="note" onClick={()=>open(r)}>{r.title} <span className="badge">{r.domain}</span></button>)}</div></section>;

}

function BoardBuilder({records,onSave}:{records:RecordData[];onSave:(b:any)=>void}){const [title,setTitle]=useState(''),[hypothesis,setHypothesis]=useState(''),[support,setSupport]=useState(''),[counter,setCounter]=useState(''),[selected,setSelected]=useState<string[]>([]);return <section className="panel form-pad"><h3>Create a comparison board</h3><div className="form-grid"><label>Board title<input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Rates and home ownership"/></label><label>Hypothesis<input value={hypothesis} onChange={e=>setHypothesis(e.target.value)} placeholder="A question, not an assumed causal relationship"/></label><label>Supporting evidence<textarea value={support} onChange={e=>setSupport(e.target.value)}/></label><label>Counterevidence, alignment & limitations<textarea value={counter} onChange={e=>setCounter(e.target.value)}/></label></div><label>Select two to four source records<select multiple value={selected} onChange={e=>setSelected(Array.from(e.target.selectedOptions).map(x=>x.value).slice(0,4))}>{records.map(r=><option value={r.id} key={r.id}>{r.title}</option>)}</select></label><p>Use Ctrl / Command to select multiple records. Record units and date ranges remain independent.</p><button className="primary" disabled={!title||selected.length<2} onClick={()=>{onSave({id:crypto.randomUUID(),title,hypothesis,support,counter,records:selected});setTitle('');setSelected([]);}}>Save comparison</button></section>;}

function AlertBuilder({records,onSave}:{records:RecordData[];onSave:(r:any)=>void}){const [rule,setRule]=useState({record:'fred:UNRATE',direction:'above',threshold:5,duration:2,freshness:60,cooldown:24});const result=alertPreview(rule,records);return <section className="panel form-pad"><div className="panel-head"><h3>Build an explainable alert</h3><span className="badge">Dry-run preview</span></div><div className="form-grid"><label>Observed metric<select value={rule.record} onChange={e=>setRule({...rule,record:e.target.value})}>{records.filter(r=>r.series).map(r=><option key={r.id} value={r.id}>{r.title} · {r.units}</option>)}</select></label><label>Direction<select value={rule.direction} onChange={e=>setRule({...rule,direction:e.target.value})}><option value="above">Above</option><option value="below">Below</option></select></label>{[['threshold','Threshold in source units'],['duration','Consecutive valid observations'],['freshness','Maximum observation age (days)'],['cooldown','Cooldown (hours)']].map(([k,label])=><label key={k}>{label}<input type="number" min={k==='threshold'?undefined:1} value={(rule as any)[k]} onChange={e=>setRule({...rule,[k]:k==='threshold'?Number(e.target.value):Math.max(1,Number(e.target.value))})}/></label>)}</div><div className="notice"><Bell size={17}/><div><strong>{result.fire?'Would fire':'Would stay quiet'}</strong><p>{result.reason}</p></div></div><button className="primary" disabled={!records.find(r=>r.id===rule.record)?.series} onClick={()=>onSave({...rule,id:crypto.randomUUID()})}>Save alert rule</button><p>Evaluated when this page is opened. Uses observed values, source units, freshness and a per-rule cooldown. Missing values are omitted; no background delivery is enabled.</p></section>;}

function AddEvidence({domain,onClose,onSave}:{domain:string;onClose:()=>void;onSave:(r:RecordData)=>void}){

 const [v,setV]=useState({title:'',url:'',domain:pages.some(p=>p[0]===domain)?domain:'research',scope:'',date:'',summary:'',kind:'User-entered source review',status:'UNREVIEWED',limits:'',counter:''}),[error,setError]=useState('');

 return <section className="add-modal" role="dialog" aria-modal="true" aria-label="Add source-linked evidence"><div className="panel-head"><h3>Add evidence</h3><button className="icon" onClick={onClose} aria-label="Close add evidence"><X size={20}/></button></div><form className="form-pad" onSubmit={e=>{e.preventDefault();try{const url=new URL(v.url);if(!['https:','http:'].includes(url.protocol))throw new Error();onSave({id:'manual:'+crypto.randomUUID(),domain:v.domain,title:v.title,url:v.url,scope:v.scope,date:v.date,summary:v.summary,kind:v.kind,status:v.status,provider:'user-entered',retrieved:new Date().toISOString(),details:{limitations:v.limits,counterevidence:v.counter,transformation:'User-entered source-linked record; not automatically verified'}});}catch{setError('Enter a valid HTTP or HTTPS source URL.');}}}><div className="form-grid"><label>Title<input required value={v.title} onChange={e=>setV({...v,title:e.target.value})}/></label><label>Domain<select value={v.domain} onChange={e=>setV({...v,domain:e.target.value})}>{pages.filter(p=>!['today','library','settings','connections','alerts'].includes(p[0])).map(p=><option key={p[0]} value={p[0]}>{p[1]}</option>)}</select></label><label>Primary source URL<input type="url" required value={v.url} onChange={e=>setV({...v,url:e.target.value})}/></label><label>Geographic / entity scope<input required value={v.scope} onChange={e=>setV({...v,scope:e.target.value})}/></label><label>Source / event date<input type="date" required value={v.date} onChange={e=>setV({...v,date:e.target.value})}/></label><label>Evidence status<select value={v.status} onChange={e=>setV({...v,status:e.target.value})}>{['UNREVIEWED','SOURCE-VERIFIED FACT','HYPOTHESIS','PREPRINT','OBSERVATIONAL','RANDOMIZED TRIAL','PROPOSED POLICY','ENACTED POLICY','OFFICIAL CLAIM','INDEPENDENTLY VERIFIED','DISPUTED'].map(x=><option key={x}>{x}</option>)}</select></label></div><label>What changed or what does the source report?<textarea required value={v.summary} onChange={e=>setV({...v,summary:e.target.value})}/></label><div className="form-grid"><label>Limitations / missing information<textarea value={v.limits} onChange={e=>setV({...v,limits:e.target.value})}/></label><label>Counterevidence / conflicts<textarea value={v.counter} onChange={e=>setV({...v,counter:e.target.value})}/></label></div>{error&&<p role="alert">{error}</p>}<button className="primary" type="submit">Save source-linked record</button></form></section>;

}

type State={saved:string[];notes:any[];manual:RecordData[];rules:any[];boards:any[];favorites:string[];dismissed:string[];muted:string[];lastVisit:string;theme:string;home:string;watch:string[];views:any[];preferences:any};

const initial:State={saved:[],notes:[],manual:[],rules:[],boards:[],favorites:['research','trials','local-housing'],dismissed:[],muted:[],lastVisit:'',theme:'light',home:'Smithville / Bastrop County',watch:['fred:CPIAUCSL','fred:UNRATE','fred:MORTGAGE30US','fred:USSTHPI'],views:[],preferences:{}};

const icons:any={'trust-safety':ShieldCheck,labor:Briefcase,measurements:Calculator,'population-health':HeartPulse,logistics:Truck,agriculture:Sun,'space-systems':Satellite,capabilities:Command,'market-signals':TrendingUp,'supply-chains':Network,today:Layers3,research:Microscope,trials:Activity,wastewater:Biohazard,'local-housing':Home,'national-housing':Home,infrastructure:Zap,companies:Building2,robotics:Bot,governance:ShieldCheck,geopolitics:ChessKnight,economy:DollarSign,internet:Globe2,connections:Network,library:BookOpen,alerts:Bell,settings:Settings2};

const descriptions:any={'trust-safety':'Trust, safety and responsible AI systems.',labor:'Employment, sufficient work, hiring difficulty and career outcomes.','space-systems':'Launch access, orbital services, space weather and demonstrated capability.',agriculture:'Production, water, inputs and household food purchasing power.',logistics:'Freight demand, transport constraints and U.S. supply-chain exposure.',today:'The changes that matter. The evidence behind them.',research:'Follow the evidence, from biological hypothesis to clinical outcomes.',trials:'Treatment opportunities and registry changes worth reviewing.',wastewater:'Population signals, with geography and coverage in view.','local-housing':'Bastrop, Smithville, Cedar Creek and the wider Central Texas market.','national-housing':'National housing prices, mortgage rates and market conditions.',companies:'Financial durability, adoption and the infrastructure behind AI.',governance:'Policy, independent evaluations and observed system behavior.',geopolitics:'Verified developments and their economic connections.',economy:'Price levels, household purchasing power and macroeconomic changes.',internet:'Internet Society issues, provenance and the future of networking.',infrastructure:'Water, electricity, data centers, orbital infrastructure and autonomous travel.',connections:'Connect developments without confusing correlation with cause.',library:'A durable home for sources, questions and your own thinking.',alerts:'Explainable rules and sourced brief previews.',settings:'Know what is connected, what is current and what is missing.'};

const money=(n:number)=>n.toLocaleString('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0});

const when=(s:string)=>s?new Date(s).toLocaleString('en-US',{timeZone:'America/Chicago',month:'short',day:'numeric',hour:'numeric',minute:'2-digit'}):'Not yet';

const number=(v:any)=>typeof v==='number'?v.toLocaleString('en-US',{maximumFractionDigits:2}):'—';

function exportFile(name:string,data:any){const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;a.click();URL.revokeObjectURL(url);}

function Empty({title,children,action}:{title:string;children:React.ReactNode;action?:React.ReactNode}){return <div className="empty"><Database size={23}/><h3>{title}</h3><p>{children}</p>{action}</div>;}

function SeriesChart({record,open,range='5y'}:{record:RecordData;open:()=>void;range?:string}){

 const [table,setTable]=useState(false);const [focus,setFocus]=useState<any>(null);const gradientId=React.useId().replace(/:/g,'');

 const cutoff=new Date();cutoff.setFullYear(cutoff.getFullYear()-(/^\d+y$/.test(range)?parseInt(range):50));

 const points=(record.series||[]).filter(x=>new Date(x.date)>=cutoff);const values=points.filter(x=>x.value!==null);const min=values.length?Math.min(...values.map(x=>x.value!)):0,max=values.length?Math.max(...values.map(x=>x.value!)):0;

 const yearTicks:Array<{year:number;i:number}>=[];if(points.length){for(let year=Number(points[0].date.slice(0,4));year<=Number(points.at(-1)!.date.slice(0,4));year++){const i=points.findIndex(p=>Number(p.date.slice(0,4))>=year);if(i>=0)yearTicks.push({year,i});}}const visibleTicks=yearTicks.filter((t,i)=>i%Math.max(1,Math.ceil(yearTicks.length/7))===0||i===yearTicks.length-1);const x=(i:number)=>i/Math.max(points.length-1,1)*640+4;const y=(v:number)=>max===min?85.5:148-(v-min)/(max-min)*125;

 let path='',drawing=false;points.forEach((p,i)=>{if(p.value===null){drawing=false;return;}path+=`${drawing?'L':'M'}${x(i)},${y(p.value)} `;drawing=true;});

 return <section className={['fred:CPIAUCSL','fred:UNRATE','fred:USSTHPI','fred:MORTGAGE30US','fred:TXSTHPI','fred:RCCCBPURCHASETOT','fred:FEDFUNDS'].includes(record.id)?'panel chart cpi-chart':record.provider==='property-history'?'panel chart assessment-chart':'panel chart'}><div className="panel-head"><div><span className="eyebrow">{record.scope}</span><h3>{record.title}</h3></div><button className="icon" onClick={open} aria-label="Inspect chart evidence"><ArrowUpRight size={17}/></button></div>{record.id==='fred:RCCCBPURCHASETOT'&&<p className="form-pad">Quarterly purchases at reporting large banks, less returns. Excludes cash advances and balance transfers; spending, not debt balances. Not seasonally adjusted.</p>}<div className="chart-number">{number(focus?.value??record.value)} <span>{record.units}</span></div>

 {points.length?table?<div className="table-scroll chart-table"><table><thead><tr><th>Observation date</th><th>{record.units}</th></tr></thead><tbody>{points.slice().reverse().map(p=><tr key={p.date}><td>{p.date}</td><td>{number(p.value)}</td></tr>)}</tbody></table></div>:<div className="plot"><div className="axis-labels"><span>{number(max)}</span><span>{number(min)}</span></div><svg viewBox="0 0 652 190" role="img" aria-label={`${record.title}, ${record.units}; ${points[0]?.date} through ${points.at(-1)?.date}. ${['fred:CPIAUCSL','fred:UNRATE','fred:USSTHPI','fred:MORTGAGE30US','fred:TXSTHPI','fred:RCCCBPURCHASETOT','fred:FEDFUNDS'].includes(record.id)?'Green is low and red high':record.provider==='property-history'?'Blue is low and green high':'Blue is lower and green higher'} within the selected range. Use table for exact observations.`}><defs><linearGradient id={gradientId} gradientUnits="userSpaceOnUse" x1="0" y1="148" x2="0" y2="23"><stop offset="0%" stopColor="var(--market-cool)"/><stop offset="100%" stopColor="var(--market-growing)"/></linearGradient></defs>{[23,65,107,149].map(a=><line key={a} x1="4" x2="648" y1={a} y2={a} stroke="var(--border)" strokeDasharray="3 6"/>)}<path d={path} fill="none" stroke={"url(#"+gradientId+")"} strokeWidth="3" strokeLinejoin="round"/>{points.map((p,i)=>p.value===null?null:<circle key={p.date} cx={x(i)} cy={y(p.value)} r="3" fill={"url(#"+gradientId+")"} onMouseEnter={()=>setFocus(p)} onMouseLeave={()=>setFocus(null)}><title>{p.date}: {number(p.value)} {record.units}</title></circle>)}{visibleTicks.map(t=><g key={t.year}><line x1={x(t.i)} x2={x(t.i)} y1="154" y2="159" stroke="var(--muted)"/><text x={x(t.i)} y="179" fill="var(--text)" fontSize="16" textAnchor={t.i===0?'start':t.i===points.length-1?'end':'middle'}>{t.year}</text></g>)}</svg><div className="chart-dates"><span>{points[0]?.date}</span><span>{focus?.date||points.at(-1)?.date}</span></div></div>:<Empty title="No observations in this range">Choose a wider date range.</Empty>}

 <div className="market-legend"><span><i/>{['fred:CPIAUCSL','fred:UNRATE','fred:USSTHPI','fred:MORTGAGE30US','fred:TXSTHPI','fred:RCCCBPURCHASETOT','fred:FEDFUNDS'].includes(record.id)?(record.id==='fred:RCCCBPURCHASETOT'?'Lower / shrinking':'Low'):record.provider==='property-history'?'Low':'Cool / lower'}</span><b/><span>{['fred:CPIAUCSL','fred:UNRATE','fred:USSTHPI','fred:MORTGAGE30US','fred:TXSTHPI','fred:RCCCBPURCHASETOT','fred:FEDFUNDS'].includes(record.id)?(record.id==='fred:RCCCBPURCHASETOT'?'Higher / growing':'High'):record.provider==='property-history'?'High':'Growing / higher'}<i/></span><small>Color follows values within the selected range, not a calculated growth rate.</small></div><div className="chart-footer"><span>{record.provider.toUpperCase()} · {record.status==='VERIFIED SNAPSHOT'?'snapshot':'observed'} {record.date}</span><button onClick={()=>setTable(!table)}>{table?'Chart view':'View data table'}</button></div></section>;

}

function Chart(props:{record:RecordData;open:()=>void;range?:string}){return props.record.provider==='cdc-wval'?<ActivityBars {...props} range={props.range||'8w'}/>:props.record.domain==='wastewater'?<WastewaterChart {...props}/>:<SeriesChart {...props}/>;}

export default function CommandCenter(){

 const {pathname,params,router}=useRoute();const key=pathname.split('/')[1]||'today',page=pages.find(p=>p[0]===key);const legacyTab=params.get('tab')||tabs[key]?.[0]||'';const requestedTab=key==='wastewater'?(legacyTab.toLowerCase()==='focus states'?'Other States':legacyTab.toLowerCase()==='coverage map'?'U.S. Map':legacyTab):legacyTab;const tab=['national-housing','local-housing'].includes(key)&&requestedTab==='Affordability'?'Market trends':key==='infrastructure'&&requestedTab==='Space infrastructure'?'Orbital':key==='wastewater'&&!tabs[key].includes(requestedTab)?'U.S. Map':key==='companies'&&!tabs[key].includes(requestedTab)?'Company landscape':key==='research'&&['Treatment landscape','My top 7 theories'].includes(requestedTab)?'Watchlist':requestedTab;

 const [state,setState]=useState<State>(initial),[records,setRecords]=useState<RecordData[]>([]),[health,setHealth]=useState<any[]>([]),[loaded,setLoaded]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState(''),[saveStatus,setSaveStatus]=useState(''),[drawer,setDrawer]=useState<RecordData|null>(null),[searchOpen,setSearchOpen]=useState(false),[query,setQuery]=useState(''),[collapsed,setCollapsed]=useState(false),[mobile,setMobile]=useState(false),[addOpen,setAddOpen]=useState(false),[range,setRange]=useState(params.get('range')||'5y'),[sort,setSort]=useState('date'),[noteText,setNoteText]=useState(''),[noteTag,setNoteTag]=useState(''),[since,setSince]=useState(''),[toast,setToast]=useState('');

 const [newsBusy,setNewsBusy]=useState(false);const autoNews=useRef(false);

 const mounted=useRef(false),saveChain=useRef(Promise.resolve());

 const geoRefresh=useRef(false);

 async function refreshGeopolitics(){setBusy(true);try{const r=await fetch('/api/refresh?source=worldmonitor',{method:'POST'});if(!r.ok)throw new Error('Event refresh unavailable');await load();}catch(e:any){setError(e.message);}finally{setBusy(false);}}

 useEffect(()=>{if(!loaded||key!=='geopolitics'||geoRefresh.current)return;geoRefresh.current=true;const prior=health.find(h=>h.id==='worldmonitor');if(!prior?.success||Date.now()-Date.parse(prior.success)>3600000)refreshGeopolitics();},[key,loaded]);

 const activityRefresh=useRef(false);

 useEffect(()=>{if(!loaded||key!=='wastewater'||activityRefresh.current)return;activityRefresh.current=true;const prior=health.find(h=>h.id==='cdc-wval');if(!prior?.success||Date.now()-Date.parse(prior.success)>7*86400000)fetch('/api/refresh?source=cdc-wval',{method:'POST'}).then(r=>{if(!r.ok)throw new Error('Wastewater activity refresh unavailable');return load();}).catch(e=>setError(e.message));},[key,loaded]);

 const all=[...records,...state.manual];

 const update=(patch:Partial<State>)=>setState(s=>({...s,...patch}));

 const spaceWeatherRefresh=useRef(false);useEffect(()=>{if(key!=='space-systems'){spaceWeatherRefresh.current=false;return;}if(!loaded||spaceWeatherRefresh.current)return;spaceWeatherRefresh.current=true;const prior=health.find(h=>h.id==='space-weather');if(!prior?.success||Date.now()-Date.parse(prior.success)>3600000)fetch('/api/refresh?source=space-weather',{method:'POST'}).then(r=>{if(!r.ok)throw new Error('Space-weather refresh unavailable');return load();}).catch(e=>setError(e.message));},[key,loaded]);

 async function load(){const r=await fetch('/api/workspace');const data:any=await r.json();if(!r.ok)throw new Error(data.error);setRecords(data.records);setHealth(data.health);return data;}

 useEffect(()=>{if(!loaded)return;const timer=setInterval(()=>{load().catch(()=>{});},300000);return()=>clearInterval(timer);},[loaded]);

 async function refreshPopulation(){setBusy(true);setError('');try{const r=await fetch('/api/refresh?source=population-health',{method:'POST'});if(!r.ok)throw new Error('Population health refresh unavailable');await load();setToast('Health source verification complete; inspect source health for any failures.');}catch(e:any){setError(e.message);}finally{setBusy(false);}}
 async function refreshSpace(){setBusy(true);setError('');try{const r=await fetch('/api/refresh?source=space',{method:'POST'});if(!r.ok)throw new Error('Space source refresh unavailable');await load();}catch(e:any){setError(e.message);}finally{setBusy(false);}}

 async function refreshAgriculture(){setBusy(true);setError('');try{const r=await fetch('/api/refresh?source=agriculture',{method:'POST'});if(!r.ok)throw new Error('Agriculture refresh unavailable');await load();}catch(e:any){setError(e.message);}finally{setBusy(false);}}

 async function refreshLogistics(){setBusy(true);try{const r=await fetch('/api/refresh?source=logistics',{method:'POST'});if(!r.ok)throw new Error('Logistics refresh unavailable');await load();}catch(e:any){setError(e.message);}finally{setBusy(false);}}

 async function refreshNews(){setNewsBusy(true);try{const r=await fetch('/api/news',{method:'POST'});if(!r.ok)throw new Error('News refresh unavailable');await load();}catch(e:any){setError(e.message);}finally{setNewsBusy(false);}}

 async function refresh(){setBusy(true);setError('');try{const r=await fetch('/api/refresh',{method:'POST'});const data:any=await r.json();if(!r.ok)throw new Error(data.error);await load();setToast('Refresh complete. Source health shows any access failures.');}catch(e:any){setError(e.message);}finally{setBusy(false);}}

 useEffect(()=>{let active=true;load().then(data=>{if(!active)return;const s={...initial,...(data.state||{})};if(s.preferences?.brandPalette!==2){s.theme='light';s.preferences={...s.preferences,brandPalette:2};}setSince(s.lastVisit);setState({...s,lastVisit:new Date().toISOString()});setLoaded(true);if(!data.health.length)refresh();}).catch(e=>{setError(e.message);});return()=>{active=false;};},[]);

 useEffect(()=>{if(!loaded)return;if(!mounted.current){mounted.current=true;}const timer=setTimeout(()=>{setSaveStatus('Saving…');saveChain.current=saveChain.current.catch(()=>{}).then(async()=>{const r=await fetch('/api/workspace',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(state)});if(!r.ok){const d:any=await r.json();throw new Error(d.error);}setSaveStatus('Saved');}).catch(e=>setSaveStatus(e.message));},550);return()=>clearTimeout(timer);},[state,loaded]);

 useEffect(()=>{document.documentElement.dataset.theme=state.theme;},[state.theme]);

 useEffect(()=>{setCollapsed(!!state.preferences?.collapsed);},[state.preferences?.collapsed]);

 useEffect(()=>{if(!drawer&&!searchOpen&&!addOpen)return;const previous=document.activeElement as HTMLElement;const dialog=document.querySelector('[role="dialog"]') as HTMLElement;const selector='button:not([disabled]),a[href],input,textarea,select,[tabindex="0"]';const focusable=()=>Array.from(dialog?.querySelectorAll<HTMLElement>(selector)||[]);focusable()[0]?.focus();const trap=(e:KeyboardEvent)=>{if(e.key!=='Tab')return;const items=focusable(),first=items[0],last=items.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}};document.addEventListener('keydown',trap);return()=>{document.removeEventListener('keydown',trap);previous?.focus();};},[!!drawer,searchOpen,addOpen]);

 useEffect(()=>{const listener=(e:KeyboardEvent)=>{if((e.metaKey||e.ctrlKey)&&e.key==='k'){e.preventDefault();setSearchOpen(v=>!v);}if(e.key==='Escape'){setDrawer(null);setSearchOpen(false);setAddOpen(false);const q=new URLSearchParams(window.location.search);q.delete('record');router.replace(window.location.pathname+'?'+q.toString());}};window.addEventListener('keydown',listener);return()=>window.removeEventListener('keydown',listener);},[]);

 useEffect(()=>{if(toast){const t=setTimeout(()=>setToast(''),5000);return()=>clearTimeout(t);}},[toast]);

 useEffect(()=>{setRange(params.get('range')||'5y');const record=params.get('record');setDrawer(record?all.find(r=>r.id===record)||null:null);},[pathname,params,records.length]);

 const setParam=(name:string,value:string)=>{const q=new URLSearchParams(params.toString());value?q.set(name,value):q.delete(name);router.replace(`${pathname}?${q}`);};

 const open=(r:RecordData)=>{setDrawer(r);const q=new URLSearchParams(params.toString());q.set('record',r.id);router.replace(`${pathname}?${q}`);};

 const closeDrawer=()=>{setDrawer(null);setParam('record','');};

 const save=(id:string)=>update({saved:state.saved.includes(id)?state.saved.filter(x=>x!==id):[...state.saved,id]});

 const matched=(domain:string)=>all.filter(r=>r.domain===domain).sort((a,b)=>sort==='title'?a.title.localeCompare(b.title):b.date.localeCompare(a.date));

 const select=(id:string)=>all.find(r=>r.id===id);

 const changed=all.filter(r=>r.change&&(!since||r.change.at>since)&&!state.dismissed.includes(r.id)&&!state.muted.includes(r.domain)).sort((a,b)=>b.change.at.localeCompare(a.change.at));

 const topMetrics=state.watch.map(select).filter(Boolean) as RecordData[];

 function table(rows:RecordData[],title='Evidence & records'){return <section className="panel"><div className="panel-head"><h3>{title} <span className="count">{rows.length}</span></h3><button onClick={()=>exportFile(`${key}-records.json`,rows)} className="quiet"><Download size={14}/> Export</button></div>{!rows.length?<Empty title={busy?'Retrieving source records…':'No verified records yet'}>{busy?'The dashboard will update as adapters finish.':'Connect a source or add a source-linked record. Missing data stays missing.'}</Empty>:<div className="table-scroll"><table><thead><tr><th><button onClick={()=>setSort(sort==='title'?'date':'title')}>Record ↕</button></th><th>Evidence / status</th><th>Scope</th><th><button onClick={()=>setSort('date')}>Source date ↓</button></th>{key==='trials'&&<th>Planned completion ↑</th>}<th>Save</th></tr></thead><tbody>{rows.map(r=><tr key={r.id}><td><button className="row-title" onClick={()=>open(r)}>{r.title}<span>{r.id} · {r.provider}</span></button></td><td><span className="badge">{r.status.replaceAll('_',' ')}</span></td><td>{r.scope}</td><td>{r.date||'Unknown'}<span className="cell-sub">Retrieved {when(r.retrieved)}</span></td>{key==='trials'&&<td>{r.details?.completion?.date||r.details?.primaryCompletion?.date||'Not provided'}<span className="cell-sub">{r.details?.completion?.type||r.details?.primaryCompletion?.type||'Registry-listed'}</span></td>}<td><button className={'icon '+(state.saved.includes(r.id)?'saved':'')} onClick={()=>save(r.id)} aria-label={state.saved.includes(r.id)?'Unsave record':'Save record'}><Bookmark size={16}/></button></td></tr>)}</tbody></table></div>}</section>;}

 const gapSources=sources.filter(s=>s.mode==='manual'||!health.find(h=>h.id===s.id&&h.status==='connected'));

 const charts=(domain:string)=>matched(domain).filter(r=>r.provider!=='cdc-wval'&&r.series&&(domain!=='wastewater'||(tab==='Local trends'?/Travis|Hays|Bastrop/i.test(r.scope):tab==='Texas'))).sort((a,b)=>{if(domain!=='economy')return 0;const order=['fred:UNRATE','fred:FEDFUNDS','fred:CPIAUCSL','fred:RCCCBPURCHASETOT','fred:PCEPI','fred:DSPIC96'];const rank=(id:string)=>order.includes(id)?order.indexOf(id):order.length;return rank(a.id)-rank(b.id);}).map(r=>r.provider==='property-history'?<HomeHistory key={r.id} record={r} chart={r=><Chart record={r} range='5y' open={()=>open(r)}/>}/>:<Chart key={r.id} record={r} range={range} open={()=>open(r)}/>);

 const sourcesPanel=(domain:string)=><section className="panel"><div className="panel-head"><h3>{['local-housing','national-housing'].includes(domain)?'Housing source shelf':'Primary source shelf'}</h3><span className="eyebrow">{domain==='local-housing'?'Verify sale / appraisal distinctions':'Curate with provenance'}</span></div><div className="source-shelf">{sources.filter(s=>s.domain===domain).map(s=><a key={s.id} href={s.url} target="_blank" rel="noreferrer"><Database size={19}/><div><strong>{s.name}</strong><p>{s.coverage}</p><span className="badge">{s.mode==='manual'?'Manual source':'Refresh adapter'}</span></div><ExternalLink size={15}/></a>)}</div></section>;

 function notebook(){return <section className="panel"><div className="panel-head"><h3>Research notebook</h3><span className="eyebrow">Private • no external AI processing</span></div><div className="form-pad"><textarea value={noteText} onChange={e=>setNoteText(e.target.value)} placeholder="A question to investigate, conflicting evidence, or a clinician discussion note…" aria-label="New note"/><div className="inline"><input value={noteTag} onChange={e=>setNoteTag(e.target.value)} placeholder="Tags, separated by commas"/><button className="primary" disabled={!noteText.trim()||!loaded} onClick={()=>{update({notes:[{id:crypto.randomUUID(),text:noteText,tags:noteTag.split(',').map(x=>x.trim()).filter(Boolean),domain:key,date:new Date().toISOString(),record:drawer?.id},...state.notes]});setNoteText('');setNoteTag('');}}>Save note</button></div></div>{state.notes.filter(n=>key==='library'||n.domain===key).map(n=><article className="note" key={n.id}><div className="inline"><span className="eyebrow">{n.domain} · {when(n.date)}</span><button className="icon" aria-label="Delete note" onClick={()=>update({notes:state.notes.filter(x=>x.id!==n.id)})}><Trash2 size={14}/></button></div><p>{n.text}</p><div className="tags">{n.tags.map((t:string)=><span className="badge" key={t}>{t}</span>)}</div></article>)}</section>;}

 function overview(){return <>

  <div className="welcome"><div><span className="eyebrow">YOUR PERSONAL INTELLIGENCE WORKSPACE</span><h1>Weekly Snapshot</h1><p>The wider measure and macro metrics</p></div><div className="date-block"><span>{new Date().toLocaleDateString('en-US',{timeZone:'America/Chicago',weekday:'long'})}</span><strong>{new Date().toLocaleDateString('en-US',{timeZone:'America/Chicago',month:'long',day:'numeric'})}</strong><span>Central time</span></div></div>

  <EnergyPrices records={records} open={open}/><MarketPulse records={records} open={open}/>

  <div className="metrics">{['fred:CPIAUCSL','fred:UNRATE','fred:MORTGAGE30US','fred:USSTHPI'].map((id,i)=>{const r=select(id);return <button className="metric cpi-metric" key={id} onClick={()=>r?open(r):router.push('/settings')}><div className="eyebrow">{['CONSUMER PRICES','U.S. UNEMPLOYMENT','30-YEAR MORTGAGE','U.S. HOME PRICE INDEX'][i]}<ArrowUpRight size={14}/></div><strong style={{color:metricColor(r,true)}}>{number(r?.value)}{r?.units==='Percent'?<small>%</small>:null}</strong><p>{r?.status==='VERIFIED SNAPSHOT'?'Snapshot · ':''}{r?`${r.date} · ${r.units}`:'Awaiting source · no observation'}</p><span className="metric-line"/></button>;})}</div>

  <NewsTile records={records} health={health.find(h=>h.id=="news")} busy={newsBusy||busy} onRefresh={refreshNews} saved={state.saved} onSave={save}/>

  <div className="section-label"><h2>Upcoming milestones</h2><Link prefetch={false} href="/trials?tab=Calendar">Trial calendar <ArrowUpRight size={14}/></Link></div>{calendar(all.filter(r=>r.domain==='trials'))}

 

 </>;}

 function calendar(rows:RecordData[]){const events=rows.filter(r=>r.details?.primaryCompletion?.date&&r.details.primaryCompletion.date>=new Date().toISOString().slice(0,10)).sort((a,b)=>a.details.primaryCompletion.date.localeCompare(b.details.primaryCompletion.date));return <section className="panel">{events.length?<div className="milestones">{events.slice(0,12).map(r=><button key={r.id} onClick={()=>open(r)}><Clock size={17}/><strong>{r.details.primaryCompletion.date}</strong><span>{r.title}</span><small>{r.details.primaryCompletion.type||'Source-listed'} primary completion · not an appointment</small></button>)}</div>:<Empty title="No verified milestones loaded">Dates will come from registry records or source-linked entries, with estimated dates labeled.</Empty>}</section>;}

 function maps(rows:RecordData[]){const sites=rows.flatMap(r=>(r.details?.sites||[]).filter((s:any)=>s.geoPoint).map((s:any)=>({record:r,site:s})));return <><section className="panel"><div className="panel-head"><h3>Registry-listed locations</h3><span className="badge">{sites.length} geocoded sites</span></div><p className="form-pad">Locations are supplied by the registry. Open a coordinate link to view its actual map; site recruitment and remote participation require confirmation. Straight-line distance uses the haversine formula from Smithville (30.0086, −97.1594).</p>{sites.length?<div className="table-scroll"><table><thead><tr><th>Study</th><th>Facility / location</th><th>Distance</th><th>Map</th></tr></thead><tbody>{sites.slice(0,150).map(({record,site},i)=><tr key={i}><td><button onClick={()=>open(record)}>{record.id}</button></td><td>{site.facility}<span className="cell-sub">{site.city}, {site.state}, {site.country} · {site.status||'Site status not supplied'}</span></td><td>{Math.round(distanceKm({lat:30.0086,lon:-97.1594},{lat:site.geoPoint.lat,lon:site.geoPoint.lon}))} km</td><td><a href={`https://www.openstreetmap.org/?mlat=${site.geoPoint.lat}&mlon=${site.geoPoint.lon}#map=12/${site.geoPoint.lat}/${site.geoPoint.lon}`} target="_blank" rel="noreferrer">Open map ↗</a></td></tr>)}</tbody></table></div>:<Empty title="No verified coordinates">Refresh trials or add a geocoded source record.</Empty>}</section></>;}

 function domainPage(){if(key==='national-housing'&&tab==='Smart Upgrades')return <SmartUpgrades/>;if(key==='capabilities')return <CapabilityDashboard tab={tab} onTab={value=>setParam('tab',value)}/>;if(key==='trust-safety')return <TrustSafety tab={tab}/>;if(key==='labor')return <LaborDashboard tab={tabs.labor.includes(tab)?tab:'Employment Overview'}/>;if(key==='population-health')return <PopulationHealth records={all} tab={tabs['population-health'].includes(tab)?tab:'Overview'} open={open} loaded={loaded} busy={busy} error={error} onRefresh={refreshPopulation} filters={{age:params.get('ph-age')||'Source universes',sex:params.get('ph-sex')||'All',region:'United States',period:params.get('ph-period')||'Latest connected',rate:params.get('ph-rate')||'Published basis',start:params.get('ph-start')||'2010',group:params.get('ph-group')||'All groups'}} onFilter={setParam}/>;if(key==='space-systems')return <SpaceSystems records={records} open={open} loaded={loaded} error={error} busy={busy} onRefresh={refreshSpace}/>;

  if(key==='supply-chains')return null;
  if(key==='agriculture')return <AgricultureDashboard records={records} open={open} loaded={loaded} onRefresh={refreshAgriculture} busy={busy} error={error}/>;

  if(key==='logistics')return <LogisticsDashboard records={all} health={health} open={open} loaded={loaded} onRefresh={()=>refreshLogistics()} busy={busy} error={error}/>;if((unpopulatedPages as readonly string[]).includes(key))return <section className="panel form-pad unpopulated-section"><h2>{page?.[1]}</h2><p>This section will be populated separately.</p></section>;if(key==='national-housing'&&tab==='Regional comparison')return <StateHomeValues/>;if(key==='internet')return <InternetDashboard tab={tabs.internet.includes(tab)?tab:'Internet'}/>;if(key==='infrastructure'&&tab==='Orbital')return <SpaceInfrastructure/>;if(key==='infrastructure')return <InfrastructureDashboard tab={tabs.infrastructure.includes(tab)?tab:'Water'}/>;if(key==='research'&&tab==='Watchlist')return <><ResearchTheories/>{notebook()}</>;if(key==='companies'&&tab==='Bubble risk')return <BubbleRisk open={open}/>;if(key==='companies'&&tab==='AI growth')return <AIGrowth open={open} save={save} saved={state.saved}/>;if(key==='companies')return <><CompanyDashboard open={open} save={save} saved={state.saved}/>{sourcesPanel('companies')}</>;if(key==='geopolitics'&&['Event watch','Supply-chain disruptions','Aggressive rhetoric','Military buildup & weapons'].includes(tab))return <><GeopoliticsEvents records={matched('geopolitics').filter(r=>r.provider==='worldmonitor')} category={tab} open={open} save={save} saved={state.saved} refresh={refreshGeopolitics} busy={busy} health={health.find(h=>h.id==='worldmonitor')}/>{sourcesPanel('geopolitics')}</>;if(key==='wastewater'&&tab==='U.S. Map')return <><WastewaterMap records={all} open={open}/>{sourcesPanel('wastewater')}</>;if(key==='wastewater'&&['Local trends','Texas','Other States','National'].includes(tab))return wastewaterPage();let rows=key==='trials'?byCompletion(matched(key)):matched(key);if(key==='wastewater'&&tab==='Local trends')rows=rows.filter(r=>/Travis|Hays|Bastrop/i.test(r.scope));if(key==='wastewater'&&tab==='National')rows=[];if(tab==='Reventure')rows=rows.filter(r=>r.provider==='reventure');return <>{key==='economy'&&tab==='Macro health'&&<EconomyLogisticsSummary records={all} health={health} open={open}/>} {['national-housing','local-housing'].includes(key)&&<div className="notice"><MapPin size={17}/><strong>{key==='national-housing'?'National housing view · United States':'Local housing view · Bastrop & Central Texas'}</strong></div>}

 {(key==='local-housing'||key==='national-housing')&&(tab==='Market trends'||tab==='Reventure')&&<ReventurePanel domain={key} records={state.manual} onSave={r=>{update({manual:[r,...state.manual.filter(x=>x.id!==r.id)]});setToast('Reventure observations saved.');}}/>}
 {key==='national-housing'&&tab!=='Reventure'&&<HousingMap/>}

 {(key==='local-housing'||key==='national-housing'||key==='economy'||key==='wastewater')&&<><div className="chart-grid">{tab==='Reventure'?rows.filter(r=>r.series).map(r=><React.Fragment key={r.id}><Chart record={r} open={()=>open(r)} range={range}/>{r.id==='fred:MORTGAGE30US'&&select('property:119-kawainui-assessment')&&<HomeHistory record={select('property:119-kawainui-assessment')!} chart={r=><Chart record={r} open={()=>open(r)} range='5y'/>}/>}</React.Fragment>):key==='national-housing'&&tab==='Market trends'?['fred:USSTHPI','fred:TXSTHPI','fred:MORTGAGE30US','property:119-kawainui-assessment'].map(id=>{const r=select(id);return r?(r.provider==='property-history'?<HomeHistory key={id} record={r} chart={r=><Chart record={r} range='5y' open={()=>open(r)}/>}/>:<Chart key={id} record={r} range={id==='fred:MORTGAGE30US'?'5y':range} open={()=>open(r)}/>):null}):charts(key)}</div></>}

 {key==='local-housing'&&tab!=='Reventure'&&<div className="notice"><MapPin size={17}/><div><strong>Local closed-sale coverage is not connected.</strong><p>The mortgage series above is U.S. context. Appraisal values are not sold prices. Add legitimate local records without fabricating comps.</p></div></div>}


 {key==='economy'&&tab==='Purchasing power'&&<PurchasingPower records={all}/>}
 {key==='economy'&&tab==='Macro health'&&<EconomyLogisticsDetails records={all} open={open}/>}

 {key==='wastewater'&&<div className="notice"><MapPin size={17}/><div><strong>Texas site data fallback • Bastrop / Smithville coverage unverified</strong><p>Raw site concentrations retain their units and laboratory grouping. Source-listed counties served do not establish county-wide coverage. National and focus-jurisdiction activity summaries use normalized CDC observations. Raw concentration charts remain separate.</p></div></div>}

 {key==='wastewater'&&tab==='Methods'&&<section className="panel form-pad"><h3>Interpret like with like</h3><p>The CDC adapter retains source rows and source-defined categories. Raw concentration, normalized concentration, modeled values and activity levels are different measures. Sampling changes, missing periods and reporting lags limit comparisons. Activity summaries use a dashboard-calculated unweighted median of reporting sites per CDC week_end, excluding missing values and duplicate site-week rows. These are not official CDC state estimates or population-weighted aggregates. No percentage change is calculated from unlike categories.</p><p>Local service-area boundaries must be verified before labeling any result Bastrop or Smithville.</p></section>}

 {key==='research'&&!['Publications','Drug development'].includes(tab)&&<ResearchLandscape tab={tab} records={all} open={open}/>}

 {key==='trials'&&tab==='Calendar'?calendar(rows):key==='trials'&&tab==='Map'?<TrialMap records={rows} open={open} onRefresh={refresh} busy={busy}/>:key==='trials'&&tab==='Top 10'?<TrialsOverview records={rows} open={open} saved={state.saved} onSave={save}/>:key==='trials'&&tab==='Changes'?table(rows.filter(r=>r.change),'Registry changes'):key==='economy'?null:table(rows,key==='research'?'Publications · review required':'Source-linked evidence')}

 {key==='companies'&&tab==='Bubble indicators'&&<section className="panel form-pad"><h3>AI investment evidence board</h3><p>Track capex versus monetization, financing dependence, earnings revisions, valuation denominators, utilization and power constraints. No invented bubble probability is calculated.</p><div className="two-col"><div><span className="eyebrow">Supporting signals</span><p>{rows.filter(r=>r.details?.stance==='support').map(r=>r.title).join('; ')||'No reviewed signals saved.'}</p></div><div><span className="eyebrow">Counterevidence</span><p>{rows.filter(r=>r.details?.stance==='counter').map(r=>r.title).join('; ')||'No reviewed counterevidence saved.'}</p></div></div></section>}

 {sourcesPanel(key)}{(key==='research'||key==='infrastructure')&&notebook()}

 </>;}

 function wastewaterPage(){

  const selected=focusStates.includes(params.get('state')||'')?params.get('state')!:'California';

  const geography=tab==='Other States'?selected:tab==='Texas'?'Texas':tab==='National'?'United States':'Central Texas service areas';

  const activity=all.filter(r=>r.provider==='cdc-wval');

  const aggregate=activity.find(r=>r.details?.aggregate&&r.scope===geography);

  const siteRows=nearBastrop(tab==='Other States'?all.filter(r=>r.domain==='wastewater').filter(r=>r.provider==='cdc-wval'&&!r.details?.aggregate&&r.scope===selected):tab==='Texas'||tab==='Local trends'?all.filter(r=>r.domain==='wastewater').filter(r=>r.provider==='cdc'&&(tab==='Texas'||/Travis|Hays|Bastrop/i.test(r.scope))):[]);

  return <>{tab==='Other States'&&<div className="focus-states" aria-label="Focus jurisdictions">{focusStates.map(state=><button key={state} aria-pressed={selected===state} className={selected===state?'selected':''} onClick={()=>setParam('state',state)}>{state==='District of Columbia'?'Washington DC':state}</button>)}</div>}{aggregate?<ActivityBars record={aggregate} range={range} open={()=>open(aggregate)}/>:<section className="panel"><Empty title="No aggregate observations available">No verified weekly activity for {geography} in the current source window.</Empty></section>}<p className='site-proximity'>Sites serving Bastrop County first; other known Texas service areas ordered by approximate county-reference distance. <a href='https://www.census.gov/geographies/reference-files/2025/geo/gazetter-file.html' target='_blank' rel='noreferrer'>Census geography source ↗</a></p><div className="section-label"><h2>{tab==='National'?'National weekly evidence':'Individual monitored sites'}</h2><span className="badge">{siteRows.length} series · nearest Bastrop service areas first</span></div><div className="chart-grid">{siteRows.map(r=><div key={r.id} className='nearby-site'><p className='site-proximity'>{siteProximity(r)}</p>{r.provider==='cdc-wval'?<ActivityBars record={r} range={range} open={()=>open(r)}/>:<Chart record={r} range={range} open={()=>open(r)}/>}</div>)}</div>{tab!=='National'&&!siteRows.length&&<section className="panel"><Empty title="No site observations in this view">Refresh the connected sources.</Empty></section>}{table(tab==='National'&&aggregate?[aggregate]:siteRows,'Source-linked wastewater evidence')}{sourcesPanel('wastewater')}</>;

 }

 function library(){return <>

 {(key==='local-housing'||key==='national-housing')&&(tab==='Market trends'||tab==='Reventure')&&<ReventurePanel domain={key} records={state.manual} onSave={r=>{update({manual:[r,...state.manual.filter(x=>x.id!==r.id)]});setToast('Reventure observations saved.');}}/>}{table(all.filter(r=>state.saved.includes(r.id)),'Saved evidence')}{notebook()}<section className="panel"><div className="panel-head"><h3>Saved views</h3></div>{state.views.length?state.views.map(v=><div className="note inline" key={v.id}><Link prefetch={false} href={v.href}>{v.name}</Link><button className="icon" onClick={()=>update({views:state.views.filter(x=>x.id!==v.id)})} aria-label="Delete saved view"><Trash2 size={14}/></button></div>):<Empty title="No saved views yet">Save filters on any domain page.</Empty>}</section></>;}

 function connections(){return <><div className="notice"><Network size={18}/><div><strong>Evidence-linked comparisons</strong><p>Each panel keeps its own units and geography. A connection is a research hypothesis until evidence and counterevidence support it.</p></div></div><BoardBuilder records={all} onSave={b=>update({boards:[b,...state.boards]})}/>{state.boards.map(b=><section className="panel form-pad" key={b.id}><div className="panel-head"><h3>{b.title}</h3><button className="icon" aria-label="Delete board" onClick={()=>update({boards:state.boards.filter(x=>x.id!==b.id)})}><Trash2 size={15}/></button></div><p>{b.hypothesis}</p><div className="two-col"><div><span className="eyebrow">Supporting evidence</span><p>{b.support||'Unreviewed'}</p></div><div><span className="eyebrow">Counterevidence / uncertainty</span><p>{b.counter||'Unreviewed'}</p></div></div><div className="chart-grid">{b.records.map((id:string)=>{const r=select(id);return r?.series?<Chart key={id} record={r} open={()=>open(r)} range={range}/>:r?<button className="note" key={id} onClick={()=>open(r)}>{r.title} ↗</button>:<p key={id}>Source record unavailable: {id}</p>;})}</div><button className="quiet" onClick={()=>exportFile('comparison-board.json',b)}><Download size={14}/> Export board</button></section>)}{!state.boards.length&&<div className="connection-examples"><span className="eyebrow">Questions to explore</span><div>Interest rates <ChevronRight size={16}/> Housing affordability</div><div>AI capital spending <ChevronRight size={16}/> Texas water & grid investment</div><div>Geopolitical disruptions <ChevronRight size={16}/> Hardware & energy costs</div></div>}</>;}

 function alerts(){return tab==='Alert rules'?<><AlertBuilder records={all} onSave={r=>update({rules:[...state.rules,r]})}/><section className="panel"><div className="panel-head"><h3>Your alert rules</h3><span className="badge">In-app only</span></div>{state.rules.length?state.rules.map(r=>{const result=alertPreview(r,all);return <div className="note" key={r.id}><div className="inline"><h3>{select(r.record)?.title||r.record}</h3><span className={'badge '+(result.fire?'amber':'')}>{result.fire?'Would fire':'Quiet'}</span><button className="icon" aria-label="Delete alert rule" onClick={()=>update({rules:state.rules.filter(x=>x.id!==r.id)})}><Trash2 size={14}/></button></div><p>{result.reason}</p><span className="eyebrow">{r.direction} {r.threshold} · {r.duration} observations · freshness {r.freshness} days · cooldown {r.cooldown} hours</span><button className="quiet" disabled={!result.fire} onClick={()=>{update({rules:state.rules.map(x=>x.id===r.id?{...x,lastFired:new Date().toISOString()}:x)});setToast('Alert acknowledged; cooldown started.');}}>Acknowledge</button></div>;}):<Empty title="No rules yet">Start with a metric and an explainable threshold. Preview before saving.</Empty>}</section></>:<section className="panel"><div className="panel-head"><h3>{tab}</h3><span className="badge">Structured preview</span></div><div className="form-pad"><p>{tab==='Ensitrelvir review'?'Monthly review target: last Friday of the month, America/Chicago.':tab==='Weekly synthesis'?'Weekly synthesis preview; delivery is not enabled.':'Daily preview target: 8 a.m., America/Chicago. Delivery is not enabled.'}</p><span className="eyebrow">No external automation or notifications configured</span></div>{table((tab==='Ensitrelvir review'?all.filter(r=>/ensitrelvir/i.test(r.title+JSON.stringify(r.details))):changed),'Changes & sources')}<div className="form-pad"><h3>Coverage & uncertainty</h3><p>{gapSources.map(s=>s.name).join('; ')} require review or connection. Newly retrieved baseline records are not claimed as new developments. No automated clinical, financial or geopolitical interpretation is generated.</p></div></section>;}

 function settings(){return <><section className="panel"><div className="panel-head"><h3>Connected sources & data health</h3><button className="primary" onClick={refresh} disabled={busy}><RefreshCw size={14} className={busy?'spin':''}/>{busy?'Refreshing':'Refresh due sources'}</button></div><div className="table-scroll"><table><thead><tr><th>Source</th><th>Status</th><th>Latest refresh / attempt</th><th>Coverage & cadence</th></tr></thead><tbody>{sources.map(s=>{const h=health.find(x=>x.id===s.id);return <tr key={s.id}><td><a href={s.url} target="_blank" rel="noreferrer">{s.name} ↗</a><span className="cell-sub">{all.filter(r=>r.provider===s.id).length} stored records</span></td><td><span className={'badge '+(h?.status==='error'?'amber':'')}>{s.mode==='manual'?'Manual curation':h?.status||'Not refreshed'}</span><span className="cell-sub">{h?.message}{h?.warnings?.join('; ')}</span></td><td>{when(h?.success)}<span className="cell-sub">Attempt {when(h?.attempt)}</span></td><td>{s.coverage}<span className="cell-sub">{s.cadence}</span></td></tr>;})}</tbody></table></div></section><section className="panel form-pad"><h3>Personal preferences</h3><div className="form-grid"><label>Home geography<input value={state.home} onChange={e=>update({home:e.target.value})}/></label><label>Theme<select value={state.theme} onChange={e=>update({theme:e.target.value})}><option value="dark">Dark</option><option value="light">Slate & navy</option></select></label></div><p>Geography is a display preference. It does not change a source’s actual scope.</p><h3>Watchlist metrics</h3><div className="check-grid">{all.filter(r=>r.series).map(r=><label key={r.id}><input type="checkbox" checked={state.watch.includes(r.id)} onChange={()=>update({watch:state.watch.includes(r.id)?state.watch.filter(x=>x!==r.id):[...state.watch,r.id]})}/>{r.title}</label>)}</div><h3>Muted domains</h3><div className="check-grid">{pages.filter(p=>!['today','library','alerts','settings','connections'].includes(p[0])).map(p=><label key={p[0]}><input type="checkbox" checked={state.muted.includes(p[0])} onChange={()=>update({muted:state.muted.includes(p[0])?state.muted.filter(x=>x!==p[0]):[...state.muted,p[0]]})}/>{p[3]}</label>)}</div></section><section className="panel form-pad"><h3>Privacy, backup & capabilities</h3><p>Hosted access is owner-private and requires ChatGPT sign-in. Notes and preferences are stored in your Site database. No notes are sent to an external model. No trades, emails or trial-site contacts are initiated.</p><div className="inline"><button className="button" onClick={()=>exportFile('signal-workspace-backup.json',state)}><Download size={15}/> Export my workspace</button><button className="button" onClick={()=>exportFile('signal-source-snapshots.json',records)}>Export source snapshots</button><label className="button">Restore workspace<input type="file" accept="application/json" hidden onChange={async e=>{const f=e.target.files?.[0];if(!f)return;try{const s=JSON.parse(await f.text());if(!Array.isArray(s.notes)||!Array.isArray(s.saved)||!Array.isArray(s.manual)||!Array.isArray(s.rules))throw new Error('Invalid backup');const parsed=workspaceSchema.parse({...initial,...s});setState(parsed as State);setToast('Workspace restored; saving to your private database.');}catch{setError('Backup could not be read. Existing workspace preserved.');}}}/></label></div><p className="muted">Refresh is on demand with source cadence caching. Background schedules, push delivery, financial quotes, rich map tiles, full-text extraction and AI-generated interpretation are not enabled. Source adapters report schema or access failures here.</p></section></>;}

 return <div className={'app '+(collapsed?'collapsed':'')+' '+(mobile?'mobile-nav':'')}>

 <section className="view-scale" aria-label="Dashboard view"><div className="view-scale-tabs" role="tablist" aria-label="Geographic view"><button type="button" role="tab" aria-selected="true" aria-controls="united-states-view" className="view-scale-active">United States</button><button type="button" role="tab" aria-selected="false" disabled>World <small>Coming later</small></button></div></section>

 <aside className="sidebar"><Link prefetch={false} href="/" className="brand"><div className="brand-mark profile-mark"><img src="/tyler-profile.png" alt="Tyler"/></div><div><strong>Tyler's Brief</strong></div></Link><div className="workspace-chip"><span className="avatar">T</span><div><strong>Personal workspace</strong><span><span className="live-dot"/> Private access</span></div><ChevronDown size={13}/></div><nav>{sidebarGroups.map((group)=><div className="nav-group" key={group}><span className="nav-label">{group}</span>{pages.filter(p=>p[2]===group).map(p=>{const Icon=icons[p[0]];return <Link prefetch={false} title={p[1]} key={p[0]} href={p[0]==='today'?'/':'/'+p[0]} onClick={()=>setMobile(false)} className={key===p[0]||(key==='local-housing'&&p[0]==='national-housing')?'active':''}><Icon size={17}/><span>{p[3]}</span>{key===p[0]&&<span className="nav-dot"/>}</Link>;})}</div>)}</nav><div className="sidebar-bottom"><details className="workspace-tools"><summary>Workspace tools</summary>{pages.filter(p=>p[2]==='Workspace').map(p=><Link key={p[0]} href={'/'+p[0]} onClick={()=>setMobile(false)}>{p[3]}</Link>)}</details><div className="inline"><span className="live-dot"/><span>Evidence first. Always.</span></div><button onClick={()=>update({preferences:{...state.preferences,collapsed:!collapsed}})} aria-label="Collapse sidebar"><PanelLeftClose size={16}/><span>Collapse sidebar</span></button></div></aside>

 <div className="main-shell" id="united-states-view"><header className="topbar"><div className="inline"><button className="icon mobile-menu" onClick={()=>setMobile(!mobile)} aria-label="Toggle navigation"><Menu size={20}/></button><span className="top-context">Workspace <ChevronRight size={13}/> <strong>{page?.[3]||'Page not found'}</strong></span></div><button className="global-search" onClick={()=>setSearchOpen(true)}><Search size={15}/><span>Search your command center</span><kbd>⌘ K</kbd></button><div className="top-actions"><span className="geography"><MapPin size={13}/>{state.home}</span><button className="icon" onClick={()=>update({theme:state.theme==='dark'?'light':'dark'})} aria-label="Toggle theme"><Sun size={17}/></button><Link prefetch={false} href="/alerts" className="icon" aria-label="Alerts"><Bell size={17}/></Link><span className="avatar small">T</span></div></header>

 <main><RefreshIndicators health={health} page={key} tab={tab}/>{error&&<div className="notice error" role="alert"><Database size={18}/><span>{error}</span><button className="quiet" onClick={()=>load().then(()=>{setLoaded(true);setError('');}).catch(e=>setError(e.message))}>Retry</button></div>}{key!=='today'&&<div className="page-heading"><div><span className="eyebrow">{page?.[2]} / TYLER'S BRIEF</span><h1>{key==='local-housing'?'Housing':page?.[1]||'Page not found'}</h1><p>{descriptions[key]}</p></div><div className="inline"><button className="icon" onClick={()=>update({favorites:state.favorites.includes(key)?state.favorites.filter(x=>x!==key):[...state.favorites,key]})} aria-label="Favorite page"><Bookmark size={18} fill={state.favorites.includes(key)?'currentColor':'none'}/></button><button className="button" disabled={!loaded} onClick={()=>setAddOpen(true)}><Plus size={15}/> Add evidence</button></div></div>}

 {key==='internet'&&<InternetOverview/>}
 {tabs[key]&&<div className={key==='population-health'?'tabs ph-tabs':'tabs'}>{['national-housing','local-housing'].includes(key)?[['Market trends','/national-housing?tab=Market+trends'],['Reventure','/national-housing?tab=Reventure'],['Regional comparison','/national-housing?tab=Regional+comparison'],['Smart Upgrades','/national-housing?tab=Smart+Upgrades']].map(([t,href])=><Link prefetch={false} key={t} href={href} className={tab===t?'housing-tab selected':'housing-tab'}>{t}</Link>):tabs[key].map(t=><button key={t} className={tab===t?'selected':''} onClick={()=>setParam('tab',t)}>{t}</button>)}<span className="tabs-spacer"/>{key==='wastewater'&&<select value={/^(4|8|12|26)w$/.test(range)||range==='all'?range:'8w'} aria-label="Wastewater chart range" onChange={e=>{setRange(e.target.value);setParam('range',e.target.value);}}><option value="4w">4 weeks</option><option value="8w">8 weeks</option><option value="12w">12 weeks</option><option value="26w">26 weeks</option><option value="all">All available weeks</option></select>}{['economy','local-housing','national-housing'].includes(key)&&tab!=='Smart Upgrades'&&<select value={range} aria-label="Chart range" onChange={e=>{setRange(e.target.value);setParam('range',e.target.value);}}><option value="1y">1 year</option><option value="3y">3 years</option><option value="5y">5 years</option><option value="all">Since 2010</option></select>}</div>}

 {!page?<Empty title="This route does not exist"><Link prefetch={false} href="/">Return to overview</Link></Empty>:key==='today'?overview():key==='library'?library():key==='connections'?connections():key==='alerts'?<>{alerts()}<SpaceBriefings records={records}/><AgricultureBriefings records={records}/></>:key==='settings'?settings():domainPage()}

 <footer><span><ShieldCheck size={13}/> Owner-private workspace · America/Chicago</span><span>{busy?'Refreshing primary sources…':saveStatus||'Loading workspace…'} · {all.length} source records</span></footer></main></div>

 {drawer&&<><div className="drawer-backdrop" onClick={closeDrawer}/><aside className="evidence-drawer" role="dialog" aria-modal="true" aria-label="Evidence detail"><div className="panel-head"><span className="eyebrow">Evidence / {drawer.id}</span><button className="icon" onClick={closeDrawer} aria-label="Close evidence"><X size={20}/></button></div><div className="drawer-body"><span className="badge">{drawer.kind}</span><h2>{drawer.title}</h2><p>{drawer.summary}</p><div className="inline"><a className="primary" href={drawer.url} target="_blank" rel="noreferrer">Open primary source <ExternalLink size={14}/></a><button className="button" onClick={()=>save(drawer.id)}><Bookmark size={15}/>{state.saved.includes(drawer.id)?'Saved':'Save'}</button></div><dl>{[['Scope',drawer.scope],['Source date',drawer.date||'Unknown'],['Retrieved',when(drawer.retrieved)],['Provider',drawer.provider],['Evidence status',drawer.status],['Units',drawer.units||'Not applicable']].map(([k,v])=><div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>{drawer.change&&<><h3>Before / after changes</h3><p>Detected {when(drawer.change.at)}</p><pre>{JSON.stringify(drawer.change,null,2)}</pre></>}<h3>Evidence & limitations</h3><EvidenceFields record={drawer}/><details><summary>Original source fields</summary><pre>{JSON.stringify(drawer.details||{},null,2)}</pre></details><div className="inline"><button className="button" onClick={()=>exportFile(drawer.id.replaceAll(':','-')+'.json',drawer)}><Download size={14}/> Export record</button><button className="button" onClick={()=>{navigator.clipboard?.writeText(`${drawer.title}. ${drawer.provider}. Source date ${drawer.date}. Retrieved ${drawer.retrieved}. ${drawer.url}`);setToast('Citation copied.');}}>Copy citation</button></div><h3>Attach a private note</h3><textarea value={noteText} onChange={e=>setNoteText(e.target.value)} aria-label="Evidence note" placeholder="What should I investigate next?"/><button className="primary" disabled={!noteText.trim()} onClick={()=>{update({notes:[{id:crypto.randomUUID(),text:noteText,tags:[],domain:drawer.domain,date:new Date().toISOString(),record:drawer.id},...state.notes]});setNoteText('');setToast('Note saved to Library.');}}>Save note</button></div></aside></>}

 {searchOpen&&<div className="modal-backdrop" onClick={()=>setSearchOpen(false)}><section className="search-modal" role="dialog" aria-modal="true" aria-label="Global search" onClick={e=>e.stopPropagation()}><div className="search-input"><Search size={20}/><input autoFocus placeholder="Pages, evidence, notes, saved views…" value={query} onChange={e=>setQuery(e.target.value)}/><button className="icon" onClick={()=>setSearchOpen(false)} aria-label="Close search"><X size={18}/></button></div><div className="search-results">{pages.filter(p=>p[1].toLowerCase().includes(query.toLowerCase())&&(!query?state.favorites.includes(p[0])||p[0]==='today':true)).map(p=><Link prefetch={false} key={p[0]} href={'/'+(p[0]==='today'?'':p[0])} onClick={()=>setSearchOpen(false)}><span className="eyebrow">Page</span><strong>{p[1]}</strong><ChevronRight size={15}/></Link>)}{query&&all.filter(r=>(r.title+' '+r.summary).toLowerCase().includes(query.toLowerCase())).slice(0,30).map(r=><button key={r.id} onClick={()=>{open(r);setSearchOpen(false);}}><span className="eyebrow">{r.domain}</span><strong>{r.title}</strong><ArrowUpRight size={15}/></button>)}{query&&state.notes.filter(n=>n.text.toLowerCase().includes(query.toLowerCase())).map(n=><Link prefetch={false} href="/library" key={n.id} onClick={()=>setSearchOpen(false)}><span className="eyebrow">Note</span><strong>{n.text.slice(0,120)}</strong></Link>)}</div><div className="search-footer">{query?'Source metadata and private notes':'Favorites & quick navigation'} · Esc to close</div></section></div>}

 {addOpen&&<div className="modal-backdrop"><AddEvidence domain={key} onClose={()=>setAddOpen(false)} onSave={r=>{update({manual:[r,...state.manual]});setAddOpen(false);setToast('Source-linked record added.');}}/></div>}{toast&&<div className="toast" role="status"><Check size={16}/>{toast}</div>}

 </div>;

}

























