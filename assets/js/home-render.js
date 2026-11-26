/* =========================================================
   DikkatDA – ana sayfa şablonu
   Hem build (Node) hem admin paneli (tarayıcı) tarafından kullanılır.
   renderHome(data, { heroArt }) -> <main> içeriği (HTML)
   ========================================================= */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.DikkatHome = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  var esc = function (s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  };
  var br = function (s) { return esc(s).replace(/\n/g, "<br>"); };
  var I = function (name, cls) {
    return '<svg class="ico' + (cls ? " " + cls : "") + '" aria-hidden="true"><use href="#i-' + esc(name) + '"/></svg>';
  };
  var safeUrl = function (u) {
    u = String(u || "").trim();
    if (/^(javascript|data|vbscript):/i.test(u)) return "#";
    return esc(u);
  };
  var bg = function (img, fallback) {
    if (!img) return ' class="thumb ' + fallback + '"';
    return ' class="thumb ' + fallback + "\" style=\"background-image:url('" + safeUrl(img).replace(/'/g, "%27") + "')\"";
  };
  var title = function (t, a) { return esc(t) + (a ? ' <span class="accent">' + esc(a) + "</span>" : ""); };
  var on = function (s) { return s && s.show !== false; };

  function hero(h, ctx) {
    return '  <section class="hero">\n    <div class="container hero-inner">\n      <div>\n' +
      (h.badge ? '        <span class="hero-badge"><i></i>' + esc(h.badge) + "</span>\n" : "") +
      "        <h1>" + esc(h.title1) + (h.title2 ? "<br>" + esc(h.title2) : "") + '<span class="dot">.</span></h1>\n' +
      (h.lead ? '        <p class="hero-lead">' + esc(h.lead) + "</p>\n" : "") +
      '        <div class="hero-actions">\n' +
      (h.primary && h.primary.text ? '          <a class="btn btn-primary" href="' + safeUrl(h.primary.link) + '">' + I("bars") + esc(h.primary.text) + "</a>\n" : "") +
      (h.secondary && h.secondary.text ? '          <a class="btn btn-outline-light" href="' + safeUrl(h.secondary.link) + '">' + I("grid") + esc(h.secondary.text) + "</a>\n" : "") +
      "        </div>\n" +
      ((h.stats || []).length ? '        <div class="hero-stats">\n' + h.stats.map(function (s) {
        return "          <div><strong>" + esc(s.value) + "</strong><span>" + esc(s.label) + "</span></div>";
      }).join("\n") + "\n        </div>\n" : "") +
      '      </div>\n      <div class="hero-art">\n<!--hero-art:start-->' + (ctx.heroArt || "") + "<!--hero-art:end-->\n      </div>\n    </div>\n  </section>";
  }

  function services(s) {
    var cards = (s.items || []).map(function (c) {
      return '        <a class="service-card" href="' + safeUrl(c.link) + '">\n          <span class="ico-box">' + I(c.icon) + "</span>\n          <span><h3>" + esc(c.title) + "</h3><p>" + esc(c.text) + "</p></span>\n          " + I("chevron-right") + "\n        </a>";
    });
    if (s.cta && s.cta.show !== false && s.cta.title) cards.push('        <a class="service-card cta-card" href="' + safeUrl(s.cta.link) + '">\n          <span class="ico-box">' + I("headset") + "</span>\n          <span><h3>" + esc(s.cta.title) + "</h3><p>" + esc(s.cta.text) + "</p></span>\n          " + I("chevron-right") + "\n        </a>");
    return '  <section class="section" id="hizmetler">\n    <div class="container">\n      <div class="section-title reveal">\n        <h2>' + title(s.title, s.accent) + '</h2>\n      </div>\n      <div class="service-grid reveal">\n' + cards.join("\n") + "\n      </div>\n    </div>\n  </section>";
  }

  function rowHead(s) {
    return '        <div class="row-head">\n          <h2>' + title(s.title, s.accent) + "</h2>\n" + (s.text ? "          <p>" + esc(s.text) + "</p>\n" : "") + "        </div>\n";
  }

  function free(s) {
    return '  <section class="section-sm" id="ucretsiz-firsatlar">\n    <div class="container">\n      <div class="free-panel reveal">\n' + rowHead(s) +
      '        <div class="free-grid">\n' + (s.items || []).map(function (c) {
        return '          <a class="free-card" href="' + safeUrl(c.link) + '">' + I(c.icon) + "<strong>" + br(c.label) + "</strong></a>";
      }).join("\n") + "\n        </div>\n      </div>\n    </div>\n  </section>";
  }

  function sectors(s) {
    return '  <section class="section-sm" id="sektorler">\n    <div class="container reveal">\n' + rowHead(s).replace(/^ {2}/gm, "") +
      '      <div class="sector-row">\n' + (s.items || []).map(function (c) {
        return '        <a class="sector-tile" href="' + safeUrl(c.link) + '">' + I(c.icon) + esc(c.label) + "</a>";
      }).join("\n") + "\n      </div>\n    </div>\n  </section>";
  }

  function processSec(s) {
    var arrow = "\n        " + I("arrow-right", "step-arrow") + "\n";
    return '  <section class="section-sm" id="surec">\n    <div class="container reveal">\n' + rowHead(s).replace(/^ {2}/gm, "") +
      '      <div class="process">\n' + (s.items || []).map(function (c, i) {
        return '        <div class="step">' + I(c.icon) + '<div><span class="step-num">' + (i < 9 ? "0" : "") + (i + 1) + "</span><h3>" + esc(c.title) + "</h3><p>" + esc(c.text) + "</p></div></div>";
      }).join(arrow) + "\n      </div>\n    </div>\n  </section>";
  }

  function refsBlog(r, b) {
    var showR = on(r), showB = on(b);
    if (!showR && !showB) return "";
    var thumbs = ["thumb-1", "thumb-2", "thumb-3"], bthumbs = ["thumb-4", "thumb-5"];
    var refs = !showR ? "" : '      <div>\n        <h2>' + esc(r.title) + (r.accent ? '<span class="accent">' + esc(r.accent) + "</span>" : "") + '</h2>\n        <p class="lead">' + esc(r.text) + '</p>\n        <div class="ref-grid">\n' +
      (r.items || []).map(function (c, i) {
        return '          <figure class="ref-card" style="margin:0"><div' + bg(c.image, thumbs[i % 3]) + "></div><figcaption>" + esc(c.title) + "<small>" + esc(c.subtitle) + "</small></figcaption></figure>";
      }).join("\n") + "\n        </div>\n" + (r.link ? '        <div class="split-foot"><a class="link-arrow" href="' + safeUrl(r.link) + '">Tüm referanslar ' + I("arrow-right") + "</a></div>\n" : "") + "      </div>\n";
    var blog = !showB ? "" : '      <div>\n        <h2>' + esc(b.title) + '</h2>\n        <p class="lead">' + esc(b.text) + '</p>\n        <div class="blog-grid">\n' +
      (b.items || []).map(function (c, i) {
        return '          <a class="blog-card" href="' + safeUrl(c.link) + '">\n            <div class="media"><div' + bg(c.image, bthumbs[i % 2]) + '></div></div>\n            <div class="body"><h3>' + esc(c.title) + "</h3>" + I("arrow-right") + "</div>\n          </a>";
      }).join("\n") + "\n        </div>\n" + (b.link ? '        <div class="split-foot"><a class="link-arrow" href="' + safeUrl(b.link) + '">Tüm yazılar ' + I("arrow-right") + "</a></div>\n" : "") + "      </div>\n";
    return '  <section class="section-sm" id="referanslar">\n    <div class="container' + (showR && showB ? " split" : "") + ' reveal">\n' + refs + blog + "    </div>\n  </section>";
  }

  function cta(c) {
    return '  <section class="section-sm">\n    <div class="container">\n      <div class="cta-banner reveal">\n        <div class="cta-inner">\n          <h2>' +
      esc(c.title1) + (c.title2 || c.accent ? "<br>" + esc(c.title2) + (c.accent ? ' <span class="accent">' + esc(c.accent) + "</span>" : "") : "") +
      '</h2>\n          <span class="cta-divider" aria-hidden="true"></span>\n          <div>\n            <p>' + esc(c.text) + '</p>\n            <a class="btn btn-primary" href="' + safeUrl(c.button && c.button.link) + '">' + I("send") + esc(c.button && c.button.text) + "</a>\n          </div>\n        </div>\n      </div>\n    </div>\n  </section>";
  }

  function renderHome(d, ctx) {
    ctx = ctx || {};
    var out = ["\n  <!-- Ana sayfa içeriği data/homepage.json dosyasından üretilir (admin paneli: /admin/) -->"];
    if (on(d.hero)) out.push(hero(d.hero, ctx));
    if (on(d.services)) out.push(services(d.services));
    if (on(d.free)) out.push(free(d.free));
    if (on(d.sectors)) out.push(sectors(d.sectors));
    if (on(d.process)) out.push(processSec(d.process));
    out.push(refsBlog(d.refs || { show: false }, d.blog || { show: false }));
    if (on(d.cta)) out.push(cta(d.cta));
    return out.filter(Boolean).join("\n\n") + "\n";
  }

  /* Tam sayfayı günceller: <main>, <title>, açıklama ve OG etiketleri */
  function applyToPage(html, d) {
    var art = (html.match(/<!--hero-art:start-->([\s\S]*?)<!--hero-art:end-->/) || [])[1] || "";
    var main = renderHome(d, { heroArt: art });
    var seo = d.seo || {};
    html = html.replace(/<main id="main">[\s\S]*<\/main>/, function () { return '<main id="main">\n' + main + "\n</main>"; });
    if (seo.title) {
      html = html.replace(/<title>[\s\S]*?<\/title>/, function () { return "<title>" + esc(seo.title) + "</title>"; })
        .replace(/(<meta property="og:title" content=")[^"]*"/, function (m, a) { return a + esc(seo.title) + '"'; });
    }
    if (seo.description) {
      html = html.replace(/(<meta name="description" content=")[^"]*"/, function (m, a) { return a + esc(seo.description) + '"'; })
        .replace(/(<meta property="og:description" content=")[^"]*"/, function (m, a) { return a + esc(seo.description) + '"'; });
    }
    return html;
  }

  return { renderHome: renderHome, applyToPage: applyToPage, esc: esc };
});
