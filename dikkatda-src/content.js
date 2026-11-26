// Sayfa metinleri ve içerik verileri.
// Metinler şablon niteliğindedir; yayına almadan önce gözden geçirin.

/* Hizmet kategorisi -> ilgili çözümler */
const catSolutions = {
  'bilgi-teknolojileri': ['kurumsal-bt', 'yeni-isletme', 'akilli-ofis'],
  'sistem-ve-sunucu': ['kurumsal-bt', 'is-surekliligi', 'cok-subeli'],
  'network-ve-altyapi': ['cok-subeli', 'akilli-ofis', 'uzaktan-calisma'],
  'siber-guvenlik': ['veri-guvenligi', 'is-surekliligi', 'uzaktan-calisma'],
  'bulut-teknolojileri': ['uzaktan-calisma', 'kurumsal-iletisim', 'is-surekliligi'],
  'yedekleme-ve-veri-yonetimi': ['is-surekliligi', 'veri-guvenligi'],
  'yazilim-gelistirme': ['otomasyon', 'satis-pazarlama', 'dijital-donusum'],
  'web-tasarim-ve-gelistirme': ['dijital-marka', 'e-ticaret', 'musteri-kazanimi', 'yeni-isletme'],
  'dijital-pazarlama': ['musteri-kazanimi', 'satis-pazarlama', 'e-ticaret'],
  'seo-ve-analiz': ['musteri-kazanimi', 'e-ticaret', 'dijital-marka'],
  'sosyal-medya-yonetimi': ['dijital-marka', 'musteri-kazanimi', 'musteri-deneyimi'],
  'kreatif-tasarim-ve-produksiyon': ['dijital-marka', 'satis-pazarlama', 'yeni-isletme'],
  'yapay-zeka-ve-otomasyon': ['otomasyon', 'musteri-deneyimi', 'dijital-donusum'],
  'egitim-ve-danismanlik': ['dijital-donusum', 'veri-guvenligi', 'kurumsal-bt'],
};

const solutionLeads = {
  'kurumsal-bt': 'BT departmanınızı kurmak ya da büyütmek yerine, deneyimli ekibimizi kendi BT ekibiniz gibi kullanın.',
  'dijital-donusum': 'Mevcut durumunuzu ölçüyor, süreçlerinizi adım adım dijitale taşıyacak gerçekçi bir yol haritası çiziyoruz.',
  'cok-subeli': 'Tüm şubelerinizi tek merkezden yönetin; ortak altyapı, güvenli bağlantı ve standart süreçlerle.',
  'uzaktan-calisma': 'Ekibiniz nerede olursa olsun güvenli, hızlı ve verimli çalışabilsin.',
  'e-ticaret': 'Mağaza kurulumundan ödeme, kargo ve pazaryeri entegrasyonuna kadar satışa hazır bir e-ticaret altyapısı.',
  'musteri-kazanimi': 'Reklam, SEO ve içerikle doğru kitleye ulaşıyor, ziyaretçiyi potansiyel müşteriye dönüştürüyoruz.',
  'kurumsal-iletisim': 'Kurumsal e-posta, dosya paylaşımı ve toplantı sistemlerini tek, düzenli bir yapıda topluyoruz.',
  'is-surekliligi': 'Donanım arızası, siber saldırı ya da felaket anında bile işiniz kesintisiz devam etsin.',
  'veri-guvenligi': 'Verilerinizi doğru erişim kurallarıyla koruyor, güvenli şekilde saklıyor ve yedekliyoruz.',
  'otomasyon': 'Tekrarlayan işleri otomatikleştirerek ekibinizin zamanını değer üreten işlere ayırıyoruz.',
  'dijital-marka': 'Kurumsal kimlikten web sitesine, sosyal medyadan reklam diline kadar tutarlı bir dijital marka.',
  'satis-pazarlama': 'CRM, satış otomasyonu ve kampanya yönetimiyle satış ekibinizi ölçülebilir şekilde büyütün.',
  'musteri-deneyimi': 'Chatbot, destek talep sistemi ve çağrı merkezi çözümleriyle müşterilerinize hızlı ve tutarlı hizmet.',
  'akilli-ofis': 'Network, IP telefon, erişim kontrolü ve toplantı altyapısıyla ofisinizi akıllı ve verimli hâle getiriyoruz.',
  'yeni-isletme': 'Yeni kurulan işletmenizin BT altyapısını, web sitesini, markasını ve reklamlarını tek elden kuruyoruz.',
};

