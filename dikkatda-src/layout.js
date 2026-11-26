// Generates dikkatda/index.html
const fs = require('fs');
const path = require('path');


const slug = s => s.toLocaleLowerCase('tr-TR')
  .replace(/ç/g, 'c').replace(/ğ/g, 'g').replace(/ı/g, 'i').replace(/i̇/g, 'i').replace(/ö/g, 'o')
  .replace(/ş/g, 's').replace(/ü/g, 'u').replace(/â/g, 'a').replace(/î/g, 'i').replace(/û/g, 'u')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const I = (name, cls = '') => `<svg class="ico${cls ? ' ' + cls : ''}" aria-hidden="true"><use href="#i-${name}"/></svg>`;

/* ---------------- ICONS ---------------- */
const icons = {
  laptop: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M2 20h20"/>',
  server: '<rect x="3" y="3" width="18" height="7" rx="2"/><rect x="3" y="14" width="18" height="7" rx="2"/><path d="M7 6.5h.01M7 17.5h.01M11 6.5h6M11 17.5h6"/>',
  network: '<circle cx="12" cy="5" r="2.5"/><circle cx="5" cy="19" r="2.5"/><circle cx="19" cy="19" r="2.5"/><path d="M12 7.5v4M12 11.5l-5.2 5.4M12 11.5l5.2 5.4"/>',
  shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
  'cloud-up': '<path d="M7 18a5 5 0 1 1 .9-9.9A6 6 0 0 1 19 10a4 4 0 0 1-1 8z"/><path d="M12 16v-5M9.5 13.5 12 11l2.5 2.5"/>',
  database: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
  code: '<path d="M8 6l-6 6 6 6M16 6l6 6-6 6M14 4l-4 16"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  megaphone: '<path d="M3 11v2a1 1 0 0 0 1 1h3l7 4V6l-7 4H4a1 1 0 0 0-1 1z"/><path d="M18 9a4 4 0 0 1 0 6M7 14l1.5 5h2.5l-1-4.5"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  chart: '<path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/>',
  bars: '<path d="M5 20V12M10 20V6M15 20v-9M20 20V4"/>',
  share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/>',
  pen: '<path d="M12 19l7-7 3 3-7 7z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18z"/><path d="M2 2l7.6 7.6"/><circle cx="11" cy="11" r="2"/>',
  film: '<rect x="2" y="3" width="20" height="18" rx="2"/><path d="M7 3v18M17 3v18M2 8h5M2 16h5M17 8h5M17 16h5M2 12h20"/>',
  cpu: '<rect x="5" y="5" width="14" height="14" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3"/>',
  graduation: '<path d="M22 9 12 4 2 9l10 5z"/><path d="M6 11v5c3 2 9 2 12 0v-5M22 9v6"/>',
  cart: '<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.7 12.4a2 2 0 0 0 2 1.6h8.6a2 2 0 0 0 2-1.6L22 7H6"/>',
  mobile: '<rect x="6" y="2" width="12" height="20" rx="2"/><path d="M11 18h2"/>',
  monitor: '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>',
  layers: '<path d="m12 2 10 5-10 5L2 7z"/><path d="m2 12 10 5 10-5M2 17l10 5 10-5"/>',
  book: '<path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2zM22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><path d="m9 16 2 2 4-4"/>',
  factory: '<path d="M2 20V9l6 4V9l6 4V4h4l2 16z"/><path d="M2 20h20M7 17h1M12 17h1M17 17h1"/>',
  bag: '<path d="M5 7h14l1 14H4z"/><path d="M9 10V6a3 3 0 0 1 6 0v4"/>',
  truck: '<path d="M1 5h13v11H1zM14 9h4l4 4v3h-8"/><circle cx="5.5" cy="18" r="2"/><circle cx="17.5" cy="18" r="2"/>',
  heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z"/><path d="M5 12h3l2-3 3 6 2-3h4"/>',
  building: '<rect x="4" y="2" width="16" height="20" rx="1"/><path d="M9 22v-4h6v4M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01"/>',
  leaf: '<path d="M11 20A7 7 0 0 1 4 13c0-6 6-10 16-10 0 10-4 17-9 17z"/><path d="M4 21c4-6 8-9 12-11"/>',
  dots: '<circle cx="5" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="19" cy="12" r="1.3"/>',
  headset: '<path d="M3 14v-2a9 9 0 0 1 18 0v2"/><path d="M21 15a2 2 0 0 1-2 2h-1v-6h1a2 2 0 0 1 2 2zM3 15a2 2 0 0 0 2 2h1v-6H5a2 2 0 0 0-2 2z"/><path d="M19 17v1a3 3 0 0 1-3 3h-3"/>',
  'arrow-right': '<path d="M5 12h14M13 6l6 6-6 6"/>',
  'arrow-up': '<path d="M12 19V5M6 11l6-6 6 6"/>',
  'chevron-right': '<path d="m9 6 6 6-6 6"/>',
  'chevron-down': '<path d="m6 9 6 6 6-6"/>',
  send: '<path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  users: '<circle cx="9" cy="8" r="4"/><path d="M2 21a7 7 0 0 1 14 0"/><path d="M16 4a4 4 0 0 1 0 8M22 21a7 7 0 0 0-4-6.3"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 6 10 7 10-7"/>',
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
  pin: '<path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/>',
  video: '<rect x="2" y="6" width="14" height="12" rx="2"/><path d="m16 10 6-3v10l-6-3"/>',
  bot: '<rect x="4" y="8" width="16" height="12" rx="3"/><path d="M12 4v4M9 13h.01M15 13h.01M9 17h6"/><circle cx="12" cy="3" r="1"/>',
  lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  wifi: '<path d="M2 8.8a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0"/><circle cx="12" cy="19.5" r="1"/>',
  briefcase: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2M2 13h20"/>',
  bed: '<path d="M2 20V6M2 16h20v4M22 16v-4a3 3 0 0 0-3-3h-8v7"/><circle cx="6.5" cy="11.5" r="2"/>',
  utensils: '<path d="M4 2v7a3 3 0 0 0 3 3v10M10 2v7a3 3 0 0 1-3 3M7 2v6"/><path d="M18 22V2c-2 1-4 4-4 8h4"/>',
  helmet: '<path d="M2 18h20v2H2zM4 18v-3a8 8 0 0 1 16 0v3"/><path d="M10 7V4h4v3"/>',
  home: '<path d="m3 10 9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>',
  car: '<path d="M5 17H3v-5l2-5h14l2 5v5h-2"/><circle cx="7.5" cy="17" r="2"/><circle cx="16.5" cy="17" r="2"/><path d="M9.5 17h5M3 12h18"/>',
  scale: '<path d="M12 3v18M7 21h10M4 7h16"/><path d="m7 7-3 7a3 3 0 0 0 6 0zM17 7l-3 7a3 3 0 0 0 6 0z"/>',
  calculator: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01M8 19h.01M12 19h4"/>',
  sparkles: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>',
  shirt: '<path d="M20.4 6.6 16 3a4 4 0 0 1-8 0L3.6 6.6a1 1 0 0 0-.2 1.3L5 11h2v10h10V11h2l1.6-3.1a1 1 0 0 0-.2-1.3z"/>',
  rocket: '<path d="M4.5 16.5c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2.1-.1-2.9a2.2 2.2 0 0 0-2.9-.1z"/><path d="M12 15l-3-3a22 22 0 0 1 2-4A13 13 0 0 1 22 2c0 2.7-.8 7.5-6 11a22 22 0 0 1-4 2z"/><path d="M9 12H4s.6-3 2-4c1.6-1.1 5 0 5 0M12 15v5s3-.6 4-2c1.1-1.6 0-5 0-5"/>',
  store: '<path d="M3 9l2-5h14l2 5M4 9v11h16V9M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0"/><path d="M9 20v-6h6v6"/>',
  qr: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM18 18h3v3h-3zM14 21h1M21 14v1"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>',
  image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/>',
  gauge: '<path d="M12 14l4-4"/><path d="M3.3 19a10 10 0 1 1 17.4 0z"/>',
  percent: '<path d="M19 5 5 19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>',
  wrench: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a6 6 0 0 1-7.9 7.9l-6.9 6.9a2.1 2.1 0 0 1-3-3l6.9-6.9a6 6 0 0 1 7.9-7.9z"/>',
  check: '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  message: '<path d="M21 12a8 8 0 0 1-11.6 7.1L3 21l1.9-6.4A8 8 0 1 1 21 12z"/>',
  refresh: '<path d="M21 12a9 9 0 0 1-15.5 6.3L3 16M3 12a9 9 0 0 1 15.5-6.3L21 8"/><path d="M21 3v5h-5M3 21v-5h5"/>',
  award: '<circle cx="12" cy="8" r="6"/><path d="M8.2 13 7 22l5-3 5 3-1.2-9"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  zap: '<path d="M13 2 3 14h9l-1 8 10-12h-9z"/>',
  filter: '<path d="M22 3H2l8 9.5V19l4 2v-8.5z"/>',
  home2: '<path d="M3 21h18M5 21V8l7-5 7 5v13M9 21v-6h6v6"/>',
  dns: '<rect x="2" y="3" width="20" height="8" rx="2"/><rect x="2" y="13" width="20" height="8" rx="2"/><path d="M6 7h.01M6 17h.01"/>',
  instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>',
  linkedin: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 10v7M8 7h.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7"/>',
  youtube: '<rect x="2" y="5" width="20" height="14" rx="4"/><path d="m10 9 5 3-5 3z"/>',
  xsocial: '<path d="M4 4l16 16M20 4 4 20"/>',
  facebook: '<path d="M15 3h-2a4 4 0 0 0-4 4v3H7v4h2v7h4v-7h3l1-4h-4V7a1 1 0 0 1 1-1h2z"/>',
};
const sprite = `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">\n${Object.entries(icons).map(([k, v]) => `  <symbol id="i-${k}" viewBox="0 0 24 24">${v}</symbol>`).join('\n')}\n</svg>`;

