import { EpsilonRepeaterRow } from './repeater-row';
import { EpsilonRepeaterSectionUtils } from './repeater-section-utils';
import { EpsilonSectionRepeater } from '../section-repeater';
import { EpsilonFieldRepeater } from '../repeater';

export class EpsilonRepeaterSectionRow extends EpsilonRepeaterRow {
  /**
   * Redeclare label as string
   */
  public label: any;
  /**
   * Section row has a type
   */
  public type: string;

  constructor(
      instance: EpsilonSectionRepeater | EpsilonFieldRepeater,
      rowContainer: JQuery,
      type: string ) {
    super( instance, rowContainer );
    this.type = type;
    this.label = instance.control.params.sections[ type ].title;

    /**
     * Update labels
     */
    instance.utils.updateLabel( this );
    this.addTabs();
  }

  /**
   * Add tabs functionality ( sections have layout/styling optional settings )
   */
  public addTabs(): void {
    jQuery( this.container ).find( '[data-group="regular"]' ).wrapAll( '<div data-tab-id="regular" class="tab-panel regular active"></div>' );
    jQuery( this.container ).find( '[data-group="styling"]' ).wrapAll( '<div data-tab-id="styling" class="tab-panel styling"></div>' );
    jQuery( this.container ).find( '[data-group="layout"]' ).wrapAll( '<div data-tab-id="layout" class="tab-panel layout"></div>' );
    this._handleTabs();
  }

  /**
   * Handle tabs functionality
   * @param container
   */
  private _handleTabs() {
    const self = this,
        wrapper = self.container.find( 'nav' ),
        tabs = self.container.find( '[data-tab-id]' ),
        items = wrapper.find( 'a' );

    jQuery( wrapper ).on( 'click', items, function( event ) {
      event.preventDefault();
      tabs.removeClass( 'active' );
      self.container.find( '[data-tab-id="' + jQuery( event.target ).attr( 'data-item' ) + '"]' ).addClass( 'active' );
    } );
  }

  /**
   * We'll overwrite label immediatly after construct
   * @returns {any}
   */
  public getLabel(): any {
    return this.label;
  }
}