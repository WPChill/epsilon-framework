import { EpsilonRangeSlider } from './range-slider';

declare var wp: any, _: any;

/**
 * Espilon Typography Module
 */
export class EpsilonTypography {
  /**
   * Context
   */
  context: JQuery | any;
  /**
   * Actual control
   */
  control: any;
  /**
   * Container
   */
  container: JQuery;
  /**
   * Main panel
   */
  panel: any;
  /**
   * Loading flag
   */
  loading: boolean = false;

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
    setTimeout( () => {
      this.loading = false;
      this.panel.removeClass( 'epsilon-loading' );

    }, 150 );
  }

  /**
   * Unique ID of the control
   */
  id: string;
  /**
   * Select collection
   */
  selects: JQuery;
  /**
   * Input collection
   */
  inputs: JQuery;
  /**
   * Range sliders
   */
  sliders: JQuery;
  /**
   * Selectize instance
   */
  _selectize: any;

  /**
   * K/V Pair
   */
  linkedFonts: Object;

  /**
   *
   * @param {} control
   */
  public constructor( control: { container: JQuery, params: { value: number, id: string, default: string, stylesheet: string, selectors: string } } ) {
    this.control = control;
    this.context = jQuery( control.container );
    this.container = this.context.find( '.epsilon-typography-container' );
    this.panel = this.control.container.parent();
    this.panel.addClass( 'epsilon-is-loadable' );
    this.selects = this.container.find( 'select' );
    this.inputs = this.container.find( '.epsilon-typography-input' );
    this.sliders = this.container.find( '.slider-container' );
    this.id = control.params.id;

    this.init();
    this.clearButton();

    /**
     * Event that fires from the main page
     */
    wp.customize.previewer.bind( 'epsilon-set-typography-loading', ( state: boolean ) => {
      this.stateChanger( false );
    } );
  }

  /**
   * Clear choices
   */
  public clearButton() {
    this.context.on( 'click', '.set-default', ( event: JQuery.Event ) => {
      this.setDefaults();
    } );
  }

  /**
   * Set control defaults
   */
  public setDefaults() {
    _.each( this.control.params.fontDefaults[ this.id ], ( value: any, key: any ) => {
      if ( _.contains( [ 'font-weight', 'font-style' ], key ) ) {
        jQuery( `#${this.id}-${key}` ).prop( 'checked', value !== '' ).trigger( 'change' );
      }

      if ( _.contains( [ 'letter-spacing', 'line-height' ], key ) ) {
        jQuery( `#${this.id}-${key}` ).val( value ).trigger( 'change' );
      }

      if ( _.contains( [ 'font-family' ], key ) ) {
        let selectInput: any = jQuery( `#${this.id}-${key}` )[ 0 ];
        selectInput = selectInput.selectize;
        selectInput.setValue( value, false );
      }

    } );
  }

  /**
   * Initiator
   */
  public init() {
    const self = this;
    let sliderSettings: {
      control: {
        container: JQuery,
        params: {
          value: number,
          id: string,
          sliderControls: {
            min: number,
            max: number,
            step: number
          }
        }
      }
    };
    /**
     * Instantiate the selectize javascript plugin
     * and the input type number
     */
    try {
      this._selectize = this.selects.selectize();
    }
    catch ( err ) {
      /**
       * In case the selectize plugin is not loaded, raise an error
       */
      console.warn( 'selectize not yet loaded' );
    }

    /**
     * On clicking the advanced options toggler,
     */
    this.context.on( 'click', '.epsilon-typography-advanced > a', function( this: any, e: Event ) {
      let toggle = jQuery( this ).attr( 'data-toggle' );
      e.preventDefault();
      jQuery( this ).toggleClass( 'active' ).parent().toggleClass( 'active' );
      jQuery( '#' + toggle ).slideToggle().addClass( 'active' );
    } );

    /**
     * Great use of the EpsilonFramework, ahoy!
     */
    jQuery.each( this.sliders, function( index: number, element: any ) {
      let sliderType = jQuery( element ).attr( 'data-slider-type' ),
          sliderSettings = {
            container: element,
            params: {
              value: 0,
              id: '',
              sliderControls: {
                min: parseFloat( jQuery( element ).find( '.ss-slider' ).attr( 'data-attr-min' ) ),
                max: parseFloat( jQuery( element ).find( '.ss-slider' ).attr( 'data-attr-max' ) ),
                step: parseFloat( jQuery( element ).find( '.ss-slider' ).attr( 'data-attr-step' ) )
              }
            }
          };

      switch ( sliderType ) {
        case 'letter-spacing':
          sliderSettings.params.value = self.control.params.inputs[ 'letter-spacing' ];
          sliderSettings.params.id = self.control.params.id + '-letter-spacing';
          break;
        case 'line-height':
          sliderSettings.params.value = self.control.params.inputs[ 'line-height' ];
          sliderSettings.params.id = self.control.params.id + '-line-height';
          break;
        default:
          sliderSettings.params.value = self.control.params.inputs[ 'font-size' ];
          sliderSettings.params.id = self.control.params.id + '-font-size';
          break;
      }

      new EpsilonRangeSlider( sliderSettings );
    } );

    this.handleEvents();
  }

  /**
   * Handle Events
   */
  public handleEvents() {
    const self = this;
    /**
     * On triggering the change event, create a json with the values and
     * send it to the preview window
     */
    this.inputs.on( 'change', _.debounce( function() {
      self.stateChanger( true );
      let val = self._parseJson();
      jQuery( '#hidden_input_' + self.id ).val( val ).trigger( 'change' );
    }, 300 ) );
  }

  /**
   * Parse/create the json and send it to the preview window
   *
   * @returns {string}
   * @private
   */
  private _parseJson() {
    const self = this;
    let object: { action: string, class: string, id: string, data: { selectors: string, stylesheet: string, json: any, id: any } } = {
          action: 'epsilon_generate_typography_css',
          class: 'Epsilon_Typography',
          id: this.control.id,
          data: {
            selectors: this.control.params.selectors,
            stylesheet: this.control.params.stylesheet,
            id: this.control.id,
            json: {},
          }
        },
        api = wp.customize;

    jQuery.each( this.inputs, function( index, value ) {
      let key: any = jQuery( value ).attr( 'id' ),
          replace = self.id + '-',
          type = jQuery( this ).attr( 'type' );

      key = key.replace( replace, '' );

      if ( 'checkbox' === type ) {
        object.data.json[ key ] = jQuery( this ).prop( 'checked' ) ? jQuery( value ).val() : '';
      } else {
        object.data.json[ key ] = jQuery( value ).val();
      }

    } );

    api.previewer.send( 'update-inline-typography-css', object );
    return JSON.stringify( object.data );
  }
}
