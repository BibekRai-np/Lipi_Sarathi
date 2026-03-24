/**
 * ════════════════════════════════════════════════════════════════════
 *  Lipi सारथि — engine-index.js
 *  All-in-one keyboard engine (index.html)
 *
 *  LAYOUTS:
 *    · ROWS_TRAD   — Traditional Nepali (ne-trad-ttf 1.1 by sapradhan)
 *    · ROWS_ROMAN  — Romanized (phonetic) Nepali Unicode
 *    · ROWS_QWERTY — Standard English US QWERTY
 *
 *  KEY ARCHITECTURE:
 *    · CSS --ku unit system: all rows = exactly 15u at any viewport
 *    · insertText() uses execCommand for native Ctrl+Z undo support
 *    · saveCursor() / restoreCursor() preserves caret on tab switch
 *    · activateKey(k, el, isVirtual) — CapsLock applies to ALL keys
 *      when isVirtual=true (mouse click); alpha-only when false (physical)
 *    · runTypewriter() — JS setTimeout chain, dramatic EN sequence
 *    · Theme system via CSS data-theme attribute (amber/web3/neomorph)
 *    · i18n via I18N{en,ne} objects — UI only, not keyboard chars
 *
 *  EXPORTS (external .docx via JSZip):
 *    · downloadTxt()  — Blob URL, UTF-8
 *    · downloadDocx() — JSZip OOXML, Noto Sans Devanagari 14pt
 *
 *  UI LANGUAGE: Nepali-first (ne). Toggle button shows "English".
 *
 *  DEPENDENCIES:
 *    · JSZip 3.10.1 (cdnjs CDN) — must load BEFORE this script
 *
 *  INCLUDED BY: index.html
 *  AUTHOR: Bibek Rai
 *  VERSION: 1.3.0
 * ════════════════════════════════════════════════════════════════════
 */

/*
 * ════════════════════════════════════════════════════════════════════
 *  NEPALI UNICODE KEYBOARD — 3 Layouts · 3 Themes · 2 UI Languages
 *  Layouts: Traditional (ne-trad-ttf 1.1) | Romanized | English QWERTY
 *  Themes:  Warm Amber | Web3 (Bitcoin DeFi) | Neumorphism
 *  Row widths all = 15u for perfect alignment at any screen size.
 * ════════════════════════════════════════════════════════════════════
 */

/* Combining Devanagari marks — shown with ◌ prefix on key face */
const COMBINING = new Set([
  '\u093E','\u093F','\u0940','\u0941','\u0942','\u0943',
  '\u0947','\u0948','\u094B','\u094C','\u0902','\u0901',
  '\u094D','\u093C','\u0952',
]);

/* ── TRADITIONAL LAYOUT — ne-trad-ttf 1.1 ─────────────────────── */
const ROWS_TRAD = [
  [{code:'Backquote',   n:'ञ',     s:'ऽ'      },{code:'Digit1',      n:'१',     s:'ज्ञ'   },
   {code:'Digit2',      n:'२',     s:'ई'      },{code:'Digit3',      n:'३',     s:'घ'      },
   {code:'Digit4',      n:'४',     s:'द्ध'    },{code:'Digit5',      n:'५',     s:'छ'      },
   {code:'Digit6',      n:'६',     s:'ट'      },{code:'Digit7',      n:'७',     s:'ठ'      },
   {code:'Digit8',      n:'८',     s:'ड'      },{code:'Digit9',      n:'९',     s:'ढ'      },
   {code:'Digit0',      n:'०',     s:'ण'      },{code:'Minus',       n:'औ',     s:'ओ'      },
   {code:'Equal',       n:'.',     s:'ं'      },{code:'Backspace',   n:null,    s:null, fn:'backspace', w:2}],

  [{code:'Tab',         n:null,    s:null,  fn:'tab',  w:1.5},
   {code:'KeyQ',        n:'त्र',   s:'त्त'    },{code:'KeyW',        n:'ध',     s:'ध्'     },
   {code:'KeyE',        n:'भ',     s:'ऐ'      },{code:'KeyR',        n:'च',     s:'च्'     },
   {code:'KeyT',        n:'त',     s:'त्'     },{code:'KeyY',        n:'थ',     s:'थ्'     },
   {code:'KeyU',        n:'ग',     s:'ऊ'      },{code:'KeyI',        n:'ष',     s:'क्ष'    },
   {code:'KeyO',        n:'य',     s:'इ'      },{code:'KeyP',        n:'उ',     s:'ए'      },
   {code:'BracketLeft', n:'ृ',     s:''       },{code:'BracketRight',n:'े',     s:'ै'      },
   {code:'Backslash',   n:'्',     s:'\u200D',          w:1.5}],

  [{code:'CapsLock',    n:null,    s:null,  fn:'caps', w:1.75},
   {code:'KeyA',        n:'ब',     s:'आ'      },{code:'KeyS',        n:'क',     s:'क्'     },
   {code:'KeyD',        n:'म',     s:'म्'     },{code:'KeyF',        n:'ा',     s:'ँ'      },
   {code:'KeyG',        n:'न',     s:'न्'     },{code:'KeyH',        n:'ज',     s:'झ'      },
   {code:'KeyJ',        n:'व',     s:'ो'      },{code:'KeyK',        n:'प',     s:'फ'      },
   {code:'KeyL',        n:'ि',     s:'ी'      },{code:'Semicolon',   n:'स',     s:'स्'     },
   {code:'Quote',       n:'ु',     s:'ू'      },{code:'Enter',       n:'\n',    s:'\n', fn:'enter', w:2.25}],

  [{code:'ShiftLeft',   n:null,    s:null,  fn:'shift',w:2.25},
   {code:'KeyZ',        n:'श',     s:'श्'     },{code:'KeyX',        n:'ह',     s:'ह्'     },
   {code:'KeyC',        n:'अ',     s:'ऋ'      },{code:'KeyV',        n:'ख',     s:'ॐ'      },
   {code:'KeyB',        n:'द',     s:'ौ'      },{code:'KeyN',        n:'ल',     s:'ल्'     },
   {code:'KeyM',        n:'\u200C',s:'ः'      },{code:'Comma',       n:',',     s:'ङ'      },
   {code:'Period',      n:'।',     s:'श्र'    },{code:'Slash',       n:'र',     s:'?'      },
   {code:'ShiftRight',  n:null,    s:null,  fn:'shift',w:2.75}],

  [{code:'ControlLeft', n:null,s:null,fn:'noop',w:1.5 },
   {code:'MetaLeft',    n:null,s:null,fn:'noop',w:1.25},
   {code:'AltLeft',     n:null,s:null,fn:'noop',w:1.25},
   {code:'Space',       n:' ', s:' ', fn:'space',w:6.75},
   {code:'AltRight',    n:null,s:null,fn:'noop',w:1.25},
   {code:'ContextMenu', n:null,s:null,fn:'noop',w:1.25},
   {code:'ControlRight',n:null,s:null,fn:'noop',w:1.75}],
];

