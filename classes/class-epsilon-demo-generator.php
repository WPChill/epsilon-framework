<?php
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * @since 1.2.0
 * Class Epsilon_Demo_Generator
 */
class Epsilon_Demo_Generator {
	/**
	 * Posts array
	 *
	 * @since 1.2.0
	 * @var int
	 */
	public $posts = array();

	/**
	 * Array of widgets to import
	 *
	 * @since 1.2.0
	 * @var array
	 */
	public $widgets = array();

	/**
	 * Array of customizer options to import
	 *
	 * @since 1.2.0
	 * @var array
	 */
	public $custmizer_options = array();

	/**
	 * Epsilon_Demo_Generator constructor.
	 *
	 * @since 1.2.0
	 *
	 * @param array $posts
	 * @param array $widgets
	 * @param array $customizer_options
	 */
	public function __construct( $posts = array(), $widgets = array(), $customizer_options = array() ) {
		$this->posts              = $posts;
		$this->widgets            = $widgets;
		$this->customizer_options = $customizer_options;
	}

	/**
	 * Start adding posts to WP
	 *
	 * @since 1.2.0
	 */
	public function add_posts() {
		$posts = array();
		for ( $i = 0; $i <= $this->posts['post_count']; $i ++ ) {
			$post = $this->generate_post();
			if ( ! is_wp_error( $post ) ) {
				$posts[] = $post;
			}

			$this->generate_image(
				$post,
				$this->posts['image_size'],
				'',
				array(
					'category' => $this->posts['image_category'],
				)
			);
		}
	}

	/**
	 * Run this function to generate a new post
	 *
	 * @since 1.2.0
	 *
	 * @return int|WP_Error ( returns ID of the post on success)
	 */
	private function generate_post() {
		$generator = new Epsilon_Text_Generator();

		$post = array(
			'post_title'   => ucfirst( $generator->words( 5 ) ),
			'post_content' => $generator->paragraphs( 1, 'p' ) . "\n" . '<!--more-->' . "\n" . $generator->paragraphs( 3, 'p' ),
			'post_status'  => 'publish',
		);

		return $post;
	}

	/**
	 * Run this function to generate an image and assign it to a post
	 *
	 * @since 1.2.0
	 *
	 * @param        $post_id
	 * @param array  $sizes
	 * @param string $description
	 */
	private function generate_image( $post_id, $sizes = array(), $description = '', $options = array() ) {
		$image = new Epsilon_Image_Generator( $post_id, $sizes, $description, $options );
		$image->generate_featured_image();
	}
}
