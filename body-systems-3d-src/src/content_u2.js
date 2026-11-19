/* ===== Fen Bilimleri 7 · Unit 2 · Kuvvet ve Enerjiyi Keşfedelim: labels, lesson map, organ texts ===== */
UI.unit=S3('Fen Bilimleri 7 · 2. Ünite','العلوم 7 · الوحدة 2','Science 7 · Unit 2');
UI.unitName=S3('Kuvvet ve Enerjiyi Keşfedelim','القوة والطاقة','Discovering Force and Energy');
UI.amp=S3('Genlik','السعة','Amplitude');
const LESSONS=[
 {id:'u2-0',view:'force',title:S3('Kuvvet, iş ve enerji','القوة والشغل والطاقة','Force, work and energy'),
  fig:S3("Şekil 1. Kuvvet cismi iterek ya da kaldırarak iş yapar.","الشكل 1. القوة تنجز شغلًا عندما تدفع الجسم أو ترفعه.","Fig. 1. A force does work when it pushes or lifts an object.")},
 {id:'u2-1',view:'pend',title:S3('Enerji dönüşümleri','تحوّلات الطاقة','Energy transformations'),
  fig:S3("Şekil 2. Sarkaç salınırken potansiyel ve kinetik enerji birbirine dönüşür.","الشكل 2. يتحوّل البندول بين طاقة الوضع والطاقة الحركية أثناء تأرجحه.","Fig. 2. As a pendulum swings, potential and kinetic energy convert into each other.")},
 {id:'u2-2',view:'pend',title:S3('Ünite sonu ve iz bırakanlar','نهاية الوحدة والعلماء','End of unit and notable scientists'),
  fig:S3("Şekil 3. Sürtünme yoksa toplam enerji sabit kalır (enerjinin korunumu).","الشكل 3. بدون احتكاك تبقى الطاقة الكلية ثابتة (حفظ الطاقة).","Fig. 3. Without friction the total energy stays constant (conservation of energy).")}
];
const Q={};
const ORG={};const O=(id,n,d)=>{ORG[id]={n,d};};
O('force',S3('Kuvvet','القوة','Force'),S3('Bir cisme etki eden itme ya da çekme. Birimi newton (N).','دفع أو سحب يؤثّر في الجسم. وحدتها النيوتن (N).','A push or pull on an object. Its unit is the newton (N).'));
O('box',S3('Cisim (blok)','الجسم (المكعّب)','Object (block)'),S3('Yatay yüzeyde itilen cisim. İş = kuvvet × yer değiştirme.','جسم يُدفع على سطح أفقي. الشغل = القوة × الإزاحة.','An object pushed along a flat surface. Work = force × displacement.'));
O('friction',S3('Sürtünme kuvveti','قوة الاحتكاك','Friction'),S3('Harekete karşı koyan kuvvet. Yüzeyler temas ederken oluşur ve enerjinin bir kısmını ısıya çevirir.','قوة تقاوم الحركة. تنشأ عند تلامس السطوح وتحوّل جزءًا من الطاقة إلى حرارة.','A force that opposes motion. It arises where surfaces touch and turns some energy into heat.'));
O('lift',S3('Kaldırılan cisim','الجسم المرفوع','Lifted object'),S3('Cisim yukarı kaldırılırken yapılan iş ağırlığa karşı yapılır: W = m·g·h. Cismin potansiyel enerjisi artar.','الشغل عند رفع الجسم يُبذل ضد وزنه: W = m·g·h. وتزداد طاقة وضعه.','Lifting an object does work against its weight: W = m·g·h. Its potential energy increases.'));
O('pivot',S3('Asılma noktası','نقطة التعليق','Pivot'),S3('Sarkacın asıldığı nokta. Sürtünme ihmal edilirse enerji bu sistemde korunur.','النقطة التي يتعلّق بها البندول. إذا أُهمل الاحتكاك تبقى الطاقة محفوظة في النظام.','The point the pendulum hangs from. If friction is ignored, energy is conserved in the system.'));
O('bob',S3('Sarkaç ağırlığı','ثقل البندول','Pendulum bob'),S3('Sarkacın ucundaki cisim. En yüksekte potansiyel enerji en fazla, en alçakta kinetik enerji en fazladır.','الجسم في طرف البندول. أقصى طاقة وضع عند أعلى نقطة، وأقصى طاقة حركية عند أدنى نقطة.','The mass at the end of the pendulum. Potential energy is greatest at the top, kinetic energy greatest at the bottom.'));
O('height',S3('Yükseklik (h)','الارتفاع (h)','Height (h)'),S3('Cismin en alçak noktaya göre yüksekliği. Potansiyel enerji Ep = m·g·h ile hesaplanır.','ارتفاع الجسم عن أدنى نقطة. تُحسب طاقة الوضع بالعلاقة Ep = m·g·h.','The height of the object above the lowest point. Potential energy is Ep = m·g·h.'));
O('bars',S3('Enerji çubukları','أعمدة الطاقة','Energy bars'),S3('Mavi: potansiyel enerji. Kırmızı: kinetik enerji. Toplamları sabit kalır.','الأزرق: طاقة الوضع. الأحمر: الطاقة الحركية. مجموعهما ثابت.','Blue: potential energy. Red: kinetic energy. Their total stays the same.'));
