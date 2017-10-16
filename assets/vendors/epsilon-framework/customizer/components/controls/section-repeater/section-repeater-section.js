EpsilonFramework.sectionRepeater.section = {
  /**
   * Basic section constructor
   *
   * @param sectionIndex
   * @param container
   * @param label
   * @param control
   */
  constructor: function( sectionIndex, container, type, label, control ) {
    var self = this;
    this.sectionIndex = sectionIndex;
    this.container = container;
    this.label = label;
    this.type = type;
    this.header = this.container.find( '.repeater-row-header' );

    jQuery( this.container ).find( '[data-group="regular"]' ).wrapAll( '<div data-tab-id="regular" class="tab-panel regular active"></div>' );
    jQuery( this.container ).find( '[data-group="styling"]' ).wrapAll( '<div data-tab-id="styling" class="tab-panel styling"></div>' );
    jQuery( this.container ).find( '[data-group="layout"]' ).wrapAll( '<div data-tab-id="layout" class="tab-panel layout"></div>' );

    EpsilonFramework.sectionRepeater.section.handleTabs( this.container );

    /**
     * Events
     */
    this.header.on( 'click', function() {
      EpsilonFramework.sectionRepeater.base.toggleMinimize( self );
    } );

    this.container.on( 'click', '.repeater-row-minimize', function() {
      EpsilonFramework.sectionRepeater.base.toggleMinimize( self );
    } );

    this.container.on( 'keyup change', 'input, select, textarea', _.debounce( function( e ) {
      self.container.trigger( 'section:update', [ self.sectionIndex, self.type, jQuery( e.target ).data( 'field' ), e.target, control ] );
    }, 500 ) );

    /**
     * Remove event
     */
    this.container.on( 'click', '.repeater-row-remove', function() {
      EpsilonFramework.sectionRepeater.base.removeSection( self );
    } );

    EpsilonFramework.sectionRepeater.base.updateLabel( self, control );
  },
  /**
   * Handle tabs functionality
   * @param container
   */
  handleTabs: function( container ) {
    var self = container,
        wrapper = self.find( 'nav' ),
        tabs = self.find( '[data-tab-id]' ),
        items = wrapper.find( 'a' );

    jQuery( wrapper ).on( 'click', items, function( event ) {
      event.preventDefault();
      tabs.removeClass( 'active' );
      self.find( '[data-tab-id="' + jQuery( event.target ).attr( 'data-item' ) + '"]' ).addClass( 'active' );
    } );
  }
};