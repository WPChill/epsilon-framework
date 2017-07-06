/*
 EpsilonFramework Object
 */

var EpsilonFramework = 'undefined' === typeof( EpsilonFramework ) ? {} : EpsilonFramework;

/**
 * Improved Color Picker
 *
 * @type {{init: EpsilonFramework.colorPickers.init}}
 */
EpsilonFramework.colorPickers = {
  init: function() {
    var selectors = jQuery( '.epsilon-color-picker' ),
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
 * WP Customizer Control Constructor
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
 * WP Customizer Control Constructor
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
        slider, input, inputId, id, min, max, step;

    jQuery.each( sliders, function() {
      var slider = jQuery( this ).find( '.ss-slider' ),
          input = jQuery( this ).find( '.rl-slider' ),
          inputId = input.attr( 'id' ),
          id = slider.attr( 'id' ),
          min = jQuery( '#' + id ).attr( 'data-attr-min' ),
          max = jQuery( '#' + id ).attr( 'data-attr-max' ),
          step = jQuery( '#' + id ).attr( 'data-attr-step' );

      jQuery( '#' + id ).slider( {
        value: jQuery( '#' + inputId ).attr( 'value' ),
        range: 'min',
        min: parseFloat( min ),
        max: parseFloat( max ),
        step: parseFloat( step ),
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
 * WP Customizer Control Constructor
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

EpsilonFramework.repeater = {
  /**
   * Initiate the repeater field script
   */
  init: function( control ) {
    var limit,
        theNewRow;

    // Set number of rows to 0
    this.currentIndex = 0;
    
  },
};

/**
 * WP Customizer Control Constructor
 */
wp.customize.controlConstructor[ 'epsilon-repeater' ] = wp.customize.Control.extend( {
  ready: function() {
    var control = this;
    EpsilonFramework.repeater.init( control );
  }
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
 * WP Customizer Control Constructor
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
            'action': [ 'Epsilon_Framework', 'dismiss_required_action' ],
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

  EpsilonFramework.typography.init();
  EpsilonFramework.colorSchemes.init();
  EpsilonFramework.colorPickers.init();
  EpsilonFramework.recommendedActions.init();
} );
