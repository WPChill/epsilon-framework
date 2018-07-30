<?php
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * @since 1.0.0
 * Class Epsilon_Notifications
 */
class Epsilon_Notifications {
	/**
	 * Denied metas
	 *
	 * @var array
	 */
	private static $denied = array(
		'wp_capabilities',
		'wp_user_level',
		'nickname',
		'first_name',
		'last_name',
		'description',
	);
	/**
	 * @since 1.0.0
	 * @var null
	 */
	private static $instance = null;
	/**
	 * @since 1.0.0
	 * @var array
	 */
	public $notices = array();
	/**
	 * @since 1.0.0
	 * @var string
	 */
	public $html = '<div class="epsilon-framework-notice is-dismissible %1$s" data-unique-id="%2$s">%3$s</div>';

	/**
	 * Epsilon_Notifications constructor.
	 */
	public function __construct() {
		add_action( 'admin_notices', array( $this, 'display_notices' ) );
	}

	/**
	 * We need to grab instances of this object, so we can add multiple notices at the same time
	 *
	 * @return Epsilon_Notifications
	 */
	public static function get_instance() {
		if ( is_null( self::$instance ) ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	/**
	 * Adds a notice to the array
	 *
	 * @param array $notice
	 */
	public function add_notice( $notice = array() ) {
		$this->notices[] = $notice;

		$this->_build_options();
	}

	/**
	 * Build options
	 */
	private function _build_options() {
		$notices = get_option( 'epsilon_framework_notices', array() );
		$option  = array();
		foreach ( $this->notices as $k => $v ) {
			$option[] = $v['id'];
		}

		$equal_arrays = serialize( $notices ) === serialize( $option );
		if ( $equal_arrays ) {
			return;
		}


		$option = $equal_arrays
			? array_unique( array_merge( $option, $notices ) )
			: array_unique( array_merge( $option, array() ) );

		update_option( 'epsilon_framework_notices', $option );
	}

	/**
	 * Displays notices in the frontend
	 *
	 * @since 1.0.0
	 */
	public function display_notices() {
		foreach ( $this->notices as $notice ) {
			if ( get_user_meta( get_current_user_id(), $notice['id'], true ) ) {
				continue;
			}

			printf( $this->html, esc_attr( $notice['type'] ), esc_attr( $notice['id'] ), wp_kses_post( $notice['message'] ) );
		}
	}

	/**
	 * Dismiss a notice
	 *
	 * @param $args
	 *
	 * @return string
	 */
	public static function dismiss_notice( $args ) {
		$options = get_option( 'epsilon_framework_notices', array() );
		if ( empty( $options ) ) {
			return 'nok';
		}

		if ( in_array( $args['notice_id'], self::$denied ) ) {
			return 'nok';
		}

		if ( ! in_array( $args['notice_id'], $options ) ) {
			return 'nok';
		}

		add_user_meta( $args['user_id'], $args['notice_id'], 'true', true );

		return 'ok';
	}
}
