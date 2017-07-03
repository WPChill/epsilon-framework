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

if ( 'undefined' !== typeof( wp ) ) {
  if ( 'undefined' !== typeof( wp.customize ) ) {
    wp.customize.bind( 'ready', function() {
      EpsilonFramework.colorSchemes.init();
      EpsilonFramework.typography.init();
      EpsilonFramework.recommendedActions.init();
    } );


    wp.customize.sectionConstructor[ 'epsilon-section-pro' ] = wp.customize.Section.extend( {
      attachEvents: function() {
      },
      isContextuallyActive: function() {
        return true;
      }
    } );
  }
}
