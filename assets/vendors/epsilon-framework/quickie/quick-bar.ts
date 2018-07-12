declare var require: any, wp: any;
import * as $ from 'jquery';

/**
 * Epsilon Quick bar
 */
export class EpsilonQuickieBar {
  /**
   * Param 1
   * @type {string}
   */
  public $paramOne = '';
  /**
   * Param 2
   * @type {{}}
   */
  public $paramTwo = {};
  /**
   * Param 3
   * @type {any[]}
   */
  public $paramThree = [];

  /**
   * Class constructor
   *
   * @can have args
   */
  public constructor() {
    this.$paramOne = 'Hello';

    this.$paramTwo = {
      hello: 'world'
    };

    this.$paramThree.push( 'Hello', 'World' );
  }

  /**
   * Script initiator
   */
  public init() {

  }

  /**
   * Adds body classes
   */
  public addBodyClass() {

  }
}