const sectorLeads = {
  'uretim-ve-sanayi': 'Üretim hattından ofise kesintisiz altyapı, güvenli veri ve otomasyonla verimli bir fabrika.',
  'perakende': 'Mağaza, e-ticaret ve pazaryerini birlikte yöneten, müşteriyi her kanalda yakalayan çözümler.',
  'e-ticaret': 'Trafik, dönüşüm ve operasyon tarafında satışlarınızı büyüten uçtan uca e-ticaret desteği.',
  'saglik': 'Hasta verisini koruyan, kesintisiz çalışan ve hasta deneyimini iyileştiren teknoloji altyapısı.',
  'egitim': 'Uzaktan eğitim, güvenli kampüs ağı ve öğrenci kazanımı için dijital çözümler.',
  'turizm-ve-otelcilik': 'Doğrudan rezervasyonu artıran pazarlama ve misafir deneyimini güçlendiren teknoloji.',
  'restoran-ve-kafe': 'Yerel görünürlük, online sipariş ve sadakat için sade ve etkili dijital çözümler.',
  'insaat': 'Şantiye ile merkez ofisi birbirine bağlayan, proje verisini güvende tutan altyapı.',
  'gayrimenkul': 'Portföyünüzü doğru alıcıyla buluşturan reklam, CRM ve satış otomasyonu.',
  'lojistik': 'Depo, filo ve ofisi kesintisiz bağlayan, operasyonu otomatikleştiren çözümler.',
  'otomotiv': 'Bayi ve servis ağınız için müşteri kazanımı, CRM ve çok şubeli altyapı.',
  'hukuk': 'Gizliliği esas alan güvenli dosya yönetimi, iletişim ve uzaktan çalışma altyapısı.',
  'finans-ve-muhasebe': 'Mevzuata uygun veri güvenliği, yedekleme ve rutin işleri azaltan otomasyon.',
  'guzellik-ve-kozmetik': 'Görsel ağırlıklı marka iletişimi, sosyal medya ve online satışla büyüme.',
  'tekstil-ve-moda': 'Koleksiyonlarınızı e-ticaret, pazaryeri ve sosyal medyada öne çıkaran çözümler.',
  'kobiler': 'Bütçenize uygun, büyüdükçe ölçeklenen BT ve dijital pazarlama paketleri.',
  'start-up-sirketleri': 'Hızlı başlangıç: altyapı, marka, web sitesi ve ilk müşterileriniz için büyüme desteği.',
};

const benefits = [
  ['users', 'Tek muhatap', 'Teknoloji ve pazarlama ihtiyaçlarınız için tek ekip, tek sözleşme.'],
  ['award', 'Uzman kadro', 'Her alanda deneyimli, sertifikalı uzmanlarla çalışırsınız.'],
  ['bars', 'Şeffaf raporlama', 'Yapılan her işi ve sonucunu düzenli raporlarla görürsünüz.'],
  ['headset', 'Hızlı destek', 'Uzaktan ve yerinde destekle sorunlar büyümeden çözülür.'],
];

const scope = [
  'İhtiyaç ve mevcut durum analizi',
  'Size özel çözüm tasarımı ve şeffaf teklif',
  'Kurulum, uygulama ve devreye alma',
  'Dokümantasyon ve ekip bilgilendirmesi',
  'Düzenli raporlama ve performans takibi',
  'Sürekli destek ve iyileştirme',
];

const packages = [
  { name: 'Başlangıç', note: 'Küçük ekipler ve ilk adımlar için', items: ['İhtiyaç analizi', 'Temel kurulum ve uygulama', 'E-posta ile destek', 'Aylık özet rapor'] },
  { name: 'Profesyonel', note: 'Büyüyen işletmeler için', featured: true, items: ['Detaylı analiz ve yol haritası', 'Gelişmiş uygulama', 'Öncelikli destek', 'Aylık performans toplantısı'] },
  { name: 'Kurumsal', note: 'Çok şubeli ve kurumsal yapılar için', items: ['Özel proje yöneticisi', 'SLA garantili destek', '7/24 izleme seçeneği', 'Çeyreklik strateji değerlendirmesi'] },
];

