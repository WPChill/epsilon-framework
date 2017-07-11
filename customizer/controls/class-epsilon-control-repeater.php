<?php
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Class Epsilon_Control_Repeater
 *
 * @since 1.2.0
 */
class Epsilon_Control_Repeater extends WP_Customize_Control {
	/**
	 * The type of customize control being rendered.
	 *
	 * @since  1.2.0
	 * @access public
	 * @var    string
	 */
	public $type = 'epsilon-repeater';
	/**
	 * @since 1.2.0
	 * @var array
	 */
	public $choices = array();
	/**
	 * @since 1.2.0
	 * @var array|mixed
	 */
	public $fields = array();
	/**
	 * @since 1.2.0
	 * @var array
	 */
	public $row_label = array();
	/**
	 * @since 1.2.0
	 * @var string
	 */
	public $button_label = null;
	/**
	 * Will store a filtered version of value for advanced fields.
	 *
	 * @since  1.2.0
	 * @access protected
	 * @var array
	 */
	protected $filtered_value = array();

	/**
	 * Epsilon_Control_Repeater constructor.
	 *
	 * @since 1.2.0
	 *
	 * @param WP_Customize_Manager $manager
	 * @param string               $id
	 * @param array                $args
	 */
	public function __construct( WP_Customize_Manager $manager, $id, array $args = array() ) {
		parent::__construct( $manager, $id, $args );
		$manager->register_control_type( 'Epsilon_Control_Repeater' );
	}

	/**
	 * Load the necessary styles and scripts
	 *
	 * @since 1.2.0
	 */
	public function enqueue() {
		wp_enqueue_script( 'jquery-ui-sortable' );
	}

	/**
	 * Add custom parameters to pass to the JS via JSON.
	 *
	 * @since  1.2.0
	 * @access public
	 */
	public function json() {
		$json = parent::json();

		$json['id']          = $this->id;
		$json['link']        = $this->get_link();
		$json['value']       = $this->value();
		$json['choices']     = $this->choices;
		$json['fields']      = $this->get_fields();
		$json['rowLabel']    = $this->get_row_label();
		$json['buttonLabel'] = ( isset( $this->button_label ) ) ? $this->button_label : __( 'Add', 'epsilon-framework' );
		$json['default']     = ( isset( $this->default ) ) ? $this->default : $this->setting->default;

		return $json;
	}

	/**
	 * Set defaults, label and add an ID for the fields
	 *
	 * @since 1.2.0
	 * @return array|mixed
	 */
	public function get_fields() {
		if ( empty( $this->fields ) || ! is_array( $this->fields ) ) {
			$this->fields = array();
		}

		foreach ( $this->fields as $key => $value ) {
			if ( ! isset( $value['default'] ) ) {
				$this->fields[ $key ]['default'] = '';
			}

			if ( ! isset( $value['label'] ) ) {
				$this->fields[ $key ]['label'] = '';
			}

			/**
			 * Range Slider defaults
			 */
			if ( 'epsilon-slider' === $value['type'] ) {
				if ( ! isset( $this->fields[ $key ]['choices'] ) ) {
					$this->fields[ $key ]['choices'] = array();
				}

				$default = array(
					'min'  => 0,
					'max'  => 10,
					'step' => 1,
				);

				$this->fields[ $key ]['choices'] = wp_parse_args( $this->fields[ $key ]['choices'], $default );
			}

			/**
			 * Epsilon Image
			 */
			if ( 'epsilon-image' === $value['type'] ) {
				if ( ! isset( $this->fields[ $key ]['default'] ) ) {
					$this->fields[ $key ]['default'] = array();
				}

				$this->fields[ $key ]['mode'] = ! empty( $this->fields[ $key ]['mode'] ) ? $this->fields[ $key ]['mode'] : 'url';
			}

			/**
			 * Color picker defaults
			 */
			if ( 'epsilon-color-picker' === $value['type'] ) {
				$this->fields[ $key ]['mode'] = ! empty( $this->fields[ $key ]['mode'] ) ? $this->fields[ $key ]['mode'] : 'hex';
			}

			$this->fields[ $key ]['id'] = $key;
		} // End foreach().

		return $this->fields;
	}

	/**
	 * Setup the row's label
	 *
	 * @since 1.2.0
	 * @return array
	 */
	public function get_row_label() {
		$default = array(
			'type'  => 'text',
			'value' => esc_html__( 'Row', 'epsilon-framework' ),
			'field' => false,
		);

		return wp_parse_args( $this->row_label, $default );
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
		//@formatter:off  ?>
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

		<ul class="repeater-fields"></ul>
		<div class="button-holder">
			<button class="button-primary epsilon-repeater-add">{{ data.buttonLabel }}</button>
		</div>
		<?php //@formatter:on
	}
}
