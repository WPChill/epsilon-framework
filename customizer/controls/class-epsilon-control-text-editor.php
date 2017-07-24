<?php
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Class Epsilon_Control_Text_Editor
 *
 * @since 1.2.0
 */
class Epsilon_Control_Text_Editor extends WP_Customize_Control {

	/**
	 * @since 1.2.0
	 * @var string
	 */
	public $type = 'epsilon-text-editor';

	/**
	 * Epsilon_Control_Text_Editor constructor.
	 *
	 * @param WP_Customize_Manager $manager
	 * @param string               $id
	 * @param array                $args
	 */
	public function __construct( WP_Customize_Manager $manager, $id, array $args = array() ) {
		parent::__construct( $manager, $id, $args );
		$manager->register_control_type( 'Epsilon_Control_Text_Editor' );
	}

	/**
	 * @since 1.2.0
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
	 * @since 1.2.0
	 */
	public function enqueue() {
		wp_enqueue_editor();
	}

	/**
	 * @since 1.2.0
	 * Display the control's content
	 */
	public function content_template() {
		//@formatter:off ?>
		<label>
			<span class="customize-control-title">
				<# if( data.label ){ #>
					<span class="customize-control-title">{{{ data.label }}}</span>
				<# } #>

				<# if( data.description ){ #>
					<span class="description customize-control-description">{{{ data.description }}}</span>
				<# } #>
			</span>
			<textarea id="{{{ data.id }}}-editor" class="widefat text wp-editor-area" {{{ data.link }}}>{{{ data.value }}}</textarea>
		</label>
	<?php //@formatter:on
	}

	/**
	 * Empty, as it should be
	 *
	 * @since 1.2.0
	 */
	public function render_content() {
	}
}
