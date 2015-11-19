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
 * Cubic bezier curve library
 * @class CubicBezier
 * @extends YObject
 */
Class.define("framework.ui.animation.CubicBezier", YObject, {
    /**
     * Constructor
     * @method CubicBezier#initialize
     */
    initialize: function(p1x, p1y, p2x, p2y) {
        this.super.initialize.call(this);

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
     * Destructor
     * @method CubicBezier#destroy
     */
    destroy: function() {
        this._p1 = null;
        this._p2 = null;

        this.super.destroy.call(this);
    },

    static: {
        /**
         * ease bezier
         * @returns {Object} Returns ease bezier Object
         * @method CubicBezier#ease
         */
        ease: function() {
            return new this(0.25, 0.1, 0.25, 1.0);
        },

        /**
         * linear bezier
         * @returns {Object} Returns linear bezier Object
         * @method CubicBezier#linear
         */
        linear: function() {
            return new this(0.0, 0.0, 1.0, 1.0);
        },

        /**
         * easeIn bezier
         * @returns {Object} Returns easeIn bezier Object
         * @method CubicBezier#easeIn
         */
        easeIn: function() {
            return new this(0.42, 0, 1.0, 1.0);
        },

        /**
         * easeOut bezier
         * @returns {Object} Returns easeOut bezier Object
         * @method CubicBezier#easeOut
         */
        easeOut: function() {
            return new this(0, 0, 0.58, 1.0);
        },

        /**
         * easeInOut bezier
         * @returns {Object} Returns easeInOut bezier Object
         * @method CubicBezier#easeInOut
         */
        easeInOut: function() {
            return new this(0.42, 0, 0.58, 1.0);
        }
    },

    /**
     * Computes the point for a given t value.
     *
     * @param {number} t value between 0 and 1
     * @returns {Object} Returns an object with x and y properties
     * @method CubicBezier#getPointForT
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
            x: this._getCoordinateForT(t, this._p1.x, this._p2.x),
            y: this._getCoordinateForT(t, this._p1.y, this._p2.y)
        };
    },

    getTforX: function(x, epsilon) {
        return this._getTForCoordinate(x, this._p1.x, this._p2.x, epsilon);
    },

    getTforY: function(y, epsilon) {
        return this._getTForCoordinate(y, this._p1.y, this._p2.y, epsilon);
    },

    /**
     * Divides the bezier curve into two bezier functions.
     * De Casteljau's algorithm is used to compute the new starting, ending, and control points.
     *
     * @method CubicBezier#divideAtT
     * @param {number} t must be greater than 0 and lower than 1.
     *     t == 1 or t == 0 are the starting/ending points of the curve, so no division is needed.
     * @returns {CubicBezier[]} Returns an array containing two bezier curves to the left and the right of t.
     */
    divideAtT: function(t) {
        if (t < 0 || t > 1) {
            throw new RangeError("'t' must be a number between 0 and 1. Got " + t + " instead.");
        }

        // Special cases t = 0, t = 1: Curve can be cloned for one side, the other
        // side is a linear curve (with duration 0)
        if (t === 0 || t === 1) {
            var curves = [];
            curves[t] = CubicBezier.linear();
            curves[1 - t] = this.clone();
            return curves;
        }

        var left = {},
            right = {},
            points = this._getAuxPoints(t);

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
            new CubicBezier(left.p1.x, left.p1.y, left.p2.x, left.p2.y),
            new CubicBezier(right.p1.x, right.p1.y, right.p2.x, right.p2.y)
        ];
    },

    divideAtX: function(x, epsilon) {
        if (x < 0 || x > 1) {
            throw new RangeError("'x' must be a number between 0 and 1. Got " + x + " instead.");
        }

        var t = this.getTforX(x, epsilon);
        return this.divideAtT(t);
    },

    divideAtY: function(y, epsilon) {
        if (y < 0 || y > 1) {
            throw new RangeError("'y' must be a number between 0 and 1. Got " + y + " instead.");
        }

        var t = this.getTforY(y, epsilon);
        return this.divideAtT(t);
    },

    clone: function() {
        return new CubicBezier(this._p1.x, this._p1.y, this._p2.x, this._p2.y);
    },

    toString: function() {
        return "cubic-bezier(" + [
            this._p1.x,
            this._p1.y,
            this._p2.x,
            this._p2.y
        ].join(", ") + ")";
    },

    _getCoordinateForT: function(t, p1, p2) {
        var c = 3 * p1,
            b = 3 * (p2 - p1) - c,
            a = 1 - c - b;

        return ((a * t + b) * t + c) * t;
    },

    _getCoordinateDerivateForT: function(t, p1, p2) {
        var c = 3 * p1,
            b = 3 * (p2 - p1) - c,
            a = 1 - c - b;

        return (3 * a * t + 2 * b) * t + c;
    },

    _getTForCoordinate: function(c, p1, p2, epsilon) {
        if (!isFinite(epsilon) || epsilon <= 0) {
            throw new RangeError("'epsilon' must be a number greater than 0.");
        }

        // First try a few iterations of Newton's method -- normally very fast.
        var t2 = c;
        var c2 = 0;
        var d2 = 0;
        for (var i = 0; i < 8; i++) {
            c2 = this._getCoordinateForT(t2, p1, p2) - c;
            if (Math.abs(c2) < epsilon) {
                return t2;
            }
            d2 = this._getCoordinateDerivateForT(t2, p1, p2);
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
            c2 = this._getCoordinateForT(t2, p1, p2);
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

    _getAuxPoints: function(t) {
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
