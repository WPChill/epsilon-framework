<?php
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Class Epsilon_Control_Section_Repeater
 *
 * @since 1.2.0
 */
class Epsilon_Control_Section_Repeater extends WP_Customize_Control {
	/**
	 * The type of customize control being rendered.
	 *
	 * @since  1.2.0
	 * @access public
	 * @var    string
	 */
	public $type = 'epsilon-section-repeater';

	/**
	 * @since 1.2.0
	 * @var array
	 */
	public $repeatable_sections = array();

	/**
	 * @since 1.2.0
	 * @var array
	 */
	public $choices = array();

	/**
	 * Epsilon_Control_Section_Repeater constructor.
	 *
	 * @since 1.2.0
	 *
	 * @param WP_Customize_Manager $manager
	 * @param string               $id
	 * @param array                $args
	 */
	public function __construct( WP_Customize_Manager $manager, $id, array $args = array() ) {
		parent::__construct( $manager, $id, $args );
		$manager->register_control_type( 'Epsilon_Control_Section_Repeater' );
	}

	/**
	 * @since 1.2.0
	 *
	 * @return array
	 */
	public function json() {
		$json = parent::json();

		$json['id']       = $this->id;
		$json['link']     = $this->get_link();
		$json['choices']  = $this->choices;
		$json['value']    = $this->value();
		$json['sections'] = $this->set_repeatable_sections();
		$json['default']  = ( isset( $this->default ) ) ? $this->default : $this->setting->default;

		return $json;
	}

	/**
	 * @since 1.2.0
	 */
	public function set_repeatable_sections() {
		if ( empty( $this->repeatable_sections ) || ! is_array( $this->repeatable_sections ) ) {
			$this->repeatable_sections = array();
		}

		foreach ( $this->repeatable_sections as $key => $value ) {
			foreach ( $value['fields'] as $k => $v ) {
				if ( ! isset( $v['default'] ) ) {
					$this->repeatable_sections[ $key ]['fields'][ $k ]['default'] = '';
				}

				if ( ! isset( $v['label'] ) ) {
					$this->repeatable_sections[ $key ]['fields'][ $k ]['label'] = '';
				}

				/**
				 * Range Slider defaults
				 */
				if ( 'epsilon-slider' === $v['type'] ) {
					if ( ! isset( $this->repeatable_sections[ $key ]['fields'][ $k ]['choices'] ) ) {
						$this->repeatable_sections[ $key ]['fields'][ $k ]['choices'] = array();
					}

					$default = array(
						'min'  => 0,
						'max'  => 10,
						'step' => 1,
					);

					$this->repeatable_sections[ $key ]['fields'][ $k ]['choices'] = wp_parse_args( $this->repeatable_sections[ $key ]['fields'][ $k ]['choices'], $default );
				}

				/**
				 * Epsilon Image
				 */
				if ( 'epsilon-image' === $v['type'] ) {
					if ( ! isset( $this->repeatable_sections[ $key ]['fields'][ $k ]['default'] ) ) {
						$this->repeatable_sections[ $key ]['fields'][ $k ]['default'] = array();
					}

					$this->repeatable_sections[ $key ]['fields'][ $k ]['mode'] = ! empty( $this->repeatable_sections[ $key ]['fields'][ $k ]['mode'] ) ? $this->repeatable_sections->fields[ $key ]['fields'][ $k ]['mode'] : 'url';
				}

				/**
				 * Color picker defaults
				 */
				if ( 'epsilon-color-picker' === $v['type'] ) {
					$this->repeatable_sections[ $key ]['fields'][ $k ]['mode'] = ! empty( $this->repeatable_sections[ $key ]['fields'][ $k ]['mode'] ) ? $this->repeatable_sections[ $key ]['fields'][ $k ]['mode'] : 'hex';
				}

				$this->repeatable_sections[ $key ]['fields'][ $k ]['id'] = $k;
			} // End foreach().
		} // End foreach().

		return $this->repeatable_sections;
	}

	/**
	 * Empty
	 *
	 * @since 1.2.0
	 */
	public function render_content() {

	}

	/**
	 * Control template;
	 */
	public function content_template() {
		?>
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
			</span> </label>
		<ul class="repeater-sections"></ul>
		<div class="epsilon-add-section-buttons">
			<input type="hidden" value="" {{{ data.link }}}/>
			<button type="button" class="button epsilon-add-new-section" aria-expanded="false" aria-controls="available-sections">
				<?php esc_html_e( 'Add a Section', 'epsilon-framework' ); ?>
			</button>
		</div>
		<div id="sections-left-{{ data.id }}">
			<div class="available-sections">
				<div class="available-sections-filter">
					<label class="screen-reader-text" for="sections-search-{{ data.id }}"><?php esc_html_e( 'Search sections', 'epsilon-framework' ); ?></label>
					<input type="text" class="sections-search-input" id="sections-search-{{ data.id }}" placeholder="<?php esc_attr_e( 'Search sections &hellip;', 'epsilon-framework' ) ?>" aria-describedby="sections-search-desc"/>
					<div class="search-icon" aria-hidden="true"></div>
					<button type="button" class="clear-results">
						<span class="screen-reader-text"><?php esc_html_e( 'Clear Results', 'epsilon-framework' ); ?></span>
					</button>
					<p class="screen-reader-text" id="sections-search-desc-{{ data.id }}"><?php esc_html_e( 'The search results will be updated as you type.', 'epsilon-framework' ); ?></p>
				</div>
				<div class="available-sections-list">
					<# for (section in data.sections) { #>
					<# var temp = JSON.stringify(data.sections[section].fields); #>
						<div class="epsilon-section" data-id="{{ data.sections[section].id }}">
							<span class="epsilon-section-title">{{ data.sections[section].title }}</span>
							<span class="epsilon-section-description">{{ data.sections[section].description }}</span>
							<input type="hidden" value="{{ temp }}"/>
						</div>
					<# } #>
				</div>
			</div>
		</div>
		<?php
	}
}