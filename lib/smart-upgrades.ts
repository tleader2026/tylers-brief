export type UpgradeCosts={hardware:number;installation:number;retrofit:number;rebate:number;subscription:number;maintenance:number;energy:number;water:number;insurance:number;supportYears:number|null};
export function upgradeValue(c:UpgradeCosts){
 const values=Object.entries(c).filter(([k])=>k!=='supportYears').map(([,v])=>v);
 if(values.some(v=>typeof v!=='number'||!Number.isFinite(v)||v<0)||c.supportYears!==null&&(!Number.isFinite(c.supportYears)||c.supportYears<0))return null;
 const upfront=Math.max(0,c.hardware+c.installation+c.retrofit-c.rebate),annual=c.energy+c.water+c.insurance-c.subscription-c.maintenance;
 const payback=annual>0?upfront/annual:upfront===0&&annual===0?0:null;
 return {upfront,annual,payback,supportRisk:payback!==null&&c.supportYears!==null&&payback>c.supportYears};
}
export type HomeDevice={id:string;household:string;category:string;installed:boolean;active30Days:boolean|null;matter:boolean|null;thread:boolean|null;offline:boolean|null;cloud:string|null;updateCovered:boolean|null;supportUntil:string|null;unusableAfterRetirement:boolean|null;vulnerabilities:number|null;privacyControls:string|null;uptimePct:number|null};
export function parseHomeDevices(input:string):HomeDevice[]{
 const rows=JSON.parse(input);if(!Array.isArray(rows)||rows.length>10000)throw Error('Use a JSON array of up to 10,000 devices.');
 const ids=new Set<string>();
 return rows.map((r:any)=>{if(!r||typeof r.id!=='string'||!r.id.trim()||typeof r.household!=='string'||!r.household.trim()||typeof r.category!=='string'||!r.category.trim())throw Error('Each device needs an id, household alias and category.');
 const id=r.id.trim();if(ids.has(id))throw Error('Duplicate physical device ID: '+id+'. Merge platform registrations into one record.');ids.add(id);
 for(const k of ['installed','active30Days','matter','thread','offline','updateCovered','unusableAfterRetirement'])if(r[k]!==undefined&&r[k]!==null&&typeof r[k]!=='boolean')throw Error(k+' must be true, false or null.');
 if(typeof r.installed!=='boolean')throw Error('installed must be true or false.');
 if(r.active30Days===true&&!r.installed)throw Error('An active device must also be installed.');
 for(const k of ['vulnerabilities','uptimePct'])if(r[k]!=null&&(typeof r[k]!=='number'||!Number.isFinite(r[k])||r[k]<0||(k==='uptimePct'&&r[k]>100)||(k==='vulnerabilities'&&!Number.isInteger(r[k]))))throw Error(k+' is invalid.');
 if(r.supportUntil!=null&&(typeof r.supportUntil!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(r.supportUntil)||!Number.isFinite(Date.parse(r.supportUntil+'T00:00:00Z'))||new Date(r.supportUntil+'T00:00:00Z').toISOString().slice(0,10)!==r.supportUntil))throw Error('supportUntil must be a valid YYYY-MM-DD date or null.');
 for(const k of ['cloud','privacyControls'])if(r[k]!=null&&typeof r[k]!=='string')throw Error(k+' must be text or null.');
 return {id,household:r.household.trim(),category:r.category.trim(),installed:r.installed,active30Days:r.active30Days??null,matter:r.matter??null,thread:r.thread??null,offline:r.offline??null,cloud:r.cloud??null,updateCovered:r.updateCovered??null,supportUntil:r.supportUntil??null,unusableAfterRetirement:r.unusableAfterRetirement??null,vulnerabilities:r.vulnerabilities??null,privacyControls:r.privacyControls??null,uptimePct:r.uptimePct??null};});
}
export function deviceFootprint(rows:HomeDevice[]){const installed=rows.filter(r=>r.installed),households=new Set(installed.map(r=>r.household)).size;return {installed:installed.length,active:installed.filter(r=>r.active30Days===true).length,unknownActivity:installed.filter(r=>r.active30Days===null).length,households,devicesPerHousehold:households?installed.length/households:null};}
