<?php
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Class Epsilon_Control_WYSIWYG
 */
class Epsilon_Control_WYSIWYG extends WP_Customize_Control {

	public $type = 'epsilon-wysiwyg';

	public function __construct( WP_Customize_Manager $manager, $id, array $args = array() ) {
		parent::__construct( $manager, $id, $args );
		$manager->register_control_type( 'Epsilon_Control_WYSIWYG' );
	}

	public function json() {
		$json = parent::json();
		$json['id']     = $this->id;
		$json['link']   = $this->get_link();
		$json['value']  = $this->value();
		return $json;
	}
	/**
	 * @since 1.2.0
	 */
	public function enqueue() {
		wp_enqueue_editor();
	}
	/**
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
