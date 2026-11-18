/* ===== content: strings, lessons, organs, questions ===== */
const S3=(tr,ar,en)=>({tr,ar,en});
const UI={
 unit:S3('Fen Bilimleri 7 · 3. Ünite','العلوم 7 · الوحدة 3','Science 7 · Unit 3'),
 unitName:S3('Vücudumuzdaki Sistemler','الأجهزة في جسمنا','Systems in Our Body'),
 tap:S3('Şekildeki her yapıya dokun','المس كل جزء في الشكل','Tap each thing in the figure'),
 explored:S3('Keşfedilen','ما استكشفته','Explored'),
 play:S3('Oynat','تشغيل','Play'), pause:S3('Duraklat','إيقاف مؤقت','Pause'),
 speed:S3('Hız','السرعة','Speed'),
 labels:S3('Etiketler','التسميات','Labels'), outline:S3('Vücut çizgisi','حدود الجسم','Body outline'),
 rotate:S3('Otomatik döndür','دوران تلقائي','Auto-rotate'), reset:S3('Görünümü sıfırla','إعادة الضبط','Reset view'),
 closeup:S3('Yakın görünüm','منظر مقرّب','Close-up'), whole:S3('Tüm vücut','الجسم كامل','Whole body'),
 predict:S3('Önce tahmin et','توقّع أولًا','Predict first'),
 right:S3('Doğru!','صحيح!','Correct!'), wrong:S3('Henüz değil — tekrar dene','ليس بعد — حاول مجددًا','Not yet — try again'),
 next:S3('Sonraki','التالي','Next'), prev:S3('Önceki','السابق','Previous'),
 sound:S3('Ses','الصوت','Sound'), theme:S3('Tema','المظهر','Theme'), layers:S3('Katmanlar','الطبقات','Layers'),
 menu:S3('Dersler','الدروس','Lessons'),
 pickOrgan:S3('Bir yapıya dokun, ne işe yaradığını öğren.','المس جزءًا لتعرف وظيفته.','Tap a part to learn what it does.'),
 focus:S3('Odaklan','ركّز','Focus'),
 stage:S3('Aşama','المرحلة','Stage'),
 bpm:S3('Kalp atışı','نبض القلب','Heart rate'), perMin:S3('/dk','/د','/min'),
 exercise:S3('Egzersiz','تمرين','Exercise'), restBtn:S3('Dinlenme','راحة','Rest'),
 breathRate:S3('Solunum hızı','معدل التنفس','Breathing rate'), deep:S3('Derin nefes','نَفَس عميق','Deep breath'),
 hydration:S3('Su tüketimi','شرب الماء','Water intake'), bladderLvl:S3('İdrar kesesi doluluğu','امتلاء المثانة','Bladder fullness'),
 donor:S3('Kan bağışı: Verici kan grubu','التبرّع بالدم: فصيلة المتبرّع','Blood donation: donor group'),
 canGive:S3('Kan verebileceği gruplar','الفصائل التي يمكنه إعطاؤها','Can give blood to'),
 stars:S3('Yıldız','نجوم','Stars'),
 score:S3('Sonuç','النتيجة','Score'),
 review:S3('Ünite sonu değerlendirme','تقييم نهاية الوحدة','End-of-unit review'),
 reviewIntro:S3('Altı soruyu cevapla ve yıldızını kap.','أجب عن ستة أسئلة واحصل على نجمتك.','Answer six questions and earn your star.'),
 done:S3('Tamamlandı!','أحسنت!','Well done!'),
 again:S3('Yeniden dene','أعد المحاولة','Try again'),
 fig:S3('Şekil','الشكل','Fig.'),
 noWebgl:S3('Bu cihazda 3B görüntü açılamadı.','تعذّر تشغيل العرض ثلاثي الأبعاد على هذا الجهاز.','3D could not start on this device.')
};

