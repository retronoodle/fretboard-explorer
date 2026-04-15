<?php
/**
 * Plugin Name: Fretboard Explorer
 * Plugin URI: https://github.com/velvet-creek/fretboard-explorer
 * Description: Interactive SVG fretboard visualization with scales, chords, and audio playback
 * Version: 1.0.0
 * Author: Velvet Creek Studio
 * Author URI: https://velvetcreekstudio.com
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: fretboard-explorer
 * Domain Path: /languages
 */

// Prevent direct access
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// Plugin version
define( 'FRETBOARD_EXPLORER_VERSION', '1.0.0' );

// Plugin directory path
define( 'FRETBOARD_EXPLORER_DIR', plugin_dir_path( __FILE__ ) );
define( 'FRETBOARD_EXPLORER_URL', plugin_dir_url( __FILE__ ) );
define( 'FRETBOARD_EXPLORER_BASENAME', plugin_basename( __FILE__ ) );

/**
 * Load plugin text domain for internationalization
 */
function fretboard_explorer_load_textdomain() {
    load_plugin_textdomain(
        'fretboard-explorer',
        false,
        dirname( FRETBOARD_EXPLORER_BASENAME ) . '/languages/'
    );
}
add_action( 'plugins_loaded', 'fretboard_explorer_load_textdomain' );

/**
 * Enqueue frontend assets only when needed
 */
function fretboard_explorer_enqueue_assets() {
    wp_register_style(
        'fretboard-explorer',
        FRETBOARD_EXPLORER_URL . 'build/index.css',
        array(),
        FRETBOARD_EXPLORER_VERSION
    );

    wp_register_script(
        'fretboard-explorer',
        FRETBOARD_EXPLORER_URL . 'build/index.js',
        array(),
        FRETBOARD_EXPLORER_VERSION,
        true
    );
}
add_action( 'wp_enqueue_scripts', 'fretboard_explorer_enqueue_assets' );

/**
 * Register Gutenberg block
 */
function fretboard_explorer_register_block() {
    register_block_type( FRETBOARD_EXPLORER_DIR . 'build/block.json' );
}
add_action( 'init', 'fretboard_explorer_register_block' );

/**
 * Register shortcode
 */
function fretboard_explorer_shortcode( $atts ) {
    $atts = shortcode_atts(
        array(
            'key'        => 'C',
            'scale'      => 'major',
            'chord'      => '',
            'tuning'     => 'standard',
            'frets'      => '0-12',
            'theme'      => 'dark',
            'labels'     => 'intervals',
            'orientation' => 'horizontal',
            'handed'     => 'right',
            'instrument' => 'guitar',
        ),
        $atts,
        'fretboard'
    );

    wp_enqueue_style( 'fretboard-explorer' );
    wp_enqueue_script( 'fretboard-explorer' );

    $container_id = 'fretboard-' . uniqid();

    $json_attrs = json_encode( array(
        'key'        => $atts['key'],
        'scale'      => $atts['scale'],
        'chord'      => $atts['chord'],
        'tuning'     => $atts['tuning'],
        'fretRange'  => array_map( 'intval', explode( '-', $atts['frets'] ) ),
        'theme'      => $atts['theme'],
        'labels'     => $atts['labels'],
        'orientation' => $atts['orientation'],
        'handed'     => $atts['handed'],
        'instrument' => $atts['instrument'],
    ) );

    return sprintf(
        '<div class="fretboard-container" id="%s" data-config="%s"></div>',
        esc_attr( $container_id ),
        esc_attr( $json_attrs )
    );
}
add_shortcode( 'fretboard', 'fretboard_explorer_shortcode' );

/**
 * Conditional asset loading - detect if block/shortcode is used
 */
function fretboard_explorer_should_load_assets() {
    // Check if we're in admin or doing AJAX - load assets anyway for block editor
    if ( is_admin() || ( defined( 'DOING_AJAX' ) && DOING_AJAX ) ) {
        return true;
    }

    // Check post content for our block or shortcode
    if ( is_singular() ) {
        global $post;
        if ( $post && ( has_block( 'fretboard-explorer/fretboard', $post ) || strpos( $post->post_content, '[fretboard' ) !== false ) ) {
            return true;
        }
    }

    return false;
}

function fretboard_explorer_conditional_enqueue() {
    if ( fretboard_explorer_should_load_assets() ) {
        wp_enqueue_style( 'fretboard-explorer' );
        wp_enqueue_script( 'fretboard-explorer' );
    }
}
add_action( 'wp_enqueue_scripts', 'fretboard_explorer_conditional_enqueue', 5 );