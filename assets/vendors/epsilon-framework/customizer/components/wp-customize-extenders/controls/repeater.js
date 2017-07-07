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
        newRow;

    this.settingField = this.container.find( '[data-customize-setting-link]' ).first();

    /**
     * Set an initial value to the repeater field
     */
    EpsilonFramework.repeater.helpers.setValue( this, [], false );

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
        newRow = EpsilonFramework.repeater.row.add( control );
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
     * If we have saved rows, we need to display them
     */
    if ( settingValue.length ) {
      _.each( settingValue, function( subValue ) {
        newRow = EpsilonFramework.repeater.row.add( control, subValue );
      } );
    }

    /**
     * After display fields, clean the setting
     */
    EpsilonFramework.repeater.helpers.setValue( this, settingValue, true, true );
  },
} );