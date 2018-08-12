declare var _: any, EpsilonIconPack: any;

/**
 * Espilon Icon Picker Module
 */
export class EpsilonIconPicker {
  /**
   * WordPress control Object
   */
  control: any;

  /**
   * Class Constructor
   * @param {{container: JQuery; params: {value: number; id: string}}} control
   */
  public constructor( control: { container: JQuery, setting: void, params: { value: number, id: string } } ) {
    this.control = control;
    this.control.container.find( (`[id="${this.control.params.id}"]`) ).fontIconPicker( {
      source: EpsilonIconPack,
    } );
  }

}
