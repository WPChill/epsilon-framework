/**
 * Doubled Section Constructor
 */
wp.customize.sectionConstructor[ 'epsilon-section-doubled' ] = wp.customize.Section.extend( {
  ready: function() {
    EpsilonFramework.sectionDoubled.init( this );
  },
  attachEvents: function() {
  },
  isContextuallyActive: function() {
    return true;
  }
} );
