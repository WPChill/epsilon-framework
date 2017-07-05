<?php
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Download a random image from Unsplash and add it as post thumbnail
 *
 * @since 1.2.0
 * Class Epsilon_Image_Generator
 */
class Epsilon_Image_Generator {
	/**
	 * @since 1.2.0
	 * @var null
	 */
	public $post_id = null;
	/**
	 * @since 1.2.0
	 * @var array
	 */
	public $size = array();
	/**
	 * @since 1.2.0
	 * @var string
	 */
	public $desc = '';
	/**
	 * @since 1.2.0
	 * @var string
	 */
	public $url = '';
	/**
	 * @since 1.2.0
	 * @var array
	 */
	public $options = array();

	/**
	 * Epsilon_Image_Generator constructor.
	 *
	 * @since 1.2.0
	 *
	 * @param null   $post_id
	 * @param array  $size
	 * @param string $desc
	 */
	public function __construct( $post_id = null, $size = array(), $desc = '', $options = array() ) {
		$this->load_dependencies();

		$this->post_id = $post_id;
		$this->size    = $size;
		$this->desc    = $desc . ' - Automatically downloaded from flickr.com.';

		$this->options = $options;

		$this->url = $this->generate_download_url();
	}

	/**
	 * Load WordPress Core files to handle image upload and post insertion
	 *
	 * @since 1.2.0
	 */
	public function load_dependencies() {
		require_once ABSPATH . 'wp-admin/includes/file.php';
		require_once ABSPATH . 'wp-admin/includes/post.php';
		require_once ABSPATH . 'wp-admin/includes/image.php';
		require_once ABSPATH . 'wp-admin/includes/media.php';
	}

	/**
	 * Downloads an image from the specified URL and attaches it to a post as a post thumbnail.
	 *
	 * @since 1.2.0
	 *
	 * @param string $file    The URL of the image to download.
	 * @param int    $post_id The post ID the post thumbnail is to be associated with.
	 * @param string $desc    Optional. Description of the image.
	 *
	 * @return string|WP_Error Attachment ID, WP_Error object otherwise.
	 *
	 * @credit https://wordpress.stackexchange.com/questions/40301/how-do-i-set-a-featured-image-thumbnail-by-image-url-when-using-wp-insert-post
	 */
	public function generate_featured_image() {
		if ( ! $this->is_valid_url( $this->url ) ) {
			return new WP_Error( 'Download URL not valid', 'epsilon-framework' );
		}

		if ( has_post_thumbnail( $this->post_id ) ) {
			return new WP_Error( 'Post Thumbnail already set', 'epsilon-framework' );
		}

		// Set variables for storage, fix file filename for query strings.
		$file_array         = array();
		$file_array['name'] = basename( 'unsplash' . rand( 1, 123123123 ) ) . '.jpg';

		// Download file to temp location.
		$file_array['tmp_name'] = download_url( $this->url );

		// If error storing temporarily, return the error.
		if ( is_wp_error( $file_array['tmp_name'] ) ) {
			return $file_array['tmp_name'];
		}

		// Do the validation and storage stuff.
		$id = media_handle_sideload( $file_array, $this->post_id, $this->desc );

		// If error storing permanently, unlink.
		if ( is_wp_error( $id ) ) {
			unlink( $file_array['tmp_name'] );

			return $id;
		}

		return set_post_thumbnail( $this->post_id, $id );
	}

	/**
	 * @since 1.2.0
	 *
	 * Generate the download URL for the image (based on image size)
	 */
	public function generate_download_url() {
		$this->url = 'https://loremflickr.com/';
		$this->url .= implode( '/', $this->size );

		if ( ! empty( $this->options ) ) {
			if ( ! empty( $this->options['category'] ) ) {
				$this->url .= '/' . implode( ',', $this->options['category'] );
			}
		} else {
			$this->url .= '?random=1';
		}

		return $this->url;
	}

	/**
	 * @since 1.2.0
	 *
	 * @param $url
	 *
	 * @return int
	 */
	public function is_valid_url() {
		return preg_match( '|^http(s)?://(www\.)?loremflickr\.com|i', $this->url );
	}
}
