<?php
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Class Epsilon_Control_Page_Changer
 */
class Epsilon_Control_Page_Changer extends WP_Customize_Control {
	/**
	 * Control type
	 *
	 * @var string
	 */
	public $type = 'epsilon-page-changer';

	/**
	 * @var int
	 */
	protected $integration_count = 0;

	/**
	 * @var array
	 */
	public $repeatable_sections = array();

	/**
	 * @var null
	 */
	protected $repeater_helper = null;

	/**
	 * @var null
	 */
	protected $page_builder_id = '';

	/**
	 * Epsilon_Control_Customizer_Navigation constructor.
	 *
	 * @param WP_Customize_Manager $manager
	 * @param string               $id
	 * @param array                $args
	 */
	public function __construct( WP_Customize_Manager $manager, $id, array $args = array() ) {
		$this->repeater_helper = Epsilon_Section_Repeater_Helper::get_instance( array( 'id' => $id ) );
		parent::__construct( $manager, $id, $args );
		$manager->register_control_type( 'Epsilon_Control_Page_Changer' );

		// Dynamically create settings for section repeater
		add_filter( 'customize_dynamic_setting_class', array( $this, 'change_setting_class' ), 10, 3 );

	}

	/**
	 * Enqueues selectize js
	 *
	 * @since  1.0.0
	 * @access public
	 * @return void
	 */
	public function enqueue() {
		wp_enqueue_style( 'selectize', EPSILON_URI . '/assets/vendors/selectize/selectize.css' );
		wp_enqueue_script( 'selectize', EPSILON_URI . '/assets/vendors/selectize/selectize.min.js', array( 'jquery' ), '1.0.0', true );
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
		$json['currentPage'] = $this->get_current_page();
		$json['pages']       = $this->get_pages();

		// Fields special for new pages
		$json['sections']           = $this->set_repeatable_sections();
		$json['integrations']       = $this->check_integrations();
		$json['integrations_count'] = $this->integration_count;
		$json['importable']         = $this->importable();

		// Labels
		$json['add_newpage_label'] = esc_html__( '+ Add New Page', 'epsilon-framework' );
		$json['add_newpage_button_label'] = esc_html__( 'Add', 'epsilon-framework' );
		$json['add_newpage_input_placeholder'] = esc_html__( 'New page title…', 'epsilon-framework' );

		// Fields needed for ajax
		$json['page_builder_id'] = $this->page_builder_id;

		return $json;
	}

	/**
	 * Gets the current page so we can "select" the value
	 */
	public function get_current_page() {
		$url = wp_parse_url( $_SERVER['REQUEST_URI'] );
		$id  = 0;
		if ( count( $url ) > 1 && ! empty( $url['query'] ) ) {
			$url['query'] = rawurldecode( $url['query'] );
			$editing      = str_replace( 'url=', '', $url['query'] );

			if ( strpos( $editing, '&' ) > 0 ) {
				$editing = substr( $editing, 0, strpos( $editing, '&' ) );
			}

			$id = absint( url_to_postid( esc_url_raw( wp_unslash( $editing ) ) ) );
		}

		if ( 0 === $id ) {
			$id = absint( get_option( 'page_on_front', 0 ) );
		}

		return $id;
	}

	/**
	 * Returns an array of pages
	 *
	 * @return array
	 */
	public function get_pages() {
		$arr   = array();
		$pages = get_pages( array( 'exclude' => get_option( 'page_for_posts' ) ) );

		foreach ( $pages as $key => $page ) {
			$arr[ $page->ID ] = array(
				'id'    => $page->ID,
				'title' => $page->post_title,
				'link'  => get_permalink( $page->ID ),
			);
		}

		return $arr;
	}

	/**
	 * @since 1.2.0
	 */
	public function check_integrations() {
		$integration = false;
		foreach ( $this->repeatable_sections as $section ) {
			if ( isset( $section['integration'] ) && $section['integration']['status'] && $section['integration']['check'] ) {
				$integration = true;
				$this->integration_count++;
			}
		}

		return $integration;
	}

