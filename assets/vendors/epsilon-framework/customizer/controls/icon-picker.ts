declare var _: any;

/**
 * Espilon Icon Picker Module
 */
export class EpsilonIconPicker {
  /**
   * Object Context
   */
  context: JQuery | any;
  /**
   * WordPress control Object
   */
  control: any;
  /**
   * Icon collection
   */
  collection: any;
  /**
   * Search input
   */
  searchInput: JQuery;
  /**
   * In repeater flag
   */
  inRepeater: boolean;

  /**
   * Class Constructor
   * @param {{container: JQuery; params: {value: number; id: string}}} control
   */
  public constructor( control: { container: JQuery, setting: void, params: { value: number, id: string } }, repeater: boolean ) {
    this.control = control;
    this.context = this.control.container;
    this.collection = this.context.find( '.epsilon-icons > i' );
    this.searchInput = this.context.find( '.search-container input' );
    this.inRepeater = repeater;

    let sets = this.context.find( '.epsilon-icon-sets > select' );
    if ( sets.length ) {
      sets.selectize();
    }

    this.handleEvents();
  }

  private _iconPickerGrouping( group: string | any ): void {
    jQuery.each( this.collection, function() {
      let temp = jQuery( this ).attr( 'data-group' );
      if ( 'undefined' !== typeof temp ) {
        temp = temp.toLowerCase();
      }

      jQuery( this )[ temp.indexOf( group ) !== - 1 ? 'show' : 'hide' ]();
    } );
  }

  /**
   * Handle events
   */
  public handleEvents() {
    const self = this;
    let icon: any, label: any, temp: string | any, filter: string | any;

    /**
     * Icon container toggler
     */
    this.context.on( 'click', '.epsilon-icon-container', function( e: Event ) {
      e.preventDefault();
      jQuery( e.target ).toggleClass( 'opened-icon-picker' );
      self.context.find( '.epsilon-icon-picker-container' ).toggleClass( 'opened' );
    } );

    /**
     * Icon selection
     */
    this.context.on( 'click', '.epsilon-icons-container .epsilon-icons > i', function( e: Event ) {
      self.context.find( '.epsilon-icons > i.selected' ).removeClass( 'selected' );
      icon = jQuery( e.target ).addClass( 'selected' ).attr( 'data-icon' );
      label = jQuery( e.target ).addClass( 'selected' ).attr( 'data-search' );
      self.context.find( '.epsilon-icon-name > i' ).removeClass().addClass( icon );
      self.context.find( '.epsilon-icon-name > .icon-label' ).html( label );

      /**
       * Set value
       */
      if ( ! self.inRepeater ) {
        self.control.setting.set( icon );
      } else {
        self.context.find( '.epsilon-icon-picker' ).attr( 'value', icon ).trigger( 'change' );
      }
    } );

    this.context.on( 'change', '.epsilon-icon-sets > select', ( e: JQueryEventConstructor ) => {
      e.preventDefault();
      let grouping = jQuery( e.target ).val();
      this._iconPickerGrouping( grouping );
    } );

    /**
     * Search functionality
     */
    this.context.on( 'keyup change', '.search-container input', _.debounce( function( e: Event ) {
      filter = self.searchInput.val();
      if ( 'undefined' !== typeof filter ) {
        filter = filter.toLowerCase();
      }
      let group = self.context.find( '.epsilon-icon-sets > select' );
      if ( group.length ) {
        group = group.val();
        if ( '' === filter ) {
          self._iconPickerGrouping( group );
          return;
        }
      }
      jQuery.each( self.collection, function() {
        if ( '' !== group ) {
          let grouping = jQuery( this ).attr( 'data-group' );
          if ( grouping !== group ) {
            jQuery( this )[ 'hide' ]();
            return true;
          }
        }

        temp = jQuery( this ).attr( 'data-search' );
        if ( 'undefined' !== typeof temp ) {
          temp = temp.toLowerCase();
        }
        jQuery( this )[ temp.indexOf( filter ) !== - 1 ? 'show' : 'hide' ]();
      } );

    }, 1000 ) );
  }
}
