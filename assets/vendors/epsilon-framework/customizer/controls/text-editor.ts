declare var wp: any;

/**
 * Espilon Text Editor Module
 */
export class EpsilonTextEditor {
    /**
     * Object Context
     */
    context: JQuery | any;
    /**
     * Editor ID ( link between editor and textarea )
     */
    editorId: string;

    /**
     * Class Constructor
     * @param {{container: JQuery; params: {value: number; id: string}}} control
     */
    public constructor(control: { container: JQuery, setting: void, params: { value: number, id: string } }, repeater: boolean = false, deconstruct: boolean = false) {
        this.context = jQuery(control.container);
        this.editorId = control.params.id + '-editor';

        if (repeater) {
            this.editorId = control.params.id;
        }

        if (deconstruct) {
            wp.editor.remove(this.editorId);
        }
        this.init();
    }

    /**
     * Text editor initiator
     */
    public init() {
        wp.editor.initialize(this.editorId, {
            tinymce: {
                wpautop: true,
                browser_spellcheck: true,
                wp_autoresize_on: true,
                toolbar1: 'link numlist bullist forecolor backcolor bold italic underline',
                setup: function (editor: any) {
                    editor.on('change', function (e: Event) {
                        editor.save();
                        jQuery(editor.getElement()).trigger('change');
                    });
                },
            },
            quicktags: true
        });
    }
}
