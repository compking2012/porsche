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
 * 4x4 Matrix.
 * @class Matrix4
 * @extends YObject
 */
Class.define("framework.graphics.Matrix4", YObject, {
    /**
     * Constructor that create a new 4x4 matrix.
     * @method Matrix4#initialize
     */
    initialize: function() {
        YObject.prototype.initialize.apply(this, arguments);

        this._matrix = new Common.ARRAY_TYPE(16);
        var matrix = this._matrix;
        matrix[0] = 1;
        matrix[1] = 0;
        matrix[2] = 0;
        matrix[3] = 0;
        matrix[4] = 0;
        matrix[5] = 1;
        matrix[6] = 0;
        matrix[7] = 0;
        matrix[8] = 0;
        matrix[9] = 0;
        matrix[10] = 1;
        matrix[11] = 0;
        matrix[12] = 0;
        matrix[13] = 0;
        matrix[14] = 0;
        matrix[15] = 1;
    },

    /**
     * Destructor that destroy this 4x4 matrix.
     * @method Matrix4#destroy
     */
    destroy: function() {
        this._matrix = null;

        YObject.prototype.initialize.apply(this, arguments);
    },

    static: {
        /**
         * Copy the values from one 4x4 to another.
         * @method Matrix4#copy
         * @param {Matrix4} dest - the destination matrix.
         * @param {Matrix4} src - the source matrix.
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
            dm[9] = sm[9];
            dm[10] = sm[10];
            dm[11] = sm[11];
            dm[12] = sm[12];
            dm[13] = sm[13];
            dm[14] = sm[14];
            dm[15] = sm[15];
        },

        /**
         * Set a 4x4 matrix to the identity matrix.
         * @method Matrix4#identity
         * @param {Matrix4} dest - the destination matrix.
         * @static
         */
        identity: function(dest) {
            var dm = dest.matrix;
            dm[0] = 1;
            dm[1] = 0;
            dm[2] = 0;
            dm[3] = 0;
            dm[4] = 0;
            dm[5] = 1;
            dm[6] = 0;
            dm[7] = 0;
            dm[8] = 0;
            dm[9] = 0;
            dm[10] = 1;
            dm[11] = 0;
            dm[12] = 0;
            dm[13] = 0;
            dm[14] = 0;
            dm[15] = 1;
        },

        /**
         * Transpose the values of a 4x4 matrix.
         * @method Matrix4#transpose
         * @param {Matrix4} dest - the destination matrix.
         * @param {Matrix4} src - the source matrix.
         * @static
         */
        transpose: function(dest, src) {
            var dm = dest.matrix;
            var sm = src.matrix;
            // If we are transposing ourselves we can skip a few steps but have to cache some values
            if (dm === sm) {
                var a01 = sm[1];
                var a02 = sm[2];
                var a03 = sm[3];
                var a12 = sm[6];
                var a13 = sm[7];
                var a23 = sm[11];

                dm[1] = sm[4];
                dm[2] = sm[8];
                dm[3] = sm[12];
                dm[4] = a01;
                dm[6] = sm[9];
                dm[7] = sm[13];
                dm[8] = a02;
                dm[9] = a12;
                dm[11] = sm[14];
                dm[12] = a03;
                dm[13] = a13;
                dm[14] = a23;
            } else {
                dm[0] = sm[0];
                dm[1] = sm[4];
                dm[2] = sm[8];
                dm[3] = sm[12];
                dm[4] = sm[1];
                dm[5] = sm[5];
                dm[6] = sm[9];
                dm[7] = sm[13];
                dm[8] = sm[2];
                dm[9] = sm[6];
                dm[10] = sm[10];
                dm[11] = sm[14];
                dm[12] = sm[3];
                dm[13] = sm[7];
                dm[14] = sm[11];
                dm[15] = sm[15];
            }
        },

        /**
         * Inverts a 4x4 matrix.
         * @method Matrix4#invert
         * @param {Matrix4} dest - the destination matrix.
         * @param {Matrix4} src - the source matrix.
         * @static
         */
        invert: function(dest, src) {
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
            dm[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
            dm[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
            dm[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
            dm[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
            dm[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
            dm[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
            dm[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
            dm[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
            dm[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
            dm[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
            dm[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
            dm[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
            dm[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
            dm[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
            dm[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
        },

        /**
         * Calculates the adjugate of a 4x4 matrix.
         * @method Matrix4#adjoint
         * @param {Matrix4} dest - the destination matrix.
         * @param {Matrix4} src - the source matrix.
         * @static
         */
        adjoint: function(dest, src) {
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

            dm[0]  =  a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22);
            dm[1]  = -a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22);
            dm[2]  =  a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12);
            dm[3]  = -a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12);
            dm[4]  = -a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22);
            dm[5]  =  a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22);
            dm[6]  = -a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12);
            dm[7]  =  a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12);
            dm[8]  =  a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21);
            dm[9]  = -a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21);
            dm[10] =  a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11);
            dm[11] = -a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11);
            dm[12] = -a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21);
            dm[13] =  a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21);
            dm[14] = -a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11);
            dm[15] =  a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11);
        },

        /**
         * Calculates the determinant of a 4x4 matrix.
         * @method Matrix4#determinant
         * @param {Matrix4} src - the source matrix.
         * @return {Number} determinant of this 4x4 matrix.
         * @static
         */
        determinant: function(src) {
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
            return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
        },

        /**
         * Multiplies two 4x4 matrix's.
         * @method Matrix4#multiply
         * @param {Matrix4} dest - the destination matrix.
         * @param {Matrix4} src1 - the first operand.
         * @param {Matrix4} src2 - the second operand.
         * @static
         */
        multiply: function(dest, src1, src2) {
            var dm = dest.matrix;
            var sm1 = src1.matrix;
            var sm2 = src2.matrix;
            var a00 = sm1[0];
            var a01 = sm1[1];
            var a02 = sm1[2];
            var a03 = sm1[3];
            var a10 = sm1[4];
            var a11 = sm1[5];
            var a12 = sm1[6];
            var a13 = sm1[7];
            var a20 = sm1[8];
            var a21 = sm1[9];
            var a22 = sm1[10];
            var a23 = sm1[11];
            var a30 = sm1[12];
            var a31 = sm1[13];
            var a32 = sm1[14];
            var a33 = sm1[15];

            // Cache only the current line of the second matrix
            var b0 = sm2[0];
            var b1 = sm2[1];
            var b2 = sm2[2];
            var b3 = sm2[3];  
            dm[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
            dm[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
            dm[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
            dm[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

            b0 = sm2[4];
            b1 = sm2[5];
            b2 = sm2[6];
            b3 = sm2[7];
            dm[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
            dm[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
            dm[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
            dm[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

            b0 = sm2[8];
            b1 = sm2[9];
            b2 = sm2[10];
            b3 = sm2[11];
            dm[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
            dm[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
            dm[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
            dm[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

            b0 = sm2[12];
            b1 = sm2[13];
            b2 = sm2[14];
            b3 = sm2[15];
            dm[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
            dm[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
            dm[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
            dm[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
        },

        /**
         * Alias for multiply.
         * @method Matrix4#mul
         * @static
         */
        mul: function(dest, src1, src2) {
            this.multiply(dest, src1, src2);
        },

        /**
         * Translate a 4x4 matrix by the given vector.
         * @method Matrix4#translate
         * @param {Matrix4} dest - the destination matrix.
         * @param {Matrix4} src - the matrix to translate.
         * @param {Vector3} vec - the 3D vector to translate by.
         * @static
         */
        translate: function(dest, src, vec) {
            var dm = dest.matrix;
            var sm = src.matrix;
            var v = vec.vector;
            var x = v[0];
            var y = v[1];
            var z = v[2];
            var a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23;

            if (sm === dm) {
                dm[12] = sm[0] * x + sm[4] * y + sm[8] * z + sm[12];
                dm[13] = sm[1] * x + sm[5] * y + sm[9] * z + sm[13];
                dm[14] = sm[2] * x + sm[6] * y + sm[10] * z + sm[14];
                dm[15] = sm[3] * x + sm[7] * y + sm[11] * z + sm[15];
            } else {
                a00 = sm[0];
                a01 = sm[1];
                a02 = sm[2];
                a03 = sm[3];
                a10 = sm[4];
                a11 = sm[5];
                a12 = sm[6];
                a13 = sm[7];
                a20 = sm[8];
                a21 = sm[9];
                a22 = sm[10];
                a23 = sm[11];

                dm[0] = a00;
                dm[1] = a01;
                dm[2] = a02;
                dm[3] = a03;
                dm[4] = a10;
                dm[5] = a11;
                dm[6] = a12;
                dm[7] = a13;
                dm[8] = a20;
                dm[9] = a21;
                dm[10] = a22;
                dm[11] = a23;

                dm[12] = a00 * x + a10 * y + a20 * z + sm[12];
                dm[13] = a01 * x + a11 * y + a21 * z + sm[13];
                dm[14] = a02 * x + a12 * y + a22 * z + sm[14];
                dm[15] = a03 * x + a13 * y + a23 * z + sm[15];
            }
        },

        /**
         * Scales the 4x4 matrix by the dimensions in the given 3D vector.
         * @method Matrix4#scale
         * @param {Matrix4} dest - the destination matrix.
         * @param {Matrix4} src - the matrix to scale.
         * @param {Vector3} vec - the 3D vector to scale the matrix by.
         * @static
         */
        scale: function(dest, src, vec) {
            var dm = dest.matrix;
            var sm = src.matrix;
            var v = vec.vector;
            var x = v[0];
            var y = v[1];
            var z = v[2];

            dm[0] = sm[0] * x;
            dm[1] = sm[1] * x;
            dm[2] = sm[2] * x;
            dm[3] = sm[3] * x;
            dm[4] = sm[4] * y;
            dm[5] = sm[5] * y;
            dm[6] = sm[6] * y;
            dm[7] = sm[7] * y;
            dm[8] = sm[8] * z;
            dm[9] = sm[9] * z;
            dm[10] = sm[10] * z;
            dm[11] = sm[11] * z;
            dm[12] = sm[12];
            dm[13] = sm[13];
            dm[14] = sm[14];
            dm[15] = sm[15];
        },

        /**
         * Rotates a 4x4 matrix by the given angle around the given axis.
         * @method Matrix4#rotate
         * @param {Matrix4} dest - the destination matrix.
         * @param {Matrix4} src - the matrix to rotate.
         * @param {Number} rad - the angle to rotate the matrix by.
         * @param {Vector3} axis - the axis to rotate around.
         * @static
         */
        rotate: function(dest, src, rad, axis) {
            var dm = dest.matrix;
            var sm = src.matrix;
            var x = axis[0];
            var y = axis[1];
            var z = axis[2];
            var len = Math.sqrt(x * x + y * y + z * z);

            if (Math.abs(len) < Common.EPSILON) {
                return null;
            }
            
            len = 1 / len;
            x *= len;
            y *= len;
            z *= len;

            var s = Math.sin(rad);
            var c = Math.cos(rad);
            var t = 1 - c;

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

            // Construct the elements of the rotation matrix
            var b00 = x * x * t + c;
            var b01 = y * x * t + z * s;
            var b02 = z * x * t - y * s;
            var b10 = x * y * t - z * s;
            var b11 = y * y * t + c;
            var b12 = z * y * t + x * s;
            var b20 = x * z * t + y * s;
            var b21 = y * z * t - x * s;
            var b22 = z * z * t + c;

            // Perform rotation-specific matrix multiplication
            dm[0] = a00 * b00 + a10 * b01 + a20 * b02;
            dm[1] = a01 * b00 + a11 * b01 + a21 * b02;
            dm[2] = a02 * b00 + a12 * b01 + a22 * b02;
            dm[3] = a03 * b00 + a13 * b01 + a23 * b02;
            dm[4] = a00 * b10 + a10 * b11 + a20 * b12;
            dm[5] = a01 * b10 + a11 * b11 + a21 * b12;
            dm[6] = a02 * b10 + a12 * b11 + a22 * b12;
            dm[7] = a03 * b10 + a13 * b11 + a23 * b12;
            dm[8] = a00 * b20 + a10 * b21 + a20 * b22;
            dm[9] = a01 * b20 + a11 * b21 + a21 * b22;
            dm[10] = a02 * b20 + a12 * b21 + a22 * b22;
            dm[11] = a03 * b20 + a13 * b21 + a23 * b22;

            if (sm !== dm) { // If the source and destination differ, copy the unchanged last row
                dm[12] = sm[12];
                dm[13] = sm[13];
                dm[14] = sm[14];
                dm[15] = sm[15];
            }
        },

        /**
         * Rotates a matrix by the given angle around the X axis.
         * @method Matrix4#rotateX
         * @param {Matrix4} dest - the destination matrix.
         * @param {Matrix4} src - the matrix to rotate.
         * @param {Number} rad - the angle to rotate the matrix by.
         * @static
         */
        rotateX: function(dest, src, rad) {
            var dm = dest.matrix;
            var sm = src.matrix;
            var s = Math.sin(rad);
            var c = Math.cos(rad);
            var a10 = sm[4];
            var a11 = sm[5];
            var a12 = sm[6];
            var a13 = sm[7];
            var a20 = sm[8];
            var a21 = sm[9];
            var a22 = sm[10];
            var a23 = sm[11];

            if (sm !== dm) { // If the source and destination differ, copy the unchanged rows
                dm[0]  = sm[0];
                dm[1]  = sm[1];
                dm[2]  = sm[2];
                dm[3]  = sm[3];
                dm[12] = sm[12];
                dm[13] = sm[13];
                dm[14] = sm[14];
                dm[15] = sm[15];
            }

            // Perform axis-specific matrix multiplication
            dm[4] = a10 * c + a20 * s;
            dm[5] = a11 * c + a21 * s;
            dm[6] = a12 * c + a22 * s;
            dm[7] = a13 * c + a23 * s;
            dm[8] = a20 * c - a10 * s;
            dm[9] = a21 * c - a11 * s;
            dm[10] = a22 * c - a12 * s;
            dm[11] = a23 * c - a13 * s;
        },

        /**
         * Rotates a matrix by the given angle around the Y axis
         * @method Matrix4#rotateY
         * @param {Matrix4} dest - the destination matrix.
         * @param {Matrix4} src - the matrix to rotate.
         * @param {Number} rad - the angle to rotate the matrix by.
         * @static
         */
        rotateY: function(dest, src, rad) {
            var dm = dest.matrix;
            var sm = src.matrix;
            var s = Math.sin(rad);
            var c = Math.cos(rad);
            var a00 = sm[0];
            var a01 = sm[1];
            var a02 = sm[2];
            var a03 = sm[3];
            var a20 = sm[8];
            var a21 = sm[9];
            var a22 = sm[10];
            var a23 = sm[11];

            if (sm !== dm) { // If the source and destination differ, copy the unchanged rows
                dm[4]  = sm[4];
                dm[5]  = sm[5];
                dm[6]  = sm[6];
                dm[7]  = sm[7];
                dm[12] = sm[12];
                dm[13] = sm[13];
                dm[14] = sm[14];
                dm[15] = sm[15];
            }

            // Perform axis-specific matrix multiplication
            dm[0] = a00 * c - a20 * s;
            dm[1] = a01 * c - a21 * s;
            dm[2] = a02 * c - a22 * s;
            dm[3] = a03 * c - a23 * s;
            dm[8] = a00 * s + a20 * c;
            dm[9] = a01 * s + a21 * c;
            dm[10] = a02 * s + a22 * c;
            dm[11] = a03 * s + a23 * c;
        },

        /**
         * Rotates a matrix by the given angle around the Z axis
         * @method Matrix4#rotateZ
         * @param {Matrix4} dest - the destination matrix.
         * @param {Matrix4} src - the matrix to rotate.
         * @param {Number} rad - the angle to rotate the matrix by.
         * @static
         */
        rotateZ: function(dest, src, rad) {
            var dm = dest.matrix;
            var sm = src.matrix;
            var s = Math.sin(rad);
            var c = Math.cos(rad);
            var a00 = sm[0];
            var a01 = sm[1];
            var a02 = sm[2];
            var a03 = sm[3];
            var a10 = sm[4];
            var a11 = sm[5];
            var a12 = sm[6];
            var a13 = sm[7];

            if (sm !== dm) { // If the source and destination differ, copy the unchanged last row
                dm[8]  = sm[8];
                dm[9]  = sm[9];
                dm[10] = sm[10];
                dm[11] = sm[11];
                dm[12] = sm[12];
                dm[13] = sm[13];
                dm[14] = sm[14];
                dm[15] = sm[15];
            }

            // Perform axis-specific matrix multiplication
            dm[0] = a00 * c + a10 * s;
            dm[1] = a01 * c + a11 * s;
            dm[2] = a02 * c + a12 * s;
            dm[3] = a03 * c + a13 * s;
            dm[4] = a10 * c - a00 * s;
            dm[5] = a11 * c - a01 * s;
            dm[6] = a12 * c - a02 * s;
            dm[7] = a13 * c - a03 * s;
        },

        /**
         * Creates a matrix from a vector translation.
         * This is equivalent to (but much faster than):
         *
         *     Matrix4.identity(dest);
         *     Matrix4.translate(dest, dest, vec);
         * @method Matrix4#fromTranslation
         * @param {Matrix4} dest - the destination matrix.
         * @param {Vector3} vec - the translation vector.
         * @static
         */
        fromTranslation: function(dest, vec) {
            var dm = dest.matrix;
            var v = vec.vector;
            dm[0] = 1;
            dm[1] = 0;
            dm[2] = 0;
            dm[3] = 0;
            dm[4] = 0;
            dm[5] = 1;
            dm[6] = 0;
            dm[7] = 0;
            dm[8] = 0;
            dm[9] = 0;
            dm[10] = 1;
            dm[11] = 0;
            dm[12] = v[0];
            dm[13] = v[1];
            dm[14] = v[2];
            dm[15] = 1;
        },

        /**
         * Creates a matrix from a vector scaling.
         * This is equivalent to (but much faster than):
         *
         *     Matrix4.identity(dest);
         *     Matrix4.scale(dest, dest, vec);
         * @method Matrix4#fromScaling
         * @param {Matrix4} dest - the destination matrix.
         * @param {Vector3} vec - the scaling vector.
         * @static
         */
        fromScaling: function(dest, vec) {
            var dm = dest.matrix;
            var v = vec.vector;
            dm[0] = v[0];
            dm[1] = 0;
            dm[2] = 0;
            dm[3] = 0;
            dm[4] = 0;
            dm[5] = v[1];
            dm[6] = 0;
            dm[7] = 0;
            dm[8] = 0;
            dm[9] = 0;
            dm[10] = v[2];
            dm[11] = 0;
            dm[12] = 0;
            dm[13] = 0;
            dm[14] = 0;
            dm[15] = 1;
        },

        /**
         * Creates a matrix from a given angle around a given axis.
         * This is equivalent to (but much faster than):
         *
         *     Matrix4.identity(dest);
         *     Matrix4.rotate(dest, dest, rad, axis);
         * @method Matrix4#fromRotation
         * @param {Matrix4} dest - the destination matrix.
         * @param {Number} rad - the angle to rotate the matrix by.
         * @param {Vector3} axis - the axis to rotate around.
         * @static
         */
        fromRotation: function(dest, rad, axis) {
            var dm = dest.matrix;
            var v = axis.vector;
            var x = v[0];
            var y = v[1];
            var z = v[2];
            var len = Math.sqrt(x * x + y * y + z * z);
            
            if (Math.abs(len) < Common.EPSILON) {
                return null;
            }
            
            len = 1 / len;
            x *= len;
            y *= len;
            z *= len;
            
            var s = Math.sin(rad);
            var c = Math.cos(rad);
            var t = 1 - c;
            
            // Perform rotation-specific matrix multiplication
            dm[0] = x * x * t + c;
            dm[1] = y * x * t + z * s;
            dm[2] = z * x * t - y * s;
            dm[3] = 0;
            dm[4] = x * y * t - z * s;
            dm[5] = y * y * t + c;
            dm[6] = z * y * t + x * s;
            dm[7] = 0;
            dm[8] = x * z * t + y * s;
            dm[9] = y * z * t - x * s;
            dm[10] = z * z * t + c;
            dm[11] = 0;
            dm[12] = 0;
            dm[13] = 0;
            dm[14] = 0;
            dm[15] = 1;
        },

        /**
         * Creates a matrix from the given angle around the X axis.
         * This is equivalent to (but much faster than):
         *
         *     Matrix4.identity(dest);
         *     Matrix4.rotateX(dest, dest, rad);
         * @method Matrix4#fromXRotation
         * @param {Matrix4} dest - the destination matrix.
         * @param {Number} rad - the angle to rotate the matrix by.
         * @static
         */
        fromXRotation: function(dest, rad) {
            var dm = dest.matrix;
            var s = Math.sin(rad);
            var c = Math.cos(rad);
            
            // Perform axis-specific matrix multiplication
            dm[0] = 1;
            dm[1] = 0;
            dm[2] = 0;
            dm[3] = 0;
            dm[4] = 0;
            dm[5] = c;
            dm[6] = s;
            dm[7] = 0;
            dm[8] = 0;
            dm[9] = -s;
            dm[10] = c;
            dm[11] = 0;
            dm[12] = 0;
            dm[13] = 0;
            dm[14] = 0;
            dm[15] = 1;
        },

        /**
         * Creates a matrix from the given angle around the Y axis.
         * This is equivalent to (but much faster than):
         *
         *     Matrix4.identity(dest);
         *     Matrix4.rotateY(dest, dest, rad);
         * @method Matrix4#fromYRotation
         * @param {Matrix4} dest - the destination matrix.
         * @param {Number} rad - the angle to rotate the matrix by.
         * @static
         */
        fromYRotation: function(dest, rad) {
            var dm = dest.matrix;
            var s = Math.sin(rad);
            var c = Math.cos(rad);
            
            // Perform axis-specific matrix multiplication
            dm[0] = c;
            dm[1] = 0;
            dm[2] = -s;
            dm[3] = 0;
            dm[4] = 0;
            dm[5] = 1;
            dm[6] = 0;
            dm[7] = 0;
            dm[8] = s;
            dm[9] = 0;
            dm[10] = c;
            dm[11] = 0;
            dm[12] = 0;
            dm[13] = 0;
            dm[14] = 0;
            dm[15] = 1;
        },

        /**
         * Creates a matrix from the given angle around the Z axis.
         * This is equivalent to (but much faster than):
         *
         *     Matrix4.identity(dest);
         *     Matrix4.rotateZ(dest, dest, rad);
         * @method Matrix4#fromZRotation
         * @param {Matrix4} dest - the destination matrix.
         * @param {Number} rad - the angle to rotate the matrix by.
         * @static
         */
        fromZRotation: function(dest, rad) {
            var dm = dest.matrix;
            var s = Math.sin(rad);
            var c = Math.cos(rad);
            
            // Perform axis-specific matrix multiplication
            dm[0] = c;
            dm[1] = s;
            dm[2] = 0;
            dm[3] = 0;
            dm[4] = -s;
            dm[5] = c;
            dm[6] = 0;
            dm[7] = 0;
            dm[8] = 0;
            dm[9] = 0;
            dm[10] = 1;
            dm[11] = 0;
            dm[12] = 0;
            dm[13] = 0;
            dm[14] = 0;
            dm[15] = 1;
        },

        /**
         * Creates a matrix from a quaternion rotation and vector translation.
         * This is equivalent to (but much faster than):
         *
         *     Matrix4.identity(dest);
         *     Matrix4.translate(dest, vec);
         *     var quatMat = new Matrix4();
         *     Quaternion.toMatrix4(quat, quatMat);
         *     Matrix4.multiply(dest, quatMat);
         * @method Matrix4#fromRotationTranslation
         * @param {Matrix4} dest - the destination matrix.
         * @param {Quaternion} qtn - the rotation quaternion.
         * @param {vec3} vec - the translation vector.
         * @static
         */
        fromRotationTranslation: function(dest, qtn, vec) {
            var dm = dest.matrix;
            var q = qtn.quaternion;
            var v = vec.vector;
            // Quaternion math
            var x = q[0];
            var y = q[1];
            var z = q[2];
            var w = q[3];
            var x2 = x + x;
            var y2 = y + y;
            var z2 = z + z;

            var xx = x * x2;
            var xy = x * y2;
            var xz = x * z2;
            var yy = y * y2;
            var yz = y * z2;
            var zz = z * z2;
            var wx = w * x2;
            var wy = w * y2;
            var wz = w * z2;

            dm[0] = 1 - (yy + zz);
            dm[1] = xy + wz;
            dm[2] = xz - wy;
            dm[3] = 0;
            dm[4] = xy - wz;
            dm[5] = 1 - (xx + zz);
            dm[6] = yz + wx;
            dm[7] = 0;
            dm[8] = xz + wy;
            dm[9] = yz - wx;
            dm[10] = 1 - (xx + yy);
            dm[11] = 0;
            dm[12] = v[0];
            dm[13] = v[1];
            dm[14] = v[2];
            dm[15] = 1;
        },

        /**
         * Creates a matrix from a quaternion rotation, vector translation and vector scale.
         * This is equivalent to (but much faster than):
         *
         *     Matrix4.identity(dest);
         *     Matrix4.translate(dest, vec);
         *     var quatMat = new Matrix4();
         *     quat4.toMatrix4(quat, quatMat);
         *     Matrix4.multiply(dest, quatMat);
         *     Matrix4.scale(dest, scale);
         * @method Matrix4#fromRotationTranslationScale
         * @param {mat4} out mat4 receiving operation result
         * @param {quat4} q Rotation quaternion
         * @param {vec3} v Translation vector
         * @param {vec3} s Scaling vector
         * @returns {mat4} out
         */
        fromRotationTranslationScale: function (out, q, v, s) {
            // Quaternion math
            var x = q[0], y = q[1], z = q[2], w = q[3],
                x2 = x + x,
                y2 = y + y,
                z2 = z + z,

                xx = x * x2,
                xy = x * y2,
                xz = x * z2,
                yy = y * y2,
                yz = y * z2,
                zz = z * z2,
                wx = w * x2,
                wy = w * y2,
                wz = w * z2,
                sx = s[0],
                sy = s[1],
                sz = s[2];

            out[0] = (1 - (yy + zz)) * sx;
            out[1] = (xy + wz) * sx;
            out[2] = (xz - wy) * sx;
            out[3] = 0;
            out[4] = (xy - wz) * sy;
            out[5] = (1 - (xx + zz)) * sy;
            out[6] = (yz + wx) * sy;
            out[7] = 0;
            out[8] = (xz + wy) * sz;
            out[9] = (yz - wx) * sz;
            out[10] = (1 - (xx + yy)) * sz;
            out[11] = 0;
            out[12] = v[0];
            out[13] = v[1];
            out[14] = v[2];
            out[15] = 1;
            
            return out;
        };

        /**
         * Creates a matrix from a quaternion rotation, vector translation and vector scale, rotating and scaling around the given origin
         * This is equivalent to (but much faster than):
         *
         *     mat4.identity(dest);
         *     mat4.translate(dest, vec);
         *     mat4.translate(dest, origin);
         *     var quatMat = mat4.create();
         *     quat4.toMat4(quat, quatMat);
         *     mat4.multiply(dest, quatMat);
         *     mat4.scale(dest, scale)
         *     mat4.translate(dest, negativeOrigin);
         *
         * @param {mat4} out mat4 receiving operation result
         * @param {quat4} q Rotation quaternion
         * @param {vec3} v Translation vector
         * @param {vec3} s Scaling vector
         * @param {vec3} o The origin vector around which to scale and rotate
         * @returns {mat4} out
         */
        mat4.fromRotationTranslationScaleOrigin = function (out, q, v, s, o) {
          // Quaternion math
          var x = q[0], y = q[1], z = q[2], w = q[3],
              x2 = x + x,
              y2 = y + y,
              z2 = z + z,

              xx = x * x2,
              xy = x * y2,
              xz = x * z2,
              yy = y * y2,
              yz = y * z2,
              zz = z * z2,
              wx = w * x2,
              wy = w * y2,
              wz = w * z2,
              
              sx = s[0],
              sy = s[1],
              sz = s[2],

              ox = o[0],
              oy = o[1],
              oz = o[2];
              
          out[0] = (1 - (yy + zz)) * sx;
          out[1] = (xy + wz) * sx;
          out[2] = (xz - wy) * sx;
          out[3] = 0;
          out[4] = (xy - wz) * sy;
          out[5] = (1 - (xx + zz)) * sy;
          out[6] = (yz + wx) * sy;
          out[7] = 0;
          out[8] = (xz + wy) * sz;
          out[9] = (yz - wx) * sz;
          out[10] = (1 - (xx + yy)) * sz;
          out[11] = 0;
          out[12] = v[0] + ox - (out[0] * ox + out[4] * oy + out[8] * oz);
          out[13] = v[1] + oy - (out[1] * ox + out[5] * oy + out[9] * oz);
          out[14] = v[2] + oz - (out[2] * ox + out[6] * oy + out[10] * oz);
          out[15] = 1;
                
          return out;
        };

        mat4.fromQuat = function (out, q) {
            var x = q[0], y = q[1], z = q[2], w = q[3],
                x2 = x + x,
                y2 = y + y,
                z2 = z + z,

                xx = x * x2,
                yx = y * x2,
                yy = y * y2,
                zx = z * x2,
                zy = z * y2,
                zz = z * z2,
                wx = w * x2,
                wy = w * y2,
                wz = w * z2;

            out[0] = 1 - yy - zz;
            out[1] = yx + wz;
            out[2] = zx - wy;
            out[3] = 0;

            out[4] = yx - wz;
            out[5] = 1 - xx - zz;
            out[6] = zy + wx;
            out[7] = 0;

            out[8] = zx + wy;
            out[9] = zy - wx;
            out[10] = 1 - xx - yy;
            out[11] = 0;

            out[12] = 0;
            out[13] = 0;
            out[14] = 0;
            out[15] = 1;

            return out;
        };

    },
/**
 * Creates a new mat4 initialized with values from an existing matrix
 *
 * @param {mat4} a matrix to clone
 * @returns {mat4} a new 4x4 matrix
 */
mat4.clone = function(a) {
    var out = new glMatrix.ARRAY_TYPE(16);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
};






/**
 * Generates a frustum matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {Number} left Left bound of the frustum
 * @param {Number} right Right bound of the frustum
 * @param {Number} bottom Bottom bound of the frustum
 * @param {Number} top Top bound of the frustum
 * @param {Number} near Near bound of the frustum
 * @param {Number} far Far bound of the frustum
 * @returns {mat4} out
 */
mat4.frustum = function (out, left, right, bottom, top, near, far) {
    var rl = 1 / (right - left),
        tb = 1 / (top - bottom),
        nf = 1 / (near - far);
    out[0] = (near * 2) * rl;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = (near * 2) * tb;
    out[6] = 0;
    out[7] = 0;
    out[8] = (right + left) * rl;
    out[9] = (top + bottom) * tb;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = (far * near * 2) * nf;
    out[15] = 0;
    return out;
};

/**
 * Generates a perspective projection matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} fovy Vertical field of view in radians
 * @param {number} aspect Aspect ratio. typically viewport width/height
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
mat4.perspective = function (out, fovy, aspect, near, far) {
    var f = 1.0 / Math.tan(fovy / 2),
        nf = 1 / (near - far);
    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = (2 * far * near) * nf;
    out[15] = 0;
    return out;
};

/**
 * Generates a perspective projection matrix with the given field of view.
 * This is primarily useful for generating projection matrices to be used
 * with the still experiemental WebVR API.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} fov Object containing the following values: upDegrees, downDegrees, leftDegrees, rightDegrees
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
mat4.perspectiveFromFieldOfView = function (out, fov, near, far) {
    var upTan = Math.tan(fov.upDegrees * Math.PI/180.0),
        downTan = Math.tan(fov.downDegrees * Math.PI/180.0),
        leftTan = Math.tan(fov.leftDegrees * Math.PI/180.0),
        rightTan = Math.tan(fov.rightDegrees * Math.PI/180.0),
        xScale = 2.0 / (leftTan + rightTan),
        yScale = 2.0 / (upTan + downTan);

    out[0] = xScale;
    out[1] = 0.0;
    out[2] = 0.0;
    out[3] = 0.0;
    out[4] = 0.0;
    out[5] = yScale;
    out[6] = 0.0;
    out[7] = 0.0;
    out[8] = -((leftTan - rightTan) * xScale * 0.5);
    out[9] = ((upTan - downTan) * yScale * 0.5);
    out[10] = far / (near - far);
    out[11] = -1.0;
    out[12] = 0.0;
    out[13] = 0.0;
    out[14] = (far * near) / (near - far);
    out[15] = 0.0;
    return out;
}

/**
 * Generates a orthogonal projection matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} left Left bound of the frustum
 * @param {number} right Right bound of the frustum
 * @param {number} bottom Bottom bound of the frustum
 * @param {number} top Top bound of the frustum
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
mat4.ortho = function (out, left, right, bottom, top, near, far) {
    var lr = 1 / (left - right),
        bt = 1 / (bottom - top),
        nf = 1 / (near - far);
    out[0] = -2 * lr;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = -2 * bt;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 2 * nf;
    out[11] = 0;
    out[12] = (left + right) * lr;
    out[13] = (top + bottom) * bt;
    out[14] = (far + near) * nf;
    out[15] = 1;
    return out;
};

/**
 * Generates a look-at matrix with the given eye position, focal point, and up axis
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {vec3} eye Position of the viewer
 * @param {vec3} center Point the viewer is looking at
 * @param {vec3} up vec3 pointing up
 * @returns {mat4} out
 */
mat4.lookAt = function (out, eye, center, up) {
    var x0, x1, x2, y0, y1, y2, z0, z1, z2, len,
        eyex = eye[0],
        eyey = eye[1],
        eyez = eye[2],
        upx = up[0],
        upy = up[1],
        upz = up[2],
        centerx = center[0],
        centery = center[1],
        centerz = center[2];

    if (Math.abs(eyex - centerx) < glMatrix.EPSILON &&
        Math.abs(eyey - centery) < glMatrix.EPSILON &&
        Math.abs(eyez - centerz) < glMatrix.EPSILON) {
        return mat4.identity(out);
    }

    z0 = eyex - centerx;
    z1 = eyey - centery;
    z2 = eyez - centerz;

    len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
    z0 *= len;
    z1 *= len;
    z2 *= len;

    x0 = upy * z2 - upz * z1;
    x1 = upz * z0 - upx * z2;
    x2 = upx * z1 - upy * z0;
    len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
    if (!len) {
        x0 = 0;
        x1 = 0;
        x2 = 0;
    } else {
        len = 1 / len;
        x0 *= len;
        x1 *= len;
        x2 *= len;
    }

    y0 = z1 * x2 - z2 * x1;
    y1 = z2 * x0 - z0 * x2;
    y2 = z0 * x1 - z1 * x0;

    len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
    if (!len) {
        y0 = 0;
        y1 = 0;
        y2 = 0;
    } else {
        len = 1 / len;
        y0 *= len;
        y1 *= len;
        y2 *= len;
    }

    out[0] = x0;
    out[1] = y0;
    out[2] = z0;
    out[3] = 0;
    out[4] = x1;
    out[5] = y1;
    out[6] = z1;
    out[7] = 0;
    out[8] = x2;
    out[9] = y2;
    out[10] = z2;
    out[11] = 0;
    out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
    out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
    out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
    out[15] = 1;

    return out;
};

/**
 * Returns a string representation of a mat4
 *
 * @param {mat4} mat matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
mat4.str = function (a) {
    return 'mat4(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ', ' +
                    a[4] + ', ' + a[5] + ', ' + a[6] + ', ' + a[7] + ', ' +
                    a[8] + ', ' + a[9] + ', ' + a[10] + ', ' + a[11] + ', ' + 
                    a[12] + ', ' + a[13] + ', ' + a[14] + ', ' + a[15] + ')';
};

/**
 * Returns Frobenius norm of a mat4
 *
 * @param {mat4} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */
mat4.frob = function (a) {
    return(Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + Math.pow(a[6], 2) + Math.pow(a[7], 2) + Math.pow(a[8], 2) + Math.pow(a[9], 2) + Math.pow(a[10], 2) + Math.pow(a[11], 2) + Math.pow(a[12], 2) + Math.pow(a[13], 2) + Math.pow(a[14], 2) + Math.pow(a[15], 2) ))
};


module.exports = mat4;
