declare var EpsilonIconPack: any;

export default class SectionRepeaterIconPicker {
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
   * Initiator
   */
  public init() {
    this.props.container.find( `[data-field="${this.props.id}"]` ).fontIconPicker( {
      source: EpsilonIconPack,
    } );
  }
}
