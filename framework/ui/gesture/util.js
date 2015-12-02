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

Class.define("framework.ui.gesture.Util", YObject, {
    static: {
        /**
         * extend object.
         * means that properties in dest will be overwritten by the ones in src.
         * @param {Object} dest
         * @param {Object} src
         * @param {Boolean} [merge]
         * @return {Object} dest
         */
        extend: function(dest, src, merge) {
            var keys = Object.keys(src);
            var i = 0;
            while (i < keys.length) {
                if (!merge || merge && dest[keys[i]] === undefined) {
                    dest[keys[i]] = src[keys[i]];
                }
                i++;
            }
            return dest;
        },

        /**
         * merge the values from src in the dest.
         * means that properties that exist in dest will not be overwritten by src
         * @param {Object} dest
         * @param {Object} src
         * @return {Object} dest
         */
        merge: function(dest, src) {
            return this.extend(dest, src, true);
        },

        /**
         * let a boolean value also be a function that must return a boolean
         * this first item in args will be used as the context
         * @param {Boolean|Function} val
         * @param {Array} [args]
         * @return {Boolean}
         */
        boolOrFn: function(val, args) {
            if (typeof val === "function") {
                return val.apply(args ? args[0] || undefined : undefined, args);
            }
            return val;
        },

        /**
         * use the val2 when val1 is undefined
         * @param {*} val1
         * @param {*} val2
         * @return {*}
         */
        ifUndefined: function(val1, val2) {
            return val1 === undefined ? val2 : val1;
        },

        /**
         * find if a array contains the object using indexOf or a simple polyFill
         * @param {Array} src
         * @param {String} find
         * @param {String} [findByKey]
         * @return {Boolean|Number} false when not found, or the index
         */
        inArray: function(src, find, findByKey) {
            if (src.indexOf && !findByKey) {
                return src.indexOf(find);
            } else {
                var i = 0;
                while (i < src.length) {
                    if (findByKey && src[i][findByKey] === find || !findByKey && src[i] === find) {
                        return i;
                    }
                    i++;
                }
                return -1;
            }
        },

        /**
         * convert array-like objects to real arrays
         * @param {Object} obj
         * @return {Array}
         */
        toArray: function(obj) {
            return Array.prototype.slice.call(obj, 0);
        },

        /**
         * unique array with objects based on a key (like 'id') or just by the array's value
         * @param {Array} src [{id:1},{id:2},{id:1}]
         * @param {String} [key]
         * @param {Boolean} [sort=False]
         * @return {Array} [{id:1},{id:2}]
         */
        uniqueArray: function(src, key, sort) {
            var results = [];
            var values = [];
            var i = 0;

            while (i < src.length) {
                var val = key ? src[i][key] : src[i];
                if (this.inArray(values, val) < 0) {
                    results.push(src[i]);
                }
                values[i] = val;
                i++;
            }

            if (sort) {
                if (!key) {
                    results = results.sort();
                } else {
                    results = results.sort(function sortUniqueArray(a, b) {
                        return a[key] > b[key];
                    });
                }
            }

            return results;
        },

        /**
         * get a unique id
         * @return {number} uniqueId
         */
        uniqueId: function() {
            if (global._uniqueId === undefined) {
                global._uniqueId = 0;
            }
            return global._uniqueId++;
        }
    }
}, module);
