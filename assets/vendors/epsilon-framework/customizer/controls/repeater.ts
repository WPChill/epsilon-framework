declare var wp: any, _: any;
import EpsilonRepeaterActions from './repeater/actions';
import EpsilonRepeaterEvents from './repeater/events';
import EpsilonRepeaterUtils from './repeater/utils';
import EpsilonRepeaterConnectors from './repeater/connectors';

export class EpsilonFieldRepeater {
  /**
   * Control instance
   */
  public $_instance: any;
  /**
   * Generic ID
   */
  public $ID: string;
  /**
   * Repeater container
   */
  public repeaterContainer: JQuery;
  /**
   * Repeater template
   */
  public template: any;
  /**
   * Handles adding/deleting new fields
   */
  public $actions = {
    ...EpsilonRepeaterActions
  };
  /**
   * Event handling
   */
  public $events = {
    ...EpsilonRepeaterEvents,
  };
  /**
   * Utilities
   */
  public $utils = {
    ...EpsilonRepeaterUtils
  };
  /**
   * WP Api connectors
   */
  public $connectors = {
    ...EpsilonRepeaterConnectors
  };
  /**
   * Initial state
   */
  public state: {
    loading: boolean,
    addingRow: boolean,
    currentIndex: number,
    sorting: boolean,
    rows: Array<any>,
  } = {
    loading: true,
    addingRow: false,
    currentIndex: 0,
    sorting: false,
    rows: [],
  };

  /**
   * Get loading state
   */
  get loading() {
    return this.state.loading;
  }

  /**
   * Set loading state
   * @param state
   */
  set loading( state: boolean ) {
    this.state.loading = state;
  }

  /**
   * Get sorting
   */
  get sorting() {
    return this.state.sorting;
  }

  /**
   * Sorting setter
   * @param state
   */
  set sorting( state: boolean ) {
    this.state.sorting = state;

    switch ( this.state.sorting ) {
      case true:
        this.state.rows.map( e => {
          e.forceMinimize();
          e.sorting = true;
        } );
        this.repeaterContainer.addClass( 'epsilon-repeater-is-sorting' );
        break;
      default:
        this.state.rows.map( e => e.sorting = false );
        this.repeaterContainer.removeClass( 'epsilon-repeater-is-sorting' );
        break;
    }
  }

  /**
   * Object constructor
   * @param control
   */
  public constructor( control: any ) {
    this.$_instance = control;
    this.$ID = this.$_instance.params.id;
    this.repeaterContainer = this.$_instance.container.find( '.repeater-fields' );
    this.template = this.$utils.repeaterTemplate();

    this.loading = false;

    this._bindFunctions();

    this._createExistingRows();
    this._eventListener();
    /**
     * Init sorting functionality
     */
    this._initSorting();
  }

  /**
   * Binds this to certain functions
   * @private
   */
  private _bindFunctions() {
    this.$connectors.setValue = this.$connectors.setValue.bind( this );
    this.$connectors.getValue = this.$connectors.getValue.bind( this );
    this.$connectors.addNewRow = this.$connectors.addNewRow.bind( this );

    this.$actions.addRow = this.$actions.addRow.bind( this );
    this.$actions.removeRow = this.$actions.removeRow.bind( this );
    this.$actions.sortRows = this.$actions.sortRows.bind( this );
  }

  /**
   * Creates the existing rows
   * @private
   */
  private _createExistingRows() {
    this.loading = true;

    this.$_instance.params.value.map( e => {
      this.$actions.addRow( e );
    } );

    this.loading = false;
  }

  /**
   * Start event listener
   * @private
   */
  private _eventListener() {
    this.$events.addRowButton.call( this );
    this.$events.handleFieldDeletion.call( this );
  }

  /**
   * Init sorting
   * @private
   */
  private _initSorting() {
    this.repeaterContainer.parent().on( 'click', '.epsilon-sort-rows', () => {
      this.sorting = ! this.sorting;

      switch ( this.sorting ) {
        case true:
          this.repeaterContainer.sortable( {
            handle: '.repeater-row-header',
            axis: 'y',
            distance: 15,
            stop: ( e, data ) => this.$actions.sortRows( e, data )
          } );
          break;
        default:
          this.repeaterContainer.sortable( 'destroy' );
          break;
      }
    } );
  }
}
