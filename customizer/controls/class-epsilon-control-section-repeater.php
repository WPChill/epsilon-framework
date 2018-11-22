<?php
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Class Epsilon_Control_Section_Repeater
 *
 * @since 1.0.0
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
	 * @since 1.0.0
	 * @var array
	 */
	public $repeatable_sections = array();

	/**
	 * @since 1.0.0
	 * @var array
	 */
	public $choices = array();
	/**
	 * Field groups
	 *
	 * @var array
	 */
	public $groups = array();
	/**
	 * @since 1.0.0
	 * @var bool
	 */
	public $sortable = true;

	/**
	 * @since 1.2.0
	 * @var int
	 */
	protected $integration_count = 0;
	/**
	 * Icons array
	 *
	 * @since 1.0.0
	 * @var array
	 */
	protected $icons = array();

	/**
	 * @var null
	 */
	protected $save_as_meta = null;

	/**
	 * Page builder
	 *
	 * @var
	 */
	protected $page_builder = false;

	/**
	 * Selective refresh
	 *
	 * @var bool
	 */
	protected $selective_refresh = false;

	/**
	 * @var null
	 */
	protected $repeater_helper = null;

	/**
	 * Epsilon_Control_Section_Repeater constructor.
	 *
	 * @since 1.0.0
	 *
	 * @param WP_Customize_Manager $manager
	 * @param string               $id
	 * @param array                $args
	 */
	public function __construct( WP_Customize_Manager $manager, $id, array $args = array() ) {
		$this->repeater_helper = Epsilon_Section_Repeater_Helper::get_instance( array( 'id' => $id ) );
		parent::__construct( $manager, $id, $args );
		$manager->register_control_type( 'Epsilon_Control_Section_Repeater' );
	}

	/**
	 * @since 1.0.0
	 *
	 * @return array
	 */
	public function json() {
		$json = parent::json();

		$json['id']                 = $this->id;
		$json['link']               = $this->get_link();
		$json['choices']            = $this->choices;
		$json['value']              = $this->value();
		$json['sections']           = $this->set_repeatable_sections();
		$json['integrations']       = $this->check_integrations();
		$json['groups']             = $this->groups;
		$json['integrations_count'] = $this->integration_count;
		$json['default']            = ( isset( $this->default ) ) ? $this->default : $this->setting->default;
		$json['sortable']           = $this->sortable;
		$json['save_as_meta']       = $this->save_as_meta;
		$json['selective_refresh']  = $this->selective_refresh;
		$json['importable']         = $this->importable();

		return $json;
	}

	/**
	 * Returns sections available for import
	 *
	 * @return array
	 */
	public function importable() {
		return apply_filters( 'epsilon_section_repeater_importable_sections', array() );
	}

	/**
	 * Enqueues selectize js
	 *
	 * @since  1.3.4
	 * @access public
	 * @return void
	 */
	public function enqueue() {
		wp_enqueue_script( 'iconpicker', EPSILON_URI . '/assets/vendors/jquery-fonticonpicker/jquery.fonticonpicker.min.js', array( 'jquery' ), '1.2.0', true );
		wp_enqueue_style( 'iconpicker', EPSILON_URI . '/assets/vendors/jquery-fonticonpicker/jquery.fonticonpicker.min.css' );
		wp_enqueue_style( 'iconpicker-grey', EPSILON_URI . '/assets/vendors/jquery-fonticonpicker/jquery.fonticonpicker.grey.min.css', array( 'iconpicker' ) );
		wp_localize_script( 'iconpicker', 'EpsilonIconPack', $this->get_icons() );
		wp_enqueue_style( 'minicolors', EPSILON_URI . '/assets/vendors/minicolors/jquery.minicolors.css' );
		wp_enqueue_script( 'minicolors', EPSILON_URI . '/assets/vendors/minicolors/jquery.minicolors.min.js', array( 'jquery' ), '1.2.0', true );
		wp_enqueue_style( 'selectize', EPSILON_URI . '/assets/vendors/selectize/selectize.css' );
		wp_enqueue_script( 'selectize', EPSILON_URI . '/assets/vendors/selectize/selectize.min.js', array( 'jquery' ), '1.0.0', true );
	}

	/**
	 * @since 1.2.0
	 */
	public function check_integrations() {
		$integration = false;
		foreach ( $this->repeatable_sections as $section ) {
			if ( isset( $section['integration'] ) && $section['integration']['status'] && $section['integration']['check'] ) {
				$integration = true;
				$this->integration_count ++;
			}
		}

		return $integration;
	}

	/**
	 * @since 1.0.0
	 */
	public function get_icons() {
		$icons = Epsilon_Icons::new_icons();

		return $icons;
	}

	/**
	 * @since 1.0.0
	 */
	public function set_repeatable_sections() {
		if ( empty( $this->repeatable_sections ) || ! is_array( $this->repeatable_sections ) ) {
			$this->repeatable_sections = array();
		}
		$sizes = Epsilon_Helper::get_image_sizes();

		foreach ( $this->repeatable_sections as $key => $value ) {
			/**
			 * Create a shortcut cuz was going hectic
			 */
			$shortcut = &$this->repeatable_sections[ $key ]['fields'];
			/**
			 * Adds the new section class
			 */
			$shortcut[ $key . '_section_class' ] = array(
				'label'   => esc_html__( 'Section Class', 'epsilon-framework' ),
				'type'    => 'epsilon-section-class',
				'default' => 'section-' . $key . '-' . mt_rand( 1, mt_getrandmax() ),
			);

			$shortcut[ $key . '_section_visibility' ] = array(
				'type'    => 'hidden',
				'default' => 'visible',
				'id'      => $key . '_section_visibility',
			);


			foreach ( $value['fields'] as $k => $v ) {
				$currentField = &$shortcut[ $k ];

				$currentField['metaId'] = ! empty( $this->save_as_meta ) ? $this->save_as_meta : '';

				if ( ! isset( $v['default'] ) ) {
					$currentField['default'] = '';
				}

				if ( ! isset( $v['label'] ) ) {
					$currentField['label'] = '';
				}

				if ( 'epsilon-customizer-navigation' === $v['type'] ) {
					$currentField['opensDouble'] = false;
				}
				/**
				 * Range Slider defaults
				 */
				if ( 'epsilon-slider' === $v['type'] ) {
					if ( ! isset( $currentField['choices'] ) ) {
						$currentField['choices'] = array();
					}

					$default = array(
						'min'  => 0,
						'max'  => 10,
						'step' => 1,
					);

					$currentField['choices'] = wp_parse_args( $currentField['choices'], $default );
				}
				/**
				 * Epsilon Button Group defaults
				 */
				if ( 'epsilon-button-group' === $v['type'] ) {
					if ( ! isset( $currentField['choices'] ) ) {
						$currentField['choices'] = array();
					}

					$currentField['groupType'] = $this->repeater_helper->set_group_type( $currentField['choices'] );
				}

				/**
				 * Epsilon video
				 */
				if ( 'epsilon-video' === $v['type'] ) {
					if ( ! isset( $currentField['default'] ) ) {
						$currentField['default'] = '';
					}
				}

				/**
				 * Epsilon Image
				 */
				if ( 'epsilon-image' === $v['type'] ) {
					if ( ! isset( $currentField['default'] ) ) {
						$currentField['default'] = '';
					}

					$currentField['size']      = ! empty( $currentField['size'] ) ? $currentField['size'] : 'full';
					$currentField['sizeArray'] = $sizes;
					$currentField['mode']      = ! empty( $currentField['mode'] ) ? $currentField['mode'] : 'url';
				}

				/**
				 * Color picker defaults
				 */
				if ( 'epsilon-color-picker' === $v['type'] ) {
					$currentField['mode']       = ! empty( $currentField['mode'] ) ? $currentField['mode'] : 'hex';
					$currentField['defaultVal'] = ! empty( $currentField['defaultVal'] ) ? $currentField['defaultVal'] : '';
				}

				/**
				 * Epsilon Upsell
				 */
				if ( 'epsilon-upsell' === $v['type'] ) {
					$currentField['label']              = ! empty( $currentField['label'] ) ? $currentField['label'] : __( 'See what\'s in the PRO version', 'epsilon-framework' );
					$currentField['separator']          = ! empty( $currentField['separator'] ) ? $currentField['separator'] : '';
					$currentField['button_text']        = ! empty( $currentField['button_text'] ) ? $currentField['button_text'] : '';
					$currentField['button_url']         = ! empty( $currentField['button_url'] ) ? $currentField['button_url'] : '';
					$currentField['second_button_text'] = ! empty( $currentField['second_button_text'] ) ? $currentField['second_button_text'] : '';
					$currentField['second_button_url']  = ! empty( $currentField['second_button_url'] ) ? $currentField['second_button_url'] : '';
					$currentField['options']            = ! empty( $currentField['options'] ) ? $currentField['options'] : array();
				}

				$currentField['id'] = $k;
			} // End foreach().

			if ( ! isset( $this->repeatable_sections[ $key ]['image'] ) ) {
				$this->repeatable_sections[ $key ]['image'] = EPSILON_URI . '/assets/img/ewf-icon-section-default.png';
			}

		} // End foreach().


		return $this->repeatable_sections;
	}

	/**
	 * Empty
	 *
	 * @since 1.0.0
	 */
	public function render_content() {

	}

	/**
	 * Active callback override
	 */
	public function active_callback() {
		if ( ! $this->page_builder ) {
			return true;
		}

		$id = absint( url_to_postid( esc_url_raw( wp_unslash( $_SERVER['REQUEST_URI'] ) ) ) );
		if ( 0 === $id ) {
			$id = absint( get_option( 'page_on_front', 0 ) );
		}

		if ( absint( $this->save_as_meta ) === $id ) {
			return true;
		}

		return false;
	}

	/**
	 * Control template;
	 */
	public function content_template() {
		//@formatter:off ?>
		<label>
			<span class="customize-control-title epsilon-page-title">
				{{{ data.label }}}
				<# if( data.description ){ #>
					<i class="dashicons dashicons-editor-help" style="vertical-align: text-bottom; position: relative;">
						<span class="mte-tooltip">
							{{{ data.description }}}
						</span>
					</i>
				<# } #>

			<a href="#" class="button-link epsilon-sort-sections" aria-expanded="false" aria-controls="available-sections">
				<?php esc_html_e( 'Reorder', 'epsilon-framework' ); ?>
			</a>

			</span>

		</label>
		<ul class="repeater-sections"></ul>
		<div class="epsilon-add-section-buttons">
			<input type="hidden" {{{ data.link }}} />

			<!--
			<button type="button" class="button button-secondary epsilon-import-sections">
				<?php //esc_html_e( 'Import', 'epsilon-framework' ); ?>
			</button>
			-->

			<button type="button" class="button button-primary epsilon-add-new-section" aria-expanded="false" aria-controls="available-sections">
				<?php esc_html_e( 'Add More Sections', 'epsilon-framework' ); ?>
			</button>

		</div>
		<div id="importable-sections-{{ data.id }}">
			<div class="available-sections importable">
				<ul>
					<# for (importSection in data.importable) { #>
					<li>
						{{ data.importable[importSection].thumb }}
						<a href="#" class="epsilon-sections-import" data-import="{{ data.importable[importSection].id }}">
							{{ data.importable[importSection].id }}
						</a>
					</li>
					<# } #>
				</ul>
			</div>
		</div>
		<div id="sections-left-{{ data.id }}">
			<div class="available-sections">
				<div class="available-sections-filter">
					<label class="screen-reader-text" for="sections-search-{{ data.id }}"><?php esc_html_e( 'Search sections', 'epsilon-framework' ); ?></label>
					<input type="text" class="sections-search-input" id="sections-search-{{ data.id }}" placeholder="<?php esc_attr_e( 'Search sections &hellip;', 'epsilon-framework' ); ?>" aria-describedby="sections-search-desc" />
					<div class="search-icon" aria-hidden="true"></div>
					<button type="button" class="clear-results">
						<span class="screen-reader-text"><?php esc_html_e( 'Clear Results', 'epsilon-framework' ); ?></span>
					</button>
					<p class="screen-reader-text" id="sections-search-desc-{{ data.id }}"><?php esc_html_e( 'The search results will be updated as you type.', 'epsilon-framework' ); ?></p>
				</div>
				<div class="available-sections-list">
					<# if ( data.integrations ) { #>
					<nav class="available-sections-tab-nav">
						<a href="#" data-tab="normal" class="available-sections-tab-toggler active"><span class="dashicons dashicons-editor-table"></span> <?php esc_html_e( 'Sections', 'epsilon-framework' ); ?>
						</a>
						<a href="#" data-tab="integrations" class="available-sections-tab-toggler"><span class="dashicons dashicons-admin-plugins"></span> <?php esc_html_e( 'Integrations', 'epsilon-framework' ); ?>
							<span class="badge">{{ data.integrations_count }}</span></a>
					</nav>
					<# } #>

					<# if ( data.integrations ) { #>
					<div data-tab-id="normal" class="normal-sections available-sections-tab-content active"> <# } #>
						<# for (section in data.sections) { #>
						<# var temp = JSON.stringify(data.sections[section].fields); #>
						<# if ( _.isUndefined(data.sections[section].integration) ) { #>
						<div class="epsilon-section" data-id="{{ data.sections[section].id }}" data-upsell="{{ data.sections[section].upsell }}">
							<div class="epsilon-section-image-description">
								<img src="{{ data.sections[section].image }}" />
								<span class="epsilon-section-description">{{ data.sections[section].description }}</span>
							</div>
							<span class="epsilon-section-title">{{ data.sections[section].title }}</span>
							<button class="button button-primary" data-action="add">
								<i class="fa fa-plus" aria-hidden="true"></i>
							</button>
							<button class="button button-info" data-action="info">
								<i class="fa fa-question" aria-hidden="true"></i>
							</button>
							<# if ( data.sections[section].upsell ) { #>
								<# if ( data.sections[section].upsell_text && data.sections[section].upsell_url ) { #>
								<a href="{{ data.sections[section].upsell_url }}">{{ data.sections[section].upsell_text }}</a>
								<# } #>
								<span class="epsilon-section-ribbon">PRO only</span>
							<# } #>
						</div>
						<# } #>
						<# } #>

						<# if ( data.integrations ) { #>
					</div>
					<# } #>

					<# if ( data.integrations ) { #>
					<div data-tab-id="integrations" class="integrations-sections available-sections-tab-content">
						<# for (section in data.sections) { #>
						<# if ( ! _.isUndefined(data.sections[section].integration) ) { #>
						<div class="epsilon-section" data-id="{{ data.sections[section].id }}" data-upsell="{{ data.sections[section].upsell }}">
							<div class="epsilon-section-image-description">
								<img src="{{ data.sections[section].image }}" />
								<span class="epsilon-section-description">{{ data.sections[section].description }}</span>
							</div>
							<span class="epsilon-section-title">{{ data.sections[section].title }}</span>
							<button class="button button-primary" data-action="add">
								<i class="fa fa-plus" aria-hidden="true"></i>
							</button>
							<button class="button button-info" data-action="info">
								<i class="fa fa-question" aria-hidden="true"></i>
							</button>
							<# if ( data.sections[section].upsell ) { #>
								<# if ( data.sections[section].upsell_text && data.sections[section].upsell_url ) { #>
								<a href="{{ data.sections[section].upsell_url }}">{{ data.sections[section].upsell_text }}</a>
								<# } #>
								<span class="epsilon-section-ribbon">PRO only</span>
							<# } #>
						</div>
						<# } #>
						<# } #>
					</div>
					<# } #>
				</div>
			</div>
		</div>
		<?php
		//@formatter:on
	}
}