/* ---------------- DATA: HİZMETLER ---------------- */
const serviceGroups = [
  { label: 'Teknoloji ve Altyapı', items: [
    { name: 'Bilgi Teknolojileri', icon: 'laptop', card: 'BT Danışmanlığı ve Destek', short: 'Teknoloji stratejisi ve çözüm danışmanlığı', desc: 'BT operasyonlarınızı stratejiden günlük desteğe kadar uçtan uca yönetiyoruz.', links: ['BT danışmanlığı', 'Dış kaynak BT hizmetleri', 'Uzaktan teknik destek', 'Yerinde teknik destek', 'Bilgisayar bakım ve onarım', 'Donanım ve yazılım tedariki', 'BT envanter yönetimi', 'Lisans yönetimi'] },
    { name: 'Sistem ve Sunucu', icon: 'server', short: 'Sunucu kurulumu, yönetimi ve optimizasyonu', desc: 'Windows ve Linux sunuculardan sanallaştırmaya kadar kesintisiz çalışan sistemler.', links: ['Windows Server', 'Linux Server', 'Active Directory ve GPO', 'Sanallaştırma', 'Proxmox, VMware ve Hyper-V', 'Sunucu kurulumu ve yönetimi', 'Veri merkezi hizmetleri', 'Sistem izleme ve raporlama'] },
    { name: 'Network ve Altyapı', icon: 'network', short: 'Güvenli, hızlı ve ölçeklenebilir altyapılar', desc: 'Kablolu ve kablosuz ağlardan şubeler arası bağlantıya kadar sağlam altyapı.', links: ['Ağ altyapısı kurulumu', 'Kablolu ve kablosuz ağlar', 'VLAN ve VPN çözümleri', 'Firewall kurulumu', 'Şubeler arası bağlantı', 'Yapısal kablolama', 'Hotspot sistemleri', 'Ağ performans optimizasyonu'] },
    { name: 'Siber Güvenlik', icon: 'shield', short: 'Veri, sistem ve erişim güvenliği çözümleri', desc: 'Kurumunuzu tehditlere karşı katmanlı güvenlik yaklaşımıyla koruyoruz.', links: ['Kurumsal güvenlik danışmanlığı', 'Güvenlik duvarı yönetimi', 'Uç nokta güvenliği', 'Güvenlik risk değerlendirmesi', 'E-posta güvenliği', 'Veri kaybı önleme', 'Güvenlik açığı değerlendirmesi', 'Siber güvenlik farkındalık eğitimleri'] },
    { name: 'Bulut Teknolojileri', icon: 'cloud-up', short: 'Bulut altyapıları ve hibrit sistemler', desc: 'Azure, Google Cloud ve AWS üzerinde esnek, güvenli ve ölçeklenebilir altyapılar.', links: ['Microsoft Azure', 'Google Cloud', 'Amazon Web Services', 'Microsoft 365', 'Google Workspace', 'Bulut sunucu yönetimi', 'Buluta geçiş danışmanlığı', 'Hibrit bulut sistemleri'] },
    { name: 'Yedekleme ve Veri Yönetimi', icon: 'database', short: 'Güvenli yedekleme ve felaket kurtarma', desc: 'Verileriniz her koşulda güvende, işiniz her koşulda ayakta.', links: ['Sunucu yedekleme', 'Bulut yedekleme', 'NAS ve depolama sistemleri', 'Felaket kurtarma', 'İş sürekliliği', 'Veri taşıma', 'Veritabanı yönetimi'] },
  ] },
  { label: 'Yazılım ve Web', items: [
    { name: 'Yazılım Geliştirme', icon: 'code', short: 'İhtiyaca özel, ölçeklenebilir yazılım çözümleri', desc: 'Web, masaüstü ve mobil platformlarda kurumunuza özel yazılımlar geliştiriyoruz.', links: ['Kuruma özel yazılımlar', 'Web tabanlı uygulamalar', 'Masaüstü uygulamaları', 'Mobil uygulamalar', 'API entegrasyonları', 'CRM yazılımları', 'ERP entegrasyonları', 'SaaS uygulamaları', 'Yazılım bakım ve destek'] },
    { name: 'Web Tasarım ve Geliştirme', icon: 'globe', short: 'Kurumsal web siteleri ve e-ticaret çözümleri', desc: 'Hızlı, güvenli ve dönüşüm odaklı web siteleri tasarlıyor ve geliştiriyoruz.', links: ['Kurumsal web sitesi', 'E-ticaret sitesi', 'Landing page', 'Web portalları', 'WordPress çözümleri', 'UI/UX tasarımı', 'Hosting ve domain', 'Web sitesi bakım ve destek', 'Web performans optimizasyonu'] },
  ] },
  { label: 'Pazarlama ve Marka', items: [
    { name: 'Dijital Pazarlama', icon: 'megaphone', short: 'Markanız için ölçülebilir dijital büyüme', desc: 'Doğru kanalda, doğru kitleye, ölçülebilir reklam kampanyaları yönetiyoruz.', links: ['Google Ads', 'Meta Ads', 'TikTok Ads', 'LinkedIn Ads', 'YouTube reklamları', 'Yeniden pazarlama', 'E-posta pazarlaması', 'Dijital reklam danışmanlığı', 'Dönüşüm optimizasyonu'] },
    { name: 'SEO ve Analiz', icon: 'search', short: 'Arama görünürlüğü ve veri odaklı analiz', desc: 'Arama motorlarında görünürlüğünüzü artırıyor, kararlarınızı veriyle destekliyoruz.', links: ['Teknik SEO', 'Yerel SEO', 'E-ticaret SEO', 'İçerik SEO', 'Anahtar kelime analizi', 'Rakip analizi', 'Google Analytics', 'Google Search Console', 'Google İşletme Profili yönetimi'] },
    { name: 'Sosyal Medya Yönetimi', icon: 'share', short: 'İçerik planlama, topluluk ve raporlama', desc: 'Markanızın sesini tüm sosyal platformlarda tutarlı ve etkili şekilde duyuruyoruz.', links: ['Instagram yönetimi', 'Facebook yönetimi', 'TikTok yönetimi', 'LinkedIn yönetimi', 'YouTube kanal yönetimi', 'İçerik planlama', 'Topluluk yönetimi', 'Sosyal medya raporlama'] },
    { name: 'Kreatif Tasarım ve Prodüksiyon', icon: 'pen', short: 'Kurumsal kimlik, video ve 3D prodüksiyon', desc: 'Logodan tanıtım filmine kadar markanızı akılda kalıcı kılan kreatif işler.', links: ['Logo tasarımı', 'Kurumsal kimlik', 'Grafik tasarım', 'Reklam kreatifleri', 'Motion graphics', '3D modelleme', '3D animasyon', 'Tanıtım filmi', 'Reels ve Shorts üretimi', 'Ürün fotoğrafçılığı', 'Seslendirme'] },
  ] },
  { label: 'Yapay Zekâ ve Gelişim', items: [
    { name: 'Yapay Zekâ ve Otomasyon', icon: 'cpu', short: 'İş süreçlerini hızlandıran akıllı çözümler', desc: 'Tekrarlayan işleri otomatikleştiriyor, yapay zekâyı iş süreçlerinize entegre ediyoruz.', links: ['Yapay zekâ danışmanlığı', 'Kurumsal chatbot', 'Yapay zekâ destekli müşteri hizmetleri', 'İş süreçleri otomasyonu', 'Belge işleme otomasyonu', 'Raporlama otomasyonu', 'CRM otomasyonu', 'Yapay zekâ entegrasyonları'] },
    { name: 'Eğitim ve Danışmanlık', icon: 'graduation', short: 'Kurumsal eğitimler ve dönüşüm danışmanlığı', desc: 'Ekiplerinizi yeni teknolojilere hazırlıyor, dönüşüm yolculuğunuza rehberlik ediyoruz.', links: ['Kurumsal BT eğitimleri', 'Microsoft 365 eğitimleri', 'Siber güvenlik eğitimleri', 'Dijital reklam eğitimleri', 'Yapay zekâ eğitimleri', 'Dijital dönüşüm danışmanlığı'] },
  ] },
];
const allServices = serviceGroups.flatMap(g => g.items);

