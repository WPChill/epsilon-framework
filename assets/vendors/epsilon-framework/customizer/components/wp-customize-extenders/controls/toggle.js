/**
 * WP Customizer Control Constructor
 */
wp.customize.controlConstructor[ 'epsilon-toggle' ] = wp.customize.Control.extend( {
  ready: function() {
    var control = this;

    control.container.on( 'change', 'input.onoffswitch-checkbox',
        function() {
          control.setting.set( jQuery( this ).prop( 'checked' ) );
        }
    );
  }
} );
