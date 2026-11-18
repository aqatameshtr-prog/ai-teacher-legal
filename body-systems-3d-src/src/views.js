/* ===== views: digestive, circulatory, respiratory, excretory (+ close-ups) — sculpted organs ===== */
const M=(c,o)=>std(c,o);
const GLASS=(c,op)=>std(c,{transparent:true,opacity:op,roughness:.25,depthWrite:false});
const _tp=new THREE.Vector3();
const RED=rgb(0xe11d2e),BLU=rgb(0x2f5de0);
const TAU=Math.PI*2;
const mesh=(g,T,id,geo,mat,pos,sh)=>{const m=new THREE.Mesh(geo,mat);if(pos)m.position.set(pos[0],pos[1],pos[2]);g.add(m);if(id)T(id,m,sh);return m;};
const put=(g,T,id,m)=>{g.add(m);T(id,m);return m;};
const lm=(g,T,id,curve,o,mat,sh)=>mesh(g,T,id,loft(curve,o),mat,null,sh);

/* lung shape: apex, concave base, mediastinal impression, cardiac notch (left), fissures */
function lungG(side,rx,ry,rz){
 const med=-side,g=weld(new THREE.SphereGeometry(1,110,84));
 shapeG(g,(x,y,z,o)=>{const top=ss(.05,1,y),k=1-.4*top;let X=x*k,Z=z*k*(1-.12*top),Y=y;
  if(y<0){const rr=Math.min(1,X*X+Z*Z);Y=y+.26*(1-rr)*ss(0,-.85,y);}
  const m=X*med;if(m>0)X=med*(m*(1-.38*m));o[0]=X;o[1]=Y;o[2]=Z;});
 sculpt(g,(x,y,z)=>{const m=x*med;let d=.012*fbm(x*7,y*7,z*7,3);
  d-=.2*Math.exp(-(((m-.8)**2)/.14+((y+.05)**2)/.45+((z-.1)**2)/.5));
  if(side>0)d-=.26*Math.exp(-(((m-.75)**2)/.16+((y+.4)**2)/.1+((z-.65)**2)/.1));
  const d1=y*.62-z*.78+.1;if(m<.5)d-=.07*Math.exp(-(d1*d1)/.0012)*ss(.5,-.1,m);
  if(side<0){const d2=y-.22;d-=.06*Math.exp(-(d2*d2)/.001)*ss(0,.4,z)*(m<.6?1:0);}
  return d;});
 paint(g,0xe9a3ad,{s:6,v:.14,vein:0x8e7081,va:.5,vs:5.5});
 g.scale(rx,ry,rz);g.computeVertexNormals();return g;
}

/* ========== DIGESTIVE ========== */
const SMALL_PTS=(function(){const p=[[.95,1.1,.4],[.85,.6,.45]];for(let k=0;k<6;k++){const y0=.1-.36*k,dir=k%2===0?-1:1,sx=k%2===0?.95:-.95;for(let i=0;i<5;i++){p.push([sx+dir*i*.475,y0+.07*Math.sin(i*1.7+k),.5+.1*Math.sin(i*2+k)]);}}p.push([.2,-2.0,.4],[-.7,-2.05,.35],[-1.3,-1.9,.3]);return p;})();
const LARGE_PTS=[[-1.3,-1.9,.3],[-1.3,-1.0,.25],[-1.3,-.1,.25],[-1.25,.5,.25],[-.7,.7,.25],[0,.58,.25],[.7,.7,.25],[1.25,.5,.25],[1.3,-.1,.25],[1.3,-1.0,.25],[1.2,-1.9,.28],[.75,-2.4,.3],[.3,-2.3,.3],[0,-2.8,.3]];
defView('dig',{
 scale:.8,pos:[4.2,3.0,.2],body:true,pedScale:1.75,cam:{p:[2.6,18.5,11.5],t:[2.6,2.7,.3]},
 title:S3('Sindirim sistemi','الجهاز الهضمي','Digestive system'),
 organs:[['mouth',[0,6.25,.8]],['salivary',[.75,6.1,.4]],['pharynx',[.3,5.5,.2]],['esophagus',[.35,4.0,.3]],['liver',[-.9,1.5,1.05]],['gallbladder',[-.73,.6,.9]],['stomach',[1.0,1.2,1.1]],['pancreas',[.3,.4,.6]],['small',[.1,-.5,.9]],['large',[-1.3,-.8,.8]],['anus',[0,-3.0,.3]]],
 build(g,T,d){
  /* procedural head parts (BodyParts3D has no tongue / pharynx in this release) */
  mesh(g,T,'mouth',blobG(.42,.24,.34,{w:48,h:36,color:0xd9677a,bump:.05,bf:3,paint:{s:3,v:.12}}),bio(0xd9677a,{roughness:.3}),[0,6.2,.42]);
  mesh(g,T,'mouth',blobG(.3,.12,.32,{w:44,h:32,color:0xe27f8f,bump:.07,bf:5,paint:{s:6,v:.2}}),bio(0xe27f8f,{roughness:.4}),[0,6.12,.5]);
  const tg=blobG(.045,.065,.04,{w:14,h:10,color:0xf4f0e6}),tm=bioP(0xf4f0e6,{roughness:.22,clearcoat:.9});
  for(let i=0;i<14;i++){const a=-1.25+i*(2.5/13);mesh(g,T,'mouth',tg,tm,[Math.sin(a)*.32,6.3,.42+Math.cos(a)*.3]);}
  [-1,1].forEach(s=>mesh(g,T,'salivary',blobG(.2,.17,.17,{w:36,h:28,color:0xf2b074,bump:.09,bf:6,paint:{s:5,v:.18}}),bio(0xf2b074,{roughness:.5,clearcoat:.2}),[s*.62,6.1,.3]));
  const E=BP3D_CL.esophagus.p;
  lm(g,T,'pharynx',cv([[0,6.1,.25],[0,5.6,.05],[E[0][0],E[0][1]+.05,E[0][2]]]),{radius:.2,color:0xe08a9b,wob:(u,a)=>1+.06*Math.cos(a*3+u*4)},wet(0xe08a9b,.82));
  /* real BodyParts3D organs */
  const rl=(id,key,hex,p,mo,sh)=>mesh(g,T,id,realG(key,hex,p),bio(hex,mo),null,sh);
  rl('esophagus','esophagus',0xc9766a,{s:2,v:.1,vein:0x8e3b32,va:.25,vs:3},{roughness:.4,clearcoat:.6});
  d.stomach=centerGeo(rl('stomach','stomach',0xb9574f,{s:1.6,v:.14,vein:0xa8443a,va:.4,vs:2},{roughness:.38,clearcoat:.7}));
  rl('liver','liver',0x6b2a1c,{s:1.6,v:.1,vein:0x2e0d08,va:.28,vs:2.4},{roughness:.28,clearcoat:.95,clearcoatRoughness:.15});
  rl('gallbladder','gallbladder',0x3f7d3a,{s:3,v:.08},{roughness:.15,clearcoat:1});
  rl('pancreas','pancreas',0xdcae80,{s:3,v:.14},{roughness:.55,clearcoat:.15});
  const smallG=mergeG([realG('duodenum',0xd6847d,{s:3,v:.1,vein:0xb44f4f,va:.3,vs:3}),realG('jejunum',0xd6847d,{s:3,v:.1,vein:0xb44f4f,va:.3,vs:3}),realG('ileum',0xcc7a75,{s:3,v:.1,vein:0xb44f4f,va:.3,vs:3})]);
  mesh(g,T,'small',smallG,bio(0xd6847d,{roughness:.4,clearcoat:.6}));
  const largeG=mergeG([realG('colon',0xb8776a,{s:2,v:.1}),realG('appendix',0xa86d62,{s:3,v:.06})]);
  mesh(g,T,'large',largeG,bio(0xb8776a,{roughness:.45,clearcoat:.5}));
  rl('anus','rectum',0x9a5850,{s:2.5,v:.1},{roughness:.4,clearcoat:.5});
  /* food path follows the centre-lines computed from the real organs */
  const ST=BP3D_CL.stomach.p,SM=BP3D_CL.small.p,LG=BP3D_CL.large.p,RC=BP3D_CL.rectum.p;
  const coil=SM.map((p,i)=>{const th=i*.34;return [p[0]+.26*Math.cos(th),p[1]+.2*Math.sin(th),p[2]+.14*Math.sin(th*.7)];});coil[0]=SM[0].slice();coil[coil.length-1]=SM[SM.length-1].slice();
  const lend=LG[LG.length-1],rect=[lend].concat(RC.filter(p=>p[1]<lend[1]-.05));
  d.seg=[
   {id:'mouth',c:cv([[0,6.5,.9],[0,6.25,.5],[0,6.12,.25]]),dur:2.6,r:[.2,.17],col:[0xb8793e,0xb8793e],ease:1},
   {id:'pharynx',c:cv([[0,6.12,.25],[0,5.6,.05],E[0]]),dur:1.2,r:[.17,.12],col:[0xb8793e,0xb8793e]},
   {id:'esophagus',c:cv(E),dur:2.4,r:[.1,.09],col:[0xb8793e,0xc9a043]},
   {id:'stomach',c:cv(ST),dur:3.8,r:[.15,.12],col:[0xc9a043,0xe3c24f]},
   {id:'small',c:cv(coil),dur:7,r:[.08,.05],col:[0xe3c24f,0xb98f3d]},
   {id:'large',c:cv(LG),dur:5.2,r:[.08,.09],col:[0xb98f3d,0x7a5a2c]},
   {id:'anus',c:cv(rect),dur:1.8,r:[.09,.09],col:[0x7a5a2c,0x5b3f1f]}];
  d.total=d.seg.reduce((s,x)=>s+x.dur,0);d.starts=[];let a=0;d.seg.forEach(s=>{d.starts.push(a);a+=s.dur;});
  d.food=new THREE.Mesh(new THREE.SphereGeometry(1,24,18),bioP(0xb8793e,{roughness:.5,clearcoat:.4,transparent:true,opacity:.97,depthTest:false}));d.food.renderOrder=9;g.add(d.food);
  d.fx=new Pool(140,.1,g,true);d.acc=0;d.T=0;d.stage=-1;
 },
 reset(){this.T=0;this.auto=null;},
 update(dt,raw){
  if(!this.dragging)this.T+=dt;
  if(this.T>=this.total+1.4)this.T=0;
  let i=0;while(i<this.seg.length&&this.T>=this.starts[i]+this.seg[i].dur)i++;
  if(i>=this.seg.length){this.food.visible=false;i=-1;}else{
   const s=this.seg[i],u=clamp((this.T-this.starts[i])/s.dur,0,1),uu=s.ease?sm(u):u;
   this.food.visible=true;s.c.getPointAt(uu,this.food.position);
   if(s.id==='stomach'){this.food.position.x+=Math.sin(this.T*5)*.1;this.food.position.y+=Math.cos(this.T*4)*.06;}
   if(s.id==='mouth')this.food.position.x+=Math.sin(this.T*14)*.05*(1-u);
   const r=lerp(s.r[0],s.r[1],u);this.food.scale.set(r,r*(s.id==='mouth'?(1+.2*Math.sin(this.T*14)):1),r);
   this.food.material.color.setHex(s.col[0]).lerp(new THREE.Color(s.col[1]),u);
   this.acc+=raw*(this.dragging?0:1);const fp=this.food.position;
   if(this.acc>.07&&dt>0){this.acc=0;const R=Math.random;
    if(s.id==='mouth')this.fx.spawn(fp.x+(R()-.5)*.3,fp.y+(R()-.5)*.2,fp.z+.1,(R()-.5)*.6,.2,.3,rgb(0xa855f7),.9);
    else if(s.id==='stomach')this.fx.spawn(fp.x+(R()-.5)*.5,fp.y+(R()-.5)*.4,fp.z+.2,(R()-.5)*.3,(R()-.5)*.3,.1,rgb(0x84cc16),1);
    else if(s.id==='small')this.fx.spawn(fp.x,fp.y,fp.z,(R()-.5)*.9,(R()-.5)*.9,.6,rgb(0x10b981),1.3);
    else if(s.id==='large')this.fx.spawn(fp.x,fp.y,fp.z,(R()-.5)*.7,(R()-.5)*.7,.5,rgb(0x38bdf8),1.1);}
  }
  this.fx.update(dt);
  const id=i>=0?this.seg[i].id:null;this.auto=id;
  this.stomach.scale.setScalar(1+.04*Math.sin(this.T*6)*(id==='stomach'?1:0));
  if(i!==this.stage){this.stage=i;this.setStatus(i);}
  if(this.scrub&&!this.dragging)this.scrub.sl.value=clamp(this.T/this.total,0,1);
 },
 setStatus(i){if(!this.statusEl)return;if(i<0){this.statusEl.innerHTML='<b>'+L3(UI.stage)+':</b> —';return;}const id=this.seg[i].id;this.statusEl.innerHTML='<b>'+L3(UI.stage)+' '+(i+1)+'/7 — '+L3(ORG[id].n)+'</b><br>'+L3(ORG[id].d);},
 status:true,
 demo(i){this.T=this.starts[i]+.2;},
 controls(box,d){
  d.scrub=uiSlider(L3(UI.stage),0,1,.001,clamp(d.T/d.total,0,1),v=>{d.T=v*d.total;},v=>Math.round(v*100)+'%');
  d.scrub.sl.onpointerdown=()=>d.dragging=true;d.scrub.sl.onpointerup=()=>d.dragging=false;box.appendChild(d.scrub);
  const chips=el('div','chips');DIG_STAGES.forEach((id,i)=>{const b=el('button','chip',(i+1));b.title=L3(ORG[id].n);b.onclick=()=>{d.T=d.starts[i]+.15;};chips.appendChild(b);});box.appendChild(chips);
  commonControls(box);d.stage=-9;
 },
 onSelect(id){const i=DIG_STAGES.indexOf(id);if(i>=0)this.T=this.starts[i]+.15;}
});

