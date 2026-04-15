# Fretboard Explorer - Code Review

**Date:** 2026-04-15  
**Plugin Version:** 1.0.0

---

## Executive Summary

The Fretboard Explorer plugin provides interactive SVG fretboard visualizations for guitar education websites. It has a solid JavaScript architecture with well-separated music theory and rendering modules, but suffers from **several integration bugs** that prevent it from working correctly in WordPress.

**Overall Assessment:** Mid-development state - core logic is functional but WordPress integration has critical gaps.

---

## Critical Issues

### 1. Block Registration Function Never Hooked

**File:** `fretboard-explorer.php:64-66`

```php
function fretboard_explorer_register_block() {
    register_block_type( FRETTBOARD_EXPLORER_DIR . '/build' );
}
```

**Problem:** This function is defined but never connected to an action hook. The Gutenberg block will not be registered.

**Fix:**
```php
add_action( 'init', 'fretboard_explorer_register_block' );
```

---

### 2. Missing `fretboard-renderer.js` in `src/` Directory

**File:** `src/index.js:9` and `src/index.js:236`

```javascript
import { render } from './fretboard-renderer.js';
// ...
const { render } = await import('./fretboard-renderer.js');
```

**Problem:** The source file `src/fretboard-renderer.js` does not exist. The file only exists at `includes/js/fretboard-renderer.js`. This will cause:
- Build failures, or
- Broken output if the import silently fails

**Fix:** Either:
1. Create `src/fretboard-renderer.js` as a copy/alias of `includes/js/fretboard-renderer.js`, or
2. Update the imports to point to the correct path

---

### 3. Dynamic Import at Top Level

**File:** `src/index.js:236`

```javascript
const { render } = await import('./fretboard-renderer.js');
document.querySelectorAll('.fretboard-block').forEach(container => {
```

**Problem:** This code executes on module load, not conditionally when needed. It runs even in the admin block editor context where frontend rendering isn't needed.

**Fix:** Move this to a conditional initialization or lazy-load it only when rendering is actually needed.

---

### 4. Missing `style.css` Referenced in `block.json`

**File:** `build/block.json:15`

```json
"style": "file:./style.css"
```

**Problem:** `build/style.css` does not exist. Only `build/index.css` exists. The block will have missing styles.

**Fix:** Update `block.json` to reference `file:./index.css` instead.

---

## Minor Issues

### 5. Typo in Plugin Constants

**File:** `fretboard-explorer.php:21`

```php
define( 'FRETTBOARD_EXPLORER_VERSION', '1.0.0' );  // Double "TT" in FRETTBOARD
```

**Problem:** Constant name has double "TT" (`FRETTBOARD`) which doesn't match the plugin name "Fretboard". Likely a copy-paste error from a template.

**Note:** This isn't a breaking bug but indicates incomplete editing.

---

### 6. Redundant Asset Registration Pattern

**File:** `fretboard-explorer.php:43-58` vs `fretboard-explorer.php:134-139`

```php
// Registers assets only
function fretboard_explorer_enqueue_assets() {
    wp_register_script( 'fretboard-explorer-frontend', ... );
    wp_register_style( 'fretboard-explorer-frontend', ... );
}

// Enqueues registered assets
function fretboard_explorer_conditional_enqueue() {
    wp_enqueue_script( 'fretboard-explorer-frontend' );
    wp_enqueue_style( 'fretboard-explorer-frontend' );
}
```

**Problem:** Two separate hooks with different priorities (default vs 5) create confusion. The intent is unclear - registering vs enqueueing are separate concerns.

**Recommendation:** Consolidate into a single function that checks for block/shortcode presence before enqueueing.

---

### 7. Incomplete Audio Implementation

**Problem:** Audio playback via Web Audio API exists in `fretboard-renderer.js` but:
- No UI control to enable/disable audio
- `audioEnabled` attribute exists in block config but has no UI in the block inspector
- Users cannot access this functionality

---

### 8. Non-existent Languages Directory

**File:** `fretboard-explorer.php:33`

```php
load_plugin_textdomain( ..., dirname( FRETTBOARD_EXPLORER_BASENAME ) . '/languages/' );
```

**Problem:** The `languages/` directory doesn't exist. The text domain loading will silently fail. No internationalization support.

---

## Architecture Assessment

| Aspect | Rating | Notes |
|--------|--------|-------|
| **Pattern** | Moderate | Plain procedural PHP, not MVC |
| **JS Separation** | Good | Music theory, renderer, and frontend are properly separated |
| **PHP Organization** | Poor | All logic in single 140-line file |
| **WordPress Best Practices** | Partial | Missing proper hooks, inconsistent asset loading |
| **Testability** | Good | Music theory module is standalone and testable |

---

## File Structure

```
fretboard-explorer/
├── fretboard-explorer.php      # Main plugin file (Bootstrap)
├── includes/js/
│   ├── fretboard-renderer.js   # SVG rendering engine
│   ├── frontend.js             # Frontend initialization  
│   └── music-theory.js         # Music theory calculations
├── src/
│   ├── index.js                # Gutenberg block registration (BROKEN IMPORTS)
│   └── editor.scss             # Block editor styles
├── build/                      # Build output
│   ├── block.json              # Block manifest (MISSING style.css)
│   ├── index.css               # Compiled CSS
│   └── index.js                # Compiled block JS
└── package.json
```

---

## Recommendations

1. **Immediate (Blocking):** Hook `fretboard_explorer_register_block()` to `init` action
2. **Immediate (Blocking):** Fix import paths in `src/index.js` or create the missing source file
3. **Immediate (Blocking):** Update `block.json` to reference existing CSS file
4. **High Priority:** Create `languages/` directory or remove text domain loading
5. **Medium Priority:** Consolidate asset registration/enqueueing logic
6. **Low Priority:** Add audio toggle UI, fix constant naming convention

---

## Test Commands

To verify the build works:
```bash
cd wp-content/plugins/fretboard-explorer && npm install && npm run build
```

To check WordPress block registration (requires WP_DEBUG):
```php
// Add to wp-config.php
add_filter('rest_pre_dispatch', function($response) {
    var_dump($response);
    return $response;
}, 10, 3);
```
