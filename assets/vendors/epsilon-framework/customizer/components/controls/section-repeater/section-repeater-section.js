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

    /**
     * Events
     */
    this.header.on( 'click', function() {
      EpsilonFramework.sectionRepeater.base.toggleMinimize( self );
    } );

    this.container.on( 'click', '.repeater-row-minimize', function() {
      EpsilonFramework.sectionRepeater.base.toggleMinimize( self );
    } );

    this.container.on( 'keyup change', 'input, select, textarea', function( e ) {
      self.container.trigger( 'section:update', [ self.sectionIndex, self.type, jQuery( e.target ).data( 'field' ), e.target, control ] );
    } );

    /**
     * Remove event
     */
    this.container.on( 'click', '.repeater-row-remove', function() {
      EpsilonFramework.sectionRepeater.base.removeSection( self );
    } );

    EpsilonFramework.sectionRepeater.base.updateLabel( self, control );
  },
};