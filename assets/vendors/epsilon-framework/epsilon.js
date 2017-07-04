/**
 *
 * File epsilon.js.
 *
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
  EpsilonFramework.layouts.init( jQuery( '.epsilon-layouts-container' ) );
  EpsilonFramework.typography.init();
  EpsilonFramework.colorSchemes.init();
  EpsilonFramework.recommendedActions.init();
} );
