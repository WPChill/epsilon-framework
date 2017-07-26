wp.customize.bind( 'preview-ready', function() {
  wp.customize.preview.bind( 'update-inline-css', function( object ) {

    var data = {
      'action': object.action,
      'class': object.class,
      'args': object.data,
      'id': object.id
    };

    jQuery.ajax( {
      dataType: 'json',
      type: 'POST',
      url: WPUrls.ajaxurl,
      data: data,
      complete: function( json ) {
        var sufix = object.action + object.id,
            style = jQuery( '#epsilon-stylesheet-' + sufix );

        if ( ! style.length ) {
          style = jQuery( 'body' ).
              append( '<style type="text/css" id="epsilon-stylesheet-' + sufix + '" />' ).
              find( '#epsilon-stylesheet-' + sufix );
        }

        style.html( json.responseText );
      }
    } );
  } );
} );

jQuery( document ).on( 'click', '.epsilon-section-editor', function( e ) {
  e.preventDefault();

  var object = {
    section: jQuery( this ).parents( '[data-section]' ).attr( 'data-section' ),
    customizerSection: jQuery( this ).parents( '[data-section]' ).attr( 'data-customizer-section-id' )
  };

  wp.customize.preview.send( 'epsilon-section-edit', object );
} );