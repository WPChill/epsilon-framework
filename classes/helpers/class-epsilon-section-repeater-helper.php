<?php
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Class Epsilon_Section_Repeater_Helper
 */
class Epsilon_Section_Repeater_Helper {

	/**
	 * @var null
	 */
	public $id = null;

	/**
	 * @var array
	 */
	public $column_alignment = array();

	/**
	 * @var array
	 */
	public $column_vertical_alignment = array();

	/**
	 * @var array
	 */
	public $column_stretch = array();

	/**
	 * @var array
	 */
	public $column_spacing = array();

	/**
	 * @var array
	 */
	public $column_group = array();

	/**
	 * @var array
	 */
	public $row_spacing = array();
	/**
	 * @var array
	 */
	public $row_spacing_bottom = array();

	/**
	 * @var array
	 */
	public $title_align = array();

	/**
	 * @var array
	 */
	public $template_selector = array();

	/**
	 * Epsilon_Section_Repeater_Helper constructor.
	 */
	public function __construct( $args = array() ) {
		$this->id = $args['id'];

		$this->set_column_alignment();
		$this->set_column_vertical_alignment();
		$this->set_column_group();
		$this->set_column_stretch();
		$this->set_column_spacing();
		$this->set_row_spacing();
		$this->set_row_spacing_bottom();
		$this->set_title_align();
	}

	/**
	 * @param array $args
	 *
	 * @return Epsilon_Section_Repeater_Helper
	 */
	public static function get_instance( $args = array() ) {
		static $inst;
		if ( ! $inst ) {
			$inst = new Epsilon_Section_Repeater_Helper( $args );
		}

		return $inst;
	}

	/**
	 *
	 */
	public function set_column_alignment() {
		$this->column_alignment = array(
			'left'   => array(
				'icon'  => 'dashicons-editor-alignleft',
				'value' => 'left',
			),
			'center' => array(
				'icon'  => 'dashicons-editor-aligncenter',
				'value' => 'center',
			),
			'right'  => array(
				'icon'  => 'dashicons-editor-alignright',
				'value' => 'right',
			),
		);
	}

	/**
	 *
	 */
	public function set_column_vertical_alignment() {
		$this->column_vertical_alignment = array(
			'top'    => array(
				'value' => 'top',
				'png'   => EPSILON_URI . '/assets/img/epsilon-section-aligntop.png',
			),
			'middle' => array(
				'value' => 'middle',
				'png'   => EPSILON_URI . '/assets/img/epsilon-section-alignmiddle.png',
			),
			'bottom' => array(
				'value' => 'bottom',
				'png'   => EPSILON_URI . '/assets/img/epsilon-section-alignbottom.png',
			),
		);
	}

	/**
	 *
	 */
	public function set_column_stretch() {
		$this->column_stretch = array(
			'boxedcenter' => array(
				'value' => 'boxedcenter',
				'png'   => EPSILON_URI . '/assets/img/epsilon-section-boxedcenter.png',
			),
			'boxedin'     => array(
				'value' => 'boxedin',
				'png'   => EPSILON_URI . '/assets/img/epsilon-section-boxedin.png',
			),
			'fullwidth'   => array(
				'value' => 'fullwidth',
				'png'   => EPSILON_URI . '/assets/img/epsilon-section-fullwidth.png',
			),
		);
	}

	/**
	 *
	 */
	public function set_column_spacing() {
		$this->column_spacing = array(
			'none' => array(
				'value' => 'none',
				'png'   => EPSILON_URI . '/assets/img/epsilon-section-spacing-none.png',
			),
			'sm'   => array(
				'value' => 'sm',
				'png'   => EPSILON_URI . '/assets/img/epsilon-section-spacing-sm.png',
			),
			'md'   => array(
				'value' => 'md',
				'png'   => EPSILON_URI . '/assets/img/epsilon-section-spacing-md.png',
			),
			'lg'   => array(
				'value' => 'lg',
				'png'   => EPSILON_URI . '/assets/img/epsilon-section-spacing-lg.png',
			),
		);
	}

