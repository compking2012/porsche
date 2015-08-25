define(function(require, exports, module) {

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

});
