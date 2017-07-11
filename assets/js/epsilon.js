/*
 EpsilonFramework Object
 */

var EpsilonFramework = 'undefined' === typeof( EpsilonFramework ) ? {} : EpsilonFramework;

/*
 EpsilonFramework.Repeater Object
 */
EpsilonFramework.repeater = 'undefined' === typeof( EpsilonFramework.repeater ) ? {} : EpsilonFramework.repeater;

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
    input = context.parent().find( '.epsilon-color-scheme-input' );
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

    function updateCSS() {
      _.each( colorSettings, function( setting ) {
        css.data[ setting ] = api( setting )();
      } );
      api.previewer.send( 'update-inline-css', css );
    }

    _.each( colorSettings, function( setting ) {
      api( setting, function( setting ) {
        setting.bind( updateCSS );
      } );
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
        colorSettings.push( index );
        /**
         * Set values
         */
        jQuery( '#customize-control-' + index + ' .epsilon-color-picker' ).minicolors( 'value', value );
        wp.customize( index ).set( value );
      } );

      /**
       * Remove the selected class from siblings
       */
      jQuery( this ).
          siblings( '.epsilon-color-scheme-option' ).
          removeClass( 'selected' );
      /**
       * Make active the current selection
       */
      jQuery( this ).addClass( 'selected' );
      /**
       * Trigger change
       */
      input.val( val ).change();

      _.each( colorSettings, function( setting ) {
        api( setting, function( setting ) {
          setting.bind( updateCSS() );
        } );
      } );
    } );
  }
};

/**
 * Initiate the Image Control
 */

