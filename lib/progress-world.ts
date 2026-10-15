import data from './progress-observations.json';
export const progressWorld=data;
export type WorldObservation=typeof data.observations[number];
export const initiativeStages=['Proposed','Specified','Funded','Prototyped','Independently tested','Operational pilot','Multi-operator deployment','Sustained operation','Suspended','Reversed','Superseded','Discontinued'] as const;
export type InitiativeStage=typeof initiativeStages[number];
export function validateMilestoneTransition(prior:InitiativeStage,next:InitiativeStage,record:{evidence:string;actualDate:string|null;plannedDate:string|null;independent:boolean;repeated:boolean;operational?:boolean}){
 if(!record.evidence.startsWith('https://'))throw Error('Evidence is required for a stage change.');
 if(!record.actualDate)throw Error('A plan cannot become an actual milestone.');
 if(next==='Independently tested'&&!record.independent)throw Error('Independent test evidence required.');
 if(['Operational pilot','Multi-operator deployment','Sustained operation'].includes(next)&&!record.operational)throw Error('Operational evidence required; specification and availability alone are insufficient.');
 if(next==='Sustained operation'&&(!record.repeated||!record.independent))throw Error('Repeated operation evidence required.');
 if(prior==='Discontinued'&&next!=='Proposed')throw Error('Restart as a new proposed version.');
 return next;
}
export function uniqueEvents<T extends {eventId:string}>(rows:T[]):T[]{return [...new Map(rows.map(r=>[r.eventId,r])).values()];}
export function changesInWindow(rows:WorldObservation[],days:number,asOf=data.reviewed){const end=Date.parse(asOf+'T23:59:59Z'),start=end-days*86400000;return uniqueEvents(rows).filter(r=>r.eventDate&&Date.parse(r.eventDate+'T00:00:00Z')>start&&Date.parse(r.eventDate+'T00:00:00Z')<=end).sort((a,b)=>b.eventDate!.localeCompare(a.eventDate!));}
export function evidenceInWindow(rows:WorldObservation[],days:number,asOf=data.reviewed){const end=Date.parse(asOf+'T23:59:59Z'),start=end-days*86400000;return uniqueEvents(rows).filter(r=>!r.eventDate&&r.publicationDate&&Date.parse(r.publicationDate+'T00:00:00Z')>start&&Date.parse(r.publicationDate+'T00:00:00Z')<=end);}
export function measuredValue(value:number|null,state:string,unit:string){if(value!==null)return `${value}${unit==='%'?'%':' '+unit}`;if(!['Missing','Not applicable','Not disclosed'].includes(state))throw Error('Explicit missing state required.');return state;}
export function preservePanel(previous:{id:string;members:string[]},next:{id:string;members:string[];change:string}){if(JSON.stringify(previous.members)!==JSON.stringify(next.members)&&(previous.id===next.id||!next.change.trim()))throw Error('Panel composition changes require a new vintage and scope note.');return next;}
