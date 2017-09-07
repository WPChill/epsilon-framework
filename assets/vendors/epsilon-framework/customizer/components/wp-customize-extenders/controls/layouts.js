/**
 * Epsilon Layouts Control Constructor
 */
wp.customize.controlConstructor[ 'epsilon-layouts' ] = wp.customize.Control.extend( {
  ready: function() {
    var control = this;
    EpsilonFramework.layouts.init( this.container );
    /**
     * Save the layout
     */
    jQuery( this.container ).find( 'input' ).on( 'change', function() {
      control.setting.set( jQuery( this ).val() );
    } );
  }
} );
