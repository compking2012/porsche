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
var YObject = require("../../yobject");

/**
 * Cubic bezier curve library.
 * @class CubicBezier
 * @extends YObject
 */
Class.define("framework.ui.animation.CubicBezier", YObject, {
    /**
     * Constructor that create a cubic bezier.
     * @method CubicBezier#initialize
     */
    initialize: function(p1x, p1y, p2x, p2y) {
        YObject.prototype.initialize.apply(this, arguments);

        if (!(p1x >= 0 && p1x <= 1)) {
            throw new RangeError("'p1x' must be a number between 0 and 1. Got " + p1x + "instead.");
        }
        if (!(p1y >= 0 && p1y <= 1)) {
            throw new RangeError("'p1y' must be a number between 0 and 1. Got " + p1y + "instead.");
        }
        if (!(p2x >= 0 && p2x <= 1)) {
            throw new RangeError("'p2x' must be a number between 0 and 1. Got " + p2x + "instead.");
        }
        if (!(p2y >= 0 && p2y <= 1)) {
            throw new RangeError("'p2y' must be a number between 0 and 1. Got " + p2y + "instead.");
        }

        // Control points
        this._p1 = {x: p1x, y: p1y};
        this._p2 = {x: p2x, y: p2y};
    },

    /**
     * Destructor that destroy this cubic bezier.
     * @method CubicBezier#destroy
     */
    destroy: function() {
        this._p1 = null;
        this._p2 = null;

        YObject.prototype.destroy.apply(this, arguments);
    },

    static: {
        /**
         * Create an ease bezier.
         * @method CubicBezier#ease
         * @return {Object} an ease bezier object.
         */
        ease: function() {
            return new this(0.25, 0.1, 0.25, 1.0);
        },

        /**
         * Create a linear bezier.
         * @method CubicBezier#linear
         * @return {Object} an linear bezier object.
         */
        linear: function() {
            return new this(0.0, 0.0, 1.0, 1.0);
        },

        /**
         * Create an ease-in bezier.
         * @method CubicBezier#easeIn
         * @return {Object} an ease-in bezier object.
         */
        easeIn: function() {
            return new this(0.42, 0, 1.0, 1.0);
        },

        /**
         * Create an ease-out bezier.
         * @method CubicBezier#easeOut
         * @return {Object} an ease-out bezier object.
         */
        easeOut: function() {
            return new this(0, 0, 0.58, 1.0);
        },

        /**
         * Create an ease-in-out bezier.
         * @method CubicBezier#easeInOut
         * @return {Object} an ease-in-out bezier object.
         */
        easeInOut: function() {
            return new this(0.42, 0, 0.58, 1.0);
        }
    },

    /**
     * Computes the point for a given t value.
     * @method CubicBezier#getPointForT
     * @param {Number} t - value between 0 and 1.
     * @return {Object} an object with x and y properties.
     */
    getPointForT: function(t) {
        if (t === 0 || t === 1) {
            // Special cases: starting and ending points
            return {x: t, y: t};
        }
        else if (!(t > 0 && t < 1)) {
            // check for correct t value (must be between 0 and 1)
            throw new RangeError("'t' must be a number between 0 and 1. Got " + t + " instead.");
        }

        return {
            x: this.getCoordinateForT(t, this._p1.x, this._p2.x),
            y: this.getCoordinateForT(t, this._p1.y, this._p2.y)
        };
    },

    /**
     * Creates and returns a copy of this cubic bezier.
     * @method CubicBezier#clone
     * @return {Object} a copy of this cubic bezier.
     */
    clone: function() {
        return new this.constructor(this._p1.x, this._p1.y, this._p2.x, this._p2.y);
    },

    /**
     * Returns a cubic bezier string.
     * @method CubicBezier#toString
     * @protected
     * @override
     */
    toString: function() {
        return "cubic-bezier(" + [
            this._p1.x,
            this._p1.y,
            this._p2.x,
            this._p2.y
        ].join(", ") + ")";
    },

    /**
     * Computes the t for a given x and epsilon value.
     * @method CubicBezier#getTForX
     * @param {Number} x - the x value.
     * @param {Number} epsilon - the epsilon value.
     * @return {Number} the t value.
     * @private
     */
    getTforX: function(x, epsilon) {
        return this.getTForCoordinate(x, this._p1.x, this._p2.x, epsilon);
    },

    /**
     * Computes the t for a given y and epsilon value.
     * @method CubicBezier#getTForY
     * @param {Number} y - the y value.
     * @param {Number} epsilon - the epsilon value.
     * @return {Number} the t value.
     * @private
     */
    getTforY: function(y, epsilon) {
        return this.getTForCoordinate(y, this._p1.y, this._p2.y, epsilon);
    },

    /**
     * Divides the bezier curve into two bezier functions.
     * De Casteljau's algorithm is used to compute the new starting, ending, and control points.
     * @method CubicBezier#divideAtT
     * @param {Number} t - must be greater than 0 and lower than 1.
     * t == 1 or t == 0 are the starting/ending points of the curve, so no division is needed.
     * @return {CubicBezier[]} an array containing two bezier curves to the left and the right of t.
     * @private
     */
    divideAtT: function(t) {
        if (t < 0 || t > 1) {
            throw new RangeError("'t' must be a number between 0 and 1. Got " + t + " instead.");
        }

        // Special cases t = 0, t = 1: Curve can be cloned for one side, the other
        // side is a linear curve (with duration 0)
        if (t === 0 || t === 1) {
            var curves = [];
            curves[t] = this.constructor.linear();
            curves[1 - t] = this.clone();
            return curves;
        }

        var left = {},
            right = {},
            points = this.getAuxPoints(t);

        var i0 = points.i0,
            i2 = points.i2,
            j0 = points.j0,
            j1 = points.j1,
            k = points.k;

        // Normalize derived points, so that the new curves starting/ending point
        // coordinates are (0, 0) respectively (1, 1)
        var factorX = k.x,
            factorY = k.y;

        left.p1 = {
            x: i0.x / factorX,
            y: i0.y / factorY
        };
        left.p2 = {
            x: j0.x / factorX,
            y: j0.y / factorY
        };

        right.p1 = {
            x: (j1.x - factorX) / (1 - factorX),
            y: (j1.y - factorY) / (1 - factorY)
        };
        right.p2 = {
            x: (i2.x - factorX) / (1 - factorX),
            y: (i2.y - factorY) / (1 - factorY)
        };

        return [
            new this.constructor(left.p1.x, left.p1.y, left.p2.x, left.p2.y),
            new this.constructor(right.p1.x, right.p1.y, right.p2.x, right.p2.y)
        ];
    },

    /**
     * Divide at x.
     * @method CubicBezier#divideAtX
     * @param {Number} x - the x value.
     * @param {Number epsilon - the epsilon value.
     * @return {Object} includes two bezier function at both x and y axis.
     * @private
     */
    divideAtX: function(x, epsilon) {
        if (x < 0 || x > 1) {
            throw new RangeError("'x' must be a number between 0 and 1. Got " + x + " instead.");
        }

        var t = this.getTforX(x, epsilon);
        return this.divideAtT(t);
    },

    /**
     * Divide at y.
     * @method CubicBezier#divideAtY
     * @param {Number} y - the y value.
     * @param {Number epsilon - the epsilon value.
     * @return {Object} includes two bezier function at both x and y axis.
     * @private
     */
    divideAtY: function(y, epsilon) {
        if (y < 0 || y > 1) {
            throw new RangeError("'y' must be a number between 0 and 1. Got " + y + " instead.");
        }

        var t = this.getTforY(y, epsilon);
        return this.divideAtT(t);
    },

    /**
     * Get coordinate for T.
     * @method CubicBezier#getCoordinateForT
     * @param {Number} t - the t value.
     * @param {Number} p1 - the p1 value.
     * @param {Number} p2 - the p2 value.
     * @return {Number} the coordinate.
     * @private
     */
    getCoordinateForT: function(t, p1, p2) {
        var c = 3 * p1,
            b = 3 * (p2 - p1) - c,
            a = 1 - c - b;

        return ((a * t + b) * t + c) * t;
    },

    /**
     * Get coordinate for T.
     * @method CubicBezier#getCoordinateDerivateForT
     * @param {Number} t - the t value.
     * @param {Number} p1 - the p1 value.
     * @param {Number} p2 - the p2 value.
     * @return {Number} the coordinate.
     * @private
     */
    getCoordinateDerivateForT: function(t, p1, p2) {
        var c = 3 * p1,
            b = 3 * (p2 - p1) - c,
            a = 1 - c - b;

        return (3 * a * t + 2 * b) * t + c;
    },

    /**
     * Get T for coordinate.
     * @method CubicBezier#getTForCoordinate
     * @param {Number} c - the coordinate.
     * @param {Number} p1 - the p1 value.
     * @param {Number} p2 - the p2 value.
     * @param {Number} epsilon - the epsilon value.
     * @return {Number}  the t value.
     * @private
     */
    getTForCoordinate: function(c, p1, p2, epsilon) {
        if (!isFinite(epsilon) || epsilon <= 0) {
            throw new RangeError("'epsilon' must be a number greater than 0.");
        }

        // First try a few iterations of Newton's method -- normally very fast.
        var t2 = c;
        var c2 = 0;
        var d2 = 0;
        for (var i = 0; i < 8; i++) {
            c2 = this.getCoordinateForT(t2, p1, p2) - c;
            if (Math.abs(c2) < epsilon) {
                return t2;
            }
            d2 = this.getCoordinateDerivateForT(t2, p1, p2);
            if (Math.abs(d2) < 1e-6) {
                break;
            }
            t2 = t2 - c2 / d2;
        }

        // Fall back to the bisection method for reliability.
        t2 = c;
        c2 = 0;
        var t0 = 0;
        var t1 = 1;

        if (t2 < t0) {
            return t0;
        }
        if (t2 > t1) {
            return t1;
        }

        while (t0 < t1) {
            c2 = this.getCoordinateForT(t2, p1, p2);
            if (Math.abs(c2 - c) < epsilon) {
                return t2;
            }
            if (c > c2) {
                t0 = t2;
            }
            else {
                t1 = t2;
            }
            t2 = (t1 - t0) * 0.5 + t0;
        }

        // Failure.
        return t2;
    },

    /**
     * Get aux points.
     * @method CubicBezier#getAuxPoints
     * @param {Number} t - the t value.
     * @return {Number} the aux points.
     * @private
     */
    getAuxPoints: function(t) {
        if (!(t > 0 && t < 1)) {
            throw new RangeError("'t' must be greater than 0 and lower than 1");
        }

        // First series of auxiliary points
        var i0 = { // first control point of the left curve
                x: t * this._p1.x,
                y: t * this._p1.y
            },
            i1 = {
                x: this._p1.x + t * (this._p2.x - this._p1.x),
                y: this._p1.y + t * (this._p2.y - this._p1.y)
            },
            i2 = { // second control point of the right curve
                x: this._p2.x + t * (1 - this._p2.x),
                y: this._p2.y + t * (1 - this._p2.y)
            };

        // Second series of auxiliary points
        var j0 = { // second control point of the left curve
                x: i0.x + t * (i1.x - i0.x),
                y: i0.y + t * (i1.y - i0.y)
            },
            j1 = { // first control point of the right curve
                x: i1.x + t * (i2.x - i1.x),
                y: i1.y + t * (i2.y - i1.y)
            };

        // The division point (ending point of left curve, starting point of right curve)
        var k = {
                x: j0.x + t * (j1.x - j0.x),
                y: j0.y + t * (j1.y - j0.y)
            };

        return {
            i0: i0,
            i1: i1,
            i2: i2,
            j0: j0,
            j1: j1,
            k: k
        };
    }
}, module);

});