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