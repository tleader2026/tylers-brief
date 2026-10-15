import type {LaborMetric} from './labor';
import {militaryLabor} from './military-labor.ts';
export const populationLines=[
 {id:'POP',title:'Total U.S. population · estimate',color:'#8bbcd3'},
 {id:'UNEMPLOY',title:'Officially unemployed people',color:'#ff8992'},
 {id:'CE16OV',title:'Employed people · excluding active duty',color:'#85d7ae'},
 {id:'CLF16OV',title:'Working or jobseeking people · excluding active duty',color:'#fff6de'},
 {id:'MILITARY',title:'Active-duty military people',color:'#fff6de'},
];
export function populationChartRows(metrics:LaborMetric[]):(Record<string,number|string|null>&{month:string;militaryDate:string|null})[]{
 const rows=new Map<string,Record<string,number|string|null>>();
 const latestLabor=metrics.filter(m=>['UNEMPLOY','CE16OV','CLF16OV'].includes(m.id)).flatMap(m=>m.series.filter(p=>p.value!==null).map(p=>p.date.slice(0,7))).sort().at(-1);
 for(const line of populationLines.filter(l=>l.id!=='MILITARY'))for(const p of metrics.find(m=>m.id===line.id)?.series||[]){const month=p.date.slice(0,7);if(latestLabor&&month>latestLabor)continue;rows.set(month,{...(rows.get(month)||{month}),[line.id]:p.value===null?null:p.value*1000});}
 for(const [date,value] of [[militaryLabor.yearPriorDate,militaryLabor.yearPrior],[militaryLabor.priorDate,militaryLabor.prior],[militaryLabor.date,militaryLabor.total]] as const){const month=date.slice(0,7);rows.set(month,{...(rows.get(month)||{month}),MILITARY:value,militaryDate:date});}
 return [...rows.values()].sort((a,b)=>String(a.month).localeCompare(String(b.month))).map(r=>({month:String(r.month),militaryDate:r.militaryDate?String(r.militaryDate):null,...Object.fromEntries(populationLines.map(l=>[l.id,typeof r[l.id]==='number'?r[l.id]:null]))}));
}
export function populationShare(value:number|null,population:number|null){return value===null||population===null||population<=0?null:value/population*100;}
export function populationCoverage(rows:ReturnType<typeof populationChartRows>){
 const row=[...rows].reverse().find(r=>[r.POP,r.CE16OV,r.CLF16OV,r.MILITARY].every(v=>typeof v==='number'&&Number.isFinite(v))&&r.militaryDate?.slice(0,7)===r.month&&Number(r.MILITARY)>=0&&Number(r.POP)>0&&Number(r.CE16OV)>=0&&Number(r.CLF16OV)>=Number(r.CE16OV)&&Number(r.CLF16OV)+Number(r.MILITARY)<=Number(r.POP));
 if(!row)return null;
 const population=Number(row.POP),military=Number(row.MILITARY),civilianEmployment=Number(row.CE16OV),employment=civilianEmployment+military,laborForce=Number(row.CLF16OV)+military;
 const compare=(covered:number)=>({covered,remainder:population-covered,coveredShare:100*covered/population,remainderShare:100*(population-covered)/population});
 return {month:row.month,militaryDate:row.militaryDate,population,military,civilianEmployment,employment:compare(employment),laborForce:compare(laborForce)};
}
