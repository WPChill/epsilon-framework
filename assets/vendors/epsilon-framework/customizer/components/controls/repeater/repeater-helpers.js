/**
 * Helper object, we can keep here functions that render content or help with UI interaction
 */
EpsilonFramework.repeater.helpers = {
  /**
   * Set the value of the customizer option
   *
   * @param instance
   * @param newValue
   * @param refresh
   * @param filtering
   */
  setValue: function( instance, newValue, refresh, filtering ) {
    // We need to filter the values after the first load to remove data requrired for diplay but that we don't want to save in DB
    var filteredValue = newValue,
        filter = [];

    /**
     * Filtering
     */
    if ( filtering ) {
      jQuery.each( instance.params.fields, function( index, value ) {
        if ( 'image' === value.type || 'cropped_image' === value.type || 'upload' === value.type ) {
          filter.push( index );
        }
      } );

      jQuery.each( newValue, function( index, value ) {
        jQuery.each( filter, function( ind, field ) {
          if ( ! _.isUndefined( value[ field ] ) && ! _.isUndefined( value[ field ].id ) ) {
            filteredValue[ index ][ field ] = value[ field ].id;
          }
        } );
      } );
    }

    instance.setting.set( encodeURI( JSON.stringify( filteredValue ) ) );

    if ( refresh ) {
      instance.settingField.trigger( 'change' );
    }
  },

  /**
   * Get the setting value
   *
   * @param instance
   */
  getValue: function( instance ) {
    // The setting is saved in JSON
    return JSON.parse( decodeURI( instance.setting.get() ) );
  },
  /**
   * Update a single field inside a row.
   * Triggered when a field has changed
   *
   * @param e Event Object
   */
  updateField: function( rowIndex, fieldId, element, control ) {
    var row,
        currentSettings;

    if ( ! control.rows[ rowIndex ] ) {
      return;
    }

    if ( ! control.params.fields[ fieldId ] ) {
      return;
    }

    row = control.rows[ rowIndex ];
    currentSettings = EpsilonFramework.repeater.helpers.getValue( control );

    element = jQuery( element );

    if ( _.isUndefined( currentSettings[ row.rowIndex ][ fieldId ] ) ) {
      return;
    }

    if ( 'checkbox' === control.params.fields[ fieldId ].type ) {
      currentSettings[ row.rowIndex ][ fieldId ] = element.is( ':checked' );
    } else {

      // Update the settings
      currentSettings[ row.rowIndex ][ fieldId ] = element.val();
    }
    EpsilonFramework.repeater.helpers.setValue( control, currentSettings, true );
  },
  /**
   * Load Underscores template
   *
   * @since 1.2.0
   * @param instance
   * @returns {Function}
   */
  repeaterTemplate: function( instance ) {
    var compiled,
        options = {
          evaluate: /<#([\s\S]+?)#>/g,
          interpolate: /\{\{\{([\s\S]+?)\}\}\}/g,
          escape: /\{\{([^\}]+?)\}\}(?!\})/g,
          variable: 'data'
        };


    return function( data ) {
      compiled = _.template( jQuery( '.customize-control-epsilon-repeater-content' ).first().html(), null, options );
      return compiled( data );
    };

  }
};
