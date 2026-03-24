/**
 * ════════════════════════════════════════════════════════════════════
 *  Lipi सारथि — engine-english.js
 *  English QWERTY full keyboard engine (english.html)
 *
 *  LAYOUT: Standard US QWERTY + Full Numpad
 *    · Main keyboard: 5 rows (Fn row + number row + QWERTY + ASDF + ZXCV)
 *    · Space row: Ctrl · Win · Alt · Space(6.75u) · Alt · Menu · Ctrl
 *    · Numpad: 4 columns × 5 rows (CSS Grid)
 *      - Num+  spans rows 2–3 (column 4)
 *      - Enter spans rows 4–5 (column 4)
 *      - 0     spans columns 1–2 (row 5)
 *
 *  ROW WIDTHS (main block, all = 15u):
 *    Fn  : Esc + F1–F4 + [gap] + F5–F8 + [gap] + F9–F12 (flex)
 *    Row0: 13×1u + BS(2u) = 15u
 *    Row1: Tab(1.5u) + 12×1u + \(1.5u) = 15u
 *    Row2: Caps(1.75u) + 11×1u + Enter(2.25u) = 15u
 *    Row3: LShift(2.25u) + 10×1u + RShift(2.75u) = 15u
 *    Row4: Ctrl(1.5)+Win(1.25)+Alt(1.25)+Space(6.75)+...  = 15u
 *
 *  EXTRA FEATURES vs Nepali pages:
 *    · Num Lock toggle (default ON) — numpad activates number layer
 *    · Word + character counter (live)
 *    · Web Audio scissor-switch click sound
 *
 *  INCLUDED BY: english.html
 *  AUTHOR: Bibek Rai
 *  VERSION: 1.3.0
 * ════════════════════════════════════════════════════════════════════
 */

/*
 * ════════════════════════════════════════════════════════════════════
 *  ENGLISH QWERTY KEYBOARD — Full layout with numpad
 *  Theme: Warm Amber / Dark Oak  ·  Flat MacBook key profile
 *
 *  Key data fields:
 *    code   = KeyboardEvent.code
 *    n      = normal character
 *    s      = shift character
 *    lbl    = display label (shown in corner or as fn-lbl)
 *    fn     = functional type: backspace|tab|caps|shift|enter|space|noop
 *    w      = width in keyboard units (default 1)
 *
 *  Row widths (all = 15u):
 *    FnRow : Esc(flex) + F1-F4(flex) + sep + F5-F8(flex) + sep + F9-F12(flex) → flexible
 *    Row 0 : 13×1u + Backspace 2u       = 15u
 *    Row 1 : Tab 1.5u + 12×1u + \\ 1.5u = 15u
 *    Row 2 : Caps 1.75u + 11×1u + Enter 2.25u = 15u
 *    Row 3 : LShift 2.25u + 10×1u + RShift 2.75u = 15u
 *    Row 4 : Ctrl 1.25×3 + Win 1.25 + Alt 1.25 + Space 5.75 + Alt 1.25 + Menu 1.25 + Ctrl 1.25 = 15u
 *
 *  Numpad — CSS Grid 4×5 with row-spanning + and Enter:
 *    Cols: 4 × --ku  |  Rows: 5 × --kh
 *    +     spans rows 2–3 (col 4)
 *    Enter spans rows 4–5 (col 4)
 *    0     spans cols 1–2 (row 5)
 * ════════════════════════════════════════════════════════════════════
 */

/* ── Function row keys ────────────────────────────────────────── */
const FN_ROW = [
  {code:'Escape',      lbl:'Esc',  fn:'noop'},
  'sep',
  {code:'F1',  lbl:'F1',  fn:'noop'},{code:'F2', lbl:'F2', fn:'noop'},
  {code:'F3',  lbl:'F3',  fn:'noop'},{code:'F4', lbl:'F4', fn:'noop'},
  'sep',
  {code:'F5',  lbl:'F5',  fn:'noop'},{code:'F6', lbl:'F6', fn:'noop'},
  {code:'F7',  lbl:'F7',  fn:'noop'},{code:'F8', lbl:'F8', fn:'noop'},
  'sep',
  {code:'F9',  lbl:'F9',  fn:'noop'},{code:'F10',lbl:'F10',fn:'noop'},
  {code:'F11', lbl:'F11', fn:'noop'},{code:'F12',lbl:'F12',fn:'noop'},
];