const serviceFaq = name => [
  [`${name} hizmeti ne kadar sürede tamamlanır?`, 'Süre, işin kapsamına ve mevcut altyapınıza göre değişir. Ön görüşmenin ardından adım adım bir iş planı ve net bir takvim paylaşıyoruz.'],
  ['Fiyatlandırma nasıl yapılıyor?', 'Proje bazlı ya da aylık hizmet modeliyle çalışıyoruz. İhtiyacınızı dinledikten sonra kalem kalem açıklanmış, sürprizsiz bir teklif sunuyoruz.'],
  ['Uzaktan mı, yerinde mi hizmet veriyorsunuz?', 'İkisi de mümkün. Uzaktan yapılabilen işleri hızlıca uzaktan çözüyor, gerektiğinde ekibimizi yerinde görevlendiriyoruz.'],
  ['Hizmet sonrası destek sağlıyor musunuz?', 'Evet. Tüm işlerimizde devreye alma sonrası destek veriyor, isteğe bağlı olarak aylık bakım ve destek anlaşması sunuyoruz.'],
];

const generalFaq = [
  ['DikkatDA hangi hizmetleri veriyor?', 'BT danışmanlığı ve teknik destekten sunucu, network, siber güvenlik ve bulut altyapısına; yazılım ve web geliştirmeden dijital pazarlama, SEO, sosyal medya ve kreatif prodüksiyona kadar geniş bir yelpazede hizmet veriyoruz.'],
  ['Hangi şehirlerde hizmet veriyorsunuz?', 'Merkezimiz İstanbul’dadır. Uzaktan yapılabilen hizmetleri Türkiye’nin her yerine, yerinde hizmetleri ise planlama dahilinde farklı şehirlere sunuyoruz.'],
  ['Küçük işletmelerle de çalışıyor musunuz?', 'Evet. KOBİ’ler ve yeni kurulan işletmeler için bütçeye uygun, büyüdükçe ölçeklenen paketlerimiz var.'],
  ['Teklif almak ücretli mi?', 'Hayır. Ön görüşme, ihtiyaç analizi ve teklif hazırlama süreçleri ücretsizdir.'],
  ['Sözleşme süresi ne kadar?', 'Proje bazlı işlerde süre projeyle sınırlıdır. Aylık hizmetlerde esnek süreler sunuyoruz; uzun dönem taahhüt zorunlu değildir.'],
  ['Mevcut BT firmamızdan geçiş zor olur mu?', 'Hayır. Devir teslim sürecini planlı yürütüyor, envanter ve dokümantasyonu çıkararak kesintisiz geçiş sağlıyoruz.'],
  ['Reklam bütçesini kim belirliyor?', 'Bütçe her zaman sizin kararınızdır. Hedeflerinize göre öneri sunuyor, harcamaları şeffaf şekilde raporluyoruz.'],
  ['Verilerimiz güvende mi?', 'Gizlilik sözleşmesi imzalıyor, erişimleri en az yetki prensibiyle veriyor ve KVKK’ya uygun çalışıyoruz.'],
];

