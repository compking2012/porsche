define(function(require, exports, module) {
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
var GestureRecognizer = require("./gesturerecognizer");
var Input = require("./input");

/**
 * Rotation, recognized when two or more pointer are moving in a circular motion.
 * @class RotationRecognizer
 * @extends GestureRecognizer
 */
Class.define("framework.ui.gesture.RotationRecognizer", GestureRecognizer, {
    /**
     * Constructor
     * @method RotationRecognizer#initialize
     */
    initialize: function(/*options*/) {
        GestureRecognizer.prototype.initialize.apply(this, arguments);
    },

    destroy: function() {
        GestureRecognizer.prototype.destroy.apply(this, arguments);
    },

    static: {
        defaults: {
            event: "rotation",
            threshold: 0,
            pointers: 2
        }
    },

    /**
     * Process the input and return the state for the recognizer
     * @method RotationRecognizer#process
     * @param {Object} input
     * @return {Const} State
     */
    process: function(input) {
        var state = this._state;
        var eventType = input.eventType;

        var isRecognized = state & (this.constructor.STATE_BEGAN | this.constructor.STATE_CHANGED);
        var isValid = this.attrTest(input);

        // on cancel input and we've recognized before, return STATE_CANCELLED
        if (isRecognized && (eventType & Input.INPUT_CANCEL || !isValid)) {
            return state | this.constructor.STATE_CANCELLED;
        } else if (isRecognized || isValid) {
            if (eventType & Input.INPUT_END) {
                return state | this.constructor.STATE_ENDED;
            } else if (!(state & this.constructor.STATE_BEGAN)) {
                return this.constructor.STATE_BEGAN;
            }
            return state | this.constructor.STATE_CHANGED;
        }
        return this.constructor.STATE_FAILED;
    },

    attrTest: function(input) {
        return (this._options.pointers === 0 || input.pointers.length === this._options.pointers) &&
            (Math.abs(input.rotation) > this._options.threshold || this._state & this.constructor.STATE_BEGAN);
    }
}, module);

});