# Usage: python scripts/aggregate-smart-upgrades.py recs2020.csv codebook2020.xlsx recs2015.csv lib/smart-upgrades-snapshot.json
import sys
import csv,json,math,zipfile,xml.etree.ElementTree as E
rows=list(csv.DictReader(open(sys.argv[1],newline='')))
z=zipfile.ZipFile(sys.argv[2]); ns={'s':'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}; ss=[''.join(x.itertext()) for x in E.fromstring(z.read('xl/sharedStrings.xml')).findall('s:si',ns)]; states={}
for f in z.namelist():
 if f.startswith('xl/worksheets/sheet') and f.endswith('.xml'):
  for r in E.fromstring(z.read(f)).findall('.//s:row',ns):
   a=[]
   for c in r.findall('s:c',ns):
    v=c.find('s:v',ns); a.append(ss[int(v.text)] if c.get('t')=='s' and v is not None else v.text if v is not None else '')
   if len(a)==3 and a[0].isdigit() and len(a[1])==2: states[a[0].zfill(2)]=a[2]
def calc(rs,label):
 totals=[sum(float(r['NWEIGHT'+(str(i) if i else '')]) for r in rs) for i in range(61)]
 nums=[sum(float(r['NWEIGHT'+(str(i) if i else '')]) for r in rs if r['TYPETHERM']=='3') for i in range(61)]
 rates=[100*n/t for n,t in zip(nums,totals)]; se=math.sqrt(59/60*sum((v-rates[0])**2 for v in rates[1:])); rse=se/rates[0] if rates[0] else 1
 return dict(label=label,households=round(nums[0]),total=round(totals[0]),pct=round(rates[0],2),low=round(max(0,rates[0]-2.001*se),2),high=round(min(100,rates[0]+2.001*se),2),n=len(rs),confidence='Limited precision' if rse>.3 or len(rs)<100 else 'Survey estimate',rse=round(rse,3))
data={'national':calc(rows,'United States'),'state':[], 'income':[], 'housing':[], 'construction':[]}
for k in sorted(set(r['STATE_FIPS'] for r in rows)): data['state'].append(calc([r for r in rows if r['STATE_FIPS']==k],states.get(k.zfill(2),k)))
for lo,hi,label in [(1,11,'Under $50,000'),(12,14,'$50,000–$99,999'),(15,15,'$100,000–$149,999'),(16,16,'$150,000 or more')]:data['income'].append(calc([r for r in rows if lo<=int(r['MONEYPY'])<=hi],label))
for k,label in [(1,'Mobile homes'),(2,'Detached single-family'),(3,'Attached single-family'),(4,'Apartments: 2–4 units'),(5,'Apartments: 5+ units')]:data['housing'].append(calc([r for r in rows if int(r['TYPEHUQ'])==k],label))
for lo,hi,label in [(1,7,'Built before 2010'),(8,9,'Built 2010–2020')]:data['construction'].append(calc([r for r in rows if lo<=int(r['YEARMADERANGE'])<=hi],label))
d=data
rs=list(csv.DictReader(open(sys.argv[3])))
vals=[]
for w in ['NWEIGHT']+['BRRWT'+str(i) for i in range(1,97)]: vals.append(100*sum(float(r[w]) for r in rs if r['SMARTTHERM']=='1')/sum(float(r[w]) for r in rs))
se=math.sqrt(sum((v-vals[0])**2 for v in vals[1:])/24)
d['historical2015']=dict(pct=round(vals[0],2),low=round(max(0,vals[0]-1.985*se),2),high=round(vals[0]+1.985*se,2),households=round(sum(float(r['NWEIGHT']) for r in rs if r['SMARTTHERM']=='1')),unknownN=sum(r['SMARTTHERM']=='-9' for r in rs),n=len(rs))
json.dump(d,open(sys.argv[4],'w'),indent=2);print(d['historical2015'])
