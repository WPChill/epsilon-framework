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
   * Handle image uploading in a repeater field
   *
   * @param instance
   * @param container
   */
  handleImageUpload: function( instance, container ) {
    var self = this,
        setting = {},
        temp,
        input,
        image = wp.media( {
          multiple: false,
        } ).open();

    /**
     * On selection, save the data in a JSON
     */
    image.on( 'select', function() {
      input = container.find( 'input' );
      temp = image.state().get( 'selection' ).first();
      setting.id = temp.id;
      setting.url = _.isUndefined( temp.toJSON().sizes.medium.url ) ? temp.toJSON().sizes.full.url : temp.toJSON().sizes.medium.url;

      self._setImage( container, setting.url );
      input.attr( 'value', ( 'url' === input.attr( 'data-save-mode' ) ? setting.url : setting.id ) ).trigger( 'change' );

      container.find( '.actions .image-upload-remove-button' ).show();
    } );
  },

  /**
   * Handle Image Removal in a repeater field
   *
   * @param instance
   * @param container
   */
  handleImageRemoval: function( instance, container ) {
    var self = this,
        setting = {},
        thumb = container.find( '.epsilon-image' );

    if ( thumb.length ) {
      thumb.find( 'img' ).fadeOut( 200, function() {
        thumb.removeClass( 'epsilon-image' ).addClass( 'placeholder' ).html( EpsilonTranslations.selectFile );
      } );
    }

    container.find( '.actions .image-upload-remove-button' ).hide();
    container.find( 'input' ).attr( 'value', '' ).trigger( 'change' );
  },

  /**
   * Set image in the customizer option control
   *
   * @param control
   * @param image
   *
   * @access private
   */
  _setImage: function( container, image ) {
    /**
     * If we already have an image, we need to return that div, else we grab the placeholder
     *
     * @type {*}
     */
    var thumb = container.find( '.epsilon-image' ).length ? container.find( '.epsilon-image' ) : container.find( '.placeholder' );

    /**
     * We "reload" the image container
     */
    if ( thumb.length ) {
      thumb.removeClass( 'epsilon-image placeholder' ).addClass( 'epsilon-image' );
      thumb.html( '' );
      thumb.append( '<img style="display:none" src="' + image + '" />' );
      thumb.find( 'img' ).fadeIn( 200 );
    }
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
      compiled = _.template( jQuery( '.customize-control-epsilon-repeater-content' ).html(), null, options );
      return compiled( data );
    };

  }
};
