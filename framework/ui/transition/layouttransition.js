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
var AnimationGroup = require("../animation/animationgroup");
var PropertyAnimation = require("../animation/propertyanimation");

/**
 * Layout transition.
 * @class LayoutTransition
 * @extends Transition
 */
Class.define("framework.ui.transition.LayoutTransition", Transition, {
    /**
     * Constructor that create a layout transition.
     * @method LayoutTransition#initialize
     */
    initialize: function() {
        Transition.prototype.initialize.apply(this, arguments);

        this._from = null;
        this._to = null;
        this._animationGroup = null;
        this._animationGroupCompleteFunc = null;
    },

    /**
     * Destructor that destroy this layout transition.
     * @method LayoutTransition#destroy
     */
    destroy: function() {
        this.stop();
        this._from = null;
        this._to = null;

        Transition.prototype.destroy.apply(this, arguments);
    },

    /**
     * @name LayoutTransition#from
     * @type {Layout}
     * @description the start value of this transition.
     */
    get from() {
        return this._from;
    },

    set from(value) {
        this._from = value;
    },

    /**
     * @name LayoutTransition#to
     * @type {Layout}
     * @description the end value of this transition.
     */
    get to() {
        return this._from;
    },

    set to(value) {
        this._to = value;
    },

    get transiting() {
        if (this._animationGroup === null) {
            return false;
        }

        return this._animationGroup.animating;
    },

    start: function() {
        this.stop();
        var originPositions = this._from.getOriginPositions();
        var newPositions = this._to.measure(originPositions);

        this._animationGroup = new AnimationGroup();
        var length = this._associatedView.children.length;
        for (var i = 0; i < length; i++) {
            var animation = new PropertyAnimation(this._associatedView.children[i]);
            var originPosition = originPositions[i];
            var newPosition = newPositions[i];
            animation.from = {
                left: originPosition.left,
                top: originPosition.top,
                width: originPosition.width,
                height: originPosition.height
            };
            animation.to = {
                left: newPosition.left,
                top: newPosition.top,
                width: newPosition.width,
                height: newPosition.height
            };
            animation.duration = this._defaultDuration;
            animation.easing = this._defaultEasing;
            this._animationGroup.add(animation);
        }
        this._animationGroup.addEventListener("complete", function() {
            this._to.setNewPositions(newPositions);
            this.stop();
        }.bind(this));
        this._animationGroup.start();
    },

    stop: function() {
        if (this._animationGroup !== null) {
            for (var i = 0; i < length; i++) {
                this._animationGroup.animations[i].destroy();
            }
            this._animationGroup.removeEventListener("complete", this._animationGroupCompleteFunc);
            this._animationGroupCompleteFunc = null;
            this._animationGroup.destroy();
            this._animationGroup = null;
        }
    }
}, module);
