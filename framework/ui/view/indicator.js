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
 * Indicator widget only use for swipeview
 * @class Indicator
 * @extends View
 **/
Class.define("framework.ui.view.Indicator", View, {
    initialize: function() {
        this.super.initialize.apply(this, arguments);
        this._count = 1;
        this._currentpos = 1;
        this._margin = 10;
        this._radius = 10;
        this._color = "#ffffff";
    },

    destroy: function() {
        this.super.destroy.apply(this, arguments);
    },

    /**
     * @type {Number}
     * @description number of the points.
     * @name CounterPoint#totalcount
     */
    set totalcount(value) {
        this._count = value;
    },

    get totalcount() {
        return this._count;
    },

    /**
     * @type {Number}
     * @description current point number.
     * @name CounterPoint#positon
     */
    set positon(value) {
        this._currentpos = value;
    },

    get positon() {
        return this._currentpos;
    },

    /**
     * @type {Number}
     * @description the radius of the point.
     * @name CounterPoint#radius
     */
    set radius(value) {
        this._radius = value;
    },

    get radius() {
        return this._radius;
    },

    /**
     * @type {Number}
     * @description the margin between points.
     * @name CounterPoint#margin
     */
    set margin(value) {
        this._margin = value;
    },

    get margin() {
        return this._margin;
    },

    /**
     * @type {string}
     * @description the color for points.
     * @name CounterPoint#color
     */
    set color(value) {
        this._color = value;
    },

    get color() {
        return this._color;
    },

    draw: function(context) {
        context.save();
        context.clearRect(0, 0, this.width, this.height);
        var pointlength = this.radius * this.totalcount * 2 + this.margin * (this.totalcount - 1);
        var startpos = (this.width - pointlength) / 2;
        for (var i = 0; i < this.totalcount; i++) {
            context.fillStyle = this._color;
            context.beginPath();
            context.arc(startpos, this.height / 2, this.radius, 0, Math.PI * 2, true);
            context.closePath();
            if (i === this.positon) {
                context.globalAlpha = 1;
            } else {
                context.globalAlpha = 0.5;
            }
            context.fill();
            startpos += this.radius * 2 + this.margin;
        }
        context.restore();
    }
}, module);