const blogPosts = [
  { slug: 'dijital-donusumde-dogru-adimlar', title: 'Dijital Dönüşümde Doğru Adımlar', cat: 'Dijital Dönüşüm', date: '2026-11-12', thumb: 'thumb-4', read: 6,
    excerpt: 'Dijital dönüşüm büyük bütçeli bir proje değil, doğru sıralanmış küçük adımlar dizisidir.',
    body: [
      ['p', 'Dijital dönüşüm çoğu zaman pahalı yazılımlar ve uzun projelerle eşleştirilir. Oysa başarılı dönüşümler, işletmenin gerçek sorunlarından yola çıkan ve küçük adımlarla ilerleyen projelerdir.'],
      ['h2', '1. Mevcut durumu ölçün'],
      ['p', 'Hangi süreçlerin elle yürüdüğünü, hangi verilerin dağınık durduğunu ve ekibin en çok nerede zaman kaybettiğini listeleyin. Bu liste, yol haritanızın temelidir.'],
      ['h2', '2. Altyapıyı sağlamlaştırın'],
      ['p', 'Güvenilir bir ağ, düzenli yedekleme ve kurumsal e-posta olmadan üst katmandaki dijital araçlar verimli çalışmaz. Önce temeli sağlamlaştırın.'],
      ['h2', '3. Hızlı kazanımlarla başlayın'],
      ['p', 'Onay süreçleri, raporlama ve teklif hazırlama gibi tekrarlayan işleri otomatikleştirmek, kısa sürede görünür sonuç verir ve ekibin desteğini kazandırır.'],
      ['h2', '4. Ölçün ve iyileştirin'],
      ['p', 'Her adımın sonunda zaman, maliyet ve müşteri memnuniyetindeki değişimi ölçün. Dijital dönüşüm bir kez bitip kapanan bir proje değil, sürekli bir iyileştirme döngüsüdür.'],
    ] },
  { slug: 'isletmeler-icin-yapay-zeka-firsatlari', title: 'İşletmeler İçin Yapay Zekâ Fırsatları', cat: 'Yapay Zekâ', date: '2026-11-05', thumb: 'thumb-5', read: 7,
    excerpt: 'Yapay zekâ artık yalnızca büyük şirketlerin değil, her ölçekte işletmenin erişebildiği bir verimlilik aracı.',
    body: [
      ['p', 'Yapay zekâ araçları hem daha erişilebilir hem de daha kolay entegre edilebilir hâle geldi. Doğru kullanım alanını seçen işletmeler, kısa sürede ölçülebilir verim elde ediyor.'],
      ['h2', 'Müşteri hizmetleri'],
      ['p', 'Sık sorulan soruları yanıtlayan kurumsal chatbotlar, destek ekibinin yükünü azaltır ve müşterilere günün her saatinde yanıt verir.'],
      ['h2', 'Belge işleme'],
      ['p', 'Fatura, sözleşme ve form gibi belgelerden bilgi çıkarmak; elle veri girişini azaltır, hataları düşürür.'],
      ['h2', 'Raporlama ve analiz'],
      ['p', 'Farklı kaynaklardaki verileri özetleyen otomatik raporlar, yöneticilere karar için gereken bilgiyi zamanında sunar.'],
      ['h2', 'Nereden başlamalı?'],
      ['p', 'En çok zaman alan ve kuralları net olan tek bir süreçle başlayın. Küçük bir pilot projeyle sonucu ölçün, ardından başarılı uygulamayı yaygınlaştırın.'],
    ] },
  { slug: 'kobiler-icin-siber-guvenlik-kontrol-listesi', title: 'KOBİ’ler İçin Siber Güvenlik Kontrol Listesi', cat: 'Siber Güvenlik', date: '2026-10-28', thumb: 'thumb-3', read: 5,
    excerpt: 'Saldırganlar artık küçük işletmeleri de hedefliyor. Temel önlemlerle risklerin büyük bölümünü azaltabilirsiniz.',
    body: [
      ['p', 'Siber saldırıların önemli bir kısmı, temel güvenlik önlemleri alınmamış işletmeleri hedefler. Aşağıdaki kontrol listesi iyi bir başlangıç noktasıdır.'],
      ['h2', 'Temel kontroller'],
      ['ul', ['Tüm hesaplarda çok faktörlü kimlik doğrulama', 'İşletim sistemi ve yazılım güncellemeleri', 'Uç nokta güvenlik yazılımı', 'Güvenlik duvarı ve güncel kurallar', 'Düzenli ve test edilmiş yedekleme', 'Çalışanlara oltalama farkındalık eğitimi']],
      ['p', 'Bu adımların her birini düzenli aralıklarla gözden geçirmek, güvenlik seviyenizi sürekli yüksek tutar.'],
    ] },
  { slug: 'google-ads-butcesi-nasil-planlanir', title: 'Google Ads Bütçesi Nasıl Planlanır?', cat: 'Dijital Pazarlama', date: '2026-10-20', thumb: 'thumb-6', read: 6,
    excerpt: 'Reklam bütçesini tahminle değil, hedef satış ve dönüşüm oranından geriye doğru hesaplayın.',
    body: [
      ['p', 'Reklam bütçesi belirlerken “ayda ne kadar harcayabilirim?” yerine “ayda kaç satış hedefliyorum?” sorusuyla başlamak daha sağlıklı sonuç verir.'],
      ['h2', 'Geriye doğru hesaplama'],
      ['p', 'Hedef satış sayısını dönüşüm oranınıza bölerek gereken tıklama sayısını, bunu ortalama tıklama maliyetiyle çarparak gereken bütçeyi bulabilirsiniz. Ücretsiz reklam bütçesi hesaplayıcımız bu hesabı sizin için yapar.'],
      ['h2', 'Test ve ölçekleme'],
      ['p', 'İlk ay öğrenme dönemidir. Verileri topladıktan sonra iyi performans gösteren kampanyalara bütçe aktarın, kötü performans gösterenleri optimize edin ya da durdurun.'],
    ] },
  { slug: 'web-sitesi-hizi-neden-onemli', title: 'Web Sitesi Hızı Neden Önemli?', cat: 'Web ve SEO', date: '2026-10-11', thumb: 'thumb-1', read: 4,
    excerpt: 'Yavaş açılan bir site hem ziyaretçi kaybettirir hem de arama sıralamanızı olumsuz etkiler.',
    body: [
      ['p', 'Ziyaretçilerin önemli bir kısmı birkaç saniye içinde açılmayan sayfaları terk eder. Hız; dönüşüm oranını, reklam maliyetini ve SEO performansını doğrudan etkiler.'],
      ['h2', 'Hızı etkileyen başlıca unsurlar'],
      ['ul', ['Optimize edilmemiş görseller', 'Gereksiz eklenti ve betikler', 'Yetersiz hosting altyapısı', 'Önbellekleme eksikliği']],
      ['p', 'Ücretsiz site hız testi aracımızla sitenizin durumunu dakikalar içinde görebilirsiniz.'],
    ] },
  { slug: 'buluta-gecis-oncesi-bilinmesi-gerekenler', title: 'Buluta Geçiş Öncesi Bilinmesi Gerekenler', cat: 'Bulut', date: '2026-10-02', thumb: 'thumb-2', read: 6,
    excerpt: 'Buluta geçiş doğru planlandığında maliyeti düşürür, esnekliği artırır.',
    body: [
      ['p', 'Bulut; sunucu bakımı, donanım yenileme ve kapasite planlaması yükünü azaltır. Ancak plansız bir geçiş, beklenmedik maliyetlere yol açabilir.'],
      ['h2', 'Geçiş öncesi kontrol listesi'],
      ['ul', ['Hangi uygulamaların buluta uygun olduğunu belirleyin', 'Aylık maliyet tahmini yapın', 'Veri taşıma ve kesinti planı hazırlayın', 'Yedekleme ve güvenlik politikalarını güncelleyin']],
      ['p', 'Hibrit modeller, bazı sistemleri yerinde tutup diğerlerini buluta taşıyarak kademeli bir geçiş imkânı sunar.'],
    ] },
];

