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
var ProgressView = require("./progressview");

/**
 * Circle Progress widget
 * @class CircleProgressView
 * @extends ProgressView
 */
Class.define("framework.ui.view.CircleProgressView", ProgressView, {
    /**
     * Constructor
     * @method CircleProgressView#initialize
     */
    initialize: function() {
        this.super.initialize.call(this);

        this._lineWidth = 1;
    },

    /**
     * Destructor
     * @method CircleProgressView#destroy
     */
    destroy: function() {
        this.super.destroy.call(this);
    },

    drawBackground: function(context) {
        var halfWidth = this._width / 2;
        var halfHeight = this._height / 2;
        var halfLineWidth = this._lineWidth / 2;

        context.lineCap = "round";
        context.lineWidth = this._lineWidth;
        context.beginPath();
        context.arc(halfWidth, halfHeight, Math.min(halfWidth, halfHeight) - halfLineWidth, 0, Math.PI * 2, false);
        if (/^linear\-gradient/.test(this._background)) {
            var linear = this._backgroundObject;
            var colorStopStart = linear[0].colorStops[0];
            var colorStopEnd = linear[0].colorStops[1];
            var gradient = context.createLinearGradient(0, 0, this._width, this._height);
            gradient.addColorStop(0, colorStopStart.type === "hex" ? "#" + colorStopStart.value : colorStopStart.value);
            gradient.addColorStop(1, colorStopEnd.type === "hex" ? "#" + colorStopEnd.value : colorStopEnd.value);
            context.strokeStyle = gradient;
        } else if (/^radial\-gradient/.test(this._background)) {
            var radial = this._backgroundObject;
            // context.strokeStyle = null;
        } else {
            context.strokeStyle = this._background;
        }
        context.stroke();
    },

    draw: function(context) {
        var rad = Math.PI / 2;
        var radian = Math.min(1, Math.max(0, this._value));
        var halfWidth = this._width / 2;
        var halfHeight = this._height / 2;
        var halfLineWidth = this._lineWidth / 2;

        context.lineCap = "round";
        context.lineWidth = this._lineWidth;
        context.beginPath();
        context.arc(halfWidth, halfHeight, Math.min(halfWidth, halfHeight) - halfLineWidth, -rad, Math.PI * 2 * radian - rad, false);
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
    }
}, module);