/* ── Main keyboard rows ────────────────────────────────────────── */
const KEY_ROWS = [
  /* Row 0 — number row: 13×1u + BS 2u = 15u */
  [
    {code:'Backquote',    n:'`', s:'~',  lbl:'`' },
    {code:'Digit1',       n:'1', s:'!',  lbl:'1' },
    {code:'Digit2',       n:'2', s:'@',  lbl:'2' },
    {code:'Digit3',       n:'3', s:'#',  lbl:'3' },
    {code:'Digit4',       n:'4', s:'$',  lbl:'4' },
    {code:'Digit5',       n:'5', s:'%',  lbl:'5' },
    {code:'Digit6',       n:'6', s:'^',  lbl:'6' },
    {code:'Digit7',       n:'7', s:'&',  lbl:'7' },
    {code:'Digit8',       n:'8', s:'*',  lbl:'8' },
    {code:'Digit9',       n:'9', s:'(',  lbl:'9' },
    {code:'Digit0',       n:'0', s:')',  lbl:'0' },
    {code:'Minus',        n:'-', s:'_',  lbl:'-' },
    {code:'Equal',        n:'=', s:'+',  lbl:'=' },
    {code:'Backspace',    n:null,s:null, lbl:'⌫', fn:'backspace', w:2},
  ],
  /* Row 1 — QWERTY: Tab 1.5u + 12×1u + \\ 1.5u = 15u */
  [
    {code:'Tab',          n:'\t',s:'\t', lbl:'Tab', fn:'tab', w:1.5},
    {code:'KeyQ',         n:'q', s:'Q',  lbl:'q' },
    {code:'KeyW',         n:'w', s:'W',  lbl:'w' },
    {code:'KeyE',         n:'e', s:'E',  lbl:'e' },
    {code:'KeyR',         n:'r', s:'R',  lbl:'r' },
    {code:'KeyT',         n:'t', s:'T',  lbl:'t' },
    {code:'KeyY',         n:'y', s:'Y',  lbl:'y' },
    {code:'KeyU',         n:'u', s:'U',  lbl:'u' },
    {code:'KeyI',         n:'i', s:'I',  lbl:'i' },
    {code:'KeyO',         n:'o', s:'O',  lbl:'o' },
    {code:'KeyP',         n:'p', s:'P',  lbl:'p' },
    {code:'BracketLeft',  n:'[', s:'{',  lbl:'[' },
    {code:'BracketRight', n:']', s:'}',  lbl:']' },
    {code:'Backslash',    n:'\\',s:'|',  lbl:'\\', w:1.5},
  ],
  /* Row 2 — ASDF: Caps 1.75u + 11×1u + Enter 2.25u = 15u */
  [
    {code:'CapsLock',     n:null,s:null, lbl:'Caps', fn:'caps', w:1.75},
    {code:'KeyA',         n:'a', s:'A',  lbl:'a' },
    {code:'KeyS',         n:'s', s:'S',  lbl:'s' },
    {code:'KeyD',         n:'d', s:'D',  lbl:'d' },
    {code:'KeyF',         n:'f', s:'F',  lbl:'f' },
    {code:'KeyG',         n:'g', s:'G',  lbl:'g' },
    {code:'KeyH',         n:'h', s:'H',  lbl:'h' },
    {code:'KeyJ',         n:'j', s:'J',  lbl:'j' },
    {code:'KeyK',         n:'k', s:'K',  lbl:'k' },
    {code:'KeyL',         n:'l', s:'L',  lbl:'l' },
    {code:'Semicolon',    n:';', s:':',  lbl:';' },
    {code:'Quote',        n:"'", s:'"',  lbl:"'" },
    {code:'Enter',        n:'\n',s:'\n', lbl:'↵', fn:'enter', w:2.25},
  ],
  /* Row 3 — ZXCV: LShift 2.25u + 10×1u + RShift 2.75u = 15u */
  [
    {code:'ShiftLeft',    n:null,s:null, lbl:'Shift', fn:'shift', w:2.25},
    {code:'KeyZ',         n:'z', s:'Z',  lbl:'z' },
    {code:'KeyX',         n:'x', s:'X',  lbl:'x' },
    {code:'KeyC',         n:'c', s:'C',  lbl:'c' },
    {code:'KeyV',         n:'v', s:'V',  lbl:'v' },
    {code:'KeyB',         n:'b', s:'B',  lbl:'b' },
    {code:'KeyN',         n:'n', s:'N',  lbl:'n' },
    {code:'KeyM',         n:'m', s:'M',  lbl:'m' },
    {code:'Comma',        n:',', s:'<',  lbl:',' },
    {code:'Period',       n:'.', s:'>',  lbl:'.' },
    {code:'Slash',        n:'/', s:'?',  lbl:'/' },
    {code:'ShiftRight',   n:null,s:null, lbl:'Shift', fn:'shift', w:2.75},
  ],
  /* Row 4 — Space: 6×1.25u + Space 5.25u + Alt+Menu+Ctrl right = 15u
     1.25+1.25+1.25+1.25+5.25+1.25+1.25+1.25 = 14u... let me recalc:
     Ctrl+Win+Alt = 3×1.25=3.75 | Space=5.75 | Alt+Menu+Ctrl = 3×1.5=4.5 → 14
     Actually: Ctrl(1.5)+Win(1.25)+Alt(1.25)+Space(5.75)+Alt(1.25)+Menu(1.25)+Ctrl(1.75) = 15u ✓ */
  [
    {code:'ControlLeft',  n:null,s:null, lbl:'Ctrl',  fn:'noop', w:1.5 },
    {code:'MetaLeft',     n:null,s:null, lbl:'⊞ Win', fn:'noop', w:1.25},
    {code:'AltLeft',      n:null,s:null, lbl:'Alt',   fn:'noop', w:1.25},
    {code:'Space',        n:' ', s:' ',  lbl:'Space', fn:'space', w:6.75},
    {code:'AltRight',     n:null,s:null, lbl:'Alt',   fn:'noop', w:1.25},
    {code:'ContextMenu',  n:null,s:null, lbl:'☰',     fn:'noop', w:1.25},
    {code:'ControlRight', n:null,s:null, lbl:'Ctrl',  fn:'noop', w:1.75},
  ],
];

