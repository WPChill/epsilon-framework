<?php
if ( ! defined( 'WPINC' ) ) {
	die;
}
if ( class_exists( 'WP_Customize_Control' ) ):
	class Epsilon_Control_Upsell extends WP_Customize_Control {

		public $type = 'epsilon-upsell';
		public $button_text = '';
		public $button_url = '#';
		public $second_button_text = '';
		public $second_button_url = '#';
		public $separator = '';
		public $options = array();
		public $requirements = array();
		public $pro_label = '';
		public $json = array();

		public function __construct( WP_Customize_Manager $manager, $id, array $args ) {
			$this->pro_label   = __( 'Pro', 'newsmag-pro' );

			$manager->register_control_type( 'Epsilon_Control_Upsell' );
			parent::__construct( $manager, $id, $args );
		}

		public function to_json() {
			parent::to_json();
			$this->json['button_text']        = $this->button_text;
			$this->json['button_url']         = $this->button_url;
			$this->json['second_button_text'] = $this->second_button_text;
			$this->json['second_button_url']  = $this->second_button_url;
			$this->json['separator']          = $this->separator;

			$arr = array();
			$i = 0;
			foreach ( $this->options as $option ) {
			    $arr[$i]['option'] = $option;
			    $i++;
			}

			$i = 0;
			foreach ( $this->requirements as $help ) {
				$arr[$i]['help'] = $help;
				$i++;
			}

			$this->json['options']   = $arr;
			$this->json['pro_label'] = $this->pro_label;
		}

		public function content_template() { ?>
            <div class="epsilon-upsell">
                <# if ( data.options ) { #>
                <ul class="epsilon-upsell-options">
                    <# _.each(data.options, function( option, index) { #>
                        <li><span class="wp-ui-notification">{{ data.pro_label }}</span>{{ option.option }}
                            <i class="dashicons dashicons-editor-help" style="vertical-align: text-bottom; position: relative;">
                                <span class="mte-tooltip">{{ option.help }}</span>
                            </i>
                        </li>
                    <# }) #>
                </ul>
                <# } #>

                <div class="epsilon-button-group">
                <# if ( data.button_text && data.button_url ) { #>
                    <a href="{{ data.button_url }}" class="button" target="_blank">{{
                        data.button_text }}</a>
                <# } #>

                <# if ( data.separator ) { #>
                    <span class="button-separator">{{ data.separator }}</span>
                <# } #>

                <# if ( data.second_button_text && data.second_button_url ) { #>
                <a href="{{ data.second_button_url }}" class="button button-primary" target="_blank"> {{data.second_button_text }}</a>
                <# } #>
                </div>
            </div>
		<?php }
	}
endif;