const glossary = [
  ['Active Directory', 'Windows ağlarında kullanıcı, bilgisayar ve yetkileri merkezi olarak yöneten dizin hizmeti.'],
  ['API', 'Farklı yazılımların birbirleriyle veri alışverişi yapmasını sağlayan arayüz.'],
  ['CDN', 'İçeriği kullanıcıya en yakın sunucudan ileterek siteyi hızlandıran dağıtım ağı.'],
  ['CRM', 'Müşteri ilişkilerini, satış fırsatlarını ve iletişim geçmişini yöneten yazılım.'],
  ['CTR', 'Tıklama oranı; reklam ya da bağlantıyı görenlerin ne kadarının tıkladığını gösterir.'],
  ['DMARC', 'SPF ve DKIM sonuçlarına göre sahte e-postalara ne yapılacağını belirleyen politika.'],
  ['DKIM', 'Gönderilen e-postaların dijital imzayla doğrulanmasını sağlayan yöntem.'],
  ['DNS', 'Alan adlarını IP adreslerine çeviren internet adres defteri.'],
  ['ERP', 'Finans, stok, üretim ve satış gibi süreçleri tek sistemde birleştiren kurumsal kaynak planlama yazılımı.'],
  ['Felaket kurtarma', 'Büyük bir arıza ya da saldırı sonrasında sistemleri ve verileri geri getirme planı.'],
  ['Firewall', 'Ağ trafiğini kurallara göre denetleyen güvenlik duvarı.'],
  ['Hibrit bulut', 'Yerinde sunucularla bulut altyapısını birlikte kullanan model.'],
  ['KPI', 'Hedeflere ulaşılıp ulaşılmadığını ölçen temel performans göstergesi.'],
  ['Landing page', 'Belirli bir kampanya ya da hedef için tasarlanmış tek amaçlı sayfa.'],
  ['NAS', 'Ağ üzerinden erişilen, dosya paylaşımı ve yedekleme için kullanılan depolama cihazı.'],
  ['Remarketing', 'Sitenizi daha önce ziyaret etmiş kişilere yeniden reklam gösterme yöntemi.'],
  ['ROAS', 'Reklam harcamasının getirisi; reklamdan elde edilen gelirin reklam maliyetine oranı.'],
  ['SaaS', 'Kurulum gerektirmeden internet üzerinden abonelikle kullanılan yazılım.'],
  ['SEO', 'Web sitesinin arama motorlarında daha üst sıralarda görünmesi için yapılan çalışmalar.'],
  ['SLA', 'Hizmet seviyesi anlaşması; yanıt ve çözüm sürelerini taahhüt eden sözleşme.'],
  ['SPF', 'Bir alan adı adına hangi sunucuların e-posta gönderebileceğini belirten DNS kaydı.'],
  ['SSL/TLS', 'Web sitesi ile ziyaretçi arasındaki trafiği şifreleyen güvenlik protokolü.'],
  ['Subnet', 'Bir IP ağının daha küçük, yönetilebilir alt ağlara bölünmesi.'],
  ['UTM', 'Trafiğin hangi kampanya ve kaynaktan geldiğini ölçmek için bağlantılara eklenen parametreler.'],
  ['Sanallaştırma', 'Tek fiziksel sunucu üzerinde birden fazla sanal sunucu çalıştırma teknolojisi.'],
  ['VLAN', 'Tek fiziksel ağ üzerinde mantıksal olarak ayrılmış sanal ağlar.'],
  ['VPN', 'İnternet üzerinden şifreli ve güvenli bağlantı kuran sanal özel ağ.'],
];

