/**
 * Color Schemes Control Constructor
 */
wp.customize.controlConstructor[ 'epsilon-color-scheme' ] = wp.customize.Control.extend( {
  ready: function() {
    var control = this, section, instance;

    jQuery( this.container ).find( '.epsilon-color-scheme-input' ).on( 'change', function() {
      control.setting.set( jQuery( this ).val() );
    } );
  }
} );