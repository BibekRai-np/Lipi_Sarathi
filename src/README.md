# Lipi सारथि — Source Files (`src/`)

This folder contains all extracted source assets for the Lipi सारथि project.
Each file is documented and independently maintainable.

---

## File Map

```
src/
├── engine-index.js        ← All-in-one keyboard JS (index.html)
├── engine-traditional.js  ← Traditional Nepali keyboard JS (traditional.html)
├── engine-romanized.js    ← Romanized keyboard JS (romanized.html)
├── engine-english.js      ← English QWERTY + Numpad JS (english.html)
├── protection.js          ← Code theft prevention (all pages)
├── logo.svg               ← Lipi सारथि logo (vector, scalable)
├── fevicon.png            ← Browser tab favicon (32×32 PNG)
└── README.md              ← This file
```

---

## How to Use External JS Files

Each HTML page references its engine from `src/`:

```html
<!-- In index.html -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
<script src="src/engine-index.js"></script>

<!-- In traditional.html -->
<script src="src/engine-traditional.js"></script>

<!-- In romanized.html -->
<script src="src/engine-romanized.js"></script>

<!-- In english.html -->
<script src="src/engine-english.js"></script>

<!-- In ALL pages (must come before other scripts) -->
<script src="src/protection.js"></script>
```

---

## Engine Files

### `engine-index.js` — All-in-one (36 KB)
The largest file. Powers `index.html` which hosts all three layouts
(Traditional, Romanized, QWERTY) in one page with animated tab switching.

**Key exports (global functions called from HTML):**
| Function | Purpose |
|---|---|
| `buildRows(id, rows)` | Inject a keyboard layout into a panel |
| `switchMode(mode)` | Switch between trad/roman/qwerty tabs |
| `activateKey(k, el, isVirtual)` | Insert character from key press |
| `copyText()` | Copy output to clipboard |
| `downloadTxt()` | Download output as .txt |
| `downloadDocx()` | Download output as .docx (requires JSZip) |
| `toggleSound()` | Toggle keystroke click sound |
| `toggleLang()` | Toggle EN ↔ NE UI language |
| `setTheme(theme)` | Switch CSS theme (amber/web3/neomorph) |
| `changeFontScale(dir)` | A− / A+ key font scaling |
| `toggleExpand()` | Expand/collapse output text area |

**State variables:**
```js
let shiftActive = false;   // Shift key is held / sticky
let capsLock    = false;   // Caps Lock is on
let currentMode = 'trad';  // Active layout: trad | roman | qwerty
let currentTheme= 'web3';  // Active theme
let uiLang      = 'ne';    // UI language: ne (Nepali-first default)
let soundOn     = true;    // Keystroke sound enabled
let outExpanded = false;   // Output area expanded
```

**CapsLock logic (important):**
```js
// Virtual click (mouse) — CapsLock affects ALL keys
// because the key face visually shows the shifted character
activateKey(k, el, true)   // isVirtual = true → all keys use CapsLock

// Physical keyboard — CapsLock affects alpha keys only (standard rule)
activateKey(kDef, el, false) // isVirtual = false → alpha only
```

**To change default UI language:**
```js
let uiLang = 'ne';   // 'ne' = Nepali first (current)
                     // 'en' = English first
```

---

### `engine-traditional.js` — Traditional Nepali (15 KB)
Powers `traditional.html`. Direct fixed mapping based on ne-trad-ttf 1.1.

**Layout credit:** [sapradhan/ne-trad-ttf](https://github.com/sapradhan/ne-trad-ttf)

**Key mapping snippet:**
```
Key   Normal  Shift     Key   Normal  Shift
`     ञ       ऽ         q     त्र     त्त
1     १       ज्ञ       w     ध       ध्
a     ब       आ         e     भ       ऐ
s     क       क्        r     च       च्
\     ् halant ZWJ       ]     े       ै   ← CapsLock bug was here
```

---

### `engine-romanized.js` — Romanized Phonetic (15 KB)
Powers `romanized.html`. Phonetic transliteration layout.

**Key mapping snippet:**
```
k → क    K → ख    g → ग    G → घ
c → छ    C → च    t → त    T → थ
/ → ् (halant)    . → ।    M → ं
```

---

### `engine-english.js` — English QWERTY (22 KB)
Powers `english.html`. Standard US QWERTY + full Numpad.

Extra features not in Nepali engines:
- Num Lock toggle
- Full Fn row (Esc, F1–F12)
- Numpad grid with special spanning keys

---

## `protection.js` — Code Protection (2 KB)

Loaded in `<head>` of every page **before** other scripts.

**What it blocks:**
- Right-click → context menu
- F12 → DevTools
- Ctrl+Shift+I → DevTools Elements
- Ctrl+Shift+J → DevTools Console
- Ctrl+U → View Page Source
- Ctrl+S → Save Page
- DevTools open detection → warning overlay

**What it does NOT block:**
- Browser address bar `view-source:` URL (cannot be prevented client-side)
- Browser extensions that bypass JS handlers
- Screen readers and accessibility tools (intentionally allowed)

**Note:** For production, combine with server-side minification and obfuscation
(e.g. Terser + name mangling) for stronger protection.

---

## `logo.svg` — Brand Logo

Inline SVG. Use in HTML like this:

```html
<!-- Inline (preferred — no extra HTTP request) -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 60" width="130" height="30">
  <!-- paste contents of logo.svg here -->
