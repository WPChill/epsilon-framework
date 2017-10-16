declare var wp: any;
import * as $ from 'jquery';

import { EpsilonTypography } from '../controls/typography';

/**
 * Epsilon Typography Control Constructor
 */
wp.customize.controlConstructor[ 'epsilon-typography' ] = wp.customize.Control.extend( {
  ready: function() {
    var control = this;

    new EpsilonTypography( control );

    /**
     * Save the typography
     */
    control.container.on( 'change', '.customize-control-content > .epsilon-typography-input',
        function( e: Event ) {
          console.log( e.target );
          control.setting.set( jQuery( e.target ).val() );
        }
    );
  }
} );