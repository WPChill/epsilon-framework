<?php
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * @since 1.2.0
 * Class Epsilon_Predefined_Controls
 *
 *        Registers and handles standard controls such as Header, Footer, Blog Layout
 */
class Epsilon_Predefined_Controls {
	/**
	 * @since 1.2.0
	 *
	 * @var array
	 */
	public $sections = array();
	/**
	 * @since 1.2.0
	 *
	 * @var array
	 */
	public $panels = array();
	/**
	 * @since 1.2.0
	 *
	 * @var array
	 */
	public $fields = array();

	/**
	 * Holds elements assigned per identifier
	 *
	 * @since 1.2.0
	 * @var array
	 */
	public $collection = array();

	/**
	 * Epsilon_Predefined_Controls constructor.
	 *
	 * @since 1.2.0
	 *
	 * @param array $args
	 */
	public function __construct( array $args = array() ) {
		$this->set_collection();
		$this->build_options( $args );
		$this->add_customizer_collection();
	}

	/**
	 * Register an instance of this class
	 *
	 * @since 1.2.0
	 *
	 * @param array $args
	 */
	public static function get_instance( array $args = array() ) {
		static $inst;

		if ( ! $inst ) {
			$inst = new Epsilon_Predefined_Controls( $args );
		}

		return $inst;
	}

	/**
	 * We need to create elements dynamically
	 *
	 * @since 1.2.0
	 *
	 * @param array $args
	 */
	private function build_options( array $args ) {
		foreach ( $args as $identifier ) {
			$this->set_elements( $identifier );
		}
	}

	/**
	 * @since 1.2.0
	 *
	 * Register customizer controls
	 */
	public function add_customizer_collection() {
		$collection = array(
			'panel'   => $this->panels,
			'section' => $this->sections,
			'field'   => $this->fields,
		);

		Epsilon_Customizer::add_multiple( $collection );
	}

	/**
	 * @since 1.2.0
	 *
	 * @param $identifier
	 */
	private function set_elements( $identifier ) {
		foreach ( self::$collection[ $identifier ]['panels'] as $collection => $panel ) {
			foreach ( $panel['args']['sections'] as $section ) {
				foreach ( $section['args']['fields'] as $field ) {
					$this->fields[] = $field;
				};

				unset( $section['args']['fields'] );
				$this->sections[] = $section;
			};

			unset( $panel['args']['sections'] );
			$this->panels[] = $panel;

		}
	}

	/**
	 * @since 1.2.0
	 * Start building the collection of our predefined fields
	 */
	private function set_collection() {
		$theme  = wp_get_theme();
		$prefix = 'epsilon_framework';

		/**
		 * Each "set" has it's own panels,
		 *      Each "set" panel has it's own sections,
		 *          Each "set" sections has it's own fields
		 */
		$arr = array(
			'header'  => array(
				'panels' => array(
					'header_options' => array(
						'id'   => $prefix . '_header_options',
						'args' => array(
							'title'    => esc_html__( 'Header Options', 'epsilon-framework' ),
							'sections' => array(
								'menu' => array(
									'id'   => $prefix . '_menu_options',
									'args' => array(
										'title'  => esc_html__( 'Menu Options', 'epsilon-framework' ),
										'fields' => array(
											'sticky_menu'    => array(
												'id'   => $prefix . '_enable_sticky_menu',
												'args' => array(
													'type'        => 'epsilon-toggle',
													'label'       => esc_html__( 'Sticky menu', 'epsilon-framework' ),
													'description' => esc_html__( 'Toggling this to on will make the navigation menu stick to the top of header when scrolling.', 'epsilon-framework' ),
													'section'     => $prefix . '_menu_options',
													'default'     => true,
												),
											),
											'search_in_menu' => array(
												'id'   => $prefix . '_enable_menu_search',
												'args' => array(
													'type'        => 'epsilon-toggle',
													'label'       => esc_html__( 'Search icon in the menu', 'epsilon-framework' ),
													'description' => esc_html__( 'Toggle the display of the search icon and functionality in the main navigation menu', 'epsilon-framework' ),
													'section'     => $prefix . '_menu_options',
													'default'     => true,
												),
											),
										),
									),
								),
							),
						),
					),
				),
			),
			'general' => array(),
			'blog'    => array(),
			'footer'  => array(),
		);

		$this->collection = $arr;
	}

	/**
	 * @since 1.2.0
	 *
	 * @param string $collection
	 */
	public function get_collection_values( $collection = '' ) {
		$options = array();
		foreach ( $this->collection[ $collection ]['panels'] as $panel ) {
			foreach ( $panel['args']['sections'] as $section ) {
				foreach ( $section['args']['fields'] as $field ) {
					$options[ $field['id'] ] = get_theme_mod( $field['id'] );
				}
			}
		}

		return $options;
	}
}
