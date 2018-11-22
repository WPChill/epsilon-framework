declare var wp: any;

import { EpsilonLayouts } from '../../controls/layouts';

wp.customize.controlConstructor[ 'epsilon-layouts' ] = wp.customize.Control.extend( {
  ready() {
    var control = this;
    new EpsilonLayouts( control );

    /**
     * Save layout
     */
    control.container.on( 'change', 'input', ( e: JQuery.Event ) => {
      control.setting.set( jQuery( e.target ).val() );
    } );
  }
} );
