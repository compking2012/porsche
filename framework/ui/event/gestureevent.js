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
var UIEvent = require("./uievent");

/**
 * Gesture Event
 * @class GestureEvent
 * @extends UIEvent
 */
Class.define("framework.ui.event.GestureEvent", UIEvent, {
    /**
     * Constructor
     * @method GestureEvent#initialize
     */
    initialize: function(options) {
        this.super.initialize.call(this, options);

        this._deltaX = options.deltaX;
        this._deltaY = options.deltaY;
        this._deltaTime = options.deltaTime;
        this._distance = options.distance;
        this._angle = options.angle;
        this._velocityX = options.velocityX;
        this._velocityY = options.velocityY;
        this._velocity = options.velocity;
        this._direction = options.direction;
        this._offsetDirection = options.offsetDirection;
        this._scale = options.scale;
        this._rotation = options.rotation;
        this._center = options.center;
        this._srcEvent = options.srcEvent;
        this._pointerType = options.pointerType;
        this._pointers = options.pointers;
        this._changedPointers = options.changedPointers;
    },

    destroy: function() {
        this._deltaX = 0;
        this._deltaY = 0;
        this._deltaTime = 0;
        this._distance = 0;
        this._angle = 0;
        this._velocityX = 0;
        this._velocityY = 0;
        this._velocity = 0;
        this._direction = null;
        this._offsetDirection = null;
        this._scale = 0;
        this._rotation = 0;
        this._center = null;
        this._srcEvent = null;
        this._pointerType = null;
        this._changedPointers = null;
        this._pointers = null;

        this.super.destroy.call(this);
    },

    /**
     * @name GestureEvent#deltaX
     * @description Movement of the X axis.
     * @type {Number}
     * @readonly
     */
    get deltaX() {
        return this._deltaX;
    },

    /**
     * @name GestureEvent#deltaY
     * @description Movement of the Y axis.
     * @type {Number}
     * @readonly
     */
    get deltaY() {
        return this._deltaY;
    },

    /**
     * @name GestureEvent#deltaTime
     * @description Total time in ms since the first input, in millisecond.
     * @type {Number}
     * @readonly
     */
    get deltaTime() {
        return this._deltaTime;
    },

    /**
     * @name GestureEvent#distance
     * @description Distance moved.
     * @type {Number}
     * @readonly
     */
    get distance() {
        return this._distance;
    },

    /**
     * @name GestureEvent#angle
     * @description Angle moved.
     * @type {Number}
     * @readonly
     */
    get angle() {
        return this._angle;
    },

    /**
     * @name GestureEvent#velocityX
     * @description Velocity on the X axis, in px/ms.
     * @type {Number}
     * @readonly
     */
    get velocityX() {
        return this._velocityX;
    },

    /**
     * @name GestureEvent#velocityX
     * @description Velocity on the X axis, in px/ms.
     * @type {Number}
     * @readonly
     */
    get velocityY() {
        return this._velocityY;
    },

    /**
     * @name GestureEvent#velocity
     * @description Highest velocityX/Y value.
     * @type {Number}
     * @readonly
     */
    get velocity() {
        return this._velocity;
    },

    /**
     * @name GestureEvent#direction
     * @description Direction moved, should be "left", "right", "up" or "down".
     * @type {String}
     * @readonly
     */
    get direction() {
        return this._direction;
    },

    /**
     * @name GestureEvent#direction
     * @description Direction moved, should be "left", "right", "up" or "down".
     * @type {String}
     * @readonly
     */
    get offsetDirection() {
        return this._offsetDirection;
    },

    /**
     * @name GestureEvent#scale
     * @description Scaling that has been done when multi-touch. 1 on a single touch.
     * @type {String}
     * @readonly
     */
    get scale() {
        return this._scale;
    },

    /**
     * @name GestureEvent#rotation
     * @description Rotation (in deg) that has been done when multi-touch. 0 on a single touch.
     * @type {String}
     * @readonly
     */
    get rotation() {
        return this._rotation;
    },

    /**
     * @name GestureEvent#center
     * @description Center position for multi-touch, or just the single pointer.
     * @type {String}
     * @readonly
     */
    get center() {
        return this._center;
    },

    /**
     * @name GestureEvent#srcEvent
     * @description Source input event object, currently only support TouchEvent.
     * @type {InputEvent}
     * @readonly
     */
    get srcEvent() {
        return this._srcEvent;
    },

    /**
     * @name GestureEvent#pointerType
     * @description Primary pointer type, currently only could be "touch".
     * @type {String}
     * @readonly
     */
    get pointerType() {
        return this._pointerType;
    },

    /**
     * @name GestureEvent#pointers
     * @description Array with all pointers, including the ended pointers.
     * @type {Array}
     * @readonly
     */
    get pointers() {
        return this._pointers;
    },

    /**
     * @name GestureEvent#changedPointers
     * @description Array with all new/moved/lost pointers.
     * @type {Array}
     * @readonly
     */
    get changedPointers() {
        return this._changedPointers;
    }
}, module);
