import * as $ from 'jquery';

declare var EpsilonWPUrls: any;

export class EpsilonSectionRecommended {
  /**
   * Context
   */
  context: JQuery | any;
  /**
   * Control
   */
  section: any;
  /**
   * Actions count
   */
  actions: number;
  /**
   * AJAXING =)
   * @type {boolean}
   */
  ajax: boolean = false;

  /**
   * Class Constructor
   * @param {{section: JQuery; params: { id: string}}} control
   */
  constructor( section: { container: JQuery, params: { id: string } } ) {
    this.section = section;
    this.context = this.section.container;
    this.actions = this.section.params.actions.length;

    this.handleDismissals();
    this.handleEvents();
  }

  public handleDismissals(): void {
    this._dismissPlugin();
    this._dismissAction();
  }

  /**
   * Handle Events
   */
  public handleEvents(): void {
    this.context.on( 'click', '.epsilon-close-recommended-section', function( this: any, e: Event ): void {
      e.preventDefault();
      jQuery( this ).find( 'span' ).toggleClass( 'dashicons-arrow-down-alt2' );
      jQuery( '.recommended-actions_container' ).slideToggle( 200 );
    } );

    jQuery( document ).on( 'epsilon-plugin-activated', function( event: any, data: any ) {
      let container = jQuery( 'span#' + data.plugin ).parents( '.epsilon-recommended-plugins' ),
          next = container.next();

      container.fadeOut( '200', function() {
        next.css( { opacity: 1, height: 'initial' } ).fadeIn( '200' );
      } );
    } );
  }

  /**
   * Dismiss Plugin
   * @private
   */
  private _dismissPlugin() {
    const section = this;
    let trigger = this.context.find( '.epsilon-recommended-plugin-button' );
    trigger.on( 'click', function( this: any, e: Event ): void {
      const self: JQuery = jQuery( this );
      /**
       * Get the container
       * @type {JQuery}
       */
      let container: JQuery = self.parents( '.epsilon-recommended-actions-container' ),
          /**
           * Get the next element ( this will be shown next )
           */
          next: JQuery = container.next(),
          /**
           * Get the title
           *
           * @type {JQuery}
           */
          title: JQuery = container.parents( '.control-section-epsilon-section-recommended-actions' ).find( 'h3' ),
          /**
           * Create the args object for the AJAX call
           *
           * action [ Class, Method Name ]
           * args [ parameters to be sent to method ]
           *
           * @type {{action: [*], args: {id: *, option: *}}}
           */
          args: Object = {
            action: [ 'Epsilon_Notify_System', 'dismiss_required_action' ],
            nonce: EpsilonWPUrls.ajax_nonce,
            args: {
              id: jQuery( this ).attr( 'id' ),
              option: jQuery( this ).attr( 'data-option' )
            }
          },
          replace: JQuery, replaceText: string | any;

      if ( section.ajax ) {
        return;
      }

      section.ajax = true;

      jQuery.ajax( {
        type: 'POST',
        data: { action: 'epsilon_framework_ajax_action', args: args },
        dataType: 'json',
        url: EpsilonWPUrls.ajaxurl,
        success: function( data ) {
          section.ajax = false;
          /**
           * In case everything is ok, we start changing things
           */
          if ( data.status && 'ok' === data.message ) {
            /**
             * Fade the current element and show the next one.
             * We don't need to remove it at this time. Leave it to for
             * server side
             */
            container.fadeOut( '200', function() {
              if ( next.is( 'p' ) ) {
                replace = title.find( '.section-title' );
                replaceText = replace.attr( 'data-social' );

                replace.text( replaceText );
              }
              next.css( { opacity: 1, height: 'initial' } ).fadeIn( '200' );
            } );
          }
        },

        /**
         * Throw errors
         *
         * @param jqXHR
         * @param textStatus
         * @param errorThrown
         */
        error: function( jqXHR, textStatus, errorThrown ) {
          section.ajax = false;
          console.log( jqXHR + ' :: ' + textStatus + ' :: ' + errorThrown );
        }
      } );
    } );
  }

  /**
   * Dismiss Action
   * @private
   */
  private _dismissAction() {
    const section = this;
    let trigger = this.context.find( '.epsilon-dismiss-required-action' );
    trigger.on( 'click', function( this: any, e: Event ): void {
      const self: JQuery = jQuery( this );
      /**
       * Get the container
       * @type {JQuery}
       */
      let container: JQuery = self.parents( '.epsilon-recommended-actions-container' ),
          /**
           * Get the title
           *
           * @type {JQuery}
           */
          title: JQuery = container.parents( '.control-section-epsilon-section-recommended-actions' ).find( 'h3' ),
          /**
           * Get the indew from the notice
           *
           * @type {JQuery}
           */
          notice: JQuery = title.find( '.epsilon-actions-count > .current-index' ),
          /**
           * Get the next element ( this will be shown next )
           */
          next: JQuery = container.next(),
          /**
           * Create the args object for the AJAX call
           *
           * action [ Class, Method Name ]
           * args [ parameters to be sent to method ]
           *
           * @type {{action: [*], args: {id: *, option: *}}}
           */
          args: Object = {
            action: [ 'Epsilon_Notify_System', 'dismiss_required_action' ],
            nonce: EpsilonWPUrls.ajax_nonce,
            args: {
              id: jQuery( this ).attr( 'id' ),
              option: jQuery( this ).attr( 'data-option' )
            }
          },
          replace: JQuery, plugins: JQuery, replaceText: string | any,
          /**
           * Get the total
           *
           * @type {Number}
           */
          total: string | any = notice.attr( 'data-total' ),
          /**
           * Get the current index
           *
           * @type {Number}
           */
          index: string | any = container.attr( 'data-index' );

      if ( 'undefined' !== total ) {
        total = parseInt( total );
      }

      if ( 'undefined' !== index ) {
        index = parseInt( index );
      }

      if ( section.ajax ) {
        return;
      }

      section.ajax = true;

      jQuery.ajax( {
        type: 'POST',
        data: { action: 'epsilon_framework_ajax_action', args: args },
        dataType: 'json',
        url: EpsilonWPUrls.ajaxurl,
        success: function( data: any ): void {
          section.ajax = false;
          /**
           * In case everything is ok, we start changing things
           */
          if ( data.status && 'ok' === data.message ) {
            /**
             * If it's the last element, show plugins
             */
            if ( total <= index ) {
              replace = title.find( '.section-title' );
              plugins = jQuery( '.epsilon-recommended-plugins' );
              replaceText = replace.attr( 'data-social' );

              if ( plugins.length ) {
                replaceText = replace.attr( 'data-plugin_text' );
              }

              title.find( '.epsilon-actions-count' ).remove();
              replace.text( replaceText );

            }
            /**
             * Else, just change the index
             */
            else {
              notice.text( index + 1 );
            }

            /**
             * Fade the current element and show the next one.
             * We don't need to remove it at this time. Leave it to for
             * server side
             */
            container.fadeOut( '200', function() {
              next.css( { opacity: 1, height: 'initial' } ).fadeIn( '200' );
            } );
          }
        },
        /**
         * Throw errors
         *
         * @param jqXHR
         * @param textStatus
         * @param errorThrown
         */
        error: function( jqXHR, textStatus, errorThrown ) {
          console.log( jqXHR + ' :: ' + textStatus + ' :: ' + errorThrown );
          section.ajax = false;
        }
      } );
    } );
  }
}