/* ---------------- DATA: ÇÖZÜMLER ---------------- */
const solutions = [
  { id: 'kurumsal-bt', name: 'Kurumsal BT çözümleri', icon: 'briefcase', subs: 'BT departmanı yönetimi, dış kaynak personel, teknik destek' },
  { id: 'dijital-donusum', name: 'Dijital dönüşüm', icon: 'refresh', subs: 'Dijital olgunluk analizi, süreçlerin dijitalleştirilmesi' },
  { id: 'cok-subeli', name: 'Çok şubeli işletmeler', icon: 'network', subs: 'Merkezi yönetim, şubeler arası bağlantı, ortak altyapı' },
  { id: 'uzaktan-calisma', name: 'Uzaktan çalışma', icon: 'wifi', subs: 'VPN, uzaktan erişim, görüntülü toplantı, ekip yönetimi' },
  { id: 'e-ticaret', name: 'E-ticaret çözümleri', icon: 'cart', subs: 'Mağaza kurulumu, ödeme, kargo, pazaryeri entegrasyonu' },
  { id: 'musteri-kazanimi', name: 'Müşteri kazanımı', icon: 'target', subs: 'Dijital reklam, SEO, potansiyel müşteri oluşturma' },
  { id: 'kurumsal-iletisim', name: 'Kurumsal iletişim', icon: 'mail', subs: 'E-posta, ortak dosya paylaşımı, toplantı sistemleri' },
  { id: 'is-surekliligi', name: 'İş sürekliliği', icon: 'database', subs: 'Yedekleme, felaket kurtarma, kesintisiz çalışma' },
  { id: 'veri-guvenligi', name: 'Veri güvenliği', icon: 'lock', subs: 'Veri koruma, erişim yönetimi, güvenli depolama' },
  { id: 'otomasyon', name: 'İş süreçleri otomasyonu', icon: 'zap', subs: 'Tekrarlayan görevler, onay süreçleri, raporlama' },
  { id: 'dijital-marka', name: 'Dijital marka oluşturma', icon: 'sparkles', subs: 'Kurumsal kimlik, web sitesi, sosyal medya' },
  { id: 'satis-pazarlama', name: 'Satış ve pazarlama', icon: 'chart', subs: 'CRM, satış otomasyonu, kampanya yönetimi' },
  { id: 'musteri-deneyimi', name: 'Müşteri deneyimi', icon: 'message', subs: 'Chatbot, destek talepleri, çağrı merkezi' },
  { id: 'akilli-ofis', name: 'Akıllı ofis', icon: 'building', subs: 'Network, IP telefon, erişim kontrolü, toplantı altyapısı' },
  { id: 'yeni-isletme', name: 'Yeni işletme kurulumu', icon: 'rocket', subs: 'Sıfırdan BT altyapısı, web sitesi, marka ve reklam kurulumu' },
];

/* ---------------- DATA: SEKTÖRLER ---------------- */
const sectors = [
  { id: 'uretim-ve-sanayi', name: 'Üretim ve sanayi', short: 'Üretim', icon: 'factory', sol: ['kurumsal-bt', 'dijital-donusum', 'cok-subeli', 'is-surekliligi', 'veri-guvenligi', 'otomasyon', 'akilli-ofis'] },
  { id: 'perakende', name: 'Perakende', icon: 'bag', sol: ['cok-subeli', 'e-ticaret', 'musteri-kazanimi', 'musteri-deneyimi', 'satis-pazarlama', 'dijital-marka', 'kurumsal-bt'] },
  { id: 'e-ticaret', name: 'E-ticaret', icon: 'cart', sol: ['e-ticaret', 'musteri-kazanimi', 'musteri-deneyimi', 'dijital-marka', 'otomasyon', 'satis-pazarlama', 'veri-guvenligi'] },
  { id: 'saglik', name: 'Sağlık', icon: 'heart', sol: ['veri-guvenligi', 'is-surekliligi', 'musteri-deneyimi', 'kurumsal-iletisim', 'kurumsal-bt', 'cok-subeli', 'akilli-ofis'] },
  { id: 'egitim', name: 'Eğitim', icon: 'graduation', sol: ['uzaktan-calisma', 'kurumsal-iletisim', 'dijital-donusum', 'musteri-kazanimi', 'dijital-marka', 'veri-guvenligi'] },
  { id: 'turizm-ve-otelcilik', name: 'Turizm ve otelcilik', icon: 'bed', sol: ['musteri-kazanimi', 'musteri-deneyimi', 'dijital-marka', 'akilli-ofis', 'cok-subeli', 'satis-pazarlama'] },
  { id: 'restoran-ve-kafe', name: 'Restoran ve kafe', icon: 'utensils', sol: ['dijital-marka', 'musteri-kazanimi', 'cok-subeli', 'musteri-deneyimi', 'e-ticaret'] },
  { id: 'insaat', name: 'İnşaat', icon: 'helmet', sol: ['uzaktan-calisma', 'kurumsal-iletisim', 'kurumsal-bt', 'is-surekliligi', 'otomasyon', 'cok-subeli'] },
  { id: 'gayrimenkul', name: 'Gayrimenkul', icon: 'home', sol: ['musteri-kazanimi', 'satis-pazarlama', 'dijital-marka', 'musteri-deneyimi', 'otomasyon'] },
  { id: 'lojistik', name: 'Lojistik', icon: 'truck', sol: ['cok-subeli', 'otomasyon', 'is-surekliligi', 'kurumsal-bt', 'veri-guvenligi', 'uzaktan-calisma'] },
  { id: 'otomotiv', name: 'Otomotiv', icon: 'car', sol: ['satis-pazarlama', 'musteri-kazanimi', 'musteri-deneyimi', 'cok-subeli', 'dijital-marka'] },
  { id: 'hukuk', name: 'Hukuk', icon: 'scale', sol: ['veri-guvenligi', 'kurumsal-iletisim', 'uzaktan-calisma', 'is-surekliligi', 'akilli-ofis', 'otomasyon'] },
  { id: 'finans-ve-muhasebe', name: 'Finans ve muhasebe', icon: 'calculator', sol: ['veri-guvenligi', 'is-surekliligi', 'otomasyon', 'kurumsal-iletisim', 'kurumsal-bt', 'uzaktan-calisma'] },
  { id: 'guzellik-ve-kozmetik', name: 'Güzellik ve kozmetik', icon: 'sparkles', sol: ['dijital-marka', 'musteri-kazanimi', 'e-ticaret', 'satis-pazarlama', 'musteri-deneyimi'] },
  { id: 'tekstil-ve-moda', name: 'Tekstil ve moda', icon: 'shirt', sol: ['e-ticaret', 'dijital-marka', 'musteri-kazanimi', 'otomasyon', 'satis-pazarlama', 'cok-subeli'] },
  { id: 'kobiler', name: "KOBİ'ler", icon: 'store', sol: ['kurumsal-bt', 'yeni-isletme', 'dijital-marka', 'musteri-kazanimi', 'kurumsal-iletisim', 'veri-guvenligi'] },
  { id: 'start-up-sirketleri', name: 'Start-up şirketleri', icon: 'rocket', sol: ['yeni-isletme', 'dijital-marka', 'musteri-kazanimi', 'uzaktan-calisma', 'otomasyon', 'satis-pazarlama'] },
];
solutions.forEach(s => { s.sectors = sectors.filter(x => x.sol.includes(s.id)).map(x => x.id); });

