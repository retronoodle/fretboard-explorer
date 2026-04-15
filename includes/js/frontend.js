/**
 * Frontend initialization for Fretboard Explorer
 * Initializes fretboards on page load for shortcode-rendered fretboards
 */

import { render } from './fretboard-renderer.js';

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.fretboard-container').forEach(container => {
        const configAttr = container.dataset.config;
        if (configAttr) {
            try {
                const config = JSON.parse(configAttr);
                render(container, config);
            } catch (e) {
                console.error('Fretboard Explorer: Invalid config data', e);
            }
        }
    });

    document.querySelectorAll('.fretboard-block').forEach(container => {
        const configAttr = container.dataset.config;
        if (configAttr) {
            try {
                const config = JSON.parse(configAttr);
                render(container, config);
            } catch (e) {
                console.error('Fretboard Explorer: Invalid block config', e);
            }
        }
    });
});