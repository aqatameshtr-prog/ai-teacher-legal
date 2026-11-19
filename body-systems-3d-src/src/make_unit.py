import sys
d='/tmp/claude-0/-home-user-ai-teacher-legal/fc065881-0762-591d-8ed4-4460699b8833/scratchpad/'
def rd(p): return open(d+p,encoding='utf-8').read()
unit,out=sys.argv[1],sys.argv[2]           # unit = 1 or 2
sh=rd('b3d/shell.html')
three=rd('three/package/build/three.min.js').replace('</script>','<\\/script>')
orbit=rd('b3d/orbit.js')+'\n'+rd('b3d/roomenv.js')
parts=['b3d/content_base.js',f'b3d/content_u{unit}.js','b3d/core.js','b3d/sound.js','b3d/geo.js','b3d/views_common.js',f'b3d/views_u{unit}.js',f'b3d/data_u{unit}.js']
app='\n'.join(rd(p) for p in parts)+'\nloadBP3D().then(start);\n'
html=sh.replace('/*THREE*/',three).replace('/*ORBIT*/',orbit).replace('/*APP*/',app)
open(out,'w',encoding='utf-8').write(html);print(out,len(html))
