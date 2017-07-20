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
    EpsilonFramework.repeater.base.setValue( this, [], false );

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
        newRow = EpsilonFramework.repeater.base.add( control );
        /**
         * init range sliders, color pickers
         */
        EpsilonFramework.rangeSliders.init( newRow.container );
        EpsilonFramework.colorPickers.init( newRow.container.find( '.epsilon-color-picker' ) );
        EpsilonFramework.iconPickers.init( newRow, true );
        EpsilonFramework.textEditor.init( newRow.container );
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

      EpsilonFramework.repeater.base.handleImageUpload( control, temp );
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
      EpsilonFramework.repeater.base.handleImageRemoval( control, temp );
    } );

    /**
     * Icon Picker Events
     * @TODO VERIFY THIS URGENT
     */
    //control.initIconPicker();

    /**
     * If we have saved rows, we need to display them
     */
    if ( settingValue.length ) {
      _.each( settingValue, function( subValue ) {
        newRow = EpsilonFramework.repeater.base.add( control, subValue );
        /**
         * init range sliders, color pickers
         */
        EpsilonFramework.rangeSliders.init( newRow.container );
        EpsilonFramework.colorPickers.init( newRow.container.find( '.epsilon-color-picker' ) );
        EpsilonFramework.iconPickers.init( newRow, true );
        EpsilonFramework.textEditor.init( newRow.container );
      } );
    }

    /**
     * After display fields, clean the setting
     */
    EpsilonFramework.repeater.base.setValue( this, settingValue, true, true );

    /**
     * Add sortable functionality
     */
    this.repeaterContainer.sortable( {
      handle: '.repeater-row-header',
      axis: 'y',
      update: function( e, data ) {
        EpsilonFramework.repeater.base.sort( control, data );
      }
    } );
  },
} );