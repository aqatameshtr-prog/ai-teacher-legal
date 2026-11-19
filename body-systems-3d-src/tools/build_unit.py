import json,zlib,base64,sys
unit,out=sys.argv[1],sys.argv[2]
L=[l for l in json.load(open('unit3/u12_lessons.json')) if l['unit_id']==unit]
E=[e for e in json.load(open('unit3/u12_ex.json')) if e['unit_id']==unit]
L.sort(key=lambda l:l['order_index'])
out_={'lessons':[]}
for l in L:
    n=l['order_index']
    les={'t':{'tr':l['title_tr'],'ar':l['title_ar'],'en':l['title_en']},'vocab':[],'sections':[],'ex':{'mcq':[],'order':[],'open':[],'act':[]}}
    for v in (l['vocab'] or []):
        les['vocab'].append({'tr':v.get('tr',''),'ar':v.get('ar',''),'en':v.get('en',''),'key':bool(v.get('key')),'ex':v.get('example','')})
    for s in l['text_sections']:
        sec={'h':{'tr':s.get('heading_tr',''),'ar':s.get('heading_ar',''),'en':s.get('heading_en','')},
             'o':{'tr':s.get('ozet_tr',''),'ar':s.get('ozet_ar',''),'en':s.get('ozet_en','')},
             'lines':[{'tr':x.get('tr',''),'ar':x.get('ar',''),'en':x.get('en',''),'na':x.get('note',''),'ne':x.get('note_en','')} for x in s.get('lines',[])]}
        les['sections'].append(sec)
    for e in [x for x in E if x['lesson']==n]:
        q={'tr':e['q_tr'] or '','ar':e['q_ar'] or '','en':e['q_en'] or ''}
        if e['type']=='mcq' and e['options'] and e['answer_index'] is not None:
            les['ex']['mcq'].append({'q':q,'o':[{'tr':o.get('tr',''),'ar':o.get('ar',''),'en':o.get('en','')} for o in e['options']],'a':e['answer_index'],'k':e['kind']})
        elif e['type']=='order' and e['spec'] and e['spec'].get('items'):
            les['ex']['order'].append({'q':q,'items':[{'tr':i.get('tr',''),'ar':i.get('ar',''),'en':i.get('en','')} for i in e['spec']['items']],'steps':e.get('steps') or []})
        elif e['type']=='open':
            les['ex']['open'].append({'q':q})
        else:
            les['ex']['act'].append({'q':q})
    out_['lessons'].append(les)
raw=json.dumps(out_,ensure_ascii=False,separators=(',',':')).encode('utf-8')
z=zlib.compress(raw,9)
# empty BodyParts3D payload so the shared loader runs without organ models
open(out,'w').write('const BP3D_B64="eJwDAAAAAAE=";const BP3D_META=[];\nconst U3_B64="'+base64.b64encode(z).decode()+'";\n')
print(unit,'lessons',len(out_['lessons']),[ (len(l['sections']),len(l['vocab']),sum(len(v) for v in l['ex'].values())) for l in out_['lessons']],'bytes',len(z))
