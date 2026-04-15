## Context

The Fretboard Explorer is a WordPress plugin that provides interactive SVG-based fretboard visualizations. The target site (Guitar-Muse.com) currently uses static images or external embeds for fretboard diagrams, which break, look inconsistent, and send traffic off-site.

**Current State:**
- No existing fretboard visualization solution
- Static images require external tools (JGuitar, Fretboard.fyi) to generate
- No interactivity—readers cannot click notes to hear pitches

**Constraints:**
- Must work within WordPress/Gutenberg ecosystem
- Zero external dependencies on front end (no jQuery, no CDN calls)
- Mobile-friendly with touch support
- Audio must be opt-in (not annoying)

**Stakeholders:**
- Tim (Guitar-Muse / Velvet Creek Studio) — primary user and developer
- Guitar-Muse readers — interactive experience
- Other guitar bloggers — potential distribution

## Goals / Non-Goals

**Goals:**
- SVG-rendered fretboard with scale/chord overlay
- Built-in library of common scales and chords
- Gutenberg block with visual editor
- Shortcode fallback for non-block themes
- Web Audio click-to-hear for notes
- Multiple color themes and orientations
- Left-handed mode support

**Non-Goals:**
- Full DAW or recording functionality
- Tab editing or notation
- User accounts or saved configurations
- Backend storage beyond post attributes
- CDN-based audio samples (oscillator-only for MVP)

## Decisions

### 1. SVG-based rendering (over Canvas)

**Decision:** Use inline SVG for fretboard rendering.

**Rationale:** SVG scales crisply at any resolution, supports CSS styling, accessible to screen readers, and individual elements (notes, frets) are directly addressable for interactivity. Canvas would require manual hit-testing and redrawing.

**Alternative:** Canvas API — faster for animations but requires more boilerplate for interactivity.

### 2. Standalone music theory engine (not built into renderer)

**Decision:** Keep note/interval/scale/chord logic in a separate, framework-agnostic JS module.

**Rationale:** The music theory logic is the core domain logic and should be:
- Testable in isolation (Node.js, no WordPress)
- Reusable if this becomes a standalone web app
- Free of DOM/SVG dependencies

**Alternative:** Inline everything in the fretboard renderer — would couple domain logic to presentation.

### 3. Block attributes for configuration (not post meta)

**Decision:** Store fretboard configuration in block attributes within post content.

**Rationale:** No custom database tables, leverages WordPress's native block storage, portable across WordPress instances, works with the block editor natively.

**Alternative:** Custom post meta — adds database overhead and requires additional registration.

### 4. Web Audio API oscillator (not samples)

**Decision:** Use Web Audio API oscillator for MVP, defer sampled tones.

**Rationale:** Zero external audio files, works offline, smaller bundle size. Oscillator can produce basic guitar-like tones.

**Alternative:** Sampled audio — more realistic but adds 100s of KB of audio files.

### 5. Conditional asset loading

**Decision:** Only enqueue fretboard JS/CSS on pages that contain the block.

**Rationale:** WordPress best practice—don't load assets site-wide if only used on some pages.

**Alternative:** Site-wide enqueue — simpler but wastes resources.

## Risks / Trade-offs

- **Music theory bugs** → Mitigation: Comprehensive unit tests against known scale/chord references
- **Mobile touch targets too small** → Mitigation: 44px minimum tap targets, vertical orientation option, pinch-to-zoom
- **Audio annoying on mobile** → Mitigation: Audio OFF by default, user opts in with tap
- **Scope creep into DAW territory** → Mitigation: Hard MVP boundary, ship viewer first
- **Browser Web Audio support** → Mitigation: Graceful degradation (audio feature optional)

## Migration Plan

1. **Phase 1 — Development:** Build plugin in `/wp-content/plugins/fretboard-explorer/`
2. **Phase 2 — Testing:** Test on Guitar-Muse staging with real content
3. **Phase 3 — Deployment:** Activate plugin on Guitar-Muse, replace first batch of static images
4. **Phase 4 — Iteration:** Gather feedback, fix bugs, add stretch features

**Rollback:** Deactivate and delete plugin—no database changes to preserve.

## Open Questions

1. Should front-end readers toggle key/scale (interactive), or only see author's preset?
   - MVP: Author preset only; stretch: reader toggle
2. Publish to WordPress.org or keep exclusive to Guitar-Muse initially?
   - Default: Guitar-Muse only for now
3. Custom post type for standalone diagram library, or purely inline?
   - Default: Inline only; post type is stretch
4. Pricing model if distributed (freemium)?
   - Defer until distribution decision made
