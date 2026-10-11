(function () {
  if (window.__ksSmooth) return;
  window.__ksSmooth = true;
  var me = document.currentScript;
  var WRAP_SEL = me && me.getAttribute('data-wrapper');
  var wrap = null;
  if (!window.matchMedia || !matchMedia('(pointer: fine)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var css = document.createElement('style');
  css.textContent = 'html.lenis,html.lenis body{height:auto}.lenis.lenis-smooth{scroll-behavior:auto !important}.lenis.lenis-stopped{overflow:hidden}';
  document.head.appendChild(css);
  function blocked(node) {
    for (var n = node; n && n.nodeType === 1 && n !== wrap && n !== document.body && n !== document.documentElement; n = n.parentElement || (n.getRootNode && n.getRootNode().host) || null) {
      var cs = getComputedStyle(n);
      if (cs.position === 'fixed') return true;
      if (/(auto|scroll)/.test(cs.overflowY) && n.scrollHeight > n.clientHeight + 1 && n.clientHeight < (wrap ? wrap.clientHeight : window.innerHeight) * 0.85) return true;
    }
    return false;
  }
  function realLimit() { if (wrap) return Math.max(0, wrap.scrollHeight - wrap.clientHeight); var se = document.scrollingElement || document.documentElement; return Math.max(0, se.scrollHeight - window.innerHeight); }
  function fit() { var l = window.__ksLenis; if (!l) return; if (Math.abs((l.limit || 0) - realLimit()) > 2) { try { l.resize(); } catch (e) {} } }
  var lastFit = 0;
  window.addEventListener('wheel', function () { var n = performance.now(); if (n - lastFit > 400) { lastFit = n; fit(); } }, { capture: true, passive: true });
  function start() {
    if (!window.Lenis || window.__ksLenis) return;
    if (WRAP_SEL) {
      wrap = document.querySelector(WRAP_SEL);
      if (!wrap || !wrap.firstElementChild) { setTimeout(start, 100); return; }
    }
    var opts = wrap ? { wrapper: wrap, content: wrap.firstElementChild, eventsTarget: wrap } : {};
    var l = new window.Lenis(Object.assign(opts, { lerp: 0.1, smoothWheel: true, wheelMultiplier: 1, anchors: true, __experimental__naiveDimensions: true, prevent: blocked }));
    window.__ksLenis = l;
    if (window.ResizeObserver) { var ro = new ResizeObserver(fit); ro.observe(document.documentElement); if (document.body) ro.observe(document.body); if (wrap) { ro.observe(wrap); ro.observe(wrap.firstElementChild); } }
    window.addEventListener('load', fit);
    setInterval(fit, 1000);
    function raf(t) { l.raf(t); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
  }
  var s = document.createElement('script');
  s.src = 'https://unpkg.com/lenis@1.1.13/dist/lenis.min.js';
  s.onload = start;
  document.head.appendChild(s);
})();
