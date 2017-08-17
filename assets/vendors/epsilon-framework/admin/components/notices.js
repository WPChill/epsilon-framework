EpsilonAdmin.notices = {
  init: function() {
    var notices = jQuery( '.epsilon-framework-notice' ),
        id, args;
    jQuery.each( notices, function() {
      jQuery( this ).on( 'click', '.notice-dismiss', function() {
        id = jQuery( this ).parent().attr( 'data-unique-id' );
        args = {
          action: [ 'Epsilon_Notifications', 'dismiss_notice' ],
          nonce: EpsilonWPUrls.ajax_nonce,
          args: {
            notice_id: jQuery( this ).parent().attr( 'data-unique-id' ),
            user_id: userSettings.uid,
          }
        },
            EpsilonAdmin.notices.request( args );
      } );
    } );
  },

  request: function( args ) {
    jQuery.ajax( {
      type: 'POST',
      data: { action: 'epsilon_framework_ajax_action', args: args },
      dataType: 'json',
      url: ajaxurl,
      /**
       * Throw errors
       *
       * @param jqXHR
       * @param textStatus
       * @param errorThrown
       */
      error: function( jqXHR, textStatus, errorThrown ) {
        console.log( jqXHR + ' :: ' + textStatus + ' :: ' + errorThrown );
      }

    } );
  }
};
