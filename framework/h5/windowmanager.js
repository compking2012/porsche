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
var Class = require("../class");
var EventEmitter = require("../eventemitter");

Class.define("framework.ui.H5WindowManager", EventEmitter, {
    initialize: function() {
        this._windows = [];
        this._mainWindow = null;
    },

    destroy: function() {
        var length = this._windows.length;
        for (var i = 0; i < length; i++) {
            this._windows[i].destroy();
            this._windows[i] = null;
        }
        this._windows = null;
        this._mainWindow = null;
    },

    addWindow: function(win) {
        win.width = 320;
        win.height = 320;
        win.windowManager = this;
        this._windows.push(win);

        if (this._windows.length === 1) {
            this._mainWindow = win;
        }
    }
}, module);