/* lessons = steps of the bottom bar (same five lessons as in the unit) */
const LESSONS=[
 {id:'dig',view:'dig',title:S3('Sindirim Sistemi','الجهاز الهضمي','Digestive System'),
  fig:S3('Şekil 1. Sindirim sistemi: lokma ağızdan anüse yolculuk eder.','الشكل 1. الجهاز الهضمي: رحلة اللقمة من الفم إلى الشرج.','Fig. 1. Digestive system: the bolus travels from mouth to anus.'),
  pts:[
   S3('Sindirim: besinlerin KANA GEÇEBİLECEK KADAR küçük parçalara ayrılmasıdır.','الهضم: تفتيت الطعام إلى قطع صغيرة تكفي لتعبر إلى الدم.','Digestion: breaking food into pieces small enough to pass into the blood.'),
   S3('Sıra: ağız → yutak → yemek borusu → mide → ince bağırsak → kalın bağırsak → anüs.','الترتيب: فم ← بلعوم ← مريء ← معدة ← أمعاء دقيقة ← أمعاء غليظة ← شرج.','Order: mouth → pharynx → esophagus → stomach → small intestine → large intestine → anus.'),
   S3('Karaciğer ve pankreas YARDIMCI organdır: besin bunların içinden geçmez.','الكبد والبنكرياس عضوان مساعدان: الطعام لا يمرّ داخلهما.','The liver and pancreas are HELPER organs: food does not pass through them.'),
   S3('Emilim ince bağırsakta (villuslar), su emilimi kalın bağırsakta olur.','الامتصاص في الأمعاء الدقيقة (الزغابات)، وامتصاص الماء في الأمعاء الغليظة.','Absorption happens in the small intestine (villi); water is absorbed in the large intestine.')]},
 {id:'cir',view:'cir',title:S3('Dolaşım Sistemi ve Kan Bağışı','الجهاز الدوري والتبرّع بالدم','Circulatory System and Blood Donation'),
  fig:S3('Şekil 2. Kalp, damarlar ve kan: iki dolaşım yolu.','الشكل 2. القلب والأوعية والدم: دورتان.','Fig. 2. Heart, vessels and blood: two circulation loops.'),
  pts:[
   S3('Kalp 4 odacıklı bir pompadır: 2 kulakçık ve 2 karıncık.','القلب مضخّة ذات 4 حجرات: أذينان وبطينان.','The heart is a four-chamber pump: 2 atria and 2 ventricles.'),
   S3('Büyük dolaşım: sol karıncık → aort → vücut → ana toplardamarlar → sağ kulakçık.','الدورة الكبرى: بطين أيسر ← أبهر ← الجسم ← الوريدان الأجوفان ← أذين أيمن.','Systemic loop: left ventricle → aorta → body → venae cavae → right atrium.'),
   S3('Küçük dolaşım: sağ karıncık → akciğer atardamarı → akciğer → akciğer toplardamarı → sol kulakçık.','الدورة الصغرى: بطين أيمن ← شريان رئوي ← الرئة ← وريد رئوي ← أذين أيسر.','Pulmonary loop: right ventricle → pulmonary artery → lung → pulmonary vein → left atrium.'),
   S3('Kan: plazma, alyuvar, akyuvar, kan pulcukları. Kan bağışında kan grupları uyumlu olmalıdır.','الدم: بلازما وكريات حمراء وبيضاء وصفائح. في التبرّع يجب أن تتوافق فصائل الدم.','Blood: plasma, red cells, white cells, platelets. Blood donation needs compatible blood groups.')]},
 {id:'res',view:'res',title:S3('Solunum Sistemi ve Bağımlılıkla Mücadele','الجهاز التنفّسي ومكافحة الإدمان','Respiratory System and Fighting Addiction'),
  fig:S3('Şekil 3. Solunum sistemi: nefes alma ve verme.','الشكل 3. الجهاز التنفّسي: الشهيق والزفير.','Fig. 3. Respiratory system: breathing in and out.'),
  pts:[
   S3('Hava yolu: burun → yutak → gırtlak → soluk borusu → bronşlar → akciğer (alveoller).','طريق الهواء: أنف ← بلعوم ← حنجرة ← قصبة هوائية ← قصبات ← رئة (أسناخ).','Air path: nose → pharynx → larynx → trachea → bronchi → lung (alveoli).'),
   S3('Gaz alışverişi alveollerde olur: O₂ kana, CO₂ alveole geçer (difüzyon).','تبادل الغازات في الأسناخ: الأكسجين إلى الدم وثاني أكسيد الكربون إلى السنخ (انتشار).','Gas exchange happens in the alveoli: O₂ goes into the blood, CO₂ into the alveolus (diffusion).'),
   S3('Nefes alırken diyafram kasılıp düzleşir, kaburgalar yukarı-öne gider, hacim artar.','عند الشهيق ينقبض الحجاب الحاجز وينبسط، وترتفع الأضلاع للأمام، ويزداد الحجم.','On inhale the diaphragm contracts and flattens, ribs move up and out, volume increases.'),
   S3('Sigara ve bağımlılık yapan maddeler solunum sistemine ve tüm vücuda zarar verir.','التدخين والمواد المسبّبة للإدمان تضرّ الجهاز التنفّسي والجسم كله.','Smoking and addictive substances harm the respiratory system and the whole body.')]},
 {id:'exc',view:'exc',title:S3('Boşaltım Sistemi ve Sağlığı','الجهاز الإخراجي وصحّته','Excretory System and Its Health'),
  fig:S3('Şekil 4. Boşaltım sistemi: kan süzülür, idrar oluşur.','الشكل 4. الجهاز الإخراجي: يُرشَّح الدم ويتكوّن البول.','Fig. 4. Excretory system: blood is filtered and urine forms.'),
  pts:[
   S3('Böbrekler kanı süzer; üre, fazla su ve tuzu idrar olarak uzaklaştırır.','الكليتان ترشّحان الدم وتُخرجان اليوريا والماء والأملاح الزائدة على شكل بول.','The kidneys filter the blood and remove urea, excess water and salts as urine.'),
   S3('Yol: böbrek → üreter → idrar kesesi → idrar kanalı.','الطريق: كلية ← حالب ← مثانة ← إحليل.','Path: kidney → ureter → bladder → urethra.'),
   S3('Boşaltıma deri (ter) ve akciğer (CO₂) da katkı yapar.','الجلد (العرق) والرئتان (ثاني أكسيد الكربون) تساهمان أيضًا في الإخراج.','Skin (sweat) and lungs (CO₂) also help excretion.'),
   S3('Bol su içmek böbrekleri korur ve vücudun su dengesini sağlar.','شرب الماء بكثرة يحمي الكليتين ويحفظ توازن الماء في الجسم.','Drinking enough water protects the kidneys and keeps water balance.')]},
 {id:'rev',view:null,title:S3('Ünite Sonu Değerlendirme','تقييم نهاية الوحدة','End-of-Unit Review'),
  fig:S3('Tıp tarihinden isimler ve ünite özeti.','أسماء من تاريخ الطب وملخص الوحدة.','Names from medical history and a unit summary.'),
  pts:[
   S3('Beş sistem birlikte çalışır: sindirim besini hazırlar, dolaşım taşır, solunum oksijeni getirir, boşaltım atığı uzaklaştırır.','تعمل الأجهزة معًا: الهضم يجهّز الغذاء، والدوران ينقله، والتنفّس يجلب الأكسجين، والإخراج يزيل الفضلات.','The systems work together: digestion prepares food, circulation carries it, breathing brings oxygen, excretion removes waste.'),
   S3('Cevaplarını önce tahmin et, sonra kontrol et.','خمّن إجاباتك أولًا ثم تحقّق منها.','Guess your answers first, then check them.')]}
];

