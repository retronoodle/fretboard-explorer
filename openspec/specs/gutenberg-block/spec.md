## ADDED Requirements

### Requirement: Gutenberg Block Registration
The system SHALL register a "Fretboard Explorer" block type with WordPress Gutenberg.

#### Scenario: Block registration
- **WHEN** the plugin is activated
- **THEN** a block type named "fretboard-explorer/fretboard" SHALL be registered with WordPress

#### Scenario: Block category
- **WHEN** the block appears in the Gutenberg inserter
- **THEN** it SHALL appear under the "Embeds" or "Common Blocks" category

### Requirement: Block Attributes
The system SHALL define and store block configuration as JSON attributes.

#### Scenario: Default attributes
- **WHEN** a new fretboard block is inserted
- **THEN** it SHALL have default attributes: key="C", scale="major", chord=null, tuning="standard", fretRange=[0, 12], orientation="horizontal", handed="right", labels="intervals", theme="dark", audioEnabled=false

#### Scenario: Attribute persistence
- **WHEN** block attributes are changed in the editor
- **THEN** the attributes SHALL be saved as JSON in the post content when the post is saved

### Requirement: Visual Editor Controls
The system SHALL provide a visual editor interface with dropdowns and controls.

#### Scenario: Key selection dropdown
- **WHEN** the block is selected in the editor
- **THEN** a dropdown SHALL be displayed allowing selection of root key from: C, C#, D, D#, E, F, F#, G, G#, A, A#, B

#### Scenario: Scale/chord selection
- **WHEN** the block is selected in the editor
- **THEN** a dropdown SHALL be displayed allowing selection from built-in scales and chords

#### Scenario: Tuning selection
- **WHEN** the block is selected in the editor
- **THEN** a dropdown SHALL be displayed allowing selection of tuning preset

#### Scenario: Fret range control
- **WHEN** the block is selected in the editor
- **THEN** controls SHALL be displayed allowing selection of fret range start and end

#### Scenario: Theme selection
- **WHEN** the block is selected in the editor
- **THEN** a dropdown or button group SHALL be displayed for selecting color theme

### Requirement: Live Preview
The system SHALL render a live preview of the fretboard within the Gutenberg editor.

#### Scenario: Preview updates on attribute change
- **WHEN** any block attribute is changed
- **THEN** the fretboard preview SHALL update immediately to reflect the new configuration

### Requirement: Block Renderer in Frontend
The system SHALL render the fretboard as static HTML/JS on the frontend from block attributes.

#### Scenario: Frontend rendering
- **WHEN** a post containing a fretboard block is viewed on the frontend
- **THEN** the system SHALL render the SVG fretboard with the configured notes and styling
