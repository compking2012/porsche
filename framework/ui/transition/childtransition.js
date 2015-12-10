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
 * Child transition.
 * @class ChildTransition
 * @extends Transition
 */
Class.define("framework.ui.transition.ChildTransition", Transition, {
    /**
     * Constructor that create a child transition.
     * @method ChildTransition#initialize
     */
    initialize: function() {
        Transition.prototype.initialize.apply(this, arguments);

        this._childView = null;
        this._index = 0;
        this._action = null;
        this._duration = 300;
        this._easing = "cubic-bezier(0.42, 0, 0.58, 1.0)";
        this._animationGroup = null;
        this._animationGroupCompleteFunc = null;
    },

    /**
     * Destructor that destroy this child transition.
     * @method ChildTransition#destroy
     */
    destroy: function() {
        this.stop();
        this._childView = null;

        Transition.prototype.destroy.apply(this, arguments);
    },

    get childView() {
        return this._childView;
    },

    set childView(value) {
        this._childView = value;
    },

    get index() {
        return this._index;
    },

    set index(value) {
        this._index = value;
    },

    get action() {
        return this._action;
    },

    set action(value) {
        this._action = value;
    },

    /**
     * @name ChildTransition#transiting
     * @type {Boolean}
     * @description indicating whether it is in transiting.
     * @protected
     * @override
     */
    get transiting() {
        if (this._animationGroup === null) {
            return false;
        }

        return this._animationGroup.animating;
    },

    /**
     * Start this child transition.
     * @method ChildTransition#start
     * @protected
     * @override
     */
    start: function() {
        if (this._action === "add") {
            var originPositions = this._associatedView.layout.getOriginPositions();
            var newPosition = {
                left: this._childView.left,
                top: this._childView.top,
                width: this._childView.width,
                height: this._childView.height
            };
            originPositions.splice(this._index, 0, newPosition);
            var newPositions = [];

            newPositions = this._associatedView.layout.measure(originPositions);

            var length = originPositions.length;
            this._animationGroup = new AnimationGroup();
            var index = 0;
            for (var i = 0; i < length; i++) {
                if (i !== this._index) {
                    var originPosition = originPositions[i];
                    var newPosition = newPositions[i];

                    var animation = new PropertyAnimation(this._associatedView.children[index]);
                    index++;
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
                    animation.duration = this._duration;
                    animation.easing = this._easing;
                    this._animationGroup.add(animation);
                }
            }
            this._animationGroup.addEventListener("complete", this._animationGroupCompleteFunc = function() {
                var newPosition = newPositions[this._index];
                var animation = new PropertyAnimation(this._childView);
                animation.from = {
                    left: newPosition.left,
                    top: newPosition.top,
                    width: newPosition.width,
                    height: newPosition.height,
                    opacity: 0
                };
                animation.to = {
                    left: newPosition.left,
                    top: newPosition.top,
                    width: newPosition.width,
                    height: newPosition.height,
                    opacity: 1
                };
                animation.duration = this._duration;
                animation.easing = this._easing;
                animation.addEventListener("complete", this._animationCompleteFunc = function() {
                    this.dispatchEvent("complete");
                }.bind(this));
                animation.start();
            }.bind(this));
            this._animationGroup.start();
        }
    },

    /**
     * Stop this child transition.
     * @method ChildTransition#stop
     * @protected
     * @override
     */
    stop: function() {

    }
}, module);