/* ── Numpad grid data ────────────────────────────────────────────
   gc = grid-column(s), gr = grid-row(s), gcSpan/grSpan = span     */
const NUMPAD_KEYS = [
  /* Row 1 */
  {n:'',  s:'',  lbl:'Num\nLk', gc:1, gr:1, fn:'numlock'},
  {n:'/', s:'/', lbl:'/',       gc:2, gr:1},
  {n:'*', s:'*', lbl:'×',      gc:3, gr:1},
  {n:'-', s:'-', lbl:'−',      gc:4, gr:1},
  /* Row 2 */
  {n:'7', s:'7', lbl:'7',       gc:1, gr:2},
  {n:'8', s:'8', lbl:'8',       gc:2, gr:2},
  {n:'9', s:'9', lbl:'9',       gc:3, gr:2},
  /* + spans rows 2–3 */
  {n:'+', s:'+', lbl:'+',       gc:4, gr:2, grSpan:2},
  /* Row 3 */
  {n:'4', s:'4', lbl:'4',       gc:1, gr:3},
  {n:'5', s:'5', lbl:'5',       gc:2, gr:3},
  {n:'6', s:'6', lbl:'6',       gc:3, gr:3},
  /* Row 4 */
  {n:'1', s:'1', lbl:'1',       gc:1, gr:4},
  {n:'2', s:'2', lbl:'2',       gc:2, gr:4},
  {n:'3', s:'3', lbl:'3',       gc:3, gr:4},
  /* Enter spans rows 4–5 */
  {n:'\n',s:'\n',lbl:'↵',       gc:4, gr:4, grSpan:2, fn:'npenter'},
  /* Row 5 */
  /* 0 spans cols 1–2 */
  {n:'0', s:'0', lbl:'0',       gc:1, gr:5, gcSpan:2},
  {n:'.', s:'.', lbl:'.',       gc:3, gr:5},
];

/* ── State ───────────────────────────────────────────────────── */
let shiftActive = false;
let capsLock    = false;
let numLock     = true;   /* Num Lock on by default */
let soundOn     = true;

