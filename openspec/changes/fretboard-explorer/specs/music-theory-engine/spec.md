## ADDED Requirements

### Requirement: Note Representation
The system SHALL represent musical notes using standard Western music notation (A-G with accidentals).

#### Scenario: Note naming convention
- **WHEN** a note at fret position is queried
- **THEN** the system SHALL return the correct note name (C, C#, D, D#, E, F, F#, G, G#, A, A#, B)

#### Scenario: Enharmonic equivalence
- **WHEN** a note is requested as sharp (e.g., C#)
- **THEN** the system SHALL recognize it as equivalent to Db when appropriate

### Requirement: Interval Calculation
The system SHALL calculate intervals between notes based on semitone distance.

#### Scenario: Octave equivalence
- **WHEN** calculating intervals within an octave
- **THEN** the system SHALL correctly identify that C to C is a perfect unison (0 semitones)

#### Scenario: Standard intervals
- **WHEN** calculating intervals from C
- **THEN** the system SHALL return: C→D = major 2nd (2 semitones), C→E = major 3rd (4 semitones), C→G = perfect 5th (7 semitones), C→B = major 7th (11 semitones)

### Requirement: Scale Definition and Calculation
The system SHALL define scales by their interval patterns and calculate all notes within a scale for any root note.

#### Scenario: Major scale pattern
- **WHEN** a major scale is requested for root "C"
- **THEN** the system SHALL return the notes: C, D, E, F, G, A, B (intervals: R, 2, 3, 4, 5, 6, 7)

#### Scenario: Minor pentatonic pattern
- **WHEN** a minor pentatonic scale is requested for root "A"
- **THEN** the system SHALL return the notes: A, C, D, E, G (intervals: R, b3, 4, 5, b7)

#### Scenario: Blues scale pattern
- **WHEN** a blues scale is requested for root "A"
- **THEN** the system SHALL return the notes: A, C, D, D#, E, G (intervals: R, b3, 4, b5, 5, b7)

#### Scenario: Scale calculation across all frets
- **WHEN** a scale is requested
- **THEN** the system SHALL calculate all instances of each scale tone across all 24 frets and 6 strings

### Requirement: Chord Definition and Calculation
The system SHALL define chord voicings by their interval patterns and find all positions of each chord tone on the fretboard.

#### Scenario: Open E major chord
- **WHEN** an open E major chord voicing is selected
- **THEN** the system SHALL identify notes E, B, E, G#, B at appropriate string/fret positions

#### Scenario: A minor barre chord
- **WHEN** an A minor barre chord voicing is selected
- **THEN** the system SHALL identify the root A at the designated barre position with notes A, C, E

#### Scenario: Jazz voicing
- **WHEN** a Cmaj7 voicing is selected
- **THEN** the system SHALL return notes C, E, G, B with appropriate fingering

### Requirement: Tuning Configuration
The system SHALL support multiple tuning presets and calculate note positions based on tuning.

#### Scenario: Standard 6-string guitar tuning
- **WHEN** tuning is "standard"
- **THEN** the open strings SHALL be: E2, A2, D3, G3, B3, E4 (low to high)

#### Scenario: Drop D tuning
- **WHEN** tuning is "drop-D"
- **THEN** the open strings SHALL be: D2, A2, D3, G3, B3, E4

#### Scenario: Standard 4-string bass tuning
- **WHEN** tuning is "standard-bass"
- **THEN** the open strings SHALL be: E1, A1, D2, G2

### Requirement: Standalone Module
The music theory engine SHALL be a standalone JavaScript module with no DOM or framework dependencies.

#### Scenario: Node.js compatibility
- **WHEN** the module is imported in Node.js
- **THEN** it SHALL export functions for note calculation, scale building, and chord voicing without errors

#### Scenario: No global side effects
- **WHEN** the module is loaded
- **THEN** it SHALL NOT modify any global objects or require any DOM elements
