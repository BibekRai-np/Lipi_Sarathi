/**
 * ════════════════════════════════════════════════════════════════════
 *  Lipi सारथि — engine-romanized.js
 *  Romanized (phonetic) Nepali keyboard engine (romanized.html)
 *
 *  LAYOUT: Phonetic transliteration
 *    Roman key input → Devanagari Unicode output.
 *    Familiar for users who think in Nepali sound, type in English.
 *
 *  PHONETIC RULES (selected):
 *    k  → क    K (Shift) → ख    g  → ग    G → घ
 *    c  → छ    C         → च    j  → ज    J → झ
 *    t  → त    T         → थ    d  → द    D → ध
 *    a  → ा    A         → आ    i  → ि    I → ी
 *    u  → ु    U         → ू    e  → े    E → ै
 *    /  → ् (halant — joins consonants, e.g. k+/+t → क्त)
 *    .  → ।    >         → ॥
 *    M (Shift+m) → ं (anusvara)
 *    V (Shift+v) → ँ (chandrabindu)
 *    \ → ः (visarga)
 *
 *  EXAMPLE:
 *    k + i + M + k + r + / + t + v + / + y → किंकर्तव्य
 *
 *  INCLUDED BY: romanized.html
 *  AUTHOR: Bibek Rai
 *  VERSION: 1.3.0
 * ════════════════════════════════════════════════════════════════════
 */

/*
 * ════════════════════════════════════════════════════════════════════
 *  NEPALI UNICODE KEYBOARD — ROMANIZED LAYOUT
 *  Mapping extracted from: romanized-nepali-unicode-keyboard-layout.svg
 *
 *  Each key object:
 *    code  = KeyboardEvent.code
 *    n     = normal character (no shift)
 *    s     = shift character
 *    lbl   = ASCII label hint shown in corner
 *    fn    = special function name
 *    w     = width in keyboard units (default 1)
 *
 *  SVG layout rule:
 *    top tspan   = SHIFT layer   → gold
 *    lower tspan = NORMAL layer  → white
 *
 *  Row widths all total 15u so every row is exactly the same width:
 *    Row 0: 13×1u + 2u(BS)                    = 15u
 *    Row 1: 1.5u(Tab) + 12×1u + 1.5u(\)       = 15u
 *    Row 2: 1.75u(Caps) + 11×1u + 2.25u(Enter)= 15u
 *    Row 3: 2.25u(LShift) + 10×1u + 2.75u(RS) = 15u
 *    Row 4: 1.5+1.25+7.5+1.25+1.5             = 13u (flex-grow on space)
 * ════════════════════════════════════════════════════════════════════
 */

/* Devanagari combining characters — shown on key with ◌ prefix */
const COMBINING = new Set([
  '\u093E','\u093F','\u0940','\u0941','\u0942','\u0943',
  '\u0947','\u0948','\u094B','\u094C','\u0902','\u0901',
  '\u094D','\u0952','\u093C',
]);

/*
 * KEY_ROWS — exact mapping from the SVG.
 * w = width in keyboard units (1u default).
 * fn = functional key behaviour.
 */
