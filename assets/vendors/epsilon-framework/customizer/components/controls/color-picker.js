EpsilonFramework.colorPickers = {
  init: function() {
    var selectors = jQuery( '.epsilon-color-picker' ),
        settings;
    jQuery.each( selectors, function() {
      settings = {
        changeDelay: 1000,
        theme: 'default',
      };

      if ( '' !== jQuery( this ).attr( 'placeholder' ) ) {
        settings.defaultValue = jQuery( this ).attr( 'placeholder' );
      }

      if ( 'rgba' === jQuery( this ).attr( 'data-attr-mode' ) ) {
        settings.format = 'rgb';
        settings.opacity = true;
      }

      jQuery( this ).minicolors( settings );
    } );
  }
};
/**
 * WP Customizer Control Constructor
 */
wp.customize.controlConstructor[ 'epsilon-color-picker' ] = wp.customize.Control.extend( {
  ready: function() {
    var control = this;

    control.container.on( 'change', 'input.epsilon-color-picker',
        function() {
          control.setting.set( jQuery( this ).val() );
        }
    );
  }
} );