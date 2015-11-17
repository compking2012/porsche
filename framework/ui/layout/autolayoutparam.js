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
 * Column LayoutParam
 * @class ColumnLayoutParam
 * @extends LayoutParam
 */
Class.define("framework.ui.layout.AutoLayoutParam", LayoutParam, {
    initialize: function() {
        this.super.initialize.apply(this, arguments);
    },

    destroy: function() {
        this.super.destroy.apply(this, arguments);
    }
}, module);