EpsilonFramework.image = {
  /**
   * Initiator
   */
  init: function( control ) {
    var self = this,
        image,
        temp,
        setting = {},
        thumb;

    /**
     * Image selection
     */
    control.container.on( 'click', '.image-upload-button', function( e ) {
      /**
       * Open the wp.media frame
       */
      image = wp.media( {
        multiple: false,
      } ).open();

      /**
       * On selection, save the data in a JSON
       */
      image.on( 'select', function() {
        temp = image.state().get( 'selection' ).first();
        setting.id = temp.id;
        setting.url = _.isUndefined( temp.toJSON().sizes.medium.url ) ? temp.toJSON().sizes.full.url : temp.toJSON().sizes.medium.url;
        self.saveValue( control, setting );
        self.setImage( control, setting.url );

        /**
         * Show buttons
         */
        control.container.find( '.actions .image-upload-remove-button' ).show();
        if ( ! _.isEmpty( control.params.default ) ) {
          control.container.find( '.actions .image-default-button' ).show();
        }
      } );
    } );

    /**
     * Image deletion
     */
    control.container.on( 'click', '.image-upload-remove-button', function( e ) {
      e.preventDefault();
      thumb = control.container.find( '.epsilon-image' );
      self.saveValue( control, '' );

      if ( thumb.length ) {
        thumb.find( 'img' ).fadeOut( 200, function() {
          thumb.removeClass( 'epsilon-image' ).addClass( 'placeholder' ).html( EpsilonTranslations.selectFile );
        } );
      }

      /**
       * If we don`t have an image, we can hide these buttons
       */
      jQuery( this ).hide();
      if ( ! _.isEmpty( control.params.default ) ) {
        control.container.find( '.actions .image-default-button' ).show();
      }
    } );

    control.container.on( 'click', '.image-default-button', function( e ) {
      e.preventDefault();
      thumb = control.container.find( '.epsilon-image' );

      self.saveValue( control, control.params.default );
      self.setImage( control, control.params.default.url );

      control.container.find( '.actions .image-upload-remove-button' ).show();
    } );
  },

  /**
   * Set image in the customizer option control
   *
   * @param control
   * @param image
   */
  setImage: function( control, image ) {
    /**
     * If we already have an image, we need to return that div, else we grab the placeholder
     *
     * @type {*}
     */
    var thumb = control.container.find( '.epsilon-image' ).length ? control.container.find( '.epsilon-image' ) : control.container.find( '.placeholder' );

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
   * Save value in database
   *
   * @param control
   * @param val
   */
  saveValue: function( control, val ) {
    var input = control.container.find( '.epsilon-controller-image-container > input' );

    if ( 'object' === typeof(val) ) {
      control.setting.set( JSON.stringify( val ) );
      jQuery( input ).attr( 'value', JSON.stringify( val ) ).trigger( 'change' );
    } else {
      control.setting.set( '' );
      jQuery( input ).attr( 'value', '' ).trigger( 'change' );
    }

  },
};
/**
 * Initiate the Layouts Control
 *
 * jQuery Events {
  *   epsilon_column_count_change   <-- Happens before the changes are made to the columns
  *   epsilon_column_count_changed  <-- Happens right after the columns are changed, save is bound to it
  *   epsilon_column_size_changed   <-- Happens right after a column is resized, save is bound to it
  * }
 *
 * @type {{}}
 */
EpsilonFramework.layouts = {
  /**
   * Redundant constant for columns
   */
  colClasses: 'col12 col11 col10 col9 col8 col7 col6 col5 col4 col3 col2 col1',
  /**
   * Buttons
   */
  html: {
    buttonLeft: '<a href="#" data-action="left"><span class="dashicons dashicons-arrow-left"></span> </a>',
    buttonRight: '<a href="#" data-action="right"><span class="dashicons dashicons-arrow-right"></span> </a>'
  },

  instance: function( context ) {
    /**
     * Variables
     */
    this.context = context;
    this.layoutButtons = this.context.find( '.epsilon-button-group > a' );
    this.resizeButtons = this.context.find( '.epsilon-layouts-setup > .epsilon-column > a' );
    this.maxColumns = this.layoutButtons.length;
    this.minSpan = parseFloat( this.context.attr( 'data-min-span' ) );

    this.activeColumns = null;
    this.lastColumnsState = null;

    /**
     * Handle actions per instance
     */
    EpsilonFramework.layouts.handle_actions( this );

    /**
     * Whenever the column count or size changes, we save data to the hidden field
     */
    this.context.on( 'epsilon_column_count_changed epsilon_column_size_changed', EpsilonFramework.layouts._save );
  },

  /**
   * Initiate the layouts functionality (constructor)
   */
  init: function( selector ) {
    var context = jQuery( selector );
    jQuery.each( context, function() {
      new EpsilonFramework.layouts.instance( jQuery( this ) );
    } );
  },

  /**
   * Save state in a json
   * @private
   */
  _save: function( e ) {
    var json = {
      'columnsCount': e.instance.activeColumns,
      'columns': {}
    };

    jQuery.each( e.instance.context.find( '.epsilon-column' ), function( index ) {
      json.columns[ index + 1 ] = {
        'index': index + 1,
        'span': jQuery( this ).attr( 'data-columns' )
      };
    } );

    e.instance.context.find( 'input' ).val( JSON.stringify( json ) ).trigger( 'change' );
  },

  /**
   * Handle the click events in the control
   */
  handle_actions: function( instance ) {
    /**
     * Hide / show columns
     */
    this._advanced_toggler( instance );
    /**
     * Column resize event ( + / - buttons )
     */
    this._column_resize( instance );
    /**
     * Addition removal of columns events
     */
    this._column_recount( instance );
    this._layout_select( instance );
    this._equalize_columns( instance );
  },

  /**
   * When selecting a layout, recalc/remove/readd divs in the container
   *
   * @private
   */
  _layout_select: function( instance ) {
    var self = this,
        columns;

    instance.layoutButtons.on( 'click', function( e ) {
      e.preventDefault();

      /**
       * Handle addition/deletion through jQuery events
       */
      jQuery( instance.context ).trigger( {
        'type': 'epsilon_column_count_change',
        'columns': {
          'selected': parseFloat( jQuery( this ).attr( 'data-button-value' ) ),
          'beforeSelection': instance.context.find( '.epsilon-layouts-setup > .epsilon-column' ).length
        }
      } );

      /**
       * Visual changes
       */
      jQuery( this ).
          toggleClass( 'active' ).
          siblings( 'a' ).
          removeClass( 'active' );
    } );
  },

  /**
   * Handle addition/removal of columns
   * @private
   */
  _column_recount: function( instance ) {
    var context = instance.context,
        self = this,
        columns, operation, i, j;
    jQuery( instance.context ).on( 'epsilon_column_count_change', function( e ) {
      /**
       * Update instance variables
       */
      instance.activeColumns = e.columns.selected;
      instance.lastColumnsState = e.columns.beforeSelection;

      /**
       * In case we don't have anything to modify, we can terminate here
       */
      if ( instance.activeColumns === instance.lastColumnsState ) {
        return;
      }

      /**
       * Are we adding or subtrating?
       */
      operation = instance.lastColumnsState < instance.activeColumns ? 'adding' : 'subtracting';
      i = instance.activeColumns - instance.lastColumnsState;

      if ( 'subtracting' === operation ) {
        instance.context.find( '.epsilon-layouts-setup > .epsilon-column' ).
            slice( - ( instance.lastColumnsState - instance.activeColumns ) ).
            remove();
      } else {
        for ( j = 0; j < i; j ++ ) {
          instance.context.find( '.epsilon-layouts-setup' ).
              append(
                  '<div class="epsilon-column col4">' +
                  self.html.buttonLeft +
                  self.html.buttonRight +
                  '</div>' );
        }
      }

      /**
       * Trigger event to changed
       */
      jQuery( instance.context ).trigger( {
        'type': 'epsilon_column_count_changed',
        'instance': instance
      } );
    } );
  },

  /**
   * Handle the resize event in the control
   *
   * @private
   */
  _column_resize: function( instance ) {
    var self = this,
        position,
        elementToSubtractFrom,
        elementToAddOn;
    instance.context.find( '.epsilon-layouts-setup' ).on( 'click', '.epsilon-column > a', function( e ) {
      elementToAddOn = jQuery( this ).parent();
      position = elementToAddOn.index();

      if ( 'right' === jQuery( this ).attr( 'data-action' ) ) {
        elementToSubtractFrom = instance.context.find( '.epsilon-layouts-setup > .epsilon-column' ).eq( position + 1 );
      } else {
        elementToSubtractFrom = instance.context.find( '.epsilon-layouts-setup > .epsilon-column' ).eq( position - 1 );
      }

      self.calc_column_resize( elementToSubtractFrom, elementToAddOn, instance );
    } );
  },

  /**
   * Change spans accordingly
   *
   * @param subtract
   * @param add
   */
  calc_column_resize: function( subtract, add, instance ) {
    if ( parseFloat( subtract.attr( 'data-columns' ) ) === instance.minSpan ) {
      return;
    }

    subtract.attr( 'data-columns',
        parseFloat( subtract.attr( 'data-columns' ) ) - 1 ).
        removeClass( this.colClasses ).
        addClass( 'col' + subtract.attr( 'data-columns' ) );

    add.attr( 'data-columns',
        parseFloat( add.attr( 'data-columns' ) ) + 1 ).
        removeClass( this.colClasses ).
        addClass( 'col' + add.attr( 'data-columns' ) );

    /**
     * Trigger event to change
     */
    jQuery( this.context ).trigger( {
      'type': 'epsilon_column_size_changed',
      'instance': this
    } );
  },

  /**
   * Equalize coolumns, this is happening after a new layout is selected
   * @private
   */
  _equalize_columns: function( instance ) {
    var context = instance.context,
        self = this;

    jQuery( instance.context ).on( 'epsilon_column_count_changed', function( e ) {
      instance.context.find( '.epsilon-column' ).
          removeClass( self.colClasses ).
          addClass( 'col' + ( 12 / instance.activeColumns ) ).
          attr( 'data-columns', ( 12 / instance.activeColumns ) );
    } );
  },
  /**
   * Advanced options toggler ( for column resize )
   *
   * @private
   */
  _advanced_toggler: function( instance ) {
    /**
     * On clicking the advanced options toggler,
     */
    instance.context.on( 'click', '.epsilon-layouts-advanced-toggler', function( e ) {
      e.preventDefault();
      jQuery( this ).toggleClass( 'active' );
      jQuery( '#' + jQuery( this ).attr( 'data-unique-id' ) ).slideToggle().addClass( 'active' );
    } );
  }
};
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
    var context = jQuery( selector ),
        sliders = context.find( '.slider-container' ),
        slider, input, inputId, id;

    jQuery.each( sliders, function() {
      var slider = jQuery( this ).find( '.ss-slider' ),
          input = jQuery( this ).find( '.rl-slider' ),
          inputId = input.attr( 'id' ),
          id = slider.attr( 'id' );

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
    } );
  }
};
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

