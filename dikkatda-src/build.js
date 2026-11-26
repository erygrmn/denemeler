// DikkatDA statik site üreticisi
// Kullanım:  node dikkatda-src/build.js
// Çıktı:     dikkatda/ klasörü (index.html + tüm alt sayfalar, sitemap.xml, robots.txt)
const L = require('./layout');
const C = require('./content');
const { fs, path, slug, esc, I, serviceGroups, allServices, solutions, sectors, toolCols, resources, company, steps, page, homeMain, ld } = L;

const OUT = path.resolve(__dirname, '../dikkatda');
const SITE = 'https://www.dikkatda.com/';
const written = [];

function write(p, opts) {
  const html = page({ ...opts, path: p });
  const file = path.join(OUT, p);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html, 'utf8');
  written.push(p);
}

/* ============ Ortak bileşenler ============ */
const solById = Object.fromEntries(solutions.map(s => [s.id, s]));
const secById = Object.fromEntries(sectors.map(s => [s.id, s]));
const catBySlug = Object.fromEntries(allServices.map(s => [slug(s.name), s]));
const toolList = toolCols.flatMap(c => c.items.map(([n, ic]) => ({ name: n, icon: ic, slug: slug(n), group: c.title })));
Object.entries(C.tools).forEach(([k, t]) => { if (t.name && !toolList.find(x => x.slug === k)) toolList.push({ name: t.name, icon: t.icon, slug: k, group: 'Ücretsiz Analizler', hidden: true }); });

const fmtDate = d => new Date(d + 'T00:00:00').toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });

function crumbsHtml(crumbs) {
  return `<nav class="breadcrumb" aria-label="Sayfa yolu"><ol>${crumbs.map(([n, h], i) => i === crumbs.length - 1
    ? `<li aria-current="page">${n}</li>` : `<li><a href="${h}">${n}</a></li>`).join('')}</ol></nav>`;
}
function crumbLd(crumbs) {
  return { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: crumbs.map(([n, h], i) => ({ '@type': 'ListItem', position: i + 1, name: n, ...(h ? { item: SITE + (h === 'index.html' ? '' : h) } : {}) })) };
}
const HOME = ['Ana Sayfa', 'index.html'];

const defaultActions = `<a class="btn btn-primary" href="teklif-al.html">${I('send')}Teklif Al</a>
          <a class="btn btn-outline-light" href="ucretsiz-araclar/ucretsiz-on-danismanlik.html">${I('calendar')}Ücretsiz Ön Görüşme</a>`;

function hero({ crumbs, eyebrow, title, lead, icon, actions = defaultActions, aside = '', compact = false }) {
  return `  <section class="page-hero${compact ? ' compact' : ''}">
    <div class="container page-hero-inner">
      <div class="page-hero-text">
        ${crumbsHtml(crumbs)}
        ${icon ? `<span class="hero-icon">${I(icon)}</span>` : ''}
        ${eyebrow ? `<span class="hero-eyebrow">${eyebrow}</span>` : ''}
        <h1>${title}</h1>
        ${lead ? `<p class="hero-lead">${lead}</p>` : ''}
        ${actions ? `<div class="hero-actions">${actions}</div>` : ''}
      </div>
      ${aside}
    </div>
  </section>`;
}

function section(title, sub, inner, cls = '', id = '') {
  return `  <section class="section ${cls}"${id ? ` id="${id}"` : ''}>
    <div class="container">
      ${title ? `<div class="row-head"><h2>${title}</h2>${sub ? `<p>${sub}</p>` : ''}</div>` : ''}
${inner}
    </div>
  </section>`;
}

function cta(title = 'Dijital dönüşümünüzü<br>birlikte <span class="accent">planlayalım.</span>', text = 'İhtiyaçlarınızı konuşalım, size özel çözümü birlikte tasarlayalım.') {
  return `  <section class="section-sm">
    <div class="container">
      <div class="cta-banner">
        <div class="cta-inner">
          <h2>${title}</h2>
          <span class="cta-divider" aria-hidden="true"></span>
          <div><p>${text}</p><a class="btn btn-primary" href="teklif-al.html">${I('send')}Teklif Al</a></div>
        </div>
      </div>
    </div>
  </section>`;
}

function leadForm({ title = 'Ücretsiz ön görüşme talep edin', intro = 'Formu doldurun, uzmanlarımız en geç 1 iş günü içinde size dönüş yapsın.', subject, extra = '', button = 'Gönder', id = 'form' }) {
  return `<form class="lead-form js-form" id="${id}" action="#" method="post" novalidate>
        <h3>${title}</h3>
        <p class="form-intro">${intro}</p>
        <input type="hidden" name="konu" value="${esc(subject)}">
        <div class="form-grid">
          <label class="field"><span>Ad Soyad *</span><input name="ad" required autocomplete="name"></label>
          <label class="field"><span>Firma</span><input name="firma" autocomplete="organization"></label>
          <label class="field"><span>E-posta *</span><input type="email" name="eposta" required autocomplete="email"></label>
          <label class="field"><span>Telefon</span><input type="tel" name="telefon" autocomplete="tel"></label>
          ${extra}
          <label class="field full"><span>Mesajınız</span><textarea name="mesaj" rows="4"></textarea></label>
        </div>
        <label class="check"><input type="checkbox" name="kvkk" required><span><a href="kurumsal/kvkk.html">KVKK Aydınlatma Metni</a>’ni okudum ve kabul ediyorum. *</span></label>
        <button class="btn btn-primary" type="submit">${I('send')}${button}</button>
        <div class="form-success" role="status" hidden>${I('check')}<div><strong>Teşekkürler!</strong><span>Talebiniz alındı. En kısa sürede sizinle iletişime geçeceğiz.</span></div></div>
      </form>`;
}

function faq(items, title = 'Sıkça Sorulan <span class="accent">Sorular</span>') {
  const html = section(title, '', `      <div class="faq">
${items.map(([q, a], i) => `        <details${i === 0 ? ' open' : ''}><summary>${q}${I('chevron-down')}</summary><p>${a}</p></details>`).join('\n')}
      </div>`);
  const ldObj = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: items.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) };
  return { html, ld: ldObj };
}

const processBlock = () => `      <div class="process">
${steps.map(([n, ic, d], i) => `        <div class="step">${I(ic)}<div><span class="step-num">0${i + 1}</span><h3>${n}</h3><p>${d}</p></div></div>`).join(`\n        ${I('arrow-right', 'step-arrow')}\n`)}
      </div>`;

const benefitGrid = () => `      <div class="feature-grid">
${C.benefits.map(([ic, t, d]) => `        <div class="feature"><span class="ico-box">${I(ic)}</span><h3>${t}</h3><p>${d}</p></div>`).join('\n')}
      </div>`;

const solCard = s => `        <a class="sol-tile" href="cozumler/${s.id}.html"><span class="ico-box">${I(s.icon)}</span><span><strong>${s.name}</strong><small>${s.subs}</small></span>${I('arrow-right')}</a>`;
const catCard = (s, extra = '') => `        <a class="service-card" href="hizmetler/${slug(s.name)}/index.html"><span class="ico-box">${I(s.icon)}</span><span><h3>${s.name}</h3><p>${s.short}</p>${extra}</span>${I('chevron-right')}</a>`;
const sectorChips = list => `<div class="chips chips-lg">${list.map(id => secById[id]).map(s => `<a class="chip" href="sektorler/${s.id}.html">${I(s.icon, 'ico-sm')}${s.name}</a>`).join('')}</div>`;

function formSplit(left, form) {
  return `      <div class="form-split">
        <div class="form-side">${left}</div>
        ${form}
      </div>`;
}
const contactSide = (title = 'Projenizi konuşalım', text = 'İhtiyacınızı birkaç cümleyle anlatın; size en uygun çözümü ve şeffaf bir teklifi birlikte hazırlayalım.') => `
          <h2>${title}</h2>
          <p>${text}</p>
          <ul class="contact-points">
            <li>${I('phone')}<div><strong>Telefon</strong><a href="tel:+902120000000">+90 (212) 000 00 00</a></div></li>
            <li>${I('mail')}<div><strong>E-posta</strong><a href="mailto:info@dikkatda.com">info@dikkatda.com</a></div></li>
            <li>${I('pin')}<div><strong>Adres</strong><span>İstanbul, Türkiye</span></div></li>
          </ul>`;

