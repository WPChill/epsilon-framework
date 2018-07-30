declare var require: any, EpsilonWPUrls: any, wp: any, _: any;

/**
 * Epsilon Preview Page Changer
 */
export class EpsilonPreviewPageChanger {
  /**
   * Class construct
   */
  public constructor() {
    wp.customize.preview.bind( 'epsilon-preview-page-change', ( object ) => {
      console.log( object );
    } );
  }
}
