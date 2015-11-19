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
var Class = require("../class");
var YObject = require("../yobject");

/**
 * Base struct for point
 * @class Point
 * @extends YObject
 */
Class.define("framework.ui.Point", YObject, {
    /**
     * Constructor
     * @method Point#initialize
     * @param {Number} x the x-axis value
     * @param {Number} y the y-axis value
     */
    initialize: function(x, y) {
        this.super.initialize.call(this);

        this._x = x;
        this._y = y;
    },

    /**
     * Get x-axis value.
     * @name Point#x
     * @type {Number}
     */
    get x() {
        return this._x;
    },

    /**
     * Get y-axis value.
     * @name Point#y
     * @type {Number}
     */
    get y() {
        return this._y;
    },

    /**
     * Set the point params.
     * @method Point#assign
     * @param {Number} x the point's x-axis.
     * @param {Number} y the point's y-axis.
     */
    assign: function(x, y) {
        this._x = x;
        this._y = y;
        return this;
    },

    offset: function(dx, dy) {
        this._x += dx;
        this._y += dy;
    },

    clone: function() {
        var obj = this.super.clone.call(this);
        obj.x = this._x;
        obj.y = this._y;
        return obj;
    },

    /**
     * Check the point equal with current or not .
     * @method Point#equals
     * @param {Point} point the point to be checked.
     * @return {Boolean} whether equal
     */
    equals: function(point) {
        return this.x === point.x && this.y === point.y;
    },

    toString: function() {
        return this.className + "(" + this._x + "," + this._y + ")";
    }
}, module);
