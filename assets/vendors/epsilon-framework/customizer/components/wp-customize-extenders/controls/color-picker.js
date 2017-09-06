/**
 * Epsilon Color Picker Control Constructor
 */
wp.customize.controlConstructor[ 'epsilon-color-picker' ] = wp.customize.Control.extend( {
  ready: function() {
    var control = this;

    EpsilonFramework.colorPickers.init( this.container );

    control.container.on( 'change', 'input.epsilon-color-picker',
        function() {
          control.setting.set( jQuery( this ).val() );
        }
    );
  }
} );