/* ===== digestive close-up: villi ===== */
defView('dig_d',{
 scale:.78,pos:[4.2,2.3,.3],body:false,pedestal:[4.2,.3],pedScale:3,cam:{p:[3.0,16,12],t:[3.4,1.6,.3]},
 title:S3('Villus (ince bağırsak yüzeyi)','الزغابات (سطح الأمعاء الدقيقة)','Villi (inside the small intestine)'),
 organs:[['villus',[0,-.1,.8]],['vcap',[-.9,-1.4,.5]],['lacteal',[.9,-1.4,.5]],['lumen',[-3.2,1.6,.5]]],
 build(g,T,d){
  const slab=mesh(g,T,null,blobG(4.6,.3,2.6,{w:48,h:24,shape:(x,y,z,o)=>{o[0]=Math.sign(x)*Math.pow(Math.abs(x),.35);o[1]=y;o[2]=Math.sign(z)*Math.pow(Math.abs(z),.35);},color:0xd98a8a,bump:.04,bf:2,paint:{s:2,v:.12}}),bio(0xd98a8a,{roughness:.5}),[0,-2.6,0]);
  d.v=[];const gd=[[-3,-1.1],[-1,-1.1],[1,-1.1],[3,-1.1],[-2,1.1],[0,1.1],[2,1.1]];
  gd.forEach(p=>{const x=p[0],z=p[1];
   const vr=u=>.38*Math.pow(Math.max(0,1-Math.pow(u,7)),.5)*(1+.05*Math.sin(u*14));
   lm(g,T,'villus',cv([[x,-2.35,z],[x,-1.4,z],[x,-.42,z]]),{r:vr,radial:22,dens:30,color:0xf4a3b0,ps:2.5,paint:{v:.1,vein:0xd1566a,va:.15,vs:3},wob:(u,a)=>1+.04*Math.cos(a*4+u*9)},wet(0xf4a3b0,.55));
   const cap=tube(cv([[x-.12,-2.35,z],[x-.12,-.95,z],[x,-.55,z],[x+.04,-.95,z],[x+.04,-2.35,z]]),.045,bioP(0xd62828,{roughness:.3}));g.add(cap);T('vcap',cap);
   const lac=tube(cv([[x+.17,-2.35,z],[x+.17,-.8,z]]),.06,bioP(0xf2c84b,{roughness:.3}));g.add(lac);T('lacteal',lac);
   d.v.push({x,z});});
  const lum=new THREE.Mesh(new THREE.BoxGeometry(9,.05,5),GLASS(0xfff2c4,.12));lum.position.set(0,1.6,0);g.add(lum);T('lumen',lum,true);
  d.dots=new Dots(120,.22,g);d.ps=[];for(let i=0;i<120;i++)d.ps.push({v:i%7,ph:Math.random(),fat:i%3===0,sx:(Math.random()-.5)*8,sz:(Math.random()-.5)*4.2,sy:.1+Math.random()*1.6});
 },
 update(dt){
  const D=this.dots;
  this.ps.forEach((p,i)=>{p.ph=(p.ph+dt*.12)%1;const s=p.ph,v=this.v[p.v];
   let x,y,z,a=1;
   if(s<.42){const u=sm(s/.42);x=lerp(p.sx,v.x,u)+Math.sin(s*20+i)*.12;y=lerp(p.sy,-.5,u);z=lerp(p.sz,v.z,u);a=Math.min(1,s*6);}
   else if(s<.58){const u=(s-.42)/.16;x=v.x+(p.fat?.17:-.12);y=lerp(-.5,-1.0,u);z=v.z;}
   else{const u=(s-.58)/.42;x=v.x+(p.fat?.17:-.12);y=lerp(-1.0,-2.3,u);z=v.z;a=1-u*.9;}
   D.set(i,x,y,z,p.fat?rgb(0xe0a800):rgb(0x16a34a),a);});
  D.commit();
 },
 status:false,
 controls(box){commonControls(box);const lg=el('div','legend');lg.innerHTML='<i style="background:#16a34a"></i>'+({tr:'Glikoz / amino asit → kan',ar:'جلوكوز / أحماض أمينية ← الدم',en:'Glucose / amino acids → blood'}[ST.lang])+'<br><i style="background:#e0a800"></i>'+({tr:'Yağ asitleri → lenf',ar:'أحماض دهنية ← اللمف',en:'Fatty acids → lymph'}[ST.lang]);box.appendChild(lg);}
});

