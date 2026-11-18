/* ===== core: helpers, scene, book, UI ===== */
const $=s=>document.querySelector(s);
const V=(x,y,z)=>new THREE.Vector3(x,y,z);
const cv=(pts,closed)=>new THREE.CatmullRomCurve3(pts.map(p=>V(p[0],p[1],p[2])),!!closed,'catmullrom',.5);
const std=(c,o)=>new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:.55,metalness:.03,envMapIntensity:.06},o||{}));
const lerp=(a,b,t)=>a+(b-a)*t, clamp=(x,a,b)=>Math.min(b,Math.max(a,x)), sm=t=>t*t*(3-2*t);
const bump=(x,a,b)=>(x>a&&x<b)?Math.sin(Math.PI*(x-a)/(b-a)):0;
const rgb=h=>{const c=new THREE.Color(h);return [c.r,c.g,c.b];};
function tube(c,r,mat,seg,rs){return new THREE.Mesh(new THREE.TubeGeometry(c,seg||Math.max(12,Math.round(c.getLength()*9)),r,rs||10,false),mat);}
function ell(sx,sy,sz,mat,p,det){const m=new THREE.Mesh(new THREE.SphereGeometry(1,det||32,det?Math.round(det*.75):24),mat);m.scale.set(sx,sy,sz);if(p)m.position.set(p[0],p[1],p[2]);return m;}
function el(tag,cls,html){const e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e;}

/* ---------- state ---------- */
const ST={lang:'tr',step:0,close:false,play:true,speed:1,labels:true,outline:true,rotate:false,sound:true,theme:'light',stars:0,
  explored:{},answered:{},mcq:{},revModel:'dig',revScore:null,revIdx:0,revDone:false,sel:null,hover:null};
try{const l=localStorage.getItem('b3d_lang');if(l&&['tr','ar','en'].includes(l))ST.lang=l;const th=localStorage.getItem('b3d_theme');if(th)ST.theme=th;}catch(e){}
ST.labels=false;
const t=k=>UI[k][ST.lang];
const L3=o=>o[ST.lang]||o.en;

/* ---------- renderer / scene ---------- */
const stage=$('#stage');
let renderer;
try{renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});}catch(e){stage.innerHTML='<p style="padding:40px">'+UI.noWebgl[ST.lang]+'</p>';throw e;}
renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.outputEncoding=THREE.sRGBEncoding;
stage.appendChild(renderer.domElement);
const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(36,1,.1,200);
renderer.toneMapping=THREE.NoToneMapping;
const pmrem=new THREE.PMREMGenerator(renderer);scene.environment=pmrem.fromScene(new THREE.RoomEnvironment(),.04).texture;
const controls=new THREE.OrbitControls(camera,renderer.domElement);
controls.enableDamping=true;controls.dampingFactor=.08;controls.minDistance=6;controls.maxDistance=44;controls.maxPolarAngle=1.42;controls.screenSpacePanning=true;
const U={k:{value:.4},scale:{value:600}}; /* shared point-sprite uniforms */

const hemi=new THREE.HemisphereLight(0xffffff,0x707680,.2);scene.add(hemi);
const sun=new THREE.DirectionalLight(0xfff4e6,.5);sun.position.set(-9,18,10);sun.castShadow=true;
sun.shadow.mapSize.set(2048,2048);const sc=sun.shadow.camera;sc.left=-16;sc.right=16;sc.top=14;sc.bottom=-14;sc.near=1;sc.far=60;sun.shadow.bias=-.0004;sun.shadow.radius=3;
scene.add(sun);
const fill=new THREE.DirectionalLight(0xbcd4ff,.25);fill.position.set(10,6,-6);scene.add(fill);

/* desk + book */
const desk=new THREE.Mesh(new THREE.PlaneGeometry(160,160),std(0x8fae9f,{roughness:.95}));desk.rotation.x=-Math.PI/2;desk.position.y=-.62;desk.receiveShadow=true;scene.add(desk);
const PW=8,PH=10.6;
const book=new THREE.Group();scene.add(book);
const cover=new THREE.Mesh(new THREE.BoxGeometry(PW*2+.6,.34,PH+.6),std(0x2f6b58,{roughness:.8}));cover.position.y=-.45;cover.receiveShadow=true;cover.castShadow=true;book.add(cover);
const edge=new THREE.Mesh(new THREE.BoxGeometry(PW*2+.1,.3,PH+.1),std(0xe3c06a,{roughness:.9}));edge.position.y=-.47;book.add(edge);
const pageTex=[],pageMat=[],pageCv=[];
[-1,1].forEach((side,i)=>{
  const g=new THREE.PlaneGeometry(PW,PH,48,1);g.rotateX(-Math.PI/2);
  const p=g.attributes.position;
  for(let k=0;k<p.count;k++){const d=p.getX(k)+PW/2;const ds=side>0?d:PW-d;p.setY(k,-.22*Math.exp(-ds/1.3)+.012*Math.sin(ds*.5));}
  g.computeVertexNormals();
  const c=document.createElement('canvas');c.width=2048;c.height=2714;pageCv.push(c);
  const tx=new THREE.CanvasTexture(c);tx.anisotropy=renderer.capabilities.getMaxAnisotropy();tx.encoding=THREE.sRGBEncoding;pageTex.push(tx);
  const m=new THREE.MeshStandardMaterial({map:tx,roughness:.92,metalness:0,envMapIntensity:.04});pageMat.push(m);
  const mesh=new THREE.Mesh(g,m);mesh.position.set(side*(PW/2+.03),0,0);mesh.receiveShadow=true;book.add(mesh);
});
/* model root: all body-system models live here, standing on the right page */
const modelRoot=new THREE.Group();scene.add(modelRoot);
const pedestal=new THREE.Mesh(new THREE.CylinderGeometry(1.1,1.2,.08,48),std(0xf4efe2,{roughness:.9}));pedestal.position.set(4.2,.04,0);pedestal.receiveShadow=true;pedestal.castShadow=true;scene.add(pedestal);

/* ghost body (outline look) */
const ghostU={c:{value:new THREE.Color(0x4f6277)},a:{value:.62}};
const ghostMat=new THREE.ShaderMaterial({transparent:true,depthWrite:false,uniforms:ghostU,
 vertexShader:'varying vec3 vN;varying vec3 vV;void main(){vec4 mv=modelViewMatrix*vec4(position,1.);vN=normalize(normalMatrix*normal);vV=normalize(-mv.xyz);gl_Position=projectionMatrix*mv;}',
 fragmentShader:'uniform vec3 c;uniform float a;varying vec3 vN;varying vec3 vV;void main(){float f=pow(1.-abs(dot(vN,vV)),2.4);gl_FragColor=vec4(c,(.012+a*f));}'});
