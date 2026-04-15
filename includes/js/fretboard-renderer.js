/**
 * Fretboard Renderer - SVG Generation
 */

import { getScalePositions, getChordPositions, noteToFrequency, TUNING_PRESETS } from './music-theory.js';

const THEMES = {
    dark: {
        background: '#1a1a2e',
        fretboard: '#d4a574',
        fretLine: '#2d2d44',
        nut: '#f5f5dc',
        inlay: '#2d2d44',
        string: '#e8e8e8',
        noteDefault: '#4a90d9',
        noteRoot: '#e94560',
        textLight: '#ffffff',
        textDark: '#1a1a2e'
    },
    light: {
        background: '#ffffff',
        fretboard: '#f5deb3',
        fretLine: '#8b7355',
        nut: '#f5f5dc',
        inlay: '#8b7355',
        string: '#4a4a4a',
        noteDefault: '#4a90d9',
        noteRoot: '#e94560',
        textLight: '#ffffff',
        textDark: '#1a1a2e'
    },
    vintage: {
        background: '#f4e4bc',
        fretboard: '#8b4513',
        fretLine: '#5c3317',
        nut: '#f4e4bc',
        inlay: '#f4e4bc',
        string: '#c0c0c0',
        noteDefault: '#daa520',
        noteRoot: '#cd5c5c',
        textLight: '#ffffff',
        textDark: '#8b4513'
    }
};

const DEFAULT_CONFIG = {
    key: 'C',
    scale: 'major',
    chord: null,
    tuning: 'standard',
    fretRange: [0, 12],
    orientation: 'horizontal',
    handed: 'right',
    labels: 'intervals',
    theme: 'dark',
    instrument: 'guitar'
};

const INLAY_POSITIONS = {
    single: [3, 5, 7, 9],
    double: [12, 15, 17, 19, 21, 24]
};

function getFretboardDimensions(numFrets, numStrings, orientation) {
    const width = orientation === 'horizontal' ? 800 : 200;
    const height = orientation === 'horizontal' ? 250 : 600;
    return { width, height };
}

