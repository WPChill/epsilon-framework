declare var wp: any;

export default class SectionRepeaterEditor {
  /**
   * Props
   */
  public props: any;

  /**
   * Main constructor
   * @param obj
   */
  constructor( obj ) {
    this.props = obj;

    this.init();
  }

  /**
   * Initiate the editor
   */
  public init() {
    let id = this.props.container.find( `[data-field="${this.props.id}"]` ).attr( 'id' );
    wp.editor.initialize( id, {
      tinymce: {
        wpautop: true,
        browser_spellcheck: true,
        mediaButtons: false,
        wp_autoresize_on: true,
        toolbar1: 'link numlist bullist forecolor backcolor bold italic underline',
        setup: function( editor: any ) {
          editor.on( 'change', function( e: Event ) {
            editor.save();
            jQuery( editor.getElement() ).trigger( 'change' );
          } );
        },
      },
      quicktags: true
    } );
  }
}