const KEY_ROWS = [
  /* ── Row 0 : number row ────────────────────────────────────── */
  [
    {code:'Backquote',   n:'ऽ',      s:'़',       lbl:'`'  },
    {code:'Digit1',      n:'१',      s:'!',        lbl:'1'  },
    {code:'Digit2',      n:'२',      s:'@',        lbl:'2'  },
    {code:'Digit3',      n:'३',      s:'#',        lbl:'3'  },
    {code:'Digit4',      n:'४',      s:'$',        lbl:'4'  },
    {code:'Digit5',      n:'५',      s:'%',        lbl:'5'  },
    {code:'Digit6',      n:'६',      s:'^',        lbl:'6'  },
    {code:'Digit7',      n:'७',      s:'&',        lbl:'7'  },
    {code:'Digit8',      n:'८',      s:'*',        lbl:'8'  },
    {code:'Digit9',      n:'९',      s:'(',        lbl:'9'  },
    {code:'Digit0',      n:'०',      s:')',        lbl:'0'  },
    {code:'Minus',       n:'-',      s:'॒',        lbl:'-'  },
    {code:'Equal',       n:'\u200D', s:'\u200C',   lbl:'='  },  /* ZWJ / ZWNJ */
    {code:'Backspace',   n:null,     s:null,       lbl:'⌫', fn:'backspace', w:2},
  ],

  /* ── Row 1 : QWERTY ─────────────────────────────────────────── */
  [
    {code:'Tab',         n:null,     s:null,       lbl:'Tab',  fn:'tab', w:1.5},
    {code:'KeyQ',        n:'ट',      s:'ठ',        lbl:'q'  },
    {code:'KeyW',        n:'ौ',      s:'औ',       lbl:'w'  },
    {code:'KeyE',        n:'े',      s:'ै',        lbl:'e'  },
    {code:'KeyR',        n:'र',      s:'ृ',        lbl:'r'  },
    {code:'KeyT',        n:'त',      s:'थ',        lbl:'t'  },
    {code:'KeyY',        n:'य',      s:'ञ',        lbl:'y'  },
    {code:'KeyU',        n:'ु',      s:'ू',        lbl:'u'  },
    {code:'KeyI',        n:'ि',      s:'ी',        lbl:'i'  },
    {code:'KeyO',        n:'ो',      s:'ओ',       lbl:'o'  },
    {code:'KeyP',        n:'प',      s:'फ',        lbl:'p'  },
    {code:'BracketLeft', n:'इ',      s:'ई',        lbl:'['  },
    {code:'BracketRight',n:'ए',      s:'ऐ',        lbl:']'  },
    {code:'Backslash',   n:'ः',      s:'ॐ',        lbl:'\\', w:1.5},
  ],

  /* ── Row 2 : ASDF ───────────────────────────────────────────── */
  [
    {code:'CapsLock',    n:null,     s:null,       lbl:'Caps', fn:'caps',  w:1.75},
    {code:'KeyA',        n:'ा',      s:'आ',        lbl:'a'  },
    {code:'KeyS',        n:'स',      s:'श',        lbl:'s'  },
    {code:'KeyD',        n:'द',      s:'ध',        lbl:'d'  },
    {code:'KeyF',        n:'उ',      s:'ऊ',        lbl:'f'  },
    {code:'KeyG',        n:'ग',      s:'घ',        lbl:'g'  },
    {code:'KeyH',        n:'ह',      s:'अ',        lbl:'h'  },
    {code:'KeyJ',        n:'ज',      s:'झ',        lbl:'j'  },
    {code:'KeyK',        n:'क',      s:'ख',        lbl:'k'  },
    {code:'KeyL',        n:'ल',      s:'ळ',        lbl:'l'  },
    {code:'Semicolon',   n:';',      s:':',        lbl:';'  },
    {code:'Quote',       n:"'",      s:'"',        lbl:"'"  },
    {code:'Enter',       n:'\n',     s:'\n',       lbl:'↵',  fn:'enter', w:2.25},
  ],

  /* ── Row 3 : ZXCV ───────────────────────────────────────────── */
  [
    {code:'ShiftLeft',   n:null,     s:null,       lbl:'Shift', fn:'shift', w:2.25},
    {code:'KeyZ',        n:'ष',      s:'ऋ',        lbl:'z'  },
    {code:'KeyX',        n:'ड',      s:'ढ',        lbl:'x'  },
    {code:'KeyC',        n:'छ',      s:'च',        lbl:'c'  },
    {code:'KeyV',        n:'व',      s:'ँ',        lbl:'v'  },
    {code:'KeyB',        n:'ब',      s:'भ',        lbl:'b'  },
    {code:'KeyN',        n:'न',      s:'ण',        lbl:'n'  },
    {code:'KeyM',        n:'म',      s:'ं',        lbl:'m'  },
    {code:'Comma',       n:',',      s:'ङ',        lbl:','  },
    {code:'Period',      n:'।',      s:'॥',        lbl:'.'  },
    {code:'Slash',       n:'्',      s:'?',        lbl:'/'  },
    {code:'ShiftRight',  n:null,     s:null,       lbl:'Shift', fn:'shift', w:2.75},
  ],

  /* ── Row 4 : Space bar row ──────────────────────────────────── */
  [
    {code:'ControlLeft',  n:null, s:null, lbl:'Ctrl',  fn:'noop', w:1.5 },
    {code:'AltLeft',      n:null, s:null, lbl:'Alt',   fn:'noop', w:1.25},
    {code:'Space',        n:' ',  s:' ',  lbl:'Space', fn:'space', w:7.5},
    {code:'AltRight',     n:null, s:null, lbl:'Alt',   fn:'noop', w:1.25},
    {code:'ControlRight', n:null, s:null, lbl:'Ctrl',  fn:'noop', w:1.5 },
  ],
];

