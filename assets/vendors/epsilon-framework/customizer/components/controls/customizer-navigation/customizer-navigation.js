/**
 * Customizer navigation
 * @type {{}}
 */
EpsilonFramework.customizerNavigation = {
  /**
   * Initiate customizer navigation
   *
   * @param selector
   */
  init: function( selector ) {
    selector.find( '.epsilon-customizer-navigation' ).on( 'click', function( e ) {
      e.preventDefault();
      if ( 'undefined' !== typeof( wp.customize.section( jQuery( this ).attr( 'data-customizer-section' ) ) ) ) {
        wp.customize.section( jQuery( this ).attr( 'data-customizer-section' ) ).focus();
      }
    } );
  }
};