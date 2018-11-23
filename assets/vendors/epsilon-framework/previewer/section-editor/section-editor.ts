declare var wp: any;
declare var _: any;

export class EpsilonSectionEditorPreviewer {
  /**
   * Class constructor
   */
  public constructor() {
    this.normalSectionFocus();
    this.advancedSectionFocus();
    this.repeaterFieldFocus();
  }

  /**
   * Normal section focus ( single button )
   */
  normalSectionFocus() {
    jQuery( document ).on( 'click', '.epsilon-section-editor', function( this: any, e: JQuery.Event ) {
      e.preventDefault();
      let object = {
        section: jQuery( this ).parents( '[data-section]' ).attr( 'data-section' ),
        customizerSection: jQuery( this ).parents( '[data-section]' ).attr( 'data-customizer-section-id' )
      };

      wp.customize.preview.send( 'epsilon-section-edit', object );
    } );
  }

  /**
   * Repeater field focus
   */
  repeaterFieldFocus() {
    jQuery( document ).on( 'click', '.epsilon-field-repeater-editor', function( this: any, event: JQuery.Event ) {
      event.preventDefault();
      let object = {
        section: jQuery( this ).parents( '[data-section]' ).attr( 'data-section' ),
        doubledSection: jQuery( this ).attr( 'data-doubled-section' ),
        control: jQuery( this ).attr( 'data-control' ),
        field: jQuery( this ).attr( 'data-index' ),
        customizerSection: jQuery( this ).parents( '[data-section]' ).attr( 'data-customizer-section-id' )
      };

      wp.customize.preview.send( 'epsilon-field-repeater-edit', object );
    } );

    jQuery( document ).on( 'click', '.epsilon-field-repeater-delete-item', function( this: any, event: JQuery.Event ) {
      event.preventDefault();
      let object = {
        section: jQuery( this ).parents( '[data-section]' ).attr( 'data-section' ),
        doubledSection: jQuery( this ).attr( 'data-doubled-section' ),
        control: jQuery( this ).attr( 'data-control' ),
        index: jQuery( this ).attr( 'data-index' ),
        customizerSection: jQuery( this ).parents( '[data-section]' ).attr( 'data-customizer-section-id' )
      };

      wp.customize.preview.send( 'epsilon-field-repeater-delete', object );
    } );
  }

  /**
   * Multiple buttons, should focus the tab coresponding to the icon
   */
  advancedSectionFocus() {
    jQuery( document ).on( 'click', '.epsilon-pencil-button-group > a', function( this: any, e: JQuery.Event ) {
      e.preventDefault();
      let object = {
        section: jQuery( this ).parents( '[data-section]' ).attr( 'data-section' ),
        customizerSection: jQuery( this ).parents( '[data-section]' ).attr( 'data-customizer-section-id' ),
        sectionTab: jQuery( this ).attr( 'data-focus' ),
      };

      wp.customize.preview.send( 'epsilon-section-edit', object );
    } );
  }
}
