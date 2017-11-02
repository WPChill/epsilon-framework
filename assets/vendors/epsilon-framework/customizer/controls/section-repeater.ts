declare var wp: any;
declare var _: any;
import * as $ from 'jquery';

import { EpsilonFieldRepeater } from './repeater';
import { EpsilonRepeaterSectionRow } from './repeater/repeater-section-row';
import { EpsilonRepeaterSectionUtils } from './repeater/repeater-section-utils';
import { EpsilonRepeaterAddons } from './repeater/repeater-addons';

export class EpsilonSectionRepeater extends EpsilonFieldRepeater {
  /**
   * Object constructor
   * @param control
   */
  public constructor( control: { container: JQuery, setting: void, params: { rowLabel: any, value: number, id: string, fields: object, choices: { limit: number } } } ) {
    super( control );
    /**
     * We need to move this element to the bottom of the page so it renders properly
     */
    this._moveElements();
    /**
     * Events that fires from the main page
     * so we can focus our panel and repeatable section
     */
    this._handleNavigation();
    /**
     * Initiate Search on sections
     */
    this._initSearch();
  }

  /**
   * Repeater container
   * @returns {any}
   */
  public getRepeaterContainer() {
    return this.context.find( '.repeater-sections' );
  }

  /**
   * Load utilities
   * @public
   */
  public loadUtils(): any {
    return new EpsilonRepeaterSectionUtils( this );
  }

  /**
   * Create existing rows
   * @public
   */
  public createExistingRows(): void {
    const control = this;
    if ( this.control.params.value.length ) {
      for ( let i = 0; i < this.control.params.value.length; i ++ ) {
        let row: EpsilonRepeaterSectionRow | boolean,
            addons: EpsilonRepeaterAddons;

        row = control.utils.add( control.control.params.value[ i ] );
        if ( false !== row ) {
          addons = new EpsilonRepeaterAddons( control, row );
          addons.initPlugins();
        }
      }
    }
  }

  /**
   * Handle events
   * @public
   */
  public handleEvents(): void {
    const self = this;
    self.utils.addButton();

    /**
     * Addition of sections
     */
    jQuery( '#sections-left-' + this.control.params.id ).on( 'click', '.epsilon-section', function( this: any, e ) {
      e.preventDefault();
      if ( ! self.limit || self.currentIndex < self.limit ) {
        let row: EpsilonRepeaterSectionRow,
            addons: EpsilonRepeaterAddons;

        row = self.utils.add( { type: jQuery( this ).attr( 'data-id' ) } );

        addons = new EpsilonRepeaterAddons( self, row );
        addons.initPlugins();
        jQuery( 'body' ).removeClass( 'adding-section' );
        jQuery( '#sections-left-' + self.control.params.id ).find( '.available-sections' ).removeClass( 'opened' );

        if ( self.control.params[ 'selective_refresh' ] ) {
          wp.customize.previewer.refresh();
        }

      } else {
        jQuery( self.control.selector + ' .limit' ).addClass( 'highlight' );
      }
    } );

    this.context.on( 'click', '.repeater-row-remove', function( this: any, e: Event ) {
      self.handleRowDecrementor();
      if ( ! self.limit || self.currentIndex < self.limit ) {
        jQuery( self.control.selector + ' .limit' ).removeClass( 'highlight' );
      }
    } );
  }

  /**
   *
   * @private
   */
  private _handleNavigation(): void {
    const self = this;
    /**
     * Event that fires from the main page
     * so we can focus our panel and repeatable section
     */
    wp.customize.previewer.bind( 'epsilon-section-edit', function( data: any ): void {
      /**
       * In case the section does not exist, we can terminate
       */
      if ( 'undefined' === typeof( wp.customize.section( data.customizerSection ) ) ) {
        return;
      }

      /**
       * Iterate over the controls, minimize everything
       */
      _.each( self.rows, function( sect: EpsilonRepeaterSectionRow, index: number ) {
        if ( ! sect.container.hasClass( 'minimized' ) && index !== data.section ) {
          self.utils.toggleMinimize( sect );
        }
      } );

      wp.customize.section( data.customizerSection ).focus();

      /**
       * Focus repeatable section
       */
      if ( ! _.isUndefined( self.rows[ data.section ] ) && self.rows[ data.section ].container.hasClass( 'minimized' ) ) {
        self.utils.toggleMinimize( self.rows[ data.section ] );
      }
    } );
  }

  /**
   * Search functionality in the sections library
   *
   * @param selector
   */
  private _initSearch() {
    const self = this;
    let selector = jQuery( '#sections-left-' + self.control.params.id ),
        input = selector.find( '.sections-search-input' ),
        val: string | any,
        collection: JQuery,
        id: string | any;

    input.on( 'keyup change', _.debounce( function( this: any, e: Event ) {
      val = input.val();
      if ( 'undefined' !== typeof val ) {
        val = val.toLowerCase();
      }

      collection = selector.find( '.epsilon-section' );

      jQuery.each( collection, function() {
        id = jQuery( this ).attr( 'data-id' );

        if ( 'undefined' !== typeof id ) {
          id = id.toLowerCase();
        }

        jQuery( this )[ id.indexOf( val ) !== - 1 ? 'show' : 'hide' ]();
      } );

    }, 1000 ) );
  }

  /**
   * Move items "phisically"
   * @private
   */
  private _moveElements() {
    jQuery( '#sections-left-' + this.control.params.id ).appendTo( jQuery( '.wp-full-overlay' ) );
  }
}