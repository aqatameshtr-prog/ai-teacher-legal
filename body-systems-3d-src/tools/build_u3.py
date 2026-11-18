import json,zlib,base64,re
L=json.load(open('lessons_raw.json'));E=json.load(open('ex_raw.json'))
def tri(o,k):return {'tr':(o.get(k+'_tr') or o.get('tr') or ''),'ar':o.get(k+'_ar') or o.get('ar') or '','en':o.get(k+'_en') or o.get('en') or ''}
out={'lessons':[]}
for l in L:
    n=l['order_index']
    les={'t':{'tr':l['title_tr'],'ar':l['title_ar'],'en':l['title_en']},'vocab':[],'sections':[],'ex':{'mcq':[],'order':[],'open':[],'act':[]}}
    for v in (l['vocab'] or []):
        les['vocab'].append({'tr':v.get('tr',''),'ar':v.get('ar',''),'en':v.get('en',''),'key':bool(v.get('key')),'ex':v.get('example','')})
    for s in l['text_sections']:
        sec={'h':{'tr':s.get('heading_tr',''),'ar':s.get('heading_ar',''),'en':s.get('heading_en','')},
             'o':{'tr':s.get('ozet_tr',''),'ar':s.get('ozet_ar',''),'en':s.get('ozet_en','')},
             'lines':[{'tr':x.get('tr',''),'ar':x.get('ar',''),'en':x.get('en',''),'na':x.get('note',''),'ne':x.get('note_en','')} for x in s.get('lines',[])]}
        m=s.get('model3d')
        if m: sec['m']=m
        les['sections'].append(sec)
    for e in [x for x in E if x['lesson']==n]:
        q={'tr':e['q_tr'] or '','ar':e['q_ar'] or '','en':e['q_en'] or ''}
        if e['type']=='mcq' and e['options'] and e['answer_index'] is not None:
            les['ex']['mcq'].append({'q':q,'o':[{'tr':o.get('tr',''),'ar':o.get('ar',''),'en':o.get('en','')} for o in e['options']],'a':e['answer_index'],'k':e['kind']})
        elif e['type']=='order' and e['spec'] and e['spec'].get('items'):
            les['ex']['order'].append({'q':q,'items':[{'tr':i.get('tr',''),'ar':i.get('ar',''),'en':i.get('en','')} for i in e['spec']['items']],'steps':e.get('steps') or []})
        elif e['type'] in ('open',):
            les['ex']['open'].append({'q':q})
        else:
            les['ex']['act'].append({'q':q})
    out['lessons'].append(les)
raw=json.dumps(out,ensure_ascii=False,separators=(',',':')).encode('utf-8')
z=zlib.compress(raw,9)
open('/tmp/claude-0/-home-user-ai-teacher-legal/fc065881-0762-591d-8ed4-4460699b8833/scratchpad/b3d/unit3_data.js','w').write('const U3_B64="'+base64.b64encode(z).decode()+'";\n')
print('raw',len(raw),'zlib',len(z))
for i,l in enumerate(out['lessons']):
    print(i+1,{k:(len(v) if isinstance(v,list) else {a:len(b) for a,b in v.items()}) for k,v in l.items() if k in('vocab','sections','ex')})
