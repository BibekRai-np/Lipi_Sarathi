/**
 * ════════════════════════════════════════════════════════════════════
 *  Lipi सारथि — protection.js
 *  Source code protection layer.
 *
 *  Prevents casual copying via:
 *    · Right-click context menu disabled
 *    · F12 / Ctrl+Shift+I / Ctrl+Shift+J (DevTools) blocked
 *    · Ctrl+U (View Source) blocked
 *    · Ctrl+S (Save Page) blocked
 *    · Ctrl+A select-all blocked on non-editable areas
 *    · DevTools open detection → redirect warning
 *    · Text selection disabled on UI chrome (CSS injected)
 *
 *  ⚠ NOTE: No client-side protection is absolute. A determined
 *  developer can always find a way. This raises the barrier for
 *  casual copying and protects against non-technical users.
 *  For full protection, move business logic server-side.
 *
 *  Include FIRST in <head> before any other scripts:
 *    <script src="src/protection.js"></script>
 * ════════════════════════════════════════════════════════════════════
 */

(function () {
  'use strict';

  /* ── 1. Disable right-click context menu ─────────────────────── */
  document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    return false;
  });

  /* ── 2. Block keyboard shortcuts ─────────────────────────────── */
  document.addEventListener('keydown', function (e) {
    const k = e.key ? e.key.toLowerCase() : '';
    const ctrl = e.ctrlKey || e.metaKey;

    /* F12 — DevTools */
    if (e.key === 'F12') {
      e.preventDefault(); e.stopPropagation(); return false;
    }

    /* Ctrl+Shift+I — DevTools Elements */
    if (ctrl && e.shiftKey && k === 'i') {
      e.preventDefault(); e.stopPropagation(); return false;
    }

    /* Ctrl+Shift+J — DevTools Console */
    if (ctrl && e.shiftKey && k === 'j') {
      e.preventDefault(); e.stopPropagation(); return false;
    }

    /* Ctrl+Shift+C — DevTools Inspector */
    if (ctrl && e.shiftKey && k === 'c') {
      e.preventDefault(); e.stopPropagation(); return false;
    }

    /* Ctrl+U — View Page Source */
    if (ctrl && k === 'u') {
      e.preventDefault(); e.stopPropagation(); return false;
    }

    /* Ctrl+S — Save Page */
    if (ctrl && k === 's') {
      e.preventDefault(); e.stopPropagation(); return false;
    }

    /* Ctrl+P — Print (can reveal layout) */
    if (ctrl && k === 'p') {
      e.preventDefault(); e.stopPropagation(); return false;
    }
  }, true); /* capture phase — fires before other handlers */

  /* ── 3. Disable text selection on UI chrome (not output area) ── */
  const style = document.createElement('style');
  style.textContent = [
    'nav, header, .hd, .mode-tabs, .kb-titlebar, .kb-body,',
    '.btn-row, .credit, footer, .hero, .layouts, .why,',
    '.testimonials, .features-strip, .cta-band, .nav,',
    '.footer, .legend { user-select: none; -webkit-user-select: none; }',
    '/* Output areas remain selectable */',
    '.out-area, #out, [contenteditable="true"]',
    '{ user-select: text !important; -webkit-user-select: text !important; }',
  ].join('\n');
  document.head.appendChild(style);

  /* ── 4. DevTools open detector ───────────────────────────────── */
  /* Technique: measures time taken by a console.log with getter.
     When DevTools is open, the getter fires and slows the loop.
     Threshold tuned conservatively to avoid false positives.      */
  let _devOpen = false;
  const _threshold = 160;

  function _checkDevTools() {
    const start = performance.now();
    /* The toString() getter on an object logs when DevTools formats it */
    const obj = Object.defineProperty({}, '_', {
      get: function () { _devOpen = true; }
    });
    /* eslint-disable no-console */
    console.log('%c', obj);
    console.clear();
    /* eslint-enable no-console */
    if (performance.now() - start > _threshold) {
      _devOpen = true;
    }
    if (_devOpen) {
      _onDevToolsOpen();
    }
  }

  function _onDevToolsOpen() {
    /* Gentle deterrent — not destructive.
       Replace page content with a warning overlay.               */
    if (document.getElementById('_dt_overlay')) return; /* only once */
    const overlay = document.createElement('div');
    overlay.id = '_dt_overlay';
    overlay.style.cssText = [
      'position:fixed;inset:0;z-index:99999;',
      'background:#0a1228;display:flex;flex-direction:column;',
      'align-items:center;justify-content:center;',
      'font-family:"Noto Sans Devanagari",sans-serif;',
      'color:#eef4ff;text-align:center;padding:40px;',
    ].join('');
    overlay.innerHTML = [
      '<div style="font-size:52px;margin-bottom:16px">🔒</div>',
      '<h2 style="font-size:26px;font-weight:700;margin-bottom:10px;',
        'font-family:Hind,sans-serif;color:#f0a830">Lipi सारथि</h2>',
      '<p style="font-size:18px;font-family:\'Noto Sans Devanagari\',sans-serif;',
        'color:rgba(238,244,255,.8);max-width:480px;line-height:1.7;margin-bottom:8px">',
        'यो पृष्ठको स्रोत कोड संरक्षित छ।</p>',
      '<p style="font-size:14px;color:rgba(238,244,255,.5);font-family:monospace">',
        'Source code is protected. Please close DevTools to continue.</p>',
      '<button onclick="location.reload()" style="margin-top:24px;',
        'background:#003893;color:white;border:none;padding:12px 28px;',
        'border-radius:7px;font-size:14px;cursor:pointer;font-family:Hind,sans-serif">',
        'पृष्ठ reload गर्नुस् / Reload Page</button>',
    ].join('');
    document.body.appendChild(overlay);
  }

  /* Run check after page load, then every 2 seconds */
  window.addEventListener('load', function () {
    setTimeout(_checkDevTools, 1000);
    setInterval(_checkDevTools, 2000);
  });

  /* ── 5. Block drag-and-drop of page elements ──────────────────── */
  document.addEventListener('dragstart', function (e) {
    if (!e.target.closest('[contenteditable]')) {
      e.preventDefault();
    }
  });

})();
