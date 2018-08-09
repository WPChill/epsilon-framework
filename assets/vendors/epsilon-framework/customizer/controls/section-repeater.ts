declare var wp: any, _: any;
import * as $ from 'jquery';

import EpsilonSectionRepeaterEvents from './section-repeater/events';
import EpsilonSectionRepeaterPreviewerEvents from './section-repeater/previewer-events';
import EpsilonSectionRepeaterActions from './section-repeater/actions';
import EpsilonSectionRepeaterUtils from './section-repeater/utils';
import EpsilonSectionRepeaterConnectors from './section-repeater/connectors';

/**
 * Epsilon section repeater
 */
export class EpsilonSectionRepeater {
  /**
   * Control instance
   */
  public $_instance: any;
  /**
   * Generic ID
   */
  public $ID: string;
  /**
   * Handles adding/deleting new fields
   */
  public $actions = {
    ...EpsilonSectionRepeaterActions
  };
  /**
   * Event handling
   */
  public $events = {
    ...EpsilonSectionRepeaterEvents,
    ...EpsilonSectionRepeaterPreviewerEvents
  };
  /**
   * Utilities
   */
  public $utils = {
    ...EpsilonSectionRepeaterUtils
  };
  /**
   * WP Api connectors
   */
  public $connectors = {
    ...EpsilonSectionRepeaterConnectors
  };
  /**
   * Repeater container
   */
  public repeaterContainer: JQuery;
  /**
   * Available sections
   */
  public availableSections: JQuery;
  /**
   * Importable sections
   */
  public importableSections: JQuery;
  /**
   * Repeater template
   */
  public template: any;
  /**
   * Initial state
   */
  public state: {
    loading: boolean,
    addingSection: boolean,
    importingSection: boolean,
    currentIndex: number,
    rows: Array<any>,
  } = {
    loading: true,
    addingSection: false,
    importingSection: false,
    currentIndex: 0,
    rows: [],
  };

  /**
   * Object constructor
   * @param control
   */
  public constructor( control: any ) {
    this.$_instance = control;
    this.$ID = this.$_instance.params.id;
    this.repeaterContainer = this.$_instance.container.find( '.repeater-sections' );
    this.template = this.$utils.repeaterTemplate();
    this.state.loading = false;

    this._bindFunctions();

    this._createExistingSections();
    this._layoutReconstruct();
    this._eventListener();
    /**
     * Initiate Search on sections
     */
    this._initSearch();
  }

  /**
   * Binds this to certain functions
   * @private
   */
  private _bindFunctions() {
    this.$connectors.setValue = this.$connectors.setValue.bind( this );
    this.$connectors.getValue = this.$connectors.getValue.bind( this );
    this.$connectors.addNewSection = this.$connectors.addNewSection.bind( this );

    this.$actions.addSection = this.$actions.addSection.bind( this );
    this.$actions.removeSection = this.$actions.removeSection.bind( this );
  }

  /**
   * Creates the existing sections
   * @private
   */
  private _createExistingSections() {
    this.state.loading = true;

    this.$_instance.params.value.map( e => {
      this.$actions.addSection( e );
    } );

    this.state.loading = false;
  }

  /**
   * Constructs the layout as we need it
   * @private
   */
  private _layoutReconstruct() {
    this.$utils.moveElements.call( this );

    this.availableSections = jQuery( '#sections-left-' + this.$ID ).find( '.available-sections' );
    this.importableSections = jQuery( '#importable-sections-' + this.$ID ).find( '.available-sections' );
  }

  /**
   * Start event listener
   * @private
   */
  private _eventListener() {
    /**
     * When you click back in the customizer, we should close everything related to section repeater
     */
    this.$events.closeOnCustomizerBack.call( this );
    /**
     * Add & Import buttons
     */
    this.$events.addMoreSectionButton.call( this );
    this.$events.importSectionButton.call( this );
    this.$events.addSectionButton.call( this );
    this.$events.handleSectionDescription.call( this );
    /**
     * Handle integration event
     */
    this.$events.handleIntegrationEvent.call( this );
    /**
     * Navigation from the previewer shortcuts
     */
    this.$events.handleNavigation.call( this );
    this.$events.handleNavigationToFieldRepeater.call( this );
  }

  /**
   * Initiate search on sections
   * @private
   */
  private _initSearch() {
    jQuery( `#sections-left-${this.$ID}` ).
        find( '.sections-search-input' ).
        on( 'keyup change', _.debounce( ( e ) => {
          let val = e.target.value;

          if ( 'undefined' !== typeof val ) {
            val = val.toLowerCase();
          }

          jQuery( `#sections-left-${this.$ID}` ).find( '.epsilon-section' ).map( ( idx, e ) => {
            let id = jQuery( e ).attr( 'data-id' );
            if ( 'undefined' !== typeof id ) {
              id = id.toLowerCase();
            }

            jQuery( e )[ id.indexOf( val ) !== - 1 ? 'show' : 'hide' ]();
          } );
        }, 500 ) );
  }

}
