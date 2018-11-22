declare var wp: any;

export default class SectionRepeaterNavigation {
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
   * Initator
   */
  public init() {
    this.props.container.find( `[data-field="${this.props.id}"]` ).on( 'click', ( e: JQuery.Event ) => {
      e.preventDefault();
      if ( 'undefined' !== typeof(wp.customize.section( jQuery( e.target ).attr( 'data-customizer-section' ) )) ) {

        jQuery( e.target ).attr( 'data-doubled' )
            ? wp.customize.section( jQuery( e.target ).attr( 'data-customizer-section' ) ).headContainer.trigger( 'click' )
            : wp.customize.section( jQuery( e.target ).attr( 'data-customizer-section' ) ).focus()
        ;
      }
    } );
  }
}
