declare var wp: any;

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
     * Row removal
     */
    container.on( 'row:remove', ( e, data ) => this._rowRemove( e, data ) );

    /**
     * Row edit
     */
    container.on( 'row:update', _.debounce( ( e, rowIndex, fieldName, proxyTarget ) => this._rowEdit( e, rowIndex, fieldName, proxyTarget ), 500 ) );

    /**
     * Row add
     */
    container.on( 'row:add', ( e, rowIndex, data ) => this._rowAdd( e, rowIndex, data ) );

    /**
     * Row stopped draggin
     */
    container.on( 'row:stopped-dragging', ( e: JQuery.Event, data: any ) => this._sortExistingOptions( data ) );
  }

  /**
   * Row removal
   * @param e
   * @param data
   * @private
   */
  private _rowRemove( e: JQuery.Event, data: any ) {
    let index = data + 2;
    _.each( this.instance.options, ( el, idx ) => {
      if ( el.$order === index ) {
        this.instance.removeOption( el.value, false );
      }
    } );

    this._resetOptions();
  }

  /**
   * Row edit event
   * @param e
   * @param rowIndex
   * @param fieldName
   * @param proxyTarget
   * @private
   */
  private _rowEdit( e: JQuery.Event, rowIndex: number, fieldName: any, proxyTarget: any ) {
    if ( fieldName !== this.props.linking[ 1 ] ) {
      return;
    }
    /**
     * Add 2 to take in account "all" option & selectize counts from 1
     */
    let index = rowIndex + 2,
        newValue = proxyTarget.value;

    let itemToEdit = this._determineIfItemExists( index );

    if ( itemToEdit !== null ) this._updateOption( itemToEdit, newValue );

  }

  private _rowAdd( e: JQuery.Event, rowIndex: number, data: any ) {
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
    data.map( e => temp.push( e + 2 ) );
    let i = 0;
    _.each( this.instance.options, ( value, key, obj ) => {
      if ( obj[ key ].value === 'all' ) {
        return false;
      }

      obj[ key ].$order = temp[ i ];
      i ++;
    } );

    this._resetOptions();
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
