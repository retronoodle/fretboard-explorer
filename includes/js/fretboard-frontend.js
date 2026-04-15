/**
 * Fretboard Explorer - Frontend Script (self-contained, no WordPress dependencies)
 */
(function() {
    'use strict';

    // --- Music Theory ---

    var NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    var ENHARMONIC_MAP = { 'Db':'C#','Eb':'D#','Fb':'E','Gb':'F#','Ab':'G#','Bb':'A#','Cb':'B' };

    var SCALES = {
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

    var CHORD_PATTERNS = {
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

    var TUNING_PRESETS = {
        'standard': ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'],
        'drop-D': ['D2', 'A2', 'D3', 'G3', 'B3', 'E4'],
        'open-G': ['D2', 'G2', 'D3', 'G3', 'B3', 'D4'],
        'standard-bass': ['E1', 'A1', 'D2', 'G2'],
        '7-string': ['B1', 'E2', 'A2', 'D3', 'G3', 'B3', 'E4'],
        'drop-D-7': ['D2', 'A2', 'D3', 'G3', 'B3', 'E4', 'A4']
    };

    function noteToMidi(note) {
        var noteName = note.replace(/[0-9]/g, '');
        var octave = parseInt((note.match(/[0-9]+/) || ['4'])[0]);
        var noteIndex = NOTES.indexOf(noteName);
        if (noteIndex === -1) {
            var enharmonic = ENHARMONIC_MAP[noteName];
            if (enharmonic) return noteToMidi(enharmonic + octave);
            throw new Error('Unknown note: ' + note);
        }
        return noteIndex + (octave + 1) * 12;
    }

    function midiToNote(midi) {
        var octave = Math.floor(midi / 12) - 1;
        return NOTES[midi % 12] + octave;
    }

    function getNoteAtPosition(stringIndex, fret, tuning) {
        return midiToNote(noteToMidi(tuning[stringIndex]) + fret);
    }

    function getNoteIndex(noteName) {
        var index = NOTES.indexOf(noteName);
        if (index === -1) {
            var enharmonic = ENHARMONIC_MAP[noteName];
            if (enharmonic) return NOTES.indexOf(enharmonic);
            throw new Error('Unknown note: ' + noteName);
        }
        return index;
    }

    function getIntervalSemitones(note1, note2) {
        var diff = noteToMidi(note2) - noteToMidi(note1);
        return diff < 0 ? diff + 12 : diff;
    }

    function getIntervalName(semitones) {
        var intervals = { 0:'R',1:'b2',2:'2',3:'b3',4:'3',5:'4',6:'b5',7:'5',8:'#5',9:'6',10:'b7',11:'7' };
        return intervals[semitones] || (semitones + ' st');
    }

    function transposeNote(note, semitones) {
        var noteName = note.replace(/[0-9]/g, '');
        var octave = parseInt((note.match(/[0-9]+/) || ['4'])[0]);
        var newIndex = (getNoteIndex(noteName) + semitones) % 12;
        return NOTES[newIndex] + octave;
    }

    function getScalePositions(rootNote, scaleName, tuning, numFrets) {
        numFrets = numFrets || 24;
        var intervals = SCALES[scaleName];
        if (!intervals) throw new Error('Unknown scale: ' + scaleName);
        var scaleNotes = intervals.map(function(i) { return transposeNote(rootNote, i); });
        var scaleNoteIndices = scaleNotes.map(function(n) { return getNoteIndex(n.replace(/[0-9]/g, '')); });
        var rootNoteIndex = getNoteIndex(rootNote.replace(/[0-9]/g, ''));
        var positions = [];
        for (var s = 0; s < tuning.length; s++) {
            for (var f = 0; f <= numFrets; f++) {
                var note = getNoteAtPosition(s, f, tuning);
                var noteIdx = getNoteIndex(note.replace(/[0-9]/g, ''));
                if (scaleNoteIndices.indexOf(noteIdx) !== -1) {
                    positions.push({
                        string: s, fret: f, note: note,
                        interval: getIntervalName(getIntervalSemitones(rootNote, note)),
                        isRoot: noteIdx === rootNoteIndex
                    });
                }
            }
        }
        return positions;
    }

    function getChordPositions(rootNote, chordType, tuning, numFrets) {
        numFrets = numFrets || 24;
        var intervals = CHORD_PATTERNS[chordType];
        if (!intervals) throw new Error('Unknown chord type: ' + chordType);
        var chordNotes = intervals.map(function(i) { return transposeNote(rootNote, i); });
        var chordNoteIndices = chordNotes.map(function(n) { return getNoteIndex(n.replace(/[0-9]/g, '')); });
        var rootNoteIndex = getNoteIndex(rootNote.replace(/[0-9]/g, ''));
        var positions = [];
        for (var s = 0; s < tuning.length; s++) {
            for (var f = 0; f <= numFrets; f++) {
                var note = getNoteAtPosition(s, f, tuning);
                var noteIdx = getNoteIndex(note.replace(/[0-9]/g, ''));
                if (chordNoteIndices.indexOf(noteIdx) !== -1) {
                    positions.push({
                        string: s, fret: f, note: note,
                        interval: getIntervalName(getIntervalSemitones(rootNote, note)),
                        isRoot: noteIdx === rootNoteIndex
                    });
                }
            }
        }
        return positions;
    }

    function noteToFrequency(note) {
        return 440 * Math.pow(2, (noteToMidi(note) - 69) / 12);
    }

    // --- Renderer ---

    var THEMES = {
        dark: {
            background: '#1a1a2e', fretboard: '#d4a574', fretLine: '#2d2d44',
            nut: '#f5f5dc', inlay: '#2d2d44', string: '#e8e8e8',
            noteDefault: '#4a90d9', noteRoot: '#e94560',
            textLight: '#ffffff', textDark: '#1a1a2e'
        },
        light: {
            background: '#ffffff', fretboard: '#f5deb3', fretLine: '#8b7355',
            nut: '#f5f5dc', inlay: '#8b7355', string: '#4a4a4a',
            noteDefault: '#4a90d9', noteRoot: '#e94560',
            textLight: '#ffffff', textDark: '#1a1a2e'
        },
        vintage: {
            background: '#f4e4bc', fretboard: '#8b4513', fretLine: '#5c3317',
            nut: '#f4e4bc', inlay: '#f4e4bc', string: '#c0c0c0',
            noteDefault: '#daa520', noteRoot: '#cd5c5c',
            textLight: '#ffffff', textDark: '#8b4513'
        }
    };

    var INLAY_POSITIONS = { single: [3, 5, 7, 9], double: [12, 15, 17, 19, 21, 24] };

    function renderFretboard(config) {
        var cfg = Object.assign({
            key: 'C', scale: 'major', chord: null, tuning: 'standard',
            fretRange: [0, 12], orientation: 'horizontal', handed: 'right',
            labels: 'intervals', theme: 'dark', instrument: 'guitar'
        }, config);

        var theme = THEMES[cfg.theme] || THEMES.dark;
        var tuning = typeof cfg.tuning === 'string'
            ? (TUNING_PRESETS[cfg.tuning] || TUNING_PRESETS['standard'])
            : cfg.tuning;
        var startFret = cfg.fretRange[0];
        var numFrets = cfg.fretRange[1] - startFret + 1;
        var numStrings = tuning.length || 6;

        var width = cfg.orientation === 'horizontal' ? 800 : 200;
        var height = cfg.orientation === 'horizontal' ? 250 : 600;
        var stringSpace = cfg.orientation === 'horizontal' ? height / (numStrings + 1) : width / (numStrings + 1);
        var fretSpace = cfg.orientation === 'horizontal' ? width / (numFrets + 1) : height / (numFrets + 1);

        var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + width + ' ' + height + '" class="fretboard-svg">';
        svg += '<style>.fretboard-svg{max-width:100%;height:auto;}.note-marker{cursor:pointer;transition:transform 0.15s ease;}.note-marker:hover{transform:scale(1.2);}</style>';
        svg += '<rect width="100%" height="100%" fill="' + theme.background + '"/>';

        var fbX = 40, fbY = 30;
        var fbW = cfg.orientation === 'horizontal' ? width - 80 : width - 60;
        var fbH = cfg.orientation === 'horizontal' ? height - 60 : height - 60;

        svg += '<rect x="' + fbX + '" y="' + fbY + '" width="' + fbW + '" height="' + fbH + '" fill="' + theme.fretboard + '" rx="2"/>';

        if (startFret === 0) {
            svg += '<rect x="' + fbX + '" y="' + fbY + '" width="8" height="' + fbH + '" fill="' + theme.nut + '" rx="1"/>';
        }

        for (var f = 0; f <= numFrets; f++) {
            var fX = fbX + (cfg.orientation === 'horizontal' ? fretSpace * f : 0);
            var fY = fbY + (cfg.orientation === 'horizontal' ? 0 : fretSpace * f);
            var fW = cfg.orientation === 'horizontal' ? 2 : fbW;
            var fH = cfg.orientation === 'horizontal' ? fbH : 2;
            svg += '<rect x="' + fX + '" y="' + fY + '" width="' + fW + '" height="' + fH + '" fill="' + theme.fretLine + '"/>';
        }

        for (var s = 0; s <= numStrings; s++) {
            var sX = fbX + (cfg.orientation === 'horizontal' ? 0 : stringSpace * s);
            var sY = fbY + (cfg.orientation === 'horizontal' ? stringSpace * s : 0);
            var sW = cfg.orientation === 'horizontal' ? fbW : 2;
            var sH = cfg.orientation === 'horizontal' ? 2 : fbH;
            svg += '<rect x="' + sX + '" y="' + sY + '" width="' + sW + '" height="' + sH + '" fill="' + theme.string + '"/>';
        }

        var inlayFrets = INLAY_POSITIONS.single;
        for (var i = 0; i < inlayFrets.length; i++) {
            var fret = inlayFrets[i];
            if (fret >= startFret && fret <= cfg.fretRange[1]) {
                var inlayFretIdx = fret - startFret;
                if (inlayFretIdx >= numFrets) continue;
                var iX = fbX + (cfg.orientation === 'horizontal' ? fretSpace * inlayFretIdx + fretSpace / 2 : fbW / 2);
                var iY = fbY + (cfg.orientation === 'horizontal' ? fbH / 2 : fretSpace * inlayFretIdx + fretSpace / 2);
                svg += '<circle cx="' + iX + '" cy="' + iY + '" r="6" fill="' + theme.inlay + '"/>';
            }
        }
        // Double dots at 12
        if (12 >= startFret && 12 <= cfg.fretRange[1]) {
            var dIdx = 12 - startFret;
            if (dIdx < numFrets) {
                var dX = fbX + (cfg.orientation === 'horizontal' ? fretSpace * dIdx + fretSpace / 2 : fbW / 2);
                var dY = fbY + (cfg.orientation === 'horizontal' ? fbH / 2 : fretSpace * dIdx + fretSpace / 2);
                var offset = stringSpace * 0.4;
                svg += '<circle cx="' + (dX - offset) + '" cy="' + (dY - offset) + '" r="6" fill="' + theme.inlay + '"/>';
                svg += '<circle cx="' + (dX + offset) + '" cy="' + (dY + offset) + '" r="6" fill="' + theme.inlay + '"/>';
            }
        }

        var positions = cfg.chord
            ? getChordPositions(cfg.key, cfg.chord, tuning, cfg.fretRange[1])
            : getScalePositions(cfg.key, cfg.scale, tuning, cfg.fretRange[1]);

        for (var p = 0; p < positions.length; p++) {
            var pos = positions[p];
            if (pos.fret < startFret || pos.fret > cfg.fretRange[1]) continue;
            var nX = fbX + (cfg.orientation === 'horizontal'
                ? fretSpace * (pos.fret - startFret) + fretSpace / 2
                : stringSpace * pos.string + stringSpace / 2);
            var nY = fbY + (cfg.orientation === 'horizontal'
                ? stringSpace * pos.string + stringSpace / 2
                : fretSpace * (pos.fret - startFret) + fretSpace / 2);
            var fill = pos.isRoot ? theme.noteRoot : theme.noteDefault;
            var label = cfg.labels === 'intervals' ? pos.interval : pos.note.replace(/[0-9]/g, '');
            var textColor = pos.isRoot ? theme.textLight : (cfg.theme === 'dark' ? theme.textLight : theme.textDark);
            svg += '<circle class="note-marker" cx="' + nX + '" cy="' + nY + '" r="12" fill="' + fill + '" data-note="' + pos.note + '" data-fret="' + pos.fret + '" data-string="' + pos.string + '"/>';
            svg += '<text x="' + nX + '" y="' + nY + '" text-anchor="middle" dominant-baseline="central" fill="' + textColor + '" font-size="10" font-weight="bold">' + label + '</text>';
        }

        svg += '</svg>';
        return svg;
    }

    function initAudio(containerEl) {
        var audioContext = null;
        var audioEnabled = false;
        containerEl.querySelectorAll('.note-marker').forEach(function(note) {
            note.addEventListener('click', function(e) {
                if (!audioEnabled) {
                    audioContext = new (window.AudioContext || window.webkitAudioContext)();
                    audioEnabled = true;
                }
                var frequency = noteToFrequency(e.target.getAttribute('data-note'));
                var osc = audioContext.createOscillator();
                var gain = audioContext.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(frequency, audioContext.currentTime);
                gain.gain.setValueAtTime(0.3, audioContext.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
                osc.connect(gain);
                gain.connect(audioContext.destination);
                osc.start(audioContext.currentTime);
                osc.stop(audioContext.currentTime + 0.5);
            });
        });
    }

    function initContainer(container) {
        var configAttr = container.getAttribute('data-config');
        if (!configAttr) return;
        try {
            var config = JSON.parse(configAttr);
            container.innerHTML = renderFretboard(config);
            initAudio(container);
        } catch (e) {
            console.error('Fretboard Explorer: Invalid config', e);
        }
    }

    document.addEventListener('DOMContentLoaded', function() {
        document.querySelectorAll('.fretboard-container, .fretboard-block').forEach(initContainer);
    });

})();
