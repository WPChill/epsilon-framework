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
/******/ 	return __webpack_require__(__webpack_require__.s = 62);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\n/**\n * Ajax request class\n */\nvar EpsilonAjaxRequest = /** @class */ (function () {\n    /**\n     * Constructor\n     * @param {Object} args\n     */\n    function EpsilonAjaxRequest(args) {\n        this.args = args;\n    }\n    /**\n     * Init Request\n     */\n    EpsilonAjaxRequest.prototype.request = function () {\n        var self = this;\n        jQuery.ajax({\n            type: 'POST',\n            data: { action: 'epsilon_framework_ajax_action', args: self.args },\n            dataType: 'json',\n            url: EpsilonWPUrls.ajaxurl,\n            success: function (data) {\n                self.result = data;\n                jQuery(self).trigger('epsilon-received-success');\n            },\n            /**\n             * Throw errors\n             *\n             * @param jqXHR\n             * @param textStatus\n             * @param errorThrown\n             */\n            error: function (jqXHR, textStatus, errorThrown) {\n                console.log(jqXHR + ' :: ' + textStatus + ' :: ' + errorThrown);\n            }\n        });\n    };\n    return EpsilonAjaxRequest;\n}());\nexports.EpsilonAjaxRequest = EpsilonAjaxRequest;\n\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hc3NldHMvdmVuZG9ycy9lcHNpbG9uLWZyYW1ld29yay91dGlscy9lcHNpbG9uLWFqYXgtcmVxdWVzdC50cz85YTRlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0EsOENBQThDLGNBQWM7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsMkRBQTJEO0FBQzlFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLENBQUM7QUFDRCIsImZpbGUiOiIwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG4vKipcbiAqIEFqYXggcmVxdWVzdCBjbGFzc1xuICovXG52YXIgRXBzaWxvbkFqYXhSZXF1ZXN0ID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIC8qKlxuICAgICAqIENvbnN0cnVjdG9yXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGFyZ3NcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBFcHNpbG9uQWpheFJlcXVlc3QoYXJncykge1xuICAgICAgICB0aGlzLmFyZ3MgPSBhcmdzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBJbml0IFJlcXVlc3RcbiAgICAgKi9cbiAgICBFcHNpbG9uQWpheFJlcXVlc3QucHJvdG90eXBlLnJlcXVlc3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgalF1ZXJ5LmFqYXgoe1xuICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgICAgICAgZGF0YTogeyBhY3Rpb246ICdlcHNpbG9uX2ZyYW1ld29ya19hamF4X2FjdGlvbicsIGFyZ3M6IHNlbGYuYXJncyB9LFxuICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgICAgIHVybDogRXBzaWxvbldQVXJscy5hamF4dXJsLFxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICBzZWxmLnJlc3VsdCA9IGRhdGE7XG4gICAgICAgICAgICAgICAgalF1ZXJ5KHNlbGYpLnRyaWdnZXIoJ2Vwc2lsb24tcmVjZWl2ZWQtc3VjY2VzcycpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogVGhyb3cgZXJyb3JzXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHBhcmFtIGpxWEhSXG4gICAgICAgICAgICAgKiBAcGFyYW0gdGV4dFN0YXR1c1xuICAgICAgICAgICAgICogQHBhcmFtIGVycm9yVGhyb3duXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAoanFYSFIsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coanFYSFIgKyAnIDo6ICcgKyB0ZXh0U3RhdHVzICsgJyA6OiAnICsgZXJyb3JUaHJvd24pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9O1xuICAgIHJldHVybiBFcHNpbG9uQWpheFJlcXVlc3Q7XG59KCkpO1xuZXhwb3J0cy5FcHNpbG9uQWpheFJlcXVlc3QgPSBFcHNpbG9uQWpheFJlcXVlc3Q7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2Fzc2V0cy92ZW5kb3JzL2Vwc2lsb24tZnJhbWV3b3JrL3V0aWxzL2Vwc2lsb24tYWpheC1yZXF1ZXN0LnRzXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIDIiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///0\n");

/***/ }),

