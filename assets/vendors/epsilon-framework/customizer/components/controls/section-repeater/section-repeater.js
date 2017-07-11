/**
 * Section Repeater object
 *
 * @type {{}}
 */
EpsilonFramework.sectionRepeater.base = {
  /**
   * Deletes a section from the control
   *
   * @param index
   */
  delete: function( sectionInstance, index, control ) {
    var self = this,
        currentSettings = self.getValue( control ),
        section,
        i,
        prop;

    if ( currentSettings[ index ] ) {
      // Find the row
      section = control.sections[ index ];
      if ( section ) {

        // Remove the sections settings
        delete currentSettings[ index ];

        // Remove the sections from the rows collection
        delete control.sections[ index ];

        // Update the new setting values
        self.setValue( control, currentSettings, true );
      }
    }

    // Remap the row numbers
    i = 1;
    for ( prop in control.sections ) {
      if ( control.sections.hasOwnProperty( prop ) && control.sections[ prop ] ) {
        self.updateLabel( control.sections[ prop ], control );
        i ++;
      }
    }
  },
  /**
   * Add a new section handler
   */
  add: function( control, type, data ) {
    var self = this,
        template = _.memoize( EpsilonFramework.repeater.helpers.repeaterTemplate() ),
        settingValue = self.getValue( control ),
        newSectionSetting = {},
        templateData,
        newSection,
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
    templateData = jQuery.extend( true, {}, control.params.sections[ type ].fields );

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
    newSection = new EpsilonFramework.sectionRepeater.section.constructor(
        control.currentIndex,
        jQuery( template ).appendTo( control.repeaterContainer ),
        control.params.sections[ type ].id,
        control.params.sections[ type ].title,
        control
    );

    /**
     * 1. Remove row event
     */
    newSection.container.on( 'section:remove', function( e, sectionIndex ) {
      self.delete( this, sectionIndex, control );
    } );
    /**
     * 2. Update row event
     */
    newSection.container.on( 'section:update', function( e, sectionIndex, type, fieldName, element, control ) {
      self.updateField.call( e, sectionIndex, type, fieldName, element, control );
      self.updateLabel( newSection );
    } );

    /**
     * Register the new row in the control
     *
     * @type {*}
     */
    control.sections[ control.currentIndex ] = newSection;

    /**
     * Add a new "index" to the setting ( easier to render in the frontend )
     */
    for ( i in templateData ) {
      if ( templateData.hasOwnProperty( i ) ) {
        newSectionSetting[ i ] = templateData[ i ][ 'default' ];
      }
    }

    newSectionSetting.type = type;

    /**
     * Add a value to the setting
     * @type {{}}
     */
    settingValue[ control.currentIndex ] = newSectionSetting;
    /**
     * Set it
     */
    self.setValue( control, settingValue, true, false );

    /**
     * Update index
     */
    control.currentIndex ++;

    /**
     * Return constructor
     */
    return newSection;
  },
  /**
   * Handle the adding section button
   *
   * @private
   */
  handleAddButton: function( context ) {
    var isAddBtn,
        body = jQuery( 'body' );

    context.container.find( '.epsilon-add-new-section' ).on( 'click keydown', function( e ) {
      isAddBtn = jQuery( e.target ).is( '.epsilon-add-new-section' );

      body.toggleClass( 'adding-section' );
      if ( body.hasClass( 'adding-section' ) && ! isAddBtn ) {
        context.close();
      }
    } );
  },

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
   * Get the value of the customizer option
   *
   * @param instance
   */
  getValue: function( instance ) {
    // The setting is saved in JSON
    return JSON.parse( decodeURI( instance.setting.get() ) );
  },

  /**
   * Update the label of the section
   *
   * @param section
   * @param control
   */
  updateLabel: function( section, control ) {
    var sectionLabelField,
        sectionLabel,
        sectionLabelSelector;

    section.header.find( '.repeater-row-label' ).text( section.label + ' ' + ( section.sectionIndex + 1 ) );
  },
  /**
   * Update a single field inside a row.
   * Triggered when a field has changed
   *
   * @param e Event Object
   */
  updateField: function( sectionIndex, sectionType, fieldId, element, control ) {
    var section,
        currentSettings;

    console.log( self );
    if ( ! control.sections[ sectionIndex ] ) {
      return;
    }

    if ( ! control.params.sections[ sectionType ].fields[ fieldId ] ) {
      return;
    }

    section = control.sections[ sectionIndex ];
    currentSettings = EpsilonFramework.sectionRepeater.base.getValue( control );

    element = jQuery( element );

    if ( _.isUndefined( currentSettings[ section.sectionIndex ][ fieldId ] ) ) {
      return;
    }

    switch ( control.params.sections[ sectionType ].fields[ fieldId ].type ) {
      case 'checkbox':
      case 'epsilon-toggle':
        currentSettings[ section.sectionIndex ][ fieldId ] = element.prop( 'checked' );
        break;
      default:
        currentSettings[ section.sectionIndex ][ fieldId ] = element.val();
        break;
    }

    EpsilonFramework.sectionRepeater.base.setValue( control, currentSettings, true );
  },
  /**
   * Remove a row from the instance
   *
   * @param instance
   */
  removeSection: function( instance ) {
    instance.container.slideUp( 300, function() {
      jQuery( this ).detach();
    } );
    instance.container.trigger( 'section:remove', [ instance.sectionIndex ] );
  }
};