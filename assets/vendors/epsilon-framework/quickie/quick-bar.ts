declare var EpsilonQuickieObj: any;
import * as $ from 'jquery';

/**
 * Epsilon Quick bar
 */
export class EpsilonQuickieBar {

    /**
     * Script initiator
     */
    public init() {
        this.prependEpsilonHTML();
        this.moveResponsiveControls();
        this.listenForClick();
    }

    /**
     * Adds body classes
     */
    public addBodyClass() {
        jQuery('body').addClass('epsilon-quickie-is-visible');
    }

    /**
     * Function that handles the EpsilonHTML rendering for the Quickie Shortcuts Bar
     */
    public prependEpsilonHTML() {

        if (null !== EpsilonQuickieObj) {
            let EpsilonHTML: string = `<div class="epsilon-quickie">

        <div class="epsilon-quickie-logo">
            <img src="${EpsilonQuickieObj.logo.url}" alt="${EpsilonQuickieObj.logo.alt}">
        </div><!--/.epsilon-quickie-logo-->

        <div class="epsilon-quickie-shortcuts">`;

            jQuery(EpsilonQuickieObj.links).each(function (index: number, value: any) {
                if ('' !== value) {
                    EpsilonHTML += `<a href="#" class="epsilon-quickie-navigation" data-customizer-link="${value.link_to}" data-customizer-type="${value.link_type}">
                        <i class="${value.icon}"></i>
                    </a>`;
                }
            });

            EpsilonHTML += ` </div><!--/.epsilon-quickie-shortcuts--></div>`;

            // prepend the built EpsilonHTML
            jQuery('.wp-full-overlay-sidebar').prepend(EpsilonHTML);

        }
    }

    /**
     * Function that listens for clicks on epsilon-quickie-navigation links
     * and redirects to the corresponding section/panel/control
     */
    public listenForClick() {
        const context = '.epsilon-quickie-navigation';

        jQuery(context).on('click', function (event: any) {

            // since they're links, prevent default
            event.preventDefault();

            let link_to: string = jQuery(this).data('customizer-link'),
                link_type: string = jQuery(this).data('customizer-type');

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
                    jQuery(`[data-customizer-link='${link_to}']`).addClass('quickie-link-active');
                }
            }
        });
    }

    public moveResponsiveControls() {
        const context: object = jQuery('#customize-footer-actions');

        // hide the whole footer actions section
        jQuery(context).hide();

        // hide the "collapse settings" label
        jQuery(context).find('.collapse-sidebar-label').hide();

        // move the responsive controls onto the epsilon-quickie sidebar
        jQuery(context).find('.collapse-sidebar, .devices-wrapper').appendTo('.epsilon-quickie');
    }
}