/* ========== CIRCULATORY ========== */
const SEG={};
function segdef(name,pts,ox0,ox1){const c=cv(pts);SEG[name]={c,len:c.getLength(),ox0,ox1};return SEG[name];}
function mkLoop(names){let tot=0;const arr=names.map(n=>{const s=SEG[n];const o={s,start:tot};tot+=s.len;return o;});return {arr,tot};}
function sampleLoop(L,u,out){const s=u*L.tot;for(let i=L.arr.length-1;i>=0;i--){const a=L.arr[i];if(s>=a.start){const lu=clamp((s-a.start)/a.s.len,0,1);a.s.c.getPointAt(lu,out);return lerp(a.s.ox0,a.s.ox1,lu);}}return 1;}
defView('cir',{
 scale:.8,pos:[4.2,3.0,.2],body:true,pedScale:1.75,cam:{p:[2.6,18.5,11.5],t:[2.6,2.7,.3]},
 title:S3('Dolaşım sistemi','الجهاز الدوري','Circulatory system'),
 organs:[['lv',[1.0,2.3,.8]],['rv',[.3,2.1,.95]],['la',[.85,3.2,-.1]],['ra',[-.45,3.0,.4]],['aorta',[.55,3.8,.4]],['vena',[-.45,3.5,.4]],['pulmart',[-.5,3.4,.5]],['pulmvein',[-1.1,2.1,.4]],['capillary',[0,-3.4,.6]],['lungs',[1.45,1.6,.9]]],
 build(g,T,d){
  const mk=(id,m,sh)=>{g.add(m);T(id,m,sh);return m;};
  /* real heart wall, coloured by region; chamber picked from where you touch */
  const ancs=[{p:[-.25,3.0,0],c:0x6a6aa8},{p:[.25,2.4,.65],c:0x56569a},{p:[.6,3.05,-.3],c:0xb02a30},{p:[.7,2.35,.1],c:0x981c26}];
  const hg=regionPaint(BP.heart.clone(),ancs,{sig:.13,va:.5});
  d.heart=centerGeo(new THREE.Mesh(hg,bio(0xb8272c,{roughness:.3,clearcoat:.85,clearcoatRoughness:.2})));g.add(d.heart);
  ['ra','rv','la','lv'].forEach(id=>T(id,d.heart));
  const anch={ra:ancs[0].p,rv:ancs[1].p,la:ancs[2].p,lv:ancs[3].p};
  d.heart.userData.resolve=pt=>{const l=g.worldToLocal(pt.clone());let best='lv',bd=1e9;for(const k in anch){const a=anch[k],q=(l.x-a[0])**2+(l.y-a[1])**2+(l.z-a[2])**2;if(q<bd){bd=q;best=k;}}return best;};
  const art=0xc4423f,vei=0x4d5cab,rl=(id,key,hex,mo,p)=>mk(id,new THREE.Mesh(realG(key,hex,p||{s:2.5,v:.08}),bio(hex,mo||{roughness:.32,clearcoat:.7})));
  ['aorta_asc','aorta_arch','aorta_desc','brachio','carotid_r','carotid_l'].forEach(k=>rl('aorta',k,art));
  ['svc','ivc'].forEach(k=>rl('vena',k,vei));
  ['cor_rca','cor_lad','cor_cx','cor_lca','cor_marg','cor_pda'].forEach(k=>rl('lv',k,0xa82424));
  ['cv_great','cv_middle','cor_sinus'].forEach(k=>rl('ra',k,0x4a58a8));
  const lungMat=()=>bio(0xd48e98,{roughness:.5,transparent:true,opacity:.3,depthWrite:false});
  ['lung_ru','lung_rm','lung_rl','lung_lu','lung_ll'].forEach(k=>mk('lungs',new THREE.Mesh(realG(k,0xd48e98,{s:4,v:.1}),lungMat()),true));
  rl('pulmart','pulm_artery',vei,{roughness:.35,clearcoat:.6,transparent:true,opacity:.92});
  rl('pulmvein','pulm_vein',art,{roughness:.35,clearcoat:.6,transparent:true,opacity:.92});
  /* flow paths: real centre-lines + short connectors */
  const AO=BP3D_CL.aorta.p,IV=BP3D_CL.ivc.p,SV=BP3D_CL.svc.p;
  let ktop=0;AO.forEach((p,i)=>{if(p[1]>AO[ktop][1])ktop=i;});
  const SEGS=[['lv2ao',[[.5,2.4,.15],[.25,2.75,.2],AO[0]],1,1],['aorta',AO,1,1],['aoArch',AO.slice(0,ktop+1),1,1],
   ['headArt',[AO[ktop],[.1,4.5,.05],[.08,5.2,0],[.06,5.8,.1]],1,1],['capHead',[[.06,5.8,.1],[.35,6.2,.1],[0,6.6,.2],[-.35,6.2,.1],[-.08,5.8,.05]],1,0],['headVein',[[-.08,5.8,.05],[-.15,5.2,0],[-.17,4.4,.05],SV[0]],0,0],
   ['svcReal',SV,0,0],['svc2ra',[SV[SV.length-1],[-.2,3.1,.05],[-.25,3.0,0]],0,0],
   ['lowArt',[AO[AO.length-1],[.2,-1.6,.2],[.35,-2.4,.2],[.5,-3.0,.2]],1,1],['capLow',[[.5,-3.0,.2],[.2,-3.4,.25],[-.2,-3.4,.25],[-.5,-3.0,.2]],1,0],['lowVein',[[-.5,-3.0,.2],[-.35,-2.4,.18],[-.2,-1.6,.15],IV[0]],0,0],
   ['ivc',IV,0,0],['ivc2ra',[IV[IV.length-1],[-.22,2.6,.1],[-.25,3.0,0]],0,0],
   ['ra2rv',[[-.25,3.0,0],[0,2.7,.4],[.25,2.45,.65]],0,0],['rv2pa',[[.25,2.45,.65],[.22,3.0,.5],[.2,3.4,.2]],0,0],
   ['paR',[[.2,3.4,.2],[-.4,3.3,-.05],[-1.0,2.9,-.2],[-1.4,2.4,-.3]],0,0],['capR',[[-1.4,2.4,-.3],[-1.55,1.8,-.4],[-1.3,1.4,-.5],[-1.0,1.7,-.4]],0,1],['pvR',[[-1.0,1.7,-.4],[-.7,2.3,-.3],[-.1,2.8,-.25],[.6,3.05,-.3]],1,1],
   ['paL',[[.2,3.4,.2],[.6,3.3,-.05],[1.1,2.9,-.1],[1.45,2.5,-.1]],0,0],['capL',[[1.45,2.5,-.1],[1.6,1.9,-.25],[1.4,1.5,-.35],[1.1,1.8,-.25]],0,1],['pvL',[[1.1,1.8,-.25],[.95,2.3,-.2],[.8,2.8,-.25],[.6,3.05,-.3]],1,1],
   ['la2lv',[[.6,3.05,-.3],[.65,2.7,-.05],[.5,2.4,.15]],1,1]];
  SEGS.forEach(s=>segdef(s[0],s[1],s[2],s[3]));
  const thin=(n,r,hex)=>lm(g,T,n==='capLow'||n==='capHead'?'capillary':(hex===art?'aorta':'vena'),SEG[n].c,{radius:r,radial:10,color:hex},bio(hex,{roughness:.35,clearcoat:.6}));
  thin('lowArt',.05,art);thin('lowVein',.06,vei);thin('headArt',.045,art);thin('headVein',.05,vei);
  ['capLow','capHead'].forEach(n=>{for(let k=-1;k<=1;k++){const pts=SEG[n].c.getPoints(14).map(p=>[p.x+k*.06,p.y,p.z+k*.05]);put(g,T,'capillary',tube(cv(pts),.026,bioP(0xc0508f,{roughness:.3}),40,6));}});
  d.loops=[mkLoop(['lv2ao','aorta','lowArt','capLow','lowVein','ivc','ivc2ra','ra2rv','rv2pa','paR','capR','pvR','la2lv']),mkLoop(['lv2ao','aorta','lowArt','capLow','lowVein','ivc','ivc2ra','ra2rv','rv2pa','paL','capL','pvL','la2lv']),
           mkLoop(['lv2ao','aoArch','headArt','capHead','headVein','svcReal','svc2ra','ra2rv','rv2pa','paR','capR','pvR','la2lv']),mkLoop(['lv2ao','aoArch','headArt','capHead','headVein','svcReal','svc2ra','ra2rv','rv2pa','paL','capL','pvL','la2lv'])];
  d.N=200;d.dots=new Dots(d.N,.085,g,true);d.pt=[];for(let i=0;i<d.N;i++)d.pt.push({l:i%4,u:Math.random(),o:V((Math.random()-.5)*.06,(Math.random()-.5)*.06,(Math.random()-.5)*.06)});
  d.ph=0;d.bpm=72;
 },
 reset(){this.ph=0;},
 update(dt,raw){
  this.ph=(this.ph+dt*this.bpm/60)%1;const ph=this.ph;
  const at=bump(ph,0,.14),ve=bump(ph,.14,.42);
  this.heart.scale.setScalar(1-.045*ve-.025*at);
  const boost=.45+1.3*bump(ph,.14,.5);
  for(let i=0;i<this.N;i++){const p=this.pt[i],L=this.loops[p.l];p.u=(p.u+dt*3.0*(this.bpm/72)*boost/L.tot)%1;
   const ox=sampleLoop(L,p.u,_tp);this.dots.set(i,_tp.x+p.o.x,_tp.y+p.o.y,_tp.z+p.o.z,[lerp(BLU[0],RED[0],ox),lerp(BLU[1],RED[1],ox),lerp(BLU[2],RED[2],ox)],1);}
  this.dots.commit();
  if(this.ecg&&this.ecgCtx)this.drawEcg();
  if(this.bpmEl)this.bpmEl.textContent=this.bpm+' '+L3(UI.perMin);
 },
 drawEcg(){const c=this.ecg,x=this.ecgCtx,W=c.width,H=c.height;x.clearRect(0,0,W,H);x.strokeStyle='#ef4444';x.lineWidth=2;x.beginPath();
  for(let px=0;px<W;px++){const back=(W-px)/W*2.6;const phv=((this.ph-back*this.bpm/60)%1+1)%1;const v=-(.9*bump(phv,.05,.12)*.35+(phv>.17&&phv<.19?-.25:0)+(phv>=.19&&phv<.22?1.4*Math.sin((phv-.19)/.03*Math.PI):0)+(phv>=.22&&phv<.25?-.35:0)+.4*bump(phv,.34,.46));
   const y=H*.6+v*H*.32;px?x.lineTo(px,y):x.moveTo(px,y);}x.stroke();},
 controls(box,d){
  const lab=el('div','row');lab.innerHTML='<span>'+L3(UI.bpm)+'</span>';d.bpmEl=el('b','','');lab.appendChild(d.bpmEl);box.appendChild(lab);
  const sl=uiSlider('',40,190,1,d.bpm,v=>d.bpm=v,()=>'');sl.querySelector('span').remove();sl.querySelector('b').remove();box.appendChild(sl);d.bpmSl=sl.sl;
  const r=uiRow();r.appendChild(uiBtn(L3(UI.restBtn),()=>{d.bpm=62;d.bpmSl.value=62;}));r.appendChild(uiBtn('🏃 '+L3(UI.exercise),()=>{d.bpm=150;d.bpmSl.value=150;}));box.appendChild(r);
  d.ecg=el('canvas','ecg');d.ecg.width=300;d.ecg.height=56;d.ecgCtx=d.ecg.getContext('2d');box.appendChild(d.ecg);
  commonControls(box);
  const lg=el('div','legend');lg.innerHTML='<i style="background:#e11d2e"></i>'+({tr:'Oksijence zengin kan',ar:'دم غني بالأكسجين',en:'Oxygen-rich blood'}[ST.lang])+'<br><i style="background:#2f5de0"></i>'+({tr:'Oksijence fakir kan',ar:'دم قليل الأكسجين',en:'Oxygen-poor blood'}[ST.lang]);box.appendChild(lg);
 }
});

