export default class SectionRepeaterButtonGroup {
  /**
   * Props
   */
  public props: any;

  public input: any;

  /**
   * Main constructor
   * @param obj
   */
  constructor( obj ) {
    this.props = obj;

    this.init();
  }

  /**
   * Initiator
   */
  public init() {
    this.input = this.props.container.find( `[data-field="${this.props.id}"]` );

    this.input.parent().on( 'click', 'a', ( e: JQuery.Event ) => {
      e.preventDefault();
      let value: any = jQuery( e.target ).attr( 'data-value' );

      jQuery( e.target ).siblings().removeClass( 'active' );
      jQuery( e.target ).addClass( 'active' );

      this.input.val( value ).trigger( 'change' );
    } );
  }
}
