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
    this.layoutButtons = this.context.find( '.epsilon-control-group > a' );
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

    if ( null === json.columnsCount ) {
      json.columnsCount = e.instance.context.find( '.epsilon-column' ).length;
    }

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
    jQuery( instance.context ).trigger( {
      'type': 'epsilon_column_size_changed',
      'instance': instance
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
      switch ( instance.activeColumns ) {
        case 2:
          instance.context.find( '.epsilon-column' ).removeClass( self.colClasses );
          instance.context.find( '.epsilon-column' ).first().addClass( 'col8' ).attr( 'data-columns', ( 8 ) );
          instance.context.find( '.epsilon-column' ).last().addClass( 'col4' ).attr( 'data-columns', ( 4 ) );
          break;
        default:
          instance.context.find( '.epsilon-column' ).
              removeClass( self.colClasses ).
              addClass( 'col' + ( 12 / instance.activeColumns ) ).
              attr( 'data-columns', ( 12 / instance.activeColumns ) );
          break;
      }
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
    instance.context.on( 'click', '.epsilon-control-advanced', function( e ) {
      e.preventDefault();
      jQuery( this ).toggleClass( 'active' );
      jQuery( '#' + jQuery( this ).attr( 'data-unique-id' ) ).slideToggle().addClass( 'active' );
    } );
  }
};