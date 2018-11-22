declare var wp: any;
import * as $ from 'jquery';

export class EpsilonSectionDescriptionEnhancer {
  /**
   * Array that holds the jquery objects
   * @type {any[]}
   */
  public objects: Array<any> = [];

  /**
   * Script constructor
   */
  public constructor() {
    wp.customize.bind( 'ready', () => {
      this.collectElements();
      this.handleCloseEvent();
    } );

  }

  /**
   * Handles close event
   */
  public handleCloseEvent() {
    this.objects.map( ( element ) => {
      element.show();
      element.on( 'click', '.epsilon-button-link-close-section', ( e: JQuery.Event ) => {
        element.hide( 200 );
      } );
    } );
  }

  /**
   * Collects elements and pushes them to the objects array
   */
  public collectElements() {
    jQuery( '.epsilon-button-link-close-section' ).map( ( index, element ) => {
      this.objects.push( jQuery( element ).parent() );
    } );
  }
}
