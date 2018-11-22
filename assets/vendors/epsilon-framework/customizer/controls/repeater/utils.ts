export default {
  /**
   * Reset indexes
   * @param value
   */
  resetIndexes( value ) {
    this.state.rows.map( ( e, idx ) => {
      e.index = idx;
    } );

    value.map( ( e, idx ) => {
      e.index = idx;
    } );

    return value;
  },
  /**
   * Merges data
   */
  mergeData() {
    return jQuery.extend(
        true,
        {},
        /**
         * First object containing regular fields
         */
        this.$_instance.params.fields,
    );
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
          jQuery( '.customize-control-epsilon-repeater-content-field' ).html(),
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
  /**
   * Plucks values on key
   * @param obj
   */
  pluckValues( obj: any ) {
    let returnable = {
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
   * Configure & output label
   * @param that
   * @param container
   */
  getLabel( that, container ) {
    return that.$_instance.params.rowLabel.type === 'field'
        ? this._getLabelByField( that.$_instance.params.rowLabel.field, container, that )
        : that.$_instance.params.rowLabel.value;
  },
  /**
   * Gets label by field
   * @param fieldId
   * @param container
   * @param that
   * @private
   */
  _getLabelByField( fieldId, container, that ) {
    const field = container.find( `.repeater-field [data-field="${fieldId}"]` );
    let label = '';
    switch ( field.attr( 'type' ) ) {
      case 'select':
        label = that.$_instance.params.fields( fieldId ).choices[ field.val() ];
        break;
      default:
        label = field.val();
        break;
    }

    return label;
  },
  /**
   * Returns section index
   *
   * @param control
   * @return section index
   */
  decideWhereWeAre( control ) {
    const mainControl = jQuery( '.customize-control-epsilon-section-repeater' );
    let id: any = mainControl.attr( 'id' );
    id = id.replace( 'customize-', '' );
    id = id.replace( 'control-', '' );
    id = id.replace( '-', '_' );
    id = id.split( '_' );

    const postId = parseInt( id[ id.length - 1 ] );
    const controlId = id.join( '_' );
    const section = mainControl.find( '.repeater-row:not(.minimized)' );

    return {
      sectionIndex: section.attr( 'data-row' ),
      postId: postId,
      controlId: controlId,
    };
  }
};
