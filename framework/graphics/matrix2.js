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
 * 2x2 Matrix.
 * @class Matrix2
 * @extends YObject
 */
Class.define("framework.graphics.Matrix2", YObject, {
    /**
     * Constructor that create a new 2x2 matrix.
     * @method Matrix2#initialize
     */
    initialize: function() {
        YObject.prototype.initialize.apply(this, arguments);

        this._matrix = new Common.ARRAY_TYPE(4);
        var matrix = this._matrix;
        matrix[0] = 1;
        matrix[1] = 0;
        matrix[2] = 0;
        matrix[3] = 1;
    },

    /**
     * Destructor that destroy this 2x2 matrix.
     * @method Matrix2#destroy
     */
    destroy: function() {
        this._matrix = null;

        YObject.prototype.initialize.apply(this, arguments);
    },

    static: {
        /**
         * Copy the values from one 2x2 matrix to another.
         * @method Matrix2#copy
         * @param {Matrix2} dest - the destination matrix.
         * @param {Matrix2} src - the source matrix.
         * @static
         */
        copy: function(dest, src) {
            var dm = dest.matrix;
            var sm = src.matrix;
            dm[0] = sm[0];
            dm[1] = sm[1];
            dm[2] = sm[2];
            dm[3] = sm[3];
        },

        /**
         * Set a 2x2 matrix to the identity matrix.
         * @method Matrix2#identity
         * @param {Matrix2} dest - the destination matrix.
         * @static
         */
        identity: function(dest) {
            var dm = dest.matrix;
            dm[0] = 1;
            dm[1] = 0;
            dm[2] = 0;
            dm[3] = 1;
        },

        /**
         * Transpose the values of a 2x2 matrix.
         * @method Matrix2#transpose
         * @param {Matrix2} dest - the destination matrix.
         * @param {Matrix2} src - the source matrix.
         * @static
         */
        transpose: function(dest, src) {
            var dm = dest.matrix;
            var sm = src.matrix;
            // If we are transposing ourselves we can skip a few steps but have to cache some values
            if (dm === sm) {
                var a1 = sm[1];
                dm[1] = sm[2];
                dm[2] = a1;
            } else {
                dm[0] = sm[0];
                dm[1] = sm[2];
                dm[2] = sm[1];
                dm[3] = sm[3];
            }
        },

        /**
         * Inverts a 2x2 matrix.
         * @method Matrix2#invert
         * @param {Matrix2} dest - the destination matrix.
         * @param {Matrix2} src - the source matrix.
         * @static
         */
        invert: function(dest, src) {
            var dm = dest.matrix;
            var sm = src.matrix;
            var a0 = sm[0];
            var a1 = sm[1];
            var a2 = sm[2];
            var a3 = sm[3];
            // Calculate the determinant
            var det = a0 * a3 - a2 * a1;
            if (!det) {
                return null;
            }
            det = 1.0 / det;

            dm[0] = a3 * det;
            dm[1] = -a1 * det;
            dm[2] = -a2 * det;
            dm[3] = a0 * det;
        },

        /**
         * Calculates the adjugate of a 2x2 matrix.
         * @method Matrix2#adjoint
         * @param {Matrix2} dest - the destination matrix.
         * @param {Matrix2} src - the source matrix.
         * @static
         */
        adjoint: function(dest, src) {
            var dm = dest.matrix;
            var sm = src.matrix;
            // Caching this value is nessecary if matrix == a
            var a0 = sm[0];
            dm[0] = sm[3];
            dm[1] = -sm[1];
            dm[2] = -sm[2];
            dm[3] = a0;
        },

        /**
         * Calculates the determinant of a 2x2 matrix.
         * @method Matrix2#determinant
         * @param {Matrix2} src - the source matrix.
         * @return {Number} determinant of this 2x2 matrix.
         * @static
         */
        determinant: function(src) {
            var sm = src.matrix;
            return sm[0] * sm[3] - sm[2] * sm[1];
        },

        /**
         * Multiplies two 2x2 matrix's.
         * @method Matrix2#multiply
         * @param {Matrix2} dest - the destination matrix.
         * @param {Matrix2} src1 - the first operand.
         * @param {Matrix2} src2 - the second operand.
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
            var b0 = sm2[0];
            var b1 = sm2[1];
            var b2 = sm2[2];
            var b3 = sm2[3];
            dm[0] = a0 * b0 + a2 * b1;
            dm[1] = a1 * b0 + a3 * b1;
            dm[2] = a0 * b2 + a2 * b3;
            dm[3] = a1 * b2 + a3 * b3;
        },

        /**
         * Alias for multiply.
         * @method Matrix2#mul
         * @static
         */
        mul: function(dest, src1, src2) {
            this.multiply(dest, src1, src2);
        },
        /**
         * Rotates a 2x2 matrix by the given angle.
         * @method Matrix2#rotate
         * @param {Matrix2} dest - the destination matrix.
         * @param {Matrix2} src - the matrix to rotate.
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
            var s = Math.sin(rad);
            var c = Math.cos(rad);
            dm[0] = a0 * c + a2 * s;
            dm[1] = a1 * c + a3 * s;
            dm[2] = a0 * -s + a2 * c;
            dm[3] = a1 * -s + a3 * c;
        },

        /**
         * Scales the 2x2 matrix by the dimensions in the given 2D vector.
         * @method Matrix2#scale
         * @param {Matrix2} dest - the destination matrix.
         * @param {Matrix2} src - the matrix to scale.
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
            var v0 = v[0];
            var v1 = v[1];
            dm[0] = a0 * v0;
            dm[1] = a1 * v0;
            dm[2] = a2 * v1;
            dm[3] = a3 * v1;
        },

        /**
         * Creates a matrix from a given angle.
         * This is equivalent to (but much faster than):
         *
         *     Matrix2.identity(dest);
         *     Matrix2.rotate(dest, dest, rad);
         * @method Matrix2#fromRotation
         * @param {Matrix2} dest - the destination matrix.
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
        },

        /**
         * Creates a matrix from a vector scaling.
         * This is equivalent to (but much faster than):
         *
         *     Matrix2.identity(dest);
         *     Matrix2.scale(dest, dest vec);
         * @method Matrix2#fromScaling
         * @param {Matrix2} dest - the destination matrix.
         * @param {Vector2} vec - the scaling 2D vector.
         * @static
         */
        fromScaling: function(dest, vec) {
            var dm = dest.matrix;
            var v = vec.vector;
            dm[0] = v[0];
            dm[1] = 0;
            dm[2] = 0;
            dm[3] = v[1];
        },

        /**
         * Returns Frobenius norm of a 2x2 matrix.
         * @method Matrix2#frob
         * @param {Matrix2} src - the matrix to calculate Frobenius norm of.
         * @return {Number} Frobenius norm.
         * @static
         */
        frob: function(src) {
            var sm = src.matrix;
            return Math.sqrt(Math.pow(sm[0], 2) + Math.pow(sm[1], 2) + Math.pow(sm[2], 2) + Math.pow(sm[3], 2));
        },

        /**
         * Returns L, D and U matrices (Lower triangular, Diagonal and Upper triangular) by factorizing the input matrix
         * @method Matrix2#LDU
         * @param {Matrix2} L - the lower triangular matrix.
         * @param {Matrix2} D - the diagonal matrix.
         * @param {Matrix2} U - the upper triangular matrix.
         * @param {Matrix2} a - the input matrix to factorize.
         * @return {Array} a new [L, D, U].
         * @static
         */
        LDU: function(L, D, U, src) {
            var sm = src.matrix;
            L[2] = sm[2] / sm[0];
            U[0] = sm[0];
            U[1] = sm[1];
            U[3] = sm[3] - L[2] * U[1];
            return [L, D, U];
        }
    },

    /**
     * Copy the values from one 2x2 matrix to another.
     * @method Matrix2#copy
     * @param {Matrix2} src - the source matrix.
     */
    copy: function(src) {
        this.constructor.copy(this, src);
    },

    /**
     * Set a 2x2 matrix to the identity matrix.
     * @method Matrix2#identity
     */
    identity: function() {
        this.constructor.identity(this);
    },

    /**
     * Transpose the values of a 2x2 matrix.
     * @method Matrix2#transpose
     */
    transpose: function() {
        this.constructor.transpose(this, this);
    },

    /**
     * Inverts a 2x2 matrix.
     * @method Matrix2#invert
     */
    invert: function() {
        this.constructor.invert(this, this);
    },

    /**
     * Calculates the adjugate of a 2x2 matrix.
     * @method Matrix2#adjoint
     */
    adjoint: function() {
        this.constructor.adjoint(this, this);
    },

    /**
     * Calculates the determinant of a 2x2 matrix.
     * @method Matrix2#determinant
     * @return {Number} determinant of this 2x2 matrix.
     */
    determinant: function() {
        return this.constructor.determinant(this);
    },

    /**
     * Multiplies two 2x2 matrix's.
     * @method Matrix2#multiply
     * @param {Matrix2} src - the operand.
     */
    multiply: function(src) {
        this.constructor.multiply(this, this, src);
    },

    /**
     * Alias for multiply.
     * @method Matrix2#mul
     */
    mul: function(src) {
        this.constructor.multiply(this, this, src);
    },

    /**
     * Rotates a 2x2 matrix by the given angle.
     * @method Matrix2#rotate
     * @param {Matrix2} src - the matrix to rotate.
     * @param {Number} rad - the angle to rotate the matrix by.
     * @static
     */
    rotate: function(rad) {
        this.constructor.rotate(this, this, rad);
    },

    /**
     * Scales the 2x2 matrix by the dimensions in the given 2D vector.
     * @method Matrix2#scale
     * @param {Vector2} vec - the 2D vector to scale the matrix by.
     */
    scale: function(vec) {
        this.constructor.scale(this, this, vec);
    },

    /**
     * Creates a matrix from a given angle.
     * This is equivalent to (but much faster than):
     *
     *     matrix2.identity();
     *     matrix2.rotate(rad);
     * @method Matrix2#fromRotation
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
     * @method Matrix2#fromScaling
     * @param {Vector2} vec - the scaling 2D vector.
     */
    fromScaling: function(vec) {
        this.constructor.fromScaling(this, vec);
    },

    /**
     * Returns Frobenius norm of a 2x2 matrix.
     * @method Matrix2#frob
     * @return {Number} Frobenius norm.
     */
    frob: function() {
        return this.constructor.frob(this);
    },

    /**
     * Returns L, D and U matrices (Lower triangular, Diagonal and Upper triangular) by factorizing the input matrix
     * @method Matrix2#LDU
     * @param {Matrix2} L - the lower triangular matrix.
     * @param {Matrix2} D - the diagonal matrix.
     * @param {Matrix2} U - the upper triangular matrix.
     * @return {Array} a new [L, D, U].
     */
    LDU: function(L, D, U) {
        return this.constructor.LDU(L, D, U, this);
    },

    /**
     * Creates a new 2x2 matrix initialized with values from an existing matrix.
     * @method Matrix2#clone
     * @return {Matrix2} a new 2x2 matrix.
     * @protected
     * @override
     */
    clone: function() {
        var matrix = this._matrix;
        var clone = YObject.prototype.clone.call(this);
        clone.matrix = new Common.ARRAY_TYPE(4);
        var newMatrix = clone.matrix;
        newMatrix[0] = matrix[0];
        newMatrix[1] = matrix[1];
        newMatrix[2] = matrix[2];
        newMatrix[3] = matrix[3];
        return newMatrix;
    },

    /**
     * Returns a string representation of a 2x2 matrix.
     * @method Matrix2#toString
     * @return {String} string representation of the matrix.
     * @protected
     * @override
     */
    toString: function() {
        var matrix = this._matrix;
        return "Matrix2(" + matrix[0] + ", " + matrix[1] + ", " + matrix[2] + ", " + matrix[3] + ")";
    },

    /**
     * @name Matrix2#matrix
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