/* ---------------- DATA: ÜCRETSİZ ARAÇLAR ---------------- */
const toolCols = [
  { title: 'Web ve Site Analizi', items: [['Ücretsiz web sitesi analizi', 'monitor', 'Popüler'], ['Site hız testi', 'gauge'], ['SEO ön analizi', 'search'], ['SSL sertifika kontrolü', 'lock']] },
  { title: 'Domain, E-posta ve Ağ', items: [['Domain sorgulama', 'globe'], ['DNS kontrolü', 'dns'], ['SPF, DKIM ve DMARC kontrolü', 'mail'], ['IP adresim nedir?', 'wifi'], ['Subnet hesaplayıcı', 'network']] },
  { title: 'Pazarlama ve Hesaplama', items: [['QR kod oluşturucu', 'qr'], ['UTM bağlantı oluşturucu', 'link'], ['Reklam bütçesi hesaplayıcı', 'bars'], ['ROAS hesaplayıcı', 'chart'], ['KDV hesaplayıcı', 'percent'], ['Görsel boyutlandırma', 'image']] },
  { title: 'Danışmanlık ve Kaynaklar', items: [['Dijital dönüşüm ihtiyaç testi', 'check', 'Yeni'], ['Ücretsiz ön danışmanlık', 'calendar'], ['Ücretsiz eğitim ve rehberler', 'book']] },
];

const resources = [
  ['Blog', 'file', 'Dijital dünyadan güncel içerikler'],
  ['Rehberler', 'book', 'Adım adım uygulama rehberleri'],
  ['Vaka çalışmaları', 'briefcase', 'Projelerimizden gerçek sonuçlar'],
  ['E-kitap ve şablonlar', 'layers', 'Ücretsiz indirilebilir kaynaklar'],
  ['Webinarlar', 'video', 'Canlı ve kayıtlı eğitim yayınları'],
  ['Sıkça sorulan sorular', 'help', 'Merak ettiklerinizin yanıtları'],
  ['Dijital sözlük', 'message', 'Teknik terimler sade bir dille'],
  ['Duyurular', 'megaphone', 'DikkatDA’dan haberler'],
];
const company = [
  ['Hakkımızda', 'building', 'Hikâyemiz, misyonumuz ve değerlerimiz'],
  ['Ekibimiz', 'users', 'İşinizi büyüten uzman kadro'],
  ['Kariyer', 'briefcase', 'Açık pozisyonlar ve staj fırsatları'],
  ['Sertifikalar ve iş ortakları', 'award', 'Teknoloji ortaklıklarımız'],
  ['Çalışma modelimiz', 'refresh', 'Keşiften desteğe şeffaf süreç'],
  ['Basın odası', 'megaphone', 'Basında DikkatDA ve medya kiti'],
];

/* ---------------- BUILDERS ---------------- */
const tabId = s => 'ms-' + slug(s.name);

const megaServices = `
        <div class="mega mega-services" id="mega-hizmetler">
          <div class="container mega-inner">
            <div class="ms-tabs" role="tablist" aria-orientation="vertical" aria-label="Hizmet kategorileri">
${serviceGroups.map(g => `              <div class="ms-tab-group">
                <span class="ms-group-label">${g.label}</span>
${g.items.map((s) => { const first = s === allServices[0]; return `                <button type="button" class="ms-tab" role="tab" id="${tabId(s)}-tab" aria-controls="${tabId(s)}" aria-selected="${first}" tabindex="${first ? 0 : -1}">${I(s.icon)}${s.name}${I('chevron-right', 'chev')}</button>`; }).join('\n')}
              </div>`).join('\n')}
            </div>
            <div class="ms-panels">
${allServices.map((s, i) => `              <div class="ms-panel" id="${tabId(s)}" role="tabpanel" aria-labelledby="${tabId(s)}-tab" data-m-group="${s.name}"${i ? ' hidden' : ''}>
                <div class="ms-panel-head">
                  <span class="ico-box">${I(s.icon)}</span>
                  <div><h3>${s.name}</h3><p>${s.desc}</p></div>
                  <a class="link-arrow" href="hizmetler/${slug(s.name)}/index.html">Tümünü gör ${I('arrow-right')}</a>
                </div>
                <ul class="ms-links">
${s.links.map(l => `                  <li><a href="hizmetler/${slug(s.name)}/${slug(l)}.html" data-m-link="${esc(l)}">${l}</a></li>`).join('\n')}
                </ul>
              </div>`).join('\n')}
            </div>
            <aside class="mega-promo">
              <span class="promo-badge">Ücretsiz</span>
              <h4>Hangi hizmete ihtiyacınız var?</h4>
              <p>İşletmenizi 15 dakikada dinleyelim, size uygun hizmet paketini birlikte belirleyelim.</p>
              <ul>
                <li>${I('check')}Ücretsiz ön analiz</li>
                <li>${I('check')}Size özel yol haritası</li>
                <li>${I('check')}Şeffaf fiyatlandırma</li>
              </ul>
              <a class="btn btn-primary btn-sm" href="ucretsiz-araclar/ucretsiz-on-danismanlik.html">Görüşme planla ${I('arrow-right')}</a>
            </aside>
          </div>
          <div class="mega-foot">
            <div class="container">
              <span><strong>${allServices.reduce((n, s) => n + s.links.length, 0)}+ hizmet</strong> · ${allServices.length} uzmanlık alanı · tek çatı altında</span>
              <div class="mega-foot-links">
                <a class="link-arrow" href="hizmetler/index.html">Tüm hizmetler ${I('arrow-right')}</a>
                <a class="link-arrow" href="teklif-al.html">Teklif al ${I('arrow-right')}</a>
              </div>
            </div>
          </div>
        </div>`;

