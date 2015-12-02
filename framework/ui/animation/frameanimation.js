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
var PropertyAnimation = require("./propertyanimation");

/**
 * Frame animation that holds a time/value pair for an animation.
 * This class defines the frames that the animation target will have over the course of the animation.
 * As the time proceeds from one frame to the other, the value of the target object will animate
 * between the value at the previous frame and the value at the next frame.
 * @class FrameAnimation
 * @extends PropertyAnimation
 */
Class.define("framework.ui.animation.FrameAnimation", PropertyAnimation, {
    /**
     * Constructor
     * @method FrameAnimation#initialize
     */
    initialize: function(/*view*/) {
        PropertyAnimation.prototype.initialize.apply(this, arguments);

        this._frames = {};
    },

    /**
     * Destructor
     * @method FrameAnimation#destroy
     */
    destroy: function() {
        this._frames = null;

        PropertyAnimation.prototype.destroy.apply(this, arguments);
    },

    /**
     * @name FrameAnimation#frames
     * @type {Object}
     * @description the frames that plays in this frame animation.
     */
    get frames() {
        return this._frames;
    },

    set frames(value) {
        this._frames = value;
    },

    /**
     * Starts this animation. If the animation has a nonzero delay,
     * the animation will start running after that delay elapses.
     * A non-delayed animation will have its initial value(s) set immediately.
     * @method FrameAnimation#start
     * @protected
     * @override
     */
    start: function() {
        this._beziers = this.getCubicBezier();

        this._animators = [];
        for (var frame in this._frames) {
            if (!this._frames.hasOwnProperty(frame)) {
                continue;
            }
            this._animators.push({
                percent: parseInt(frame) / 100,
                kvpairs: []
            });
            for (var key in this._frames[frame]) {
                if (!this._frames[frame].hasOwnProperty(key)) {
                    continue;
                }
                this._animators[this._animators.length - 1].kvpairs.push({
                    key: key,
                    value: this._frames[frame][key],
                    current: 0
                });
            }
        }
        this._animators.sort(function(a, b) {
            return a.percent - b.percent;
        });

        this._animatorIndex = 0;
        this._startTime = new Date().getTime();
        var remainTime = this._duration - this._currentTime;
        this._timer.addTimer(this._onTimerFunc = function() {
            var time = new Date().getTime() - this._startTime;
            this._currentTime = time;
            if (time > remainTime) {
                this.animate(this._duration);
                this._iteration++;
                if (this._repeat === "infinite") {
                    this._startTime = new Date().getTime();
                    this._animatorIndex = 0;
                    this.dispatchEvent("iteration", this._iteration);
                } else {
                    if (this._iteration < this._repeat) {
                        this._startTime = new Date().getTime();
                        this._animatorIndex = 0;
                        this.dispatchEvent("iteration", this._iteration);
                    } else {
                        this.stop();
                        this.dispatchEvent("complete");
                    }
                }
                return;
            }
            this.animate(time);
        }.bind(this), 16);
    },

    /**
     * Stops this animation. This causes the animation to assign the end value of the property being animated.
     * @method FrameAnimation#stop
     * @protected
     * @override
     */
    stop: function() {
        this._timer.removeTimer(this._onTimerFunc);
        this._animators = [];
        this._currentTime = 0;
        this._animatorIndex = 0;
    },

    /**
     * Pauses a running animation. This method should only be called on which the animation was started.
     * If the animation has not yet been started or has since ended, then the call is ignored.
     * @method FrameAnimation#pause
     * @protected
     * @override
     */
    pause: function() {
        // TODO
    },

    /**
     * Resumes a paused animation, causing the animation to pick up where it left off when it was paused.
     * This method should only be called on which the animation was paused.
     * @method FrameAnimation#resume
     * @protected
     * @override
     */
    resume: function() {
        // TODO
    },

    /**
     * Do the animation.
     * @method FrameAnimation#animate
     * @param {Number} time - the time, in milliseconds.
     * @private
     */
    animate: function(time) {
        if (time / this._duration < this._animators[this._animatorIndex].percent) {
            return;
        }
        var length = this._animators[this._animatorIndex].kvpairs.length;
        for (var i = 0; i < length; i++) {
            var animator = this._animators[this._animatorIndex].kvpairs[i];
            var key = animator.key;
            var value = animator.value;
            this._view[key] = value;
        }

        if (time < this._duration) {
            this._animatorIndex++;
        }
    }
}, module);

});