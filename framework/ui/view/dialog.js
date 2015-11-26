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
var Window = require("./window");

/**
 * Base Dialog class
 * @class Dialog
 * @extends Window
 */
Class.define("framework.ui.view.Dialog", Window, {
    initialize: function(/*options*/) {
        Window.prototype.initialize.apply(this, arguments);
        this._width = 320;
        this._height = 320;
    },

    destroy: function() {
        Window.prototype.destroy.apply(this, arguments);
    },

    show: function() {
        global.app.windowManager.showDialog(this);
    },

    close: function() {
        global.app.windowManager.closeDialog();
    }
}, module);

});