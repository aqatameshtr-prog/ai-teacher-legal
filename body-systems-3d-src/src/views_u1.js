/* ===== UNIT 1 · Uzay Çağı: four 3D scenes (procedural, illustrative, not to scale) ===== */
const PU1={};
function earthC(x,y,z){
 const n=fbm(x*2.2,y*2.2,z*2.2,5),c=new THREE.Color();
 if(n>.06)c.set(n>.4?0xcfc8b8:(n>.2?0x5f8a35:0x8f7440));
 else c.set(0x164f9c).lerp(new THREE.Color(0x2c8ad4),.5+.5*pn(x*6,y*6,z*6));
 const cl=fbm(x*3+5,y*3,z*3,3);if(cl>.2)c.lerp(new THREE.Color(0xffffff),Math.min(.85,(cl-.2)*2.2));
 return c;
}
function moonC(x,y,z){const n=fbm(x*4,y*4,z*4,4),c=new THREE.Color(0xa8a8ac).multiplyScalar(.8+.4*n);if(pn(x*9,y*9,z*9)>.35)c.multiplyScalar(.7);return c;}
const planetG=(r,fn)=>paintFn(new THREE.SphereGeometry(r,96,64),(x,y,z)=>{const n=Math.hypot(x,y,z)||1;return fn(x/n,y/n,z/n);});
function satellite(g,T,id){
 const grp=new THREE.Group();
 const body=new THREE.Mesh(new THREE.BoxGeometry(.5,.5,.7),std(0xd9dde3,{metalness:.5,roughness:.35}));grp.add(body);T(id,body);
 [-1,1].forEach(s=>{const p=new THREE.Mesh(new THREE.BoxGeometry(1.5,.04,.6),std(0x1e3a8a,{metalness:.7,roughness:.25}));p.position.x=s*1.0;grp.add(p);T(id,p);});
 const ant=new THREE.Mesh(new THREE.CylinderGeometry(.02,.02,.5,8),std(0xbbbbbb));ant.position.y=.45;grp.add(ant);
 const dish=new THREE.Mesh(new THREE.SphereGeometry(.22,24,12,0,TAU,0,Math.PI/2),std(0xeeeeee,{side:THREE.DoubleSide}));dish.position.set(0,-.35,0);dish.rotation.x=Math.PI;grp.add(dish);T(id,dish);
 g.add(grp);return grp;
}
function rocket(g,T,id){
 const grp=new THREE.Group();
 const body=new THREE.Mesh(new THREE.CylinderGeometry(.22,.26,2.2,32),std(0xf1f3f6,{metalness:.2,roughness:.4}));grp.add(body);T(id,body);
 const nose=new THREE.Mesh(new THREE.ConeGeometry(.22,.7,32),std(0xd6342d,{roughness:.4}));nose.position.y=1.45;grp.add(nose);T(id,nose);
 for(let i=0;i<3;i++){const a=i*TAU/3;const fin=new THREE.Mesh(new THREE.BoxGeometry(.05,.7,.5),std(0xd6342d));fin.position.set(Math.cos(a)*.24,-.7,Math.sin(a)*.24);fin.rotation.y=-a;grp.add(fin);T(id,fin);}
 const flame=new THREE.Mesh(new THREE.ConeGeometry(.2,.9,20),new THREE.MeshBasicMaterial({color:0xffa53a,transparent:true,opacity:.85}));flame.position.y=-1.9;flame.rotation.x=Math.PI;grp.add(flame);
 grp.userData.flame=flame;g.add(grp);return grp;
}
const sunMat=()=>new THREE.MeshStandardMaterial({color:0xffb020,emissive:0xff8a00,emissiveIntensity:1.2,roughness:.4});

