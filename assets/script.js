(function () {
  'use strict';
  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Theme: system (default) → light → dark ---------- */
  var themeBtn = document.getElementById('themeBtn');
  function currentMode() {
    var t = root.getAttribute('data-theme');
    return t === 'light' || t === 'dark' ? t : 'system';
  }
  function applyMode(mode) {
    if (mode === 'system') { root.removeAttribute('data-theme'); try { localStorage.removeItem('ab-theme'); } catch (e) {} }
    else { root.setAttribute('data-theme', mode); try { localStorage.setItem('ab-theme', mode); } catch (e) {} }
    themeBtn.setAttribute('title', 'Theme: ' + mode + ' (click to change)');
    themeBtn.setAttribute('aria-label', 'Colour theme: ' + mode + '. Click to change.');
  }
  themeBtn.addEventListener('click', function () {
    var order = { system: 'light', light: 'dark', dark: 'system' };
    applyMode(order[currentMode()]);
  });
  applyMode(currentMode());

  /* ---------- Header scroll shadow ---------- */
  var header = document.getElementById('siteHeader');
  var toTop = document.getElementById('toTop');
  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle('scrolled', y > 8);
    toTop.classList.toggle('show', y > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  toTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  /* ---------- Mobile menu ---------- */
  var menuBtn = document.getElementById('menuBtn');
  var panel = document.getElementById('mobilePanel');
  function setMenu(open) {
    panel.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  menuBtn.addEventListener('click', function () { setMenu(!panel.classList.contains('open')); });
  panel.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  /* ---------- Scroll reveal ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Count-up stats ---------- */
  function countUp(el) {
    if (el.dataset.plain) { el.textContent = el.dataset.plain; return; }
    var target = parseInt(el.dataset.count, 10);
    var suffix = el.dataset.suffix || '';
    if (reduceMotion) { el.textContent = target + suffix; return; }
    var start = null, dur = 1300;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll('[data-count]');
  if (!('IntersectionObserver' in window)) {
    counters.forEach(countUp);
  } else {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { countUp(en.target); cio.unobserve(en.target); } });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* ---------- Active nav link on scroll ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-links a'));
  var sections = navLinks.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  if ('IntersectionObserver' in window) {
    var sio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          navLinks.forEach(function (a) { a.classList.remove('active'); });
          var i = sections.indexOf(en.target);
          if (i > -1) navLinks[i].classList.add('active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { if (s) sio.observe(s); });
  }

  /* ---------- Contact form: validation + mailto ---------- */
  var form = document.getElementById('contactForm');
  var status = document.getElementById('formStatus');
  function setInvalid(id, bad) {
    var field = document.getElementById('f-' + id);
    field.classList.toggle('invalid', bad);
    field.querySelector('input, textarea').setAttribute('aria-invalid', String(bad));
  }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = form.name.value.trim();
    var email = form.email.value.trim();
    var message = form.message.value.trim();
    var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    var firstBad = null;

    setInvalid('name', !name); if (!name && !firstBad) firstBad = form.name;
    setInvalid('email', !emailOk); if (!emailOk && !firstBad) firstBad = form.email;
    setInvalid('message', !message); if (!message && !firstBad) firstBad = form.message;

    if (firstBad) { firstBad.focus(); status.classList.remove('show'); return; }

    var subject = 'Website enquiry from ' + name;
    var body = 'Name: ' + name + '\nEmail: ' + email + '\n\n' + message;
    window.location.href = 'mailto:abelectrical29@hotmail.com?subject=' +
      encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    status.classList.add('show');
    form.querySelectorAll('.invalid').forEach(function (f) { f.classList.remove('invalid'); });
  });
  ['name', 'email', 'message'].forEach(function (id) {
    var el = document.getElementById(id);
    el.addEventListener('blur', function () {
      if (id === 'email') setInvalid('email', el.value.trim() !== '' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim()));
      else if (el.value.trim() !== '') setInvalid(id, false);
    });
  });

  /* ---------- Dynamic year ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- Cookie consent + policy ---------- */
  var CONSENT_KEY = 'ab-cookie-consent';   // banner acknowledgement
  var MAPS_KEY = 'ab-maps-consent';        // opt-in for the embedded Google Map
  var banner = document.getElementById('cookieBanner');
  var dialog = document.getElementById('cookieDialog');
  var mapWrap = document.getElementById('mapWrap');

  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  /* Banner (simple acknowledgement) */
  function hideBanner() { if (banner) { banner.classList.remove('show'); banner.hidden = true; } }
  if (banner && lsGet(CONSENT_KEY) !== 'acknowledged') {
    banner.hidden = false;
    requestAnimationFrame(function () { banner.classList.add('show'); });
  }
  var acceptBtn = document.getElementById('cookieAccept');
  if (acceptBtn) acceptBtn.addEventListener('click', function () {
    lsSet(CONSENT_KEY, 'acknowledged');
    hideBanner();
  });

  /* Policy dialog */
  function openDialog() {
    if (!dialog) return;
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
  }
  document.querySelectorAll('[data-cookie-open]').forEach(function (el) {
    el.addEventListener('click', function (e) { e.preventDefault(); openDialog(); });
  });
  document.querySelectorAll('[data-cookie-close]').forEach(function (el) {
    el.addEventListener('click', function () { if (dialog) dialog.close(); });
  });
  if (dialog) dialog.addEventListener('click', function (e) { if (e.target === dialog) dialog.close(); });

  /* Embedded map: separate, in-context opt-in */
  function loadMap() {
    if (!mapWrap) return;
    var frame = mapWrap.querySelector('iframe[data-src]');
    if (frame && !frame.getAttribute('src')) { frame.setAttribute('src', frame.getAttribute('data-src')); }
    mapWrap.classList.add('consented');
  }
  if (lsGet(MAPS_KEY) === 'granted') loadMap();
  var enableMapBtn = document.getElementById('enableMap');
  if (enableMapBtn) enableMapBtn.addEventListener('click', function () {
    lsSet(MAPS_KEY, 'granted');
    loadMap();
  });
})();
