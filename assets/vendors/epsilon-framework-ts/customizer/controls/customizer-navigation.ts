import * as $ from 'jquery';

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
  constructor( control: { container: JQuery, params: { value: number, id: string } } ) {
    this.context = jQuery( control.container );

    this.init();
  }

  /**
   * Control initiator
   */
  public init() {
    this.context.find( '.epsilon-customizer-navigation' ).on( 'click', function( e: Event ) {
      e.preventDefault();
      if ( 'undefined' !== typeof( wp.customize.section( jQuery( e.target ).attr( 'data-customizer-section' ) ) ) ) {
        if ( jQuery( e.target ).attr( 'data-doubled' ) ) {
          wp.customize.section( jQuery( e.target ).attr( 'data-customizer-section' ) ).headContainer.trigger( 'click' );
        } else {
          wp.customize.section( jQuery( e.target ).attr( 'data-customizer-section' ) ).focus();
        }

      }
    } );
  }
}
