!function(e){function t(o){if(n[o])return n[o].exports;var i=n[o]={i:o,l:!1,exports:{}};return e[o].call(i.exports,i,i.exports,t),i.l=!0,i.exports}var n={};t.m=e,t.c=n,t.d=function(e,n,o){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:o})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="/assets/js/",t(t.s=57)}({0:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=function(){function e(e){this.args=e}return e.prototype.request=function(){var e=this;jQuery.ajax({type:"POST",data:{action:"epsilon_framework_ajax_action",args:e.args},dataType:"json",url:EpsilonWPUrls.ajaxurl,success:function(t){e.result=t,jQuery(e).trigger("epsilon-received-success")},error:function(e,t,n){console.log(e+" :: "+t+" :: "+n)}})},e}();t.EpsilonAjaxRequest=o},57:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(58),i=n(59),s=n(60),r=n(61),c=n(62),a=n(63),u=n(64);wp.customize.bind("preview-ready",function(){new o.EpsilonColorSchemesPreviewer,new i.EpsilonTypographyPreviewer,new s.EpsilonSectionEditorPreviewer,new r.EpsilonPartialRefresh,new u.EpsilonSectionFocus,new c.EpsilonZoneFocuser,new a.EpsilonPreviewPageChanger})},58:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(0),i=function(){function e(){this.index=0;wp.customize.preview.bind("update-inline-color-schemes-css",function(e){var t,n={action:[e.class,e.action],nonce:EpsilonWPUrls.ajax_nonce,args:e.data,id:e.id};t=new o.EpsilonAjaxRequest(n),t.request(),jQuery(t).on("epsilon-received-success",function(n){var o=e.action+e.id,i=jQuery("#epsilon-stylesheet-"+o);i.length||(i=jQuery("body").append('<style type="text/css" id="epsilon-stylesheet-'+o+'" />').find("#epsilon-stylesheet-"+o)),i.html()!==t.result.css&&i.html(t.result.css),wp.customize.preview.send("epsilon-set-color-schemes-loading",!1)})})}return e}();t.EpsilonColorSchemesPreviewer=i},59:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(0),i=function(){function e(){wp.customize.preview.bind("update-inline-typography-css",function(e){var t,n,i={action:[e.class,e.action],nonce:EpsilonWPUrls.ajax_nonce,args:e.data,id:e.id};n=new o.EpsilonAjaxRequest(i),n.request(),jQuery(n).on("epsilon-received-success",function(e){t=jQuery("#"+n.result.stylesheet+"-inline-css"),t.length||(t=jQuery("body").append('<style type="text/css" id="'+n.result.stylesheet+'-inline-css" />').find("#"+n.result.stylesheet+"-inline-css"));for(var o=0;o<n.result.fonts.length;o++)jQuery('link[href="https://fonts.googleapis.com/css?family='+n.result.fonts[o]+'"]').length||jQuery("head").append('<link href="https://fonts.googleapis.com/css?family='+n.result.fonts[o]+'" rel="stylesheet">');t.html(n.result.css),wp.customize.preview.send("epsilon-set-typography-loading",!1)})})}return e}();t.EpsilonTypographyPreviewer=i},60:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=function(){function e(){this.normalSectionFocus(),this.advancedSectionFocus(),this.repeaterFieldFocus()}return e.prototype.normalSectionFocus=function(){jQuery(document).on("click",".epsilon-section-editor",function(e){e.preventDefault();var t={section:jQuery(this).parents("[data-section]").attr("data-section"),customizerSection:jQuery(this).parents("[data-section]").attr("data-customizer-section-id")};wp.customize.preview.send("epsilon-section-edit",t)})},e.prototype.repeaterFieldFocus=function(){jQuery(document).on("click",".epsilon-field-repeater-editor",function(e){e.preventDefault();var t={section:jQuery(this).parents("[data-section]").attr("data-section"),doubledSection:jQuery(this).attr("data-doubled-section"),control:jQuery(this).attr("data-control"),field:jQuery(this).attr("data-index"),customizerSection:jQuery(this).parents("[data-section]").attr("data-customizer-section-id")};wp.customize.preview.send("epsilon-field-repeater-edit",t)}),jQuery(document).on("click",".epsilon-field-repeater-delete-item",function(e){e.preventDefault();var t={control:jQuery(this).attr("data-control"),field:jQuery(this).attr("data-index")};wp.customize.preview.send("epsilon-field-repeater-delete",t)})},e.prototype.advancedSectionFocus=function(){jQuery(document).on("click",".epsilon-pencil-button-group > a",function(e){e.preventDefault();var t={section:jQuery(this).parents("[data-section]").attr("data-section"),customizerSection:jQuery(this).parents("[data-section]").attr("data-customizer-section-id"),sectionTab:jQuery(this).attr("data-focus")};wp.customize.preview.send("epsilon-section-edit",t)})},e}();t.EpsilonSectionEditorPreviewer=o},61:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(0),i=function(){function e(){this.sections=[],this.registerSections(),this.handleEvents()}return e.prototype.registerSections=function(){for(var e=this,t=jQuery("[data-customizer-section-id]"),n=0;n<t.length;n++){var o=jQuery(t[n]).attr("data-section"),i={id:parseInt(o),section:jQuery(t[n])};e.sections.push(i)}},e.prototype.handleEvents=function(){var e=this;wp.customize.preview.bind("updated-section-repeater",_.debounce(function(t){e.changeSection(t)},300))},e.prototype.changeSection=function(e){var t,n=this,i={action:["Epsilon_Page_Generator","generate_partial_section"],nonce:EpsilonWPUrls.ajax_nonce,args:{control:e.control,postId:e.postId,id:e.index,value:e.value}};t=new o.EpsilonAjaxRequest(i),t.request(),this.standBySection(n.sections[e.index].section),jQuery(t).on("epsilon-received-success",function(o){n.liveSection(e.index,n.sections[e.index].section,t.result.section),jQuery(document).trigger("epsilon-selective-refresh-ready")})},e.prototype.standBySection=function(e){e.animate({opacity:.5})},e.prototype.liveSection=function(e,t,n){var o=this;t.replaceWith(n),o.sections=[],o.registerSections(),t.animate({opacity:1})},e}();t.EpsilonPartialRefresh=i},62:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=function(){function e(){var e=this;wp.customize.preview.bind("epsilon-footer-focused",_.debounce(function(t){e.scrollTo(t)},300)),wp.customize.preview.bind("epsilon-header-focused",_.debounce(function(t){e.scrollTo(t)},300))}return e.prototype.scrollTo=function(e){var t=this.calculateOffsets(jQuery(e));jQuery("html, body").animate({scrollTop:t},500)},e.prototype.calculateOffsets=function(e){var t=e.offset();return void 0!==t&&t.hasOwnProperty("top")?t.top:0},e}();t.EpsilonZoneFocuser=o},63:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=function(){function e(){wp.customize.preview.bind("epsilon-preview-page-change",function(e){console.log(e)})}return e}();t.EpsilonPreviewPageChanger=o},64:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=function(){function e(){var e=this;wp.customize.preview.bind("epsilon-section-focused",_.debounce(function(t){void 0===t&&(t={index:0,closed:!0}),t.closed||e.scrollTo(t.index)},300))}return e.prototype.scrollTo=function(e){void 0===e&&(e=0);var t,n=$('[data-section="'+e+'"]');t=this.calculateOffsets(n),$("html, body").animate({scrollTop:t},500)},e.prototype.calculateOffsets=function(e){var t=e.offset();return void 0!==t&&t.hasOwnProperty("top")?t.top:0},e}();t.EpsilonSectionFocus=o}});
//# sourceMappingURL=epsilon-framework-previewer.js.map