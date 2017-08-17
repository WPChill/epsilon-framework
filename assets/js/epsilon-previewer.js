/*
 EpsilonPreviewer Object
 */

var EpsilonPreviewer = 'undefined' === typeof( EpsilonPreviewer ) ? {} : EpsilonPreviewer;

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
/**
 * Tell customizer which section to "focus"
 *
 * @type {{}}
 */
EpsilonPreviewer.sectionEditor = {
  /**
   * Initiate the click event
   */
  init: function() {
    jQuery( document ).on( 'click', '.epsilon-section-editor', function( e ) {
      e.preventDefault();

      var object = {
        section: jQuery( this ).parents( '[data-section]' ).attr( 'data-section' ),
        customizerSection: jQuery( this ).parents( '[data-section]' ).attr( 'data-customizer-section-id' )
      };

      wp.customize.preview.send( 'epsilon-section-edit', object );
    } );
  }
};
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
/**
 * Epsilon Framework Previewer Initiator
 */

wp.customize.bind( 'preview-ready', function() {
  EpsilonPreviewer.colorSchemes.init();
  EpsilonPreviewer.sectionEditor.init();
  EpsilonPreviewer.typography.init();
} );
