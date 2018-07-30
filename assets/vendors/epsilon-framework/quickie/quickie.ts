declare var require: any, wp: any;
import * as $ from 'jquery';
import { EpsilonQuickieBar } from './quick-bar';

const EpsilonQuickBar = new EpsilonQuickieBar();

jQuery( document ).on( 'ready', _ => {
  EpsilonQuickBar.init();
} );
jQuery( window ).on( 'load', _ => {
  EpsilonQuickBar.addBodyClass();
} );
