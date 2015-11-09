"use strict";
var Class = require("../../class");
var Window = require("./window");

/**
 * Base Dialog class
 * @class Dialog
 * @extends Window
 */
Class.define("{Framework}.ui.view.Dialog", Window, {
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
