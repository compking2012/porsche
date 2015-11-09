"use strict";
var Class = require("../../class");
var EventEmitter = require("../../eventemitter");
var CubicBezier = require("./cubicbezier");
var SharedTimer = require("./sharedtimer");

Class.define("{Framework}.ui.animation.Animation", EventEmitter, {
    /**
     * Constructor
     * @method Animation#initialize
     */
    initialize: function(view) {
        EventEmitter.prototype.initialize.apply(this, arguments);

        this._view = view;
        this._from = {};
        this._to = {};
        this._duration = 0;
        this._repeat = 1;
        this._easing = "ease";
        this._animating = false;
        this._paused = false;

        this._beziers = CubicBezier.ease();
        this._timer = SharedTimer.getInstance();
        this._iteration = 0;
        this._animators = [];
        this._startTime = 0;
        this._currentTime = 0;
    },

    /**
     * Destructor
     * @method Animation#destroy
     */
    destroy: function() {
        this._view = null;
        this._from = null;
        this._to = null;
        this._beziers.destroy();
        this._beziers = null;
        this._timer.destroy();
        this._timer = null;
        this._animators = null;

        EventEmitter.prototype.destroy.apply(this, arguments);
    },

    get from() {
        return this._from;
    },

    set from(value) {
        this._from = value;
    },

    get to() {
        return this._to;
    },

    set to(value) {
        this._to = value;
    },

    get duration() {
        return this._duration;
    },

    set duration(value) {
        this._duration = value;
    },

    get repeat() {
        return this._repeat;
    },

    set repeat(value) {
        this._repeat = value;
    },

    get easing() {
        return this._easing;
    },

    set easing(value) {
        this._easing = value;
    },

    get animating() {
        return this._animating;
    },

    get paused() {
        return this._paused;
    },

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
                if (this._repeat === 0) {
                    this._startTime = new Date().getTime();
                    remainTime = this._duration;
                    this.dispatchEvent("iteration", this._iteration);
                } else {
                    if (this._iteration < this._repeat) {
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

    stop: function() {
        this._timer.removeTimer(this._onTimerFunc);
        this._animators = [];
        this._currentTime = 0;
        this._startTime = 0;
        this._animating = false;
    },

    pause: function() {
        this._timer.removeTimer(this._onTimerFunc);
        this._animating = false;
        this._paused = true;
    },

    resume: function() {
        this._paused = false;
        this.start();
    },

    animate: function(startTime, time) {
        var delta = this._beziers.getPointForT((time - startTime) / this._duration).y;
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
    },

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
    },

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