defView('sat',{
 scale:.9,pos:[4.2,2.2,.2],body:false,noPed:true,cam:{p:[4.0,17.5,12.5],t:[4.0,1.4,.3]},
 title:S3('Uzay teknolojileri','تقنيات الفضاء','Space technology'),
 organs:[['rocket',()=>PU1.rocket],['satellite',()=>PU1.sat],['earth',()=>PU1.earth],['orbit',()=>PU1.orbit]],
 build(g,T,d){
  const R=2.4,C=[0,-3.4,0];PU1.earth=C;PU1.orbit=[3.7,C[1],0];
  mesh(g,T,'earth',planetG(R,earthC),bio(0xffffff,{roughness:.6,clearcoat:.2}),C);
  mesh(g,T,'earth',new THREE.SphereGeometry(R*1.07,64,40),new THREE.MeshBasicMaterial({color:0x7dd3fc,transparent:true,opacity:.13,side:THREE.BackSide,depthWrite:false}),C,true);
  const orb=new THREE.Mesh(new THREE.TorusGeometry(3.7,.02,8,180),new THREE.MeshBasicMaterial({color:0xfbbf24}));orb.rotation.x=Math.PI/2;orb.position.set(C[0],C[1],C[2]);g.add(orb);T('orbit',orb);
  d.sat=satellite(g,T,'satellite');d.rock=rocket(g,T,'rocket');d.rock.position.set(0,.7,.3);d.rock.rotation.z=.18;
  d.t=0;
 },
 update(dt){
  this.t+=dt;const C=PU1.earth,a=this.t*.35;
  this.sat.position.set(C[0]+3.7*Math.cos(a),C[1],C[2]+3.7*Math.sin(a));this.sat.rotation.y=-a;
  PU1.sat=[C[0]+3.7*Math.cos(a),C[1],C[2]+3.7*Math.sin(a)];
  PU1.rocket=[0,.7,.3];
  const f=this.rock.userData.flame;f.scale.set(1,.8+.35*Math.sin(this.t*30)*Math.sin(this.t*17),1);
  this.rock.position.y=.7+.04*Math.sin(this.t*1.3);
 },
 status:false,
 controls(box){commonControls(box);box.appendChild(el('p','legend','Dünya’nın etrafında dönen uydu (sarı çember: yörünge). Roketin ateşi itme kuvvetini gösterir.'));}
});

defView('debris',{
 scale:.9,pos:[4.2,2.2,.2],body:false,noPed:true,cam:{p:[4.0,17.5,12.5],t:[4.0,1.4,.3]},
 title:S3('Yörüngedeki enkaz','الحطام في المدار','Debris in orbit'),
 organs:[['earth',()=>PU1.earth],['debris',()=>PU1.debris],['satellite',()=>PU1.sat],['orbit',()=>PU1.orbit]],
 build(g,T,d){
  const R=2.0,C=[0,-3.4,0];PU1.earth=C;PU1.orbit=[3.5,C[1],0];PU1.debris=[3.4,C[1],0];
  mesh(g,T,'earth',planetG(R,earthC),bio(0xffffff,{roughness:.6,clearcoat:.2}),C);
  const band=new THREE.Mesh(new THREE.RingGeometry(2.9,4.1,160),new THREE.MeshBasicMaterial({color:0xfbbf24,transparent:true,opacity:.08,side:THREE.DoubleSide,depthWrite:false}));band.rotation.x=Math.PI/2;band.position.set(C[0],C[1],C[2]);g.add(band);T('orbit',band);
  const N=150;const geo=blobG(.075,.05,.075,{w:12,h:8,color:0xb8bec8,bump:.25,bf:4});
  d.deb=new THREE.InstancedMesh(geo,std(0xb8bec8,{metalness:.6,roughness:.45}),N);g.add(d.deb);T('debris',d.deb);
  d.items=[];for(let i=0;i<N;i++)d.items.push({r:2.9+Math.random()*1.1,a:Math.random()*TAU,inc:(Math.random()-.5)*.9,sp:.5+Math.random()*.4,s:.6+Math.random()*.8});
  d.sat=satellite(g,T,'satellite');d.sat.scale.setScalar(.8);d.t=0;d.o=new THREE.Object3D();
 },
 update(dt){
  this.t+=dt;const C=PU1.earth,o=this.o;
  this.items.forEach((p,i)=>{p.a+=dt*p.sp*.25/Math.sqrt(p.r/3);const x=p.r*Math.cos(p.a),y=p.r*Math.sin(p.a)*Math.sin(p.inc),z=p.r*Math.sin(p.a)*Math.cos(p.inc);
   o.position.set(C[0]+x,C[1]+y,C[2]+z);o.rotation.set(p.a*3,p.a*2,0);o.scale.setScalar(p.s);o.updateMatrix();this.deb.setMatrixAt(i,o.matrix);});
  this.deb.instanceMatrix.needsUpdate=true;
  const a=this.t*.3;this.sat.position.set(C[0]+3.4*Math.cos(a),C[1]+.4*Math.sin(a),C[2]+3.4*Math.sin(a));this.sat.rotation.y=-a;
  PU1.sat=[C[0]+3.4*Math.cos(a),C[1]+.4*Math.sin(a),C[2]+3.4*Math.sin(a)];
 },
 status:false,
 controls(box){commonControls(box);box.appendChild(el('p','legend','Küçük gri parçalar: görevi biten uydular ve roket parçaları. Hızlı hareket ederler; bir çarpışma aktif uyduya zarar verebilir.'));}
});

