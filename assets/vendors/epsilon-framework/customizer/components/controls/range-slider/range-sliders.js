/**
 * Range Slider Initiator
 *
 * @type {{init: EpsilonFramework.rangeSliders.init}}
 */
EpsilonFramework.rangeSliders = {
  /**
   * Init wrapper
   *
   * @param selector
   */
  init: function( selector ) {
    var context = jQuery( selector ).hasClass( 'slider-container' ) ? jQuery( selector ) : jQuery( selector ).find( '.slider-container' ),
        slider = context.find( '.ss-slider' ),
        input = context.find( '.rl-slider' ),
        inputId = input.attr( 'id' ),
        id = slider.attr( 'id' );

    if ( ! context.length ) {
      return;
    }

    jQuery( '#' + id ).slider( {
      value: parseFloat( jQuery( '#' + inputId ).attr( 'value' ) ),
      range: 'min',
      min: parseFloat( jQuery( '#' + id ).attr( 'data-attr-min' ) ),
      max: parseFloat( jQuery( '#' + id ).attr( 'data-attr-max' ) ),
      step: parseFloat( jQuery( '#' + id ).attr( 'data-attr-step' ) ),
      /**
       * Removed Change event because server was flooded with requests from
       * javascript, sending changesets on each increment.
       *
       * @param event
       * @param ui
       */
      slide: function( event, ui ) {
        jQuery( '#' + inputId ).attr( 'value', ui.value );
      },
      /**
       * Bind the change event to the "actual" stop
       * @param event
       * @param ui
       */
      stop: function( event, ui ) {
        jQuery( '#' + inputId ).trigger( 'change' );
      }
    } );

    jQuery( input ).on( 'focus', function() {
      jQuery( this ).blur();
    } );

    jQuery( '#' + inputId ).attr( 'value', ( jQuery( '#' + id ).slider( 'value' ) ) );
    jQuery( '#' + inputId ).on( 'change', function() {
      jQuery( '#' + id ).slider( {
        value: jQuery( this ).val()
      } );
    } );
  },
};