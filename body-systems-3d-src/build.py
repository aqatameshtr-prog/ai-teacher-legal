"""Assemble the single-file page.  Usage:  python3 build.py ../body-systems-3d.html
Needs vendor/ (see tools/prep_three.py) and data/bp3d_data.js + data/unit3_data.js (see README)."""
import sys,os
d=os.path.dirname(os.path.abspath(__file__))+'/'
rd=lambda p:open(d+p,encoding='utf-8').read()
sh=rd('src/shell.html')
app='\n'.join(rd(p) for p in ('src/content.js','src/core.js','src/geo.js','data/bp3d_data.js','data/unit3_data.js','src/views.js'))+'\nloadBP3D().then(start);\n'
out=sh.replace('/*THREE*/',rd('vendor/three.min.js').replace('</script>','<\\/script>')).replace('/*ORBIT*/',rd('vendor/orbit.js')).replace('/*APP*/',app)
open(sys.argv[1],'w',encoding='utf-8').write(out);print(len(out),'bytes')