/* ── ROMANIZED LAYOUT ──────────────────────────────────────────── */
const ROWS_ROMAN = [
  [{code:'Backquote',   n:'ऽ',     s:'़'       },{code:'Digit1',      n:'१',     s:'!'      },
   {code:'Digit2',      n:'२',     s:'@'       },{code:'Digit3',      n:'३',     s:'#'      },
   {code:'Digit4',      n:'४',     s:'$'       },{code:'Digit5',      n:'५',     s:'%'      },
   {code:'Digit6',      n:'६',     s:'^'       },{code:'Digit7',      n:'७',     s:'&'      },
   {code:'Digit8',      n:'८',     s:'*'       },{code:'Digit9',      n:'९',     s:'('      },
   {code:'Digit0',      n:'०',     s:')'       },{code:'Minus',       n:'-',     s:'॒'      },
   {code:'Equal',       n:'\u200D',s:'\u200C'  },{code:'Backspace',   n:null,    s:null,fn:'backspace',w:2}],

  [{code:'Tab',         n:null,    s:null,  fn:'tab',  w:1.5},
   {code:'KeyQ',        n:'ट',     s:'ठ'       },{code:'KeyW',        n:'ौ',     s:'औ'      },
   {code:'KeyE',        n:'े',     s:'ै'       },{code:'KeyR',        n:'र',     s:'ृ'      },
   {code:'KeyT',        n:'त',     s:'थ'       },{code:'KeyY',        n:'य',     s:'ञ'      },
   {code:'KeyU',        n:'ु',     s:'ू'       },{code:'KeyI',        n:'ि',     s:'ी'      },
   {code:'KeyO',        n:'ो',     s:'ओ'       },{code:'KeyP',        n:'प',     s:'फ'      },
   {code:'BracketLeft', n:'इ',     s:'ई'       },{code:'BracketRight',n:'ए',     s:'ऐ'      },
   {code:'Backslash',   n:'ः',     s:'ॐ',               w:1.5}],

  [{code:'CapsLock',    n:null,    s:null,  fn:'caps', w:1.75},
   {code:'KeyA',        n:'ा',     s:'आ'       },{code:'KeyS',        n:'स',     s:'श'      },
   {code:'KeyD',        n:'द',     s:'ध'       },{code:'KeyF',        n:'उ',     s:'ऊ'      },
   {code:'KeyG',        n:'ग',     s:'घ'       },{code:'KeyH',        n:'ह',     s:'अ'      },
   {code:'KeyJ',        n:'ज',     s:'झ'       },{code:'KeyK',        n:'क',     s:'ख'      },
   {code:'KeyL',        n:'ल',     s:'ळ'       },{code:'Semicolon',   n:';',     s:':'      },
   {code:'Quote',       n:"'",     s:'"'       },{code:'Enter',       n:'\n',    s:'\n',fn:'enter',w:2.25}],

  [{code:'ShiftLeft',   n:null,    s:null,  fn:'shift',w:2.25},
   {code:'KeyZ',        n:'ष',     s:'ऋ'       },{code:'KeyX',        n:'ड',     s:'ढ'      },
   {code:'KeyC',        n:'छ',     s:'च'       },{code:'KeyV',        n:'व',     s:'ँ'      },
   {code:'KeyB',        n:'ब',     s:'भ'       },{code:'KeyN',        n:'न',     s:'ण'      },
   {code:'KeyM',        n:'म',     s:'ं'       },{code:'Comma',       n:',',     s:'ङ'      },
   {code:'Period',      n:'।',     s:'॥'       },{code:'Slash',       n:'्',     s:'?'      },
   {code:'ShiftRight',  n:null,    s:null,  fn:'shift',w:2.75}],

  [{code:'ControlLeft', n:null,s:null,fn:'noop',w:1.5 },
   {code:'MetaLeft',    n:null,s:null,fn:'noop',w:1.25},
   {code:'AltLeft',     n:null,s:null,fn:'noop',w:1.25},
   {code:'Space',       n:' ', s:' ', fn:'space',w:6.75},
   {code:'AltRight',    n:null,s:null,fn:'noop',w:1.25},
   {code:'ContextMenu', n:null,s:null,fn:'noop',w:1.25},
   {code:'ControlRight',n:null,s:null,fn:'noop',w:1.75}],
];

