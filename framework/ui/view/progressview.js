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
var View = require("./view");
var GradientParser = require("../../util/gradientparser");

/**
 * Circle progress widget
 * @class ProgressView
 * @extends View
 */
Class.define("framework.ui.view.ProgressView", View, {
    /**
     * Constructor
     * @method ProgressView#initialize
     */
    initialize: function() {
        View.prototype.initialize.apply(this, arguments);

        this._value = 0;
        this._lineWidth = 5;
        this._background = "#C8C8C8";
        this._foreground = "#00D4A0";
    },

    /**
     * Destructor
     * @method ProgressView#destroy
     */
    destroy: function() {
        this._backgroundObject = null;
        this._foregroundObject = null;

        View.prototype.destroy.apply(this, arguments);
    },

    get foreground() {
        return this._foreground;
    },

    set foreground(value) {
        this._foreground = value;
        if (/^linear\-gradient/.test(this._foreground)) {
            var linear = GradientParser.parse(this._foreground);
            this._foregroundObject = linear;
        } else if (/^radial\-gradient/.test(this._foreground)) {
            var radial = GradientParser.parse(this._foreground);
            this._foregroundObject = null;
        } else {
            this._foregroundObject = null;
        }
        this.invalidate();
    },

    /**
     * @name ProgressView#lineWidth
     * @type {Number}
     * @description the line width of the circle.
     */
    get lineWidth() {
        return this._lineWidth;
    },

    set lineWidth(value) {
        this._lineWidth = value;
        this.invalidate();
    },

    /**
     * @name ProgressView#value
     * @type {Number} the counter between 0 and 1.
     * @description The counter value.
     */
    get value() {
        return this._value;
    },

    set value(value) {
        this._value = value;
        this.invalidate();
    },

    drawBackground: function(context) {
        var halfHeight = this._height / 2;

        context.save();
        context.lineCap = "round";
        context.lineWidth = this._lineWidth;
        context.beginPath();
        context.moveTo(0, halfHeight);
        context.lineTo(this._width, halfHeight);
        context.strokeStyle = this.getBackground(context);
        context.stroke();
        context.restore();
    },

    draw: function(context) {
        if (this._value === 0) {
            return;
        }
        var halfHeight = this._height / 2;

        context.save();
        context.lineCap = "round";
        context.lineWidth = this._lineWidth;
        context.beginPath();
        context.moveTo(0, halfHeight);
        context.lineTo(this._width * this._value, halfHeight);
        if (/^linear\-gradient/.test(this._foreground)) {
            var linear = this._foregroundObject;
            var colorStopStart = linear[0].colorStops[0];
            var colorStopEnd = linear[0].colorStops[1];
            var gradient = context.createLinearGradient(0, 0, this._width, this._height);
            gradient.addColorStop(0, colorStopStart.type === "hex" ? "#" + colorStopStart.value : colorStopStart.value);
            gradient.addColorStop(1, colorStopEnd.type === "hex" ? "#" + colorStopEnd.value : colorStopEnd.value);
            context.strokeStyle = gradient;
        } else if (/^radial\-gradient/.test(this._foreground)) {
            var radial = this._foregroundObject;
            // context.strokeStyle = null;
        } else {
            context.strokeStyle = this._foreground;
        }
        context.stroke();
        context.restore();
    }
}, module);

});