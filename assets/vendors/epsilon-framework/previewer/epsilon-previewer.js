/**
 * Epsilon Framework Previewer Initiator
 */

wp.customize.bind( 'preview-ready', function() {
  EpsilonPreviewer.colorSchemes.init();
  EpsilonPreviewer.sectionEditor.init();
  EpsilonPreviewer.typography.init();
} );
