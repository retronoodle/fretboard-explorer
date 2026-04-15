# Fretboard Explorer — Improvement Roadmap

## Critical Bugs (Fix First)

### 1. Asset Enqueue Race Condition
**File:** `fretboard-explorer.php`

`fretboard_explorer_conditional_enqueue()` runs at priority **5**, but `fretboard_explorer_enqueue_assets()` (which *registers* the handles) runs at default priority **10**. The conditional enqueue calls `wp_enqueue_script/style('fretboard-explorer')` before the handle has been registered — so assets silently never load.

**Fix:** Move `wp_register_script/style` into the conditional enqueue function, or bump `enqueue_assets` to priority 1.

---

### 2. Left-Handed Mode Produces Malformed SVG
**File:** `includes/js/fretboard-frontend.js`, `src/fretboard-renderer.js`

The left/right flip inserts a `style` attribute inside the `viewBox` value regex replacement:
```js
svg.replace(/viewBox="[^"]*"/, 'viewBox="0 0 ' + width + ' ' + height + '" style="transform: scaleX(-1);"');
```
This generates invalid SVG markup.

**Fix:** Apply the transform on a wrapping `<g>` element, or add `style` as a proper top-level SVG attribute separately.

---

### 3. `class=` Instead of `className=` in JSX
**File:** `src/index.js` (lines ~219, ~229)

React JSX requires `className`, not `class`. Will emit warnings and may produce incorrect output if the plugin is ever rebuilt from source.

**Fix:** Replace `class=` with `className=` in all JSX in `src/index.js`.

---

### 4. Octave Not Incremented in `transposeNote()`
**File:** `includes/js/fretboard-frontend.js`, `src/music-theory.js`

When transposing by more than 11 semitones (e.g. 9th chord intervals like `[0, 4, 7, 11, 14]`), the octave number never increments — resulting in wrong audio pitch and incorrect interval labels for extended chords.

**Fix:** Increment octave with `Math.floor((getNoteIndex(noteName) + semitones) / 12)`.

---

### 5. `getIntervalSemitones()` Collapses Intervals > 1 Octave
**File:** `includes/js/fretboard-frontend.js`, `src/music-theory.js`

Intervals greater than an octave (9ths, 11ths, 13ths) collapse to their mod-12 equivalent — a major 9th shows as `2` instead of `9`. The negative diff guard only adds 12 once, so `diff < -12` still returns a negative.

**Fix:** Use `((diff % 12) + 12) % 12` and preserve compound interval identity where needed.

---

### 6. Inlay Dot Logic Inconsistency
**File:** `fretboard-renderer.js` vs. `fretboard-frontend.js`

When `startFret !== 0`, `fretboard-renderer.js` only renders double-dot inlay positions (12, 15, 17, 19, 21, 24) and silently drops single-dot inlays (3, 5, 7, 9). The IIFE version handles this correctly. The two renderers are out of sync.

**Fix:** Unify inlay rendering logic, normalise inlay positions relative to `startFret`.

---

### 7. String Thickness Computed but Ignored
**File:** `fretboard-renderer.js` / IIFE (line ~117)

`const thickness = 1 + (s / numStrings) * 2;` is computed every loop but the `<rect>` element is hardcoded with `width="2"`. All strings look the same weight.

**Fix:** Use `thickness` in the rect element so bass strings appear visually heavier.

---

## Architecture / Maintainability

### 8. Three Parallel Implementations of the Same Logic
`src/fretboard-renderer.js`, `includes/js/fretboard-renderer.js`, and the IIFE embedded in `fretboard-frontend.js` are three diverged copies of the renderer. Same for `music-theory.js`. Any fix has to be applied in multiple places.

**Fix:** Keep one canonical source in `src/`. Have the build step produce both the Gutenberg editor bundle and the standalone frontend IIFE from the same source (use a second webpack entry point or a custom `wp-scripts` config).

---

### 9. Dead Code in `includes/js/`
`includes/js/frontend.js`, `includes/js/fretboard-renderer.js`, and `includes/js/music-theory.js` (ES module versions) are never loaded by WordPress — they use `import/export` and have no loader. They only add confusion.

**Fix:** Delete them or convert the build pipeline so they become the canonical source.

---

### 10. No Activation / Deactivation Hooks
The plugin has no `register_activation_hook` or `register_deactivation_hook`. This is fine currently (no DB, no cron, no options), but it means there's no clean install/uninstall path if those features are added later.

**Fix:** Add at minimum a `register_uninstall_hook` stub for future-proofing.

