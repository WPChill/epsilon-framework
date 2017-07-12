/**
 * Icon Picker Control Constructor
 */
wp.customize.controlConstructor[ 'epsilon-iconpicker' ] = wp.customize.Control.extend( {
	ready: function() {
		var control = this;

		control.container.on( 'change', 'input.epsilon-icon-picker',
	        function() {
	          control.setting.set( jQuery( this ).val() );
	        }
	    );
	}
} );