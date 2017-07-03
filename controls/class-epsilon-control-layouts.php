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
	}

	/**
	 * Displays the control content.
	 *
	 * @since 1.2.0
	 */
	public function render_content() {
		?>
		<label>
			<span class="customize-control-title">
				<?php echo esc_attr( $this->label ); ?>
				<?php if ( ! empty( $this->description ) ) : ?>
					<i class="dashicons dashicons-editor-help" style="vertical-align: text-bottom; position: relative;">
						<span class="mte-tooltip"><?php echo wp_kses_post( $this->description ); ?></span>
					</i>
				<?php endif; ?>
			</span> </label>
		<div class="epsilon-layouts-container">
			<div class="epsilon-layouts-container-buttons">
				<span class="epsilon-button-label"><?php echo esc_html__( 'Columns', 'epsilon-framework' ); ?></span>
				<div class="epsilon-button-group">
					<?php foreach ( $this->choices as $choice => $label ) : ?>
						<a href="#" data-button-value="<?php echo esc_attr( $choice ) ?>">
							<img src="<?php echo esc_url( $label ) ?>"/> </a>
					<?php endforeach; ?>
				</div>
				<a href="#" class="epsilon-layouts-advanced-toggler" data-unique-id="<?php echo esc_attr( $this->id ) ?>"><span class="dashicons dashicons-admin-generic"></span></a>
			</div>

			<div class="epsilon-layouts-container-advanced" id="<?php echo esc_attr( $this->id ) ?>">
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
		<?php
	}
}
