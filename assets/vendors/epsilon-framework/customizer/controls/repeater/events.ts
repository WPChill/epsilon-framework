export default {
  /**
   * Adds a row to the repeater
   */
  addRowButton() {
    this.$_instance.container.find( 'button.epsilon-repeater-add' ).on( 'click keydown', ( e: JQueryEventConstructor ) => {
      e.preventDefault();
      this.$actions.addRow( false );
    } );
  },
  /**
   * Deletes a row from the repeater
   */
  deleteRowButton() {

  }
};
