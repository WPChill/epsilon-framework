/**
 * WP Customizer Upsell Control Constructor
 */
wp.customize.controlConstructor[ 'epsilon-upsell' ] = wp.customize.Control.extend( {
  ready: function() {
    var control = this;
    control.container.on( 'click', '.epsilon-upsell-label', function( e ) {
      e.preventDefault();
      control.container.find( '.epsilon-upsell-container' ).slideToggle( 200 );
    } );
  }
} );