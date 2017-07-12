/**
 * Icon Picker Initiator
 *
 * @type {{init: EpsilonFramework.iconPickers.init}}
 */
EpsilonFramework.iconPickers = {

	init: function( selector ) {
		var context = jQuery( selector );

		context.find( '.epsilon-open-iconpicker' ).click( function(){
	    	context.toggleClass( 'epsilon-iconpicker-opened' );
	    });

	    context.find( '.epsilon-icons-container .epsilon-icons' ).on( 'click', 'i', function( e ){
	    	var selectedIcon = jQuery(this).attr( 'data-icon' );
	    	context.removeClass( 'epsilon-iconpicker-opened' );
	    	context.find( '.epsilon-icon-contianer > i' ).removeClass();
	    	context.find( '.epsilon-icons > i.selected' ).removeClass( 'selected' );
	    	jQuery(this).addClass( 'selected' );
	    	context.find( '.epsilon-icon-contianer > i' ).addClass( selectedIcon );
	    	context.find( '.epsilon-icon-contianer > i' );
	    	context.find( 'input.epsilon-icon-picker' ).val( selectedIcon );
	    	context.find( 'input.epsilon-icon-picker' ).trigger( 'change' );
	    	control.setting.set( selectedIcon );
	    });

	    context.find( '.search-container input' ).keyup(function(){
	    	var filter = jQuery(this).val();
	    	context.find( '.epsilon-icons > i' ).each(function(){
	    		var text = jQuery(this).attr( 'data-search' );
	    		if ( text.search(new RegExp(filter, 'i')) < 0 ) {
	    			jQuery(this).fadeOut();
	    		}else{
	    			jQuery(this).fadeIn();
	    		}
	    	});
	    });

	    EpsilonFramework.iconPickers.builHTML( context );

	},

	builHTML: function( context ) {
		var iconsString, icons, currentIcon, iconContainer;
		iconsString = context.find( '.epsilon-icon-pack' ).val();
		icons = JSON.parse(iconsString);
		currentIcon = context.find( '.epsilon-icon-picker' ).val();
		
		iconContainer = context.find( '.epsilon-icons-container .epsilon-icons' );
		jQuery.each( icons, function( key, name ){
			var classes = key;
			if ( key === currentIcon ) {
				classes = classes + ' selected';
			}
			var iconHTML = '<i class="' + classes + '" data-icon="' + key + '" data-search="' + name + '"></i>';
			iconContainer.append( iconHTML );
		});
	}

}