	/**
	 * @since 1.2.0
	 */
	public function set_repeatable_sections() {
		if ( empty( $this->repeatable_sections ) || ! is_array( $this->repeatable_sections ) ) {
			$this->repeatable_sections = array();
		}
		$sizes = Epsilon_Helper::get_image_sizes();

		foreach ( $this->repeatable_sections as $key => $value ) {
			/**
			 * Adds the new section class
			 */
			$this->repeatable_sections[ $key ]['fields'][ $key . '_section_class' ] = array(
				'label'   => esc_html__( 'Section Class', 'epsilon-framework' ),
				'type'    => 'epsilon-section-class',
				'default' => 'section-' . $key . '-' . mt_rand( 1, mt_getrandmax() ),
			);

			$this->repeatable_sections[ $key ]['fields'][ $key . '_section_visibility' ] = array(
				'type'    => 'hidden',
				'default' => 'visible',
				'id'      => $key . '_section_visibility',
			);

			foreach ( $value['fields'] as $k => $v ) {
				$this->repeatable_sections[ $key ]['fields'][ $k ]['metaId'] = ! empty( $this->save_as_meta ) ? $this->save_as_meta : '';

				if ( ! isset( $v['default'] ) ) {
					$this->repeatable_sections[ $key ]['fields'][ $k ]['default'] = '';
				}

				if ( ! isset( $v['label'] ) ) {
					$this->repeatable_sections[ $key ]['fields'][ $k ]['label'] = '';
				}

				if ( 'epsilon-customizer-navigation' === $v['type'] ) {
					$this->repeatable_sections[ $key ]['fields'][ $k ]['opensDouble'] = false;
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
				 * Epsilon Button Group defaults
				 */
				if ( 'epsilon-button-group' === $v['type'] ) {
					if ( ! isset( $this->repeatable_sections[ $key ]['fields'][ $k ]['choices'] ) ) {
						$this->repeatable_sections[ $key ]['fields'][ $k ]['choices'] = array();
					}

					$this->repeatable_sections[ $key ]['fields'][ $k ]['groupType'] = $this->repeater_helper->set_group_type( $this->repeatable_sections[ $key ]['fields'][ $k ]['choices'] );
				}

				/**
				 * Epsilon Image
				 */
				if ( 'epsilon-image' === $v['type'] ) {
					if ( ! isset( $this->repeatable_sections[ $key ]['fields'][ $k ]['default'] ) ) {
						$this->repeatable_sections[ $key ]['fields'][ $k ]['default'] = '';
					}

					$this->repeatable_sections[ $key ]['fields'][ $k ]['size']      = ! empty( $this->repeatable_sections[ $key ]['fields'][ $k ]['size'] ) ? $this->repeatable_sections[ $key ]['fields'][ $k ]['size'] : 'full';
					$this->repeatable_sections[ $key ]['fields'][ $k ]['sizeArray'] = $sizes;

					$this->repeatable_sections[ $key ]['fields'][ $k ]['mode'] = ! empty( $this->repeatable_sections[ $key ]['fields'][ $k ]['mode'] ) ? $this->repeatable_sections[ $key ]['fields'][ $k ]['mode'] : 'url';
				}

				/**
				 * Color picker defaults
				 */
				if ( 'epsilon-color-picker' === $v['type'] ) {
					$this->repeatable_sections[ $key ]['fields'][ $k ]['mode']       = ! empty( $this->repeatable_sections[ $key ]['fields'][ $k ]['mode'] ) ? $this->repeatable_sections[ $key ]['fields'][ $k ]['mode'] : 'hex';
					$this->repeatable_sections[ $key ]['fields'][ $k ]['defaultVal'] = ! empty( $this->repeatable_sections[ $key ]['fields'][ $k ]['defaultVal'] ) ? $this->repeatable_sections[ $key ]['fields'][ $k ]['defaultVal'] : '';
				}

				/**
				 * Epsilon Upsell
				 */
				if ( 'epsilon-upsell' === $v['type'] ) {
					$this->repeatable_sections[ $key ]['fields'][ $k ]['label']              = ! empty( $this->repeatable_sections[ $key ]['fields'][ $k ]['label'] ) ? $this->repeatable_sections[ $key ]['fields'][ $k ]['label'] : __( 'See what\'s in the PRO version', 'epsilon-framework' );
					$this->repeatable_sections[ $key ]['fields'][ $k ]['separator']          = ! empty( $this->repeatable_sections[ $key ]['fields'][ $k ]['separator'] ) ? $this->repeatable_sections[ $key ]['fields'][ $k ]['separator'] : '';
					$this->repeatable_sections[ $key ]['fields'][ $k ]['button_text']        = ! empty( $this->repeatable_sections[ $key ]['fields'][ $k ]['button_text'] ) ? $this->repeatable_sections[ $key ]['fields'][ $k ]['button_text'] : '';
					$this->repeatable_sections[ $key ]['fields'][ $k ]['button_url']         = ! empty( $this->repeatable_sections[ $key ]['fields'][ $k ]['button_url'] ) ? $this->repeatable_sections[ $key ]['fields'][ $k ]['button_url'] : '';
					$this->repeatable_sections[ $key ]['fields'][ $k ]['second_button_text'] = ! empty( $this->repeatable_sections[ $key ]['fields'][ $k ]['second_button_text'] ) ? $this->repeatable_sections[ $key ]['fields'][ $k ]['second_button_text'] : '';
					$this->repeatable_sections[ $key ]['fields'][ $k ]['second_button_url']  = ! empty( $this->repeatable_sections[ $key ]['fields'][ $k ]['second_button_url'] ) ? $this->repeatable_sections[ $key ]['fields'][ $k ]['second_button_url'] : '';
					$this->repeatable_sections[ $key ]['fields'][ $k ]['options']            = ! empty( $this->repeatable_sections[ $key ]['fields'][ $k ]['options'] ) ? $this->repeatable_sections[ $key ]['fields'][ $k ]['options'] : array();
				}

				$this->repeatable_sections[ $key ]['fields'][ $k ]['id'] = $k;
			} // End foreach().

			if ( ! isset( $this->repeatable_sections[ $key ]['image'] ) ) {
				$this->repeatable_sections[ $key ]['image'] = EPSILON_URI . '/assets/img/ewf-icon-section-default.png';
			}
		} // End foreach().

		return $this->repeatable_sections;
	}

	/**
	 * Returns sections available for import
	 *
	 * @return array
	 */
	public function importable() {
		return apply_filters( 'epsilon_section_repeater_importable_sections', array() );
	}

	public function change_setting_class( $class, $id, $args ){

		if ( isset( $args['setting_type'] ) && 'epsilon-setting-repeater' == $args['setting_type'] ) {
			return 'Epsilon_Setting_Repeater';
		}

		return $class;
	}

	/**
	 * Empty as it should be
	 *
	 * @since 1.0.0
	 */
	public function render_content() {

	}

	/**
	 * Render the content template
	 *
	 * @since 1.0.0
	 */
	public function content_template() {
		//@formatter:off ?>
		<label>
			<span class="customize-control-title">
				<# if( data.label ){ #>
					<span>{{{ data.label }}}</span>
					<a href="#" class="page-title-action add-new-toggle">{{{ data.add_newpage_label }}}</a>
				<# } #>

				<# if( data.description ){ #>
					<span class="description customize-control-description">{{{ data.description }}}</span>
				<# } #>
			</span>
			<select id="{{{ data.id }}}-page-changer">
				<# _.each(data.pages, function(k, v){ #>
					<option <# if( k['id'] == data.currentPage ) { #> selected <# } #> value="{{{ k['link'] }}}">{{{ k['title'] }}}</option>
				<# }) #>
			</select>
		</label>

		<div class="new-content-item" style="display: none;">
			<input type="text" class="create-item-input" placeholder="{{{ data.add_newpage_input_placeholder }}}">
			<button type="button" class="button add-content">{{{ data.add_newpage_button_label }}}</button>
		</div>
		<?php //@formatter:on
	}
}
