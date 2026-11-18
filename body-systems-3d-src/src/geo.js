/* ===== geo: organic sculpting toolkit (noise, deform, vein paint, loft, wet-tissue materials) ===== */
const PERM=new Uint8Array(512);
(function(){const p=[];for(let i=0;i<256;i++)p[i]=i;let s=7;const rnd=()=>{s=(s*16807)%2147483647;return s/2147483647;};for(let i=255;i>0;i--){const j=Math.floor(rnd()*(i+1));const t=p[i];p[i]=p[j];p[j]=t;}for(let i=0;i<512;i++)PERM[i]=p[i&255];})();
const fd_=t=>t*t*t*(t*(t*6-15)+10);
const gr_=(h,x,y,z)=>{h&=15;const u=h<8?x:y,v=h<4?y:(h===12||h===14?x:z);return((h&1)?-u:u)+((h&2)?-v:v);};
const lp_=(a,b,t)=>a+(b-a)*t;
function pn(x,y,z){
 const fx=Math.floor(x),fy=Math.floor(y),fz=Math.floor(z),X=fx&255,Y=fy&255,Z=fz&255;x-=fx;y-=fy;z-=fz;
 const u=fd_(x),v=fd_(y),w=fd_(z),A=PERM[X]+Y,AA=PERM[A]+Z,AB=PERM[A+1]+Z,B=PERM[X+1]+Y,BA=PERM[B]+Z,BB=PERM[B+1]+Z;
 return lp_(lp_(lp_(gr_(PERM[AA],x,y,z),gr_(PERM[BA],x-1,y,z),u),lp_(gr_(PERM[AB],x,y-1,z),gr_(PERM[BB],x-1,y-1,z),u),v),
              lp_(lp_(gr_(PERM[AA+1],x,y,z-1),gr_(PERM[BA+1],x-1,y,z-1),u),lp_(gr_(PERM[AB+1],x,y-1,z-1),gr_(PERM[BB+1],x-1,y-1,z-1),u),v),w);
}
function fbm(x,y,z,o){let a=1,f=1,s=0,n=0;for(let i=0;i<(o||4);i++){s+=pn(x*f,y*f,z*f)*a;n+=a;a*=.5;f*=2.03;}return s/n;}
const ss=(a,b,x)=>{const t=Math.min(1,Math.max(0,(x-a)/(b-a)));return t*t*(3-2*t);};

/* merge duplicate vertices (kills the UV seam) and drop uv/normal */
function weld(g){
 const p=g.attributes.position,map=new Map(),np=[],rem=new Array(p.count);
 for(let i=0;i<p.count;i++){const k=Math.round(p.getX(i)*1e4)+','+Math.round(p.getY(i)*1e4)+','+Math.round(p.getZ(i)*1e4);let j=map.get(k);if(j===undefined){j=np.length/3;map.set(k,j);np.push(p.getX(i),p.getY(i),p.getZ(i));}rem[i]=j;}
 const src=g.index?g.index.array:null,n=src?src.length:p.count,idx=[];
 for(let i=0;i<n;i+=3){const a=rem[src?src[i]:i],b=rem[src?src[i+1]:i+1],c=rem[src?src[i+2]:i+2];if(a!==b&&b!==c&&a!==c)idx.push(a,b,c);}
 const out=new THREE.BufferGeometry();out.setAttribute('position',new THREE.Float32BufferAttribute(np,3));out.setIndex(idx);out.computeVertexNormals();return out;
}
function shapeG(g,fn){const p=g.attributes.position,o=[0,0,0];for(let i=0;i<p.count;i++){fn(p.getX(i),p.getY(i),p.getZ(i),o);p.setXYZ(i,o[0],o[1],o[2]);}p.needsUpdate=true;g.computeVertexNormals();return g;}
function sculpt(g,fn){g.computeVertexNormals();const p=g.attributes.position,n=g.attributes.normal;for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i),d=fn(x,y,z);p.setXYZ(i,x+n.getX(i)*d,y+n.getY(i)*d,z+n.getZ(i)*d);}p.needsUpdate=true;g.computeVertexNormals();return g;}
const HSL_={h:0,s:0,l:0};
/* vertex colours: mottled base + optional vein network (ridged noise) */
function paint(g,hex,o){
 o=o||{};const base=new THREE.Color(hex),vc=new THREE.Color(o.vein||0x7a1c24),p=g.attributes.position,n=p.count,col=new Float32Array(n*3),t=new THREE.Color();
 const s=o.s||2.5,v=o.v==null?.16:o.v,vs=o.vs||3,va=o.va||0;
 for(let i=0;i<n;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i);
  t.copy(base).multiplyScalar(1+v*fbm(x*s,y*s,z*s+10,3));
  if(va>0){const r=1-Math.abs(pn(x*vs,y*vs,z*vs+30));t.lerp(vc,ss(.9,.985,r)*va);}
  t.getHSL(HSL_);t.setHSL(HSL_.h,Math.min(1,HSL_.s*1.35),HSL_.l*.9);
  col[i*3]=t.r;col[i*3+1]=t.g;col[i*3+2]=t.b;}
 g.setAttribute('color',new THREE.BufferAttribute(col,3));return g;
}
function paintFn(g,fn){const p=g.attributes.position,n=p.count,col=new Float32Array(n*3);for(let i=0;i<n;i++){const c=fn(p.getX(i),p.getY(i),p.getZ(i));col[i*3]=c.r;col[i*3+1]=c.g;col[i*3+2]=c.b;}g.setAttribute('color',new THREE.BufferAttribute(col,3));return g;}

