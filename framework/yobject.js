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
 * The root class of all the class in this framework.
 * @class YObject
 */
Class.define("framework.YObject", {
    /**
     * Constructor which will be invoked automatically at this object is constructed right now.
     * Note that DO NOT invoke this directly.
     * @method YObject#initialize
     */
    initialize: function() {
    },

    /**
     * Destructor which need to be invoked when this object is not used anymore.
     * Note that this method MUST BE invoked manually, otherwise it might caused something like memory leak.
     * @method YObject#destroy
     */
    destroy: function() {
    },

    /**
     * Compares this instance with the specified object and indicates if they are equal.
     * In order to be equal, o must represent the same object as this instance using a class-specific comparison.
     * The general contract is that this comparison should be reflexive, symmetric, and transitive. Also,
     * no object reference other than null is equal to null.
     * @method YObject#equals
     * @param {Object} value - the object to compare this instance with.
     * @return {Boolean} true if the specified object is equal to this object; false otherwise.
     */
    equals: function(o) {
        // Just compare the referenece of two objects
        return this === o;
    },

    /**
     * Creates and returns a copy of this Object.
     * The default implementation returns a so-called "shallow" copy:
     * It creates a new instance of the same class and then copies the field values
     * (including object references) from this instance to the new instance.
     * A "deep" copy, in contrast, would also recursively clone nested objects.
     * A subclass that needs to implement this kind of cloning should call super's clone()
     * to create the new instance and then create deep copies of the nested, mutable objects.
     * @method YObject#clone
     * @return {Object} a copy of this object.
     */
    clone: function() {
        return new this.constructor();
    },

    /**
     * Returns a string containing a concise, human-readable description of this object.
     * Subclasses are encouraged to override this method and provide an implementation that
     * takes into account the object's type and data.
     * The default implementation is equivalent to the following expression:
     * this.className
     * @return {[type]} [description]
     */
    toString: function() {
        return this.className;
    }
}, module);
