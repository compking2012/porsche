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

/**
 * Progress view that is used to depict the progress of a task over time.
 * An example of a progress bar is the one shown at the bottom of the application when it’s downloading something.
 * The class provides properties for managing the style of the progress bar and
 * for getting and setting values that are pinned to the progress of a task.
 * @class ProgressView
 * @extends View
 */
Class.define("framework.ui.view.ProgressView", View, {
    /**
     * Constructor that create a progress view
     * @method ProgressView#initialize
     */
    initialize: function() {
        View.prototype.initialize.apply(this, arguments);

        this._value = 0;
        this._background = "#C8C8C8";
        this._color = "#00D4A0";
        this._colorObject = null;
    },

    /**
     * Destructor that destroy this progress view
     * @method ProgressView#destroy
     */
    destroy: function() {
        this._foregroundObject = null;

        View.prototype.destroy.apply(this, arguments);
    },

    /**
     * @name ProgressView#value
     * @type {Number}
     * @description the value of the progress, between 0 and 1.
     */
    get value() {
        return this._value;
    },

    set value(value) {
        this.setProperty("value", value);
    },

    /**
     * @name ProgressView#color
     * @type {String}
     * @description The foreground bar color of this progress view.
     */
    get color() {
        return this._color;
    },

    set color(value) {
        this.setProperty("color", value, function() {
            this._colorObject = this._colorManager.getColorObject(this._color);
        }.bind(this));
    },

    /**
     * Draw the background of the progress view.
     * @method ProgressView#drawBackground
     * @param {Context} context - the canvas context to which the view is rendered
     * @protected
     * @override
     */
    drawBackground: function(context) {
        if (this._background === "") {
            return;
        }
        context.save();
        context.roundRect(0, 0, this._width, this._height, this._height / 2);
        context.fillStyle = this._colorManager.getColor(context, this._width, this._height, this._background, this._backgroundObject);
        context.fill();
        context.restore();
    },

    /**
     * Draw the progress view.
     * @method ProgressView#draw
     * @param {Context} context - the canvas context to which the view is rendered
     * @protected
     * @override
     */
    draw: function(context) {
        if (this._value === 0) {
            return;
        }
        context.save();
        context.roundRect(0, 0, this._width * this._value, this._height, this._height / 2);
        context.fillStyle = this._colorManager.getColor(context, this._width, this._height, this._color, this._colorObject);
        context.fill();
        context.restore();
    }
}, module);
