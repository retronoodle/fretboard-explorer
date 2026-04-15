/**
 * Fretboard Explorer Gutenberg Block
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl, RangeControl, ButtonGroup, Button } from '@wordpress/components';
import { renderFretboard } from './fretboard-renderer';
import { SCALES, CHORD_PATTERNS, TUNING_PRESETS } from './music-theory';

const FRETBOARD_BLOCK_EDITOR_SCRIPT = process.env.NODE_ENV === 'development'
    ? 'http://localhost:8888/wp-content/plugins/fretboard-explorer/includes/js/fretboard-renderer.js'
    : null;

registerBlockType( 'fretboard-explorer/fretboard', {
    title: __( 'Fretboard Explorer', 'fretboard-explorer' ),
    description: __( 'Interactive SVG fretboard visualization with scales, chords, and audio playback', 'fretboard-explorer' ),
    category: 'embed',
    icon: 'music-alt',
    keywords: [
        __( 'fretboard', 'fretboard-explorer' ),
        __( 'guitar', 'fretboard-explorer' ),
        __( 'scales', 'fretboard-explorer' ),
        __( 'chords', 'fretboard-explorer' )
    ],
    supports: {
        html: false
    },
    attributes: {
        key: {
            type: 'string',
            default: 'C'
        },
        scale: {
            type: 'string',
            default: 'major'
        },
        chord: {
            type: 'string',
            default: ''
        },
        tuning: {
            type: 'string',
            default: 'standard'
        },
        fretRange: {
            type: 'array',
            default: [0, 12]
        },
        orientation: {
            type: 'string',
            default: 'horizontal'
        },
        handed: {
            type: 'string',
            default: 'right'
        },
        labels: {
            type: 'string',
            default: 'intervals'
        },
        theme: {
            type: 'string',
            default: 'dark'
        },
        instrument: {
            type: 'string',
            default: 'guitar'
        },
        audioEnabled: {
            type: 'boolean',
            default: false
        }
    },
    edit: function( { attributes, setAttributes } ) {
        const blockProps = useBlockProps();

        const scaleOptions = Object.keys(SCALES).map(scale => ({
            value: scale,
            label: scale.charAt(0).toUpperCase() + scale.slice(1).replace(/-/g, ' ')
        }));

        const chordOptions = Object.keys(CHORD_PATTERNS).map(chord => ({
            value: chord,
            label: chord.charAt(0).toUpperCase() + chord.slice(1).replace(/-/g, ' ')
        }));

        const tuningOptions = Object.keys(TUNING_PRESETS).map(tuning => ({
            value: tuning,
            label: tuning.charAt(0).toUpperCase() + tuning.slice(1).replace(/-/g, ' ')
        }));

        const themeOptions = [
            { value: 'dark', label: 'Dark' },
            { value: 'light', label: 'Light' },
            { value: 'vintage', label: 'Vintage' }
        ];

        const labelOptions = [
            { value: 'intervals', label: 'Intervals' },
            { value: 'note-names', label: 'Note Names' }
        ];

        const orientationOptions = [
            { value: 'horizontal', label: 'Horizontal' },
            { value: 'vertical', label: 'Vertical' }
        ];

        const handedOptions = [
            { value: 'right', label: 'Right' },
            { value: 'left', label: 'Left' }
        ];

        const instrumentOptions = [
            { value: 'guitar', label: '6-String Guitar' },
            { value: 'bass', label: '4-String Bass' },
            { value: 'guitar-7', label: '7-String Guitar' }
        ];

        const noteOptions = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'].map(note => ({
            value: note,
            label: note
        }));

        const previewStyle = {
            padding: '20px',
            background: attributes.theme === 'dark' ? '#1a1a2e' : attributes.theme === 'vintage' ? '#f4e4bc' : '#ffffff'
        };

        return [
            <InspectorControls key="inspector">
                <PanelBody title={ __( 'Fretboard Settings', 'fretboard-explorer' ) }>
                    <SelectControl
                        label={ __( 'Root Note', 'fretboard-explorer' ) }
                        value={ attributes.key }
                        options={ noteOptions }
                        onChange={ ( key ) => setAttributes( { key } ) }
                    />

                    <SelectControl
                        label={ __( 'Scale', 'fretboard-explorer' ) }
                        value={ attributes.scale }
                        options={ scaleOptions }
                        onChange={ ( scale ) => setAttributes( { scale } ) }
                    />

                    <SelectControl
                        label={ __( 'Or Chord', 'fretboard-explorer' ) }
                        value={ attributes.chord }
                        options={ [ { value: '', label: 'None' }, ...chordOptions ] }
                        onChange={ ( chord ) => setAttributes( { chord } ) }
                    />

                    <SelectControl
                        label={ __( 'Tuning', 'fretboard-explorer' ) }
                        value={ attributes.tuning }
                        options={ tuningOptions }
                        onChange={ ( tuning ) => setAttributes( { tuning } ) }
                    />

                    <SelectControl
                        label={ __( 'Instrument', 'fretboard-explorer' ) }
                        value={ attributes.instrument }
                        options={ instrumentOptions }
                        onChange={ ( instrument ) => setAttributes( { instrument } ) }
                    />
                </PanelBody>

                <PanelBody title={ __( 'Display Options', 'fretboard-explorer' ) }>
                    <SelectControl
                        label={ __( 'Theme', 'fretboard-explorer' ) }
                        value={ attributes.theme }
                        options={ themeOptions }
                        onChange={ ( theme ) => setAttributes( { theme } ) }
                    />

                    <SelectControl
                        label={ __( 'Labels', 'fretboard-explorer' ) }
                        value={ attributes.labels }
                        options={ labelOptions }
                        onChange={ ( labels ) => setAttributes( { labels } ) }
                    />

                    <SelectControl
                        label={ __( 'Orientation', 'fretboard-explorer' ) }
                        value={ attributes.orientation }
                        options={ orientationOptions }
                        onChange={ ( orientation ) => setAttributes( { orientation } ) }
                    />

                    <SelectControl
                        label={ __( 'Handedness', 'fretboard-explorer' ) }
                        value={ attributes.handed }
                        options={ handedOptions }
                        onChange={ ( handed ) => setAttributes( { handed } ) }
                    />

                    <RangeControl
                        label={ __( 'Fret Range Start', 'fretboard-explorer' ) }
                        value={ attributes.fretRange[0] }
                        onChange={ ( start ) => setAttributes( { fretRange: [ start, attributes.fretRange[1] ] } ) }
                        min={ 0 }
                        max={ 24 }
                    />

                    <RangeControl
                        label={ __( 'Fret Range End', 'fretboard-explorer' ) }
                        value={ attributes.fretRange[1] }
                        onChange={ ( end ) => setAttributes( { fretRange: [ attributes.fretRange[0], end ] } ) }
                        min={ 1 }
                        max={ 24 }
                    />
                </PanelBody>
            </InspectorControls>,
            <div key="preview" { ...blockProps }>
                <div style={ previewStyle }>
                    <div
                        class="fretboard-preview"
                        dangerouslySetInnerHTML={ { __html: renderFretboard( attributes ) } }
                    />
                </div>
            </div>
        ];
    },
    save: function( { attributes } ) {
        return (
            <div
                class="fretboard-block"
                data-config={ JSON.stringify( attributes ) }
            />
        );
    }
} );