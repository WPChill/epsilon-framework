declare var wp: any;

wp.customize.controlConstructor[ 'epsilon-onlypro' ] = wp.customize.Control.extend( {
  ready() {
    console.warn( 'Hello World' );
  }
} );
