/* ===== shared helpers for the per-unit 3D scenes ===== */
const M=(c,o)=>std(c,o);
const GLASS=(c,op)=>std(c,{transparent:true,opacity:op,roughness:.25,depthWrite:false});
const _tp=new THREE.Vector3();
const RED=rgb(0xe11d2e),BLU=rgb(0x2f5de0);
const TAU=Math.PI*2;
const mesh=(g,T,id,geo,mat,pos,sh)=>{const m=new THREE.Mesh(geo,mat);if(pos)m.position.set(pos[0],pos[1],pos[2]);g.add(m);if(id)T(id,m,sh);return m;};
const put=(g,T,id,m)=>{g.add(m);T(id,m);return m;};
const lm=(g,T,id,curve,o,mat,sh)=>mesh(g,T,id,loft(curve,o),mat,null,sh);
/* arrow whose base sits at pos and that points along dir; its length can be changed with setArrow */
function arrow(g,T,id,color,dir,len,pos){
 const grp=new THREE.Group(),m=std(color,{roughness:.4});
 const sh=new THREE.Mesh(new THREE.CylinderGeometry(.06,.06,len*.8,16),m);sh.position.y=len*.4;grp.add(sh);
 const hd=new THREE.Mesh(new THREE.ConeGeometry(.17,len*.2,20),m);hd.position.y=len*.9;grp.add(hd);
 grp.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),dir.clone().normalize());
 grp.position.copy(pos);grp.userData.len=len;g.add(grp);[sh,hd].forEach(x=>T(id,x));return grp;
}
function setArrow(grp,len){grp.scale.y=Math.max(.02,len)/grp.userData.len;}