	/**
	 *
	 */
	public function set_column_group() {
		$this->column_group = array(
			1 => array(
				'value' => 1,
				'png'   => EPSILON_URI . '/assets/img/one-column.png',
			),
			2 => array(
				'value' => 2,
				'png'   => EPSILON_URI . '/assets/img/two-column.png',
			),
			3 => array(
				'value' => 3,
				'png'   => EPSILON_URI . '/assets/img/three-column.png',
			),
			4 => array(
				'value' => 4,
				'png'   => EPSILON_URI . '/assets/img/four-column.png',
			),
			5 => array(
				'value' => 5,
				'png'   => EPSILON_URI . '/assets/img/five-column.png',
			),
			6 => array(
				'value' => 6,
				'png'   => EPSILON_URI . '/assets/img/six-column.png',
			),
		);
	}

	/**
	 *
	 */
	public function set_row_spacing() {
		$this->row_spacing = array(
			'none' => array(
				'value' => 'none',
				'png'   => EPSILON_URI . '/assets/img/epsilon-section-spacenone.jpg',
			),
			'sm'   => array(
				'value' => 'sm',
				'png'   => EPSILON_URI . '/assets/img/epsilon-section-spacesm.jpg',
			),
			'md'   => array(
				'value' => 'md',
				'png'   => EPSILON_URI . '/assets/img/epsilon-section-spacemd.jpg',
			),
			'lg'   => array(
				'value' => 'lg',
				'png'   => EPSILON_URI . '/assets/img/epsilon-section-spacelg.jpg',
			),
		);
	}

	/**
	 *
	 */
	public function set_row_spacing_bottom() {
		$this->row_spacing_bottom = array(
			'none' => array(
				'value' => 'none',
				'png'   => EPSILON_URI . '/assets/img/epsilon-section-bottom-spacenone.jpg',
			),
			'sm'   => array(
				'value' => 'sm',
				'png'   => EPSILON_URI . '/assets/img/epsilon-section-bottom-spacesm.jpg',
			),
			'md'   => array(
				'value' => 'md',
				'png'   => EPSILON_URI . '/assets/img/epsilon-section-bottom-spacemd.jpg',
			),
			'lg'   => array(
				'value' => 'lg',
				'png'   => EPSILON_URI . '/assets/img/epsilon-section-bottom-spacelg.jpg',
			),
		);
	}

	/**
	 *
	 */
	public function set_title_align() {
		$this->title_align = array(
			'top'    => array(
				'value' => 'top',
				'png'   => EPSILON_URI . '/assets/img/epsilon-section-titletop.jpg',
			),
			'bottom' => array(
				'value' => 'bottom',
			),
			'left'   => array(
				'value' => 'left',
				'png'   => EPSILON_URI . '/assets/img/epsilon-section-titleleft.jpg',
			),
			'right'  => array(
				'value' => 'right',
				'png'   => EPSILON_URI . '/assets/img/epsilon-section-titleright.jpg',
			),
		);
	}

	public function set_template_selector() {

	}

	/**
	 * Set group type
	 */
	public function set_group_type( $choices = array() ) {
		$arr = array(
			0 => 'none',
			1 => 'one',
			2 => 'two',
			3 => 'three',
			4 => 'four',
			5 => 'five',
			6 => 'six',
		);

		return $arr[ count( $choices ) ];
	}

	/**
	 * Create from a field of keys, "usable" fields
	 *
	 * @param array $styling
	 * @param       $key
	 *
	 * @return array
	 */
	public function create_color_fields( $colors = array(), $key ) {
		$arr = array();
		foreach ( $colors as $prop => $values ) {
			switch ( $prop ) {
				case 'text-color':
					$temp = array(
						'id'          => $key . '_text_color',
						'label'       => __( 'Section Body Text Color', 'epsilon-framework' ),
						'description' => '',
						'default'     => isset( $values['default'] ) ? $values['default'] : '',
						'type'        => 'epsilon-color-picker',
						'mode'        => 'hex',
						'defaultVal'  => isset( $values['default'] ) ? $values['default'] : '',
						'selectors'   => ! empty( $values['selectors'] ) ? $values['selectors'] : array( 'p' ),
						'group'       => 'colors',
					);

					if ( is_array( $values['condition'] ) ) {
						$temp['condition'] = $values['condition'];
					}

					$arr[ $key . '_text_color' ] = $temp;
					break;
				case 'heading-color':
					$temp = array(
						'id'          => $key . '_heading_color',
						'label'       => __( 'Section Title Color', 'epsilon-framework' ),
						'description' => '',
						'default'     => isset( $values['default'] ) ? $values['default'] : '',
						'type'        => 'epsilon-color-picker',
						'mode'        => 'hex',
						'defaultVal'  => isset( $values['default'] ) ? $values['default'] : '',
						'selectors'   => ! empty( $values['selectors'] ) ? $values['selectors'] : array(
							'div[class*="ewf-like-"]',
						),
						'group'       => 'colors',
					);

					if ( is_array( $values['condition'] ) ) {
						$temp['condition'] = $values['condition'];
					}

					$arr[ $key . '_heading_color' ] = $temp;
					break;
				default:
					break;
			}// End switch().
		}// End foreach().

		return $arr;
	}

