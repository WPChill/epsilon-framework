<?php
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Easier way to add panels,sections,controls
 *
 * @since 1.0.0
 *
 * Class Epsilon_Customizer
 */
class Epsilon_Customizer {

	/**
	 * Holds the WP Customizer Object
	 *
	 * @since 1.0.0
	 * @var WP Customize Object
	 */
	public static $manager;
	/**
	 * URL Being edited
	 *
	 * @since 1.2.0
	 * @var
	 */
	public static $url = null;
	/**
	 * The single instance of the backup class
	 *
	 * @var     object
	 * @access   private
	 * @since    1.0.0
	 */
	private static $_instance = null;

	/**
	 * Epsilon_Customizer constructor.
	 *
	 * @param $manager WP_Customize_Manager.
	 */
	public function __construct( $manager ) {
		self::$manager = $manager;

		/**
		 * Fallback, if somehow the argument is not the manager we use the global
		 */
		if ( ! is_a( $manager, 'WP_Customize_Manager' ) ) {
			global $wp_customize;
			self::$manager = $wp_customize;
		}
	}

	/**
	 * @param array|object $manager WP Customizer object.
	 *
	 * @return Epsilon_Customizer|object
	 */
	public static function get_instance( $manager = array() ) {
		if ( is_null( self::$_instance ) ) {
			self::$_instance = new self( $manager );
		}

		return self::$_instance;
	}

	/**
	 * This function is called by self::add_field()
	 *
	 * @since 1.0.0
	 *
	 * @param $id
	 * @param $args
	 */
	private static function add_setting( $id, array $args = array() ) {
		/**
		 * We need to use setting_type to determine the sanitizer
		 */
		if ( empty( $args['setting_type'] ) ) {
			$args['setting_type'] = $args['type'];
		}

		/**
		 * Setting types can be theme_mod or options, control's type is not needed here
		 */
		unset( $args['type'] );

		/**
		 * Determine sanitizer
		 */
		if ( empty( $args['sanitize_callback'] ) ) {
			$args['sanitize_callback'] = self::_get_sanitizer( $args['setting_type'] );
			if ( 'epsilon-section-repeater' === $args['setting_type'] ) {
				unset( $args['sanitize_callback'] );
			}
		}

		/**
		 * Create the class name for the setting, repeater field has a different setting class
		 */
		$class = self::_get_type( $args['setting_type'], 'setting' );

		/**
		 * Register it
		 */
		self::$manager->add_setting( new $class['class']( self::$manager, $id, $args ) );
	}

	/**
	 * Add control function ( this will automatically add the setting, based on the field type )
	 *
	 * @since 1.0.0
	 *
	 * @param       $id
	 * @param array $args
	 */
	public static function add_field( $id, array $args = array() ) {
		$args['type'] = isset( $args['type'] ) ? $args['type'] : 'control';
		if ( 'epsilon-section-repeater' === $args['type'] && ( isset( $args['page_builder'] ) && true === $args['page_builder'] ) ) {
			self::add_page_builder( $id, $args );

			return;
		}
		/**
		 * Add setting
		 */
		self::add_setting( $id, $args );
		$args['backup'] = isset( $args['backup'] ) ? $args['backup'] : false;
		/**
		 * Get class name, if it's an epsilon control, we need to build the class name accordingly
		 */
		$field_type = self::_get_type( $args['type'], 'control' );

		/**
		 * This array SHOULD always be backed up
		 */
		$must_backup = array(
			'epsilon-section-repeater',
			'epsilon-repeater',
		);

		if ( in_array( $args['type'], $must_backup ) || true === $args['backup'] ) {
			$instance = Epsilon_Content_Backup::get_instance();
			$instance->add_field( $id, $args );
		}

		/**
		 * Register the control
		 */
		self::$manager->add_control( new $field_type['class']( self::$manager, $id, $args ) );
	}

	/**
	 * Add section
	 *
	 * @since 1.0.0
	 *
	 * @param       $id
	 * @param array $args
	 */
	public static function add_section( $id, array $args = array() ) {
		$args['type'] = isset( $args['type'] ) ? $args['type'] : 'section';

		$class = self::_get_section_type( $args['type'] );
		self::$manager->add_section( new $class['class']( self::$manager, $id, $args ) );
	}

	/**
	 * Add panel
	 *
	 * @since 1.0.0
	 *
	 * @param array $args
	 */
	public static function add_panel( $id, array $args = array() ) {
		$args['type'] = isset( $args['type'] ) ? $args['type'] : 'panel';

		$class = self::_get_panel_type( $args['type'] );
		self::$manager->add_panel( new $class['class']( self::$manager, $id, $args ) );
	}

