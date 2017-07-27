/**
 * Improved Color Picker
 *
 * @type {{init: EpsilonFramework.colorPickers.init}}
 */
EpsilonFramework.colorPickers = {
  init: function( selectors ) {
    var selectors = jQuery( selectors );

    jQuery.each( selectors, function() {
      var settings = {
            changeDelay: 1000,
            theme: 'default',
          },
          clear, instance;

      if ( '' !== jQuery( this ).attr( 'placeholder' ) ) {
        settings.defaultValue = jQuery( this ).attr( 'placeholder' );
      }

      if ( 'rgba' === jQuery( this ).attr( 'data-attr-mode' ) ) {
        settings.format = 'rgb';
        settings.opacity = true;
      }

      jQuery( this ).minicolors( settings );

      clear = jQuery( this ).parents( '.customize-control-epsilon-color-picker' ).find( 'a' );
      if ( ! clear.length ) {
        clear = jQuery( this ).parents( '.repeater-field-epsilon-color-picker' ).find( 'a' );
      }

      clear.on( 'click', function( e ) {
        e.preventDefault();
        instance = jQuery( this ).parents( '.customize-control-epsilon-color-picker' ).find( 'input.epsilon-color-picker' );
        if ( ! instance.length ) {
          instance = jQuery( this ).parents( '.repeater-field-epsilon-color-picker' ).find( 'input.epsilon-color-picker' );
        }

        instance.minicolors( 'value', jQuery( this ).attr( 'data-default' ) );
        instance.trigger( 'change' );
      } );
    } );
  }
};