/***/ 62:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\n__webpack_require__(63);\nvar notices_1 = __webpack_require__(64);\nvar nav_menus_1 = __webpack_require__(65);\njQuery(document).ready(function () {\n    var notices = new notices_1.EpsilonNotices();\n    notices.init();\n    if (typeof wpNavMenu !== 'undefined') {\n        new nav_menus_1.EpsilonNavMenus(wpNavMenu);\n    }\n});\n\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hc3NldHMvdmVuZG9ycy9lcHNpbG9uLWZyYW1ld29yay9hZG1pbi9hZG1pbi50cz82MzM4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0EsOENBQThDLGNBQWM7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyIsImZpbGUiOiI2Mi5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xucmVxdWlyZShcIi4vLi4vLi4vLi4vY3NzL3N0eWxlLWFkbWluLnNjc3NcIik7XG52YXIgbm90aWNlc18xID0gcmVxdWlyZShcIi4vbm90aWNlcy9ub3RpY2VzXCIpO1xudmFyIG5hdl9tZW51c18xID0gcmVxdWlyZShcIi4vbmF2LW1lbnVzL25hdi1tZW51c1wiKTtcbmpRdWVyeShkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xuICAgIHZhciBub3RpY2VzID0gbmV3IG5vdGljZXNfMS5FcHNpbG9uTm90aWNlcygpO1xuICAgIG5vdGljZXMuaW5pdCgpO1xuICAgIGlmICh0eXBlb2Ygd3BOYXZNZW51ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBuZXcgbmF2X21lbnVzXzEuRXBzaWxvbk5hdk1lbnVzKHdwTmF2TWVudSk7XG4gICAgfVxufSk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2Fzc2V0cy92ZW5kb3JzL2Vwc2lsb24tZnJhbWV3b3JrL2FkbWluL2FkbWluLnRzXG4vLyBtb2R1bGUgaWQgPSA2MlxuLy8gbW9kdWxlIGNodW5rcyA9IDIiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///62\n");

/***/ }),

/***/ 63:
/***/ (function(module, exports) {

eval("// removed by extract-text-webpack-plugin\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hc3NldHMvY3NzL3N0eWxlLWFkbWluLnNjc3M/OGI5OCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSIsImZpbGUiOiI2My5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9hc3NldHMvY3NzL3N0eWxlLWFkbWluLnNjc3Ncbi8vIG1vZHVsZSBpZCA9IDYzXG4vLyBtb2R1bGUgY2h1bmtzID0gMiJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///63\n");

/***/ }),

