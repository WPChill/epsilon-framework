/**
 * Image Control Constructor
 */
wp.customize.controlConstructor[ 'epsilon-image' ] = wp.customize.Control.extend( {
  ready: function() {
    var control = this;
    EpsilonFramework.image.init( this );
  }
} );
