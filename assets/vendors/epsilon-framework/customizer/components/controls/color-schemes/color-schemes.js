/**
 * Color scheme generator
 */
EpsilonFramework.colorSchemes = {
  /**
   * Init wrapper
   */
  init: function() {
    /**
     * Set variables
     */
    var context = jQuery( '.epsilon-color-scheme' ), options, input, json, api,
        colorSettings = [], css = {};

    if ( ! context.length ) {
      return;
    }

    options = context.find( '.epsilon-color-scheme-option' );
    input = context.parent().find( '[data-customize-setting-link]' ).first();
    json = jQuery.parseJSON( options.first().find( 'input' ).val() );
    api = wp.customize;
    colorSettings = [];
    css = {
      'action': 'epsilon_generate_color_scheme_css',
      'class': 'Epsilon_Color_Scheme',
      'id': '',
      'data': {}
    };

    jQuery.each( json, function( index, value ) {
      colorSettings.push( index );
    } );

    _.each( colorSettings, function( setting ) {
      css.data[ setting ] = api( setting )();

      if ( 'undefined' !== typeof(api.control( setting )) ) {
        api.control( setting ).container.on( 'change', 'input.epsilon-color-picker', _.debounce( function() {
          context.siblings( '.epsilon-color-scheme-selected' ).
              find( '.epsilon-color-scheme-palette' ).
              find( '*[data-field-id="' + setting + '"]' ).
              css( 'background', jQuery( this ).attr( 'value' ) );

          css.data[ setting ] = api( setting )();

          api.previewer.send( 'update-inline-color-schemes-css', css );
        }, 800 ) );
      }

    } );

    /**
     * On clicking a color scheme, update the color pickers
     */
    jQuery( '.epsilon-color-scheme-option' ).on( 'click', function() {
      var val = jQuery( this ).attr( 'data-color-id' ),
          json = jQuery.parseJSON( jQuery( this ).find( 'input' ).val() );

      /**
       * Find the customizer options
       */
      jQuery.each( json, function( index, value ) {
        /**
         * Set values
         */
        jQuery( '#customize-control-' + index + ' .epsilon-color-picker' ).minicolors( 'value', value );
        api( index ).set( value );

        context.siblings( '.epsilon-color-scheme-selected' ).find( '.epsilon-color-scheme-palette' ).find( '*[data-field-id="' + index + '"]' ).css( 'background', value );
      } );

      /**
       * Remove the selected class from siblings
       */
      jQuery( this ).siblings( '.epsilon-color-scheme-option' ).removeClass( 'selected' );
      /**
       * Make active the current selection
       */
      jQuery( this ).addClass( 'selected' );

      /**
       * Trigger change
       */
      input.val( val ).trigger( 'change' );
    } );

    /**
     * Advanced toggler
     */
    jQuery( '.epsilon-control-dropdown' ).on( 'click', function() {
      jQuery( this ).toggleClass( 'active' );
      jQuery( this ).find( 'span' ).toggleClass( 'dashicons-arrow-down dashicons-arrow-up' );
      context.slideToggle();
    } );
  }
};
