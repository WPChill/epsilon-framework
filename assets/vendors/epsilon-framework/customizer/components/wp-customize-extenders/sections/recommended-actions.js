/**
 * Recommended Section Constructor
 */
wp.customize.sectionConstructor[ 'epsilon-section-recommended-actions' ] = wp.customize.Section.extend( {
  ready: function() {
    EpsilonFramework.recommendedActions.init();
  },
  attachEvents: function() {
  },
  isContextuallyActive: function() {
    return true;
  }
} );
