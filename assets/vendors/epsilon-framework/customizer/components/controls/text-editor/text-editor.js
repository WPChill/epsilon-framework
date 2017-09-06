/**
 * Icon Picker Initiator
 *
 * @type {{init: EpsilonFramework.iconPickers.init}}
 */
EpsilonFramework.textEditor = {
  init: function( selector ) {
    var context = jQuery( selector ),
        editorId = jQuery( context.find( 'textarea' ) ).attr( 'id' );

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
  }
};