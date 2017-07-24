/**
 * Icon Picker Control Constructor
 */
wp.customize.controlConstructor[ 'epsilon-icon-picker' ] = wp.customize.Control.extend( {
  ready: function() {
    var control = this;

    EpsilonFramework.iconPickers.init( control, false );

    control.container.on( 'change', 'input.epsilon-icon-picker',
        function() {
          control.setting.set( jQuery( this ).val() );
        }
    );
  }
} );