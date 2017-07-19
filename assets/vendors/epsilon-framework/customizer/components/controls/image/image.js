/**
 * Initiate the Image Control
 */

EpsilonFramework.image = {
  /**
   * Initiator
   */
  init: function( control ) {
    var self = this,
        image,
        temp,
        size,
        setting = {},
        thumb;

    /**
     * Image selection
     */
    control.container.on( 'click', '.image-upload-button', function( e ) {
      /**
       * Open the wp.media frame
       */
      image = wp.media( {
        multiple: false,
      } ).open();

      /**
       * On selection, save the data in a JSON
       */
      image.on( 'select', function() {
        temp = image.state().get( 'selection' ).first();
        size = input.attr( 'data-size' );

        if ( 'undefined' === typeof (temp.toJSON().sizes[ size ]) ) {
          size = 'full';
        }

        setting.id = temp.id;
        setting.url = temp.toJSON().sizes[ size ].url;
        self.saveValue( control, setting );
        self.setImage( control, setting.url );

        /**
         * Show buttons
         */
        control.container.find( '.actions .image-upload-remove-button' ).show();
        if ( ! _.isEmpty( control.params.default ) ) {
          control.container.find( '.actions .image-default-button' ).show();
        }
      } );
    } );

    /**
     * Image deletion
     */
    control.container.on( 'click', '.image-upload-remove-button', function( e ) {
      e.preventDefault();
      thumb = control.container.find( '.epsilon-image' );
      self.saveValue( control, '' );

      if ( thumb.length ) {
        thumb.find( 'img' ).fadeOut( 200, function() {
          thumb.removeClass( 'epsilon-image' ).addClass( 'placeholder' ).html( EpsilonTranslations.selectFile );
        } );
      }

      /**
       * If we don`t have an image, we can hide these buttons
       */
      jQuery( this ).hide();
      if ( ! _.isEmpty( control.params.default ) ) {
        control.container.find( '.actions .image-default-button' ).show();
      }
    } );

    control.container.on( 'click', '.image-default-button', function( e ) {
      e.preventDefault();
      thumb = control.container.find( '.epsilon-image' );

      self.saveValue( control, control.params.default );
      self.setImage( control, control.params.default.url );

      control.container.find( '.actions .image-upload-remove-button' ).show();
    } );
  },

  /**
   * Set image in the customizer option control
   *
   * @param control
   * @param image
   */
  setImage: function( control, image ) {
    /**
     * If we already have an image, we need to return that div, else we grab the placeholder
     *
     * @type {*}
     */
    var thumb = control.container.find( '.epsilon-image' ).length ? control.container.find( '.epsilon-image' ) : control.container.find( '.placeholder' );

    /**
     * We "reload" the image container
     */
    if ( thumb.length ) {
      thumb.removeClass( 'epsilon-image placeholder' ).addClass( 'epsilon-image' );
      thumb.html( '' );
      thumb.append( '<img style="display:none" src="' + image + '" />' );
      thumb.find( 'img' ).fadeIn( 200 );
    }
  },

  /**
   * Save value in database
   *
   * @param control
   * @param val
   */
  saveValue: function( control, val ) {
    var input = control.container.find( '.epsilon-controller-image-container > input' );

    if ( 'object' === typeof(val) ) {
      control.setting.set( JSON.stringify( val ) );
      jQuery( input ).attr( 'value', JSON.stringify( val ) ).trigger( 'change' );
    } else {
      control.setting.set( '' );
      jQuery( input ).attr( 'value', '' ).trigger( 'change' );
    }

  },
};