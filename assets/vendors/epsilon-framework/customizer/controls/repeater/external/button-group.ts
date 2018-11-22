export default class RepeaterButtonGroup {
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
   * Initiator
   */
  public init() {
    this.props.container.find( `[data-field="${this.props.id}"]` ).parent().on( 'click', 'a', ( e: JQuery.Event ) => {
      e.preventDefault();
      let value: any = jQuery( e.target ).attr( 'data-value' );
      jQuery( e.target ).siblings().removeClass( 'active' );
      jQuery( e.target ).addClass( 'active' );
      jQuery( e.target ).parent().find( 'input' ).val( value ).trigger( 'change' );
    } );
  }
}
