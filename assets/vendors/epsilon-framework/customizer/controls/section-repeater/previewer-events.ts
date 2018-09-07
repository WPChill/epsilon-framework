export default {
  /**
   * Event that fires from the main page
   * so we can focus our panel and repeatable section
   */
  handleNavigation() {
    wp.customize.previewer.bind( 'epsilon-section-edit', ( data: any ) => {
      /**
       * In case the section does not exist, we can terminate
       */
      if ( 'undefined' === typeof(wp.customize.section( data.customizerSection )) ) {
        return;
      }

      data.sectionTab === 'delete' ? this.$events._deleteSection.call( this, data ) : this.$events._focusSection.call( this, data );
    } );
  },

  /**
   * Focuses a given section
   * @param data
   * @private
   */
  _focusSection( data ) {
    /**
     * Iterate over the controls, minimize everything
     */
    this.state.rows.map( e => {
      if ( ! e.container.hasClass( 'minimized' ) && e.index != data.section ) {
        e.minimizeToggle();
      }
    } );

    wp.customize.section( data.customizerSection ).focus();

    /**
     * Focus repeatable section
     */
    if ( ! _.isUndefined( this.state.rows[ data.section ] ) && this.state.rows[ data.section ].container.hasClass( 'minimized' ) ) {
      this.state.rows[ data.section ].minimizeToggle();
    }

    if ( typeof data.sectionTab === 'string' ) {
      this.state.rows[ data.section ].container.find( 'nav' ).find( 'a[data-item=' + data.sectionTab + ']' ).trigger( 'click' );
    }
  },

  /**
   * Deletes a given section
   * @param data
   * @private
   */
  _deleteSection( data ) {
    this.state.rows[ data.section ].container.slideUp( 300, () => {
      this.state.rows[ data.section ].container.detach();
      this.$actions.removeSection( this.state.rows[ data.section ] );
    } );
  },

  /**
   * Event that fires from the main page
   * so we can focus our panel, repeatable section and open fields
   */
  handleNavigationToFieldRepeater() {
    wp.customize.previewer.bind( 'epsilon-field-repeater-edit', ( data: any ) => {
      /**
       * In case the section does not exist, we can terminate
       */
      if ( 'undefined' === typeof(wp.customize.section( data.customizerSection )) ) {
        return;
      }

      if ( 'undefined' === typeof(wp.customize.section( data.doubledSection )) ) {
        return;
      }

      let control = wp.customize.control( data.control ),
          section = wp.customize.section( data.doubledSection );
      /**
       * Iterate over the controls, minimize everything
       */
      this.state.rows.map( e => {
        if ( ! e.container.hasClass( 'minimized' ) && e.index != data.section ) {
          e.minimizeToggle();
        }
      } );

      wp.customize.section( data.customizerSection ).focus();

      /**
       * Focus repeatable section
       */
      if ( ! _.isUndefined( this.state.rows[ data.section ] ) && this.state.rows[ data.section ].container.hasClass( 'minimized' ) ) {
        this.state.rows[ data.section ].minimizeToggle();
      }

      if ( ! jQuery( 'body' ).hasClass( 'adding-doubled-section' ) ) {
        /**
         * Used a timeout here because toggleMinimize "closes" everything that's not related to it ( even the doubled section )
         */
        setTimeout( _ => {
          section.headContainer.trigger( 'click' );
        }, 400 );
      }

      control.container.find( '.repeater-row:not(".minimized")' ).find( '.repeater-row-header' ).trigger( 'click' );
      control.container.find( `.repeater-row[data-row='${parseFloat( data.field )}']` ).find( '.repeater-row-header' ).trigger( 'click' );
    } );
  }
};
