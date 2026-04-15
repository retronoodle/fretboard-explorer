# Fretboard Explorer — Product Requirements Document

**Author:** Tim (Velvet Creek Studio / Guitar-Muse.com)  
**Date:** April 15, 2026  
**Status:** Draft v1

---

## Vision

An interactive, embeddable fretboard visualization tool for WordPress that lets guitar players explore scales, chords, intervals, and note positions directly inside blog posts and pages. Built as a native Gutenberg block with shortcode fallback.

## Problem

Guitar content sites rely on static images or external embeds (JGuitar, Fretboard.fyi) to show fretboard diagrams. These break, look inconsistent, can't be customized, and send traffic away from the site. Writers waste time generating screenshots instead of writing. Readers can't experiment — they just stare at a picture.

## Target Users

| Persona | Needs |
|---|---|
| **Guitar-Muse readers** | Visualize concepts from articles, experiment with scales/chords interactively |
| **Guitar-Muse (Tim)** | Embed rich fretboard diagrams in posts without leaving WordPress, drive engagement and time-on-page |
| **Other guitar bloggers** | Drop-in plugin for their own WP sites (distribution opportunity) |
| **Guitar teachers** | Create lesson pages with interactive diagrams students can manipulate |

## Core Features (MVP)

### 1. Interactive Fretboard Display
- SVG-rendered fretboard (responsive, crisp at any size)
- Configurable fret range (default: frets 0–15, expandable to 24)
- Supports 6-string guitar (default), 4-string bass, 7-string, and custom tuning
- Dot inlays on standard fret positions
- Nut and fret wire styling that looks like an actual fretboard

### 2. Scale & Chord Overlay
- Built-in library of common scales: major, natural/harmonic/melodic minor, pentatonic (major & minor), blues, dorian, mixolydian, phrygian, whole tone, diminished
- Built-in chord voicing library: open chords, barre shapes, common jazz voicings
- Root note highlighted distinctly (different color/size)
- Interval labels toggle: show note names (C, D, E…) OR intervals (R, 2, b3, 3…) OR both
- Click any note dot to hear the pitch (Web Audio API — simple sine/guitar tone)

### 3. Gutenberg Block + Shortcode
- **Block:** Visual editor with dropdowns for key, scale/chord, tuning, fret range, color theme
- **Shortcode fallback:** `[fretboard key="A" scale="minor-pentatonic" tuning="standard" frets="0-12"]`
- Block preview renders the actual fretboard in the editor

### 4. Customization
- Color themes: light, dark, vintage (parchment), or custom via CSS variables
- Left-handed mode (mirror the fretboard)
- Orientation: horizontal (default) or vertical
- Label display: note names, intervals, scale degrees, or none
- Fret number display toggle

## Stretch Features (Post-MVP)

- **Custom note highlighting:** Author picks arbitrary notes/fret positions to light up (for article-specific diagrams)
- **Comparison mode:** Two fretboards side-by-side (e.g., "A minor pentatonic vs A dorian — spot the difference")
- **CAGED overlay:** Show CAGED shape outlines across the neck
- **Progression builder:** Chain multiple chord voicings into a sequence with playback
- **Export:** Download current view as PNG or SVG for use in print/PDFs
- **Ear training mode:** Play a note, highlight where it lives on the fretboard
- **User interaction:** Let readers toggle scales/keys themselves on the front end (not just view author's preset)
- **Bass mode:** Full support for 4/5-string bass with appropriate note range and tuning presets (Tim plays bass — this matters)

## Technical Approach

| Layer | Tech |
|---|---|
| Rendering | SVG via React (block editor) and vanilla JS (front end) |
| Audio | Web Audio API — oscillator for MVP, sampled tones later |
| Music theory engine | JS module: note/interval/scale/chord math, tuning calculations |
| WordPress integration | `@wordpress/scripts` toolchain, register block + shortcode |
| Data | JSON config files for scales, chords, tunings — no database needed |
| Styling | CSS custom properties for theming, scoped to block container |

### Architecture Notes
- Zero external dependencies on the front end (no jQuery, no CDN calls)
- All music theory logic in a standalone JS module — testable outside WordPress, reusable if this ever becomes a standalone web app
- SVG generation is pure functions: `(config) → SVG markup` — easy to unit test
- Block stores configuration as block attributes in post content (no custom tables)
- Front-end JS only loads on pages that contain the block (conditional enqueue)

## Data Model

No database tables. Everything lives in block attributes:

```json
{
  "key": "A",
  "scale": "minor-pentatonic",
  "chord": null,
  "tuning": "standard",
  "fretRange": [0, 12],
  "orientation": "horizontal",
  "handed": "right",
  "labels": "intervals",
  "theme": "dark",
  "audioEnabled": true,
  "highlightedNotes": []
}
```

Scale/chord definitions ship as static JSON bundled with the plugin.

## Success Metrics

| Metric | Target |
|---|---|
| Time on page (Guitar-Muse posts with fretboard) | +30% vs static image posts |
| Plugin installs (if published to WP.org) | 500 in first 6 months |
| Fretboard interactions per session | 3+ clicks/taps per visitor |
| Page load impact | < 50kb JS + CSS, < 100ms render |

## Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Music theory engine bugs (wrong notes) | Comprehensive unit tests against known scale/chord references; beta test with Guitar-Muse readers |
| Mobile touch targets too small | Minimum 44px tap targets; pinch-to-zoom on fretboard; vertical orientation option |
| Scope creep into full DAW territory | Hard MVP boundary — ship scale/chord viewer first, resist adding recording/tab editing |
| Audio annoying on mobile | Audio off by default; user opts in with tap |

## MVP Milestones

| Phase | Scope | Estimate |
|---|---|---|
| **1 — Theory Engine** | JS module: notes, intervals, scales, chords, tunings | 2–3 days |
| **2 — SVG Renderer** | Fretboard drawing, note overlay, theming | 2–3 days |
| **3 — WordPress Block** | Gutenberg integration, shortcode, conditional loading | 2 days |
| **4 — Audio** | Web Audio click-to-hear | 1 day |
| **5 — Polish & Ship** | Mobile testing, Guitar-Muse deployment, README | 1–2 days |

**Total estimate: ~10 days of focused work**

## Open Questions

1. Should front-end readers be able to change the key/scale (interactive), or only see the author's preset? (MVP: author preset only, stretch: reader toggle)
2. Publish to WordPress.org plugin directory, or keep it exclusive to Guitar-Muse initially?
3. Worth building a "fretboard diagram" custom post type for a standalone diagram library, or keep it purely inline?
4. Pricing model if distributed: freemium (basic scales free, chord voicings + audio = pro)?

---

*Built for Guitar-Muse.com by Velvet Creek Studio. Let's make every fretboard diagram on the internet look like garbage by comparison.*