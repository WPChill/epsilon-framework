/**
 * Icon Picker Initiator
 *
 * @type {{init: EpsilonFramework.iconPickers.init}}
 */
EpsilonFramework.textEditor = {
  init: function( selector ) {
    var context = jQuery( selector ), textarea, editorId;
    jQuery.each( context, function() {
      textarea = jQuery( this ).find( 'textarea' );
      editorId = jQuery( textarea ).attr( 'id' );

      // The user has disabled TinyMCE.
      if ( typeof window.tinymce === 'undefined' ) {
        wp.editor.initialize( editorId, {
          quicktags: true
        } );
        return;
      }

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