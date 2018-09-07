declare var wp: any;

export default class RepeaterEditor {
  /**
   * Props
   */
  public props: any;
  /**
   * Editor id
   */
  public id: string;

  /**
   * Main constructor
   * @param obj
   */
  constructor( obj ) {
    this.props = obj;

    this.props.container.on( 'epsilon-changed-position', () => this._destroyAndInit() );

    this.init();
  }

  /**
   * Initiate the editor
   */
  public init() {
    this.id = this.props.container.find( `[data-field="${this.props.id}"]` ).attr( 'id' );

    wp.editor.initialize( this.id, {
      tinymce: {
        wpautop: true,
        browser_spellcheck: true,
        mediaButtons: false,
        wp_autoresize_on: true,
        toolbar1: 'link numlist bullist forecolor backcolor bold italic underline',
        setup: function( editor: any ) {
          editor.on( 'change', ( e: Event ) => {
            editor.save();
            jQuery( editor.getElement() ).trigger( 'change' );
          } );
        },
      },
      quicktags: true
    } );
  }

  /**
   * Destroy
   */
  public destroy() {
    wp.editor.remove( this.id );
  }

  /**
   * Destroy and init
   * @private
   */
  private _destroyAndInit() {
    this.destroy();
    this.init();
  }
}