	/**
	 * Add multiple customizer elements at once
	 *
	 * @since 1.0.0
	 *
	 * @param array $collection
	 */
	public static function add_multiple( array $collection = array() ) {
		foreach ( $collection as $type => $items ) {
			foreach ( $items as $item ) {
				$func = 'self::add_' . $type;
				call_user_func( $func, $item['id'], $item['args'] );
			}
		}
	}

	/**
	 * Get the class name of the section type
	 *
	 * @since 1.2.6
	 *
	 * @param string $type
	 */
	public static function _get_section_type( $type = '' ) {
		$class = '';
		$type  = explode( '-', $type );
		/**
		 * Let's make sure it's an Epsilon Class
		 */
		if ( 1 < count( $type ) && 'epsilon' === $type[0] ) {
			$class = implode( '_', $type );
		}

		/**
		 * Provide a default
		 */
		if ( ! class_exists( $class ) ) {
			$class = 'WP_Customize_Section';
		}

		return array(
			'class' => $class,
		);
	}

	/**
	 * Get the class name of the panel type
	 *
	 * @since 1.3.4
	 *
	 * @param string $type
	 */
	public static function _get_panel_type( $type = '' ) {
		$class = '';
		$type  = explode( '-', $type );
		/**
		 * Let's make sure it's an Epsilon Class
		 */
		if ( 1 < count( $type ) && 'epsilon' === $type[0] ) {
			$class = implode( '_', $type );
		}

		/**
		 * Provide a default
		 */
		if ( ! class_exists( $class ) ) {
			$class = 'WP_Customize_Panel';
		}

		return array(
			'class' => $class,
		);
	}

	/**
	 * Get the class name and field type
	 *
	 * @since 1.0.0
	 *
	 * @param $type
	 */
	public static function _get_type( $type = '', $prefix = '' ) {
		$class = '';
		if ( 'setting' === $prefix && ( 'epsilon-section-repeater' === $type || 'epsilon-repeater' === $type ) ) {
			$type = 'epsilon-repeater';
		}

		$type = explode( '-', $type );

		if ( 1 < count( $type ) && 'epsilon' === $type[0] ) {
			$class = implode( '_', $type );
			$class = str_replace( 'epsilon_', 'epsilon_' . $prefix . '_', $class );
		}

		/**
		 * Provide a default
		 */
		if ( ! class_exists( $class ) ) {
			$class = 'WP_Customize_' . $prefix;
		}

		return array(
			'class' => $class,
		);
	}

	/**
	 * Dynamic sanitization
	 *
	 * @param $type
	 *
	 * @return array|string
	 */
	public static function _get_sanitizer( $type = '' ) {
		/**
		 * Dynamic sanitizer, based on field type
		 */
		switch ( $type ) {
			case 'text':
				$sanitizer = 'sanitize_text_field';
				break;
			case 'url':
				$sanitizer = 'esc_url_raw';
				break;
			case 'email':
				$sanitizer = 'sanitize_email';
				break;
			case 'textarea':
				$sanitizer = 'sanitize_textarea_field';
				break;
			case 'epsilon-toggle':
			case 'checkbox':
				$sanitizer = array( 'Epsilon_Sanitizers', 'checkbox' );
				break;
			case 'radio':
				$sanitizer = array( 'Epsilon_Sanitizers', 'radio_buttons' );
				break;
			case 'epsilon-image':
				$sanitizer = 'esc_url_raw';
				break;
			case 'epsilon-text-editor':
				$sanitizer = array( 'Epsilon_Sanitizers', 'textarea_nl2br' );
				break;
			case 'epsilon-repeater':
			case 'epsilon-section-repeater':
				/**
				 * Already sanitized by the setting
				 */
				$sanitizer = '';
				break;
			case 'epsilon-slider':
				$sanitizer = 'absint';
				break;
			case 'epsilon-typography':
				$sanitizer = 'sanitize_text_field';
				break;
			case 'epsilon-layouts':
				$sanitizer = 'sanitize_text_field';
				break;
			case 'epsilon-color-scheme':
				$sanitizer = 'sanitize_text_field';
				break;
			case 'epsilon-color-picker':
				$sanitizer = 'sanitize_hex_color';
//				$args['mode'] = isset( $args['mode'] ) ? $args['mode'] : 'hex';
//				if ( 'rgba' === $args['mode'] ) {
//					$sanitizer = array( 'Epsilon_Sanitizers', 'rgba' );
//				}
				break;
			case 'epsilon-button-group':
				$sanitizer = array( 'Epsilon_Sanitizers', 'radio_buttons' );
				break;
			case 'epsilon-selectize':
				$sanitizer = array( 'Epsilon_Sanitizers', 'selectize' );
				break;
			default:
				$sanitizer = 'sanitize_text_field';
				break;
		}// End switch().

		return $sanitizer;
	}

