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
 * 3x3 Matrix.
 * @class Matrix3
 * @extends YObject
 */
Class.define("framework.graphics.Matrix3", YObject, {
    /**
     * Constructor that create a new 3x3 matrix.
     * @method Matrix3#initialize
     */
    initialize: function() {
        YObject.prototype.initialize.apply(this, arguments);

        this._matrix = new Common.ARRAY_TYPE(9);
        var matrix = this._matrix;
        matrix[0] = 1;
        matrix[1] = 0;
        matrix[2] = 0;
        matrix[3] = 0;
        matrix[4] = 1;
        matrix[5] = 0;
        matrix[6] = 0;
        matrix[7] = 0;
        matrix[8] = 1;
    },

    /**
     * Destructor that destroy this 3x3 matrix.
     * @method Matrix3#destroy
     */
    destroy: function() {
        this._matrix = null;

        YObject.prototype.initialize.apply(this, arguments);
    },

    static: {
        /**
         * Copy the values from one 3x3 matrix to another.
         * @method Matrix3#copy
         * @param {Matrix3} dest - the destination matrix.
         * @param {Matrix3} src - the source matrix.
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
            dm[6] = sm[6];
            dm[7] = sm[7];
            dm[8] = sm[8];
        },

        /**
         * Set a 3x3 matrix to the identity matrix.
         * @method Matrix3#identity
         * @param {Matrix3} dest - the destination matrix.
         * @static
         */
        identity: function(dest) {
            var dm = dest.matrix;
            dm[0] = 1;
            dm[1] = 0;
            dm[2] = 0;
            dm[3] = 0;
            dm[4] = 1;
            dm[5] = 0;
            dm[6] = 0;
            dm[7] = 0;
            dm[8] = 1;
        },

        /**
         * Transpose the values of a 3x3 matrix.
         * @method Matrix3#transpose
         * @param {Matrix3} dest - the destination matrix.
         * @param {Matrix3} src - the source matrix.
         * @static
         */
        transpose: function(dest, src) {
            var dm = dest.matrix;
            var sm = src.matrix;
            // If we are transposing ourselves we can skip a few steps but have to cache some values
            if (dm === sm) {
                var a01 = sm[1];
                var a02 = sm[2];
                var a12 = sm[5];
                dm[1] = sm[3];
                dm[2] = sm[6];
                dm[3] = a01;
                dm[5] = sm[7];
                dm[6] = a02;
                dm[7] = a12;
            } else {
                dm[0] = sm[0];
                dm[1] = sm[3];
                dm[2] = sm[6];
                dm[3] = sm[1];
                dm[4] = sm[4];
                dm[5] = sm[7];
                dm[6] = sm[2];
                dm[7] = sm[5];
                dm[8] = sm[8];
            }
        },

        /**
         * Inverts a 3x3 matrix.
         * @method Matrix3#invert
         * @param {Matrix3} dest - the destination matrix.
         * @param {Matrix3} src - the source matrix.
         * @static
         */
        invert: function(dest, src) {
            var dm = dest.matrix;
            var sm = src.matrix;
            var a00 = sm[0];
            var a01 = sm[1];
            var a02 = sm[2];
            var a10 = sm[3];
            var a11 = sm[4];
            var a12 = sm[5];
            var a20 = sm[6];
            var a21 = sm[7];
            var a22 = sm[8];
            var b01 = a22 * a11 - a12 * a21;
            var b11 = -a22 * a10 + a12 * a20;
            var b21 = a21 * a10 - a11 * a20;

            // Calculate the determinant
            var det = a00 * b01 + a01 * b11 + a02 * b21;

            if (!det) {
                return null;
            }
            det = 1.0 / det;

            dm[0] = b01 * det;
            dm[1] = (-a22 * a01 + a02 * a21) * det;
            dm[2] = (a12 * a01 - a02 * a11) * det;
            dm[3] = b11 * det;
            dm[4] = (a22 * a00 - a02 * a20) * det;
            dm[5] = (-a12 * a00 + a02 * a10) * det;
            dm[6] = b21 * det;
            dm[7] = (-a21 * a00 + a01 * a20) * det;
            dm[8] = (a11 * a00 - a01 * a10) * det;
        },

        /**
         * Calculates the adjugate of a 3x3 matrix.
         * @method Matrix3#adjoint
         * @param {Matrix3} dest - the destination matrix.
         * @param {Matrix3} src - the source matrix.
         * @static
         */
        adjoint: function(dest, src) {
            var dm = dest.matrix;
            var sm = src.matrix;
            var a00 = sm[0];
            var a01 = sm[1];
            var a02 = sm[2];
            var a10 = sm[3];
            var a11 = sm[4];
            var a12 = sm[5];
            var a20 = sm[6];
            var a21 = sm[7];
            var a22 = sm[8];

            dm[0] = a11 * a22 - a12 * a21;
            dm[1] = a02 * a21 - a01 * a22;
            dm[2] = a01 * a12 - a02 * a11;
            dm[3] = a12 * a20 - a10 * a22;
            dm[4] = a00 * a22 - a02 * a20;
            dm[5] = a02 * a10 - a00 * a12;
            dm[6] = a10 * a21 - a11 * a20;
            dm[7] = a01 * a20 - a00 * a21;
            dm[8] = a00 * a11 - a01 * a10;
        },

        /**
         * Calculates the determinant of a 3x3 matrix.
         * @method Matrix3#determinant
         * @param {Matrix3} src - the source matrix.
         * @return {Number} determinant of this 3x3 matrix.
         * @static
         */
        determinant: function(src) {
            var sm = src.matrix;
            var a00 = sm[0];
            var a01 = sm[1];
            var a02 = sm[2];
            var a10 = sm[3];
            var a11 = sm[4];
            var a12 = sm[5];
            var a20 = sm[6];
            var a21 = sm[7];
            var a22 = sm[8];

            return a00 * (a22 * a11 - a12 * a21) + a01 * (-a22 * a10 + a12 * a20) + a02 * (a21 * a10 - a11 * a20);
        },

        /**
         * Multiplies two 3x3 matrix's.
         * @method Matrix3#multiply
         * @param {Matrix3} dest - the destination matrix.
         * @param {Matrix3} src1 - the first operand.
         * @param {Matrix3} src2 - the second operand.
         * @static
         */
        multiply: function(dest, src1, src2) {
            var dm = dest.matrix;
            var sm1 = src1.matrix;
            var sm2 = src2.matrix;
            var a00 = sm1[0];
            var a01 = sm1[1];
            var a02 = sm1[2];
            var a10 = sm1[3];
            var a11 = sm1[4];
            var a12 = sm1[5];
            var a20 = sm1[6];
            var a21 = sm1[7];
            var a22 = sm1[8];

            var b00 = sm2[0];
            var b01 = sm2[1];
            var b02 = sm2[2];
            var b10 = sm2[3];
            var b11 = sm2[4];
            var b12 = sm2[5];
            var b20 = sm2[6];
            var b21 = sm2[7];
            var b22 = sm2[8];

            dm[0] = b00 * a00 + b01 * a10 + b02 * a20;
            dm[1] = b00 * a01 + b01 * a11 + b02 * a21;
            dm[2] = b00 * a02 + b01 * a12 + b02 * a22;

            dm[3] = b10 * a00 + b11 * a10 + b12 * a20;
            dm[4] = b10 * a01 + b11 * a11 + b12 * a21;
            dm[5] = b10 * a02 + b11 * a12 + b12 * a22;

            dm[6] = b20 * a00 + b21 * a10 + b22 * a20;
            dm[7] = b20 * a01 + b21 * a11 + b22 * a21;
            dm[8] = b20 * a02 + b21 * a12 + b22 * a22;
        },

        /**
         * Alias for multiply.
         * @method Matrix3#mul
         * @static
         */
        mul: function(dest, src1, src2) {
            this.multiply(dest, src1, src2);
        },

        /**
         * Translate a 3x3 matrix by the given vector.
         * @method Matrix3#translate
         * @param {Matrix3} dest - the destination matrix.
         * @param {Matrix3} src - the matrix to translate.
         * @param {Vector2} vec - the 2D vector to translate by.
         * @static
         */
        translate: function(dest, src, vec) {
            var dm = dest.matrix;
            var sm = src.matrix;
            var v = vec.vector;
            var a00 = sm[0];
            var a01 = sm[1];
            var a02 = sm[2];
            var a10 = sm[3];
            var a11 = sm[4];
            var a12 = sm[5];
            var a20 = sm[6];
            var a21 = sm[7];
            var a22 = sm[8];
            var x = v[0];
            var y = v[1];

            dm[0] = a00;
            dm[1] = a01;
            dm[2] = a02;

            dm[3] = a10;
            dm[4] = a11;
            dm[5] = a12;

            dm[6] = x * a00 + y * a10 + a20;
            dm[7] = x * a01 + y * a11 + a21;
            dm[8] = x * a02 + y * a12 + a22;
        },

        /**
         * Rotates a 3x3 matrix by the given angle.
         * @method Matrix3#rotate
         * @param {Matrix3} dest - the destination matrix.
         * @param {Matrix3} src - the matrix to rotate.
         * @param {Number} rad - the angle to rotate the matrix by.
         * @static
         */
        rotate: function(dest, src, rad) {
            var dm = dest.matrix;
            var sm = src.matrix;
            var a00 = sm[0];
            var a01 = sm[1];
            var a02 = sm[2];
            var a10 = sm[3];
            var a11 = sm[4];
            var a12 = sm[5];
            var a20 = sm[6];
            var a21 = sm[7];
            var a22 = sm[8];

            var s = Math.sin(rad);
            var c = Math.cos(rad);

            dm[0] = c * a00 + s * a10;
            dm[1] = c * a01 + s * a11;
            dm[2] = c * a02 + s * a12;

            dm[3] = c * a10 - s * a00;
            dm[4] = c * a11 - s * a01;
            dm[5] = c * a12 - s * a02;

            dm[6] = a20;
            dm[7] = a21;
            dm[8] = a22;
        },

        /**
         * Scales the 3x3 matrix by the dimensions in the given 2D vector.
         * @method Matrix3#scale
         * @param {Matrix3} dest - the destination matrix.
         * @param {Matrix3} src - the matrix to scale.
         * @param {Vector2} vec - the 2D vector to scale the matrix by.
         * @static
         */
        scale: function(dest, src, vec) {
            var dm = dest.matrix;
            var sm = src.matrix;
            var v = vec.vector;
            var x = v[0];
            var y = v[1];

            dm[0] = x * sm[0];
            dm[1] = x * sm[1];
            dm[2] = x * sm[2];

            dm[3] = y * sm[3];
            dm[4] = y * sm[4];
            dm[5] = y * sm[5];

            dm[6] = sm[6];
            dm[7] = sm[7];
            dm[8] = sm[8];
        },

        /**
         * Creates a matrix from a vector translation.
         * This is equivalent to (but much faster than):
         *
         *     Matrix3.identity(dest);
         *     Matrix3.translate(dest, dest, vec);
         * @method Matrix3#fromTranslation
         * @param {Matrix3} dest - the destination matrix.
         * @param {Vector2} vec - the translation vector.
         * @static
         */
        fromTranslation: function(dest, vec) {
            var dm = dest.matrix;
            var v = vec.vector;
            dm[0] = 1;
            dm[1] = 0;
            dm[2] = 0;
            dm[3] = 0;
            dm[4] = 1;
            dm[5] = 0;
            dm[6] = v[0];
            dm[7] = v[1];
            dm[8] = 1;
        },

        /**
         * Creates a matrix from a given angle.
         * This is equivalent to (but much faster than):
         *
         *     Matrix3.identity(dest);
         *     Matrix3.rotate(dest, dest, rad);
         * @method Matrix3#fromRotation
         * @param {Matrix3} dest - the destination matrix.
         * @param {Number} rad - the angle to rotate the matrix by.
         * @static
         */
        fromRotation: function(dest, rad) {
            var dm = dest.matrix;
            var s = Math.sin(rad);
            var c = Math.cos(rad);

            dm[0] = c;
            dm[1] = s;
            dm[2] = 0;

            dm[3] = -s;
            dm[4] = c;
            dm[5] = 0;

            dm[6] = 0;
            dm[7] = 0;
            dm[8] = 1;
        },

        /**
         * Creates a matrix from a vector scaling.
         * This is equivalent to (but much faster than):
         *
         *     Matrix3.identity(dest);
         *     Matrix3.scale(dest, dest, vec);
         * @method Matrix3#fromScaling
         * @param {Matrix3} dest - the destination matrix.
         * @param {Vector2} vec - the scaling vector.
         * @static
         */
        fromScaling: function(dest, vec) {
            var dm = dest.matrix;
            var v = vec.vector;
            dm[0] = v[0];
            dm[1] = 0;
            dm[2] = 0;

            dm[3] = 0;
            dm[4] = v[1];
            dm[5] = 0;

            dm[6] = 0;
            dm[7] = 0;
            dm[8] = 1;
        },

        /**
         * Copies the values from a 2x3 matrix into a 3x3 matrix.
         * @method Matrix3#fromMatrix2D
         * @param {Matrix3} dest - the destination matrix.
         * @param {Matrix2D} src - the matrix to copy.
         * @static
         */
        fromMatrix2D: function(dest, src) {
            var dm = dest.matrix;
            var sm = src.matrix;
            dm[0] = sm[0];
            dm[1] = sm[1];
            dm[2] = 0;

            dm[3] = sm[2];
            dm[4] = sm[3];
            dm[5] = 0;

            dm[6] = sm[4];
            dm[7] = sm[5];
            dm[8] = 1;
        },

        /**
         * Copies the upper-left 3x3 values into the given mat3.
         * @method Matrix3#fromMatrix4
         * @param {Matrix3} dest - the destination matrix.
         * @param {Matrix4} src - the source 4x4 matrix.
         * @static
         */
        fromMatrix4: function(dest, src) {
            var dm = dest.matrix;
            var sm = src.matrix;
            dm[0] = sm[0];
            dm[1] = sm[1];
            dm[2] = sm[2];
            dm[3] = sm[4];
            dm[4] = sm[5];
            dm[5] = sm[6];
            dm[6] = sm[8];
            dm[7] = sm[9];
            dm[8] = sm[10];
        },

        /**
        * Calculates a 3x3 matrix from the given quaternion
        * @method Matrix3#fromQuaternion
        * @param {Matrix3} dest - the destination matrix.
        * @param {Quaternion} qtn - the quaternion to create matrix from.
        * @static
        */
        fromQuaternion: function(dest, qtn) {
            var dm = dest.matrix;
            var q = qtn.quaternion;
            var x = q[0];
            var y = q[1];
            var z = q[2];
            var w = q[3];
            var x2 = x + x;
            var y2 = y + y;
            var z2 = z + z;

            var xx = x * x2;
            var yx = y * x2;
            var yy = y * y2;
            var zx = z * x2;
            var zy = z * y2;
            var zz = z * z2;
            var wx = w * x2;
            var wy = w * y2;
            var wz = w * z2;

            dm[0] = 1 - yy - zz;
            dm[3] = yx - wz;
            dm[6] = zx + wy;

            dm[1] = yx + wz;
            dm[4] = 1 - xx - zz;
            dm[7] = zy - wx;

            dm[2] = zx - wy;
            dm[5] = zy + wx;
            dm[8] = 1 - xx - yy;
        },

        /**
        * Calculates a 3x3 normal matrix (transpose inverse) from the 4x4 matrix
        * @method Matrix3#normalFromMatrix4
        * @param {Matrix3} dest - the destination matrix.
        * @param {Matrix4} src - a 4x4 matrix to derive the normal matrix from.
        * @static
        */
        normalFromMatrix4: function(dest, src) {
            var dm = dest.matrix;
            var sm = src.matrix;
            var a00 = sm[0];
            var a01 = sm[1];
            var a02 = sm[2];
            var a03 = sm[3];
            var a10 = sm[4];
            var a11 = sm[5];
            var a12 = sm[6];
            var a13 = sm[7];
            var a20 = sm[8];
            var a21 = sm[9];
            var a22 = sm[10];
            var a23 = sm[11];
            var a30 = sm[12];
            var a31 = sm[13];
            var a32 = sm[14];
            var a33 = sm[15];

            var b00 = a00 * a11 - a01 * a10;
            var b01 = a00 * a12 - a02 * a10;
            var b02 = a00 * a13 - a03 * a10;
            var b03 = a01 * a12 - a02 * a11;
            var b04 = a01 * a13 - a03 * a11;
            var b05 = a02 * a13 - a03 * a12;
            var b06 = a20 * a31 - a21 * a30;
            var b07 = a20 * a32 - a22 * a30;
            var b08 = a20 * a33 - a23 * a30;
            var b09 = a21 * a32 - a22 * a31;
            var b10 = a21 * a33 - a23 * a31;
            var b11 = a22 * a33 - a23 * a32;

            // Calculate the determinant
            var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

            if (!det) {
                return null;
            }
            det = 1.0 / det;

            dm[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
            dm[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
            dm[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;

            dm[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
            dm[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
            dm[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det;

            dm[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
            dm[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
            dm[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
        },

        /**
         * Returns Frobenius norm of a 3x3 matrix.
         * @method Matrix3#frob
         * @param {Matrix3} src - the matrix to calculate Frobenius norm of.
         * @return {Number} Frobenius norm.
         * @static
         */
        frob: function(src) {
            var sm = src.matrix;
            return Math.sqrt(Math.pow(sm[0], 2) + Math.pow(sm[1], 2) + Math.pow(sm[2], 2) + Math.pow(sm[3], 2) + Math.pow(sm[4], 2) + Math.pow(sm[5], 2) + Math.pow(sm[6], 2) + Math.pow(sm[7], 2) + Math.pow(sm[8], 2));
        }
    },

    /**
     * Copy the values from one 3x3 matrix to another.
     * @method Matrix3#copy
     * @param {Matrix3} src - the source matrix.
     */
    copy: function(src) {
        this.constructor.copy(this, src);
    },

    /**
     * Set a 3x3 matrix to the identity matrix.
     * @method Matrix3#identity
     */
    identity: function() {
        this.constructor.identity(this);
    },

    /**
     * Transpose the values of a 3x3 matrix.
     * @method Matrix3#transpose
     */
    transpose: function() {
        this.constructor.transpose(this, this);
    },

    /**
     * Inverts a 3x3 matrix.
     * @method Matrix3#invert
     */
    invert: function() {
        this.constructor.invert(this, this);
    },

    /**
     * Calculates the adjugate of a 3x3 matrix.
     * @method Matrix3#adjoint
     */
    adjoint: function() {
        this.constructor.adjoint(this, this);
    },

    /**
     * Calculates the determinant of a 3x3 matrix.
     * @method Matrix3#determinant
     * @return {Number} determinant of this 3x3 matrix.
     */
    determinant: function() {
        return this.constructor.determinant(this);
    },

    /**
     * Multiplies two 3x3 matrix's.
     * @method Matrix3#multiply
     * @param {Matrix3} src - the operand.
     */
    multiply: function(src) {
        this.constructor.multiply(this, this, src);
    },

    /**
     * Alias for multiply.
     * @method Matrix3#mul
     */
    mul: function(src) {
        this.constructor.multiply(this, this, src);
    },

    /**
     * Translate a 3x3 matrix by the given vector.
     * @method Matrix3#translate
     * @param {Vector2} vec - the 2D vector to translate by.
     */
    translate: function(vec) {
        this.constructor.translate(this, this, vec);
    },

    /**
     * Rotates a 3x3 matrix by the given angle.
     * @method Matrix3#rotate
     * @param {Number} rad - the angle to rotate the matrix by.
     */
    rotate: function(rad) {
        this.constructor.rotate(this, this, rad);
    },

    /**
     * Scales the 3x3 matrix by the dimensions in the given 2D vector.
     * @method Matrix3#scale
     * @param {Vector2} vec - the 2D vector to scale the matrix by.
     */
    scale: function(vec) {
        this.constructor.scale(this, this, vec);
    },

    /**
     * Creates a matrix from a vector translation.
     * This is equivalent to (but much faster than):
     *
     *     matrix3.identity();
     *     matrix3.translate(vec);
     * @method Matrix3#fromTranslation
     * @param {Vector2} vec - the translation vector.
     */
    fromTranslation: function(vec) {
        this.constructor.fromTranslation(this, vec);
    },

    /**
     * Creates a matrix from a given angle.
     * This is equivalent to (but much faster than):
     *
     *     matrix3.identity();
     *     matrix3.rotate(rad);
     * @method Matrix3#fromRotation
     * @param {Number} rad - the angle to rotate the matrix by.
     */
    fromRotation: function(rad) {
        this.constructor.fromRotation(this, rad);
    },

    /**
     * Creates a matrix from a vector scaling.
     * This is equivalent to (but much faster than):
     *
     *     matrix3.identity();
     *     matrix3.scale(vec);
     * @method Matrix3#fromScaling
     * @param {Vector2} vec - the scaling vector.
     */
    fromScaling: function(vec) {
        this.constructor.fromScaling(this, vec);
    },

    /**
     * Copies the values from a 2x3 matrix into a 3x3 matrix.
     * @method Matrix3#fromMatrix2D
     * @param {Matrix2D} src - the matrix to copy.
     */
    fromMatrix2D: function(src) {
        this.constructor.fromMatrix2D(this, src);
    },

    /**
     * Copies the upper-left 3x3 values into the given 3x3 matrix.
     * @method Matrix3#fromMatrix4
     * @param {Matrix4} src - the source 4x4 matrix.
     */
    fromMatrix4: function(src) {
        this.constructor.fromMatrix4(this, src);
    },

    /**
    * Calculates a 3x3 matrix from the given quaternion
    * @method Matrix3#fromQuaternion
    * @param {Quaternion} qtn - the quaternion to create matrix from.
    */
    fromQuaternion: function(qtn) {
        this.constructor.fromQuaternion(this, qtn);
    },

    /**
    * Calculates a 3x3 normal matrix (transpose inverse) from the 4x4 matrix
    * @method Matrix3#normalFromMatrix4
    * @param {Matrix4} src - a 4x4 matrix to derive the normal matrix from.
    */
    normalFromMatrix4: function(src) {
        this.constructor.normalFromMatrix4(this, src);
    },

    /**
     * Returns Frobenius norm of a 3x3 matrix.
     * @method Matrix3#frob
     * @return {Number} Frobenius norm.
     */
    frob: function() {
        return this.constructor.frob(this);
    },

    /**
     * Creates a new 3x3 matrix initialized with values from an existing matrix.
     * @method Matrix3#clone
     * @return {Matrix3} a new 3x3 matrix.
     * @protected
     * @override
     */
    clone: function() {
        var matrix = this._matrix;
        var clone = YObject.prototype.clone.call(this);
        clone.matrix = new Common.ARRAY_TYPE(9);
        var newMatrix = clone.matrix;
        newMatrix[0] = matrix[0];
        newMatrix[1] = matrix[1];
        newMatrix[2] = matrix[2];
        newMatrix[3] = matrix[3];
        newMatrix[4] = matrix[4];
        newMatrix[5] = matrix[5];
        newMatrix[6] = matrix[6];
        newMatrix[7] = matrix[7];
        newMatrix[8] = matrix[8];
        return newMatrix;
    },

    /**
     * Returns a string representation of a mat3
     * @method Matrix3#toString
     * @return {String} string representation of the matrix.
     * @protected
     * @override
     */
    toString: function() {
        var matrix = this._matrix;
        return "Matrix3(" + matrix[0] + ", " + matrix[1] + ", " + matrix[2] + ", " +
                        matrix[3] + ", " + matrix[4] + ", " + matrix[5] + ", " +
                        matrix[6] + ", " + matrix[7] + ", " + matrix[8] + ")";
    },

    /**
     * @name Matrix3#matrix
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
