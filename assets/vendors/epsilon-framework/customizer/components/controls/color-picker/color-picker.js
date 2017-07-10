/**
 * Improved Color Picker
 *
 * @type {{init: EpsilonFramework.colorPickers.init}}
 */
EpsilonFramework.colorPickers = {
  init: function( selectors ) {
    var selectors = jQuery( selectors ),
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