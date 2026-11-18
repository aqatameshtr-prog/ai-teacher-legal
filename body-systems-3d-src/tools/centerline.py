import sys,os,json
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
import numpy as np, trimesh
from scipy import ndimage as ndi
from skimage.graph import route_through_array
from stlio import read_stl
S=0.01292; CX=0.0; CY=-107.3; CZ=1030.0
def to_scene(v): return np.stack([(v[:,0]-CX)*S,(v[:,2]-CZ)*S,-(v[:,1]-CY)*S],axis=1)
def load(fid):
    v,f=read_stl('stl_raw/FMA%s.stl'%fid); return to_scene(v),f
def merge(parts):
    vs=[];fs=[];o=0
    for v,f in parts: vs.append(v);fs.append(f+o);o+=len(v)
    return np.vstack(vs),np.vstack(fs)
def centerline(v,f,p0,p1,res=0.04,npts=48):
    mesh=trimesh.Trimesh(v,f,process=False)
    mn=v.min(0)-.15;dims=np.ceil((v.max(0)+.15-mn)/res).astype(int)+1
    pts,_=trimesh.sample.sample_surface(mesh,int(min(900000,max(200000,mesh.area/(res*res)*3))))
    idx=np.floor((pts-mn)/res).astype(int);m=np.zeros(dims,bool);m[idx[:,0],idx[:,1],idx[:,2]]=True
    m=ndi.binary_closing(m,iterations=2)
    # fill holes slice-wise on all three axes and combine
    f0=np.stack([ndi.binary_fill_holes(m[i]) for i in range(dims[0])],0)
    f1=np.stack([ndi.binary_fill_holes(m[:,i]) for i in range(dims[1])],1)
    f2=np.stack([ndi.binary_fill_holes(m[:,:,i]) for i in range(dims[2])],2)
    mask=(f0&f1)|(f1&f2)|(f0&f2)|m
    dt=ndi.distance_transform_edt(mask)
    cost=1.0/(dt+0.15)**2
    def snap(p):
        q=np.floor((np.array(p)-mn)/res).astype(int);q=np.clip(q,0,np.array(dims)-1)
        if mask[tuple(q)]: return tuple(q)
        ii=np.argwhere(mask);d=np.linalg.norm(ii-q,axis=1);return tuple(ii[d.argmin()])
    a,b=snap(p0),snap(p1)
    path,c=route_through_array(cost,a,b,fully_connected=True,geometric=True)
    P=np.array(path)*res+mn+res/2
    # smooth & resample
    k=5;ker=np.ones(k)/k
    Ps=np.stack([np.convolve(np.pad(P[:,i],(k//2,k//2),mode='edge'),ker,mode='valid') for i in range(3)],1)
    seg=np.linalg.norm(np.diff(Ps,axis=0),axis=1);s=np.concatenate([[0],np.cumsum(seg)])
    t=np.linspace(0,s[-1],npts);out=np.stack([np.interp(t,s,Ps[:,i]) for i in range(3)],1)
    r=ndi.map_coordinates(dt,[(out[:,i]-mn[i]-res/2)/res for i in range(3)],order=1)*res
    return out,r,float(s[-1])
def extreme(v,axis,top=True,frac=.04):
    a=v[:,axis];th=np.quantile(a,1-frac if top else frac);sel=v[a>=th] if top else v[a<=th];return sel.mean(0)
out={}
eso=load('7131');eT,eB=extreme(eso[0],1,True),extreme(eso[0],1,False)
out['esophagus']=centerline(*eso,eT,eB)
sto=load('7148');duo=load('7206')
# pylorus: stomach vertex nearest to duodenum centroid
dc=duo[0].mean(0);pyl=sto[0][np.linalg.norm(sto[0]-dc,axis=1).argmin()]
out['stomach']=centerline(*sto,eB,pyl,npts=40)
jej=load('7207');ile=load('7208');col=load('14543nsn');rec=load('14544')
small=merge([duo,jej,ile])
# start of duodenum near pylorus; end of ileum near cecum
dstart=duo[0][np.linalg.norm(duo[0]-pyl,axis=1).argmin()]
cec=col[0][(col[0][:,0]<np.quantile(col[0][:,0],.08))&(col[0][:,1]<np.quantile(col[0][:,1],.3))].mean(0)
iend=ile[0][np.linalg.norm(ile[0]-cec,axis=1).argmin()]
out['small']=centerline(*small,dstart,iend,res=0.03,npts=90)
rc=rec[0].mean(0);cend=col[0][np.linalg.norm(col[0]-rc,axis=1).argmin()]
cstart=col[0][np.linalg.norm(col[0]-iend,axis=1).argmin()]
out['large']=centerline(*col,cstart,cend,res=0.035,npts=70)
out['rectum']=centerline(*rec,extreme(rec[0],1,True),extreme(rec[0],1,False),npts=14)
tra=load('7394');out['trachea']=centerline(*tra,extreme(tra[0],1,True),extreme(tra[0],1,False),npts=16)
aa=load('3736');ar=load('3768');ad=load('3784')
aor=merge([aa,ar,ad]);out['aorta']=centerline(*aor,extreme(aa[0],1,False),extreme(ad[0],1,False),res=0.03,npts=50)
ivc=load('10951');out['ivc']=centerline(*ivc,extreme(ivc[0],1,False),extreme(ivc[0],1,True),res=0.03,npts=24)
svc=load('4720');out['svc']=centerline(*svc,extreme(svc[0],1,True),extreme(svc[0],1,False),res=0.03,npts=12)
for s in 'rl':
    u=load('15571' if s=='r' else '15572');out['ureter_'+s]=centerline(*u,extreme(u[0],1,True),extreme(u[0],1,False),res=0.03,npts=20)
ur=load('19667');out['urethra']=centerline(*ur,extreme(ur[0],1,True),extreme(ur[0],1,False),res=0.02,npts=8)
res={}
for k,(p,r,L) in out.items():
    res[k]={'p':np.round(p,3).tolist(),'r':np.round(r,3).tolist(),'len':round(L,2)}
    print('%-10s len=%6.2f  r(mean)=%.3f  start=%s end=%s'%(k,L,r.mean(),np.round(p[0],2),np.round(p[-1],2)))
json.dump(res,open('cl.json','w'),separators=(',',':'))