const megaSolutions = `
        <div class="mega mega-solutions" id="mega-cozumler">
          <div class="container mega-inner">
            <div class="sol-main" data-m-group="Çözümler">
              <div class="mega-head">
                <span class="mega-eyebrow">İhtiyaca göre</span>
                <h3>İşletmenizin hangi ihtiyacını çözelim?</h3>
                <p>Teknik terimleri bilmenize gerek yok. İhtiyacınızı seçin, gerekli hizmetleri biz bir araya getirelim.</p>
              </div>
              <div class="sol-grid">
${solutions.map(s => `                <a class="sol-card" href="cozumler/${s.id}.html" data-sectors="${s.sectors.join(' ')}" data-m-link="${esc(s.name)}">
                  <span class="ico-box">${I(s.icon)}</span>
                  <span><strong>${s.name}</strong><small>${s.subs}</small></span>
                </a>`).join('\n')}
              </div>
            </div>
            <aside class="sol-filter">
              <h4>${I('filter')}Sektöre göre filtrele</h4>
              <p>Sektörünüzü seçin, size en uygun çözümleri öne çıkaralım.</p>
              <div class="chips" role="group" aria-label="Sektör filtresi">
                <button type="button" class="chip active" data-sector="all" aria-pressed="true">Tümü</button>
${sectors.map(s => `                <button type="button" class="chip" data-sector="${s.id}" aria-pressed="false">${s.name}</button>`).join('\n')}
              </div>
              <div class="sol-filter-note" aria-live="polite">Tüm çözümler gösteriliyor.</div>
              <a class="link-arrow" id="sectorLink" href="sektorler/index.html">Tüm sektörleri incele ${I('arrow-right')}</a>
            </aside>
          </div>
        </div>`;

const megaSectors = `
        <div class="mega mega-sectors" id="mega-sektorler">
          <div class="container mega-inner">
            <div data-m-group="Sektörler">
              <div class="mega-head">
                <span class="mega-eyebrow">Sektörel uzmanlık</span>
                <h3>Sektörünüze özel dijital ve teknolojik çözümler</h3>
                <p>Her sektörün ihtiyaçları farklıdır. Sektörünüzü seçin, deneyimimizi ve önerilerimizi görün.</p>
              </div>
              <div class="sector-grid">
${sectors.map(s => `                <a class="sector-link" href="sektorler/${s.id}.html" data-m-link="${esc(s.name)}"><span class="ico-box">${I(s.icon)}</span>${s.name}</a>`).join('\n')}
                <a class="sector-link" href="sektorler/index.html" data-m-link="Tüm sektörler"><span class="ico-box">${I('dots')}</span>Tüm sektörler</a>
              </div>
            </div>
            <aside class="mega-promo">
              <span class="promo-badge">Sektör raporu</span>
              <h4>Sektörünüz listede yok mu?</h4>
              <p>Her ölçekte ve her sektörde işletmeye özel çözüm kurguluyoruz. İhtiyacınızı anlatın, size özel bir yol haritası hazırlayalım.</p>
              <a class="btn btn-primary btn-sm" href="iletisim.html">Bize ulaşın ${I('arrow-right')}</a>
            </aside>
          </div>
        </div>`;

const megaTools = `
        <div class="mega mega-tools" id="mega-araclar">
          <div class="container mega-inner">
${toolCols.map(c => `            <div class="tool-col" data-m-group="${c.title}">
              <h4>${c.title}</h4>
              <ul>
${c.items.map(([n, ic, tag]) => `                <li><a class="tool-link" href="ucretsiz-araclar/${slug(n)}.html" data-m-link="${esc(n)}">${I(ic)}${n}${tag ? `<span class="tag">${tag}</span>` : ''}</a></li>`).join('\n')}
              </ul>
            </div>`).join('\n')}
            <aside class="mega-promo">
              <span class="promo-badge">%100 ücretsiz</span>
              <h4>Web siteniz ne durumda?</h4>
              <p>Hız, SEO, güvenlik ve mobil uyumluluğu tek raporda görün. Kayıt gerekmez.</p>
              <a class="btn btn-primary btn-sm" href="ucretsiz-araclar/ucretsiz-web-sitesi-analizi.html">Analizi başlat ${I('arrow-right')}</a>
            </aside>
          </div>
        </div>`;

const megaResources = `
        <div class="mega mega-resources" id="mega-bilgi">
          <div class="container mega-inner">
            <div data-m-group="Bilgi Merkezi" style="grid-column: span 2">
              <div class="mega-head"><span class="mega-eyebrow">Bilgi Merkezi</span><h3>Öğrenin, uygulayın, büyüyün</h3></div>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px 16px">
${resources.map(([n, ic, d]) => `                <a class="rich-link" href="bilgi-merkezi/${slug(n)}.html" data-m-link="${esc(n)}"><span class="ico-box">${I(ic)}</span><span><strong>${n}</strong><small>${d}</small></span></a>`).join('\n')}
              </div>
            </div>
            <a class="feature-post" href="blog/isletmeler-icin-yapay-zeka-firsatlari.html">
              <div class="thumb thumb-5"></div>
              <div class="body"><span>Öne çıkan yazı</span><strong>İşletmeler için yapay zekâ fırsatları: 2026 rehberi</strong></div>
            </a>
          </div>
        </div>`;

const megaCompany = `
        <div class="mega mega-company" id="mega-kurumsal">
          <div class="container mega-inner" data-m-group="Kurumsal">
${[company.slice(0, 2), company.slice(2, 4), company.slice(4)].map(col => `            <div>
${col.map(([n, ic, d]) => `              <a class="rich-link" href="kurumsal/${slug(n)}.html" data-m-link="${esc(n)}"><span class="ico-box">${I(ic)}</span><span><strong>${n}</strong><small>${d}</small></span></a>`).join('\n')}
            </div>`).join('\n')}
            <aside class="mega-promo">
              <span class="promo-badge">Kariyer</span>
              <h4>Ekibimize katılın</h4>
              <p>Teknoloji ve yaratıcılığı birleştiren projelerde yer almak ister misiniz?</p>
              <a class="btn btn-primary btn-sm" href="kurumsal/kariyer.html">Açık pozisyonlar ${I('arrow-right')}</a>
            </aside>
          </div>
        </div>`;

const navItem = (label, href, mega, megaId, active) => mega
  ? `      <li class="nav-item has-mega">
        <a class="nav-link" href="${href}" aria-expanded="false" aria-controls="${megaId}" aria-haspopup="true" data-label="${label}">${label}${I('chevron-down')}</a>${mega}
      </li>`
  : `      <li class="nav-item"><a class="nav-link${active ? ' active' : ''}" href="${href}"${active ? ' aria-current="page"' : ''}>${label}</a></li>`;

const nav = [
  navItem('Ana Sayfa', 'index.html'),
  navItem('Hizmetler', 'hizmetler/index.html', megaServices, 'mega-hizmetler'),
  navItem('Çözümler', 'cozumler/index.html', megaSolutions, 'mega-cozumler'),
  navItem('Sektörler', 'sektorler/index.html', megaSectors, 'mega-sektorler'),
  navItem('Ücretsiz Araçlar', 'ucretsiz-araclar/index.html', megaTools, 'mega-araclar'),
  navItem('Referanslar', 'referanslar.html'),
  navItem('Bilgi Merkezi', 'bilgi-merkezi/index.html', megaResources, 'mega-bilgi'),
  navItem('Kurumsal', 'kurumsal/index.html', megaCompany, 'mega-kurumsal'),
  navItem('İletişim', 'iletisim.html'),
].join('\n');

/* ---------------- HERO ART (inline SVG) ---------------- */
const slab = (x, y) => `<g transform="translate(${x} ${y})">
          <path d="M0 0 90-45 180 0 90 45Z" fill="url(#gTop)"/>
          <path d="M0 0 90 45v26L0 26Z" fill="#1a2b47"/>
          <path d="M90 45 180 0v26L90 71Z" fill="#111f36"/>
          <path d="M12 12 62 37" stroke="#ff7a2e" stroke-width="3" stroke-linecap="round" filter="url(#glow)" class="pulse"/>
          <path d="M12 19 40 33" stroke="#ff7a2e" stroke-opacity=".5" stroke-width="2" stroke-linecap="round"/>
          <circle cx="76" cy="47" r="2.2" fill="#ffb37f"/><circle cx="83" cy="50.5" r="2.2" fill="#4ade80"/>
          <path d="M104 52 166 21M104 59 166 28" stroke="#2c4366" stroke-width="2"/>
        </g>`;

