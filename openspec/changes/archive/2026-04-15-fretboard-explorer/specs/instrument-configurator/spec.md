## ADDED Requirements

### Requirement: Multiple Instrument Support
The system SHALL support different instrument types with appropriate string count and range.

#### Scenario: 6-string guitar
- **WHEN** instrument type is "guitar" or not specified
- **THEN** the system SHALL render a 6-string fretboard

#### Scenario: 4-string bass
- **WHEN** instrument type is "bass"
- **THEN** the system SHALL render a 4-string fretboard with appropriate note range (lower pitched)

#### Scenario: 7-string guitar
- **WHEN** instrument type is "guitar-7"
- **THEN** the system SHALL render a 7-string fretboard

### Requirement: Tuning Presets
The system SHALL provide preset tuning configurations.

#### Scenario: Standard guitar tuning preset
- **WHEN** tuning is "standard"
- **THEN** the open strings SHALL be E2, A2, D3, G3, B3, E4

#### Scenario: Drop D tuning preset
- **WHEN** tuning is "drop-D"
- **THEN** the low E string SHALL be tuned to D2

#### Scenario: Open G tuning preset
- **WHEN** tuning is "open-G"
- **THEN** the open strings SHALL be D2, G2, D3, G3, B3, D4

#### Scenario: Standard bass tuning preset
- **WHEN** tuning is "standard-bass"
- **THEN** the open strings SHALL be E1, A1, D2, G2

### Requirement: Custom Tuning Input
The system SHALL allow users to specify custom tuning.

#### Scenario: Custom tuning via block attribute
- **WHEN** the tuning attribute is set to a comma-separated list of note names
- **THEN** the fretboard SHALL use those notes for the open strings

#### Scenario: Custom tuning via shortcode
- **WHEN** shortcode attribute `tuning="D2,G2,D3,G3,B3,D4"` is provided
- **THEN** the fretboard SHALL render with open strings tuned to D2, G2, D3, G3, B3, D4
