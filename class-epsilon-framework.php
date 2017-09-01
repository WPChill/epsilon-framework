<?php
if ( ! defined( 'WPINC' ) ) {
	die;
}

require_once dirname( __FILE__ ) . '/class-epsilon-autoloader.php';

/**
 * Class Epsilon_Framework
 */
class Epsilon_Framework {
	/**
	 * By default, it loads all controls
	 *
	 * @var array|mixed
	 */
	private $controls = array(
		'toggle',
		'typography',
		'slider',
		'repeater',
		'section-repeater',
		'image',
		'text-editor',
		'icon-picker',
		'customizer-navigation',
		'color-scheme',
	);
	/**
	 * By default, it loads all sections
	 *
	 * @var array|mixed
	 */
	private $sections = array(
		'recommended-actions',
		'pro',
	);
	/**
	 * By default, load all panels
	 *
	 * @var array
	 */
	private $panels = array(
		'regular',
	);
	/**
	 * Default path is in /inc/libraries
	 *
	 * @var mixed|string
	 */
	private $path = '/inc/libraries';
	/**
	 * At the current moment, backup is a must
	 *
	 * @var bool
	 */
	private $backup = true;

	/**
	 * Epsilon_Framework constructor.
	 *
	 * @param $args array
	 */
	public function __construct( $args = array() ) {
		foreach ( $args as $k => $v ) {

			if ( ! in_array( $k, array( 'controls', 'sections', 'panels', 'path', 'backup' ) ) ) {
				continue;
			}

			$this->$k = $v;
		}

		/**
		 * Let's initiate a backup instance
		 */
		$backup = Epsilon_Content_Backup::get_instance();

		/**
		 * Define URI and PATH for the framework
		 */
		define( 'EPSILON_URI', get_template_directory_uri() . $this->path . '/epsilon-framework' );
		define( 'EPSILON_PATH', get_template_directory() . $this->path . '/epsilon-framework' );
		define( 'EPSILON_BACKUP', $this->backup );
		/**
		 * Admin enqueues
		 */
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue' ) );

		/**
		 * Customizer enqueues & controls
		 */
		add_action( 'customize_register', array( $this, 'init_controls' ), 10 );

		add_action( 'customize_controls_enqueue_scripts', array( $this, 'customizer_enqueue_scripts' ), 25 );
		add_action( 'customize_preview_init', array( $this, 'customize_preview_styles' ), 25 );

		/**
		 * Action for easier AJAX handling
		 */
		add_action( 'wp_ajax_epsilon_framework_ajax_action', array(
			$this,
			'epsilon_framework_ajax_action',
		) );
		add_action( 'wp_ajax_nopriv_epsilon_framework_ajax_action', array(
			$this,
			'epsilon_framework_ajax_action',
		) );

		/**
		 * Repeater fields templates
		 */
		add_action( 'customize_controls_print_footer_scripts', array(
			'Epsilon_Repeater_Templates',
			'field_repeater_js_template',
		), 0 );
	}

	/**
	 * Init custom controls
	 *
	 * @param object $wp_customize
	 */
	public function init_controls( $wp_customize ) {
		$path = get_template_directory() . $this->path . '/epsilon-framework';

		foreach ( $this->controls as $control ) {
			if ( file_exists( $path . '/customizer/controls/class-epsilon-control-' . $control . '.php' ) ) {
				require_once $path . '/customizer/controls/class-epsilon-control-' . $control . '.php';
			}
			if ( file_exists( $path . '/customizer/settings/class-epsilon-setting-' . $control . '.php' ) ) {
				require_once $path . '/customizer/settings/class-epsilon-setting-' . $control . '.php';
			}
		}

		foreach ( $this->sections as $section ) {
			if ( file_exists( $path . '/customizer/sections/class-epsilon-section-' . $section . '.php' ) ) {
				require_once $path . '/customizer/sections/class-epsilon-section-' . $section . '.php';
			}
		}

		foreach ( $this->panels as $panel ) {
			if ( file_exists( $path . '/customizer/panels/class-epsilon-panel-' . $panel . '.php' ) ) {
				require_once $path . '/customizer/panels/class-epsilon-panel-' . $panel . '.php';
			}
		}

		/**
		 * Expose Manager to the Epsilon Customizer class.
		 */
		Epsilon_Customizer::get_instance( $wp_customize );
	}

	/**
	 * @since 1.2.0
	 */
	public function enqueue() {
		wp_enqueue_script( 'epsilon-admin', get_template_directory_uri() . $this->path . '/epsilon-framework/assets/js/epsilon-admin.min.js', array( 'jquery' ) );
		wp_localize_script( 'epsilon-admin', 'EpsilonWPUrls', array(
			'siteurl'    => get_option( 'siteurl' ),
			'theme'      => get_template_directory_uri(),
			'ajaxurl'    => admin_url( 'admin-ajax.php' ),
			'ajax_nonce' => wp_create_nonce( 'epsilon_nonce' ),
		) );
		wp_enqueue_style( 'epsilon-admin', get_template_directory_uri() . $this->path . '/epsilon-framework/assets/css/style-admin.css' );
	}

