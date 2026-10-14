export function ownership(price:number,down:number,rate:number,years:number,tax:number,insurance:number,hoa:number,maintenance:number){
 const loan=price*(1-down/100), n=years*12, r=rate/1200;
 const principal=r===0?loan/n:loan*r/(1-Math.pow(1+r,-n));
 return {principal,tax:price*tax/1200,insurance:insurance/12,hoa,maintenance:price*maintenance/1200,total:principal+price*(tax+maintenance)/1200+insurance/12+hoa};
}
export function inflationChange(series:{date:string;value:number|null}[]){
 const valid=series.filter(p=>p.value!==null); const latest=valid.at(-1);if(!latest)return null;
 const target=Number(latest.date.slice(0,4))-1;const prior=valid.find(p=>p.date.slice(0,4)===String(target)&&p.date.slice(5,7)===latest.date.slice(5,7));
 return prior?.value ? (latest.value!/prior.value-1)*100:null;
}
export function distanceKm(a:{lat:number;lon:number},b:{lat:number;lon:number}){const rad=(v:number)=>v*Math.PI/180;const dlat=rad(b.lat-a.lat),dlon=rad(b.lon-a.lon);return 6371*2*Math.asin(Math.sqrt(Math.sin(dlat/2)**2+Math.cos(rad(a.lat))*Math.cos(rad(b.lat))*Math.sin(dlon/2)**2));}
export function alertPreview(rule:any,records:any[],now=Date.now()){
 const record=records.find(x=>x.id===rule.record);if(!record)return {fire:false,reason:'Record unavailable'};
 const age=(now-Date.parse(record.date))/86400000;if(age>rule.freshness)return {fire:false,reason:'Latest observation exceeds freshness limit'};
 const points=(record.series||[]).filter((x:any)=>x.value!==null).slice(-rule.duration);
 if(points.length<rule.duration)return {fire:false,reason:'Not enough comparable observations'};
 const matches=points.every((x:any)=>rule.direction==='above'?x.value>rule.threshold:x.value<rule.threshold);
 if(!matches)return {fire:false,reason:'Threshold not sustained for the requested observations'};
 if(rule.lastFired&&now-Date.parse(rule.lastFired)<rule.cooldown*3600000)return {fire:false,reason:'Cooldown active'};
 return {fire:true,reason:`${points.length} comparable observations ${rule.direction} ${rule.threshold} ${record.units||''}`};
}
