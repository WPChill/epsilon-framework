declare var require: any, EpsilonWPUrls: any, wp: any, _: any;

/**
 * Epsilon Zone Focus
 */
export class EpsilonZoneFocuser {

  /**
   * Class constructor
   */
  public constructor() {
    wp.customize.preview.bind( 'epsilon-footer-focused', _.debounce( ( object ) => {
      this.scrollTo( object );
    }, 300 ) );

    wp.customize.preview.bind( 'epsilon-header-focused', _.debounce( ( object ) => {
      this.scrollTo( object );
    }, 300 ) );
  }

  /**
   * Scrolls into view
   * @param jQel
   */
  public scrollTo( jQel ) {
    let distance = this.calculateOffsets( jQuery( jQel ) );

    jQuery( 'html, body' ).animate( {
      scrollTop: distance
    }, 500 );
  }

  /**
   * Returns a number ( distance from top to div )
   * @param {JQuery} selector
   * @returns {number}
   */
  public calculateOffsets( selector: JQuery ) {
    let offset = selector.offset();

    if ( typeof offset !== 'undefined' && offset.hasOwnProperty( 'top' ) ) {
      return offset.top;
    }

    return 0;
  }
}
