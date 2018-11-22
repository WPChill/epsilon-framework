declare var wp: any, _: any;

export default class SectionRepeaterSelectize {
  /**
   * Props
   */
  public props: any;

  /**
   * Instance
   */
  private _instance: any;
  /**
   * Old options
   */
  private _oldOptions: Array<any>;

  /**
   * Instance setter
   * @param val
   */
  set instance( val ) {
    this._instance = val[ 0 ].selectize;
  }

  /**
   * Instance getter
   */
  get instance() {
    return this._instance;
  }

  /**
   * Old options setter
   * @param val
   */
  set oldOptions( val ) {
    this._oldOptions = val;
  }

  /**
   * Old options getter
   */
  get oldOptions() {
    return this._oldOptions;
  }

  /**
   * Main constructor
   * @param obj
   */
  constructor( obj ) {
    this.props = obj;

    this.init();

    if ( this.props.hasOwnProperty( 'linking' ) ) {
      this._handleLinking();
    }
  }

  /**
   * Initiate the editor
   */
  public init() {
    this.instance = this.props.container.find( `[data-field="${this.props.id}"]` ).selectize( {
      plugins: [ 'remove_button' ],
    } );
  }

  /**
   * Handle selectize linking
   * @private
   */
  private _handleLinking() {
    let container = jQuery( `#customize-control-${this.props.linking[ 0 ]}` );
    this.oldOptions = _.sortBy( this.instance.options, e => e.$order );

    /**
     * Row edit
     */
    container.on( 'row:updated-text-field', _.debounce( ( e, data ) => this._rowEdit( e, data ), 300 ) );

    /**
     * Row removal
     */
    container.on( 'row:deleted-repeater-field', ( e, data ) => this._rowRemove( e, data ) );

    /**
     * Row add
     */
    container.on( 'row:added-repeater-field', ( e, data ) => this._rowAdd( e, data ) );

    /**
     * Row stopped draggin
     */
    container.on( 'row:stopped-sorting', ( e, data ) => this._sortExistingOptions( data ) );
  }

  /**
   * Row removal
   * @param e
   * @param data
   * @private
   */
  private _rowRemove( e: JQuery.Event, data: any ) {
    _.each( this.instance.options, ( el, idx ) => {
      if ( el.$order === data.index + 2 ) {
        this.instance.removeOption( el.value, false );
      }
    } );

    let j = 1;
    for ( let i in this.instance.options ) {
      this.instance.options[ i ].$order = j;
      j ++;
    }

    this._resetOptions();
  }

  /**
   * Row edit event
   * @param e
   * @param data
   * @private
   */
  private _rowEdit( e: JQuery.Event, data: any ) {
    if ( data.id !== this.props.linking[ 1 ] ) {
      return;
    }

    let itemToEdit = this._determineIfItemExists( data.index + 2 );
    if ( itemToEdit !== null ) this._updateOption( itemToEdit, data.value );

  }

  /**
   * Adds a row
   *
   * @param e
   * @param data
   * @private
   */
  private _rowAdd( e: JQuery.Event, data: any ) {
    if ( data.hasOwnProperty( this.props.linking[ 1 ] ) ) {
      this._createOption( data[ this.props.linking[ 1 ] ] );
    }
  }

  /**
   * Determines if the item exists
   *
   * @param idx
   * @private
   */
  private _determineIfItemExists( idx ) {
    let option = this.oldOptions.filter( e => e.$order === idx );

    return option.length ? option[ 0 ] : null;
  }

  /**
   * Sorts existing options
   *
   * @param data
   * @private
   */
  private _sortExistingOptions( data ) {
    let temp = [];

    data.rows.map( e => {
      let value = e.container.find( `[data-field="${this.props.linking[ 1 ]}"]` ).val();
      temp.push( {
        value: value,
        text: value,
        $order: e.index + 2,
      } );
    } );

    temp.map( e => {
      _.each( this.instance.options, ( el, idx, obj ) => {
        if ( el.value === e.value ) {
          obj[ idx ].$order = e.$order;
        }
      } );
    } );
  }

  /**
   * Creates new option
   * @param newValue
   * @private
   */
  private _createOption( newValue ) {
    this.instance.addOption( { value: newValue.default, text: newValue.default } );
    this._resetOptions();
  }

  /**
   * Updates a given option
   * @param itemToEdit
   * @param newValue
   * @private
   */
  private _updateOption( itemToEdit, newValue ) {
    this.instance.updateOption( itemToEdit.value, { text: newValue, value: newValue } );
    this._resetOptions();
  }

  /**
   * Resets option
   * @private
   */
  private _resetOptions() {
    this.instance.clearCache();
    this.instance.refreshOptions( false );
    this.oldOptions = _.sortBy( this.instance.options, e => e.$order );
  }

}
