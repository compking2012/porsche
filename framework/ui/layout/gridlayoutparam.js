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
 * Grid LayoutParam
 * @class GridLayoutParam
 * @extends LayoutParam
 * @private
 */
Class.define("framework.ui.layout.GridLayoutParam", LayoutParam, {
    initialize: function() {
        LayoutParam.prototype.initialize.apply(this, arguments);
        
        this._align = "center"; // left right center fill-parent
        this._valign = "middle"; // top bottom middle fill-parent
    },

    /**
     * @name GridLayoutParam#align
     * @type {String} such as left, right and center
     * @description the alignment for the views on the horizontal direction
     */
    get align() {
        return this._align;
    },

    set align(value) {
        this._align = value;
        this.invalidate();
    },

    /**
     * @name GridLayoutParam#valign
     * @type {String} such as top, bottom and middle
     * @description the alignment for the views on the vertical direction
     */
    get valign() {
        return this._valign;
    },

    set valign(value) {
        this._valign = value;
        this.invalidate();
    }

}, module);

});