<?php
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Class Epsilon_Section_Styling
 */
class Epsilon_Section_Styling {

	/**
	 * Output CSS string
	 *
	 * @var string
	 */
	public $css = '';
	/**
	 * Options that we need to gather values from
	 *
	 * @var array
	 */
	public $options = array();
	/**
	 * Option string (theme specific)
	 *
	 * @var string
	 */
	public $option = '';
	/**
	 * Section manager ( we'll need to get selectors and stuff from it )
	 *
	 * @var object
	 */
	public $manager;

	/**
	 * Epsilon_Section_Styling constructor.
	 *
	 * @param string $handle
	 * @param        $option
	 * @param        $section_manager
	 */
	public function __construct( $handle = '', $option, $section_manager ) {
		$this->manager = $section_manager;
		$this->option  = $option;

		$this->gather_options();
		$this->_render_css();

		wp_add_inline_style( $handle, $this->css );
	}

	/**
	 * Gathers all options
	 */
	public function gather_options() {
		$frontpage = Epsilon_Page_Generator::get_instance( $this->option . get_the_ID(), get_the_ID() );

		if ( ! $frontpage->sections ) {
			return;
		}

		foreach ( $frontpage->sections as $index => $section ) {
			$text    = $this->preg_grep_keys( '/_text_color/', $section );
			$heading = $this->preg_grep_keys( '/_heading_color/', $section );
			$others  = $this->preg_grep_keys( '/_misc_font_color/', $section );

			if ( ! empty( $others ) ) {
				foreach ( $others as $k => $v ) {
					$shortcut = $this->manager->sections[ $section['type'] ]['fields'][ $k ];

					$this->options[ $index ][] = array(
						'selectors'     => isset( $shortcut['selectors'] ) ? $shortcut['selectors'] : '',
						'css-attribute' => isset( $shortcut['css-attribute'] ) ? $shortcut['css-attribute'] : 'color',
						'value'         => $v
					);
				}
			}

			if ( ! empty( $text ) ) {
				$key = array_keys( $text );
				$key = reset( $key );

				$shortcut = $this->manager->sections[ $section['type'] ]['fields'][ $key ];

				$this->options[ $index ][] = array(
					'selectors'     => isset( $shortcut['selectors'] )
						? $shortcut['selectors']
						: array( 'p' ),
					'css-attribute' => isset( $shortcut['css-attribute'] ) ? $shortcut['css-attribute'] : 'color',
					'value'         => reset( $text )
				);
			}
			if ( ! empty( $heading ) ) {
				$key = array_keys( $heading );
				$key = reset( $key );

				$shortcut = $this->manager->sections[ $section['type'] ]['fields'][ $key ];

				$this->options[ $index ][] = array(
					'selectors'     => isset( $shortcut['selectors'] )
						? $shortcut['selectors']
						: array( 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', ),
					'css-attribute' => isset( $shortcut['css-attribute'] ) ? $shortcut['css-attribute'] : 'color',
					'value'         => reset( $heading )
				);
			}
		}
	}

	/**
	 * Simple function to return keys that match a certain pattern
	 * ( in this case, using it for text_color and heading_color )
	 *
	 * @param     $pattern
	 * @param     $input
	 * @param int $flags
	 *
	 * @return array
	 */
	public function preg_grep_keys( $pattern, $input, $flags = 0 ) {
		return array_intersect_key( $input, array_flip( preg_grep( $pattern, array_keys( $input ), $flags ) ) );
	}

	/**
	 * Renders CSS String
	 */
	private function _render_css() {
		/**
		 * Each option represents the index of a section
		 */
		foreach ( $this->options as $index => $options ) {
			/**
			 * On each section, we run a callback
			 */
			$this->css .= $this->element_callback( $index, $options );
		}
	}

	/**
	 * Each element (section) will generate a string of css
	 *
	 * @param int   $index
	 * @param array $arr
	 *
	 * @return string
	 */
	public function element_callback( $index = 0, $arr = array() ) {
		$css = '';

		/**
		 * Each section can have text-color, or heading-color so we need to iterate to handle both cases
		 */
		foreach ( $arr as $element ) {
			/**
			 * All our selectors should be scoped by the data-section attribute
			 * e.g. [data-section="1"] p { example css }
			 */
			$prefix = '[data-section="' . $index . '"] ';

			if ( empty( $element['selectors'] ) ) {
				continue;
			}

			/**
			 * Run a simple preg_filter on the selector array to add the prefix created above
			 */
			$element['selectors'] = preg_filter( '/^/', $prefix, $element['selectors'] );
			$selectors            = implode( ',', $element['selectors'] );

			/**
			 * Implode the array, glueing with ',' so we get a string similar to this:
			 * [data-section="1"] p, [data-section="1" a { css string goes here }
			 * and concatenate it on the CSS variable
			 */
			$css .= ! empty( $element['value'] ) ? $selectors . '{ ' . $element['css-attribute'] . ': ' . $element['value'] . '}' . "\n" : '';
		}

		return $css;
	}
}
