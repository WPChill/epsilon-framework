/**
 * WP Customizer Control Constructor
 */
wp.customize.controlConstructor[ 'epsilon-repeater' ] = wp.customize.Control.extend( {
  ready: function() {
    var control = this;
    this.initRepeater();
  },

  /**
   * Initiator
   */
  initRepeater: function() {
    var control = this,
        newRow;

    /**
     * Setting field reference
     */
    this.settingField = this.container.find( '[data-customize-setting-link]' ).first();
    
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
     * Initiate the adding/removing events
     */
    this.handleEvents();

    /**
     * Initiate Custom Controls
     */
    this.initIconPicker();
    this.initImageControls();

    /**
     * Create the existing rows
     */
    this.createExistingRows();

    /**
     * Start sorting
     */
    this.initSortable();
  },

  /**
   * Create existing rows
   */
  createExistingRows: function() {
    var control = this,
        newRow;

    if ( this.params.value.length ) {
      _.each( this.params.value, function( subValue ) {
        newRow = EpsilonFramework.repeater.base.add( control, subValue );
        /**
         * init range sliders, color pickers
         */
        EpsilonFramework.rangeSliders.init( newRow.container );
        EpsilonFramework.colorPickers.init( newRow.container.find( '.epsilon-color-picker' ) );
        EpsilonFramework.repeater.base.initTexteditor( newRow.container );
      } );
    }
  },

  /**
   * Init events
   */
  handleEvents: function() {
    var control = this,
        limit = false,
        newRow;

    /**
     * Setup Limit
     *
     * @type {boolean}
     */
    if ( ! _.isUndefined( this.params.choices.limit ) ) {
      limit = ( 0 >= this.params.choices.limit ) ? false : parseInt( this.params.choices.limit );
    }

    /**
     * Bind events for adding and removing
     *
     * 1. Click event on the ADD Row button
     */
    this.container.on( 'click', 'button.epsilon-repeater-add', function( e ) {
      e.preventDefault();
      if ( ! limit || control.currentIndex < limit ) {
        newRow = EpsilonFramework.repeater.base.add( control );
        /**
         * init range sliders, color pickers
         */
        EpsilonFramework.rangeSliders.init( newRow.container );
        EpsilonFramework.colorPickers.init( newRow.container.find( '.epsilon-color-picker' ) );
        EpsilonFramework.repeater.base.initTexteditor( newRow.container );
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
  },

  /**
   * Init the image controls (adding removing)
   */
  initImageControls: function() {
    var control = this,
        temp;
    /**
     * Image controls - Upload
     */
    this.container.on( 'click keypress', '.epsilon-controller-image-container .image-upload-button', function( e ) {
      e.preventDefault();

      if ( wp.customize.utils.isKeydownButNotEnterEvent( e ) ) {
        return;
      }
      temp = jQuery( this ).parents( '.epsilon-controller-image-container' );

      EpsilonFramework.repeater.base.handleImageUpload( control, temp );
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
      EpsilonFramework.repeater.base.handleImageRemoval( control, temp );
    } );
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
        EpsilonFramework.repeater.base.sort( control, data );
      }
    } );
  },
  /**
   * Init icon pickers
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
      EpsilonFramework.repeater.base.handleIconPickerToggle( control, temp );
    } );

    this.container.on( 'click keypress', '.epsilon-icon-picker-repeater-container .epsilon-icons-container .epsilon-icons > i', function( e ) {
      e.preventDefault();

      if ( wp.customize.utils.isKeydownButNotEnterEvent( e ) ) {
        return;
      }

      temp = jQuery( this ).parents( '.epsilon-icon-picker-repeater-container' );
      EpsilonFramework.repeater.base.handleIconPickerSelection( control, this, temp );
    } );

    this.container.on( 'keyup change', '.epsilon-icon-picker-repeater-container .search-container input', _.debounce( function( e ) {
      e.preventDefault();

      if ( wp.customize.utils.isKeydownButNotEnterEvent( e ) ) {
        return;
      }

      temp = jQuery( this ).parents( '.epsilon-icon-picker-repeater-container' );
      EpsilonFramework.repeater.base.handleIconPickerFiltering( control, this, temp );

    }, 1000 ) );
  }
} );