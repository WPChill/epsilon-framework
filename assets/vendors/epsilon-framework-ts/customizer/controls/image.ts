import * as $ from 'jquery';

declare var EpsilonTranslations: any;
declare var wp: any;
declare var _: any;

/**
 * Epsilon Image
 */
export class EpsilonImage {
  /**
   * Context
   */
  context: JQuery | any;
  /**
   * Actual control
   */
  control: any;

  /**
   * Class Constructor
   * @param {{container: JQuery; params: {value: number; id: string}}} control
   */
  constructor( control: { container: JQuery, params: { value: number, id: string, default: string } } ) {
    this.control = control;
    this.context = jQuery( control.container );

    this.handleEvents();
  }

  /**
   * Event handling ( click events )
   */
  public handleEvents() {
    const self = this;
    let image: any,
        temp: any,
        size: string,
        thumb: JQuery,
        setting: { id: string, url: string } = { id: '', url: '' },
        input = this.context.find( '.epsilon-controller-image-container > input' );
    /**
     * Image selection
     */
    this.context.on( 'click', '.image-upload-button', function( e: Event ) {
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

        self.saveValue( setting );
        self.setImage( setting.url );

        /**
         * Show buttons
         */
        self.context.find( '.actions .image-upload-remove-button' ).show();
        if ( ! _.isEmpty( self.control.params.default ) ) {
          self.context.find( '.actions .image-default-button' ).show();
        }
      } );
    } );

    /**
     * Image deletion
     */
    this.context.on( 'click', '.image-upload-remove-button', function( e: Event ) {
      e.preventDefault();
      thumb = self.context.find( '.epsilon-image' );
      self.saveValue( { id: '', url: '' } );

      if ( thumb.length ) {
        thumb.find( 'img' ).fadeOut( 200, function() {
          thumb.removeClass( 'epsilon-image' ).addClass( 'placeholder' ).html( EpsilonTranslations.selectFile );
        } );
      }

      /**
       * If we don`t have an image, we can hide these buttons
       */
      jQuery( e.target ).hide();
      if ( ! _.isEmpty( self.control.params.default ) ) {
        self.context.find( '.actions .image-default-button' ).show();
      }
    } );

    self.context.on( 'click', '.image-default-button', function( e: Event ) {
      e.preventDefault();
      thumb = self.context.find( '.epsilon-image' );

      self.saveValue( self.control.params.default );
      self.setImage( self.control.params.default.url );

      self.context.find( '.actions .image-upload-remove-button' ).show();
    } );
  }

  /**
   * Set image in the customizer option control
   *
   * @param control
   * @param image
   */
  public setImage( image: string ) {
    /**
     * If we already have an image, we need to return that div, else we grab the placeholder
     *
     * @type {*}
     */
    var thumb = this.context.find( '.epsilon-image' ).length ? this.context.find( '.epsilon-image' ) : this.context.find( '.placeholder' );

    /**
     * We "reload" the image container
     */
    if ( thumb.length ) {
      thumb.removeClass( 'epsilon-image placeholder' ).addClass( 'epsilon-image' );
      thumb.html( '' );
      thumb.append( '<img style="display:none" src="' + image + '" />' );
      thumb.find( 'img' ).fadeIn( 200 );
    }
  }

  /**
   * Save value in database
   *
   * @param control
   * @param val
   */
  private saveValue( val: { id: string, url: string } ) {
    var input = this.context.find( '.epsilon-controller-image-container > input' );

    if ( 'object' === typeof(val) && '' !== val.id ) {
      this.control.setting.set( JSON.stringify( val ) );
      jQuery( input ).attr( 'value', JSON.stringify( val ) ).trigger( 'change' );
    } else {
      this.control.setting.set( '' );
      jQuery( input ).attr( 'value', '' ).trigger( 'change' );
    }
  }
}
