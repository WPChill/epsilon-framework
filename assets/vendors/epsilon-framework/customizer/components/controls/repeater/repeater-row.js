/**
 * Row object
 */
EpsilonFramework.repeater.row = {
  /**
   * Trigger a new row
   *
   * @param rowIndex
   * @param container
   * @param label
   * @param control
   */
  constructor: function( rowIndex, container, label, control ) {
    var self = this;
    this.rowIndex = rowIndex;
    this.container = container;
    this.label = label;
    this.header = this.container.find( '.repeater-row-header' );

    /**
     * Events
     */
    this.header.on( 'click', function() {
      EpsilonFramework.repeater.base.toggleMinimize( self );
    } );

    this.container.on( 'click', '.repeater-row-minimize', function() {
      EpsilonFramework.repeater.base.toggleMinimize( self );
    } );

    this.container.on( 'click', '.repeater-row-remove', function() {
      EpsilonFramework.repeater.base.removeRow( self );
    } );

    this.container.on( 'keyup change', 'input, select, textarea', function( e ) {
      self.container.trigger( 'row:update', [ self.rowIndex, jQuery( e.target ).data( 'field' ), e.target, control ] );
    } );

    EpsilonFramework.repeater.base.updateLabel( self, control );
  }
};