---

### 11. No Error Handling on `JSON.parse(data-config)`
**File:** `fretboard-frontend.js`

If the `data-config` attribute is malformed (e.g. due to encoding issues from the shortcode), the whole frontend crashes silently. No container ever renders.

**Fix:** Wrap JSON.parse in try/catch and log a meaningful console error with the container element reference.

---

## Features / UX

### 12. Audio Is Always On — No UI Toggle
The `audioEnabled` block attribute exists but is never surfaced in the editor inspector and the frontend always initialises audio click handlers. Per the PRD, audio should be opt-in.

**Fix:** Add a toggle to the block Inspector Controls and honour `audioEnabled` in the frontend init.

---

### 13. No Live Preview of Audio in the Editor
Notes played in the editor preview area are silent. The audio context is only initialised on the frontend.

**Fix:** Wire the Web Audio API into the editor preview as well (gated by `audioEnabled`).

---

### 14. Gutenberg Block Has No `deprecated` Entries
If attributes or the `save()` output ever change, existing posts will show block validation errors. There are no `deprecated` definitions to handle old markup gracefully.

**Fix:** Add a `deprecated` array to the block definition before any breaking structural change is shipped.

---

### 15. No Support for Custom Tunings
Only preset tunings (Standard, Drop D, Open G, etc.) are supported. Advanced players regularly use custom tunings.

**Fix:** Add a "Custom" tuning option in the block/shortcode that accepts a comma-separated note list.

---

### 16. No Chord Voicing Diagrams (Box View)
The current renderer shows all matching notes across the whole neck. There is no "chord box" / nut-position voicing view commonly found in chord charts.

**Fix:** Add a `view` attribute (`neck` / `chord-box`) and a separate render path for compact voicing diagrams.

---

### 17. No Note Highlighting on Hover
Currently clicking plays audio but there is no visual hover state. Users can't tell what they're about to click.

**Fix:** Add CSS `:hover` styles (or JS `mouseenter` handlers) to note circles.

---

### 18. Fret Range Not Validated
Shortcode `frets="0-24"` is split by `-` with no bounds check. Values like `frets="5-3"` (inverted range) or `frets="0-99"` will produce garbage renders or enormous SVGs.

**Fix:** Clamp `startFret` to 0–23, `endFret` to `startFret+1`–24 in PHP before passing to the frontend.

---

### 19. No Responsive / Mobile Scaling
The SVG has fixed pixel dimensions. On small screens or narrow columns it overflows its container.

**Fix:** Set `viewBox` and `width="100%"` instead of a fixed width so the SVG scales with its container.

---

### 20. i18n Text Domain Never Loads
The `languages/` directory does not exist. `load_plugin_textdomain()` silently fails.

**Fix:** Create the `languages/` directory and generate a `.pot` file with `wp i18n make-pot`. Add a `Text Domain` header line to `fretboard-explorer.php` if missing.

---

## Code Quality / DX

### 21. No Unit Tests
Zero test coverage on the music theory engine (note lookup, interval calculation, scale/chord generation) or the renderer output. Bugs like #4 and #5 above would be caught immediately by even minimal Jest tests.

**Fix:** Add `jest` (via `@wordpress/scripts` default config) and write tests for `music-theory.js` functions.

---

### 22. No ESLint / PHPCS
No linting config is present. JSX issues (#3), unused variables (#7), and PHP hook ordering issues (#1) would be surface by standard linting.

**Fix:** Add `.eslintrc` with `@wordpress/eslint-plugin` and a `phpcs.xml` with WordPress Coding Standards.

---

### 23. `build/` Is Committed to the Repo
Build artefacts in version control cause merge conflicts and obscure real diffs. The `build/` directory should be generated by CI.

**Fix:** Add `build/` to `.gitignore` and add a CI step (`npm run build`) before packaging.

---

### 24. `zip.sh` Is Fragile — No Version Pinning
`zip.sh` packages whatever is on disk without checking the build is fresh. A stale build gets shipped.

**Fix:** Make `zip.sh` run `npm run build` first, then package. Also inject the version from `package.json` into the zip filename automatically instead of hardcoding it.

---

### 25. Block Attributes Use CamelCase Inconsistently
Some attributes in `block.json` are camelCase (`startFret`, `endFret`, `numFrets`) but some shortcode attributes are snake_case (`fret_start`). This creates impedance when trying to pass the same config object from PHP to JS.

**Fix:** Normalise to camelCase throughout (or kebab-case if following WP conventions) and update the PHP shortcode parser accordingly.
