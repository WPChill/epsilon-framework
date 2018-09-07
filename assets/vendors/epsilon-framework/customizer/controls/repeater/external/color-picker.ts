declare var wp: any;

export default class RepeaterColorPicker {
  /**
   * Props
   */
  public props: any;

  /**
   * Main constructor
   * @param obj
   */
  constructor( obj ) {
    this.props = obj;

    this.init();
  }

  /**
   * Initiate the editor
   */
  public init() {
    let el = this.props.container.find( `[data-field="${this.props.id}"]` ),
        settings = {
          changeDelay: 500,
          theme: 'default',
          change: this.changePallete,
          format: 'rgb',
          opacity: true,
        };

    if ( 'function' !== typeof jQuery.fn.minicolors ) {
      return;
    }

    if ( '' !== el.attr( 'placeholder' ) ) {
      el.defaultValue = el.attr( 'placeholder' );
    }

    el.minicolors( settings );

    let clear = el.parents( '.repeater-field-epsilon-color-picker' ).find( 'a' );

    clear.on( 'click', ( e ) => {
      e.preventDefault();
      let instance = jQuery( e.target ).parents( '.repeater-field-epsilon-color-picker' ).find( 'input.epsilon-color-picker' );

      instance.minicolors( 'value', jQuery( e.target ).attr( 'data-default' ) );
      instance.trigger( 'change' );
    } );
  }

  /**
   * Real time changes to the "pallete"
   *
   * @param value
   * @param opacity
   */
  public changePallete( value: any, opacity: any ) {
    jQuery( '.epsilon-color-scheme-selected' ).find( '*[data-field-id="' + jQuery( this ).attr( 'data-customize-setting-link' ) + '"]' ).css( 'background-color', value );
  }
}
