import sys,os,json,zlib,base64,struct
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
import numpy as np, fast_simplification as fs
from stlio import read_stl
S=0.01292; CX=0.0; CY=-107.3; CZ=1030.0
def to_scene(v):
    # BP3D (x: person's left+, y: anterior negative, z: up) -> scene (x right, y up, z toward viewer/anterior)
    return np.stack([(v[:,0]-CX)*S,(v[:,2]-CZ)*S,-(v[:,1]-CY)*S],axis=1)
# key -> (file id, target faces)
M={
 'esophagus':('7131',2000),'stomach':('7148',6000),'liver':('7197',9000),'gallbladder':('7202',1500),'pancreas':('7198nsn',4000),
 'duodenum':('7206',4000),'jejunum':('7207',9000),'ileum':('7208',9000),'colon':('14543nsn',16000),'appendix':('14542',600),'rectum':('14544',3000),
 'heart':('7274',34000),'mitral':('7235',2000),'tricuspid':('7234',2000),'pulmvalve':('7246',2000),
 'aorta_asc':('3736',2000),'aorta_arch':('3768',2000),'aorta_desc':('3784',8000),'brachio':('3932nsn',900),'carotid_r':('3941',900),'carotid_l':('4058',700),
 'svc':('4720',1500),'ivc':('10951',3000),'pulm_artery':('66326',15000),'pulm_vein':('66643',12000),
 'cor_rca':('3802',1200),'cor_lad':('3862nsn',1500),'cor_cx':('3895',1200),'cor_lca':('4685',300),'cor_marg':('3818',1000),'cor_pda':('3840nsn',800),
 'cv_great':('4707',1200),'cv_middle':('4713',900),'cor_sinus':('4706',800),
 'lung_ru':('7333',9000),'lung_rm':('7383',6000),'lung_rl':('7337',10000),'lung_lu':('7370',9000),'lung_ll':('7371',10000),
 'bronchus':('7409',18000),'trachea':('7394',4000),'diaphragm':('13295',9000),
 'kidney_r':('7204',8000),'kidney_l':('7205',8000),'adrenal_r':('15629',1500),'adrenal_l':('15630',1500),
 'ureter_r':('15571',1500),'ureter_l':('15572',1500),'bladder':('15900',3000),'urethra':('19667',700),
 'renal_art_r':('14752',700),'renal_art_l':('14753',700),'renal_vein_r':('14335',700),'renal_vein_l':('14336',700),
 'sternum':('7487',4000),
}
ribsR=['7857','7882','7909','7957','8066','8175','8229','8283','8364','8445','8531','8533']
ribsL=['7987','8012','8039','8148','8093','8202','8256','8310','8391','8472','8532','8534']
for i,r in enumerate(ribsR): M['rib_r%d'%(i+1)]=(r,1100)
for i,r in enumerate(ribsL): M['rib_l%d'%(i+1)]=(r,1100)
cartR=['7875','7886','7913','7976','8070','8194','8248']; cartL=['8005','8031','8058','8167','8112','8221','8275']
for i,r in enumerate(cartR): M['cart_r%d'%(i+1)]=(r,500)
for i,r in enumerate(cartL): M['cart_l%d'%(i+1)]=(r,500)
blob=bytearray();meta=[]
for key,(fid,tf) in M.items():
    v,f=read_stl('stl_raw/FMA%s.stl'%fid)
    v=to_scene(v)
    if len(f)>tf:
        ratio=1-tf/len(f)
        vv,ff=fs.simplify(v.astype(np.float32),f.astype(np.int32),target_reduction=ratio,agg=5)
        v,f=vv.astype(np.float64),ff
    if key=='urethra':
        keep=(v[f][:,:,1].min(1)>-3.55);f=f[keep]
    # drop unreferenced vertices
    used=np.unique(f);remap=-np.ones(len(v),dtype=np.int64);remap[used]=np.arange(len(used));v=v[used];f=remap[f]
    mn,mx=v.min(0),v.max(0);rng=np.maximum(mx-mn,1e-6)
    q=np.round((v-mn)/rng*65535).astype(np.uint16)
    idt=np.uint16 if len(v)<65536 else np.uint32
    off=len(blob)
    blob+=q.astype('<u2').tobytes()
    if idt==np.uint16 and (len(q)*6)%4: pass
    blob+=f.astype(idt).astype('<u2' if idt==np.uint16 else '<u4').tobytes()
    meta.append({'k':key,'fid':fid,'nv':int(len(v)),'nf':int(len(f)),'i32':idt==np.uint32,'off':off,'mn':[round(float(x),5) for x in mn],'rng':[round(float(x),5) for x in rng]})
    print('%-12s %7d -> %6d faces  %6d verts'%(key,0,len(f),len(v)))
raw=bytes(blob);z=zlib.compress(raw,9)
print('raw',len(raw),'zlib',len(z),'b64',len(z)*4//3)
cl=open('cl.json').read();an=open('anchors.json').read()
open('bp3d_data.js','w').write('const BP3D_CL='+cl+';\nconst BP3D_AN='+an+';\nconst BP3D_META='+json.dumps(meta,separators=(',',':'))+';\nconst BP3D_B64="'+base64.b64encode(z).decode()+'";\n')
json.dump(meta,open('bp3d_meta.json','w'))