const heroArt = `<svg viewBox="0 0 600 420" role="img" aria-labelledby="heroArtTitle">
        <title id="heroArtTitle">Bulut, sunucu, güvenlik ve yazılım altyapısını gösteren illüstrasyon</title>
        <defs>
          <linearGradient id="gTop" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3a5680"/><stop offset="1" stop-color="#22385a"/></linearGradient>
          <linearGradient id="gCloud" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#b9c9e4"/></linearGradient>
          <linearGradient id="gOrange" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffb070"/><stop offset="1" stop-color="#ff5e0e"/></linearGradient>
          <linearGradient id="gScreen" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1c2f50"/><stop offset="1" stop-color="#0c1830"/></linearGradient>
          <linearGradient id="gMetal" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#cfd8e6"/><stop offset="1" stop-color="#8d9bb3"/></linearGradient>
          <radialGradient id="gHalo" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ff6b1a" stop-opacity=".45"/><stop offset="1" stop-color="#ff6b1a" stop-opacity="0"/></radialGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>

        <!-- network globe -->
        <g opacity=".55" stroke="#ff8a45" fill="none" stroke-width="1">
          <circle cx="470" cy="120" r="110" stroke-opacity=".5"/>
          <ellipse cx="470" cy="120" rx="50" ry="110" stroke-opacity=".35"/>
          <ellipse cx="470" cy="120" rx="90" ry="110" stroke-opacity=".25"/>
          <ellipse cx="470" cy="120" rx="110" ry="40" stroke-opacity=".35"/>
          <path d="M360 120h220" stroke-opacity=".3"/>
        </g>
        <g fill="#ffb37f">
          <circle cx="420" cy="40" r="3" class="pulse"/><circle cx="545" cy="80" r="3"/><circle cx="520" cy="190" r="3" class="pulse"/><circle cx="400" cy="170" r="2.5"/><circle cx="575" cy="140" r="2.5"/>
        </g>
        <path d="M420 40 545 80 520 190 400 170Z M545 80 575 140" stroke="#ff8a45" stroke-opacity=".35" fill="none"/>

        <!-- halo -->
        <ellipse cx="290" cy="300" rx="230" ry="90" fill="url(#gHalo)"/>

        <!-- base platform -->
        <path d="M70 320 290 210 510 320 290 430Z" fill="#0f203a" stroke="#ff7a2e" stroke-opacity=".35"/>
        <path d="M110 320 290 230 470 320 290 410Z" fill="none" stroke="#ff7a2e" stroke-opacity=".18" stroke-dasharray="4 6"/>

        <!-- server stack -->
        <g>
          ${slab(200, 300)}
          ${slab(200, 268)}
          ${slab(200, 236)}
          ${slab(200, 204)}
        </g>

        <!-- cloud with arrows -->
        <g class="float">
          <path d="M235 150a34 34 0 0 1 6-67 48 48 0 0 1 90-12 38 38 0 0 1 52 34 32 32 0 0 1-8 45Z" fill="url(#gCloud)"/>
          <path d="M235 150h140" stroke="#9fb3d6" stroke-width="2"/>
          <g filter="url(#glow)">
            <path d="M292 135v-42l-12 12M292 93l12 12" stroke="url(#gOrange)" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M318 135v-30l-9 9M318 105l9 9" stroke="url(#gOrange)" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M268 135v-22l-7 7M268 113l7 7" stroke="url(#gOrange)" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
          </g>
          <path d="M290 160v40" stroke="#ff7a2e" stroke-width="2" stroke-dasharray="3 5" class="pulse"/>
        </g>

        <!-- chart panel -->
        <g class="float-2">
          <path d="M95 70 175 40v80l-80 30Z" fill="url(#gScreen)" stroke="#ff7a2e" stroke-opacity=".6"/>
          <g fill="url(#gOrange)" filter="url(#glow)">
            <path d="M108 125l10-4v-18l-10 4Z"/><path d="M124 119l10-4V90l-10 4Z"/><path d="M140 113l10-4V80l-10 4Z"/><path d="M156 107l10-4V64l-10 4Z"/>
          </g>
          <path d="M105 92 130 80l16 2 22-18" stroke="#ffd1b0" stroke-width="2" fill="none"/>
        </g>

        <!-- shield -->
        <g class="float-3" filter="url(#glow)">
          <path d="M120 215l38-14 38 14v30c0 26-18 42-38 50-20-8-38-24-38-50Z" fill="#13233e" stroke="url(#gOrange)" stroke-width="4"/>
          <rect x="144" y="240" width="28" height="22" rx="4" fill="url(#gOrange)"/>
          <path d="M150 240v-7a8 8 0 0 1 16 0v7" stroke="#ff9a55" stroke-width="4" fill="none"/>
          <circle cx="158" cy="251" r="3" fill="#13233e"/>
        </g>

        <!-- laptop -->
        <g class="float-2">
          <path d="M380 330l90-45 70 35-90 45Z" fill="url(#gMetal)"/>
          <path d="M380 330l70 35v6l-70-35Z" fill="#6b7891"/>
          <path d="M450 365l90-45v6l-90 45Z" fill="#56627a"/>
          <path d="M395 330l75-37 52 26-75 37Z" fill="#a9b5c8"/>
          <path d="M380 330V230l90-45v100Z" fill="#cfd8e6"/>
          <path d="M387 324V234l76-38v86Z" fill="url(#gScreen)"/>
          <g filter="url(#glow)" stroke="url(#gOrange)" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" fill="none">
            <path d="M412 268l-12 2 10 14"/><path d="M452 248l12-6-10 20"/><path d="M438 240l-14 46"/>
          </g>
        </g>

        <!-- database -->
        <g class="float">
          <path d="M520 250v50c0 9 18 16 40 16s40-7 40-16v-50" fill="#1a2b47"/>
          <ellipse cx="560" cy="250" rx="40" ry="16" fill="#cfd8e6"/>
          <path d="M520 268c0 9 18 16 40 16s40-7 40-16M520 286c0 9 18 16 40 16s40-7 40-16" stroke="#ff7a2e" stroke-width="3" fill="none" filter="url(#glow)"/>
        </g>

        <!-- connectors -->
        <g stroke="#ff7a2e" stroke-opacity=".55" stroke-width="1.5" stroke-dasharray="3 5" fill="none">
          <path d="M196 260 230 280"/><path d="M380 300 360 290"/><path d="M520 300 470 320"/><path d="M175 110 240 120"/>
        </g>
      </svg>`;

/* ---------------- PAGE SECTIONS ---------------- */
const serviceCards = allServices.map(s => `        <a class="service-card" href="hizmetler/${slug(s.name)}/index.html">
          <span class="ico-box">${I(s.icon)}</span>
          <span><h3>${s.card || s.name}</h3><p>${s.short}</p></span>
          ${I('chevron-right')}
        </a>`).join('\n') + `
        <a class="service-card cta-card" href="ucretsiz-araclar/ucretsiz-on-danismanlik.html">
          <span class="ico-box">${I('headset')}</span>
          <span><h3>Size uygun hizmeti bulalım</h3><p>Ücretsiz ön danışmanlık görüşmesi planlayın</p></span>
          ${I('chevron-right')}
        </a>`;

const freeCards = [
  ['Web Sitesi<br>Ön Analizi', 'monitor', 'ucretsiz-araclar/ucretsiz-web-sitesi-analizi.html'],
  ['SEO<br>Ön İncelemesi', 'search', 'ucretsiz-araclar/seo-on-analizi.html'],
  ['BT İhtiyaç<br>Analizi', 'layers', 'ucretsiz-araclar/bt-ihtiyac-analizi.html'],
  ['Reklam Hesabı<br>Ön Analizi', 'megaphone', 'ucretsiz-araclar/reklam-hesabi-on-analizi.html'],
  ['Dijital Dönüşüm<br>Rehberleri', 'book', 'ucretsiz-araclar/ucretsiz-egitim-ve-rehberler.html'],
  ['İlk Danışmanlık<br>Görüşmesi', 'calendar', 'ucretsiz-araclar/ucretsiz-on-danismanlik.html'],
].map(([n, ic, h]) => `          <a class="free-card" href="${h}">${I(ic)}<strong>${n}</strong></a>`).join('\n');

