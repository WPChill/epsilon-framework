/**
 * Icon Picker Initiator
 *
 * @type {{init: EpsilonFramework.iconPickers.init}}
 */
EpsilonFramework.textEditor = {
  init: function( selector ) {
    var context = jQuery( selector );
    jQuery.each( context, function() {
      var editorId = jQuery( jQuery( this ).find( 'textarea' ) ).attr( 'id' );

      wp.editor.initialize( editorId, {
        tinymce: {
          wpautop: true,
          setup: function( editor ) {
            editor.on( 'change', function( e ) {
              editor.save();
              jQuery( editor.getElement() ).trigger( 'change' );
            } );
          }
        },
        quicktags: true
      } );
    } );
  }
};