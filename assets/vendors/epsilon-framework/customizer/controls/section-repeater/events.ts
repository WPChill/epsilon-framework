export default {
  /**
   * Add a section to the repeater
   */
  addSectionButton() {
    this.availableSections.on( 'click', '.epsilon-section [data-action="add"]', ( e: JQuery.Event ) => {
      e.preventDefault();
      this.$actions.addSection( { type: jQuery( e.target ).parent().attr( 'data-id' ) } );

      jQuery( 'body' ).removeClass( 'adding-section' );
      jQuery( '#sections-left-' + this.$ID ).find( '.available-sections' ).removeClass( 'opened' );

      if ( this.$_instance.params.selective_refresh ) {
        wp.customize.previewer.refresh();
      }
    } );
  },
  /**
   * Listen to the add section button
   * and open the "available" sections list
   */
  addMoreSectionButton() {
    this.$_instance.container.find( '.epsilon-add-new-section' ).on( 'click keydown', ( e: JQuery.Event ) => {
      const body = jQuery( 'body' );
      if ( body.hasClass( 'adding-doubled-section' ) ) {
        return;
      }

      body.removeClass( 'importing-section' );
      body.toggleClass( 'adding-section' );

      this.importableSections.removeClass( 'opened' );
      this.availableSections.toggleClass( 'opened' );
      if ( body.hasClass( 'adding-section' ) && ! jQuery( e.target ).is( '.epsilon-add-new-section' ) ) {
        this.$_instance.control.close();
      }
    } );
  },

  /**
   * Import section button
   */
  importSectionButton() {
    this.$_instance.container.find( '.epsilon-import-sections' ).on( 'click keydown', ( e: JQuery.Event ) => {
      const body = jQuery( 'body' );
      if ( body.hasClass( 'adding-doubled-section' ) ) {
        return;
      }

      body.removeClass( 'importing-section' );
      body.toggleClass( 'adding-section' );

      this.availableSections.removeClass( 'opened' );
      this.importableSections.toggleClass( 'opened' );

      if ( body.hasClass( 'importing-section' ) && ! jQuery( e.target ).is( '.epsilon-import-sections' ) ) {
        this.$_instance.control.close();
      }
    } );
  },

  /**
   * Imports sections from list
   */
  importSections() {
    this.importableSections.on( 'click', '.epsilon-sections-import', ( e: JQuery.Event ) => {
      e.preventDefault();
      const body = jQuery( 'body' );
      let importer = jQuery( e.target ).attr( 'data-import' );
      if ( this.$_instance.params.hasOwnProperty( 'importable' ) && this.$_instance.params.importable.hasOwnProperty( importer ) ) {
        this.$_instance.params.importable[ importer ].sections.map( e => {
          e.imported = true;
          this.$actions.addSection( e );
        } );
      }

      body.removeClass( 'importing-section' );
      body.removeClass( 'adding-section' );

      this.availableSections.removeClass( 'opened' );
      this.importableSections.toggleClass( 'opened' );
    } );
  },

  /**
   * Close on back
   */
  closeOnCustomizerBack() {
    wp.customize[ 'section' ]( this.$_instance.params.section, ( instance: any ) => {
      instance.container.find( '.accordion-section-title, .customize-section-back' ).on( 'click keydown', ( event: JQuery.Event ) => {
        if ( wp.customize.utils.isKeydownButNotEnterEvent( event ) ) {
          return;
        }

        /**
         * In case we left the "sections" screen, let's close all the repeatable sections
         */
        this.state.rows.map( e => {
          if ( ! e.container.hasClass( 'minimized' ) ) {
            e.minimizeToggle();
          }
        } );

        const body = jQuery( 'body' );
        body.removeClass( 'adding-section importing-section' );
        body.find( '.doubled-section-opened' ).removeClass( 'doubled-section-opened' );

        this.availableSections.removeClass( 'opened' );
        this.importableSections.removeClass( 'opened' );
      } );
    } );
  },

  /**
   * Handle integration event
   */
  handleIntegrationEvent() {
    if ( ! this.$_instance.params.integrations ) {
      return;
    }
    jQuery( '#sections-left-' + this.$ID ).
        on( 'click', '.available-sections-tab-toggler', ( e ) => {
          e.preventDefault();
          let tab: any | string = jQuery( e.target ).attr( 'data-tab' ),
              selector;
          jQuery( e.target ).siblings().removeClass( 'active' );
          jQuery( e.target ).addClass( 'active' );

          if ( 'undefined' !== typeof tab ) {
            selector = jQuery( '[data-tab-id="' + tab + '"]' );

            selector.siblings( 'div' ).removeClass( 'active' ).slideUp();
            selector.slideDown().addClass( 'active' );
          }
        } );
  },
  /**
   * Show section description on button click
   */
  handleSectionDescription() {
    jQuery( '#sections-left-' + this.$_instance.params.id ).on( 'click', '.epsilon-section [data-action="info"]', ( e: JQuery.Event ) => {
      e.preventDefault();
      jQuery( e.target ).parent().find( '.epsilon-section-image-description' ).toggleClass( 'active' );
      jQuery( e.target ).parent().find( '.epsilon-section-description' ).toggleClass( 'active' );
    } );
  }
};
