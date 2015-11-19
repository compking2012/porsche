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
 * Button widget
 * @class Button
 * @extends TextView
 */
Class.define("framework.ui.view.Button", TextView, {
    /**
     * Constructor
     * @method Button#initialize
     */
    initialize: function(/*value*/) {
        this.super.initialize.call(this);

        this._radius = 0;
        this.addGestureRecognizer(this._tapRecognizer = new TapRecognizer());
    },

    /**
     * Destructor
     * @method Button#destroy
     */
    destroy: function() {
        this.removeGestureRecognizer(this._tapRecognizer);
        this._tapRecognizer = null;

        this.super.destroy.call(this);
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
        context.roundRect(0, 0, this._width , this._height, this._radius);
        context.clip();
        this.super.drawBackground.call(this, context);
        context.restore();
    },

    draw: function(context) {
        context.save();
        context.roundRect(0, 0, this._width , this._height, this._radius);
        context.clip();
        // TODO: Pressed state
        this.super.draw.call(this, context);
        context.restore();
    }
}, module);
