/* =========================================================
   DikkatDA – etkileşimler
   - Mega menü (hover / tıklama / klavye / ESC)
   - Hizmetler sekmeleri
   - Çözümler sektör filtresi
   - Mobil menü (masaüstü menüden otomatik üretilir)
   - Scroll efektleri
   ========================================================= */
(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var navItems = Array.prototype.slice.call(document.querySelectorAll(".nav-item.has-mega"));
  var desktopMQ = window.matchMedia("(min-width: 1121px) and (hover: hover)");
  var closeTimer = null;

  /* ---------- Mega menü ---------- */
  function openItem(item) {
    navItems.forEach(function (other) { if (other !== item) closeItem(other); });
    item.classList.add("open");
    item.querySelector(".nav-link").setAttribute("aria-expanded", "true");
  }
  function closeItem(item) {
    item.classList.remove("open");
    item.querySelector(".nav-link").setAttribute("aria-expanded", "false");
  }
  function closeAll() { navItems.forEach(closeItem); }

  navItems.forEach(function (item) {
    var trigger = item.querySelector(".nav-link");

    item.addEventListener("mouseenter", function () {
      if (!desktopMQ.matches) return;
      clearTimeout(closeTimer);
      openItem(item);
    });
    item.addEventListener("mouseleave", function () {
      if (!desktopMQ.matches) return;
      closeTimer = setTimeout(function () { closeItem(item); }, 160);
    });
    trigger.addEventListener("click", function (e) {
      e.preventDefault();
      item.classList.contains("open") ? closeItem(item) : openItem(item);
    });
    trigger.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        openItem(item);
        var first = item.querySelector(".mega a, .mega button");
        if (first) first.focus();
      }
    });
    item.addEventListener("focusout", function (e) {
      if (!item.contains(e.relatedTarget)) closeItem(item);
    });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    var open = document.querySelector(".nav-item.open");
    if (open) { closeItem(open); open.querySelector(".nav-link").focus(); }
    if (document.body.classList.contains("drawer-open")) toggleDrawer(false);
  });
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".nav-item.has-mega")) closeAll();
  });

  /* ---------- Hizmetler sekmeleri ---------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll(".ms-tab"));
  function selectTab(tab) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute("aria-selected", on ? "true" : "false");
      t.tabIndex = on ? 0 : -1;
      var panel = document.getElementById(t.getAttribute("aria-controls"));
      if (panel) panel.hidden = !on;
    });
  }
  tabs.forEach(function (tab, i) {
    tab.addEventListener("mouseenter", function () { if (desktopMQ.matches) selectTab(tab); });
    tab.addEventListener("focus", function () { selectTab(tab); });
    tab.addEventListener("click", function () { selectTab(tab); });
    tab.addEventListener("keydown", function (e) {
      var next = null;
      if (e.key === "ArrowDown") next = tabs[(i + 1) % tabs.length];
      if (e.key === "ArrowUp") next = tabs[(i - 1 + tabs.length) % tabs.length];
      if (e.key === "ArrowRight") {
        var panel = document.getElementById(tab.getAttribute("aria-controls"));
        var link = panel && panel.querySelector("a");
        if (link) { e.preventDefault(); link.focus(); }
        return;
      }
      if (next) { e.preventDefault(); next.focus(); }
    });
  });

  /* ---------- Çözümler: sektöre göre filtre ---------- */
  var chips = Array.prototype.slice.call(document.querySelectorAll(".sol-filter .chip"));
  var solCards = Array.prototype.slice.call(document.querySelectorAll(".sol-card"));
  var note = document.querySelector(".sol-filter-note");
  var sectorLink = document.getElementById("sectorLink");

  chips.forEach(function (chip) {
    chip.addEventListener("click", function (e) {
      e.stopPropagation();
      var sector = chip.getAttribute("data-sector");
      chips.forEach(function (c) { c.classList.toggle("active", c === chip); c.setAttribute("aria-pressed", c === chip ? "true" : "false"); });
      var count = 0;
      solCards.forEach(function (card) {
        var list = (card.getAttribute("data-sectors") || "").split(" ");
        var match = sector === "all" || list.indexOf(sector) > -1;
        if (match) count++;
        card.classList.toggle("is-dim", !match);
        card.classList.toggle("is-match", match && sector !== "all");
      });
      if (sector === "all") {
        note.textContent = "Tüm çözümler gösteriliyor.";
        sectorLink.setAttribute("href", "sektorler/index.html");
        sectorLink.firstChild.textContent = "Tüm sektörleri incele ";
      } else {
        note.textContent = chip.textContent + " için " + count + " önerilen çözüm";
        sectorLink.setAttribute("href", "sektorler/" + sector + ".html");
        sectorLink.firstChild.textContent = chip.textContent + " çözümlerine git ";
      }
    });
  });

  /* ---------- Mobil menü ---------- */
  var drawer = document.querySelector(".mobile-drawer");
  var drawerBody = document.querySelector(".drawer-body");
  var toggleBtn = document.querySelector(".menu-toggle");
  var chevron = '<svg class="ico" aria-hidden="true"><use href="#i-chevron-down"/></svg>';

  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function accordion(wrapper) {
    var btn = wrapper.querySelector(":scope > button");
    btn.addEventListener("click", function () {
      var open = wrapper.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  function buildMobileMenu() {
    var list = el("ul");
    document.querySelectorAll(".nav-list > .nav-item").forEach(function (item) {
      var link = item.querySelector(".nav-link");
      var label = link.getAttribute("data-label") || link.textContent.trim();
      var li = el("li", "m-item");

      if (!item.classList.contains("has-mega")) {
        var a = el("a", null, label);
        a.href = link.getAttribute("href");
        li.appendChild(a);
        list.appendChild(li);
        return;
      }

      var btn = el("button", null, "<span>" + label + "</span>" + chevron);
      btn.type = "button";
      btn.setAttribute("aria-expanded", "false");
      li.appendChild(btn);
      var panel = el("div", "m-panel");

      var groups = item.querySelectorAll("[data-m-group]");
      groups.forEach(function (g) {
        var links = g.querySelectorAll("a[data-m-link]");
        var target = panel;
        if (groups.length > 1) {
          var sub = el("div", "m-sub");
          var sb = el("button", null, "<span>" + g.getAttribute("data-m-group") + "</span>" + chevron);
          sb.type = "button";
          sb.setAttribute("aria-expanded", "false");
          sub.appendChild(sb);
          target = el("div", "m-panel");
          sub.appendChild(target);
          panel.appendChild(sub);
          accordion(sub);
        }
        links.forEach(function (l) {
          var a = el("a");
          a.href = l.getAttribute("href");
          a.textContent = l.getAttribute("data-m-link") || l.textContent.trim();
          target.appendChild(a);
        });
      });
      li.appendChild(panel);
      accordion(li);
      list.appendChild(li);
    });
    drawerBody.appendChild(list);
  }

  function toggleDrawer(open) {
    document.body.classList.toggle("drawer-open", open);
    toggleBtn.setAttribute("aria-expanded", open ? "true" : "false");
    drawer.setAttribute("aria-hidden", open ? "false" : "true");
    if (open) drawer.querySelector(".drawer-close").focus();
    else toggleBtn.focus();
  }

  if (drawer) {
    buildMobileMenu();
    toggleBtn.addEventListener("click", function () { toggleDrawer(true); });
    drawer.querySelector(".drawer-close").addEventListener("click", function () { toggleDrawer(false); });
    document.querySelector(".drawer-backdrop").addEventListener("click", function () { toggleDrawer(false); });
  }

  /* ---------- Scroll efektleri ---------- */
  var toTop = document.querySelector(".to-top");
  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle("scrolled", y > 8);
    if (toTop) toTop.classList.toggle("show", y > 600);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  if (toTop) toTop.addEventListener("click", function () { window.scrollTo({ top: 0 }); });

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach(function (n) { io.observe(n); });
  } else {
    document.querySelectorAll(".reveal").forEach(function (n) { n.classList.add("in"); });
  }

  /* ---------- Bülten formu ---------- */
  var nl = document.querySelector(".newsletter");
  if (nl) nl.addEventListener("submit", function (e) {
    e.preventDefault();
    var input = nl.querySelector("input");
    if (!input.checkValidity()) { input.reportValidity(); return; }
    input.value = "";
    input.placeholder = "Teşekkürler! Kaydınız alındı.";
  });

  /* ---------- Formlar (iletişim, teklif, başvuru) ----------
     NOT: Sunucu tarafı henüz yok. Gerçek gönderim için FORM_ENDPOINT'e
     form verisini POST eden bir servis (ör. PHP, Formspree, Netlify Forms) bağlayın. */
  var FORM_ENDPOINT = null; // örn. "https://formspree.io/f/xxxx"

  function sendForm(form) {
    var done = function () {
      form.classList.add("sent");
      var ok = form.querySelector(".form-success");
      if (ok) { ok.hidden = false; ok.scrollIntoView({ block: "nearest", behavior: "smooth" }); }
      form.reset();
    };
    if (!FORM_ENDPOINT) { done(); return; }
    fetch(FORM_ENDPOINT, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
      .then(function (r) { if (!r.ok) throw new Error(r.status); done(); })
      .catch(function () { alert("Form gönderilemedi. Lütfen info@dikkatda.com adresine yazın."); });
  }

  document.querySelectorAll(".js-form").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var scope = form.querySelector(".q-step:not([hidden])") || form;
      var invalid = Array.prototype.find.call(scope.querySelectorAll("input, select, textarea"), function (f) { return !f.checkValidity(); });
      if (invalid) { invalid.reportValidity(); return; }
      sendForm(form);
    });
  });

  /* Teklif sihirbazı */
  var quote = document.querySelector(".quote-form");
  if (quote) {
    var stepsEls = quote.querySelectorAll(".q-step");
    var markers = quote.querySelectorAll(".quote-steps li");
    var cur = 0;
    var show = function (i) {
      stepsEls.forEach(function (s, k) { s.hidden = k !== i; });
      markers.forEach(function (m, k) { m.classList.toggle("active", k === i); m.classList.toggle("done", k < i); });
      cur = i;
      quote.scrollIntoView({ block: "start", behavior: "smooth" });
    };
    quote.addEventListener("click", function (e) {
      if (e.target.closest("[data-next]")) {
        var step = stepsEls[cur];
        if (cur === 0) {
          var any = step.querySelector("input[name=hizmet]:checked");
          step.querySelector(".q-error").hidden = !!any;
          if (!any) return;
        }
        var bad = Array.prototype.find.call(step.querySelectorAll("input, select, textarea"), function (f) { return !f.checkValidity(); });
        if (bad) { bad.reportValidity(); return; }
        show(cur + 1);
      }
      if (e.target.closest("[data-prev]")) show(cur - 1);
    });
    var pre = new URLSearchParams(location.search).get("hizmet");
    if (pre) { var box = quote.querySelector('input[name=hizmet][value="' + pre.replace(/[^a-z0-9-]/g, "") + '"]'); if (box) box.checked = true; }
  }

  /* Kariyer: "Başvur" butonu pozisyonu seçer */
  document.querySelectorAll("[data-job]").forEach(function (b) {
    b.addEventListener("click", function () {
      var sel = document.querySelector('#basvuru select[name="pozisyon"]');
      if (sel) sel.value = b.getAttribute("data-job");
    });
  });

  /* ---------- Liste filtreleri (çözümler, blog, referanslar) ---------- */
  document.querySelectorAll("[data-filter-group]").forEach(function (bar) {
    var name = bar.getAttribute("data-filter-group");
    var list = document.querySelector('[data-filter-items="' + name + '"]');
    if (!list) return;
    var empty = list.parentNode.querySelector(".filter-empty");
    bar.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-filter]");
      if (!btn) return;
      var val = btn.getAttribute("data-filter");
      bar.querySelectorAll("[data-filter]").forEach(function (b) { b.classList.toggle("active", b === btn); b.setAttribute("aria-pressed", b === btn ? "true" : "false"); });
      var shown = 0;
      Array.prototype.forEach.call(list.children, function (item) {
        var tags = (item.getAttribute("data-tags") || "").split(" ");
        var ok = val === "all" || tags.indexOf(val) > -1;
        item.classList.toggle("is-hidden", !ok);
        if (ok) shown++;
      });
      if (empty) empty.hidden = shown > 0;
    });
  });

  /* Sözlük arama */
  var gs = document.querySelector("[data-glossary-search]");
  if (gs) gs.addEventListener("input", function () {
    var q = gs.value.trim().toLocaleLowerCase("tr-TR");
    var shown = 0;
    document.querySelectorAll(".glossary-list .term").forEach(function (t) {
      var ok = !q || t.textContent.toLocaleLowerCase("tr-TR").indexOf(q) > -1;
      t.classList.toggle("is-hidden", !ok);
      if (ok) shown++;
    });
    document.querySelector(".glossary .filter-empty").hidden = shown > 0;
  });

  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
