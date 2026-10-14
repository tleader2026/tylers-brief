import fs from 'node:fs';
import crypto from 'node:crypto';
const raw=fs.readFileSync(process.argv[2],'utf8');
const text=raw.replaceAll('\r\n','\n')+'\n  END:\n';
const records=[];
for(const m of text.matchAll(/^  ([a-zA-Z0-9_]+):\n([\s\S]*?)(?=^  [a-zA-Z0-9_]+:)/gm)){
 const block=m[2];if(!block.includes('release_date:'))continue;
 const metric=k=>{const s=block.match(new RegExp('      '+k+':\\n([\\s\\S]*?)(?=^      [a-z_]+:|^    release_date:)','m'));if(!s)return null;const v=s[1];return {estimate:Number(v.match(/estimate: ([0-9.]+)/)?.[1]),low:v.match(/ci_low: ([0-9.]+)/)?Number(v.match(/ci_low: ([0-9.]+)/)[1]):null,high:v.match(/ci_high: ([0-9.]+)/)?Number(v.match(/ci_high: ([0-9.]+)/)[1]):null};};
 const p50=metric('p50_horizon_length'),p80=metric('p80_horizon_length');
 if(!p50||!p80||!Number.isFinite(p50.estimate)||!Number.isFinite(p80.estimate)||p80.estimate>p50.estimate)throw Error('Unexpected metric structure: '+m[1]);
 records.push({id:m[1],releaseDate:block.match(/release_date: ([0-9-]+)/)[1],p50,p80,score:metric('average_score')?.estimate??null,scaffolds:[...block.matchAll(/^    - (.+)$/gm)].map(x=>x[1])});
}
if(records.length<5)throw Error('Incomplete extraction');
fs.writeFileSync('lib/capability-metr-snapshot.json',JSON.stringify({source:'https://metr.org/assets/benchmark_results_1_1.yaml',retrieved:process.argv[3]||'2026-10-14',pageUpdated:'2026-09-08',benchmark:'METR-Horizon-v1.1',taskVersion:text.match(/long_tasks_version: (\S+)/)[1],sourceSHA256:crypto.createHash('sha256').update(raw).digest('hex'),records},null,2));
console.log(`Imported ${records.length} model/system evaluations; no release date is treated as an observation date.`);
