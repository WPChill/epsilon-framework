/**
 * WP Customizer Typography Control Constructor
 */
wp.customize.controlConstructor[ 'epsilon-typography' ] = wp.customize.Control.extend( {
  ready: function() {
    var control = this;
    /**
     * Save the layout
     */
    jQuery( this.container ).find( '.customize-control-content > .epsilon-typography-input' ).on( 'change', function() {
      control.setting.set( jQuery( this ).val() );
    } );
  }
} );
