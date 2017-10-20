declare var wp: any;

import { EpsilonSectionRepeater } from '../../controls/section-repeater';

wp.customize.controlConstructor[ 'epsilon-section-repeater' ] = wp.customize.Control.extend( {
  ready: function() {
    var control: any = this;
    new EpsilonSectionRepeater( control );
  }
} );