const positions = [
  ['Sistem ve Network Uzmanı', 'BT Altyapı', 'İstanbul · Tam zamanlı'],
  ['Yardım Masası Teknisyeni', 'Teknik Destek', 'İstanbul · Tam zamanlı'],
  ['Full Stack Geliştirici', 'Yazılım', 'Hibrit · Tam zamanlı'],
  ['Performans Pazarlama Uzmanı', 'Dijital Pazarlama', 'Hibrit · Tam zamanlı'],
  ['Sosyal Medya ve İçerik Uzmanı', 'Sosyal Medya', 'İstanbul · Tam zamanlı'],
  ['Grafik ve Motion Tasarımcı', 'Kreatif', 'Hibrit · Tam zamanlı'],
  ['Stajyer (Dönemlik)', 'Tüm departmanlar', 'İstanbul · Staj'],
];

const teams = [
  ['server', 'BT Altyapı Ekibi', 'Sunucu, network, sanallaştırma ve bulut altyapıları.'],
  ['headset', 'Teknik Destek Ekibi', 'Uzaktan ve yerinde kullanıcı desteği, bakım ve onarım.'],
  ['shield', 'Siber Güvenlik Ekibi', 'Güvenlik değerlendirmesi, uç nokta ve e-posta güvenliği.'],
  ['code', 'Yazılım Ekibi', 'Kuruma özel yazılım, mobil uygulama ve entegrasyonlar.'],
  ['globe', 'Web Ekibi', 'Kurumsal web, e-ticaret, UI/UX ve performans.'],
  ['megaphone', 'Performans Pazarlama Ekibi', 'Google, Meta, TikTok ve LinkedIn reklam yönetimi.'],
  ['search', 'SEO ve Analiz Ekibi', 'Teknik SEO, içerik stratejisi ve veri analizi.'],
  ['pen', 'Kreatif Ekip', 'Marka kimliği, grafik tasarım, video ve 3D prodüksiyon.'],
];

