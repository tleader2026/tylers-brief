'use client';
import {ArrowUpRight,Pill,Dna,FlaskConical,X} from 'lucide-react';
import {useEffect,useRef,useState} from 'react';
const theories=[
 {
  "title": "Intranasal anti-CD3",
  "route": "Intranasal",
  "stage": "Post-COVID mouse study",
  "assessment": "Prioritize intranasal anti-CD3 as my leading research direction and advance a human foralumab program focused on Long COVID neuroinflammation and cognition.",
  "evidence": "Nasal anti-CD3 reduced neuroinflammation and improved cognition in a post-COVID mouse model, providing the preclinical basis for my call to study the distinct human candidate foralumab in Long COVID.",
  "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13082027/",
  "source": "Post-COVID anti-CD3 study"
 },
 {
  "title": "Bezisterim / NE3107",
  "route": "Oral study · intranasal proposal",
  "stage": "ADDRESS-LC phase 2 protocol",
  "assessment": "Prioritize bezisterim for Long COVID cognitive impairment and fatigue, and develop an intranasal research arm that compares CNS exposure and administration with the oral formulation.",
  "evidence": "ADDRESS-LC studies oral, BBB-permeable bezisterim; I call for intranasal formulation testing to evaluate potential nose-to-brain access, compare CNS exposure, and assess administration alongside other intranasal research candidates.",
  "url": "https://pubmed.ncbi.nlm.nih.gov/42498469/",
  "source": "ADDRESS-LC phase 2 protocol"
 },
 {
  "title": "Intranasal hiPSC-NSC-EVs",
  "route": "Intranasal",
  "stage": "Aged-mouse study",
  "assessment": "Advance intranasal neural stem-cell extracellular vesicles as a research strategy targeting Long COVID neuroinflammation and mitochondrial dysfunction.",
  "evidence": "Intranasal human NSC-derived EVs restrained inflammatory microglial programs and NLRP3 and cGAS-STING signaling in aged mice, supporting my priority to test this approach against Long COVID neuroinflammation and mitochondrial dysfunction.",
  "url": "https://isevjournals.onlinelibrary.wiley.com/doi/10.1002/jev2.70232",
  "source": "Human NSC-derived EV study"
 },
 {
  "title": "IV RSLV-132",
  "route": "Intravenous",
  "stage": "Randomized human Long COVID trial",
  "assessment": "Pursue extracellular RNA degradation as a Long COVID research direction, with response timing, biological markers and fatigue outcomes built into the trial design.",
  "evidence": "The randomized RSLV-132 trial reported earlier fatigue improvements and no significant difference at the primary Day 71 assessment, directing my priority toward time-resolved testing of extracellular RNA clearance and responder biology.",
  "url": "https://pubmed.ncbi.nlm.nih.gov/38728385/",
  "source": "RSLV-132 randomized phase 2 trial"
 },
 {
  "title": "BC007 / rovunaptabin",
  "route": "Intravenous",
  "stage": "Human Long COVID studies",
  "assessment": "Prioritize a biomarker-selected BC007 research program focused on functional autoantibodies, defined responder groups and measurable clinical outcomes.",
  "evidence": "The exploratory IV reCOVer trial reported benefits while a separate larger program reportedly did not outperform placebo, supporting my call for replication with autoantibody-defined subgroups and prespecified endpoints.",
  "url": "https://pmc.ncbi.nlm.nih.gov/articles/pmid/40735347/",
  "source": "reCOVer exploratory phase IIa trial"
 },
 {
  "title": "IV EBV-specific T cells",
  "route": "Intravenous",
  "stage": "EBV-targeted cellular therapy platform",
  "assessment": "Develop an EBV-specific T-cell research pathway for Long COVID subgroups with documented EBV involvement, using virological and clinical endpoints to define the target population.",
  "evidence": "CILESTE studies engineered EBV-specific T cells in EBV-associated cancers, providing the cellular-therapy platform I want assessed in Long COVID subgroups with documented EBV involvement.",
  "url": "https://www.cancer.gov/research/participate/clinical-trials-search/v?id=NCI-2022-08324",
  "source": "NCI CILESTE trial"
 },
 {
  "title": "H3 receptor agonism",
  "route": "Formulation and route to be selected",
  "stage": "H3 autoreceptor mechanism",
  "assessment": "Prioritize selective H3 receptor agonism as a research strategy to reduce neuronal histamine release, beginning with compound selection and delivery design.",
  "evidence": "H3 autoreceptor activation inhibits neuronal histamine synthesis and release, providing the mechanistic basis for my call to develop and test a selective H3 agonist program for Long COVID histamine signaling.",
  "url": "https://pubmed.ncbi.nlm.nih.gov/6188956/",
  "source": "H3-mediated inhibition of histamine release"
 }
];
const therapyIcons:Record<string,{Icon:typeof Pill;label:string}>={"Intranasal anti-CD3":{Icon:FlaskConical,label:"Molecule and formulation research"},"Bezisterim / NE3107":{Icon:Pill,label:"Drug candidate"},"Intranasal hiPSC-NSC-EVs":{Icon:Dna,label:"Cell-derived biological research"},"IV RSLV-132":{Icon:Dna,label:"RNA-targeted research"},"BC007 / rovunaptabin":{Icon:Dna,label:"Nucleic-acid therapy"},"IV EBV-specific T cells":{Icon:Dna,label:"Engineered cellular therapy"},"H3 receptor agonism":{Icon:FlaskConical,label:"Molecule-development research"}};
export default function ResearchTheories(){
 const [selected,setSelected]=useState<number|null>(null);const dialog=useRef<HTMLDialogElement>(null);
 useEffect(()=>{if(selected!==null&&!dialog.current?.open)dialog.current?.showModal();else if(selected===null&&dialog.current?.open)dialog.current.close();},[selected]);
 const active=selected===null?null:theories[selected];
 return <div className="research-theories"><section className="panel theories-intro site-header site-header--tab" data-header-scope="tab"><span className="eyebrow">TYLER’S RESEARCH DECLARATIONS</span><h2>Watchlist</h2></section><ol className="theories-list">{theories.map((t,i)=>{const {Icon,label}=therapyIcons[t.title]||{Icon:FlaskConical,label:"Research approach"};return <li key={t.title}><article className="panel theory-card theory-square"><header><span className="theory-priority" role="img" aria-label={label} title={label}><Icon size={25} aria-hidden="true"/></span><h2>{t.title}</h2></header><div className="theory-tags"><span title={t.route}>{t.route}</span><span title={t.stage}>{t.stage}</span></div><p className="theory-preview">{t.assessment}</p><div className="theory-card-actions"><button type="button" onClick={()=>setSelected(i)} aria-label={'Read theory and evidence: '+t.title}>Read theory</button><a href={t.url} target="_blank" rel="noreferrer" aria-label={t.source}>Evidence <ArrowUpRight size={14}/></a></div></article></li>;})}</ol><dialog ref={dialog} className="theory-reading-dialog" aria-labelledby="theory-dialog-title" onCancel={()=>setSelected(null)} onClick={e=>{if(e.target===e.currentTarget)setSelected(null);}}>{active&&<div className="theory-reading-content"><header><h2 id="theory-dialog-title">{active.title}</h2><button type="button" autoFocus onClick={()=>setSelected(null)} aria-label="Close theory"><X size={22}/></button></header><div className="theory-tags"><span>{active.route}</span><span>{active.stage}</span></div><h3>Research priority</h3><p>{active.assessment}</p><h3>Evidence</h3><p>{active.evidence}</p><a href={active.url} target="_blank" rel="noreferrer">{active.source} <ArrowUpRight size={16}/></a></div>}</dialog></div>;
}
