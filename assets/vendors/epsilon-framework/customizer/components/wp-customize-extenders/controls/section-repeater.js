/**
 * Epsilon Section Repeater Constructor
 */
wp.customize.controlConstructor[ 'epsilon-section-repeater' ] = wp.customize.Control.extend( {
  ready: function() {
    var newSection, limit;
    this.settingField = this.container.find( '[data-customize-setting-link]' ).first();
    this.currentIndex = 0;
    /**
     * Set an initial value to the repeater field
     */
    EpsilonFramework.repeater.helpers.setValue( this, [], false );

    /**
     * Add new repeater section handler
     */
    EpsilonFramework.repeater.handleAddButton();
  },
} );