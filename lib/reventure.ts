export function reventureSeries(text:string){
 const rows=text.trim().split(/\r?\n/).filter(Boolean),points:{date:string;value:number}[]=[];
 for(let i=0;i<rows.length;i++){
  const cells=rows[i].split(rows[i].includes('\t')?'\t':',');
  if(i===0&&/^date|^month/i.test(cells[0].trim()))continue;
  if(cells.length!==2)throw new Error('Use two columns: month or date, then value. Paste tab-separated Excel columns or CSV with plain numbers.');
  const raw=cells[0].trim(),date=/^\d{4}-\d{2}$/.test(raw)?raw+'-01':raw;
  if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!Number.isFinite(Date.parse(date))||new Date(date).toISOString().slice(0,10)!==date)throw new Error('Use dates as YYYY-MM or YYYY-MM-DD.');
  const valueText=cells[1].trim().replace(/[$,%]/g,'');
  if(!valueText||!Number.isFinite(Number(valueText)))throw new Error('Each observation needs a numeric value.');
  if(points.some(p=>p.date===date))throw new Error('Each date must appear only once.');
  points.push({date,value:Number(valueText)});
 }
 if(!points.length)throw new Error('Paste at least one dated observation.');
 if(points.length>600)throw new Error('Import up to 600 observations at a time.');
 return points.sort((a,b)=>a.date.localeCompare(b.date));
}
export function reventureUrl(text:string){const url=new URL(text);if(url.protocol!=='https:'||!(url.hostname==='reventure.app'||url.hostname.endsWith('.reventure.app')))throw new Error('Enter a HTTPS Reventure source link.');return url.toString();}