const ghost=new THREE.Group();
(function(){
 const prof=[[0,-3.7],[.7,-3.62],[.98,-3.1],[1,-2],[.9,-.5],[.88,.5],[.95,2],[1.05,3.5],[1.1,4.4],[.85,4.95],[.4,5.2],[.3,5.3]].map(p=>new THREE.Vector2(p[0],p[1]));
 const torso=new THREE.Mesh(new THREE.LatheGeometry(prof,56),ghostMat);torso.scale.set(2,1,1.05);ghost.add(torso);
 const neck=new THREE.Mesh(new THREE.CylinderGeometry(.38,.46,.9,28),ghostMat);neck.position.set(0,5.5,0);ghost.add(neck);
 const head=new THREE.Mesh(new THREE.SphereGeometry(1,40,30),ghostMat);head.scale.set(.78,.92,.85);head.position.set(0,6.5,.05);ghost.add(head);
 [-1,1].forEach(s=>{const a=new THREE.Mesh(new THREE.CapsuleGeometry(.4,3.4,6,18),ghostMat);a.position.set(s*2.75,2.9,0);a.rotation.z=s*.07;ghost.add(a);});
})();
modelRoot.add(ghost);

/* point sprites (shared by all views) */
class Dots{
 constructor(n,size,parent,xray){this.n=n;this.size=size;this.p=new Float32Array(n*3);this.c=new Float32Array(n*4);this.s=new Float32Array(n);
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(this.p,3));g.setAttribute('col',new THREE.BufferAttribute(this.c,4));g.setAttribute('size',new THREE.BufferAttribute(this.s,1));
  this.g=g;this.pts=new THREE.Points(g,new THREE.ShaderMaterial({transparent:true,depthWrite:false,depthTest:!xray,uniforms:{k:U.k,scale:U.scale},
   vertexShader:'attribute float size;attribute vec4 col;varying vec4 vC;uniform float k;uniform float scale;void main(){vC=col;vec4 mv=modelViewMatrix*vec4(position,1.);gl_PointSize=size*k*scale/(-mv.z);gl_Position=projectionMatrix*mv;}',
   fragmentShader:'varying vec4 vC;void main(){float r=length(gl_PointCoord-.5);if(r>.5)discard;gl_FragColor=vec4(vC.rgb,vC.a*smoothstep(.5,.38,r));}'}));
  this.pts.frustumCulled=false;this.pts.renderOrder=5;parent.add(this.pts);for(let i=0;i<n;i++)this.hide(i);}
 set(i,x,y,z,c,a,s){this.p[i*3]=x;this.p[i*3+1]=y;this.p[i*3+2]=z;this.c[i*4]=c[0];this.c[i*4+1]=c[1];this.c[i*4+2]=c[2];this.c[i*4+3]=a==null?1:a;this.s[i]=s||this.size;}
 hide(i){this.c[i*4+3]=0;this.s[i]=0;}
 commit(){this.g.attributes.position.needsUpdate=true;this.g.attributes.col.needsUpdate=true;this.g.attributes.size.needsUpdate=true;}
}
class Pool{
 constructor(n,size,parent,xray){this.d=new Dots(n,size,parent,xray);this.n=n;this.v=new Float32Array(n*3);this.pp=new Float32Array(n*3);this.l=new Float32Array(n);this.m=new Float32Array(n);this.col=[];this.i=0;}
 spawn(x,y,z,vx,vy,vz,c,life){const i=this.i++%this.n;this.pp[i*3]=x;this.pp[i*3+1]=y;this.pp[i*3+2]=z;this.v[i*3]=vx;this.v[i*3+1]=vy;this.v[i*3+2]=vz;this.col[i]=c;this.l[i]=this.m[i]=life;}
 update(dt){for(let i=0;i<this.n;i++){if(this.l[i]>0){this.l[i]-=dt;this.pp[i*3]+=this.v[i*3]*dt;this.pp[i*3+1]+=this.v[i*3+1]*dt;this.pp[i*3+2]+=this.v[i*3+2]*dt;const a=clamp(this.l[i]/this.m[i]*1.8,0,1);this.d.set(i,this.pp[i*3],this.pp[i*3+1],this.pp[i*3+2],this.col[i],a);}else this.d.hide(i);}this.d.commit();}
}

/* ---------- views registry ---------- */
const views={};
function defView(id,def){
 def.id=id;def.pick=[];def.by={};def.group=new THREE.Group();def.group.visible=false;modelRoot.add(def.group);views[id]=def;return def;
}
function ensureBuilt(def){
 if(def.built)return;def.built=true;
 const T=(oid,mesh,shell)=>{mesh.userData.organ=oid;if(shell)mesh.userData.shell=true;(def.by[oid]=def.by[oid]||[]).push(mesh);def.pick.push(mesh);return mesh;};
 def.build(def.group,T,def);
 def.group.traverse(o=>{if(o.isMesh&&o.material&&!o.material.isShaderMaterial&&!(o.material.transparent&&o.material.opacity<.7)){o.castShadow=true;}});
}

/* ---------- audio ---------- */
let actx=null;
function beep(f,d,type,v){if(!ST.sound)return;try{actx=actx||new (window.AudioContext||window.webkitAudioContext)();const o=actx.createOscillator(),g=actx.createGain();o.type=type||'sine';o.frequency.value=f;g.gain.value=v||.05;o.connect(g);g.connect(actx.destination);const n=actx.currentTime;g.gain.setValueAtTime(v||.05,n);g.gain.exponentialRampToValueAtTime(.0001,n+d);o.start(n);o.stop(n+d);}catch(e){}}
const sfx={tap:()=>beep(520,.08),ok:()=>{beep(660,.12);setTimeout(()=>beep(880,.18),110);},no:()=>beep(180,.22,'sawtooth',.04),star:()=>{[660,784,988].forEach((f,i)=>setTimeout(()=>beep(f,.18),i*90));}};

