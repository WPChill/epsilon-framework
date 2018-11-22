declare var EpsilonWPUrls: any;

/**
 * Epsilon Page Changer
 */
export class EpsilonPageChanger {
  /**
   *
   */
  public control: { container: JQuery, params: { value: number, id: string }, pages: Array<Array<{}>> };

  /**
   * Basic Constructor
   *
   * @param control
   */
  public constructor( control: { container: JQuery, params: { value: number, id: string }, pages: Array<Array<{}>> } ) {
    let newItem:any = control.container.find( '.new-content-item' );
    let object:any = this;
    this.control = control;

    // Hide button and show input
    control.container.on( 'click', '.add-new-toggle', function( e ) {
      jQuery( e.currentTarget ).slideUp( 180 );
      newItem.slideDown( 180 );
      newItem.find( '.create-item-input' ).focus();
    });

    control.container.on( 'click', '.add-content', function() {
      object.addNewPage();
    });
    control.container.on( 'keydown', '.create-item-input', function( e ) {
      if ( 13 === e.which ) { // Enter
        object.addNewPage();
      }
    });


    this.startSelectize();
    this.handleEvents();
  }

  /**
   * Initiate the selectize library
   */
  public startSelectize() {
    /**
     * Instantiate the selectize javascript plugin
     * and the input type number
     */
    try {
      this.control.container.find( 'select' ).selectize();
    }
    catch ( err ) {
      /**
       * In case the selectize plugin is not loaded, raise an error
       */
      console.warn( 'selectize not yet loaded' );
    }
  }

  /**
   * Handle menu change
   */
  public handleEvents() {
    this.control.container.on( 'change', 'select', ( event: JQuery.Event ) => {
      wp.customize.previewer.previewUrl.set( jQuery( event.target ).val() );
    } );
  }

  /**
  * Handle new page
  */
  public addNewPage() {
    let control:any = this.control;

    let toggle:any = control.container.find( '.add-new-toggle' );
    let container:any = control.container.find( '.new-content-item' );
    let input:any = control.container.find( '.create-item-input' );
    let title:any = input.val();
    let select:any = control.container.find( 'select' );

    if ( ! title ) {
      input.addClass( 'invalid' );
      return;
    }

    input.removeClass( 'invalid' );
    input.attr( 'disabled', 'disabled' );

    let request:any = jQuery.ajax({
      type: 'POST',
      dataType: 'json',
      url: EpsilonWPUrls.ajaxurl,
      data: {
        action: 'epsilon_framework_ajax_action',
        args: {
          action: [ 'Epsilon_Helper', 'create_page' ],
          nonce: EpsilonWPUrls.ajax_nonce,
          args: {
            'epsilon_page_name' : title,
            'epsilon_customizer_section' : control.section(),
            'epsilon_control_id' : control.params.page_builder_id,
          }
        }
      }
    });

    request.done( function( response ) {


      if ( response.status ) {

        let id:any = control.params.page_builder_id + '_' + response.id;
        let args:any = {
              'id' : id,
              'save_as_meta' : response.id,
              'type' : 'epsilon-section-repeater',
              'section' : control.section(),
              'page_builder' : true,
              'selective_refresh' : false,
              'sortable' : true,
              'integrations' : control.params.integrations,
              'integrations_count' : control.params.integrations_count,
              'importable' : control.params.importable,
              'sections' : control.params.sections,
              'settings': { 'default': id },
              'choices' : {},
              'value' : [],
              'label' : title,
            };

        let setting:any = new wp.customize.settingConstructor['epsilon-section-repeater']( id, [] );
        wp.customize.add( setting );

        let newControl:any = new wp.customize.controlConstructor['epsilon-section-repeater']( id, args );
        wp.customize.control.add( newControl );

        let select = control.container.find( 'select' );
        let selectize = select[0].selectize

        selectize.addOption( { value: response.url,text: title } );
        selectize.setValue( response.url );

      }

      // Reset the create page form.
      container.slideUp( 180 );
      toggle.slideDown( 180 );

    } );

    request.always( function( response ) {
      input.val( '' ).removeAttr( 'disabled' );
    } );

  }
}