/* ── ENGLISH QWERTY LAYOUT ─────────────────────────────────────── */
const ROWS_QWERTY = [
  [{code:'Backquote',   n:'`',  s:'~' },{code:'Digit1',      n:'1',  s:'!' },
   {code:'Digit2',      n:'2',  s:'@' },{code:'Digit3',      n:'3',  s:'#' },
   {code:'Digit4',      n:'4',  s:'$' },{code:'Digit5',      n:'5',  s:'%' },
   {code:'Digit6',      n:'6',  s:'^' },{code:'Digit7',      n:'7',  s:'&' },
   {code:'Digit8',      n:'8',  s:'*' },{code:'Digit9',      n:'9',  s:'(' },
   {code:'Digit0',      n:'0',  s:')' },{code:'Minus',       n:'-',  s:'_' },
   {code:'Equal',       n:'=',  s:'+' },{code:'Backspace',   n:null, s:null,fn:'backspace',w:2}],

  [{code:'Tab',         n:'\t', s:'\t',fn:'tab', w:1.5},
   {code:'KeyQ',        n:'q',  s:'Q' },{code:'KeyW',        n:'w',  s:'W' },
   {code:'KeyE',        n:'e',  s:'E' },{code:'KeyR',        n:'r',  s:'R' },
   {code:'KeyT',        n:'t',  s:'T' },{code:'KeyY',        n:'y',  s:'Y' },
   {code:'KeyU',        n:'u',  s:'U' },{code:'KeyI',        n:'i',  s:'I' },
   {code:'KeyO',        n:'o',  s:'O' },{code:'KeyP',        n:'p',  s:'P' },
   {code:'BracketLeft', n:'[',  s:'{' },{code:'BracketRight',n:']',  s:'}' },
   {code:'Backslash',   n:'\\', s:'|',           w:1.5}],

  [{code:'CapsLock',    n:null, s:null,fn:'caps',w:1.75},
   {code:'KeyA',        n:'a',  s:'A' },{code:'KeyS',        n:'s',  s:'S' },
   {code:'KeyD',        n:'d',  s:'D' },{code:'KeyF',        n:'f',  s:'F' },
   {code:'KeyG',        n:'g',  s:'G' },{code:'KeyH',        n:'h',  s:'H' },
   {code:'KeyJ',        n:'j',  s:'J' },{code:'KeyK',        n:'k',  s:'K' },
   {code:'KeyL',        n:'l',  s:'L' },{code:'Semicolon',   n:';',  s:':' },
   {code:'Quote',       n:"'",  s:'"' },{code:'Enter',       n:'\n', s:'\n',fn:'enter',w:2.25}],

  [{code:'ShiftLeft',   n:null, s:null,fn:'shift',w:2.25},
   {code:'KeyZ',        n:'z',  s:'Z' },{code:'KeyX',        n:'x',  s:'X' },
   {code:'KeyC',        n:'c',  s:'C' },{code:'KeyV',        n:'v',  s:'V' },
   {code:'KeyB',        n:'b',  s:'B' },{code:'KeyN',        n:'n',  s:'N' },
   {code:'KeyM',        n:'m',  s:'M' },{code:'Comma',       n:',',  s:'<' },
   {code:'Period',      n:'.',  s:'>' },{code:'Slash',       n:'/',  s:'?' },
   {code:'ShiftRight',  n:null, s:null,fn:'shift',w:2.75}],

  [{code:'ControlLeft', n:null,s:null,fn:'noop',w:1.5 },
   {code:'MetaLeft',    n:null,s:null,fn:'noop',w:1.25},
   {code:'AltLeft',     n:null,s:null,fn:'noop',w:1.25},
   {code:'Space',       n:' ', s:' ', fn:'space',w:6.75},
   {code:'AltRight',    n:null,s:null,fn:'noop',w:1.25},
   {code:'ContextMenu', n:null,s:null,fn:'noop',w:1.25},
   {code:'ControlRight',n:null,s:null,fn:'noop',w:1.75}],
];

/* ── Functional key labels ──────────────────────────────────────── */
const FN_LBL = {
  backspace:'⌫', tab:'Tab', caps:'Caps', enter:'↵', shift:'Shift',
  space:'', noop:'',
};
const NOOP_LBL = {
  ControlLeft:'Ctrl', ControlRight:'Ctrl',
  MetaLeft:'⊞', AltLeft:'Alt', AltRight:'Alt', ContextMenu:'☰',
};

