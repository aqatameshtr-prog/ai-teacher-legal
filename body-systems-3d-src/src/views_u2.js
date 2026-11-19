/* ===== UNIT 2 · Kuvvet ve Enerji: two 3D scenes (procedural, illustrative) ===== */
const PU2={};
defView('force',{
 scale:.9,pos:[4.2,2.2,.2],body:false,noPed:true,cam:{p:[4.0,17.5,12.5],t:[4.0,1.6,.3]},
 title:S3('Kuvvet ve iş','القوة والشغل','Force and work'),
 organs:[['force',()=>PU2.force],['box',()=>PU2.box],['friction',()=>PU2.fr],['lift',()=>PU2.lift]],
 build(g,T,d){
  const tbl=new THREE.Mesh(new THREE.BoxGeometry(8,.3,4),std(0x9b6b43,{roughness:.7}));tbl.position.set(0,-.15,0);tbl.receiveShadow=true;g.add(tbl);
  d.bA=new THREE.Mesh(new THREE.BoxGeometry(1,1,1),std(0x2f7dd1,{roughness:.5}));d.bA.position.set(-2,.5,0);g.add(d.bA);T('box',d.bA);
  d.bB=new THREE.Mesh(new THREE.BoxGeometry(1,1,1),std(0xe0a03a,{roughness:.5}));d.bB.position.set(2.4,.5,0);g.add(d.bB);T('lift',d.bB);
  d.aF=arrow(g,T,'force',0x16a34a,new THREE.Vector3(1,0,0),1.6,new THREE.Vector3(-3.2,.5,1.2));
  d.aFr=arrow(g,T,'friction',0xdc2626,new THREE.Vector3(-1,0,0),.9,new THREE.Vector3(-1.4,.2,.9));
  d.aL=arrow(g,T,'lift',0x16a34a,new THREE.Vector3(0,1,0),1.4,new THREE.Vector3(3.5,0,0));
  d.t=0;d.F=20;
 },
 update(dt){
  this.t+=dt;
  const sA=(1-Math.cos(this.t*.8))/2,xA=1.5*sA;
  this.bA.position.x=-2+xA;
  this.aF.position.set(this.bA.position.x-1.6,.5,1.2);setArrow(this.aF,1.6);
  this.aFr.position.set(this.bA.position.x+.5,.2,.9);setArrow(this.aFr,.9*(sA>.02?1:.3));
  const sB=(1-Math.cos(this.t*.6+Math.PI))/2,hB=1.8*sB;
  this.bB.position.y=.5+hB;
  this.aL.position.set(3.5,.5+hB-.5,0);setArrow(this.aL,1.4*(sB>.02?1:.3));
  PU2.force=[this.bA.position.x-1.6,.5,1.2];PU2.box=[this.bA.position.x,.5,0];PU2.fr=[this.bA.position.x+.5,.2,.9];PU2.lift=[3.5,.5+hB,0];
  this.wA=this.F*xA;this.wB=2*10*hB;
  if(this.statusEl){const s=this.wA.toFixed(1)+' J · '+this.wB.toFixed(1)+' J';if(s!==this.lastS){this.lastS=s;
   this.statusEl.innerHTML='<b>'+({tr:'Yatay itme',ar:'الدفع الأفقي',en:'Pushing sideways'})[ST.lang]+':</b> W = F·x = '+this.F+' N × '+xA.toFixed(2)+' m = <b>'+this.wA.toFixed(1)+' J</b><br><b>'+({tr:'Kaldırma',ar:'الرفع',en:'Lifting'})[ST.lang]+':</b> W = m·g·h = 2 kg × 10 N/kg × '+hB.toFixed(2)+' m = <b>'+this.wB.toFixed(1)+' J</b>';}}
 },
 reset(){this.t=0;},
 status:true,
 controls(box){commonControls(box);box.appendChild(el('p','legend','Yeşil ok: uygulanan kuvvet. Kırmızı ok: sürtünme (harekete karşı). Sağda cisim kaldırılıyor: yapılan iş cismin kazandığı potansiyel enerjiye eşittir.'));}
});

