import {
  SectionRepeaterEditor,
  SectionRepeaterCodeEditor,
  SectionRepeaterSelectize,
  SectionRepeaterColorPicker,
  SectionRepeaterImage,
  SectionRepeaterNavigation,
  SectionRepeaterSlider,
  SectionRepeaterButtonGroup,
  SectionRepeaterIconPicker,
  SectionRepeaterMarginsPaddings,
  SectionRepeaterVideo,
  ConditionalFields
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
   * Initiated array
   */
  public initiated: Array<any> = [];
  /**
   * Label
   */
  private _label: any;
  /**
   * Row state
   */
  private _state: {
    loading: boolean,
    updatingValues: boolean,
    toggled: boolean,
    sorting: boolean,
    isUpsell: boolean,
  } = {
    loading: false,
    updatingValues: false,
    toggled: false,
    sorting: false,
    isUpsell: false,
  };
  /**
   * External libraries
   */
  public externalLibs: Array<any>;
  /**
   * External initiators
   */
  private externalInits = {
    selectize: 'SectionRepeaterSelectize',
	epsilon_text_editor: 'SectionRepeaterEditor',
	epsilon_code_editor: 'SectionRepeaterCodeEditor',
    epsilon_color_picker: 'SectionRepeaterColorPicker',
    epsilon_image: 'SectionRepeaterImage',
    epsilon_customizer_navigation: 'SectionRepeaterNavigation',
    epsilon_slider: 'SectionRepeaterSlider',
    epsilon_button_group: 'SectionRepeaterButtonGroup',
    epsilon_icon_picker: 'SectionRepeaterIconPicker',
    epsilon_margins_paddings: 'SectionRepeaterMarginsPaddings',
    epsilon_template_select: 'SectionRepeaterButtonGroup',
    epsilon_video: 'SectionRepeaterVideo',
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
   * Toggled getter
   */
  get toggled() {
    return this._state.toggled;
  }

  /**
   * Toggled setter
   * @param state
   */
  set toggled( state ) {
    this._state.toggled = state;
  }

  /**
   * Sorting getter
   */
  get sorting() {
    return this._state.sorting;
  }

  /**
   * Sorting setter
   * @param state
   */
  set sorting( state ) {
    this._state.sorting = state;
  }

  /**
   * Sets label
   * @param state
   */
  set label( state ) {
    this._label = state;
    this.header.find( '.repeater-row-label' ).html( this._label );
  }

  /**
   * Gets label
   */
  get label() {
    return this._label;
  }

  /**
   * Sets upsell flag
   * @param state
   */
  set isUpsell( state ) {
    this._state.isUpsell = state;
    this._state.isUpsell ? this.container.addClass( 'epsilon-upsell-section' ) : this.container.removeClass( 'epsilon-upsell-section' );
  }

  /**
   * Gets upsell
   */
  get isUpsell() {
    return this._state.isUpsell;
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

    this.container = rowContainer;
    this.header = this.container.find( '.repeater-row-header' );
    this.content = this.container.find( '.repeater-row-content' );
    this.footer = this.container.find( '.repeater-row-footer' );

    this.label = that.$_instance.params.sections[ this.type ].title;
    this.isUpsell = that.$_instance.params.sections[ this.type ].upsell;

    this.loading = true;

    this.initiateExternalLibraries();
    this.handleVisibility();

    this.addTabs();
    this.handleEvents( that );
    this.handleConditionalFields();
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
        init: libraries.hasOwnProperty( prop ) ? libraries[ prop ] : 'unknown',
      } );
    } );

    this.externalLibs = _.chain( arr ).groupBy( 'type' ).map( ( elements, type ) => ({ elements, type }) ).value();
  }

  /**
   * Init the external libraries
   */
  public initiateExternalLibraries() {
    this._configureInits();
  }

  /**
   * Construct external stuff
   */
  public constructExternal() {
    this.externalLibs.map( e => {
      let constructor = this.externalInits[ e.type ];

      typeof constructor !== 'undefined'
          ? this._constructExternal( e, constructor )
          : '';
    } );

    this.toggled = true;
  }

  /**
   * Constructor
   * @private
   * @param e
   * @param constructor
   */
  private _constructExternal( e, constructor ) {
    e.elements.map( ( element, idx ) => {
      let obj = { ...element, ...{ mainId: this.$ID, container: this.container } };
      if ( this.data[ obj.id ].hasOwnProperty( 'linking' ) ) {
        obj = { ...obj, ...{ linking: this.data[ obj.id ].linking } };
      }

      switch ( constructor ) {
        case 'SectionRepeaterEditor':
          this.initiated.push(
              new SectionRepeaterEditor( obj )
          );
		  break;
		case 'SectionRepeaterCodeEditor':
          this.initiated.push(
              new SectionRepeaterCodeEditor( obj )
          );
          break;
        case 'SectionRepeaterSelectize':
          this.initiated.push(
              new SectionRepeaterSelectize( obj )
          );
          break;
        case 'SectionRepeaterColorPicker':
          this.initiated.push(
              new SectionRepeaterColorPicker( { ...obj, ...{ mode: this.data[ obj.id ].mode } } )
          );
          break;
        case 'SectionRepeaterImage':
          this.initiated.push(
              new SectionRepeaterImage( { ...obj, ...{ allSizes: this.data[ obj.id ].sizeArray } } )
          );
          break;
        case 'SectionRepeaterVideo':
          this.initiated.push(
              new SectionRepeaterVideo( obj )
          );
          break;
        case 'SectionRepeaterNavigation':
          this.initiated.push(
              new SectionRepeaterNavigation( obj )
          );
          break;
        case 'SectionRepeaterSlider':
          this.initiated.push(
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
          this.initiated.push(
              new SectionRepeaterButtonGroup( obj )
          );
          break;
        case 'SectionRepeaterIconPicker':
          this.initiated.push(
              new SectionRepeaterIconPicker( { ...obj, ...{ icons: this.data[ obj.id ].icons } } )
          );
          break;
        case 'SectionRepeaterMarginsPaddings':
          this.initiated.push(
              new SectionRepeaterMarginsPaddings( { ...obj, ...{ value: this.data[ obj.id ].default } } )
          );
          break;
        default:
          break;
      }

      if ( e.elements.length === idx + 1 ) {
        setTimeout( () => this.loading = false, 300 );
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
        'input:not(.epsilon-delegates), select:not(.epsilon-delegates), textarea:not(.epsilon-delegates), checkbox:not(.epsilon-delegates)',
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

          if ( control.$_instance.params.selective_refresh ) {
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
    if ( this.sorting ) {
      return;
    }

    if ( ! this.toggled ) {
      this.constructExternal();
    }

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
              find( '.repeater-row-header' ).
              find( '.dashicons:not(.repeater-row-remove):not(.repeater-row-hide)' ).
              toggleClass( 'dashicons-arrow-up-alt2' ).
              toggleClass( 'dashicons-arrow-down-alt2' );
        } );
      } );
    } );
  }

  /**
   * Force minimize the row
   */
  public forceMinimize() {
    this.content.slideUp( 300, () => {
      const body = jQuery( 'body' );
      body.removeClass( 'adding-section adding-doubled-section' );
      this.container.addClass( 'minimized' );
      this.header.find( '.dashicons:not(.repeater-row-remove):not(.repeater-row-hide)' ).addClass( 'dashicons-arrow-down-alt2' ).removeClass( 'dashicons-arrow-up-alt2' );
    } );
  }

  /**
   * Reset index from DOM
   */
  public forceResetIndex() {
    this.index = parseFloat( this.container.attr( 'data-row' ) );
  }

  /**
   * Add tabs functionality ( sections have layout/styling optional settings )
   */
  public addTabs() {
    const groups = [];
    ! _.isUndefined( this.data.groups ) ? _.each( this.data.groups, ( group, id ) => groups.push( id ) ) : false;

    groups.map( ( e, idx ) => {
      let active = idx === 0 ? 'active' : '';
      jQuery( this.container ).find( `[data-group="${e}"]` ).wrapAll( `<div data-tab-id="${e}" class="tab-panel ${e} ${active}"></div>` );
    } );

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

    jQuery( wrapper ).on( 'click', 'a', ( event: JQuery.Event ) => {
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

  /**
   * Init conditional fields
   */
  public handleConditionalFields() {
    new ConditionalFields( this.data, this.container );
  }
}