const STAR_PTS=[[0,.7],[0,0],[.8,0],[.8,.7],[1.45,.9],[2.1,1.0],[2.6,1.2]];
defView('galaxy',{
 scale:.85,pos:[4.2,2.2,.2],body:false,noPed:true,cam:{p:[4.0,18.5,12.5],t:[3.0,1.4,.3]},
 title:S3('Galaksi ve takımyıldız','المجرّة والكوكبة','Galaxy and constellation'),
 organs:[['galaxy',()=>[0,0,0]],['star',()=>PU1.sunStar],['constellation',()=>PU1.cons]],
 build(g,T,d){
  const N=5000,pos=new Float32Array(N*3),col=new Float32Array(N*3),c=new THREE.Color();
  for(let i=0;i<N;i++){const arm=i%2,r=Math.pow(Math.random(),.6)*3+.05,th=arm*Math.PI+3.2*Math.log(1+r*1.6)+(Math.random()-.5)*.6;
   pos.set([r*Math.cos(th),(Math.random()-.5)*.18*(1-r/3.2),r*Math.sin(th)],i*3);
   const core=Math.max(0,1-r/1.2);c.setRGB(.62+.38*core,.72+.25*core,1).lerp(new THREE.Color(0xfff2c0),core*.8);col.set([c.r,c.g,c.b],i*3);}
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(pos,3));geo.setAttribute('color',new THREE.BufferAttribute(col,3));
  d.gal=new THREE.Points(geo,new THREE.PointsMaterial({size:.05,vertexColors:true,transparent:true,opacity:.95,depthWrite:false}));g.add(d.gal);
  mesh(g,T,'galaxy',new THREE.SphereGeometry(3.3,40,24),new THREE.MeshBasicMaterial({color:0x8fb8ff,transparent:true,opacity:.05,depthWrite:false}),[0,0,0],true);
  const sun=new THREE.Mesh(new THREE.SphereGeometry(.1,20,14),new THREE.MeshStandardMaterial({color:0xffdd66,emissive:0xffcc33,emissiveIntensity:1.5}));sun.position.set(2.3,.3,1.2);g.add(sun);T('star',sun);PU1.sunStar=[2.3,.3,1.2];
  const cg=new THREE.Group();cg.position.set(-3.5,1.5,-1.4);cg.rotation.y=.5;g.add(cg);
  const lp=[];STAR_PTS.forEach(p=>lp.push(p[0]*.9,p[1]*.9,0));
  const lines=[[0,1],[1,2],[2,3],[3,0],[3,4],[4,5],[5,6]];const lv=[];lines.forEach(([a,b])=>lv.push(lp[a*3],lp[a*3+1],lp[a*3+2],lp[b*3],lp[b*3+1],lp[b*3+2]));
  const lg=new THREE.BufferGeometry();lg.setAttribute('position',new THREE.Float32BufferAttribute(lv,3));cg.add(new THREE.LineSegments(lg,new THREE.LineBasicMaterial({color:0xbfe3ff,transparent:true,opacity:.8})));
  STAR_PTS.forEach(p=>{const s=new THREE.Mesh(new THREE.SphereGeometry(.08,16,12),new THREE.MeshStandardMaterial({color:0xffffff,emissive:0xbfd8ff,emissiveIntensity:1.3}));s.position.set(p[0]*.9,p[1]*.9,0);cg.add(s);T('constellation',s);});
  PU1.cons=[-3.5,1.5,-1.4];d.cg=cg;
 },
 update(dt){this.gal.rotation.y+=dt*.05;this.cg.rotation.z=Math.sin(performance.now()/2000)*.02;},
 status:false,
 controls(box){commonControls(box);box.appendChild(el('p','legend','Galaksi: milyarlarca yıldızın yerçekimiyle bir arada tuttuğu sistem. Takımyıldız: gökyüzünde yan yana görünen yıldızların birleştirilmiş şekli.'));}
});

