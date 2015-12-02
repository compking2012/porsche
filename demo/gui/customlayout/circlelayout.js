"use strict";
var fx = require("framework");
var Class = fx.import("framework.Class");
var Layout = fx.import("framework.ui.layout.Layout");

Class.define("CircleLayout", Layout, {
    initialize: function() {
        Layout.prototype.initialize.apply(this, arguments);
    },

    destroy: function() {
        Layout.prototype.destroy.apply(this, arguments);
    },

    perform: function() {
        var length = this._associatedView.children.length;
        for (var i = 0; i < length; i++) {
            var view = this._associatedView.children[i];
            view.left = (this._associatedView.width - view.width) / 2 * (1 - Math.sin(Math.PI * 2 * i / length));
            view.top = (this._associatedView.height - view.height) / 2 * (1 - Math.cos(Math.PI * 2 * i / length));
            console.log(view.left, view.top);
        }
    }
}, module);
