EpsilonFramework.repeater = {
  /**
   * Initiate the repeater field script
   */
  init: function( control ) {
    var limit,
        theNewRow;

    // Set number of rows to 0
    this.currentIndex = 0;
    
  },
};

/**
 * WP Customizer Control Constructor
 */
wp.customize.controlConstructor[ 'epsilon-repeater' ] = wp.customize.Control.extend( {
  ready: function() {
    var control = this;
    EpsilonFramework.repeater.init( control );
  }
} );