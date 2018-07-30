declare var require: any;
declare var wp: any;
import * as $ from 'jquery';

import { EpsilonColorSchemesPreviewer } from './color-schemes/color-schemes';
import { EpsilonTypographyPreviewer } from './typography/typography';
import { EpsilonSectionEditorPreviewer } from './section-editor/section-editor';
import { EpsilonPartialRefresh } from './partial-refresh/partial-refresh';
import { EpsilonZoneFocuser } from './zone-focuser/zone-focuser';
import { EpsilonPreviewPageChanger } from './preview-page-changer/preview-page-changer';
import { EpsilonSectionFocus } from './section-focus/section-focus';

wp.customize.bind( 'preview-ready', function() {
  new EpsilonColorSchemesPreviewer();
  new EpsilonTypographyPreviewer();
  new EpsilonSectionEditorPreviewer();
  new EpsilonPartialRefresh();
  new EpsilonSectionFocus();
  new EpsilonZoneFocuser();
  new EpsilonPreviewPageChanger()
} );