	/**
	 * Binds JS handlers to make Theme Customizer preview reload changes asynchronously.
	 */
	public function customize_preview_styles() {
		wp_enqueue_style( 'epsilon-styles', get_template_directory_uri() . $this->path . '/epsilon-framework/assets/css/style.css' );
		wp_enqueue_script( 'epsilon-previewer', get_template_directory_uri() . $this->path . '/epsilon-framework/assets/js/epsilon-previewer.js', array(
			'jquery',
			'customize-preview',
		), 2, true );

		wp_localize_script( 'epsilon-previewer', 'EpsilonWPUrls', array(
			'siteurl'    => get_option( 'siteurl' ),
			'theme'      => get_template_directory_uri(),
			'ajaxurl'    => admin_url( 'admin-ajax.php' ),
			'ajax_nonce' => wp_create_nonce( 'epsilon_nonce' ),
		) );
	}

	/*
	 * Our Customizer script
	 *
	 * Dependencies: Customizer Controls script (core)
	 */
	public function customizer_enqueue_scripts() {
		wp_enqueue_script( 'epsilon-object', get_template_directory_uri() . $this->path . '/epsilon-framework/assets/js/epsilon.js', array(
			'jquery',
			'customize-controls',
		) );
		wp_localize_script( 'epsilon-object', 'EpsilonWPUrls', array(
			'siteurl'    => get_option( 'siteurl' ),
			'theme'      => get_template_directory_uri(),
			'ajaxurl'    => admin_url( 'admin-ajax.php' ),
			'ajax_nonce' => wp_create_nonce( 'epsilon_nonce' ),
		) );

		wp_localize_script( 'epsilon-object', 'EpsilonTranslations', array(
			'remove'     => esc_html__( 'Remove', 'epsilon-framework' ),
			'add'        => esc_html__( 'Add', 'epsilon-framework' ),
			'selectFile' => esc_html__( 'Upload image', 'epsilon-framework' ),
			'row'        => esc_html__( 'Row', 'epsilon-framework' ),
		) );

		wp_enqueue_style( 'font-awesome', get_template_directory_uri() . $this->path . '/epsilon-framework/assets/vendors/fontawesome/font-awesome.css' );
		wp_enqueue_style( 'epsilon-styles', get_template_directory_uri() . $this->path . '/epsilon-framework/assets/css/style.css' );
	}

	/**
	 * Function that retrieves image sizes defined in theme
	 *
	 * @return array
	 */
	public static function get_image_sizes() {
		global $_wp_additional_image_sizes;

		$sizes = array();

		foreach ( get_intermediate_image_sizes() as $_size ) {
			if ( in_array( $_size, array( 'thumbnail', 'medium', 'medium_large', 'large' ) ) ) {
				$sizes[ $_size ]['width']  = get_option( "{$_size}_size_w" );
				$sizes[ $_size ]['height'] = get_option( "{$_size}_size_h" );
				$sizes[ $_size ]['crop']   = (bool) get_option( "{$_size}_crop" );
			} elseif ( isset( $_wp_additional_image_sizes[ $_size ] ) ) {
				$sizes[ $_size ] = array(
					'width'  => $_wp_additional_image_sizes[ $_size ]['width'],
					'height' => $_wp_additional_image_sizes[ $_size ]['height'],
					'crop'   => $_wp_additional_image_sizes[ $_size ]['crop'],
				);
			}
		}

		return $sizes;
	}

	/**
	 * Ajax handler
	 */
	public function epsilon_framework_ajax_action() {
		if ( isset( $_POST['args'], $_POST['args']['nonce'] ) && ! wp_verify_nonce( sanitize_key( $_POST['args']['nonce'] ), 'epsilon_nonce' ) ) {
			wp_die(
				wp_json_encode(
					array(
						'status' => false,
						'error'  => esc_html__( 'Not allowed', 'epsilon-framework' ),
					)
				)
			);
		}

		$args_action = array_map( 'sanitize_text_field', wp_unslash( $_POST['args']['action'] ) );

		if ( count( $args_action ) !== 2 ) {
			wp_die(
				wp_json_encode(
					array(
						'status' => false,
						'error'  => esc_html__( 'Not allowed', 'epsilon-framework' ),
					)
				)
			);
		}

		if ( ! class_exists( $args_action[0] ) ) {
			wp_die(
				wp_json_encode(
					array(
						'status' => false,
						'error'  => esc_html__( 'Class does not exist', 'epsilon-framework' ),
					)
				)
			);
		}

		$class  = $args_action[0];
		$method = $args_action[1];
		$args   = array_map( 'sanitize_text_field', wp_unslash( $_POST['args']['args'] ) );

		$response = $class::$method( $args );

		if ( is_array( $response ) ) {
			wp_die( wp_json_encode( $response ) );
		}

		if ( 'ok' === $response ) {
			wp_die(
				wp_json_encode(
					array(
						'status'  => true,
						'message' => 'ok',
					)
				)
			);
		}

		wp_die(
			wp_json_encode(
				array(
					'status'  => false,
					'message' => 'nok',
				)
			)
		);
	}
}