/* ════════════════════════════════════════════════════════════════════
   UI LANGUAGE TRANSLATIONS
   Only UI strings — keyboard characters are NOT translated.
════════════════════════════════════════════════════════════════════ */
const I18N = {
  en: {
    'h1': () => 'Nepali <em>Unicode</em> Keyboard',
    'hd-tag': 'Click or type. Choice is yours.',
    'out-lbl': 'Output — आउटपुट',
    'btn-copy': '⎘ Copy', 'btn-txt': '↓ .txt', 'btn-docx': '↓ .docx',
    'btn-del': '⌫ Del', 'btn-clear': '✕ Clear',
    'lang-btn': 'नेपा',
    'tab-trad-t': 'Traditional Nepali', 'tab-trad-s': 'नेपाली परम्परागत युनिकोड किबोर्ड',
    'tab-rom-t':  'Romanized',           'tab-rom-s':  'रोमनाइज्ड युनिकोड इनपुट',
    'tab-qw-t':   'English QWERTY',      'tab-qw-s':   'Standard US Layout',
    'bar-hint': 'Gold = Shift layer \u00a0·\u00a0 Click or type',
    'mode-normal':'Normal', 'mode-shift':'Shift', 'mode-caps':'Caps',
    'layout-trad':'Traditional','layout-roman':'Romanized','layout-qwerty':'QWERTY',
    'th-amber':'Amber', 'th-web3':'Web3', 'th-soft':'Soft UI',
    'credit-by': 'Created by',
    'stats': (w,c) => `${w} word${w!==1?'s':''} · ${c} char${c!==1?'s':''}`,
  },
  ne: {
    'h1': () => 'नेपाली <em>युनिकोड</em> किबोर्ड',
    'hd-tag': 'टाइप गर्नुस् वा क्लिक गर्नुस्। छनोट तपाईंको।',
    'out-lbl': 'आउटपुट',
    'btn-copy': '⎘ प्रतिलिपि', 'btn-txt': '↓ .txt', 'btn-docx': '↓ .docx',
    'btn-del': '⌫ मेट्ने', 'btn-clear': '✕ खाली',
    'lang-btn': 'Eng',
    'tab-trad-t': 'परम्परागत नेपाली', 'tab-trad-s': 'नेपाली परम्परागत युनिकोड किबोर्ड',
    'tab-rom-t':  'रोमनाइज्ड',         'tab-rom-s':  'रोमनाइज्ड युनिकोड इनपुट',
    'tab-qw-t':   'अंग्रेजी QWERTY',   'tab-qw-s':   'मानक अमेरिकी लेआउट',
    'bar-hint': 'सुनौलो = शिफ्ट \u00a0·\u00a0 क्लिक वा टाइप गर्नुस्',
    'mode-normal':'सामान्य', 'mode-shift':'शिफ्ट', 'mode-caps':'क्याप्स',
    'layout-trad':'परम्परागत','layout-roman':'रोमनाइज्ड','layout-qwerty':'QWERTY',
    'th-amber':'एम्बर', 'th-web3':'वेब३', 'th-soft':'सफ्ट UI',
    'credit-by': 'निर्माता',
    'stats': (w,c) => `${w} शब्द · ${c} अक्षर`,
  },
};

/* ════════════════════════════════════════════════════════════════════
   STATE
════════════════════════════════════════════════════════════════════ */
let shiftActive = false;
let capsLock    = false;
let currentMode = 'trad';
let currentTheme= 'web3';
let uiLang      = 'ne';  /* नेपाली-first default */
let soundOn     = true;

const MODES = { trad:0, roman:1, qwerty:2 };
const ROWS  = { trad:ROWS_TRAD, roman:ROWS_ROMAN, qwerty:ROWS_QWERTY };
const MODE_LBL = {
  trad:  () => I18N[uiLang]['layout-trad'],
  roman: () => I18N[uiLang]['layout-roman'],
  qwerty:() => I18N[uiLang]['layout-qwerty'],
};

/* ════════════════════════════════════════════════════════════════════
   DOM REFS
════════════════════════════════════════════════════════════════════ */
const out        = document.getElementById('out');
const kbBody     = document.getElementById('kbBody');
const dotShift   = document.getElementById('dotShift');
const dotCaps    = document.getElementById('dotCaps');
const modeLabel  = document.getElementById('modeLabel');
const layoutLabel= document.getElementById('layoutLabel');

/* ════════════════════════════════════════════════════════════════════
   SOUND — Web Audio scissor-switch click
════════════════════════════════════════════════════════════════════ */
let audioCtx = null;

function getCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}
function playClick() {
  if (!soundOn) return;
  try {
    const ctx = getCtx(), dur = 0.036, sr = ctx.sampleRate;
    const buf = ctx.createBuffer(1, Math.ceil(sr*dur), sr);
    const d   = buf.getChannelData(0);
    for (let i=0;i<d.length;i++){
      const t = i/sr;
      d[i] = (Math.random()*2-1)*Math.exp(-t*95)*.24
            + Math.sin(Math.PI*2*3400*t)*Math.exp(-t*290)*.76;
    }
    const src=ctx.createBufferSource(); src.buffer=buf;
    const bpf=ctx.createBiquadFilter(); bpf.type='bandpass';
    bpf.frequency.value=3200; bpf.Q.value=0.72;
    const g=ctx.createGain(); g.gain.setValueAtTime(.2,ctx.currentTime);
    src.connect(bpf); bpf.connect(g); g.connect(ctx.destination);
    src.start(); src.stop(ctx.currentTime+dur+.01);
  } catch(e){}
}
function toggleSound() {
  soundOn = !soundOn;
  const btn = document.getElementById('sndBtn');
  btn.textContent = soundOn ? '🔊' : '🔇';
  btn.classList.toggle('muted', !soundOn);
}

