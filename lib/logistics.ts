import type {RecordData} from './catalog';
export const BTS_URL='https://data.bts.gov/resource/bw6n-ddqk.json?$where=obs_date%3E=%272020-01-01T00:00:00%27&$order=obs_date&$limit=1000';
export const GSCPI_URL='https://www.newyorkfed.org/medialibrary/research/interactives/data/gscpi/gscpi_interactive_data.csv';
export const PORT_URL='https://portoflosangeles.org/business/statistics/container-statistics';
export const MARAD_URL='https://www.maritime.dot.gov/msci-advisories';
export const btsMetrics=[
 ['tsi_freight','Freight activity','All modes','Index · 2000 = 100',120,'BTS freight TSI measures for-hire output, not the dollar value of shipments; a decline can signal weaker goods demand.'],
 ['truck_d11','Truck tonnage','Trucking','Index · 2015 = 100',120,'Tonnage is a demand measure, not truck availability; falling tonnage and falling rates together can indicate economic weakness.'],
 ['rail_frt_carloads_d11','Rail carloads','Rail','Carloads · seasonally adjusted',120,'Bulk rail activity reflects industry and commodity demand; commodity mix matters.'],
 ['rail_frt_intermodal_d11','Rail intermodal','Rail','Containers and trailers · seasonally adjusted',120,'Intermodal volumes connect consumer goods, imports and inland distribution; rising volume alone does not establish congestion.'],
 ['air_rtmfm_d11','Air freight & mail','Air Cargo','Ton miles · source units · seasonally adjusted',160,'BTS covers U.S. carriers on domestic and international flights; air demand can rise with production or ocean-to-air substitution.']
] as const;
export const freightMetrics=[
 ['GASDESW','Diesel price','Trucking','USD / gallon · taxes included','EIA via FRED',21,'Fuel costs affect carrier margins and surcharges; price relief is different from a recovery in freight demand.'],
 ['PCU484121484121','Truckload service prices','Trucking','PPI · Dec 2003 = 100 · not seasonally adjusted','BLS via FRED',100,'Broad producer prices for long-distance truckload services, not a lane-specific spot or contract quote; lower prices may reflect weak demand or excess capacity.'],
 ['CES4348400001','Trucking employment','Trucking','Thousands of payroll jobs · seasonally adjusted','BLS via FRED',75,'Employment is a labor-capacity proxy, not available trucks or utilization; compare it with tonnage and service prices.'],
 ['PCU481112481112','Air cargo service prices','Air Cargo','PPI · Dec 2003 = 100 · not seasonally adjusted','BLS via FRED',100,'Producer price index for scheduled freight air transportation; not a quoted airport-pair rate.']
] as const;
export function csvRows(text:string):string[][]{
 const rows:string[][]=[];let row:string[]=[],cell='',quoted=false;
 for(let i=0;i<text.length;i++){const c=text[i];if(c==='"'){if(quoted&&text[i+1]==='"'){cell+='"';i++;}else quoted=!quoted;}else if(!quoted&&(c===','||c==='\n'||c==='\r')){row.push(cell);cell='';if(c!==','){if(row.some(x=>x.trim()))rows.push(row);row=[];if(c==='\r'&&text[i+1]==='\n')i++;}}else cell+=c;}
 row.push(cell);if(row.some(x=>x.trim()))rows.push(row);return rows;
}
export function numeric(raw:unknown):number|null{if(raw==null||String(raw).trim()===''||String(raw).trim()==='.')return null;const n=Number(String(raw).replace(/,/g,''));return Number.isFinite(n)?n:null;}
export function observedSeries(points:{date:string;value:number|null}[],now=Date.now()){
 const unique=new Map<string,number|null>();for(const p of points)if(/^\d{4}-\d{2}-\d{2}$/.test(p.date)&&Number.isFinite(Date.parse(p.date))&&new Date(p.date).toISOString().slice(0,10)===p.date&&Date.parse(p.date)<=now&&p.date>='2020-01-01'&&(p.value===null||Number.isFinite(p.value)))unique.set(p.date,p.value);
 return [...unique].map(([date,value])=>({date,value})).sort((a,b)=>a.date.localeCompare(b.date));
}
export function makeLogisticsRecord(id:string,title:string,provider:string,mode:string,units:string,series:RecordData['series'],source:string,url:string,interpretation:string,maxAgeDays:number,retrieved=new Date().toISOString(),extra:any={}):RecordData{
 const points=observedSeries(series||[],Date.parse(retrieved)),last=points.filter(p=>p.value!==null).at(-1);if(!last)throw new Error('No valid observations for '+id);
 return {id:'logistics:'+id,domain:'logistics',kind:'observed series',provider,title,url,scope:extra.geography||'United States',units,date:last.date,retrieved,status:'OBSERVED',value:last.value,series:points,summary:interpretation,details:{mode,source,geography:'United States',maxAgeDays,interpretation,...extra}};
}
export function parseBts(rows:any[],retrieved=new Date().toISOString()):RecordData[]{
 if(!Array.isArray(rows)||!rows.length||rows.length>=1000||!rows.some(r=>r.tsi_freight!==undefined))throw new Error('BTS schema changed or response truncated');
 return btsMetrics.map(([field,title,mode,units,maxAgeDays,text])=>makeLogisticsRecord(field,title,'logistics-bts',mode,units,rows.map(r=>({date:String(r.obs_date||'').slice(0,10),value:numeric(r[field])})),'BTS · seasonally adjusted','https://data.bts.gov/d/bw6n-ddqk',text,maxAgeDays,retrieved,{frequency:'Monthly',license:'BTS dataset metadata: public domain; citation requested.',methodology:'Published BTS seasonally adjusted series; missing releases retained as null; latest valid observation used separately for each metric.'}));
}
export function parseFreightCsv(text:string,id:string,retrieved=new Date().toISOString()):RecordData{
 const config=freightMetrics.find(c=>c[0]===id);if(!config)throw new Error('Unknown freight series');const rows=csvRows(text);if(!['DATE','observation_date'].includes(rows[0]?.[0]))throw new Error('FRED CSV schema changed');
 const [,title,mode,units,source,maxAgeDays,interpretation]=config;
 return makeLogisticsRecord(id,title,'logistics-fred',mode,units,rows.slice(1).map(r=>({date:r[0],value:numeric(r[1])})),source,'https://fred.stlouisfed.org/series/'+id,interpretation,maxAgeDays,retrieved,{frequency:id==='GASDESW'?'Weekly':'Monthly',license:'Government-origin series; public-domain citation requested in FRED metadata.',methodology:'Unkeyed public CSV; native frequency and adjustment retained; no freight spot-rate feed.'});
}
export function parseGscpi(text:string,retrieved=new Date().toISOString()):RecordData{
 const rows=csvRows(text),header=rows[0];if(header?.[0]!=='Date'||header.length<2)throw new Error('GSCPI vintage schema changed');const vintage=header.length-1;
 const series=rows.slice(1).flatMap(r=>{const date=new Date(r[0]+' 00:00:00 GMT');if(!Number.isFinite(date.getTime()))return [];return [{date:date.toISOString().slice(0,10),value:numeric(r[vintage])}];});
 return makeLogisticsRecord('gscpi','Global Supply Chain Pressure Index','logistics-gscpi','All modes','Standard deviations from historical mean',series,'Federal Reserve Bank of New York','https://www.newyorkfed.org/research/policy/gscpi','Higher values indicate greater global supply pressure; this is global context for U.S. exposure, not a U.S.-only risk score.',75,retrieved,{geography:'Global context',frequency:'Monthly',comparisonType:'points',vintage:header[vintage],copyright:'© 2026 Federal Reserve Bank of New York. Content from the New York Fed subject to the Terms of Use at newyorkfed.org.',license:'Public downloadable NY Fed research data; source attribution retained; underlying PMI and freight feeds are not sublicensed.',methodology:'Newest published vintage column, including revisions; σ change, not percent change; an external index, not a dashboard composite.'});
}
export function metricComparison(record:RecordData,kind:'previous'|'year'='previous'){
 const points=observedSeries(record.series||[]).filter(p=>p.value!==null),last=points.at(-1);if(!last)return null;
 let prior:typeof last|undefined;if(kind==='previous')prior=points.at(-2);else{const target=new Date(last.date+'T00:00:00Z');target.setUTCFullYear(target.getUTCFullYear()-1);if(record.details?.frequency==='Weekly'){prior=points.filter(p=>Math.abs(Date.parse(p.date)-target.getTime())<=7*86400000).sort((a,b)=>Math.abs(Date.parse(a.date)-target.getTime())-Math.abs(Date.parse(b.date)-target.getTime()))[0];}else prior=points.find(p=>p.date.slice(0,7)===target.toISOString().slice(0,7));}
 if(!prior)return null;const delta=last.value!-prior.value!,percent=prior.value===0?null:delta/Math.abs(prior.value!)*100;
 return {date:prior.date,value:prior.value,delta,percent:record.details?.comparisonType==='points'?null:percent,kind};
}
export function metricFreshness(record:RecordData,now=Date.now()){
 const check=Date.parse(record.retrieved),obs=Date.parse(record.date);if(!Number.isFinite(check)||now-check>8*86400000)return 'Verification overdue';
 if(record.details?.maxAgeDays&&now-obs>record.details.maxAgeDays*86400000)return 'Observation lag exceeds expected window';
 return record.status==='VERIFIED SNAPSHOT'?'Dated verified snapshot':record.kind==='published report observation'?'Dated original report':'Latest retrieved release';
}
export function interpretMetric(record:RecordData,c:ReturnType<typeof metricComparison>):string{
 if(!c)return record.details?.interpretation||record.summary;
 const direction=c.delta>0?'increased':c.delta<0?'declined':'was unchanged';
 if(record.id.endsWith('gscpi'))return `Global supply pressure ${direction} by ${c.delta.toFixed(2)} σ; a positive level is above the historical mean. This suggests global supply constraints when rising, but does not locate a U.S. bottleneck.`;
 if(record.id.endsWith('GASDESW'))return c.delta>0?'Diesel rose against this comparison, adding fuel and surcharge pressure to moving goods; weaker freight demand can coexist with higher costs.':'Diesel declined or was flat against this comparison, easing one operating input; this does not establish stronger freight demand or better delivery reliability.';
 if(record.id.endsWith('CES4348400001'))return `Trucking payroll employment ${direction}. This changes a labor-capacity proxy; available vehicles, utilization and productivity are not measured by the employment count.`;
 if(record.title.toLowerCase().includes('price'))return c.delta<0?'Service prices declined. Weaker demand or excess capacity are possible explanations; do not label the fall as an efficiency gain without volume and delivery-time evidence.':'Service prices rose or were flat. Separate fuel/input inflation from capacity tightening using tonnage, utilization and delivery-time evidence; a price index alone cannot identify the cause.';
 if(record.scope==='Los Angeles')return `Handled cargo ${direction} at Los Angeles. Demand, inventory rebuilding and route diversion are competing explanations; queue and dwell data are needed before calling this congestion or improved efficiency.`;
 return c.delta<0?'Transported activity declined against the comparison, consistent with softer goods demand or movement constraints; orders, capacity and service-time evidence are needed to distinguish them.':'Transported activity increased or was flat. Greater goods demand, inventory timing and substitution between modes can produce this reading; improved efficiency requires separate capacity and timeliness evidence.';
}
export function htmlText(s:string){return s.replace(/<script\b[\s\S]*?<\/script>/gi,'').replace(/<style\b[\s\S]*?<\/style>/gi,'').replace(/<[^>]+>/g,' ').replace(/&nbsp;|&#160;/g,' ').replace(/&amp;/g,'&').replace(/&#39;|&apos;/g,"'").replace(/&quot;/g,'"').replace(/\s+/g,' ').trim();}
export function htmlRows(text:string){return (text.match(/<tr\b[\s\S]*?<\/tr>/gi)||[]).map(row=>(row.match(/<t[dh]\b[\s\S]*?<\/t[dh]>/gi)||[]).map(htmlText));}
const months=['January','February','March','April','May','June','July','August','September','October','November','December'];
export function portPeriod(main:string){const row=htmlRows(main).find(r=>months.includes(r[0])&&/^20\d\d$/.test(r[1]));if(!row)throw new Error('Port current-period header changed');return {month:months.indexOf(row[0])+1,year:Number(row[1])};}
export function parsePort(main:string,histories:{year:number;html:string}[],retrieved=new Date().toISOString()):RecordData[]{
 const period=portPeriod(main),date=period.year+'-'+String(period.month).padStart(2,'0')+'-01';
 const rows=htmlRows(main),fields=[['port-la-total','Los Angeles container throughput','Total',7],['port-la-imports','Los Angeles loaded imports','Loaded Imports',1]] as const;
 return fields.map(([id,title,label,column])=>{const latest=rows.find(r=>r[0]===label);if(!latest||numeric(latest[1])===null||numeric(latest[2])===null)throw new Error('Port '+label+' schema changed');
  const series=histories.flatMap(h=>htmlRows(h.html).flatMap(r=>{const m=months.indexOf(r[0]);return m<0?[]:[{date:h.year+'-'+String(m+1).padStart(2,'0')+'-01',value:numeric(r[column])}];}));series.push({date,value:numeric(latest[1])},{date:(period.year-1)+'-'+date.slice(5),value:numeric(latest[2])});
  return makeLogisticsRecord(id,title,'logistics-port','Ports & Ocean','TEU · not seasonally adjusted',series,'Port of Los Angeles',PORT_URL,'Throughput measures handled cargo, not queue length, dwell time or national port capacity; changes can reflect demand, inventory timing or route diversion.',100,retrieved,{geography:'Los Angeles',frequency:'Monthly',license:'Selected numerical port statistics with attribution; no commercial feed or website artwork redistributed.',methodology:'Official monthly table and published year-history pages; TEU includes empties for total throughput; loaded imports are separate.'});
 });
}