	/**
	 * Page builder functionality
	 *
	 * @param $id
	 * @param $args
	 *
	 * @since 1.2.0
	 */
	public static function add_page_builder( $id, $args ) {
		$pages = new WP_Query( array(
			                       'post_type'        => 'page',
			                       'nopaging'         => true,
			                       'suppress_filters' => true,
			                       'post__not_in'     => array(
				                       Epsilon_Content_Backup::get_instance()->setting_page,
			                       ),
		                       ) );

		$ids = array();

		if ( $pages->have_posts() ) {
			foreach ( $pages->posts as $page ) {
				$ids[] = $page->ID;
			}
		}

		if ( $pages->have_posts() ) {
			while ( $pages->have_posts() ) {
				$pages->the_post();

				$args['backup']       = isset( $args['backup'] ) ? $args['backup'] : false;
				$args['save_as_meta'] = get_the_ID();
				$args['label']        = esc_html( get_the_title() );

				/**
				 * Add setting
				 */
				self::add_setting( $id . '_' . get_the_ID(), $args );

				/**
				 * Get class name, if it's an epsilon control, we need to build the class name accordingly
				 */
				$field_type = self::_get_type( $args['type'], 'control' );

				/**
				 * This array SHOULD always be backed up
				 */
				$must_backup = array(
					'epsilon-section-repeater',
				);

				if ( in_array( $args['type'], $must_backup ) || true === $args['backup'] ) {
					$instance = Epsilon_Content_Backup::get_instance();
					$instance->add_pages( get_the_ID(), $id . '_' . get_the_ID(), $args );
				}

				/**
				 * Register the control
				 */
				self::$manager->add_control( new Epsilon_Control_Section_Repeater( self::$manager, $id . '_' . get_the_ID(), $args ) );
			}// End while().
		}// End if().

		wp_reset_postdata();
	}

	/**
	 * @param $post_type
	 * @param $post
	 *
	 * @return bool|void
	 */
	public static function add_action_link_to_page( $post ) {

		if ( self::page_is_epsilon_main_backup( $post ) ) {
			return;
		}

		if ( ! self::is_page_or_frontpage( $post ) ) {
			return;
		}

		if ( self::page_is_set_for_woo( $post ) ) {
			return;
		}

		if ( ! self::page_is_built_with_epsilon( $post ) ) {

			$query['autofocus[section]'] = self::_get_theme_name() . '_repeatable_section';
			$section_link                = add_query_arg( $query, admin_url( 'customize.php?url=' . get_permalink( $post->ID ) ) );

			echo '<a class="button button-primary button-hero" style="margin-top: 15px;" href="' . esc_url( $section_link ) . '" />' . esc_html__( 'Live edit with Epsilon', 'epsilon-framework' ) . '</a>';
		}
	}

	/**
	 * Add quick action links to posts
	 */
	public static function add_action_links( $actions, $post ) {

		if ( self::page_is_epsilon_main_backup( $post ) ) {
			return $actions;
		}

		if ( ! self::is_page_or_frontpage( $post ) ) {
			return $actions;
		}

		// check if it's posts page
		if ( get_option( 'page_for_posts' ) == $post->ID ) {
			return $actions;
		}

		if ( self::page_is_set_for_woo( $post ) ) {
			return $actions;
		}

		if ( defined( 'POLYLANG_VERSION' ) ) {
			$language = pll_get_post_language( $post->ID, 'slug' );
			$default  = pll_default_language( 'slug' );
			if ( $language !== $default ) {
				return $actions;
			}
		}

		$actions['epsilon_builder_link'] = '<a href="' . esc_url( self::_get_focus_panel( $post ) ) . '" />' . esc_html__( 'Edit with Alpha Page Builder', 'epsilon-framework' ) . '</a>';

		return $actions;
	}

	/**
	 * Add Alpha Page Builder post state.
	 *
	 * Adds a new "Epsilon" post state to the post table.
	 *
	 * Fired by `display_post_states` filter.
	 *
	 * @since  1.8.0
	 * @access public
	 *
	 * @param array    $post_states An array of post display states.
	 * @param \WP_Post $post        The current post object.
	 *
	 * @return array A filtered array of post display states.
	 */
	public static function add_display_post_states( $post_states, $post ) {


		// check if it's a page type or if it's the front-page
		if ( ! self::is_page_or_frontpage( $post ) ) {
			return $post_states;
		}

		// append our new post state
		if ( self::page_is_built_with_epsilon( $post ) ) {
			$post_states['epsilon_builder_link'] = __( 'Epsilon', 'epsilon-framework' );
		}

		return $post_states;
	}

