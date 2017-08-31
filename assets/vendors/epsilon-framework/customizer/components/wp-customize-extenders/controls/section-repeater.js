/**
 * Epsilon Section Repeater Constructor
 */
wp.customize.controlConstructor[ 'epsilon-section-repeater' ] = wp.customize.Control.extend( {
  ready: function() {
    var control = this;

    /**
     * We need to move this element to the bottom of the page so it renders properly
     */
    jQuery( '#sections-left-' + this.params.id ).appendTo( jQuery( '.wp-full-overlay' ) );

    /**
     * Initiate search functionality
     */
    this.initSearch( this, jQuery( '#sections-left-' + this.params.id ) );
    /**
     * Get a reference to the setting field
     */
    this.settingField = this.container.find( '[data-customize-setting-link]' ).first();
    /**
     * Repeater container reference
     */
    this.repeaterContainer = this.container.find( '.repeater-sections' ).first();
    /**
     * Start incrementing sections
     *
     * @type {number}
     */
    this.currentIndex = 0;
    /**
     * Start saving rows
     * @type {Array}
     */
    this.sections = [];

    /**
     * Initiate the adding/removing events
     */
    this.handleEvents();

    /**
     * Icon Picker Events
     */
    this.initIconPicker();
    this.initImageControls();

    /**
     * Create existing sections
     */
    this.createExistingSections();

    /**
     * Start sorting
     */
    if ( this.params.sortable ) {
      this.initSortable();
    }

    /**
     * Event that fires from the main page
     * so we can focus our panel and repeatable section
     */
    wp.customize.previewer.bind( 'epsilon-section-edit', function( data ) {
      /**
       * In case the section does not exist, we can terminate
       */
      if ( 'undefined' === typeof( wp.customize.section( data.customizerSection ) ) ) {
        return false;
      }

      /**
       * Iterate over the controls, minimize everything
       */
      _.each( control.sections, function( sect, index ) {
        if ( ! sect.container.hasClass( 'minimized' ) && index !== data.section ) {
          EpsilonFramework.sectionRepeater.base.toggleMinimize( sect );
        }
      } );

      wp.customize.section( data.customizerSection ).focus();

      /**
       * Focus repeatable section
       */
      if ( ! _.isUndefined( control.sections[ data.section ] ) && control.sections[ data.section ].container.hasClass( 'minimized' ) ) {
        EpsilonFramework.sectionRepeater.base.toggleMinimize( control.sections[ data.section ] );
      }
    } );
  },
  /**
   * Handle Addition/Removal of sections
   */
  handleEvents: function() {
    var control = this,
        newSection,
        limit = false;
    /**
     * Add new repeater section handler
     */
    EpsilonFramework.sectionRepeater.base.handleAddButton( this );
    /**
     * Setup Limit
     *
     * @type {boolean}
     */
    if ( ! _.isUndefined( this.params.choices.limit ) ) {
      limit = ( 0 >= this.params.choices.limit ) ? false : parseInt( this.params.choices.limit );
    }

    /**
     * Addition of sections
     */
    jQuery( '#sections-left-' + this.params.id ).on( 'click', '.epsilon-section', function( e ) {
      e.preventDefault();
      if ( ! limit || control.currentIndex < limit ) {
        newSection = EpsilonFramework.sectionRepeater.base.add( control, jQuery( this ).attr( 'data-id' ) );
        jQuery( 'body' ).removeClass( 'adding-section' );
        /**
         * init range sliders, color pickers
         */
        EpsilonFramework.rangeSliders.init( newSection.container );
        EpsilonFramework.colorPickers.init( newSection.container.find( '.epsilon-color-picker' ) );
        EpsilonFramework.sectionRepeater.base.initTexteditor( control, newSection.container );
        newSection.container.find( '.epsilon-selectize' ).selectize( {
          plugins: [ 'remove_button' ],
        } );
      } else {
        jQuery( control.selector + ' .limit' ).addClass( 'highlight' );
      }
    } );

  },
  /**
   * Create existing sections
   */
  createExistingSections: function() {
    var control = this, newSection;
    if ( this.params.value.length ) {
      /**
       * If we have saved rows, we need to display them
       */
      _.each( this.params.value, function( subValue ) {
        newSection = EpsilonFramework.sectionRepeater.base.add( control, subValue[ 'type' ], subValue );
        if ( 'undefined' !== typeof newSection ) {
          EpsilonFramework.rangeSliders.init( newSection.container );
          EpsilonFramework.colorPickers.init( newSection.container.find( '.epsilon-color-picker' ) );
          EpsilonFramework.sectionRepeater.base.initTexteditor( control, newSection.container );
          newSection.container.find( '.epsilon-selectize' ).selectize( {
            plugins: [ 'remove_button' ],
          } );
        }
      } );
    }
  },
  /**
   * Initiate sortable functionality
   */
  initSortable: function() {
    var control = this;

    this.repeaterContainer.sortable( {
      handle: '.repeater-row-header',
      axis: 'y',
      distance: 15,
      update: function( e, data ) {
        EpsilonFramework.sectionRepeater.base.sort( control, data );
      }
    } );
  },
  /**
   * Initiate Image Controls (Upload/Remove)
   */
  initImageControls: function() {
    var control = this, temp;
    /**
     * Image controls - Upload
     */
    this.container.on( 'click keypress', '.epsilon-controller-image-container .image-upload-button', function( e ) {
      e.preventDefault();

      if ( wp.customize.utils.isKeydownButNotEnterEvent( e ) ) {
        return;
      }
      temp = jQuery( this ).parents( '.epsilon-controller-image-container' );

      EpsilonFramework.sectionRepeater.base.handleImageUpload( control, temp );
    } );

    /**
     * Image Controls - Removal
     */
    this.container.on( 'click keypress', '.epsilon-controller-image-container .image-upload-remove-button', function( e ) {
      e.preventDefault();

      if ( wp.customize.utils.isKeydownButNotEnterEvent( e ) ) {
        return;
      }

      temp = jQuery( this ).parents( '.epsilon-controller-image-container' );
      EpsilonFramework.sectionRepeater.base.handleImageRemoval( control, temp );
    } );
  },
  /**
   * Search functionality in the sections library
   *
   * @param selector
   */
  initSearch: function( instance, selector ) {
    var input = selector.find( '.sections-search-input' ),
        val, collection, id,
        self = this;

    input.on( 'keyup change', _.debounce( function( e ) {
      val = input.val().toLowerCase();
      collection = selector.find( '.epsilon-section' );

      jQuery.each( collection, function() {
        id = jQuery( this ).attr( 'data-id' ).toLowerCase();
        jQuery( this )[ id.indexOf( val ) !== - 1 ? 'show' : 'hide' ]();
      } );

    }, 1000 ) );
  },

  /**
   * Icon Picker Functionality
   */
  initIconPicker: function() {
    var control = this, temp, filter, input;

    this.container.on( 'click keypress', '.epsilon-icon-picker-repeater-container .epsilon-open-icon-picker', function( e ) {
      e.preventDefault();

      if ( wp.customize.utils.isKeydownButNotEnterEvent( e ) ) {
        return;
      }

      jQuery( this ).toggleClass( 'opened-icon-picker' );
      temp = jQuery( this ).parents( '.epsilon-icon-picker-repeater-container' );
      EpsilonFramework.sectionRepeater.base.handleIconPickerToggle( control, temp );
    } );

    this.container.on( 'click keypress', '.epsilon-icon-picker-repeater-container .epsilon-icons-container .epsilon-icons > i', function( e ) {
      e.preventDefault();

      if ( wp.customize.utils.isKeydownButNotEnterEvent( e ) ) {
        return;
      }

      temp = jQuery( this ).parents( '.epsilon-icon-picker-repeater-container' );
      EpsilonFramework.sectionRepeater.base.handleIconPickerSelection( control, this, temp );
    } );

    this.container.on( 'keyup change', '.epsilon-icon-picker-repeater-container .search-container input', _.debounce( function( e ) {
      e.preventDefault();

      if ( wp.customize.utils.isKeydownButNotEnterEvent( e ) ) {
        return;
      }

      temp = jQuery( this ).parents( '.epsilon-icon-picker-repeater-container' );
      EpsilonFramework.sectionRepeater.base.handleIconPickerFiltering( control, this, temp );

    }, 1000 ) );
  }

} );