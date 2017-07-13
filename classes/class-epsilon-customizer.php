<?php
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Easier way to add panels,sections,controls
 *
 * @since 1.2.0
 *
 * Class Epsilon_Customizer
 */
class Epsilon_Customizer {
	/**
	 * This function is called by self::add_field()
	 *
	 * @since 1.2.0
	 *
	 * @param $id
	 */
	private static function add_setting( $id, array $args = array() ) {
		global $wp_customize;
		unset( $args['type'] );

		if ( empty( $args['sanitize_callback'] ) ) {
			$args['sanitize_callback'] = self::_get_sanitizer( $args['setting_type'] );
		}

		$class = self::_get_type( $args['setting_type'], 'setting' );

		$wp_customize->add_setting(
			new $class['class'](
				$wp_customize,
				$id,
				$args
			)
		);
	}

	/**
	 * Add control function ( this will automatically add the setting, based on the field type )
	 *
	 * @since 1.2.0
	 *
	 * @param       $id
	 * @param array $args
	 */
	public static function add_field( $id, array $args = array() ) {
		global $wp_customize;
		self::add_setting( $id, $args );

		$field_type = self::_get_type( $args['type'], 'control' );

		$wp_customize->add_control(
			new $field_type['class'](
				$wp_customize,
				$id,
				$args
			)
		);
	}

	/**
	 * Add section
	 *
	 * @since 1.2.0
	 *
	 * @param       $id
	 * @param array $args
	 */
	public static function add_section( $id, array $args = array() ) {
		global $wp_customize;
		$wp_customize->add_section( $id, $args );
	}

	/**
	 * Add panel
	 *
	 * @since 1.2.0
	 *
	 * @param array $args
	 */
	public static function add_panel( $id, array $args = array() ) {
		global $wp_customize;
		$wp_customize->add_panel( $id, $args );
	}

	/**
	 * Add multiple customizer elements at once
	 *
	 * @since 1.2.0
	 *
	 * @param array $collection
	 */
	public static function add_multiple( array $collection = array() ) {
		foreach ( $collection as $type => $items ) {
			foreach ( $items as $item ) {
				$func = 'self::add_' . $type;
				call_user_func( $func, $item['id'], $item['args'] );
			}
		}
	}

	/**
	 * Get the class name and field type
	 *
	 * @since 1.2.0
	 *
	 * @param $type
	 */
	public static function _get_type( $type = '', $prefix = '' ) {
		$type  = explode( '-', $type );
		$class = 'WP_Customize_Control';

		if ( 1 < count( $type ) && 'epsilon' === $type[0] ) {
			$class = implode( '_', $type );
			$class = str_replace( 'epsilon_', 'epsilon_' . $prefix . '_', $class );
		}

		return array(
			'class' => $class,
		);
	}

	/**
	 * Dynamic sanitization
	 *
	 * @param $type
	 *
	 * @return array|string
	 */
	public static function _get_sanitizer( $type = '' ) {
		/**
		 * Dynamic sanitizer, based on field type
		 */
		switch ( $type ) {
			case 'text':
				$sanitizer = 'sanitize_text_field';
			case 'url':
				$sanitizer = 'esc_url_raw';
				break;
			case 'email':
				$sanitizer = 'sanitize_email';
				break;
			case 'textarea':
				$sanitizer = 'sanitize_textarea_field';
				break;
			case 'epsilon-toggle':
			case 'checkbox':
				$sanitizer = array( 'Epsilon_Sanitizer', 'checkbox' );
				break;
			case 'radio':
				$sanitizer = array( 'Epsilon_Sanitizer', 'radio_buttons' );
				break;
			case 'epsilon-repeater':
			case 'epsilon-section-repeater':
				/**
				 * Already sanitized by the setting
				 */
				$sanitizer = '';
				break;
			case 'epsilon-slider':
				$sanitizer = 'absint';
				break;
			case 'epsilon-typography':
				break;
			case 'epsilon-layouts':
				break;
			case 'epsilon-color-scheme':
				break;
			case 'epsilon-color-picker':
				$sanitizer = 'sanitize_hex_color';
				if ( 'rgba' === $args['mode'] ) {
					$sanitizer = array( 'Epsilon_Sanitizer', 'rgba' );
				}
				break;
			default:
				$sanitizer = 'sanitize_text_field';
				break;
		}// End switch().

		return $sanitizer;
	}
}
