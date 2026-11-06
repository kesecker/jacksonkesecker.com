/* Page transitions for jacksonkesecker.com.
   - Opening a property or a listing from search ("entering"): fade to black, then the new page fades in from black.
   - The first page of a visit (except the home page, which has its own intro): fades in from black.
   - Every other page change: a quick soft fade (no black).
   Skipped for reduced-motion users, new tabs, modified clicks, downloads, phone/email links and same-page anchors. */
(function () {
  if (window.__ksTransitions) return; window.__ksTransitions = 1;
  var h = document.documentElement, ss;
  try { ss = window.sessionStorage; ss.getItem('x'); } catch (e) { ss = null; }
  var reduce = false; try { reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  var SITE = /(^|\.)jacksonkesecker\.com$/i, preview = /\.pages\.dev$/i.test(location.hostname);
  var css = document.createElement('style');
  css.setAttribute('data-ks-transitions', '');
  css.textContent =
    'html.ks-tr-black::after{content:"";position:fixed;inset:0;background:#000000;z-index:2147483550;pointer-events:none;opacity:1;transition:opacity .9s cubic-bezier(.4,0,.2,1)}' +
    'html.ks-tr-black.ks-tr-go::after{opacity:0}' +
    'html.ks-tr-soft{opacity:0}html.ks-tr-soft.ks-tr-go{opacity:1;transition:opacity .3s ease}' +
    'html.ks-tr-out{opacity:0!important;transition:opacity .2s ease!important}';
  (document.head || h).appendChild(css);

  function ready(fn) {
    var t0 = Date.now();
    (function wait() {
      var hasDc = !!document.querySelector('x-dc, #dc-root');
      if (!hasDc && document.readyState === 'loading') return requestAnimationFrame(wait);
      if (!hasDc || document.querySelector('#dc-root *') || Date.now() - t0 > 4000) requestAnimationFrame(function () { requestAnimationFrame(fn); });
      else requestAnimationFrame(wait);
    })();
  }
  function clear() { h.classList.remove('ks-tr-black', 'ks-tr-soft', 'ks-tr-go', 'ks-tr-out'); var o = document.getElementById('ks-tr-overlay'); if (o) o.remove(); }

  // ---- Arrival
  var isHome = location.pathname === '/' || location.pathname === '/index.html';
  var mode = '';
  if (ss && !reduce) {
    if (ss.getItem('ksFadeIn') === '1') { mode = 'black'; ss.removeItem('ksFadeIn'); }
    else if (ss.getItem('ksSoftIn') === '1') mode = 'soft';
    else if (!ss.getItem('ksVisited') && !isHome) mode = 'black';
    ss.removeItem('ksSoftIn'); ss.setItem('ksVisited', '1');
  }
  if (mode) {
    h.classList.add(mode === 'black' ? 'ks-tr-black' : 'ks-tr-soft');
    ready(function () { h.classList.add('ks-tr-go'); setTimeout(function () { h.classList.remove('ks-tr-black', 'ks-tr-soft', 'ks-tr-go'); }, 950); });
  }
  window.addEventListener('pageshow', function (e) { if (e.persisted) clear(); });

  // ---- Leaving
  function kindOf(u) {
    var p = u.pathname;
    if (/^\/admin(\/|$)/.test(p) || /\.(pdf|zip|jpe?g|png|webp|mp4|docx?|xlsx?)$/i.test(p)) return '';
    if (/^\/properties\/(?!template\/)[^/]+\/?$/.test(p) || /^\/listing\/?$/.test(p)) return 'black';
    return 'soft';
  }
  document.addEventListener('click', function (e) {
    if (reduce || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = null, path = e.composedPath ? e.composedPath() : [e.target];
    for (var i = 0; i < path.length; i++) { var n = path[i]; if (n && n.tagName === 'A' && n.hasAttribute && n.hasAttribute('href')) { a = n; break; } }
    if (!a || a.hasAttribute('download') || a.hasAttribute('data-ks-no-transition')) return;
    var tg = (a.getAttribute('target') || '').toLowerCase(); if (tg && tg !== '_self' && tg !== '_top') return;
    var raw = a.getAttribute('href') || ''; if (!raw || raw.charAt(0) === '#' || /^(mailto|tel|sms|javascript):/i.test(raw)) return;
    var u; try { u = new URL(a.href, location.href); } catch (err) { return; }
    var same = u.origin === location.origin;
    if (!same && SITE.test(u.hostname) && (preview || SITE.test(location.hostname))) { if (preview) { u = new URL(u.pathname + u.search + u.hash, location.origin); same = true; } else same = u.hostname === location.hostname; }
    if (!same) return;
    if (u.pathname === location.pathname && u.search === location.search) return;
    var kind = kindOf(u); if (!kind) return;
    e.preventDefault();
    var go = function () { window.location.href = u.href; };
    if (kind === 'black') {
      try { ss && ss.setItem('ksFadeIn', '1'); } catch (err) {}
      var ov = document.createElement('div'); ov.id = 'ks-tr-overlay'; ov.setAttribute('aria-hidden', 'true');
      ov.style.cssText = 'position:fixed;inset:0;background:#000000;z-index:2147483550;opacity:0;pointer-events:none;transition:opacity .45s cubic-bezier(.4,0,.2,1);';
      document.body.appendChild(ov); void ov.offsetWidth; ov.style.opacity = '1';
      setTimeout(go, 460);
    } else {
      try { ss && ss.setItem('ksSoftIn', '1'); } catch (err) {}
      h.classList.add('ks-tr-out');
      setTimeout(go, 200);
    }
  });
})();