/* ════════════════════════════════════════════════════════════════════
   BUILD KEYBOARD
════════════════════════════════════════════════════════════════════ */
function buildRows(containerId, rowsData) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  rowsData.forEach(row => {
    const rowEl = document.createElement('div');
    rowEl.className = 'kb-row';
    row.forEach(k => {
      const el = document.createElement('div');
      el.className = 'key';
      if (k.fn) el.classList.add('key-fn');
      el.dataset.code  = k.code;
      el.dataset.panel = containerId;
      el.style.setProperty('--kw', k.w || 1);

      if (k.fn === 'space') {
        const sp = document.createElement('div');
        sp.className = 'sp-lbl'; sp.textContent = 'Space';
        el.appendChild(sp);
      } else if (k.fn) {
        const lb = document.createElement('div');
        lb.className = 'fn-lbl';
        lb.textContent = k.fn === 'noop'
          ? (NOOP_LBL[k.code] || '')
          : (FN_LBL[k.fn] || '');
        el.appendChild(lb);
      } else {
        const ks = document.createElement('div'); ks.className='ks'; ks.textContent=dispChar(k.s);
        const kn = document.createElement('div'); kn.className='kn'; kn.textContent=dispChar(k.n);
        el.appendChild(ks); el.appendChild(kn);
      }

      el.addEventListener('mousedown', e => {
        e.preventDefault();
        if (el.dataset.panel === activeRowsId()) activateKey(k, el);
      });
      rowEl.appendChild(el);
    });
    container.appendChild(rowEl);
  });
}

function dispChar(ch) {
  if (!ch) return '';
  if (ch==='\u200D') return 'ZWJ';
  if (ch==='\u200C') return 'ZWNJ';
  if (COMBINING.has(ch)) return '\u25CC'+ch;
  return ch;
}

function activeRowsId() {
  return {trad:'rowsTrad', roman:'rowsRoman', qwerty:'rowsQwerty'}[currentMode];
}
function activePanel() {
  return document.getElementById({trad:'panelTrad',roman:'panelRoman',qwerty:'panelQwerty'}[currentMode]);
}

/* ════════════════════════════════════════════════════════════════════
   MODE SWITCHER
════════════════════════════════════════════════════════════════════ */
function switchMode(mode) {
  if (mode === currentMode) return;
  const fromRight = MODES[mode] > MODES[currentMode];
  if (shiftActive) { shiftActive = false; }

  const outPanel = activePanel();
  outPanel.classList.remove('active','slide-r','slide-l');
  currentMode = mode;
  const inPanel = activePanel();
  inPanel.classList.add('active');
  inPanel.classList.remove('slide-r','slide-l');
  void inPanel.offsetWidth;
  inPanel.classList.add(fromRight ? 'slide-r' : 'slide-l');

  document.getElementById('tabTrad').classList.toggle('active',   mode==='trad');
  document.getElementById('tabRoman').classList.toggle('active',  mode==='roman');
  document.getElementById('tabQwerty').classList.toggle('active', mode==='qwerty');
  layoutLabel.textContent = MODE_LBL[mode]();
  syncVisuals();

  /* Restore cursor to exactly where it was before the tab was clicked */
  restoreCursor();
}

/* ── Cursor save / restore across tab switches ──────────────────
   PROBLEM: clicking a tab fires mousedown → focus leaves `out` →
   selection is cleared → by the time switchMode() runs, the cursor
   position is already gone.
   SOLUTION: saveBeforeSwitch() is called on tab mousedown (before
   focus moves), capturing the live selection.  switchMode() then
   calls restoreCursor() to put it back after the tab animates in. */

let _savedRange = null;   /* holds the pre-switch cursor snapshot */

function saveBeforeSwitch() {
  /* Called from onmousedown on every tab — fires before the click
     event steals focus away from the output area.                  */
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) { _savedRange = null; return; }
  /* Only worth saving if the cursor is actually inside the output div */
  if (!out.contains(sel.getRangeAt(0).commonAncestorContainer)) {
    _savedRange = null; return;
  }
  const r = sel.getRangeAt(0);
  _savedRange = {
    startContainer: r.startContainer,
    startOffset:    r.startOffset,
    endContainer:   r.endContainer,
    endOffset:      r.endOffset,
  };
}

function restoreCursor() {
  /* Re-focus the output div and place the cursor exactly where it
     was before the tab click, or fall back to end-of-content.     */
  out.focus();
  if (!_savedRange) { moveCursorEnd(); return; }
  try {
    const range = document.createRange();
    range.setStart(_savedRange.startContainer, _savedRange.startOffset);
    range.setEnd(  _savedRange.endContainer,   _savedRange.endOffset);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  } catch (e) {
    moveCursorEnd();
  }
  _savedRange = null;   /* clear so stale data is never reused */
}

