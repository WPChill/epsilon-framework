declare var wp: any;

import { EpsilonIconPicker } from '../../controls/icon-picker';

wp.customize.controlConstructor[ 'epsilon-icon-picker' ] = wp.customize.Control.extend( {
  ready() {
    var control = this;

    new EpsilonIconPicker( control );

    control.container.on( 'change', 'input.epsilon-icon-picker',
        ( event: Event ) => {
          control.setting.set( jQuery( event.target ).val() );
        }
    );
  }
} );