/* ===== circulatory close-up: blood ===== */
const BG={A:['A','AB'],B:['B','AB'],AB:['AB'],'0':['0','A','B','AB']};
defView('cir_d',{
 scale:.62,pos:[4.2,2.3,.3],body:false,pedestal:[4.2,.3],pedScale:2.6,cam:{p:[3.0,16,12],t:[3.4,1.9,.3]},
 title:S3('Kan: damar içinde','الدم داخل الوعاء','Blood inside a vessel'),
 organs:[['rbc',()=>cirD.rbcPos],['wbc',()=>cirD.wbcPos],['platelet',()=>cirD.pltPos],['plasma',[5.5,1.6,.5]]],
 build(g,T,d){
  window.cirD=d;
  const v=new THREE.Mesh(new THREE.CylinderGeometry(1.7,1.7,17,56,1,true),bioP(0xffd27a,{transparent:true,opacity:.16,depthWrite:false,side:THREE.DoubleSide,roughness:.1,clearcoat:1}));v.rotation.z=Math.PI/2;g.add(v);T('plasma',v,true);
  const prof=[];[[0,.2],[.3,.34],[.55,.46],[.75,.5],[.9,.4],[1,.2],[1.02,0]].forEach(p=>prof.push(new THREE.Vector2(p[0],p[1])));[[1,-.2],[.9,-.4],[.75,-.5],[.55,-.46],[.3,-.34],[0,-.2]].forEach(p=>prof.push(new THREE.Vector2(p[0],p[1])));
  d.nR=90;d.rbc=new THREE.InstancedMesh(new THREE.LatheGeometry(prof,32),bioP(0xc0262d,{roughness:.32,clearcoat:.8}),d.nR);d.rbc.scale.setScalar(.42);g.add(d.rbc);T('rbc',d.rbc);
  d.rd=[];for(let i=0;i<d.nR;i++){const a=Math.random()*6.28,r=Math.sqrt(Math.random())*1.15;d.rd.push({x:(Math.random()-.5)*16,y:Math.cos(a)*r,z:Math.sin(a)*r,r:r,rx:Math.random()*6,ry:Math.random()*6,s:.8+Math.random()*.3});}
  d.nW=6;d.wbc=new THREE.InstancedMesh(blobG(1,1,1,{w:44,h:34,color:0xf1eefc,bump:.1,bf:4,paint:{s:5,v:.06}}),bio(0xf1eefc,{roughness:.4,transparent:true,opacity:.92}),d.nW);d.wbc.scale.setScalar(.2);g.add(d.wbc);T('wbc',d.wbc);
  d.wn=new THREE.InstancedMesh(blobG(1,1,1,{w:24,h:18,color:0x7c4dff,bump:.12,bf:3}),bio(0x7c4dff,{roughness:.5}),d.nW*2);g.add(d.wn);
  d.wd=[];for(let i=0;i<d.nW;i++){const a=Math.random()*6.28;d.wd.push({x:(Math.random()-.5)*16,y:Math.cos(a)*.9,z:Math.sin(a)*.9});}
  d.nP=40;d.plt=new THREE.InstancedMesh(blobG(1,1,1,{w:16,h:12,color:0xf6c453,bump:.2,bf:2}),bio(0xf6c453,{roughness:.4}),d.nP);g.add(d.plt);T('platelet',d.plt);
  d.pd=[];for(let i=0;i<d.nP;i++){const a=Math.random()*6.28,r=Math.sqrt(Math.random())*1.4;d.pd.push({x:(Math.random()-.5)*16,y:Math.cos(a)*r,z:Math.sin(a)*r,r:r});}
  d.o=new THREE.Object3D();d.rbcPos=[0,0,0];d.wbcPos=[0,0,0];d.pltPos=[0,0,0];
 },
 update(dt,raw,time){
  const o=this.o,f=(r)=>(1-(r/1.8)*(r/1.8))*1.5+.25;
  this.rd.forEach((p,i)=>{p.x+=dt*f(p.r);if(p.x>8)p.x-=16;p.rx+=dt*.8;p.ry+=dt*.5;o.position.set(p.x/.42,p.y/.42,p.z/.42);o.rotation.set(p.rx,p.ry,0);o.scale.setScalar(p.s);o.updateMatrix();this.rbc.setMatrixAt(i,o.matrix);
   if(i===0)this.rbcPos=[p.x,p.y+.8,p.z];});this.rbc.instanceMatrix.needsUpdate=true;
  this.wd.forEach((p,i)=>{p.x+=dt*.5;if(p.x>8)p.x-=16;o.rotation.set(0,0,0);o.position.set(p.x/.2,p.y/.2,p.z/.2);o.scale.setScalar(1);o.updateMatrix();this.wbc.setMatrixAt(i,o.matrix);
   o.position.set(p.x+.05,p.y+.02,p.z+.04);o.scale.setScalar(.13);o.updateMatrix();this.wn.setMatrixAt(i*2,o.matrix);o.position.set(p.x-.08,p.y-.04,p.z-.02);o.updateMatrix();this.wn.setMatrixAt(i*2+1,o.matrix);if(i===0)this.wbcPos=[p.x,p.y+.7,p.z];});
  this.wbc.instanceMatrix.needsUpdate=true;this.wn.instanceMatrix.needsUpdate=true;
  this.pd.forEach((p,i)=>{p.x+=dt*f(p.r)*.9;if(p.x>8)p.x-=16;o.rotation.set(time*.5+i,0,0);o.position.set(p.x,p.y,p.z);o.scale.set(.16,.07,.16);o.updateMatrix();this.plt.setMatrixAt(i,o.matrix);if(i===0)this.pltPos=[p.x,p.y+.5,p.z];});this.plt.instanceMatrix.needsUpdate=true;
 },
 status:false,
 controls(box,d){
  commonControls(box);
  box.appendChild(el('h3','',L3(UI.donor)));
  const row=uiRow(),out=el('p','mut','');
  const show=g=>{out.innerHTML='<b>'+g+'</b> → '+BG[g].join(', ')+' <span class="mut">(ABO)</span>';row.querySelectorAll('button').forEach(b=>b.classList.toggle('on',b.dataset.g===g));};
  ['A','B','AB','0'].forEach(g=>{const b=uiBtn(g,()=>{show(g);sfx.tap();});b.dataset.g=g;row.appendChild(b);});
  box.appendChild(row);box.appendChild(out);out.innerHTML='<span class="mut">'+L3(UI.canGive)+'…</span>';
 }
});