/* ============ 1. Ana sayfa ============ */
// Ana sayfa içeriği dikkatda/data/homepage.json dosyasında tutulur (admin paneli bu dosyayı düzenler).
// Dosya yoksa varsayılan içerikle oluşturulur.
const HOME_JSON = path.join(OUT, 'data/homepage.json');
const homeRender = require(path.join(OUT, 'assets/js/home-render.js'));
function defaultHome() {
  const totalSvc = allServices.reduce((n, s) => n + s.links.length, 0);
  return {
    seo: {
      title: 'DikkatDA – Dikkat Dijital Ajans | BT, Yazılım, Altyapı ve Dijital Pazarlama',
      description: 'DikkatDA; BT danışmanlığı, sistem ve network altyapısı, siber güvenlik, bulut, yazılım, web, dijital pazarlama, SEO ve yapay zekâ çözümlerini tek çatı altında sunar.',
    },
    hero: {
      show: true, badge: 'Teknoloji + Dijital Pazarlama = Tek Çatı', title1: 'İşinizi Dijital', title2: 'Geleceğe Taşıyoruz',
      lead: 'Teknoloji, yazılım, altyapı ve dijital pazarlama tek çatı altında.',
      primary: { text: 'Ücretsiz Analiz Al', link: 'ucretsiz-araclar/ucretsiz-web-sitesi-analizi.html' },
      secondary: { text: 'Hizmetleri Keşfet', link: '#hizmetler' },
      stats: [{ value: String(allServices.length), label: 'Uzmanlık alanı' }, { value: totalSvc + '+', label: 'Hizmet' }, { value: String(sectors.length), label: 'Sektör deneyimi' }],
    },
    services: {
      show: true, title: 'Uçtan Uca', accent: 'Dijital Dönüşüm',
      items: allServices.map(s => ({ title: s.card || s.name, text: s.short, icon: s.icon, link: `hizmetler/${slug(s.name)}/index.html` })),
      cta: { show: true, title: 'Size uygun hizmeti bulalım', text: 'Ücretsiz ön danışmanlık görüşmesi planlayın', link: 'ucretsiz-araclar/ucretsiz-on-danismanlik.html' },
    },
    free: {
      show: true, title: 'Ücretsiz', accent: 'Dijital Fırsatlar', text: 'İşletmeniz için hızlı, ücretsiz ve değerli analiz olanakları.',
      items: [
        ['Web Sitesi\nÖn Analizi', 'monitor', 'ucretsiz-araclar/ucretsiz-web-sitesi-analizi.html'],
        ['SEO\nÖn İncelemesi', 'search', 'ucretsiz-araclar/seo-on-analizi.html'],
        ['BT İhtiyaç\nAnalizi', 'layers', 'ucretsiz-araclar/bt-ihtiyac-analizi.html'],
        ['Reklam Hesabı\nÖn Analizi', 'megaphone', 'ucretsiz-araclar/reklam-hesabi-on-analizi.html'],
        ['Dijital Dönüşüm\nRehberleri', 'book', 'ucretsiz-araclar/ucretsiz-egitim-ve-rehberler.html'],
        ['İlk Danışmanlık\nGörüşmesi', 'calendar', 'ucretsiz-araclar/ucretsiz-on-danismanlik.html'],
      ].map(([label, icon, link]) => ({ label, icon, link })),
    },
    sectors: {
      show: true, title: 'Sektör', accent: 'Çözümlerimiz', text: 'Farklı sektörlerin ihtiyaçlarına özel, dijital ve teknolojik çözümler geliştiriyoruz.',
      items: [['Üretim', 'factory', 'uretim-ve-sanayi'], ['Perakende', 'bag', 'perakende'], ['Lojistik', 'truck', 'lojistik'], ['Sağlık', 'heart', 'saglik'],
        ['Eğitim', 'graduation', 'egitim'], ['Hizmet', 'building', 'kobiler'], ['Turizm', 'bed', 'turizm-ve-otelcilik'], ['E-ticaret', 'cart', 'e-ticaret']]
        .map(([label, icon, id]) => ({ label, icon, link: `sektorler/${id}.html` })).concat([{ label: 'Diğer', icon: 'dots', link: 'sektorler/index.html' }]),
    },
    process: {
      show: true, title: 'Nasıl', accent: 'Çalışıyoruz?', text: 'Projelerinizi, planlı ve şeffaf bir süreçle hayata geçiriyoruz.',
      items: steps.map(([title, icon, text]) => ({ title, icon, text })),
    },
    refs: {
      show: true, title: 'Referans', accent: 'larımız', text: 'Farklı sektörlerde, ihtiyaçlara özel dijital projeler.', link: 'referanslar.html',
      items: [{ image: '', title: 'Kurumsal BT Dönüşümü', subtitle: 'Hizmet sektörü' }, { image: '', title: 'Depo Network Altyapısı', subtitle: 'Lojistik' }, { image: '', title: 'Bulut ve Yedekleme', subtitle: 'Gayrimenkul' }],
    },
    blog: {
      show: true, title: 'Blog', text: 'Dijital dünyadan güncel içerikler.', link: 'bilgi-merkezi/blog.html',
      items: C.blogPosts.slice(0, 2).map(b => ({ image: '', title: b.title, link: `blog/${b.slug}.html` })),
    },
    cta: {
      show: true, title1: 'Dijital dönüşümünüzü', title2: 'birlikte', accent: 'planlayalım.',
      text: 'İhtiyaçlarınızı konuşalım, size özel çözümü birlikte tasarlayalım.', button: { text: 'Teklif Al', link: 'teklif-al.html' },
    },
  };
}
if (!fs.existsSync(HOME_JSON)) {
  fs.mkdirSync(path.dirname(HOME_JSON), { recursive: true });
  fs.writeFileSync(HOME_JSON, JSON.stringify(defaultHome(), null, 2) + '\n', 'utf8');
}
const homeData = JSON.parse(fs.readFileSync(HOME_JSON, 'utf8'));
write('index.html', {
  title: homeData.seo.title, desc: homeData.seo.description,
  body: homeRender.renderHome(homeData, { heroArt: L.heroArt }), active: 'index.html', ld,
});

/* Admin paneli (site layout'u kullanmaz; arama motorlarına kapalı) */
{
  const iconNames = Object.keys(L.icons).filter(k => !['menu', 'x', 'instagram', 'linkedin', 'youtube', 'xsocial', 'facebook', 'chevron-down', 'chevron-right', 'arrow-up'].includes(k));
  const sprite = `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">${Object.entries(L.icons).map(([k, v]) => `<symbol id="i-${k}" viewBox="0 0 24 24">${v}</symbol>`).join('')}</svg>`;
  const tpl = fs.readFileSync(path.join(__dirname, 'admin.html'), 'utf8')
    .replace('<!--SPRITE-->', sprite)
    .replace('/*ICONS*/[]', JSON.stringify(iconNames));
  fs.mkdirSync(path.join(OUT, 'admin'), { recursive: true });
  fs.writeFileSync(path.join(OUT, 'admin/index.html'), tpl, 'utf8');
}

/* ============ 2. Hizmetler ============ */
{
  const crumbs = [HOME, ['Hizmetler']];
  const body = [
    hero({ crumbs, eyebrow: 'Hizmetler', title: 'Hangi işleri <span class="accent">yapıyoruz?</span>', lead: `${allServices.length} uzmanlık alanında ${allServices.reduce((n, s) => n + s.links.length, 0)}+ hizmet. Teknolojiden pazarlamaya, ihtiyacınız olan her şey tek çatı altında.` }),
    ...serviceGroups.map(g => section(g.label, '', `      <div class="cat-grid">
${g.items.map(s => `        <article class="cat-card">
          <a class="cat-card-head" href="hizmetler/${slug(s.name)}/index.html"><span class="ico-box">${I(s.icon)}</span><span><h3>${s.name}</h3><p>${s.short}</p></span></a>
          <ul>${s.links.slice(0, 5).map(l => `<li><a href="hizmetler/${slug(s.name)}/${slug(l)}.html">${l}</a></li>`).join('')}</ul>
          <a class="link-arrow" href="hizmetler/${slug(s.name)}/index.html">${s.links.length > 5 ? `+${s.links.length - 5} hizmet daha` : 'Detaylı incele'} ${I('arrow-right')}</a>
        </article>`).join('\n')}
      </div>`, 'section-tight')),
    cta(),
  ].join('\n');
  write('hizmetler/index.html', { title: 'Hizmetler | DikkatDA', desc: 'BT, sistem, network, siber güvenlik, bulut, yazılım, web, dijital pazarlama, SEO, sosyal medya, kreatif ve yapay zekâ hizmetleri.', body, active: 'hizmetler/index.html', ld: crumbLd(crumbs) });
}

