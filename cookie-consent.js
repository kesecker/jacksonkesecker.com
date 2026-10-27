(function () {
  if (window.__ksCookie) return;
  window.__ksCookie = true;
  var KEY = 'ksCookiePrefs';
  var FONT = 'Montserrat,system-ui,sans-serif';
  var dl = window.dataLayer = window.dataLayer || [];
  function gtag() { dl.push(arguments); }
  var prefs = null;
  try { prefs = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) {}
  function g(v) { return v ? 'granted' : 'denied'; }
  function apply(p, mode) {
    gtag('consent', mode, { functionality_storage: g(!p || p.functional), analytics_storage: g(p && p.analytics), ad_storage: g(p && p.advertising), ad_user_data: g(p && p.advertising), ad_personalization: g(p && p.advertising), security_storage: 'granted' });
    window.ksCookiePrefs = p;
  }
  apply(prefs, 'default');
  function save(p) {
    p.at = new Date().toISOString();
    try { localStorage.setItem(KEY, JSON.stringify(p)); } catch (e) {}
    apply(p, 'update');
    try { window.dispatchEvent(new CustomEvent('ks-cookie-consent', { detail: p })); } catch (e) {}
  }
  var inFrame = false; try { inFrame = window.top !== window.self; } catch (e) { inFrame = true; }
  var Z = 2147483008;
  function btn(label, solid) {
    var b = document.createElement('button');
    b.type = 'button';
    b.textContent = label;
    var on = function (fill) { b.style.background = fill ? '#1a1a1a' : '#ffffff'; b.style.color = fill ? '#ffffff' : '#1a1a1a'; b.style.boxShadow = 'none'; };
    b.style.cssText = 'min-height:46px;padding:0 24px;border:1px solid ' + (solid ? '#1a1a1a' : '#d6d6d6') + ';border-radius:0;font:600 13px ' + FONT + ';letter-spacing:-0.01em;cursor:pointer;white-space:nowrap;transition:background-color .25s ease,color .25s ease,border-color .25s ease,box-shadow .25s ease;';
    on(solid);
    b.addEventListener('mouseenter', function () { on(!solid); b.style.borderColor = '#1a1a1a'; });
    b.addEventListener('mouseleave', function () { on(solid); b.style.borderColor = solid ? '#1a1a1a' : '#d6d6d6'; });
    return b;
  }
  var bar = null;
  function fadeOut(el, cb) { el.style.opacity = '0'; setTimeout(function () { el.remove(); if (cb) cb(); }, 420); }
  function placeBar() {
    if (!bar) return;
    var sb = document.getElementById('hero-search-bar'), off = 0;
    if (sb) { var r = sb.getBoundingClientRect(); if (r.height && r.top < window.innerHeight) off = Math.round(window.innerHeight - r.top); }
    bar.style.bottom = off + 'px';
    var top = Z;
    Array.prototype.forEach.call(document.querySelectorAll('body > iframe, body > div'), function (el) {
      if (el === bar) return;
      var cs = getComputedStyle(el);
      if (cs.position !== 'fixed' || cs.display === 'none' || cs.visibility === 'hidden') return;
      var z = parseInt(cs.zIndex, 10) || 0;
      if (z >= top && z < 2147483500 && el.offsetWidth > window.innerWidth * 0.6 && el.offsetHeight > window.innerHeight * 0.6) top = z + 1;
    });
    if (String(bar.style.zIndex) !== String(top)) bar.style.zIndex = top;
  }
  function showBar() {
    if (inFrame) {
      var topOk = false;
      try { topOk = !!(window.top.ksOpenCookieSettings); } catch (e) {}
      if (topOk) return;
    }
    if (bar || document.getElementById('ks-pref-panel')) return;
    bar = document.createElement('div');
    bar.id = 'ks-pref-panel';
    bar.setAttribute('role', 'region');
    bar.setAttribute('aria-label', 'Privacy choices');
    bar.style.cssText = 'position:fixed;left:0;right:0;bottom:0;z-index:' + Z + ';background:#ffffff;box-shadow:0 -8px 30px rgba(0,0,0,0.12);font-family:' + FONT + ';letter-spacing:-0.01em;color:#1a1a1a;opacity:0;transform:translateY(16px);transition:opacity .45s ease,transform .45s ease;';
    var inner = document.createElement('div');
    inner.id = 'ks-pref-inner';
    inner.style.cssText = 'max-width:1600px;margin:0 auto;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:18px 40px;box-sizing:border-box;';
    if (!document.getElementById('ks-pref-css')) {
      var cs = document.createElement('style');
      cs.id = 'ks-pref-css';
      cs.textContent = '#ks-pref-inner{padding:22px 112px;}@media (max-width:700px){#ks-pref-inner{padding:20px 20px 92px;}}';
      document.head.appendChild(cs);
    }
    var txt = document.createElement('div');
    txt.style.cssText = 'flex:1 1 520px;min-width:0;';
    txt.innerHTML = '<h2 style="margin:0 0 8px;font:700 22px ' + FONT + ';letter-spacing:-0.01em;color:#1a1a1a;">We value your privacy</h2>'
      + '<p style="margin:0;font:500 13px/1.6 ' + FONT + ';letter-spacing:-0.01em;color:#444444;">We use cookies and similar technologies to run this site, remember your preferences, and understand how the site is used. You can accept all, or reject everything that isn\'t required to make the site work. <a href="https://jacksonkesecker.com/privacy/" style="color:#1a1a1a;text-decoration:underline;">Privacy Policy</a></p>';
    var acts = document.createElement('div');
    acts.style.cssText = 'display:flex;flex-wrap:wrap;gap:12px;flex:0 0 auto;';
    var rej = btn('Reject Non-Essential', false), acc = btn('Accept All', true);
    rej.addEventListener('click', function () { save({ functional: false, analytics: false, advertising: false }); closeBar(); });
    acc.addEventListener('click', function () { save({ functional: true, analytics: true, advertising: true }); closeBar(); });
    acts.appendChild(rej); acts.appendChild(acc);
    inner.appendChild(txt); inner.appendChild(acts); bar.appendChild(inner);
    document.body.appendChild(bar);
    placeBar();
    window.addEventListener('resize', placeBar);
    window.addEventListener('scroll', placeBar, { passive: true });
    bar.__ksT = setInterval(placeBar, 700);
    requestAnimationFrame(function () { requestAnimationFrame(function () { bar.style.opacity = '1'; bar.style.transform = 'translateY(0)'; }); });
  }
  function closeBar() { if (!bar) return; clearInterval(bar.__ksT); var b = bar; bar = null; b.style.transform = 'translateY(16px)'; fadeOut(b); }
  window.ksOpenCookieSettings = function () {
    if (inFrame) { try { if (window.top.ksOpenCookieSettings) { window.top.ksOpenCookieSettings(); return; } } catch (e) {} }
    try { localStorage.removeItem(KEY); } catch (e) {}
    prefs = null;
    if (document.body) showBar(); else document.addEventListener('DOMContentLoaded', showBar);
  };
  var isPrefLink = function (el) { return el && el.tagName === 'A' && /#cookie-preferences$/.test(el.getAttribute('href') || ''); };
  var onPrefClick = function (e) {
    var path = e.composedPath ? e.composedPath() : [e.target];
    for (var i = 0; i < path.length; i++) {
      if (isPrefLink(path[i])) { e.preventDefault(); e.stopImmediatePropagation(); window.ksOpenCookieSettings(); return; }
    }
  };
  window.addEventListener('click', onPrefClick, true);
  var whenBody = function (fn) { if (document.body) fn(); else document.addEventListener('DOMContentLoaded', fn); };
  var fromHash = function () {
    if (location.hash !== '#cookie-preferences') return;
    whenBody(function () {
      window.ksOpenCookieSettings();
      try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {}
    });
  };
  window.addEventListener('hashchange', fromHash);
  fromHash();
  if (prefs) return;
  function start() {
    var intro = function () { return document.querySelector('[style*="z-index: 2147483600"]'); };
    var t0 = Date.now();
    (function wait() { if (intro() && Date.now() - t0 < 20000) { setTimeout(wait, 400); return; } setTimeout(showBar, 900); })();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
