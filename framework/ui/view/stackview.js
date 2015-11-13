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
var CompositeView = require("./compositeview");
var RelativeLayout = require("../layout/relativelayout");
var CubicBezier = require("../animation/cubicbezier");
var PanRecognizer = require("../gesture/panrecognizer");

/**
 * Stack view
 * @class StackView
 * @extends CompositeView
 */
Class.define("framework.ui.view.StackView", CompositeView, {
    /**
     * Constructor
     * @method StackView#initialize
     */
    initialize: function() {
        CompositeView.prototype.initialize.apply(this, arguments);

        this.layout = new RelativeLayout();
        this.layout.setLayoutParam(0, "align", {left: "parent", top: "parent", right: "parent", bottom: "parent"});
        this.layout.setLayoutParam(0, "margin", {left: 0, top: 0, right: 0, bottom: 0});

        this.addGestureRecognizer(this._panRecognizer = new PanRecognizer({direction: 2 | 4}));
        this.addEventListener("panstart", this._onPanStartFunc = this.onPanStart.bind(this));
        this.addEventListener("panmove", this._onPanMoveFunc = this.onPanMove.bind(this));
        this.addEventListener("panend", this._onPanEndCancelFunc = this.onPanEndCancel.bind(this));
        this.addEventListener("pancancel", this._onPanEndCancelFunc);

        this._duration = 300;
        this._panningTimer = null;
    },

    /**
     * Destructor
     * @method StackView#destroy
     */
    destroy: function() {
        this.stopAutoPan();
        this.removeEventListener("panstart", this._onPanStartFunc);
        this._onPanStartFunc = null;
        this.removeEventListener("panmove", this._onPanMoveFunc);
        this._onPanMoveFunc = null;
        this.removeEventListener("panend", this._onPanEndCancelFunc);
        this.removeEventListener("pancancel", this._onPanEndCancelFunc);
        this._onPanEndCancelFunc = null;
        this.removeGestureRecognizer(this._panRecognizer);
        this._panRecognizer = null;

        CompositeView.prototype.destroy.apply(this, arguments);
    },

    /**
     * The pushChild method will push a view to specified parent view.
     * @method StackView#pushChild
     * @param {View} view sub child view to be pushed on the top of the stack
     */
    pushChild: function(view) {
        if (this._children.length === 0) {
            throw "Should use addChild to add a root view first";
        }
        view.width = this._width;
        view.height = this._height;
        this.addChild(view);
    },

    /**
     * Pops the top view from this stack view.
     * @method StackView#popChild
     * @return {View|null} the top view to pop
     */
    popChild: function() {
        if (this._children.length === 0) {
            throw "Should use addChild to add a root view first";
        }
        if (this._children.length === 1) {
            return null;
        }
        var topChild = this._children[this._children.length - 1];
        this.removeChild(topChild);
        return topChild;
    },

    /**
     * Pops view until the specified view is at the top of the stack.
     * @method StackView#popToChild
     * @param {View} The view that you want to be at the top of the stack. This view must currently be on the stack.
     * @return {View[]|null} An array containing the views that were popped from the stack.
     */
    popToChild: function(view) {
        if (this._children.length === 0) {
            throw "Should use addChild to add a root view first";
        }
        var length = this._children.length;
        var popViews = [];
        var found = false;
        for (var i = length - 1; i >= 0; i--) {
            var child = this._children[i];
            if (child !== view) {
                popViews.push(child);
            } else {
                found = true;
                break;
            }
        }
        if (found) {
            this._children.splice(i + 1, length - i - 1);
            return popViews;
        } else {
            return null;
        }
    },

    /**
     * Pops all the views on the stack except the root view and updates the display.
     * @method StackView#popToRootChild
     * @return {View[]|null} An array of views representing the items that were popped from the stack.
     */
    popToRootChild: function() {
        if (this._children.length === 0) {
            throw "Should use addChild to add a root view first";
        }
        return this.popToChild(this._children[0]);
    },

    paintChildren: function(context) {
        if (this._layout !== null && this._needRelayout) {
            this._layout.perform();
            this._needRelayout = false;
        }
        if (this._children.length === 0) {
            return;
        }

        if (this._panning) {
            if (this._children.length > 1) {
                var nextChild = this._children[this._children.length - 2];
                context.translate(nextChild.left, nextChild.top);
                nextChild.paint(context);
                context.translate(-nextChild.left, -nextChild.top);
            }
        }

        var topChild = this._children[this._children.length - 1];
        context.translate(topChild.left, topChild.top);
        topChild.paint(context);
        context.translate(-topChild.left, -topChild.top);
    },

    onPanStart: function(/*e*/) {
        if (this._children.length === 0) {
            return;
        }
        if (this._children.length === 1) {
            return;
        }
        var topChild = this._children[this._children.length - 1];
        this._startX = topChild.left;
    },

    onPanMove: function(e) {
        if (this._children.length === 0) {
            return;
        }
        if (this._children.length === 1) {
            return;
        }
        var topChild = this._children[this._children.length - 1];
        topChild.left = this._startX + e.deltaX;
        this._panning = true;
    },

    onPanEndCancel: function(/*e*/) {
        if (this._children.length === 0) {
            return;
        }
        if (this._children.length === 1) {
            return;
        }
        var topChild = this._children[this._children.length - 1];
        this.startAutoPan(topChild, topChild.left, this._width);
    },

    startAutoPan: function(view, startX, endX) {
        var startTime = new Date().getTime();
        var beziers = new CubicBezier(0.33, 0.66, 0.66, 1);

        var animationFunc = null;
        this._panningTimer = setTimeout(animationFunc = function() {
            var time = new Date().getTime();
            if (time - startTime >= this._duration) {
                var child = this.popChild();
                if (child !== null) {
                    child.destroy();
                }
                this.stopAutoPan();
                return;
            }
            var delta = beziers.getPointForT((time - startTime) / this._duration).y;
            view.left = startX + delta * (endX - startX);
            this.invalidate();
            this._panningTimer = setTimeout(animationFunc, 10);
        }.bind(this), 10);
    },

    stopAutoPan: function() {
        clearTimeout(this._panningTimer);
        this._panningTimer = null;
        this._panning = false;
        this.invalidate();
    }
}, module);
