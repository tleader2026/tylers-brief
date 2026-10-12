export function sourceChanges(prior:any,current:any){
 if(!prior)return null;
 const fields=['title','date','status','value','series','details','summary'].filter(k=>JSON.stringify(prior[k])!==JSON.stringify(current[k]));
 return fields.length?{fields,before:Object.fromEntries(fields.map(k=>[k,prior[k]])),after:Object.fromEntries(fields.map(k=>[k,current[k]]))}:null;
}
