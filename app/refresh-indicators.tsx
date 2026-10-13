'use client';
import {useEffect} from 'react';
import {refreshGroups,refreshProblem,type RefreshRun} from '../lib/refresh-health';
function keysFor(tile:HTMLElement,page:string,tab:string):string[]{
 const explicit=tile.dataset.refreshSources;if(explicit)return explicit.split(',');
 const text=((tile.querySelector('h2,h3,h4')||tile.querySelector('.eyebrow'))?.textContent||'').toLowerCase();
 if(tile.matches('.news-tile'))return ['news'];
 if(/consumer price|unemployment|mortgage|house price index|home price index|thirty years|30 years/.test(text)||tile.matches('.metric'))return ['fred'];
 if(/assessed value|assessment/.test(text))return ['property'];
 if(/low.*mid.*high|home values by state/.test(text))return ['zillow'];
 if(/housing market heat|growing.*cooling/.test(text))return ['housing'];
 if(page==='today')return /on your radar|coverage gaps/.test(text)?[]:/news/.test(text)?['news']:/thirty years/.test(text)?['fred']:['trials'];
 if(page==='wastewater')return ['cdc-wval'];
 if(page==='trials')return ['trials'];
 if(page==='research')return /watchlist/.test(text)?['research']:['pubmed'];
 if(page==='governance')return ['governance'];
 if(page==='companies')return [tab==='AI growth'?'ai-growth':tab==='Bubble risk'?'bubble':'companies'];
 if(page==='internet')return [tab==='Protocols & addressing'?'ipv6':'internet'];
 if(page==='infrastructure')return [tab==='Water'?'water':tab==='Electricity'?'electricity':tab==='Data centers'?'centers':tab==='Space infrastructure'?'space':'av'];
 if(page==='national-housing'||page==='local-housing')return [tab==='Regional comparison'?'zillow':tab==='Reventure'?'reventure':'housing'];
 if(page==='economy')return ['fred'];
 if(page==='geopolitics')return ['worldmonitor'];
 return ['library','alerts','connections','settings'].includes(page)?[]:['unregistered'];
}
// One decorator covers existing and newly added data tiles. A tile can declare
// data-refresh-sources for narrower dependencies; otherwise its page supplies them.
export default function RefreshIndicators({health,page,tab}:{health:RefreshRun[];page:string;tab:string}){
 useEffect(()=>{
  const root=document.querySelector('main');if(!root)return;
  const paint=()=>{
   root.querySelectorAll<HTMLElement>('.panel,.metric,.infra-stat,.infra-av-card,.company-card').forEach(tile=>{
    const ownKeys=keysFor(tile,page,tab);const keys=ownKeys.length?[...ownKeys,'assets']:[];const errors=keys.flatMap(key=>{const problem=refreshProblem(health.find(r=>(r.id||r.provider)===key),key);return problem?[`${refreshGroups[key as keyof typeof refreshGroups]||key}: ${problem}`]:[]});
    const message=errors.join('\n');let badge=tile.querySelector<HTMLElement>(':scope > .refresh-error');
    if(!message){badge?.remove();tile.classList.remove('refresh-tracked-error');return;}
    if(!badge){badge=document.createElement(tile.tagName==='BUTTON'?'span':'button');if(badge instanceof HTMLButtonElement)badge.type='button';else{badge.setAttribute('role','button');badge.tabIndex=0;}badge.className='refresh-error';badge.textContent='!';badge.addEventListener('click',e=>{e.stopPropagation();window.alert(badge!.title);});badge.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();window.alert(badge!.title);}});tile.appendChild(badge);tile.classList.add('refresh-tracked-error');}
    badge.title=message;badge.setAttribute('aria-label','Refresh error. '+message);
   });
  };
  paint();const observer=new MutationObserver(m=>{if(m.some(x=>Array.from(x.addedNodes).some(n=>n instanceof HTMLElement&&!n.matches('.refresh-error'))))paint();});observer.observe(root,{childList:true,subtree:true});
  const timer=setInterval(paint,60000);return()=>{observer.disconnect();clearInterval(timer);root.querySelectorAll('.refresh-error').forEach(e=>e.remove());root.querySelectorAll('.refresh-tracked-error').forEach(e=>e.classList.remove('refresh-tracked-error'));};
 },[health,page,tab]);return null;
}
