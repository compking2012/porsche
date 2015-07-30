define(function(require, exports, module) {

"use strict";
var Class = require("../class");
var YObject = require("../yobject");

/**
 * Base struct for point
 * @class Point
 * @param {Number} x the point's x-axis.
 * @param {Number} y the point's y-axis.
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
        YObject.prototype.initialize.apply(this, arguments);
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
        var obj = YObject.prototype.clone.apply(this, arguments);
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

});
