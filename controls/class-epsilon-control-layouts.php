<?php
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Class Epsilon_Control_Layouts
 *
 * @since 1.2.0
 */
class Epsilon_Control_Layouts extends WP_Customize_Control {
	/**
	 * The type of customize control being rendered.
	 *
	 * @since  1.2.0
	 * @access public
	 * @var    string
	 */
	public $type = 'epsilon-layouts';

	/**
	 * Choices array
	 *
	 * @since 1.2.0
	 * @var array
	 */
	public $choices = array();

	/**
	 * Epsilon_Control_Layout constructor.
	 *
	 * @since 1.2.0
	 *
	 * @param WP_Customize_Manager $manager
	 * @param string               $id
	 * @param array                $args
	 */
	public function __construct( WP_Customize_Manager $manager, $id, array $args = array() ) {
		parent::__construct( $manager, $id, $args );
		$manager->register_control_type( 'Epsilon_Control_Layouts' );
	}

	/**
	 * Add custom parameters to pass to the JS via JSON.
	 *
	 * @since  1.2.0
	 * @access public
	 */
	public function json() {
		$json            = parent::json();
		$json['choices'] = $this->get_choices();
		$json['id']      = $this->id;
		$json['link']    = $this->get_link();
		$json['value']   = $this->value();

		$this->json['inputAttrs'] = '';
		foreach ( $this->input_attrs as $attr => $value ) {
			$this->json['inputAttrs'] .= $attr . '="' . esc_attr( $value ) . '" ';
		}

		return $json;
	}

	/**
	 * Create a custom array to hold options
	 *
	 * @since 1.2.0
	 * @acces private
	 */
	private function get_choices() {
		$arr = array();
		foreach ( $this->choices as $k => $v ) {
			$arr[] = array(
				'value' => $k,
				'label' => $v,
			);
		}

		return $arr;
	}

	/**
	 * As it should be
	 *
	 * @since 1.2.0
	 */
	public function render_content() {
	}

	/**
	 * Displays the control content.
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
		</label>

		<div class="epsilon-layouts-container">
			<div class="customize-control-content">
				<input {{{ data.link }}} {{{ data.inputAttrs }}} type="hidden" <# if( data.value ) { value="{{ data.value }} " } #>/>
			</div>
			<div class="epsilon-layouts-container-buttons">
				<span class="epsilon-button-label"><?php echo esc_html__( 'Columns', 'epsilon-framework' ); ?></span>
				<div class="epsilon-button-group">
					<# if( data.choices.length > 0 ){ #>
						<# i = 1 #>
						<# for (choice in data.choices) { #>
							<a href="#" data-button-value="{{ data.choices[choice].value }}">
								<img src="{{ data.choices[choice].label }}" />
							</a>
						<# } #>
					<# } #>
				</div>

				<a href="#" class="epsilon-layouts-advanced-toggler" data-unique-id="{{{ data.id }}}">
					<span class="dashicons dashicons-admin-generic"></span>
				</a>
			</div>

			<div class="epsilon-layouts-container-advanced" id="{{{ data.id }}}">
				<span class="epsilon-layouts-container-label"><?php echo esc_html__( 'Edit column size', 'epsilon-framework' ) ?></span>
				<div class="epsilon-layouts-setup">
					<div class="epsilon-column col3" data-columns="3">
						<a href="#" data-action="left"><span class="dashicons dashicons-arrow-left"></span></a>
						<a href="#" data-action="right"><span class="dashicons dashicons-arrow-right"></span></a>
					</div>
					<div class="epsilon-column col3" data-columns="3">
						<a href="#" data-action="left"><span class="dashicons dashicons-arrow-left"></span></a>
						<a href="#" data-action="right"><span class="dashicons dashicons-arrow-right"></span></a>
					</div>
					<div class="epsilon-column col3" data-columns="3">
						<a href="#" data-action="left"><span class="dashicons dashicons-arrow-left"></span></a>
						<a href="#" data-action="right"><span class="dashicons dashicons-arrow-right"></span></a>
					</div>
					<div class="epsilon-column col3" data-columns="3">
						<a href="#" data-action="left"><span class="dashicons dashicons-arrow-left"></span></a>
						<a href="#" data-action="right"><span class="dashicons dashicons-arrow-right"></span></a>
					</div>
				</div>
			</div>
		</div>
		<?php //@formatter:on
	}
}
