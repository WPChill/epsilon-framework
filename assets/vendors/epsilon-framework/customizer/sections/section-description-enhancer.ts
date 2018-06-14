declare var wp: any;
import * as $ from 'jquery';

export class EpsilonSectionDescriptionEnhancer {
    /**
     * CSS string to be applied to the icon
     *
     * @type {{position: string; right: string; top: string; border: string; background: string}}
     */
    public css: {} = {
        position: 'absolute',
        right: '20px',
        top: '25px',
        border: 'none',
        background: 'none',
    };

    /**
     * HTML string for the help toggler
     * @type {string}
     */
    public iconHtml: string = '<button type="button" class="customize-help-toggle epsilon-info-button dashicons dashicons-editor-help" aria-expanded="true"><span class="screen-reader-text">Help</span></button>';

    /**
     * Array that holds the jquery objects
     * @type {any[]}
     */
    public objects: Array<any> = [];

    /**
     * Script constructor
     */
    public constructor() {
        wp.customize.bind('ready', () => {
            this.collectElements();
            this.handleCloseEvent();
        });

    }

    /**
     * Handle open event
     */
    public handleOpenEvent(icon: JQuery) {
        icon.on('click', (e: JQueryEventConstructor) => {
            icon.parent().siblings('.customize-section-description').show(200, () => {
                icon.remove();
            })
        })
    }

    /**
     * Handles close event
     */
    public handleCloseEvent() {
        this.objects.map((element) => {
            element.on('click', '.epsilon-button-link-close-section', (e: JQueryEventConstructor) => {
                element.hide(200, () => {
                    this.addHelpButton(element)
                });
            });
        });
    }

    /**
     * Add help button
     * @param element
     */
    public addHelpButton(element) {
        let iconParent = element.siblings('div').append(this.iconHtml);
        let icon = iconParent.find('.epsilon-info-button');
        icon.css(this.css);
        this.handleOpenEvent(icon);
    }

    /**
     * Collects elements and pushes them to the objects array
     */
    public collectElements() {
        jQuery('.epsilon-button-link-close-section').map((index, element) => {
            this.objects.push(jQuery(element).parent())
        })
    }
}
