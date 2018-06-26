/**
 * Epsilon Quick(ie) Shortcuts Bar Script
 *
 * @type {{}}
 */

/**
 * @todo: customize-panel-back' ).on( 'click keydown', function( event )
 */


const EpsilonQuickie = {

    init: function() {
        this.prependHTML();
        this.moveResponsiveControls();
        this.listenForClick();
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

        jQuery(EpsilonQuickieObj.links).each(function(index, value) {
            if ('' !== value) {
                HTML += `<a href="#" class="epsilon-quickie-navigation" data-customizer-link="${value.link_to}" data-customizer-type="${value.link_type}">
                        <i class="${value.icon}"></i>
                    </a>`;
            }
        });

        HTML += ` </div><!--/.epsilon-quickie-shortcuts--></div>`;

        // prepend the built HTML
        jQuery('.wp-full-overlay-sidebar').prepend(HTML);

    },

    /**
     * Function that listens for clicks on epsilon-quickie-navigation links
     * and redirects to the corresponding section/panel/control
     */
    listenForClick: function() {

        const context = '.epsilon-quickie-navigation';

        jQuery(context).on('click', function(event) {

            // since they're links, prevent default
            event.preventDefault();

            let link_to = jQuery(this).data('customizer-link'),
                link_type = jQuery(this).data('customizer-type');

            if ('' !== link_to && '' !== link_type) {

                /**
                 * navigate to panel
                 * link_type must only take values: section, control or panel
                 */
                wp.customize[link_type](link_to).focus();

                // remove all 'quickie-link-active' CSS classes, if any
                jQuery(context).removeClass('quickie-link-active');

                // add 'quickie-link-active' on currently clicked link
                if (jQuery(` [data-customizer-link='${link_to}']`)) {
                    jQuery(`[data-customizer-link='${link_to}'`).addClass('quickie-link-active');
                }
            }
        });

        jQuery('.customize-section-back, .customize-panel-back').on('click', function(event) {
            // remove all 'quickie-link-active' instances, if any
            jQuery(context).removeClass('quickie-link-active');
        });

        jQuery('.accordion-section').on('click', function() {
            let section_id = jQuery(this).prop('id');

            if (section_id.indexOf('section') >= 0) {
                section_id = section_id.replace('accordion-section-', '');
            } else if (section_id.indexOf('panel') >= 0) {
                section_id = section_id.replace('accordion-panel-', '');
            }

            if (`[data-customizer-link='${section_id}'`) {
                jQuery(`[data-customizer-link='${section_id}'`).addClass('quickie-link-active');
            }

        });
    },

    moveResponsiveControls: function() {
        const context = jQuery('#customize-footer-actions');

        // hide the whole footer actions section
        jQuery(context).hide();

        // hide the "collapse settings" label
        jQuery(context).find('.collapse-sidebar-label').hide();

        // move the responsive controls onto the epsilon-quickie sidebar
        jQuery(context).find('.collapse-sidebar, .devices-wrapper').appendTo('.epsilon-quickie');

    }
};

jQuery(document).ready(function() {
    EpsilonQuickie.init();
});

jQuery(window).load(function() {
    EpsilonQuickie.addBodyClass();
});