/***/ 64:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar epsilon_ajax_request_1 = __webpack_require__(0);\n/**\n * Epsilon Notices Class\n */\nvar EpsilonNotices = /** @class */ (function () {\n    /**\n     * Class constructor\n     */\n    function EpsilonNotices() {\n        var self = this;\n    }\n    /**\n     * Initiate notice dismissal\n     */\n    EpsilonNotices.prototype.init = function () {\n        var self = this;\n        var notices = jQuery('.epsilon-framework-notice'), id, args, Ajax;\n        jQuery.each(notices, function () {\n            jQuery(this).on('click', '.notice-dismiss', function () {\n                id = jQuery(this).parent().attr('data-unique-id');\n                args = {\n                    action: ['Epsilon_Notifications', 'dismiss_notice'],\n                    nonce: EpsilonWPUrls.ajax_nonce,\n                    args: {\n                        notice_id: jQuery(this).parent().attr('data-unique-id'),\n                        user_id: userSettings.uid,\n                    }\n                };\n                Ajax = new epsilon_ajax_request_1.EpsilonAjaxRequest(args);\n                Ajax.request();\n            });\n        });\n    };\n    return EpsilonNotices;\n}());\nexports.EpsilonNotices = EpsilonNotices;\n\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hc3NldHMvdmVuZG9ycy9lcHNpbG9uLWZyYW1ld29yay9hZG1pbi9ub3RpY2VzL25vdGljZXMudHM/MjE5MyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBLDhDQUE4QyxjQUFjO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixTQUFTO0FBQ1Q7QUFDQTtBQUNBLENBQUM7QUFDRCIsImZpbGUiOiI2NC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIGVwc2lsb25fYWpheF9yZXF1ZXN0XzEgPSByZXF1aXJlKFwiLi4vLi4vdXRpbHMvZXBzaWxvbi1hamF4LXJlcXVlc3RcIik7XG4vKipcbiAqIEVwc2lsb24gTm90aWNlcyBDbGFzc1xuICovXG52YXIgRXBzaWxvbk5vdGljZXMgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgLyoqXG4gICAgICogQ2xhc3MgY29uc3RydWN0b3JcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBFcHNpbG9uTm90aWNlcygpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBJbml0aWF0ZSBub3RpY2UgZGlzbWlzc2FsXG4gICAgICovXG4gICAgRXBzaWxvbk5vdGljZXMucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdmFyIG5vdGljZXMgPSBqUXVlcnkoJy5lcHNpbG9uLWZyYW1ld29yay1ub3RpY2UnKSwgaWQsIGFyZ3MsIEFqYXg7XG4gICAgICAgIGpRdWVyeS5lYWNoKG5vdGljZXMsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGpRdWVyeSh0aGlzKS5vbignY2xpY2snLCAnLm5vdGljZS1kaXNtaXNzJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlkID0galF1ZXJ5KHRoaXMpLnBhcmVudCgpLmF0dHIoJ2RhdGEtdW5pcXVlLWlkJyk7XG4gICAgICAgICAgICAgICAgYXJncyA9IHtcbiAgICAgICAgICAgICAgICAgICAgYWN0aW9uOiBbJ0Vwc2lsb25fTm90aWZpY2F0aW9ucycsICdkaXNtaXNzX25vdGljZSddLFxuICAgICAgICAgICAgICAgICAgICBub25jZTogRXBzaWxvbldQVXJscy5hamF4X25vbmNlLFxuICAgICAgICAgICAgICAgICAgICBhcmdzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBub3RpY2VfaWQ6IGpRdWVyeSh0aGlzKS5wYXJlbnQoKS5hdHRyKCdkYXRhLXVuaXF1ZS1pZCcpLFxuICAgICAgICAgICAgICAgICAgICAgICAgdXNlcl9pZDogdXNlclNldHRpbmdzLnVpZCxcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgQWpheCA9IG5ldyBlcHNpbG9uX2FqYXhfcmVxdWVzdF8xLkVwc2lsb25BamF4UmVxdWVzdChhcmdzKTtcbiAgICAgICAgICAgICAgICBBamF4LnJlcXVlc3QoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIHJldHVybiBFcHNpbG9uTm90aWNlcztcbn0oKSk7XG5leHBvcnRzLkVwc2lsb25Ob3RpY2VzID0gRXBzaWxvbk5vdGljZXM7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2Fzc2V0cy92ZW5kb3JzL2Vwc2lsb24tZnJhbWV3b3JrL2FkbWluL25vdGljZXMvbm90aWNlcy50c1xuLy8gbW9kdWxlIGlkID0gNjRcbi8vIG1vZHVsZSBjaHVua3MgPSAyIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///64\n");

/***/ }),

