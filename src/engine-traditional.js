/**
 * ════════════════════════════════════════════════════════════════════
 *  Lipi सारथि — engine-traditional.js
 *  Traditional Nepali keyboard engine (traditional.html)
 *
 *  LAYOUT: ne-trad-ttf 1.1 (by sapradhan)
 *    Direct fixed mapping — every physical key → one Devanagari char.
 *    This is the layout tested in Nepal Public Service Commission exams.
 *    Identical to Preeti/Sagarmatha muscle memory for existing users.
 *
 *  KEY FEATURES:
 *    · buildKeyboard()  — builds DOM rows from KEY_ROWS data array
 *    · activateKey()    — shared path for mouse clicks + physical keys
 *    · Shift layer shown in gold (top-left of each key face)
 *    · Combining marks rendered with ◌ (U+25CC) prefix on key face
 *    · CapsLock applies to ALL keys for virtual clicks (mouse)
 *    · CapsLock applies to alpha-only for physical keyboard (standard)
 *
 *  KEY_ROWS FORMAT:
 *    { code, n, s, lbl, fn?, w? }
 *      code — KeyboardEvent.code
 *      n    — normal layer character
 *      s    — shift layer character
 *      lbl  — display label (for QWERTY reference)
 *      fn   — functional type: backspace|tab|caps|shift|enter|space|noop
 *      w    — width in keyboard units (default 1)
 *
 *  ROW WIDTHS (all = 15u):
 *    Row 0 : 13×1u + BS(2u) = 15u
 *    Row 1 : Tab(1.5u) + 12×1u + \(1.5u) = 15u
 *    Row 2 : Caps(1.75u) + 11×1u + Enter(2.25u) = 15u
 *    Row 3 : LShift(2.25u) + 10×1u + RShift(2.75u) = 15u
 *    Row 4 : Ctrl(1.5)+Win(1.25)+Alt(1.25)+Space(6.75)+...  = 15u
 *
 *  COMBINED CHARS (shown with ◌ prefix on key face):
 *    U+093E ा  U+093F ि  U+0940 ी  U+0941 ु  U+0942 ू
 *    U+0943 ृ  U+0947 े  U+0948 ै  U+094B ो  U+094C ौ
 *    U+0902 ं  U+0901 ँ  U+094D ् (halant)
 *
 *  INCLUDED BY: traditional.html
 *  LAYOUT SOURCE: https://github.com/sapradhan/ne-trad-ttf
 *  AUTHOR: Bibek Rai
 *  VERSION: 1.3.0
 * ════════════════════════════════════════════════════════════════════
 */

