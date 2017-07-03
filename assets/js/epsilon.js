/*
 EpsilonFramework Object
 */

var EpsilonFramework = 'undefined' === typeof( EpsilonFramework ) ? {} : EpsilonFramework;

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
 * @type {{}}
 */
EpsilonFramework.layouts = {
  /**
   * Define the context ( SCOPE )
   * jQuery Object
   */
  context: null,
  /**
   * Layout buttons
   */
  layoutButtons: null,
  /**
   * Resize buttons
   */
  resizeButtons: null,
  /**
   * Number of columns selected
   */
  activeColumns: null,
  /**
   * Number of columns before selection
   */
  lastColumnsState: null,
  /**
   * Max number of columns
   * @todo count from "choices" instead of hardcoding
   */
  maxColumns: 4,
  /**
   * Minimum span, we don`t go below this point when creating columns
   */
  minSpan: 2,
  /**
   * Redundant constant for columns
   */
  colClasses: 'col12 col11 col10 col9 col8 col7 col6 col5 col4 col3 col2 col1',
  /**
   * Buttons
   */
  html: {
    buttonLeft: '<a href="#" data-action="left"><span class="dashicons dashicons-arrow-left"></span> </a>',
    buttonRight: '<a href="#" data-action="right"><span class="dashicons dashicons-arrow-right"></span> </a>',
  },
  /**
   * Initiate the layouts functionality (constructor)
   */
  init: function( selector ) {
    this.context = jQuery( '.epsilon-layouts-container' );

    /**
     * Setup buttons
     * @type {*}
     */
    this.layoutButtons = this.context.find( '.epsilon-button-group > a' );
    this.resizeButtons = this.context.find( '.epsilon-layouts-setup > .epsilon-column > a' );

    this.handle_actions();

    this.context.on( 'epsilon_column_count_changed epsilon_column_size_changed', this._save );
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
        'span': jQuery( this ).attr( 'data-columns' ),
      };
    } );

    e.instance.context.find( 'input' ).val( JSON.stringify( json ) );
  },

  /**
   * Handle the click events in the control
   */
  handle_actions: function() {
    var self = this;
    /**
     * Hide / show columns
     */
    this._advanced_toggler();
    /**
     * Column resize event ( + / - buttons )
     */
    this._column_resize();
    /**
     * Addition removal of columns events
     */
    this._column_recount();
    this._layout_select();
    this._equalize_columns();
  },

  /**
   * When selecting a layout, recalc/remove/readd divs in the container
   *
   * @private
   */
  _layout_select: function() {
    var self = this,
        columns;

    this.layoutButtons.on( 'click', function( e ) {
      e.preventDefault();

      /**
       * Handle addition/deletion through jQuery events
       */
      jQuery( self.context ).trigger( {
        'type': 'epsilon_column_count_change',
        'columns': {
          'selected': parseFloat( jQuery( this ).attr( 'data-button-value' ) ),
          'beforeSelection': self.context.find( '.epsilon-layouts-setup > .epsilon-column' ).length
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
  _column_recount: function() {
    var context = this.context,
        self = this,
        columns, operation, i, j;
    jQuery( this.context ).
        on( 'epsilon_column_count_change', function( e ) {
          /**
           * Update instance variables
           */
          self.activeColumns = e.columns.selected;
          self.lastColumnsState = e.columns.beforeSelection;

          /**
           * In case we don't have anything to modify, we can terminate here
           */
          if ( self.activeColumns === self.lastColumnsState ) {
            return;
          }

          /**
           * Are we adding or subtrating?
           */
          operation = self.lastColumnsState < self.activeColumns
              ? 'adding'
              : 'subtracting';
          i = self.activeColumns - self.lastColumnsState;

          if ( 'subtracting' === operation ) {
            self.context.find( '.epsilon-layouts-setup > .epsilon-column' ).
                slice( - (self.lastColumnsState - self.activeColumns) ).
                remove();
          } else {
            for ( j = 0; j < i; j ++ ) {
              self.context.find( '.epsilon-layouts-setup' ).
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
          jQuery( self.context ).trigger( {
            'type': 'epsilon_column_count_changed',
            'instance': self,
          } );
        } );
  },

  /**
   * Handle the resize event in the control
   *
   * @private
   */
  _column_resize: function() {
    var context = this.context,
        self = this,
        position,
        elementToSubtractFrom,
        elementToAddOn;
    jQuery( '.epsilon-layouts-setup' ).on( 'click', '.epsilon-column > a', function( e ) {
      elementToAddOn = jQuery( this ).parent();
      position = elementToAddOn.index();

      if ( 'right' === jQuery( this ).attr( 'data-action' ) ) {
        elementToSubtractFrom = self.context.find( '.epsilon-layouts-setup > .epsilon-column' ).eq( position + 1 );
      } else {
        elementToSubtractFrom = self.context.find( '.epsilon-layouts-setup > .epsilon-column' ).eq( position - 1 );
      }

      self.calc_column_resize( elementToSubtractFrom, elementToAddOn );
    } );
  },

  /**
   * Change spans accordingly
   *
   * @param subtract
   * @param add
   */
  calc_column_resize: function( subtract, add ) {
    if ( parseFloat( subtract.attr( 'data-columns' ) ) === this.minSpan ) {
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
      'instance': this,
    } );
  },

  /**
   * Equalize coolumns, this is happening after a new layout is selected
   * @private
   */
  _equalize_columns: function() {
    var context = this.context,
        self = this;

    jQuery( this.context ).
        on( 'epsilon_column_count_changed', function( e ) {
          jQuery( '.epsilon-column' ).
              removeClass( self.colClasses ).
              addClass( 'col' + ( 12 / self.activeColumns ) ).
              attr( 'data-columns', (12 / self.activeColumns) );
        } );
  },
  /**
   * Advanced options toggler ( for column resize )
   *
   * @private
   */
  _advanced_toggler: function() {
    /**
     * On clicking the advanced options toggler,
     */
    jQuery( '.epsilon-layouts-advanced-toggler' ).
        on( 'click', function( e ) {
          var toggle = jQuery( this ).attr( 'data-unique-id' );
          e.preventDefault();
          jQuery( this ).toggleClass( 'active' );
          jQuery( '#' + toggle ).slideToggle().addClass( 'active' );
        } );
  },
};

/**
 * WP Customizer Control Constructor
 */
wp.customize.controlConstructor[ 'epsilon-layouts' ] = wp.customize.Control.extend( {
  ready: function() {
    EpsilonFramework.layouts.init();
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

      /**
       * On clicking the advanced options toggler,
       */
      jQuery( '.epsilon-typography-advanced-options-toggler' ).
          on( 'click', function( e ) {
            var toggle = jQuery( this ).attr( 'data-toggle' );
            e.preventDefault();
            jQuery( this ).
                toggleClass( 'active' ).
                parent().
                toggleClass( 'active' );
            jQuery( '#' + toggle ).slideToggle().addClass( 'active' );
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

if ( 'undefined' !== typeof( wp ) ) {
  if ( 'undefined' !== typeof( wp.customize ) ) {
    wp.customize.bind( 'ready', function() {
      EpsilonFramework.colorSchemes.init();
      EpsilonFramework.typography.init();
      EpsilonFramework.recommendedActions.init();
    } );


    wp.customize.sectionConstructor[ 'epsilon-section-pro' ] = wp.customize.Section.extend( {
      attachEvents: function() {
      },
      isContextuallyActive: function() {
        return true;
      }
    } );
  }
}
