jQuery( document ).ready( function( $ ) {

	wp.customize.section.each( function ( section ) {

		var sectionID = '#sub-accordion-section-'+section.id;
		console.log(section.id);
		if ( $(sectionID).find('.epsilon-tabs').length > 0 ) {
			console.log('here');
			var current_tab = $(sectionID).find('.epsilon-tabs a.epsilon-tab.active');
			var current_control = current_tab.parent().parent().parent();
			var current_controlID = current_control.attr('id');
			$(sectionID+' #'+current_controlID).nextAll().hide().addClass('tab-element');
			var fields = current_tab.data('fields');
			$(sectionID).find(fields).show();
			
			$(sectionID).find('.epsilon-tabs a.epsilon-tab').click(function(evt){
				evt.preventDefault();

				var section = $(this).parent().parent().parent().parent();
				var sectionID = section.attr('id');
				section.find('.epsilon-tabs a').removeClass('active');
				$(this).addClass('active');
				var field = $(this).parent().parent().parent();
				var fieldID = field.attr('id');
				console.log(sectionID+' '+fieldID);
				$('#'+sectionID+' #'+fieldID).nextAll().hide();
				var fields = $(this).data('fields');
				section.find(fields).show();
			});
		}

	});

});