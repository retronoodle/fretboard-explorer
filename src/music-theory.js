/**
 * Music Theory Engine - Standalone Module
 * Handles note representation, intervals, scales, chords, and tuning calculations
 */

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const ENHARMONIC_MAP = {
    'Db': 'C#',
    'Eb': 'D#',
    'Fb': 'E',
    'Gb': 'F#',
    'Ab': 'G#',
    'Bb': 'A#',
    'Cb': 'B'
};

function noteToMidi(note) {
    const noteName = note.replace(/[0-9]/g, '');
    const octave = parseInt(note.match(/[0-9]+/)?.[0] || '4');
    const noteIndex = NOTES.indexOf(noteName);
    if (noteIndex === -1) {
        const enharmonic = ENHARMONIC_MAP[noteName];
        if (enharmonic) {
            return noteToMidi(enharmonic + octave);
        }
        throw new Error(`Unknown note: ${note}`);
    }
    return noteIndex + (octave + 1) * 12;
}

function midiToNote(midi) {
    const octave = Math.floor(midi / 12) - 1;
    const noteIndex = midi % 12;
    return NOTES[noteIndex] + octave;
}

function getNoteAtPosition(stringIndex, fret, tuning) {
    const openNote = tuning[stringIndex];
    const openMidi = noteToMidi(openNote);
    return midiToNote(openMidi + fret);
}

function getNoteIndex(noteName) {
    const index = NOTES.indexOf(noteName);
    if (index === -1) {
        const enharmonic = ENHARMONIC_MAP[noteName];
        if (enharmonic) {
            return NOTES.indexOf(enharmonic);
        }
        throw new Error(`Unknown note: ${noteName}`);
    }
    return index;
}

function getIntervalSemitones(note1, note2) {
    const note1Midi = noteToMidi(note1);
    const note2Midi = noteToMidi(note2);
    let diff = note2Midi - note1Midi;
    if (diff < 0) {
        diff += 12;
    }
    return diff;
}

function getIntervalName(semitones) {
    const intervals = {
        0: 'R',
        1: 'b2',
        2: '2',
        3: 'b3',
        4: '3',
        5: '4',
        6: 'b5',
        7: '5',
        8: '#5',
        9: '6',
        10: 'b7',
        11: '7'
    };
    return intervals[semitones] || `${semitones} st`;
}

function transposeNote(note, semitones) {
    const noteName = note.replace(/[0-9]/g, '');
    const octave = parseInt(note.match(/[0-9]+/)?.[0] || '4');
    const noteIndex = getNoteIndex(noteName);
    const newIndex = (noteIndex + semitones) % 12;
    return NOTES[newIndex] + octave;
}

const SCALES = {
    'major': [0, 2, 4, 5, 7, 9, 11],
    'minor': [0, 2, 3, 5, 7, 8, 10],
    'minor-pentatonic': [0, 3, 5, 7, 10],
    'major-pentatonic': [0, 2, 4, 7, 9],
    'blues': [0, 3, 5, 6, 7, 10],
    'dorian': [0, 2, 3, 5, 7, 9, 10],
    'mixolydian': [0, 2, 4, 5, 7, 9, 10],
    'phrygian': [0, 1, 3, 5, 7, 8, 10],
    'whole-tone': [0, 2, 4, 6, 8, 10],
    'diminished': [0, 2, 3, 5, 6, 8, 9, 11],
    'harmonic-minor': [0, 2, 3, 5, 7, 8, 11],
    'melodic-minor': [0, 2, 3, 5, 7, 9, 11],
    'chromatic': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
};

function getScaleNotes(rootNote, scaleName) {
    const intervals = SCALES[scaleName];
    if (!intervals) {
        throw new Error(`Unknown scale: ${scaleName}`);
    }
    return intervals.map(interval => transposeNote(rootNote, interval));
}

