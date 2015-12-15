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
        this._appearingAnimation = null;
        this._changeAppearingAnimation = null;
        this._disappearingAnimation = null;
        this._changeDisappearingAnimation = null;

        Transition.prototype.destroy.apply(this, arguments);
    },

    /**
     * @name ChildTransition#childView
     * @type {View}
     * @description the manipulated child view.
     */
    get childView() {
        return this._childView;
    },

    set childView(value) {
        this._childView = value;
    },

    /**
     * @name ChildTransition#index
     * @type {Number}
     * @description the index of the child view that is specified for manipulation.
     */
    get index() {
        return this._index;
    },

    set index(value) {
        this._index = value;
    },

    /**
     * @name ChildTransition#action
     * @type {String}
     * @description the action of manipulation, either "add" or "remove".
     */
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
     * @method ChildTransition#setAnimation
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
        if (this._action === "add") {
            this.startAdd();
        } else if (this._action === "remove") {
            this.startRemove();
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
    },

    /**
     * Start the add action transition.
     * @method ChildTransition#startAdd
     * @private
     */
    startAdd: function() {
        var layout = this._associatedView.layout;
        var originPositions = layout.getOriginPositions();
        originPositions.splice(this._index, 0, {
            left: this._childView.left,
            top: this._childView.top,
            width: this._childView.width,
            height: this._childView.height
        });
        var newPositions = layout.measure(originPositions);

        this._animationGroup = new AnimationGroup();
        this._animationGroup.type = "sequential";
        this._animationGroup.addEventListener("frame", this._animationGroupFrameFunc = function() {
            this._associatedView.invalidate();
        }.bind(this));
        this._animationGroup.addEventListener("complete", this._animationGroupCompleteFunc = function() {
            layout.setNewPositions(newPositions);
            this.stop();
            this.dispatchEvent("complete");
        }.bind(this));

        this._animationGroupOthers = new AnimationGroup();
        this._animationGroupOthers.addEventListener("complete", this._animationGroupOthersCompleteFunc = function() {
            this.dispatchEvent("change");
        }.bind(this));
        this._animationGroupOthers.type = "parallel";
        this._animationGroup.add(this._animationGroupOthers);

        var length = originPositions.length;
        var index = 0;
        for (var i = 0; i < length; i++) {
            if (i !== this._index) {
                var originPosition = originPositions[i];
                var newPosition = newPositions[i];

                var animation = null;
                if (this._changeAppearingAnimation !== null) {
                    animation = this._changeAppearingAnimation.clone();
                    animation.view = this._associatedView.children[index];
                    animation.from._left = originPosition.left;
                    animation.from._top = originPosition.top;
                    animation.to._left = newPosition.left;
                    animation.to._top = newPosition.top;
                } else {
                    animation = new PropertyAnimation(this._associatedView.children[index]);
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
                index++;
                this._animationGroupOthers.add(animation);
            }
        }

        var newPosition = newPositions[this._index];
        var animation = null;
        if (this._appearingAnimation !== null) {
            animation = this._appearingAnimation.clone();
            animation.view = this._childView;
            animation.from._left = newPosition.left;
            animation.from._top = newPosition.top;
            animation.to._left = newPosition.left;
            animation.to._top = newPosition.top;
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

        this._animationGroup.start();
    },

    /**
     * Start the remove action transition.
     * @method ChildTransition#startRemove
     * @private
     */
    startRemove: function() {
        var layout = this._associatedView.layout;
        var originPositions = layout.getOriginPositions();
        var originPosition = originPositions[this._index];
        originPositions.splice(this._index, 1);
        var newPositions = layout.measure(originPositions);

        this._animationGroup = new AnimationGroup();
        this._animationGroup.type = "sequential";
        this._animationGroup.addEventListener("frame", this._animationGroupFrameFunc = function() {
            this._associatedView.invalidate();
        }.bind(this));
        this._animationGroup.addEventListener("complete", this._animationGroupCompleteFunc = function() {
            layout.setNewPositions(newPositions);
            this.stop();
            this.dispatchEvent("complete");
        }.bind(this));

        var animation = null;
        if (this._disappearingAnimation !== null) {
            animation = this._disappearingAnimation.clone();
            animation.view = this._childView;
            animation.from._left = originPosition.left;
            animation.from._top = originPosition.top;
            animation.to._left = originPosition.left;
            animation.to._top = originPosition.top;
            this._animation = animation;
        } else {
            animation = new PropertyAnimation(this._childView);
            animation.from = {
                _left: originPosition.left,
                _top: originPosition.top,
                _width: originPosition.width,
                _height: originPosition.height
            };
            animation.to = {
                _left: originPosition.left,
                _top: originPosition.top,
                _width: 0,
                _height: 0
            };
            animation.duration = this._disappearingDuration;
            animation.easing = this._disappearingEasing;
            this._defaultDisappearingAnimation = animation;
        }
        this._animationGroup.add(animation);

        this._animationGroupOthers = new AnimationGroup();
        this._animationGroupOthers.addEventListener("complete", this._animationGroupOthersCompleteFunc = function() {
            this.dispatchEvent("change");
        }.bind(this));
        this._animationGroupOthers.type = "parallel";
        this._animationGroup.add(this._animationGroupOthers);

        var length = this._associatedView.children.length;
        var index = 0;
        for (var i = 0; i < length; i++) {
            if (i !== this._index) {
                var originPosition = originPositions[index];
                var newPosition = newPositions[index];

                var animation = null;
                if (this._changeDisappearingAnimation !== null) {
                    animation = this._changeDisappearingAnimation.clone();
                    animation.view = this._associatedView.children[i];
                    animation.from._left = originPosition.left;
                    animation.from._top = originPosition.top;
                    animation.to._left = newPosition.left;
                    animation.to._top = newPosition.top;
                } else {
                    animation = new PropertyAnimation(this._associatedView.children[i]);
                    animation.from = {
                        _left: originPosition.left,
                        _top: originPosition.top
                    };
                    animation.to = {
                        _left: newPosition.left,
                        _top: newPosition.top
                    };
                    animation.duration = this._changeDisappearingDuration;
                    animation.easing = this._changeDisappearingEasing;
                    this._defaultChangeDisappearingAnimation = animation;
                }
                index++;
                this._animationGroupOthers.add(animation);
            }
        }

        this._animationGroup.start();
    }
}, module);
