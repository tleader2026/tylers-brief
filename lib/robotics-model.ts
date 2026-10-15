export type Economics={hardware:number;integration:number;life:number;finance:number;annualHours:number;utilization:number;uptime:number;quality:number;rate:number;support:number;wage:number;fees:number;energy:number;maintenance:number;insurance:number;rework:number;humanCost:number};
export const defaultEconomics:Economics={hardware:100000,integration:50000,life:7,finance:8,annualHours:4000,utilization:70,uptime:95,quality:98,rate:40,support:0.25,wage:45,fees:6000,energy:3000,maintenance:10000,insurance:2000,rework:3000,humanCost:5};
export function economics(x:Economics){
 if(Object.values(x).some(v=>!Number.isFinite(v)||v<0)||x.life<=0||x.life>50||['utilization','uptime','quality'].some(k=>x[k as keyof Economics]>100))throw Error('Use non-negative finite inputs, percentages from 0–100 and a useful life of 0–50 years.');
 const capital=x.hardware+x.integration,r=x.finance/100,annuity=r===0?1/x.life:r/(1-Math.pow(1+r,-x.life));
 const hours=x.annualHours*x.utilization/100*x.uptime/100,output=hours*x.rate*x.quality/100;
 const supportHours=hours*x.support,operating=x.fees+x.energy+x.maintenance+x.insurance+x.rework+supportHours*x.wage;
 const annual=capital*annuity+operating,savings=output*x.humanCost-operating;
 let npv=-capital;for(let y=1;y<=Math.floor(x.life);y++)npv+=savings/Math.pow(1+r,y);
 return {capital,hours,output,supportHours,operating,annual,unit:output>0?annual/output:null,payback:savings>0?capital/savings:null,npv,breakEvenOutput:x.humanCost>0?annual/x.humanCost:null};
}
export type Continuity={staff:number;manualHours:number;baseline:number;manualRate:number;robotCapacity:number;supportHours:number;maintenanceHours:number;energy:number;fallback:number};
export const defaultContinuity:Continuity={staff:105,manualHours:80,baseline:1300,manualRate:10,robotCapacity:500,supportHours:20,maintenanceHours:5,energy:100,fallback:0};
export function continuity(x:Continuity,loss:number){
 if(Object.values(x).some(v=>!Number.isFinite(v)||v<0)||x.baseline<=0||loss<0||loss>100||x.energy>100||x.fallback>100)throw Error('Use finite non-negative inputs, a positive baseline and percentages from 0–100.');
 const available=x.staff*(1-loss/100),maintenance=Math.min(available,x.maintenanceHours),remaining=Math.max(0,available-maintenance);
 const support=Math.min(remaining,x.supportHours),robot=x.robotCapacity*(x.supportHours>0?support/x.supportHours:1)*(x.maintenanceHours>0?maintenance/x.maintenanceHours:1)*x.energy/100;
 const manual=Math.min(x.manualHours,Math.max(0,remaining-support))*x.manualRate;
 const fallback=Math.max(0,x.robotCapacity-robot)*x.fallback/100;
 // Fallback is limited by spare human time; it cannot reuse labor already assigned above.
 const spare=Math.max(0,remaining-support-(x.manualRate>0?manual/x.manualRate:0));
 const delivered=Math.min(x.baseline,manual+robot+Math.min(fallback,spare*x.manualRate));
 return {loss,available,maintenance,support,manual,robot,delivered,retention:100*delivered/x.baseline};
}
