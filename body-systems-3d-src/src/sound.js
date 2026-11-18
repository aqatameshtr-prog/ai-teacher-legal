/* ===== sound: everything is synthesised with WebAudio (no audio files), synced to the animations ===== */
let AC=null,MASTER=null,NOISEBUF=null;
function audioCtx(){
 if(!ST.sound)return null;
 if(!AC){
  const C=window.AudioContext||window.webkitAudioContext;if(!C)return null;
  try{AC=new C();}catch(e){return null;}
  MASTER=AC.createGain();MASTER.gain.value=ST.vol;MASTER.connect(AC.destination);
  const n=AC.sampleRate*2,b=AC.createBuffer(1,n,AC.sampleRate),d=b.getChannelData(0);let last=0;
  for(let i=0;i<n;i++){const w=Math.random()*2-1;last=(last+.02*w)/1.02;d[i]=last*3.5;}   /* soft, low-leaning noise */
  NOISEBUF=b;
 }
 if(AC.state==='suspended')AC.resume();
 return AC;
}
const SND={stats:{},last:null,loops:{},t:{},
 count(k){this.stats[k]=(this.stats[k]||0)+1;},
 /* short pitched thump / blip */
 tone(f0,f1,dur,gain,type){const a=audioCtx();if(!a)return;const n=a.currentTime,o=a.createOscillator(),g=a.createGain();
  o.type=type||'sine';o.frequency.setValueAtTime(f0,n);o.frequency.exponentialRampToValueAtTime(Math.max(20,f1),n+dur);
  g.gain.setValueAtTime(0.0001,n);g.gain.exponentialRampToValueAtTime(gain,n+Math.min(.012,dur/3));g.gain.exponentialRampToValueAtTime(.0001,n+dur);
  o.connect(g);g.connect(MASTER);o.start(n);o.stop(n+dur+.02);},
 /* short burst of filtered noise */
 burst(dur,gain,freq,q,type){const a=audioCtx();if(!a)return;const n=a.currentTime,s=a.createBufferSource(),f=a.createBiquadFilter(),g=a.createGain();
  s.buffer=NOISEBUF;s.loop=true;f.type=type||'bandpass';f.frequency.value=freq;f.Q.value=q||1;
  g.gain.setValueAtTime(0.0001,n);g.gain.exponentialRampToValueAtTime(gain,n+Math.min(.015,dur/3));g.gain.exponentialRampToValueAtTime(.0001,n+dur);
  s.connect(f);f.connect(g);g.connect(MASTER);s.start(n,Math.random()*1.5);s.stop(n+dur+.02);},
 /* continuous filtered noise (breathing, running water) */
 loop(id,type,freq,q){let L=this.loops[id];const a=audioCtx();if(!a)return null;
  if(!L){const s=a.createBufferSource(),f=a.createBiquadFilter(),g=a.createGain();s.buffer=NOISEBUF;s.loop=true;f.type=type;f.frequency.value=freq;f.Q.value=q||1;g.gain.value=0;
   s.connect(f);f.connect(g);g.connect(MASTER);s.start();L=this.loops[id]={s,f,g};}
  return L;},
 setLoop(id,gain,freq){const L=this.loops[id];if(!L||!AC)return;const n=AC.currentTime;L.g.gain.setTargetAtTime(gain,n,.06);if(freq!=null)L.f.frequency.setTargetAtTime(freq,n,.06);},
 silence(){for(const k in this.loops)this.setLoop(k,0);},
 /* the heart: "lub" (ventricles contract) then "dub" (valves close) */
 lub(v){this.tone(64,40,.13,.55*v,'sine');this.burst(.09,.12*v,140,.8,'lowpass');this.count('lub');},
 dub(v){this.tone(82,52,.1,.4*v,'sine');this.burst(.07,.08*v,180,.8,'lowpass');this.count('dub');},
 gulp(){this.tone(340,110,.2,.28,'sine');this.burst(.12,.12,600,1.2);this.count('gulp');},
 crunch(){this.burst(.05,.22,1700+Math.random()*600,3);this.count('crunch');},
 gurgle(){const f=110+Math.random()*160;this.tone(f,f*1.8,.09+Math.random()*.06,.16,'sine');if(Math.random()<.4)this.burst(.35,.10,180,.7,'lowpass');this.count('gurgle');},
 bubble(){const f=300+Math.random()*420;this.tone(f,f*1.5,.035,.07,'sine');this.count('bubble');},
 rumble(){this.burst(.5,.12,150,.7,'lowpass');this.count('rumble');},
 drip(){const f=700+Math.random()*500;this.tone(f*1.35,f*.8,.11,.16,'sine');this.count('drip');},
 /* called every frame for the visible view; dt = animation time (0 when paused), raw = real time */
 tick(v,dt,raw){
  if(!AC||!ST.sound){return;}
  if(this.last!==v){this.silence();this.last=v;this.t={};}
  if(!ST.play||AC.state!=='running'){this.silence();return;}
  const id=v.id,T=this.t;
  if(id==='cir'){
   const ph=v.ph,p=T.ph==null?ph:T.ph;const cross=x=>(p<=ph?(p<x&&ph>=x):(p<x||ph>=x));
   if(cross(.14))this.lub(.9);if(cross(.42))this.dub(.9);T.ph=ph;
  }else if(id==='cir_d'){
   T.hb=(T.hb||0)+dt;if(T.hb>60/72){T.hb=0;this.lub(.55);setTimeout(()=>this.dub(.55),Math.round(.28*60/72*1000));}
  }else if(id==='res'||id==='res_d'){
   const ph=id==='res'?v.ph:((T.rp=((T.rp||0)+dt*14/60)%1));const flow=Math.sin(ph*Math.PI*2),a=id==='res'?(v.amp||1):1;
   this.loop('air','bandpass',700,.9);
   if(flow>0)this.setLoop('air',.34*Math.pow(flow,.8)*Math.min(1.4,a),520+520*flow);
   else this.setLoop('air',.2*Math.pow(-flow,.8)*Math.min(1.4,a),380+260*-flow);
  }else if(id==='dig'){
   const st=v.stage;if(st<0){return;}const sid=v.seg[st].id;
   if(T.st!==st){T.st=st;T.n=0;if(sid==='pharynx')this.gulp();}
   T.n+=dt;
   if(sid==='mouth'){if(T.n>.22){T.n=0;this.crunch();}}
   else if(sid==='esophagus'){if(T.n>.45){T.n=0;this.burst(.14,.09,320,.8,'lowpass');this.count('swish');}}
   else if(sid==='stomach'){if(T.n>.35+Math.random()*.4){T.n=0;this.gurgle();}}
   else if(sid==='small'){if(T.n>.22+Math.random()*.3){T.n=0;this.bubble();}}
   else if(sid==='large'){if(T.n>1){T.n=0;this.rumble();}}
  }else if(id==='dig_d'){
   T.n=(T.n||0)+dt;if(T.n>.28+Math.random()*.3){T.n=0;this.bubble();}
  }else if(id==='exc'){
   const arr=v.arr||0;T.clk=(T.clk||0)+dt;if(T.arr==null)T.arr=arr;if(arr>T.arr){T.arr=arr;if(T.clk-(T.lastD==null?-1:T.lastD)>.32){T.lastD=T.clk;this.drip();}}
   this.loop('water','bandpass',1900,.7);this.setLoop('water',v.void?.3:0,v.void?1700+Math.sin(performance.now()/180)*300:null);
  }else if(id==='exc_d'){
   T.n=(T.n||0)+dt;if(T.n>.7+Math.random()*.5){T.n=0;this.drip();}
  }
 }
};
/* master volume + browsers only allow audio after a first click or key press */
function setVolume(v){ST.vol=v;try{localStorage.setItem('b3d_vol',String(v));}catch(e){}if(MASTER)MASTER.gain.setTargetAtTime(v,AC.currentTime,.03);}
document.addEventListener('visibilitychange',()=>{if(!AC)return;if(document.hidden){SND.silence();AC.suspend();}else if(ST.sound)AC.resume();});
['pointerdown','keydown','touchstart'].forEach(ev=>addEventListener(ev,()=>{if(ST.sound)audioCtx();},{passive:true}));
