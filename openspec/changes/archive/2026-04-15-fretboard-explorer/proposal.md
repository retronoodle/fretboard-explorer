## Why

Guitar content sites rely on static images or external embeds (JGuitar, Fretboard.fyi) to show fretboard diagrams. These break, look inconsistent, can't be customized, and send traffic away from the site. Writers waste time generating screenshots instead of writing. Readers can't experiment—they just stare at a picture.

## What Changes

- **Interactive SVG Fretboard**: SVG-rendered fretboard (responsive, crisp at any size) with configurable fret range (0-15 default, expandable to 24)
- **Scale & Chord Library**: Built-in library of scales (major, minor pentatonic, blues, dorian, etc.) and chords (open, barre, jazz voicings)
- **Gutenberg Block**: Visual editor with dropdowns for key, scale/chord, tuning, fret range, color theme
- **Shortcode Fallback**: `[fretboard key="A" scale="minor-pentatonic" tuning="standard" frets="0-12"]`
- **Web Audio Playback**: Click any note dot to hear the pitch
- **Theming & Customization**: Light, dark, vintage themes; left-handed mode; horizontal/vertical orientation
- **Multi-Instrument Support**: 6-string guitar (default), 4-string bass, 7-string, custom tuning

## Capabilities

### New Capabilities

- `fretboard-renderer`: SVG rendering engine for fretboard visualization with note overlay, theming, and responsive scaling
- `music-theory-engine`: JavaScript module for note/interval/scale/chord math, tuning calculations—standalone and testable
- `gutenberg-block`: WordPress Gutenberg block with visual editor, preview, and attribute storage
- `shortcode-fallback`: WordPress shortcode `[fretboard ...]` for non-block themes
- `audio-playback`: Web Audio API integration for click-to-hear note playback
- `instrument-configurator`: Support for multiple instruments (guitar, bass) and custom tunings

### Modified Capabilities

- (none)

## Impact

- **New plugin**: `fretboard-explorer` WordPress plugin in `/wp-content/plugins/fretboard-explorer/`
- **Music theory engine**: Standalone JS module at `includes/js/music-theory.js`—testable outside WordPress
- **SVG generation**: Pure functions `(config) → SVG markup` in `includes/js/fretboard-renderer.js`
- **WordPress integration**: Block registration and shortcode handlers in `includes/`
- **No database changes**: Configuration stored in block attributes (post content)
- **Dependencies**: @wordpress/scripts toolchain, Web Audio API (browser-native)
