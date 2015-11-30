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
var ProgressView = require("./progressview");

/**
 * Circle Progress view that is used to show a rounded progress bar.
 * @class CircleProgressView
 * @extends ProgressView
 */
Class.define("framework.ui.view.CircleProgressView", ProgressView, {
    /**
     * Constructor that create a circle progress view
     * @method CircleProgressView#initialize
     */
    initialize: function() {
        ProgressView.prototype.initialize.apply(this, arguments);

        this._lineWidth = 1;
    },

    /**
     * Destructor that destroy a circle progress view
     * @method CircleProgressView#destroy
     */
    destroy: function() {
        ProgressView.prototype.destroy.apply(this, arguments);
    },

    /**
     * @name CircleProgressView#lineWidth
     * @type {Number}
     * @description the line width of circle progress bar
     */
    get lineWidth() {
        return this._lineWidth;
    },

    set lineWidth(value) {
        this.setProperty("lineWidth", value);
    },

    /**
     * Draw the background of the circle progress view.
     * @method CircleProgressView#drawBackground
     * @param {Context} context - the canvas context to which the view is rendered
     * @protected
     * @override
     */
    drawBackground: function(context) {
        if (this._background === "") {
            return;
        }
        var halfWidth = this._width / 2;
        var halfHeight = this._height / 2;
        context.save();
        context.lineCap = "round";
        context.lineWidth = this._lineWidth;
        context.beginPath();
        context.arc(halfWidth, halfHeight, Math.min(halfWidth, halfHeight) - this._lineWidth / 2, 0, Math.PI * 2, false);
        context.strokeStyle = this._colorManager.getColor(context, this._width, this._height, this._background, this._backgroundObject);
        context.stroke();
        context.restore();
    },

    /**
     * Draw the circle progress view.
     * @method CircleProgressView#draw
     * @param {Context} context - the canvas context to which the view is rendered
     * @protected
     * @override
     */
    draw: function(context) {
        var rad = Math.PI / 2;
        var radian = Math.min(1, Math.max(0, this._value));
        var halfWidth = this._width / 2;
        var halfHeight = this._height / 2;
        context.save();
        context.lineCap = "round";
        context.lineWidth = this._lineWidth;
        context.beginPath();
        context.arc(halfWidth, halfHeight, Math.min(halfWidth, halfHeight) - this._lineWidth / 2, -rad, Math.PI * 2 * radian - rad, false);
        context.strokeStyle = this._colorManager.getColor(context, this._width, this._height, this._color, this._colorObject);
        context.stroke();
        context.restore();
    }
}, module);

});