/* Kategori + hizmet detay sayfaları */
allServices.forEach(cat => {
  const cs = slug(cat.name);
  const catHref = `hizmetler/${cs}/index.html`;
  const sols = (C.catSolutions[cs] || []).map(id => solById[id]);
  const relSectors = [...new Set(sols.flatMap(s => s.sectors))].slice(0, 10);
  const others = allServices.filter(s => s !== cat);

  // Kategori sayfası
  {
    const crumbs = [HOME, ['Hizmetler', 'hizmetler/index.html'], [cat.name]];
    const f = faq(C.serviceFaq(cat.name));
    const body = [
      hero({ crumbs, icon: cat.icon, eyebrow: 'Hizmetler', title: cat.name, lead: cat.desc }),
      section(`${cat.name} <span class="accent">hizmetlerimiz</span>`, `${cat.links.length} hizmet · ihtiyacınıza göre tek tek ya da paket olarak.`, `      <div class="svc-grid">
${cat.links.map(l => `        <a class="svc-tile" href="hizmetler/${cs}/${slug(l)}.html"><span>${I('check')}</span><strong>${l}</strong>${I('arrow-right')}</a>`).join('\n')}
      </div>`),
      section('Neden <span class="accent">DikkatDA?</span>', '', benefitGrid(), 'section-soft'),
      section('Nasıl <span class="accent">çalışıyoruz?</span>', 'Planlı ve şeffaf bir süreçle.', processBlock()),
      sols.length ? section('İlgili <span class="accent">çözümler</span>', 'Bu hizmetlerin parçası olduğu ihtiyaç odaklı çözümler.', `      <div class="sol-tiles">\n${sols.map(solCard).join('\n')}\n      </div>`) : '',
      f.html,
      section('', '', formSplit(contactSide(`${cat.name} için teklif alın`), leadForm({ subject: `Hizmet: ${cat.name}`, title: 'Ücretsiz ön görüşme' })), 'section-soft', 'iletisim-formu'),
      section('Diğer <span class="accent">hizmet alanlarımız</span>', '', `      <div class="chips chips-lg">${others.map(s => `<a class="chip" href="hizmetler/${slug(s.name)}/index.html">${I(s.icon, 'ico-sm')}${s.name}</a>`).join('')}</div>`, 'section-tight'),
    ].join('\n');
    write(catHref, {
      title: `${cat.name} Hizmetleri | DikkatDA`, desc: `${cat.desc} ${cat.links.slice(0, 4).join(', ')} ve daha fazlası.`,
      body, active: 'hizmetler/index.html',
      ld: [crumbLd(crumbs), f.ld, { '@context': 'https://schema.org', '@type': 'Service', name: cat.name, description: cat.desc, provider: { '@type': 'Organization', name: 'DikkatDA', url: SITE }, areaServed: 'TR', hasOfferCatalog: { '@type': 'OfferCatalog', name: cat.name, itemListElement: cat.links.map(l => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: l } })) } }],
    });
  }

  // Hizmet detay sayfaları
  cat.links.forEach(name => {
    const ss = slug(name);
    const p = `hizmetler/${cs}/${ss}.html`;
    const crumbs = [HOME, ['Hizmetler', 'hizmetler/index.html'], [cat.name, catHref], [name]];
    const f = faq(C.serviceFaq(name));
    const main = `
          <div class="prose">
            <h2>${name} hakkında</h2>
            <p><strong>${name}</strong> hizmetimiz, ${cat.name} ekibimiz tarafından işletmenizin ihtiyaçlarına göre planlanır, uygulanır ve sürekli iyileştirilir. Amacımız; teknolojiyi işinizin önünde bir engel olmaktan çıkarıp büyümenizi destekleyen bir güce dönüştürmek.</p>
            <p>Her projeye mevcut durumunuzu dinleyerek başlıyor, ölçülebilir hedefler belirliyor ve süreci şeffaf raporlarla yönetiyoruz.</p>
            <!-- İÇERİK: Bu hizmete özel detay metni, görsel ve örnek çalışmalar buraya eklenebilir. -->
          </div>
          <h2 class="block-title">Hizmet kapsamı</h2>
          <ul class="checklist">${C.scope.map(x => `<li>${I('check')}${x}</li>`).join('')}</ul>
          <h2 class="block-title">Size uygun paketi seçin</h2>
          <div class="pricing">
${C.packages.map(pk => `            <div class="price-card${pk.featured ? ' featured' : ''}">${pk.featured ? '<span class="price-badge">En çok tercih edilen</span>' : ''}
              <h3>${pk.name}</h3><p>${pk.note}</p>
              <ul>${pk.items.map(x => `<li>${I('check')}${x}</li>`).join('')}</ul>
              <a class="btn ${pk.featured ? 'btn-primary' : 'btn-outline'} btn-sm" href="teklif-al.html?hizmet=${cs}">Teklif alın</a>
            </div>`).join('\n')}
          </div>
          <h2 class="block-title">Kimler için uygun?</h2>
          ${sectorChips(relSectors.length ? relSectors : ['kobiler', 'start-up-sirketleri'])}`;
    const aside = `
        <aside class="sidebar">
          <div class="side-card">
            <h4>${cat.name}</h4>
            <ul class="side-links">${cat.links.map(l => `<li><a href="hizmetler/${cs}/${slug(l)}.html"${l === name ? ' aria-current="page" class="current"' : ''}>${l}</a></li>`).join('')}</ul>
          </div>
          <div class="side-card side-cta">
            <span class="promo-badge">Ücretsiz</span>
            <h4>Ön görüşme planlayın</h4>
            <p>15 dakikada ihtiyacınızı dinleyelim, yol haritanızı birlikte çıkaralım.</p>
            <a class="btn btn-primary btn-sm" href="#iletisim-formu">Formu doldur ${I('arrow-right')}</a>
            <a class="side-phone" href="tel:+902120000000">${I('phone')}+90 (212) 000 00 00</a>
          </div>
        </aside>`;
    const body = [
      hero({ crumbs, icon: cat.icon, eyebrow: cat.name, title: name, lead: `${cat.short}. ${name} için uçtan uca planlama, uygulama ve destek.`, actions: `<a class="btn btn-primary" href="#iletisim-formu">${I('send')}Teklif Al</a><a class="btn btn-outline-light" href="${catHref}">${I('grid')}Tüm ${cat.name} hizmetleri</a>` }),
      `  <section class="section">
    <div class="container with-sidebar">
      <div class="main-col">${main}
      </div>${aside}
    </div>
  </section>`,
      section('Nasıl <span class="accent">çalışıyoruz?</span>', '', processBlock(), 'section-soft'),
      f.html,
      section('', '', formSplit(contactSide(`${name} için teklif alın`), leadForm({ subject: `Hizmet: ${cat.name} / ${name}` })), 'section-soft', 'iletisim-formu'),
    ].join('\n');
    write(p, {
      title: `${name} | ${cat.name} | DikkatDA`, desc: `${name}: ${cat.short.toLowerCase()}. DikkatDA ile analiz, uygulama ve sürekli destek.`,
      body, active: 'hizmetler/index.html',
      ld: [crumbLd(crumbs), f.ld, { '@context': 'https://schema.org', '@type': 'Service', name, serviceType: cat.name, provider: { '@type': 'Organization', name: 'DikkatDA', url: SITE }, areaServed: 'TR' }],
    });
  });
});

/* ============ 3. Çözümler ============ */
{
  const crumbs = [HOME, ['Çözümler']];
  const body = [
    hero({ crumbs, eyebrow: 'Çözümler', title: 'İşletmenizin hangi ihtiyacını <span class="accent">çözelim?</span>', lead: 'Teknik terimleri bilmenize gerek yok. İhtiyacınızı seçin; gerekli hizmetleri biz bir araya getirelim.' }),
    section('', '', `      <div class="filter-bar" data-filter-group="cozum">
        <span>${I('filter')}Sektöre göre:</span>
        <button type="button" class="chip active" data-filter="all">Tümü</button>
${sectors.map(s => `        <button type="button" class="chip" data-filter="${s.id}">${s.name}</button>`).join('\n')}
      </div>
      <div class="sol-tiles big" data-filter-items="cozum">
${solutions.map(s => solCard(s).replace('<a class="sol-tile"', `<a class="sol-tile" data-tags="${s.sectors.join(' ')}"`)).join('\n')}
      </div>
      <p class="filter-empty" hidden>Bu sektör için öne çıkan çözüm bulunamadı.</p>`),
    cta(),
  ].join('\n');
  write('cozumler/index.html', { title: 'Çözümler | DikkatDA', desc: 'Dijital dönüşüm, çok şubeli işletmeler, uzaktan çalışma, e-ticaret, iş sürekliliği, veri güvenliği ve daha fazlası için ihtiyaç odaklı çözümler.', body, active: 'cozumler/index.html', ld: crumbLd(crumbs) });
}

solutions.forEach(s => {
  const crumbs = [HOME, ['Çözümler', 'cozumler/index.html'], [s.name]];
  const cats = Object.entries(C.catSolutions).filter(([, l]) => l.includes(s.id)).map(([k]) => catBySlug[k]);
  const items = s.subs.split(', ');
  const f = faq([
    [`${s.name} çözümü hangi hizmetleri kapsıyor?`, `Bu çözüm; ${cats.map(c => c.name).join(', ')} alanlarındaki hizmetlerimizi ihtiyacınıza göre bir araya getirir.`],
    ['Çözümü aşamalı olarak uygulayabilir miyiz?', 'Evet. Öncelikli ihtiyaçlardan başlayarak bütçenize ve takviminize uygun aşamalı bir plan hazırlıyoruz.'],
    ['Mevcut sistemlerimizle uyumlu olur mu?', 'Ön analizde mevcut altyapınızı inceliyor, çalışan sistemleri koruyarak entegrasyon odaklı ilerliyoruz.'],
    ['Teklif almak ücretli mi?', 'Hayır. Ön görüşme, ihtiyaç analizi ve teklif hazırlama süreci ücretsizdir.'],
  ]);
  const body = [
    hero({ crumbs, icon: s.icon, eyebrow: 'Çözüm', title: s.name, lead: C.solutionLeads[s.id] }),
    section('Bu çözümle <span class="accent">neler kazanırsınız?</span>', '', `      <div class="feature-grid">
${items.map(x => `        <div class="feature"><span class="ico-box">${I('check')}</span><h3>${x.charAt(0).toLocaleUpperCase('tr-TR') + x.slice(1)}</h3><p>İhtiyacınıza göre planlanır, kurulur ve sürekli desteklenir.</p></div>`).join('\n')}
      </div>`),
    cats.length ? section('Çözüm kapsamındaki <span class="accent">hizmetler</span>', 'Bu ihtiyaç için bir araya getirdiğimiz hizmet alanları.', `      <div class="cat-grid">
${cats.map(c => `        <article class="cat-card">
          <a class="cat-card-head" href="hizmetler/${slug(c.name)}/index.html"><span class="ico-box">${I(c.icon)}</span><span><h3>${c.name}</h3><p>${c.short}</p></span></a>
          <ul>${c.links.slice(0, 4).map(l => `<li><a href="hizmetler/${slug(c.name)}/${slug(l)}.html">${l}</a></li>`).join('')}</ul>
        </article>`).join('\n')}
      </div>`, 'section-soft') : '',
    s.sectors.length ? section('Hangi sektörler için <span class="accent">uygun?</span>', '', `      ${sectorChips(s.sectors)}`) : '',
    section('Nasıl <span class="accent">çalışıyoruz?</span>', '', processBlock()),
    f.html,
    section('', '', formSplit(contactSide(`${s.name} için görüşelim`), leadForm({ subject: `Çözüm: ${s.name}` })), 'section-soft', 'iletisim-formu'),
  ].join('\n');
  write(`cozumler/${s.id}.html`, { title: `${s.name} | Çözümler | DikkatDA`, desc: `${C.solutionLeads[s.id]} ${s.subs}.`, body, active: 'cozumler/index.html', ld: [crumbLd(crumbs), f.ld] });
});

/* ============ 4. Sektörler ============ */
{
  const crumbs = [HOME, ['Sektörler']];
  const body = [
    hero({ crumbs, eyebrow: 'Sektörler', title: 'Sektörünüze özel <span class="accent">çözümler</span>', lead: 'Her sektörün ihtiyacı farklıdır. Sektörünüzü seçin, size özel önerilerimizi görün.' }),
    section('', '', `      <div class="sector-cards">
${sectors.map(s => `        <a class="sector-card" href="sektorler/${s.id}.html"><span class="ico-box">${I(s.icon)}</span><strong>${s.name}</strong><small>${C.sectorLeads[s.id]}</small><span class="link-arrow">${s.sol.length} önerilen çözüm ${I('arrow-right')}</span></a>`).join('\n')}
      </div>`),
    cta('Sektörünüz listede <span class="accent">yok mu?</span>', 'Her ölçekte ve her sektörde işletmeye özel çözüm kurguluyoruz.'),
  ].join('\n');
  write('sektorler/index.html', { title: 'Sektörler | DikkatDA', desc: 'Üretim, perakende, e-ticaret, sağlık, eğitim, turizm, lojistik, hukuk, finans ve daha fazla sektör için dijital ve teknolojik çözümler.', body, active: 'sektorler/index.html', ld: crumbLd(crumbs) });
}

