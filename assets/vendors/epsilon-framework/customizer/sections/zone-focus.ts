declare var wp: any, EpsilonWPUrls: any;
import * as $ from 'jquery';

export class EpsilonZoneFocus {
  /**
   * Section object
   * @type []
   */
  public sections = [];

  /**
   * Class constructor
   */
  public constructor() {
    wp.customize.bind( 'ready', () => {
      this.collectSections();
      this.handleEvents();
    } );
  }

  /**
   * Collects sections that are related to footer and blog page
   */
  public collectSections(): void {
    _.each( jQuery( '[id^=accordion-section-]' ), ( element ) => {
      let id = jQuery( element ).attr( 'id' );
      if ( id.search( 'header' ) > - 1 ) {
        this.sections.push( {
          frontend: '#wrap',
          section: id,
          changePage: false,
          type: 'header',
        } );
      }

      if ( id.search( 'footer' ) > - 1 ) {
        this.sections.push( {
          frontend: '#footer',
          section: id,
          changePage: false,
          type: 'footer',
        } );
      }

      if ( EpsilonWPUrls.post_page && (id.search( 'blog' ) > - 1 || id.search( 'header_image' ) > - 1) ) {
        this.sections.push( {
          section: id,
          changePage: true,
          url: EpsilonWPUrls.post_page,
        } );
      }

      if ( EpsilonWPUrls.front_page && id.search( 'static_front_page' ) > - 1 ) {
        this.sections.push( {
          section: id,
          changePage: true,
          url: EpsilonWPUrls.front_page,
        } );
      }
    } );
  }

  /**
   * Handle events
   */
  public handleEvents(): void {
    this.sections.map( element => {
      jQuery( `#${element.section}` ).on( 'click', 'h3', ( event: JQuery.Event ) => {
        element.changePage ? this._changePage( element ) : this._scrollTo( element );
      } );
    } );
  }

  /**
   *
   * @param element
   * @private
   */
  private _changePage( element ): void {
    // wp.customize.previewer.allowedUrls.push( element.url );
    wp.customize.previewer.previewUrl( element.url );

    jQuery( `[id^=sub-${element.section}]` ).on( 'click', 'button.customize-section-back', () => {
      wp.customize.previewer.previewUrl( wp.customize.previewer.allowedUrls[ 0 ] );
    } );
  }

  /**
   * Srolls to a frontend position
   * @param el
   *
   * @private
   */
  public _scrollTo( el ): void {
    wp.customize.previewer.send( `epsilon-${el.type}-focused`, el.frontend );
  }

}

