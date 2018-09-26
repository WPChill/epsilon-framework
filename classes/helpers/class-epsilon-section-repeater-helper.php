<?php
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Class Epsilon_Section_Repeater_Helper
 */
class Epsilon_Section_Repeater_Helper {

	/**
	 * @var null
	 */
	public $id = null;

	/**
	 * Epsilon_Section_Repeater_Helper constructor.
	 */
	public function __construct( $args = array() ) {
		$this->id = $args['id'];
	}

	/**
	 * @param array $args
	 *
	 * @return Epsilon_Section_Repeater_Helper
	 */
	public static function get_instance( $args = array() ) {
		static $inst;
		if ( ! $inst ) {
			$inst = new Epsilon_Section_Repeater_Helper( $args );
		}

		return $inst;
	}

	/**
	 * Set group type
	 */
	public function set_group_type( $choices = array() ) {
		$arr = array(
			0 => 'none',
			1 => 'one',
			2 => 'two',
			3 => 'three',
			4 => 'four',
			5 => 'five',
			6 => 'six',
		);

		return $arr[ count( $choices ) ];
	}

	/**
	 * Create the choices array
	 *
	 * @param string $key
	 * @param array  $choices
	 *
	 * @return array
	 */
	public function create_choices_array( $key = '', $choices = array() ) {
		$arr = array();

		foreach ( $choices as $choice ) {
			$exists = array_key_exists( $choice, $this->{$key} );
			if ( $exists ) {
				$arr[ $choice ] = $this->{$key}[ $choice ];
			}
		}

		return $arr;
	}
}
