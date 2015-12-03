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
 * Row layout param that provides all parameters for the associated row layout.
 * @class RowLayoutParam
 * @extends LayoutParam
 */
Class.define("framework.ui.layout.RowLayoutParam", LayoutParam, {
    /**
     * Constructor that create a row layout param.
     * @method RowLayoutParam#initialize
     * @param {Layout} layout - the associated layout.
     */
    initialize: function(/*layout*/) {
        LayoutParam.prototype.initialize.apply(this, arguments);
    },

    /**
     * Destructor that destroy this column layout param.
     * @method ColumnLayoutParam#destroy
     */
    destroy: function() {
        LayoutParam.prototype.destroy.apply(this, arguments);
    }
}, module);
