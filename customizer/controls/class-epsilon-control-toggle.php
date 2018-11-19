<?php
if ( ! defined( 'WPINC' ) ) {
	die;
}

class Epsilon_Control_Toggle extends WP_Customize_Control {
	/**
	 * The type of customize control being rendered.
	 *
	 * @since  1.0.0
	 * @access public
	 * @var    string
	 */
	public $type = 'epsilon-toggle';

	/**
	 * Epsilon_Control_Toggle constructor.
	 *
	 * @param WP_Customize_Manager $manager
	 * @param string               $id
	 * @param array                $args
	 */
	public function __construct( WP_Customize_Manager $manager, $id, array $args = array() ) {
		parent::__construct( $manager, $id, $args );
		$manager->register_control_type( 'Epsilon_Control_Toggle' );
	}

	/**
	 * Add custom parameters to pass to the JS via JSON.
	 *
	 * @since  1.2.0
	 * @access public
	 */
	public function json() {
		$json = parent::json();

		$json['id']      = $this->id;
		$json['link']    = $this->get_link();
		$json['value']   = $this->value();

		return $json;
	}

	/**
	 * Empty, as it should.
	 *
	 * @since  1.0.0
	 * @access public
	 * @return void
	 */
	public function render_content() {}

	/**
	 * @since  1.2.0
	 * @access public
	 */
	public function content_template() {
		//@formatter:off
		?>
		<div class="epsilon-toggle-control">
			<span class="customize-control-title epsilon-toggle-control__title">
				{{{ data.label }}}
				<# if( data.description ){ #>
					<i class="dashicons dashicons-editor-help" style="vertical-align: text-bottom; position: relative;">
						<span class="mte-tooltip">
							{{{ data.description }}}
						</span>
					</i>
				<# } #>
			</span>

			<div class="epsilon-toggle">
				<input class="epsilon-toggle__input" type="checkbox" id="{{{ data.id }}}" name="{{{ data.id }}}" value="{{{ data.value }}}" {{{ data.link }}} <# if( data.value ) { #> checked="checked" <# } #> >
				<div class="epsilon-toggle__items">
					<span class="epsilon-toggle__track"></span>
					<span class="epsilon-toggle__thumb"></span>
					<svg class="epsilon-toggle__off" width="6" height="6" aria-hidden="true" role="img" focusable="false" viewBox="0 0 6 6"><path d="M3 1.5c.8 0 1.5.7 1.5 1.5S3.8 4.5 3 4.5 1.5 3.8 1.5 3 2.2 1.5 3 1.5M3 0C1.3 0 0 1.3 0 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3z"></path></svg>
					<svg class="epsilon-toggle__on" width="2" height="6" aria-hidden="true" role="img" focusable="false" viewBox="0 0 2 6"><path d="M0 0h2v6H0z"></path></svg>
				</div>
			</div>

		</div>
		<?php
		//@formatter:on
	}

}

