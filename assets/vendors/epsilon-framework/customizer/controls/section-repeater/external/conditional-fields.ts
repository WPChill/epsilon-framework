export default class ConditionalFields {
  /**
   * Data
   */
  public data: any;
  /**
   * Context container
   */
  public container: JQuery;
  /**
   * Conditional fields
   */
  public conditionalFields = {};

  /**
   * Constructor
   * @param props
   * @param container
   */
  constructor( props, container ) {
    this.data = props;
    this.container = container;

    this.createConditionalObject();
  }

  /**
   * Groups fields by their condition
   */
  public createConditionalObject() {
    _.each( this.data, e => {
      if ( typeof e.condition !== 'undefined' ) {
        let field = this.container.find( `[data-field="${e.id}"]` ).parents( '.repeater-field' );
        this.conditionalFields.hasOwnProperty( e.condition[ 0 ] ) ? this._pushCondition( e.condition, field ) : this._createAndPush( e.condition, field );

        this.setInitialState( field, e.condition );
      }
    } );

    this.bindEvents();
  }

  /**
   * Sets initial state (hides, shows) of the fields
   * @param field
   * @param condition
   */
  public setInitialState( field, condition ) {
    let conditioner = this.container.find( `[data-field="${condition[ 0 ]}"]` );
    field[ this._getFieldValue( conditioner ) === condition[ 1 ] ? 'show' : 'hide' ]();
  }

  /**
   * Binds events to the form item
   */
  public bindEvents() {
    _.each( this.conditionalFields, ( el, key ) => {
      this.container.find( `[data-field="${key}"]` ).on( 'change', ( event: JQueryEventConstructor ) => {
        el.map( e => {
          e.field[ this._getFieldValue( jQuery( event.target ) ) === e.value ? 'slideDown' : 'slideUp' ]();
        } );
      } );
    } );
  }

  /**
   * Returns field value
   * @param field
   * @private
   */
  private _getFieldValue( field ) {
    let type = field.attr( 'type' ),
        val;
    switch ( type ) {
      case 'checkbox':
      case 'epsilon-toggle':
        val = field.prop( 'checked' );
        break;
      default:
        val = field.val();
        break;
    }

    return val;
  }

  /**
   * Create the array and pushes element
   *
   * @param condition
   * @param field
   * @private
   */
  private _createAndPush( condition, field ) {
    this.conditionalFields[ condition[ 0 ] ] = [];
    this.conditionalFields[ condition[ 0 ] ].push( { field: field, value: condition[ 1 ] } );
  }

  /**
   * Simple push
   *
   * @param condition
   * @param field
   * @private
   */
  private _pushCondition( condition, field ) {
    this.conditionalFields[ condition[ 0 ] ].push( { field: field, value: condition[ 1 ] } );
  }

}
