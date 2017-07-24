/**
 * WP Customizer Upsell Control Constructor
 */
wp.customize.controlConstructor[ 'epsilon-upsell' ] = wp.customize.Control.extend( {
  ready: function() {
    var control = this;
    control.container.on( 'click', '.epsilon-upsell-label', function( e ) {
      e.preventDefault();
      jQuery( this ).toggleClass( 'opened' ).find('i').toggleClass('dashicons-arrow-down-alt2 dashicons-arrow-up-alt2');
      control.container.find( '.epsilon-upsell-container' ).slideToggle( 200 );
    } );
  }
} );