declare var wp: any;
import * as $ from 'jquery';

import { EpsilonSectionDoubled } from '../../sections/section-doubled';

/**
 * Doubled Section Constructor
 */
wp.customize.sectionConstructor[ 'epsilon-section-doubled' ] = wp.customize.Section.extend( {
  ready: function() {
    new EpsilonSectionDoubled( this );
  },
  attachEvents: function() {
  },
  isContextuallyActive: function() {
    return true;
  }
} );