/* ========== RESPIRATORY ========== */
function growTree(grp,mat,start,dir,len,rad,depth,radii,leaves){
 const end=start.clone().addScaledVector(dir,len);
 if((end.x/radii.x)**2+(end.y/radii.y)**2+(end.z/radii.z)**2>1){leaves.push(start.clone());return;}
 const mid=start.clone().lerp(end,.5).add(V((Math.random()-.5)*.05,0,(Math.random()-.5)*.05));
 grp.add(tube(cv([[start.x,start.y,start.z],[mid.x,mid.y,mid.z],[end.x,end.y,end.z]]),Math.max(.016,rad),mat,6,6));
 if(depth<=0||len<.14){leaves.push(end);return;}
 [-1,1].forEach(s=>{const nd=dir.clone().applyAxisAngle(depth%2?V(0,0,1):V(1,0,0),s*.62).add(V(0,-.14,0)).normalize();growTree(grp,mat,end,nd,len*.78,rad*.74,depth-1,radii,leaves);});
}
defView('res',{
 scale:.8,pos:[4.2,3.0,.2],body:true,pedScale:1.75,cam:{p:[2.6,18.5,11.5],t:[2.6,2.7,.3]},
 title:S3('Solunum sistemi','الجهاز التنفّسي','Respiratory system'),
 organs:[['nose',[0,6.45,1]],['rpharynx',[.5,5.6,.3]],['larynx',[.45,5.0,.2]],['trachea',[.45,4.2,.3]],['bronchi',[-.6,3.4,.5]],['rlungs',[-1.45,2.1,.95]],['alveoli',[1.2,1.9,.6]],['diaphragm',[1.5,.4,1]],['ribs',[1.65,3.0,.75]]],
 build(g,T,d){
  const mk=(id,m,sh)=>{g.add(m);T(id,m,sh);return m;};
  mesh(g,T,'nose',blobG(.24,.3,.32,{w:36,h:28,shape:(x,y,z,o)=>{const k=1-.4*ss(-1,.6,y);o[0]=x*k;o[1]=y;o[2]=z*(1+.3*ss(-.2,1,-y));},color:0xf0b0a0,bump:.03}),bio(0xf0b0a0,{roughness:.4}),[0,6.35,.9]);
  mesh(g,T,'nose',blobG(.35,.28,.3,{w:36,h:28,color:0xe9998a,bump:.04}),wet(0xe9998a,.8),[0,6.35,.5]);
  const E=BP3D_CL.esophagus.p;
  lm(g,T,'rpharynx',cv([[0,6.1,.25],[0,5.6,.05],[E[0][0],E[0][1]+.05,E[0][2]]]),{radius:.2,color:0xe08a9b},wet(0xe08a9b,.8));
  mesh(g,T,'larynx',blobG(.25,.22,.22,{w:36,h:28,shape:(x,y,z,o)=>{o[0]=x*(1-.4*ss(0,1,z));o[1]=y;o[2]=z;},color:0xd6e2ee,bump:.02}),bio(0xd6e2ee,{roughness:.2,clearcoat:1}),[0,5.08,-.02]);
  mk('trachea',new THREE.Mesh(realG('trachea',0xd3dbe4,{s:4,v:.04}),bio(0xd3dbe4,{roughness:.22,clearcoat:1,sheen:0})));
  mk('bronchi',new THREE.Mesh(realG('bronchus',0xcfdff0,{s:3,v:.04}),bio(0xcfdff0,{roughness:.25,clearcoat:.9,sheen:0})));
  /* lungs: lobes grouped around a pivot so they can breathe */
  const AN=BP3D_AN,pv={r:V(-.7,2.6,0),l:V(.85,2.6,0)};d.lung=[];d.lungMats=[];d.xray=false;
  const lobes={r:['lung_ru','lung_rm','lung_rl'],l:['lung_lu','lung_ll']},im=[],ob=new THREE.Object3D();
  ['r','l'].forEach(s=>{
   const grp=new THREE.Group();grp.position.copy(pv[s]);g.add(grp);
   const lmat=bio(0xd98f98,{roughness:.48,clearcoat:.4,clearcoatRoughness:.35,sheen:.5,sheenColor:new THREE.Color(0xffd0d8),transparent:true,opacity:1});d.lungMats.push(lmat);
   lobes[s].forEach(k=>{const gg=realG(k,0xd98f98,{s:5,v:.16,vein:0x5e4452,va:.5,vs:5});
    const pp=gg.attributes.position,c=V(AN[k].c[0],AN[k].c[1],AN[k].c[2]);
    for(let i=0;i<14;i++){const j=Math.floor(Math.random()*pp.count),p=V(pp.getX(j),pp.getY(j),pp.getZ(j));p.lerp(c,.1);for(let q=0;q<3;q++){ob.position.set(p.x-pv[s].x+(Math.random()-.5)*.12,p.y-pv[s].y+(Math.random()-.5)*.12,p.z-pv[s].z+(Math.random()-.5)*.12);ob.scale.setScalar(.05);ob.updateMatrix();im.push([s,ob.matrix.clone()]);}}
    gg.translate(-pv[s].x,-pv[s].y,-pv[s].z);const m=new THREE.Mesh(gg,lmat);grp.add(m);T('rlungs',m,true);});
   d.lung.push({grp,s});
  });
  const alvMat=bioP(0xf08aa0,{roughness:.4,clearcoat:.5});
  d.lung.forEach(L=>{const mine=im.filter(x=>x[0]===L.s),ins=new THREE.InstancedMesh(new THREE.SphereGeometry(1,12,10),alvMat,mine.length);mine.forEach((x,i)=>ins.setMatrixAt(i,x[1]));L.grp.add(ins);T('alveoli',ins);if(L.s==='l'&&mine.length)d.leafW=V().setFromMatrixPosition(mine[3][1]).add(pv.l);});
  d.organs[6][1]=()=>d.leafW?d.leafW.toArray():[1.2,1.9,.6];
  /* diaphragm */
  d.dia=centerGeo(mk('diaphragm',new THREE.Mesh(realG('diaphragm',0x9c3d36,{s:3,v:.14}),bio(0x9c3d36,{roughness:.45,clearcoat:.5,side:THREE.DoubleSide}))));d.dia0=d.dia.position.clone();
  /* rib cage: real ribs + costal cartilage + sternum, merged into one mesh */
  const rp=V(0,2.6,.1),parts=[];
  for(let i=1;i<=12;i++)['r','l'].forEach(s=>parts.push(realG('rib_'+s+i,0xd8c9a2,{s:3,v:.06})));
  for(let i=1;i<=7;i++)['r','l'].forEach(s=>parts.push(realG('cart_'+s+i,0xe6dcc0,{s:3,v:.05})));
  parts.push(realG('sternum',0xe6dcc0,{s:3,v:.05}));
  const rg=mergeG(parts);rg.translate(-rp.x,-rp.y,-rp.z);
  d.ribs=new THREE.Group();d.ribs.position.copy(rp);g.add(d.ribs);d.rib0=rp.clone();
  const rm=new THREE.Mesh(rg,bio(0xd8c9a2,{roughness:.5,clearcoat:.25,sheen:0,transparent:true,opacity:.6,depthWrite:false}));d.ribs.add(rm);T('ribs',rm,true);
  const CT=BP3D_CL.trachea.p,pre=[[0,6.6,1.0],[0,6.3,.5],[0,5.6,.05]];
  d.air=[cv(pre.concat(CT,[[-.4,3.4,-.25],[-.8,3.0,-.3],[-1.0,2.4,-.3]])),cv(pre.concat(CT,[[.4,3.4,-.25],[.8,3.0,-.3],[1.0,2.4,-.3]]))];
  d.N=70;d.dots=new Dots(d.N,.09,g,true);d.ap=[];for(let i=0;i<d.N;i++)d.ap.push({u:Math.random(),side:i%2});
  d.ph=0;d.rate=14;d.amp=1;d.deep=0;d.v=0;
 },
 reset(){this.ph=0;this.setXray(false);},
 setXray(on){this.xray=on;if(!this.lungMats)return;this.lungMats.forEach(m=>{m.opacity=on?.2:1;m.depthWrite=!on;m.needsUpdate=true;});if(this.xrayBtn)this.xrayBtn.classList.toggle('on',on);},
 onSelect(id){if(id==='alveoli'||id==='bronchi')this.setXray(true);},
 update(dt,raw){
  this.ph=(this.ph+dt*this.rate/60)%1;
  if(this.deep>0)this.deep-=raw;const ampT=this.deep>0?1.8:1;this.amp=lerp(this.amp,ampT,.05);
  const v=(.5-.5*Math.cos(this.ph*Math.PI*2)),flow=Math.sin(this.ph*Math.PI*2);this.v=v;const a=this.amp;
  this.lung.forEach(L=>{const sx=1+.06*a*v,sy=1+.08*a*v;L.grp.scale.set(sx,sy,sx);});
  this.dia.scale.y=1-.16*v*Math.min(1.3,a);this.dia.position.y=this.dia0.y-.28*v*a;
  this.ribs.scale.set(1+.045*a*v,1,1+.04*a*v);this.ribs.position.y=this.rib0.y+.06*a*v;
  for(let i=0;i<this.N;i++){const p=this.ap[i];p.u+=flow*dt*.2*(this.rate/14);if(p.u>1)p.u-=1;if(p.u<0)p.u+=1;
   const c=this.air[p.side];c.getPointAt(clamp(p.u,0,1),_tp);const inh=flow>0;const col=inh?rgb(0x0ea5e9):rgb(0x6b7280);this.dots.set(i,_tp.x+Math.sin(i*7)*.04,_tp.y,_tp.z+Math.cos(i*5)*.04,col,Math.min(1,Math.abs(flow)*2.2));}
  this.dots.commit();
  if(this.statusEl){const st=flow>0?0:1;if(st!==this.shown){this.shown=st;this.statusEl.innerHTML=st?({tr:'<b>Nefes verme</b> — diyafram gevşeyip yukarı çıkar, kaburgalar iner, hacim azalır, basınç artar ve hava dışarı çıkar.',ar:'<b>الزفير</b> — يرتخي الحجاب الحاجز ويرتفع، وتنزل الأضلاع، يقلّ الحجم فيزداد الضغط ويخرج الهواء.',en:'<b>Exhale</b> — diaphragm relaxes and rises, ribs lower, volume falls, pressure rises and air flows out.'}[ST.lang]):({tr:'<b>Nefes alma</b> — diyafram kasılıp düzleşir, kaburgalar yukarı-öne gider, hacim artar, basınç düşer ve hava içeri girer.',ar:'<b>الشهيق</b> — ينقبض الحجاب الحاجز وينبسط، وترتفع الأضلاع للأمام، يزداد الحجم فينخفض الضغط ويدخل الهواء.',en:'<b>Inhale</b> — diaphragm contracts and flattens, ribs move up and out, volume rises, pressure drops and air flows in.'}[ST.lang]);}}
  this.auto=flow>0?'diaphragm':null;
 },
 status:true,
 controls(box,d){
  box.appendChild(uiSlider(L3(UI.breathRate),6,40,1,d.rate,v=>d.rate=v,v=>v+L3(UI.perMin)));
  const r=uiRow();r.appendChild(uiBtn('💨 '+L3(UI.deep),()=>{d.deep=6;}));
  d.xrayBtn=uiBtn('◎ '+({tr:'İç görünüm',ar:'منظر داخلي',en:'X-ray'}[ST.lang]),()=>d.setXray(!d.xray));d.xrayBtn.classList.toggle('on',d.xray);r.appendChild(d.xrayBtn);box.appendChild(r);
  commonControls(box);
  const lg=el('div','legend');lg.innerHTML='<i style="background:#0ea5e9"></i>'+({tr:'Soluk alınan hava (O₂)',ar:'هواء الشهيق (O₂)',en:'Inhaled air (O₂)'}[ST.lang])+'<br><i style="background:#6b7280"></i>'+({tr:'Verilen hava (CO₂)',ar:'هواء الزفير (CO₂)',en:'Exhaled air (CO₂)'}[ST.lang]);box.appendChild(lg);
  d.shown=-9;
 }
});