/***/ 65:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\n/**\n * Epsilon Nav Menu Class\n */\nvar EpsilonNavMenus = /** @class */ (function () {\n    /**\n     * Constructor\n     * @param api\n     */\n    function EpsilonNavMenus(api) {\n        this.api = api;\n        this.context = jQuery('#epsilon-section-navigation-menu');\n        this.handleEvents();\n    }\n    EpsilonNavMenus.prototype.handleEvents = function () {\n        var _this = this;\n        jQuery('#submit-epsilon-section').on('click', function (evt) {\n            var self = _this;\n            var object = {\n                label: _this.context.find('#epsilon-section-label').val(),\n                value: _this.context.find('#epsilon-section-id').val()\n            };\n            evt.preventDefault();\n            _this.context.find('.spinner').addClass('is-active');\n            _this.api.addItemToMenu({\n                '-1': {\n                    'menu-item-type': 'custom',\n                    'menu-item-extra': 'epsilon-frontpage-section',\n                    'menu-item-url': '#' + object.value,\n                    'menu-item-section': object.value,\n                    'menu-item-title': object.label\n                }\n            }, self.api.addMenuItemToBottom, self.menuAdded);\n        });\n    };\n    EpsilonNavMenus.prototype.menuAdded = function () {\n        var div = jQuery('#epsilon-section-navigation-menu');\n        div.find('.spinner').removeClass('is-active');\n        div.find('#epsilon-section-navigation-menu #epsilon-section-id').val(0).blur();\n        div.find('#epsilon-section-navigation-menu #epsilon-section-label').val('').blur();\n    };\n    return EpsilonNavMenus;\n}());\nexports.EpsilonNavMenus = EpsilonNavMenus;\n\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hc3NldHMvdmVuZG9ycy9lcHNpbG9uLWZyYW1ld29yay9hZG1pbi9uYXYtbWVudXMvbmF2LW1lbnVzLnRzPzVmYjUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQSw4Q0FBOEMsY0FBYztBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCIsImZpbGUiOiI2NS5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuLyoqXG4gKiBFcHNpbG9uIE5hdiBNZW51IENsYXNzXG4gKi9cbnZhciBFcHNpbG9uTmF2TWVudXMgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgLyoqXG4gICAgICogQ29uc3RydWN0b3JcbiAgICAgKiBAcGFyYW0gYXBpXG4gICAgICovXG4gICAgZnVuY3Rpb24gRXBzaWxvbk5hdk1lbnVzKGFwaSkge1xuICAgICAgICB0aGlzLmFwaSA9IGFwaTtcbiAgICAgICAgdGhpcy5jb250ZXh0ID0galF1ZXJ5KCcjZXBzaWxvbi1zZWN0aW9uLW5hdmlnYXRpb24tbWVudScpO1xuICAgICAgICB0aGlzLmhhbmRsZUV2ZW50cygpO1xuICAgIH1cbiAgICBFcHNpbG9uTmF2TWVudXMucHJvdG90eXBlLmhhbmRsZUV2ZW50cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgalF1ZXJ5KCcjc3VibWl0LWVwc2lsb24tc2VjdGlvbicpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChldnQpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gX3RoaXM7XG4gICAgICAgICAgICB2YXIgb2JqZWN0ID0ge1xuICAgICAgICAgICAgICAgIGxhYmVsOiBfdGhpcy5jb250ZXh0LmZpbmQoJyNlcHNpbG9uLXNlY3Rpb24tbGFiZWwnKS52YWwoKSxcbiAgICAgICAgICAgICAgICB2YWx1ZTogX3RoaXMuY29udGV4dC5maW5kKCcjZXBzaWxvbi1zZWN0aW9uLWlkJykudmFsKClcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIF90aGlzLmNvbnRleHQuZmluZCgnLnNwaW5uZXInKS5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICBfdGhpcy5hcGkuYWRkSXRlbVRvTWVudSh7XG4gICAgICAgICAgICAgICAgJy0xJzoge1xuICAgICAgICAgICAgICAgICAgICAnbWVudS1pdGVtLXR5cGUnOiAnY3VzdG9tJyxcbiAgICAgICAgICAgICAgICAgICAgJ21lbnUtaXRlbS1leHRyYSc6ICdlcHNpbG9uLWZyb250cGFnZS1zZWN0aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgJ21lbnUtaXRlbS11cmwnOiAnIycgKyBvYmplY3QudmFsdWUsXG4gICAgICAgICAgICAgICAgICAgICdtZW51LWl0ZW0tc2VjdGlvbic6IG9iamVjdC52YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgJ21lbnUtaXRlbS10aXRsZSc6IG9iamVjdC5sYWJlbFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIHNlbGYuYXBpLmFkZE1lbnVJdGVtVG9Cb3R0b20sIHNlbGYubWVudUFkZGVkKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBFcHNpbG9uTmF2TWVudXMucHJvdG90eXBlLm1lbnVBZGRlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGRpdiA9IGpRdWVyeSgnI2Vwc2lsb24tc2VjdGlvbi1uYXZpZ2F0aW9uLW1lbnUnKTtcbiAgICAgICAgZGl2LmZpbmQoJy5zcGlubmVyJykucmVtb3ZlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuICAgICAgICBkaXYuZmluZCgnI2Vwc2lsb24tc2VjdGlvbi1uYXZpZ2F0aW9uLW1lbnUgI2Vwc2lsb24tc2VjdGlvbi1pZCcpLnZhbCgwKS5ibHVyKCk7XG4gICAgICAgIGRpdi5maW5kKCcjZXBzaWxvbi1zZWN0aW9uLW5hdmlnYXRpb24tbWVudSAjZXBzaWxvbi1zZWN0aW9uLWxhYmVsJykudmFsKCcnKS5ibHVyKCk7XG4gICAgfTtcbiAgICByZXR1cm4gRXBzaWxvbk5hdk1lbnVzO1xufSgpKTtcbmV4cG9ydHMuRXBzaWxvbk5hdk1lbnVzID0gRXBzaWxvbk5hdk1lbnVzO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9hc3NldHMvdmVuZG9ycy9lcHNpbG9uLWZyYW1ld29yay9hZG1pbi9uYXYtbWVudXMvbmF2LW1lbnVzLnRzXG4vLyBtb2R1bGUgaWQgPSA2NVxuLy8gbW9kdWxlIGNodW5rcyA9IDIiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///65\n");

/***/ })

/******/ });