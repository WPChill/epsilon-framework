/**
 * Icon Picker Initiator
 *
 * @type {{init: EpsilonFramework.iconPickers.init}}
 */
EpsilonFramework.wysiwyg = {
	init: function( selector ) {
		var context = jQuery( selector ),
			textarea, editor_id;
		textarea = context.find( 'textarea' );
		editor_id = textarea.attr( 'id' );

		// The user has disabled TinyMCE.
		if ( typeof window.tinymce === 'undefined' ) {
			wp.editor.initialize( editor_id, {
				quicktags: true
			});
			return;
		}

		wp.editor.initialize( editor_id, {
			tinymce: {
				wpautop: true,
				setup: function( editor ) {
				    editor.on('change', function(e) {
				    	editor.save();
				    	jQuery( editor.getElement() ).trigger( 'change' );
				    });
				}
			},
			quicktags: true
		});

	}
}