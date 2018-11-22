import {
  RepeaterEditor,
  RepeaterSelectize,
  RepeaterColorPicker,
  RepeaterImage,
  RepeaterSlider,
  RepeaterButtonGroup,
  RepeaterIconPicker,
  RepeaterVideo,
  ConditionalFields,
} from './external/index';

export class EpsilonRepeaterRow {
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
  public _label: any;
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
    toggled: boolean,
    sorting: boolean,
  } = {
    loading: false,
    updatingValues: false,
    toggled: false,
    sorting: false,
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
   * Label setter
   * @param string
   */
  set label( string ) {
    this._label = string;
    this.header.find( '.repeater-row-label' ).text( this.label );
  }

  /**
   * Label getter
   */
  get label() {
    return this._label;
  }

  /**
   * Initiated array
   */
  public initiated: Array<any> = [];
  /**
   * External libraries
   */
  public externalLibs: Array<any>;
  /**
   * External initiators
   */
  private externalInits = {
    selectize: 'RepeaterSelectize',
    epsilon_text_editor: 'RepeaterEditor',
    epsilon_color_picker: 'RepeaterColorPicker',
    epsilon_image: 'RepeaterImage',
    epsilon_slider: 'RepeaterSlider',
    epsilon_button_group: 'RepeaterButtonGroup',
    epsilon_icon_picker: 'RepeaterIconPicker',
    epsilon_video: 'RepeaterVideo'
  };

  /**
   * Class constructor
   * @param that
   * @param rowContainer
   * @param fields
   */
  public constructor( that, rowContainer, fields ) {
    this.data = fields;
    this.index = fields.index;
    this.$ID = that.$ID;

    this.container = rowContainer;
    this.header = this.container.find( '.repeater-row-header' );
    this.content = this.container.find( '.repeater-row-content' );
    this.footer = this.container.find( '.repeater-row-footer' );

    this.label = `${that.$utils.getLabel( that, rowContainer )}`;

    this.initiateExternalLibraries();

    this.handleEvents( that );
    this.handleConditionalFields();
    this.container.trigger( 'row:added-repeater-field', this.data );
  }

  /**
   * Initiates external libraries
   */
  public initiateExternalLibraries() {
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
      switch ( constructor ) {
        case 'RepeaterEditor':
          this.initiated.push(
              new RepeaterEditor( obj )
          );
          break;
        case 'RepeaterSelectize':
          this.initiated.push(
              new RepeaterSelectize( obj )
          );
          break;
        case 'RepeaterColorPicker':
          this.initiated.push(
              new RepeaterColorPicker( obj )
          );
          break;
        case 'RepeaterImage':
          this.initiated.push(
              new RepeaterImage( { ...obj, ...{ allSizes: this.data[ obj.id ].sizeArray } } )
          );
          break;
        case 'RepeaterVideo':
          this.initiated.push(
              new RepeaterVideo( obj )
          );
          break;
        case 'RepeaterSlider':
          this.initiated.push(
              new RepeaterSlider(
                  {
                    ...obj,
                    ...this.data[ obj.id ].choices,
                    ...{ value: this.data[ obj.id ].default }
                  }
              )
          );
          break;
        case 'RepeaterButtonGroup':
          this.initiated.push(
              new RepeaterButtonGroup( obj )
          );
          break;
        case 'RepeaterIconPicker':
          this.initiated.push(
              new RepeaterIconPicker( { ...obj, ...{ icons: this.data[ obj.id ].icons } } )
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
   * Minimize repeater field
   */
  public minimizeToggle() {
    if ( this.sorting ) {
      return;
    }
    if ( ! this.toggled ) {
      this.constructExternal();
    }

    this.content.slideToggle( 300, () => {
      this.container.toggleClass( 'minimized' );
      this.header.find( '.dashicons:not(.repeater-row-remove):not(.repeater-row-hide)' ).toggleClass( 'dashicons-arrow-up-alt2' ).toggleClass( 'dashicons-arrow-down-alt2' );
    } );
  }

  /**
   * Handle hide event
   */
  public handleEvents( control ) {
    this.minimizeEvent();
    this.removeEvent( control );
    this.updateEvent( control );
  }

  /**
   * Minimize event listener
   */
  public minimizeEvent() {
    /**
     * Click event on header to toggle minimize
     */
    this.header.on( 'click', ( event: JQuery.Event ) => {
      if ( jQuery( event.target ).is( '.repeater-row-hide' ) ) {
        return;
      }
      if ( jQuery( event.target ).hasClass( 'epsilon-section-hidden' ) ) {
        return;
      }

      this.minimizeToggle();
    } );
  }

  /**
   * Remove row event listener
   * @param control
   */
  public removeEvent( control ) {
    this.container.on( 'click', '.repeater-row-remove', () => {
      this.container.slideUp( 300, () => this.container.detach() );
      this.container.trigger( 'row:deleted-repeater-field', { index: this.index } );
      control.$actions.removeRow( this );
    } );
  }

  /**
   * Update event listener
   * @param control
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
              this.container.trigger( 'row:updated-text-field', { id: jQuery( e.target ).attr( 'data-field' ), value: e.target.value, index: this.index } );
              break;
          }

          this.label = `${control.$utils.getLabel( control, this.container )}`;

          if ( control.$_instance.params.selective_refresh ) {
            const needed = control.$utils.decideWhereWeAre( control );
            wp.customize.previewer.send( 'updated-field-repeater', {
              control: this.$ID,
              sectionIndex: needed.sectionIndex,
              postId: needed.postId,
              controlId: needed.controlId,
              value: value[ this.index ],
            } );
          }

          control.$connectors.setValue( value );
        }
    );
  }

  /**
   * Force minimize the row
   */
  public forceMinimize() {
    this.content.slideUp( 300, () => {
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
   * Init conditional fields
   */
  public handleConditionalFields() {
    new ConditionalFields( this.data, this.container );
  }
}
