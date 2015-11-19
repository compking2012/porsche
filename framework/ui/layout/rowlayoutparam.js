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
 * Row LayoutParam
 * @class RowLayoutParam
 * @extends LayoutParam
 */
Class.define("framework.ui.layout.RowLayoutParam", LayoutParam, {
    initialize: function() {
        this.super.initialize.call(this);
    },

    /**
     * @name RowLayoutParam#align
     * @type {Boolean}
     * @description 
     */
    set align(value) {
        if (value === "bottom") {
            this.alignBottom = true;
        } else if (value === "middle") {
            this.alignMiddle = true;
        } else {
            this.alignTop = true;
        }
    }

}, module);
