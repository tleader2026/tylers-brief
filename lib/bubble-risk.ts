import type {RecordData} from './catalog';
export type RiskZone='green'|'amber'|'red'|'unknown';
export type BubbleGauge={id:string;name:string;measure:string;value:number|null;unit:string;date:string;green:number;red:number;inclusiveRed?:boolean;inclusiveGreen?:boolean;definition:string;thresholds:string;direction:string};
export const bubbleChecked='2026-10-13';
export const bubbleSource='https://boomorbubble.ai/';
export const bubbleGauges:BubbleGauge[]=[
 {id:'economic',name:'Economic strain',measure:'AI capex / US GDP',value:.9,unit:'%',date:'2026-06-29',green:1,red:2,definition:'Investment concentration in the wider economy.',thresholds:'Green <1% · amber 1–2% · red >2%',direction:'Worsening'},
 {id:'industry',name:'Industry strain',measure:'AI infrastructure capex / genAI revenue',value:3.6,unit:'×',date:'2026-06-29',green:3,red:6,definition:'Investment relative to estimated sector sales.',thresholds:'Green <3× · amber 3–6× · red >6×',direction:'Improving'},
 {id:'momentum',name:'Revenue momentum',measure:'Revenue doubling time',value:.6,unit:'years',date:'2026-06-29',green:2,red:4,inclusiveGreen:true,definition:'Time required for sector sales to double.',thresholds:'Green ≤2 years · amber >2–4 · red >4',direction:'Improving'},
 {id:'valuation',name:'Valuation heat',measure:'Nasdaq-100 trailing P/E',value:29.2,unit:'×',date:'2026-09-04',green:30,red:50,definition:'Market pricing against earnings.',thresholds:'Green <30× · amber 30–50× · red >50×',direction:'Improving'},
 {id:'funding',name:'Funding quality',measure:'Financing fragility composite',value:1.6,unit:'score',date:'2026-07-30',green:1,red:2,inclusiveGreen:true,inclusiveRed:true,definition:'Financing mix and capacity to absorb losses.',thresholds:'Green ≤1 · amber >1–<2 · red ≥2',direction:'Worsening'}
];
export function riskZone(g:BubbleGauge):RiskZone{if(g.value===null||!Number.isFinite(g.value)||g.value<0)return 'unknown';if(g.inclusiveRed?g.value>=g.red:g.value>g.red)return 'red';if(g.inclusiveGreen?g.value<=g.green:g.value<g.green)return 'green';return 'amber';}
export function riskSummary(gauges:BubbleGauge[]){const known=gauges.filter(g=>riskZone(g)!=='unknown');const red=known.filter(g=>riskZone(g)==='red').length;return {red,known:known.length,total:gauges.length,reading:known.length!==gauges.length?'Incomplete':red>=3?'Bubble':red===2?'Caution':'Boom'};}
export function olderReading(date:string,asOf=bubbleChecked){return Date.parse(asOf)-Date.parse(date)>90*86400000;}
export function bubbleRecord(g:BubbleGauge):RecordData{return {id:`bubble-risk:${g.id}`,domain:'companies',title:`Bubble risk · ${g.name}`,provider:'bubble-risk',url:bubbleSource,scope:'AI sector · Exponential View reference reading',date:g.date,published:g.date,retrieved:`${bubbleChecked}T20:00:00Z`,status:'REFERENCE SNAPSHOT',kind:'Bubble-risk gauge',units:g.unit,value:g.value,summary:`${g.name}: ${g.value} ${g.unit}. ${riskZone(g).toUpperCase()} zone.`,details:{limitations:'Attributed snapshot, not an independently reproduced model or crash probability. Underlying observations have different dates. No automatic synchronization or forecast history is connected.',transformation:g.thresholds,source:'Exponential View · Boom or Bubble',methodology:'https://boomorbubble.ai/methodology'}};}
export const bubbleRecords=bubbleGauges.map(bubbleRecord);
