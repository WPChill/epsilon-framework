/**
 * Epsilon Quick(ie) Shortcuts Bar Script
 *
 * @type {{}}
 */


let EpsilonQuickie = {

    init: function () {
        this.addBodyClass();
        this.prependHTML();
        this.listenForClick();
    },

    addBodyClass: function () {
        jQuery('body').addClass('epsilon-quickie-is-visible');
    },

    prependHTML: function () {
        $('.wp-full-overlay-sidebar').prepend(`
        <div class="epsilon-quickie">

            <div class="epsilon-quickie-logo">
            </div><!--/.epsilon-quickie-logo-->

            <div class="epsilon-quickie-shortcuts">
                <a href="#" class="epsilon-quickie-navigation" data-customizer-link="colors" data-customizer-type="section">
                    <i class="dashicons dashicons-admin-appearance"></i>
                </a>
                <a href="#" class="epsilon-quickie-navigation" data-customizer-link="portum_typography_section" data-customizer-type="section">
                    <i class="dashicons dashicons-editor-textcolor"></i>
                </a>

                <a href="#" class="epsilon-quickie-navigation" data-customizer-link="" data-customizer-type="section">
                    <i class="dashicons dashicons-editor-table"></i>
                </a>
                <a href="#" class="epsilon-quickie-navigation" data-customizer-link="portum_repeatable_section" data-customizer-type="section">
                    <i class="dashicons dashicons-menu"></i>
                </a>
                <a href="#" class="epsilon-quickie-navigation" data-customizer-link="portum_panel_general" data-customizer-type="panel">
                    <i class="dashicons dashicons-admin-settings"></i>
                </a>
                <a href="#" class="epsilon-quickie-navigation" data-customizer-link="custom_css" data-customizer-type="section">
                    <i class="dashicons dashicons-carrot"></i>
                </a>
            </div><!--/.epsilon-quickie-shortcuts-->

        </div>`
        );
    },

    listenForClick: function () {

        jQuery('.epsilon-quickie-navigation').on('click', function (e) {

            // since they're links, prevent default
            e.preventDefault();

            let link_to = $(this).data('customizer-link'),
                link_type = $(this).data('customizer-type');

            /**
             * Switch the type of method invoked based on the value of link_type
             */
            switch (link_type) {

                case 'section':
                    wp.customize.section(link_to).focus();
                    break;

                case 'panel':
                    wp.customize.panel(link_to).focus();
                    break;

                case 'control':
                    wp.customize.control(link_to).focus();
                    break;
            }

        });
    },

};

jQuery(document).ready(function () {
    EpsilonQuickie.init();
});
