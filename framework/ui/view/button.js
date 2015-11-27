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
var TextView = require("./textview");
var TapRecognizer = require("../gesture/taprecognizer");

/**
 * Button that represents a pushable widget.
 * Pushable buttons can be pressed, or clicked, by the user to perform an action.
 * @class Button
 * @extends TextView
 */
Class.define("framework.ui.view.Button", TextView, {
    /**
     * Constructor that create a button
     * @method Button#initialize
     */
    initialize: function(/*value*/) {
        TextView.prototype.initialize.apply(this, arguments);

        this._align = "center";
        this._radius = 0;
        this.addGestureRecognizer(this._tapRecognizer = new TapRecognizer());
    },

    /**
     * Destructor that destroy this button
     * @method Button#destroy
     */
    destroy: function() {
        this.removeGestureRecognizer(this._tapRecognizer);
        this._tapRecognizer = null;

        TextView.prototype.destroy.apply(this, arguments);
    },

    /**
     * @name Button#radius
     * @type {Number}
     * @description A number that defines the radius of the four corners.
     */
    get radius() {
        return this._radius;
    },

    set radius(value) {
        this.setProperty("radius", value);
    },

    /**
     * Draw the background of the text view.
     * @method TextView#drawBackground
     * @param {Context} context - the canvas context to which the view is rendered
     * @protected
     * @override
     */
    drawBackground: function(context) {
        context.save();
        context.roundRect(0, 0, this._width , this._height, this._radius);
        context.clip();
        TextView.prototype.drawBackground.call(this, context);
        context.restore();
    },

    /**
     * Draw the text view.
     * @method TextView#draw
     * @param {Context} context - the canvas context to which the view is rendered
     * @protected
     * @override
     */
    draw: function(context) {
        context.save();
        context.roundRect(0, 0, this._width , this._height, this._radius);
        context.clip();
        // TODO: Pressed state
        TextView.prototype.draw.call(this, context);
        context.restore();
    }
}, module);
