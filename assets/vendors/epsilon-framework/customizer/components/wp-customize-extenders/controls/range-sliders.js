/**
 * Epsilon Range Slider Control Constructor
 */
wp.customize.controlConstructor[ 'epsilon-slider' ] = wp.customize.Control.extend( {
  ready: function() {
    var control = this;

    EpsilonFramework.rangeSliders.init( this.container );

    control.container.on( 'change', 'input.rl-slider',
        function() {
          control.setting.set( jQuery( this ).val() );
        }
    );
  }
} );
