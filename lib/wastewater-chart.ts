export type Sample={date:string;value:number|null};
export type Week=Sample & {samples:number};
const WEEK=7*86400000;
export function weeklyWastewater(series:Sample[]):Week[]{
 const buckets=new Map<number,number[]>();
 for(const p of series){const d=new Date(p.date.slice(0,10)+'T00:00:00Z');if(!Number.isFinite(d.getTime()))continue;d.setUTCDate(d.getUTCDate()-((d.getUTCDay()+6)%7));const k=d.getTime();if(!buckets.has(k))buckets.set(k,[]);if(p.value!==null&&Number.isFinite(p.value)&&p.value>=0)buckets.get(k)!.push(p.value);}
 if(!buckets.size)return [];
 const start=Math.min(...buckets.keys()),end=Math.max(...buckets.keys()),weeks:Week[]=[];
 for(let t=start;t<=end;t+=WEEK){const values=buckets.get(t)||[];weeks.push({date:new Date(t).toISOString().slice(0,10),value:values.length?values.reduce((a,b)=>a+b,0)/values.length:null,samples:values.length});}
 return weeks;
}
export function wastewaterColor(value:number,min:number,max:number){
 const fraction=max===min?.5:Math.max(0,Math.min(1,(value-min)/(max-min)));
 // Green -> amber -> red, with equal values neutral rather than falsely high.
 const low=[66,196,130],mid=[235,187,67],high=[242,91,100];
 const a=fraction<=.5?low:mid,b=fraction<=.5?mid:high,t=fraction<=.5?fraction*2:(fraction-.5)*2;
 return 'rgb('+a.map((v,i)=>Math.round(v+(b[i]-v)*t)).join(',')+')';
}