const technologies = ['Microsoft 365', 'Microsoft Azure', 'Google Workspace', 'Google Cloud', 'Amazon Web Services', 'Windows Server', 'Linux', 'VMware', 'Proxmox', 'Hyper-V', 'WordPress', 'Google Ads', 'Meta Ads', 'Google Analytics', 'Search Console', 'LinkedIn Ads'];

const references = [
  ['thumb-1', 'Kurumsal BT dönüşümü', 'Hizmet', 'kobiler', 'Dış kaynak BT, envanter ve lisans yönetimi'],
  ['thumb-2', 'Depo network altyapısı', 'Lojistik', 'lojistik', 'Kablosuz ağ, VLAN ve şubeler arası VPN'],
  ['thumb-3', 'Bulut ve yedekleme', 'Gayrimenkul', 'gayrimenkul', 'Microsoft 365 geçişi ve bulut yedekleme'],
  ['thumb-4', 'Kurumsal web sitesi', 'Üretim', 'uretim-ve-sanayi', 'Çok dilli web sitesi ve teknik SEO'],
  ['thumb-5', 'Yapay zekâ destekli destek', 'E-ticaret', 'e-ticaret', 'Kurumsal chatbot ve CRM otomasyonu'],
  ['thumb-6', 'Performans pazarlama', 'Perakende', 'perakende', 'Google Ads ve Meta Ads kampanyaları'],
  ['thumb-2', 'Akıllı ofis kurulumu', 'Hukuk', 'hukuk', 'Network, IP telefon ve erişim kontrolü'],
  ['thumb-3', 'Klinik altyapısı', 'Sağlık', 'saglik', 'Güvenlik duvarı, yedekleme ve uç nokta güvenliği'],
  ['thumb-4', 'Marka ve sosyal medya', 'Güzellik', 'guzellik-ve-kozmetik', 'Kurumsal kimlik, içerik üretimi ve Reels'],
];

