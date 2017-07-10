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

    switch ( control.params.fields[ fieldId ].type ) {
      case 'checkbox':
      case 'epsilon-toggle':
        currentSettings[ row.rowIndex ][ fieldId ] = element.prop( 'checked' );
        break;
      default:
        currentSettings[ row.rowIndex ][ fieldId ] = element.val();
        break;
    }

    EpsilonFramework.repeater.helpers.setValue( control, currentSettings, true );
  },

  /**
   * Drag and drop functionality
   * @param control
   */
  sort: function( control ) {
    var rows = control.repeaterContainer.find( '.repeater-row' ),
        settings = EpsilonFramework.repeater.helpers.getValue( control ),
        newOrder = [],
        newRows = [],
        newSettings = [];

    rows.each( function( i, element ) {
      newOrder.push( jQuery( element ).data( 'row' ) );
    } );

    jQuery.each( newOrder, function( newPosition, oldPosition ) {
      newRows[ newPosition ] = control.rows[ oldPosition ];

      EpsilonFramework.repeater.row.setRowIndex( newRows[ newPosition ], newPosition, control );
      newSettings[ newPosition ] = settings[ oldPosition ];
    } );

    control.rows = newRows;
    EpsilonFramework.repeater.helpers.setValue( control, newSettings );
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