/* organ dictionary: id -> {n:name, d:description} */
const ORG={};
const O=(id,n,d)=>{ORG[id]={n,d};};
/* digestive */
O('mouth',S3('Ağız','الفم','Mouth'),S3('Dişler besini parçalar (mekanik sindirim). Tükürükteki amilaz, karbonhidratların (nişasta) kimyasal sindirimini başlatır.','تقطّع الأسنان الطعام (هضم ميكانيكي)، ويبدأ الأميلاز في اللعاب الهضم الكيميائي للكربوهيدرات (النشا).','Teeth break food up (mechanical digestion). Salivary amylase starts the chemical digestion of carbohydrates (starch).'));
O('salivary',S3('Tükürük bezleri','الغدد اللعابية','Salivary glands'),S3('Amilaz içeren tükürük salgılar; besini nemlendirir ve nişasta sindirimini başlatır.','تفرز لعابًا يحتوي على الأميلاز يرطّب الطعام ويبدأ هضم النشا.','They secrete saliva containing amylase, which moistens food and starts starch digestion.'));
O('pharynx',S3('Yutak','البلعوم','Pharynx'),S3('Lokma yutulur ve yemek borusuna yönlenir. Burada sindirim olmaz.','تُبتلع اللقمة وتُوجَّه إلى المريء. لا يحدث هضم هنا.','The swallowed bolus is directed into the esophagus. No digestion happens here.'));
O('esophagus',S3('Yemek borusu','المريء','Esophagus'),S3('Kasların dalgalı (peristaltik) hareketiyle lokmayı mideye iter. Sindirim olmaz.','تدفع حركة العضلات المتموّجة (التمعّجية) اللقمة نحو المعدة. لا يحدث هضم.','Wave-like muscle movements (peristalsis) push the bolus to the stomach. No digestion happens here.'));
O('stomach',S3('Mide','المعدة','Stomach'),S3('Mide asidi ve pepsin proteinlerin kimyasal sindirimini başlatır; mide kasları besini karıştırır (mekanik sindirim).','يبدأ حمض المعدة والبيبسين الهضم الكيميائي للبروتينات، وتخلط عضلاتها الطعام (هضم ميكانيكي).','Stomach acid and pepsin start the chemical digestion of proteins; stomach muscles churn the food (mechanical digestion).'));
O('liver',S3('Karaciğer','الكبد','Liver'),S3('Safra üretir; safra yağları küçük damlacıklara ayırır (enzim içermez). Besinleri depolar, zararlı maddeleri etkisiz hale getirir. Yardımcı organdır.','يُنتج الصفراء التي تفتّت الدهون إلى قطيرات (لا تحتوي إنزيمات)، ويخزّن المغذّيات ويُحيّد المواد الضارّة. عضو مساعد.','Makes bile, which breaks fats into droplets (no enzymes). Stores nutrients and neutralises harmful substances. A helper organ.'));
O('gallbladder',S3('Safra kesesi','المرارة','Gallbladder'),S3('Safrayı depolar ve ince bağırsağa verir.','تخزّن الصفراء وتُفرغها في الأمعاء الدقيقة.','Stores bile and releases it into the small intestine.'));
O('pancreas',S3('Pankreas','البنكرياس','Pancreas'),S3('Karbonhidrat, protein ve yağları sindiren enzimleri ince bağırsağa salgılar. İnsülin hormonunu da üretir. Yardımcı organdır.','يفرز إنزيمات تهضم الكربوهيدرات والبروتينات والدهون في الأمعاء الدقيقة، وينتج هرمون الإنسولين. عضو مساعد.','Secretes enzymes into the small intestine that digest carbohydrates, proteins and fats. Also makes insulin. A helper organ.'));
O('small',S3('İnce bağırsak','الأمعاء الدقيقة','Small intestine'),S3('Safra ve pankreas enzimleri gelir, sindirim tamamlanır. Besinler villuslar aracılığıyla kana emilir.','تصل الصفراء وإنزيمات البنكرياس فيكتمل الهضم، وتُمتصّ المغذّيات إلى الدم عبر الزغابات.','Bile and pancreatic enzymes arrive and digestion is completed. Nutrients are absorbed into the blood through villi.'));
O('large',S3('Kalın bağırsak','الأمعاء الغليظة','Large intestine'),S3('Su ve mineraller emilir; sindirilemeyen artıklar dışkıya dönüşür.','يُمتصّ الماء والأملاح، وتتحوّل البقايا غير المهضومة إلى براز.','Water and minerals are absorbed; undigested leftovers form feces.'));
O('anus',S3('Rektum ve anüs','المستقيم والشرج','Rectum and anus'),S3('Dışkı geçici depolanır ve anüsten dışarı atılır.','يُخزَّن البراز مؤقتًا ثم يُطرح عبر الشرج.','Feces are stored briefly then expelled through the anus.'));
/* digestive close-up */
O('villus',S3('Villus','الزغابة','Villus'),S3('İnce bağırsağın iç yüzeyindeki parmak şeklinde çıkıntılardır; yüzeyi büyütür, emilimi hızlandırır.','نتوءات إصبعية على جدار الأمعاء الدقيقة؛ تزيد مساحة السطح فتسرّع الامتصاص.','Finger-like bumps lining the small intestine; they increase surface area and speed up absorption.'));
O('vcap',S3('Kılcal damar','الشعيرة الدموية','Capillary'),S3('Glikoz, amino asit, vitamin ve mineraller buradan kana geçer.','تنتقل منها الجلوكوز والأحماض الأمينية والفيتامينات والأملاح إلى الدم.','Glucose, amino acids, vitamins and minerals pass into the blood here.'));
O('lacteal',S3('Lenf kılcalı','الوعاء اللمفي','Lacteal'),S3('Yağ asitleri ve gliserol buradan lenfe geçer.','تنتقل منه الأحماض الدهنية والغليسرول إلى اللمف.','Fatty acids and glycerol pass into the lymph here.'));
O('lumen',S3('Bağırsak boşluğu','تجويف الأمعاء','Gut lumen'),S3('Sindirilmiş besinler (glikoz, amino asit, yağ asidi) burada villusların yanından geçer.','تمرّ فيه المغذّيات المهضومة (جلوكوز وأحماض أمينية وأحماض دهنية) بجانب الزغابات.','Digested nutrients (glucose, amino acids, fatty acids) drift past the villi here.'));
/* circulatory */
O('ra',S3('Sağ kulakçık','الأذين الأيمن','Right atrium'),S3('Vücuttan gelen oksijence fakir (kirli) kanı ana toplardamarlardan alır.','يستقبل الدم قليل الأكسجين من الجسم عبر الوريدين الأجوفين.','Receives oxygen-poor blood from the body through the venae cavae.'));
O('rv',S3('Sağ karıncık','البطين الأيمن','Right ventricle'),S3('Kanı akciğer atardamarıyla akciğerlere pompalar (küçük dolaşım).','يضخّ الدم إلى الرئتين عبر الشريان الرئوي (الدورة الصغرى).','Pumps blood to the lungs through the pulmonary artery (pulmonary loop).'));
O('la',S3('Sol kulakçık','الأذين الأيسر','Left atrium'),S3('Akciğerlerden gelen oksijence zengin (temiz) kanı akciğer toplardamarlarıyla alır.','يستقبل الدم الغني بالأكسجين من الرئتين عبر الأوردة الرئوية.','Receives oxygen-rich blood from the lungs through the pulmonary veins.'));
O('lv',S3('Sol karıncık','البطين الأيسر','Left ventricle'),S3('Duvarı en kalın boşluktur; temiz kanı aortla tüm vücuda pompalar (büyük dolaşım).','أسمك جدران القلب؛ يضخّ الدم الغني بالأكسجين إلى الجسم عبر الأبهر (الدورة الكبرى).','Has the thickest wall; pumps oxygen-rich blood to the whole body through the aorta (systemic loop).'));
O('aorta',S3('Aort (ana atardamar)','الأبهر (الشريان الأكبر)','Aorta'),S3('Kalpten çıkan temiz kanı vücuda taşıyan en büyük atardamardır.','أكبر شريان؛ يحمل الدم الغني بالأكسجين من القلب إلى الجسم.','The largest artery; carries oxygen-rich blood from the heart to the body.'));
O('vena',S3('Ana toplardamarlar','الوريدان الأجوفان','Venae cavae'),S3('Vücuttan kirli kanı kalbin sağ kulakçığına getirir.','يعيدان الدم قليل الأكسجين من الجسم إلى الأذين الأيمن.','Bring oxygen-poor blood from the body back to the right atrium.'));
O('pulmart',S3('Akciğer atardamarı','الشريان الرئوي','Pulmonary artery'),S3('Kirli kanı kalpten akciğerlere taşır — kirli kan taşıyan tek atardamar.','يحمل الدم قليل الأكسجين من القلب إلى الرئتين — الشريان الوحيد الذي يحمل دمًا قليل الأكسجين.','Carries oxygen-poor blood from the heart to the lungs — the only artery with oxygen-poor blood.'));
O('pulmvein',S3('Akciğer toplardamarı','الوريد الرئوي','Pulmonary vein'),S3('Temiz kanı akciğerlerden kalbe getirir — temiz kan taşıyan tek toplardamar.','يحمل الدم الغني بالأكسجين من الرئتين إلى القلب — الوريد الوحيد الذي يحمل دمًا غنيًا بالأكسجين.','Brings oxygen-rich blood from the lungs to the heart — the only vein with oxygen-rich blood.'));
O('capillary',S3('Kılcal damarlar','الشعيرات الدموية','Capillaries'),S3('Duvarı tek hücre kalınlığındadır; kan ile hücreler arasında madde ve gaz alışverişi burada olur.','جدارها بسُمك خلية واحدة؛ فيها يحدث تبادل المواد والغازات بين الدم والخلايا.','Walls one cell thick; substances and gases are exchanged between blood and cells here.'));
O('lungs',S3('Akciğerler','الرئتان','Lungs'),S3('Gaz alışverişinin yapıldığı organlardır. Sağ akciğer sol akciğerden büyüktür (kalbe yer açılır).','عضوان يتم فيهما تبادل الغازات. الرئة اليمنى أكبر من اليسرى لأن القلب يأخذ مكانًا.','Where gas exchange happens. The right lung is bigger than the left (the heart takes space).'));
/* blood close-up */
O('rbc',S3('Alyuvar (eritrosit)','الكريات الحمراء','Red blood cell'),S3('Hemoglobin sayesinde oksijen taşır. Çekirdeksizdir, iki yüzü çukur disk şeklindedir.','تنقل الأكسجين بفضل الهيموغلوبين؛ بلا نواة وشكلها قرص مقعّر الوجهين.','Carries oxygen using hemoglobin; no nucleus, biconcave disc shape.'));
O('wbc',S3('Akyuvar (lökosit)','الكريات البيضاء','White blood cell'),S3('Vücudu mikroplara karşı savunur. Çekirdekleri vardır.','تدافع عن الجسم ضدّ الجراثيم؛ لها نواة.','Defends the body against germs; has a nucleus.'));
O('platelet',S3('Kan pulcukları (trombosit)','الصفائح الدموية','Platelets'),S3('Kanın pıhtılaşmasını sağlar, kanamayı durdurur.','تساعد على تخثّر الدم وإيقاف النزف.','Help blood clot and stop bleeding.'));
O('plasma',S3('Kan plazması','البلازما','Plasma'),S3('Kanın sıvı kısmıdır (yaklaşık %55); su, besin, hormon ve atık taşır.','الجزء السائل من الدم (نحو 55%)؛ تحمل الماء والمغذّيات والهرمونات والفضلات.','The liquid part of blood (~55%); carries water, nutrients, hormones and wastes.'));
/* respiratory */
O('nose',S3('Burun','الأنف','Nose'),S3('Havayı süzer, nemlendirir ve ısıtır.','يرشّح الهواء ويرطّبه ويدفّئه.','Filters, moistens and warms the air.'));
O('rpharynx',S3('Yutak','البلعوم','Pharynx'),S3('Hava ve besinin ortak yoludur.','ممرّ مشترك للهواء والطعام.','The shared pathway for air and food.'));
O('larynx',S3('Gırtlak','الحنجرة','Larynx'),S3('Ses telleri burada bulunur; yutarken epiglot soluk borusunu kapatır.','فيها الأحبال الصوتية؛ ويغلق لسان المزمار القصبة الهوائية أثناء البلع.','Holds the vocal cords; the epiglottis closes the windpipe when swallowing.'));
O('trachea',S3('Soluk borusu','القصبة الهوائية','Trachea'),S3('Kıkırdak halkalarla açık kalır; içi kirpikli, mukuslu hücrelerle kaplıdır ve havayı temizler.','تبقى مفتوحة بحلقات غضروفية، وتبطّنها خلايا مهدّبة مخاطية تنقّي الهواء.','Kept open by cartilage rings; lined with ciliated, mucus-making cells that clean the air.'));
O('bronchi',S3('Bronşlar ve bronşçuklar','القصبات والقُصيبات','Bronchi and bronchioles'),S3('Havayı akciğerlerdeki alveollere dağıtan dallanmış borulardır.','أنابيب متفرّعة توزّع الهواء على الأسناخ في الرئتين.','Branching tubes that distribute air to the alveoli in the lungs.'));
O('rlungs',S3('Akciğerler','الرئتان','Lungs'),ORG.lungs.d);
O('alveoli',S3('Alveoller (hava keseleri)','الأسناخ (الحويصلات الهوائية)','Alveoli (air sacs)'),S3('Duvarları çok incedir ve kılcal damarlarla sarılıdır. Gaz alışverişi (difüzyon) burada olur.','جدرانها رقيقة جدًا وتحيط بها الشعيرات الدموية؛ فيها يحدث تبادل الغازات بالانتشار.','Very thin walls wrapped in capillaries; gas exchange by diffusion happens here.'));
O('diaphragm',S3('Diyafram','الحجاب الحاجز','Diaphragm'),S3('Solunuma yardım eden kas: nefes alırken kasılıp düzleşir, nefes verirken gevşeyip yukarı çıkar.','عضلة تساعد التنفّس: تنقبض وتنبسط عند الشهيق وترتخي وترتفع عند الزفير.','A muscle that drives breathing: contracts and flattens on inhale, relaxes and rises on exhale.'));
O('ribs',S3('Kaburgalar','الأضلاع','Ribs'),S3('Akciğerleri korur; nefes alırken yukarı-öne hareket eder, göğüs kafesi genişler.','تحمي الرئتين؛ عند الشهيق ترتفع وتتحرّك للأمام فيتّسع القفص الصدري.','Protect the lungs; on inhale they move up and out, widening the chest.'));
O('bronchiole',S3('Bronşçuk','القُصيبة','Bronchiole'),S3('Havayı alveollere taşıyan en ince hava borusu.','أدقّ أنبوب هوائي يحمل الهواء إلى الأسناخ.','The finest air tube carrying air to the alveoli.'));
O('alv',S3('Alveol','السنخ','Alveolus'),S3('Duvarı tek hücre kalınlığında hava kesesi. O₂ kana, CO₂ alveole geçer.','كيس هوائي جداره بسُمك خلية واحدة. ينتقل O₂ إلى الدم وCO₂ إلى السنخ.','An air sac with a wall one cell thick. O₂ moves into the blood, CO₂ into the alveolus.'));
O('acap',S3('Kılcal damar ağı','شبكة الشعيرات','Capillary network'),S3('Alveolü saran kılcal damarlar: kan buradan oksijen alır, karbondioksit verir.','شعيرات تحيط بالسنخ: يأخذ الدم منها الأكسجين ويُعطيها ثاني أكسيد الكربون.','Capillaries around the alveolus: blood takes up oxygen and gives away carbon dioxide.'));
/* excretory */
O('kidney',S3('Böbrekler','الكليتان','Kidneys'),S3('Kanı süzer; üre, fazla su ve tuzu uzaklaştırarak idrar oluşturur. Su-tuz dengesini ayarlar.','ترشّحان الدم وتُكوّنان البول بإزالة اليوريا والماء والأملاح الزائدة، وتنظّمان توازن الماء والأملاح.','Filter the blood and make urine by removing urea, excess water and salts; balance water and salt levels.'));
O('ureter',S3('Üreterler','الحالبان','Ureters'),S3('Böbrekten idrar kesesine idrarı taşıyan kaslı borulardır.','أنبوبان عضليان ينقلان البول من الكلية إلى المثانة.','Muscular tubes carrying urine from the kidney to the bladder.'));
O('bladder',S3('İdrar kesesi','المثانة','Urinary bladder'),S3('İdrarı geçici olarak depolar.','تخزّن البول مؤقتًا.','Temporarily stores urine.'));
O('urethra',S3('İdrar kanalı','الإحليل (مجرى البول)','Urethra'),S3('İdrarı vücut dışına atar.','يُخرج البول من الجسم.','Carries urine out of the body.'));
O('rartery',S3('Böbrek atardamarı','الشريان الكلوي','Renal artery'),S3('Süzülecek kanı böbreğe getirir.','يجلب الدم إلى الكلية ليُرشَّح.','Brings blood to the kidney to be filtered.'));
O('rvein',S3('Böbrek toplardamarı','الوريد الكلوي','Renal vein'),S3('Süzülmüş, temizlenmiş kanı böbrekten çıkarır.','يُخرج الدم المُرشَّح من الكلية.','Carries filtered blood away from the kidney.'));
O('eaorta',S3('Aort','الأبهر','Aorta'),ORG.aorta.d);
O('evena',S3('Alt ana toplardamar','الوريد الأجوف السفلي','Inferior vena cava'),ORG.vena.d);
/* nephron close-up */
O('glom',S3('Glomerulus','الكبيبة','Glomerulus'),S3('Kılcal damar yumağı: kandaki su, glikoz, tuz ve üre süzülür; kan hücreleri ve büyük moleküller geçemez.','كتلة شعيرات دموية: يُرشَّح منها الماء والجلوكوز والأملاح واليوريا، ولا تعبر الخلايا والجزيئات الكبيرة.','A tangle of capillaries: water, glucose, salts and urea are filtered out; blood cells and big molecules cannot pass.'));
O('bowman',S3('Bowman kapsülü','محفظة بومان','Bowman’s capsule'),S3('Glomerulustan süzülen sıvıyı toplar.','تجمع السائل المُرشَّح من الكبيبة.','Collects the fluid filtered from the glomerulus.'));
O('tubule',S3('Böbrek kanalı','الأنبوب الكلوي','Kidney tubule'),S3('Glikoz ve gerekli suyun çoğu kana geri emilir; atıklar kanalda kalır.','يُعاد امتصاص الجلوكوز ومعظم الماء اللازم إلى الدم، وتبقى الفضلات في الأنبوب.','Glucose and most useful water are reabsorbed into the blood; wastes stay in the tube.'));
O('collect',S3('Toplama kanalı','القناة الجامعة','Collecting duct'),S3('İdrarı böbrek havuzuna ve oradan üretere taşır.','تحمل البول إلى حوض الكلية ثم إلى الحالب.','Carries urine to the renal pelvis and then to the ureter.'));
O('pcap',S3('Kılcal damar','الشعيرة الدموية','Capillary'),S3('Böbrek kanalını saran kılcal damarlar geri emilen maddeleri kana alır.','شعيرات تحيط بالأنبوب وتستقبل المواد المُعاد امتصاصها.','Capillaries around the tube take the reabsorbed substances back into the blood.'));