/* ════════════════════════════════════════════════════════════════════
   KEY ACTIVATION
════════════════════════════════════════════════════════════════════ */
function activateKey(k, el, isVirtual = true) {
  out.focus(); playClick();
  switch(k.fn) {
    case 'shift':     toggleShift(); return;
    case 'caps':      toggleCaps();  return;
    case 'backspace': doBackspace(); if(el)flashKey(el); return;
    case 'enter':     insertText('\n'); if(el)flashKey(el); return;
    case 'tab':       insertText('\t'); if(el)flashKey(el); return;
    case 'space':     insertText(' ');  if(el)flashKey(el); return;
    case 'noop':      if(el)flashKey(el); return;
    default: {
      const isAlpha = k.code.startsWith('Key');
      /* Virtual clicks (mouse): CapsLock applies to ALL keys because the
         on-screen key face already shows the shifted character visually.
         Physical keyboard: CapsLock only affects alpha keys (standard rule). */
      const useShift = (isVirtual || isAlpha)
        ? (shiftActive !== capsLock)
        : shiftActive;
      const ch = useShift ? k.s : k.n;
      if (ch) insertText(ch);
      if (shiftActive) { shiftActive=false; syncVisuals(); }
      if (el) flashKey(el);
    }
  }
}

/* ════════════════════════════════════════════════════════════════════
   TEXT OPERATIONS
════════════════════════════════════════════════════════════════════ */
function insertText(ch) {
  out.focus();
  /* execCommand('insertText') integrates with the browser's native undo
     stack so Ctrl+Z / Cmd+Z works correctly. Falls back to manual
     insertion only if execCommand is unavailable (very rare).         */
  const ok = document.execCommand('insertText', false, ch);
  if (!ok) {
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount) { out.textContent += ch; moveCursorEnd(); }
    else {
      const range = sel.getRangeAt(0);
      range.deleteContents();
      const node = document.createTextNode(ch);
      range.insertNode(node);
      range.setStartAfter(node); range.collapse(true);
      sel.removeAllRanges(); sel.addRange(range);
    }
  }
  updateStats();
}
function doBackspace() {
  out.focus();
  const sel = window.getSelection();
  if (!sel||!sel.rangeCount) return;
  const rng = sel.getRangeAt(0);
  if (!rng.collapsed) { rng.deleteContents(); updateStats(); return; }
  document.execCommand('delete');
  updateStats();
}
function clearText() {
  out.focus();
  /* Select all then delete — registers in undo history so Ctrl+Z restores */
  document.execCommand('selectAll');
  document.execCommand('delete');
  updateStats();
}
async function copyText() {
  const txt = out.textContent||'';
  if (!txt) return;
  try { await navigator.clipboard.writeText(txt); }
  catch {
    const r=document.createRange(); r.selectNodeContents(out);
    const s=window.getSelection(); s.removeAllRanges(); s.addRange(r);
    document.execCommand('copy');
  }
  const t=document.getElementById('toast');
  t.classList.add('on'); setTimeout(()=>t.classList.remove('on'),2200);
}

/* ── Download .txt ───────────────────────────────────────────────── */
function downloadTxt() {
  const text = out.textContent || '';
  if (!text.trim()) { return; }
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'nepali-text.txt';
  document.body.appendChild(a); a.click();
  document.body.removeChild(a); URL.revokeObjectURL(a.href);
}

/* ── Download .docx (via JSZip — minimal OOXML) ─────────────────── */
async function downloadDocx() {
  const text = out.textContent || '';
  if (!text.trim()) { return; }
  if (typeof JSZip === 'undefined') {
    alert('JSZip not loaded yet — please try again in a moment.');
    return;
  }

  const esc = s => s
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');

  /* Build one <w:p> per line; empty lines become a blank paragraph */
  const paras = text.split('\n').map(line =>
    `<w:p><w:r><w:rPr>` +
    `<w:rFonts w:ascii="Noto Sans Devanagari" w:hAnsi="Noto Sans Devanagari"/>` +
    `<w:sz w:val="28"/></w:rPr>` +
    `<w:t xml:space="preserve">${esc(line)||' '}</w:t></w:r></w:p>`
  ).join('\n');

  const contentTypes =
`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml"  ContentType="application/xml"/>
  <Override PartName="/word/document.xml"
    ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`;

  const rootRels =
`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1"
    Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument"
    Target="word/document.xml"/>
</Relationships>`;

  const wordRels =
`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"/>`;

  const doc =
`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
${paras}
    <w:sectPr>
      <w:pgSz w:w="12240" w:h="15840"/>
      <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/>
    </w:sectPr>
  </w:body>
</w:document>`;

  const zip = new JSZip();
  zip.file('[Content_Types].xml', contentTypes);
  zip.file('_rels/.rels', rootRels);
  zip.file('word/document.xml', doc);
  zip.file('word/_rels/document.xml.rels', wordRels);

  const blob = await zip.generateAsync({
    type: 'blob',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  });
  const url = URL.createObjectURL(blob);
  const a   = document.createElement('a');
  a.href = url; a.download = 'nepali-text.docx';
  document.body.appendChild(a); a.click();
  document.body.removeChild(a); URL.revokeObjectURL(url);
}

/* ── Stats ───────────────────────────────────────────────────────── */
function updateStats() {
  const raw  = out.textContent || '';
  const chars = raw.length;
  const words = raw.trim()==='' ? 0
    : raw.trim().split(/\s+/).filter(w=>w.length>0).length;
  document.getElementById('stats').textContent = I18N[uiLang].stats(words, chars);
}

/* ════════════════════════════════════════════════════════════════════
   SHIFT / CAPS
════════════════════════════════════════════════════════════════════ */
function toggleShift() { shiftActive=!shiftActive; syncVisuals(); }
function toggleCaps()  { capsLock   =!capsLock;    syncVisuals(); }