/**
 * Row object
 */
EpsilonFramework.repeater.row = {
  /**
   * Deletes a row from the control
   *
   * @param index
   */
  delete: function( rowInstance, index, control ) {
    var currentSettings = EpsilonFramework.repeater.helpers.getValue( control ),
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

        // Update the new setting values
        EpsilonFramework.repeater.helpers.setValue( control, currentSettings, true );
      }
    }

    // Remap the row numbers
    i = 1;
    for ( prop in control.rows ) {
      if ( control.rows.hasOwnProperty( prop ) && control.rows[ prop ] ) {
        EpsilonFramework.repeater.row.updateLabel( control.rows[ prop ], control );
        i ++;
      }
    }
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
        template = _.memoize( EpsilonFramework.repeater.helpers.repeaterTemplate( control ) ),
        settingValue = EpsilonFramework.repeater.helpers.getValue( control ),
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
      EpsilonFramework.repeater.row.delete( this, rowIndex, control );
    } );

    /**
     * 2. Update row event
     */
    newRow.container.on( 'row:update', function( e, rowIndex, fieldName, element, control ) {
      EpsilonFramework.repeater.helpers.updateField.call( e, rowIndex, fieldName, element, control );
      EpsilonFramework.repeater.row.updateLabel( newRow );
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
    EpsilonFramework.repeater.helpers.setValue( control, settingValue, true );

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
   * Trigger a new row
   *
   * @param rowIndex
   * @param container
   * @param label
   * @param control
   */
  constructor: function( rowIndex, container, label, control ) {
    var self = this;
    this.rowIndex = rowIndex;
    this.container = container;
    this.label = label;
    this.header = this.container.find( '.repeater-row-header' );

    /**
     * Events
     */
    this.header.on( 'click', function() {
      EpsilonFramework.repeater.row.toggleMinimize( self );
    } );

    this.container.on( 'click', '.repeater-row-remove', function() {
      EpsilonFramework.repeater.row.removeRow( self );
    } );

    this.container.on( 'keyup change', 'input, select, textarea', function( e ) {
      self.container.trigger( 'row:update', [ self.rowIndex, jQuery( e.target ).data( 'field' ), e.target, control ] );
    } );

    EpsilonFramework.repeater.row.updateLabel( self, control );
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
    EpsilonFramework.repeater.row.updateLabel( rowInstance, control );
  },

  /**
   * Toggle vizibility
   *
   * @param instance
   */
  toggleMinimize: function( instance ) {
    // Store the previous state.
    instance.container.toggleClass( 'minimized' );
    instance.header.find( '.dashicons' ).toggleClass( 'dashicons-arrow-up' ).toggleClass( 'dashicons-arrow-down' );
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
};

/**
 * Section Repeater object
 *
 * @type {{}}
 */
EpsilonFramework.sectionRepeater = {
  /**
   * Wp API
   */
  api: wp.customize || null,
  /**
   * Context
   */
  context: null,
  /**
   * Control that saves option in the database
   */
  control: null,
  /**
   * Initiator
   */
  init: function( instance ) {
    /**
     * Save Context
     */
    this.context = instance;
    /**
     * Handle adding of new sections
     */
    this.addNewSection();
    /**
     * Handle the click event
     */
    this.handleAddButton();
  },

  /**
   * Add a new section handler
   */
  add: function( control ) {
    var self = this,
        template = _.memoize( EpsilonFramework.repeater.helpers.repeaterTemplate( control ) );
  },
  /**
   * Handle the adding section button
   *
   * @private
   */
  handleAddButton: function() {
    var panel = this.context,
        isAddBtn,
        body = jQuery( 'body' );

    panel.container.find( '.epsilon-add-new-section' ).on( 'click keydown', function( e ) {
      isAddBtn = jQuery( e.target ).is( '.epsilon-add-new-section' );

      body.toggleClass( 'adding-section' );
      if ( body.hasClass( 'adding-section' ) && ! isAddBtn ) {
        panel.close();
      }
    } );
  },

  /**
   * Set the value of the customizer option
   *
   * @param instance
   * @param newValue
   * @param refresh
   */
  setValue: function( instance, newValue, refresh ) {
    console.log( newValue );
    instance.setting.set( encodeURI( JSON.stringify( newValue ) ) );
  }
};
/**
 * Typography functions
 *
 * @type {{_selectize: null, _linkedFonts: {}, init: EpsilonFramework.typography.init, _resetDefault: EpsilonFramework.typography._resetDefault, _parseJson:
 *     EpsilonFramework.typography._parseJson}}
 */
EpsilonFramework.typography = {
  /**
   * Selectize instance
   */
  _selectize: null,

  /**
   * K/V Pair
   */
  _linkedFonts: {},

  /**
   * Initiate function
   */
  init: function() {
    var selector = jQuery( '.epsilon-typography-container' ),
        self = this;

    if ( selector.length ) {
      jQuery.each( selector, function() {
        var container = jQuery( this ),
            uniqueId = container.attr( 'data-unique-id' ),
            selects = container.find( 'select' ),
            inputs = container.find( '.epsilon-typography-input' );

        /**
         * Instantiate the selectize javascript plugin
         * and the input type number
         */
        try {
          self._selectize = selects.selectize();
        }
        catch ( err ) {
          /**
           * In case the selectize plugin is not loaded, raise an error
           */
          console.warn( 'selectize not yet loaded' );
        }
        /**
         * On triggering the change event, create a json with the values and
         * send it to the preview window
         */
        inputs.on( 'change', function() {
          var val = EpsilonFramework.typography._parseJson( inputs,
              uniqueId );
          jQuery( '#hidden_input_' + uniqueId ).val( val ).trigger( 'change' );
        } );

        /**
         * On clicking the advanced options toggler,
         */
        container.find( '.epsilon-typography-advanced-options-toggler' ).on( 'click', function( e ) {
          var toggle = jQuery( this ).attr( 'data-toggle' );
          e.preventDefault();
          jQuery( this ).
              toggleClass( 'active' ).
              parent().
              toggleClass( 'active' );
          jQuery( '#' + toggle ).slideToggle().addClass( 'active' );
        } );
      } );

      /**
       * Great use of the EpsilonFramework, ahoy!
       */
      EpsilonFramework.rangeSliders.init( '.epsilon-typography-container' );

      /**
       * Reset button
       */
      jQuery( '.epsilon-typography-default' ).on( 'click', function( e ) {
        e.preventDefault();
        EpsilonFramework.typography._resetDefault( jQuery( this ) );
      } );

    }
  },

  /**
   * Reset defaults
   *
   * @param element
   * @private
   */
  _resetDefault: function( element ) {
    var container = jQuery( element ).parent(),
        uniqueId = container.attr( 'data-unique-id' ),
        selects = container.find( 'select' ),
        inputs = container.find( 'inputs' ),
        val;

    var fontFamily = selects[ 0 ].selectize;

    var object = {
          'action': 'epsilon_generate_typography_css',
          'class': 'Epsilon_Typography',
          'id': uniqueId,
          'data': {
            'selectors': jQuery( '#selectors_' + uniqueId ).val(),
            'json': {}
          }
        },
        api = wp.customize;

    fontFamily.setValue( 'default_font' );

    if ( jQuery( '#' + uniqueId + '-font-size' ).length ) {
      val = jQuery( '#' + uniqueId + '-font-size' ).
          attr( 'data-default-font-size' );

      jQuery( '#' + uniqueId + '-font-size' ).
          val( val ).
          trigger( 'change' ).
          trigger( 'blur' );
      object.data.json[ 'font-size' ] = '';
    }

    if ( jQuery( '#' + uniqueId + '-line-height' ).length ) {
      val = jQuery( '#' + uniqueId + '-line-height' ).
          attr( 'data-default-line-height' );

      jQuery( '#' + uniqueId + '-line-height' ).
          val( val ).
          trigger( 'change' ).
          trigger( 'blur' );
      object.data.json[ 'line-height' ] = '';
    }

    if ( jQuery( '#' + uniqueId + '-letter-spacing' ).length ) {
      val = jQuery( '#' + uniqueId + '-letter-spacing' ).
          attr( 'data-default-letter-spacing' );

      jQuery( '#' + uniqueId + '-letter-spacing' ).
          val( val ).
          trigger( 'change' ).
          trigger( 'blur' );
      object.data.json[ 'letter-spacing' ] = '';
    }

    object.data.json[ 'font-family' ] = 'default_font';
    object.data.json[ 'font-weight' ] = '';
    object.data.json[ 'font-style' ] = '';

    api.previewer.send( 'update-inline-css', object );
  },

  /**
   * Parse/create the json and send it to the preview window
   *
   * @param inputs
   * @param id
   * @private
   */
  _parseJson: function( inputs, id ) {
    var object = {
          'action': 'epsilon_generate_typography_css',
          'class': 'Epsilon_Typography',
          'id': id,
          'data': {
            'selectors': jQuery( '#selectors_' + id ).val(),
            'json': {}
          }
        },
        api = wp.customize;

    jQuery.each( inputs, function( index, value ) {
      var key = jQuery( value ).attr( 'id' ),
          replace = id + '-',
          type = jQuery( this ).attr( 'type' );
      key = key.replace( replace, '' );

      if ( 'checkbox' === type ) {
        object.data.json[ key ] = jQuery( this ).prop( 'checked' ) ? jQuery( value ).
            val() : '';
      } else {
        object.data.json[ key ] = jQuery( value ).val();
      }

    } );

    api.previewer.send( 'update-inline-css', object );
    return JSON.stringify( object.data );
  }
};

/**
 * Recommended action section scripting
 *
 * @type {{_init: _init, dismissActions: dismissActions, dismissPlugins:
   *     dismissPlugins}}
 */
/*jshint -W065 */
EpsilonFramework.recommendedActions = {
  /**
   * Initiate the click actions
   */
  init: function() {
    var context = jQuery( '.control-section-epsilon-section-recommended-actions' ),
        dismissPlugin = context.find( '.epsilon-recommended-plugin-button' ),
        dismissAction = context.find( '.epsilon-dismiss-required-action' );

    /**
     * Dismiss actions
     */
    this.dismissActions( dismissAction );
    /**
     * Dismiss plugins
     */
    this.dismissPlugins( dismissPlugin );
  },

  /**
   * Dismiss actions function, hides the container and shows the next one
   * while changing the INDEX in the title
   * @param selectors
   */
  dismissActions: function( selectors ) {
    selectors.on( 'click', function() {
      /**
       * During ajax, we lose scope - so declare "self"
       * @type {*}
       */
      var self = jQuery( this ),
          /**
           * Get the container
           */
          container = self.parents(
              '.epsilon-recommended-actions-container' ),
          /**
           * Get the current index
           *
           * @type {Number}
           */
          index = parseInt( container.attr( 'data-index' ) ),
          /**
           * Get the title
           *
           * @type {*}
           */
          title = container.parents(
              '.control-section-epsilon-section-recommended-actions' ).
              find( 'h3' ),
          /**
           * Get the indew from the notice
           *
           * @type {*}
           */
          notice = title.find( '.epsilon-actions-count > .current-index' ),
          /**
           * Get the total
           *
           * @type {Number}
           */
          total = parseInt( notice.attr( 'data-total' ) ),
          /**
           * Get the next element ( this will be shown next )
           */
          next = container.next(),
          /**
           * Create the args object for the AJAX call
           *
           * action [ Class, Method Name ]
           * args [ parameters to be sent to method ]
           *
           * @type {{action: [*], args: {id: *, option: *}}}
           */
          args = {
            'action': [ 'Epsilon_Notify_System', 'dismiss_required_action' ],
            'args': {
              'id': jQuery( this ).attr( 'id' ),
              'option': jQuery( this ).attr( 'data-option' )
            }
          },
          replace, plugins, replaceText;

      /**
       * Initiate the AJAX function
       *
       * Note that the Epsilon_Framework class, has the following method :
       *
       * public function epsilon_framework_ajax_action(){};
       *
       * which is used as a proxy to gather jQuery_POST data, verify it
       * and call the needed function, in this case :
       * Epsilon_Framework::dismiss_required_action()
       *
       */
      jQuery.ajax( {
        type: 'POST',
        data: { action: 'epsilon_framework_ajax_action', args: args },
        dataType: 'json',
        url: WPUrls.ajaxurl,
        success: function( data ) {
          /**
           * In case everything is ok, we start changing things
           */
          if ( data.status && 'ok' === data.message ) {
            /**
             * If it's the last element, show plugins
             */

            if ( total <= index ) {
              replace = title.find( '.section-title' );
              plugins = jQuery( '.epsilon-recommended-plugins' );
              replaceText = replace.attr( 'data-social' );

              if ( plugins.length ) {
                replaceText = replace.attr( 'data-plugin_text' );
              }

              title.find( '.epsilon-actions-count' ).remove();
              replace.text( replaceText );

            }
            /**
             * Else, just change the index
             */
            else {
              notice.text( index + 1 );
            }

            /**
             * Fade the current element and show the next one.
             * We don't need to remove it at this time. Leave it to for
             * server side
             */
            container.fadeOut( '200', function() {
              next.css( { opacity: 1, height: 'initial' } ).fadeIn( '200' );
            } );
          }
        },

        /**
         * Throw errors
         *
         * @param jqXHR
         * @param textStatus
         * @param errorThrown
         */
        error: function( jqXHR, textStatus, errorThrown ) {
          console.log( jqXHR + ' :: ' + textStatus + ' :: ' + errorThrown );
        }
      } );
    } );
  },

  /**
   * Dismiss plugins function, hides the container and shows the next one
   * while changing the INDEX in the title
   * @param selectors
   */
  dismissPlugins: function( selectors ) {
    selectors.on( 'click', function() {
      /**
       * During ajax, we lose scope - so declare "self"
       * @type {*}
       */
      var self = jQuery( this ),
          /**
           * Get the container
           */
          container = self.parents( '.epsilon-recommended-plugins' ),
          /**
           * Get the next element (this will be shown next)
           */
          next = container.next(),
          /**
           * Get the title
           *
           * @type {*}
           */
          title = container.parents(
              '.control-section-epsilon-section-recommended-actions' ).
              find( 'h3' ),
          /**
           * Create the args object for the AJAX call
           *
           * action [ Class, Method Name ]
           * args [ parameters to be sent to method ]
           *
           * @type {{action: [*], args: {id: *, option: *}}}
           */
          args = {
            'action': [ 'Epsilon_Framework', 'dismiss_required_action' ],
            'args': {
              'id': jQuery( this ).attr( 'id' ),
              'option': jQuery( this ).attr( 'data-option' )
            }
          },
          replace, replaceText;

      jQuery.ajax( {
        type: 'POST',
        data: { action: 'epsilon_framework_ajax_action', args: args },
        dataType: 'json',
        url: WPUrls.ajaxurl,
        success: function( data ) {
          /**
           * In case everything is ok, we start changing things
           */
          if ( data.status && 'ok' === data.message ) {
            /**
             * Fade the current element and show the next one.
             * We don't need to remove it at this time. Leave it to for
             * server side
             */
            container.fadeOut( '200', function() {
              if ( next.is( 'p' ) ) {
                replace = title.find( '.section-title' );
                replaceText = replace.attr( 'data-social' );

                replace.text( replaceText );
              }
              next.css( { opacity: 1, height: 'initial' } ).fadeIn( '200' );
            } );
          }
        },

        /**
         * Throw errors
         *
         * @param jqXHR
         * @param textStatus
         * @param errorThrown
         */
        error: function( jqXHR, textStatus, errorThrown ) {
          console.log( jqXHR + ' :: ' + textStatus + ' :: ' + errorThrown );
        }
      } );
    } );
  }
};
/**
 * Color Picker Control Constructor
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
/**
 * Image Control Constructor
 */
wp.customize.controlConstructor[ 'epsilon-image' ] = wp.customize.Control.extend( {
  ready: function() {
    var control = this;
    EpsilonFramework.image.init( this );
  }
} );

/**
 * WP Customizer Layouts Control Constructor
 */
wp.customize.controlConstructor[ 'epsilon-layouts' ] = wp.customize.Control.extend( {
  ready: function() {
    var control = this;

    /**
     * Save the layout
     */
    jQuery( this.container ).find( 'input' ).on( 'change', function() {
      control.setting.set( jQuery( this ).val() );
    } );
  }
} );

/**
 * WP Customizer Range Slider Control Constructor
 */
wp.customize.controlConstructor[ 'epsilon-slider' ] = wp.customize.Control.extend( {
  ready: function() {
    var control = this;

    control.container.on( 'change', 'input.rl-slider',
        function() {
          control.setting.set( jQuery( this ).val() );
        }
    );
  }
} );

/**
 * WP Customizer Control Constructor
 */
wp.customize.controlConstructor[ 'epsilon-repeater' ] = wp.customize.Control.extend( {
  ready: function() {
    var control = this;
    this.initRepeater();
  },

  initRepeater: function() {
    var control = this,
        settingValue = this.params.value,
        limit = false,
        newRow,
        temp;

    this.settingField = this.container.find( '[data-customize-setting-link]' ).first();

    /**
     * Set an initial value to the repeater field
     */
    EpsilonFramework.repeater.helpers.setValue( this, [], false );

    /**
     * Create a reference of the container
     */
    this.repeaterContainer = this.container.find( '.repeater-fields' ).first();

    /**
     * Start incrementing an index
     *
     * @type {number}
     */
    this.currentIndex = 0;

    /**
     * Start saving rows
     * @type {Array}
     */
    this.rows = [];

    /**
     * Setup Limit
     *
     * @type {boolean}
     */
    if ( ! _.isUndefined( this.params.choices.limit ) ) {
      limit = ( 0 >= this.params.choices.limit ) ? false : parseInt( this.params.choices.limit );
    }
    /**
     * Bind events for this control
     *
     * 1. Click event on the ADD Row button
     */
    this.container.on( 'click', 'button.epsilon-repeater-add', function( e ) {
      e.preventDefault();
      if ( ! limit || control.currentIndex < limit ) {
        newRow = EpsilonFramework.repeater.row.add( control );
        /**
         * init range sliders, color pickers
         */
        EpsilonFramework.rangeSliders.init( newRow.container );
        EpsilonFramework.colorPickers.init( newRow.container.find( '.epsilon-color-picker' ) );
      } else {
        jQuery( control.selector + ' .limit' ).addClass( 'highlight' );
      }
    } );

    /**
     * 2.  REMOVE Row button
     */
    this.container.on( 'click', '.repeater-row-remove', function() {
      control.currentIndex --;
      if ( ! limit || control.currentIndex < limit ) {
        jQuery( control.selector + ' .limit' ).removeClass( 'highlight' );
      }
    } );

    /**
     * 3. Image controls - Upload
     */
    this.container.on( 'click keypress', '.epsilon-controller-image-container .image-upload-button', function( e ) {
      e.preventDefault();

      if ( wp.customize.utils.isKeydownButNotEnterEvent( e ) ) {
        return;
      }
      temp = jQuery( this ).parents( '.epsilon-controller-image-container' );

      EpsilonFramework.repeater.helpers.handleImageUpload( control, temp );
    } );

    /**
     * 4 Image Controls - Removal
     */
    this.container.on( 'click keypress', '.epsilon-controller-image-container .image-upload-remove-button', function( e ) {
      e.preventDefault();

      if ( wp.customize.utils.isKeydownButNotEnterEvent( e ) ) {
        return;
      }

      temp = jQuery( this ).parents( '.epsilon-controller-image-container' );
      EpsilonFramework.repeater.helpers.handleImageRemoval( control, temp );
    } );
    /**
     * If we have saved rows, we need to display them
     */
    if ( settingValue.length ) {
      _.each( settingValue, function( subValue ) {
        newRow = EpsilonFramework.repeater.row.add( control, subValue );
        /**
         * init range sliders, color pickers
         */
        EpsilonFramework.rangeSliders.init( newRow.container );
        EpsilonFramework.colorPickers.init( newRow.container.find( '.epsilon-color-picker' ) );
      } );
    }

    /**
     * After display fields, clean the setting
     */
    EpsilonFramework.repeater.helpers.setValue( this, settingValue, true, true );

    /**
     * Add sortable functionality
     */
    this.repeaterContainer.sortable( {
      handle: '.repeater-row-header',
      update: function() {
        EpsilonFramework.repeater.helpers.sort( control );
      }
    } );
  },
} );
/**
 * Epsilon Section Repeater Constructor
 */
wp.customize.controlConstructor[ 'epsilon-section-repeater' ] = wp.customize.Control.extend( {
  ready: function() {
    var newSection, limit;
    this.settingField = this.container.find( '[data-customize-setting-link]' ).first();
    this.currentIndex = 0;
    /**
     * Set an initial value to the repeater field
     */
    EpsilonFramework.repeater.helpers.setValue( this, [], false );

    /**
     * Add new repeater section handler
     */
    EpsilonFramework.repeater.handleAddButton();
  },
} );
/**
 * WP Customizer Control Constructor
 */
wp.customize.controlConstructor[ 'epsilon-toggle' ] = wp.customize.Control.extend( {
  ready: function() {
    var control = this;

    control.container.on( 'change', 'input.onoffswitch-checkbox',
        function() {
          control.setting.set( jQuery( this ).prop( 'checked' ) );
        }
    );
  }
} );

/**
 * WP Customizer Typography Control Constructor
 */
wp.customize.controlConstructor[ 'epsilon-typography' ] = wp.customize.Control.extend( {
  ready: function() {
    var control = this;
    /**
     * Save the layout
     */
    jQuery( this.container ).find( '.customize-control-content > .epsilon-typography-input' ).on( 'change', function() {
      control.setting.set( jQuery( this ).val() );
    } );
  }
} );

wp.customize.sectionConstructor[ 'epsilon-section-recommended-actions' ] = wp.customize.Section.extend( {
  attachEvents: function() {
  },
  isContextuallyActive: function() {
    return true;
  }
} );

/**
 * Pro Section
 */
wp.customize.sectionConstructor[ 'epsilon-section-pro' ] = wp.customize.Section.extend( {
  attachEvents: function() {
  },
  isContextuallyActive: function() {
    return true;
  }
} );

/**
 *
 * File epsilon.js.
 *
 * Epsilon Framework Initiator
 */

/**
 * Load the range sliders for the widget updates
 */
jQuery( document ).on( 'widget-updated widget-added', function( a, selector ) {
  if ( jQuery().slider ) {
    EpsilonFramework.rangeSliders.init( selector );
  }
} );

wp.customize.bind( 'ready', function() {
  EpsilonFramework.layouts.init( '.epsilon-layouts-container' );
  EpsilonFramework.rangeSliders.init( '.customize-control-epsilon-slider' );
  EpsilonFramework.colorPickers.init( '.epsilon-color-picker' );

  EpsilonFramework.typography.init();
  EpsilonFramework.colorSchemes.init();
  EpsilonFramework.recommendedActions.init();
} );