/* ---------- page textures ---------- */
function wrap(ctx,text,maxW){const words=text.split(/\s+/),lines=[];let cur='';for(const w of words){const tt=cur?cur+' '+w:w;if(ctx.measureText(tt).width>maxW&&cur){lines.push(cur);cur=w;}else cur=tt;}if(cur)lines.push(cur);return lines;}
function paper(ctx,W,H,dark){
 ctx.fillStyle=dark?'#d9d3c1':'#fbf8ef';ctx.fillRect(0,0,W,H);
 const g=ctx.createLinearGradient(0,0,W,0);g.addColorStop(0,'rgba(0,0,0,.0)');g.addColorStop(1,'rgba(0,0,0,.0)');
 ctx.strokeStyle='rgba(60,50,30,.05)';for(let y=70;y<H;y+=48){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
}
/* ===== Unit 3 content: real lessons from the app, paginated across as many book pages as needed ===== */
let U3=null,STEPS=[];
const cs=()=>STEPS[ST.step]||{li:0,kind:'text',si:0,part:0,parts:1};
const lessonView=li=>li===4?(ST.revModel||'dig'):LESSONS[li].view;
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const md=s=>esc(s).replace(/\*\*(.+?)\*\*/g,'<b>$1</b>').replace(/\n/g,'<br>');
const T3=o=>o?(o[ST.lang]||o.en||o.tr||''):'';
const L_={key:{tr:'Ana fikir',ar:'الفكرة الرئيسية',en:'Key idea'},readAll:{tr:'Tam metni oku',ar:'اقرأ النص كاملًا',en:'Read the full text'},
 vocab:{tr:'Kelimeler',ar:'المفردات',en:'Vocabulary'},quiz:{tr:'Sorular',ar:'أسئلة',en:'Questions'},think:{tr:'Düşün ve cevapla',ar:'فكّر وأجب',en:'Think and answer'},act:{tr:'Etkinlik',ar:'نشاط',en:'Activity'},
 order:{tr:'Sıraya diz',ar:'رتّب',en:'Put in order'},sciHead:{tr:'Tıp tarihinden bilim insanları',ar:'علماء من تاريخ الطب',en:'Scientists from medical history'},
 reset:{tr:'Karıştır',ar:'اخلط',en:'Shuffle'},check:{tr:'Doğru sıra!',ar:'ترتيب صحيح!',en:'Correct order!'},wrongO:{tr:'Sıra yanlış, tekrar dene',ar:'الترتيب خاطئ، حاول مجددًا',en:'Wrong order, try again'},
 words:{tr:'kelime',ar:'كلمة',en:'words'},myAns:{tr:'Cevabım (bu cihazda saklanır)',ar:'إجابتي (تُحفَظ على هذا الجهاز)',en:'My answer (saved on this device)'},addPhoto:{tr:'Fotoğraf ekle',ar:'أضف صورة',en:'Add photo'},pageOf:{tr:'Sayfa',ar:'صفحة',en:'Page'},cont:{tr:'devam',ar:'تابع',en:'cont.'},tipL:{tr:'İpucu',ar:'نصيحة',en:'Tip'},
 vocabIntro:{tr:'Bu dersin tüm kelimeleri',ar:'كل مفردات هذا الدرس',en:'All words of this lesson'},quizIntro:{tr:'Üzerinde düşün; test ve sıralama soruları yan kartta.',ar:'فكّر فيها؛ أسئلة الاختيار والترتيب في البطاقة الجانبية.',en:'Think about these; the test and ordering questions are in the side card.'}};
const LB=k=>L_[k][ST.lang];

/* ----- rich text ----- */
const FAM='system-ui,-apple-system,"Segoe UI",Roboto,"Noto Sans","Noto Sans Arabic",Tahoma,Arial,sans-serif';
const PGW=1024,PGH=1357,PGM=80;
const mctx=document.createElement('canvas').getContext('2d');
function richTokens(text){
 const out=[];let bold=false;
 String(text||'').split(/(\*\*)/).forEach(part=>{if(part==='**'){bold=!bold;return;}
  part.split(/\s+/).forEach(w=>{if(!w)return;let b=bold;if(ST.lang==='tr'&&w.length>=3&&/[A-ZÇĞİÖŞÜÂÎÛ]{3}/.test(w)&&w===w.toLocaleUpperCase('tr'))b=true;out.push({w,b});});});
 return out;
}
function flow(ctx,toks,fs,fam,maxW){
 const sp=fs*.3,lines=[];let cur={w:0,t:[]};
 toks.forEach(k=>{ctx.font=(k.b?'800 ':'500 ')+fs+'px '+fam;const wd=ctx.measureText(k.w).width;
  if(cur.t.length&&cur.w+sp+wd>maxW){lines.push(cur);cur={w:0,t:[]};}
  cur.t.push({w:k.w,b:k.b,wd});cur.w+=(cur.t.length>1?sp:0)+wd;});
 if(cur.t.length)lines.push(cur);return {lines,sp};
}
const FL=(text,fs,maxW)=>flow(mctx,richTokens(text),fs,FAM,maxW);
function paintFlow(ctx,fl,fs,x0,y,lh,rtl,col,bcol,a,b){
 a=a||0;b=b==null?fl.lines.length:b;
 for(let i=a;i<b;i++){const ln=fl.lines[i];let cx=x0;
  ln.t.forEach(tk=>{ctx.font=(tk.b?'800 ':'500 ')+fs+'px '+FAM;ctx.fillStyle=tk.b?bcol:col;
   if(rtl){ctx.textAlign='right';ctx.fillText(tk.w,cx,y);cx-=tk.wd+fl.sp;}else{ctx.textAlign='left';ctx.fillText(tk.w,cx,y);cx+=tk.wd+fl.sp;}});
  y+=lh;}
 return y;
}

/* ----- pagination: fills as many pages as the content needs ----- */
function newPager(y0first,y0cont,bot){
 const pages=[];let pg={first:true,ops:[],y:y0first};pages.push(pg);
 const next=()=>{pg={first:false,ops:[],y:y0cont};pages.push(pg);};
 /* place a flowed paragraph; may split across pages (never leaves a single widow/orphan line) */
 const put=(fl,o)=>{
  let a=0;const n=fl.lines.length,lh=o.lh;
  while(a<n){
   let room=Math.floor((bot-pg.y)/lh);
   if(room<=0||(room<2&&n-a>1&&pg.ops.length)){next();continue;}
   let take=Math.min(room,n-a);
   if(take<n-a&&n-a-take===1&&take>2)take--;
   if(take<n-a&&take===1&&pg.ops.length){next();continue;}
   pg.ops.push(Object.assign({},o,{fl,a,b:a+take,y:pg.y,bullet:o.bullet&&a===0}));
   pg.y+=take*lh;a+=take;if(a<n)next();
  }
  pg.y+=o.gap||0;
 };
 return {pages,put,room:()=>bot-pg.y,next,cur:()=>pg};
}
function paginateText(li,si){
 const LS=U3.lessons[li],sec=LS.sections[si],mw=PGW-2*PGM;
 let hfs=64,hl;for(;hfs>=44;hfs-=4){hl=FL(T3(sec.h),hfs,mw);if(hl.lines.length<=3)break;}
 const ol=FL(T3(sec.o),44,mw-60),oh=ol.lines.length*58+54;
 const y0=235+hl.lines.length*hfs*1.22+8+oh+34;
 const P=newPager(y0,290,PGH-125);const first=P.pages[0];first.hl=hl;first.hfs=hfs;first.ol=ol;first.oh=oh;
 sec.lines.forEach(ln=>{
  P.put(FL(ln[ST.lang]||ln.en,36,mw-46),{kind:'pt',fs:36,lh:50,gap:14,ind:40,bullet:true,col:'#1f2937',bcol:'#9a3412'});
  const tip=ST.lang==='ar'?ln.na:(ST.lang==='en'?ln.ne:'');
  if(tip)P.put(FL('💡 '+tip,29,mw-70),{kind:'tip',fs:29,lh:40,gap:18,ind:64,col:'#78350f',bcol:'#78350f'});
 });
 return P.pages.map((p,k)=>({li,kind:'text',si,part:k,parts:P.pages.length,pg:p}));
}
function paginateVocab(li){
 const LS=U3.lessons[li],mw=PGW-2*PGM,P=newPager(330,300,PGH-125);
 LS.vocab.forEach(v=>{
  const m=FL('**'+v.tr+'** · '+v.ar+' · '+v.en,34,mw-46);
  P.put(m,{kind:'vw',fs:34,lh:46,gap:v.ex?2:12,ind:40,bullet:true,col:'#111827',bcol:v.key?'#b45309':'#0f172a',key:v.key});
  if(v.ex)P.put(FL(v.ex,27,mw-70),{kind:'vex',fs:27,lh:36,gap:14,ind:64,col:'#4b5563',bcol:'#4b5563'});
 });
 return P.pages.map((p,k)=>({li,kind:'vocab',part:k,parts:P.pages.length,pg:p}));
}
function paginateQuiz(li){
 const LS=U3.lessons[li],mw=PGW-2*PGM,P=newPager(335,300,PGH-125);
 const seen=new Set(),all=LS.ex.open.map(q=>({q,act:0})).concat(LS.ex.act.map(q=>({q,act:1})));
 all.forEach((it,i)=>{
  const paras=T3(it.q.q).split(/\n+/).map(s=>s.trim()).filter(s=>s&&!/^\|/.test(s)).filter(s=>{if(s.length<90)return true;if(seen.has(s))return false;seen.add(s);return true;});
  paras.forEach((t,pi)=>P.put(FL((pi===0?(it.act?'🧪 ':(i+1)+'. '):'')+t,32,mw-(pi===0?0:20)),{kind:'q',fs:32,lh:44,gap:pi===paras.length-1?20:6,ind:pi===0?0:20,col:'#111827',bcol:'#9a3412'}));
 });
 return P.pages.map((p,k)=>({li,kind:'quiz',part:k,parts:P.pages.length,pg:p}));
}
function buildSteps(){
 STEPS=[];
 U3.lessons.forEach((l,li)=>{
  l.sections.forEach((s,si)=>paginateText(li,si).forEach(x=>STEPS.push(x)));
  if(l.vocab.length)paginateVocab(li).forEach(x=>STEPS.push(x));
  if(l.ex.open.length+l.ex.act.length)paginateQuiz(li).forEach(x=>STEPS.push(x));
 });
}
/* keep the reader on the same content when the language (and so the pagination) changes */
function setLang(l){
 const a=cs(),ratio=a.parts>1?a.part/(a.parts-1):0;
 ST.lang=l;applyLang();buildSteps();
 const cand=STEPS.map((s,i)=>[s,i]).filter(x=>x[0].li===a.li&&x[0].kind===a.kind&&(a.kind!=='text'||x[0].si===a.si));
 let idx=0;if(cand.length){const k=Math.round(ratio*(cand.length-1));idx=cand[k][1];}
 ST.step=idx;drawPages();refreshLabelText();renderBar();renderPanel();applyModelVisibility();if(!$('#reader').hidden)renderReader();
}

/* ----- page canvas ----- */
function drawPages(){
 const st=cs(),{li}=st,LS=U3.lessons[li],Ls=LESSONS[li],rtl=ST.lang==='ar',W=PGW,H=PGH,dark=ST.theme==='dark',M=PGM,mw=W-2*M;
 [0,1].forEach(i=>{
  const c=pageCv[i],x=c.getContext('2d');x.setTransform(2,0,0,2,0,0);paper(x,W,H,dark);x.direction=rtl?'rtl':'ltr';x.textBaseline='alphabetic';
  const ax=rtl?W-M:M;x.textAlign=rtl?'right':'left';
  if(i===0){
   x.fillStyle='#5b4a1c';x.font='700 26px '+FAM;x.fillText(L3(UI.unit)+' · '+L3(UI.unitName),ax,80);
   x.fillStyle='#d8cfb6';x.fillRect(M,98,mw,3);
   x.fillStyle='#b45309';x.font='800 30px '+FAM;x.fillText((li+1)+' · '+T3(LS.t),ax,150);
   let title='';
   if(st.kind==='text'){const sec=LS.sections[st.si];title=T3(sec.h);
    if(st.pg.first){
     x.fillStyle='#0f172a';let y=paintFlow(x,st.pg.hl,st.pg.hfs,ax,235,st.pg.hfs*1.22,rtl,'#0f172a','#0f172a')+8;
     const oh=st.pg.oh;x.fillStyle='rgba(217,119,6,.12)';x.fillRect(M,y,mw,oh);x.fillStyle='#d97706';x.fillRect(rtl?W-M-8:M,y,8,oh);
     x.fillStyle='#9a3412';x.font='800 26px '+FAM;x.textAlign=rtl?'right':'left';x.fillText(LB('key').toUpperCase(),rtl?ax-30:ax+30,y+40);
     paintFlow(x,st.pg.ol,44,rtl?ax-30:ax+30,y+92,58,rtl,'#111827','#9a3412');
    }else{x.fillStyle='#64748b';x.font='700 32px '+FAM;x.fillText(title+' ('+LB('cont')+')',ax,215);}
   }else if(st.kind==='vocab'){x.fillStyle='#0f172a';x.font='800 60px '+FAM;x.fillText('📚 '+LB('vocab'),ax,215);
    x.fillStyle='#64748b';x.font='600 28px '+FAM;x.fillText(LB('vocabIntro')+' · '+LS.vocab.length+' '+LB('words'),ax,262);}
   else{x.fillStyle='#0f172a';x.font='800 60px '+FAM;x.fillText('💭 '+LB('think'),ax,215);
    if(st.part===0){x.fillStyle='#64748b';x.font='600 28px '+FAM;paintFlow(x,FL(LB('quizIntro'),28,mw),28,ax,262,36,rtl,'#64748b','#64748b');}}
   st.pg.ops.forEach(o=>{
    const x0=rtl?ax-o.ind:ax+o.ind;
    if(o.bullet){x.fillStyle=o.key?'#d97706':(o.kind==='vw'?'#94a3b8':'#d97706');x.beginPath();x.arc(rtl?W-M-10:M+10,o.y-o.fs*.32,8,0,7);x.fill();}
    if(o.kind==='tip'){const hh=(o.b-o.a)*o.lh+10;x.fillStyle='rgba(120,53,15,.07)';x.fillRect(M+30,o.y-o.fs-2,mw-30,hh);}
    paintFlow(x,o.fl,o.fs,x0,o.y,o.lh,rtl,o.col,o.bcol,o.a,o.b);});
   x.fillStyle='#8a7d5a';x.font='700 24px '+FAM;x.textAlign=rtl?'left':'right';x.fillText(st.part+1+' / '+st.parts,rtl?M:W-M,H-50);
  }else{
   x.fillStyle='#5b4a1c';x.font='700 26px '+FAM;x.fillText(L3(UI.fig)+' '+(li+1),ax,80);
   x.fillStyle='#d8cfb6';x.fillRect(M,98,mw,3);
   if(li===4&&st.kind==='text'&&st.si===1){
    const sec=LS.sections[1];x.fillStyle='#0f172a';x.font='800 40px '+FAM;x.fillText(LB('sciHead'),ax,170);
    const names=[];sec.lines.forEach(ln=>{const m=String(ln.tr||'').match(/^\**([A-ZÇĞİÖŞÜÂÎÛ'’ .-]{3,}?)\**\s*\(([^)]+)\)/);if(m)names.push([m[1].toLowerCase().replace(/(^|\s)\S/g,s=>s.toUpperCase()),m[2]]);});
    const lx=rtl?W-M-24:M+24;x.fillStyle='#d97706';x.fillRect(lx-3,230,6,Math.max(1,names.length)*190);
    names.forEach((nm,k)=>{const cy=290+k*190;x.fillStyle='#d97706';x.beginPath();x.arc(lx,cy,16,0,7);x.fill();
     x.fillStyle='#0f172a';x.font='800 50px '+FAM;x.fillText(nm[0],rtl?lx-44:lx+44,cy+6);x.fillStyle='#b45309';x.font='700 38px '+FAM;x.fillText(nm[1],rtl?lx-44:lx+44,cy+62);});
   }
   x.fillStyle='#1f2937';x.font='600 34px '+FAM;
   let y=H-165;const ln=wrap(x,L3(Ls.fig),mw);y-=(ln.length-1)*48;ln.forEach(l=>{x.fillText(l,ax,y);y+=48;});
   x.fillStyle='#8a7d5a';x.font='600 24px '+FAM;x.textAlign=rtl?'right':'left';x.fillText(String(ST.step+1)+' / '+STEPS.length,rtl?W-M:M,H-50);
  }
  pageTex[i].needsUpdate=true;
 });
}

/* ----- navigation ----- */
function curKey(){const v=lessonView(cs().li);return v+(ST.close&&views[v+'_d']?'_d':'');}
function applyModelVisibility(){const s=cs(),hide=s.li===4&&s.kind==='text'&&s.si===1;modelRoot.visible=!hide;pedestal.visible=!hide&&!!cur;$('#labels').style.display=hide?'none':'';}
function goStep(i,close){
 const prevKey=cur?cur.id:null;
 ST.step=clamp(i,0,STEPS.length-1);ST.close=!!close;
 const nk=curKey();drawPages();
 if(nk!==prevKey){setView();homeCam();}else renderPanel();
 renderBar();applyModelVisibility();if(!$('#reader').hidden)renderReader();
}
const stepLabel=(s)=>{const LS=U3.lessons[s.li];return s.kind==='text'?T3(LS.sections[s.si].h):(s.kind==='vocab'?LB('vocab'):LB('think'));};
function firstStep(li,kind,si){return STEPS.findIndex(s=>s.li===li&&s.kind===kind&&(kind!=='text'||s.si===si)&&s.part===0);}
function renderBar(){
 const st=cs(),LS=U3.lessons[st.li],mine=STEPS.filter(s=>s.li===st.li),k=mine.indexOf(st);
 $('#barTitle').innerHTML='<b>'+(st.li+1)+'</b> '+esc(T3(LS.t))+' <span class="pg">'+(k+1)+'/'+mine.length+'</span>';
 $('#stars').textContent='★ '+ST.stars;
 $('#prev').disabled=ST.step===0;$('#next').disabled=ST.step===STEPS.length-1;
 const m=$('#menu');m.innerHTML='';
 U3.lessons.forEach((l,li)=>{m.appendChild(el('div','mh','<b>'+(li+1)+'</b> '+esc(T3(l.t))));
  const add=(label,gi,on)=>{const b=el('button','mi sub'+(on?' on':''),esc(label));b.onclick=()=>{m.hidden=true;goStep(gi);};m.appendChild(b);};
  l.sections.forEach((s,si)=>{const gi=firstStep(li,'text',si);add(T3(s.h),gi,st.li===li&&st.kind==='text'&&st.si===si);});
  if(l.vocab.length)add('📚 '+LB('vocab'),firstStep(li,'vocab'),st.li===li&&st.kind==='vocab');
  if(l.ex.open.length+l.ex.act.length)add('💭 '+LB('think'),firstStep(li,'quiz'),st.li===li&&st.kind==='quiz');});
}

/* ----- reader overlay ----- */
function renderReader(){
 const st=cs(),LS=U3.lessons[st.li],rtl=ST.lang==='ar',b=$('#rdBody');b.dir=rtl?'rtl':'ltr';
 let h='<div class="rk">'+(st.li+1)+' · '+esc(T3(LS.t))+'</div>';
 if(st.kind==='text'){const sec=LS.sections[st.si];h+='<h2>'+esc(T3(sec.h))+'</h2><div class="ro"><b>'+esc(LB('key'))+':</b> '+md(T3(sec.o))+'</div>';
  sec.lines.forEach(ln=>{h+='<p>'+md(ln[ST.lang]||ln.en)+'</p>';const tip=ST.lang==='ar'?ln.na:(ST.lang==='en'?ln.ne:'');if(tip)h+='<p class="tip">💡 '+md(tip)+'</p>';});}
 else if(st.kind==='vocab'){h+='<h2>📚 '+esc(LB('vocab'))+' ('+LS.vocab.length+')</h2>';LS.vocab.forEach(v=>{h+='<p><b>'+esc(v.tr)+'</b> · '+esc(v.ar)+' · '+esc(v.en)+(v.ex?'<br><span class="mut">'+esc(v.ex)+'</span>':'')+'</p>';});}
 else{h+='<h2>💭 '+esc(LB('think'))+'</h2>';LS.ex.open.forEach((q,i)=>{h+='<p><b>'+(i+1)+'.</b> '+md(T3(q.q))+'</p>';});LS.ex.act.forEach(q=>{h+='<p>🧪 '+md(T3(q.q))+'</p>';});}
 b.innerHTML=h;b.scrollTop=0;$('#rdPrev').disabled=ST.step===0;$('#rdNext').disabled=ST.step===STEPS.length-1;
}
function openReader(){$('#reader').hidden=false;renderReader();}
function closeReader(){$('#reader').hidden=true;}

/* ----- side card ----- */
function exploredCount(){const k=curKey();return Object.keys(ST.explored[k]||{}).length;}
function renderPanel(){
 const p=$('#card');p.innerHTML='';p.scrollTop=0;const st=cs(),LS=U3.lessons[st.li],vid=lessonView(st.li);
 const head=el('div','chead');head.appendChild(el('h2','',esc(L3(cur.title))));
 if(views[vid+'_d']){const b=el('button','btn alt',ST.close?L3(UI.whole):L3(UI.closeup));b.onclick=()=>goStep(ST.step,!ST.close);head.appendChild(b);}
 p.appendChild(head);
 if(st.li===4){const row=el('div','chips mchips');[['dig','Sindirim','الهضمي','Digestive'],['cir','Dolaşım','الدوري','Circulatory'],['res','Solunum','التنفّسي','Respiratory'],['exc','Boşaltım','الإخراجي','Excretory']].forEach(m=>{const b=el('button','chip'+(vid===m[0]?' on':''),{tr:m[1],ar:m[2],en:m[3]}[ST.lang]);b.onclick=()=>{ST.revModel=m[0];goStep(ST.step,ST.close);};row.appendChild(b);});p.appendChild(row);}
 const rd=el('div','readbox');
 if(st.kind==='text'){const sec=LS.sections[st.si];rd.appendChild(el('div','rh',esc(T3(sec.h))+(st.parts>1?'  <span class="pg">'+(st.part+1)+'/'+st.parts+'</span>':'')));rd.appendChild(el('p','ro2',md(T3(sec.o))));}
 else rd.appendChild(el('div','rh',(st.kind==='vocab'?'📚 '+esc(LB('vocab'))+' ('+LS.vocab.length+')':'💭 '+esc(LB('think')))+'  <span class="pg">'+(st.part+1)+'/'+st.parts+'</span>'));
 rd.appendChild(uiBtn('📖 '+LB('readAll'),openReader,'alt'));p.appendChild(rd);
 const ex=el('div','explore');p.appendChild(ex);cur.expEl=ex;updateExplore();
 const card=el('div','ocard');p.appendChild(card);cur.cardEl=card;showOrgan(ST.sel);
 if(cur.status){const s=el('div','status');p.appendChild(s);cur.statusEl=s;cur.shown=-9;}
 const cb=el('div','ctl');p.appendChild(cb);if(cur.controls)cur.controls(cb,cur);
 if(st.kind==='text'&&st.si===0&&st.part===0)renderQuestions(p);
 renderVocab(p,LS);renderExercises(p,st.li,LS);
 p.querySelectorAll('details.dt').forEach(d=>{const s=d.querySelector('summary').textContent;d.open=(st.kind==='vocab'&&s.includes('📚'))||(st.kind==='quiz'&&!s.includes('📚'));});
}
function renderVocab(p,LS){
 if(!LS.vocab.length)return;
 const d=el('details','dt');d.appendChild(el('summary','','📚 '+LB('vocab')+' ('+LS.vocab.length+')'));
 const ul=el('div','vocab');LS.vocab.forEach(v=>{ul.appendChild(el('div','vrow'+(v.key?' key':''),'<b>'+esc(v.tr)+'</b> · '+esc(v.ar)+' · '+esc(v.en)+(v.ex?'<small>'+esc(v.ex)+'</small>':'')));});
 d.appendChild(ul);p.appendChild(d);
}
function renderExercises(p,li,LS){
 const E=LS.ex;
 if(E.mcq.length){
  const d=el('details','dt');const done=()=>E.mcq.filter((q,qi)=>(ST.mcq[li+':'+qi]||{}).done).length;
  const sm_=el('summary','','✅ '+LB('quiz')+' ('+done()+'/'+E.mcq.length+')');d.appendChild(sm_);
  E.mcq.forEach((q,qi)=>{const key=li+':'+qi,w=el('div','q');w.appendChild(el('p','qt',(qi+1)+'. '+md(T3(q.q))));
   const row=el('div','opts col');
   q.o.forEach((o,oi)=>{const b=el('button','opt',md(T3(o)));const s0=ST.mcq[key];if(s0&&s0.done&&oi===q.a)b.classList.add('good');
    b.onclick=()=>{const s=ST.mcq[key]=ST.mcq[key]||{tries:0,done:false};if(s.done)return;s.tries++;
     if(oi===q.a){s.done=true;b.classList.add('good');sfx.ok();if(s.tries===1)addStar(1);sm_.textContent='✅ '+LB('quiz')+' ('+done()+'/'+E.mcq.length+')';}
     else{b.classList.add('bad');sfx.no();toast(L3(UI.wrong));setTimeout(()=>b.classList.remove('bad'),700);}};row.appendChild(b);});
   w.appendChild(row);d.appendChild(w);});
  p.appendChild(d);
 }
 E.order.forEach(o=>{
  const d=el('details','dt');d.appendChild(el('summary','','🔢 '+LB('order')));d.appendChild(el('p','qt',md(T3(o.q))));
  const pool=el('div','opts'),got=el('div','opts got'),msg=el('p','ex');msg.hidden=true;let sel=[],items;
  const shuffle=()=>{items=o.items.map((it,i)=>({it,i}));for(let k=items.length-1;k>0;k--){const j=Math.floor(Math.random()*(k+1));[items[k],items[j]]=[items[j],items[k]];}sel=[];draw();msg.hidden=true;};
  const draw=()=>{pool.innerHTML='';got.innerHTML='';items.forEach(x=>{if(sel.includes(x.i))return;const b=el('button','opt',esc(T3(x.it)));b.onclick=()=>{sel.push(x.i);sfx.tap();if(sel.length===items.length){const ok=sel.every((v,k)=>v===k);msg.hidden=false;msg.textContent=ok?'✔ '+LB('check'):'✖ '+LB('wrongO');msg.style.color=ok?'':'#dc2626';if(ok){sfx.ok();addStar(1);}else{sfx.no();setTimeout(()=>{sel=[];draw();},900);}}draw();};pool.appendChild(b);});
   sel.forEach((v,k)=>got.appendChild(el('span','chip got1',(k+1)+'. '+esc(T3(o.items[v])))));};
  shuffle();d.appendChild(got);d.appendChild(pool);d.appendChild(msg);d.appendChild(uiBtn(LB('reset'),shuffle,'sm'));p.appendChild(d);
 });
 const open=E.open.concat(E.act.map(a=>Object.assign({act:1},a)));
 if(open.length){const d=el('details','dt');d.appendChild(el('summary','','💭 '+LB('think')+' ('+open.length+')'));
  open.forEach((q,qi)=>{const w=el('div','op');w.appendChild(el('p','',(q.act?'🧪 ':(qi+1)+'. ')+md(T3(q.q))));
   const key='b3d_ans_'+li+'_'+qi,ta=el('textarea','ans');ta.placeholder=LB('myAns');ta.rows=2;try{ta.value=localStorage.getItem(key)||'';}catch(e){}
   ta.oninput=()=>{try{localStorage.setItem(key,ta.value);}catch(e){}};w.appendChild(ta);
   if(q.act){const fi=el('input');fi.type='file';fi.accept='image/*';fi.className='photo';const im=el('img','thumb');im.hidden=true;fi.onchange=()=>{const f=fi.files&&fi.files[0];if(f){im.src=URL.createObjectURL(f);im.hidden=false;sfx.tap();}};
    const lb=el('label','btn sm','📷 '+LB('addPhoto'));lb.appendChild(fi);w.appendChild(lb);w.appendChild(im);}
   d.appendChild(w);});p.appendChild(d);}
}

function star(x,cx,cy,R,r){x.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr=i%2?r:R;x.lineTo(cx+Math.cos(a)*rr,cy+Math.sin(a)*rr);}x.closePath();x.fill();}

/* ---------- picking / highlight / labels ---------- */
let cur=null;
const ray=new THREE.Raycaster(),mouse=new THREE.Vector2();
function pickAt(ev){
 if(!cur)return null;const r=renderer.domElement.getBoundingClientRect();
 mouse.set(((ev.clientX-r.left)/r.width)*2-1,-((ev.clientY-r.top)/r.height)*2+1);ray.setFromCamera(mouse,camera);
 const hits=ray.intersectObjects(cur.pick,false);if(!hits.length)return null;
 const ns=hits.find(h=>!h.object.userData.shell),h=ns||hits[0];return h.object.userData.resolve?h.object.userData.resolve(h.point):h.object.userData.organ;
}
function applyHL(time){
 if(!cur)return;
 for(const id in cur.by){
  let k=0;if(ST.hover===id)k+=.32;if(ST.sel===id)k+=.3+.1*Math.sin(time*5);if(cur.auto===id)k+=.28;if(cur.flash&&cur.flash.id===id)k+=cur.flash.k;
  cur.by[id].forEach(m=>{const mt=m.material;if(mt&&mt.emissive&&mt.color){mt.emissive.copy((mt.userData&&mt.userData.glow)||mt.color).multiplyScalar(k);}});
 }
}
const labelEls={};const tmpV=new THREE.Vector3();
function buildLabels(){
 const box=$('#labels');box.innerHTML='';for(const k in labelEls)delete labelEls[k];
 if(!cur)return;
 cur.organs.forEach(o=>{const d=el('div','lbl');d.dataset.id=o[0];d.innerHTML='<i></i><span></span>';box.appendChild(d);labelEls[o[0]]=d;});
 refreshLabelText();
}
function refreshLabelText(){for(const id in labelEls){labelEls[id].querySelector('span').textContent=L3(ORG[id].n);}}
function updateLabels(){
 if(!cur)return;$('#labels').classList.toggle('dots',!ST.labels);const w=renderer.domElement.clientWidth,h=renderer.domElement.clientHeight;
 cur.organs.forEach(o=>{
  const d=labelEls[o[0]];if(!d)return;
    const a=typeof o[1]==='function'?o[1]():o[1];tmpV.set(a[0],a[1],a[2]);cur.group.localToWorld(tmpV);tmpV.project(camera);
  if(tmpV.z>1){d.style.display='none';return;}
  d.style.display='block';d.style.transform='translate('+((tmpV.x*.5+.5)*w).toFixed(1)+'px,'+((-tmpV.y*.5+.5)*h).toFixed(1)+'px)';
  d.classList.toggle('on',ST.sel===o[0]||ST.hover===o[0]);
 });
}

/* ---------- UI ---------- */
function setView(){
 const key=curKey();if(cur)cur.group.visible=false;
 cur=key?views[key]:null;if(cur)ensureBuilt(cur);
 ghost.visible=!!(cur&&cur.body)&&ST.outline;pedestal.visible=!!cur;
 if(cur){cur.group.visible=true;modelRoot.scale.setScalar(cur.scale);modelRoot.position.set(cur.pos[0],cur.pos[1],cur.pos[2]);U.k.value=cur.scale;pedestal.position.set(cur.pedestal?cur.pedestal[0]:4.3,.04,cur.pedestal?cur.pedestal[1]:0);pedestal.scale.setScalar(cur.pedScale||1);if(cur.reset)cur.reset();}
 ST.sel=null;ST.hover=null;buildLabels();renderPanel();
}
const CAM={a:0,from:null,to:null};
function flyTo(pos,tgt){CAM.a=0;CAM.from={p:camera.position.clone(),t:controls.target.clone()};CAM.to={p:V(pos[0],pos[1],pos[2]),t:V(tgt[0],tgt[1],tgt[2])};}
function homeCam(){const c=cur&&cur.cam?cur.cam:{p:[2.2,19.5,11.5],t:[2.2,0,.5]};const narrow=camera.aspect<.8;const p=c.p.slice(),tt=c.t.slice();if(narrow){p[0]=tt[0]=4.2;}flyTo(p,tt);}
function toast(msg,ok){const d=el('div','toast'+(ok?' ok':''),msg);document.body.appendChild(d);setTimeout(()=>d.classList.add('go'),20);setTimeout(()=>d.remove(),2400);}
function addStar(n){ST.stars+=n;$('#stars').textContent='★ '+ST.stars;sfx.star();}

function updateExplore(){
 if(!cur||!cur.expEl)return;const k=curKey();const n=Object.keys(ST.explored[k]||{}).length,tot=cur.organs.length;
 cur.expEl.innerHTML='<span>'+L3(UI.explored)+' <b>'+n+'/'+tot+'</b></span><i style="--p:'+(n/tot*100)+'%"></i>';
}
function showOrgan(id){
 if(!cur||!cur.cardEl)return;const c=cur.cardEl;
 if(!id||!ORG[id]){c.innerHTML='<p class="mut">'+L3(UI.pickOrgan)+'</p>';return;}
 c.innerHTML='<h3>'+L3(ORG[id].n)+'</h3><p>'+L3(ORG[id].d)+'</p>';
 const f=el('button','btn sm',L3(UI.focus));f.onclick=()=>{const o=cur.organs.find(o=>o[0]===id);if(o){const a=typeof o[1]==='function'?o[1]():o[1];const w=cur.group.localToWorld(V(a[0],a[1],a[2]));const d=camera.position.clone().sub(controls.target);flyTo([w.x+d.x*.55,w.y+d.y*.55,w.z+d.z*.55],[w.x,w.y,w.z]);}};c.appendChild(f);
}
function selectOrgan(id){
 ST.sel=id;sfx.tap();showOrgan(id);
 const k=curKey();ST.explored[k]=ST.explored[k]||{};
 if(id&&!ST.explored[k][id]){ST.explored[k][id]=1;updateExplore();if(Object.keys(ST.explored[k]).length===cur.organs.length&&!ST.explored[k+'_done']){ST.explored[k+'_done']=1;addStar(1);toast('★ '+L3(UI.explored)+' '+cur.organs.length+'/'+cur.organs.length,true);}}
 if(cur.onSelect)cur.onSelect(id);
}
/* prediction questions */
function renderQuestions(p){
 const L=LESSONS[cs().li];const qs=Q[L.id];if(!qs||ST.close)return;
 const box=el('div','qbox');p.appendChild(box);
 box.appendChild(el('h3','',L3(UI.predict)));
 qs.forEach((q,qi)=>{
  const key=L.id+qi;const w=el('div','q');w.appendChild(el('p','qt',(qi+1)+'. '+L3(q.q)));
  const row=el('div','opts');
  q.o.forEach((o,oi)=>{const b=el('button','opt',L3(o));
   const st=ST.answered[key];
   if(st&&st.done&&oi===q.a)b.classList.add('good');
   b.onclick=()=>{
    if(ST.answered[key]&&ST.answered[key].done)return;
    const s=ST.answered[key]=ST.answered[key]||{tries:0,done:false};s.tries++;
    if(oi===q.a){s.done=true;b.classList.add('good');sfx.ok();if(s.tries===1)addStar(1);
      const ex=w.querySelector('.ex');ex.textContent='✔ '+L3(UI.right)+' '+L3(q.e);ex.hidden=false;
      if(cur&&cur.demo&&q.go!=null)cur.demo(q.go);cur.flash={id:q.hl,k:.5};setTimeout(()=>{if(cur)cur.flash=null;},2600);
      ST.sel=q.hl;showOrgan(q.hl);if(cur&&cur.onSelect)cur.onSelect(q.hl);
    }else{b.classList.add('bad');sfx.no();toast(L3(UI.wrong));setTimeout(()=>b.classList.remove('bad'),700);}
   };row.appendChild(b);});
  w.appendChild(row);const ex=el('p','ex');ex.hidden=true;w.appendChild(ex);
  if(ST.answered[key]&&ST.answered[key].done){ex.textContent='✔ '+L3(q.e);ex.hidden=false;}
  box.appendChild(w);
 });
}
/* view controls helpers */
function uiBtn(txt,fn,cls){const b=el('button','btn '+(cls||''),txt);b.onclick=fn;return b;}
function uiSlider(label,min,max,step,val,on,fmt){const w=el('label','row');const s=el('span','',label);const v=el('b','',fmt?fmt(val):val);const i=el('input');i.type='range';i.min=min;i.max=max;i.step=step;i.value=val;i.oninput=()=>{on(+i.value);v.textContent=fmt?fmt(+i.value):i.value;};w.append(s,v,i);w.sl=i;w.val=v;return w;}
function uiRow(){return el('div','btnrow');}

/* common toolbar: play/pause, speed */
function commonControls(box){
 const r=uiRow();const pb=uiBtn(ST.play?'❚❚ '+L3(UI.pause):'▶ '+L3(UI.play),()=>{ST.play=!ST.play;pb.textContent=ST.play?'❚❚ '+L3(UI.pause):'▶ '+L3(UI.play);});r.appendChild(pb);box.appendChild(r);
 box.appendChild(uiSlider(L3(UI.speed),.25,3,.25,ST.speed,v=>ST.speed=v,v=>v+'×'));
}

/* ---------- init UI ---------- */
function applyLang(){
 const rtl=ST.lang==='ar';document.documentElement.lang=ST.lang;['#card','#menu','#barTitle','#labels','#layerpop','#unit'].forEach(q=>{$(q).dir=rtl?'rtl':'ltr';});
 $('#unit').textContent=L3(UI.unit);$('#hint').textContent=L3(UI.tap);
 document.querySelectorAll('#langs button').forEach(b=>b.classList.toggle('on',b.dataset.l===ST.lang));
 try{localStorage.setItem('b3d_lang',ST.lang);}catch(e){}
 $('#lp-labels span').textContent=L3(UI.labels);$('#lp-outline span').textContent=L3(UI.outline);$('#lp-rotate span').textContent=L3(UI.rotate);$('#lp-reset').textContent=L3(UI.reset);
 $('#sound').title=L3(UI.sound);$('#theme').title=L3(UI.theme);$('#layers').title=L3(UI.layers);$('#menuBtn').title=L3(UI.menu);
}
function applyTheme(){
 const dk=ST.theme==='dark';document.documentElement.dataset.theme=ST.theme;
 scene.background=new THREE.Color(dk?0x0f1722:0xcfdad2);
 desk.material.color.setHex(dk?0x1f3a33:0x7d9c8c);hemi.intensity=dk?.12:.2;sun.intensity=dk?.4:.5;sun.color.setHex(dk?0xbcd0ff:0xfff1dc);
 ghostU.c.value.setHex(dk?0x9fb4cc:0x4f6277);
 try{localStorage.setItem('b3d_theme',ST.theme);}catch(e){}
 drawPages();
}
function resize(){const w=stage.clientWidth,h=stage.clientHeight;renderer.setSize(w,h,false);renderer.domElement.style.width=w+'px';renderer.domElement.style.height=h+'px';camera.aspect=w/h;
 /* on tall (phone) screens pull the camera back a little more */
 camera.fov=w/h<.8?52:36;camera.updateProjectionMatrix();U.scale.value=renderer.domElement.height/(2*Math.tan(camera.fov*Math.PI/360));}
function wire(){
 ['tr','ar','en'].forEach(l=>{const b=el('button','',{tr:'TR',ar:'ع',en:'EN'}[l]);b.dataset.l=l;b.onclick=()=>{setLang(l);};$('#langs').appendChild(b);});
 $('#prev').onclick=()=>goStep(ST.step-1);$('#next').onclick=()=>goStep(ST.step+1);
 $('#menuBtn').onclick=()=>{$('#menu').hidden=!$('#menu').hidden;$('#layerpop').hidden=true;};
 $('#sound').onclick=e=>{ST.sound=!ST.sound;e.currentTarget.classList.toggle('off',!ST.sound);if(ST.sound)sfx.tap();};
 $('#theme').onclick=()=>{ST.theme=ST.theme==='dark'?'light':'dark';applyTheme();};
 $('#layers').onclick=()=>{$('#layerpop').hidden=!$('#layerpop').hidden;$('#menu').hidden=true;};
 const tg=(id,key,after)=>{const c=$(id+' input');c.checked=ST[key];c.onchange=()=>{ST[key]=c.checked;if(after)after();};};
 tg('#lp-labels','labels');tg('#lp-outline','outline',()=>{ghost.visible=!!(cur&&cur.body)&&ST.outline;});tg('#lp-rotate','rotate',()=>{controls.autoRotate=ST.rotate;controls.autoRotateSpeed=1.2;});
 $('#lp-reset').onclick=()=>{homeCam();$('#layerpop').hidden=true;};
 $('#rdClose').onclick=closeReader;$('#rdPrev').onclick=()=>goStep(ST.step-1);$('#rdNext').onclick=()=>goStep(ST.step+1);$('#reader').addEventListener('click',e=>{if(e.target.id==='reader')closeReader();});addEventListener('keydown',e=>{if(e.key==='Escape'){closeReader();return;}const tg=(e.target&&e.target.tagName)||'';if(/INPUT|TEXTAREA|SELECT/.test(tg))return;const rtl=ST.lang==='ar',nxt=rtl?'ArrowLeft':'ArrowRight',prv=rtl?'ArrowRight':'ArrowLeft';if(e.key===nxt)goStep(ST.step+1);else if(e.key===prv)goStep(ST.step-1);else if(e.key==='Home')goStep(0);else if(e.key==='End')goStep(STEPS.length-1);});$('#readBtn').onclick=openReader;
 $('#cardBtn').onclick=()=>$('#card').classList.toggle('shut');
 /* pointer picking */
 const cvs=renderer.domElement;let down=null;
 cvs.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY,t:performance.now()};$('#menu').hidden=true;$('#layerpop').hidden=true;});
 cvs.addEventListener('pointerup',e=>{if(!down)return;const mv=Math.hypot(e.clientX-down.x,e.clientY-down.y);const dt=performance.now()-down.t;down=null;if(mv<6&&dt<600){const id=pickAt(e);if(id)selectOrgan(id);else{ST.sel=null;showOrgan(null);}}});
 cvs.addEventListener('pointermove',e=>{if(e.buttons)return;const id=pickAt(e);if(id!==ST.hover){ST.hover=id;cvs.style.cursor=id?'pointer':'grab';}});
 cvs.addEventListener('pointerleave',()=>{ST.hover=null;});
 addEventListener('resize',resize);
}

/* ---------- main loop ---------- */
const clock={last:performance.now(),time:0};
function frame(now){
 requestAnimationFrame(frame);
 const raw=Math.min(.05,(now-clock.last)/1000);clock.last=now;clock.time+=raw;
 const dt=ST.play?raw*ST.speed:0;
 if(CAM.to){CAM.a=Math.min(1,CAM.a+raw/.9);const k=sm(CAM.a);camera.position.lerpVectors(CAM.from.p,CAM.to.p,k);controls.target.lerpVectors(CAM.from.t,CAM.to.t,k);if(CAM.a>=1)CAM.to=null;}
 if(cur&&cur.update)cur.update(dt,raw,clock.time);
 controls.update();applyHL(clock.time);updateLabels();
 renderer.render(scene,camera);
}
function start(){
 resize();wire();applyLang();applyTheme();
 if(matchMedia('(max-width:820px)').matches)$('#card').classList.add('shut');
 goStep(0);homeCam();CAM.a=1;camera.position.copy(CAM.to.p);controls.target.copy(CAM.to.t);CAM.to=null;
 requestAnimationFrame(frame);
}
