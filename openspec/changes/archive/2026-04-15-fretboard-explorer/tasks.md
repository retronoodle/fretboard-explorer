## 1. Project Setup

- [x] 1.1 Initialize WordPress plugin structure in `wp-content/plugins/fretboard-explorer/`
- [x] 1.2 Set up `@wordpress/scripts` build tooling
- [x] 1.3 Create plugin entry point with header and initialization
- [x] 1.4 Set up CSS custom properties for theming foundation

## 2. Music Theory Engine

- [x] 2.1 Create `includes/js/music-theory.js` as standalone module
- [x] 2.2 Implement note representation (A-G with accidentals)
- [x] 2.3 Implement interval calculation (semitone-based)
- [x] 2.4 Implement scale definitions (major, minor pentatonic, blues, dorian, mixolydian, phrygian, whole tone, diminished, harmonic minor, melodic minor)
- [x] 2.5 Implement chord voicing library (open chords, barre shapes, jazz voicings)
- [x] 2.6 Implement tuning presets (standard, drop-D, open-G, standard-bass, 7-string)
- [x] 2.7 Implement scale note calculation across all fret positions
- [ ] 2.8 Write unit tests for music theory engine

## 3. SVG Fretboard Renderer

- [x] 3.1 Create `includes/js/fretboard-renderer.js`
- [x] 3.2 Implement base fretboard SVG generation (6-string, 15-fret default)
- [x] 3.3 Implement fret inlay dots at standard positions
- [x] 3.4 Implement note overlay rendering
- [x] 3.5 Implement root note distinct styling
- [x] 3.6 Implement label modes (intervals, note names)
- [x] 3.7 Implement theme system (dark, light, vintage)
- [x] 3.8 Implement orientation modes (horizontal, vertical)
- [x] 3.9 Implement left-handed mirror mode
- [x] 3.10 Implement configurable fret range (0-12, 0-24)

## 4. Gutenberg Block

- [x] 4.1 Register block type `fretboard-explorer/fretboard`
- [x] 4.2 Define block attributes (key, scale, chord, tuning, fretRange, orientation, handed, labels, theme, audioEnabled)
- [x] 4.3 Create block editor controls (dropdowns for key, scale, tuning, theme)
- [x] 4.4 Implement live preview in editor
- [x] 4.5 Implement block save/render for frontend
- [x] 4.6 Add block category and icon

## 5. Shortcode Fallback

- [x] 5.1 Register `[fretboard]` shortcode
- [x] 5.2 Implement shortcode attribute parsing
- [x] 5.3 Implement shortcode renderer calling fretboard renderer
- [ ] 5.4 Test shortcode in classic editor

## 6. Audio Playback

- [x] 6.1 Initialize Web Audio context on user interaction
- [x] 6.2 Implement click handler on note markers
- [x] 6.3 Implement oscillator-based tone generation
- [x] 6.4 Map note positions to frequencies
- [x] 6.5 Add audio enable/disable toggle
- [x] 6.6 Implement graceful degradation for unsupported browsers

## 7. Instrument Configurator

- [x] 7.1 Implement instrument type support (guitar, bass, 7-string)
- [x] 7.2 Implement tuning preset loading
- [x] 7.3 Add custom tuning input support

## 8. Polish & Deployment

- [x] 8.1 Mobile responsive testing and touch target sizing
- [x] 8.2 Conditional asset loading (only on pages with block/shortcode)
- [ ] 8.3 Create admin settings page for defaults
- [ ] 8.4 Write README with installation and usage instructions
- [ ] 8.5 Test on Guitar-Muse staging environment
- [ ] 8.6 Deploy to Guitar-Muse production
