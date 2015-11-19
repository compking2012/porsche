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
 * CheckBox widget
 * @class CheckBox
 * @extends Switch
 */
Class.define("framework.ui.view.CheckBox", Switch, {
    /**
     * Constructor
     * @method CheckBox#initialize
     */
    initialize: function() {
        this.super.initialize.call(this);

        this._disabledSrc = global.AppFXRootPath + "/resources/checkboxdisabled.png";
        this._offSrc = global.AppFXRootPath + "/resources/checkboxoff.png";
        this._onSrc = global.AppFXRootPath + "/resources/checkboxon.png";
    },

    /**
     * Destructor
     * @method CheckBox#destroy
     */
    destroy: function() {
        this.super.destroy.call(this);
    }
}, module);
