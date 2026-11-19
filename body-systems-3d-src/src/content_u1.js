/* ===== Fen Bilimleri 7 · Unit 1 · Uzay Çağı: labels, lesson map, organ texts ===== */
UI.unit=S3('Fen Bilimleri 7 · 1. Ünite','العلوم 7 · الوحدة 1','Science 7 · Unit 1');
UI.unitName=S3('Uzay Çağı','عصر الفضاء','The Space Age');
const LESSONS=[
 {id:'u1-0',view:'sat',title:S3('Uzay teknolojileri','تقنيات الفضاء','Space technology'),
  fig:S3("Şekil 1. Roket uyduyu yörüngeye taşır; uydu Dünya'nın etrafında döner.","الشكل 1. الصاروخ يحمل القمر الصناعي إلى المدار، فيدور حول الأرض.","Fig. 1. A rocket carries a satellite into orbit, where it circles the Earth.")},
 {id:'u1-1',view:'debris',title:S3('Uzay kirliliği','التلوّث الفضائي','Space pollution'),
  fig:S3("Şekil 2. Yörüngedeki enkaz, çalışan uydular için tehlike oluşturur.","الشكل 2. الحطام في المدار يشكّل خطرًا على الأقمار العاملة.","Fig. 2. Debris in orbit is a danger to working satellites.")},
 {id:'u1-2',view:'galaxy',title:S3('Yıldızlar, takımyıldızlar ve galaksiler','النجوم والكوكبات والمجرّات','Stars, constellations and galaxies'),
  fig:S3("Şekil 3. Samanyolu bir galaksidir; Büyükayı ise yıldızların oluşturduğu bir takımyıldızın parçasıdır.","الشكل 3. درب التبانة مجرّة، والدب الأكبر جزء من كوكبة من النجوم.","Fig. 3. The Milky Way is a galaxy; the Big Dipper is part of a constellation of stars.")},
 {id:'u1-3',view:'solar',title:S3('Güneş Sistemi ve uzay bilimi','النظام الشمسي وعلوم الفضاء','The Solar System and space science'),
  fig:S3("Şekil 4. Güneş Sistemi: gezegenler Güneş'in, Ay ise Dünya'nın etrafında döner.","الشكل 4. النظام الشمسي: الكواكب تدور حول الشمس، والقمر يدور حول الأرض.","Fig. 4. The Solar System: planets orbit the Sun, and the Moon orbits the Earth.")}
];
const Q={};
const ORG={};const O=(id,n,d)=>{ORG[id]={n,d};};
O('rocket',S3('Roket','الصاروخ','Rocket'),S3('Yakıtı yakıp gazı geriye iterek ileri gider (etki-tepki). Uyduları yörüngeye taşır.','يحرق الوقود ويدفع الغاز إلى الخلف فيندفع إلى الأمام (الفعل ورد الفعل). يحمل الأقمار إلى المدار.','It burns fuel and pushes gas backwards, so it moves forward (action and reaction). It carries satellites into orbit.'));
O('satellite',S3('Uydu','القمر الصناعي','Satellite'),S3('Yörüngede Dünya’yı döner. İletişim, hava durumu ve görüntüleme için kullanılır. Güneş panelleriyle elektrik üretir.','يدور حول الأرض في المدار. يُستخدم للاتصالات والطقس والتصوير، ويولّد الكهرباء بألواح شمسية.','It orbits the Earth. It is used for communication, weather and imaging, and makes electricity with solar panels.'));
O('earth',S3('Dünya','الأرض','Earth'),S3('Yaşadığımız gezegen. Uyduların yörüngelerinin merkezindedir.','الكوكب الذي نعيش عليه. وهي مركز مدارات الأقمار الصناعية.','The planet we live on. It is the centre of satellite orbits.'));
O('orbit',S3('Yörünge','المدار','Orbit'),S3('Bir uydunun ya da enkazın Dünya etrafında döndüğü yol. Alçak yörünge Dünya’ya daha yakındır.','المسار الذي يدور فيه القمر أو الحطام حول الأرض. المدار المنخفض أقرب إلى الأرض.','The path a satellite or debris follows around the Earth. Low orbit is closer to the Earth.'));
O('debris',S3('Uzay enkazı','الحطام الفضائي','Space debris'),S3('Görevi biten uydular, roket parçaları ve küçük parçalar. Çalışan uyduları ve uzay araçlarını tehlikeye atar.','الأقمار المنتهية مهمّتها وأجزاء الصواريخ والشظايا الصغيرة. تهدّد الأقمار العاملة والمركبات الفضائية.','Retired satellites, rocket parts and small fragments. They endanger working satellites and spacecraft.'));
O('galaxy',S3('Galaksi','المجرّة','Galaxy'),S3('Yıldızların, gazın ve tozun yerçekimiyle bir arada tutulduğu dev sistem. Samanyolu da bir galaksidir.','نظام هائل من النجوم والغاز والغبار تجمعه الجاذبية. ودرب التبانة مجرّة.','A giant system of stars, gas and dust held together by gravity. The Milky Way is a galaxy.'));
O('star',S3('Yıldız','النجم','Star'),S3('Kendi ışığını üreten gök cismi. Güneşimiz de bir yıldızdır.','جرم سماوي ينتج ضوءه بنفسه. وشمسنا نجم.','A celestial body that produces its own light. Our Sun is a star.'));
O('constellation',S3('Takımyıldız','الكوكبة','Constellation'),S3('Gökyüzünde yan yana görünen yıldızların hayali çizgilerle birleştirilmiş şekli. Büyükayı bir takımyıldızının parçasıdır.','شكل تصل فيه نجوم متجاورة في السماء بخطوط متخيّلة. والدب الأكبر جزء من كوكبة.','A pattern of stars that look close together in the sky, joined by imaginary lines. The Big Dipper is part of a constellation.'));
O('sun',S3('Güneş','الشمس','Sun'),S3('Güneş Sistemi’nin merkezindeki yıldız. Gezegenlerin hepsi onun çekimiyle yörüngelerinde döner.','النجم في مركز النظام الشمسي. تدور الكواكب حوله بفعل جاذبيته.','The star at the centre of the Solar System. All planets orbit it because of its gravity.'));
O('moon',S3('Ay','القمر','Moon'),S3('Dünya’nın doğal uydusu. Dünya’nın etrafında yaklaşık 27 günde bir tur atar.','التابع الطبيعي للأرض. يدور حولها دورة كل 27 يومًا تقريبًا.','Earth’s natural satellite. It goes around the Earth about once every 27 days.'));
O('mars',S3('Mars','المرّيخ','Mars'),S3('Güneş’e dördüncü en yakın gezegen. Kızıl renkli olduğu için “Kızıl Gezegen” de denir.','رابع كوكب من الشمس. يُسمّى الكوكب الأحمر لونه الأحمر.','The fourth planet from the Sun. It is called the Red Planet because of its colour.'));
