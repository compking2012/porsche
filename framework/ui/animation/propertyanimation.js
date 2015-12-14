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
var Animation = require("./animation");
var CubicBezier = require("./cubicbezier");
var SharedTimer = require("./sharedtimer");

/**
 * Property animation that can be applied on any views to animate its animatable properties.
 * Note that animatable properties include the position (left, right, top and bottom),
 * size (width and height), transform (translation, rotation, scale and origin) and colors.
 * @class PropertyAnimation
 * @extends Animation
 */
Class.define("framework.ui.animation.PropertyAnimation", Animation, {
    /**
     * Constructor that create a property animation.
     * @method PropertyAnimation#initialize
     */
    initialize: function(/*view*/) {
        Animation.prototype.initialize.apply(this, arguments);

        this._from = {};
        this._to = {};
        this._beziers = CubicBezier.ease();
        this._timer = SharedTimer.getInstance();
        this._iteration = 0;
        this._animators = [];
        this._startTime = 0;
        this._currentTime = 0;
        this._onTimerFunc = null;
    },

    /**
     * Destructor that destroy this property animation.
     * @method PropertyAnimation#destroy
     */
    destroy: function() {
        this.stop();
        this._from = null;
        this._to = null;
        this._beziers.destroy();
        this._beziers = null;
        this._timer.destroy();
        this._timer = null;
        this._animators = null;

        Animation.prototype.destroy.apply(this, arguments);
    },


    /**
     * @name PropertyAnimation#from
     * @type {Object}
     * @description the initial values at the animation start.
     */
    get from() {
        return this._from;
    },

    set from(value) {
        this._from = value;
    },

    /**
     * @name PropertyAnimation#to
     * @type {Object}
     * @description the end values at the animation stop.
     */
    get to() {
        return this._to;
    },

    set to(value) {
        this._to = value;
    },

    /**
     * Starts this animation. If the animation has a nonzero delay,
     * the animation will start running after that delay elapses.
     * A non-delayed animation will have its initial value(s) set immediately.
     * @method PropertyAnimation#start
     * @protected
     * @override
     */
    start: function() {
        if (this._currentTime === 0) {
            this._beziers = this.getCubicBezier();
            this._animators = [];
            for (var key in this._from) {
                if (this._from.hasOwnProperty(key) && this._to.hasOwnProperty(key)) {
                    this._animators.push({
                        key: key,
                        from: this._from[key],
                        to: this._to[key],
                        current: 0
                    });
                }
            }
        }

        var length = this._animators.length;
        for (var i = 0; i < length; i++) {
            var animator = this._animators[i];
            this._view[animator.key] = this._currentTime === 0 ? animator.from : animator.current;
        }

        this._animating = true;

        this._startTime = new Date().getTime();
        var remainTime = this._duration - this._currentTime;
        this._timer.addTimer(this._onTimerFunc = function() {
            var time = new Date().getTime() - this._startTime;
            this._currentTime = time;
            if (time >= remainTime) {
                this.animate(0, this._duration);
                this._iteration++;
                if (this._repeat === "infinite") {
                    this._startTime = new Date().getTime();
                    remainTime = this._duration;
                    this.dispatchEvent("iteration", this._iteration);
                } else {
                    if (this._iteration <= this._repeat) {
                        this._startTime = new Date().getTime();
                        remainTime = this._duration;
                        this.dispatchEvent("iteration", this._iteration);
                    } else {
                        this.stop();
                        this.dispatchEvent("complete");
                    }
                }
                return;
            }
            this.animate(0, time);
        }.bind(this), 16);
    },

    /**
     * Stops this animation. This causes the animation to assign the end value of the property being animated.
     * @method PropertyAnimation#stop
     * @protected
     * @override
     */
    stop: function() {
        if (this._onTimerFunc !== undefined) {
            this._timer.removeTimer(this._onTimerFunc);
        }
        this._animators = [];
        this._currentTime = 0;
        this._startTime = 0;
        this._animating = false;
    },

    /**
     * Pauses a running animation. This method should only be called on which the animation was started.
     * If the animation has not yet been started or has since ended, then the call is ignored.
     * @method PropertyAnimation#pause
     * @protected
     * @override
     */
    pause: function() {
        if (this._onTimerFunc !== undefined) {
            this._timer.removeTimer(this._onTimerFunc);
        }
        this._animating = false;
        this._paused = true;
    },

    /**
     * Resumes a paused animation, causing the animation to pick up where it left off when it was paused.
     * This method should only be called on which the animation was paused.
     * @method PropertyAnimation#resume
     * @protected
     * @override
     */
    resume: function() {
        this._paused = false;
        this.start();
    },

    /**
     * Do the animation.
     * @method Animation#animate
     * @param {Number} startTime - the start time, in milliseconds.
     * @param {Number} endTime - the end time, in milliseconds.
     * @private
     */
    animate: function(startTime, endTime) {
        var delta = this._beziers.getPointForT((endTime - startTime) / this._duration).y;
        var length = this._animators.length;
        for (var i = 0; i < length; i++) {
            var animator = this._animators[i];
            var key = animator.key;
            var from = animator.from;
            var to = animator.to;
            if (typeof from === "string") {
                from = from.toLowerCase();
            }
            if (typeof to === "string") {
                to = to.toLowerCase();
            }
            if (typeof from === "number" && typeof to === "number") {
                var offset = from + delta * (to - from);
                this._view[key] = offset;
                animator.current = offset;
            } else if (/^[rgb|rgba|#]/.test(from) && /^[rgb|rgba|#]/.test(to)) {
                var fromColor = this.getColor(from);
                var toColor = this.getColor(to);
                var offset = "rgb(" + parseInt(fromColor.r + delta * (toColor.r - fromColor.r)) + "," +
                    parseInt(fromColor.g + delta * (toColor.g - fromColor.g)) + "," +
                    parseInt(fromColor.b + delta * (toColor.b - fromColor.b)) + ")";
                this._view[key] = offset;
                animator.current = offset;
            }
        }
        this.dispatchEvent("frame", endTime);
    },

    /**
     * Parse and get the color
     * @method Animation#getColor
     * @param {String} color - the color.
     * @private
     */
    getColor: function(color) {
        var rgbReg = /rgb\((\d+),(\d+),(\d+)\)/;
        var rgbaReg = /rgba\((\d+),(\d+),(\d+),(\d+)\)/;
        var shortHexReg = /#([0-9a-f])([0-9a-f])([0-9a-f])/;
        var longHexReg = /#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/;
        var group = null;
        if (/^rgb/.test(color)) {
            group = color.match(rgbReg);
            return {r: parseInt(group[1]), g: parseInt(group[2]), b: parseInt(group[3])};
        } else if (/^rgba/.test(color)) {
            group = color.match(rgbaReg);
            return {r: parseInt(group[1]), g: parseInt(group[2]), b: parseInt(group[3]), a: parseInt(group[4])};
        } else if (/^#/.test(color) && color.length === 4) {
            group = color.match(shortHexReg);
            return {r: parseInt(group[1], 16), g: parseInt(group[2], 16), b: parseInt(group[3], 16)};
        } else if (/^#/.test(color) && color.length === 7) {
            group = color.match(longHexReg);
            return {r: parseInt(group[1], 16), g: parseInt(group[2], 16), b: parseInt(group[3], 16), a: parseInt(group[4], 16)};
        }
    }
}, module);
