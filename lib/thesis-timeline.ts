import {z} from 'zod';
export const eventKinds=['Created','Imported','Reviewed','Tested','Supported','Challenged','Revised','Branched','Paused','Reopened'] as const;
export const evidenceStates=['Untested','Inconclusive','Supported under conditions','Contradicted'] as const;
const text=z.string().max(12000);
export const ideaEventSchema=z.object({id:z.string(),kind:z.enum(eventKinds),at:z.string().datetime(),occurred:z.string(),version:z.number().int().min(1),statement:text,reason:text,state:z.enum(evidenceStates),conditions:text,part:text,question:text,method:text,expected:text,finding:text,evidence:text,supersedes:z.number().int().min(1).nullable(),branchId:z.string().nullable()});
export const ideaSchema=z.object({id:z.string(),title:z.string().min(1).max(200),parentId:z.string().nullable(),events:z.array(ideaEventSchema).min(1)});
export type Idea=z.infer<typeof ideaSchema>;
export type IdeaEvent=z.infer<typeof ideaEventSchema>;
export function latest(idea:Idea){return idea.events[idea.events.length-1];}
export function lifecycle(idea:Idea){for(const e of [...idea.events].reverse()){if(e.kind==='Paused')return 'Paused';if(e.kind==='Reopened'||e.kind==='Created'||e.kind==='Imported')return 'Active';}return 'Active';}
export function appendEvent(idea:Idea,event:IdeaEvent):Idea{
 const previous=latest(idea);
 if(event.kind==='Created'||event.kind==='Imported')throw Error('An existing idea cannot be created again.');
 if(!event.reason.trim())throw Error('Record your reasoning.');
 const revision=event.kind==='Revised';
 if(revision&&!event.statement.trim())throw Error('Enter the revised statement.');
 if(event.kind==='Tested'&&[event.question,event.method,event.expected,event.finding].some(x=>!x.trim()))throw Error('A test needs a question, method, expected result and actual finding.');
 if(event.state==='Supported under conditions'&&!event.conditions.trim())throw Error('Describe the conditions under which this is supported.');
 return {...idea,events:[...idea.events,{...event,version:previous.version+(revision?1:0),statement:revision?event.statement:previous.statement,supersedes:revision?previous.version:null}]};
}
