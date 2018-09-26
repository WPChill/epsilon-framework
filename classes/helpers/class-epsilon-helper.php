<?php
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * @since 1.1.0
 * Class Epsilon_Helper
 */
class Epsilon_Helper {

	/**
	 * Add description closer button to the section
	 *
	 * @return string
	 */
	public static function add_description_button() {
		return '<button type="button" class="epsilon-button-link-close-section">' . __( 'Close', 'epsilon-framework' ) . '</button>';
	}

	/**
	 * Generate an edit shortcut for the frontend sections
	 */
	public static function generate_pencil( $class_name = '', $section_type = '' ) {
		$sections = $class_name::get_instance();
		if ( ! isset( $sections->sections[ $section_type ] ) ) {
			return '';
		}

		if ( ! is_customize_preview() ) {
			return '';
		}

		if ( ! isset( $sections->sections[ $section_type ]['groups'] ) ) {
			return '<a href="#" class="epsilon-section-editor"><span class="dashicons dashicons-edit"></span></a>';
		}

		$customization = array(
			'regular' => true,
		);

		$icons = array(
			'regular' => 'edit',
			'delete'  => 'trash'
		);
		foreach ( $sections->sections[ $section_type ]['groups'] as $k => $v ) {
			$customization[ $k ] = true;
			$icons[ $k ]         = str_replace( 'dashicons dashicons-', '', $v['icon'] );
		}

		$customization['delete'] = true;


		$customization = array_filter( $customization );

		$html = '<div class="epsilon-pencil-button-group">';
		foreach ( $customization as $k => $v ) {
			$html .= '<a href="#" data-focus="' . $k . '"><span class="dashicons dashicons-' . $icons[ $k ] . '"></span></a>';
		}
		$html .= '</div>';

		return $html;
	}

	/**
	 * Generates an edit shortcut for a single repeater field
	 * in order for this to work, we need to send over the previewer
	 * the following info:
	 *
	 * 1. Repeater field id
	 * 2. Doubled section id
	 * 3. Repeater field index
	 *
	 * @param null   $index
	 * @param string $doubled_section
	 * @param string $control
	 *
	 * @return string
	 */
	public static function generate_field_repeater_pencil( $index = null, $doubled_section = '', $control = '' ) {
		if ( ! is_customize_preview() ) {
			return '';
		}

		if ( null === $index ) {
			return '';
		}

		if ( empty( $doubled_section ) ) {
			return '';
		}

		if ( empty( $control ) ) {
			return '';
		}


		$html = "<div class='epsilon-button-control-group'>";
		$html .= "<a href='#' class='epsilon-control-button epsilon-control-button-edit epsilon-field-repeater-editor' data-index='{$index}' data-control='{$control}' data-doubled-section='{$doubled_section}'>";
		$html .= "<span class='dashicons dashicons-edit'></span>";
		$html .= "</a>";
		$html .= "<a href='#' class='epsilon-control-button epsilon-control-button-delete epsilon-field-repeater-delete-item' data-index='{$index}' data-control='{$control}'><span class='dashicons dashicons-trash'></span></a>";
		$html .= '</div>';

		return $html;
	}

	/**
	 * Allowed kses
	 *
	 * @return array
	 */
	public static function allowed_kses_pencil() {
		return array(
			'div'  => array(
				'class' => true,
			),
			'a'    => array(
				'class'                => true,
				'data-focus'           => true,
				'href'                 => true,
				'data-control'         => true,
				'data-doubled-section' => true,
				'data-index'           => true,
			),
			'span' => array(
				'class' => true,
			),
		);
	}

	/**
	 * Function that retrieves image sizes defined in theme
	 *
	 * @return array
	 */
	public static function get_image_sizes() {
		global $_wp_additional_image_sizes;

		$sizes = array();

		foreach ( get_intermediate_image_sizes() as $_size ) {
			if ( in_array( $_size, array( 'thumbnail', 'medium', 'medium_large', 'large' ) ) ) {
				$sizes[ $_size ]['width']  = get_option( "{$_size}_size_w" );
				$sizes[ $_size ]['height'] = get_option( "{$_size}_size_h" );
				$sizes[ $_size ]['crop']   = (bool) get_option( "{$_size}_crop" );
			} elseif ( isset( $_wp_additional_image_sizes[ $_size ] ) ) {
				$sizes[ $_size ] = array(
					'width'  => $_wp_additional_image_sizes[ $_size ]['width'],
					'height' => $_wp_additional_image_sizes[ $_size ]['height'],
					'crop'   => $_wp_additional_image_sizes[ $_size ]['crop'],
				);
			}
		}

		return $sizes;
	}

