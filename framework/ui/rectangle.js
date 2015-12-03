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
 * Rectangle that represents by the coordinates of its 4 edges (left, top, right bottom).
 * These fields can be accessed directly. Use width and height to retrieve the rectangle's width and height.
 * Note that most methods do not check to see that the coordinates are sorted correctly (i.e. left <= right and top <= bottom).
 * @class Rectangle
 * @extends YObject
 */
Class.define("framework.ui.Rectangle", YObject, {
    /**
     * Constructor that create a rectangle.
     * @method Rectangle#initialize
     * @param {Number} left - the X coordinate of the left side of the rectangle.
     * @param {Number} top - the Y coordinate of the top of the rectangle
     * @param {Number} right - the X coordinate of the right side of the rectangle
     * @param {Number} bottom - the Y coordinate of the bottom of the rectangle
     */
    initialize: function(left, top, right, bottom) {
        YObject.prototype.initialize.apply(this, arguments);

        this._left = left;
        this._top = top;
        this._right = right;
        this._bottom = bottom;
    },

    /**
     * Destructor that destroy this rectangle.
     * @method Rectangle#destroy
     */
    destroy: function() {
        YObject.prototype.destroy.apply(this, arguments);
    },

    /**
     * @name Rectangle#left
     * @type {Number}
     * @description the X coordinate of the left side of the rectangle.
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
     * @description the Y coordinate of the top side of the rectangle.
     */
    get top() {
        return this._top;
    },

    set top(value) {
        this._top = value;
    },

    /**
     * @name Rectangle#right
     * @type {Number}
     * @description the X coordinate of the right side of the rectangle.
     */
    get right() {
        return this._right;
    },

    set right(value) {
        this._right = value;
    },

    /**
     * @name Rectangle#top
     * @type {Number}
     * @description the Y coordinate of the bottom side of the rectangle.
     */
    get bottom() {
        return this._bottom;
    },

    set bottom(value) {
        this._bottom = value;
    },

    /**
     * @name Rectangle#width
     * @type {Number}
     * @description the rectangle's width.
     * This does not check for a valid rectangle (i.e. left <= right) so the result may be negative.
     */
    get width() {
        return this._right - this._left;
    },

    /**
     * @name Rectangle#height
     * @type {Number}
     * @description the rectangle's height.
     * This does not check for a valid rectangle (i.e. top <= bottom) so the result may be negative.
     */
    get height() {
        return this._bottom - this._top;
    },

    /**
     * Set the rectangle to an empty rectangle (0,0,0,0).
     * @method Rectangle#empty
     */
    empty: function() {
        this._left = 0;
        this._top = 0;
        this._right = 0;
        this._bottom = 0;
    },

    /**
     * Set the rectangle's coordinates to the specified values.
     * Note that no range checking is performed, so it is up to the caller to ensure that left <= right and top <= bottom.
     * @method Rectangle#assign
     * @param {Number} left - the X coordinate of the left side of the rectangle.
     * @param {Number} top - the Y coordinate of the top of the rectangle.
     * @param {Number} right - the X coordinate of the right side of the rectangle.
     * @param {Number} bottom - the Y coordinate of the bottom of the rectangle.
     */
    assign: function(left, top, right, bottom) {
        this._left = left;
        this._top = top;
        this._right = right;
        this._bottom = bottom;
    },

    /**
     * Offset the rectangle by adding dx to its left and right coordinates,
     * and adding dy to its top and bottom coordinates.
     * @method Rectangle#offset
     * @param {Number} dx - the amount to add to the rectangle's left and right coordinates.
     * @param {Number} dy - the amount to add to the rectangle's top and bottom coordinates.
     */
    offset: function(dx, dy) {
        this._left += dx;
        this._top += dy;
    },

    /**
     * Offset the rectangle to a specific (left, top) position,
     * keeping its width and height the same.
     * @method Rectangle#offsetTo
     * @param {Number} left - the new left coordinate for the rectangle.
     * @param {Number} top  - the new top coordinate for the rectangle.
     */
    offsetTo: function(left, top) {
        this._left = left;
        this._top = top;
    },

    /**
     * Update this rectangle to enclose itself and the specified rectangle.
     * If the specified rectangle is empty, nothing is done. If this rectangle is empty it is set to the specified rectangle.
     * @method Rectangle#unite
     * @param {Rectangle} rect - the rectangle to be combined with this rectangle.
     */
    unite: function(rect) {
        if (this._right - this._top === 0 && this._bottom - this._top === 0) {
            this._left = rect.left;
            this._top = rect.top;
            this._right = rect.right;
            this._bottom = rect.bottom;
            return;
        }
        this._left = Math.min(this._left, rect.left);
        this._top = Math.min(this._top, rect.top);
        this._right = Math.max(this._right, rect.right);
        this._bottom = Math.max(this._bottom, rect.bottom);
    },

    /**
     * Update this rectangle to the intersection of this rectangle with the specified rectangle.
     * @method Rectangle#intersect
     * @param {Rectangle} rect - the rectangle to be intersected with this rectangle.
     */
    intersect: function(rect) {
        this._left = Math.max(this._left, rect.left);
        this._top = Math.max(this._top, rect.top);
        this._right = Math.min(this._right, rect.right);
        this._bottom = Math.min(this._bottom, rect.bottom);
    },

    /**
     * Indicates whether the rectangle is empty.
     * @method Rectangle#isEmpty
     * @return {Boolean} true if the rectangle is empty (left >= right or top >= bottom).
     */
    isEmpty: function() {
        return this._left === 0 && this._top === 0 && this._right === 0 && this._bottom === 0;
    },

    /**
     * Indicates whether this rectangle intersects the specified rectangle.
     * @method Rectangle#intersects
     * @param {Rectangle} rect - the rectangle being intersected with this rectangle.
     * @return {Boolean} true if this rectangle intersects the specified rectangle, otherwise false.
     */
    intersects: function(rect) {
        return rect.right > this._left && rect.bottom > this._top &&
            rect.left < this._right && rect.top < this._bottom;
    },

    /**
     * Indicates whether this rectangle touches the specified rectangle.
     * @method Rectangle#touches
     * @param {Rectangle} rect - the rectangle being touched with this rectangle.
     * @return {Boolean} true if this rectangle touches the specified rectangle, otherwise false.
     */
    touches: function(rect) {
        return rect.right >= this._left && rect.bottom >= this._top &&
            rect.left <= this._right && rect.top <= this._bottom;
    },

    /**
     * Indicates whether the specified rectangle is inside or equal to this rectangle.
     * An empty rectangle never contains another rectangle.
     * @method Rectangle#contains
     * @param {Rectangle} rect - the rectangle being tested for containment.
     * @return {Boolean} true if the specified rectangle is inside or equal to this rectangle, otherwise false.
    */
    contains: function(rect) {
        return rect.left >= this._left && rect.right <= this._left + this._width &&
            rect.top >= this._top && rect.bottom <= this._top + this._height;
    },

    /**
     * Indicates whether the specified point is inside this rectangle.
     * The left and top are considered to be inside, while the right and bottom are not.
     * This means that for a x,y to be contained: left <= x < right and top <= y < bottom.
     * An empty rectangle never contains any point.
     * @method Rectangle#containsXY
     * @param {Number} x - the X coordinate of the point being tested for containment.
     * @param {Number} y - the Y coordinate of the point being tested for containment.
     * @return {Boolean} true if (x,y) is inside the rectangle, otherwise false.
     */
    containsXY: function(x, y) {
        return x >= this._left && y >= this._top && x <= this._right && y <= this._bottom;
    },

    /**
     * Indicates whether the specified point is inside this rectangle.
     * The left and top are considered to be inside,
     * while the right and bottom are not.
     * This means that for a x,y to be contained: left <= x < right and top <= y < bottom.
     * An empty rectangle never contains any point.
     * @method Rectangle#containsXY
     * @param {Point} point - the point being tested for containment.
     * @return {Boolean} true if the point is inside the rectangle, otherwise false.
     */
    containsPoint: function(point) {
        return point.x >= this._left && point.y >= this._top && point.x <= this._left + this._width && point.y <= this._top + this._height;
    },

    /**
     * Clone a new rectangle from this rectangle.
     * @method Rectangle#clone
     * @return {Rectangle} a new rectangle that has the same left, top, right and bottom value with this rectangle.
     * @protected
     * @override
     */
    clone: function() {
        return new this.constructor(this._left, this._top, this._right, this._bottom);
    },

    /**
     * Check whether this rectangle equals a specified rectangle.
     * @method Rectangle#equals
     * @param {Rectangle} rect - the specified rectangle.
     * @return {Boolean} true means equal, otherwise false.
     * @protected
     * @override
     */
    equals: function(rect) {
        return this._left === rect.left && this._top === rect.top &&
            this._right === rect.right && this._bottom === rect.bottom;
    },

    /**
     * Returns a human-readable rectangle string.
     * @method Rectangle#toString
     * @return {String} the rectangle string.
     * @protected
     * @override
     */
    toString: function() {
        return this.className + "(" + this._left + "," + this._top + " - " + this._right + "," + this._bottom + ")";
    }
}, module);

});