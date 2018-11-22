declare var _: any;
declare var wp: any;

/**
 * Espilon Color Schemes Module
 */
export class EpsilonColorSchemes {
  /**
   * Context
   */
  context: JQuery | any;
  /**
   * Actual control
   */
  control: any;
  /**
   * Panel that should be "under loading state"
   */
  panel: any;
  /**
   * Loading flag
   */
  loading: boolean = false;
  /**
   * Counts how many requests we need to wait untill we set loading to false
   */
  requests: number = 0;
  /**
   * Current request index
   */
  requestsIndex: number = 0;

  /**
   * Sets loading state
   * @param state
   */
  public stateChanger( state: boolean ) {
    state ? this.startLoading() : this.stopLoading();
  }

  /**
   * Start loading function
   */
  public startLoading() {
    if ( this.loading ) {
      return;
    }
    this.loading = true;
    this.panel.addClass( 'epsilon-loading' );
  }

  /**
   * Stop loading function
   */
  public stopLoading() {
    this.requestsIndex += 1;

    if ( this.requests === this.requestsIndex ) {
      setTimeout( () => {
        this.loading = false;
        this.panel.removeClass( 'epsilon-loading' );

        this.requests = 0;
        this.requestsIndex = 0;
      }, 350 );
    }
  }

  /**
   * Class Constructor
   * @param {{container: JQuery; params: {value: number; id: string}}} control
   */
  public constructor( control: { container: JQuery, params: { value: number, id: string, default: string, stylesheet: string } } ) {
    this.control = control;
    this.context = this.control.container.find( '.epsilon-color-scheme' );
    this.panel = this.control.container.parent();
    this.panel.addClass( 'epsilon-is-loadable' );

    if ( ! this.context.length ) {
      return;
    }

    this.init();

    /**
     * Event that fires from the main page
     */
    wp.customize.previewer.bind( 'epsilon-set-color-schemes-loading', ( state: boolean ) => {
      this.stateChanger( false );
    } );
  }

  /**
   * Initiator
   */
  public init() {
    const self = this;
    /**
     * Set variables
     */
    let options = this.context.find( '.epsilon-color-scheme-option' ),
        input = this.context.parent().find( '[data-customize-setting-link]' ).first(),
        json = JSON.parse( options.first().find( 'input' ).val() ),
        api = wp.customize,
        colorSettings: Array<string> = [],
        css: { action: string, class: string, id: string, data: any } = {
          action: 'epsilon_generate_color_scheme_css',
          class: 'Epsilon_Color_Scheme',
          id: '',
          data: {}
        };

    jQuery.each( json, ( index, value ) => {
      colorSettings.push( index.toString() );
    } );

    _.each( colorSettings, function( setting: string ) {
      css.data[ setting ] = api( setting )();

      if ( 'undefined' !== typeof api.control( setting ) ) {
        api.control( setting ).container.on( 'change', 'input.epsilon-color-picker', _.debounce( function( this: any ) {
          self.stateChanger( true );

          self.context.siblings( '.epsilon-color-scheme-selected' ).
              find( '.epsilon-color-scheme-palette' ).
              find( '*[data-field-id="' + setting + '"]' ).
              css( 'background', jQuery( this ).attr( 'value' ) );

          css.data[ setting ] = api( setting )();

          self.requests += 1;
          api.previewer.send( 'update-inline-color-schemes-css', css );
        }, 250 ) );
      }
    } );

    /**
     * On clicking a color scheme, update the color pickers
     */
    options.on( 'click', function( this: any ) {
      let val = jQuery( this ).attr( 'data-color-id' ),
          json: any = jQuery( this ).find( 'input' ).val();

      if ( json ) {
        json = JSON.parse( json );
      }

      /**
       * Find the customizer options
       */
      jQuery.each( json, ( index, value ) => {
        /**
         * Set values
         */
        jQuery( `#customize-control-${String(index)}-epsilon-color-picker` ).minicolors( 'value', value );
        api( index ).set( value );

        self.context.siblings( '.epsilon-color-scheme-selected' ).find( '.epsilon-color-scheme-palette' ).find( `*[data-field-id="${String(index)}"]` ).css( 'background', value );
      } );

      /**
       * Remove the selected class from siblings
       */
      jQuery( this ).siblings( '.epsilon-color-scheme-option' ).removeClass( 'selected' );
      /**
       * Make active the current selection
       */
      jQuery( this ).addClass( 'selected' );

      /**
       * Trigger change
       */
      input.val( val ).trigger( 'change' );
    } );

    /**
     * Advanced toggler
     */
    jQuery( '.epsilon-control-dropdown' ).on( 'click', function( this: any ) {
      jQuery( this ).toggleClass( 'active' );
      jQuery( this ).find( 'span' ).toggleClass( 'dashicons-arrow-down dashicons-arrow-up' );
      self.context.slideToggle();
    } );
  }
}