const homeSectors = [
  ['Üretim', 'factory', 'uretim-ve-sanayi'], ['Perakende', 'bag', 'perakende'], ['Lojistik', 'truck', 'lojistik'], ['Sağlık', 'heart', 'saglik'],
  ['Eğitim', 'graduation', 'egitim'], ['Hizmet', 'building', 'kobiler'], ['Turizm', 'bed', 'turizm-ve-otelcilik'], ['E-ticaret', 'cart', 'e-ticaret'],
].map(([n, ic, id]) => `        <a class="sector-tile" href="sektorler/${id}.html">${I(ic)}${n}</a>`).join('\n')
  + `\n        <a class="sector-tile" href="sektorler/index.html">${I('dots')}Diğer</a>`;

const steps = [
  ['Keşif', 'search', 'İhtiyaçlarınızı anlıyor, hedefleri netleştiriyoruz.'],
  ['Planlama', 'calendar', 'En uygun çözümü ve yol haritasını oluşturuyoruz.'],
  ['Uygulama', 'code', 'Belirlenen planı hayata geçiriyoruz.'],
  ['Destek', 'headset', 'Sürdürülebilir başarı için yanınızda oluyoruz.'],
];
const processHtml = steps.map(([n, ic, d], i) => `        <div class="step">${I(ic)}<div><span class="step-num">0${i + 1}</span><h3>${n}</h3><p>${d}</p></div></div>`).join(`\n        ${I('arrow-right', 'step-arrow')}\n`);

const footerCols = [
  ['Kurumsal', [['Hakkımızda', 'kurumsal/hakkimizda.html'], ['Ekibimiz', 'kurumsal/ekibimiz.html'], ['Kariyer', 'kurumsal/kariyer.html'], ['Referanslar', 'referanslar.html'], ['İletişim', 'iletisim.html']]],
  ['Hizmetler', [['BT Danışmanlığı', 'hizmetler/bilgi-teknolojileri/bt-danismanligi.html'], ['Yazılım Geliştirme', 'hizmetler/yazilim-gelistirme/index.html'], ['Web ve E-Ticaret', 'hizmetler/web-tasarim-ve-gelistirme/index.html'], ['Dijital Pazarlama', 'hizmetler/dijital-pazarlama/index.html'], ['Siber Güvenlik', 'hizmetler/siber-guvenlik/index.html'], ['Tüm Hizmetler', 'hizmetler/index.html']]],
  ['Çözümler', [['Dijital dönüşüm', 'cozumler/dijital-donusum.html'], ['E-ticaret çözümleri', 'cozumler/e-ticaret.html'], ['İş sürekliliği', 'cozumler/is-surekliligi.html'], ['Müşteri kazanımı', 'cozumler/musteri-kazanimi.html'], ['Yeni işletme kurulumu', 'cozumler/yeni-isletme.html']]],
  ['Kaynaklar', [['Blog', 'bilgi-merkezi/blog.html'], ['Rehberler', 'bilgi-merkezi/rehberler.html'], ['Ücretsiz Araçlar', 'ucretsiz-araclar/index.html'], ['Sıkça Sorulan Sorular', 'bilgi-merkezi/sikca-sorulan-sorular.html'], ['Dijital sözlük', 'bilgi-merkezi/dijital-sozluk.html']]],
].map(([t, ls]) => `      <div class="footer-col">
        <h4>${t}</h4>
        <ul>
${ls.map(([n, h]) => `          <li><a href="${h}">${n}</a></li>`).join('\n')}
        </ul>
      </div>`).join('\n');

/* ---------------- STRUCTURED DATA ---------------- */
const ld = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'DikkatDA – Dikkat Dijital Ajans',
  url: 'https://www.dikkatda.com/',
  email: 'info@dikkatda.com',
  telephone: '+90 212 000 00 00',
  address: { '@type': 'PostalAddress', addressLocality: 'İstanbul', addressCountry: 'TR' },
  description: 'Teknoloji, yazılım, altyapı ve dijital pazarlama hizmetlerini tek çatı altında sunan dijital ajans.',
  hasOfferCatalog: { '@type': 'OfferCatalog', name: 'Hizmetler', itemListElement: allServices.map(s => ({ '@type': 'OfferCatalog', name: s.name, itemListElement: s.links.map(l => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: l } })) })) },
};

/* ---------------- LAYOUT ---------------- */
const homeMain = `
  <!-- ================= HERO ================= -->
  <section class="hero">
    <div class="container hero-inner">
      <div>
        <span class="hero-badge"><i></i>Teknoloji + Dijital Pazarlama = Tek Çatı</span>
        <h1>İşinizi Dijital<br>Geleceğe Taşıyoruz<span class="dot">.</span></h1>
        <p class="hero-lead">Teknoloji, yazılım, altyapı ve dijital pazarlama tek çatı altında.</p>
        <div class="hero-actions">
          <a class="btn btn-primary" href="ucretsiz-araclar/ucretsiz-web-sitesi-analizi.html">${I('bars')}Ücretsiz Analiz Al</a>
          <a class="btn btn-outline-light" href="#hizmetler">${I('grid')}Hizmetleri Keşfet</a>
        </div>
        <div class="hero-stats">
          <div><strong>${allServices.length}</strong><span>Uzmanlık alanı</span></div>
          <div><strong>${allServices.reduce((n, s) => n + s.links.length, 0)}+</strong><span>Hizmet</span></div>
          <div><strong>${sectors.length}</strong><span>Sektör deneyimi</span></div>
        </div>
      </div>
      <div class="hero-art">
      ${heroArt}
      </div>
    </div>
  </section>

  <!-- ================= HİZMETLER ================= -->
  <section class="section" id="hizmetler">
    <div class="container">
      <div class="section-title reveal">
        <h2>Uçtan Uca <span class="accent">Dijital Dönüşüm</span></h2>
      </div>
      <div class="service-grid reveal">
${serviceCards}
      </div>
    </div>
  </section>

  <!-- ================= ÜCRETSİZ FIRSATLAR ================= -->
  <section class="section-sm" id="ucretsiz-firsatlar">
    <div class="container">
      <div class="free-panel reveal">
        <div class="row-head">
          <h2>Ücretsiz <span class="accent">Dijital Fırsatlar</span></h2>
          <p>İşletmeniz için hızlı, ücretsiz ve değerli analiz olanakları.</p>
        </div>
        <div class="free-grid">
${freeCards}
        </div>
      </div>
    </div>
  </section>

  <!-- ================= SEKTÖRLER ================= -->
  <section class="section-sm" id="sektorler">
    <div class="container reveal">
      <div class="row-head">
        <h2>Sektör <span class="accent">Çözümlerimiz</span></h2>
        <p>Farklı sektörlerin ihtiyaçlarına özel, dijital ve teknolojik çözümler geliştiriyoruz.</p>
      </div>
      <div class="sector-row">
${homeSectors}
      </div>
    </div>
  </section>

  <!-- ================= SÜREÇ ================= -->
  <section class="section-sm" id="surec">
    <div class="container reveal">
      <div class="row-head">
        <h2>Nasıl <span class="accent">Çalışıyoruz?</span></h2>
        <p>Projelerinizi, planlı ve şeffaf bir süreçle hayata geçiriyoruz.</p>
      </div>
      <div class="process">
${processHtml}
      </div>
    </div>
  </section>

  <!-- ================= REFERANSLAR & BLOG ================= -->
  <section class="section-sm" id="referanslar">
    <div class="container split reveal">
      <div>
        <h2>Referans<span class="accent">larımız</span></h2>
        <p class="lead">Farklı sektörlerde, ihtiyaçlara özel dijital projeler.</p>
        <div class="ref-grid">
          <figure class="ref-card" style="margin:0"><div class="thumb thumb-1"></div><figcaption>Kurumsal BT Dönüşümü<small>Hizmet sektörü</small></figcaption></figure>
          <figure class="ref-card" style="margin:0"><div class="thumb thumb-2"></div><figcaption>Depo Network Altyapısı<small>Lojistik</small></figcaption></figure>
          <figure class="ref-card" style="margin:0"><div class="thumb thumb-3"></div><figcaption>Bulut ve Yedekleme<small>Gayrimenkul</small></figcaption></figure>
        </div>
        <div class="split-foot"><a class="link-arrow" href="referanslar.html">Tüm referanslar ${I('arrow-right')}</a></div>
      </div>
      <div>
        <h2>Blog</h2>
        <p class="lead">Dijital dünyadan güncel içerikler.</p>
        <div class="blog-grid">
          <a class="blog-card" href="blog/dijital-donusumde-dogru-adimlar.html">
            <div class="media"><div class="thumb thumb-4"></div></div>
            <div class="body"><h3>Dijital Dönüşümde Doğru Adımlar</h3>${I('arrow-right')}</div>
          </a>
          <a class="blog-card" href="blog/isletmeler-icin-yapay-zeka-firsatlari.html">
            <div class="media"><div class="thumb thumb-5"></div></div>
            <div class="body"><h3>İşletmeler İçin Yapay Zekâ Fırsatları</h3>${I('arrow-right')}</div>
          </a>
        </div>
        <div class="split-foot"><a class="link-arrow" href="bilgi-merkezi/blog.html">Tüm yazılar ${I('arrow-right')}</a></div>
      </div>
    </div>
  </section>

  <!-- ================= CTA ================= -->
  <section class="section-sm">
    <div class="container">
      <div class="cta-banner reveal">
        <div class="cta-inner">
          <h2>Dijital dönüşümünüzü<br>birlikte <span class="accent">planlayalım.</span></h2>
          <span class="cta-divider" aria-hidden="true"></span>
          <div>
            <p>İhtiyaçlarınızı konuşalım, size özel çözümü birlikte tasarlayalım.</p>
            <a class="btn btn-primary" href="teklif-al.html">${I('send')}Teklif Al</a>
          </div>
        </div>
      </div>
    </div>
  </section>
`;