/* ===== respiratory close-up: alveoli ===== */
function knotCurve(R,pts){const a=[];for(let i=0;i<pts;i++){const u=i/pts*Math.PI*2*2,r=R*(2+Math.cos(1.5*u))*.5;a.push([r*Math.cos(u),r*Math.sin(u),R*Math.sin(1.5*u)*.5]);}return a;}
defView('res_d',{
 scale:.68,pos:[4.4,2.6,.3],body:false,pedestal:[4.4,.4],pedScale:2.6,cam:{p:[3.0,16,12],t:[3.4,2.3,.3]},
 title:S3('Alveoller ve gaz alışverişi','الأسناخ وتبادل الغازات','Alveoli and gas exchange'),
 organs:[['bronchiole',[-4.2,3.4,.5]],['alv',[1,1.8,1.1]],['acap',[2.9,-.2,1.1]]],
 build(g,T,d){
  lm(g,T,'bronchiole',cv([[-6,4.2,0],[-4.2,2.8,0],[-2.6,1,0],[-1.6,.2,0]]),{radius:.28,radial:22,dens:30,color:0xc9dcf0,wob:(u)=>1+.05*Math.cos(u*40)},bio(0xc9dcf0,{roughness:.25,clearcoat:1,sheen:0,transparent:true,opacity:.85}));
  const node=V(-1.6,.2,0);d.sacs=[[-.6,1.6,.2],[1.0,1.5,-.2],[2.3,.2,.2],[1.0,-1.4,.3],[-.6,-1.3,-.2],[.5,.1,0]].map(p=>V(p[0],p[1],p[2]));d.knots=[];
  d.sacs.forEach((s,i)=>{
   mesh(g,T,'alv',blobG(.95,.95,.95,{w:64,h:48,color:0xf7a8bb,bump:.07,bf:2.4,paint:{s:3,v:.08}}),bio(0xf7a8bb,{roughness:.2,clearcoat:1,transparent:true,opacity:.42,depthWrite:false}),[s.x,s.y,s.z],true);
   lm(g,T,'bronchiole',cv([[node.x,node.y,node.z],[(node.x+s.x)/2,(node.y+s.y)/2,(node.z+s.z)/2],[s.x,s.y,s.z]]),{radius:.1,radial:12,color:0xc9dcf0},bio(0xc9dcf0,{roughness:.25,clearcoat:.8}));
   const kp=knotCurve(1.02,70).map(p=>[p[0]+s.x,p[1]+s.y,p[2]+s.z]);const kc=cv(kp,true);d.knots.push(kc);
   put(g,T,'acap',tube(kc,.065,bioP(0xd9534f,{roughness:.3,clearcoat:.8}),140,8));});
  d.dots=new Dots(220,.2,g);d.gp=[];
  for(let i=0;i<220;i++)d.gp.push({s:i%6,k:i%4,ph:Math.random()});
 },
 update(dt){
  this.gp.forEach((p,i)=>{p.ph=(p.ph+dt*(p.k===3?.09:.14))%1;const s=this.sacs[p.s],ph=p.ph;
   if(p.k===0){const a=i*2.4;const dir=V(Math.cos(a),Math.sin(a*1.3),Math.sin(a*.7)).normalize();const r=lerp(.05,1.02,sm(ph));this.dots.set(i,s.x+dir.x*r,s.y+dir.y*r,s.z+dir.z*r,rgb(0x0ea5e9),ph>.92?1-(ph-.92)*12:1);}
   else if(p.k===1){const a=i*1.7;const dir=V(Math.cos(a),Math.sin(a*1.1),Math.sin(a*.9)).normalize();const r=lerp(1.04,.1,sm(ph));this.dots.set(i,s.x+dir.x*r,s.y+dir.y*r,s.z+dir.z*r,rgb(0x6b7280),ph<.06?ph*16:1);}
   else if(p.k===2){const kc=this.knots[p.s];kc.getPointAt(ph,_tp);const o=ph<.5?ph*2:2-ph*2;this.dots.set(i,_tp.x,_tp.y,_tp.z,[lerp(BLU[0],RED[0],o),lerp(BLU[1],RED[1],o),lerp(BLU[2],RED[2],o)],1,.3);}
   else this.dots.hide(i);});
  this.dots.commit();
 },
 status:false,
 controls(box){commonControls(box);const lg=el('div','legend');lg.innerHTML='<i style="background:#0ea5e9"></i>O₂ → '+({tr:'kana',ar:'الدم',en:'blood'}[ST.lang])+'<br><i style="background:#6b7280"></i>CO₂ → '+({tr:'alveole',ar:'السنخ',en:'alveolus'}[ST.lang])+'<br><i style="background:#e11d2e"></i>'+({tr:'Alyuvarlar',ar:'الكريات الحمراء',en:'Red cells'}[ST.lang]);box.appendChild(lg);}
});

