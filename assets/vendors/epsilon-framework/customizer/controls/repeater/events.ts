export default {
  /**
   * Adds a row to the repeater
   */
  addRowButton() {
    this.$_instance.container.find( 'button.epsilon-repeater-add' ).on( 'click keydown', ( e: JQuery.Event ) => {
      e.preventDefault();
      this.$actions.addRow( false );
    } );
  },
  /**
   * Deletes a row from the repeater
   */
  deleteRowButton() {

  },
  /**
   * Event that fires from the main page
   * so we can delete the needed field
   */
  handleFieldDeletion() {
    wp.customize.previewer.bind( 'epsilon-refresh-page', _ => {
      wp.customize.previewer.refresh();
    } );
    wp.customize.previewer.bind( 'epsilon-field-repeater-delete', ( data: any ) => {
      if ( this.$ID === data[ 'control' ] ) {
        this.state.rows[ data.index ].container.slideUp( 300, () => {
          this.state.rows[ data.index ].container.detach();
          this.$actions.removeRow( this.state.rows[ data.index ] );

          this.repeaterContainer.find( '.repeater-row' ).map( ( index, el ) => {
            jQuery( el ).attr( 'data-row', index );
            console.log( index );
          } );

          this.state.rows.map( e => e.forceResetIndex() );
        } );
      }
    } );
  },
};
