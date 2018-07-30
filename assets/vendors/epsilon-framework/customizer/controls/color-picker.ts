/**
 * Espilon Color Picker Module
 */
export class EpsilonColorPicker {
  /**
   * Context
   */
  context: JQuery | any;
  /**
   * Control
   */
  control: any;
  /**
   * Settings array
   */
  settings: {
    changeDelay: any,
    theme: string,
    change: any,
    format: string,
    opacity: boolean
  };
  /**
   * Color Picker instance
   */
  instance: JQuery | any;

  /**
   *
   * @param {} control
   */
  public constructor( control: { container: JQuery, setting: void, params: { value: number, id: string } } ) {
    const self = this;
    let clear: JQuery;
    this.control = control;
    this.context = jQuery( control.container ).find( '.epsilon-color-picker' );
    this.settings = {
      changeDelay: 500,
      theme: 'default',
      change: this.changePallete,
      format: 'rgb',
      opacity: true,
    };

    if ( 'function' !== typeof jQuery.fn.minicolors ) {
      return;
    }

    if ( '' !== this.context.attr( 'placeholder' ) ) {
      this.context.defaultValue = this.context.attr( 'placeholder' );
    }

    if ( this.control.hasOwnProperty( 'params' ) && this.control.params.hasOwnProperty( 'mode' ) && 'rgba' === this.control.params.mode ) {
      this.settings.format = 'rgb';
      this.settings.opacity = true;
    }

    this.context.minicolors( this.settings );

    clear = this.context.parents( '.customize-control-epsilon-color-picker' ).find( 'a' );
    if ( ! clear.length ) {
      clear = this.context.parents( '.repeater-field-epsilon-color-picker' ).find( 'a' );
    }

    clear.on( 'click', function( e ) {
      e.preventDefault();
      self.instance = jQuery( this ).parents( '.customize-control-epsilon-color-picker' ).find( 'input.epsilon-color-picker' );
      if ( ! self.instance.length ) {
        self.instance = jQuery( this ).parents( '.repeater-field-epsilon-color-picker' ).find( 'input.epsilon-color-picker' );
      }

      self.instance.minicolors( 'value', jQuery( this ).attr( 'data-default' ) );
      self.instance.trigger( 'change' );
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
