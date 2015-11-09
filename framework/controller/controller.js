"use strict";
var Class = require("../class");
var EventEmitter = require("../yobject");

Class.define("{Framework}.controller.Controller", EventEmitter, {
    initialize: function() {
        EventEmitter.prototype.initialize.apply(this, arguments);

        this._parent = null;
        this._view = null;
    },

    destroy: function() {
        EventEmitter.prototype.destroy.apply(this, arguments);
    },

    get view() {
        return this._view;
    },

    set view(value) {
        this._view = value;
    },

    get parent() {
        return this._parent;
    },

    set parent(value) {
        this._parent = value;
    },

    get app() {
        if (this.parent.window !== undefined) {
            return this.parent;
        }
        return this.parent.app;
    }
}, module);
