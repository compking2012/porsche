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
 * Swipe, recognized when the pointer is moving fast (velocity), with enough distance in the allowed direction.
 * @class SwipeRecognizer
 * @extends GestureRecognizer
 */
Class.define("framework.ui.gesture.SwipeRecognizer", GestureRecognizer, {
    /**
     * Constructor
     * @method SwipeRecognizer#initialize
     */
    initialize: function(/*options*/) {
        GestureRecognizer.prototype.initialize.apply(this, arguments);
    },

    destroy: function() {
        GestureRecognizer.prototype.destroy.apply(this, arguments);
    },

    static: {
        defaults: {
            event: "swipe",
            threshold: 10,
            velocity: 0.65,
            direction: 2 | 4 | 8 | 16,
            pointers: 1
        }
    },

    /**
     * Process the input and return the state for the recognizer
     * @method SwipeRecognizer#process
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

    /**
     * Used to check if it the recognizer receives valid input, like input.distance > 10.
     * @method SwipeRecognizer#attrTest
     * @param {Object} input
     * @return {Boolean} recognized
     * @private
     */
    attrTest: function(input) {
        var direction = this._options.direction;
        var velocity;

        if (direction & (Input.DIRECTION_HORIZONTAL | Input.DIRECTION_VERTICAL)) {
            velocity = input.overallVelocity;
        } else if (direction & Input.DIRECTION_HORIZONTAL) {
            velocity = input.overallVelocityX;
        } else if (direction & Input.DIRECTION_VERTICAL) {
            velocity = input.overallVelocityY;
        }

        return (this._options.pointers === 0 || input.pointers.length === this._options.pointers) &&
            direction & input.offsetDirection &&
            input.distance > this._options.threshold &&
            input.maxPointers === this._options.pointers &&
            Math.abs(velocity) > this._options.velocity && input.eventType & Input.INPUT_END;
    },

    emit: function(input) {
        var direction = this.directionStr(input.offsetDirection);
        if (direction) {
            this._manager.emit(this._options.event + direction, input);
        }

        this._manager.emit(this._options.event, input);
    }
}, module);