/* ── State ───────────────────────────────────────────────────────── */
let shiftActive = false;
let capsLock    = false;

/* ── DOM refs ────────────────────────────────────────────────────── */
const out    = document.getElementById('out');
const pShift = document.getElementById('pShift');
const pCaps  = document.getElementById('pCaps');
const kbBody = document.getElementById('kbBody');
const kbRows = document.getElementById('kbRows');

/* ════════════════════════════════════════════════════════════════════
   BUILD KEYBOARD DOM
════════════════════════════════════════════════════════════════════ */
function buildKeyboard() {
  kbRows.innerHTML = '';

  KEY_ROWS.forEach(row => {
    const rowEl = document.createElement('div');
    rowEl.className = 'kb-row';

    row.forEach(k => {
      const keyEl = document.createElement('div');
      keyEl.className = 'key';
      if (k.fn) keyEl.classList.add('key-fn');
      keyEl.dataset.code = k.code;

      /* Responsive width via CSS custom property */
      keyEl.style.setProperty('--kw', k.w || 1);

      if (k.code === 'Space') {
        /* Space: just show centered label */
        const sp = document.createElement('div');
        sp.className = 'sp-lbl';
        sp.textContent = k.lbl;
        keyEl.appendChild(sp);

      } else if (k.fn) {
        /* All other functional keys: centred text label */
        const lbl = document.createElement('div');
        lbl.className = 'fn-lbl';
        lbl.textContent = k.lbl || '';
        keyEl.appendChild(lbl);

      } else {
        /* Character keys: shift char on top, normal char on bottom */
        const ks = document.createElement('div');
        ks.className = 'ks';
        ks.textContent = dispChar(k.s);

        const kn = document.createElement('div');
        kn.className = 'kn';
        kn.textContent = dispChar(k.n);

        const kh = document.createElement('div');
        kh.className = 'kh';
        kh.textContent = k.lbl || '';

        keyEl.appendChild(ks);
        keyEl.appendChild(kn);
        keyEl.appendChild(kh);
      }

      /* Mouse click → insert character */
      keyEl.addEventListener('mousedown', e => {
        e.preventDefault(); // keep focus on output area
        activateKey(k, keyEl);
      });

      rowEl.appendChild(keyEl);
    });

    kbRows.appendChild(rowEl);
  });
}

/* Combining characters get dotted circle prefix so they render visibly */
function dispChar(ch) {
  if (!ch) return '';
  if (ch === '\u200D') return 'ZWJ';
  if (ch === '\u200C') return 'ZWNJ';
  if (COMBINING.has(ch)) return '\u25CC' + ch;
  return ch;
}

/* ════════════════════════════════════════════════════════════════════
   KEY ACTIVATION
   Single code path shared by mouse clicks AND physical keyboard input.
════════════════════════════════════════════════════════════════════ */
function activateKey(k, keyEl) {
  out.focus();

  switch (k.fn) {
    case 'shift':     toggleShift(); return;
    case 'caps':      toggleCaps();  return;
    case 'backspace': doBackspace(); if (keyEl) flashKey(keyEl); return;
    case 'enter':     insertText('\n'); if (keyEl) flashKey(keyEl); return;
    case 'tab':       insertText('  '); if (keyEl) flashKey(keyEl); return;
    case 'space':     insertText(' ');  if (keyEl) flashKey(keyEl); return;
    case 'noop':      if (keyEl) flashKey(keyEl); return;
    default: {
      /* Character key: pick shift or normal layer */
      const isAlpha = k.code.startsWith('Key');
      /* CapsLock XOR Shift for alpha keys; only Shift for symbols/digits */
      const useShift = isAlpha ? (shiftActive !== capsLock) : shiftActive;
      const ch = useShift ? k.s : k.n;
      if (ch) insertText(ch);
      /* Auto-release shift after one character (sticky-shift behaviour) */
      if (shiftActive) { shiftActive = false; syncVisuals(); }
      if (keyEl) flashKey(keyEl);
    }
  }
}

