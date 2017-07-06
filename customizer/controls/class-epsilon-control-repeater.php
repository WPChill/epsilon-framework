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
		$json['default'] = ( isset( $this->default ) ) ? $this->default : $this->setting->default;

		return $json;
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
		/**
		 * Print templates in footer
		 */
		add_action( 'customize_controls_print_footer_scripts', array(
			$this,
			'repeater_js_template',
		), 99 );

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
		<button class="button-secondary epsilon-repeater-add"><?php echo __( 'Add', 'epsilon-framework' ); ?></button>
		<?php //@formatter:on
	}

	/**
	 * Underscore template for this control's content.
	 *
	 * @access public
	 */
	public function repeater_js_template() {
		//@formatter:off  ?>
	<script type="text/html" class="customize-control-epsilon-repeater-content">
		<# var field; var index = data.index; #>
			<li class="repeater-row minimized" data-row="{{{ index }}}">
				<div class="repeater-row-header">
					<span class="repeater-row-label"></span>
					<i class="dashicons dashicons-arrow-down repeater-minimize"></i>
				</div>
				<div class="repeater-row-content">
				<# _.each( data, function( field, i ) { #>
					<div class="repeater-field repeater-field-{{{ field.type }}}">
						<# if ( 'text' === field.type || 'url' === field.type || 'link' === field.type || 'email' === field.type || 'tel' === field.type || 'date' === field.type || 'number' === field.type ) { #>
							<# var fieldExtras = ''; #>
							<# if ( 'link' === field.type ) { #>
								<# field.type = 'url' #>
							<# } #>

							<# if ( 'number' === field.type ) { #>
								<# if ( ! _.isUndefined( field.choices ) && ! _.isUndefined( field.choices.min ) ) { #>
									<# fieldExtras += ' min="' + field.choices.min + '"'; #>
								<# } #>
								<# if ( ! _.isUndefined( field.choices ) && ! _.isUndefined( field.choices.max ) ) { #>
									<# fieldExtras += ' max="' + field.choices.max + '"'; #>
								<# } #>
								<# if ( ! _.isUndefined( field.choices ) && ! _.isUndefined( field.choices.step ) ) { #>
									<# fieldExtras += ' step="' + field.choices.step + '"'; #>
								<# } #>
							<# } #>

							<label>
								<# if ( field.label ) { #><span class="customize-control-title">{{ field.label }}</span><# } #>
								<# if ( field.description ) { #><span class="description customize-control-description">{{ field.description }}</span><# } #>
								<input type="{{field.type}}" name="" value="{{{ field.default }}}" data-field="{{{ field.id }}}" {{ fieldExtras }}>
							</label>
						<# } #>
					</div>
					<button type="button" class="button-link epsilon-repeater-row-remove"><?php esc_attr_e( 'Remove', 'kirki' ); ?></button>
				<# } #>
				</div>
			</li>
	</script>
	<?php //@formatter:on
	}
}
