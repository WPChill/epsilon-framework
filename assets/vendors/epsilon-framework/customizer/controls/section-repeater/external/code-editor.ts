declare var wp: any;

export default class SectionRepeaterCodeEditor {
  /**
   * Props
   */
  public props: any;
  /**
   * Editor id
   */
  public id: string;
  public mode: string;
  public textarea: any;

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
	this.textarea = this.props.container.find( `[data-field="${this.props.id}"]` );
	this.id = this.textarea.attr( 'id' );
	this.mode = this.textarea.attr('data-mode');

	let editorSettings = wp.codeEditor.defaultSettings ? _.clone( wp.codeEditor.defaultSettings ) : {};

  	editorSettings.codemirror = _.extend(
		{},
		editorSettings.codemirror,
		{
			mode: this.mode,
			lineNumbers: true,
			lineWrapping: true,
			indentUnit: 2,
		}
	);

	var editor = wp.codeEditor.initialize( this.id, editorSettings );

	editor.codemirror.on("change", () => {
		this.textarea.val( editor.codemirror.getValue() ).trigger( 'change' );
	});

	editor.codemirror.refresh();
  }

  /**
   * Destroy
   */
  public destroy() {
    //wp.editor.remove( this.id );
  }

  /**
   * Destroy and init
   * @private
   */
  private _destroyAndInit() {
    //this.destroy();
    this.init();
  }
}
