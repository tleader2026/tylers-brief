import catalog from './supply-price-catalog.json';
import snapshot from './supply-prices-snapshot.json';
export type PricePoint={date:string;value:number;estimated?:boolean};
export type PriceSeries={id:string;name:string;unit:string;frequency:string;provider:string;source:string;notes:string;group:string};
export type PriceRecord={points:PricePoint[];retrieved?:string;published?:string|null;status:string;error?:string};
export const priceSeries=catalog.series as PriceSeries[];
export const priceItems=catalog.items;
export const priceReviewed=snapshot.reviewed;
export const priceRecords=snapshot.series as Record<string,PriceRecord>;
export function change(points:PricePoint[],months:number):number|null{
 const last=points.at(-1);if(!last)return null;
 const date=new Date(last.date+'T00:00:00Z');date.setUTCMonth(date.getUTCMonth()-months);
 const prior=points.find(p=>p.date===date.toISOString().slice(0,10));
 return prior&&prior.value>0?(last.value/prior.value-1)*100:null;
}
export function rebase(points:PricePoint[],base:string):PricePoint[]{
 const start=points.find(p=>p.date===base);return start&&start.value>0?points.filter(p=>p.date>=base).map(p=>({...p,value:p.value/start.value*100})):[];
}
export function priceState(series:PriceSeries,record:PriceRecord|undefined):string{
 if(!record?.points.length)return 'Unavailable';
 if(record.status==='error')return 'Refresh error · last good data';
 const latest=record.points.at(-1)!;
 const lag=(Date.parse(priceReviewed)-Date.parse(latest.date))/86400000;
 return lag>(series.frequency==='Annual'?730:120)?'Historical / overdue':'Dated snapshot';
}
export function annualCosts(points:PricePoint[],frequency:string,throughYear:number):PricePoint[]{
 const years=[...new Set(points.map(p=>Number(p.date.slice(0,4))))].filter(y=>y<=throughYear).sort();
 return years.flatMap(year=>{const rows=points.filter(p=>Number(p.date.slice(0,4))===year);
 if(frequency==='Annual')return rows.length===1?[{...rows[0],date:`${year}-01-01`}]:[];
 if(rows.length!==12||new Set(rows.map(p=>p.date.slice(5,7))).size!==12)return [];
 return [{date:`${year}-01-01`,value:rows.reduce((sum,p)=>sum+p.value,0)/12,estimated:rows.some(p=>p.estimated)}];
 });
}