defView('solar',{
 scale:.8,pos:[4.2,2.4,.2],body:false,noPed:true,cam:{p:[4.0,18.5,12.5],t:[4.0,1.2,.3]},
 title:S3('Güneş Sistemi','النظام الشمسي','The Solar System'),
 organs:[['sun',()=>[0,0,0]],['earth',()=>PU1.epos],['moon',()=>PU1.mpos],['mars',()=>PU1.marspos]],
 build(g,T,d){
  const sun=new THREE.Mesh(new THREE.SphereGeometry(.9,48,32),sunMat());g.add(sun);T('sun',sun);
  g.add(new THREE.PointLight(0xffe2a8,2.4,40,1.2));
  const ring=(R)=>{const r=new THREE.Mesh(new THREE.TorusGeometry(R,.012,6,180),new THREE.MeshBasicMaterial({color:0x94a3b8,transparent:true,opacity:.6}));r.rotation.x=Math.PI/2;g.add(r);};
  ring(2.6);ring(4.0);
  d.eo=new THREE.Group();g.add(d.eo);d.earth=mesh(d.eo,T,'earth',planetG(.32,earthC),bio(0xffffff,{roughness:.6,clearcoat:.2}),[2.6,0,0]);
  d.mo=new THREE.Group();d.mo.position.set(2.6,0,0);d.eo.add(d.mo);d.moon=mesh(d.mo,T,'moon',planetG(.1,moonC),bio(0xffffff,{roughness:.9}),[.6,0,0]);
  d.mars_o=new THREE.Group();g.add(d.mars_o);d.mars=mesh(d.mars_o,T,'mars',planetG(.24,(x,y,z)=>{const n=fbm(x*3,y*3,z*3,4);return new THREE.Color(0xb5532e).multiplyScalar(.8+.4*n).lerp(new THREE.Color(0xe98b5a),Math.max(0,n));}),bio(0xffffff,{roughness:.8}),[4.0,0,0]);
  d.t=0;d.grp=g;
 },
 update(dt){
  this.t+=dt;const ea=this.t*.5,ba=this.t*2.4;this.eo.rotation.y=ea;this.mars_o.rotation.y=this.t*.28;
  this.mo.rotation.y=ba-ea;this.earth.rotation.y=this.t*1.2;
  /* anchors come from the real scene positions, converted into this view's local space */
  const toL=(obj)=>{const v=new THREE.Vector3();obj.getWorldPosition(v);this.grp.worldToLocal(v);return v.toArray();};
  PU1.epos=toL(this.earth);PU1.mpos=toL(this.moon);PU1.marspos=toL(this.mars);
 },
 status:false,
 controls(box){commonControls(box);box.appendChild(el('p','legend','Güneş merkezde; Dünya ve Mars onun etrafında, Ay da Dünya’nın etrafında döner. Ölçekler gerçek değildir.'));}
});
