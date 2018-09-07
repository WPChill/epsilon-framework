export default class RepeaterSlider {
  /**
   * Props
   */
  public props: any;

  public id: any;

  /**
   * Main constructor
   * @param obj
   */
  constructor( obj ) {
    this.props = obj;
    this.init();
  }

  public init() {
    /**
     * Lets define context
     */
    let input = this.props.container.find( `[data-field="${this.props.id}"]` );
    /**
     * Our container is its direct parent
     */
    this.props.container = input.parent();

    let slider = this.props.container.find( '.ss-slider' ),
        inputId = input.attr( 'id' ),
        id = slider.attr( 'id' ),
        instance = jQuery( '#' + id );

    instance.slider( {
      value: this.props.value,
      range: 'min',
      min: this.props.min,
      max: this.props.max,
      step: this.props.step,
      /**
       * Removed Change event because server was flooded with requests from
       * javascript, sending changesets on each increment.
       *
       * @param event
       * @param ui
       */
      slide: function( event: Event, ui: { value: number } ) {
        jQuery( '#' + inputId ).attr( 'value', ui.value );
      },
      /**
       * Bind the change event to the "actual" stop
       * @param event
       * @param ui
       */
      stop: function( event: Event, ui: { value: number } ) {
        jQuery( '#' + inputId ).trigger( 'change' );
      }
    } );

    jQuery( input ).on( 'focus', function() {
      jQuery( this ).trigger( 'blur' );
    } );

    jQuery( '#' + inputId ).attr( 'value', (instance.slider( 'value' )) );
  }
}
