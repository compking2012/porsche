"use strict";
var Class = require("../../class");
var GestureRecognizer = require("./gesturerecognizer");
var Input = require("./input");

/**
 * Tap Recognizer, recognized when the pointer is doing a small tap/click. Multiple taps are recognized if they occur
 * between the given interval and position. The delay option can be used to recognize multi-taps without firing
 * a single tap.
 * @class TapRecognizer
 * @extends GestureRecognizer
 */
Class.define("{Framework}.ui.gesture.TapRecognizer", GestureRecognizer, {
    /**
     * The eventData from the emitted event contains the property `tapCount`, which contains the amount of
     * multi-taps being recognized.
     * @constructor
     */
    initialize: function(/*options*/) {
        GestureRecognizer.prototype.initialize.apply(this, arguments);

        // previous time and center,
        // used for tap counting
        this._pTime = false;
        this._pCenter = false;

        this._timer = null;
        this._input = null;
        this._count = 0;
    },

    destroy: function() {
        this.reset();
        this._timer = null;
        this._input = null;

        GestureRecognizer.prototype.destroy.apply(this, arguments);
    },

    static: {
        defaults: {
            event: "tap",
            pointers: 1,
            taps: 1,
            interval: 300, // max time between the multi-tap taps
            time: 250, // max time of the pointer to be down (like finger on the screen)
            threshold: 20, // a minimal movement is ok, but keep it low
            posThreshold: 10 // a multi-tap can be a bit off the initial position
        }
    },

    process: function(input) {
        var validPointers = input.pointers.length === this._options.pointers;
        var validMovement = input.distance < this._options.threshold;
        var validTouchTime = input.deltaTime < this._options.time;

        this.reset();

        if (input.eventType & Input.INPUT_START && this._count === 0) {
            return this.failTimeout();
        }

        // we only allow little movement
        // and we've reached an end event, so a tap is possible
        if (validMovement && validTouchTime && validPointers) {
            if (input.eventType !== Input.INPUT_END) {
                return this.failTimeout();
            }

            var validInterval = this._pTime ? input.timeStamp - this._pTime < this._options.interval : true;
            var validMultiTap = !this._pCenter || this.getDistance(this._pCenter, input.center) < this._options.posThreshold;

            this._pTime = input.timeStamp;
            this._pCenter = input.center;

            if (!validMultiTap || !validInterval) {
                this._count = 1;
            } else {
                this._count += 1;
            }

            this._input = input;

            // if tap count matches we have recognized it,
            // else it has began recognizing...
            var tapCount = this._count % this._options.taps;
            if (tapCount === 0) {
                // no failing requirements, immediately trigger the tap event
                // or wait as long as the multitap interval to trigger
                if (!this.hasRequireFailures()) {
                    return this.constructor.STATE_RECOGNIZED;
                } else {
                    this._timer = setTimeout(function() {
                        this._state = this.constructor.STATE_RECOGNIZED;
                        this.tryEmit(this._input);
                    }.bind(this), this._options.interval);
                    return this.constructor.STATE_BEGAN;
                }
            }
        }
        return this.constructor.STATE_FAILED;
    },

    failTimeout: function() {
        this._timer = setTimeout(function() {
            this._state = this.constructor.STATE_FAILED;
        }.bind(this), this._options.interval);
        return this.constructor.STATE_FAILED;
    },

    reset: function() {
        clearTimeout(this._timer);
    },

    emit: function(input) {
        if (this._state === this.constructor.STATE_RECOGNIZED) {
            input.tapCount = this._count;
            this._manager.emit(this._options.event, input);
        }
    },

    /**
     * Calculate the absolute distance between two points
     * @param {Object} p1 {x, y}
     * @param {Object} p2 {x, y}
     * @return {Number} distance
     */
    getDistance: function(p1, p2) {
        var x = p2.x - p1.x,
            y = p2.y - p1.y;

        return Math.sqrt(x * x + y * y);
    }
}, module);
