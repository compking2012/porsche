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
 * Pinch, recognized when two or more pointers are moving toward (zoom-in) or away from each other (zoom-out).
 * @class PinchRecognizer
 * @extends GestureRecognizer
 */
Class.define("framework.ui.gesture.PinchRecognizer", GestureRecognizer, {
    /**
     * @constructor
     */
    initialize: function(/*options*/) {
        this.super.initialize();
    },

    destroy: function() {
        this.super.destroy();
    },

    static: {
        defaults: {
            event: "pinch",
            threshold: 0,
            pointers: 2
        }
    },

    /**
     * Process the input and return the state for the recognizer
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
            (Math.abs(input.scale - 1) > this._options.threshold || this._state & this.constructor.STATE_BEGAN);
    },

    emit: function(input) {
        if (input.scale !== 1) {
            var inOut = input.scale < 1 ? "in" : "out";
            input.additionalEvent = this._options.event + inOut;
        }
        this.super.emit.call(this, input);
    }

}, module);
