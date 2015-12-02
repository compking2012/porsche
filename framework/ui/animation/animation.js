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
var CubicBezier = require("./cubicbezier");

/**
 * Base class for animation.
 * Note that this class is never used to instantiate directly.
 * @class Animation
 * @extends EventEmitter
 */
Class.define("framework.ui.animation.Animation", EventEmitter, {
    /**
     * Constructor that create an animation.
     * @method Animation#initialize
     */
    initialize: function(view) {
        EventEmitter.prototype.initialize.apply(this, arguments);

        this._view = view;
        this._duration = 0;
        this._repeat = 0;
        this._easing = "ease";
        this._animating = false;
        this._paused = false;
    },

    /**
     * Destructor that destroy this animation.
     * @method Animation#destroy
     */
    destroy: function() {
        this._view = null;

        EventEmitter.prototype.destroy.apply(this, arguments);
    },

    /**
     * @name Animation#duration
     * @type {Number}
     * @description the duration of this animation, in milliseconds.
     */
    get duration() {
        return this._duration;
    },

    set duration(value) {
        this._duration = value;
    },

    /**
     * @name Animation#repeat
     * @type {Number|String}
     * @description the repeat count for this animation.
     * Note that 0 means just do this animation one time, 1 means do it twice,
     * and "infinite" means do this animation infinitely.
     * @default 0
     */
    get repeat() {
        return this._repeat;
    },

    set repeat(value) {
        this._repeat = value;
    },

    /**
     * @name Animation#easing
     * @type {CubicBezier}
     * @description the cubic bezier that will be used on this animation.
     */
    get easing() {
        return this._easing;
    },

    set easing(value) {
        this._easing = value;
    },

    /**
     * @name Animation#animating
     * @type {Boolean}
     * @description indicating whether it is in animating state.
     * @readonly
     */
    get animating() {
        return this._animating;
    },

    /**
     * @name Animation#paused
     * @type {Boolean}
     * @description indicating whether it is in paused state.
     * @readonly
     */
    get paused() {
        return this._paused;
    },

    /**
     * Starts this animation. If the animation has a nonzero delay,
     * the animation will start running after that delay elapses.
     * A non-delayed animation will have its initial value(s) set immediately.
     * @method Animation#start
     * @abstract
     */
    start: function() {
        // TO BE IMPLEMENTED
    },

    /**
     * Stops this animation. This causes the animation to assign the end value of the property being animated.
     * @method Animation#stop
     * @abstract
     */
    stop: function() {
        // TO BE IMPLEMENTED
    },

    /**
     * Pauses a running animation. This method should only be called on which the animation was started.
     * If the animation has not yet been started or has since ended, then the call is ignored.
     * @method Animation#pause
     * @abstract
     */
    pause: function() {
        // TO BE IMPLEMENTED
    },

    /**
     * Resumes a paused animation, causing the animation to pick up where it left off when it was paused.
     * This method should only be called on which the animation was paused.
     * @method Animation#resume
     * @abstract
     */
    resume: function() {
        // TO BE IMPLEMENTED
    },

    /**
     * Parse and get the cubic bezier
     * @method Animation#getCubicBezier
     * @private
     */
    getCubicBezier: function() {
        if (this._easing === "ease") {
            return CubicBezier.ease();
        } else if (this._easing === "linear") {
            return CubicBezier.linear();
        } else if (this._easing === "easeIn") {
            return CubicBezier.easeIn();
        } else if (this._easing === "easeOut") {
            return CubicBezier.easeOut();
        } else if (this._easing === "easeInOut") {
            return CubicBezier.easeInOut();
        } else {
            var group = this._easing.match(/cubic-bezier\(\s*([\d.]+),\s*([\d.]+),\s*([\d.]+),\s*([\d.]+)\s*\)/);
            return new CubicBezier(parseFloat(group[1]), parseFloat(group[2]), parseFloat(group[3]), parseFloat(group[4]));
        }
    }
}, module);