/* organic blob: unit sphere -> shape -> noise -> paint -> scale */
function blobG(rx,ry,rz,o){
 o=o||{};const g=weld(new THREE.SphereGeometry(1,o.w||72,o.h||54));
 if(o.shape)shapeG(g,o.shape);
 if(o.sc){g.computeVertexNormals();sculpt(g,o.sc);}
 if(o.bump){const bf=o.bf||3;sculpt(g,(x,y,z)=>o.bump*fbm(x*bf,y*bf,z*bf,o.oct||3));}
 paint(g,o.color||0xd08080,o.paint);g.scale(rx,ry,rz);g.computeVertexNormals();return g;
}
/* loft: a tube whose radius / cross-section can vary along a curve */
function loft(curve,o){
 const N=o.segs||Math.max(24,Math.round(curve.getLength()*(o.dens||26))),R=o.radial||16,fr=curve.computeFrenetFrames(N,false),P=[],I=[],C=[];
 const base=o.color!=null?new THREE.Color(o.color):null,tc=new THREE.Color(),ex=o.ex||1;
 for(let i=0;i<=N;i++){
  const u=i/N,c=curve.getPointAt(u),nm=fr.normals[i],bn=fr.binormals[i],r0=o.r?o.r(u):(o.radius||.1);
  for(let j=0;j<R;j++){const a=j/R*Math.PI*2,ca=Math.cos(a),sa=Math.sin(a),w=o.wob?o.wob(u,a,ca,sa):1,rr=r0*w;
   P.push(c.x+(nm.x*ca*ex+bn.x*sa)*rr,c.y+(nm.y*ca*ex+bn.y*sa)*rr,c.z+(nm.z*ca*ex+bn.z*sa)*rr);}
 }
 for(let i=0;i<N;i++)for(let j=0;j<R;j++){const a=i*R+j,b=i*R+(j+1)%R,c=(i+1)*R+j,d=(i+1)*R+(j+1)%R;I.push(a,b,c,b,d,c);}
 if(o.caps!==false){
  [0,N].forEach(e=>{const c=curve.getPointAt(e/N),ci=P.length/3;P.push(c.x,c.y,c.z);for(let j=0;j<R;j++){const a=e*R+j,b=e*R+(j+1)%R;if(e===0)I.push(ci,b,a);else I.push(ci,a,b);}});
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(P,3));g.setIndex(I);g.computeVertexNormals();
 /* make sure faces point outwards */
 {const nr=g.attributes.normal,ps=g.attributes.position,i=Math.floor(N/2),j=Math.floor(R/4),vi=i*R+j,cc=curve.getPointAt(i/N);
  const dx=ps.getX(vi)-cc.x,dy=ps.getY(vi)-cc.y,dz=ps.getZ(vi)-cc.z;
  if(nr.getX(vi)*dx+nr.getY(vi)*dy+nr.getZ(vi)*dz<0){for(let k=0;k<I.length;k+=3){const t=I[k+1];I[k+1]=I[k+2];I[k+2]=t;}g.setIndex(I);g.computeVertexNormals();}}
 if(o.cfn){const n=g.attributes.position.count,col=new Float32Array(n*3);for(let i=0;i<=N;i++)for(let j=0;j<R;j++){const c=o.cfn(i/N);col[(i*R+j)*3]=c.r;col[(i*R+j)*3+1]=c.g;col[(i*R+j)*3+2]=c.b;}
  for(let k=(N+1)*R;k<n;k++){const c=o.cfn(k===(N+1)*R?0:1);col[k*3]=c.r;col[k*3+1]=c.g;col[k*3+2]=c.b;}g.setAttribute('color',new THREE.BufferAttribute(col,3));}
 else if(base)paint(g,o.color,Object.assign({s:o.ps||1.6,vs:o.vs||2.4},o.paint||{}));
 return g;
}
function centerGeo(m){m.geometry.computeBoundingBox();const c=m.geometry.boundingBox.getCenter(new THREE.Vector3());m.geometry.translate(-c.x,-c.y,-c.z);m.position.add(c);return m;}

