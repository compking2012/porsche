define(function(require, exports, module) {
/**
* Porsche.js is licensed under the MIT license. If a copy of the
* MIT-license was not distributed with this file, You can obtain one at:
* http://opensource.org/licenses/mit-license.html.
*
* @author: Yang Yang (compking@gmail.com)
* @license MIT
* @copyright Yang Yang, 2015
*/

"use strict";
var Class = require("../../class");
var Switch = require("./switch");

/**
 * CheckBox is a specific type of two-states button that can be either checked or unchecked.
 * @class CheckBox
 * @extends Switch
 */
Class.define("framework.ui.view.CheckBox", Switch, {
    /**
     * Constructor that create a checkbox
     * @method CheckBox#initialize
     */
    initialize: function () {
        Switch.prototype.initialize.apply(this, arguments);
    },

    /**
     * Destructor that destroy this checkbox
     * @method CheckBox#destroy
     */
    destroy: function() {
        Switch.prototype.destroy.apply(this, arguments);
    },

    /**
     * Specifiy the urls of the image state, including on, off and disabled
     * @method Switch#setImageSrcs
     * @protected
     */
    setImageSrcs: function() {
        this._disabledImageSrc = global.AppFXRootPath + "/resources/checkboxdisabled.png";
        this._offImageSrc = global.AppFXRootPath + "/resources/checkboxoff.png";
        this._onImageSrc = global.AppFXRootPath + "/resources/checkboxon.png";
    }
}, module);

});