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
