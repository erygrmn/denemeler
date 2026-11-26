/* =========================================================
   DikkatDA – ücretsiz araçlar
   Harici servisler: Google PageSpeed Insights API, Google Public DNS (DoH),
   ipify.org, api.qrserver.com. Diğer hesaplamalar tarayıcıda yapılır.
   ========================================================= */
(function () {
  "use strict";
  var form = document.querySelector(".tool-form");
  var out = document.querySelector(".tool-result");
  if (!form || !out) return;
  var tool = form.getAttribute("data-tool");

  var nf = function (n, d) { return Number(n).toLocaleString("tr-TR", { maximumFractionDigits: d == null ? 2 : d, minimumFractionDigits: d == null ? 0 : 0 }); };
  var tl = function (n) { return Number(n).toLocaleString("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 2 }); };
  var escH = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var show = function (html) { out.hidden = false; out.innerHTML = html; };
  var loading = function (msg) { show('<div class="loader">' + (msg || "Sorgulanıyor…") + "</div>"); };
  var fail = function (msg) { show('<div class="tool-error">' + msg + "</div>"); };
  var metric = function (label, value, cls) { return '<div class="metric' + (cls ? " " + cls : "") + '"><span>' + label + "</span><strong>" + value + "</strong></div>"; };
  var val = function (name) { var f = form.elements[name]; return f ? f.value.trim() : ""; };
  var num = function (name) { return parseFloat(val(name).replace(",", ".")) || 0; };
  var cleanDomain = function (d) { return d.toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").split(/[/?#]/)[0].replace(/\.$/, ""); };
  var badge = function (ok, okText, badText, warn) { return '<span class="status ' + (ok ? "ok" : warn ? "warn" : "err") + '">' + (ok ? okText : badText) + "</span>"; };

  /* Google PageSpeed API anahtarı: anahtarsız istekler ortak kotaya takılır (HTTP 429).
     https://developers.google.com/speed/docs/insights/v5/get-started adresinden ücretsiz anahtar alıp buraya yazın. */
  var PSI_API_KEY = "";

  /* DNS-over-HTTPS: bazı ağlar tek bir sağlayıcıyı engelleyebildiği için sırayla denenir. */
  var DOH = [
    function (n, t) { return "https://1.1.1.1/dns-query?name=" + n + "&type=" + t; },
    function (n, t) { return "https://dns.google/resolve?name=" + n + "&type=" + t; },
    function (n, t) { return "https://cloudflare-dns.com/dns-query?name=" + n + "&type=" + t; },
  ];
  var dohIndex = 0;
  function fetchTimeout(url, ms, opts) {
    var ctl = "AbortController" in window ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctl) ctl.abort(); }, ms);
    return fetch(url, Object.assign({}, opts, ctl ? { signal: ctl.signal } : {})).finally(function () { clearTimeout(timer); });
  }
  function doh(name, type) {
    var tryAt = function (i) {
      if (i >= DOH.length) return Promise.reject(new Error("DNS"));
      return fetchTimeout(DOH[i](encodeURIComponent(name), type), 6000, { headers: { Accept: "application/dns-json" } })
        .then(function (r) { if (!r.ok) throw new Error("DNS"); dohIndex = i; return r.json(); })
        .catch(function () { return tryAt(i + 1); });
    };
    return tryAt(dohIndex);
  }
  var txtData = function (a) { return a.data.replace(/^"|"$/g, "").replace(/"\s*"/g, ""); };

  var handlers = {
    /* ---------- PageSpeed Insights ---------- */
    psi: function () {
      var url = val("url");
      if (!/^https?:\/\//i.test(url)) url = "https://" + url;
      var cats = form.getAttribute("data-cats").split(",");
      var q = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=" + encodeURIComponent(url) + "&strategy=" + val("strategy") + "&locale=tr" +
        cats.map(function (c) { return "&category=" + c.toUpperCase().replace("-", "_"); }).join("") + (PSI_API_KEY ? "&key=" + PSI_API_KEY : "");
      loading("Sayfa analiz ediliyor, bu işlem 20–60 saniye sürebilir…");
      fetch(q).then(function (r) { return r.json(); }).then(function (data) {
        if (data.error || !data.lighthouseResult) throw new Error((data.error && data.error.message) || "Analiz yapılamadı");
        var lh = data.lighthouseResult, a = lh.audits;
        var names = { performance: "Performans", seo: "SEO", accessibility: "Erişilebilirlik", "best-practices": "En iyi uygulamalar" };
        var html = '<div class="score-row">' + cats.map(function (c) {
          var s = Math.round((lh.categories[c].score || 0) * 100);
          var col = s >= 90 ? "#1b8a4b" : s >= 50 ? "#d97706" : "#c62828";
          return '<div class="score"><b style="--v:' + s + ";--c:" + col + '"><span>' + s + "</span></b>" + names[c] + "</div>";
        }).join("") + "</div>";
        if (cats.indexOf("performance") > -1) {
          var m = [["first-contentful-paint", "İlk içerik (FCP)"], ["largest-contentful-paint", "En büyük içerik (LCP)"], ["total-blocking-time", "Toplam engelleme (TBT)"], ["cumulative-layout-shift", "Düzen kayması (CLS)"], ["speed-index", "Hız endeksi"]];
          html += '<div class="result-grid">' + m.map(function (x) {
            var au = a[x[0]]; if (!au) return "";
            return metric(x[1], au.displayValue || "-", au.score >= 0.9 ? "good" : au.score >= 0.5 ? "mid" : "bad");
          }).join("") + "</div>";
        }
        var issues = [];
        cats.forEach(function (c) {
          lh.categories[c].auditRefs.forEach(function (ref) {
            var au = a[ref.id];
            if (au && au.score !== null && au.score < 0.9 && au.scoreDisplayMode !== "informative" && au.scoreDisplayMode !== "notApplicable" && (ref.weight > 0 || (au.details && au.details.type === "opportunity"))) issues.push([names[c], au.title]);
          });
        });
        if (issues.length) html += '<h3 class="block-title">İyileştirme önerileri</h3><table class="rec-table"><thead><tr><th>Alan</th><th>Öneri</th></tr></thead><tbody>' +
          issues.slice(0, 15).map(function (i) { return "<tr><td>" + i[0] + "</td><td>" + escH(i[1]) + "</td></tr>"; }).join("") + "</tbody></table>";
        else html += '<p>Tebrikler! Önemli bir sorun bulunamadı.</p>';
        show(html);
      }).catch(function (e) {
        fail("Analiz tamamlanamadı (" + escH(e.message) + "). Adresi kontrol edip tekrar deneyin ya da <a href=\"ucretsiz-on-danismanlik.html\">ücretsiz analiz talep edin</a>.");
      });
    },

    /* ---------- Alan adı ---------- */
    domain: function () {
      var d = cleanDomain(val("domain"));
      if (!/^[a-z0-9.-]+\.[a-z]{2,}$/.test(d)) return fail("Geçerli bir alan adı girin (ör. ornek.com).");
      loading();
      Promise.all([doh(d, "NS"), doh(d, "A")]).then(function (r) {
        var ns = r[0], a = r[1];
        if (ns.Status === 3) return show('<p>' + badge(false, "", "Kayıt bulunamadı", true) + '</p><p style="margin-top:10px"><strong>' + escH(d) + "</strong> için DNS kaydı bulunamadı. Alan adı boşta olabilir; kesin sonuç için kayıt firmanızdan kontrol edin.</p>");
        var nsList = (ns.Answer || []).filter(function (x) { return x.type === 2; }).map(function (x) { return x.data; });
        var ips = (a.Answer || []).filter(function (x) { return x.type === 1; }).map(function (x) { return x.data; });
        show('<p>' + badge(true, "Kayıtlı ve aktif", "") + '</p><div class="result-grid" style="margin-top:14px">' +
          metric("Alan adı", escH(d)) + metric("Ad sunucuları", nsList.length ? escH(nsList.join(", ")) : "-") + metric("IP adresi (A)", ips.length ? escH(ips.join(", ")) : "-") + "</div>");
      }).catch(function () { fail("Sorgu yapılamadı. Lütfen daha sonra tekrar deneyin."); });
    },

    /* ---------- DNS ---------- */
    dns: function () {
      var d = cleanDomain(val("domain"));
      if (!/^[a-z0-9.-]+\.[a-z]{2,}$/.test(d)) return fail("Geçerli bir alan adı girin.");
      var types = val("type") === "ALL" ? ["A", "AAAA", "CNAME", "MX", "NS", "TXT"] : [val("type")];
      var codes = { 1: "A", 28: "AAAA", 5: "CNAME", 15: "MX", 2: "NS", 16: "TXT", 6: "SOA" };
      loading();
      Promise.all(types.map(function (t) { return doh(d, t); })).then(function (res) {
        var rows = [];
        res.forEach(function (r, i) {
          (r.Answer || []).forEach(function (x) { if (codes[x.type] === types[i]) rows.push([codes[x.type], x.name, x.TTL, x.data]); });
        });
        if (!rows.length) return fail("Seçilen türde kayıt bulunamadı.");
        show('<table class="rec-table"><thead><tr><th>Tür</th><th>Ad</th><th>TTL</th><th>Değer</th></tr></thead><tbody>' +
          rows.map(function (r) { return "<tr><td><strong>" + r[0] + "</strong></td><td>" + escH(r[1]) + "</td><td>" + r[2] + "</td><td>" + escH(r[3]) + "</td></tr>"; }).join("") + "</tbody></table>");
      }).catch(function () { fail("Sorgu yapılamadı. Lütfen daha sonra tekrar deneyin."); });
    },

    /* ---------- SPF / DKIM / DMARC ---------- */
    mailauth: function () {
      var d = cleanDomain(val("domain"));
      if (!/^[a-z0-9.-]+\.[a-z]{2,}$/.test(d)) return fail("Geçerli bir alan adı girin.");
      var sel = val("selector");
      var selectors = sel ? [sel] : ["google", "selector1", "selector2", "default", "k1", "dkim", "mail", "s1", "s2"];
      loading();
      Promise.all([doh(d, "TXT"), doh("_dmarc." + d, "TXT")].concat(selectors.map(function (s) { return doh(s + "._domainkey." + d, "TXT").catch(function () { return {}; }); }))).then(function (r) {
        var spf = (r[0].Answer || []).map(txtData).filter(function (t) { return /^v=spf1/i.test(t); });
        var dmarc = (r[1].Answer || []).map(txtData).filter(function (t) { return /^v=DMARC1/i.test(t); });
        var dkim = [];
        r.slice(2).forEach(function (x, i) { (x.Answer || []).map(txtData).forEach(function (t) { if (/v=DKIM1|k=rsa|p=/i.test(t)) dkim.push(selectors[i]); }); });
        var pol = dmarc[0] && (dmarc[0].match(/p=(\w+)/i) || [])[1];
        var rows = [
          ["SPF", spf.length === 1 ? badge(true, "Var", "") : spf.length > 1 ? badge(false, "", "Birden fazla SPF kaydı", true) : badge(false, "", "Yok"),
            spf.length ? escH(spf.join(" | ")) : "Alan adınız adına hangi sunucuların e-posta gönderebileceğini belirten bir SPF kaydı ekleyin."],
          ["DKIM", dkim.length ? badge(true, "Bulundu", "") : badge(false, "", sel ? "Bulunamadı" : "Yaygın seçicilerde bulunamadı", true),
            dkim.length ? "Seçici: " + escH(dkim.join(", ")) : "E-posta sağlayıcınızın verdiği DKIM seçicisini yukarıya yazarak tekrar deneyin."],
          ["DMARC", dmarc.length ? badge(pol && pol.toLowerCase() !== "none", "Politika: " + escH(pol), "Politika: none", true) : badge(false, "", "Yok"),
            dmarc.length ? escH(dmarc[0]) : "Sahte e-postaları engellemek için _dmarc kaydı ekleyin (ör. v=DMARC1; p=quarantine; rua=mailto:...)."],
        ];
        show('<table class="rec-table"><thead><tr><th>Kayıt</th><th>Durum</th><th>Detay</th></tr></thead><tbody>' +
          rows.map(function (x) { return "<tr><td><strong>" + x[0] + "</strong></td><td>" + x[1] + "</td><td>" + x[2] + "</td></tr>"; }).join("") + "</tbody></table>");
      }).catch(function () { fail("Sorgu yapılamadı. Lütfen daha sonra tekrar deneyin."); });
    },

    /* ---------- Subnet ---------- */
    subnet: function () {
      var parts = val("ip").split(".").map(Number);
      if (parts.length !== 4 || parts.some(function (p) { return isNaN(p) || p < 0 || p > 255; })) return fail("Geçerli bir IPv4 adresi girin (ör. 192.168.1.10).");
      var cidr = parseInt(val("cidr"), 10);
      var ip = ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0;
      var mask = cidr === 0 ? 0 : (0xFFFFFFFF << (32 - cidr)) >>> 0;
      var net = (ip & mask) >>> 0, bc = (net | (~mask >>> 0)) >>> 0;
      var toIp = function (n) { return [n >>> 24, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join("."); };
      var hosts = cidr >= 31 ? (cidr === 32 ? 1 : 2) : Math.pow(2, 32 - cidr) - 2;
      var first = cidr >= 31 ? net : net + 1, last = cidr >= 31 ? bc : bc - 1;
      var priv = parts[0] === 10 || (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) || (parts[0] === 192 && parts[1] === 168);
      show('<div class="result-grid">' + metric("Ağ adresi", toIp(net) + "/" + cidr) + metric("Yayın adresi", toIp(bc)) + metric("Alt ağ maskesi", toIp(mask)) +
        metric("Wildcard", toIp(~mask >>> 0)) + metric("İlk host", toIp(first)) + metric("Son host", toIp(last)) + metric("Kullanılabilir host", nf(hosts, 0)) +
        metric("Adres türü", priv ? "Özel (private)" : "Genel (public)") + "</div>");
    },

    /* ---------- QR ---------- */
    qr: function () {
      var t = val("text"), s = val("size");
      if (!t) return fail("Bir bağlantı ya da metin girin.");
      var src = "https://api.qrserver.com/v1/create-qr-code/?size=" + s + "x" + s + "&margin=10&data=" + encodeURIComponent(t);
      show('<div class="qr-out"><img src="' + src + '" alt="Oluşturulan QR kod"><div><p><strong>QR kodunuz hazır.</strong></p><p style="margin:8px 0 14px;color:var(--muted)">Görsele sağ tıklayıp kaydedebilir ya da yeni sekmede açabilirsiniz.</p><a class="btn btn-primary btn-sm" href="' + src + '" target="_blank" rel="noopener">Yeni sekmede aç</a></div></div>');
    },

    /* ---------- UTM ---------- */
    utm: function () {
      var u = val("url");
      if (!/^https?:\/\//i.test(u)) u = "https://" + u;
      var url;
      try { url = new URL(u); } catch (e) { return fail("Geçerli bir adres girin."); }
      ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"].forEach(function (k) {
        var v = val(k).toLowerCase().replace(/\s+/g, "_");
        if (v) url.searchParams.set(k, v);
      });
      show('<p><strong>UTM bağlantınız:</strong></p><div class="copy-box"><input readonly value="' + escH(url.toString()) + '" aria-label="UTM bağlantısı"><button type="button" class="btn btn-primary btn-sm" data-copy>Kopyala</button></div>');
    },

    /* ---------- Reklam bütçesi ---------- */
    budget: function () {
      var sales = num("sales"), cr = num("cr"), cpc = num("cpc"), aov = num("aov");
      if (!sales || !cr || !cpc) return fail("Lütfen tüm zorunlu alanları doldurun.");
      var clicks = Math.ceil(sales / (cr / 100)), budget = clicks * cpc, rev = sales * aov;
      show('<div class="result-grid">' + metric("Aylık bütçe", tl(budget), "big") + metric("Günlük bütçe", tl(budget / 30)) + metric("Gereken tıklama", nf(clicks, 0)) +
        metric("Satış başı maliyet", tl(budget / sales)) + (aov ? metric("Tahmini gelir", tl(rev)) + metric("Tahmini ROAS", nf(rev / budget) + "x", rev / budget >= 3 ? "good" : rev / budget >= 1 ? "mid" : "bad") : "") + "</div>" +
        '<p class="tool-note">Hesaplama ortalama değerlere dayanır; gerçek sonuçlar sektör, rekabet ve kampanya kalitesine göre değişir.</p>');
    },

    /* ---------- ROAS ---------- */
    roas: function () {
      var rev = num("rev"), spend = num("spend"), m = num("margin") || 100;
      if (!spend) return fail("Reklam harcamasını girin.");
      var roas = rev / spend, profit = rev * m / 100 - spend, be = 100 / m;
      show('<div class="result-grid">' + metric("ROAS", nf(roas) + "x", roas >= be ? "good" : "bad") + metric("Başa baş ROAS", nf(be) + "x") +
        metric("Brüt kâr − reklam", tl(profit), profit >= 0 ? "good" : "bad") + metric("Reklam getirisi (ROI)", "%" + nf(profit / spend * 100, 1)) + "</div>" +
        '<p class="tool-note">' + (roas >= be ? "Kampanyanız kârlı görünüyor." : "ROAS değeriniz başa baş noktasının altında; kampanya optimizasyonu önerilir.") + "</p>");
    },

    /* ---------- KDV ---------- */
    kdv: function () {
      var a = num("amount"), r = num("rate");
      var net, vat, gross;
      if (val("mode") === "add") { net = a; vat = a * r / 100; gross = net + vat; }
      else { gross = a; net = a / (1 + r / 100); vat = gross - net; }
      show('<div class="result-grid">' + metric("KDV hariç", tl(net)) + metric("KDV (%" + r + ")", tl(vat)) + metric("KDV dahil", tl(gross), "big") + "</div>");
    },

    /* ---------- Görsel boyutlandırma ---------- */
    resize: function () {
      var file = form.elements.file.files[0];
      if (!file) return fail("Bir görsel seçin.");
      var wh = val("preset").split("x").map(Number), fit = val("fit");
      var img = new Image();
      img.onload = function () {
        var c = document.createElement("canvas"); c.width = wh[0]; c.height = wh[1];
        var ctx = c.getContext("2d");
        ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, c.width, c.height);
        var s = fit === "cover" ? Math.max(c.width / img.width, c.height / img.height) : Math.min(c.width / img.width, c.height / img.height);
        var w = img.width * s, h = img.height * s;
        ctx.drawImage(img, (c.width - w) / 2, (c.height - h) / 2, w, h);
        URL.revokeObjectURL(img.src);
        c.toBlob(function (blob) {
          var href = URL.createObjectURL(blob);
          show('<div class="resize-out"></div><p style="margin-top:14px"><a class="btn btn-primary btn-sm" href="' + href + '" download="dikkatda-' + wh[0] + "x" + wh[1] + '.jpg">İndir (' + wh[0] + "×" + wh[1] + ")</a></p>");
          out.querySelector(".resize-out").appendChild(c);
        }, "image/jpeg", 0.92);
      };
      img.onerror = function () { fail("Görsel okunamadı."); };
      img.src = URL.createObjectURL(file);
    },

    /* ---------- Dijital dönüşüm testi ---------- */
    quiz: function () {
      var qs = form.querySelectorAll(".quiz-q"), total = 0, recs = [];
      qs.forEach(function (q) {
        var v = q.querySelector("input:checked");
        var n = v ? +v.value : 0;
        total += n;
        if (n < 2) recs.push([q.getAttribute("data-sol"), q.getAttribute("data-sol-name"), n]);
      });
      var max = qs.length * 2, pct = Math.round(total / max * 100);
      var level = pct >= 80 ? ["İleri seviye", "good", "Dijital olgunluğunuz yüksek. Rekabet avantajınızı korumak için yapay zekâ ve otomasyon fırsatlarını değerlendirebilirsiniz."]
        : pct >= 50 ? ["Gelişen seviye", "mid", "Temeller atılmış ancak önemli fırsatlar var. Aşağıdaki öncelikli alanlarla başlamanızı öneriyoruz."]
        : ["Başlangıç seviyesi", "bad", "Dijital dönüşüm yolculuğunuzun başındasınız. Doğru adımlarla kısa sürede büyük fark yaratabilirsiniz."];
      recs.sort(function (a, b) { return a[2] - b[2]; });
      show('<div class="result-grid">' + metric("Dijital olgunluk puanı", "%" + pct, "big " + level[1]) + metric("Seviye", level[0], level[1]) + "</div><p style=\"margin-top:14px\">" + level[2] + "</p>" +
        (recs.length ? '<h3 class="block-title">Öncelikli çözümler</h3><div class="sol-tiles">' + recs.map(function (r) {
          return '<a class="sol-tile" href="../cozumler/' + r[0] + '.html"><span><strong>' + escH(r[1]) + "</strong><small>" + (r[2] === 0 ? "Yüksek öncelik" : "Orta öncelik") + "</small></span></a>";
        }).join("") + "</div>" : "") +
        '<p style="margin-top:18px"><a class="btn btn-primary" href="ucretsiz-on-danismanlik.html">Sonuçlarımı uzmanla değerlendir</a></p>');
    },
  };

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var bad = Array.prototype.find.call(form.querySelectorAll("input, select"), function (f) { return !f.checkValidity(); });
    if (bad) { bad.reportValidity(); return; }
    handlers[tool]();
  });

  /* IP aracı */
  var ipBtn = form.querySelector('[data-action="ip"]');
  if (ipBtn) ipBtn.addEventListener("click", function () {
    loading();
    fetch("https://api.ipify.org?format=json").then(function (r) { return r.json(); }).then(function (d) {
      show('<div class="result-grid">' + metric("Genel IP adresiniz", escH(d.ip), "big") + metric("Sürüm", d.ip.indexOf(":") > -1 ? "IPv6" : "IPv4") + "</div>");
    }).catch(function () { fail("IP adresi alınamadı. Reklam engelleyici bu isteği engelliyor olabilir."); });
  });

  /* Kopyala */
  out.addEventListener("click", function (e) {
    var b = e.target.closest("[data-copy]");
    if (!b) return;
    var input = out.querySelector(".copy-box input");
    input.select();
    (navigator.clipboard ? navigator.clipboard.writeText(input.value) : Promise.reject()).catch(function () { document.execCommand("copy"); });
    b.textContent = "Kopyalandı ✓";
    setTimeout(function () { b.textContent = "Kopyala"; }, 1800);
  });
})();
