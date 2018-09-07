export default {
  /**
   * Value setter
   * @param val
   */
  setValue( val ) {
    this.$_instance.setting.set( [] );
    this.$_instance.setting.set( val );
  },
  /**
   * Value getter
   */
  getValue() {
    return this.$_instance.setting.get();
  },
  /**
   * Adds a new section in the database
   */
  addNewRow( obj ) {
    let value = this.$connectors.getValue();
    value.push( obj );
    this.$connectors.setValue( value );
  }
};
