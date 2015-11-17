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
var EventEmitter = require("../../eventemitter");
var Input = require("./input");
var TouchInput = require("./touchinput");
var GestureRecognizer = require("./gesturerecognizer");
var GestureEvent = require("../event/gestureevent");

Class.define("framework.ui.gesture.GestureManager", EventEmitter, {
    initialize: function(view) {
        this.super.initialize();

        this._handlers = {};
        this._session = {};
        this._recognizers = [];

        this._view = view;
        this._input = this.createInput();
    },

    destroy: function() {
        this._handlers = null;
        this._session = null;
        this._input.destroy();
        this._input = null;
        this._view = null;

        this.super.destroy();
    },

    static: {
        STOP: 1,
        FORCED_STOP: 2
    },

    get view() {
        return this._view;
    },

    get session() {
        return this._session;
    },

    set session(value) {
        this._session = value;
    },

    /**
     * Create new input type manager
     * called by the Manager constructor
     * @returns {Input}
     */
    createInput: function() {
        return new TouchInput(this);
        // if (SUPPORT_POINTER_EVENTS) {
        //     Type = PointerEventInput;
        // } else if (SUPPORT_ONLY_TOUCH) {
        //     Type = TouchInput;
        // } else if (!SUPPORT_TOUCH) {
        //     Type = MouseInput;
        // } else {
        //     Type = TouchMouseInput;
        // }
        // return new (Type)(manager, inputHandler);
    },

    /**
     * Add a recognizer to the manager
     * @param {Recognizer} recognizer
     */
    add: function(recognizer) {
        this._recognizers.push(recognizer);
        recognizer.manager = this;
    },

    /**
     * Remove a recognizer from the manager
     * @param {Recognizer} recognizer
     */
    remove: function(recognizer) {
        var index = this._recognizers.indexOf(recognizer);
        if (index === -1) {
            return;
        }

        this._recognizers.splice(index, 1);
        recognizer.manager = null;
    },

    /**
     * emit event to the listeners
     * @param {String} event
     * @param {Object} data
     */
    emit: function(event, data) {
        var windowManager = this._view.getWindow().windowManager;

        var direction = null;
        if (data.direction === Input.DIRECTION_DOWN) {
            direction = "down";
        } else if (data.direction === Input.DIRECTION_UP) {
            direction = "up";
        } else if (data.direction === Input.DIRECTION_LEFT) {
            direction = "left";
        } else if (data.direction === Input.DIRECTION_RIGHT) {
            direction = "right";
        }

        var offsetDirection = null;
        if (data.offsetDirection === Input.DIRECTION_DOWN) {
            offsetDirection = "down";
        } else if (data.offsetDirection === Input.DIRECTION_UP) {
            offsetDirection = "up";
        } else if (data.offsetDirection === Input.DIRECTION_LEFT) {
            offsetDirection = "left";
        } else if (data.offsetDirection === Input.DIRECTION_RIGHT) {
            offsetDirection = "right";
        }

        var gestureEvent = new GestureEvent({
            type: event,
            timestamp: new Date().getTime(),
            target: this._view,
            deltaX: data.deltaX,
            deltaY: data.deltaY,
            deltaTime: data.deltaTime,
            distance: data.distance,
            angle: data.angle,
            velocityX: data.velocityX,
            velocityY: data.velocityY,
            velocity: data.velocity,
            direction: direction,
            offsetDirection: offsetDirection,
            scale: data.scale,
            rotation: data.rotation,
            center: data.center,
            srcEvent: data.srcEvent,
            pointerType: data.pointerType,
            pointers: data.pointers,
            changedPointers: data.changedPointers
        });
        windowManager.chainedDispatchEvent(this._view, gestureEvent);
    },

    /**
     * stop recognizing for this session.
     * This session will be discarded, when a new [input]start event is fired.
     * When forced, the recognizer cycle is stopped immediately.
     * @param {Boolean} [force]
     */
    stop: function(force) {
        this._session.stopped = force ? this.constructor.FORCED_STOP : this.constructor.STOP;
    },

    /**
     * run the recognizers!
     * called by the inputHandler function on every movement of the pointers (touches)
     * it walks through all the recognizers and tries to detect the gesture that is being made
     * @param {Object} inputData
     */
    recognize: function(inputData) {
        var session = this._session;
        if (session.stopped) {
            return;
        }

        // this holds the recognizer that is being recognized.
        // so the recognizer's state needs to be BEGAN, CHANGED, ENDED or RECOGNIZED
        // if no recognizer is detecting a thing, it is set to `null`
        var curRecognizer = session.curRecognizer;

        // reset when the last recognizer is recognized
        // or when we're in a new session
        if (!curRecognizer || curRecognizer && curRecognizer.state & GestureRecognizer.STATE_RECOGNIZED) {
            curRecognizer = session.curRecognizer = null;
        }

        var i = 0;
        while (i < this._recognizers.length) {
            var recognizer = this._recognizers[i];

            // find out if we are allowed try to recognize the input for this one.
            // 1.   allow if the session is NOT forced stopped (see the .stop() method)
            // 2.   allow if we still haven't recognized a gesture in this session, or the this recognizer is the one
            //      that is being recognized.
            // 3.   allow if the recognizer is allowed to run simultaneous with the current recognized recognizer.
            //      this can be setup with the `recognizeWith()` method on the recognizer.
            if (session.stopped !== this.constructor.FORCED_STOP && ( // 1
                    !curRecognizer || recognizer === curRecognizer || // 2
                    recognizer.canRecognizeWith(curRecognizer))) { // 3
                recognizer.recognize(inputData);
            } else {
                recognizer.reset();
            }

            // if the recognizer has been recognizing the input as a valid gesture, we want to store this one as the
            // current active recognizer. but only if we don't already have an active recognizer
            if (!curRecognizer && recognizer.state & (GestureRecognizer.STATE_BEGAN | GestureRecognizer.STATE_CHANGED | GestureRecognizer.STATE_ENDED)) {
                curRecognizer = session.curRecognizer = recognizer;
            }
            i++;
        }
    }
}, module);
