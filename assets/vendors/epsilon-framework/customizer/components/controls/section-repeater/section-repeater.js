/**
 * Section Repeater object
 *
 * @type {{}}
 */
EpsilonFramework.sectionRepeater = {
  /**
   * Wp API
   */
  api: wp.customize || null,
  /**
   * Context
   */
  context: null,
  /**
   * Control that saves option in the database
   */
  control: null,
  /**
   * Initiator
   */
  init: function( instance ) {
    /**
     * Save Context
     */
    this.context = instance;
    /**
     * Handle adding of new sections
     */
    this.addNewSection();
    /**
     * Handle the click event
     */
    this.handleAddButton();
  },

  /**
   * Add a new section handler
   */
  add: function( control ) {
    var self = this,
        template = _.memoize( EpsilonFramework.repeater.helpers.repeaterTemplate( control ) );
  },
  /**
   * Handle the adding section button
   *
   * @private
   */
  handleAddButton: function() {
    var panel = this.context,
        isAddBtn,
        body = jQuery( 'body' );

    panel.container.find( '.epsilon-add-new-section' ).on( 'click keydown', function( e ) {
      isAddBtn = jQuery( e.target ).is( '.epsilon-add-new-section' );

      body.toggleClass( 'adding-section' );
      if ( body.hasClass( 'adding-section' ) && ! isAddBtn ) {
        panel.close();
      }
    } );
  },

  /**
   * Set the value of the customizer option
   *
   * @param instance
   * @param newValue
   * @param refresh
   */
  setValue: function( instance, newValue, refresh ) {
    console.log( newValue );
    instance.setting.set( encodeURI( JSON.stringify( newValue ) ) );
  }
};