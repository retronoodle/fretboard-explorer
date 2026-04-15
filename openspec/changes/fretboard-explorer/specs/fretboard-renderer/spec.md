## ADDED Requirements

### Requirement: SVG Fretboard Rendering
The system SHALL render a fretboard using inline SVG that scales crisply at any display size.

#### Scenario: Render standard 6-string fretboard
- **WHEN** a fretboard configuration is provided with 6 strings and frets 0-15
- **THEN** the system SHALL produce SVG markup representing the fretboard with 6 strings, 16 frets (0-15), nut at fret 0, and dot inlays at frets 3, 5, 7, 9, 12, 15

#### Scenario: Fret range configuration
- **WHEN** fret range is set to "0-24"
- **THEN** the system SHALL render 25 frets (0-24) with appropriate inlay positions at frets 3, 5, 7, 9, 12, 15, 17, 19, 21, 24

#### Scenario: Responsive scaling
- **WHEN** the fretboard SVG is displayed at different container widths (300px, 600px, 1200px)
- **THEN** the SVG SHALL scale proportionally without blurriness or pixelation

### Requirement: Note Overlay Display
The system SHALL overlay note markers on the fretboard at positions defined by the current scale or chord.

#### Scenario: Display notes for A minor pentatonic
- **WHEN** the scale is set to "A minor pentatonic" with tuning "standard"
- **THEN** the system SHALL highlight the notes A, C, D, E, G across all frets and strings with distinct styling

#### Scenario: Root note distinction
- **WHEN** notes are displayed for any scale or chord
- **THEN** the root note SHALL be displayed with a distinct color and/or larger marker than other notes

#### Scenario: Interval label mode
- **WHEN** label display is set to "intervals"
- **THEN** each note marker SHALL display its interval (R, 2, b3, 3, 4, b5, 5, #5, 6, b7, 7)

#### Scenario: Note name label mode
- **WHEN** label display is set to "note-names"
- **THEN** each note marker SHALL display its note name (C, D, E, F, G, A, B)

### Requirement: Theme Support
The system SHALL support multiple color themes via CSS custom properties.

#### Scenario: Dark theme
- **WHEN** theme is set to "dark"
- **THEN** the fretboard SHALL use dark background (#1a1a2e), light wood (#d4a574) for fretboard, and accent colors for notes

#### Scenario: Light theme
- **WHEN** theme is set to "light"
- **THEN** the fretboard SHALL use light background (#ffffff), light wood (#f5deb3) for fretboard, and standard accent colors

#### Scenario: Vintage theme
- **WHEN** theme is set to "vintage"
- **THEN** the fretboard SHALL use parchment background (#f4e4bc), dark wood (#8b4513) for fretboard

### Requirement: Orientation Modes
The system SHALL support horizontal (default) and vertical fretboard orientation.

#### Scenario: Horizontal orientation
- **WHEN** orientation is set to "horizontal"
- **THEN** strings SHALL run left-to-right and frets top-to-bottom

#### Scenario: Vertical orientation
- **WHEN** orientation is set to "vertical"
- **THEN** strings SHALL run top-to-bottom and frets left-to-right

### Requirement: Left-handed Mode
The system SHALL support left-handed players by mirroring the fretboard horizontally.

#### Scenario: Left-handed rendering
- **WHEN** handedness is set to "left"
- **THEN** the fretboard SHALL be mirrored horizontally so the low E string is on the right