sectors.forEach(sec => {
  const crumbs = [HOME, ['Sektörler', 'sektorler/index.html'], [sec.name]];
  const sols = sec.sol.map(id => solById[id]);
  const catScore = {};
  sec.sol.forEach(id => Object.entries(C.catSolutions).forEach(([k, l]) => { if (l.includes(id)) catScore[k] = (catScore[k] || 0) + 1; }));
  const cats = Object.entries(catScore).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([k]) => catBySlug[k]);
  const refs = C.references.filter(r => r[3] === sec.id);
  const f = faq([
    [`${sec.name} alanında daha önce çalıştınız mı?`, 'Farklı ölçeklerde birçok işletmeyle çalıştık. Ön görüşmede sektörünüze özel örnekleri ve deneyimlerimizi paylaşıyoruz.'],
    ['Hangi çözümle başlamalıyız?', 'Ücretsiz ihtiyaç analizi sonrasında, en hızlı fayda sağlayacak adımdan başlayan bir öncelik listesi hazırlıyoruz.'],
    ['Bütçemize uygun paket var mı?', 'Evet. Çözümlerimizi aşamalara bölerek bütçenize uygun ve büyüdükçe genişleyen bir plan sunuyoruz.'],
  ]);
  const body = [
    hero({ crumbs, icon: sec.icon, eyebrow: 'Sektör çözümleri', title: sec.name, lead: C.sectorLeads[sec.id] }),
    section('Önerilen <span class="accent">çözümler</span>', `${sec.name} için öncelikli ${sols.length} çözüm.`, `      <div class="sol-tiles">\n${sols.map(solCard).join('\n')}\n      </div>`),
    section('İlgili <span class="accent">hizmetler</span>', '', `      <div class="service-grid">\n${cats.map(c => catCard(c)).join('\n')}\n      </div>`, 'section-soft'),
    refs.length ? section('Bu sektördeki <span class="accent">projelerimiz</span>', '', `      <div class="ref-grid wide">
${refs.map(r => `        <figure class="ref-card"><div class="thumb ${r[0]}"></div><figcaption>${r[1]}<small>${r[4]}</small></figcaption></figure>`).join('\n')}
      </div>`) : '',
    section('Neden <span class="accent">DikkatDA?</span>', '', benefitGrid()),
    f.html,
    section('', '', formSplit(contactSide(`${sec.name} için görüşelim`), leadForm({ subject: `Sektör: ${sec.name}` })), 'section-soft', 'iletisim-formu'),
  ].join('\n');
  write(`sektorler/${sec.id}.html`, { title: `${sec.name} için Dijital Çözümler | DikkatDA`, desc: C.sectorLeads[sec.id], body, active: 'sektorler/index.html', ld: [crumbLd(crumbs), f.ld] });
});

/* ============ 5. Ücretsiz araçlar ============ */
{
  const crumbs = [HOME, ['Ücretsiz Araçlar']];
  const body = [
    hero({ crumbs, eyebrow: 'Ücretsiz Araçlar', title: 'İşinizi kolaylaştıran <span class="accent">ücretsiz araçlar</span>', lead: 'Web sitenizi analiz edin, DNS kayıtlarınızı kontrol edin, reklam bütçenizi hesaplayın. Kayıt gerekmez.', actions: `<a class="btn btn-primary" href="ucretsiz-araclar/ucretsiz-web-sitesi-analizi.html">${I('monitor')}Web sitemi analiz et</a>` }),
    ...toolCols.map(c => section(c.title, '', `      <div class="tool-cards">
${c.items.map(([n, ic, tag]) => `        <a class="tool-card" href="ucretsiz-araclar/${slug(n)}.html"><span class="ico-box">${I(ic)}</span><strong>${n}</strong><small>${C.tools[slug(n)].d}</small>${tag ? `<span class="tag">${tag}</span>` : ''}</a>`).join('\n')}
      </div>`, 'section-tight')),
    cta(),
  ].join('\n');
  write('ucretsiz-araclar/index.html', { title: 'Ücretsiz Araçlar | DikkatDA', desc: 'Ücretsiz web sitesi analizi, site hız testi, SEO ön analizi, DNS ve SPF/DKIM/DMARC kontrolü, subnet, UTM, ROAS ve KDV hesaplayıcı.', body, active: 'ucretsiz-araclar/index.html', ld: crumbLd(crumbs) });
}

const widgetHtml = (t, tool) => {
  const sel = (name, opts) => `<select name="${name}">${opts.map(([v, l, s]) => `<option value="${v}"${s ? ' selected' : ''}>${l}</option>`).join('')}</select>`;
  switch (t.w) {
    case 'psi': return `<form class="tool-form" data-tool="psi" data-cats="${t.cats.join(',')}">
          <label class="field full"><span>Web sitesi adresi</span><input name="url" inputmode="url" autocomplete="url" placeholder="https://www.ornek.com" required></label>
          <label class="field"><span>Cihaz</span>${sel('strategy', [['mobile', 'Mobil', 1], ['desktop', 'Masaüstü']])}</label>
          <button class="btn btn-primary" type="submit">${I('gauge')}Analizi başlat</button>
        </form>
        <p class="tool-note">Analiz Google PageSpeed Insights altyapısıyla yapılır ve 20–60 saniye sürebilir.</p>`;
    case 'domain': return `<form class="tool-form" data-tool="domain"><label class="field full"><span>Alan adı</span><input name="domain" placeholder="ornek.com" required></label><button class="btn btn-primary" type="submit">${I('search')}Sorgula</button></form>`;
    case 'dns': return `<form class="tool-form" data-tool="dns"><label class="field full"><span>Alan adı</span><input name="domain" placeholder="ornek.com" required></label><label class="field"><span>Kayıt türü</span>${sel('type', [['ALL', 'Tümü', 1], ['A', 'A'], ['AAAA', 'AAAA'], ['MX', 'MX'], ['NS', 'NS'], ['TXT', 'TXT'], ['CNAME', 'CNAME']])}</label><button class="btn btn-primary" type="submit">${I('search')}Sorgula</button></form>`;
    case 'mailauth': return `<form class="tool-form" data-tool="mailauth"><label class="field full"><span>Alan adı</span><input name="domain" placeholder="ornek.com" required></label><label class="field"><span>DKIM seçici (isteğe bağlı)</span><input name="selector" placeholder="google, selector1, default"></label><button class="btn btn-primary" type="submit">${I('mail')}Kontrol et</button></form>`;
    case 'ip': return `<div class="tool-form" data-tool="ip"><button class="btn btn-primary" type="button" data-action="ip">${I('wifi')}IP adresimi göster</button></div><p class="tool-note">Butona bastığınızda adresiniz ipify.org servisi üzerinden sorgulanır.</p>`;
    case 'subnet': return `<form class="tool-form" data-tool="subnet"><label class="field"><span>IP adresi</span><input name="ip" value="192.168.1.10" required></label><label class="field"><span>CIDR</span>${sel('cidr', Array.from({ length: 31 }, (_, i) => [i + 1, `/${i + 1}`, i + 1 === 24]))}</label><button class="btn btn-primary" type="submit">${I('network')}Hesapla</button></form>`;
    case 'qr': return `<form class="tool-form" data-tool="qr"><label class="field full"><span>Bağlantı ya da metin</span><input name="text" placeholder="https://www.ornek.com" required></label><label class="field"><span>Boyut</span>${sel('size', [['200', '200 px'], ['300', '300 px', 1], ['500', '500 px'], ['1000', '1000 px']])}</label><button class="btn btn-primary" type="submit">${I('qr')}QR oluştur</button></form><p class="tool-note">QR görseli goqr.me (api.qrserver.com) servisiyle oluşturulur.</p>`;
    case 'utm': return `<form class="tool-form" data-tool="utm">
          <label class="field full"><span>Sayfa adresi *</span><input name="url" inputmode="url" autocomplete="url" placeholder="https://www.ornek.com/kampanya" required></label>
          <label class="field"><span>Kaynak (utm_source) *</span><input name="utm_source" placeholder="google, instagram, bulten" required></label>
          <label class="field"><span>Ortam (utm_medium) *</span><input name="utm_medium" placeholder="cpc, social, email" required></label>
          <label class="field"><span>Kampanya (utm_campaign) *</span><input name="utm_campaign" placeholder="kasim_indirim" required></label>
          <label class="field"><span>Terim (utm_term)</span><input name="utm_term"></label>
          <label class="field"><span>İçerik (utm_content)</span><input name="utm_content"></label>
          <button class="btn btn-primary" type="submit">${I('link')}Bağlantı oluştur</button></form>`;
    case 'budget': return `<form class="tool-form" data-tool="budget">
          <label class="field"><span>Aylık hedef satış / talep</span><input type="number" name="sales" value="50" min="1" required></label>
          <label class="field"><span>Dönüşüm oranı (%)</span><input type="number" name="cr" value="2" step="0.1" min="0.1" required></label>
          <label class="field"><span>Ortalama tıklama maliyeti (₺)</span><input type="number" name="cpc" value="8" step="0.1" min="0.1" required></label>
          <label class="field"><span>Ortalama sipariş değeri (₺)</span><input type="number" name="aov" value="1500" min="0"></label>
          <button class="btn btn-primary" type="submit">${I('calculator')}Hesapla</button></form>`;
    case 'roas': return `<form class="tool-form" data-tool="roas">
          <label class="field"><span>Reklamdan elde edilen gelir (₺)</span><input type="number" name="rev" value="40000" min="0" required></label>
          <label class="field"><span>Reklam harcaması (₺)</span><input type="number" name="spend" value="10000" min="1" required></label>
          <label class="field"><span>Brüt kâr marjı (%)</span><input type="number" name="margin" value="35" min="1" max="100"></label>
          <button class="btn btn-primary" type="submit">${I('chart')}Hesapla</button></form>`;
    case 'kdv': return `<form class="tool-form" data-tool="kdv">
          <label class="field"><span>Tutar (₺)</span><input type="number" name="amount" value="1000" step="0.01" min="0" required></label>
          <label class="field"><span>KDV oranı</span>${sel('rate', [['1', '%1'], ['10', '%10'], ['20', '%20', 1]])}</label>
          <label class="field"><span>Hesaplama</span>${sel('mode', [['add', 'KDV hariç → KDV dahil', 1], ['remove', 'KDV dahil → KDV hariç']])}</label>
          <button class="btn btn-primary" type="submit">${I('percent')}Hesapla</button></form>`;
    case 'resize': return `<form class="tool-form" data-tool="resize">
          <label class="field full"><span>Görsel seçin</span><input type="file" name="file" accept="image/*" required></label>
          <label class="field"><span>Ölçü</span>${sel('preset', [['1080x1080', 'Instagram gönderi (1080×1080)', 1], ['1080x1350', 'Instagram dikey (1080×1350)'], ['1080x1920', 'Story / Reels (1080×1920)'], ['1200x630', 'Facebook / LinkedIn paylaşım (1200×630)'], ['1584x396', 'LinkedIn kapak (1584×396)'], ['1280x720', 'YouTube kapak (1280×720)'], ['820x312', 'Facebook kapak (820×312)']])}</label>
          <label class="field"><span>Yerleşim</span>${sel('fit', [['cover', 'Kırparak doldur', 1], ['contain', 'Sığdır (kenar boşluklu)']])}</label>
          <button class="btn btn-primary" type="submit">${I('image')}Boyutlandır</button></form>
        <p class="tool-note">Görseliniz hiçbir sunucuya yüklenmez; işlem tarayıcınızda yapılır.</p>`;
    case 'quiz': {
      const qs = [
        ['Çalışanlarınız kurumsal e-posta ve ortak dosya paylaşımı kullanıyor mu?', 'kurumsal-iletisim'],
        ['Verileriniz düzenli olarak yedekleniyor ve geri dönüş test ediliyor mu?', 'is-surekliligi'],
        ['Tüm hesaplarda çok faktörlü kimlik doğrulama ve güncel güvenlik yazılımı var mı?', 'veri-guvenligi'],
        ['Ekibiniz ofis dışından güvenli şekilde çalışabiliyor mu?', 'uzaktan-calisma'],
        ['Teklif, onay ve raporlama gibi süreçleriniz dijital mi?', 'otomasyon'],
        ['Müşteri ve satış bilgilerinizi bir CRM üzerinden takip ediyor musunuz?', 'satis-pazarlama'],
        ['Web siteniz güncel, hızlı ve mobil uyumlu mu?', 'dijital-marka'],
        ['Düzenli dijital reklam ya da SEO çalışması yapıyor musunuz?', 'musteri-kazanimi'],
      ];
      return `<form class="tool-form quiz" data-tool="quiz">
${qs.map(([q, sol], i) => `          <fieldset class="quiz-q" data-sol="${sol}" data-sol-name="${esc(solById[sol].name)}"><legend>${i + 1}. ${q}</legend>
            <label><input type="radio" name="q${i}" value="2" required> Evet</label><label><input type="radio" name="q${i}" value="1"> Kısmen</label><label><input type="radio" name="q${i}" value="0"> Hayır</label></fieldset>`).join('\n')}
          <button class="btn btn-primary" type="submit">${I('check')}Sonucumu göster</button></form>`;
    }
    default: return leadForm({ title: `${tool.name} talebi`, intro: 'Bilgilerinizi bırakın, uzmanlarımız ücretsiz olarak inceleyip raporu size iletsin.', subject: `Ücretsiz araç: ${tool.name}`, extra: '<label class="field full"><span>Web sitesi / alan adı</span><input name="site" placeholder="ornek.com"></label>', button: 'Ücretsiz talep et' });
  }
};