/*
     * ════════════════════════════════════════════════════════════════════
     *  TRADITIONAL NEPALI UNICODE KEYBOARD — ne-trad-ttf 1.1
     *  Mapping from: Nepali_unicode_traditional_keyboard_layout.svg
     *
     *  Fixed direct-key layout — no transliteration.
     *  Each physical key maps to exactly one Devanagari character.
     *
     *  Row widths (all = 15u so rows are pixel-perfect aligned):
     *    Row 0 : ` 1 2 3 4 5 6 7 8 9 0 - = (13×1u) + BS(2u)   = 15u
     *    Row 1 : Tab(1.5u) + q…] (12×1u) + \(1.5u)            = 15u
     *    Row 2 : Caps(1.75u) + a…' (11×1u) + Enter(2.25u)     = 15u
     *    Row 3 : LShift(2.25u) + z…/ (10×1u) + RShift(2.75u)  = 15u
     *    Row 4 : Ctrl(1.5)+Alt(1.25)+Space(7.5)+Alt(1.25)+Ctrl(1.5) = 13u
     * ════════════════════════════════════════════════════════════════════
     */

    /* Devanagari combining marks — rendered with ◌ prefix on key face */
    const COMBINING = new Set([
      '\u093E', '\u093F', '\u0940', '\u0941', '\u0942', '\u0943',
      '\u0947', '\u0948', '\u094B', '\u094C', '\u0902', '\u0901',
      '\u094D', '\u093C', '\u0952',
    ]);

    const KEY_ROWS = [
      /* ── Row 0 : Number row — 13 × 1u + BS 2u = 15u ─────────── */
      [
        { code: 'Backquote', n: 'ञ', s: 'ऽ', lbl: '`' },
        { code: 'Digit1', n: '१', s: 'ज्ञ', lbl: '1' },
        { code: 'Digit2', n: '२', s: 'ई', lbl: '2' },
        { code: 'Digit3', n: '३', s: 'घ', lbl: '3' },
        { code: 'Digit4', n: '४', s: 'द्ध', lbl: '4' },
        { code: 'Digit5', n: '५', s: 'छ', lbl: '5' },
        { code: 'Digit6', n: '६', s: 'ट', lbl: '6' },
        { code: 'Digit7', n: '७', s: 'ठ', lbl: '7' },
        { code: 'Digit8', n: '८', s: 'ड', lbl: '8' },
        { code: 'Digit9', n: '९', s: 'ढ', lbl: '9' },
        { code: 'Digit0', n: '०', s: 'ण', lbl: '0' },
        { code: 'Minus', n: 'औ', s: 'ओ', lbl: '-' },
        { code: 'Equal', n: '.', s: 'ं', lbl: '=' },
        { code: 'Backspace', n: null, s: null, lbl: '⌫', fn: 'backspace', w: 2 },
      ],

      /* ── Row 1 : QWERTY — Tab 1.5u + 12×1u + \\ 1.5u = 15u ──── */
      [
        { code: 'Tab', n: null, s: null, lbl: 'Tab', fn: 'tab', w: 1.5 },
        { code: 'KeyQ', n: 'त्र', s: 'त्त', lbl: 'q' },
        { code: 'KeyW', n: 'ध', s: 'ध्', lbl: 'w' },
        { code: 'KeyE', n: 'भ', s: 'ऐ', lbl: 'e' },
        { code: 'KeyR', n: 'च', s: 'च्', lbl: 'r' },
        { code: 'KeyT', n: 'त', s: 'त्', lbl: 't' },
        { code: 'KeyY', n: 'थ', s: 'थ्', lbl: 'y' },
        { code: 'KeyU', n: 'ग', s: 'ऊ', lbl: 'u' },
        { code: 'KeyI', n: 'ष', s: 'क्ष', lbl: 'i' },
        { code: 'KeyO', n: 'य', s: 'इ', lbl: 'o' },
        { code: 'KeyP', n: 'उ', s: 'ए', lbl: 'p' },
        { code: 'BracketLeft', n: 'ृ', s: '', lbl: '[' },   /* [ dead on shift */
        { code: 'BracketRight', n: 'े', s: 'ै', lbl: ']' },
        /* Backslash: ् (halant) normal / ZWJ shifted */
        { code: 'Backslash', n: '्', s: '\u200D', lbl: '\\', w: 1.5 },
      ],

      /* ── Row 2 : ASDF — Caps 1.75u + 11×1u + Enter 2.25u = 15u  */
      [
        { code: 'CapsLock', n: null, s: null, lbl: 'Caps', fn: 'caps', w: 1.75 },
        { code: 'KeyA', n: 'ब', s: 'आ', lbl: 'a' },
        { code: 'KeyS', n: 'क', s: 'क्', lbl: 's' },
        { code: 'KeyD', n: 'म', s: 'म्', lbl: 'd' },
        { code: 'KeyF', n: 'ा', s: 'ँ', lbl: 'f' },
        { code: 'KeyG', n: 'न', s: 'न्', lbl: 'g' },
        { code: 'KeyH', n: 'ज', s: 'झ', lbl: 'h' },
        { code: 'KeyJ', n: 'व', s: 'ो', lbl: 'j' },
        { code: 'KeyK', n: 'प', s: 'फ', lbl: 'k' },
        { code: 'KeyL', n: 'ि', s: 'ी', lbl: 'l' },
        { code: 'Semicolon', n: 'स', s: 'स्', lbl: ';' },
        { code: 'Quote', n: 'ु', s: 'ू', lbl: "'" },
        { code: 'Enter', n: '\n', s: '\n', lbl: '↵', fn: 'enter', w: 2.25 },
      ],

      /* ── Row 3 : ZXCV — LShift 2.25u + 10×1u + RShift 2.75u = 15u */
      [
        { code: 'ShiftLeft', n: null, s: null, lbl: 'Shift', fn: 'shift', w: 2.25 },
        { code: 'KeyZ', n: 'श', s: 'श्', lbl: 'z' },
        { code: 'KeyX', n: 'ह', s: 'ह्', lbl: 'x' },
        { code: 'KeyC', n: 'अ', s: 'ऋ', lbl: 'c' },
        { code: 'KeyV', n: 'ख', s: 'ॐ', lbl: 'v' },
        { code: 'KeyB', n: 'द', s: 'ौ', lbl: 'b' },
        { code: 'KeyN', n: 'ल', s: 'ल्', lbl: 'n' },
        /* m: ZWNJ normal / ः (visarga) shifted */
        { code: 'KeyM', n: '\u200C', s: 'ः', lbl: 'm' },
        { code: 'Comma', n: ',', s: 'ङ', lbl: ',' },
        { code: 'Period', n: '।', s: 'श्र', lbl: '.' },
        { code: 'Slash', n: 'र', s: '?', lbl: '/' },
        { code: 'ShiftRight', n: null, s: null, lbl: 'Shift', fn: 'shift', w: 2.75 },
      ],

      /* ── Row 4 : Space bar row ──────────────────────────────────── */
      [
        { code: 'ControlLeft', n: null, s: null, lbl: 'Ctrl', fn: 'noop', w: 1.5 },
        { code: 'AltLeft', n: null, s: null, lbl: 'Alt', fn: 'noop', w: 1.25 },
        { code: 'Space', n: ' ', s: ' ', lbl: 'Space', fn: 'space', w: 7.5 },
        { code: 'AltRight', n: null, s: null, lbl: 'Alt', fn: 'noop', w: 1.25 },
        { code: 'ControlRight', n: null, s: null, lbl: 'Ctrl', fn: 'noop', w: 1.5 },
      ],
    ];

    /* ── State ─────────────────────────────────────────────────────── */
    let shiftActive = false;
    let capsLock = false;

    /* ── DOM refs ───────────────────────────────────────────────────── */
    const out = document.getElementById('out');
    const kbBody = document.getElementById('kbBody');
    const kbRows = document.getElementById('kbRows');
    const dotShift = document.getElementById('dotShift');
    const dotCaps = document.getElementById('dotCaps');
    const modeLabel = document.getElementById('modeLabel');
    const charCount = document.getElementById('charCount');

    /* ════════════════════════════════════════════════════════════════
       BUILD KEYBOARD DOM
    ════════════════════════════════════════════════════════════════ */
    function buildKeyboard() {
      kbRows.innerHTML = '';
      KEY_ROWS.forEach(row => {
        const rowEl = document.createElement('div');
        rowEl.className = 'kb-row';

        row.forEach(k => {
          const el = document.createElement('div');
          el.className = 'key';
          if (k.fn) el.classList.add('key-fn');
          el.dataset.code = k.code;
          el.style.setProperty('--kw', k.w || 1);

          if (k.code === 'Space') {
            const sp = document.createElement('div');
            sp.className = 'sp-lbl';
            sp.textContent = k.lbl;
            el.appendChild(sp);

          } else if (k.fn) {
            const lb = document.createElement('div');
            lb.className = 'fn-lbl';
            lb.textContent = k.lbl || '';
            el.appendChild(lb);

          } else {
            /* Character key: gold shift char on top, ice normal char on bottom */
            const ks = document.createElement('div');
            ks.className = 'ks';
            ks.textContent = dispChar(k.s);

            const kn = document.createElement('div');
            kn.className = 'kn';
            kn.textContent = dispChar(k.n);

            const kh = document.createElement('div');
            kh.className = 'kh';
            kh.textContent = k.lbl || '';

            el.appendChild(ks);
            el.appendChild(kn);
            el.appendChild(kh);
          }

          el.addEventListener('mousedown', e => {
            e.preventDefault();
            activateKey(k, el);
          });
          rowEl.appendChild(el);
        });
        kbRows.appendChild(rowEl);
      });
    }

    /* Combining chars get ◌ prefix so they render visibly on key face */
    function dispChar(ch) {
      if (!ch) return '';
      if (ch === '\u200D') return 'ZWJ';
      if (ch === '\u200C') return 'ZWNJ';
      if (COMBINING.has(ch)) return '\u25CC' + ch;
      return ch;
    }

    /* ════════════════════════════════════════════════════════════════
       KEY ACTIVATION — shared by mouse & physical keyboard
    ════════════════════════════════════════════════════════════════ */
    function activateKey(k, el) {
      out.focus();
      switch (k.fn) {
        case 'shift': toggleShift(); return;
        case 'caps': toggleCaps(); return;
        case 'backspace': doBackspace(); if (el) flashKey(el); return;
        case 'enter': insertText('\n'); if (el) flashKey(el); return;
        case 'tab': insertText('  '); if (el) flashKey(el); return;
        case 'space': insertText(' '); if (el) flashKey(el); return;
        case 'noop': if (el) flashKey(el); return;
        default: {
          const isAlpha = k.code.startsWith('Key');
          const useShift = isAlpha ? (shiftActive !== capsLock) : shiftActive;
          const ch = useShift ? k.s : k.n;
          if (ch) insertText(ch);
          if (shiftActive) { shiftActive = false; syncVisuals(); }
          if (el) flashKey(el);
        }
      }
    }

    /* ── Text insertion ─────────────────────────────────────────────── */
    function insertText(ch) {
      const sel = window.getSelection();
      if (!sel || !sel.rangeCount) { out.textContent += ch; moveCursorEnd(); updateCount(); return; }
      const range = sel.getRangeAt(0);
      range.deleteContents();
      const node = document.createTextNode(ch);
      range.insertNode(node);
      range.setStartAfter(node); range.collapse(true);
      sel.removeAllRanges(); sel.addRange(range);
      updateCount();
    }

    function doBackspace() {
      out.focus();
      const sel = window.getSelection();
      if (!sel || !sel.rangeCount) return;
      const rng = sel.getRangeAt(0);
      if (!rng.collapsed) { rng.deleteContents(); updateCount(); return; }
      document.execCommand('delete');
      updateCount();
    }

    function clearText() { out.textContent = ''; out.focus(); updateCount(); }

    async function copyText() {
      const txt = out.textContent || '';
      if (!txt) return;
      try { await navigator.clipboard.writeText(txt); }
      catch {
        const r = document.createRange(); r.selectNodeContents(out);
        const s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
        document.execCommand('copy');
      }
      const t = document.getElementById('toast');
      t.classList.add('on');
      setTimeout(() => t.classList.remove('on'), 2500);
    }

    function updateCount() {
      const n = (out.textContent || '').replace(/\n/g, '').length;
      charCount.textContent = n + ' char' + (n !== 1 ? 's' : '');
    }

    /* ── Shift / Caps ──────────────────────────────────────────────── */
    function toggleShift() { shiftActive = !shiftActive; syncVisuals(); }
    function toggleCaps() { capsLock = !capsLock; syncVisuals(); }

    function syncVisuals() {
      dotShift.classList.toggle('on', shiftActive);
      dotCaps.classList.toggle('on', capsLock);
      modeLabel.textContent = shiftActive ? 'Shift' : capsLock ? 'Caps' : 'Normal';
      kbBody.classList.toggle('shift-live', shiftActive || capsLock);

      const cEl = kbRows.querySelector('[data-code="CapsLock"]');
      if (cEl) cEl.classList.toggle('caps-lit', capsLock);

      kbRows.querySelectorAll('[data-code="ShiftLeft"],[data-code="ShiftRight"]')
        .forEach(e => e.classList.toggle('shift-lit', shiftActive));
    }

    /* ── Flash ─────────────────────────────────────────────────────── */
    function flashKey(el) {
      el.classList.add('pressed');
      setTimeout(() => el.classList.remove('pressed'), 140);
    }

    function moveCursorEnd() {
      const r = document.createRange(), s = window.getSelection();
      r.selectNodeContents(out); r.collapse(false);
      s.removeAllRanges(); s.addRange(r);
    }

    /* ════════════════════════════════════════════════════════════════
       PHYSICAL KEYBOARD
    ════════════════════════════════════════════════════════════════ */
    document.addEventListener('keydown', e => {
      if (e.ctrlKey || e.metaKey) return;

      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        if (!shiftActive) { shiftActive = true; syncVisuals(); } return;
      }
      if (e.code === 'CapsLock') { e.preventDefault(); toggleCaps(); return; }
      if (document.activeElement !== out) return;

      const kDef = findKey(e.code);
      if (!kDef) return;

      if (e.code === 'Backspace') {
        const el = kbRows.querySelector('[data-code="Backspace"]');
        if (el) flashKey(el);
        updateCount(); return;
      }

      e.preventDefault();
      const el = kbRows.querySelector(`[data-code="${e.code}"]`);
      activateKey(kDef, el);
    });

    document.addEventListener('keyup', e => {
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        if (shiftActive) { shiftActive = false; syncVisuals(); }
      }
    });

    function findKey(code) {
      for (const row of KEY_ROWS)
        for (const k of row)
          if (k.code === code) return k;
      return null;
    }

    /* Block native char insertion in the output div */
    out.addEventListener('keydown', e => {
      const pass = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight',
        'ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown'];
      if (e.ctrlKey || e.metaKey) return;
      if (pass.includes(e.key)) return;
      e.preventDefault();
    });

    out.addEventListener('input', updateCount);

    /* ── Init ───────────────────────────────────────────────────────── */
    buildKeyboard();
    out.focus();