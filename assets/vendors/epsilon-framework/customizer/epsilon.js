/**
 * Epsilon Framework Initiator
 */

/**
 * Load the range sliders for the widget updates
 */
jQuery( document ).on( 'widget-updated widget-added', function( a, selector ) {
  if ( jQuery().slider ) {
    EpsilonFramework.rangeSliders.init( selector );
  }
} );

wp.customize.bind( 'ready', function() {
  EpsilonFramework.layouts.init( '.epsilon-layouts-container' );
  EpsilonFramework.rangeSliders.init( '.customize-control-epsilon-slider' );
  EpsilonFramework.colorPickers.init( '.epsilon-color-picker' );
  EpsilonFramework.textEditor.init( '.customize-control-epsilon-text-editor' );

  EpsilonFramework.typography.init();
  EpsilonFramework.colorSchemes.init();
  EpsilonFramework.recommendedActions.init();

  /**
   * @todo add it somewhere in JS
   */
  jQuery( '#customize-theme-controls' ).on( 'click', '.epsilon-customizer-navigation', function( e ) {
    e.preventDefault();
    if ( 'undefined' !== typeof(wp.customize.section( jQuery( this ).attr( 'data-customizer-section' ) )) ) {
      wp.customize.section( jQuery( this ).attr( 'data-customizer-section' ) ).focus();
    }
  } );
} );