	/**
	 * Create from a field of keys, "usable" fields
	 *
	 * @param array $styling
	 * @param       $key
	 *
	 * @return array
	 */
	public function create_styling_fields( $styling = array(), $key ) {
		$sizes = Epsilon_Helper::get_image_sizes();
		$arr   = array();
		foreach ( $styling as $prop => $values ) {
			switch ( $prop ) {
				case 'background-type':
					$temp = array(
						'id'      => $key . '_background_type',
						'label'   => esc_html__( 'Background Type', 'epsilon-framework' ),
						'default' => isset( $values['default'] ) ? $values['default'] : '',
						'type'    => 'epsilon-toggle',
						'group'   => 'styling',
					);

					if ( is_array( $values['condition'] ) ) {
						$temp['condition'] = $values['condition'];
					}

					$arr[ $key . '_background_type' ] = $temp;
					break;
				case 'background-color':
					$temp = array(
						'id'         => $key . '_background_color',
						'label'      => esc_html__( 'Background Color', 'epsilon-framework' ),
						//'description' => esc_html__( 'Setting a value for this field will create a color overlay on top of background image/videos.', 'epsilon-framework' ),
						'default'    => isset( $values['default'] ) ? $values['default'] : '',
						'type'       => 'epsilon-color-picker',
						'mode'       => 'hex',
						'defaultVal' => isset( $values['default'] ) ? $values['default'] : '',
						'group'      => 'styling',
					);

					if ( is_array( $values['condition'] ) ) {
						$temp['condition'] = $values['condition'];
					}

					$arr[ $key . '_background_color' ] = $temp;
					break;
				case 'background-color-opacity':
					$temp = array(
						'id'          => $key . '_background_color_opacity',
						'label'       => __( 'Background color opacity', 'epsilon-framework' ),
						'description' => '',
						'type'        => 'epsilon-slider',
						'default'     => isset( $values['default'] ) ? $values['default'] : 1,
						'choices'     => array(
							'step' => .05,
							'min'  => 0,
							'max'  => 1,
						),
						'group'       => 'styling',
					);

					if ( is_array( $values['condition'] ) ) {
						$temp['condition'] = $values['condition'];
					}

					$arr[ $key . '_background_color_opacity' ] = $temp;
					break;
				case 'background-image':
					$temp = array(
						'id'          => $key . '_background_image',
						'label'       => esc_html__( 'Background Image', 'epsilon-framework' ),
						'description' => esc_html__( 'Use this field to set a background image. Content will overlay on top of the image.', 'epsilon-framework' ),
						'type'        => 'epsilon-image',
						'default'     => isset( $values['default'] ) ? $values['default'] : '',
						'group'       => 'styling',
						'size'        => 'full',
						'sizeArray'   => $sizes,
						'mode'        => 'url',
					);

					if ( is_array( $values['condition'] ) ) {
						$temp['condition'] = $values['condition'];
					}

					$arr[ $key . '_background_image' ] = $temp;
					break;
				case 'background-position':
					$temp = array(
						'id'          => $key . '_background_position',
						'label'       => esc_html__( 'Background Position', 'epsilon-framework' ),
						'description' => esc_html__( 'We recommend using Center. Experiment with the options to see what works best for you.', 'epsilon-framwework' ),
						'default'     => isset( $values['default'] ) ? $values['default'] : '',
						'type'        => 'select',
						'group'       => 'styling',
						'choices'     => array(
							'topleft'     => __( 'Top Left', 'epsilon-framework' ),
							'top'         => __( 'Top', 'epsilon-framework' ),
							'topright'    => __( 'Top Right', 'epsilon-framework' ),
							'left'        => __( 'Left', 'epsilon-framework' ),
							'center'      => __( 'Center', 'epsilon-framework' ),
							'right'       => __( 'Right', 'epsilon-framework' ),
							'bottomleft'  => __( 'Bottom Left', 'epsilon-framework' ),
							'bottom'      => __( 'Bottom', 'epsilon-framework' ),
							'bottomright' => __( 'Bottom Right', 'epsilon-framework' ),
						),
					);

					if ( is_array( $values['condition'] ) ) {
						$temp['condition'] = $values['condition'];
					}

					$arr[ $key . '_background_position' ] = $temp;
					break;
				case 'background-repeat':
					$temp = array(
						'id'          => $key . '_background_repeat',
						'label'       => esc_html__( 'Background Repeat', 'epsilon-framework' ),
						'description' => esc_html__( 'Set to background-repeat if you are using patterns. For parallax, we recommend setting to no-repeat.', 'epsilon-framework' ),
						'default'     => isset( $values['default'] ) ? $values['default'] : '',
						'type'        => 'select',
						'group'       => 'styling',
						'choices'     => array(
							'no-repeat' => __( 'No Repeat', 'epsilon-framework' ),
							'repeat'    => __( 'Repeat', 'epsilon-framework' ),
							'repeat-y'  => __( 'Repeat Y', 'epsilon-framework' ),
							'repeat-x'  => __( 'Repeat X', 'epsilon-framework' ),
						),
					);

					if ( is_array( $values['condition'] ) ) {
						$temp['condition'] = $values['condition'];
					}

					$arr[ $key . '_background_repeat' ] = $temp;
					break;
				case 'background-size':
					$temp = array(
						'id'          => $key . '_background_size',
						'label'       => esc_html__( 'Background Stretch', 'epsilon-framework' ),
						'description' => esc_html__( 'We usually recommend using cover as a default option.', 'epsilon-framework' ),
						'default'     => isset( $values['default'] ) ? $values['default'] : '',
						'type'        => 'select',
						'group'       => 'styling',
						'choices'     => array(
							'cover'   => __( 'Cover', 'epsilon-framework' ),
							'contain' => __( 'Contain', 'epsilon-framework' ),
							'initial' => __( 'Initial', 'epsilon-framework' ),
						),
					);

					if ( is_array( $values['condition'] ) ) {
						$temp['condition'] = $values['condition'];
					}

					$arr[ $key . '_background_size' ] = $temp;
					break;
				case 'background-parallax':
					$temp = array(
						'id'          => $key . '_background_parallax',
						'label'       => esc_html__( 'Background Parallax', 'epsilon-framework' ),
						'description' => esc_html__( 'Toggling this to ON will enable the parallax effect. Make sure you have a  background image set before enabling it.', 'epsilon-framework' ),
						'default'     => isset( $values['default'] ) ? $values['default'] : false,
						'type'        => 'epsilon-toggle',
						'group'       => 'styling',
					);

					if ( is_array( $values['condition'] ) ) {
						$temp['condition'] = $values['condition'];
					}

					$arr[ $key . '_background_parallax' ] = $temp;
					break;
				case 'background-video':
					$temp = array(
						'id'          => $key . '_background_video',
						'label'       => esc_html__( 'Background Video ', 'epsilon-framework' ),
						'description' => esc_html__( 'Works only with YouTube. Paste your video URL here. Make sure video is embeddable.', 'epsilon-framework' ),
						'default'     => isset( $values['default'] ) ? $values['default'] : '',
						'type'        => 'text',
						'group'       => 'styling',
					);

					if ( is_array( $values['condition'] ) ) {
						$temp['condition'] = $values['condition'];
					}

					$arr[ $key . '_background_video' ] = $temp;
					break;
				default:
					break;
			}// End switch().
		}// End foreach().

		return $arr;

	}


