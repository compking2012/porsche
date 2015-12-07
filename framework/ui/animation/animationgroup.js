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
 * Animation group represents a group of animations that should be played together (sequentially or parallelly).
 * @class AnimationGroup
 * @extends EventEmitter
 */
Class.define("framework.ui.animation.AnimationGroup", EventEmitter, {
    /**
     * Constructor that create an animation group.
     * @method AnimationGroup#initialize
     */
    initialize: function() {
        EventEmitter.prototype.initialize.apply(this, arguments);

        this._animations = [];
        this._type = "parallel";
        this._completed = 0;
        this._animating = false;
        this._paused = false;
        this._animationCompleteFunc = [];
    },

    /**
     * Destructor that destroy this animation group.
     * @method AnimationGroup#destroy
     */
    destroy: function() {
        this._animations = null;
        this._animationCompleteFunc = null;

        EventEmitter.prototype.destroy.apply(this, arguments);
    },

    get animations() {
        return this._animations;
    },

    /**
     * @name AnimationGroup#type
     * @type {String}
     * @description the type of this animation group, either "parallel" or "sequential".
     * "parallel" means all animations start parallelly, while "sequential" means all start sequentially.
     */
    get type() {
        return this._type;
    },

    set type(value) {
        this._type = value;
    },

    /**
     * @name AnimationGroup#animating
     * @type {Boolean}
     * @description indicating whether it is in animating state.
     * @readonly
     */
    get animating() {
        return this._animating;
    },

    /**
     * @name AnimationGroup#paused
     * @type {Boolean}
     * @description indicating whether it is in paused state.
     * @readonly
     */
    get paused() {
        return this._paused;
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
        this._animating = true;
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
        this._animating = false;
    },

    pause: function() {
        var length = this._animations.length;
        for (var i = 0; i < length; i++) {
            this._animations[i].pause();
        }
        this._paused = true;
    },

    resume: function() {
        var length = this._animations.length;
        for (var i = 0; i < length; i++) {
            this._animations[i].resume();
        }
        this._paused = false;
    }
}, module);
