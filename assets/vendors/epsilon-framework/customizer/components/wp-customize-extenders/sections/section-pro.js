/**
 * Pro Section
 */
wp.customize.sectionConstructor[ 'epsilon-section-pro' ] = wp.customize.Section.extend( {
  attachEvents: function() {
  },
  isContextuallyActive: function() {
    return true;
  }
} );
