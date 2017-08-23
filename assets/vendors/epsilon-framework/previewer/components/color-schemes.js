/**
 * Realtime changes in the preview window for the color schemes
 *
 * @type {{}}
 */
EpsilonPreviewer.colorSchemes = {
  /**
   * Initiate function, listens to update-inline-color-schemes-css
   */
  init: function() {
    var self = this;
    wp.customize.preview.bind( 'update-inline-color-schemes-css', function( object ) {
      var data = {
        'action': object.action,
        'class': object.class,
        'args': object.data,
        'id': object.id
      };

      self.request( data );
    } );
  },

  /**
   * AJAX Request
   *
   * @param data
   */
  request: function( data ) {
    jQuery.ajax( {
      dataType: 'json',
      type: 'POST',
      url: EpsilonWPUrls.ajaxurl,
      data: data,
      complete: function( json ) {
        var sufix = data.action + data.id,
            style = jQuery( '#epsilon-stylesheet-' + sufix );

        if ( ! style.length ) {
          style = jQuery( 'body' ).
              append( '<style type="text/css" id="epsilon-stylesheet-' + sufix + '" />' ).
              find( '#epsilon-stylesheet-' + sufix );
        }

        style.html( json.responseText );
      }
    } );
  }
};