<?php
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Class Epsilon_Autoloader
 */
class Epsilon_Autoloader {
	public function __construct() {
		spl_autoload_register( array( $this, 'load' ) );
	}

	/**
	 * @param $class
	 */
	public function load( $class ) {

		$parts = explode( '_', $class );
		$bind  = implode( '-', $parts );

		$directories = array(
			dirname( __FILE__ ) . '/',
			dirname( __FILE__ ) . '/classes/',
			dirname( __FILE__ ) . '/classes/epsilon-demo-generators/',
			dirname( __FILE__ ) . '/customizer/',
			dirname( __FILE__ ) . '/customizer/controls/',
			dirname( __FILE__ ) . '/customizer/sections/',
			dirname( __FILE__ ) . '/customizer/settings/',
			dirname( __FILE__ ) . '/classes/epsilon-demo-generators/',
		);

		foreach ( $directories as $directory ) {
			if ( file_exists( $directory . 'class-' . strtolower( $bind ) . '.php' ) ) {
				require_once $directory . 'class-' . strtolower( $bind ) . '.php';

				return;
			}
		}

	}
}

$autoloader = new Epsilon_Autoloader();