/* ========== EXCRETORY ========== */
function kidneyG(){
 return blobG(.5,.85,.42,{w:96,h:72,shape:(x,y,z,o)=>{const m=Math.max(0,-x);o[0]=x+.55*Math.exp(-(y*y)/.06)*m;o[1]=y;o[2]=z*(1-.15*Math.exp(-(y*y)/.1)*m);},
  bump:.025,bf:3,color:0x8f3028,paint:{s:2,v:.1,vein:0x4a120e,va:.18,vs:3}});
}
defView('exc',{
 scale:.8,pos:[4.2,3.0,.2],body:true,pedScale:1.75,cam:{p:[2.6,18.5,11.5],t:[2.6,2.7,.3]},
 title:S3('Boşaltım sistemi','الجهاز الإخراجي','Excretory system'),
 organs:[['kidney',[1.1,.6,.2]],['eaorta',[.25,2.2,.4]],['evena',[-.3,1.9,.3]],['rartery',[.5,.55,-.1]],['rvein',[-.45,.3,-.2]],['ureter',[-.5,-1.2,-.3]],['bladder',[0,-2.8,.45]],['urethra',[0,-3.3,.2]]],
 build(g,T,d){
  const rl=(id,key,hex,mo,p,sh)=>mesh(g,T,id,realG(key,hex,p||{s:2.5,v:.08}),bio(hex,mo||{roughness:.32,clearcoat:.7}),null,sh);
  ['kidney_r','kidney_l'].forEach(k=>rl('kidney',k,0x6e231e,{roughness:.28,clearcoat:.95,clearcoatRoughness:.15},{s:2.2,v:.1,vein:0x4a120e,va:.18,vs:3}));
  rl('eaorta','aorta_desc',0xc4423f);rl('evena','ivc',0x4d5cab);
  ['renal_art_r','renal_art_l'].forEach(k=>rl('rartery',k,0xc4423f));['renal_vein_r','renal_vein_l'].forEach(k=>rl('rvein',k,0x4d5cab));
  ['ureter_r','ureter_l'].forEach(k=>rl('ureter',k,0xd9b66a,{roughness:.35,clearcoat:.6}));
  rl('urethra','urethra',0xd9b66a,{roughness:.35,clearcoat:.6});
  const bb=BP3D_AN.bladder,bc=bb.c,br=[(bb.mx[0]-bb.mn[0])/2,(bb.mx[1]-bb.mn[1])/2,(bb.mx[2]-bb.mn[2])/2];
  d.bl=centerGeo(mesh(g,T,'bladder',realG('bladder',0xd08e86,{s:3,v:.08,vein:0xb44f4f,va:.4,vs:3.5}),bio(0xd08e86,{roughness:.25,clearcoat:1,transparent:true,opacity:.5,depthWrite:false}),null,true));
  d.blc=V(bc[0],bc[1],bc[2]);d.blr=br;
  d.urine=new THREE.Mesh(new THREE.SphereGeometry(1,28,20),bioP(0xf4d24a,{roughness:.12,clearcoat:1}));g.add(d.urine);
  const AO=BP3D_CL.aorta.p.filter(p=>p[1]<2.6),IV=BP3D_CL.ivc.p,rc=BP3D_CL;
  const ra=(k,rev)=>{const p=rc[k].p.map(q=>q.slice());return cv(rev?p.reverse():p);};
  d.blood=[{c:cv(AO),ox:1},{c:cv(IV.slice().reverse()),ox:0},{c:ra('renal_art_r'),ox:1},{c:ra('renal_art_l'),ox:1},{c:ra('renal_vein_r',true),ox:0},{c:ra('renal_vein_l',true),ox:0}];
  d.ur=[cv(BP3D_CL.ureter_l.p),cv(BP3D_CL.ureter_r.p)];
  const UR=BP3D_CL.urethra.p;d.uret=cv(UR.filter(p=>p[1]>-3.55).length>2?UR.filter(p=>p[1]>-3.55):UR.slice(0,3));
  d.bd=new Dots(60,.075,g,true);d.bp=[];for(let i=0;i<60;i++)d.bp.push({k:i%6,u:Math.random()});
  d.dr=new Dots(40,.09,g,true);d.drops=[];for(let i=0;i<40;i++)d.drops.push({on:false,u:0,side:0,ur:false});
  d.fill=.2;d.void=false;d.hyd=.5;d.sp=0;d.col=new THREE.Color();
 },
 reset(){this.fill=.2;this.void=false;},
 update(dt,raw){
  for(let i=0;i<60;i++){const p=this.bp[i],b=this.blood[p.k];p.u=(p.u+dt*(p.k<2?.1:.28))%1;b.c.getPointAt(p.u,_tp);this.bd.set(i,_tp.x,_tp.y,_tp.z,b.ox?RED:BLU,1);}this.bd.commit();
  const rate=lerp(.012,.05,this.hyd);this.col.setHex(0xb8860b).lerp(new THREE.Color(0xfff2a8),this.hyd);
  if(!this.void){this.fill+=rate*dt;this.sp+=dt*lerp(1.2,5,this.hyd);while(this.sp>1){this.sp-=1;const f=this.drops.find(x=>!x.on);if(f){f.on=true;f.u=0;f.side=Math.random()<.5?0:1;f.ur=false;}}if(this.fill>=1)this.void=true;}
  else{this.fill-=.35*dt;this.sp+=dt*10;while(this.sp>1){this.sp-=1;const f=this.drops.find(x=>!x.on);if(f){f.on=true;f.u=0;f.ur=true;}}if(this.fill<=.06)this.void=false;}
  this.drops.forEach((f,i)=>{if(!f.on){this.dr.hide(i);return;}f.u+=dt*(f.ur?1.6:.45);if(f.u>=1){f.on=false;if(!f.ur)this.arr=(this.arr||0)+1;this.dr.hide(i);return;}
   if(f.ur)this.uret.getPointAt(f.u,_tp);else this.ur[f.side].getPointAt(f.u,_tp);this.dr.set(i,_tp.x,_tp.y,_tp.z,[this.col.r,this.col.g,this.col.b],1);});this.dr.commit();
  const f=clamp(this.fill,.05,1),r=this.blr;
  this.urine.scale.set(r[0]*(.45+.5*f),r[1]*(.3+.55*f),r[2]*(.45+.5*f));this.urine.position.set(this.blc.x,this.blc.y-r[1]*(.7-.7*f)+.04,this.blc.z);
  this.urine.material.color.copy(this.col);this.bl.scale.setScalar(1+.04*f*(this.void?-1:1));
  if(this.barEl){this.barEl.style.setProperty('--p',(f*100)+'%');this.barTx.textContent=Math.round(f*100)+'%';}
  this.auto=this.void?'urethra':null;
 },
 status:false,
 controls(box,d){
  box.appendChild(uiSlider(L3(UI.hydration),0,1,.05,d.hyd,v=>d.hyd=v,v=>Math.round(v*100)+'%'));
  const row=el('div','row');row.innerHTML='<span>'+L3(UI.bladderLvl)+'</span>';d.barTx=el('b','','');row.appendChild(d.barTx);box.appendChild(row);
  d.barEl=el('div','bar');d.barEl.innerHTML='<i></i>';box.appendChild(d.barEl);
  commonControls(box);
  const lg=el('div','legend');lg.innerHTML='<i style="background:#e11d2e"></i>'+({tr:'Süzülecek kan',ar:'دم سيُرشَّح',en:'Blood to be filtered'}[ST.lang])+'<br><i style="background:#2f5de0"></i>'+({tr:'Süzülmüş kan',ar:'دم مُرشَّح',en:'Filtered blood'}[ST.lang])+'<br><i style="background:#e0b200"></i>'+({tr:'İdrar',ar:'البول',en:'Urine'}[ST.lang]);box.appendChild(lg);
 }
});

