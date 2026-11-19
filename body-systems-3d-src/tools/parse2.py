import json,re
D='/root/.claude/projects/-home-user-ai-teacher-legal/fc065881-0762-591d-8ed4-4460699b8833/tool-results/'
def load(name):
    raw=open(D+name,encoding='utf-8').read()
    m=re.search(r'<untrusted-data-[^>]+>\s*(\[.*\])\s*</untrusted-data',raw,re.S)
    if m: return json.loads(m.group(1))
    j=json.loads(raw)
    if isinstance(j,dict) and 'result' in j: j=j['result']
    if isinstance(j,list) and j and isinstance(j[0],dict) and 'text' in j[0]: j=j[0]['text']
    if isinstance(j,str):
        m=re.search(r'<untrusted-data-[^>]+>\s*(\[.*\])\s*</untrusted-data',j,re.S)
        j=json.loads(m.group(1))
    return j
L=load('mcp-Supabase-execute_sql-1795121688971-hq7bgi.txt')
E=load('mcp-Supabase-execute_sql-1795121694548-510mft.txt')
json.dump(L,open('u12_lessons.json','w'),ensure_ascii=False);json.dump(E,open('u12_ex.json','w'),ensure_ascii=False)
print('lessons',len(L),'exercises',len(E))
from collections import Counter
print(Counter((l['unit_id'],l['order_index']) for l in L))
print(Counter((e['unit_id'],e['lesson'],e['kind'],e['type']) for e in E).most_common(40))
