import { EpsilonRepeaterRow } from './row';

export default {
  /**
   * Adds a row to the repeater container
   */
  addRow( obj ) {
    let template = _.memoize( this.template ),
        fields;

    if ( ! template ) {
      return false;
    }

    fields = this.$utils.mergeData.call( this );
    fields = this.$utils.setTemplateDefaults( fields, obj );
    fields.index = this.state.currentIndex;
    this.state.currentIndex += 1;

    if ( ! obj ) {
      for ( let key in fields ) {
        if ( typeof fields[ key ].default !== 'undefined' ) {
          fields[ key ].default = fields[ key ].randomize ? `${fields[ key ].default} ${this.state.currentIndex}` : fields[ key ].default;
        }
      }
    }

    template = template( fields );
    this.state.rows.push(
        new EpsilonRepeaterRow( this, jQuery( template ).appendTo( this.repeaterContainer ), fields )
    );

    if ( ! obj ) {
      this.$connectors.addNewRow( this.$utils.pluckValues( fields ) );

      if ( this.$_instance.params.selective_refresh ) {
        const needed = this.$utils.decideWhereWeAre( this );
        wp.customize.previewer.send( 'updated-field-repeater', {
          control: this.$ID,
          sectionIndex: needed.sectionIndex,
          postId: needed.postId,
          controlId: needed.controlId,
        } );
      }
    }

    return this.state.rows[ fields.index ];
  },

  /**
   * Removes a row from the container
   * @param obj
   */
  removeRow( obj ) {
    this.loading = true;
    this.state.rows.splice( obj.index, 1 );
    let value = this.$connectors.getValue();
    value = value.filter( e => obj.index !== e.index );
    value = this.$utils.resetIndexes.call( this, value );
    this.$connectors.setValue( value );
    this.loading = false;
    this.state.currentIndex = this.state.rows.length;

    if ( this.$_instance.params.selective_refresh ) {
      const needed = this.$utils.decideWhereWeAre( this );
      wp.customize.previewer.send( 'updated-field-repeater', {
        control: this.$ID,
        sectionIndex: needed.sectionIndex,
        postId: needed.postId,
        controlId: needed.controlId,
      } );
    }

    return obj.index;
  },

  /**
   * Sorts sections
   * @param e
   * @param data
   */
  sortRows( e, data ) {
    /**
     * small hack, wp editor needs to be destroyed/initiated when dom changes
     */
    data.item.trigger( 'epsilon-changed-position' );

    let i = 0;
    this.repeaterContainer.find( '.repeater-row' ).map( ( index, el ) => {
      jQuery( el ).attr( 'data-row', i );
      i ++;
    } );

    this.state.rows.map( e => e.forceResetIndex() );
    let value = this.$connectors.getValue();
    value.map( ( e, index ) => {
      value[ index ].index = this.state.rows[ index ].index;
    } );

    this.state.rows = _.sortBy( this.state.rows, ( e ) => e.index );
    value = _.sortBy( value, ( e ) => e.index );

    this.repeaterContainer.trigger( 'row:stopped-sorting', { rows: this.state.rows } );

    this.$connectors.setValue( value );

    if ( this.$_instance.params.selective_refresh ) {
      const needed = this.$utils.decideWhereWeAre( this );
      wp.customize.previewer.send( 'updated-field-repeater', {
        control: this.$ID,
        sectionIndex: needed.sectionIndex,
        postId: needed.postId,
        controlId: needed.controlId,
      } );
    }
  },
};
