/**
 * Improved Color Picker
 *
 * @type {{init: EpsilonFramework.colorPickers.init}}
 */
EpsilonFramework.colorPickers = {
  /**
   * Initiate a color picker
   * @param selector
   */
  init: function( selector ) {
    var selector = jQuery( selector ).find( '.epsilon-color-picker' ),
        self = this,
        settings = {
          changeDelay: 500,
          theme: 'default',
          change: self.changePallete
        },
        clear,
        instance;

    if ( 'function' !== typeof jQuery.fn.minicolors ) {
      return;
    }

    if ( '' !== selector.attr( 'placeholder' ) ) {
      settings.defaultValue = selector.attr( 'placeholder' );
    }

    if ( 'rgba' === selector.attr( 'data-attr-mode' ) ) {
      settings.format = 'rgb';
      settings.opacity = true;
    }

    selector.minicolors( settings );

    clear = selector.parents( '.customize-control-epsilon-color-picker' ).find( 'a' );
    if ( ! clear.length ) {
      clear = selector.parents( '.repeater-field-epsilon-color-picker' ).find( 'a' );
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

  },
  /**
   * Real time changes to the "pallete"
   *
   * @param value
   * @param opacity
   */
  changePallete: function( value, opacity ) {
    jQuery( '.epsilon-color-scheme-selected' ).find( '*[data-field-id="' + jQuery( this ).attr( 'data-customize-setting-link' ) + '"]' ).css( 'background-color', value );
  }
};