function page({ title, desc, path: p, body, active, ld: pageLd, bodyClass, extraHead, extraScripts }) {
  const depth = p.split('/').length - 1;
  const prefix = '../'.repeat(depth);
  let navHtml = nav;
  if (active) navHtml = navHtml.replace(`class="nav-link" href="${active}"`, `class="nav-link active" aria-current="page" href="${active}"`);
  let html = `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}">
  <meta name="theme-color" content="#0a1a30">
  <link rel="canonical" href="https://www.dikkatda.com/${p === 'index.html' ? '' : p}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(desc)}">
  <meta property="og:locale" content="tr_TR">
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%230a1a30'/%3E%3Ctext x='32' y='43' font-family='Arial' font-weight='800' font-size='28' text-anchor='middle' fill='%23ff6b1a'%3EDA%3C/text%3E%3C/svg%3E">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/css/style.css">
  <link rel="stylesheet" href="assets/css/pages.css">
  ${extraHead || ''}
  ${[].concat(pageLd || []).map(o => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join('\n  ')}
</head>
<body${bodyClass ? ` class="${bodyClass}"` : ''}>
${sprite}

<a class="skip-link" href="#main">İçeriğe geç</a>

<!-- ================= HEADER ================= -->
<header class="site-header">
  <div class="container header-inner">
    <a class="logo" href="index.html" aria-label="DikkatDA ana sayfa">
      <span class="logo-word">Dikkat<span>DA</span></span>
      <span class="logo-sub">Dikkat Dijital Ajans</span>
    </a>

    <nav class="main-nav" aria-label="Ana menü">
      <ul class="nav-list">
${navHtml}
      </ul>
    </nav>

    <div class="header-actions">
      <a class="btn btn-primary btn-sm header-cta" href="teklif-al.html">${I('send')}Teklif Al</a>
      <button class="menu-toggle" type="button" aria-label="Menüyü aç" aria-expanded="false" aria-controls="mobileDrawer">${I('menu')}</button>
    </div>
  </div>
</header>

<!-- Mobil menü (içerik main.js tarafından masaüstü menüden üretilir) -->
<div class="drawer-backdrop"></div>
<aside class="mobile-drawer" id="mobileDrawer" aria-hidden="true" aria-label="Mobil menü">
  <div class="drawer-head">
    <a class="logo" href="index.html"><span class="logo-word">Dikkat<span>DA</span></span><span class="logo-sub">Dikkat Dijital Ajans</span></a>
    <button class="drawer-close" type="button" aria-label="Menüyü kapat">${I('x')}</button>
  </div>
  <div class="drawer-body"></div>
  <div class="drawer-foot"><a class="btn btn-primary" href="teklif-al.html">${I('send')}Teklif Al</a></div>
</aside>

<main id="main">
${body}
</main>

<!-- ================= FOOTER ================= -->
<footer class="site-footer">
  <div class="container footer-top">
    <div class="footer-brand">
      <a class="logo logo-light" href="index.html"><span class="logo-word">Dikkat<span>DA</span></span><span class="logo-sub">Dikkat Dijital Ajans</span></a>
      <p>Dijital dönüşüm, teknoloji ve pazarlama alanlarında uçtan uca çözümler sunan dijital ajans.</p>
      <div class="social">
        <a href="#" aria-label="LinkedIn">${I('linkedin')}</a>
        <a href="#" aria-label="Instagram">${I('instagram')}</a>
        <a href="#" aria-label="YouTube">${I('youtube')}</a>
        <a href="#" aria-label="Facebook">${I('facebook')}</a>
      </div>
    </div>
${footerCols}
    <div class="footer-col">
      <h4>İletişim</h4>
      <ul class="contact-list">
        <li>${I('pin')}<span>İstanbul, Türkiye</span></li>
        <li>${I('mail')}<a href="mailto:info@dikkatda.com">info@dikkatda.com</a></li>
        <li>${I('phone')}<a href="tel:+902120000000">+90 (212) 000 00 00</a></li>
      </ul>
      <form class="newsletter" novalidate>
        <label class="sr-only" for="nl-email">E-posta adresiniz</label>
        <input id="nl-email" type="email" required placeholder="Bültene abone olun">
        <button type="submit" aria-label="Abone ol">${I('send')}</button>
      </form>
    </div>
  </div>
  <div class="footer-bottom">
    <div class="container">
      <span>© <span id="year">2026</span> DikkatDA – Dikkat Dijital Ajans. Tüm hakları saklıdır.</span>
      <nav class="footer-legal" aria-label="Yasal">
        <a href="kurumsal/kvkk.html">KVKK</a>
        <a href="kurumsal/gizlilik-politikasi.html">Gizlilik Politikası</a>
        <a href="kurumsal/cerez-politikasi.html">Çerez Politikası</a>
      </nav>
    </div>
  </div>
</footer>

<button class="to-top" type="button" aria-label="Sayfanın başına dön">${I('arrow-up')}</button>

<script src="assets/js/main.js" defer></script>${extraScripts || ''}
</body>
</html>
`;
  if (prefix) html = html.replace(/(href|src|action)="(?!https?:|#|mailto:|tel:|data:|\/\/|javascript:)([^"]*)"/g, (m, a, v) => `${a}="${prefix}${v}"`);
  return html;
}

module.exports = { fs, path, slug, esc, I, icons, serviceGroups, allServices, solutions, sectors, toolCols, resources, company, steps, page, homeMain, ld, heroArt };
