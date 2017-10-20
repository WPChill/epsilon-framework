declare var wp: any;
import * as $ from 'jquery';

wp.customize.controlConstructor[ 'epsilon-toggle' ] = wp.customize.Control.extend( {
  ready: function() {
    var control = this;

    control.container.on( 'change', 'input.onoffswitch-checkbox',
        function( e: Event ) {
          control.setting.set( jQuery( e.target ).prop( 'checked' ) );
        }
    );
  }
} );