/* wet-tissue materials */
function bio(hex,o){
 const m=new THREE.MeshPhysicalMaterial(Object.assign({color:0xffffff,vertexColors:true,roughness:.42,metalness:0,clearcoat:.55,clearcoatRoughness:.3,sheen:.5,sheenRoughness:.6,sheenColor:new THREE.Color(0xffb4b4),envMapIntensity:.8},o||{}));
 m.userData.glow=new THREE.Color(hex);return m;
}
function bioP(hex,o){return bio(hex,Object.assign({color:hex,vertexColors:false},o||{}));}
function wet(hex,op){return bio(hex,{transparent:true,opacity:op||.62,depthWrite:false,side:THREE.DoubleSide,clearcoat:.7});}

/* ===== BodyParts3D loader ===== */
const BP={};
async function loadBP3D(){
 const bin=Uint8Array.from(atob(BP3D_B64),c=>c.charCodeAt(0));
 const buf=await new Response(new Blob([bin]).stream().pipeThrough(new DecompressionStream('deflate'))).arrayBuffer();
 BP3D_META.forEach(m=>{
  const q=new Uint16Array(buf.slice(m.off,m.off+m.nv*6)),pos=new Float32Array(m.nv*3);
  for(let i=0;i<m.nv;i++){pos[i*3]=m.mn[0]+q[i*3]/65535*m.rng[0];pos[i*3+1]=m.mn[1]+q[i*3+1]/65535*m.rng[1];pos[i*3+2]=m.mn[2]+q[i*3+2]/65535*m.rng[2];}
  const io=m.off+m.nv*6,idx=m.i32?new Uint32Array(buf.slice(io,io+m.nf*12)):new Uint16Array(buf.slice(io,io+m.nf*6));
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pos,3));g.setIndex(new THREE.BufferAttribute(idx,1));g.computeVertexNormals();BP[m.k]=g;
 });
 const ub=Uint8Array.from(atob(U3_B64),c=>c.charCodeAt(0));
 U3=JSON.parse(await new Response(new Blob([ub]).stream().pipeThrough(new DecompressionStream('deflate'))).text());buildSteps();
}
function mergeG(list){
 let nv=0,ni=0;list.forEach(g=>{nv+=g.attributes.position.count;ni+=g.index.count;});
 const pos=new Float32Array(nv*3),col=new Float32Array(nv*3),idx=new Uint32Array(ni);let vo=0,io=0;
 list.forEach(g=>{const p=g.attributes.position,c=g.attributes.color;pos.set(p.array,vo*3);if(c)col.set(c.array,vo*3);for(let i=0;i<g.index.count;i++)idx[io+i]=g.index.array[i]+vo;vo+=p.count;io+=g.index.count;});
 const out=new THREE.BufferGeometry();out.setAttribute('position',new THREE.BufferAttribute(pos,3));out.setAttribute('color',new THREE.BufferAttribute(col,3));out.setIndex(new THREE.BufferAttribute(idx,1));out.computeVertexNormals();return out;
}
const realG=(key,hex,p)=>paint(BP[key].clone(),hex,p||{s:2.5,v:.14});
const clCurve=(k,filter)=>{let p=BP3D_CL[k].p;if(filter)p=p.filter(filter);return cv(p);};
/* soft anchor-based region colouring (used for the heart) */
function regionPaint(g,anchors,o){
 o=o||{};const p=g.attributes.position,n=p.count,col=new Float32Array(n*3),t=new THREE.Color(),c2=new THREE.Color(),hv=new THREE.Color(o.vein||0xf0d27a);
 const cs=anchors.map(a=>new THREE.Color(a.c));
 for(let i=0;i<n;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i);let wsum=0;t.setRGB(0,0,0);
  for(let k=0;k<anchors.length;k++){const a=anchors[k].p,d2=(x-a[0])**2+(y-a[1])**2+(z-a[2])**2,w=Math.exp(-d2/(o.sig||.16));t.r+=cs[k].r*w;t.g+=cs[k].g*w;t.b+=cs[k].b*w;wsum+=w;}
  t.multiplyScalar(1/Math.max(wsum,1e-6));t.multiplyScalar(1+.14*fbm(x*3,y*3,z*3+7,3));
  const r=1-Math.abs(pn(x*4.5,y*4.5,z*4.5+40));t.lerp(hv,ss(.88,.985,r)*(o.va||.55));
  t.getHSL(HSL_);t.setHSL(HSL_.h,Math.min(1,HSL_.s*1.3),HSL_.l*.92);
  col[i*3]=t.r;col[i*3+1]=t.g;col[i*3+2]=t.b;}
 g.setAttribute('color',new THREE.BufferAttribute(col,3));return g;
}