defView('pend',{
 scale:.9,pos:[4.2,2.2,.2],body:false,noPed:true,cam:{p:[4.0,17.5,12.5],t:[4.0,1.6,.3]},
 title:S3('Sarkaç ve enerji dönüşümü','البندول وتحوّل الطاقة','Pendulum and energy conversion'),
 organs:[['pivot',()=>PU2.pivot],['bob',()=>PU2.bob],['height',()=>PU2.hmid],['bars',()=>PU2.bars]],
 build(g,T,d){
  const L=3,P0=new THREE.Vector3(0,3.6,0),y0=P0.y-L;d.L=L;d.P0=P0;d.y0=y0;
  const pv=new THREE.Mesh(new THREE.SphereGeometry(.14,24,16),std(0x444a55,{metalness:.6,roughness:.3}));pv.position.copy(P0);g.add(pv);T('pivot',pv);
  d.str=new THREE.Mesh(new THREE.CylinderGeometry(.03,.03,L,12),std(0xcbd5e1,{metalness:.4}));g.add(d.str);
  d.bob=new THREE.Mesh(new THREE.SphereGeometry(.42,40,30),bioP(0xdc2626,{roughness:.3,clearcoat:.8}));g.add(d.bob);T('bob',d.bob);
  d.hl=new THREE.Mesh(new THREE.CylinderGeometry(.015,.015,1,8),new THREE.MeshBasicMaterial({color:0x94a3b8}));g.add(d.hl);T('height',d.hl);
  const gl=new THREE.Mesh(new THREE.BoxGeometry(4.6,.04,.6),std(0x64748b));gl.position.set(1.4,y0-.02,0);g.add(gl);
  d.bars=[];[[2.7,0x2f7dd1],[3.4,0xdc2626]].forEach(([x,c],i)=>{
   const back=new THREE.Mesh(new THREE.BoxGeometry(.5,3,.5),new THREE.MeshBasicMaterial({color:0x94a3b8,transparent:true,opacity:.25,depthWrite:false}));back.position.set(x,y0+1.5,0);g.add(back);
   const b=new THREE.Mesh(new THREE.BoxGeometry(.46,1,.46),bioP(c,{roughness:.4}));b.position.set(x,y0,0);g.add(b);T('bars',b);d.bars.push(b);});
  d.bars[0].userData.name='PE';d.amp=1.0;d.ph=0;d.w=1.8;d.o=new THREE.Object3D();d.lastPct=-1;
  PU2.pivot=[0,P0.y,0];PU2.bars=[3.05,y0+1.5,0];
 },
 update(dt){
  this.ph+=dt*this.w;const A=this.amp,th=A*Math.sin(this.ph),L=this.L,P0=this.P0,y0=this.y0;
  const bx=P0.x+L*Math.sin(th),by=P0.y-L*Math.cos(th);
  this.bob.position.set(bx,by,0);
  const mid=new THREE.Vector3((P0.x+bx)/2,(P0.y+by)/2,0),dir=new THREE.Vector3(bx-P0.x,by-P0.y,0).normalize();
  this.str.position.copy(mid);this.str.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),dir);
  this.hl.position.set(bx,(by+y0)/2,0);this.hl.scale.set(1,by-y0,1);
  const hfrac=(1-Math.cos(th))/(1-Math.cos(A)+1e-9),pe=clamp(hfrac,0,1)*3,ke=3-pe;
  this.bars[0].scale.y=Math.max(.01,pe);this.bars[0].position.y=y0+pe/2;
  this.bars[1].scale.y=Math.max(.01,ke);this.bars[1].position.y=y0+ke/2;
  PU2.bob=[bx,by,0];PU2.hmid=[bx,(by+y0)/2,0];
  const pct=Math.round(clamp(hfrac,0,1)*100);
  if(this.statusEl&&pct!==this.lastPct){this.lastPct=pct;
   this.statusEl.innerHTML='<b>'+({tr:'Potansiyel enerji',ar:'طاقة الوضع',en:'Potential energy'})[ST.lang]+':</b> '+pct+'% &nbsp;·&nbsp; <b>'+({tr:'Kinetik enerji',ar:'الطاقة الحركية',en:'Kinetic energy'})[ST.lang]+':</b> '+(100-pct)+'%';}
 },
 reset(){this.ph=0;this.lastPct=-1;},
 status:true,
 controls(box,d){
  box.appendChild(uiSlider(L3(UI.amp),.2,1.3,.05,d.amp,v=>{d.amp=v;},v=>v.toFixed(2)+' rad'));
  commonControls(box);
  box.appendChild(el('p','legend','Sarkaç en yükseğe çıktığında potansiyel enerji en fazladır; en alçakta kinetik enerji en fazladır. Sürtünme yoksa toplam enerji sabittir (sağdaki çubuklar).'));
 }
});
