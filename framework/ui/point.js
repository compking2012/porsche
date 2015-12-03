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
var Class = require("../class");
var YObject = require("../yobject");

/**
 * Point that represents a point with x and y-axis value.
 * @class Point
 * @extends YObject
 */
Class.define("framework.ui.Point", YObject, {
    /**
     * Constructor that create a point.
     * @method Point#initialize
     * @param {Number} x - the x-axis value.
     * @param {Number} y - the y-axis value.
     */
    initialize: function(x, y) {
        YObject.prototype.initialize.apply(this, arguments);

        this._x = x;
        this._y = y;
    },

    /**
     * Destructor that destroy this point.
     * @method Point#destroy
     */
    destroy: function() {
        YObject.prototype.destroy.apply(this, arguments);
    },

    /**
     * @name Point#x
     * @type {Number}
     * @description the x-axis value.
     */
    get x() {
        return this._x;
    },

    /**
     * @name Point#y
     * @type {Number}
     * @description the y-axis value.
     */
    get y() {
        return this._y;
    },

    /**
     * Assign the x and y value of this point.
     * @method Point#assign
     * @param {Number} x the point's x-axis.
     * @param {Number} y the point's y-axis.
     */
    assign: function(x, y) {
        this._x = x;
        this._y = y;
        return this;
    },

    /**
     * Offset the point's coordinates by the specified x and y value.
     * @method Point#offset
     * @param  {Number} x - the x value.
     * @param  {Number} y - the y value.
     */
    offset: function(dx, dy) {
        this._x += dx;
        this._y += dy;
    },

    /**
     * Clone a new point from this point.
     * @method Point#clone
     * @return {Point} a new point that has the same x and y value with this point.
     * @protected
     * @override
     */
    clone: function() {
        return new this.constructor(this._x, this._y);
    },

    /**
     * Check whether this point equals a specified point.
     * @method Point#equals
     * @param {Point} point - the specified point.
     * @return {Boolean} true means equal, otherwise false.
     * @protected
     * @override
     */
    equals: function(point) {
        return this.x === point.x && this.y === point.y;
    },

    /**
     * Returns a human-readable point string.
     * @method Point#toString
     * @return {String} the point string.
     * @protected
     * @override
     */
    toString: function() {
        return this.className + "(" + this._x + "," + this._y + ")";
    }
}, module);

});