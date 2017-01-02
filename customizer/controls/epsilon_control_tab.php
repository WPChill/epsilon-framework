<?php
if ( ! class_exists( 'Epsilon_Control_Tab' ) ):
    class Epsilon_Control_Tab extends WP_Customize_Control {
        public $type = 'epsilon-tab';
        public $buttons = '';
        public function __construct( WP_Customize_Manager $manager, $id, array $args ) {
            parent::__construct( $manager, $id, $args );
        }
        public function to_json() {
            parent::to_json();
            $first = true;
            $formatted_buttons = array();
            foreach ($this->buttons as $button) {
                $fields = array();
                $active = isset($button['active']) ? $button['active'] : false;
                if ( $active && $first ) {
                    $first = false;
                }elseif ( $active && !$first ) {
                    $active = false;
                }

                foreach ($button['fields'] as $field) {
                    $fields[] = '#customize-control-'.$field;
                }
                $formatted_buttons[] = array(
                        'name'      => $button['name'],
                        'fields'    => implode(',',$fields),
                        'active'    => $active
                    );
            }
            $this->json['buttons']  = $formatted_buttons;
        }

        public function content_template() { ?>
            <div class="epsilon-tabs">
                <# if ( data.buttons ) { #>
                    <div class="tabs">
                        <# for (button in data.buttons) { #>
                            <a href="#" class="epsilon-tab <# if ( data.buttons[button].active ) { #> active <# } #>" data-fields="{{ data.buttons[button].fields }}">{{ data.buttons[button].name }}</a>
                        <# } #>
                    </div>

                <# } #>
            </div>
             <div class="epsilon-after-tab"><div></div></div>
        <?php }
    }
endif;