	/**
	 * Create the choices array
	 *
	 * @param string $key
	 * @param array  $choices
	 *
	 * @return array
	 */
	public function create_choices_array( $key = '', $choices = array() ) {
		$arr = array();

		foreach ( $choices as $choice ) {
			$exists = array_key_exists( $choice, $this->{$key} );
			if ( $exists ) {
				$arr[ $choice ] = $this->{$key}[ $choice ];
			}
		}

		return $arr;
	}

	/**
	 *  Create from a field of keys, "usable" fields
	 *
	 * @param array $layout
	 * @param       $key
	 *
	 * @return array
	 */
	public function create_layout_fields( $layout = array(), $key ) {
		$arr = array();
		foreach ( $layout as $prop => $values ) {
			switch ( $prop ) {
				case 'column-alignment':
					$temp = array(
						'id'          => $key . '_column_alignment',
						'type'        => 'select',
						'label'       => esc_html__( 'Horizontal Alignment', 'epsilon-framework' ),
						'description' => esc_html__( 'Center/Left/Right align all of a sections content.', 'epsilon-framework' ),
						'group'       => 'layout',
						'choices'     => array(
							'left'   => esc_html__( 'Left', 'epsilon-framework' ),
							'center' => esc_html__( 'Center', 'epsilon-framework' ),
							'right'  => esc_html__( 'Right', 'epsilon-framework' ),
						),
						'default'     => isset( $values['default'] ) ? $values['default'] : 'center',
					);

					if ( is_array( $values['condition'] ) ) {
						$temp['condition'] = $values['condition'];
					}

					$temp['groupType'] = $this->set_group_type( $temp['choices'] );

					$arr[ $key . '_column_alignment' ] = $temp;
					break;

				case 'column-vertical-alignment':
					$temp = array(
						'id'          => $key . '_column_vertical_alignment',
						'type'        => 'select',
						'label'       => esc_html__( 'Vertical Alignment', 'epsilon-framework' ),
						'description' => esc_html__( 'We recommend leaving this to center, but feel free to experiment with the options. Top/Bottom align can be useful when you have a layout of text + image on the same line.', 'epsilon-framework' ),
						'group'       => 'layout',
						'choices'     => array(
							'top'    => esc_html__( 'Top', 'epsilon-framework' ),
							'middle' => esc_html__( 'Middle', 'epsilon-framework' ),
							'bottom' => esc_html__( 'Bottom', 'epsilon-framework' ),
						),
						'default'     => isset( $values['default'] ) ? $values['default'] : 'middle',
					);

					if ( is_array( $values['condition'] ) ) {
						$temp['condition'] = $values['condition'];
					}

					$temp['groupType'] = $this->set_group_type( $temp['choices'] );

					$arr[ $key . '_column_vertical_alignment' ] = $temp;
					break;

				case 'column-stretch':
					$temp = array(
						'id'          => $key . '_column_stretch',
						'type'        => 'select',
						'label'       => esc_html__( 'Section Width', 'epsilon-framework' ),
						'description' => esc_html__( 'Make the section stretch to full-width. Contained is default. There\'s also the option of boxed center. ', 'epsilon-framework' ),
						'group'       => 'layout',
						'choices'     => array(
							'fullwidth' => esc_html__( 'Fullwidth (100% width)', 'epsilon-framework' ),
							'boxedin'   => esc_html__( 'Contained (1170px width)', 'epsilon-framework' ),
						),
						'default'     => isset( $values['default'] ) ? $values['default'] : 'boxedin',
					);

					if ( is_array( $values['condition'] ) ) {
						$temp['condition'] = $values['condition'];
					}

					$temp['groupType'] = $this->set_group_type( $temp['choices'] );

					$arr[ $key . '_column_stretch' ] = $temp;
					break;

				case 'column-spacing':
					$temp = array(
						'id'      => $key . '_column_spacing',
						'type'    => 'select',
						'label'   => esc_html__( 'Item Spacing', 'epsilon-framework' ),
						'group'   => 'layout',
						'choices' => array(
							'none' => esc_html__( 'None', 'epsilon-framework' ),
							'sm'   => esc_html__( 'Small', 'epsilon-framework' ),
							'md'   => esc_html__( 'Medium', 'epsilon-framework' ),
							'lg'   => esc_html__( 'Large', 'epsilon-framework' ),
						),
						'default' => isset( $values['default'] ) ? $values['default'] : 'spaced',
					);

					if ( is_array( $values['condition'] ) ) {
						$temp['condition'] = $values['condition'];
					}

					$temp['groupType'] = $this->set_group_type( $temp['choices'] );

					$arr[ $key . '_column_spacing' ] = $temp;
					break;

				case 'column-group':
					$temp = array(
						'id'          => $key . '_column_group',
						'type'        => 'select',
						'label'       => esc_html__( 'Item Group', 'epsilon-framework' ),
						'description' => esc_html__( 'Number of items to display at once. Example: 2, 3 or 4 pricing tables. The width of the content will be equally split among the number of elements you select.', 'epsilon-framework' ),
						'group'       => 'layout',
						'choices'     => array(
							1 => esc_html__( 'One', 'epsilon-framework' ),
							2 => esc_html__( 'Two', 'epsilon-framework' ),
							3 => esc_html__( 'Three', 'epsilon-framework' ),
							4 => esc_html__( 'Four', 'epsilon-framework' ),
							6 => esc_html__( 'Six', 'epsilon-framework' ),
						),
						'default'     => isset( $values['default'] ) ? absint( $values['default'] ) : 4,
					);

					if ( is_array( $values['condition'] ) ) {
						$temp['condition'] = $values['condition'];
					}

					$temp['groupType'] = $this->set_group_type( $temp['choices'] );

					$arr[ $key . '_column_group' ] = $temp;
					break;

				case 'row-spacing-top':
					$temp = array(
						'id'          => $key . '_row_spacing_top',
						'type'        => 'select',
						'label'       => esc_html__( 'Padding Top', 'epsilon-framework' ),
						'description' => esc_html__( 'Adds padding top. ', 'epsilon-framework' ),
						'group'       => 'layout',
						'choices'     => array(
							'lg'   => esc_html__( 'Large (105px)', 'epsilon-framework' ),
							'md'   => esc_html__( 'Medium (75px)', 'epsilon-framework' ),
							'sm'   => esc_html__( 'Small (35px)', 'epsilon-framework' ),
							'none' => esc_html__( 'None (0px)', 'epsilon-framework' ),
						),
						'default'     => isset( $values['default'] ) ? $values['default'] : 'none',
					);

					if ( is_array( $values['condition'] ) ) {
						$temp['condition'] = $values['condition'];
					}

					$temp['groupType'] = $this->set_group_type( $temp['choices'] );

					$arr[ $key . '_row_spacing_top' ] = $temp;
					break;
				case 'row-spacing-bottom':
					$temp = array(
						'id'          => $key . '_row_spacing_bottom',
						'type'        => 'select',
						'label'       => esc_html__( 'Padding Bottom', 'epsilon-framework' ),
						'description' => esc_html__( 'Adds padding bottom.', 'epsilon-framework' ),
						'group'       => 'layout',
						'choices'     => array(
							'lg'   => esc_html__( 'Large (105px)', 'epsilon-framework' ),
							'md'   => esc_html__( 'Medium (75px)', 'epsilon-framework' ),
							'sm'   => esc_html__( 'Small (35px)', 'epsilon-framework' ),
							'none' => esc_html__( 'None (0px)', 'epsilon-framework' ),
						),
						'default'     => isset( $values['default'] ) ? $values['default'] : 'none',
					);

					if ( is_array( $values['condition'] ) ) {
						$temp['condition'] = $values['condition'];
					}

					$temp['groupType'] = $this->set_group_type( $temp['choices'] );

					$arr[ $key . '_row_spacing_bottom' ] = $temp;
					break;
				case 'row-title-align':
					$temp = array(
						'id'          => $key . '_row_title_align',
						'type'        => 'select',
						'label'       => esc_html__( 'Section Layout', 'epsilon-framework' ),
						'description' => esc_html__( 'All sections support an alternating layout. The layout changes based on a section\'s title position. Currently available options are: title left / content right -- title center / content center -- title right / content left ', 'epsilon-framework' ),
						'group'       => 'layout',
						'choices'     => array(
							'top'    => esc_html__( 'Top', 'epsilon-framework' ),
							'bottom' => esc_html__( 'Bottom', 'epsilon-framework' ),
							'left'   => esc_html__( 'Left', 'epsilon-framework' ),
							'right'  => esc_html__( 'Right', 'epsilon-framework' ),
						),
						'default'     => isset( $values['default'] ) ? $values['default'] : 'none',
					);

					if ( is_array( $values['condition'] ) ) {
						$temp['condition'] = $values['condition'];
					}

					$temp['groupType'] = $this->set_group_type( $temp['choices'] );

					$arr[ $key . '_row_title_align' ] = $temp;
					break;
				case 'template-selector':
					$temp = array(
						'id'      => $key . '_template_selector',
						'type'    => 'epsilon-template-select',
						'label'   => esc_html__( 'Template selector', 'epsilon-framework' ),
						'group'   => 'layout',
						'choices' => $values['choices'],
						'default' => isset( $values['default'] ) ? esc_attr( $values['default'] ) : 'normal',
					);

					$arr[ $key . '_template_selector' ] = $temp;
					break;

				default:
					break;
			}// End switch().
		}// End foreach().

		return $arr;
	}
}