/* ── Insert text at current cursor in the contenteditable div ────── */
function insertText(ch) {
  const sel = window.getSelection();
  if (!sel || !sel.rangeCount) {
    out.textContent += ch;
    moveCursorEnd();
    return;
  }
  const range = sel.getRangeAt(0);
  range.deleteContents();
  const node = document.createTextNode(ch);
  range.insertNode(node);
  range.setStartAfter(node);
  range.collapse(true);
  sel.removeAllRanges();
  sel.addRange(range);
}

/* ── Backspace ───────────────────────────────────────────────────── */
function doBackspace() {
  out.focus();
  const sel = window.getSelection();
  if (!sel || !sel.rangeCount) return;
  const rng = sel.getRangeAt(0);
  if (!rng.collapsed) { rng.deleteContents(); return; }
  document.execCommand('delete');
}

/* ── Clear / Copy ────────────────────────────────────────────────── */
function clearText() { out.textContent = ''; out.focus(); }

async function copyText() {
  const txt = out.textContent || out.innerText || '';
  if (!txt) return;
  try { await navigator.clipboard.writeText(txt); }
  catch {
    const r = document.createRange();
    r.selectNodeContents(out);
    const s = window.getSelection();
    s.removeAllRanges(); s.addRange(r);
    document.execCommand('copy');
  }
  const el = document.getElementById('copied');
  el.classList.add('on');
  setTimeout(() => el.classList.remove('on'), 2000);
}

/* ── Shift / Caps ────────────────────────────────────────────────── */
function toggleShift() { shiftActive = !shiftActive; syncVisuals(); }
function toggleCaps()  { capsLock    = !capsLock;    syncVisuals(); }

function syncVisuals() {
  pShift.classList.toggle('shift-on', shiftActive);
  pCaps.classList.toggle('caps-on',   capsLock);
  /* Swap key face prominence so shift chars look "primary" when shift active */
  kbBody.classList.toggle('shift-live', shiftActive || capsLock);

  const capsEl = kbRows.querySelector('[data-code="CapsLock"]');
  if (capsEl) capsEl.classList.toggle('caps-lit', capsLock);

  kbRows.querySelectorAll('[data-code="ShiftLeft"],[data-code="ShiftRight"]')
        .forEach(el => el.classList.toggle('shift-lit', shiftActive));
}

/* ── Visual flash ────────────────────────────────────────────────── */
function flashKey(el) {
  el.classList.add('pressed');
  setTimeout(() => el.classList.remove('pressed'), 160);
}

function moveCursorEnd() {
  const r = document.createRange(), s = window.getSelection();
  r.selectNodeContents(out); r.collapse(false);
  s.removeAllRanges(); s.addRange(r);
}

/* ════════════════════════════════════════════════════════════════════
   PHYSICAL KEYBOARD HANDLER
   Intercepts keydown, highlights the matching on-screen key,
   and routes through the same activateKey() path as mouse clicks.
════════════════════════════════════════════════════════════════════ */
document.addEventListener('keydown', e => {
  if (e.ctrlKey || e.metaKey) return; // pass through browser shortcuts

  if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
    if (!shiftActive) { shiftActive = true; syncVisuals(); }
    return;
  }

  if (e.code === 'CapsLock') { e.preventDefault(); toggleCaps(); return; }

  if (document.activeElement !== out) return;

  const kDef = findKey(e.code);
  if (!kDef) return;

  /* Backspace: let browser handle deletion natively, just flash the key */
  if (e.code === 'Backspace') {
    const el = kbRows.querySelector('[data-code="Backspace"]');
    if (el) flashKey(el);
    return; // no preventDefault — native backspace works in contenteditable
  }

  e.preventDefault(); // intercept all other keys

  const el = kbRows.querySelector(`[data-code="${e.code}"]`);
  activateKey(kDef, el);
});

/* Release shift on key-up */
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

/* Block browser's own character insertion in the output div.
   Our keydown handler on document handles insertion instead. */
out.addEventListener('keydown', e => {
  const passThrough = ['Backspace','Delete','ArrowLeft','ArrowRight',
                       'ArrowUp','ArrowDown','Home','End','PageUp','PageDown'];
  if (e.ctrlKey || e.metaKey) return;
  if (passThrough.includes(e.key)) return;
  e.preventDefault();
});

/* ── Init ────────────────────────────────────────────────────────── */
buildKeyboard();
out.focus();