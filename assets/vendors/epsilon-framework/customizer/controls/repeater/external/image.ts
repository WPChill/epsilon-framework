import { EpsilonAjaxRequest } from '../../../../utils/epsilon-ajax-request';

declare var wp: any, EpsilonTranslations: any, EpsilonWPUrls: any;

export default class RepeaterImage {
  /**
   * Props
   */
  public props: any;
  public container: any;
  public allSizes: any;

  /**
   * Main constructor
   * @param obj
   */
  constructor( obj ) {
    this.props = obj;
    this.allSizes = this.props.allSizes;

    this.init();
  }

  /**
   * Initiate the editor
   */
  public init() {
    this.container = this.props.container.find( `[data-field="${this.props.id}"]` ).parents( '.epsilon-controller-image-container' );
    /**
     * Image controls - Upload
     */
    this.container.on( 'click keypress', '.placeholder, .epsilon-image, .image-replace-button', ( e: JQuery.Event ) => {

      e.preventDefault();
      if ( wp.customize.utils.isKeydownButNotEnterEvent( e ) ) {
        return;
      }

      this._imageUpload();
    } );

    /**
     * Image Controls - Removal
     */
	this.container.on( 'click keypress', '.image-remove-button', ( e: JQuery.Event ) => {
      e.preventDefault();

      if ( wp.customize.utils.isKeydownButNotEnterEvent( e ) ) {
        return;
      }

      this._imageRemoval();
    } );
  }

  /**
   * Image Upload
   * @private
   */
  private _imageUpload(): void {
    let image = wp.media( { multiple: false } ).open();

    let optionsStr = '<option value="full">Full</option>';
    for ( let key in this.allSizes ) {
      optionsStr += `<option value="${key}">${key}</option>`;
    }

    jQuery( image.el ).find( '.media-frame-toolbar > .media-toolbar' ).append(
        `<label>
            <select id="epsilon-image-size-selector">
               ${optionsStr}
            </select>
        </label>`
    );

    jQuery( '#epsilon-image-size-selector' ).val( this.container.find( 'input' ).attr( 'data-size' ) );

    /**
     * On selection, save the data in a JSON
     */
    image.on( 'select', () => {
      let input = this.container.find( 'input' ),
          temp = image.state().get( 'selection' ).first(),
          size: any = jQuery( '#epsilon-image-size-selector' ).val(),
          setting = { id: null, url: '' },
          val;

      if ( 'undefined' === typeof (temp.toJSON().sizes[ size ]) ) {
        size = 'full';
      }

      setting.id = temp.id;
      setting.url = temp.toJSON().sizes[ size ].url;

      val = ('url' === input.attr( 'data-save-mode' )) ? setting.url : setting.id;
      input.val( val );

	  this._setImage( setting.url );

	  this.container.find( '.actions .image-replace-button' ).show();
	  this.container.find( '.actions .image-remove-button' ).show();

      jQuery( '#epsilon-image-size-selector' ).detach();
    } );
  }

  /**
   * Removes image
   * @private
   */
  private _imageRemoval(): void {
    let thumb: JQuery = this.container.find( '.epsilon-image' );

    if ( thumb.length ) {
      thumb.find( 'img' ).fadeOut( 200, () => {
        let html = EpsilonTranslations.selectFile + '<span class="recommended-size"></span>',
            Ajax: EpsilonAjaxRequest,
            data = {
              action: [ 'Epsilon_Helper', 'get_image_sizes' ],
              nonce: EpsilonWPUrls.ajax_nonce,
              args: [],
            },
            size: any = this.container.find( 'input' ).attr( 'data-size' );

        thumb.removeClass( 'epsilon-image' ).addClass( 'placeholder' ).html( html );
        Ajax = new EpsilonAjaxRequest( data );
        Ajax.request();

        jQuery( Ajax ).on( 'epsilon-received-success', ( e: JQuery.Event ) => {
          if ( ! _.isUndefined( Ajax.result[ size ] ) ) {
            thumb.find( '.recommended-size' ).text( Ajax.result[ size ].width + ' x ' + Ajax.result[ size ].height );
          }
        } );

      } );
    }

	this.container.find( '.actions .image-replace-button' ).hide();
	this.container.find( '.actions .image-remove-button' ).hide();

    this.container.find( 'input' ).attr( 'value', '' ).trigger( 'change' );
  }

  /**
   * Sets the uploaded image
   * @private
   */
  private _setImage( url: string ): void {
    /**
     * If we already have an image, we need to return that div, else we grab the placeholder
     *
     * @type {*}
     */
    let thumb = this.container.find( '.epsilon-image' ).length ? this.container.find( '.epsilon-image' ) : this.container.find( '.placeholder' );

    /**
     * We "reload" the image container
     */
    if ( thumb.length ) {
      thumb.removeClass( 'epsilon-image placeholder' ).addClass( 'epsilon-image' );
      thumb.html( '' );
      thumb.append( '<img style="display:none" src="' + url + '" />' );
      thumb.find( 'img' ).fadeIn( 200 );
    }

    this.container.find( 'input' ).trigger( 'change' );
  }
}
