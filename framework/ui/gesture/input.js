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

/**
 * @class Input
 * @extends {EventEmitter}
 */
Class.define("framework.ui.gesture.Input", EventEmitter, {
    /**
     * Constructor
     * @method Input#initialize
     * @param {Manager} manager
     */
    initialize: function(manager) {
        EventEmitter.prototype.initialize.apply(this, arguments);

        this._manager = manager;
    },

    destroy: function() {
        this._manager = null;

        EventEmitter.prototype.destroy.apply(this, arguments);
    },

    static: {
        COMPUTE_INTERVAL: 25,

        DIRECTION_NONE: 1,
        DIRECTION_LEFT: 2,
        DIRECTION_RIGHT: 4,
        DIRECTION_UP: 8,
        DIRECTION_DOWN: 16,
        DIRECTION_HORIZONTAL: 2 | 4,
        DIRECTION_VERTICAL: 8 | 16,
        DIRECTION_ALL: 2 | 4 | 8 | 16,

        INPUT_TYPE_TOUCH: "touch",
        INPUT_TYPE_MOUSE: "mouse",
        INPUT_TYPE_PEN: "pen",

        INPUT_START: 1,
        INPUT_MOVE: 2,
        INPUT_END: 4,
        INPUT_CANCEL: 8,

        PROPS_XY: ["x", "y"],
        PROPS_CLIENT_XY: ["clientX", "clientY"]
    },

    /**
     * Handle input events
     * @method Input#handleInputEvent
     * @param {String} eventType
     * @param {Object} input
     */
    handleInputEvent: function(eventType, input) {
        var pointersLen = input.pointers.length;
        var changedPointersLen = input.changedPointers.length;
        var isFirst = eventType & this.constructor.INPUT_START && pointersLen === changedPointersLen;
        var isFinal = eventType & (this.constructor.INPUT_END | this.constructor.INPUT_CANCEL) && pointersLen === changedPointersLen;

        input.isFirst = Boolean(isFirst);
        input.isFinal = Boolean(isFinal);

        if (input.isFirst) {
            this._manager.session = {};
        }

        // source event is the normalized value of the domEvents
        // like 'touchstart, mouseup, pointerdown'
        input.eventType = eventType;

        // compute scale, rotation etc
        this.computeInputData(input);

        this._manager.recognize(input);
        this._manager.session.prevInput = input;
    },

    /**
     * Extend the data with some usable properties like scale, rotate, velocity etc
     * @method Input#computeInputData
     * @param {Object} input
     */
    computeInputData: function(input) {
        var session = this._manager.session;
        var pointers = input.pointers;
        var pointersLength = pointers.length;

        // store the first input to calculate the distance and direction
        if (!session.firstInput) {
            session.firstInput = this.simpleCloneInputData(input);
        }

        // to compute scale and rotation we need to store the multiple touches
        if (pointersLength > 1 && !session.firstMultiple) {
            session.firstMultiple = this.simpleCloneInputData(input);
        } else if (pointersLength === 1) {
            session.firstMultiple = false;
        }

        var firstInput = session.firstInput;
        var firstMultiple = session.firstMultiple;
        var offsetCenter = firstMultiple ? firstMultiple.center : firstInput.center;

        var center = input.center = this.getCenter(pointers);
        input.timeStamp = Date.now();
        input.deltaTime = input.timeStamp - firstInput.timeStamp;

        input.angle = this.getAngle(offsetCenter, center);
        input.distance = this.getDistance(offsetCenter, center);

        this.computeDeltaXY(session, input);
        input.offsetDirection = this.getDirection(input.deltaX, input.deltaY);

        var overallVelocity = this.getVelocity(input.deltaTime, input.deltaX, input.deltaY);
        input.overallVelocityX = overallVelocity.x;
        input.overallVelocityY = overallVelocity.y;
        input.overallVelocity = Math.abs(overallVelocity.x) > Math.abs(overallVelocity.y) ? overallVelocity.x : overallVelocity.y;

        input.scale = firstMultiple ? this.getScale(firstMultiple.pointers, pointers) : 1;
        input.rotation = firstMultiple ? this.getRotation(firstMultiple.pointers, pointers) : 0;

        input.maxPointers = !session.prevInput ?
            input.pointers.length :
            input.pointers.length > session.prevInput.maxPointers ?
                input.pointers.length :
                session.prevInput.maxPointers;

        this.computeIntervalInputData(session, input);

        // find the correct target
        var target = this._manager.view;
        if (this.hasParent(input.srcEvent.target, target)) {
            target = input.srcEvent.target;
        }
        input.target = target;
    },

    /**
     * Create a simple clone from the input used for storage of firstInput and firstMultiple
     * @method Input#simpleCloneInputData
     * @param {Object} input
     * @return {Object} clonedInputData
     */
    simpleCloneInputData: function(input) {
        // make a simple copy of the pointers because we will get a reference if we don't
        // we only need clientXY for the calculations
        var pointers = [];
        var i = 0;
        while (i < input.pointers.length) {
            pointers[i] = {
                clientX: Math.round(input.pointers[i].clientX),
                clientY: Math.round(input.pointers[i].clientY)
            };
            i++;
        }

        return {
            timeStamp: Date.now(),
            pointers: pointers,
            center: this.getCenter(pointers),
            deltaX: input.deltaX,
            deltaY: input.deltaY
        };
    },

    computeDeltaXY: function(session, input) {
        var center = input.center;
        var offset = session.offsetDelta || {};
        var prevDelta = session.prevDelta || {};
        var prevInput = session.prevInput || {};

        if (input.eventType === this.constructor.INPUT_START || prevInput.eventType === this.constructor.INPUT_END) {
            prevDelta = session.prevDelta = {
                x: prevInput.deltaX || 0,
                y: prevInput.deltaY || 0
            };

            offset = session.offsetDelta = {
                x: center.x,
                y: center.y
            };
        }

        input.deltaX = prevDelta.x + center.x - offset.x;
        input.deltaY = prevDelta.y + center.y - offset.y;
    },

    /**
     * Velocity is calculated every x ms
     * @method Input#computeIntervalInputData
     * @param {Object} session
     * @param {Object} input
     */
    computeIntervalInputData: function(session, input) {
        var last = session.lastInterval || input,
            deltaTime = input.timeStamp - last.timeStamp,
            velocity, velocityX, velocityY, direction;

        if (input.eventType !== this.constructor.INPUT_CANCEL && (deltaTime > this.constructor.COMPUTE_INTERVAL || last.velocity === undefined)) {
            var deltaX = input.deltaX - last.deltaX;
            var deltaY = input.deltaY - last.deltaY;

            var v = this.getVelocity(deltaTime, deltaX, deltaY);
            velocityX = v.x;
            velocityY = v.y;
            velocity = Math.abs(v.x) > Math.abs(v.y) ? v.x : v.y;
            direction = this.getDirection(deltaX, deltaY);

            session.lastInterval = input;
        } else {
            // use latest velocity info if it doesn't overtake a minimum period
            velocity = last.velocity;
            velocityX = last.velocityX;
            velocityY = last.velocityY;
            direction = last.direction;
        }

        input.velocity = velocity;
        input.velocityX = velocityX;
        input.velocityY = velocityY;
        input.direction = direction;
    },

    /**
     * Get the center of all the pointers
     * @method Input#getCenter
     * @param {Array} pointers
     * @return {Object} center contains `x` and `y` properties
     */
    getCenter: function(pointers) {
        var pointersLength = pointers.length;

        // no need to loop when only one touch
        if (pointersLength === 1) {
            return {
                x: Math.round(pointers[0].clientX),
                y: Math.round(pointers[0].clientY)
            };
        }

        var x = 0;
        var y = 0;
        var i = 0;
        while (i < pointersLength) {
            x += pointers[i].clientX;
            y += pointers[i].clientY;
            i++;
        }

        return {
            x: Math.round(x / pointersLength),
            y: Math.round(y / pointersLength)
        };
    },

    /**
     * Calculate the velocity between two points. unit is in px per ms.
     * @method Input#getVelocity
     * @param {Number} deltaTime
     * @param {Number} x
     * @param {Number} y
     * @return {Object} velocity `x` and `y`
     */
    getVelocity: function(deltaTime, x, y) {
        return {
            x: x / deltaTime || 0,
            y: y / deltaTime || 0
        };
    },

    /**
     * Get the direction between two points
     * @method Input#getDirection
     * @param {Number} x
     * @param {Number} y
     * @return {Number} direction
     */
    getDirection: function(x, y) {
        if (x === y) {
            return this.constructor.DIRECTION_NONE;
        }

        if (Math.abs(x) >= Math.abs(y)) {
            return x < 0 ? this.constructor.DIRECTION_LEFT : this.constructor.DIRECTION_RIGHT;
        }
        return y < 0 ? this.constructor.DIRECTION_UP : this.constructor.DIRECTION_DOWN;
    },

    /**
     * Calculate the absolute distance between two points
     * @method Input#getDistance
     * @param {Object} p1 {x, y}
     * @param {Object} p2 {x, y}
     * @param {Array} [props] containing x and y keys
     * @return {Number} distance
     */
    getDistance: function(p1, p2, props) {
        if (!props) {
            props = this.constructor.PROPS_XY;
        }
        var x = p2[props[0]] - p1[props[0]],
            y = p2[props[1]] - p1[props[1]];

        return Math.sqrt(x * x + y * y);
    },

    /**
     * Calculate the angle between two coordinates
     * @method Input#getAngle
     * @param {Object} p1
     * @param {Object} p2
     * @param {Array} [props] containing x and y keys
     * @return {Number} angle
     */
    getAngle: function(p1, p2, props) {
        if (!props) {
            props = this.constructor.PROPS_XY;
        }
        var x = p2[props[0]] - p1[props[0]],
            y = p2[props[1]] - p1[props[1]];
        return Math.atan2(y, x) * 180 / Math.PI;
    },

    /**
     * Calculate the rotation degrees between two pointersets
     * @method Input#getRotation
     * @param {Array} start array of pointers
     * @param {Array} end array of pointers
     * @return {Number} rotation
     */
    getRotation: function(start, end) {
        return this.getAngle(end[1], end[0], this.constructor.PROPS_CLIENT_XY) + this.getAngle(start[1], start[0], this.constructor.PROPS_CLIENT_XY);
    },

    /**
     * Calculate the scale factor between two pointersets
     * no scale is 1, and goes down to 0 when pinched together, and bigger when pinched out
     * @method Input#getScale
     * @param {Array} start array of pointers
     * @param {Array} end array of pointers
     * @return {Number} scale
     */
    getScale: function(start, end) {
        return this.getDistance(end[0], end[1], this.constructor.PROPS_CLIENT_XY) / this.getDistance(start[0], start[1], this.constructor.PROPS_CLIENT_XY);
    },

    /**
     * find if a view is in the given parent
     * @method Input#hasParent
     * @param {View} view
     * @param {View} parent
     * @return {Boolean} found
     */
    hasParent: function(view, parent) {
        while (view) {
            if (view === parent) {
                return true;
            }
            view = view.parent;
        }
        return false;
    }
}, module);
