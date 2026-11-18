import sys,os,json
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
import numpy as np
from stlio import read_stl
exec(open('centerline.py').read().split('out={}')[0].split('def centerline')[0].replace('import sys,os,json','').replace("sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))",""))
A={}
def bb(name,fid):
    v,f=load(fid);A[name]={'mn':v.min(0).round(2).tolist(),'mx':v.max(0).round(2).tolist(),'c':v.mean(0).round(2).tolist()};return v
pa=bb('pulm_artery','66326');pv=bb('pulm_vein','66643')
for nm,v in (('pa',pa),('pv',pv)):
    A[nm+'_left_end']=v[v[:,0].argmax()].round(2).tolist();A[nm+'_right_end']=v[v[:,0].argmin()].round(2).tolist()
    A[nm+'_top']=v[v[:,1].argmax()].round(2).tolist();A[nm+'_bot']=v[v[:,1].argmin()].round(2).tolist()
for nm,fid in (('carotid_r','3941'),('carotid_l','4058'),('brachio','3932nsn'),('aorta_arch','3768'),('aorta_asc','3736'),('svc','4720'),('lung_ru','7333'),('lung_rm','7383'),('lung_rl','7337'),('lung_lu','7370'),('lung_ll','7371'),('bronchus','7409'),('bladder','15900'),('kidney_r','7204'),('kidney_l','7205'),('diaphragm','13295'),('sternum','7487'),('liver','7197'),('stomach','7148'),('pancreas','7198nsn'),('gallbladder','7202'),('colon','14543nsn'),('appendix','14542'),('heart','7274')):
    bb(nm,fid)
def line(fid,axis_pick):
    v,f=load(fid);a=v[v[:,axis_pick[0]].argmin()] if axis_pick[1]=='min' else v[v[:,axis_pick[0]].argmax()]
    b=v[v[:,axis_pick[0]].argmax()] if axis_pick[1]=='min' else v[v[:,axis_pick[0]].argmin()];return a,b
# renal vessels: from midline (aorta/ivc) to kidney: order by |x|
cl=json.load(open('cl.json'))
for nm,fid,side in (('renal_art_r','14752','r'),('renal_art_l','14753','l'),('renal_vein_r','14335','r'),('renal_vein_l','14336','l')):
    v,f=load(fid);ix=np.abs(v[:,0]);a=v[ix.argmin()];b=v[ix.argmax()]
    mid=(a+b)/2;cl[nm]={'p':[a.round(3).tolist(),mid.round(3).tolist(),b.round(3).tolist()],'r':[.05,.05,.05],'len':float(np.linalg.norm(b-a))}
json.dump(cl,open('cl.json','w'),separators=(',',':'))
json.dump(A,open('anchors.json','w'),separators=(',',':'))
for k,v in A.items(): print(k,v)
