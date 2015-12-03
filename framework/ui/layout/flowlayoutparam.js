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
var LayoutParam = require("./layoutparam");

/**
 * Flow LayoutParam
 * @class FlowLayoutParam
 * @extends LayoutParam
 * @private
 */
Class.define("framework.ui.layout.FlowLayoutParam", LayoutParam, {
    initialize: function() {
        LayoutParam.prototype.initialize.apply(this, arguments);

        this._itemSpacing = 10; // vertical spacing betwwen views and and parent container
    },

    get itemSpacing() {
        return this._itemSpacing;
    },

    set itemSpacing(value) {
        this._itemSpacing = value;
        this.invalidate();
    }

}, module);

});