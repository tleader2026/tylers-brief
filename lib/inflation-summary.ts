import type {RecordData} from './catalog';
export function inflationSummary(source:RecordData|undefined,now=Date.now()):RecordData|undefined{
 if(!source)return;
 const points=[...new Map((source.series||[]).filter(p=>/^\d{4}-\d{2}-\d{2}$/.test(p.date)&&Date.parse(p.date)<=now).map(p=>[p.date,p])).values()].sort((a,b)=>a.date.localeCompare(b.date));
 const byMonth=new Map(points.map(p=>[p.date.slice(0,7),p.value]));
 const series=points.map(p=>{const prior=byMonth.get(String(Number(p.date.slice(0,4))-1)+p.date.slice(4,7));return {date:p.date,value:p.value!==null&&prior!=null&&prior>0?(p.value/prior-1)*100:null};});
 const last=series.at(-1);
 return {...source,id:'derived:us-inflation',title:'U.S. Inflation',units:'% · year-over-year CPI-U · seasonally adjusted',date:last?.date||source.date,value:last?.value??null,series,kind:'derived observed series',summary:'Inflation = (CPI this month ÷ CPI same month a year earlier − 1) × 100. Uses seasonally adjusted CPIAUCSL; the BLS headline annual rate uses unadjusted CPI. Lower positive inflation means prices rise more slowly, not that prices fall.',details:{...source.details,mode:'Consumer prices',frequency:'Monthly',source:'BLS via FRED · derived annual change',maxAgeDays:75}};
}