function syncVisuals() {
  dotShift.classList.toggle('on', shiftActive);
  dotCaps.classList.toggle('on',  capsLock);
  const t = I18N[uiLang];
  modeLabel.textContent = shiftActive ? t['mode-shift'] : capsLock ? t['mode-caps'] : t['mode-normal'];
  kbBody.classList.toggle('shift-live', shiftActive || capsLock);
  document.querySelectorAll('[data-code="CapsLock"]')
          .forEach(el=>el.classList.toggle('caps-lit', capsLock));
  document.querySelectorAll('[data-code="ShiftLeft"],[data-code="ShiftRight"]')
          .forEach(el=>el.classList.toggle('shift-lit', shiftActive));
}

function flashKey(el) {
  el.classList.add('pressed');
  setTimeout(()=>el.classList.remove('pressed'), 130);
}
function moveCursorEnd() {
  const r=document.createRange(), s=window.getSelection();
  r.selectNodeContents(out); r.collapse(false);
  s.removeAllRanges(); s.addRange(r);
}

/* ════════════════════════════════════════════════════════════════════
   THEME DROPDOWN
════════════════════════════════════════════════════════════════════ */
function toggleThemeMenu() {
  document.getElementById('themeDropdown').classList.toggle('open');
}
/* Close dropdown when clicking outside */
document.addEventListener('click', e => {
  const wrap = document.getElementById('themeMenuWrap');
  if (wrap && !wrap.contains(e.target)) {
    document.getElementById('themeDropdown').classList.remove('open');
  }
});

function setTheme(theme) {
  currentTheme = theme;
  document.body.setAttribute('data-theme', theme);

  /* Update active-dot color swatch and label on the toggle button */
  const dot = document.getElementById('themeActiveDot');
  dot.setAttribute('data-theme', theme);
  document.getElementById('themeActiveLabel').textContent =
    I18N[uiLang]['th-' + (theme === 'neomorph' ? 'soft' : theme)];

  /* Mark active option in dropdown */
  document.querySelectorAll('.theme-option').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tid === theme);
  });

  /* Close dropdown */
  document.getElementById('themeDropdown').classList.remove('open');
  applyLang(uiLang);
}

/* ════════════════════════════════════════════════════════════════════
   EXPAND / COLLAPSE TEXT AREA
════════════════════════════════════════════════════════════════════ */
let outExpanded = false;
function toggleExpand() {
  outExpanded = !outExpanded;
  const outEl  = document.getElementById('out');
  const btn    = document.getElementById('expandBtn');
  outEl.classList.toggle('expanded', outExpanded);
  btn.textContent = outExpanded ? '⤡' : '⤢';
  btn.title = outExpanded ? 'Collapse' : 'Expand';
  if (!outExpanded) {
    /* When collapsing, scroll to keep the cursor visible */
    const sel = window.getSelection();
    if (sel && sel.rangeCount) {
      const rect = sel.getRangeAt(0).getBoundingClientRect();
      const boxRect = outEl.getBoundingClientRect();
      if (rect.bottom > boxRect.bottom || rect.top < boxRect.top) {
        outEl.scrollTop = outEl.scrollHeight;
      }
    }
  }
}

/* ════════════════════════════════════════════════════════════════════
   TYPEWRITER ANIMATION
   English sequence:
     1. Type  "Click or type. Choose"   — character by character
     2. Pause briefly
     3. Delete "Choose"                 — character by character
     4. Type  "Choice is yours."        — character by character
     5. Cursor blinks ~4×, then fades
   Other languages: straight type-through.
════════════════════════════════════════════════════════════════════ */
const _twTimers = [];
function clearTwTimers() { _twTimers.forEach(clearTimeout); _twTimers.length = 0; }

function runTypewriter(fullText, isEnSeq) {
  const el = document.getElementById('hdTagline');
  if (!el) return;
  clearTwTimers();

  /* Reset: clear content, inject text node + blinking cursor span */
  el.innerHTML = '';
  const tn  = document.createTextNode('');
  const cur = document.createElement('span');
  cur.className = 'tw-cursor';
  el.appendChild(tn); el.appendChild(cur);

  const TS = 44;   /* type speed ms/char   */
  const DS = 34;   /* delete speed ms/char */
  const P  = 440;  /* pause before delete  */
  let   t  = 0;

  if (isEnSeq) {
    /* ── Phase 1: type "Click or type. Choose" ── */
    const ph1   = 'Click or type. Choose';
    const delW  = 'Choose';
    const base  = ph1.slice(0, ph1.length - delW.length); /* "Click or type. " */
    const ph2   = 'Choice is yours.';

    for (let i = 0; i <= ph1.length; i++) {
      const c = i;
      _twTimers.push(setTimeout(() => { tn.textContent = ph1.slice(0, c); }, t));
      t += TS;
    }
    t += P;
    /* ── Phase 2: delete "Choose" ── */
    for (let i = 0; i <= delW.length; i++) {
      const c = delW.length - i;
      _twTimers.push(setTimeout(() => { tn.textContent = base + delW.slice(0, c); }, t));
      t += DS;
    }
    t += P * 0.5;
    /* ── Phase 3: type "Choice is yours." ── */
    for (let i = 0; i <= ph2.length; i++) {
      const c = i;
      _twTimers.push(setTimeout(() => { tn.textContent = base + ph2.slice(0, c); }, t));
      t += TS;
    }
  } else {
    /* Straight typewriter for Nepali / other languages */
    for (let i = 0; i <= fullText.length; i++) {
      const c = i;
      _twTimers.push(setTimeout(() => { tn.textContent = fullText.slice(0, c); }, t));
      t += TS;
    }
  }
  /* Remove cursor after 3 s of blinking */
  _twTimers.push(setTimeout(() => { if (cur.parentNode) cur.remove(); }, t + 3000));
}

