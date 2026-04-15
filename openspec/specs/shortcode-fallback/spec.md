## ADDED Requirements

### Requirement: Shortcode Registration
The system SHALL register a WordPress shortcode `[fretboard]` that renders a fretboard.

#### Scenario: Basic shortcode registration
- **WHEN** the plugin is activated
- **THEN** the shortcode `[fretboard]` SHALL be registered with WordPress

#### Scenario: Shortcode renders fretboard
- **WHEN** the shortcode `[fretboard key="A" scale="minor-pentatonic"]` is used in post content
- **THEN** the system SHALL render an SVG fretboard showing A minor pentatonic

### Requirement: Shortcode Attributes
The system SHALL support shortcode attributes matching block attributes.

#### Scenario: Key attribute
- **WHEN** attribute `key="D"` is provided
- **THEN** the rendered fretboard SHALL use D as the root note

#### Scenario: Scale attribute
- **WHEN** attribute `scale="blues"` is provided
- **THEN** the rendered fretboard SHALL display the blues scale

#### Scenario: Chord attribute
- **WHEN** attribute `chord="em"` is provided
- **THEN** the rendered fretboard SHALL display E minor chord voicing

#### Scenario: Tuning attribute
- **WHEN** attribute `tuning="drop-D"` is provided
- **THEN** the rendered fretboard SHALL use drop-D tuning

#### Scenario: Fret range attribute
- **WHEN** attribute `frets="5-17"` is provided
- **THEN** the rendered fretboard SHALL display frets 5 through 17

#### Scenario: Theme attribute
- **WHEN** attribute `theme="light"` is provided
- **THEN** the rendered fretboard SHALL use the light color theme

### Requirement: Shortcode with All Attributes
The system SHALL render correctly when all attributes are provided.

#### Scenario: Full shortcode
- **WHEN** `[fretboard key="G" scale="dorian" tuning="standard" frets="0-12" theme="dark" labels="intervals" orientation="horizontal" handed="right"]` is used
- **THEN** the system SHALL render a G dorian scale fretboard with all specified settings
