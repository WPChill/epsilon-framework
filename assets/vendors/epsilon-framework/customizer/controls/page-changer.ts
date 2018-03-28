/**
 * Epsilon Page Changer
 */
export class EpsilonPageChanger {
  /**
   *
   */
  public control: { container: JQuery, params: { value: number, id: string }, pages: Array<Array<{}>> };

  /**
   * Basic Constructor
   *
   * @param control
   */
  public constructor( control: { container: JQuery, params: { value: number, id: string }, pages: Array<Array<{}>> } ) {
    this.control = control;

    this.handleEvents();
  }

  /**
   * Handle menu change
   */
  public handleEvents() {
    this.control.container.on( 'change', 'select', ( event: JQueryEventConstructor ) => {
      wp.customize.previewer.previewUrl.set( jQuery( event.target ).val() );
    } );
  }
}
