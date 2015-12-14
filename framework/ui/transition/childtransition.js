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
        this._appearingAnimation = null;
        this._changeAppearingAnimation = null;
        this._disappearingAnimation = null;
        this._changeDisappearingAnimation = null;
        this._defaultAppearingAnimation = null;
        this._defaultChangeAppearingAnimation = null;
        this._defaultDisappearingAnimation = null;
        this._defaultChangeDisappearingAnimation = null;

        this._appearingDuration = 300;
        this._appearingEasing = "cubic-bezier(0.42, 0, 0.58, 1.0)";
        this._changeAppearingDuration = 300;
        this._changeAppearingEasing = "cubic-bezier(0.42, 0, 0.58, 1.0)";
        this._disappearingDuration = 300;
        this._disappearingEasing = "cubic-bezier(0.42, 0, 0.58, 1.0)";
        this._changeDisappearingDuration = 300;
        this._changeDisappearingEasing = "cubic-bezier(0.42, 0, 0.58, 1.0)";

        this._animationGroup = null;
        this._animationGroupFrameFunc = null;
        this._animationGroupCompleteFunc = null;
        this._animationGroupOthers = null;
        this._animationGroupOthersCompleteFunc = null;
    },

    /**
     * Destructor that destroy this child transition.
     * @method ChildTransition#destroy
     */
    destroy: function() {
        this.stop();
        this._childView = null;
        if (this._defaultAppearingAnimation !== null) {
            this._defaultAppearingAnimation.destroy();
            this._defaultAppearingAnimation = null;
        }
        this._appearingAnimation = null;

        if (this._defaultChangeAppearingAnimation !== null) {
            this._defaultChangeAppearingAnimation.destroy();
            this._defaultChangeAppearingAnimation = null;
        }
        this._changeAppearingAnimation = null;

        if (this._defaultDisappearingAnimation !== null) {
            this._defaultDisappearingAnimation.destroy();
            this._defaultDisappearingAnimation = null;
        }
        this._disappearingAnimation = null;

        if (this._defaultChangeDisappearingAnimation !== null) {
            this._defaultChangeDisappearingAnimation.destroy();
            this._defaultChangeDisappearingAnimation = null;
        }
        this._changeDisappearingAnimation = null;

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
     * Set a custom animation of the specified type for the view.
     * @param {String} type - the specified index.
     * @param {PropertyAnimation} animation - the custom property animation.
     */
    setAnimation: function(type, animation) {
        if (type === "appearing") {
            this._appearingAnimation = animation;
        } else if (type === "change-appearing") {
            this._changeAppearingAnimation = animation;
        } else if (type === "disappearing") {
            this._disappearingAnimation = animation;
        } else if (type === "change-disappearing") {
            this._changeDisappearingAnimation = animation;
        }
    },

    /**
     * Start this child transition.
     * @method ChildTransition#start
     * @protected
     * @override
     */
    start: function() {
        var layout = this._associatedView.layout;

        if (this._action === "add") {
            var originPositions = layout.getOriginPositions();
            originPositions.splice(this._index, 0, {
                left: this._childView.left,
                top: this._childView.top,
                width: this._childView.width,
                height: this._childView.height
            });
            var newPositions = layout.measure(originPositions);

            var length = originPositions.length;
            this._animationGroup = new AnimationGroup();
            this._animationGroup.type = "sequential";
            this._animationGroupOthers = new AnimationGroup();
            this._animationGroupOthers.addEventListener("complete", this._animationGroupOthersCompleteFunc = function() {
                this.dispatchEvent("change");
            }.bind(this));
            this._animationGroupOthers.type = "parallel";
            this._animationGroup.add(this._animationGroupOthers);
            var index = 0;
            for (var i = 0; i < length; i++) {
                if (i !== this._index) {
                    var originPosition = originPositions[i];
                    var newPosition = newPositions[i];

                    var animation = null;
                    if (this._changeAppearingAnimation !== null) {
                        animation = this._changeAppearingAnimation;
                        animation.view = this._associatedView.children[index];
                        animation.from._left = originPosition.left;
                        animation.from._top = originPosition.top;
                        animation.to._left = newPosition.left;
                        animation.to._top = newPosition.top;
                    } else {
                        animation = new PropertyAnimation(this._associatedView.children[index]);
                        index++;
                        animation.from = {
                            _left: originPosition.left,
                            _top: originPosition.top
                        };
                        animation.to = {
                            _left: newPosition.left,
                            _top: newPosition.top
                        };
                        animation.duration = this._changeAppearingDuration;
                        animation.easing = this._changeAppearingEasing;
                        this._defaultChangeAppearingAnimation = animation;
                    }
                    this._animationGroupOthers.add(animation);
                }
            }

            var newPosition = newPositions[this._index];
            var animation = null;
            if (this._appearingAnimation !== null) {
                animation = this._appearingAnimation;
                animation.view = this._childView;
                this._animation = animation;
            } else {
                animation = new PropertyAnimation(this._childView);
                animation.from = {
                    _left: newPosition.left,
                    _top: newPosition.top,
                    _width: 0,
                    _height: 0
                };
                animation.to = {
                    _left: newPosition.left,
                    _top: newPosition.top,
                    _width: newPosition.width,
                    _height: newPosition.height
                };
                animation.duration = this._appearingDuration;
                animation.easing = this._appearingEasing;
                this._defaultAppearingAnimation = animation;
            }
            this._animationGroup.add(animation);
            this._animationGroup.addEventListener("frame", this._animationGroupFrameFunc = function() {
                this._associatedView.invalidate();
            }.bind(this));
            this._animationGroup.addEventListener("complete", this._animationGroupCompleteFunc = function() {
                layout.setNewPositions(newPositions);
                this.stop();
                this.dispatchEvent("complete");
            }.bind(this));

            this._animationGroup.start();
        } else if (this._action === "remove") {

        }
    },

    /**
     * Stop this child transition.
     * @method ChildTransition#stop
     * @protected
     * @override
     */
    stop: function() {
        if (this._animationGroupOthers !== null) {
            this._animationGroupOthers.removeEventListener("complete", this._animationGroupCompleteFunc);
            this._animationGroupOthersCompleteFunc = null;
        }
        if (this._animationGroup !== null) {
            this._animationGroup.removeEventListener("frame", this._animationGroupFrameFunc);
            this._animationGroupFrameFunc = null;
            this._animationGroup.removeEventListener("complete", this._animationGroupCompleteFunc);
            this._animationGroupCompleteFunc = null;
            this._animationGroup.destroy();
            this._animationGroup = null;
        }
    }
}, module);