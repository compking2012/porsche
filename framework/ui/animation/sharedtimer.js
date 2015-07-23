define(function(require, exports, module) {

"use strict";
var Class = require("../../class");
var YObject = require("../../yobject");

Class.define("framework.ui.animation.SharedTimer", YObject, {
    initialize: function() {
        YObject.prototype.initialize.call(this);

        this.constructor.refCount = 0;
        this._timerQueue = [];
        this._timer = null;
        this._interval = 0;
    },

    destroy: function() {
        this.constructor.refCount--;
        if (this.constructor.refCount > 0) {
            return;
        }
        this._timerQueue = [];
        clearInterval(this._timer);
        YObject.prototype.destroy.call(this);
    },

    addTimer: function(callback, interval) {
        this._timerQueue.push({interval: interval, callback: callback, lastTime: 0});
        if (this._timer === null) {
            this._timer = setInterval(this.onTimer.bind(this), 16);
        }
    },

    removeTimer: function(callback) {
        var i = 0;
        while (this._timerQueue.length > 0 && i < this._timerQueue.length) {
            if (callback === this._timerQueue[i].callback) {
                this._timerQueue.splice(i, 1);
                continue;
            }
            i++;
        }
        if (this._timerQueue.length === 0) {
            clearInterval(this._timer);
            this._timer = null;
        }
    },

    getGCD: function(num1, num2) {
        for (var i = Math.min(num1, num2); i > 0; i--) {
            if (num1 % i === 0 && num2 % i === 0) {
                return i;
            }
        }
    },

    onTimer: function() {
        for (var i = 0; i < this._timerQueue.length; i++) {
            var currentTime = new Date().getTime();
            var diffTime = parseInt((currentTime - this._timerQueue[i].lastTime) / 1000);
            if (true/*diffTime >= this._timerQueue[i].interval*/) {
                this._timerQueue[i].lastTime = currentTime;
                if (this._timerQueue[i].callback) {
                    this._timerQueue[i].callback.call(this);
                }
            }
        }
    }
}, module);

var SharedTimer = module.exports;
SharedTimer.getInstance = function() {
    if (!SharedTimer.instance) {
        SharedTimer.instance = new SharedTimer();
    }
    SharedTimer.refCount++;
    return SharedTimer.instance;
};

});
