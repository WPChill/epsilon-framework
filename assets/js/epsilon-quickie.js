/**
 * Epsilon Quick(ie) Shortcuts Bar Script
 *
 * @type {{}}
 */


let EpsilonQuickie = {

    init: function() {
        var self = this;
        this.prependHTML();

        this.moveResponsiveControls();
        this.listenForClick();

        jQuery(window).load(function() {
            self.addBodyClass();
        });

    },

    /**
     * Add a custom body class to the Customizer's body class
     */
    addBodyClass: function() {
        jQuery('body').addClass('epsilon-quickie-is-visible');
    },

    /**
     * Function that handles the HTML rendering for the Quickie Shortcuts Bar
     */
    prependHTML: function() {

        let HTML = `<div class="epsilon-quickie">

        <div class="epsilon-quickie-logo">
            <img src="${EpsilonQuickieObj.logo.url}" alt="${EpsilonQuickieObj.logo.alt}">
        </div><!--/.epsilon-quickie-logo-->

        <div class="epsilon-quickie-shortcuts">`;

        $(EpsilonQuickieObj.links).each(function(index, value) {
            if ('' !== value) {
                HTML += `<a href="#" class="epsilon-quickie-navigation" data-customizer-link="${value.link_to}" data-customizer-type="${value.link_type}">
                        <i class="${value.icon}"></i>
                    </a>`;
            }
        });

        HTML += ` </div><!--/.epsilon-quickie-shortcuts--></div>`;

        // prepend the built HTML
        $('.wp-full-overlay-sidebar').prepend(HTML);

    },

    /**
     * Function that listens for clicks on epsilon-quickie-navigation links
     * and redirects to the corresponding section/panel/control
     */
    listenForClick: function() {

        let context = '.epsilon-quickie-navigation';

        jQuery(context).on('click', function(e) {

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

    moveResponsiveControls: function() {
        let context = $('#customize-footer-actions');

        $(context).hide();
        $(context).find('.collapse-sidebar-label').hide();

        $(context).find('.collapse-sidebar').appendTo('.epsilon-quickie');
        $(context).find('.devices-wrapper').appendTo('.epsilon-quickie');
    }
};

jQuery(document).ready(function() {
    EpsilonQuickie.init();
});