/**
 * Doubled section
 *
 *
 */
/*jshint -W065 */
EpsilonFramework.sectionDoubled = {
  /**
   * Section instance
   */
  section: null,
  /**
   * Parent container
   */
  parent: null,
  /**
   * Initiator
   *
   * @param selector
   */
  init: function( section ) {
    /**
     * save instance of section
     */
    this.section = section;
    /**
     * Move out of the ugly list, this has overflow hidden and we can`t display it properly
     */
    this.createParent();

    /**
     * Append new sections to parent
     */
    section.container.appendTo( this.parent );

    /**
     * Handle events
     */
    this.handleEvents();
  },
  /**
   * Create a parent container
   */
  createParent: function() {
    var parent = jQuery( '.wp-full-overlay' ).find( '.doubled-section-parent' );
    if ( ! parent.length ) {
      jQuery( '.wp-full-overlay' ).append( '<div class="doubled-section-parent"></div>' );
      parent = jQuery( '.wp-full-overlay' ).find( '.doubled-section-parent' );
      this.parent = parent;
    }
    this.parent = parent;
  },
  /**
   * Event Handlers
   *
   * @param section
   */
  handleEvents: function() {
    var section = this.section,
        self = this;

    /**
     * Close sections
     */
    this.section.container.on( 'click', '.epsilon-close-doubled-section', function( e ) {
      e.preventDefault();
      jQuery( 'body' ).removeClass( 'adding-doubled-section' );
      jQuery( 'body' ).find( '.doubled-section-opened' ).removeClass( 'doubled-section-opened' );
    } );

    /**
     * Open sections
     */
    this.section.headContainer.on( 'click', function( e ) {
      var opened,
          strippedIdHead,
          strippedIdContainer;
      e.preventDefault();

      if ( jQuery( 'body' ).hasClass( 'adding-section' ) ) {
        return;
      }

      /**
       * We need to close everything on click
       * @type {*|{}}
       */
      opened = self.parent.find( '.doubled-section-opened' );
      if ( opened.length ) {
        opened.removeClass( 'doubled-section-opened' );
      }

      if ( jQuery( 'body' ).hasClass( 'adding-doubled-section' ) ) {
        strippedIdHead = jQuery( this ).attr( 'id' ).replace( 'accordion-section-', '' );
        strippedIdContainer = opened.attr( 'id' ).replace( 'sub-accordion-section-', '' );

        if ( strippedIdContainer === strippedIdHead ) {
          jQuery( 'body' ).removeClass( 'adding-doubled-section' );
        }
      } else {
        jQuery( 'body' ).toggleClass( 'adding-doubled-section' );
      }

      jQuery.each( section.container, function( e ) {
        if ( jQuery( this ).is( 'li' ) ) {
          return;
        }
        jQuery( this ).addClass( 'doubled-section-opened' );
      } );

    } );

  }
};