/* ── DOM refs ────────────────────────────────────────────────── */
const out       = document.getElementById('out');
const kbBody    = document.getElementById('kbBody');
const kbMain    = document.getElementById('kbMain');
const kbRows    = document.getElementById('kbRows');
const fnRow     = document.getElementById('fnRow');
const numpad    = document.getElementById('numpad');
const dotShift  = document.getElementById('dotShift');
const dotCaps   = document.getElementById('dotCaps');
const dotNum    = document.getElementById('dotNum');
const modeLabel = document.getElementById('modeLabel');
const sndBtn    = document.getElementById('sndBtn');

/* ════════════════════════════════════════════════════════════════
   SOUND SYSTEM — Web Audio API synthetic click
   Creates a very short band-pass filtered noise burst with a
   small tonal "tick" component — like a flat scissor-switch key.
════════════════════════════════════════════════════════════════ */
let audioCtx = null;

function getCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  /* Resume if suspended (browser autoplay policy) */
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function playClick() {
  if (!soundOn) return;
  try {
    const ctx  = getCtx();
    const dur  = 0.038;                          /* 38ms burst          */
    const sr   = ctx.sampleRate;
    const buf  = ctx.createBuffer(1, Math.ceil(sr * dur), sr);
    const data = buf.getChannelData(0);
    const n    = data.length;

    for (let i = 0; i < n; i++) {
      const t     = i / sr;
      /* Noise component — decays fast */
      const noise  = (Math.random() * 2 - 1) * Math.exp(-t * 90);
      /* Tonal "tick" at ~3.5 kHz — gives the crisp click character */
      const tick   = Math.sin(2 * Math.PI * 3500 * t) * Math.exp(-t * 280);
      data[i] = noise * 0.25 + tick * 0.75;
    }

    const src  = ctx.createBufferSource();
    src.buffer = buf;

    /* Band-pass around 2–5 kHz for "scissor-switch" brightness */
    const bpf  = ctx.createBiquadFilter();
    bpf.type   = 'bandpass';
    bpf.frequency.value = 3200;
    bpf.Q.value = 0.7;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.22, ctx.currentTime);

    src.connect(bpf); bpf.connect(gain); gain.connect(ctx.destination);
    src.start();
    src.stop(ctx.currentTime + dur + 0.01);
  } catch (e) { /* silent fail if audio unavailable */ }
}

function toggleSound() {
  soundOn = !soundOn;
  sndBtn.textContent = soundOn ? '🔊 Sound' : '🔇 Sound';
  sndBtn.classList.toggle('muted', !soundOn);
}

/* ════════════════════════════════════════════════════════════════
   BUILD FUNCTION ROW
════════════════════════════════════════════════════════════════ */
function buildFnRow() {
  fnRow.innerHTML = '';
  FN_ROW.forEach(item => {
    if (item === 'sep') {
      const sep = document.createElement('div');
      sep.className = 'fn-sep';
      fnRow.appendChild(sep);
      return;
    }
    const el = document.createElement('div');
    el.className = 'key key-fn';
    el.dataset.code = item.code;
    const lb = document.createElement('div');
    lb.className = 'fn-lbl';
    lb.textContent = item.lbl;
    el.appendChild(lb);
    el.addEventListener('mousedown', e => { e.preventDefault(); flashKey(el); playClick(); });
    fnRow.appendChild(el);
  });
}

