/**
 * Tell customizer which section to "focus"
 *
 * @type {{}}
 */
EpsilonPreviewer.sectionEditor = {
  /**
   * Initiate the click event
   */
  init: function() {
    jQuery( document ).on( 'click', '.epsilon-section-editor', function( e ) {
      e.preventDefault();

      var object = {
        section: jQuery( this ).parents( '[data-section]' ).attr( 'data-section' ),
        customizerSection: jQuery( this ).parents( '[data-section]' ).attr( 'data-customizer-section-id' )
      };

      wp.customize.preview.send( 'epsilon-section-edit', object );
    } );
  }
};