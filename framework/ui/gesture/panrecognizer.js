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
 * Pan Recognizer, recognized when the pointer is down and moved in the allowed direction.
 * @class PanRecognizer
 * @extends GestureRecognizer
 */
Class.define("framework.ui.gesture.PanRecognizer", GestureRecognizer, {
    /**
     * Constructor
     * @method PanRecognizer#initialize
     */
    initialize: function(/*options*/) {
        GestureRecognizer.prototype.initialize.apply(this, arguments);

        this._pX = null;
        this._pY = null;
    },

    destroy: function() {
        GestureRecognizer.prototype.destroy.apply(this, arguments);
    },

    static: {
        defaults: {
            event: "pan",
            threshold: 10,
            pointers: 1,
            direction: Input.DIRECTION_ALL
        }
    },

    /**
     * Process the input and return the state for the recognizer
     * @method PanRecognizer#process
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

    directionTest: function(input) {
        var options = this._options;
        var hasMoved = true;
        var distance = input.distance;
        var direction = input.direction;
        var x = input.deltaX;
        var y = input.deltaY;

        // lock to axis?
        if (!(direction & options.direction)) {
            if (options.direction & Input.DIRECTION_HORIZONTAL) {
                direction = x === 0 ? Input.DIRECTION_NONE : x < 0 ? Input.DIRECTION_LEFT : Input.DIRECTION_RIGHT;
                hasMoved = x !== this._pX;
                distance = Math.abs(input.deltaX);
            } else {
                direction = y === 0 ? Input.DIRECTION_NONE : y < 0 ? Input.DIRECTION_UP : Input.DIRECTION_DOWN;
                hasMoved = y !== this._pY;
                distance = Math.abs(input.deltaY);
            }
        }
        input.direction = direction;
        return hasMoved && distance > options.threshold && direction & options.direction;
    },

    attrTest: function(input) {
        return (this._options.pointers === 0 || input.pointers.length === this._options.pointers) &&
            (this._state & this.constructor.STATE_BEGAN || !(this._state & this.constructor.STATE_BEGAN) && this.directionTest(input));
    },

    emit: function(input) {
        this._pX = input.deltaX;
        this._pY = input.deltaY;

        var direction = this.directionStr(input.direction);
        if (direction) {
            input.additionalEvent = this._options.event + direction;
        }
        GestureRecognizer.prototype.emit.call(this, input);
    }
}, module);

});