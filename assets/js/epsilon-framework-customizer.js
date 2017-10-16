/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/assets/js/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 13);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__controls_color_picker__ = __webpack_require__(7);

wp.customize.controlConstructor['epsilon-color-picker'] = wp.customize.Control.extend({
    ready: function () {
        var control = this;
        new __WEBPACK_IMPORTED_MODULE_0__controls_color_picker__["a" /* EpsilonColorPicker */](control);
        control.container.on('change', 'input.epsilon-color-picker', function (e) {
            control.setting.set(jQuery(e.target).val());
        });
    }
});


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__controls_customizer_navigation__ = __webpack_require__(8);

wp.customize.controlConstructor['epsilon-customizer-navigation'] = wp.customize.Control.extend({
    ready: function () {
        var control = this;
        new __WEBPACK_IMPORTED_MODULE_0__controls_customizer_navigation__["a" /* EpsilonCustomizerNavigation */](control);
    }
});


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__controls_icon_picker__ = __webpack_require__(9);

wp.customize.controlConstructor['epsilon-icon-picker'] = wp.customize.Control.extend({
    ready: function () {
        var control = this;
        new __WEBPACK_IMPORTED_MODULE_0__controls_icon_picker__["a" /* EpsilonIconPicker */](control, false);
        control.container.on('change', 'input.epsilon-icon-picker', function (event) {
            control.setting.set(jQuery(event.target).val());
        });
    }
});


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__controls_image__ = __webpack_require__(10);

wp.customize.controlConstructor['epsilon-image'] = wp.customize.Control.extend({
    ready: function () {
        var control = this;
        new __WEBPACK_IMPORTED_MODULE_0__controls_image__["a" /* EpsilonImage */](control);
    }
});


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__controls_range_slider__ = __webpack_require__(11);

wp.customize.controlConstructor['epsilon-slider'] = wp.customize.Control.extend({
    ready: function () {
        var control = this;
        new __WEBPACK_IMPORTED_MODULE_0__controls_range_slider__["a" /* EpsilonRangeSlider */](control);
        control.container.on('change', 'input.rl-slider', function (event) {
            control.setting.set(jQuery(event.target).val());
        });
    }
});


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__controls_text_editor__ = __webpack_require__(12);

wp.customize.controlConstructor['epsilon-text-editor'] = wp.customize.Control.extend({
    ready: function () {
        var control = this;
        new __WEBPACK_IMPORTED_MODULE_0__controls_text_editor__["a" /* EpsilonTextEditor */](control);
        control.container.on('change keyup', 'textarea', function (event) {
            control.setting.set(jQuery(event.target).val());
        });
    }
});


