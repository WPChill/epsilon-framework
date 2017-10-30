declare var wp: any;

/**
 * Espilon Customizer Navigation Module
 */
export class EpsilonCustomizerNavigation {
  /**
   * Context
   */
  context: JQuery | any;
  /**
   * Actual control
   */
  control: any;

  /**
   * Class Constructor
   * @param {{container: JQuery; params: {value: number; id: string}}} control
   */
  public constructor( control: { container: JQuery, params: { value: number, id: string } } ) {
    this.context = jQuery( control.container );
    this.init();
  }

  /**
   * Control initiator
   */
  public init() {
    let navigation = this.context.find( '.epsilon-customizer-navigation' );
    if ( navigation.length ) {
      navigation.on( 'click', navigation.find( 'a' ), function( this: any, e: Event ) {
        e.preventDefault();
        if ( 'undefined' !== typeof( wp.customize.section( jQuery( this ).attr( 'data-customizer-section' ) ) ) ) {
          if ( jQuery( e.target ).attr( 'data-doubled' ) ) {
            wp.customize.section( jQuery( this ).attr( 'data-customizer-section' ) ).headContainer.trigger( 'click' );
          } else {
            wp.customize.section( jQuery( this ).attr( 'data-customizer-section' ) ).focus();
          }
        }
      } );
    }
  }
}
