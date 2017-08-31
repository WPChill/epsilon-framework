/**
 * Helper object, we can keep here functions that render content or help with UI interaction
 */
EpsilonFramework.repeater.base = {
  /**
   * Deletes a row from the control
   *
   * @param index
   */
  delete: function( rowInstance, index, control ) {
    var currentSettings = EpsilonFramework.repeater.base.getValue( control ),
        row,
        i,
        prop;

    if ( currentSettings[ index ] ) {
      // Find the row
      row = control.rows[ index ];
      if ( row ) {

        // Remove the row settings
        delete currentSettings[ index ];

        // Remove the row from the rows collection
        delete control.rows[ index ];
      }
    }
    currentSettings = EpsilonFramework.repeater.base.cleanArray( currentSettings );
    control.rows = EpsilonFramework.repeater.base.cleanArray( control.rows );

    jQuery.each( control.rows, function( index, element ) {
      EpsilonFramework.repeater.base.setRowIndex( element, index, control );
    } );

    // Update the new setting values
    EpsilonFramework.repeater.base.setValue( control, currentSettings, true );

    // Remap the row numbers
    i = 1;
    for ( prop in control.rows ) {
      if ( control.rows.hasOwnProperty( prop ) && control.rows[ prop ] ) {
        EpsilonFramework.repeater.base.updateLabel( control.rows[ prop ], control );
        i ++;
      }
    }

    control.currentIndex--;
  },
  /**
   * Add a new Row to the customizer
   *
   * @param instance
   * @param data
   * @returns {EpsilonFramework.repeater.row.constructor}
   */
  add: function( instance, data ) {
    var control = instance,
        template = _.memoize( EpsilonFramework.repeater.base.repeaterTemplate( control ) ),
        settingValue = EpsilonFramework.repeater.base.getValue( control ),
        newRowSetting = {},
        templateData,
        newRow,
        i;

    /**
     * In case we don`t have a template, we terminate here
     */
    if ( ! template ) {
      return;
    }

    /**
     * Extend template data with what we passed in PHP
     */
    templateData = jQuery.extend( true, {}, control.params.fields );

    /**
     * In case we added the row with "known" data, we need to overwrite the array
     */
    if ( data ) {
      for ( i in data ) {
        if ( data.hasOwnProperty( i ) && templateData.hasOwnProperty( i ) ) {
          templateData[ i ][ 'default' ] = data[ i ];
        }
      }
    }

    /**
     * Add an index
     *
     * @type {number}
     */
    templateData.index = control.currentIndex;

    /**
     * Render the HTML template with underscores
     */
    template = template( templateData );

    /**
     * Initiate a new ROW
     *
     * @type {*}
     */
    newRow = new EpsilonFramework.repeater.row.constructor(
        control.currentIndex,
        jQuery( template ).appendTo( control.repeaterContainer ),
        control.params.rowLabel,
        control
    );

    /**
     * Bind events
     *
     * 1. Remove row event
     */
    newRow.container.on( 'row:remove', function( e, rowIndex ) {
      EpsilonFramework.repeater.base.delete( this, rowIndex, control );
    } );

    /**
     * 2. Update row event
     */
    newRow.container.on( 'row:update', function( e, rowIndex, fieldName, element, control ) {
      EpsilonFramework.repeater.base.updateField.call( e, rowIndex, fieldName, element, control );
      EpsilonFramework.repeater.base.updateLabel( newRow, control );
    } );

    /**
     * 3. Initiate sortable script
     */
    newRow.header.on( 'mousedown', function() {
      newRow.container.trigger( 'row:start-dragging' );
    } );

    /**
     * Register the new row in the control
     *
     * @type {*}
     */
    control.rows[ control.currentIndex ] = newRow;

    /**
     * Add a new "index" to the setting ( easier to render in the frontend )
     */
    for ( i in templateData ) {
      if ( templateData.hasOwnProperty( i ) ) {
        newRowSetting[ i ] = templateData[ i ][ 'default' ];
      }
    }

    /**
     * Add a value to the setting
     * @type {{}}
     */
    settingValue[ control.currentIndex ] = newRowSetting;

    /**
     * Set it
     */
    if ( ! data ) {
      EpsilonFramework.repeater.base.setValue( control, settingValue, true );
    }

    /**
     * Update index
     */
    control.currentIndex ++;

    /**
     * Return constructor
     */
    return newRow;
  },
  /**
   * Set the value of the customizer option
   *
   * @param instance
   * @param newValue
   */
  setValue: function( instance, newValue ) {
    instance.setting.set( [] );
    instance.setting.set( newValue );
  },

  /**
   * Get the setting value
   *
   * @param instance
   */
  getValue: function( instance ) {
    return instance.setting.get();
  },

  /**
   * Update a single field inside a row.
   * Triggered when a field has changed
   *
   * @param rowIndex
   * @param fieldId
   * @param element
   * @param control
   */
  updateField: function( rowIndex, fieldId, element, control ) {
    var row, currentSettings;

    if ( ! control.rows[ rowIndex ] ) {
      return;
    }

    if ( ! control.params.fields[ fieldId ] ) {
      return;
    }

    row = control.rows[ rowIndex ];
    currentSettings = EpsilonFramework.repeater.base.getValue( control );

    if ( _.isUndefined( currentSettings[ row.rowIndex ][ fieldId ] ) ) {
      return;
    }

    switch ( control.params.fields[ fieldId ].type ) {
      case 'checkbox':
      case 'epsilon-toggle':
        currentSettings[ row.rowIndex ][ fieldId ] = jQuery( element ).prop( 'checked' );
        break;
      default:
        currentSettings[ row.rowIndex ][ fieldId ] = jQuery( element ).val();
        break;
    }

    EpsilonFramework.repeater.base.setValue( control, currentSettings );
  },

  /**
   * Drag and drop functionality
   * @param control
   */
  sort: function( control, data ) {
    var rows = control.repeaterContainer.find( '.repeater-row' ),
        settings = EpsilonFramework.repeater.base.getValue( control ),
        newOrder = [],
        newRows = [],
        newSettings = [];

    rows.each( function( i, element ) {
      newOrder.push( jQuery( element ).data( 'row' ) );
    } );

    jQuery.each( newOrder, function( newPosition, oldPosition ) {
      newRows[ newPosition ] = control.rows[ oldPosition ];

      EpsilonFramework.repeater.base.setRowIndex( newRows[ newPosition ], newPosition, control );
      newSettings[ newPosition ] = settings[ oldPosition ];
    } );

    /**
     * Text editor needs to be reinitiated after sorting (else it loses the "visual" part)
     */
    EpsilonFramework.repeater.base.reinitTexteditor( control, data.item );

    control.rows = newRows;
    EpsilonFramework.repeater.base.setValue( control, newSettings );
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
        size,
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
      size = input.attr( 'data-size' );

      if ( 'undefined' === typeof (temp.toJSON().sizes[ size ]) ) {
        size = 'full';
      }

      setting.id = temp.id;
      setting.url = temp.toJSON().sizes[ size ].url;

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
   * @returns {Function}
   */
  repeaterTemplate: function() {
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
  },

  /**
   * Set row's index
   *
   * @param rowIndex
   */
  setRowIndex: function( rowInstance, rowIndex, control ) {
    rowInstance.rowIndex = rowIndex;
    rowInstance.container.attr( 'data-row', rowIndex );
    rowInstance.container.data( 'row', rowIndex );
    EpsilonFramework.repeater.base.updateLabel( rowInstance, control );
  },

  /**
   * Toggle vizibility
   *
   * @param instance
   */
  toggleMinimize: function( instance ) {
    // Store the previous state.
    instance.container.find( '.repeater-row-content' ).slideToggle( 300, function() {
      instance.container.toggleClass( 'minimized' );
      instance.header.find( '.dashicons' ).toggleClass( 'dashicons-arrow-up' ).toggleClass( 'dashicons-arrow-down' );
    } );

  },

  /**
   * Remove a row from the instance
   *
   * @param instance
   */
  removeRow: function( instance ) {
    instance.container.slideUp( 300, function() {
      jQuery( this ).detach();
    } );
    instance.container.trigger( 'row:remove', [ instance.rowIndex ] );
  },

  /**
   * Update label
   *
   * @param instance
   * @param control
   */
  updateLabel: function( instance, control ) {
    var rowLabelField,
        rowLabel,
        rowLabelSelector;

    if ( 'field' === instance.label.type ) {
      rowLabelField = instance.container.find( '.repeater-field [data-field="' + instance.label.field + '"]' );
      if ( _.isFunction( rowLabelField.val ) ) {
        rowLabel = rowLabelField.val();
        if ( '' !== rowLabel ) {
          if ( ! _.isUndefined( control.params.fields[ instance.label.field ] ) ) {
            if ( ! _.isUndefined( control.params.fields[ instance.label.field ].type ) ) {
              if ( 'select' === control.params.fields[ instance.label.field ].type ) {
                if ( ! _.isUndefined( control.params.fields[ instance.label.field ].choices ) &&
                    ! _.isUndefined( control.params.fields[ instance.label.field ].choices[ rowLabelField.val() ] ) ) {
                  rowLabel = control.params.fields[ instance.label.field ].choices[ rowLabelField.val() ];
                }
              } else if ( 'radio' === control.params.fields[ instance.label.field ].type || 'radio-image' === control.params.fields[ instance.label.field ].type ) {
                rowLabelSelector = control.selector + ' [data-row="' + instance.rowIndex + '"] .repeater-field [data-field="' + instance.label.field + '"]:checked';
                rowLabel = jQuery( rowLabelSelector ).val();
              }
            }
          }

          instance.header.find( '.repeater-row-label' ).text( rowLabel );
          return;
        }
      }
    }

    instance.header.find( '.repeater-row-label' ).text( instance.label.value + ' ' + ( instance.rowIndex + 1 ) );
  },
  /**
   * Handle the icon picker field
   *
   * @param instance
   * @param container
   */
  handleIconPickerToggle: function( instance, container ) {
    container.find( '.epsilon-icon-picker-container' ).toggleClass( 'opened' );
  },

  /**
   * Handle the selection of the icon picker
   *
   * @param instance
   * @param container
   */
  handleIconPickerSelection: function( instance, clicked, container ) {
    var icon, label;

    container.find( '.epsilon-icons > i.selected' ).removeClass( 'selected' );
    icon = jQuery( clicked ).addClass( 'selected' ).attr( 'data-icon' );
    icon = jQuery( clicked ).addClass( 'selected' ).attr( 'data-icon' );

    container.find( '.epsilon-icon-name > i' ).removeClass().addClass( icon );
    container.find( '.epsilon-icon-name > .icon-label' ).html( label );

    /**
     * Set value
     */
    container.find( '.epsilon-icon-picker' ).attr( 'value', icon ).trigger( 'change' );
  },

  /**
   * Handle the Filtering of the icons
   *
   * @param instance
   * @param input
   * @param container
   */
  handleIconPickerFiltering: function( instance, input, container ) {
    var filter, temp,
        collection = jQuery( container ).find( '.epsilon-icons > i' );

    filter = jQuery( input ).val().toLowerCase();

    jQuery.each( collection, function() {
      temp = jQuery( this ).attr( 'data-search' ).toLowerCase();
      jQuery( this )[ temp.indexOf( filter ) !== - 1 ? 'show' : 'hide' ]();
    } );
  },

  /**
   * Initiate the text editor in the repeater field
   *
   * @param container
   */
  initTexteditor: function( container ) {
    var textarea = container.find( 'textarea' ),
        editorId;

    jQuery.each( textarea, function() {
      editorId = jQuery( this ).attr( 'id' );

      wp.editor.initialize( editorId, {
        tinymce: {
          wpautop: true,
          setup: function( editor ) {
            editor.on( 'change', function( e ) {
              editor.save();
              jQuery( editor.getElement() ).trigger( 'change' );
            } );
          }
        },
        quicktags: true
      } );
    } );
  },

  /**
   * Remove the editor so we can add it again
   *
   * @param container
   */
  reinitTexteditor: function( instance, container ) {
    var self = this,
        textarea = container.find( 'textarea' );

    jQuery.each( textarea, function() {
      wp.editor.remove( jQuery( this ).attr( 'id' ) );
      wp.editor.initialize( jQuery( this ).attr( 'id' ), {
        tinymce: {
          wpautop: true,
          setup: function( editor ) {
            editor.on( 'change', function( e ) {
              editor.save();
              jQuery( editor.getElement() ).trigger( 'change' );
            } );
          }
        },
        quicktags: true
      } );
    } );
  },

  /**
   * Cleans an array (undefined values), returns value
   *
   * @param actual
   * @returns {Array}
   */
  cleanArray: function( actual ) {
    var newArray = [],
        self = this;
    for ( var i = 0; i < actual.length; i ++ ) {
      if ( actual[ i ] ) {
        newArray.push( actual[ i ] );
      }
    }

    return newArray;
  },
};
