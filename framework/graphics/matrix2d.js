/**
* Porsche.js is licensed under the MIT license. If a copy of the
* MIT-license was not distributed with this file, You can obtain one at:
* http://opensource.org/licenses/mit-license.html.
*
* @author: Yang Yang (compking@gmail.com)
* @license MIT
* @copyright Yang Yang, 2015
*/

/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */

"use strict";
var Class = require("../class");
var YObject = require("../yobject");
var Common = require("./common");

/**
 * 2x3 Matrix.
 * A mat2d contains six elements defined as:
 * [a, c, tx,
 *  b, d, ty]
 * This is a short form for the 3x3 matrix:
 * [a, c, tx,
 *  b, d, ty,
 *  0, 0, 1]
 * The last row is ignored so the array is shorter and operations are faster.
 * @class Matrix2D
 * @extends YObject
 */
Class.define("framework.graphics.Matrix2D", YObject, {
    /**
     * Constructor that create a new 2x3 matrix.
     * @method Matrix2D#initialize
     */
    initialize: function() {
        YObject.prototype.initialize.apply(this, arguments);

        this._matrix = new Common.ARRAY_TYPE(6);
        var matrix = this._matrix;
        matrix[0] = 1;
        matrix[1] = 0;
        matrix[2] = 0;
        matrix[3] = 1;
        matrix[4] = 0;
        matrix[5] = 0;
    },

    /**
     * Destructor that destroy this 2x3 matrix.
     * @method Matrix2#destroy
     */
    destroy: function() {
        this._matrix = null;

        YObject.prototype.initialize.apply(this, arguments);
    },

    static: {
        /**
         * Copy the values from one 2x3 matrix to another.
         * @method Matrix2D#copy
         * @param {Matrix2D} dest - the destination matrix.
         * @param {Matrix2D} src - the source matrix.
         * @static
         */
        copy: function(dest, src) {
            var dm = dest.matrix;
            var sm = src.matrix;
            dm[0] = sm[0];
            dm[1] = sm[1];
            dm[2] = sm[2];
            dm[3] = sm[3];
            dm[4] = sm[4];
            dm[5] = sm[5];
        },

        /**
         * Set a 2x3 matrix to the identity matrix.
         * @method Matrix2D#identity
         * @param {Matrix2D} dest - the destination matrix.
         * @static
         */
        identity: function(dest) {
            var dm = dest.matrix;
            dm[0] = 1;
            dm[1] = 0;
            dm[2] = 0;
            dm[3] = 1;
            dm[4] = 0;
            dm[5] = 0;
        },

        /**
         * Inverts a 2x3 matrix.
         * @method Matrix2D#invert
         * @param {Matrix2D} dest - the destination matrix.
         * @param {Matrix2D} src - the source matrix.
         * @static
         */
        invert: function(dest, src) {
            var dm = dest.matrix;
            var sm = src.matrix;
            var aa = sm[0];
            var ab = sm[1];
            var ac = sm[2];
            var ad = sm[3];
            var atx = sm[4];
            var aty = sm[5];

            var det = aa * ad - ab * ac;
            if (!det) {
                return null;
            }
            det = 1.0 / det;

            dm[0] = ad * det;
            dm[1] = -ab * det;
            dm[2] = -ac * det;
            dm[3] = aa * det;
            dm[4] = (ac * aty - ad * atx) * det;
            dm[5] = (ab * atx - aa * aty) * det;
        },

        /**
         * Calculates the determinant of a 2x3 matrix.
         * @method Matrix2D#determinant
         * @param {Matrix2D} src - the source matrix.
         * @return {Number} determinant of this 2x3 matrix.
         * @static
         */
        determinant: function(src) {
            var sm = src.matrix;
            return sm[0] * sm[3] - sm[1] * sm[2];
        },

        /**
         * Multiplies two 2x3 matrix's
         * @method Matrix2D#multiply
         * @param {Matrix2D} dest - the destination matrix.
         * @param {Matrix2D} src1 - the first operand.
         * @param {Matrix2D} src2 - the second operand.
         * @static
         */
        multiply: function(dest, src1, src2) {
            var dm = dest.matrix;
            var sm1 = src1.matrix;
            var sm2 = src2.matrix;
            var a0 = sm1[0];
            var a1 = sm1[1];
            var a2 = sm1[2];
            var a3 = sm1[3];
            var a4 = sm1[4];
            var a5 = sm1[5];
            var b0 = sm2[0];
            var b1 = sm2[1];
            var b2 = sm2[2];
            var b3 = sm2[3];
            var b4 = sm2[4];
            var b5 = sm2[5];
            dm[0] = a0 * b0 + a2 * b1;
            dm[1] = a1 * b0 + a3 * b1;
            dm[2] = a0 * b2 + a2 * b3;
            dm[3] = a1 * b2 + a3 * b3;
            dm[4] = a0 * b4 + a2 * b5 + a4;
            dm[5] = a1 * b4 + a3 * b5 + a5;
        },

        /**
         * Alias for multiply.
         * @method Matrix2D#mul
         * @static
         */
        mul: function(dest, src1, src2) {
            this.multiply(dest, src1, src2);
        },

        /**
         * Rotates a 2x3 matrix by the given angle.
         * @method Matrix2D#rotate
         * @param {Matrix2D} dest - the destination matrix.
         * @param {Matrix2D} src - the matrix to rotate.
         * @param {Number} rad - the angle to rotate the matrix by.
         * @static
         */
        rotate: function(dest, src, rad) {
            var dm = dest.matrix;
            var sm = src.matrix;
            var a0 = sm[0];
            var a1 = sm[1];
            var a2 = sm[2];
            var a3 = sm[3];
            var a4 = sm[4];
            var a5 = sm[5];
            var s = Math.sin(rad);
            var c = Math.cos(rad);
            dm[0] = a0 * c + a2 * s;
            dm[1] = a1 * c + a3 * s;
            dm[2] = a0 * -s + a2 * c;
            dm[3] = a1 * -s + a3 * c;
            dm[4] = a4;
            dm[5] = a5;
        },

        /**
         * Scales the 2x3 matrix by the dimensions in the given 2D vector.
         * @method Matrix2D#scale
         * @param {Matrix2D} dest - the destination matrix.
         * @param {Matrix2D} src - the matrix to scale.
         * @param {Vector2} vec - the 2D vector to scale the matrix by.
         * @static
         */
        scale: function(dest, src, vec) {
            var dm = dest.matrix;
            var sm = src.matrix;
            var v = vec.vector;
            var a0 = sm[0];
            var a1 = sm[1];
            var a2 = sm[2];
            var a3 = sm[3];
            var a4 = sm[4];
            var a5 = sm[5];
            var v0 = v[0];
            var v1 = v[1];
            dm[0] = a0 * v0;
            dm[1] = a1 * v0;
            dm[2] = a2 * v1;
            dm[3] = a3 * v1;
            dm[4] = a4;
            dm[5] = a5;
        },

        /**
         * Translates the mat2d by the dimensions in the given vec2
         * @method Matrix2D#translate
         * @param {Matrix2D} dest - the destination matrix.
         * @param {Matrix2D} src - the matrix to translate.
         * @param {Vector2} vec - the 2D vector to translate the matrix by.
         * @static
         */
        translate: function(dest, src, vec) {
            var dm = dest.matrix;
            var sm = src.matrix;
            var v = vec.vector;
            var a0 = sm[0];
            var a1 = sm[1];
            var a2 = sm[2];
            var a3 = sm[3];
            var a4 = sm[4];
            var a5 = sm[5];
            var v0 = v[0];
            var v1 = v[1];
            dm[0] = a0;
            dm[1] = a1;
            dm[2] = a2;
            dm[3] = a3;
            dm[4] = a0 * v0 + a2 * v1 + a4;
            dm[5] = a1 * v0 + a3 * v1 + a5;
        },

        /**
         * Creates a matrix from a given angle
         * This is equivalent to (but much faster than):
         *
         *     Matrix2D.identity(dest);
         *     Matrix2D.rotate(dest, dest, rad);
         * @method Matrix2D#fromRotation
         * @param {Matrix2D} dest - the 2x3 matrix receiving operation result.
         * @param {Number} rad - the angle to rotate the matrix by.
         * @static
         */
        fromRotation: function(dest, rad) {
            var dm = dest.matrix;
            var s = Math.sin(rad);
            var c = Math.cos(rad);
            dm[0] = c;
            dm[1] = s;
            dm[2] = -s;
            dm[3] = c;
            dm[4] = 0;
            dm[5] = 0;
        },

        /**
         * Creates a matrix from a vector scaling
         * This is equivalent to (but much faster than):
         *
         *     Matrix2D.identity(dest);
         *     Matrix2D.scale(dest, dest, vec);
         * @method Matrix2D#fromScaling
         * @param {Matrix2D} dest - the 2x3 matrix receiving operation result.
         * @param {Vector2} vec - the scaling vector.
         * @static
         */
        fromScaling: function(dest, vec) {
            var dm = dest.matrix;
            var v = vec.vector;
            dm[0] = v[0];
            dm[1] = 0;
            dm[2] = 0;
            dm[3] = v[1];
            dm[4] = 0;
            dm[5] = 0;
        },

        /**
         * Creates a matrix from a vector translation
         * This is equivalent to (but much faster than):
         *
         *     Matrix2D.identity(dest);
         *     Matrix2D.translate(dest, dest, vec);
         * @method Matrix2D#fromTranslation
         * @param {Matrix2D} dest - the 2x3 matrix receiving operation result.
         * @param {Vector2} vec - the translation vector.
         * @static
         */
        fromTranslation: function(dest, vec) {
            var dm = dest.matrix;
            var v = vec.vector;
            dm[0] = 1;
            dm[1] = 0;
            dm[2] = 0;
            dm[3] = 1;
            dm[4] = v[0];
            dm[5] = v[1];
        },

        /**
         * Returns Frobenius norm of a 2x3 matrix.
         * @method Matrix2D#frob
         * @param {Matrix2D} src - the matrix to calculate Frobenius norm of.
         * @return {Number} Frobenius norm.
         * @static
         */
        frob: function(src) {
            var sm = src.matrix;
            return Math.sqrt(Math.pow(sm[0], 2) + Math.pow(sm[1], 2) + Math.pow(sm[2], 2) + Math.pow(sm[3], 2) + Math.pow(sm[4], 2) + Math.pow(sm[5], 2) + 1);
        }
    },

    /**
     * Copy the values from one 2x3 matrix to another.
     * @method Matrix2D#copy
     * @param {Matrix2D} src - the source matrix.
     */
    copy: function(src) {
        this.constructor.copy(this, src);
    },

    /**
     * Set a 2x3 matrix to the identity matrix.
     * @method Matrix2D#identity
     */
    identity: function() {
        this.constructor.identity(this);
    },

    /**
     * Inverts a 2x3 matrix.
     * @method Matrix2D#invert
     */
    invert: function() {
        this.constructor.invert(this, this);
    },

    /**
     * Calculates the determinant of a 2x3 matrix.
     * @method Matrix2D#determinant
     * @return {Number} determinant of this 2x3 matrix.
     */
    determinant: function() {
        return this.constructor.determinant(this);
    },

    /**
     * Multiplies two 2x3 matrix's.
     * @method Matrix2D#multiply
     * @param {Matrix2D} src - the operand.
     */
    multiply: function(src) {
        this.constructor.multiply(this, this, src);
    },

    /**
     * Alias for multiply.
     * @method Matrix2D#mul
     */
    mul: function(src) {
        this.constructor.multiply(this, this, src);
    },

    /**
     * Rotates a 2x3 matrix by the given angle.
     * @method Matrix2D#rotate
     * @param {Number} rad - the angle to rotate the matrix by.
     */
    rotate: function(rad) {
        this.constructor.rotate(this, this, rad);
    },

    /**
     * Scales the 2x3 matrix by the dimensions in the given 2D vector.
     * @method Matrix2D#scale
     * @param {Vector2} vec - the 2D vector to scale the matrix by.
     */
    scale: function(vec) {
        this.constructor.scale(this, this, vec);
    },

    /**
     * Translates the mat2d by the dimensions in the given vec2
     * @method Matrix2D#translate
     * @param {Vector2} vec - the 2D vector to translate the matrix by.
     */
    translate: function(vec) {
        this.constructor.translate(this, this, vec);
    },

    /**
     * Creates a matrix from a given angle.
     * This is equivalent to (but much faster than):
     *
     *     matrix2d.identity();
     *     matrix2d.rotate(rad);
     * @method Matrix2D#fromRotation
     * @param {Number} rad - the angle to rotate the matrix by.
     */
    fromRotation: function(rad) {
        this.constructor.fromRotation(this, rad);
    },

    /**
     * Creates a matrix from a vector scaling.
     * This is equivalent to (but much faster than):
     *
     *     matrix2d.identity();
     *     matrix2d.scale(vec);
     * @method Matrix2D#fromScaling
     * @param {Vector2} vec - the scaling vector.
     */
    fromScaling: function(vec) {
        this.constructor.fromScaling(this, vec);
    },

    /**
     * Creates a matrix from a vector translation.
     * This is equivalent to (but much faster than):
     *
     *     matrix2d.identity();
     *     matrix2d.translate(vec);
     * @method Matrix2D#fromTranslation
     * @param {Vector2} vec - the translation vector.
     */
    fromTranslation: function(vec) {
        this.constructor.fromTranslation(this, vec);
    },

    /**
     * Returns Frobenius norm of a 2x3 matrix.
     * @method Matrix2D#frob
     * @return {Number} Frobenius norm.
     */
    frob: function() {
        return this.constructor.frob(this);
    },

    /**
     * Creates a new 2x3 matrix initialized with values from an existing matrix.
     * @method Matrix2D#clone
     * @return {Matrix2D} a new 2x3 matrix.
     * @protected
     * @override
     */
    clone: function() {
        var matrix = this._matrix;
        var clone = YObject.prototype.clone.call(this);
        clone.matrix = new Common.ARRAY_TYPE(6);
        var newMatrix = clone.matrix;
        newMatrix[0] = matrix[0];
        newMatrix[1] = matrix[1];
        newMatrix[2] = matrix[2];
        newMatrix[3] = matrix[3];
        newMatrix[4] = matrix[4];
        newMatrix[5] = matrix[5];
        return newMatrix;
    },

    /**
     * Returns a string representation of a 2x3 matrix.
     * @method Matrix2D#toString
     * @return {String} string representation of the matrix.
     * @protected
     * @override
     */
    toString: function() {
        var matrix = this._matrix;
        return "Matrix2D(" + matrix[0] + ", " + matrix[1] + ", " + matrix[2] + ", " +
                        matrix[3] + ", " + matrix[4] + ", " + matrix[5] + ")";
    },

    /**
     * @name Matrix2D#matrix
     * @type {Object}
     * @description the matrix.
     * @private
     */
    get matrix() {
        return this._matrix;
    },

    set matrix(value) {
        this._matrix = value;
    }
}, module);

