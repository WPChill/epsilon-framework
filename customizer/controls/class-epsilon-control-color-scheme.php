<?php
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Class Epsilon_Color_Scheme
 */
class Epsilon_Control_Color_Scheme extends WP_Customize_Control {
	/**
	 * The type of customize control being rendered.
	 *
	 * @since  1.0.0
	 * @access public
	 * @var    string
	 */
	public $type = 'epsilon-color-scheme';

	/**
	 * Choice array
	 *
	 * @since 1.2.0
	 * @var array
	 */
	public $choices = array();

	/**
	 * Epsilon_Control_Color_Scheme constructor.
	 *
	 * @since 1.2.0
	 *
	 * @param WP_Customize_Manager $manager
	 * @param string               $id
	 * @param array                $args
	 */
	public function __construct( WP_Customize_Manager $manager, $id, array $args = array() ) {
		parent::__construct( $manager, $id, $args );
		$manager->register_control_type( 'Epsilon_Control_Color_Scheme' );
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
		$json['choices'] = $this->get_choices();

		return $json;
	}

	/**
	 * Arrange array so we can handle it easier
	 *
	 * @since 1.2.0
	 */
	public function get_choices() {
		foreach ( $this->choices as $index => $choice ) {
			$this->choices[ $index ]['encodedColors'] = json_encode( $choice['colors'] );
		}

		return $this->choices;
	}

	/**
	 * Display the control content
	 *
	 * @since 1.2.0
	 */
	public function content_template() {
		//@formatter:off ?>
		<label>
			<span class="customize-control-title">
				{{{ data.label }}}
				<# if( data.description ){ #>
					<i class="dashicons dashicons-editor-help" style="vertical-align: text-bottom; position: relative;">
						<span class="mte-tooltip">
							{{{ data.description }}}
						</span>
					</i>
				<# } #>
			</span>
			<div class="customize-control-content">
				<input {{{ data.link }}} class="epsilon-color-scheme-input" id="input_{{ data.id }}" type="hidden" <# if( data.value ) { #> value='{{{ data.value }}}' <# } #> />
			</div>
			<div id="color_scheme_{{ data.id }}" class="epsilon-color-scheme">
				<# if( data.choices.length > 0 ){ #>
					<# for (choice in data.choices) { #>
					<div class="epsilon-color-scheme-option <# if ( data.value === data.choices[choice].id ) { #> selected <# } #>" data-color-id="{{{ data.choices[choice].id }}}">
						<input type="hidden" value='{{{ data.choices[choice].encodedColors }}}'/>
						<span class="epsilon-color-scheme-name"> {{{ data.choices[choice].name }}} </span>
						<div class="epsilon-color-scheme-palette">
							<# for (current in data.choices[choice].colors ) { #>
								<span style="background-color: {{ data.choices[choice].colors[current] }}"></span>
							<# } #>
						</div>
					</div>
					<# } #>
				<# } #>
			</div>
		</label>
		<?php //@formatter:on
	}

	/**
	 * Empty, as it should be
	 *
	 * @since  1.0.0
	 * @access public
	 * @return void
	 */
	public function render_content() {

	}
}
