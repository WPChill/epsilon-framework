declare var require: any;
declare var EpsilonWPUrls: any;
declare var wp: any;
declare var _: any;

import { EpsilonAjaxRequest } from '../../utils/epsilon-ajax-request';

export class EpsilonPartialRefresh {
  /**
   * Frontend sections
   */
  public sections: Array<{ id: number | any, section: JQuery, stringId: string | any }> = [];

  /**
   * Handle the section partial refresh
   */
  constructor() {
    /**
     * Register sections
     */
    this.registerSections();
    this.handleEvents();
  }

  /**
   * Register sectiosn
   */
  public registerSections() {
    let $sections = jQuery( '[data-customizer-section-id]' );
    for ( let i = 0; i < $sections.length; i ++ ) {
      let id: any = jQuery( $sections[ i ] ).attr( 'data-section' );
      let section = {
        id: parseInt( id ),
        section: jQuery( $sections[ i ] ),
        stringId: jQuery( $sections[ i ] ).attr( 'data-customizer-section-string-id' ),
      };

      this.sections.push( section );
    }
  }

  /**
   * Handle events
   */
  public handleEvents() {
    wp.customize.preview.bind( 'updated-section-repeater', _.debounce( ( object: any ) => {
      this.changeSection( object );
    }, 300 ) );

    wp.customize.preview.bind( 'updated-field-repeater', _.debounce( ( object: any ) => {
      this.changeSectionDeeper( object );
    }, 300 ) );
  }

  /**
   * Changes the section based on the field repeater
   * @param object
   */
  public changeSectionDeeper( object: any ) {
    if ( typeof this.sections[ object.sectionIndex ] === 'undefined' ) {
      return wp.customize.preview.send( 'epsilon-refresh-page' );
    }
    let args: {
          action: Array<string>,
          nonce: string,
          args: any,
        } = {
          action: [ 'Epsilon_Page_Generator', 'refresh_partial_section' ],
          nonce: EpsilonWPUrls.ajax_nonce,
          args: {
            control: object.controlId,
            postId: object.postId,
            id: object.sectionIndex,
            sectionType: this.sections[ object.sectionIndex ].stringId
          }
        },
        Ajax: EpsilonAjaxRequest;

    Ajax = new EpsilonAjaxRequest( args );
    Ajax.request();

    this.standBySection( this.sections[ object.sectionIndex ].section );

    jQuery( Ajax ).on( 'epsilon-received-success', ( e: JQuery.Event ) => {
      this.liveSection( object.sectionIndex, this.sections[ object.sectionIndex ].section, Ajax.result.section );
      jQuery( document ).trigger( 'epsilon-selective-refresh-ready' );
    } );
  }

  /**
   * Change the section
   * @param object
   */
  public changeSection( object: any ) {
    let args: {
          action: Array<string>,
          nonce: string,
          args: any,
        } = {
          action: [ 'Epsilon_Page_Generator', 'generate_partial_section' ],
          nonce: EpsilonWPUrls.ajax_nonce,
          args: {
            control: object.control,
            postId: object.postId,
            id: object.index,
            value: object.value,
          }
        },
        Ajax: EpsilonAjaxRequest;

    Ajax = new EpsilonAjaxRequest( args );
    Ajax.request();
    this.standBySection( this.sections[ object.index ].section );

    jQuery( Ajax ).on( 'epsilon-received-success', ( e: JQuery.Event ) => {
      this.liveSection( object.index, this.sections[ object.index ].section, Ajax.result.section );
      jQuery( document ).trigger( 'epsilon-selective-refresh-ready' );
    } );
  }

  /**
   *
   * @param section
   */
  public standBySection( section: JQuery ) {
    section.animate( { opacity: .5 } );
  }

  /**
   *
   * @param sectionIndex
   * @param section
   * @param result
   */
  public liveSection( sectionIndex: number, section: JQuery, result: any ) {
    const self = this;
    section.replaceWith( result );
    self.sections = [];
    self.registerSections();
    section.animate( { opacity: 1 } );
  }
}
