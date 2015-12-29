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

/**
 * @class Common
 * @private
 */
Class.define("framework.graphics.Common", YObject, {
    static: {
        // Constants
        EPSILON: 0.000001,

        ARRAY_TYPE: typeof Float32Array !== "undefined" ? Float32Array : Array,

        RANDOM: Math.random,

        /**
         * Sets the type of array used when creating new vectors and matrices
         * @method Common#setMatrixArrayType
         * @param {Type} type Array type, such as Float32Array or Array
         */
        setMatrixArrayType: function(type) {
            this.GLMAT_ARRAY_TYPE = type;
        },

        /**
        * Convert Degree To Radian
        * @method Common#toRadian
        * @param {Number} a - the angle in degrees.
        * @return {Number} the radian of the angle.
        */
        toRadian: function(a) {
            var degree = Math.PI / 180;
            return a * degree;
        }
    }
}, module);
