import {
  SectionRepeaterEditor,
  SectionRepeaterSelectize,
  SectionRepeaterColorPicker,
  SectionRepeaterImage,
  SectionRepeaterNavigation,
  SectionRepeaterSlider,
  SectionRepeaterButtonGroup,
} from './external/index';

export class EpsilonSectionRepeaterRow {
  /**
   * Row index
   */
  public index: number;
  /**
   * Row Header
   */
  public header: JQuery;
  /**
   * Container
   */
  public container: JQuery;
  /**
   * Content ( this wil be minimized )
   */
  public content: JQuery;
  /**
   * Footer
   */
  public footer: JQuery;
  /**
   * Label
   */
  public label: any;
  /**
   * Section type
   */
  public type: string;
  /**
   * Data
   */
  public data: any;
  /**
   * ID
   */
  public $ID: string;
  /**
   * Row state
   */
  private _state: {
    loading: boolean,
    updatingValues: boolean,
  } = {
    loading: false,
    updatingValues: false
  };
  /**
   * External libraries
   */
  public externalLibs: Array<any>;
  /**
   * External initiators
   */
  private externalInits: {} = {
    selectize: 'SectionRepeaterSelectize',
    epsilon_text_editor: 'SectionRepeaterEditor',
    epsilon_color_picker: 'SectionRepeaterColorPicker',
    epsilon_image: 'SectionRepeaterImage',
    epsilon_customizer_navigation: 'SectionRepeaterNavigation',
    epsilon_slider: 'SectionRepeaterSlider',
    epsilon_button_group: 'SectionRepeaterButtonGroup',
  };

  /**
   * Get loading state
   */
  get loading() {
    return this._state.loading;
  }

  /**
   * Set loading state
   * @param state
   */
  set loading( state: boolean ) {
    this._state.loading = state;

    switch ( this._state.loading ) {
      case true:
        this.container.addClass( 'epsilon-section-is-loading' );
        break;
      default:
        this.container.removeClass( 'epsilon-section-is-loading' );
        break;
    }
  }

  /**
   * Basic constructor
   * @param that
   * @param rowContainer
   * @param obj
   * @param type
   */
  constructor( that, rowContainer, obj, type ) {
    this.data = obj;
    this.index = obj.index;
    this.type = type;
    this.$ID = that.$ID;
    this.label = that.$_instance.params.sections[ this.type ].title;

    this.container = rowContainer;
    this.header = this.container.find( '.repeater-row-header' );
    this.content = this.container.find( '.repeater-row-content' );
    this.footer = this.container.find( '.repeater-row-footer' );

    this.loading = true;

    this.initiateExternalLibraries();
    this.handleVisibility();
    this.updateLabel();

    this.addTabs();
    this.handleEvents( that );

    this.loading = false;
  }

  /**
   * Configure initiators
   * @private
   */
  private _configureInits() {
    const libraries = this.externalInits;

    let arr = [];
    _.each( this.data, ( e ) => {
      if ( typeof e.id === 'undefined' ||
          typeof e.type === 'undefined' ||
          e.type === 'text' ||
          e.type === 'hidden' ||
          e.type === 'select' ||
          e.type === 'epsilon-toggle'
      ) {
        return;
      }

      let prop = e.type.replace( /-/g, '_' );

      arr.push( {
        id: e.id,
        type: prop,
        init: libraries.hasOwnProperty( prop ) ? libraries[ prop ] : 'unknown'
      } );
    } );

    this.externalLibs = _.chain( arr ).groupBy( 'type' ).map( ( elements, type ) => ({ elements, type }) ).value();
  }

  /**
   * Init the external libraries
   */
  public initiateExternalLibraries() {
    this._configureInits();
    this.externalLibs.map( e => {
      let constructor = this.externalInits[ e.type ];

      typeof constructor !== 'undefined'
          ? this._constructExternal( e, constructor )
          : '';
    } );
  }

  /**
   * Constructor
   * @private
   * @param e
   * @param constructor
   */
  private _constructExternal( e, constructor ) {
    let initiated = [];
    e.elements.map( element => {
      let obj = { ...element, ...{ mainId: this.$ID, container: this.container } };
      switch ( constructor ) {
        case 'SectionRepeaterEditor':
          initiated.push(
              new SectionRepeaterEditor( obj )
          );
          break;
        case 'SectionRepeaterSelectize':
          initiated.push(
              new SectionRepeaterSelectize( obj )
          );
          break;
        case 'SectionRepeaterColorPicker':
          initiated.push(
              new SectionRepeaterColorPicker( obj )
          );
          break;
        case 'SectionRepeaterImage':
          initiated.push(
              new SectionRepeaterImage( obj )
          );
          break;
        case 'SectionRepeaterNavigation':
          initiated.push(
              new SectionRepeaterNavigation( obj )
          );
          break;
        case 'SectionRepeaterSlider':
          initiated.push(
              new SectionRepeaterSlider(
                  {
                    ...obj,
                    ...this.data[ obj.id ].choices,
                    ...{ value: this.data[ obj.id ].default }
                  }
              )
          );
          break;
        case 'SectionRepeaterButtonGroup':
          initiated.push(
              new SectionRepeaterButtonGroup( obj )
          );
          break;
        default:
          break;
      }
    } );
  }

  /**
   * Handles visibility
   */
  public handleVisibility() {
    let v = 'visible';
    if ( this.data.hasOwnProperty( `${this.type}_section_visibility` ) ) {
      v = this.data[ this.type + '_section_visibility' ].default;
    }

    this.header.addClass( `epsilon-section-${v}` );
  }

  /**
   * Updates label
   */
  public updateLabel() {
    this.header.find( '.repeater-row-label' ).html( this.label );
  }

