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
var Class = require("./class");

/**
 * Base class for all the class
 * @class YObject
 */
Class.define("framework.YObject", {
    /**
     * Constructor
     * @method YObject#initialize
     */
    initialize: function() {
    },

    /**
     * Destructor
     * @method YObject#destroy
     */
    destroy: function() {
    },

    /**
     * Returns true if value equals this object.
     * @method YObject#equals
     * @param {Object} value The object which compared to self.
     * @return {Boolean}
     */
    equals: function(value) {
        // Just compare the referenece of Object
        return this === value;
    },

    /**
     * Returns the deep copy of self
     * @method YObject#clone
     * @return {Object}
     */
    clone: function() {
        return new this.constructor();
    },

    toString: function() {
        return this.className;
    }
}, module);
