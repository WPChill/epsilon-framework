/**
 * WYSIWYG Control Constructor
 */
wp.customize.controlConstructor[ 'epsilon-wysiwyg' ] = wp.customize.Control.extend( {
	ready: function() {
		var control = this;

		control.container.on( 'change', 'textarea',
	        function() {
	          control.setting.set( jQuery( this ).val() );
	        }
	    );
	    control.container.find( 'textarea' ).keyup(function(){
	    	control.setting.set( jQuery( this ).val() );
	    });
	}
} );