/* ════════════════════════════════════════════════════════════════════
   UI LANGUAGE TOGGLE
════════════════════════════════════════════════════════════════════ */
function toggleLang() {
  uiLang = uiLang === 'en' ? 'ne' : 'en';
  applyLang(uiLang);
}

function applyLang(lang) {
  const t = I18N[lang];

  /* h1 */
  document.querySelector('.hd h1').innerHTML = t['h1']();

  /* Tagline — JS typewriter handles it; English gets the dramatic sequence */
  runTypewriter(t['hd-tag'], lang === 'en');

  /* All data-i18n elements (hdTagline has no data-i18n attr, skipped) */
  document.querySelectorAll('[data-i18n]').forEach(el => {
    if (el.id === 'hdTagline') return;
    const key = el.dataset.i18n;
    if (t[key] && typeof t[key] === 'string') el.textContent = t[key];
  });

  /* Language button */
  document.getElementById('langBtn').textContent = t['lang-btn'];

  /* Theme toggle label */
  const thKey = 'th-' + (currentTheme === 'neomorph' ? 'soft' : currentTheme);
  const activeLbl = document.getElementById('themeActiveLabel');
  if (activeLbl) activeLbl.textContent = t[thKey] || currentTheme;

  /* Dropdown option labels */
  document.querySelectorAll('.theme-option').forEach(btn => {
    const k = 'th-' + (btn.dataset.tid === 'neomorph' ? 'soft' : btn.dataset.tid);
    const span = btn.querySelector('[data-i18n]');
    if (span && t[k]) span.textContent = t[k];
  });

  /* Dynamic labels */
  layoutLabel.textContent = MODE_LBL[currentMode]();
  updateStats();
  syncVisuals();
}

/* ════════════════════════════════════════════════════════════════════
   PHYSICAL KEYBOARD HANDLER
════════════════════════════════════════════════════════════════════ */
document.addEventListener('keydown', e => {
  if (e.ctrlKey || e.metaKey) return;
  if (e.code==='ShiftLeft' || e.code==='ShiftRight') {
    if (!shiftActive) { shiftActive=true; syncVisuals(); } return;
  }
  if (e.code==='CapsLock') { e.preventDefault(); toggleCaps(); return; }
  if (document.activeElement !== out) return;

  if (e.code==='Backspace') {
    document.querySelectorAll(`#${activeRowsId()} [data-code="Backspace"]`)
            .forEach(el=>flashKey(el));
    playClick(); setTimeout(updateStats,0); return;
  }

  const kDef = findKey(ROWS[currentMode], e.code);
  if (!kDef) return;
  e.preventDefault();
  const el = document.querySelector(`#${activeRowsId()} [data-code="${e.code}"]`);
  activateKey(kDef, el, false);  /* false = physical key, CapsLock only for alpha */
});

document.addEventListener('keyup', e => {
  if (e.code==='ShiftLeft' || e.code==='ShiftRight') {
    if (shiftActive) { shiftActive=false; syncVisuals(); }
  }
});

function findKey(rows, code) {
  for (const row of rows)
    for (const k of row)
      if (k.code===code) return k;
  return null;
}

out.addEventListener('keydown', e => {
  const pass = ['Backspace','Delete','ArrowLeft','ArrowRight',
                'ArrowUp','ArrowDown','Home','End','PageUp','PageDown'];
  if (e.ctrlKey || e.metaKey) return;
  if (pass.includes(e.key)) return;
  e.preventDefault();
});
out.addEventListener('input', updateStats);


/* ════════════════════════════════════════════════════════════════════
   KEYBOARD FONT SCALE — A− / A+ buttons (keyboard characters only)
   5 steps: 0.70 · 0.85 · 1.00 (default) · 1.20 · 1.40
   --fs is set on #kbBody so ONLY key characters are affected.
════════════════════════════════════════════════════════════════════ */
const FS_STEPS = [0.70, 0.85, 1.00, 1.20, 1.40];
let   fsIndex  = 2;   /* default = index 2 → 1.00 (original size) */

function changeFontScale(dir) {
  fsIndex = Math.max(0, Math.min(FS_STEPS.length - 1, fsIndex + dir));
  document.getElementById('kbBody').style.setProperty('--fs', FS_STEPS[fsIndex]);
  document.getElementById('btnFontDec').disabled = (fsIndex === 0);
  document.getElementById('btnFontInc').disabled = (fsIndex === FS_STEPS.length - 1);
}

/* ════════════════════════════════════════════════════════════════════
   INIT
════════════════════════════════════════════════════════════════════ */
buildRows('rowsTrad',   ROWS_TRAD);
buildRows('rowsRoman',  ROWS_ROMAN);
buildRows('rowsQwerty', ROWS_QWERTY);

/* Apply initial lang (sets all data-i18n strings) — also triggers typewriter */
applyLang('ne'); /* Nepali-first: start in Nepali UI */

/* Set web3 as active in dropdown (body already has data-theme="web3") */
document.querySelectorAll('.theme-option').forEach(btn => {
  btn.classList.toggle('active', btn.dataset.tid === 'web3');
});

out.focus();
updateStats();