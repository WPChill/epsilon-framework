/**
 * Handle typography changes
 * @type {{}}
 */
EpsilonPreviewer.typography = {
  /**
   * Initiate the typography realtime changes
   */
  init: function() {
    var self = this;
    wp.customize.preview.bind( 'update-inline-typography-css', function( object ) {
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
   * Handle AJAX Requests
   *
   * @param object
   */
  request: function( object ) {
    jQuery.ajax( {
      dataType: 'json',
      type: 'POST',
      url: EpsilonWPUrls.ajaxurl,
      data: object,
      complete: function( json ) {
        var style = jQuery( '#' + object.args.stylesheet + '-inline-css' ),
            font = object.args.json[ 'font-family' ],
            fontImport = '<link href="https://fonts.googleapis.com/css?family=' + font + '" rel="stylesheet">';
        if ( ! style.length ) {
          style = jQuery( 'body' ).append( '<style type="text/css" id="' + object.args.stylesheet + '-inline-css" />' ).find( '#' + object.args.stylesheet + '-inline-css' );
        }
        jQuery( 'head' ).append( fontImport );
        style.html( json.responseText );
      }
    } );
  }
};