	public static function replace_rich_editor( $post ) {

		if ( self::page_is_built_with_epsilon( $post ) ) {

			// remove TinyMCE / Rich Text Editor
			remove_post_type_support( $post->post_type, 'editor' );

			// output our placeholder
			echo '<div class="epsilon-builder">';
			echo '<a href="' . esc_url( self::_get_focus_panel( $post ) ) . '" target="_blank" class="button button-primary button-hero epsilon-go-to-link">' . __( 'Edit with Alpha Page Builder', 'epsilon-framework' ) . '</a>';
			echo '</div>';
		}
	}

	/**
	 * Function used to check that the currently viewed $post is actually a page, is not a draft and is not the static
	 * frontpage set under Reading options
	 *
	 * @param $post
	 *
	 * @return bool
	 */
	public static function is_page_or_frontpage( $post ) {

		if ( ( 'page' === $post->post_type && $post->post_status === 'publish' ) || get_option( 'page_for_posts' ) === $post->ID ) {
			return true;
		}

		return false;

	}

	/**
	 * Under Reading -> Your homepage displays -> A static page
	 *
	 * This function checks that the current post ID isn't the actual front - page *
	 * We disable Edit with Epsilon button / link on these pages *
	 *
	 * @param $post *
	 *
	 * @return bool
	 */
	public static function page_is_epsilon_main_backup( $post ) {

		// check if this is content backup page for Epsilon Builder
		if ( absint( Epsilon_Content_Backup::get_instance()->setting_page ) === $post->ID ) {
			return true;
		}

		return false;
	}

	/**
	 * Function that checks if WooCommerce exists and if it does,
	 * it compares the current page ID with what users set in the back-end.
	 *
	 * This basically disables Alpha Page Builder on the following Woo (user set) pages:
	 *
	 * shop, cart, checkout, my account, terms
	 *
	 * @param $post
	 *
	 * @return bool
	 *
	 * @todo: find a way to allow Epsilon PB on Woo pages
	 */
	public static function page_is_set_for_woo( $post ) {

		// check if it's WooCommerce
		if ( class_exists( 'WooCommerce' ) ) {
			if ( function_exists( 'wc_get_page_id' ) && wc_get_page_id( 'shop' ) === $post->ID ) {
				return true;
			}

			if ( function_exists( 'wc_get_page_id' ) && wc_get_page_id( 'cart' ) === $post->ID ) {
				return true;
			}

			if ( function_exists( 'wc_get_page_id' ) && wc_get_page_id( 'checkout' ) === $post->ID ) {
				return true;
			}

			if ( function_exists( 'wc_get_page_id' ) && wc_get_page_id( 'myaccount' ) === $post->ID ) {
				return true;
			}

			if ( function_exists( 'wc_get_page_id' ) && wc_get_page_id( 'terms' ) === $post->ID ) {
				return true;
			}
		}

		return false;

	}

	/**
	 *
	 * Function that checks if any post_meta entries exist with the key of {$theme_name}_frontpage_sections_{$post->ID}
	 *
	 * @param $post
	 *
	 * @return bool
	 */
	public static function page_is_built_with_epsilon( $post ) {

		/**
		 *
		 * Return values when no meta field is found
		 * If a meta field with the given $key isn’t found for the given $post_id, the return value varies:
		 *
		 * If $single is true, an empty string is returned.
		 * If $single is false, an empty array is returned.
		 *
		 * get_post_meta( int $post_id, string $key = '', bool $single = false )
		 *
		 * In the case '{$theme_name}_frontpage_sections_{$post->ID} isn't found, it returns an empty string
		 *
		 */
		$was_built_with_epsilon = get_post_meta( $post->ID, self::_get_theme_name() . '_frontpage_sections_' . $post->ID, true );

		if ( is_array( $was_built_with_epsilon ) && array_key_exists( self::_get_theme_name() . '_frontpage_sections_' . $post->ID, $was_built_with_epsilon ) ) {
			return true;
		}

		return false;
	}

	/**
	 * Gets, beautifies & returns the currently active theme name
	 *
	 * @return string
	 */
	public static function _get_theme_name() {

		// get current active theme
		$current_theme = wp_get_theme();
		$my_theme      = $current_theme->get( 'Name' );

		// beautify the theme name; remove spaces, and replace with _; make name lowercase
		$my_theme = strtolower( str_replace( ' ', '_', $my_theme ) );

		return esc_html( $my_theme );
	}

	public static function _get_focus_panel( $post ) {

		$query['autofocus[section]'] = self::_get_theme_name() . '_repeatable_section';
		$section_link                = add_query_arg( $query, admin_url( 'customize.php?url=' . get_permalink( $post->ID ) ) );

		return esc_url( $section_link );

	}
}
