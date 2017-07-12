/**
 * Icon Picker Initiator
 *
 * @type {{init: EpsilonFramework.iconPickers.init}}
 */
EpsilonFramework.iconPickers = {
  control: null,
  init: function( control ) {
    this.control = control;
    var icon, filter, temp,
        collection = control.container.find( '.epsilon-icons > i' ),
        input = control.container.find( '.search-container input' );

    /**
     * Icon container toggler
     */
    control.container.on( 'click', '.epsilon-open-icon-picker', function( e ) {
      e.preventDefault();
      control.container.find( '.epsilon-icon-picker-container' ).toggleClass( 'opened' );
    } );

    /**
     * Icon selection
     */
    control.container.on( 'click', '.epsilon-icons-container .epsilon-icons > i', function( e ) {
      icon = jQuery( this ).attr( 'data-icon' );
      control.container.find( '.epsilon-icons > i.selected' ).removeClass( 'selected' );
      control.container.find( '.epsilon-icon-container > i' ).removeClass().addClass( icon );

      /**
       * Set value
       */
      control.setting.set( icon );
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
  },
};