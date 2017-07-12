<?php
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Class Epsilon_Control_Icon_Picker
 */
class Epsilon_Control_Icon_Picker extends WP_Customize_Control {

	public $type = 'epsilon-iconpicker';

	public $icons;

	public function __construct( WP_Customize_Manager $manager, $id, array $args = array() ) {
		parent::__construct( $manager, $id, $args );
		$manager->register_control_type( 'Epsilon_Control_Icon_Picker' );
	}

	public function json() {
		$json = parent::json();
		$json['id']     = $this->id;
		$json['link']   = $this->get_link();
		$json['value']  = $this->value();
		$json['icons']  = $this->get_icons();
		return $json;
	}
	/**
	 * @since 1.2.0
	 */
	public function enqueue() {
	}


	public function get_icons() {
		global $wp_filesystem;
		if ( empty( $wp_filesystem ) ) {
			require_once( ABSPATH . '/wp-admin/includes/file.php' );
			WP_Filesystem();
		}
		$path   = get_template_directory() . $this->icons;
		$icons = $wp_filesystem->get_contents( $path );
		return $icons;
	}

	/**
	 * Display the control's content
	 */
	public function content_template() {
		//@formatter:off ?>
		<label class="epsilon-icon-picker-label">
			<span class="customize-control-title">
				<# if( data.label ){ #>
					<span class="customize-control-title">{{{ data.label }}}</span>
				<# } #>

				<# if( data.description ){ #>
					<span class="description customize-control-description">{{{ data.description }}}</span>
				<# } #>
			</span>
			<span class="epsilon-icon-contianer">
				<i class="{{{ data.value }}}"></i>
				<span class="dashicons dashicons-arrow-down epsilon-open-iconpicker"></span>
			</span>
		</label>
		<input type="hidden" class="epsilon-icon-pack" value='{{{ data.icons }}}'>
		<input type="hidden" class="epsilon-icon-picker" {{{ data.link }}} value="{{{ data.value }}}">
		<div class="epsilon-icon-picker-contianer">
			<div class="search-container">
				<input type="text" class="widefat text">
			</div>
			<div class="epsilon-icons-container">
				<div class="epsilon-icons"></div>
			</div>
		</div>
		
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