/* ════════════════════════════════════════════════════════════════
   BUILD MAIN KEY ROWS
════════════════════════════════════════════════════════════════ */
function buildMainRows() {
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
        /* Character key: shift char top-left, normal char bottom-left */
        const ks = document.createElement('div');
        ks.className = 'ks';
        ks.textContent = k.s !== k.n ? k.s : ''; /* only show if different from normal */

        const kn = document.createElement('div');
        kn.className = 'kn';
        kn.textContent = k.n || '';

        el.appendChild(ks);
        el.appendChild(kn);
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

/* ════════════════════════════════════════════════════════════════
   BUILD NUMPAD
════════════════════════════════════════════════════════════════ */
function buildNumpad() {
  numpad.innerHTML = '';
  NUMPAD_KEYS.forEach(k => {
    const el = document.createElement('div');
    el.className = 'key';
    el.dataset.code = k.code || ('NP_' + k.lbl);
    el.dataset.npChar = k.n || '';

    /* Grid placement */
    el.style.gridColumn = k.gcSpan ? `${k.gc} / ${k.gc + k.gcSpan}` : String(k.gc);
    el.style.gridRow    = k.grSpan ? `${k.gr} / ${k.gr + k.grSpan}` : String(k.gr);

    /* Label */
    const lb = document.createElement('div');
    lb.className = 'np-lbl' + (k.grSpan ? ' tall' : (k.fn === 'numlock' ? ' sm' : ''));
    lb.style.whiteSpace = 'pre';        /* allow \n in NumLk label */
    lb.textContent = k.lbl;
    el.appendChild(lb);

    el.addEventListener('mousedown', e => {
      e.preventDefault();
      activateNumpadKey(k, el);
    });
    numpad.appendChild(el);
  });
  /* Reflect initial num-lock state */
  syncNumLock();
}

/* ════════════════════════════════════════════════════════════════
   KEY ACTIVATION — main keyboard
════════════════════════════════════════════════════════════════ */
function activateKey(k, el) {
  out.focus();
  playClick();

  switch (k.fn) {
    case 'shift':     toggleShift(); return;
    case 'caps':      toggleCaps();  return;
    case 'backspace': doBackspace(); if (el) flashKey(el); return;
    case 'enter':     insertText('\n'); if (el) flashKey(el); return;
    case 'tab':       insertText('\t'); if (el) flashKey(el); return;
    case 'space':     insertText(' ');  if (el) flashKey(el); return;
    case 'noop':      if (el) flashKey(el); return;
    default: {
      /* English layout: all letter keys respect Caps + Shift XOR */
      const isLetter = k.code.startsWith('Key');
      const useShift = isLetter ? (shiftActive !== capsLock) : shiftActive;
      const ch = useShift ? k.s : k.n;
      if (ch) insertText(ch);
      if (shiftActive) { shiftActive = false; syncVisuals(); }
      if (el) flashKey(el);
    }
  }
  updateStats();
}

/* ════════════════════════════════════════════════════════════════
   NUMPAD KEY ACTIVATION
════════════════════════════════════════════════════════════════ */
function activateNumpadKey(k, el) {
  out.focus();
  playClick();
  if (k.fn === 'numlock') { numLock = !numLock; syncNumLock(); flashKey(el); return; }
  if (k.fn === 'npenter') { insertText('\n'); flashKey(el); updateStats(); return; }
  if (numLock && k.n) { insertText(k.n); }
  flashKey(el);
  updateStats();
}

/* ════════════════════════════════════════════════════════════════
   TEXT OPERATIONS
════════════════════════════════════════════════════════════════ */
function insertText(ch) {
  const sel = window.getSelection();
  if (!sel || !sel.rangeCount) {
    out.textContent += ch; moveCursorEnd(); updateStats(); return;
  }
  const range = sel.getRangeAt(0);
  range.deleteContents();
  const node = document.createTextNode(ch);
  range.insertNode(node);
  range.setStartAfter(node); range.collapse(true);
  sel.removeAllRanges(); sel.addRange(range);
  updateStats();
}

function doBackspace() {
  out.focus();
  const sel = window.getSelection();
  if (!sel || !sel.rangeCount) return;
  const rng = sel.getRangeAt(0);
  if (!rng.collapsed) { rng.deleteContents(); updateStats(); return; }
  document.execCommand('delete');
  updateStats();
}

function clearText() { out.textContent = ''; out.focus(); updateStats(); }

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
  setTimeout(() => t.classList.remove('on'), 2200);
}

/* ════════════════════════════════════════════════════════════════
   WORD / CHARACTER COUNTER
════════════════════════════════════════════════════════════════ */
function updateStats() {
  const raw   = out.textContent || '';
  const chars = raw.length;
  /* Words: split on whitespace, remove empties */
  const words = raw.trim() === '' ? 0
    : raw.trim().split(/\s+/).filter(w => w.length > 0).length;
  const el = document.getElementById('stats');
  el.textContent = `${words} word${words !== 1 ? 's' : ''} \u00a0·\u00a0 ${chars} char${chars !== 1 ? 's' : ''}`;
}

/* ════════════════════════════════════════════════════════════════
   SHIFT / CAPS / NUMLOCK VISUALS
════════════════════════════════════════════════════════════════ */
function toggleShift() { shiftActive = !shiftActive; syncVisuals(); }
function toggleCaps()  { capsLock    = !capsLock;    syncVisuals(); }