function renderFretboard(config = {}) {
    const cfg = { ...DEFAULT_CONFIG, ...config };
    const theme = THEMES[cfg.theme] || THEMES.dark;
    const tuning = typeof cfg.tuning === 'string'
        ? (TUNING_PRESETS[cfg.tuning] || TUNING_PRESETS['standard'])
        : cfg.tuning;
    const numFrets = cfg.fretRange[1] - cfg.fretRange[0] + 1;
    const startFret = cfg.fretRange[0];
    const numStrings = tuning.length || 6;

    const { width, height } = getFretboardDimensions(numFrets, numStrings, cfg.orientation);
    const stringSpace = cfg.orientation === 'horizontal' ? height / (numStrings + 1) : width / (numStrings + 1);
    const fretSpace = cfg.orientation === 'horizontal' ? width / (numFrets + 1) : height / (numFrets + 1);

    let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" class="fretboard-svg" data-config='${JSON.stringify(cfg)}'>`;
    svg += `<style>
        .fretboard-svg { max-width: 100%; height: auto; }
        .note-marker { cursor: pointer; transition: transform 0.15s ease; }
        .note-marker:hover { transform: scale(1.2); }
    </style>`;

    svg += `<rect width="100%" height="100%" fill="${theme.background}"/>`;

    if (cfg.handed === 'left' && cfg.orientation === 'horizontal') {
        svg += `<g transform="scale(-1,1) translate(-${width},0)">`;
    }

    const fretboardX = 40;
    const fretboardY = 30;
    const fretboardWidth = cfg.orientation === 'horizontal' ? width - 80 : width - 60;
    const fretboardHeight = cfg.orientation === 'horizontal' ? height - 60 : height - 60;

    svg += `<rect x="${fretboardX}" y="${fretboardY}" width="${fretboardWidth}" height="${fretboardHeight}" fill="${theme.fretboard}" rx="2"/>`;

    if (startFret === 0) {
        svg += `<rect x="${fretboardX}" y="${fretboardY}" width="8" height="${fretboardHeight}" fill="${theme.nut}" rx="1"/>`;
    }

    for (let f = 0; f <= numFrets; f++) {
        const fretX = fretboardX + (cfg.orientation === 'horizontal' ? fretSpace * f : 0);
        const fretY = fretboardY + (cfg.orientation === 'horizontal' ? 0 : fretSpace * f);
        const fretW = cfg.orientation === 'horizontal' ? 2 : fretboardWidth;
        const fretH = cfg.orientation === 'horizontal' ? fretboardHeight : 2;
        svg += `<rect x="${fretX}" y="${fretY}" width="${fretW}" height="${fretH}" fill="${theme.fretLine}"/>`;
    }

    for (let s = 0; s <= numStrings; s++) {
        const stringX = fretboardX + (cfg.orientation === 'horizontal' ? 0 : stringSpace * s);
        const stringY = fretboardY + (cfg.orientation === 'horizontal' ? stringSpace * s : 0);
        const stringW = cfg.orientation === 'horizontal' ? fretboardWidth : 2;
        const stringH = cfg.orientation === 'horizontal' ? 2 : fretboardHeight;
        const thickness = 1 + (s / numStrings) * 2;
        svg += `<rect x="${stringX}" y="${stringY}" width="${stringW}" height="${stringH}" fill="${theme.string}"/>`;
    }

    const inlayFrets = startFret === 0 ? INLAY_POSITIONS.single : INLAY_POSITIONS.double;
    for (const fret of inlayFrets) {
        if (fret >= startFret && fret <= cfg.fretRange[1]) {
            const inlayFretIdx = fret - startFret;
            const inlayX = fretboardX + (cfg.orientation === 'horizontal' ? fretSpace * inlayFretIdx + fretSpace / 2 : fretboardWidth / 2);
            const inlayY = fretboardY + (cfg.orientation === 'horizontal' ? fretboardHeight / 2 : fretSpace * inlayFretIdx + fretSpace / 2);

            if (inlayFretIdx >= numFrets) continue;

            if ([12, 24].includes(fret)) {
                const offset = stringSpace * 0.4;
                svg += `<circle cx="${inlayX - offset}" cy="${inlayY - offset}" r="6" fill="${theme.inlay}"/>`;
                svg += `<circle cx="${inlayX + offset}" cy="${inlayY + offset}" r="6" fill="${theme.inlay}"/>`;
            } else {
                svg += `<circle cx="${inlayX}" cy="${inlayY}" r="6" fill="${theme.inlay}"/>`;
            }
        }
    }

    const positions = cfg.chord
        ? getChordPositions(cfg.key, cfg.chord, tuning, cfg.fretRange[1])
        : getScalePositions(cfg.key, cfg.scale, tuning, cfg.fretRange[1]);

    for (const pos of positions) {
        if (pos.fret < startFret || pos.fret > cfg.fretRange[1]) continue;

        const noteX = fretboardX + (cfg.orientation === 'horizontal' ? fretSpace * (pos.fret - startFret) + fretSpace / 2 : stringSpace * pos.string + stringSpace / 2);
        const noteY = fretboardY + (cfg.orientation === 'horizontal' ? stringSpace * pos.string + stringSpace / 2 : fretSpace * (pos.fret - startFret) + fretSpace / 2);

        const fill = pos.isRoot ? theme.noteRoot : theme.noteDefault;
        const label = cfg.labels === 'intervals' ? pos.interval : pos.note.replace(/[0-9]/g, '');
        const textColor = pos.isRoot ? theme.textLight : (cfg.theme === 'dark' ? theme.textLight : theme.textDark);

        svg += `<circle class="note-marker" cx="${noteX}" cy="${noteY}" r="12" fill="${fill}" data-note="${pos.note}" data-fret="${pos.fret}" data-string="${pos.string}"/>`;
        svg += `<text x="${noteX}" y="${noteY}" text-anchor="middle" dominant-baseline="central" fill="${textColor}" font-size="10" font-weight="bold">${label}</text>`;
    }

    if (cfg.handed === 'left' && cfg.orientation === 'horizontal') {
        svg += '</g>';
    }

    svg += '</svg>';
    return svg;
}

function initAudio(fretboardElement) {
    if (!fretboardElement) return null;

    let audioContext = null;
    let audioEnabled = false;

    const notes = fretboardElement.querySelectorAll('.note-marker');

    notes.forEach(note => {
        note.addEventListener('click', (e) => {
            if (!audioEnabled) {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                audioEnabled = true;
            }

            const noteName = e.target.getAttribute('data-note');
            const frequency = noteToFrequency(noteName);

            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        });
    });

    return { audioContext, setEnabled: (enabled) => { audioEnabled = enabled; } };
}

function render(containerOrSelector, config = {}) {
    const container = typeof containerOrSelector === 'string'
        ? document.querySelector(containerOrSelector)
        : containerOrSelector;

    if (!container) {
        console.error('Fretboard: Container not found');
        return;
    }

    const svg = renderFretboard(config);
    container.innerHTML = svg;
    initAudio(container);
}

export { render, renderFretboard, THEMES, DEFAULT_CONFIG };