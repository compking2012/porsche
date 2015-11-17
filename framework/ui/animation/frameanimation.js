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

Class.define("framework.ui.animation.FrameAnimation", Animation, {
    /**
     * Constructor
     * @method FrameAnimation#initialize
     */
    initialize: function(/*view*/) {
        this.super.initialize();

        this._frames = {};
    },

    /**
     * Destructor
     * @method FrameAnimation#destroy
     */
    destroy: function() {
        this._frames = null;

        this.super.destroy();
    },

    get frames() {
        return this._frames;
    },

    set frames(value) {
        this._frames = value;
    },

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
                this.animate(0, this._duration);
                this._iteration++;
                if (this._repeat === 0) {
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
            this.animate(0, time);
        }.bind(this), 16);
    },

    stop: function() {
        this._timer.removeTimer(this._onTimerFunc);
        this._animators = [];
        this._currentTime = 0;
        this._animatorIndex = 0;
    },

    pause: function() {

    },

    resume: function() {

    },

    animate: function(startTime, time) {
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
