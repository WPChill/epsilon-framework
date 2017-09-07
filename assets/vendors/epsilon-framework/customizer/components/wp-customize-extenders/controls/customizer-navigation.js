/**
 * Epsilon Customizer Navigation Constructor
 */
wp.customize.controlConstructor[ 'epsilon-customizer-navigation' ] = wp.customize.Control.extend( {
  ready: function() {
    EpsilonFramework.customizerNavigation.init( this.container );
  }
} );