	/**
	 * Format a CSS string used in the section repeater template
	 */
	public static function get_css_string( $fields ) {
		$css        = '';
		$translator = array(
			'topleft'     => 'top left',
			'top'         => 'top',
			'topright'    => 'top right',
			'left'        => 'left',
			'center'      => 'center',
			'right'       => 'right',
			'bottomleft'  => 'bottom left',
			'bottom'      => 'bottom',
			'bottomright' => 'bottom right',
		);

		foreach ( $fields as $key => $value ) {
			if ( empty( $value ) ) {
				continue;
			}
			switch ( $key ) {
				case 'background-image':
					$css .= $key . ': url(' . esc_url( $value ) . ');';
					break;
				case 'background-position':
					$css .= $key . ': ' . esc_attr( isset( $translator[ $value ] ) ? $translator[ $value ] : 'center' ) . ';';
					break;
				case 'background-size':
					$css .= $key . ': ' . esc_attr( $value ) . ';';
					break;
				case 'background-color':
					$css .= $key . ':' . esc_attr( $value ) . ';';
					break;
				default:
					$css .= '';
					break;
			}
		}

		return $css;
	}

	/**
	 * Gets an image with custom dimensions
	 */
	public static function get_image_with_custom_dimensions( $control = '' ) {
		$decoded = json_decode( get_theme_mod( $control, '{}' ), true );
		if ( empty( $decoded ) ) {
			the_custom_logo();

			return;
		}

		$associated_image = get_theme_mod( $decoded['linked_control'], false );

		if ( ! $associated_image ) {
			return;
		}

		$image_alt = get_post_meta( $associated_image, '_wp_attachment_image_alt', true );
		$attr      = array(
			'class'    => '',
			'itemprop' => '',
		);

		if ( empty( $image_alt ) ) {
			$attr['alt'] = get_bloginfo( 'name', 'display' );
		}

		if ( 'custom_logo' === $decoded['linked_control'] ) {
			$attr['class']    = 'custom-logo logo';
			$attr['itemprop'] = 'logo';

			$image = wp_get_attachment_image_src( $associated_image, 'full' );

			$html = sprintf( '<a href="%1$s" class="custom-logo-link" rel="home" itemprop="url"><img src="%2$s" alt="' . $attr['alt'] . '" itemprop="logo" width="' . $decoded['width'] . '" height="' . $decoded['height'] . ' "/></a>', esc_url( home_url( '/' ) ), $image[0] );
		}

		echo $html;
	}

	/**
	 * Check if we have a static page
	 */
	public static function get_static_frontpage_permalink() {
		$front = get_option( 'show_on_front' );
		if ( 'posts' === $front ) {
			return false;
		}

		return get_permalink( get_option( 'page_on_front' ) );
	}

	/**
	 * Check if we have a blog page, if not add it
	 */
	public static function get_blogpage_permalink() {
		$front = get_option( 'show_on_front' );
		if ( 'posts' === $front ) {
			return false;
		}

		return get_permalink( get_option( 'page_for_posts' ) );
	}

	/**
	 * Create a new page for Page Changer
	 */

	public static function create_page( $params ) {

		$page_name = $params['epsilon_page_name'];

		if ( '' != $page_name ) {
			$args = array(
				'post_title'   => wp_strip_all_tags( $page_name ),
				'post_content' => '',
				'post_status'  => 'publish',
				'post_type'    => 'page',
			);

			$page = wp_insert_post( $args );

			if ( $page ) {

				$args = array(
					'type'                => 'epsilon-section-repeater',
					'label'               => esc_html__( 'Sections', 'portum' ),
					'section'             => esc_html( $params['epsilon_customizer_section'] ),
					'page_builder'        => true,
					'repeatable_sections' => Portum_Repeatable_Sections::get_instance()->sections,
				);

				$instance = Epsilon_Content_Backup::get_instance();
				$instance->add_pages( $page, $params['epsilon_control_id'] . '_' . $page, $args );

				$url = get_permalink( $page );

				return array( 'status' => true, 'url' => $url, 'id' => $page );

			}
		}

		return 'nok';

	}
}
