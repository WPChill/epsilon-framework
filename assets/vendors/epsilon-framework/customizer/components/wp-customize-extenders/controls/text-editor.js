/**
 * Epsilon Text Editor Control Constructor
 */
wp.customize.controlConstructor[ 'epsilon-text-editor' ] = wp.customize.Control.extend( {
  ready: function() {
    var control = this;

    control.container.on( 'change keyup', 'textarea', function() {
      control.setting.set( jQuery( this ).val() );
    } );
  }
} );