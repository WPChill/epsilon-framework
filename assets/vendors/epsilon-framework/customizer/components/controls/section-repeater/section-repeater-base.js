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

        currentSettings = EpsilonFramework.sectionRepeater.base.cleanArray( currentSettings );
        control.sections = EpsilonFramework.sectionRepeater.base.cleanArray( control.sections );

        // Update the new setting values
        self.setValue( control, currentSettings, true );
      }
    }

    jQuery.each( control.sections, function( index, element ) {
      EpsilonFramework.sectionRepeater.base.setSectionIndex( element, index, control );
    } );

    // Remap the row numbers
    i = 1;
    for ( prop in control.sections ) {
      if ( control.sections.hasOwnProperty( prop ) && control.sections[ prop ] ) {
        self.updateLabel( control.sections[ prop ], control );
        i ++;
      }
    }

    control.currentIndex --;
  },
  /**
   * Add a new section handler
   */
  add: function( control, type, data ) {
    var self = this,
        template = _.memoize( EpsilonFramework.repeater.base.repeaterTemplate() ),
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
    if ( 'undefined' === typeof ( control.params.sections[ type ] ) ) {
      return;
    }

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

    if ( ! data ) {
      /**
       * Set it
       */
      self.setValue( control, settingValue );
    }

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
        self = this,
        body = jQuery( 'body' );

    /**
     * Get a reference for the parent section, if we close it. we must close the Section sidebar as well
     */
    wp.customize[ 'section' ]( context.params.section, function( instance ) {
      instance.container.find( '.accordion-section-title, .customize-section-back' ).on( 'click keydown', function( event ) {
        if ( wp.customize.utils.isKeydownButNotEnterEvent( event ) ) {
          return;
        }

        /**
         * In case we left the "sections" screen, let's close all the repeatable sections
         */
        _.each( context.sections, function( sect ) {
          if ( ! sect.container.hasClass( 'minimized' ) ) {
            self.toggleMinimize( sect );
          }
        } );

        body.removeClass( 'adding-section' );
      } );
    } );

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
   */
  setValue: function( instance, newValue ) {
    instance.setting.set( [] );
    instance.setting.set( newValue );
  },

  /**
   * Get the value of the customizer option
   *
   * @param instance
   */
  getValue: function( instance ) {
    return instance.setting.get();
  },

  /**
   * Update the label of the section
   *
   * @param section
   * @param control
   */
  updateLabel: function( section, control ) {
    section.header.find( '.repeater-row-label' ).text( '#' + ( section.sectionIndex + 1 ) + ' - ' + section.label );
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
  },
  /**
   * Set section's index
   *
   * @param rowIndex
   */
  setSectionIndex: function( sectionInstance, sectionIndex, control ) {
    sectionInstance.sectionIndex = sectionIndex;
    sectionInstance.container.attr( 'data-row', sectionIndex );
    sectionInstance.container.data( 'row', sectionIndex );
    EpsilonFramework.sectionRepeater.base.updateLabel( sectionInstance, control );
  },

  /**
   * Drag and drop functionality
   * @param control
   */
  sort: function( control, data ) {
    var sections = control.repeaterContainer.find( '.repeater-row' ),
        settings = EpsilonFramework.sectionRepeater.base.getValue( control ),
        newOrder = [],
        newSections = [],
        newSettings = [];

    sections.each( function( i, element ) {
      newOrder.push( jQuery( element ).data( 'row' ) );
    } );

    jQuery.each( newOrder, function( newPosition, oldPosition ) {
      newSections[ newPosition ] = control.sections[ oldPosition ];

      EpsilonFramework.sectionRepeater.base.setSectionIndex( newSections[ newPosition ], newPosition, control );
      newSettings[ newPosition ] = settings[ oldPosition ];

    } );

    EpsilonFramework.sectionRepeater.base.reinitTexteditor( control, data.item );

    control.sections = newSections;

    EpsilonFramework.sectionRepeater.base.setValue( control, newSettings );
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
        size,
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
    label = jQuery( clicked ).addClass( 'selected' ).attr( 'data-search' );

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
   * Remove the editor so we can add it again
   *
   * @param instance
   * @param container
   */
  reinitTexteditor: function( instance, container ) {
    var self = this,
        textarea = container.find( 'textarea' ),
        editorId;

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
   * Initiate the text editor in the repeater field
   *
   * @param instance
   * @param container
   */
  initTexteditor: function( instance, container ) {
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
   * Toggle vizibility
   *
   * @param instance
   */
  toggleMinimize: function( instance ) {
    instance.container.find( '.repeater-row-content' ).slideToggle( 300, function() {
      instance.container.toggleClass( 'minimized' );
      instance.header.find( '.dashicons' ).toggleClass( 'dashicons-arrow-up' ).toggleClass( 'dashicons-arrow-down' );
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