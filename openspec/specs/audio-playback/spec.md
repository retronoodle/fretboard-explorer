## ADDED Requirements

### Requirement: Click-to-Play Audio
The system SHALL allow users to click on note markers to hear the corresponding pitch.

#### Scenario: Note click triggers audio
- **WHEN** a user clicks or taps on a note marker
- **THEN** the system SHALL produce an audio tone corresponding to that note's pitch

#### Scenario: Different notes produce different pitches
- **WHEN** the user clicks on an A4 note marker
- **THEN** the system SHALL produce a 440 Hz tone
- **AND WHEN** the user clicks on an E4 note marker
- **THEN** the system SHALL produce a approximately 329.63 Hz tone

### Requirement: Audio Opt-in
The system SHALL have audio disabled by default, requiring user interaction to enable.

#### Scenario: Audio disabled by default
- **WHEN** a fretboard is first displayed
- **THEN** audio SHALL be disabled (no sound on note hover/click until enabled)

#### Scenario: Audio enable control
- **WHEN** audio is disabled
- **THEN** the system SHALL display an audio enable button/icon
- **AND WHEN** the user taps the enable button
- **THEN** audio SHALL be enabled for subsequent interactions

### Requirement: Web Audio API Oscillator
The system SHALL use Web Audio API oscillator for tone generation.

#### Scenario: Oscillator-based synthesis
- **WHEN** a note is played
- **THEN** the system SHALL use Web Audio API OscillatorNode to generate the tone

#### Scenario: Guitar-like timbre
- **WHEN** a note is played
- **THEN** the oscillator SHALL use a slightly modified waveform (e.g., triangle or filtered sawtooth) to approximate guitar timbre

### Requirement: Graceful Degradation
The system SHALL gracefully degrade when Web Audio API is not available.

#### Scenario: No Web Audio support
- **WHEN** the browser does not support Web Audio API
- **THEN** audio features SHALL be disabled without errors
- **AND** the visual fretboard SHALL still function normally
