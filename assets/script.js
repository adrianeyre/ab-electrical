(function () {
  'use strict';
  var root = document.documentElement;
  var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* True when either the operating system or the in-page Accessibility toggle
     asks for reduced motion. Read live so a mid-session change takes effect. */
  function motionReduced() {
    return motionQuery.matches || root.getAttribute('data-motion') === 'reduce';
  }
  var reduceMotion = motionReduced();

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
    window.scrollTo({ top: 0, behavior: motionReduced() ? 'auto' : 'smooth' });
  });

  /* ---------- Mobile menu ---------- */
  var menuBtn = document.getElementById('menuBtn');
  var panel = document.getElementById('mobilePanel');
  function setMenu(open) {
    panel.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  menuBtn.addEventListener('click', function () {
    var open = !panel.classList.contains('open');
    setMenu(open);
    if (open) { var first = panel.querySelector('a'); if (first) first.focus(); }
  });
  panel.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape' || !panel.classList.contains('open')) return;
    setMenu(false);
    menuBtn.focus();
  });

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
  var errorSummary = document.getElementById('formErrors');
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

    if (firstBad) {
      var bad = form.querySelectorAll('.field.invalid').length;
      if (errorSummary) {
        errorSummary.textContent = bad === 1
          ? 'There is 1 problem with this form. Please check the highlighted field.'
          : 'There are ' + bad + ' problems with this form. Please check the highlighted fields.';
      }
      firstBad.focus();
      status.classList.remove('show');
      return;
    }
    if (errorSummary) errorSummary.textContent = '';

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

  /* ---------- Modal dialogs (shared) ----------
     showModal() gives us the top layer, a focus trap, Escape and focus
     restoration for free. It is not guaranteed though: an older engine may not
     implement it, and it throws if the dialog already carries [open]. Without a
     fallback the dialog would render in normal flow after the footer — visually
     absent, which reads as "the button does nothing". So every failure path
     falls back to a positioned, backdropped, focus-trapped dialog instead. */
  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), ' +
                  'textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
  var lastTrigger = null;

  function siblingsOf(el) {
    return Array.prototype.filter.call(document.body.children, function (n) { return n !== el; });
  }
  function setBackgroundInert(el, on) {
    siblingsOf(el).forEach(function (n) {
      if (on) { n.setAttribute('inert', ''); n.setAttribute('aria-hidden', 'true'); }
      else { n.removeAttribute('inert'); n.removeAttribute('aria-hidden'); }
    });
  }
  function focusFirst(el) {
    var t = el.querySelector(FOCUSABLE);
    if (t) t.focus();
  }
  function trapTab(e) {
    var dlg = e.currentTarget;
    if (e.key !== 'Tab') return;
    var items = Array.prototype.filter.call(dlg.querySelectorAll(FOCUSABLE), function (n) {
      return n.offsetWidth || n.offsetHeight || n.getClientRects().length;
    });
    if (!items.length) return;
    var first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  function fallbackKeys(e) {
    if (e.key === 'Escape') { e.preventDefault(); closeDialog(e.currentTarget); }
    else trapTab(e);
  }

  function openDialog(dlg, trigger) {
    if (!dlg || dlg.hasAttribute('open')) return;
    lastTrigger = trigger || document.activeElement;
    try {
      if (typeof dlg.showModal !== 'function') throw new Error('no showModal');
      dlg.showModal();
      if (!dlg.hasAttribute('open')) throw new Error('showModal did not open');
      return;
    } catch (err) {
      dlg.setAttribute('data-fallback', '');
      dlg.setAttribute('open', '');
      dlg.setAttribute('aria-modal', 'true');
      dlg.setAttribute('role', 'dialog');
      setBackgroundInert(dlg, true);
      dlg.addEventListener('keydown', fallbackKeys);
      focusFirst(dlg);
    }
  }

  function closeDialog(dlg) {
    if (!dlg) return;
    if (dlg.hasAttribute('data-fallback')) {
      dlg.removeEventListener('keydown', fallbackKeys);
      setBackgroundInert(dlg, false);
      dlg.removeAttribute('data-fallback');
      dlg.removeAttribute('aria-modal');
      dlg.removeAttribute('open');
      if (lastTrigger && typeof lastTrigger.focus === 'function') lastTrigger.focus();
      return;
    }
    if (typeof dlg.close === 'function') dlg.close();
    else dlg.removeAttribute('open');
  }

  /* Wire every [data-<name>-open] / [data-<name>-close] pair to its dialog. */
  function wireDialog(dlg, key) {
    if (!dlg) return;
    document.querySelectorAll('[data-' + key + '-open]').forEach(function (el) {
      el.addEventListener('click', function (e) { e.preventDefault(); openDialog(dlg, el); });
    });
    document.querySelectorAll('[data-' + key + '-close]').forEach(function (el) {
      el.addEventListener('click', function () { closeDialog(dlg); });
    });
    /* Click on the backdrop area (the dialog's own box, outside its panel). */
    dlg.addEventListener('click', function (e) { if (e.target === dlg) closeDialog(dlg); });
  }
  wireDialog(dialog, 'cookie');

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

  /* ---------- Accessibility statement + motion preference ---------- */
  var MOTION_KEY = 'ab-motion';
  var a11yDialog = document.getElementById('a11yDialog');
  var motionToggle = document.getElementById('motionToggle');
  var motionState = document.getElementById('motionState');

  function applyMotion(reduce) {
    if (reduce) root.setAttribute('data-motion', 'reduce');
    else root.removeAttribute('data-motion');
    if (motionToggle) motionToggle.checked = reduce;
    if (motionState) motionState.textContent = reduce ? 'On' : 'Off';
    /* Anything still waiting to fade in should just be shown. */
    if (reduce) {
      document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
    }
  }
  applyMotion(lsGet(MOTION_KEY) === 'reduce');

  if (motionToggle) motionToggle.addEventListener('change', function () {
    var reduce = motionToggle.checked;
    applyMotion(reduce);
    if (reduce) lsSet(MOTION_KEY, 'reduce');
    else { try { localStorage.removeItem(MOTION_KEY); } catch (e) {} }
  });

  wireDialog(a11yDialog, 'a11y');
})();
