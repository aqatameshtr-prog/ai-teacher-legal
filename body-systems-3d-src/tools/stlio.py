import numpy as np
def read_stl(path):
    d=np.fromfile(path,dtype=np.uint8)
    n=int(np.frombuffer(d[80:84].tobytes(),dtype='<u4')[0])
    if 84+n*50!=len(d):
        raise ValueError('not binary stl or size mismatch %s %d %d'%(path,n,len(d)))
    rec=np.frombuffer(d[84:84+n*50].tobytes(),dtype=np.dtype([('n','<f4',3),('v','<f4',(3,3)),('a','<u2')]))
    tri=rec['v'].reshape(-1,3).astype(np.float64)
    # weld vertices
    key=np.round(tri*1000).astype(np.int64)
    u,inv=np.unique(key,axis=0,return_inverse=True)
    verts=np.zeros((len(u),3));verts[inv.ravel()]=tri
    faces=inv.ravel().reshape(-1,3)
    return verts,faces
