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
 * Auto layout param that provides all parameters for the associated auto layout.
 * @class AutoLayoutParam
 * @extends LayoutParam
 */
Class.define("framework.ui.layout.AutoLayoutParam", LayoutParam, {
    /**
     * Constructor that create an auto layout param.
     * @method AutoLayoutParam#initialize
     * @param {Layout} layout - the associated layout.
     */
    initialize: function() {
        LayoutParam.prototype.initialize.apply(this, arguments);
    },

    /**
     * Destructor that destroy this auto layout param.
     * @method AutoLayoutParam#destroy
     */
    destroy: function() {
        LayoutParam.prototype.destroy.apply(this, arguments);
    }
}, module);

});