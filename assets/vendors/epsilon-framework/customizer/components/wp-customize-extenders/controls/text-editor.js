/**
 * Epsilon Text Editor Control Constructor
 */
wp.customize.controlConstructor[ 'epsilon-text-editor' ] = wp.customize.Control.extend( {
  ready: function() {
    var control = this;

    EpsilonFramework.textEditor.init( this.container );

    control.container.on( 'change keyup', 'textarea', function() {
      control.setting.set( jQuery( this ).val() );
    } );
  }
} );