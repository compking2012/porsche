define(function(require, exports, module) {
"use strict";

var Class = require("../../../framework/class");
var Layout = require("../../../framework/ui/layout/layout");

Class.define("CircleLayout", Layout, {
    initialize: function() {
        Layout.prototype.initialize.apply(this, arguments);
    },

    destroy: function() {
        Layout.prototype.destroy.apply(this, arguments);
    },

    measure: function(originPositions) {
        var length = originPositions.length;
        var newPositions = [];
        for (var i = 0; i < length; i++) {
            var originPosition = originPositions[i];
            var newPosition = {
                left: originPosition.left,
                top: originPosition.top,
                width: originPosition.width,
                height: originPosition.height
            };
            newPosition.left = (this._associatedView.width - newPosition.width) / 2 * (1 - Math.sin(Math.PI * 2 * i / length));
            newPosition.top = (this._associatedView.height - newPosition.height) / 2 * (1 - Math.cos(Math.PI * 2 * i / length));
            newPositions.push(newPosition);
        }
        return newPositions;
    }
}, module);

});