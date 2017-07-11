/**
 * Epsilon Section Repeater Constructor
 */
wp.customize.controlConstructor[ 'epsilon-section-repeater' ] = wp.customize.Control.extend( {
  ready: function() {
    var control = this,
        settingValue = this.params.value,
        newSection, limit;

    /**
     * We need to move this element to the bottom of the page so it renders properly
     */
    jQuery( '#sections-left-' + this.params.id ).appendTo( jQuery( '.wp-full-overlay' ) );

    this.settingField = this.container.find( '[data-customize-setting-link]' ).first();
    this.repeaterContainer = this.container.find( '.repeater-sections' ).first();
    this.currentIndex = 0;
    /**
     * Start saving rows
     * @type {Array}
     */
    this.sections = [];
    /**
     * Set an initial value to the repeater field
     */
    EpsilonFramework.sectionRepeater.base.setValue( this, [], false );

    /**
     * Add new repeater section handler
     */
    EpsilonFramework.sectionRepeater.base.handleAddButton( this );

    /**
     * Addition of sections
     */
    jQuery( '#sections-left-' + this.params.id ).on( 'click', '.epsilon-section', function( e ) {
      EpsilonFramework.sectionRepeater.base.add( control, jQuery( this ).attr( 'data-id' ) );
    } );

    console.log( settingValue.length );
    /**
     * If we have saved rows, we need to display them
     */
    if ( settingValue.length ) {
      _.each( settingValue, function( subValue ) {
        newSection = EpsilonFramework.sectionRepeater.base.add( control, subValue[ 'type' ], subValue );
      } );
    }

    /**
     * After display fields, clean the setting
     */
    EpsilonFramework.sectionRepeater.base.setValue( this, settingValue, true, true );
  },
} );