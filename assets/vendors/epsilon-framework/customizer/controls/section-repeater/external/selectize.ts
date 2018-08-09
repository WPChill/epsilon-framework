declare var wp: any;

export default class SectionRepeaterSelectize {
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
    this.props.container.find( `[data-field="${this.props.id}"]` ).selectize( {
      plugins: [ 'remove_button' ],
    } );
  }
}
