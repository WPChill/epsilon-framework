declare var require: any;
declare var wp: any;

import '../../../css/style-customizer.scss';

/**
 * Settings
 */
import './extenders/settings/section-repeater';

/**
 * Controls
 */
import './extenders/controls/range-slider';
import './extenders/controls/icon-picker';
import './extenders/controls/text-editor';
import './extenders/controls/toggle';
import './extenders/controls/color-picker';
import './extenders/controls/customizer-navigation';
import './extenders/controls/image';
import './extenders/controls/typography';
import './extenders/controls/color-schemes';
import './extenders/controls/upsell';
import './extenders/controls/layouts';
import './extenders/controls/repeater';
import './extenders/controls/section-repeater';
import './extenders/controls/button-group';
import './extenders/controls/page-changer';
import './extenders/controls/image-dimensions';
/**
 * Panels
 */
import './extenders/panels/regular';

/**
 * Sections
 */
import './extenders/sections/section-doubled';
import './extenders/sections/section-pro';
import './extenders/sections/recommended-actions';

/**
 * Import section description enhancer ( Adds toggle description functionality )
 */
import { EpsilonSectionDescriptionEnhancer } from './sections/section-description-enhancer';

new EpsilonSectionDescriptionEnhancer();

import { EpsilonZoneFocus } from './sections/zone-focus';

new EpsilonZoneFocus();