function getScalePositions(rootNote, scaleName, tuning, numFrets = 24) {
    const scaleNotes = getScaleNotes(rootNote, scaleName);
    const scaleNoteIndices = scaleNotes.map(n => getNoteIndex(n.replace(/[0-9]/g, '')));
    const rootNoteIndex = getNoteIndex(rootNote.replace(/[0-9]/g, ''));
    const positions = [];

    for (let stringIdx = 0; stringIdx < tuning.length; stringIdx++) {
        for (let fret = 0; fret <= numFrets; fret++) {
            const note = getNoteAtPosition(stringIdx, fret, tuning);
            const noteIdx = getNoteIndex(note.replace(/[0-9]/g, ''));
            if (scaleNoteIndices.includes(noteIdx)) {
                const interval = getIntervalSemitones(rootNote, note);
                positions.push({
                    string: stringIdx,
                    fret: fret,
                    note: note,
                    interval: getIntervalName(interval),
                    isRoot: noteIdx === rootNoteIndex
                });
            }
        }
    }
    return positions;
}

const CHORD_PATTERNS = {
    'major': [0, 4, 7],
    'minor': [0, 3, 7],
    'diminished': [0, 3, 6],
    'augmented': [0, 4, 8],
    'major-7': [0, 4, 7, 11],
    'minor-7': [0, 3, 7, 10],
    'dominant-7': [0, 4, 7, 10],
    'major-9': [0, 4, 7, 11, 14],
    'minor-9': [0, 3, 7, 10, 14],
    'dominant-9': [0, 4, 7, 10, 14],
    'sus2': [0, 2, 7],
    'sus4': [0, 5, 7],
    'power': [0, 7]
};

function getChordNotes(rootNote, chordType) {
    const intervals = CHORD_PATTERNS[chordType];
    if (!intervals) {
        throw new Error(`Unknown chord type: ${chordType}`);
    }
    return intervals.map(interval => transposeNote(rootNote, interval));
}

function getChordPositions(rootNote, chordType, tuning, numFrets = 24) {
    const chordNotes = getChordNotes(rootNote, chordType);
    const chordNoteIndices = chordNotes.map(n => getNoteIndex(n.replace(/[0-9]/g, '')));
    const rootNoteIndex = getNoteIndex(rootNote.replace(/[0-9]/g, ''));
    const positions = [];

    for (let stringIdx = 0; stringIdx < tuning.length; stringIdx++) {
        for (let fret = 0; fret <= numFrets; fret++) {
            const note = getNoteAtPosition(stringIdx, fret, tuning);
            const noteIdx = getNoteIndex(note.replace(/[0-9]/g, ''));
            if (chordNoteIndices.includes(noteIdx)) {
                const interval = getIntervalSemitones(rootNote, note);
                positions.push({
                    string: stringIdx,
                    fret: fret,
                    note: note,
                    interval: getIntervalName(interval),
                    isRoot: noteIdx === rootNoteIndex
                });
            }
        }
    }
    return positions;
}

const TUNING_PRESETS = {
    'standard': ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'],
    'drop-D': ['D2', 'A2', 'D3', 'G3', 'B3', 'E4'],
    'open-G': ['D2', 'G2', 'D3', 'G3', 'B3', 'D4'],
    'standard-bass': ['E1', 'A1', 'D2', 'G2'],
    '7-string': ['B1', 'E2', 'A2', 'D3', 'G3', 'B3', 'E4'],
    'drop-D-7': ['D2', 'A2', 'D3', 'G3', 'B3', 'E4', 'A4']
};

function getTuning(presetName) {
    const tuning = TUNING_PRESETS[presetName];
    if (!tuning) {
        throw new Error(`Unknown tuning preset: ${presetName}`);
    }
    return tuning;
}

function parseCustomTuning(tuningString) {
    return tuningString.split(',').map(s => s.trim());
}

function noteToFrequency(note) {
    const midi = noteToMidi(note);
    return 440 * Math.pow(2, (midi - 69) / 12);
}

export {
    NOTES,
    ENHARMONIC_MAP,
    noteToMidi,
    midiToNote,
    getNoteAtPosition,
    getNoteIndex,
    getIntervalSemitones,
    getIntervalName,
    transposeNote,
    SCALES,
    getScaleNotes,
    getScalePositions,
    CHORD_PATTERNS,
    getChordNotes,
    getChordPositions,
    TUNING_PRESETS,
    getTuning,
    parseCustomTuning,
    noteToFrequency
};