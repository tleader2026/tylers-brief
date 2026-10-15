export type FutureRole={id:string;family:string;level:string;track:string;title:string;focus:string};
export type CareerColumn='family'|'level'|'track'|'title'|'focus';
export const careerLevels=['Executive','Director','Manager','Principal IC','Staff IC','Senior IC','IC','Associate IC','Specialist IC — Unspecified Seniority'];
export type CareerFilters={search:string;family:string;level:string;track:string};
export const emptyCareerFilters:CareerFilters={search:'',family:'All',level:'All',track:'All'};
export function selectCareers(roles:FutureRole[],filters:CareerFilters,column:CareerColumn='family',direction:'asc'|'desc'='asc',grouped=true){
 const tokens=filters.search.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean),sign=direction==='asc'?1:-1;
 return roles.filter(r=>(filters.family==='All'||r.family===filters.family)&&(filters.level==='All'||r.level===filters.level)&&(filters.track==='All'||r.track===filters.track)&&tokens.every(t=>[r.title,r.family,r.focus,r.level,r.track].join(' ').toLocaleLowerCase().includes(t))).sort((a,b)=>{
  const family=a.family.localeCompare(b.family);
  if(grouped&&family)return family*(column==='family'?sign:1);
  const aSpecial=a.level==='Specialist IC — Unspecified Seniority',bSpecial=b.level==='Specialist IC — Unspecified Seniority';
  if((grouped||column==='level')&&aSpecial!==bSpecial)return aSpecial?1:-1;
  if(column==='family'||column==='level'){
   if(!grouped&&column==='family'&&family)return family*sign;
   // Specialists have no numerical rank; retain the supplied order among them.
   if(aSpecial&&bSpecial)return 0;
   return (careerLevels.indexOf(a.level)-careerLevels.indexOf(b.level))*(column==='level'?sign:1)||a.title.localeCompare(b.title);
  }
  return a[column].localeCompare(b[column])*sign||careerLevels.indexOf(a.level)-careerLevels.indexOf(b.level);
 });
}
