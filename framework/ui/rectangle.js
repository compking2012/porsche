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
 * Base struct for rectangle
 * @class Rectangle
 * @extends YObject
 */
Class.define("framework.ui.Rectangle", YObject, {
    /**
     * Constructor
     * @method Button#initialize
     * @param {Number} x left edge of rectangle, in pixels.
     * @param {Number} y top edge of rectangle, in pixels.
     * @param {Number} width width edge of rectangle, in pixels.
     * @param {Number} height height edge of rectangle, in pixels.
     */
    initialize: function(left, top, width, height) {
        YObject.prototype.initialize.apply(this, arguments);
        this._left = left;
        this._top = top;
        this._width = width;
        this._height = height;
    },

    /**
     * @name Rectangle#left
     * @type {Number}
     * @description x-axis value.
     */
    get left() {
        return this._left;
    },

    set left(value) {
        this._left = value;
    },

    /**
     * @name Rectangle#top
     * @type {Number}
     * @description y-axis value.
     */
    get top() {
        return this._top;
    },

    set top(value) {
        this._top = value;
    },

    get right() {
        return this._left + this._width;
    },

    set right(value) {
        this._left = value - this._width;
    },

    get bottom() {
        return this._top + this._height;
    },

    set bottom(value) {
        this._top = value - this._height;
    },

    get width() {
        return this._width;
    },

    set width(value) {
        this._width = value;
    },

    get height() {
        return this._height;
    },

    set height(value) {
        this._height = value;
    },

    empty: function() {
        this._left = 0;
        this._top = 0;
        this._width = 0;
        this._height = 0;
    },

    assign: function(left, top, width, height) {
        this._left = left;
        this._top = top;
        this._width = width;
        this._height = height;
    },

    offset: function(dx, dy) {
        this._left += dx;
        this._top += dy;
    },

    offsetTo: function(left, top) {
        this._left = left;
        this._top = top;
    },

    /**
     * Returns a new rectangle representing the union of this rectangle with the
     * specified rectangle.
     * @method Rectangle#unite
     * @param {Rectangle} rect the rectangle to be combined with this rectangle
     * @return {Rectangle} the smallest rectangle containing both the specified
     *                     rectangle and this rectangle.
     */
    unite: function(rect) {
        if (this._width === 0 && this._height === 0) {
            this._left = rect.left;
            this._top = rect.top;
            this._width = rect.width;
            this._height = rect.height;
            return;
        }
        var x1 = Math.min(this._left, rect.left);
        var y1 = Math.min(this._top, rect.top);
        var x2 = Math.max(this._left + this._width, rect.left + rect.width);
        var y2 = Math.max(this._top + this._height, rect.top + rect.height);
        this._left = x1;
        this._top = y1;
        this._width = x2 - x1;
        this._height = y2 - y1;
    },

    /**
     * Returns a new rectangle representing the intersection of this rectangle
     * with the specified rectangle.
     * @method Rectangle#intersect
     * @param {Rectangle} rect The rectangle to be intersected with this
     *                         rectangle
     * @return {Rectangle} the largest rectangle contained in both the specified
     *                     rectangle and in this rectangle
     */
    intersect: function(rect) {
        var x1 = Math.max(this._left, rect.left);
        var y1 = Math.max(this._top, rect.top);
        var x2 = Math.min(this._left + this._width, rect.right);
        var y2 = Math.min(this._top + this._height, rect.bottom);

        this._left = x1;
        this._top = y1;
        this._width = x2 - x1;
        this._height = y2 - y1;
    },

    isEmpty: function() {
        return this._left === 0 && this._top === 0 && this._width === 0 && this._height === 0;
    },

    intersects: function(rect) {
        return rect.right > this._left && rect.bottom > this._top &&
            rect.left < this._left + this._width && rect.top < this._top + this._height;
    },

    touches: function(rect) {
        return rect.right >= this._left && rect.bottom >= this._top &&
            rect.left <= this._left + this._width && rect.top <= this._top + this._height;
    },

    /**
     * Returns true if this rectangle fully encloses the described point or rectangle.
     * @method Rectangle#contains
     * @param {Rectangle} rect The rectangle to be intersected with this
     *                         rectangle
     * @return {Boolean} True if the described point or rectangle is contained within this rectangle.
    */
    contains: function(rect) {
        return rect.left >= this._left && rect.right <= this._left + this._width &&
            rect.top >= this._top && rect.bottom <= this._top + this._height;
    },

    containsXY: function(x, y) {
        return x >= this._left && y >= this._top && x <= this._left + this._width && y <= this._top + this._height;
    },

    containsPoint: function(point) {
        return point.x >= this._left && point.y >= this._top && point.x <= this._left + this._width && point.y <= this._top + this._height;
    },

    /**
     * copy this rectangle to a new object.
     * @return {Rectangle} rect other rectangle to be checked with.
     * @method Rectangle#clone
     */
    clone: function() {
        return new this.constructor(this._left, this._top, this._width, this._height);
    },

    /**
     * Check the point equal with current or not.
     * @method Rectangle#equals
     * @param {Rectangle} rect the rectangle to be checked.
     * @return {boolean} whether equal
     */
    equals: function(rect) {
        return this._left === rect.left && this._top === rect.top &&
            this._width === rect.width && this._height === rect.height;
    },

    toString: function() {
        return this.className + "(" + this._left + "," + this._top + " - " + this._width + "," + this._height + ")";
    }
}, module);

});