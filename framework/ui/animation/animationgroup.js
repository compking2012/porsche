"use strict";
var Class = require("../../class");
var EventEmitter = require("../../eventemitter");

Class.define("{Framework}.ui.animation.AnimationGroup", EventEmitter, {
    /**
     * Constructor
     * @method AnimationGroup#initialize
     */
    initialize: function(view) {
        EventEmitter.prototype.initialize.apply(this, arguments);

        this._animations = [];
        this._view = view;
        this._type = "parallel";
        this._completed = 0;
        this._animationCompleteFunc = [];
    },

    /**
     * Destructor
     * @method AnimationGroup#destroy
     */
    destroy: function() {
        this._animations = null;
        this._view = null;
        this._animationCompleteFunc = null;

        EventEmitter.prototype.destroy.apply(this, arguments);
    },

    get type() {
        return this._type;
    },

    set type(value) {
        this._type = value;
    },

    add: function(animation) {
        this._animations.push(animation);
    },

    remove: function(animation) {
        var index = this._animations.indexOf(animation);
        if (index < 0) {
            return;
        }
        this._animations.splice(index, 1);
    },

    start: function() {
        this._completed = 0;
        if (this._type === "parallel") {
            var length = this._animations.length;
            for (var i = 0; i < length; i++) {
                var animation = this._animations[i];
                animation.addEventListener("complete", this._animationCompleteFunc[i] = function() {
                    this._completed++;
                    if (this._completed === this._animations.length) {
                        this.stop();
                        this.dispatchEvent("complete");
                        return;
                    }
                }.bind(this));
                animation.start();
            }
        } else if (this._type === "sequential") {
            var func = function() {
                var animation = this._animations[this._completed];
                animation.addEventListener("complete", this._animationCompleteFunc[this._completed] = function() {
                    this._completed++;
                    if (this._completed === this._animations.length) {
                        this.stop();
                        this.dispatchEvent("complete");
                        return;
                    }
                    func.call(this);
                }.bind(this));
                animation.start();
            };
            func.call(this);
        }
    },

    stop: function() {
        var length = this._animations.length;
        for (var i = 0; i < length; i++) {
            this._animations[i].removeEventListener("complete", this._animationCompleteFunc[i]);
            this._animationCompleteFunc[i] = null;
            this._animations[i].stop();
        }
        this._animationCompleteFunc = null;
    },

    pause: function() {
        var length = this._animations.length;
        for (var i = 0; i < length; i++) {
            this._animations[i].pause();
        }
    },

    resume: function() {
        var length = this._animations.length;
        for (var i = 0; i < length; i++) {
            this._animations[i].resume();
        }
    }
}, module);
