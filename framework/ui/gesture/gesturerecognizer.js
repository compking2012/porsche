"use strict";
var Class = require("../../class");
var EventEmitter = require("../../eventemitter");
var Input = require("./input");
var Util = require("./util");

/**
 * GestureRecognizer
 * Every recognizer needs to extend from this class.
 */
Class.define("framework.ui.gesture.GestureRecognizer", EventEmitter, {
    /**
     * @constructor
     * @param {Object} options
     */
    initialize: function(options) {
        EventEmitter.prototype.initialize.apply(this, arguments);

        // make sure, options are copied over to a new object to prevent leaking it outside
        this._options = Util.merge(Util.extend({}, options || {}), this.constructor.defaults);
        // default is enable true
        this._options.enable = Util.ifUndefined(this._options.enable, true);

        this._id = Util.uniqueId();
        this._manager = null;
        this._state = this.constructor.STATE_POSSIBLE;
        this._simultaneous = {};
        this._requireFail = [];
    },

    destroy: function() {
        this._manager = null;
        this._options = null;
        this._simultaneous = null;
        this._requireFail = null;

        EventEmitter.prototype.destroy.apply(this, arguments);
    },

    static: {
        /**
         * @virtual
         * @type {Object}
         */
        defaults: {},

        STATE_POSSIBLE: 1,
        STATE_BEGAN: 2,
        STATE_CHANGED: 4,
        STATE_ENDED: 8,
        STATE_RECOGNIZED: 8,
        STATE_CANCELLED: 16,
        STATE_FAILED: 32
    },

    set manager(value) {
        this._manager = value;
    },

    get options() {
        return this._options;
    },

    /**
     * Set options
     * @param {Object} options
     */
    set: function(options) {
        Util.extend(this._options, options);
    },

    /**
     * Recognize simultaneous with an other gesture recognizer.
     * @param {GestureRecognizer} otherRecognizer
     */
    recognizeWith: function(otherRecognizer) {
        if (!this._simultaneous.hasOwnProperty[otherRecognizer.id]) {
            this._simultaneous[otherRecognizer.id] = otherRecognizer;
            otherRecognizer.recognizeWith(this);
        }
    },

    /**
     * Drop the simultaneous link. it doesnt remove the link on the other gesture recognizer.
     * @param {GestureRecognizer} otherRecognizer
     */
    dropRecognizeWith: function(otherRecognizer) {
        delete this._simultaneous[otherRecognizer.id];
    },

    /**
     * Gesture Recognizer can only run when an other is failing
     * @param {GestireRecognizer} otherRecognizer
     */
    requireFailure: function(otherRecognizer) {
        if (Util.inArray(this._requireFail, otherRecognizer) === -1) {
            this._requireFail.push(otherRecognizer);
            otherRecognizer.requireFailure(this);
        }
    },

    /**
     * Drop the requireFailure link. it does not remove the link on the other recognizer.
     * @param {Recognizer} otherRecognizer
     */
    dropRequireFailure: function(otherRecognizer) {
        var index = Util.inArray(this._requireFail, otherRecognizer);
        if (index > -1) {
            this._requireFail.splice(index, 1);
        }
    },

    /**
     * Whether has require failures boolean
     * @returns {Boolean}
     */
    hasRequireFailures: function() {
        return this._requireFail.length > 0;
    },

    /**
     * If the gesture recognizer can recognize simultaneous with an other gesture recognizer
     * @param {Recognizer} otherRecognizer
     * @returns {Boolean}
     */
    canRecognizeWith: function(otherRecognizer) {
        return this._simultaneous.hasOwnProperty(otherRecognizer.id);
    },

    /**
     * You should use "tryEmit" instead of "emit" directly to check
     * that all the needed recognizers has failed before emitting.
     * @param {Object} input
     */
    emit: function(input) {
        // panstart and panmove
        if (this._state < this.constructor.STATE_ENDED) {
            this._manager.emit(this._options.event + this.stateStr(this._state), input);
        }

        this._manager.emit(this._options.event, input); // simple eventName events

        if (input.additionalEvent) { // additional event(panleft, panright, pinchin, pinchout...)
            this._manager.emit(input.additionalEvent, input);
        }

        // panend and pancancel
        if (this._state >= this.constructor.STATE_ENDED) {
            this._manager.emit(this._options.event + this.stateStr(this._state), input);
        }
    },

    /**
     * Check that all the require failure recognizers has failed,
     * if true, it emits a gesture event,
     * otherwise, setup the state to FAILED.
     * @param {Object} input
     */
    tryEmit: function(input) {
        if (this.canEmit()) {
            return this.emit(input);
        }
        // it's failing anyway
        this._state = this.constructor.STATE_FAILED;
    },

    /**
     * Can we emit?
     * @returns {Boolean}
     */
    canEmit: function() {
        var i = 0;
        while (i < this._requireFail.length) {
            if (!(this._requireFail[i].state & (this.constructor.STATE_FAILED | this.constructor.STATE_POSSIBLE))) {
                return false;
            }
            i++;
        }
        return true;
    },

    /**
     * get a usable string, used as event postfix
     * @param {Const} state
     * @returns {String} state
     */
    stateStr: function(state) {
        if (state & this.constructor.STATE_CANCELLED) {
            return "cancel";
        } else if (state & this.constructor.STATE_ENDED) {
            return "end";
        } else if (state & this.constructor.STATE_CHANGED) {
            return "move";
        } else if (state & this.constructor.STATE_BEGAN) {
            return "start";
        }
        return "";
    },

    /**
     * direction cons to string
     * @param {Const} direction
     * @returns {String}
     */
    directionStr: function(direction) {
        if (direction === Input.DIRECTION_DOWN) {
            return "down";
        } else if (direction === Input.DIRECTION_UP) {
            return "up";
        } else if (direction === Input.DIRECTION_LEFT) {
            return "left";
        } else if (direction === Input.DIRECTION_RIGHT) {
            return "right";
        }
        return "";
    },

    /**
     * Update the recognizer
     * @param {Object} inputData
     */
    recognize: function(inputData) {
        // make a new copy of the inputData
        // so we can change the inputData without messing up the other recognizers
        var inputDataClone = Util.extend({}, inputData);

        // is is enabled and allow recognizing?
        if (!Util.boolOrFn(this._options.enable, [this, inputDataClone])) {
            this.reset();
            this._state = this.constructor.STATE_FAILED;
            return;
        }

        // reset when we've reached the end
        if (this._state & (this.constructor.STATE_RECOGNIZED | this.constructor.STATE_CANCELLED | this.constructor.STATE_FAILED)) {
            this._state = this.constructor.STATE_POSSIBLE;
        }

        this._state = this.process(inputDataClone);

        // the recognizer has recognized a gesture
        // so trigger an event
        if (this._state & (this.constructor.STATE_BEGAN | this.constructor.STATE_CHANGED | this.constructor.STATE_ENDED | this.constructor.STATE_CANCELLED)) {
            this.tryEmit(inputDataClone);
        }
    },

    /**
     * Implement this to return the state of the recognizer
     * the actual recognizing happens in this method
     * @override
     * @param {Object} inputData
     * @return {Const} STATE
     */
    process: function(/*input*/) {
        // TO BE IMPLEMENTED
    },

    /**
     * Implement this to be called when the gesture isn't allowed to recognize
     * like when another is being recognized or it is disabled
     * @abstract
     */
    reset: function() {
        // TO BE IMPLEMENTED
    }
}, module);
