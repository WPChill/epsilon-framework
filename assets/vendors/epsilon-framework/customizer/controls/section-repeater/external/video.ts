declare var wp: any, EpsilonTranslations: any, EpsilonWPUrls: any;

export default class SectionRepeaterVideo {
  /**
   * Props
   */
  public props: any;
  public container: any;

  /**
   * Main constructor
   * @param obj
   */
  constructor( obj ) {
    this.props = obj;
    this.init();
  }

  /**
   * Initiate the editor
   */
  public init() {
    this.container = this.props.container.find( `[data-field="${this.props.id}"]` ).parents( '.epsilon-controller-video-container' );
    /**
     * Image controls - Upload
     */
    this.container.on( 'click keypress', '.video-upload-button', ( e: JQuery.Event ) => {
      e.preventDefault();
      if ( wp.customize.utils.isKeydownButNotEnterEvent( e ) ) {
        return;
      }

      this._videoUpload();
    } );

    /**
     * Video Controls - Removal
     */
    this.container.on( 'click keypress', '.video-upload-remove-button', ( e: JQuery.Event ) => {
      e.preventDefault();

      if ( wp.customize.utils.isKeydownButNotEnterEvent( e ) ) {
        return;
      }

      this._videoRemoval();
    } );
  }

  /**
   * Image Upload
   * @private
   */
  private _videoUpload(): void {
    let media = wp.media( {
      multiple: false, library: {
        type: 'video'
      },
    } ).open();

    /**
     * On selection, save the data in a JSON
     */
    media.on( 'select', () => {
      let input = this.container.find( 'input' ),
          temp = media.state().get( 'selection' ).first(),
          setting = { id: null, url: '' },
          val = { url: null, label: null };

      temp = temp.toJSON();
      val.url = temp.url;
      val.label = temp.filename;

      input.val( JSON.stringify( val ) );

      this._setVideo( temp );
      this.container.find( '.actions .video-upload-remove-button' ).show();
    } );
  }

  /**
   * Removes videos
   * @private
   */
  private _videoRemoval(): void {
    let thumb: JQuery = this.container.find( '.epsilon-video' );

    this.container.find( '.actions .video-upload-remove-button' ).hide();
    this.container.find( 'input' ).attr( 'value', '' ).trigger( 'change' );
    this._setVideo( { filename: EpsilonTranslations.selectVideo } );
  }

  /**
   * Sets the uploaded video
   * @private
   */
  private _setVideo( temp: { filename: any } ): void {
    /**
     * If we already have a video, we need to return that div, else we grab the placeholder
     *
     * @type {*}
     */
    let thumb = this.container.find( '.epsilon-video' ).length ? this.container.find( '.epsilon-video' ) : this.container.find( '.placeholder' );

    /**
     * We "reload" the video container
     */
    if ( thumb.length ) {
      thumb.removeClass( 'epsilon-video placeholder' ).addClass( 'epsilon-video' );
      thumb.html( '' );
      thumb.append( `<span>${temp.filename}</span>` );
    }

    this.container.find( 'input' ).trigger( 'change' );
  }
}
