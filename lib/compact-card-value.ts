export function compactCardValue(text:string):string{
 const m=text.match(/^([≈~]?\$?)(-?[\d,]+(?:\.\d+)?)$/);if(!m)return text;
 const n=Number(m[2].replaceAll(',',''));if(!Number.isFinite(n)||Math.abs(n)<1000)return text;
 const unit=Math.abs(n)>=1e12?['T',1e12] as const:Math.abs(n)>=1e9?['B',1e9] as const:Math.abs(n)>=1e6?['M',1e6] as const:['K',1e3] as const;
 const scaled=n/unit[1],digits=Math.abs(scaled)>=10?0:1;
 return m[1]+scaled.toLocaleString('en-US',{maximumFractionDigits:digits})+unit[0];
}
