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
var Transition = require("./transition");
var PropertyAnimation = require("../animation/propertyanimation");

/**
 * Property transition.
 * @class PropertyTransition
 * @extends Transition
 */
Class.define("framework.ui.transition.PropertyTransition", Transition, {
    /**
     * Constructor that create a property transition.
     * @method PropertyTransition#initialize
     */
    initialize: function(property) {
        Transition.prototype.initialize.apply(this, arguments);

        this._property = property;
        this._from = null;
        this._to = null;
        this._duration = 300;
        this._easing = "cubic-bezier(0.42, 0, 0.58, 1.0)";
        this._animation = null;
        this._animationFrameFunc = null;
        this._animationCompleteFunc = null;
    },

    /**
     * Destructor that destroy this property transition.
     * @method PropertyTransition#destroy
     */
    destroy: function() {
        this.stop();
        this._from = null;
        this._to = null;

        Transition.prototype.destroy.apply(this, arguments);
    },

    /**
     * @name PropertyTransition#property
     * @type {String}
     * @description the property name that applies to this transition.
     */
    get property() {
        return this._property;
    },

    set property(value) {
        this._property = value;
    },

    /**
     * @name PropertyTransition#from
     * @type {Object}
     * @description the start value of this property transition.
     */
    get from() {
        return this._from;
    },

    set from(value) {
        this._from = value;
    },

    /**
     * @name PropertyTransition#to
     * @type {Object}
     * @description the end value of this property transition.
     */
    get to() {
        return this._from;
    },

    set to(value) {
        this._to = value;
    },

    /**
     * @name PropertyTransition#duration
     * @type {Number}
     * @description the duration of this property transition.
     */
    get duration() {
        return this._duration;
    },

    set duration(value) {
        this._duration = value;
    },

    /**
     * @name PropertyTransition#easing
     * @type {String}
     * @description the cubic bezier that will be used on this property transition.
     */
    get easing() {
        return this._easing;
    },

    set easing(value) {
        this._easing = value;
    },

    /**
     * @name PropertyTransition#transiting
     * @type {Boolean}
     * @description indicating whether it is in transiting.
     * @protected
     * @override
     */
    get transiting() {
        if (this._animation === null) {
            return false;
        }

        return this._animation.animating;
    },

    /**
     * Start this property transition.
     * @method PropertyTransition#start
     * @protected
     * @override
     */
    start: function() {
        this._animation = new PropertyAnimation(this._associatedView);
        this._animation.from = {};
        this._animation.from["_" + this._property] = this._from;
        this._animation.to = {};
        this._animation.to["_" + this._property] = this._to;
        this._animation.duration = this._duration;
        this._animation.easing = this._easing;

        this._animation.addEventListener("frame", this._animationFrameFunc = function() {
            this._associatedView.invalidate();
            this.dispatchEvent("frame");
        }.bind(this));
        this._animation.addEventListener("complete", this._animationCompleteFunc = function() {
            this._associatedView[this._property] = this._to;
            this.stop();
            this.dispatchEvent("complete");
        }.bind(this));
        this._animation.start();
    },

    /**
     * Stop this property transition.
     * @method PropertyTransition#stop
     * @protected
     * @override
     */
    stop: function() {
        if (this._animation !== null) {
            this._animation.removeEventListener("frame", this._animationFrameFunc);
            this._animationFrameFunc = null;
            this._animation.removeEventListener("complete", this._animationCompleteFunc);
            this._animationCompleteFunc = null;
            this._animation.destroy();
            this._animation = null;
        }
    }
}, module);

});