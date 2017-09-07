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
        if ( jQuery( this ).attr( 'data-doubled' ) ) {
          wp.customize.section( jQuery( this ).attr( 'data-customizer-section' ) ).headContainer.trigger( 'click' );
        } else {
          wp.customize.section( jQuery( this ).attr( 'data-customizer-section' ) ).focus();
        }

      }
    } );
  }
};