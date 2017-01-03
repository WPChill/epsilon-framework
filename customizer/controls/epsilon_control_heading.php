<?php
if ( ! class_exists( 'Epsilon_Control_Heading' ) ):
    class Epsilon_Control_Heading extends WP_Customize_Control {
        public $type = 'epsilon-heading';
        public $buttons = '';
        public function __construct( WP_Customize_Manager $manager, $id, array $args ) {
            parent::__construct( $manager, $id, $args );
        }
        public function to_json() {
            parent::to_json();
        }

        public function content_template() { ?>
            <div class="epsilon-heading">
                <h2>{{ data.label }}</h2>
                <p>{{ data.description }}</p>
            </div>
        <?php }
    }
endif;