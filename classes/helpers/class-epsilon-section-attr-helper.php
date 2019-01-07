<?php
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Class Epsilon_Section_Attr_Helper
 */
class Epsilon_Section_Attr_Helper {
	/**
	 * Options array
	 *
	 *
	 * @var array
	 */
	public $options = array();
	/**
	 * @var null
	 */
	public $section_manager = null;


	/**
	 * Epsilon_Section_Attr_Helper constructor.
	 *
	 * @param array  $fields
	 * @param string $key
	 * @param null   $section_manager
	 */
	public function __construct( $fields = array(), $key = '', $section_manager = null ) {
		$this->key             = $key;
		$this->section_manager = $section_manager->sections;
		$this->options         = $fields;
	}

	/**
	 * Generate attributes
	 *
	 * @param array $arr
	 */
	public function generate_attributes( $arr = array() ) {
		foreach ( $arr as $k => $v ) {
			$method = $k . '_attribute_generator';

			if ( method_exists( $this, $method ) ) {
				is_array( $v ) ? $this->$method( $v ) : $this->$method();
			}
		}
	}

	/**
	 * I know that we can't have more than one IDS on a html tag
	 *
	 * @param array $element
	 *
	 * @return mixed
	 */
	public function id_attribute_generator( $element = array() ) {
		if ( empty( $element ) ) {
			return false;
		}

		echo $this->generate_attribute( 'id', $element );
	}

	/**
	 * @param array $element
	 */
	public function class_attribute_generator( $element = array() ) {
		$classes = array_merge( $element, $this->generate_section_class() );
		echo $this->generate_attribute( 'class', $classes );
	}

	/**
	 * Style attribute generators
	 */
	public function style_attribute_generator( $element = array() ) {
		echo $this->generate_style_attribute( 'style', $element );
	}

	/**
	 * Generates attributes based on a wrapper and its content
	 *
	 * @param string $wrap
	 * @param array  $content
	 *
	 * @return string
	 */
	private function generate_attribute( $wrap = '', $content = array() ) {
		$css = $wrap . '="';
		$css .= esc_attr( implode( ' ', $content ) );
		$css .= '" ';

		return $css;
	}

	/**
	 * Generates style attributes
	 *
	 * @param string $wrap
	 * @param array  $content
	 *
	 * @return string
	 */
	private function generate_style_attribute( $wrap = 'style', $content = array() ) {
		if ( in_array( 'background-image', $content ) && empty( $this->options[ $this->key . '_background_image' ] ) ) {
			return '';
		}

		$css = $wrap . '="';
		foreach ( $content as $key ) {
			$option = $this->key . '_' . str_replace( '-', '_', $key );

			if ( 'background-position' === $key ) {
				$this->options[ $option ] = str_replace( array( 'top', 'bottom' ), array(
					'top ',
					'bottom '
				), $this->options[ $option ] );
			}

			if ( empty( $this->options[ $option ] ) ) {
				continue;
			}

			$key = 'background-color-opacity' === $key ? 'opacity' : $key;

			$key = 'background-image-color' === $key ? 'background-color' : $key;

			$css .= 'background-image' === $key ? $key . ':url(' . esc_url( $this->options[ $option ] ) . ');' : $key . ':' . esc_attr( $this->options[ $option ] ) . ';';
		}
		$css .= '" ';

		return $css;
	}

	/**
	 * Generate a set of classes to be applied on a section
	 *
	 *
	 * @return array
	 */
	public function generate_section_class() {
		$additional = array();

		if ( ! empty( $this->options[ $this->key . '_section_class' ] ) ) {
			$additional[] = $this->options[ $this->key . '_section_class' ];
		}
		if ( ! empty( $this->options[ $this->key . '_column_vertical_alignment' ] ) ) {
			if ( 'top' !== $this->options[ $this->key . '_column_vertical_alignment' ] ) {
				$additional[] = 'ewf-valign--' . $this->options[ $this->key . '_column_vertical_alignment' ];
			}
		}
		if ( ! empty( $this->options[ $this->key . '_column_alignment' ] ) ) {
			$additional[] = 'ewf-text-align--' . $this->options[ $this->key . '_column_alignment' ];
		}
		if ( ! empty( $this->options[ $this->key . '_background_parallax' ] ) && 'false' !== $this->options[ $this->key . '_background_parallax' ] ) {
			$additional[] = 'ewf-section--parallax';
		}
		if ( ! empty( $this->options[ $this->key . '_row_title_align' ] ) ) {
			$additional[] = 'ewf-section--title-' . $this->options[ $this->key . '_row_title_align' ];
		}

		return $additional;
	}

	/**
	 * @param string $wrap
	 * @param array  $additional
	 * @param array  $children
	 */
	public function generate_html_tag( $wrap = 'div', $additional = array(), $children = array() ) {
		$css = "<{$wrap} {$this->generate_attribute('class', $additional['class'])} {$this->generate_style_attribute('style', $additional['style'])}>";
		foreach ( $children as $tag => $props ) {
			$css .= "<{$tag} {$this->generate_attribute('class', $props['class'])}";
			if ( ! empty( $props['data-source'] ) ) {
				$css .= "{$this->generate_attribute('data-source', $props['data-source'])}";
			}
			$css .= '>';
			$css .= "</{$tag}>";
		}

		$css .= "</{$wrap}>";

		echo $css;
	}

	/**
	 * @return string
	 */
	public function generate_color_overlay() {
		$arr = array(
			'class' => array( 'ewf-section__overlay-color' ),
			'style' => array(
				'background-image-color',
			),
		);

		if ( empty( $this->options[ $this->key . '_background_image_color' ] ) ) {
			return '';
		}

		if ( 'bgcolor' == $this->options[ $this->key . '_background_type'] ) {
			return '';
		}

		$this->generate_html_tag( 'div', $arr );
	}
}