</svg>

<!-- Or as <img> -->
<img src="src/logo.svg" alt="Lipi सारथि" width="160" height="44">
```

**Brand colors:**
```
Navy:   #003893   (key background, "Lipi" wordmark in light contexts)
Orange: #D4820A   (cursor bar, "सारथि" wordmark)
White:  #FFFFFF   (ल glyph on key)
```

---

## `fevicon.png` — Favicon

32×32 PNG. Linked in all HTML `<head>` sections:

```html
<link rel="icon" type="image/png" href="fevicon.png">
```

For better cross-browser support, also add:
```html
<link rel="apple-touch-icon" href="fevicon.png">
```

---

## Making Changes — Where to Edit

| What you want to change | File to edit |
|---|---|
| Traditional keyboard layout mappings | `src/engine-traditional.js` → `KEY_ROWS` array |
| Romanized layout mappings | `src/engine-romanized.js` → `KEY_ROWS` array |
| All-in-one layout mappings | `src/engine-index.js` → `ROWS_TRAD / ROWS_ROMAN / ROWS_QWERTY` |
| Nepali/English UI translations | `src/engine-index.js` → `I18N` object |
| Theme colors | Each HTML file → `:root` and `[data-theme]` CSS blocks |
| Landing page content | `home.html` directly |
| Testimonials | `home.html` → `.testi-card` blocks |
| Typewriter animation text | `src/engine-index.js` → `I18N.en['hd-tag']` and `I18N.ne['hd-tag']` |
| Sound on/off default | `src/engine-index.js` → `let soundOn = true` |
| Default UI language | `src/engine-index.js` → `let uiLang = 'ne'` |
| Default theme | `index.html` → `<body data-theme="web3">` |
| Code protection behavior | `src/protection.js` |
| Ad placements | Any HTML file → `#ad-top` or `#ad-footer` divs |

---

## Deployment

This is a **100% static site** — no server, no database, no build step.

**Option 1 — Netlify (recommended):**
1. Drag the project folder to [app.netlify.com/drop](https://app.netlify.com/drop)
2. Get HTTPS URL instantly
3. Set custom domain `lipisarathi.com.np` in settings

**Option 2 — GitHub Pages:**
1. Push to a GitHub repository
2. Settings → Pages → Deploy from branch `main`

**Option 3 — Any web host:**
Upload the entire folder via FTP/cPanel. The `src/` subdirectory must
stay alongside the HTML files for the JS references to work.

**File structure required on server:**
```
/                          ← web root
├── home.html
├── index.html
├── traditional.html
├── romanized.html
├── english.html
├── fevicon.png
└── src/
    ├── engine-index.js
    ├── engine-traditional.js
    ├── engine-romanized.js
    ├── engine-english.js
    ├── protection.js
    ├── logo.svg
    └── fevicon.png
```

---

## Adding Google AdSense

When your site is approved for AdSense:

1. Get your ad code from AdSense dashboard
2. Find the `#ad-top` div in any HTML file:
   ```html
   <div id="ad-top" style="...">
     <!-- Paste AdSense script here -->
     <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?..."></script>
     <ins class="adsbygoogle" ...></ins>
     <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
   </div>
   ```
3. Same for `#ad-footer` at the bottom

**Recommended placement:**
- `#ad-top`: 728×90 leaderboard (above the tool, below nav)
- `#ad-footer`: 320×50 banner (below the keyboard)

Do NOT place ads inside the keyboard panel or output area.

---

*Lipi सारथि v1.3.0 · Created by Bibek Rai · Unicode Compliant · Digital Nepal Framework Aligned*
