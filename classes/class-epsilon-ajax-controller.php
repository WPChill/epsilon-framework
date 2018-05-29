<?php
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * @since 1.1.0
 * Class Epsilon_Ajax_Controller
 */
class Epsilon_Ajax_Controller {
	/**
	 * Epsilon_Ajax_Controller constructor.
	 */
	public function __construct() {
		/**
		 * Action for easier AJAX handling
		 */
		add_action( 'wp_ajax_epsilon_framework_ajax_action', array(
			$this,
			'epsilon_framework_ajax_action',
		) );

		/**
		 * If user is not logged in, send a notice
		 */
		add_action( 'wp_ajax_nopriv_epsilon_framework_ajax_action', array(
			$this,
			'not_logged_notice',
		) );
	}

	/**
	 * Ajax handler
	 */
	public function epsilon_framework_ajax_action() {
		$this->_check_nonce();
		$this->_check_user_role();
		$args_action = array_map( 'sanitize_text_field', wp_unslash( $_POST['args']['action'] ) );
		$this->_check_structure( $args_action );
		$this->_check_class( $args_action[0] );
		
		$class  = $args_action[0];
		$method = $args_action[1];

		if ( 'generate_partial_section' === $method ) {
			$args = array_map( 'Epsilon_Ajax_Controller::sanitize_arguments_for_output', wp_unslash( $_POST['args']['args'] ) );
		} else {
			$args = isset( $_POST['args']['args'] ) ? $_POST['args']['args'] : $_POST['args'];
			$args = array_map( 'Epsilon_Ajax_Controller::sanitize_arguments', wp_unslash( $args ) );
		}

		$response = $class::$method( $args );

		if ( is_array( $response ) ) {
			$this->send_response( $response );
		}

		if ( 'ok' === $response ) {
			$this->send_response(
				array(
					'status'  => true,
					'message' => 'ok',
				)
			);
		}

		$this->send_response(
			array(
				'status'  => false,
				'message' => 'nok',
			)
		);
	}

	/**
	 * Send response
	 *
	 * @param array $args
	 */
	public function send_response( $args = array() ) {
		wp_die( wp_json_encode( $args ) );
	}

	/**
	 * Sanitizers
	 *
	 * @param $args
	 *
	 * @return array|string
	 */
	public static function sanitize_arguments( $args ) {
		if ( is_array( $args ) ) {
			return array_map( 'sanitize_text_field', $args );
		} else {
			return sanitize_text_field( $args );
		}
	}

	/**
	 * Output sanitizers
	 *
	 * @param $args
	 *
	 * @return array|string
	 */
	public static function sanitize_arguments_for_output( $args ) {
		if ( is_array( $args ) ) {
			return array_map( 'Epsilon_Ajax_Controller::sanitize_arguments_for_output', $args );
		} else {
			return wp_kses_post( $args );
		}
	}

	/**
	 * Not logged in
	 *
	 * @return string
	 */
	public static function not_logged_notice() {
		return esc_html__( 'You must be logged in to do that!', 'epsilon-framework' );
	}

	/**
	 * Checks nonce
	 *
	 * @return bool
	 */
	private function _check_nonce() {
		if ( isset( $_POST['args'], $_POST['args']['nonce'] ) && ! wp_verify_nonce( sanitize_key( $_POST['args']['nonce'] ), 'epsilon_nonce' ) ) {

			$this->send_response(
				array(
					'status' => false,
					'error'  => esc_html__( 'Not allowed', 'epsilon-framework' ),
				)
			);
		}

		return true;
	}

	/**
	 * Check if class exists
	 *
	 * @param string $class
	 *
	 * @return bool
	 */
	private function _check_class( $class = '' ) {
		if ( ! class_exists( $class ) ) {
			$this->send_response(
				array(
					'status' => false,
					'error'  => esc_html__( 'Class does not exist', 'epsilon-framework' ),
				)
			);
		}

		return true;
	}

	/**
	 * Check array structure
	 *
	 * @param $action
	 *
	 * @return bool
	 */
	private function _check_structure( $action ) {
		if ( count( $action ) !== 2 ) {
			$this->send_response(
				array(
					'status' => false,
					'error'  => esc_html__( 'Not allowed', 'epsilon-framework' ),
				)
			);
		}

		return true;
	}

	/**
	 * Check user role
	 */
	private function _check_user_role() {
		$super_admin = is_super_admin( get_current_user_id() );
		if ( ! $super_admin ) {
			$this->send_response(
				array(
					'status' => false,
					'error'  => esc_html__( 'You must be a Super User!', 'epsilon-framework' ),
				)
			);
		}

		return true;
	}
}
