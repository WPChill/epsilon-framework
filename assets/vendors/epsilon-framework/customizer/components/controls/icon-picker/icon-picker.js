/**
 * Icon Picker Initiator
 *
 * @type {{init: EpsilonFramework.iconPickers.init}}
 */
EpsilonFramework.iconPickers = {
  /**
   * Context
   */
  control: null,
  /**
   * Init the icon picker
   *
   * @param control
   * @param inRepeater
   */
  init: function( control, inRepeater ) {
    this.control = control;
    var icon, label, filter, temp, collection = control.container.find( '.epsilon-icons > i' ), input = control.container.find( '.search-container input' );

    /**
     * Icon container toggler
     */
    control.container.on( 'click', '.epsilon-open-icon-picker', function( e ) {
      e.preventDefault();
      jQuery( this ).toggleClass( 'opened-icon-picker' );
      control.container.find( '.epsilon-icon-picker-container' ).toggleClass( 'opened' );
    } );

    /**
     * Icon selection
     */
    control.container.on( 'click', '.epsilon-icons-container .epsilon-icons > i', function( e ) {
      control.container.find( '.epsilon-icons > i.selected' ).removeClass( 'selected' );
      icon = jQuery( this ).addClass( 'selected' ).attr( 'data-icon' );
      label = jQuery( this ).addClass( 'selected' ).attr( 'data-search' );
      control.container.find( '.epsilon-icon-name > i' ).removeClass().addClass( icon );
      control.container.find( '.epsilon-icon-name > .icon-label' ).html( label );

      /**
       * Set value
       */
      if ( ! inRepeater ) {
        control.setting.set( icon );
      } else {
        control.container.find( '.epsilon-icon-picker' ).attr( 'value', icon ).trigger( 'change' );
      }
    } );

    /**
     * Search functionality
     */
    control.container.on( 'keyup change', '.search-container input', _.debounce( function( e ) {
      filter = input.val().toLowerCase();

      jQuery.each( collection, function() {
        temp = jQuery( this ).attr( 'data-search' ).toLowerCase();
        jQuery( this )[ temp.indexOf( filter ) !== - 1 ? 'show' : 'hide' ]();
      } );

    }, 1000 ) );
  }
};