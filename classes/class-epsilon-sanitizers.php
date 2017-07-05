<?php
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Class Epsilon_Sanitizers
 */
class Epsilon_Sanitizers {
	/**
	 * @since 1.2.0
	 *
	 * @param $value
	 *
	 * @return string
	 *
	 * https://wordpress.stackexchange.com/questions/257581/escape-hexadecimals-rgba-values
	 */
	public static function rgba( $value ) {
		// If empty or an array return transparent
		if ( empty( $value ) || is_array( $value ) ) {
			return 'rgba(0,0,0,0)';
		}

		// If string does not start with 'rgba', then treat as hex
		// sanitize the hex color and finally convert hex to rgba
		if ( false === strpos( $value, 'rgba' ) ) {
			return sanitize_hex_color( $value );
		}
		// By now we know the string is formatted as an rgba color so we need to further sanitize it.
		$value = str_replace( ' ', '', $value );
		sscanf( $value, 'rgba(%d,%d,%d,%f)', $red, $green, $blue, $alpha );

		return 'rgba(' . $red . ',' . $green . ',' . $blue . ',' . $alpha . ')';
	}
}