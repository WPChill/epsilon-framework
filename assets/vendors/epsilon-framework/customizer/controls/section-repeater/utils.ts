export default {
  /**
   * Move items "phisically"
   * @private
   */
  moveElements() {
    const overlay = jQuery( '.wp-full-overlay' );

    jQuery( '#sections-left-' + this.$ID ).appendTo( overlay );
    jQuery( '#importable-sections-' + this.$ID ).appendTo( overlay );
  },
  /**
   * Reset indexes
   * @param value
   */
  resetIndexes( value ) {
    this.state.rows.map( ( e, idx ) => {
      e.index = idx;
      e.data.index = idx;
    } );

    value.map( ( e, idx ) => {
      e.index = idx;
    } );

    return value;
  },
  /**
   * Merges data
   */
  mergeData( type: string ) {
    return jQuery.extend(
        true,
        {},
        /**
         * First object containing regular fields
         */
        this.$_instance.params.sections[ type ].fields,
        { groups: this.$_instance.params.sections[ type ].groups },
    );
  },
  /**
   * Plucks values on key
   * @param obj
   */
  pluckValues( obj: any ) {
    let returnable = {
      type: obj.type,
      index: obj.index
    };
    _.each( obj, ( el ) => {
      if ( ! el.hasOwnProperty( 'id' ) ) {
        return false;
      }

      returnable[ el.id ] = el.default;
    } );

    return returnable;
  },
  /**
   * Sets template defaults
   * @param fields
   * @param defaults
   */
  setTemplateDefaults( fields, defaults ) {
    for ( let i in defaults ) {
      if ( defaults.hasOwnProperty( i ) && fields.hasOwnProperty( i ) ) {
        fields[ i ].default = defaults[ i ];
      }
    }

    return fields;
  },
  /**
   * Repeater template
   */
  repeaterTemplate() {
    return ( data: any ) => {
      let compiled = _.template(
          jQuery( '.customize-control-epsilon-repeater-content-section' ).html(),
          null,
          {
            evaluate: /<#([\s\S]+?)#>/g,
            interpolate: /\{\{\{([\s\S]+?)\}\}\}/g,
            escape: /\{\{([^\}]+?)\}\}(?!\})/g,
            variable: 'data'
          }
      );
      return compiled( data );
    };
  },
};
