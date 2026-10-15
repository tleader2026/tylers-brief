import json,pathlib,unittest,importlib.util
spec=importlib.util.spec_from_file_location('prices',pathlib.Path(__file__).parents[1]/'scripts/collect-supply-prices.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
class Prices(unittest.TestCase):
 def test_missing_and_future(self):
  p=m.fred(b'observation_date,X\n2026-06-01,100\n2026-07-01,.\n2026-08-01,120\n2027-01-01,999\n','X','2026-10-15')
  self.assertEqual([r['value'] for r in p],[100,120])
 def test_bad_feed(self):
  for data in [b'html,error\n',b'observation_date,X\n2026-01-01,-2\n',b'observation_date,X\n2026-02-01,2\n2026-01-01,1\n']:
   with self.assertRaises(ValueError):m.fred(data,'X','2026-10-15')
 def test_snapshot(self):
  root=pathlib.Path(__file__).parents[1];c=json.loads((root/'lib/supply-price-catalog.json').read_text());s=json.loads((root/'lib/supply-prices-snapshot.json').read_text())
  ids={r['id'] for r in c['series']};self.assertEqual(len(ids),len(c['series']))
  for i in c['items']:self.assertTrue(i['series'] is None or i['series'] in ids)
  for series in c['series']:
   p=s['series'][series['id']]['points'];self.assertTrue(len(p)>0)
   self.assertTrue(all(a['date']<b['date'] for a,b in zip(p,p[1:])))
   self.assertTrue(all(r['date']<=s['reviewed'] and r['value']>0 for r in p))
   if series['frequency']=='Annual':self.assertEqual(len(p),5);self.assertTrue(p[-1]['estimated'])
if __name__=='__main__':unittest.main()