toolList.forEach(tool => {
  const t = C.tools[tool.slug];
  const crumbs = [HOME, ['Ücretsiz Araçlar', 'ucretsiz-araclar/index.html'], [tool.name]];
  const related = toolList.filter(x => x.group === tool.group && x.slug !== tool.slug && !x.hidden).slice(0, 4);
  const relList = related.length ? related : toolList.filter(x => !x.hidden && x.slug !== tool.slug).slice(0, 4);
  const body = [
    hero({ crumbs, icon: tool.icon, eyebrow: 'Ücretsiz araç', title: tool.name, lead: t.d, actions: '', compact: true }),
    `  <section class="section">
    <div class="container tool-layout">
      <div class="tool-box">
        ${widgetHtml(t, tool)}
        <div class="tool-result" aria-live="polite" hidden></div>
      </div>
      <aside class="sidebar">
        <div class="side-card side-cta">
          <span class="promo-badge">Uzman desteği</span>
          <h4>Sonuçları birlikte yorumlayalım</h4>
          <p>Raporunuzu uzmanlarımızla ücretsiz değerlendirin, iyileştirme planınızı çıkaralım.</p>
          <a class="btn btn-primary btn-sm" href="ucretsiz-araclar/ucretsiz-on-danismanlik.html">Ön görüşme planla ${I('arrow-right')}</a>
        </div>
        <div class="side-card">
          <h4>Diğer araçlar</h4>
          <ul class="side-links">${relList.map(x => `<li><a href="ucretsiz-araclar/${x.slug}.html">${x.name}</a></li>`).join('')}<li><a href="ucretsiz-araclar/index.html">Tüm araçlar →</a></li></ul>
        </div>
      </aside>
    </div>
  </section>`,
    cta('Sonuçları <span class="accent">iyileştirelim.</span>', 'Raporunuzdaki sorunları sizin yerinize çözelim; teknik ekibimiz hazır.'),
  ].join('\n');
  write(`ucretsiz-araclar/${tool.slug}.html`, {
    title: `${tool.name} (Ücretsiz) | DikkatDA`, desc: t.d, body, active: 'ucretsiz-araclar/index.html',
    ld: [crumbLd(crumbs), { '@context': 'https://schema.org', '@type': 'WebApplication', name: tool.name, applicationCategory: 'BusinessApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'TRY' } }],
    extraScripts: t.w !== 'lead' ? '\n<script src="assets/js/tools.js" defer></script>' : '',
  });
});

/* ============ 6. Bilgi Merkezi ============ */
const resHref = n => `bilgi-merkezi/${slug(n)}.html`;
const blogCard = b => `        <a class="post-card" href="blog/${b.slug}.html" data-tags="${slug(b.cat)}">
          <div class="media"><div class="thumb ${b.thumb}"></div></div>
          <div class="post-body"><span class="post-cat">${b.cat}</span><h3>${b.title}</h3><p>${b.excerpt}</p><span class="post-meta">${fmtDate(b.date)} · ${b.read} dk okuma</span></div>
        </a>`;
{
  const crumbs = [HOME, ['Bilgi Merkezi']];
  const body = [
    hero({ crumbs, eyebrow: 'Bilgi Merkezi', title: 'Öğrenin, uygulayın, <span class="accent">büyüyün</span>', lead: 'Rehberler, blog yazıları, vaka çalışmaları ve ücretsiz kaynaklar.', actions: '' }),
    section('', '', `      <div class="tool-cards">
${resources.map(([n, ic, d]) => `        <a class="tool-card" href="${resHref(n)}"><span class="ico-box">${I(ic)}</span><strong>${n}</strong><small>${d}</small></a>`).join('\n')}
      </div>`),
    section('Son <span class="accent">yazılar</span>', '', `      <div class="post-grid">\n${C.blogPosts.slice(0, 3).map(blogCard).join('\n')}\n      </div>`, 'section-soft'),
    cta(),
  ].join('\n');
  write('bilgi-merkezi/index.html', { title: 'Bilgi Merkezi | DikkatDA', desc: 'Dijital dönüşüm, siber güvenlik, bulut, yapay zekâ ve dijital pazarlama üzerine rehberler, blog yazıları ve ücretsiz kaynaklar.', body, active: 'bilgi-merkezi/index.html', ld: crumbLd(crumbs) });
}

const resPage = (name, lead, inner, extra = {}) => {
  const crumbs = [HOME, ['Bilgi Merkezi', 'bilgi-merkezi/index.html'], [name]];
  const ic = resources.find(r => r[0] === name)[1];
  write(resHref(name), { title: `${name} | Bilgi Merkezi | DikkatDA`, desc: lead, active: 'bilgi-merkezi/index.html', ...extra, ld: [crumbLd(crumbs)].concat(extra.ld || []),
    body: [hero({ crumbs, icon: ic, eyebrow: 'Bilgi Merkezi', title: name, lead, actions: '', compact: true }), inner].join('\n') });
};

const blogCats = [...new Set(C.blogPosts.map(b => b.cat))];
resPage('Blog', 'Dijital dünyadan güncel içerikler, ipuçları ve uygulama örnekleri.', [
  section('', '', `      <div class="filter-bar" data-filter-group="blog"><button type="button" class="chip active" data-filter="all">Tümü</button>${blogCats.map(c => `<button type="button" class="chip" data-filter="${slug(c)}">${c}</button>`).join('')}</div>
      <div class="post-grid" data-filter-items="blog">\n${C.blogPosts.map(blogCard).join('\n')}\n      </div>`),
  cta(),
].join('\n'));

resPage('Rehberler', 'Adım adım uygulayabileceğiniz ücretsiz rehberler ve kontrol listeleri.', [
  section('', '', `      <div class="tool-cards">
${C.guides.map(([ic, t, d]) => `        <a class="tool-card" href="bilgi-merkezi/e-kitap-ve-sablonlar.html#indir"><span class="ico-box">${I(ic)}</span><strong>${t}</strong><small>${d}</small><span class="link-arrow">Ücretsiz indir ${I('arrow-right')}</span></a>`).join('\n')}
      </div>`),
  cta(),
].join('\n'));

resPage('Vaka çalışmaları', 'Farklı sektörlerdeki projelerimizden gerçek ihtiyaçlar ve uyguladığımız çözümler.', [
  section('', '', `      <div class="case-list">
${C.references.slice(0, 6).map(r => `        <article class="case-card"><div class="thumb ${r[0]}"></div><div class="case-body"><span class="post-cat">${r[2]}</span><h3>${r[1]}</h3>
          <dl><div><dt>İhtiyaç</dt><dd>Mevcut yapının ölçeklenememesi ve dağınık yönetim.</dd></div><div><dt>Çözüm</dt><dd>${r[4]}.</dd></div><div><dt>Sonuç</dt><dd>Daha hızlı, güvenli ve tek merkezden yönetilen bir yapı.</dd></div></dl>
          <a class="link-arrow" href="sektorler/${r[3]}.html">Sektör çözümleri ${I('arrow-right')}</a></div></article>`).join('\n')}
      </div>
      <!-- İÇERİK: Vaka çalışmaları örnek metindir; gerçek proje bilgileriyle güncelleyin. -->`),
  cta(),
].join('\n'));

resPage('E-kitap ve şablonlar', 'Ücretsiz indirilebilir e-kitaplar, kontrol listeleri ve planlama şablonları.', [
  section('', '', `      <div class="tool-cards">
${C.guides.map(([ic, t, d]) => `        <div class="tool-card"><span class="ico-box">${I(ic)}</span><strong>${t}</strong><small>${d}</small><span class="tag tag-soft">PDF</span></div>`).join('\n')}
      </div>`),
  section('', '', formSplit(contactSide('Kaynakları ücretsiz edinin', 'Formu doldurun, seçtiğiniz kaynakları e-posta adresinize gönderelim.'), leadForm({ id: 'indir', title: 'Ücretsiz kaynak talebi', subject: 'E-kitap ve şablon talebi', extra: `<label class="field full"><span>İstediğiniz kaynak</span><select name="kaynak">${C.guides.map(g => `<option>${g[1]}</option>`).join('')}<option>Hepsi</option></select></label>`, button: 'Gönder' })), 'section-soft'),
].join('\n'));

resPage('Webinarlar', 'Uzmanlarımızın anlattığı canlı ve kayıtlı eğitim yayınları.', [
  section('Yaklaşan <span class="accent">webinarlar</span>', '', `      <div class="event-list">
${C.webinars.map(([d, t, c]) => `        <div class="event"><span class="event-date">${d}</span><div><span class="post-cat">${c}</span><h3>${t}</h3></div><a class="btn btn-outline btn-sm" href="#kayit">Ön kayıt</a></div>`).join('\n')}
      </div>`),
  section('', '', formSplit(contactSide('Webinar ön kaydı', 'Tarih kesinleştiğinde size davet bağlantısını gönderelim.'), leadForm({ id: 'kayit', title: 'Ön kayıt formu', subject: 'Webinar ön kayıt', extra: `<label class="field full"><span>Webinar</span><select name="webinar">${C.webinars.map(w => `<option>${w[1]}</option>`).join('')}</select></label>`, button: 'Kaydol' })), 'section-soft'),
].join('\n'));

{
  const f = faq(C.generalFaq, '');
  resPage('Sıkça sorulan sorular', 'DikkatDA ve hizmetlerimiz hakkında merak ettikleriniz.', [f.html, cta('Sorunuzun yanıtını <span class="accent">bulamadınız mı?</span>', 'Bize yazın, uzmanlarımız en kısa sürede yanıtlasın.')].join('\n'), { ld: [f.ld] });
}

resPage('Dijital sözlük', 'Teknik terimler sade ve anlaşılır bir dille.', [
  section('', '', `      <div class="glossary">
        <label class="glossary-search">${I('search')}<input type="search" placeholder="Terim ara… (ör. DNS, ROAS)" data-glossary-search aria-label="Terim ara"></label>
        <dl class="glossary-list">
${[...C.glossary].sort((a, b) => a[0].localeCompare(b[0], 'tr')).map(([t, d]) => `          <div class="term" id="${slug(t)}"><dt>${t}</dt><dd>${d}</dd></div>`).join('\n')}
        </dl>
        <p class="filter-empty" hidden>Aradığınız terim bulunamadı.</p>
      </div>`),
].join('\n'), { ld: [{ '@context': 'https://schema.org', '@type': 'DefinedTermSet', name: 'Dijital sözlük', hasDefinedTerm: C.glossary.map(([t, d]) => ({ '@type': 'DefinedTerm', name: t, description: d })) }] });

resPage('Duyurular', 'DikkatDA’dan haberler ve duyurular.', [
  section('', '', `      <div class="event-list">
${C.announcements.map(([d, t, x]) => `        <div class="event"><span class="event-date">${fmtDate(d)}</span><div><h3>${t}</h3><p>${x}</p></div></div>`).join('\n')}
      </div>`),
].join('\n'));

/* Blog yazıları */
C.blogPosts.forEach(b => {
  const crumbs = [HOME, ['Bilgi Merkezi', 'bilgi-merkezi/index.html'], ['Blog', 'bilgi-merkezi/blog.html'], [b.title]];
  const content = b.body.map(([tag, v]) => tag === 'ul' ? `<ul>${v.map(x => `<li>${x}</li>`).join('')}</ul>` : `<${tag}>${v}</${tag}>`).join('\n            ');
  const more = C.blogPosts.filter(x => x !== b).slice(0, 3);
  const body = [
    hero({ crumbs, eyebrow: b.cat, title: b.title, lead: `${fmtDate(b.date)} · ${b.read} dk okuma`, actions: '', compact: true }),
    `  <section class="section">
    <div class="container with-sidebar">
      <article class="main-col">
        <div class="article-cover thumb ${b.thumb}"></div>
        <div class="prose article">
            <p class="lead-p">${b.excerpt}</p>
            ${content}
        </div>
        <div class="share">Paylaş:
          <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(SITE + 'blog/' + b.slug + '.html')}" target="_blank" rel="noopener" aria-label="LinkedIn'de paylaş">${I('linkedin')}</a>
          <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(SITE + 'blog/' + b.slug + '.html')}" target="_blank" rel="noopener" aria-label="X'te paylaş">${I('xsocial')}</a>
          <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(SITE + 'blog/' + b.slug + '.html')}" target="_blank" rel="noopener" aria-label="Facebook'ta paylaş">${I('facebook')}</a>
        </div>
      </article>
      <aside class="sidebar">
        <div class="side-card"><h4>Diğer yazılar</h4><ul class="side-links">${more.map(x => `<li><a href="blog/${x.slug}.html">${x.title}</a></li>`).join('')}</ul></div>
        <div class="side-card side-cta"><span class="promo-badge">Ücretsiz</span><h4>Uzmanımıza danışın</h4><p>Yazıda anlatılanları işletmenize nasıl uygulayacağınızı birlikte planlayalım.</p><a class="btn btn-primary btn-sm" href="ucretsiz-araclar/ucretsiz-on-danismanlik.html">Görüşme planla ${I('arrow-right')}</a></div>
      </aside>
    </div>
  </section>`,
    section('İlginizi <span class="accent">çekebilir</span>', '', `      <div class="post-grid">\n${more.map(blogCard).join('\n')}\n      </div>`, 'section-soft'),
  ].join('\n');
  write(`blog/${b.slug}.html`, {
    title: `${b.title} | DikkatDA Blog`, desc: b.excerpt, body, active: 'bilgi-merkezi/index.html',
    ld: [crumbLd(crumbs), { '@context': 'https://schema.org', '@type': 'BlogPosting', headline: b.title, description: b.excerpt, datePublished: b.date, author: { '@type': 'Organization', name: 'DikkatDA' }, publisher: { '@type': 'Organization', name: 'DikkatDA' }, mainEntityOfPage: SITE + 'blog/' + b.slug + '.html' }],
  });
});

/* ============ 7. Kurumsal ============ */
const corpHref = n => `kurumsal/${slug(n)}.html`;
const corpPage = (p, name, lead, inner, icon, extra = {}) => {
  const crumbs = [HOME, ['Kurumsal', 'kurumsal/index.html'], [name]];
  write(p, { title: `${name} | DikkatDA`, desc: lead, active: 'kurumsal/index.html', ...extra, ld: [crumbLd(crumbs)].concat(extra.ld || []),
    body: [hero({ crumbs, icon, eyebrow: 'Kurumsal', title: name, lead, actions: extra.actions === undefined ? '' : extra.actions, compact: true }), inner].join('\n') });
};
{
  const crumbs = [HOME, ['Kurumsal']];
  write('kurumsal/index.html', { title: 'Kurumsal | DikkatDA', desc: 'DikkatDA hakkında: hikâyemiz, ekiplerimiz, kariyer fırsatları ve çalışma modelimiz.', active: 'kurumsal/index.html', ld: crumbLd(crumbs),
    body: [hero({ crumbs, eyebrow: 'Kurumsal', title: 'Teknoloji ve yaratıcılığı <span class="accent">tek çatıda</span> buluşturuyoruz', lead: 'DikkatDA; BT altyapısından dijital pazarlamaya kadar işletmelerin dijital dönüşümüne uçtan uca eşlik eden bir dijital ajanstır.' }),
      section('', '', `      <div class="tool-cards">
${company.map(([n, ic, d]) => `        <a class="tool-card" href="${corpHref(n)}"><span class="ico-box">${I(ic)}</span><strong>${n}</strong><small>${d}</small></a>`).join('\n')}
      </div>`), cta()].join('\n') });
}

corpPage(corpHref('Hakkımızda'), 'Hakkımızda', 'İşletmelerin teknoloji ve dijital pazarlama ihtiyaçlarını tek çatı altında karşılamak için yola çıktık.', [
  section('', '', `      <div class="about-grid">
        <div class="prose">
          <h2>Hikâyemiz</h2>
          <p>DikkatDA, işletmelerin BT altyapısı, yazılım ve dijital pazarlama ihtiyaçları için ayrı ayrı firmalarla çalışmak zorunda kalmasının yarattığı karmaşayı çözmek için kuruldu. Bugün sistem ve network altyapısından siber güvenliğe, web ve yazılım geliştirmeden performans pazarlamasına kadar geniş bir alanda hizmet veriyoruz.</p>
          <p>Teknik ekiplerimizle kreatif ve pazarlama ekiplerimizi aynı masada buluşturarak, müşterilerimize tek muhatapla uçtan uca çözüm sunuyoruz.</p>
          <!-- İÇERİK: Kuruluş yılı, kurucu bilgisi ve kilometre taşları eklenebilir. -->
        </div>
        <div class="mv-cards">
          <div class="mv"><span class="ico-box">${I('target')}</span><h3>Misyonumuz</h3><p>Her ölçekte işletmenin teknolojiye ve dijital büyümeye kolayca erişmesini sağlamak.</p></div>
          <div class="mv"><span class="ico-box">${I('rocket')}</span><h3>Vizyonumuz</h3><p>Türkiye’de işletmelerin dijital dönüşümde ilk aklına gelen çözüm ortağı olmak.</p></div>
        </div>
      </div>`),
  section('Değer<span class="accent">lerimiz</span>', '', `      <div class="feature-grid">
${[['shield', 'Güven', 'Verinize ve işinize kendi işimiz gibi sahip çıkarız.'], ['bars', 'Şeffaflık', 'Yaptığımız her işi ölçer ve açıkça raporlarız.'], ['zap', 'Hız', 'Sorunlara büyümeden, hızlı ve kalıcı çözüm üretiriz.'], ['sparkles', 'Yenilikçilik', 'Yeni teknolojileri takip eder, işinize uyarlarız.']].map(([ic, t, d]) => `        <div class="feature"><span class="ico-box">${I(ic)}</span><h3>${t}</h3><p>${d}</p></div>`).join('\n')}
      </div>`, 'section-soft'),
  section('Nasıl <span class="accent">çalışıyoruz?</span>', '', processBlock()),
  cta(),
].join('\n'), 'building', { ld: [{ '@context': 'https://schema.org', '@type': 'AboutPage', name: 'Hakkımızda' }] });

corpPage(corpHref('Ekibimiz'), 'Ekibimiz', 'Her biri kendi alanında uzman ekiplerimizle işinizi büyütüyoruz.', [
  section('Ekip<span class="accent">lerimiz</span>', '', `      <div class="feature-grid four">
${C.teams.map(([ic, t, d]) => `        <div class="feature"><span class="ico-box">${I(ic)}</span><h3>${t}</h3><p>${d}</p></div>`).join('\n')}
      </div>
      <!-- İÇERİK: Ekip üyelerinin fotoğraf, isim ve unvanları eklenebilir. -->`),
  cta('Ekibimize <span class="accent">katılın.</span>', 'Teknoloji ve yaratıcılığı birleştiren projelerde yer almak ister misiniz?'),
].join('\n'), 'users');

corpPage(corpHref('Kariyer'), 'Kariyer', 'Öğrenmeyi seven, üretmekten keyif alan ekip arkadaşları arıyoruz.', [
  section('Açık <span class="accent">pozisyonlar</span>', `${C.positions.length} açık pozisyon`, `      <div class="job-list">
${C.positions.map(([t, d, l]) => `        <div class="job"><div><h3>${t}</h3><span>${d} · ${l}</span></div><a class="btn btn-outline btn-sm" href="#basvuru" data-job="${esc(t)}">Başvur</a></div>`).join('\n')}
      </div>`),
  section('Neden <span class="accent">DikkatDA?</span>', '', `      <div class="feature-grid">
${[['graduation', 'Sürekli gelişim', 'Eğitim ve sertifika desteği.'], ['home', 'Esnek çalışma', 'Uygun pozisyonlarda hibrit çalışma.'], ['layers', 'Çeşitli projeler', 'Farklı sektörlerde, farklı teknolojilerde deneyim.'], ['users', 'Güçlü ekip', 'Bilgi paylaşımına dayalı iş kültürü.']].map(([ic, t, d]) => `        <div class="feature"><span class="ico-box">${I(ic)}</span><h3>${t}</h3><p>${d}</p></div>`).join('\n')}
      </div>`, 'section-soft'),
  section('', '', formSplit(contactSide('Başvuru formu', 'Uygun bir pozisyon göremediyseniz de genel başvuru yapabilirsiniz.'), leadForm({ id: 'basvuru', title: 'İş başvurusu', intro: 'Bilgilerinizi ve özgeçmişinizi paylaşın.', subject: 'Kariyer başvurusu', extra: `<label class="field full"><span>Pozisyon</span><select name="pozisyon">${C.positions.map(p => `<option>${p[0]}</option>`).join('')}<option>Genel başvuru</option></select></label><label class="field full"><span>Özgeçmiş (PDF)</span><input type="file" name="cv" accept=".pdf,.doc,.docx"></label>`, button: 'Başvuruyu gönder' }))),
].join('\n'), 'briefcase', { ld: C.positions.map(([t, d, l]) => ({ '@context': 'https://schema.org', '@type': 'JobPosting', title: t, description: `${d} departmanında ${t} pozisyonu.`, datePosted: '2026-11-01', employmentType: l.includes('Staj') ? 'INTERN' : 'FULL_TIME', hiringOrganization: { '@type': 'Organization', name: 'DikkatDA', sameAs: SITE }, jobLocation: { '@type': 'Place', address: { '@type': 'PostalAddress', addressLocality: 'İstanbul', addressCountry: 'TR' } } })) });

corpPage(corpHref('Sertifikalar ve iş ortakları'), 'Sertifikalar ve iş ortakları', 'Çalıştığımız teknolojiler ve sahip olduğumuz yetkinlikler.', [
  section('Çalıştığımız <span class="accent">teknolojiler</span>', '', `      <div class="logo-wall">${C.technologies.map(t => `<span>${t}</span>`).join('')}</div>
      <p class="muted-note">Marka adları ilgili sahiplerine aittir; listede yalnızca deneyim sahibi olduğumuz teknolojiler yer alır.</p>
      <!-- İÇERİK: Resmî iş ortaklığı rozetleri ve sertifika görselleri buraya eklenebilir. -->`),
  cta(),
].join('\n'), 'award');

corpPage(corpHref('Çalışma modelimiz'), 'Çalışma modelimiz', 'Keşiften desteğe, planlı ve şeffaf bir süreçle çalışıyoruz.', [
  section('Süreç<span class="accent">imiz</span>', '', processBlock()),
  section('Çalışma <span class="accent">modelleri</span>', '', `      <div class="pricing">
${[['Proje bazlı', 'Belirli kapsam ve teslim tarihi olan işler için.', ['Net kapsam ve takvim', 'Sabit fiyat', 'Teslim sonrası destek']], ['Aylık hizmet', 'Sürekli destek, bakım ve pazarlama hizmetleri için.', ['Aylık sabit ücret', 'Düzenli raporlama', 'Esnek kapsam'], true], ['Dış kaynak BT', 'BT departmanınızı tamamen ya da kısmen bize bırakın.', ['Atanmış uzman ekip', 'SLA garantisi', 'Yerinde ve uzaktan destek']]].map(([t, d, l, f]) => `        <div class="price-card${f ? ' featured' : ''}">${f ? '<span class="price-badge">En yaygın</span>' : ''}<h3>${t}</h3><p>${d}</p><ul>${l.map(x => `<li>${I('check')}${x}</li>`).join('')}</ul><a class="btn ${f ? 'btn-primary' : 'btn-outline'} btn-sm" href="teklif-al.html">Teklif alın</a></div>`).join('\n')}
      </div>`, 'section-soft'),
  cta(),
].join('\n'), 'refresh');

corpPage(corpHref('Basın odası'), 'Basın odası', 'Basın ve medya mensupları için kurumsal bilgiler ve iletişim.', [
  section('', '', `      <div class="feature-grid">
        <div class="feature"><span class="ico-box">${I('image')}</span><h3>Logo ve medya kiti</h3><p>Logo dosyaları ve marka kullanım kılavuzu için bizimle iletişime geçin.</p></div>
        <div class="feature"><span class="ico-box">${I('file')}</span><h3>Kurumsal tanıtım</h3><p>DikkatDA; teknoloji, yazılım, altyapı ve dijital pazarlama hizmetlerini tek çatı altında sunan dijital ajanstır.</p></div>
        <div class="feature"><span class="ico-box">${I('mail')}</span><h3>Basın iletişimi</h3><p><a href="mailto:info@dikkatda.com">info@dikkatda.com</a></p></div>
      </div>`),
].join('\n'), 'megaphone');

const legal = (p, name, sections) => corpPage(p, name, `${name} – son güncelleme: ${fmtDate('2026-11-01')}`, section('', '', `      <div class="prose legal">
        <div class="notice">${I('help')}<span>Bu metin şablon niteliğindedir. Yayına almadan önce hukuk danışmanınız tarafından şirketinize göre düzenlenmelidir.</span></div>
${sections.map(([h, t]) => `        <h2>${h}</h2>\n        <p>${t}</p>`).join('\n')}
      </div>`), 'lock');

legal('kurumsal/kvkk.html', 'KVKK Aydınlatma Metni', [
  ['Veri sorumlusu', '6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) uyarınca kişisel verileriniz, veri sorumlusu sıfatıyla DikkatDA – Dikkat Dijital Ajans (“Şirket”) tarafından aşağıda açıklanan kapsamda işlenebilecektir.'],
  ['İşlenen kişisel veriler', 'İletişim formları aracılığıyla paylaştığınız ad, soyad, firma, e-posta adresi, telefon numarası ve mesaj içeriği ile web sitesi kullanımına ilişkin teknik veriler işlenmektedir.'],
  ['İşleme amaçları', 'Talep ve sorularınızın yanıtlanması, teklif hazırlanması, hizmetlerin sunulması, sözleşme süreçlerinin yürütülmesi ve yasal yükümlülüklerin yerine getirilmesi.'],
  ['Hukuki sebepler', 'Kişisel verileriniz KVKK’nın 5. maddesinde yer alan sözleşmenin kurulması ve ifası, hukuki yükümlülük, meşru menfaat ve gerektiğinde açık rıza hukuki sebeplerine dayanılarak işlenir.'],
  ['Aktarım', 'Kişisel verileriniz, yalnızca yukarıdaki amaçlarla sınırlı olarak hizmet aldığımız tedarikçilere ve yetkili kamu kurumlarına aktarılabilir.'],
  ['Haklarınız', 'KVKK’nın 11. maddesi kapsamında kişisel verilerinizin işlenip işlenmediğini öğrenme, bilgi talep etme, düzeltme, silme ve itiraz etme haklarına sahipsiniz. Taleplerinizi info@dikkatda.com adresine iletebilirsiniz.'],
]);
legal('kurumsal/gizlilik-politikasi.html', 'Gizlilik Politikası', [
  ['Kapsam', 'Bu politika, dikkatda.com web sitesini ziyaret eden kullanıcıların bilgilerinin nasıl toplandığını, kullanıldığını ve korunduğunu açıklar.'],
  ['Toplanan bilgiler', 'Formlar aracılığıyla bilerek paylaştığınız bilgiler ile tarayıcı türü, ziyaret edilen sayfalar ve ziyaret süresi gibi anonim kullanım bilgileri toplanabilir.'],
  ['Bilgilerin kullanımı', 'Toplanan bilgiler; taleplerinizi yanıtlamak, hizmetlerimizi geliştirmek ve sitenin güvenliğini sağlamak amacıyla kullanılır. Bilgileriniz izniniz olmadan üçüncü taraflara satılmaz.'],
  ['Üçüncü taraf hizmetler', 'Ücretsiz araçlarımızın bazıları (ör. PageSpeed Insights, DNS sorguları, QR oluşturucu) üçüncü taraf servisleri kullanır. Bu araçlara girdiğiniz bilgiler ilgili servise iletilir.'],
  ['Güvenlik', 'Bilgilerinizi korumak için uygun teknik ve idari önlemleri alıyoruz.'],
  ['İletişim', 'Gizlilikle ilgili sorularınız için info@dikkatda.com adresine yazabilirsiniz.'],
]);
legal('kurumsal/cerez-politikasi.html', 'Çerez Politikası', [
  ['Çerez nedir?', 'Çerezler, ziyaret ettiğiniz web siteleri tarafından tarayıcınıza kaydedilen küçük metin dosyalarıdır.'],
  ['Kullandığımız çerezler', 'Zorunlu çerezler sitenin çalışması için gereklidir. Analitik ve pazarlama çerezleri yalnızca onayınızla kullanılır.'],
  ['Çerezleri yönetme', 'Tarayıcı ayarlarınızdan çerezleri silebilir ya da engelleyebilirsiniz. Bu durumda sitenin bazı özellikleri beklendiği gibi çalışmayabilir.'],
  ['Değişiklikler', 'Bu politika gerektiğinde güncellenebilir. Güncel sürüm her zaman bu sayfada yayımlanır.'],
]);

/* ============ 8. Referanslar, İletişim, Teklif, 404 ============ */
{
  const crumbs = [HOME, ['Referanslar']];
  const tags = [...new Map(C.references.map(r => [r[3], r[2]])).entries()];
  write('referanslar.html', { title: 'Referanslar | DikkatDA', desc: 'Farklı sektörlerde, ihtiyaçlara özel BT, yazılım, web ve dijital pazarlama projelerimiz.', active: 'referanslar.html', ld: crumbLd(crumbs),
    body: [hero({ crumbs, eyebrow: 'Referanslar', title: 'Referans<span class="accent">larımız</span>', lead: 'Farklı sektörlerde, ihtiyaçlara özel dijital projeler.' }),
      section('', '', `      <div class="filter-bar" data-filter-group="ref"><button type="button" class="chip active" data-filter="all">Tümü</button>${tags.map(([id, n]) => `<button type="button" class="chip" data-filter="${id}">${n}</button>`).join('')}</div>
      <div class="ref-grid wide" data-filter-items="ref">
${C.references.map(r => `        <figure class="ref-card show-cap" data-tags="${r[3]}"><div class="thumb ${r[0]}"></div><figcaption>${r[1]}<small>${r[2]} · ${r[4]}</small></figcaption></figure>`).join('\n')}
      </div>
      <!-- İÇERİK: Proje görselleri örnek amaçlıdır; gerçek proje görselleri ve müşteri izinleriyle güncelleyin. -->`),
      cta('Sıradaki başarı hikâyesi <span class="accent">sizin olsun.</span>')].join('\n') });
}
{
  const crumbs = [HOME, ['İletişim']];
  write('iletisim.html', { title: 'İletişim | DikkatDA', desc: 'DikkatDA ile iletişime geçin: İstanbul, info@dikkatda.com, +90 (212) 000 00 00.', active: 'iletisim.html',
    ld: [crumbLd(crumbs), { '@context': 'https://schema.org', '@type': 'ContactPage', name: 'İletişim' }],
    body: [hero({ crumbs, eyebrow: 'İletişim', title: 'Bize <span class="accent">ulaşın</span>', lead: 'Sorularınız, projeleriniz ya da iş birliği teklifleriniz için buradayız.', actions: '', compact: true }),
      section('', '', formSplit(contactSide('İletişim bilgilerimiz', 'Hafta içi 09:00–18:00 arasında telefonla, her zaman e-posta ve form üzerinden bize ulaşabilirsiniz.'), leadForm({ title: 'Mesaj gönderin', subject: 'İletişim formu', extra: `<label class="field full"><span>Konu</span><select name="konu-secim"><option>Teklif talebi</option><option>Teknik destek</option><option>İş birliği</option><option>Diğer</option></select></label>` }))),
      `  <section class="map-wrap"><iframe title="DikkatDA konum haritası" loading="lazy" src="https://www.openstreetmap.org/export/embed.html?bbox=28.85%2C40.95%2C29.15%2C41.12&amp;layer=mapnik"></iframe></section>`].join('\n') });
}
{
  const crumbs = [HOME, ['Teklif Al']];
  write('teklif-al.html', { title: 'Teklif Al | DikkatDA', desc: 'İhtiyacınızı birkaç adımda anlatın, size özel ve şeffaf teklifimizi hazırlayalım.', ld: crumbLd(crumbs),
    body: [hero({ crumbs, eyebrow: 'Teklif Al', title: 'Size özel <span class="accent">teklif</span> hazırlayalım', lead: 'Üç kısa adımda ihtiyacınızı anlatın; en geç 1 iş günü içinde dönüş yapalım.', actions: '', compact: true }),
      `  <section class="section">
    <div class="container narrow">
      <form class="quote-form js-form" id="teklif" action="#" method="post" novalidate>
        <ol class="quote-steps" aria-hidden="true"><li class="active"><span>1</span>Hizmetler</li><li><span>2</span>Proje bilgisi</li><li><span>3</span>İletişim</li></ol>
        <input type="hidden" name="konu" value="Teklif talebi">
        <fieldset class="q-step" data-step="1">
          <legend>Hangi alanlarda desteğe ihtiyacınız var?</legend>
          <div class="check-grid">
${allServices.map(s => `            <label class="check-card"><input type="checkbox" name="hizmet" value="${slug(s.name)}"><span>${I(s.icon)}${s.name}</span></label>`).join('\n')}
          </div>
          <p class="q-error" hidden>Lütfen en az bir alan seçin.</p>
          <div class="q-nav"><span></span><button type="button" class="btn btn-primary" data-next>İleri ${I('arrow-right')}</button></div>
        </fieldset>
        <fieldset class="q-step" data-step="2" hidden>
          <legend>Projenizden biraz bahseder misiniz?</legend>
          <div class="form-grid">
            <label class="field"><span>Sektör</span><select name="sektor"><option value="">Seçiniz</option>${sectors.map(s => `<option>${s.name}</option>`).join('')}<option>Diğer</option></select></label>
            <label class="field"><span>Çalışan sayısı</span><select name="calisan"><option>1–10</option><option>11–50</option><option>51–200</option><option>200+</option></select></label>
            <label class="field"><span>Tahmini bütçe</span><select name="butce"><option>Henüz belirlenmedi</option><option>50.000 ₺ altı</option><option>50.000 – 150.000 ₺</option><option>150.000 – 500.000 ₺</option><option>500.000 ₺ üzeri</option></select></label>
            <label class="field"><span>Ne zaman başlamak istersiniz?</span><select name="zaman"><option>Hemen</option><option>1 ay içinde</option><option>1–3 ay içinde</option><option>Sadece araştırıyorum</option></select></label>
            <label class="field full"><span>Kısaca ihtiyacınız</span><textarea name="mesaj" rows="4" placeholder="Mevcut durumunuz ve hedefleriniz…"></textarea></label>
          </div>
          <div class="q-nav"><button type="button" class="btn btn-outline" data-prev>Geri</button><button type="button" class="btn btn-primary" data-next>İleri ${I('arrow-right')}</button></div>
        </fieldset>
        <fieldset class="q-step" data-step="3" hidden>
          <legend>Size nasıl ulaşalım?</legend>
          <div class="form-grid">
            <label class="field"><span>Ad Soyad *</span><input name="ad" required autocomplete="name"></label>
            <label class="field"><span>Firma</span><input name="firma" autocomplete="organization"></label>
            <label class="field"><span>E-posta *</span><input type="email" name="eposta" required autocomplete="email"></label>
            <label class="field"><span>Telefon</span><input type="tel" name="telefon" autocomplete="tel"></label>
          </div>
          <label class="check"><input type="checkbox" name="kvkk" required><span><a href="kurumsal/kvkk.html">KVKK Aydınlatma Metni</a>’ni okudum ve kabul ediyorum. *</span></label>
          <div class="q-nav"><button type="button" class="btn btn-outline" data-prev>Geri</button><button type="submit" class="btn btn-primary">${I('send')}Teklif iste</button></div>
        </fieldset>
        <div class="form-success" role="status" hidden>${I('check')}<div><strong>Teşekkürler!</strong><span>Teklif talebiniz alındı. En geç 1 iş günü içinde sizinle iletişime geçeceğiz.</span></div></div>
      </form>
    </div>
  </section>`].join('\n') });
}
write('404.html', { title: 'Sayfa bulunamadı | DikkatDA', desc: 'Aradığınız sayfa bulunamadı.', body: `  <section class="section notfound"><div class="container"><span class="nf-code">404</span><h1>Aradığınız sayfa bulunamadı</h1><p>Sayfa taşınmış ya da kaldırılmış olabilir.</p><div class="hero-actions center"><a class="btn btn-primary" href="index.html">Ana sayfaya dön</a><a class="btn btn-outline" href="hizmetler/index.html">Hizmetleri incele</a></div></div></section>` });

/* ============ sitemap & robots ============ */
const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${written.filter(p => p !== '404.html').map(p => `  <url><loc>${SITE}${p === 'index.html' ? '' : p}</loc><lastmod>${today}</lastmod></url>`).join('\n')}\n</urlset>\n`);
fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /admin/\n\nSitemap: ${SITE}sitemap.xml\n`);

console.log(`${written.length} sayfa üretildi -> ${OUT}`);
