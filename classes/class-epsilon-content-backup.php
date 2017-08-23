<?php
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * @since 1.2.0
 *
 * Class Epsilon_Content_Backup
 */
class Epsilon_Content_Backup {
	/**
	 * @since 1.2.0
	 * @var array
	 */
	public $fields = array();
	/**
	 * @since 1.2.0
	 * @var string
	 */
	public $slug = '';
	/**
	 * @since 1.2.0
	 * @var int
	 */
	public $setting_page;
	/**
	 * @since 1.2.0
	 * @var string
	 */
	public $hash;
	/**
	 * The single instance of the backup class
	 *
	 * @var     object
	 * @access   private
	 * @since    1.2.0
	 */
	private static $_instance = null;

	/**
	 * @since 1.2.0
	 * Epsilon_Content_Backup constructor.
	 */
	public function __construct() {
		$theme                = wp_get_theme();
		$this->slug           = $theme->get( 'TextDomain' );
		$this->slug_sanitized = str_replace( '-', '_', $theme->get( 'TextDomain' ) );
		$this->hash           = md5( json_encode( get_option( 'theme_mods_' . $this->slug ) ) );
		$this->setting_page   = get_option( $this->slug_sanitized . '_backup_settings', false );

		if ( ! $this->setting_page || null === get_post( $this->setting_page ) ) {
			$args = array(
				'post_title'  => $theme->get( 'Name' ) . ' Backup Settings',
				'post_status' => 'draft',
				'post_type'   => 'page',
				'post_author' => 0,
			);

			$this->setting_page = wp_insert_post( $args );
			if ( ! is_wp_error( $this->setting_page ) ) {
				update_option( $this->slug_sanitized . '_backup_settings', $this->setting_page );
			}
		}

		/**
		 * Add a notice, inform user that this page is only for backup purposes
		 */
		add_action( 'add_meta_boxes', array( $this, 'add_notice_to_page' ), 10, 2 );
		/**
		 * We need to keep this page as draft, forever.
		 */
		add_action( 'admin_init', array( $this, 'check_page_status' ) );
		/**
		 * We need to use this hook so we have a reference of the fields that are required as back up
		 */
		add_action( 'customize_register', array( $this, 'backup_settings' ), 999 );
	}

	/**
	 * @since 1.2.0
	 * @return Epsilon_Content_Backup
	 */
	public static function get_instance() {
		if ( is_null( self::$_instance ) ) {
			self::$_instance = new self();
		}

		return self::$_instance;
	}

	/**
	 * Registers a field in the "backup" collection
	 *
	 * @since 1.2.0
	 */
	public function add_field( $id, $args ) {
		$this->fields[ $id ] = $args;
	}

	/**
	 * Check the status of the settings page, it should always be draft
	 *
	 * @since 1.2.0
	 */
	public function check_page_status() {
		$post = get_post( $this->setting_page );
		if ( 'draft' !== $post->post_status ) {
			$settings = array(
				'ID'          => $this->setting_page,
				'post_status' => 'draft',
			);

			wp_update_post( $settings );
		}
	}

	/**
	 * Adds a notice to the page
	 *
	 * @since 1.2.0
	 */
	public function add_notice_to_page( $post_type, $post ) {
		if ( 'page' !== $post_type ) {
			return;
		}

		if ( $this->setting_page !== $post->ID ) {
			return;
		}

		$notifications = Epsilon_Notifications::get_instance();
		$notifications->add_notice(
			array(
				'id'      => $this->slug_sanitized . '_content_backup',
				'type'    => 'notice notice-info',
				'message' => '<p>' . esc_html__( 'This page contains the content created by the customizer.', 'epsilon-framework' ) . '</p>',
			)
		);
	}

	/**
	 * @since 1.2.0
	 *
	 * @param args
	 */
	public function backup_settings( $args ) {
		if ( defined( 'DOING_AJAX' ) ) {
			return;
		}

		$check = $this->check_hash();

		if ( $check['status'] ) {
			return;
		};

		$settings = array(
			'ID'           => $this->setting_page,
			'post_content' => $this->parse_content(),
		);

		wp_update_post( $settings );
	}

	/**
	 * @since 1.2.0
	 * @return array
	 */
	private function check_hash() {
		$arr = array(
			'status' => true,
		);

		$last_known_hash = get_transient( $this->slug . '_hash_update' );
		if ( false === $last_known_hash ) {
			set_transient( $this->slug . '_hash_update', $this->hash, 5 * MINUTE_IN_SECONDS );
		}

		if ( $last_known_hash !== $this->hash ) {
			$arr['status'] = false;
		}

		return $arr;
	}

	/**
	 * @since 1.2.0
	 * @return string
	 */
	private function parse_content() {
		$content    = '';
		$options    = get_option( 'theme_mods_' . $this->slug );
		$collection = array();

		foreach ( $this->fields as $id => $field ) {
			if ( array_key_exists( $id, $options ) ) {
				$collection[ $id ] = array(
					'id'      => $id,
					'content' => get_theme_mod( $id ),
					'type'    => $field['type'],
				);
			}
		}

		foreach ( $collection as $field => $props ) {
			$content .= $this->_parse_content( $props );
		}

		return $content;
	}

	/**
	 * @since 1.2.0
	 * @return string;
	 */
	private function _parse_content( $field ) {
		global $wp_customize;
		if ( empty( $field['content'] ) ) {
			return '';
		}

		$control = $wp_customize->get_control( $field['id'] );
		$content = $control->label . "\n";

		switch ( $field['type'] ) {
			case 'epsilon-repeater':
				$i = 1;
				foreach ( $field['content'] as $single_row ) {
					$content .= "\n";
					$content .= ( ! empty( $control->row_label ) && ! empty( $control->row_label['value'] ) ) ? $control->row_label['value'] . ' ' . $i . "\n" : 'Row - ' . $i . "\n";
					foreach ( $single_row as $id => $val ) {
						if ( empty( $val ) ) {
							continue;
						}
						$content .= $id . ' : ' . $val . "\n";
					}
					$i ++;
				}
				$content .= "\n";
				break;
			case 'epsilon-section-repeater':
				foreach ( $field['content'] as $single_section ) {
					$content .= "\n";
					$content .= $control->repeatable_sections[ $single_section['type'] ]['title'] . "\n";
					foreach ( $single_section as $id => $val ) {
						if ( empty( $val ) || 'type' === $id ) {
							continue;
						}

						if ( is_array( $val ) ) {
							$val = implode( ',', $val );
						}
						
						$content .= $id . ' : ' . $val . "\n";
					}
					$content .= '------------------------------------------------------------';
				}
				$content .= "\n";
				break;
			default:
				$content .= "\n";
				$content .= $field['content'];
				$content .= "\n \n";
				break;
		}// End switch().

		return $content;
	}
}