  /**
   * Handle hide event
   */
  public handleEvents( control ) {
    this.minimizeEvent();
    this.hideEvent();
    this.removeEvent( control );
    this.updateEvent( control );
  }

  /**
   * Hide event
   */
  public hideEvent() {
    this.header.on( 'click', '.repeater-row-hide', ( event ) => {
      event.preventDefault();

      let field: JQuery = this.container.find( '[data-field="' + this.type + '_section_visibility"]' );
      let value: any = field.val();

      let vals = {
        hidden: 'visible',
        visible: 'hidden'
      };

      if ( vals.hasOwnProperty( value ) ) {
        this.header.removeClass( 'epsilon-section-visible epsilon-section-hidden' ).addClass( `epsilon-section-${vals[ value ]}` );
        field.val( vals[ value ] ).trigger( 'change' );
      }

    } );
  }

  /**
   * Click event on handler to toggle minimize
   */
  public minimizeEvent() {
    this.header.on( 'click', ( event ) => {
      if ( jQuery( event.target ).is( '.repeater-row-hide' ) ) {
        return;
      }
      if ( jQuery( event.target ).hasClass( 'epsilon-section-hidden' ) ) {
        return;
      }

      this.minimizeToggle();
    } );

    this.container.on( 'click', '.repeater-row-minimize', () => this.minimizeToggle() );
  }

  /**
   * Remove row
   * @param control
   */
  public removeEvent( control ) {
    this.container.on( 'click', '.repeater-row-remove', () => {
      this.container.slideUp( 300, () => this.container.detach() );
      control.$actions.removeSection( this );
    } );
  }

  /**
   * Update section
   */
  public updateEvent( control ) {
    this.container.on(
        'keyup change',
        'input, select, textarea, checkbox',
        ( e: any ) => {
          let value = control.$connectors.getValue(),
              type = jQuery( e.target ).attr( 'type' );

          if ( typeof type === 'undefined' && jQuery( e.target ).is( 'select' ) && jQuery( e.target ).attr( 'multiple' ) ) {
            type = 'multiple-select';
          }

          switch ( type ) {
            case 'checkbox':
            case 'epsilon-toggle':
              value[ this.index ][ jQuery( e.target ).data( 'field' ) ] = jQuery( e.target ).prop( 'checked' );
              break;
            case 'multiple-select':
              let instance: any = jQuery( e.target )[ 0 ];
              value[ this.index ][ jQuery( e.target ).data( 'field' ) ] = instance.selectize.getValue();

              break;
            default:
              value[ this.index ][ jQuery( e.target ).data( 'field' ) ] = e.target.value;
              break;
          }
          if ( control.$_instance.params[ 'selective_refresh' ] ) {
            wp.customize.previewer.send( 'updated-section-repeater', {
              control: this.$ID,
              postId: control.$_instance.params[ 'save_as_meta' ],
              value: value[ this.index ],
              index: this.index,
            } );
          }

          control.$connectors.setValue( value );
        }
    );
  }

  /**
   * Minimize toggle
   */
  public minimizeToggle() {
    this.content.slideToggle( 300, () => {
      const body = jQuery( 'body' );
      body.removeClass( 'adding-section adding-doubled-section' );

      this.container.toggleClass( 'minimized' );
      this.header.find( '.dashicons:not(.repeater-row-remove):not(.repeater-row-hide)' ).toggleClass( 'dashicons-arrow-up-alt2' ).toggleClass( 'dashicons-arrow-down-alt2' );

      jQuery( '#sections-left-' + this.$ID ).find( '.available-sections' ).removeClass( 'opened' );

      wp.customize.previewer.send( 'epsilon-section-focused', { index: this.index, closed: this.container.hasClass( 'minimized' ) } );

      this.container.siblings().map( ( idx, e ) => {
        if ( jQuery( e ).hasClass( 'minimized' ) ) { return; }

        jQuery( e ).addClass( 'minimized' );
        jQuery( e ).find( '.repeater-row-content' ).slideToggle( 300, () => {
          jQuery( e ).
              find( 'repeater-row-header' ).
              addClass( 'minimized' ).
              find( '.dashicons' ).
              toggleClass( 'dashicons-arrow-up' ).
              toggleClass( 'dashicons-arrow-down' );
        } );
      } );
    } );
  }

  /**
   * Add tabs functionality ( sections have layout/styling optional settings )
   */
  public addTabs() {
    jQuery( this.container ).find( '[data-group="regular"]' ).wrapAll( '<div data-tab-id="regular" class="tab-panel regular active"></div>' );
    jQuery( this.container ).find( '[data-group="styling"]' ).wrapAll( '<div data-tab-id="styling" class="tab-panel styling"></div>' );
    jQuery( this.container ).find( '[data-group="layout"]' ).wrapAll( '<div data-tab-id="layout" class="tab-panel layout"></div>' );
    jQuery( this.container ).find( '[data-group="colors"]' ).wrapAll( '<div data-tab-id="colors" class="tab-panel colors"></div>' );
    this._handleTabs();
  }

  /**
   * Handle tabs functionality
   * @param container
   */
  private _handleTabs() {
    let wrapper = this.container.find( 'nav' ),
        tabs = this.container.find( '[data-tab-id]' ),
        tab: JQuery;

    jQuery( wrapper ).on( 'click', 'a', ( event: JQueryEventConstructor ) => {
      event.preventDefault();
      jQuery( event.target ).siblings().removeClass( 'active' );
      jQuery( event.target ).addClass( 'active' );
      tab = this.container.find( '[data-tab-id="' + jQuery( event.target ).attr( 'data-item' ) + '"]' );
      if ( tab.length ) {
        tabs.removeClass( 'active' );
        tab.addClass( 'active' );
      }
    } );
  }
}
