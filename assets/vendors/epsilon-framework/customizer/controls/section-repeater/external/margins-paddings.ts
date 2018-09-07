export default class SectionRepeaterMarginsPaddings {
  /**
   * Props
   */
  public props: any;

  /**
   * Input
   */
  public input: any;

  /**
   * Main save object
   */
  private _value = {
    top: null,
    right: null,
    bottom: null,
    left: null,
    unit: 'px',
  };

  /**
   * Unit setter
   * @param state
   */
  set unit( state ) {
    this._value.unit = state;
  }

  /**
   * Top setter
   * @param state
   */
  set top( state ) {
    this._value.top = state;
  }

  /**
   * Right setter
   * @param state
   */
  set right( state ) {
    this._value.right = state;
  }

  /**
   * Bottom setter
   * @param state
   */
  set bottom( state ) {
    this._value.bottom = state;
  }

  /**
   * Left setter
   * @param state
   */
  set left( state ) {
    this._value.left = state;
  }

  /**
   * Gets unit
   */
  get unit() {
    return this._value.unit;
  }

  /**
   * Top getter
   */
  get top() {
    return this._value.top;
  }

  /**
   * Right getter
   */
  get right() {
    return this._value.right;
  }

  /**
   * Bottom getter
   */
  get bottom() {
    return this._value.bottom;
  }

  /**
   * Left getter
   */
  get left() {
    return this._value.left;
  }

  /**
   * Main value setter
   * @param state
   */
  set value( state ) {
    this._value = state;
  }

  /**
   * Main value getter
   */
  get value() {
    return this._value;
  }

  /**
   * Main constructor
   * @param obj
   */
  constructor( obj ) {
    this.props = obj;
    this.input = this.props.container.find( `[data-field="${this.props.id}"]` );
    this.props.container = this.input.parents( '.repeater-field' );

    this.isJson( this.props.value )
        ? this.setInitialValues()
        : this.init();
  }

  /**
   * Sets initial values
   */
  public setInitialValues() {
    const values = JSON.parse( this.props.value );
    for ( let key in values ) {
      if ( this.value.hasOwnProperty( key ) ) {
        this[ key ] = values[ key ];
        this.props.container.find( `.epsilon-additional-controls > a[data-additional="${this.unit}"]` ).addClass( 'selected' );
        this.props.container.find( `.epsilon-control-group > input[data-target="${key}"]` ).val( values[ key ] );
      }
    }

    this.init();
  }

  /**
   * Initiator
   */
  public init() {
    this.props.container.on( 'keyup', '.epsilon-control-group > input', _.debounce( e => this._handleValueChange( e ), 300 ) );
    this.props.container.on( 'click', '.epsilon-control-group > .epsilon-equalizer', e => this._equalizeInputs() );
    this.props.container.on( 'click', '.epsilon-additional-controls > a', e => this._setUnit( e ) );
  }

  /**
   * Sets unit
   * @param e
   */
  private _setUnit( e ) {
    this.unit = jQuery( e.target ).attr( 'data-additional' );
    this.props.container.find( `.epsilon-additional-controls > a` ).removeClass( 'selected' );
    this.props.container.find( `.epsilon-additional-controls > a[data-additional="${this.unit}"]` ).addClass( 'selected' );
    this.input.val( JSON.stringify( this.value ) ).trigger( 'change' );
  }

  /**
   * Handle value changes
   * @param e
   * @private
   */
  private _handleValueChange( e ) {
    let property = jQuery( e.target ).attr( 'data-target' );

    if ( this.value.hasOwnProperty( property ) ) {
      this[ property ] = e.target.value;
    }

    this.input.val( JSON.stringify( this.value ) ).trigger( 'change' );
  }

  /**
   * Equalizes columns
   * @private
   */
  private _equalizeInputs() {
    let obj = {};

    for ( let key in this.value ) {
      if ( 'unit' === key ) {
        continue;
      }
      obj[ key ] = parseInt( this.value[ key ] );
    }

    let max = Object.keys( obj ).reduce( ( m, k ) => { return obj[ k ] > m ? obj[ k ] : m; }, - Infinity );

    if ( max === - Infinity ) {
      max = 0;
    }

    for ( let key in this.value ) {
      if ( 'unit' === key ) {
        continue;
      }
      this[ key ] = max;
      this.props.container.find( `.epsilon-control-group > input[data-target="${key}"]` ).val( max ).trigger( 'keyup' );
    }
  }

  /**
   * Is JSON ?
   * @param str
   */
  public isJson( str ) {
    try {
      JSON.parse( str );
    } catch ( e ) {
      return false;
    }
    return true;
  }
}
