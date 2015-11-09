"use strict";
var Class = require("../../class");
var GestureRecognizer = require("./gesturerecognizer");
var Input = require("./input");

/**
 * Long Press Recognizer, recognized when the pointer is down for x ms without any movement.
 * @class LongPressRecognizer
 * @extends GestureRecognizer
 */
Class.define("{Framework}.ui.gesture.LongPressRecognizer", GestureRecognizer, {
    /**
     * @constructor
     */
    initialize: function(/*options*/) {
        GestureRecognizer.prototype.initialize.apply(this, arguments);

        this._timer = null;
        this._input = null;
    },

    destroy: function() {
        this.reset();
        this._timer = null;
        this._input = null;

        GestureRecognizer.prototype.destroy.apply(this, arguments);
    },

    static: {
        defaults: {
            event: "longpress",
            pointers: 1,
            time: 500, // minimal time of the pointer to be pressed
            threshold: 5 // a minimal movement is ok, but keep it low
        }
    },

    process: function(input) {
        var validPointers = input.pointers.length === this._options.pointers;
        var validMovement = input.distance < this._options.threshold;
        var validTime = input.deltaTime > this._options.time;

        this._input = input;

        // we only allow little movement
        // and we've reached an end event, so a tap is possible
        if (!validMovement || !validPointers || (input.eventType & (Input.INPUT_END | Input.INPUT_CANCEL) && !validTime)) {
            this.reset();
        } else if (input.eventType & Input.INPUT_START) {
            this.reset();
            this._timer = setTimeout(function() {
                this._state = this.constructor.STATE_RECOGNIZED;
                this.tryEmit(this._input);
            }.bind(this), this._options.time);
        } else if (input.eventType & Input.INPUT_END) {
            return this.constructor.STATE_RECOGNIZED;
        }
        return this.constructor.STATE_FAILED;
    },

    reset: function() {
        clearTimeout(this._timer);
    },

    emit: function(input) {
        if (this._state !== this.constructor.STATE_RECOGNIZED) {
            return;
        }

        if (input && (input.eventType & Input.INPUT_END)) {
            this._manager.emit(this._options.event + "up", input);
        } else {
            this._input.timeStamp = Date.now();
            this._manager.emit(this._options.event, this._input);
        }
    }
}, module);
