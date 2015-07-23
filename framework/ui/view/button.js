define(function(require, exports, module) {

"use strict";
var Class = require("../../class");
var TextView = require("./textview");

/**
 * Button widget, send click and cancel events
 * @class Button
 * @param {string} [text] value of the text show in button
 * @extends View
 **/
Class.define("framework.ui.view.Button", TextView, {
    initialize: function(/*value*/) {
        TextView.prototype.initialize.apply(this, arguments);

        this._radius = 0;
        this._textAlign = "center";
    },

    destroy: function() {
        TextView.prototype.destroy.apply(this, arguments);
    },

    get radius() {
        return this._radius;
    },

    set radius(value) {
        this._radius = value;
        this.invalidate();
    },

    drawBackground: function(context) {
        context.save();
        if (this._selected) {
            context.globalAlpha = 0.6;
        }
        context.roundRect(0, 0, this._width , this._height, this._radius);
        context.clip();
        TextView.prototype.drawBackground.call(this, context);
        context.restore();
    },

    draw: function(context) {
        context.save();
        if (this._selected) {
            context.globalAlpha = 0.6;
        }
        context.roundRect(0, 0, this._width , this._height, this._radius);
        context.clip();
        // TODO: Pressed state
        TextView.prototype.draw.call(this, context);
        context.restore();
    }
}, module);

});