function syncVisuals() {
  dotShift.classList.toggle('on', shiftActive);
  dotCaps.classList.toggle('on',  capsLock);
  modeLabel.textContent = shiftActive ? 'Shift' : capsLock ? 'Caps' : 'Normal';
  kbBody.classList.toggle('shift-live', shiftActive || capsLock);

  const capsEl = kbRows.querySelector('[data-code="CapsLock"]');
  if (capsEl) capsEl.classList.toggle('caps-lit', capsLock);

  kbRows.querySelectorAll('[data-code="ShiftLeft"],[data-code="ShiftRight"]')
        .forEach(e => e.classList.toggle('shift-lit', shiftActive));
}

function syncNumLock() {
  dotNum.classList.toggle('on', numLock);
  const nlKey = numpad.querySelector('[data-code="NP_Num\\nLk"]') ||
                [...numpad.querySelectorAll('.key')].find(e => e.dataset.npChar === '');
  if (nlKey) nlKey.classList.toggle('numlock-on', numLock);
}

/* ── Flash animation ─────────────────────────────────────────── */
function flashKey(el) {
  el.classList.add('pressed');
  setTimeout(() => el.classList.remove('pressed'), 130);
}

function moveCursorEnd() {
  const r = document.createRange(), s = window.getSelection();
  r.selectNodeContents(out); r.collapse(false);
  s.removeAllRanges(); s.addRange(r);
}

/* ════════════════════════════════════════════════════════════════
   PHYSICAL KEYBOARD HANDLER
   Intercepts keypresses and routes them through the same
   activateKey() path as mouse clicks, while highlighting the
   corresponding on-screen key.
════════════════════════════════════════════════════════════════ */
document.addEventListener('keydown', e => {
  if (e.ctrlKey || e.metaKey) return; /* pass browser shortcuts */

  /* Shift keys */
  if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
    if (!shiftActive) { shiftActive = true; syncVisuals(); } return;
  }
  /* Caps Lock */
  if (e.code === 'CapsLock') { e.preventDefault(); toggleCaps(); return; }

  /* Flash function row key */
  const fnKey = fnRow.querySelector(`[data-code="${e.code}"]`);
  if (fnKey) { flashKey(fnKey); playClick(); return; }

  if (document.activeElement !== out) return;

  /* Backspace — let native work, just flash */
  if (e.code === 'Backspace') {
    const bsEl = kbRows.querySelector('[data-code="Backspace"]');
    if (bsEl) flashKey(bsEl);
    playClick();
    setTimeout(updateStats, 0);
    return;
  }

  /* Look up in main rows */
  const kDef = findKey(e.code);
  if (kDef) {
    e.preventDefault();
    const el = kbRows.querySelector(`[data-code="${e.code}"]`);
    activateKey(kDef, el);
    return;
  }

  /* Numpad physical keys */
  const npMap = {
    'Numpad0':'\n','Numpad1':'1','Numpad2':'2','Numpad3':'3',
    'Numpad4':'4',  'Numpad5':'5','Numpad6':'6','Numpad7':'7',
    'Numpad8':'8',  'Numpad9':'9','NumpadDecimal':'.','NumpadAdd':'+',
    'NumpadSubtract':'-','NumpadMultiply':'*','NumpadDivide':'/',
    'NumpadEnter':'\n',
  };
  if (npMap[e.code] !== undefined) {
    e.preventDefault();
    const ch = npMap[e.code];
    if (ch === '\n') insertText('\n');
    else if (numLock) insertText(ch);
    playClick();
    /* Flash the matching numpad key visually */
    const npEl = [...numpad.querySelectorAll('.key')]
      .find(el => el.dataset.npChar === (ch === '\n' ? '\n' : ch));
    if (npEl) flashKey(npEl);
  }
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

/* Block native insertion while still allowing cursor moves */
out.addEventListener('keydown', e => {
  const pass = ['Backspace','Delete','ArrowLeft','ArrowRight',
                'ArrowUp','ArrowDown','Home','End','PageUp','PageDown'];
  if (e.ctrlKey || e.metaKey) return;
  if (pass.includes(e.key)) return;
  /* Let the document-level handler do insertion */
  if (!e.code.startsWith('F') && e.code !== 'CapsLock') e.preventDefault();
});

out.addEventListener('input', updateStats);

/* ── Init ─────────────────────────────────────────────────────── */
buildFnRow();
buildMainRows();
buildNumpad();
out.focus();
updateStats();