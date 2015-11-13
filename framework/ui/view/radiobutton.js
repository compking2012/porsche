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
var CheckBox = require("./checkbox");

Class.define("framework.ui.view.RadioButton", CheckBox, {
    initialize: function () {
        CheckBox.prototype.initialize.apply(this, arguments);
    },

    destroy: function() {
        CheckBox.prototype.destroy.apply(this, arguments);
    }
}, module);