/* ===== excretory close-up: nephron ===== */
defView('exc_d',{
 scale:.5,pos:[5.6,2.6,.3],body:false,pedestal:[4.6,.3],pedScale:2.8,cam:{p:[3.0,16,12],t:[3.4,1.6,.3]},
 title:S3('Nefron: kan nasıl süzülür?','النفرون: كيف يُرشَّح الدم؟','Nephron: how blood is filtered'),
 organs:[['bowman',[-3.2,3.3,.6]],['glom',[-4.8,2.3,.8]],['tubule',[-3.9,-1.2,.8]],['collect',[2.9,-3.5,.5]],['pcap',[-5.2,-1.4,.9]]],
 build(g,T,d){
  mesh(g,T,'bowman',blobG(1.05,1.05,1.05,{w:56,h:42,color:0xf2d98a,bump:.02}),bio(0xf2d98a,{roughness:.15,clearcoat:1,transparent:true,opacity:.3,depthWrite:false}),[-3.2,2,0],true);
  const gl=mesh(g,T,'glom',new THREE.TubeGeometry(cv(knotCurve(.46,60).map(p=>[p[0]-3.2,p[1]+2,p[2]]),true),160,.07,10,true),bioP(0xd62828,{roughness:.28,clearcoat:.9}));
  lm(g,T,'glom',cv([[-6,3.6,0],[-4.6,2.9,0],[-3.7,2.4,0],[-3.3,2.1,0]]),{radius:.13,radial:14,color:0xe14b4b},bio(0xe14b4b,{roughness:.3,clearcoat:.7}));
  lm(g,T,'glom',cv([[-3.0,1.4,.1],[-3.15,1.0,.5],[-3.6,.9,.8]]),{radius:.07,radial:12,color:0xe14b4b},bio(0xe14b4b,{roughness:.3}));
  const prox=[[-3.2,1.0,0],[-3.7,.5,.2],[-2.7,.2,-.2],[-3.7,-.4,.2],[-2.7,-.8,-.2],[-3.4,-1.3,0],[-3,-1.9,0]],hen=[[-3,-1.9,0],[-3,-3.2,0],[-3,-4.6,0],[-2.3,-5.2,0],[-1.6,-4.6,0],[-1.6,-3.2,0],[-1.6,-1.8,0]],dis=[[-1.6,-1.8,0],[-1.2,-1.2,.2],[-.4,-1.6,-.2],[.4,-1,.2],[1,-1.4,-.2],[1.6,-.8,0],[2.2,0,0]],col=[[2.2,2.4,0],[2.2,0,0],[2.2,-2.5,0],[2.2,-5.6,0]];
  const tm=wet(0xe9c75a,.78),rip=(u,a)=>1+.07*Math.sin(u*90+a*2);
  lm(g,T,'tubule',cv(prox),{radius:.14,radial:16,dens:34,color:0xe9c75a,wob:rip},tm);lm(g,T,'tubule',cv(hen),{radius:.12,radial:16,dens:30,color:0xe9c75a,wob:rip},tm);lm(g,T,'tubule',cv(dis),{radius:.13,radial:16,dens:30,color:0xe9c75a,wob:rip},tm);
  lm(g,T,'collect',cv(col),{radius:.24,radial:20,dens:24,color:0xe0a63a},wet(0xe0a63a,.8));
  d.path=[cv(prox),cv(hen),cv(dis),cv(col.slice(1))];d.pl=d.path.map(c=>c.getLength());d.ptot=d.pl.reduce((a,b)=>a+b,0);
  d.capc=cv([[-3.6,.9,.8],[-4.6,.4,.7],[-4.6,-1.2,.6],[-4.2,-3,.6],[-3.9,-5,.6],[-2.3,-6,.5],[-.9,-5,.6],[-.7,-3,.6],[-.9,-1.4,.6],[-.2,-.7,.7],[1.2,.3,.6]]);
  lm(g,T,'pcap',d.capc,{radius:.07,radial:12,dens:20,color:0xb35c9a},bio(0xb35c9a,{roughness:.3,clearcoat:.8}));
  d.dots=new Dots(120,.2,g);d.f=[];for(let i=0;i<60;i++)d.f.push({u:Math.random(),re:Math.random()<.7,ra:.08+Math.random()*.2,t:-1});
  d.cb=[];for(let i=0;i<30;i++)d.cb.push({u:Math.random()});
 },
 update(dt){
  const O=_tp;
  this.f.forEach((p,i)=>{
   if(p.t>=0){p.t+=dt*.8;if(p.t>=1){p.t=-1;p.u=0;p.re=Math.random()<.7;p.ra=.08+Math.random()*.2;this.dots.hide(i);return;}
     const from=this._pos(p.u0),to=this.capc.getPointAt(clamp(p.u0*.5+.1,0,1));O.lerpVectors(from,to,sm(p.t));this.dots.set(i,O.x,O.y,O.z,rgb(0x06b6d4),1-p.t*.5);return;}
   p.u+=dt*.06;if(p.re&&p.u>p.ra){p.u0=p.u;p.t=0;return;}
   if(p.u>=1){p.u=0;p.re=Math.random()<.7;p.ra=.08+Math.random()*.2;}
   const q=this._pos(p.u);this.dots.set(i,q.x,q.y,q.z,rgb(0xb7791f),1);});
  this.cb.forEach((p,i)=>{p.u=(p.u+dt*.05)%1;this.capc.getPointAt(p.u,O);const o=p.u;this.dots.set(60+i,O.x,O.y,O.z,[lerp(RED[0],BLU[0],o),lerp(RED[1],BLU[1],o),lerp(RED[2],BLU[2],o)],1,.14);});
  this.dots.commit();
 },
 _pos(u){let s=u*this.ptot,i=0;while(i<3&&s>this.pl[i]){s-=this.pl[i];i++;}return this.path[i].getPointAt(clamp(s/this.pl[i],0,1),new THREE.Vector3());},
 status:false,
 controls(box){commonControls(box);const lg=el('div','legend');lg.innerHTML='<i style="background:#b7791f"></i>'+({tr:'Süzüntü → idrar',ar:'الراشح ← البول',en:'Filtrate → urine'}[ST.lang])+'<br><i style="background:#06b6d4"></i>'+({tr:'Geri emilen madde',ar:'مواد أُعيد امتصاصها',en:'Reabsorbed substances'}[ST.lang]);box.appendChild(lg);}
});
