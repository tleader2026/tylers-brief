import {z} from 'zod';
const url=z.string().url().refine(s=>/^https?:\/\//.test(s),'HTTP or HTTPS source required');
const manual=z.object({id:z.string(),domain:z.string(),title:z.string(),url,scope:z.string(),date:z.string(),summary:z.string(),kind:z.string(),status:z.string(),provider:z.string(),retrieved:z.string(),details:z.any().optional()}).passthrough();
export const workspaceSchema=z.object({
 saved:z.array(z.string()),notes:z.array(z.object({id:z.string(),text:z.string(),tags:z.array(z.string()),domain:z.string(),date:z.string(),record:z.string().optional()})),manual:z.array(manual),
 rules:z.array(z.object({id:z.string(),record:z.string(),direction:z.enum(['above','below']),threshold:z.number().finite(),duration:z.number().int().min(1),freshness:z.number().min(1),cooldown:z.number().min(1),lastFired:z.string().optional()})),
 boards:z.array(z.object({id:z.string(),title:z.string(),hypothesis:z.string(),support:z.string(),counter:z.string(),records:z.array(z.string()).min(2).max(4)})),
 favorites:z.array(z.string()),dismissed:z.array(z.string()),muted:z.array(z.string()),lastVisit:z.string(),theme:z.enum(['dark','light']),home:z.string().max(200),watch:z.array(z.string()),views:z.array(z.object({id:z.string(),name:z.string(),href:z.string().refine(s=>s.startsWith('/')&&!s.startsWith('//'))})),preferences:z.record(z.any())
});
