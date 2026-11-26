/* =========================================================
   DikkatDA – Ana sayfa admin paneli
   İçerik: data/homepage.json  ->  home-render.js  ->  index.html
   Kayıt: GitHub Git Data API ile yayın dalına (gh-pages) ve kaynak dalına (main)
   Yerel test: http://localhost:PORT/admin/?demo  (GitHub'a bağlanmaz)
   ========================================================= */
(function () {
  "use strict";

  /* ---------------- Ayarlar ---------------- */
  var DEFAULT_CFG = { owner: "erygrmn", repo: "denemeler", live: "gh-pages", source: "main", prefix: "dikkatda/" };
  var cfg = Object.assign({}, DEFAULT_CFG, JSON.parse(localStorage.getItem("dda_cfg") || "{}"));
  var DEMO = /[?&]demo\b/.test(location.search) && /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
  var SITE_BASE = new URL("../", location.href).href;
  var MAX_UPLOAD = 2 * 1024 * 1024;

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var el = function (tag, attrs, kids) {
    var n = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === "text") n.textContent = attrs[k];
      else if (k === "html") n.innerHTML = attrs[k];
      else if (k.slice(0, 2) === "on") n.addEventListener(k.slice(2), attrs[k]);
      else if (attrs[k] !== false && attrs[k] != null) n.setAttribute(k, attrs[k] === true ? "" : attrs[k]);
    });
    (kids || []).forEach(function (c) { if (c) n.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return n;
  };
  var icon = function (name) {
    var s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    s.setAttribute("class", "ico");
    var u = document.createElementNS("http://www.w3.org/2000/svg", "use");
    u.setAttribute("href", "#i-" + name);
    s.appendChild(u);
    return s;
  };
  var clone = function (o) { return JSON.parse(JSON.stringify(o)); };

  /* ---------------- Şema ---------------- */
  var L = function (k, l, extra) { return Object.assign({ k: k, l: l, t: "text" }, extra || {}); };
  var LINK = function (k, l) { return L(k, l || "Bağlantı", { t: "link", hint: "Site içi sayfa (ör. teklif-al.html), #bölüm ya da https://…" }); };
  var SECTIONS = [
    { key: "seo", label: "SEO ayarları", icon: "search", desc: "Google sonuçlarında görünen başlık ve açıklama.", fields: [
      L("title", "Sayfa başlığı", { max: 70 }), L("description", "Açıklama", { t: "textarea", max: 160 })] },
    { key: "hero", label: "Üst alan (Hero)", icon: "monitor", toggle: true, sel: ".hero", desc: "Sayfanın en üstündeki karşılama alanı.", fields: [
      L("badge", "Rozet metni"), L("title1", "Başlık – 1. satır"), L("title2", "Başlık – 2. satır", { hint: "Sonuna turuncu nokta otomatik eklenir." }),
      L("lead", "Alt metin", { t: "textarea" }),
      { k: "primary", l: "Birincil buton", t: "group", fields: [L("text", "Metin"), LINK("link")] },
      { k: "secondary", l: "İkincil buton", t: "group", fields: [L("text", "Metin"), LINK("link")] },
      { k: "stats", l: "İstatistikler", t: "list", item: "İstatistik", titleKey: "label", max: 4, fields: [L("value", "Değer"), L("label", "Etiket")] }] },
    { key: "services", label: "Hizmet kartları", icon: "grid", toggle: true, sel: "#hizmetler", desc: "“Uçtan Uca Dijital Dönüşüm” bölümü.", fields: [
      L("title", "Başlık"), L("accent", "Turuncu kelime(ler)"),
      { k: "items", l: "Kartlar", t: "list", item: "Kart", titleKey: "title", fields: [L("title", "Başlık"), L("text", "Açıklama"), { k: "icon", l: "İkon", t: "icon" }, LINK("link")] },
      { k: "cta", l: "Son kart (çağrı)", t: "group", toggle: true, fields: [L("title", "Başlık"), L("text", "Açıklama"), LINK("link")] }] },
    { key: "free", label: "Ücretsiz fırsatlar", icon: "sparkles", toggle: true, sel: "#ucretsiz-firsatlar", fields: [
      L("title", "Başlık"), L("accent", "Turuncu kelime(ler)"), L("text", "Sağdaki açıklama"),
      { k: "items", l: "Kartlar", t: "list", item: "Kart", titleKey: "label", max: 6, fields: [L("label", "Metin", { t: "textarea", hint: "Satır atlamak için Enter kullanın." }), { k: "icon", l: "İkon", t: "icon" }, LINK("link")] }] },
    { key: "sectors", label: "Sektörler", icon: "factory", toggle: true, sel: "#sektorler", fields: [
      L("title", "Başlık"), L("accent", "Turuncu kelime(ler)"), L("text", "Sağdaki açıklama"),
      { k: "items", l: "Sektörler", t: "list", item: "Sektör", titleKey: "label", max: 9, fields: [L("label", "Ad"), { k: "icon", l: "İkon", t: "icon" }, LINK("link")] }] },
    { key: "process", label: "Nasıl çalışıyoruz", icon: "refresh", toggle: true, sel: "#surec", fields: [
      L("title", "Başlık"), L("accent", "Turuncu kelime(ler)"), L("text", "Sağdaki açıklama"),
      { k: "items", l: "Adımlar", t: "list", item: "Adım", titleKey: "title", max: 4, fields: [L("title", "Başlık"), L("text", "Açıklama", { t: "textarea" }), { k: "icon", l: "İkon", t: "icon" }] }] },
    { key: "refs", label: "Referanslar", icon: "briefcase", toggle: true, sel: "#referanslar", fields: [
      L("title", "Başlık"), L("accent", "Turuncu kısım"), L("text", "Alt metin"), LINK("link", "“Tüm referanslar” bağlantısı"),
      { k: "items", l: "Projeler", t: "list", item: "Proje", titleKey: "title", max: 3, fields: [{ k: "image", l: "Görsel", t: "image" }, L("title", "Başlık"), L("subtitle", "Alt başlık")] }] },
    { key: "blog", label: "Blog", icon: "file", toggle: true, sel: "#referanslar", fields: [
      L("title", "Başlık"), L("text", "Alt metin"), LINK("link", "“Tüm yazılar” bağlantısı"),
      { k: "items", l: "Yazılar", t: "list", item: "Yazı", titleKey: "title", max: 2, fields: [{ k: "image", l: "Görsel", t: "image" }, L("title", "Başlık"), LINK("link")] }] },
    { key: "cta", label: "Alt çağrı bandı", icon: "send", toggle: true, sel: ".cta-banner", fields: [
      L("title1", "Başlık – 1. satır"), L("title2", "Başlık – 2. satır"), L("accent", "Turuncu kelime(ler)"), L("text", "Açıklama", { t: "textarea" }),
      { k: "button", l: "Buton", t: "group", fields: [L("text", "Metin"), LINK("link")] }] },
  ];

  /* ---------------- Durum ---------------- */
  var token = sessionStorage.getItem("dda_token") || localStorage.getItem("dda_token") || "";
  var data = null, saved = null, pageHtml = "", current = "hero";
  var uploads = {}; // yol -> dataURL (kaydedilene kadar bekler)
  var dirty = false;

  /* ---------------- UI yardımcıları ---------------- */
  function loading(on, text) { $("#loading").hidden = !on; if (text) $("#loadingText").textContent = text; }
  function toast(msg, type, ms) {
    var t = el("div", { class: "toast " + (type || "") });
    t.innerHTML = msg;
    $("#toasts").appendChild(t);
    setTimeout(function () { t.remove(); }, ms || 6000);
  }
  function setDirty(v) {
    dirty = v;
    $("#dirty").hidden = !v;
    $("#save").disabled = !v;
    $("#revert").disabled = !v;
  }
  window.addEventListener("beforeunload", function (e) { if (dirty) { e.preventDefault(); e.returnValue = ""; } });

  /* ---------------- GitHub API ---------------- */
  function gh(path, opts) {
    opts = opts || {};
    var headers = { Authorization: "Bearer " + token, "X-GitHub-Api-Version": "2022-11-28", Accept: opts.raw ? "application/vnd.github.raw+json" : "application/vnd.github+json" };
    if (opts.body) headers["Content-Type"] = "application/json";
    return fetch("https://api.github.com" + path, { method: opts.method || "GET", headers: headers, body: opts.body ? JSON.stringify(opts.body) : undefined, cache: "no-store" })
      .then(function (r) {
        if (!r.ok) return r.json().catch(function () { return {}; }).then(function (j) {
          var e = new Error(j.message || ("HTTP " + r.status)); e.status = r.status; throw e;
        });
        return opts.raw ? r.text() : r.status === 204 ? null : r.json();
      });
  }
  var repoPath = function () { return "/repos/" + encodeURIComponent(cfg.owner) + "/" + encodeURIComponent(cfg.repo); };
  var encPath = function (p) { return p.split("/").map(encodeURIComponent).join("/"); };
  function getText(branch, path) {
    if (DEMO) return fetch(SITE_BASE + path, { cache: "no-store" }).then(function (r) { if (!r.ok) throw new Error(path + " bulunamadı"); return r.text(); });
    return gh(repoPath() + "/contents/" + encPath(path) + "?ref=" + encodeURIComponent(branch), { raw: true });
  }

  /* Tek commit ile birden fazla dosya yazar */
  function commitFiles(branch, files, message) {
    var base, baseTree;
    return gh(repoPath() + "/git/ref/heads/" + encodeURIComponent(branch))
      .then(function (ref) { base = ref.object.sha; return gh(repoPath() + "/git/commits/" + base); })
      .then(function (c) {
        baseTree = c.tree.sha;
        return Promise.all(files.map(function (f) {
          if (f.base64 == null) return Promise.resolve({ path: f.path, mode: "100644", type: "blob", content: f.content });
          return gh(repoPath() + "/git/blobs", { method: "POST", body: { content: f.base64, encoding: "base64" } })
            .then(function (b) { return { path: f.path, mode: "100644", type: "blob", sha: b.sha }; });
        }));
      })
      .then(function (tree) { return gh(repoPath() + "/git/trees", { method: "POST", body: { base_tree: baseTree, tree: tree } }); })
      .then(function (t) { return gh(repoPath() + "/git/commits", { method: "POST", body: { message: message, tree: t.sha, parents: [base] } }); })
      .then(function (c) { return gh(repoPath() + "/git/refs/heads/" + encodeURIComponent(branch), { method: "PATCH", body: { sha: c.sha } }).then(function () { return c; }); });
  }

  /* ---------------- Giriş ---------------- */
  function showLogin(err) {
    $("#app").hidden = true;
    $("#login").hidden = false;
    loading(false);
    $("#cfgOwner").value = cfg.owner; $("#cfgRepo").value = cfg.repo; $("#cfgLive").value = cfg.live; $("#cfgSource").value = cfg.source; $("#cfgPrefix").value = cfg.prefix;
    var e = $("#loginError");
    e.hidden = !err; e.textContent = err || "";
    $("#token").focus();
  }
  $("#loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
    token = $("#token").value.trim();
    cfg = { owner: $("#cfgOwner").value.trim(), repo: $("#cfgRepo").value.trim(), live: $("#cfgLive").value.trim(), source: $("#cfgSource").value.trim(), prefix: $("#cfgPrefix").value.trim() };
    if (cfg.prefix && !/\/$/.test(cfg.prefix)) cfg.prefix += "/";
    localStorage.setItem("dda_cfg", JSON.stringify(cfg));
    (($("#remember").checked) ? localStorage : sessionStorage).setItem("dda_token", token);
    $("#token").value = "";
    start();
  });
  function logout() {
    if (dirty && !confirm("Kaydedilmemiş değişiklikler silinecek. Çıkış yapılsın mı?")) return;
    sessionStorage.removeItem("dda_token"); localStorage.removeItem("dda_token");
    token = ""; setDirty(false);
    showLogin();
  }

  function start() {
    $("#login").hidden = true;
    loading(true, DEMO ? "Yerel dosyalar yükleniyor…" : "GitHub’a bağlanılıyor…");
    var check = DEMO ? Promise.resolve() : gh(repoPath()).then(function (r) {
      if (!r.permissions || !r.permissions.push) throw new Error("Bu anahtarın depoya yazma izni yok.");
    });
    check.then(load).catch(function (e) {
      if (!DEMO) { sessionStorage.removeItem("dda_token"); localStorage.removeItem("dda_token"); }
      showLogin(e.status === 401 ? "Erişim anahtarı geçersiz ya da süresi dolmuş." : e.status === 404 ? "Depo bulunamadı ya da anahtarın bu depoya erişimi yok." : e.message);
    });
  }

  function load() {
    loading(true, "İçerik yükleniyor…");
    return Promise.all([getText(cfg.live, "data/homepage.json"), getText(cfg.live, "index.html")]).then(function (r) {
      data = JSON.parse(r[0]);
      saved = clone(data);
      pageHtml = r[1];
      uploads = {};
      setDirty(false);
      $("#app").hidden = false;
      buildNav();
      showSection(current);
      updatePreview(true);
      loading(false);
      if (DEMO) toast("<strong>Demo modu:</strong> İçerik yerel sunucudan yüklendi. Kaydet, GitHub yerine JSON dosyası indirir.", "", 9000);
      loadHistory();
    }).catch(function (e) {
      loading(false);
      toast("İçerik yüklenemedi: " + escapeHtml(e.message), "err", 10000);
      if (!DEMO) showLogin("İçerik yüklenemedi: " + e.message);
    });
  }

  /* ---------------- Gezinme ---------------- */
  function buildNav() {
    var nav = $("#sidenav");
    nav.innerHTML = "";
    SECTIONS.forEach(function (s) {
      var off = s.toggle && data[s.key] && data[s.key].show === false;
      nav.appendChild(el("button", { type: "button", class: s.key === current ? "on" : "", "data-key": s.key, onclick: function () { showSection(s.key); } },
        [icon(s.icon), el("span", { text: s.label }), off ? el("span", { class: "off-dot", text: "Gizli" }) : null]));
    });
    nav.appendChild(el("div", { class: "sep" }));
    nav.appendChild(el("div", { class: "history", id: "history" }));
  }
  function refreshNavState() {
    SECTIONS.forEach(function (s) {
      var b = $('#sidenav [data-key="' + s.key + '"]');
      if (!b) return;
      b.classList.toggle("on", s.key === current);
      var dot = b.querySelector(".off-dot");
      var off = s.toggle && data[s.key] && data[s.key].show === false;
      if (off && !dot) b.appendChild(el("span", { class: "off-dot", text: "Gizli" }));
      if (!off && dot) dot.remove();
    });
  }
  function loadHistory() {
    var box = $("#history");
    if (!box || DEMO) return;
    gh(repoPath() + "/commits?sha=" + encodeURIComponent(cfg.live) + "&path=data/homepage.json&per_page=5").then(function (list) {
      if (!list.length) return;
      box.innerHTML = "<h4>Son kayıtlar</h4>";
      list.forEach(function (c) {
        var d = new Date(c.commit.author.date);
        var a = el("a", { href: c.html_url, target: "_blank", rel: "noopener" }, [c.commit.message.split("\n")[0]]);
        a.appendChild(el("small", { text: d.toLocaleString("tr-TR", { dateStyle: "medium", timeStyle: "short" }) }));
        box.appendChild(a);
      });
    }).catch(function () {});
  }

  /* ---------------- Form üretimi ---------------- */
  function showSection(key) {
    current = key;
    refreshNavState();
    var s = SECTIONS.filter(function (x) { return x.key === key; })[0];
    if (!data[key]) data[key] = {};
    var obj = data[key];
    var ed = $("#editor");
    ed.innerHTML = "";
    var head = el("div", { class: "sec-head" }, [el("div", {}, [el("h2", { text: s.label }), s.desc ? el("p", { text: s.desc }) : null])]);
    var card = el("div", { class: "card" + (s.toggle && obj.show === false ? " disabled" : "") });
    if (s.toggle) head.appendChild(toggle("Bölümü göster", obj.show !== false, function (v) {
      obj.show = v; card.classList.toggle("disabled", !v); changed(); refreshNavState();
    }));
    ed.appendChild(head);
    s.fields.forEach(function (f) { card.appendChild(field(f, obj)); });
    ed.appendChild(card);
    ed.scrollTop = 0;
    scrollPreviewTo(s.sel);
  }

  function toggle(label, value, onChange) {
    var input = el("input", { type: "checkbox" });
    input.checked = value;
    input.addEventListener("change", function () { onChange(input.checked); });
    return el("label", { class: "switch" }, [input, el("span", { class: "track" }), el("span", { text: label })]);
  }

  function field(f, obj) {
    if (f.t === "group") return groupField(f, obj);
    if (f.t === "list") return listField(f, obj);
    if (f.t === "icon") return iconField(f, obj);
    if (f.t === "image") return imageField(f, obj);
    var id = "f" + Math.random().toString(36).slice(2, 9);
    var input = f.t === "textarea" ? el("textarea", { id: id, rows: 3 }) : el("input", { id: id, type: "text", spellcheck: f.t === "link" ? "false" : "true" });
    input.value = obj[f.k] == null ? "" : obj[f.k];
    var wrap = el("div", { class: "field" }, [el("label", { for: id, text: f.l }), input]);
    var count = null;
    if (f.max) { count = el("span", { class: "count" }); wrap.appendChild(count); }
    var upd = function () { if (count) { count.textContent = input.value.length + " / " + f.max; count.classList.toggle("over", input.value.length > f.max); } };
    upd();
    if (f.hint) wrap.appendChild(el("span", { class: "hint", text: f.hint }));
    input.addEventListener("input", function () { obj[f.k] = input.value; upd(); changed(); });
    return wrap;
  }

  function groupField(f, obj) {
    if (!obj[f.k]) obj[f.k] = {};
    var g = obj[f.k];
    var fs = el("fieldset", { class: "group" }, [el("legend", { text: f.l })]);
    if (f.toggle) fs.appendChild(toggle("Göster", g.show !== false, function (v) { g.show = v; changed(); }));
    f.fields.forEach(function (sf) { fs.appendChild(field(sf, g)); });
    return fs;
  }

  function listField(f, obj) {
    if (!Array.isArray(obj[f.k])) obj[f.k] = [];
    var arr = obj[f.k];
    var box = el("div", { class: "list" });
    var render = function (openIdx) {
      box.innerHTML = "";
      box.appendChild(el("div", { class: "list-head" }, [el("strong", {}, [f.l, el("small", { text: arr.length + (f.max ? " / " + f.max : "") })])]));
      arr.forEach(function (it, i) {
        var item = el("div", { class: "item" + (i === openIdx ? " open" : "") });
        var titleEl = el("span", { class: "title", text: String(it[f.titleKey] || f.item + " " + (i + 1)).replace(/\n/g, " ") });
        var stop = function (fn) { return function (e) { e.stopPropagation(); fn(); }; };
        var tools = el("span", { class: "tools" }, [
          el("button", { type: "button", class: "icon-btn sm", title: "Yukarı taşı", "aria-label": "Yukarı taşı", disabled: i === 0, onclick: stop(function () { arr.splice(i - 1, 0, arr.splice(i, 1)[0]); changed(); render(i - 1); }) }, [icon("arrow-up")]),
          el("button", { type: "button", class: "icon-btn sm", title: "Aşağı taşı", "aria-label": "Aşağı taşı", disabled: i === arr.length - 1, onclick: stop(function () { arr.splice(i + 1, 0, arr.splice(i, 1)[0]); changed(); render(i + 1); }) }, [rot(icon("arrow-up"))]),
          el("button", { type: "button", class: "icon-btn sm danger", title: "Sil", "aria-label": "Sil", onclick: stop(function () { if (confirm("“" + titleEl.textContent + "” silinsin mi?")) { arr.splice(i, 1); changed(); render(-1); } }) }, [icon("x")]),
        ]);
        var headEl = el("div", { class: "item-head", role: "button", tabindex: "0", "aria-expanded": i === openIdx ? "true" : "false" }, [el("span", { class: "num", text: String(i + 1) }), titleEl, tools, (function () { var c = icon("chevron-down"); c.classList.add("chev"); return c; })()]);
        var toggleOpen = function () { var o = item.classList.toggle("open"); headEl.setAttribute("aria-expanded", o ? "true" : "false"); };
        headEl.addEventListener("click", toggleOpen);
        headEl.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleOpen(); } });
        var body = el("div", { class: "item-body" });
        f.fields.forEach(function (sf) {
          var node = field(sf, it);
          if (sf.k === f.titleKey) node.addEventListener("input", function () { titleEl.textContent = String(it[f.titleKey] || f.item + " " + (i + 1)).replace(/\n/g, " "); });
          body.appendChild(node);
        });
        item.appendChild(headEl);
        item.appendChild(body);
        box.appendChild(item);
      });
      if (!f.max || arr.length < f.max) box.appendChild(el("button", { type: "button", class: "add-btn", onclick: function () {
        var n = {};
        f.fields.forEach(function (sf) { n[sf.k] = sf.t === "icon" ? "check" : ""; });
        arr.push(n); changed(); render(arr.length - 1);
      } }, [icon("check"), f.item + " ekle"]));
    };
    render(-1);
    return box;
  }
  function rot(svg) { svg.style.transform = "rotate(180deg)"; return svg; }

  /* İkon seçici */
  var picker = $("#iconPicker"), pickerCb = null, pickerVal = "";
  function renderIcons(q) {
    var grid = $("#iconGrid");
    grid.innerHTML = "";
    (window.ADMIN_ICONS || []).filter(function (n) { return !q || n.indexOf(q) > -1; }).forEach(function (n) {
      grid.appendChild(el("button", { type: "button", class: n === pickerVal ? "on" : "", title: n, "aria-label": n, onclick: function () { pickerCb(n); closePicker(); } }, [icon(n)]));
    });
  }
  function openPicker(anchor, val, cb) {
    pickerCb = cb; pickerVal = val;
    picker.hidden = false;
    var r = anchor.getBoundingClientRect();
    picker.style.left = Math.min(r.left, innerWidth - 340) + "px";
    picker.style.top = (r.bottom + 6 + 340 > innerHeight ? Math.max(10, r.top - 346) : r.bottom + 6) + "px";
    $("#iconSearch").value = "";
    renderIcons("");
    $("#iconSearch").focus();
  }
  function closePicker() { picker.hidden = true; pickerCb = null; }
  $("#iconSearch").addEventListener("input", function () { renderIcons(this.value.trim().toLowerCase()); });
  document.addEventListener("mousedown", function (e) { if (!picker.hidden && !picker.contains(e.target) && !e.target.closest(".icon-field")) closePicker(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") { closePicker(); $("#menu").hidden = true; } });

  function iconField(f, obj) {
    var prev = el("span", { class: "icon-preview" }, [icon(obj[f.k] || "check")]);
    var name = el("span", { text: obj[f.k] || "check" });
    var btn = el("button", { type: "button", class: "btn btn-ghost btn-sm", onclick: function () {
      openPicker(btn, obj[f.k], function (n) { obj[f.k] = n; prev.innerHTML = ""; prev.appendChild(icon(n)); name.textContent = n; changed(); });
    } }, ["İkonu değiştir"]);
    return el("div", { class: "field" }, [el("span", { text: f.l }), el("div", { class: "icon-field" }, [prev, name, btn])]);
  }

  /* Görsel alanı */
  function imageField(f, obj) {
    var thumb = el("div", { class: "thumb" });
    var input = el("input", { type: "text", placeholder: "https://… ya da boş bırakın (varsayılan görsel)", spellcheck: "false" });
    input.value = obj[f.k] || "";
    var file = el("input", { type: "file", accept: "image/png,image/jpeg,image/webp", hidden: true });
    var paint = function () {
      var v = obj[f.k];
      var src = v ? (uploads[v] || (/^https?:/i.test(v) ? v : SITE_BASE + v)) : "";
      thumb.style.backgroundImage = src ? "url('" + src.replace(/'/g, "%27") + "')" : "";
      thumb.textContent = src ? "" : "Varsayılan";
    };
    paint();
    input.addEventListener("input", function () { obj[f.k] = input.value.trim(); paint(); changed(); });
    file.addEventListener("change", function () {
      var fl = file.files[0];
      if (!fl) return;
      if (fl.size > MAX_UPLOAD) { toast("Görsel en fazla 2 MB olabilir.", "err"); return; }
      var reader = new FileReader();
      reader.onload = function () {
        var ext = (fl.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
        var base = fl.name.replace(/\.[^.]+$/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "gorsel";
        var p = "uploads/" + Date.now() + "-" + base + "." + ext;
        uploads[p] = reader.result;
        obj[f.k] = p; input.value = p; paint(); changed();
        toast("Görsel eklendi. “Kaydet ve yayınla” ile siteye yüklenecek.", "ok", 4000);
      };
      reader.readAsDataURL(fl);
      file.value = "";
    });
    var row = el("div", { class: "row" }, [input,
      el("button", { type: "button", class: "btn btn-ghost btn-sm", onclick: function () { file.click(); } }, ["Yükle"]),
      el("button", { type: "button", class: "icon-btn sm danger", title: "Görseli kaldır", "aria-label": "Görseli kaldır", onclick: function () { obj[f.k] = ""; input.value = ""; paint(); changed(); } }, [icon("x")])]);
    return el("div", { class: "field" }, [el("span", { text: f.l }), el("div", { class: "image-field" }, [thumb, el("div", {}, [row, el("span", { class: "hint", text: "PNG, JPG ya da WEBP · en fazla 2 MB" })])]), file]);
  }

  /* ---------------- Değişiklik & önizleme ---------------- */
  var previewTimer = null;
  function changed() {
    setDirty(JSON.stringify(data) !== JSON.stringify(saved) || Object.keys(uploads).length > 0);
    clearTimeout(previewTimer);
    previewTimer = setTimeout(function () { updatePreview(false); }, 350);
  }

  var frame = $("#frame"), device = "desktop", pendingScroll = null;
  function previewHtml() {
    var html = window.DikkatHome.applyToPage(pageHtml, data);
    Object.keys(uploads).forEach(function (p) { html = html.split(p).join(uploads[p]); });
    var inject = '<base href="' + SITE_BASE + '"><style>.reveal{opacity:1!important;transform:none!important}</style>' +
      '<script>document.addEventListener("click",function(e){if(e.target.closest("a"))e.preventDefault()},true);<\/script>';
    return html.replace(/<head>/i, "<head>" + inject);
  }
  function updatePreview(first) {
    if (!pageHtml) return;
    var y = 0;
    try { y = frame.contentWindow.scrollY; } catch (e) {}
    pendingScroll = first ? null : y;
    frame.srcdoc = previewHtml();
  }
  frame.addEventListener("load", function () {
    try {
      if (pendingScroll != null) frame.contentWindow.scrollTo(0, pendingScroll);
      else scrollPreviewTo((SECTIONS.filter(function (x) { return x.key === current; })[0] || {}).sel);
    } catch (e) {}
  });
  function scrollPreviewTo(sel) {
    if (!sel) return;
    try {
      var t = frame.contentDocument.querySelector(sel);
      if (t) frame.contentWindow.scrollTo({ top: Math.max(0, t.getBoundingClientRect().top + frame.contentWindow.scrollY - 90), behavior: "smooth" });
    } catch (e) {}
  }
  function fitFrame() {
    var stage = $(".preview-stage");
    if (!stage || !stage.clientWidth) return;
    var w = device === "mobile" ? 390 : 1280;
    var s = Math.min(1, (stage.clientWidth - (device === "mobile" ? 40 : 0)) / w);
    frame.style.width = w + "px";
    frame.style.height = (device === "mobile" ? Math.min(844, (stage.clientHeight - 40) / s) : stage.clientHeight / s) + "px";
    frame.style.transform = "scale(" + s + ")";
    frame.style.left = device === "mobile" ? ((stage.clientWidth - w * s) / 2) + "px" : "0";
    frame.style.top = device === "mobile" ? "20px" : "0";
  }
  if ("ResizeObserver" in window) new ResizeObserver(fitFrame).observe($(".preview-stage"));
  window.addEventListener("resize", fitFrame);
  document.querySelectorAll("[data-device]").forEach(function (b) {
    b.addEventListener("click", function () {
      device = b.getAttribute("data-device");
      document.querySelectorAll("[data-device]").forEach(function (x) { x.classList.toggle("on", x === b); });
      $("#preview").classList.toggle("mobile", device === "mobile");
      fitFrame();
    });
  });
  $("#togglePreview").addEventListener("click", function () {
    var ws = $(".workspace");
    if (innerWidth <= 1200) ws.classList.toggle("show-preview");
    else ws.classList.toggle("no-preview");
    setTimeout(fitFrame, 50);
  });

  /* ---------------- Kaydet ---------------- */
  function validate() {
    var errs = [];
    if (!data.seo || !data.seo.title) errs.push("SEO: sayfa başlığı boş olamaz.");
    if (data.hero && data.hero.show !== false && !data.hero.title1) errs.push("Hero: başlık boş olamaz.");
    return errs;
  }
  function save() {
    var errs = validate();
    if (errs.length) { toast(errs.join("<br>"), "err"); return; }
    var json = JSON.stringify(data, null, 2) + "\n";
    if (DEMO) {
      download("homepage.json", json);
      saved = clone(data); uploads = {}; setDirty(false);
      toast("Demo modu: homepage.json indirildi (GitHub’a kaydedilmedi).", "ok");
      return;
    }
    var upFiles = Object.keys(uploads).map(function (p) { return { path: p, base64: uploads[p].split(",")[1] }; });
    var msg = "İçerik: ana sayfa admin panelinden güncellendi";
    loading(true, "Yayın dalı güncelleniyor…");
    var savedPreview = pageHtml;
    // Her dal için güncel index.html yeniden alınır; böylece arada yapılan değişiklikler ezilmez.
    getText(cfg.live, "index.html").then(function (liveHtml) {
      var html = window.DikkatHome.applyToPage(liveHtml, data);
      return commitFiles(cfg.live, [{ path: "data/homepage.json", content: json }, { path: "index.html", content: html }].concat(upFiles), msg).then(function () { pageHtml = html; });
    }).then(function () {
      if (!cfg.source) return;
      loading(true, "Kaynak dalı güncelleniyor…");
      return getText(cfg.source, cfg.prefix + "index.html").then(function (srcHtml) {
        var html = window.DikkatHome.applyToPage(srcHtml, data);
        return commitFiles(cfg.source, [{ path: cfg.prefix + "data/homepage.json", content: json }, { path: cfg.prefix + "index.html", content: html }]
          .concat(upFiles.map(function (f) { return { path: cfg.prefix + f.path, base64: f.base64 }; })), msg);
      }).catch(function (e) {
        toast("Site yayınlandı ancak kaynak dalı (" + escapeHtml(cfg.source) + ") güncellenemedi: " + escapeHtml(e.message), "err", 12000);
      });
    }).then(function () {
      saved = clone(data); uploads = {}; setDirty(false);
      loading(false);
      toast("<strong>Kaydedildi.</strong> Değişiklikler 1–2 dakika içinde sitede görünür. <a href=\"" + SITE_BASE + "\" target=\"_blank\" rel=\"noopener\">Siteyi aç</a>", "ok", 10000);
      setTimeout(loadHistory, 1500);
    }).catch(function (e) {
      pageHtml = savedPreview;
      loading(false);
      toast("Kaydedilemedi: " + escapeHtml(e.message) + (e.status === 403 || e.status === 404 ? "<br>Anahtarın “Contents: Read and write” izni olduğundan emin olun." : ""), "err", 12000);
    });
  }
  $("#save").addEventListener("click", save);
  document.addEventListener("keydown", function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") { e.preventDefault(); if (dirty) save(); }
  });
  $("#revert").addEventListener("click", function () {
    if (!confirm("Kaydedilmemiş tüm değişiklikler geri alınsın mı?")) return;
    data = clone(saved); uploads = {}; setDirty(false);
    buildNav(); showSection(current); updatePreview(false); loadHistory();
  });

  /* ---------------- Menü ---------------- */
  function escapeHtml(s) { return window.DikkatHome.esc(s); }
  function download(name, text) {
    var a = el("a", { href: URL.createObjectURL(new Blob([text], { type: "application/json" })), download: name });
    document.body.appendChild(a); a.click(); a.remove();
  }
  var menuBtn = $("#menuBtn"), menu = $("#menu");
  menuBtn.addEventListener("click", function () { menu.hidden = !menu.hidden; menuBtn.setAttribute("aria-expanded", menu.hidden ? "false" : "true"); });
  document.addEventListener("click", function (e) { if (!e.target.closest(".top-actions")) menu.hidden = true; });
  menu.addEventListener("click", function (e) {
    var b = e.target.closest("[data-act]");
    if (!b) return;
    menu.hidden = true;
    var act = b.getAttribute("data-act");
    if (act === "export") download("homepage-" + new Date().toISOString().slice(0, 10) + ".json", JSON.stringify(data, null, 2) + "\n");
    if (act === "import") $("#importFile").click();
    if (act === "reload") { if (!dirty || confirm("Kaydedilmemiş değişiklikler silinecek. Devam edilsin mi?")) load(); }
    if (act === "logout") logout();
  });
  $("#importFile").addEventListener("change", function () {
    var f = this.files[0];
    if (!f) return;
    f.text().then(function (t) {
      var j = JSON.parse(t);
      if (!j || typeof j !== "object" || !j.seo) throw new Error("Geçerli bir ana sayfa yedeği değil.");
      data = j; buildNav(); showSection(current); changed();
      toast("Yedek yüklendi. Yayınlamak için “Kaydet ve yayınla”ya basın.", "ok");
    }).catch(function (e) { toast("Yedek okunamadı: " + escapeHtml(e.message), "err"); });
    this.value = "";
  });

  /* ---------------- Başlat ---------------- */
  if (DEMO) { $("#viewSite").href = SITE_BASE; start(); }
  else if (token) start();
  else showLogin();
})();