/***/ }),
/* 6 */
/***/ (function(module, exports) {

wp.customize.controlConstructor['epsilon-toggle'] = wp.customize.Control.extend({
    ready: function () {
        var control = this;
        control.container.on('change', 'input.onoffswitch-checkbox', function (e) {
            control.setting.set(jQuery(e.target).prop('checked'));
        });
    }
});


/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * Espilon Color Picker Module
 */
class EpsilonColorPicker {
    /**
     * Class Constructor
     * @param {{container: JQuery; setting: void; params: {value: number; id: string}}} control
     */
    constructor(control) {
        const self = this;
        let clear;
        this.control = control;
        this.context = jQuery(control.container).find('.epsilon-color-picker');
        this.settings = {
            changeDelay: 500,
            theme: 'default',
            change: this.changePallete,
        };
        if ('function' !== typeof jQuery.fn.minicolors) {
            return;
        }
        if ('' !== this.context.attr('placeholder')) {
            this.context.defaultValue = this.context.attr('placeholder');
        }
        if ('rgba' === this.context.attr('data-attr-mode')) {
            this.context.format = 'rgb';
            this.context.opacity = true;
        }
        this.context.minicolors(this.settings);
        clear = this.context.parents('.customize-control-epsilon-color-picker').find('a');
        if (!clear.length) {
            clear = this.context.parents('.repeater-field-epsilon-color-picker').find('a');
        }
        clear.on('click', function (e) {
            e.preventDefault();
            self.instance = jQuery(this).parents('.customize-control-epsilon-color-picker').find('input.epsilon-color-picker');
            if (!self.instance.length) {
                self.instance = jQuery(this).parents('.repeater-field-epsilon-color-picker').find('input.epsilon-color-picker');
            }
            self.instance.minicolors('value', jQuery(this).attr('data-default'));
            self.instance.trigger('change');
        });
    }
    /**
     * Real time changes to the "pallete"
     *
     * @param value
     * @param opacity
     */
    changePallete(value, opacity) {
        jQuery('.epsilon-color-scheme-selected').find('*[data-field-id="' + jQuery(this).attr('data-customize-setting-link') + '"]').css('background-color', value);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = EpsilonColorPicker;



/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * Espilon Customizer Navigation Module
 */
class EpsilonCustomizerNavigation {
    /**
     * Class Constructor
     * @param {{container: JQuery; params: {value: number; id: string}}} control
     */
    constructor(control) {
        this.context = jQuery(control.container);
        this.init();
    }
    /**
     * Control initiator
     */
    init() {
        this.context.find('.epsilon-customizer-navigation').on('click', function (e) {
            e.preventDefault();
            if ('undefined' !== typeof (wp.customize.section(jQuery(e.target).attr('data-customizer-section')))) {
                if (jQuery(e.target).attr('data-doubled')) {
                    wp.customize.section(jQuery(e.target).attr('data-customizer-section')).headContainer.trigger('click');
                }
                else {
                    wp.customize.section(jQuery(e.target).attr('data-customizer-section')).focus();
                }
            }
        });
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = EpsilonCustomizerNavigation;



/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * Espilon Icon Picker Module
 */
class EpsilonIconPicker {
    /**
     * Class Constructor
     * @param {{container: JQuery; params: {value: number; id: string}}} control
     */
    constructor(control, repeater) {
        this.control = control;
        this.context = this.control.container;
        this.collection = this.context.find('.epsilon-icons > i');
        this.searchInput = this.context.find('.search-container input');
        this.inRepeater = repeater;
        this.handleEvents();
    }
    /**
     * Handle events
     */
    handleEvents() {
        const self = this;
        let icon, label, temp, filter;
        /**
         * Icon container toggler
         */
        this.context.on('click', '.epsilon-open-icon-picker', function (e) {
            e.preventDefault();
            jQuery(e.target).toggleClass('opened-icon-picker');
            self.context.find('.epsilon-icon-picker-container').toggleClass('opened');
        });
        /**
         * Icon selection
         */
        this.context.on('click', '.epsilon-icons-container .epsilon-icons > i', function (e) {
            self.context.find('.epsilon-icons > i.selected').removeClass('selected');
            icon = jQuery(e.target).addClass('selected').attr('data-icon');
            label = jQuery(e.target).addClass('selected').attr('data-search');
            self.context.find('.epsilon-icon-name > i').removeClass().addClass(icon);
            self.context.find('.epsilon-icon-name > .icon-label').html(label);
            /**
             * Set value
             */
            if (!self.inRepeater) {
                self.control.setting.set(icon);
            }
            else {
                self.context.find('.epsilon-icon-picker').attr('value', icon).trigger('change');
            }
        });
        /**
         * Search functionality
         */
        self.context.on('keyup change', '.search-container input', _.debounce(function (e) {
            filter = self.searchInput.val();
            if ('undefined' !== typeof filter) {
                filter = filter.toLowerCase();
            }
            jQuery.each(self.collection, function () {
                temp = jQuery(this).attr('data-search');
                if ('undefined' !== typeof temp) {
                    temp = temp.toLowerCase();
                }
                jQuery(this)[temp.indexOf(filter) !== -1 ? 'show' : 'hide']();
            });
        }, 1000));
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = EpsilonIconPicker;



/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * Epsilon Image
 */
class EpsilonImage {
    /**
     * Class Constructor
     * @param {{container: JQuery; params: {value: number; id: string}}} control
     */
    constructor(control) {
        this.control = control;
        this.context = jQuery(control.container);
        this.handleEvents();
    }
    /**
     * Event handling ( click events )
     */
    handleEvents() {
        const self = this;
        let image, temp, size, thumb, setting = { id: '', url: '' }, input = this.context.find('.epsilon-controller-image-container > input');
        /**
         * Image selection
         */
        this.context.on('click', '.image-upload-button', function (e) {
            /**
             * Open the wp.media frame
             */
            image = wp.media({
                multiple: false,
            }).open();
            /**
             * On selection, save the data in a JSON
             */
            image.on('select', function () {
                temp = image.state().get('selection').first();
                size = input.attr('data-size');
                if ('undefined' === typeof (temp.toJSON().sizes[size])) {
                    size = 'full';
                }
                setting.id = temp.id;
                setting.url = temp.toJSON().sizes[size].url;
                self.saveValue(setting);
                self.setImage(setting.url);
                /**
                 * Show buttons
                 */
                self.context.find('.actions .image-upload-remove-button').show();
                if (!_.isEmpty(self.control.params.default)) {
                    self.context.find('.actions .image-default-button').show();
                }
            });
        });
        /**
         * Image deletion
         */
        this.context.on('click', '.image-upload-remove-button', function (e) {
            e.preventDefault();
            thumb = self.context.find('.epsilon-image');
            self.saveValue({ id: '', url: '' });
            if (thumb.length) {
                thumb.find('img').fadeOut(200, function () {
                    thumb.removeClass('epsilon-image').addClass('placeholder').html(EpsilonTranslations.selectFile);
                });
            }
            /**
             * If we don`t have an image, we can hide these buttons
             */
            jQuery(e.target).hide();
            if (!_.isEmpty(self.control.params.default)) {
                self.context.find('.actions .image-default-button').show();
            }
        });
        self.context.on('click', '.image-default-button', function (e) {
            e.preventDefault();
            thumb = self.context.find('.epsilon-image');
            self.saveValue(self.control.params.default);
            self.setImage(self.control.params.default.url);
            self.context.find('.actions .image-upload-remove-button').show();
        });
    }
    /**
     * Set image in the customizer option control
     *
     * @param control
     * @param image
     */
    setImage(image) {
        /**
         * If we already have an image, we need to return that div, else we grab the placeholder
         *
         * @type {*}
         */
        var thumb = this.context.find('.epsilon-image').length ? this.context.find('.epsilon-image') : this.context.find('.placeholder');
        /**
         * We "reload" the image container
         */
        if (thumb.length) {
            thumb.removeClass('epsilon-image placeholder').addClass('epsilon-image');
            thumb.html('');
            thumb.append('<img style="display:none" src="' + image + '" />');
            thumb.find('img').fadeIn(200);
        }
    }
    /**
     * Save value in database
     *
     * @param control
     * @param val
     */
    saveValue(val) {
        var input = this.context.find('.epsilon-controller-image-container > input');
        if ('object' === typeof (val) && '' !== val.id) {
            this.control.setting.set(JSON.stringify(val));
            jQuery(input).attr('value', JSON.stringify(val)).trigger('change');
        }
        else {
            this.control.setting.set('');
            jQuery(input).attr('value', '').trigger('change');
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = EpsilonImage;



/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/// <reference types="jqueryui" />
/**
 * Espilon Range Slider Module
 */
class EpsilonRangeSlider {
    /**
     * Class constructor
     * @param {{container: JQuery; params: {value: number; id: string; sliderControls: {min: number; max: number; step: number}}}} control
     */
    constructor(control) {
        /**
         * Minimum
         * @type {number}
         */
        this.min = 1;
        /**
         * Maximum
         * @type {number}
         */
        this.max = 20;
        /**
         * Step incrementor
         * @type {number}
         */
        this.step = 1;
        this.context = jQuery(control.container).hasClass('slider-container') ? jQuery(control.container) : jQuery(control.container).find('.slider-container');
        this.min = control.params.sliderControls.min;
        this.max = control.params.sliderControls.max;
        this.step = control.params.sliderControls.step;
        this.value = control.params.value;
        if (!this.context) {
            return;
        }
        this.init();
    }
    /**
     * Initiator
     */
    init() {
        const self = this;
        let slider = this.context.find('.ss-slider'), input = this.context.find('.rl-slider'), inputId = input.attr('id'), id = slider.attr('id');
        jQuery('#' + id).slider({
            value: this.value,
            range: 'min',
            min: this.min,
            max: this.max,
            step: this.step,
            /**
             * Removed Change event because server was flooded with requests from
             * javascript, sending changesets on each increment.
             *
             * @param event
             * @param ui
             */
            slide: function (event, ui) {
                jQuery('#' + inputId).attr('value', ui.value);
            },
            /**
             * Bind the change event to the "actual" stop
             * @param event
             * @param ui
             */
            stop: function (event, ui) {
                jQuery('#' + inputId).trigger('change');
            }
        });
        jQuery(input).on('focus', function () {
            jQuery(this).blur();
        });
        jQuery('#' + inputId).attr('value', (jQuery('#' + id).slider('value')));
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = EpsilonRangeSlider;



/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * Espilon Text Editor Module
 */
class EpsilonTextEditor {
    /**
     * Class Constructor
     * @param {{container: JQuery; params: {value: number; id: string}}} control
     */
    constructor(control) {
        this.context = jQuery(control.container);
        this.editorId = control.params.id + '-editor';
        this.init();
    }
    /**
     * Text editor initiator
     */
    init() {
        wp.editor.initialize(this.editorId, {
            tinymce: {
                wpautop: true,
                setup: function (editor) {
                    editor.on('change', function (e) {
                        editor.save();
                        jQuery(editor.getElement()).trigger('change');
                    });
                }
            },
            quicktags: true
        });
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = EpsilonTextEditor;



/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__extenders_range_slider__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__extenders_icon_picker__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__extenders_text_editor__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__extenders_toggle__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__extenders_toggle___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__extenders_toggle__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__extenders_color_picker__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__extenders_customizer_navigation__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__extenders_image__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__extenders_typography__ = __webpack_require__(14);
/**
 * Controls
 */










/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__controls_typography__ = __webpack_require__(15);

/**
 * Epsilon Typography Control Constructor
 */
wp.customize.controlConstructor['epsilon-typography'] = wp.customize.Control.extend({
    ready: function () {
        var control = this;
        new __WEBPACK_IMPORTED_MODULE_0__controls_typography__["a" /* EpsilonTypography */](control);
        /**
         * Save the typography
         */
        control.container.on('change', '.customize-control-content > .epsilon-typography-input', function (e) {
            console.log(e.target);
            control.setting.set(jQuery(e.target).val());
        });
    }
});


/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__range_slider__ = __webpack_require__(11);

/**
 * Espilon Typography Module
 */
class EpsilonTypography {
    /**
     * Class Constructor
     * @param {{container: JQuery; params: {value: number; id: string}}} control
     */
    constructor(control) {
        this.control = control;
        this.context = jQuery(control.container);
        this.container = this.context.find('.epsilon-typography-container');
        this.selects = this.container.find('select');
        this.inputs = this.container.find('.epsilon-typography-input');
        this.sliders = this.container.find('.slider-container');
        this.id = control.params.id;
        this.init();
    }
    /**
     * Initiator
     */
    init() {
        const self = this;
        let sliderSettings;
        /**
         * Instantiate the selectize javascript plugin
         * and the input type number
         */
        try {
            this._selectize = this.selects.selectize();
        }
        catch (err) {
            /**
             * In case the selectize plugin is not loaded, raise an error
             */
            console.warn('selectize not yet loaded');
        }
        /**
         * On clicking the advanced options toggler,
         */
        this.context.on('click', '.epsilon-typography-advanced > a', function (e) {
            let toggle = jQuery(this).attr('data-toggle');
            e.preventDefault();
            jQuery(this).toggleClass('active').parent().toggleClass('active');
            jQuery('#' + toggle).slideToggle().addClass('active');
        });
        /**
         * Great use of the EpsilonFramework, ahoy!
         */
        jQuery.each(this.sliders, function (index, element) {
            let sliderType = jQuery(element).attr('data-slider-type'), sliderSettings = {
                container: element,
                params: {
                    value: 0,
                    id: '',
                    sliderControls: {
                        min: 0,
                        max: 10,
                        step: 1
                    }
                }
            };
            switch (sliderType) {
                case 'letter-spacing':
                    sliderSettings.params.value = self.control.params.inputs['letter-spacing'];
                    sliderSettings.params.id = self.control.params.id + '-letter-spacing';
                    sliderSettings.params.sliderControls.min = 0;
                    sliderSettings.params.sliderControls.max = 5;
                    sliderSettings.params.sliderControls.step = 0.1;
                    break;
                case 'line-height':
                    sliderSettings.params.value = self.control.params.inputs['line-height'];
                    sliderSettings.params.id = self.control.params.id + '-line-height';
                    sliderSettings.params.sliderControls.min = 0;
                    sliderSettings.params.sliderControls.max = 40;
                    sliderSettings.params.sliderControls.step = 1;
                    break;
                default:
                    sliderSettings.params.value = self.control.params.inputs['font-size'];
                    sliderSettings.params.id = self.control.params.id + '-font-size';
                    sliderSettings.params.sliderControls.min = 0;
                    sliderSettings.params.sliderControls.max = 40;
                    sliderSettings.params.sliderControls.step = 1;
                    break;
            }
            new __WEBPACK_IMPORTED_MODULE_0__range_slider__["a" /* EpsilonRangeSlider */](sliderSettings);
        });
        this.handleEvents();
    }
    /**
     * Handle Events
     */
    handleEvents() {
        const self = this;
        /**
         * On triggering the change event, create a json with the values and
         * send it to the preview window
         */
        this.inputs.on('change', function () {
            var val = self._parseJson();
            jQuery('#hidden_input_' + self.id).val(val).trigger('change');
        });
    }
    /**
     * Parse/create the json and send it to the preview window
     *
     * @param inputs
     * @param id
     * @private
     */
    _parseJson() {
        const self = this;
        var object = {
            'action': 'epsilon_generate_typography_css',
            'class': 'Epsilon_Typography',
            'id': this.id,
            'data': {
                'selectors': this.control.params.selectors,
                'stylesheet': this.control.params.stylesheet,
                'json': {}
            }
        }, api = wp.customize;
        jQuery.each(this.inputs, function (index, value) {
            var key = jQuery(value).attr('id'), replace = self.id + '-', type = jQuery(this).attr('type');
            key = key.replace(replace, '');
            if ('checkbox' === type) {
                object.data.json[key] = jQuery(this).prop('checked') ? jQuery(value).val() : '';
            }
            else {
                object.data.json[key] = jQuery(value).val();
            }
        });
        api.previewer.send('update-inline-typography-css', object);
        return JSON.stringify(object.data);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = EpsilonTypography;



/***/ })
/******/ ]);
//# sourceMappingURL=epsilon-framework-customizer.js.map