/* Araç sayfaları: widget türü ve açıklama */
const tools = {
  'ucretsiz-web-sitesi-analizi': { w: 'psi', cats: ['performance', 'seo', 'accessibility', 'best-practices'], d: 'Sitenizin performans, SEO, erişilebilirlik ve en iyi uygulama puanlarını tek raporda görün.' },
  'site-hiz-testi': { w: 'psi', cats: ['performance'], d: 'Sayfanızın mobilde ne kadar hızlı açıldığını ve hangi metriklerin iyileştirilmesi gerektiğini öğrenin.' },
  'seo-on-analizi': { w: 'psi', cats: ['seo'], d: 'Sayfanızın temel SEO kontrollerinden geçip geçmediğini hızlıca kontrol edin.' },
  'ssl-sertifika-kontrolu': { w: 'lead', d: 'SSL sertifikanızın geçerlilik süresini, zincirini ve yapılandırmasını kontrol edip raporu e-postanıza gönderelim.' },
  'domain-sorgulama': { w: 'domain', d: 'Bir alan adının DNS’te kayıtlı olup olmadığını ve hangi ad sunucularını kullandığını görün.' },
  'dns-kontrolu': { w: 'dns', d: 'Alan adınızın A, AAAA, MX, NS, TXT ve CNAME kayıtlarını sorgulayın.' },
  'spf-dkim-ve-dmarc-kontrolu': { w: 'mailauth', d: 'E-postalarınızın spam’e düşmemesi için gereken SPF, DKIM ve DMARC kayıtlarını kontrol edin.' },
  'ip-adresim-nedir': { w: 'ip', d: 'İnternete çıktığınız genel IP adresinizi öğrenin.' },
  'subnet-hesaplayici': { w: 'subnet', d: 'IP adresi ve CIDR değerinden ağ adresi, yayın adresi, maske ve kullanılabilir host aralığını hesaplayın.' },
  'qr-kod-olusturucu': { w: 'qr', d: 'Web sitesi, menü ya da kampanya bağlantınız için ücretsiz QR kod oluşturun.' },
  'utm-baglanti-olusturucu': { w: 'utm', d: 'Kampanya trafiğinizi Google Analytics’te doğru ölçmek için UTM parametreli bağlantılar oluşturun.' },
  'reklam-butcesi-hesaplayici': { w: 'budget', d: 'Hedef satış sayınızdan yola çıkarak aylık ve günlük reklam bütçenizi hesaplayın.' },
  'roas-hesaplayici': { w: 'roas', d: 'Reklam harcamanızın getirisini ve başa baş ROAS değerinizi hesaplayın.' },
  'kdv-hesaplayici': { w: 'kdv', d: 'KDV dahil ve KDV hariç tutarları saniyeler içinde hesaplayın.' },
  'gorsel-boyutlandirma': { w: 'resize', d: 'Görsellerinizi sosyal medya ölçülerine tarayıcınızda, yükleme yapmadan boyutlandırın.' },
  'dijital-donusum-ihtiyac-testi': { w: 'quiz', d: 'Birkaç soruyla işletmenizin dijital olgunluk seviyesini ve öncelikli ihtiyaçlarını öğrenin.' },
  'ucretsiz-on-danismanlik': { w: 'lead', d: 'Uzmanlarımızla 15 dakikalık ücretsiz bir ön görüşme planlayın.' },
  'ucretsiz-egitim-ve-rehberler': { w: 'lead', d: 'Dijital dönüşüm, siber güvenlik ve dijital pazarlama rehberlerimizi ücretsiz edinin.' },
  'bt-ihtiyac-analizi': { w: 'lead', name: 'BT ihtiyaç analizi', icon: 'layers', d: 'Mevcut BT altyapınızı değerlendirip öncelikli ihtiyaçlarınızı içeren bir rapor hazırlayalım.' },
  'reklam-hesabi-on-analizi': { w: 'lead', name: 'Reklam hesabı ön analizi', icon: 'megaphone', d: 'Google Ads ya da Meta Ads hesabınızı inceleyip bütçe israfı ve iyileştirme fırsatlarını raporlayalım.' },
};

const announcements = [
  ['2026-11-01', 'Ücretsiz araçlar menümüz yayında', 'Site hız testi, DNS kontrolü, ROAS hesaplayıcı ve daha fazlası artık ücretsiz.'],
  ['2026-10-15', 'Yapay zekâ eğitim programı başlıyor', 'Kurumsal ekipler için uygulamalı yapay zekâ eğitimlerimize kayıtlar açıldı.'],
  ['2026-09-20', 'Yeni web sitemiz yayında', 'Hizmetlerimizi ve çözümlerimizi daha kolay keşfetmeniz için sitemizi yeniledik.'],
];

const webinars = [
  ['Aralık 2026', 'KOBİ’ler için siber güvenlik temelleri', 'Siber Güvenlik'],
  ['Ocak 2027', 'Google Ads ile ilk 90 gün', 'Dijital Pazarlama'],
  ['Şubat 2027', 'Yapay zekâ ile iş süreçleri otomasyonu', 'Yapay Zekâ'],
];

const guides = [
  ['shield', 'Siber güvenlik başlangıç rehberi', 'KOBİ’ler için 20 maddelik uygulanabilir güvenlik kontrol listesi.'],
  ['cloud-up', 'Buluta geçiş rehberi', 'Planlamadan taşımaya, adım adım bulut geçiş süreci.'],
  ['megaphone', 'Dijital reklam planlama şablonu', 'Bütçe, hedef ve kanal planlaması için hazır şablon.'],
  ['search', 'SEO kontrol listesi', 'Teknik, içerik ve yerel SEO için temel kontroller.'],
  ['refresh', 'Dijital dönüşüm yol haritası', 'İşletmenizi dijitale taşımak için aşama aşama plan.'],
  ['database', 'Yedekleme stratejisi rehberi', '3-2-1 kuralı ve felaket kurtarma planlaması.'],
];

module.exports = { catSolutions, solutionLeads, sectorLeads, benefits, scope, packages, serviceFaq, generalFaq, blogPosts, glossary, positions, teams, technologies, references, tools, announcements, webinars, guides };