/* stage texts for the digestive timeline: id -> organ id */
const DIG_STAGES=['mouth','pharynx','esophagus','stomach','small','large','anus'];

/* prediction questions: a = answer index, hl = organ id to highlight, go = optional demo target */
const Q={
 dig:[
  {q:S3('Proteinlerin kimyasal sindirimi nerede başlar?','أين يبدأ الهضم الكيميائي للبروتينات؟','Where does the chemical digestion of proteins begin?'),
   o:[S3('Ağız','الفم','Mouth'),S3('Mide','المعدة','Stomach'),S3('İnce bağırsak','الأمعاء الدقيقة','Small intestine')],a:1,hl:'stomach',go:3,
   e:S3('Mide asidi ve pepsin proteinleri sindirmeye başlar. (Karbonhidrat sindirimi ağızda başlar.)','حمض المعدة والبيبسين يبدآن هضم البروتينات. (هضم الكربوهيدرات يبدأ في الفم.)','Stomach acid and pepsin start digesting proteins. (Carbohydrate digestion starts in the mouth.)')},
  {q:S3('Hangisi sindirime YARDIMCI organdır (besin içinden geçmez)?','أيّ عضو مساعد للهضم (لا يمرّ الطعام داخله)؟','Which is a HELPER organ (food does not pass through it)?'),
   o:[S3('Yemek borusu','المريء','Esophagus'),S3('Mide','المعدة','Stomach'),S3('Karaciğer','الكبد','Liver')],a:2,hl:'liver',
   e:S3('Karaciğer ve pankreas yardımcı organlardır; lokma bunların içinden geçmez.','الكبد والبنكرياس عضوان مساعدان؛ لا تمرّ اللقمة داخلهما.','The liver and pancreas are helper organs; the bolus never passes through them.')}],
 cir:[
  {q:S3('Temiz kanı tüm vücuda pompalayan boşluk hangisidir?','أيّ حجرة تضخّ الدم الغني بالأكسجين إلى الجسم كله؟','Which chamber pumps oxygen-rich blood to the whole body?'),
   o:[S3('Sağ kulakçık','الأذين الأيمن','Right atrium'),S3('Sağ karıncık','البطين الأيمن','Right ventricle'),S3('Sol karıncık','البطين الأيسر','Left ventricle')],a:2,hl:'lv',
   e:S3('Sol karıncığın duvarı en kalındır; kanı aortla bütün vücuda gönderir.','جدار البطين الأيسر هو الأسمك؛ يرسل الدم عبر الأبهر إلى الجسم كله.','The left ventricle has the thickest wall; it sends blood through the aorta to the whole body.')},
  {q:S3('Akciğer atardamarı nasıl bir kan taşır?','أيّ دم يحمله الشريان الرئوي؟','What kind of blood does the pulmonary artery carry?'),
   o:[S3('Oksijence zengin (temiz)','غني بالأكسجين','Oxygen-rich'),S3('Oksijence fakir (kirli)','قليل الأكسجين','Oxygen-poor')],a:1,hl:'pulmart',
   e:S3('Akciğer atardamarı kirli kanı akciğere götürür; kan orada oksijen alır.','الشريان الرئوي يحمل دمًا قليل الأكسجين إلى الرئة ليأخذ الأكسجين.','The pulmonary artery carries oxygen-poor blood to the lungs, where it picks up oxygen.')}],
 res:[
  {q:S3('Gaz alışverişi nerede olur?','أين يحدث تبادل الغازات؟','Where does gas exchange happen?'),
   o:[S3('Soluk borusu','القصبة الهوائية','Trachea'),S3('Bronşlar','القصبات','Bronchi'),S3('Alveoller','الأسناخ','Alveoli')],a:2,hl:'alveoli',
   e:S3('Alveollerin duvarı çok incedir ve kılcal damarlarla sarılıdır.','جدران الأسناخ رقيقة جدًا وتحيط بها الشعيرات الدموية.','Alveoli have very thin walls wrapped in capillaries.')},
  {q:S3('Nefes alırken diyafram ne yapar?','ماذا يفعل الحجاب الحاجز عند الشهيق؟','What does the diaphragm do when you inhale?'),
   o:[S3('Gevşer ve yukarı çıkar','يرتخي ويرتفع','Relaxes and rises'),S3('Kasılır ve düzleşir','ينقبض وينبسط','Contracts and flattens')],a:1,hl:'diaphragm',
   e:S3('Diyafram kasılıp düzleşir, göğüs hacmi artar, hava içeri girer.','ينقبض الحجاب وينبسط فيزداد حجم الصدر ويدخل الهواء.','The diaphragm contracts and flattens, chest volume grows and air flows in.')}],
 exc:[
  {q:S3('Kanı süzen organ hangisidir?','أيّ عضو يرشّح الدم؟','Which organ filters the blood?'),
   o:[S3('Böbrek','الكلية','Kidney'),S3('İdrar kesesi','المثانة','Bladder'),S3('Üreter','الحالب','Ureter')],a:0,hl:'kidney',
   e:S3('Böbrekler kanı süzer ve idrarı oluşturur.','الكليتان ترشّحان الدم وتكوّنان البول.','The kidneys filter blood and make urine.')},
  {q:S3('Üreterin görevi nedir?','ما وظيفة الحالب؟','What does the ureter do?'),
   o:[S3('İdrarı böbrekten mesaneye taşır','ينقل البول من الكلية إلى المثانة','Carries urine from kidney to bladder'),S3('İdrarı vücut dışına atar','يُخرج البول من الجسم','Carries urine out of the body')],a:0,hl:'ureter',
   e:S3('Üreter böbrek ile idrar kesesini bağlar; idrar kesesinden dışarıyı idrar kanalı bağlar.','الحالب يصل الكلية بالمثانة؛ أما الإحليل فيوصل المثانة بالخارج.','The ureter links kidney and bladder; the urethra links bladder to the outside.')}]
};
const REVIEW=[
 {q:S3('İnce bağırsaktaki villusların görevi nedir?','ما وظيفة الزغابات في الأمعاء الدقيقة؟','What do the villi of the small intestine do?'),o:[S3('Besini parçalamak','تفتيت الطعام','Break food down'),S3('Yüzeyi artırıp emilimi hızlandırmak','زيادة السطح وتسريع الامتصاص','Increase surface and speed up absorption'),S3('Dışkıyı depolamak','تخزين البراز','Store feces')],a:1},
 {q:S3('Alyuvarın görevi nedir?','ما وظيفة الكريات الحمراء؟','What do red blood cells do?'),o:[S3('Mikroplarla savaşmak','محاربة الجراثيم','Fight germs'),S3('Oksijen taşımak','نقل الأكسجين','Carry oxygen'),S3('Kanı pıhtılaştırmak','تخثير الدم','Clot blood')],a:1},
 {q:S3('Soluk borusu neden kıkırdak halkalarla çevrilidir?','لماذا تحيط حلقات غضروفية بالقصبة الهوائية؟','Why is the trachea surrounded by cartilage rings?'),o:[S3('Açık kalması için','لتبقى مفتوحة','To stay open'),S3('Ses çıkarmak için','لإصدار الصوت','To make sound'),S3('Besini sindirmek için','لهضم الطعام','To digest food')],a:0},
 {q:S3('Kan bağışında kan grubu için hangisi doğrudur?','ما الصحيح عن فصائل الدم في التبرّع؟','Which is true about blood groups in donation?'),o:[S3('Gruplar uyumlu olmalıdır','يجب أن تتوافق الفصائل','Groups must be compatible'),S3('Hepsi herkese verilebilir','كل الفصائل تناسب الجميع','Any group suits anyone'),S3('Grup önemli değildir','الفصيلة غير مهمّة','Group does not matter')],a:0},
 {q:S3('Atık maddeleri kandan süzen yapı hangisidir?','أيّ بنية ترشّح الفضلات من الدم؟','Which structure filters wastes out of the blood?'),o:[S3('Böbrek','الكلية','Kidney'),S3('Karaciğer (safra)','الكبد','Liver'),S3('Mide','المعدة','Stomach')],a:0},
 {q:S3('Besinlerin kana emildiği ana organ hangisidir?','أيّ عضو هو الأساس في امتصاص الغذاء إلى الدم؟','Which organ mainly absorbs nutrients into the blood?'),o:[S3('Mide','المعدة','Stomach'),S3('İnce bağırsak','الأمعاء الدقيقة','Small intestine'),S3('Kalın bağırsak','الأمعاء الغليظة','Large intestine')],a:1}
];
