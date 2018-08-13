<?php
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Class Epsilon_Control_Icon_Picker
 */
class Epsilon_Control_Icon_Picker extends WP_Customize_Control {

	/**
	 * @since 1.0.0
	 * @var string
	 */
	public $type = 'epsilon-icon-picker';

	/**
	 * @since 1.0.0
	 * @var array
	 */
	public $icons = array();

	/**
	 * Epsilon_Control_Icon_Picker constructor.
	 *
	 * @param WP_Customize_Manager $manager
	 * @param string               $id
	 * @param array                $args
	 */
	public function __construct( WP_Customize_Manager $manager, $id, array $args = array() ) {
		parent::__construct( $manager, $id, $args );
		$manager->register_control_type( 'Epsilon_Control_Icon_Picker' );
	}

	/**
	 * Enqueue scripts
	 */
	public function enqueue() {
		wp_enqueue_script( 'iconpicker', EPSILON_URI . '/assets/vendors/jquery-fonticonpicker/jquery.fonticonpicker.min.js', array( 'jquery' ), '1.2.0', true );
		wp_enqueue_style( 'iconpicker', EPSILON_URI . '/assets/vendors/jquery-fonticonpicker/jquery.fonticonpicker.min.css' );
		wp_enqueue_style( 'iconpicker-grey', EPSILON_URI . '/assets/vendors/jquery-fonticonpicker/jquery.fonticonpicker.grey.min.css', array( 'iconpicker' ) );
		wp_localize_script( 'iconpicker', 'EpsilonIconPack', $this->get_icons() );
	}

	/**
	 * @since 1.0.0
	 * @return array
	 */
	public function json() {
		$json          = parent::json();
		$json['id']    = $this->id;
		$json['link']  = $this->get_link();
		$json['value'] = $this->value();

		return $json;
	}

	/**
	 * @since 1.0.0
	 * @return mixed
	 */
	public function get_icons() {
		$icons = Epsilon_Icons::new_icons();

		return $icons;
	}

	/**
	 * Display the control's content
	 */
	public function content_template() {
		//@formatter:off ?>
		<label for="{{{ data.id }}}" class="epsilon-icon-picker-label">
			<span class="customize-control-title epsilon-button-label">
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
		<input id="{{{ data.id }}}" type="text" class="epsilon-icon-picker" {{{ data.link }}} value="{{{ data.value }}}">
	<?php //@formatter:on
	}

	/**
	 * Empty, as it should be
	 *
	 * @since 1.0.0
	 */
	public function render_content() {
	}
}
